# M2 — Registration Preprocessing Stack (Concrete Tool Picks)

> Module-level deep dive following `research/03_registration_dl.md`. Picks
> concrete tools (not just families) for the v1 radiotherapy FM preprocessing
> pipeline: planning-CT + on-treatment CBCT(s) → aligned volumes + displacement
> field as auxiliary input.
> Author: M2 subagent. Date: 2026-05-24.
> Scope: 3D-3D CBCT↔CT only. 2D X-ray-3D deferred (see `03_registration_dl.md`).

---

## TL;DR — recommended stack

| Step | Pick | Fallback | Why |
|---|---|---|---|
| A. Affine / rigid init | **ANTsPy `Rigid` + `Affine` (antsRegistration)** | SimpleITK Elastix rigid+affine; uniGradICON's built-in affine | SynthMorph is brain-only validated (not the universal tool the original survey implied). ANTs is anatomy-agnostic, deterministic, ~30 s CPU, sub-mm on bone, every RT group already trusts it. |
| B. Deformable 3D-3D | **uniGradICON (zero-shot) + IO step**, with **ConvexAdam** as the classical fallback / sanity check on every case | DeedsBCV for abdomen; TransMorph (fine-tuned) for site-specific gains | uniGradICON is the only true *foundation* DL registration with public weights and Apache-2.0 license, and it is competitive (top-5 on L2R-CBCT) without retraining. ConvexAdam beat every DL submission on the OncoReg ThoraxCBCT 2024 test set. Run both; use uniGradICON as primary, keep ConvexAdam DDF as a parallel signal. |
| C. sCT (CBCT→CT) | **SKIP for v1**. Re-evaluate only if a downstream task shows HU-instability hurts performance. | If needed: SynthRAD2023 algorithm-template + a CycleGAN baseline (lxaibl/CycleGAN-CBCT-to-CT) or one of the 2024 diffusion sCT papers (HC3L-Diff) | sCT is a *separate* deliverable with its own validation burden (MAE, gamma pass rate). Adds days of integration and brings hallucination risk. Registration accuracy on raw CBCT is already in the clinically useful regime. |

The single biggest correction vs. the broad-survey recommendation: **drop SynthMorph
as the affine engine.** It is brain-MR specialised. Use ANTs for affine, and treat
uniGradICON as the foundation-style deformable engine — that's where the
"foundation registration" thread actually delivers.

---

## Step A — Affine / Rigid Pre-Alignment

### A.1 Candidate comparison

| Tool | Repo | Last activity | License | Pretrained for CBCT-CT? | Runtime / hardware | Output | Failure modes |
|---|---|---|---|---|---|---|---|
| **SynthMorph (joint affine+deform)** | `voxelmorph/voxelmorph` (dev branch, ~870 commits, active) | 2024-2025 | Apache-2.0 (code) / MIT \| CC-BY-4.0 (weights) | **No.** Weights are brain-MR (shapes + brains variants). 2024 paper explicitly limits scope to brain MRI. | ~8 s/pair V100 deformable | NIfTI warp / SVF velocity field; ITK-compatible | Anything that isn't a brain MR — H&N CT, thorax CBCT, pelvis. Out of distribution. |
| **ANTsPy `antsRegistration`** | `ANTsX/ANTsPy` | Actively maintained (multi-release per year through 2025) | Apache-2.0 | N/A — classical, anatomy-agnostic | Rigid+Affine: 10–60 s CPU per pair on full-res CT (multi-thread). GPU not needed. | ITK transform (`.mat`) and/or displacement field; `ants.apply_transforms` for resampling | Slow on very large volumes; deterministic but sensitive to multi-resolution schedule on truncated CBCT FOV |
| **SimpleITK Elastix** (`itk-elastix`) | `SuperElastix/SimpleElastix` and pypi `itk-elastix` | Active 2024-2025; SciPy 2023 proceedings paper | Apache-2.0 | N/A | Comparable to ANTs on CPU; supports GPU via OpenCL in some builds | ITK transform; B-spline supported natively | Parameter-file zoo; needs tuned `rigid.txt` / `affine.txt`; small init can fail on CBCT-CT |
| **VoxelMorph affine mode** | same repo as SynthMorph | active | Apache-2.0 | Brain-MR weights only; could be retrained on Mayo CT | <1 s/pair on GPU | DDF / affine matrix | Limited generalisation off domain; treated as research-grade for non-brain |
| **DeepReg affine** | `DeepRegNet/DeepReg` | **Stale.** TF2-based, low activity since 2022. | Apache-2.0 | No | <1 s/pair on GPU | DDF | Deprecated relative to MONAI / native PyTorch |
| **MONAI `GlobalNet`** | `Project-MONAI/MONAI` + tutorials | Active (MONAI core releases through 2026) | Apache-2.0 | No pretrained — you train it yourself on your data | <1 s/pair on GPU | Affine params or DDF | Need labelled training data or strong unsupervised loss; not a drop-in solution |

### A.2 Decision

Pick **ANTsPy** (`ants.registration(type_of_transform='Rigid')` then `'Affine'`,
or `'AffineFast'`). Reasons:

1. **SynthMorph's affine head is brain-MR only** — the 2024 paper is explicit.
   For H&N CT, thorax CBCT, pelvis CBCT we'd be running it out of distribution
   with no validated checkpoint.
2. ANTs gives sub-mm/sub-degree alignment on bony anatomy in 30–60 s CPU. The
   FM pipeline is preprocessing-bound by I/O anyway, not by affine compute.
3. Every commercial RT system (Velocity, MIM, ADMIRE, RayStation) is
   benchmarked against ANTs-style affine — reviewers will accept it.
4. ANTsPy returns ITK transforms that compose cleanly with downstream
   uniGradICON or TransMorph DDFs.

If we ever need a learned affine for speed, uniGradICON's CLI already runs an
implicit affine init before deformable, so we get one for free in step B.

### A.3 Failure modes specific to RT

- **Truncated CBCT FOV** — CBCT often misses superior/inferior cone-beam edges.
  ANTs handles this with masks; pass a `mask=` argument carrying the CBCT FOV.
- **Couch / immobilisation devices** in CBCT that aren't in CT — mask them out
  via TotalSegmentator-driven body mask **before** affine.
- **Bowel gas re-distribution** in pelvis/abdomen — affine is fine; the
  problem appears downstream in deformable.

---

## Step B — Deformable 3D-3D (CBCT ↔ CT)

### B.1 Candidate comparison

| Tool | Repo | Last activity | License | Pretrained for CBCT-CT? | Inference (GPU mem, time) | Output | Foundation pretrain? | Failure modes |
|---|---|---|---|---|---|---|---|---|
| **uniGradICON** | `uncbiag/uniGradICON` | 2024 MICCAI release, weights auto-download from GitHub Releases | Apache-2.0 | **Yes — generalises to L2R-CBCT zero-shot** (top-5 perf w/o retraining). Trained jointly across HCP, IXI, OASIS, COPDGene, NLST, L2R-Abdomen, OAI, L2R-CBCT. | ~8–12 GB at 175³, single A100/L40s sufficient; CLI patch-supports larger. ~3–6 s pair zero-shot, ~30 s with IO. | ITK transform OR displacement field via `unigradicon-warp` | **Yes** — first true cross-anatomy foundation registration with public weights | Out-of-domain to **brain CBCT** and **paediatric**; multi-modal CT-MR weaker (use **multiGradICON**) |
| **multiGradICON** | same repo, WBIR 2024 best oral | 2024 | Apache-2.0 | Multimodal extension; covers L2R CT-MR + L2R-CBCT | Same as uniGradICON | Same | Yes | Slightly worse on intra-modality than uniGradICON |
| **TransMorph** (and TransMorph-Bayes/B-spline/diff variants) | `junyuchen245/TransMorph_*` | Active through 2025; Dec-2024 paper "TransMorph + gradient correlation" for L2R-2024 LUMIR | MIT | **No CBCT-CT weights shipped.** IXI / OASIS / brain only. *XCAT-to-CT* mentioned but no public checkpoint. Needs site-specific finetuning. | ~16–24 GB at 224³; can OOM at 256³+ without patching | DDF | No — backbone is Swin-UNet; pretrains exist for brain MR only | Memory blowup on large CBCT; Swin window stride matters; needs careful tiling for >256³ |
| **VoxelMorph (pytorch / dev)** | `voxelmorph/voxelmorph` | Active | Apache-2.0 | No CBCT-CT weights | <4 GB at 192³, <1 s | DDF | No | Baseline-grade; large deformations weak without cascading |
| **DeedsBCV** | `mattiaspaul/deedsBCV` | Maintained, C++ binary | MIT | Used as a **baseline** in OncoReg/ThoraxCBCT (TRE 8.76 mm, Dice 69.0) | CPU only, ~30–60 s/pair multi-core | `_displacements.dat` (control-point grid) + warped NIfTI | N/A | Older keypoint MIND-SSC; TRE worse than ConvexAdam on thorax CBCT |
| **ConvexAdam** | `multimodallearning/convexAdam` | Active; `pip install convexadam` | Apache-2.0 | Used as **organiser baseline**; achieved best overall on OncoReg ThoraxCBCT 2024 (TRE 4.93 mm, Dice 68.4 — ineligible for ranking) | GPU optional (Adam IO); discrete optimisation step is fast — seconds per pair | DDF (NIfTI) | N/A | Self-configuring (1 hr per task), no training. Hand-crafted MIND-SSC features. | Slightly worse Dice than DL models with strong contour supervision; needs anatomy-specific config |
| **CorrField** | `multimodallearning/corrfield` / Grand-Challenge algorithm | Active (used as L2R 2024 baseline) | Apache-2.0 | L2R 2024 baseline — best on CuRIOUS and LungCT, mid-pack on CBCT | Fast, CPU/GPU | DDF | N/A | Discrete optimisation; outperformed by ConvexAdam on ThoraxCBCT |
| **SAMConvex** | `alibaba-damo-academy/samconvex` | MICCAI 2023; v2 update June 2025 | (check repo — Apache/MIT mix typical) | Evaluated on Abdomen CT, HeadNeck CT, Lung CT (CT-CT, not CBCT-CT) | GPU; correlation pyramid; few seconds | DDF | Uses self-supervised SAM features — semi-foundation | Not validated on CBCT directly; HN CT-CT works |
| **PIViT** | `Torbjorn1997/PIViT` | MICCAI 2023, modest follow-on | Research code | No CBCT-CT weights | GPU; Swin-based, iterative | DDF | No | Brain MR + liver CT focus; research-grade |
| **DINO-Reg** | `RPIDIAL/DINO-Reg` | MICCAI 2024; **won OncoReg 2024** (TRE 3.94 mm, Dice 63.89, ensemble) | (check repo) | Training-free; DINOv2 features + ConvexAdam optimisation | DINOv2 inference + ConvexAdam; ~20–40 s/pair on a single GPU | DDF (via ConvexAdam) | DINOv2 is a foundation feature extractor, registration is training-free | Best Dice was poor (~64) despite best TRE — surface alignment can drift |

### B.2 Concrete OncoReg / ThoraxCBCT 2024 leaderboard (test phase, lung CBCT↔FBCT)

| Method | TRE (mm) | DSC (%) | Rank score | Public? |
|---|---|---|---|---|
| **ConvexAdam** (baseline) | **4.93** | 68.40 | 0.710 | Yes (`pip install convexadam`) |
| SynDeeds (1st eligible) | 6.01 | **70.16** | 0.705 | DeedsBCV-derived |
| NiftyReg | 4.90 | 62.11 | 0.577 | Classical, public |
| DeedsBCV | 8.76 | 69.00 | 0.537 | Yes |
| Fourier-Net | 4.03 | 61.91 | 0.535 | Yes (`xi-jia/Fourier-Net`) |

OncoReg Type-3 (multi-task transfer) was won by **DINO-Reg Ensemble** (TRE 3.94 mm,
DSC 63.89, rank 0.71), followed by **Voxelmorph++** (`mattiaspaul/VoxelMorphPlusPlus`).

**Honest takeaway:** for thoracic CBCT, *classical* discrete optimisation
(ConvexAdam, SynDeeds, NiftyReg) is still competitive with or beats the best
deep learning methods. uniGradICON wasn't an OncoReg submission but matches
top-5 L2R-CBCT performance without retraining — so it earns a slot for the
"foundation, no per-site fitting" property, not because it dominates.

### B.3 Decision

**Primary: uniGradICON (zero-shot) with IO step.**
**Secondary (always run for QC): ConvexAdam.**
Flag any pair where uniGradICON DDF and ConvexAdam DDF disagree by > 5 mm
voxel-wise as low-confidence; pass that disagreement to the FM as an
uncertainty channel.

Rationale:
- uniGradICON gives us the *one model, all anatomies* property we want, with
  Apache-2.0 weights and a public CLI. This avoids per-site retraining.
- ConvexAdam is the OncoReg baseline that out-performed every DL submission on
  thorax CBCT — it's the strongest cheap sanity check we have.
- Running both costs ~10 s per pair on a single GPU node. Trivially feasible.

**Defer:** TransMorph (needs site-specific fine-tune, no CBCT-CT weights);
DeedsBCV (slower, worse TRE); SAMConvex (no CBCT validation); PIViT
(research-grade); SynthMorph (brain-only).

### B.4 Per-anatomy notes (very important)

| Site | Primary | Notes |
|---|---|---|
| **Head & Neck** | uniGradICON + IO; ConvexAdam QC | Best-behaved CBCT site (rigid bony anchors, parotid/SMG contour propagation works). Expect Dice >0.85 on parotids, sub-mm TRE on bony landmarks. |
| **Thorax / Lung** | ConvexAdam **primary**; uniGradICON secondary | OncoReg 2024 evidence is unambiguous — classical wins here. Sliding pleura + breathing motion need keypoint-driven methods. Consider DINO-Reg for the hardest cases. |
| **Pelvis** | uniGradICON + IO; ConvexAdam QC | Bladder/rectum filling causes big deformations. Topology preservation matters — use IO with Jacobian penalty. Expect rectum Dice 0.70–0.80, bladder 0.85+. |
| **Abdomen (pancreas, liver)** | DeedsBCV or ConvexAdam | This is the hardest site. Gas-filled bowel and large day-to-day GI changes break DL methods. DeedsBCV historically wins on L2R abdomen task (Dice >50% on 13 small labels including pancreas). uniGradICON degrades here. Consider hybrid: ConvexAdam coarse → uniGradICON IO fine. |

### B.5 Failure modes & RT-specific mitigations

- **Gas-filled bowel (pelvis/abdomen):** any single-DDF method fails. Mitigations: (a) Jacobian determinant penalty, (b) bowel-mask exclusion in the loss (TotalSegmentator can label bowel), (c) Mask-out + topology-preserving SVF integration (uniGradICON's IO step has a switch).
- **Missing FOV in CBCT:** carry a CBCT body mask as a third channel; restrict similarity loss to the masked region; ANTs/Elastix have `mask=` arg, uniGradICON respects ITK mask images.
- **Beam-hardening / scatter artefacts:** MIND-SSC and DINOv2 features are robust to these (which is partly why ConvexAdam and DINO-Reg win on CBCT). Pure NCC-based DL methods (vanilla TransMorph) are more brittle.
- **Large anatomical change (>10 mm shifts, tumour shrinkage):** zero-shot uniGradICON may not converge in a single shot — instance-optimisation step is essential. Always use IO when shifts are expected.

---

## Step C — sCT (CBCT → CT synthesis)

### C.1 Candidate comparison

| Family | Representative | Public code | License | MAE on SynthRAD pelvis (~) | Status |
|---|---|---|---|---|---|
| CycleGAN | `lxaibl/CycleGAN-CBCT-to-CT`; many forks of original Kida 2018 | Yes | varies | ~80–110 HU (pelvis, historical) | Clinical workhorse but hallucination-prone |
| pix2pix (paired) | not a single repo, requires registered CT-CBCT pairs | Yes (assemble) | varies | ~70–95 HU | Higher fidelity if pairs available |
| ViT-CycleGAN | improved-ViT CycleGAN (2024 Scientific Reports) | partial | varies | ~70 HU pelvis | Improvement over baseline CycleGAN |
| Diffusion (cond. score) | HC3L-Diff (arXiv 2411.01575), EqDiff-CT (arXiv 2509.21913), Multi-scale segmentation-guided (Life 2025) | Partial (some repos public) | research code | ~55–70 HU pelvis, best in class | Sharper; slow inference (minutes/volume) |
| **SynthRAD2023 winner — SMU-MedVision** | Reported winner of Task 2 (CBCT-CT) | **Code not public** (challenge participation only) | n/a | ~55 HU pelvis, ~70 HU brain | Best-in-class numbers, but not reproducible from public artifacts |
| SynthRAD2023 algorithm-template | `SynthRAD2023/algorithm-template` | Yes | Apache-2.0 | n/a | Dockerised skeleton — useful starting point, not a model |

### C.2 Decision: skip for v1

Three reasons:

1. **No top-entry SynthRAD weights are public.** SMU-MedVision did not release.
   Reproducing it from scratch is a paper in itself.
2. **CycleGAN-class public models hallucinate.** That's exactly the kind of
   subtle systematic error that erodes trust in a foundation model.
3. **Registration accuracy doesn't need it.** Modern DIR methods (ConvexAdam,
   uniGradICON) handle CBCT artefacts well enough via MIND-SSC / DINOv2
   features. The HU-fidelity argument applies to *dose recomputation*, which
   is a separate downstream task — not preprocessing.

**Re-evaluate sCT if and only if** a downstream FM task (e.g. dose-output
head) shows systematic CBCT-vs-CT performance gap that can be attributed to
HU values, not registration. Then revisit with SynthRAD2025 data + a diffusion
sCT model (HC3L-Diff or EqDiff-CT).

---

## Concrete pipeline sketch

### Inputs
```
patient_id/
  planning/
    CT.nii.gz                    # planning CT, ~512x512x150 @ 1x1x2 mm
    structures.nii.gz            # OAR + GTV/CTV labels (RTSTRUCT-converted)
  fractions/
    fx01/CBCT.nii.gz             # daily/weekly CBCT, ~512x512x80 @ 1x1x3 mm
    fx02/CBCT.nii.gz
    ...
```

### Outputs (what feeds the FM tokenizer)
```
patient_id/aligned/
  CT.nii.gz                      # canonicalised planning CT (resampled, oriented)
  fx01/
    CBCT_aligned.nii.gz          # CBCT warped into planning-CT frame
    ddf_unigradicon.nii.gz       # 3-channel displacement field, mm
    ddf_convexadam.nii.gz        # same, alternative method
    disagreement.nii.gz          # voxel-wise || ddf_unigradicon − ddf_convexadam || (mm), QC channel
    body_mask.nii.gz             # CBCT FOV mask in CT frame
  fx02/...
```

### Python sketch

```python
import ants
import SimpleITK as sitk
import numpy as np
from unigradicon import register_pair  # pip install unigradicon
from convexadam import convex_adam     # pip install convexadam

def preprocess_pair(ct_path, cbct_path, out_dir):
    # --- 0. Load ---
    ct  = ants.image_read(ct_path)
    cbct = ants.image_read(cbct_path)

    # --- 1. Body mask on CBCT (TotalSegmentator preferred; threshold fallback) ---
    cbct_mask = ants.get_mask(cbct, low_thresh=-500, cleanup=2)

    # --- A. Affine: ANTs Rigid → Affine, masked ---
    aff = ants.registration(
        fixed=ct, moving=cbct,
        type_of_transform='AffineFast',
        mask=cbct_mask,
        random_seed=42,
    )
    cbct_aff = aff['warpedmovout']   # CBCT in CT frame, affine only

    # Save affine for audit
    ants.write_transform(ants.read_transform(aff['fwdtransforms'][0]),
                         f'{out_dir}/affine.mat')

    # --- B1. Deformable: uniGradICON zero-shot + IO ---
    # uniGradICON takes ITK images; ANTs<->ITK is trivial
    ddf_uni, warped_uni = register_pair(
        fixed=ants_to_itk(ct),
        moving=ants_to_itk(cbct_aff),
        instance_optimization=True,
        io_iterations=50,
    )
    sitk.WriteImage(ddf_uni, f'{out_dir}/ddf_unigradicon.nii.gz')

    # --- B2. Deformable: ConvexAdam (always, for QC) ---
    ddf_ca = convex_adam(
        fixed=ants_to_itk(ct),
        moving=ants_to_itk(cbct_aff),
        # MIND-SSC features, default self-config
    )
    sitk.WriteImage(ddf_ca, f'{out_dir}/ddf_convexadam.nii.gz')

    # --- C. QC: voxel-wise disagreement, in mm ---
    disagree = np.linalg.norm(
        sitk.GetArrayFromImage(ddf_uni) - sitk.GetArrayFromImage(ddf_ca),
        axis=-1,
    )
    sitk.WriteImage(arr_to_itk(disagree, ddf_uni), f'{out_dir}/disagreement.nii.gz')

    # Median disagreement > 5 mm → flag patient/fraction for human review
    flag = float(np.median(disagree)) > 5.0
    return {'warped': warped_uni, 'flag_for_review': flag}
```

### Bash one-liner (uniGradICON CLI, for ad-hoc QC)

```bash
unigradicon-register \
  --fixed planning_CT.nii.gz \
  --moving CBCT_affined.nii.gz \
  --transform_out transform.h5 \
  --warped_moving_out CBCT_warped.nii.gz \
  --io_iterations 50

unigradicon-warp \
  --moving CBCT_affined.nii.gz \
  --transform transform.h5 \
  --displacement_field_out ddf.nii.gz
```

---

## What we feed the FM tokenizer

For each fraction's CBCT, the FM gets a stack of channels in planning-CT frame:

1. `CBCT_aligned` — intensity (HU-like; not sCT)
2. `ddf_x`, `ddf_y`, `ddf_z` — the displacement vectors (3 channels, mm)
3. `disagreement` — scalar QC channel (1 channel, mm)
4. `body_mask` — binary (1 channel)

Total: **6 channels per fraction**, plus the original CT as a fixed reference.

This gives the FM motion information without forcing it to learn registration.

---

## Pipeline-level fallback ladder

If primary stack fails on a case (disagreement > 5 mm, or IO doesn't converge):

1. Re-run affine with tighter masks (TotalSegmentator body + bowel exclusion).
2. Re-run uniGradICON with more IO iterations (50 → 200).
3. Try DINO-Reg ensemble (slower, ~1 min/pair, but won OncoReg).
4. Try DeedsBCV (specifically for abdominal failures).
5. Manual review / drop the fraction from training cohort.

---

## Honest assessment

- **Classical methods are not obsolete for RT registration.** ConvexAdam,
  DeedsBCV, and NiftyReg are still on or near the OncoReg ThoraxCBCT podium.
  Anyone pitching "DL replaces classical" for adaptive RT is over-claiming.
- **uniGradICON is real.** It's the first DL registration model that legitimately
  generalises across anatomies with public weights and a working CLI. We get
  the "foundation" property for free; we don't need to retrain.
- **SynthMorph is brain-only.** The earlier survey's recommendation to use it
  for affine across all RT sites was an overclaim — it has not been validated
  outside brain MR, and using it on H&N CT or pelvis CBCT puts us out of
  distribution from the published checkpoints.
- **sCT is a distinct project**, not a preprocessing step. Skip in v1.
- **Worst anatomic site:** abdomen with gas-filled bowel. Even DeedsBCV +
  ConvexAdam will fail on the worst 5–10 % of pairs. **Workaround:** down-weight
  abdominal pairs in pretraining, or use a bowel-aware exclusion mask in the
  similarity loss; expose the registration confidence (disagreement) as an
  FM input so it can learn to discount uncertain alignments.

---

## One-line reproducibility checklist

| Item | Status |
|---|---|
| All primary tools pip-installable | yes (`antspyx`, `unigradicon`, `convexadam`, `SimpleITK`) |
| Pretrained weights auto-download | yes for uniGradICON; ConvexAdam needs no weights; ANTs is classical |
| GPU required? | only for uniGradICON+IO and ConvexAdam Adam-IO. Affine + classical are CPU. A single 24 GB GPU is enough for the whole pipeline at typical RT volume sizes. |
| All licenses Apache-2.0 / MIT | yes |
| Deterministic? | ANTs + ConvexAdam yes; uniGradICON IO has slight stochasticity (controllable via seed) |
| Per-pair runtime end-to-end | ~30–90 s on a single A100/L40s node |
