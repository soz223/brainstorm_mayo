# Deep-Learning Image Registration for a Radiotherapy Foundation Model

> Scope: survey 2022-2026 DL registration relevant to RT longitudinal imaging
> (planning CT, CBCT, kV/MV X-ray). Goal: decide whether registration belongs
> *inside* the FM or *beside* it as preprocessing.
> Author: subagent for `radiotherapy_fm/` track. Date: 2026-05-23.

---

## TL;DR

| Sub-task | Maturity | Off-the-shelf usable? | FM-integration value |
|---|---|---|---|
| CBCT ↔ planning CT (3D-3D, deformable) | High for H&N, thorax; medium for abdomen/pelvis (gas, artifacts) | **Yes** — VoxelMorph/TransMorph/SynthMorph variants + commercial (Velocity, MIM, RayStation, ADMIRE) | Low–medium. Best treated as preprocessing or auxiliary task head, **not** as a pretraining objective on its own |
| 2D kV/MV X-ray ↔ planning CT (2D-3D) | Medium. Rigid solved, deformable still active research | **Partial** — vendor IGRT does rigid; deformable 2D-3D from DL is research-grade | Low. Niche, intra-fraction, mostly rigid in clinic |
| Foundation-style registration model | Emerging (uniGradICON, SynthMorph, BrainMorph) | Just barely — works across anatomies/modalities but not RT-tuned | Medium — these *are* the FM candidates for registration, but not the same FM you'd build for prediction/segmentation |
| sCT generation (CBCT→CT) for adaptive RT | Mature (cycle-GAN, diffusion) | **Yes** — multiple FDA-cleared products | Useful as a *separate* head or preprocessing if you want HU-consistent inputs |

**Recommendation:** treat registration as a **preprocessing/orchestration layer
outside the FM**, with optional shallow task-head finetuning for adaptive RT
contour propagation. Folding 2D-3D X-ray registration into the FM core is not
worth the engineering pain in v1.

---

## 1. CBCT ↔ Planning CT (3D-3D Deformable)

### 1.1 Problem characteristics

- CBCT has: scatter, beam hardening, truncation, lower contrast, motion blur,
  bowel gas variation (pelvis/abdomen).
- Daily/weekly CBCTs over 20–35 fractions → many timepoints per patient.
- Clinical needs: (a) dose accumulation, (b) contour propagation for adaptive
  RT, (c) response assessment.
- Required accuracy: target registration error (TRE) ~1–2 mm for H&N/brain,
  2–3 mm acceptable for thorax/pelvis; Dice >0.80 for OARs.

### 1.2 Method landscape (deep learning, 2022–2026)

| Family | Representative | Year | Architecture | Loss | Notes |
|---|---|---|---|---|---|
| CNN unsupervised | VoxelMorph (Balakrishnan '19) | baseline | U-Net regressor → displacement field | NCC + smooth | Still the workhorse; many CBCT-CT papers fine-tune this |
| Transformer | **TransMorph** (Chen et al., MedIA 2022) | 2022 | Swin-UNet encoder + decoder | NCC + diffusion reg | SOTA on many 3D tasks; widely used in RT papers |
| ViT hybrid | **XMorpher** (Shi et al., MICCAI '22) | 2022 | cross-attention between fixed/moving | NCC + Dice (semi-sup) | Strong on multi-organ abdomen |
| Diffeomorphic | LapIRN (Mok '20) → MIDIR | 2022+ | multi-res velocity field | NCC + bending | Topology-preserving — important for OAR contour propagation |
| Synthetic data | **SynthMorph** (Hoffmann, IEEE TMI 2022) | 2022 | trained on synthesized label maps | Dice on synthetic labels | Modality-agnostic; works on CT/CBCT/MR without retraining |
| GradICON / uniGradICON | Tian, Greer et al. 2023–2024 | 2024 | implicit regularization via grad of inverse-consistency | NCC + GradICON | **Single network, many anatomies**; "foundation-like" registration |
| Cascaded / recursive | RCN, DLIR cascades | 2022+ | stack of light networks | NCC + reg | Helps on large CBCT-CT deformation |
| Diffusion-based | DiffuseMorph (Kim '22), DiffuseReg | 2023+ | denoising diffusion outputs flow | score + reg | Improves robustness to artifacts but slow |
| Implicit neural | IDIR, SINR | 2022+ | per-pair MLP optimizing velocity | NCC | Test-time optimization, no training data; competitive when supervision is scarce |
| Hybrid sCT-then-register | pix2pix/CycleGAN sCT → DIR | 2022+ | GAN + classical DIR or VoxelMorph | various | Common pipeline in clinic. Decouples problems |

### 1.3 Public code / models (production-relevant)

- **VoxelMorph** — TF/PyTorch, MIT (voxelmorph/voxelmorph)
- **TransMorph** — PyTorch (junyuchen245/TransMorph_Transformer_for_Medical_Image_Registration)
- **SynthMorph** — modality-agnostic checkpoints; integrated in FreeSurfer
- **uniGradICON** — uncoupled-anatomy registration, public checkpoints (uncbiag/uniGradICON, 2024)
- **MONAI** generic_registration_ddf + GlobalNet/LocalNet
- **DeepReg** (UCL) — full DL registration framework with CBCT examples
- **ANTsPy / elastix / NiftyReg** — non-DL but still SOTA baselines; useful for fallback and evaluation

### 1.4 Benchmarks / datasets

| Dataset | Modality | Region | N | Use |
|---|---|---|---|---|
| **Learn2Reg** (MICCAI challenge, ongoing 2020–2024) | CT, CBCT, MR | multi-site, multi-organ | varies | Standard benchmark; CBCT-CT tasks added in 2022 |
| **L2R Thoracic CBCT** task (2022, 2023) | CBCT-CT | thorax | ~40 pairs | Direct CBCT-CT benchmark with landmarks + masks |
| **SynthRAD2023 / SynthRAD2025** | CBCT-CT, MR-CT | brain, pelvis | ~360 pairs (2023), expanded 2025 | sCT and registration; well-curated, recent |
| **HNSCC-3DCT-RT / RTOG-0522 / HN1** (TCIA) | CT (+ CBCT in some) | H&N | hundreds | Pre-/post-RT registration |
| **4D-Lung / SPARE** | 4DCT / 4DCBCT | thorax | dozens | Phase-to-phase registration, SBRT |
| **EMPIRE10** (legacy) | CT-CT | lung | 30 pairs | Landmark-based TRE evaluation |
| **DIR-Lab** | 4DCT | lung | 10 (300 landmarks each) | Classical TRE benchmark, still cited |
| **Pancreas-CT / PROSTATEx** | CT+ | abdomen/pelvis | hundreds | Inter-fraction adaptive RT proxy |

### 1.5 Current SOTA numbers (representative)

- **Learn2Reg Thoracic CBCT-CT 2023**: top methods reach Dice ≈ 0.80–0.85 on
  large OARs (lungs), TRE ≈ 2.0–3.0 mm on landmarks. Best entries combine
  TransMorph or VoxelMorph with cascaded refinement + instance optimization.
- **SynthRAD2023 (registration sub-task, pelvis)**: best DL methods Dice 0.80+
  on bladder/rectum; still trails for gas-filled bowel.
- **H&N CBCT-CT (HNSCC cohorts, multiple groups 2023–2024)**: Dice 0.85+ on
  parotids, spinal cord; sub-mm TRE for bony landmarks routinely achievable.
- **uniGradICON (2024)**: claims competitive performance across 12 datasets
  without dataset-specific training; not strictly best per dataset but
  *generalizes* — first true "foundation-style" registration evidence.
- **Inference time**: CNN/Transformer DIR networks 1–5 s per pair on a GPU
  vs. minutes for ANTs/elastix.

### 1.6 Key recent papers (2023–2026)

- Chen et al., *TransMorph*, Medical Image Analysis 2022 — the de facto
  transformer baseline.
- Tian, Greer et al., *uniGradICON: A Foundation Model for Medical Image
  Registration*, arXiv 2024.05 (and follow-up multiGradICON) — anatomy-agnostic.
- Hoffmann et al., *SynthMorph*, IEEE TMI 2022 — modality-agnostic via
  synthesis.
- Hering et al., *Learn2Reg: comprehensive multi-task benchmark*, IEEE TMI 2023
  — the canonical benchmark paper.
- Thummerer et al., *SynthRAD2023 Grand Challenge*, Medical Physics 2024 —
  CBCT/MR → sCT and registration benchmark.
- Mok & Chung, *Affine medical image registration with coarse-to-fine vision
  transformer*, CVPR 2022 — affine init for downstream DIR.
- Bharati et al., *Deep learning for medical image registration: a survey*,
  IEEE TMI 2022; Fu et al. survey *Phys Med Biol* 2024 — good reading lists.

### 1.7 Open problems

- **Topology preservation** with large deformations (rectum filling).
- **Sliding interfaces** (lung-pleura, liver-rib).
- **Uncertainty** estimation — clinically critical for adaptive contouring.
- **Evaluation** — Dice on big OARs is too forgiving; TRE landmarks scarce.

---

## 2. 2D X-ray ↔ Planning CT (2D-3D Registration)

### 2.1 Problem characteristics

- kV/MV portal images during treatment delivery, or fluoroscopy/cone-beam
  projections.
- Two flavors: (a) **rigid** 2D-3D pose estimation for setup/IGRT — largely
  solved; (b) **deformable** 2D-3D — under-determined, much harder.
- Classical pipeline: render **DRR** (digitally reconstructed radiograph) from
  the CT for a given pose, compare to the X-ray, optimize.

### 2.2 Method landscape

| Family | Representative | Year | Approach | Notes |
|---|---|---|---|---|
| Intensity-based classical | NGI, MI, gradient correlation + optimizer | pre-2020 | DRR + similarity + Powell/grad-descent | Mature; still production in IGRT |
| Feature-based | landmark/contour matching | varies | extract 2D landmarks, match to 3D | Hard on noisy MV |
| **DeepDRR** (Unberath et al.) | 2018, maintained through 2024 | physically-realistic DRR with scatter/noise via DL | Enables training networks on simulated data; PyTorch package |
| **POINT² / PoseNet-style** | Liao et al., Esteban et al. | 2017–2022 | regress 6-DoF pose from X-ray + DRR | Rigid only |
| **DeepDRR + diff. rendering** | Gao et al., *DiffDRR* 2022 | 2022 | differentiable DRR enables end-to-end gradient-based registration | Strong recent direction |
| **DiffPose / Pragmatic 2D-3D** | Gopalakrishnan et al. 2023 | 2023 | diffusion + diff. rendering for robust 2D-3D | Generalizes across patients |
| **Geometric / projective transformer** | Esteban et al. 2024 | 2024 | transformer with explicit projection geometry | Better OOD pose recovery |
| Learning-based deformable 2D-3D | Foote et al. 2019, recent extensions | 2022+ | regress 3D deformation from biplanar/single X-ray | Highly under-determined; needs strong prior |
| **NeRF/INR-based** | NAF (Zha et al. 2022), SAX-NeRF | 2022+ | implicit 3D from sparse X-ray projections | Reconstruction more than registration, related |

### 2.3 Public code / models

- **DeepDRR** (arcadelab/deepdrr) — well-maintained, supports CT→DRR with
  realistic physics.
- **DiffDRR** (eigenvivek/DiffDRR) — PyTorch differentiable DRR, the new
  standard substrate for DL 2D-3D registration.
- **DiffPose** (eigenvivek/DiffPose) — diffusion-based 6-DoF X-ray → CT pose,
  MICCAI 2023, generalizes across patients.
- **xVertSeg / VerSe / RSNA-Cervical** — not registration but supply paired
  2D X-ray data with CT correspondence for spine.

### 2.4 Benchmarks / datasets

- **Ljubljana 2D-3D registration dataset** — classic, sparse, mostly head.
- **DeepFluoro** (Grupp et al.) — pelvis fluoroscopy with paired CT and ground
  truth pose, ~366 fluoroscopy images. Standard in the DiffPose era.
- **DRR-RATE / DiffPose synthetic sets** — synthetic but realistic.
- **Real RT data**: kV/MV portals + planning CT pairs are usually
  institutional; no large public RT-specific 2D-3D benchmark to date.

### 2.5 Current SOTA numbers

- **Rigid pelvis 2D-3D (DeepFluoro)**: DiffPose / pragmatic diffusion methods
  achieve median translation errors ≈1 mm, rotation ≈1° on in-distribution
  test, degrading on OOD anatomy.
- **Deformable 2D-3D**: no consensus metric; biplanar setups can recover spine
  curvature within a few mm but single-view deformable remains under-determined.
- **In clinic**: vendor IGRT does *rigid* 2D-3D with sub-mm/sub-degree accuracy
  on bony anatomy. Deformable 2D-3D is essentially never done routinely.

### 2.6 Key recent papers

- Gopalakrishnan & Golland, *Fast auto-differentiable digitally reconstructed
  radiographs (DiffDRR)*, MICCAI 2022.
- Gopalakrishnan et al., *Intraoperative 2D/3D image registration via
  differentiable X-ray rendering*, CVPR 2024.
- Grupp et al., *DeepFluoro: A dataset for 2D/3D registration*, IJCARS 2020 +
  follow-ups.
- Esteban et al., *Towards fully automatic 2D-3D registration of vertebrae*,
  IPCAI/IJCARS 2022.
- Unberath et al., *DeepDRR — a catalyst for machine learning in
  fluoroscopy-guided procedures*, MICCAI 2018, sustained citations through
  2025.

### 2.7 Open problems

- Generalization across patients without per-patient fine-tuning.
- Deformable 2D-3D is fundamentally ill-posed without biplanar or temporal
  constraints.
- Lack of paired RT-specific kV/MV ↔ planning-CT benchmarks.

---

## 3. Foundation-Style Registration Networks

This is a 2023–2025 thread worth flagging separately:

| Model | Year | What's "foundation" about it | RT relevance |
|---|---|---|---|
| **SynthMorph** | 2022 | trained on synthesized label maps, modality-agnostic | High — works on CT/CBCT/MR without retraining |
| **BrainMorph** | 2024 | one model for brain across MR contrasts + affine init | Brain RT only |
| **uniGradICON / multiGradICON** | 2024 | one network, many anatomies, gradient-implicit reg | Promising; not RT-tuned yet |
| **AnyStar / SAMReg-style label-driven** | 2024 | leverages SAM/segmentation FMs as registration priors | Cross-modality |
| **TotalSegmentator + classical DIR** (not a model, a pipeline) | 2023+ | use FM segmentation outputs as registration anchors | Very practical for RT |

These are essentially **the foundation models *for* registration**. The
question is whether *your* radiotherapy FM should subsume them or call them.
Evidence so far: subsuming gives no measurable benefit; calling them works.

---

## 4. Could Registration Be a Task Head on a Pretrained 3D Backbone?

Yes, in principle. Examples and prior art:

- **Universal Models** (Liu et al. 2023, Zhang 2024 CLIP-Driven Universal
  Model) treat segmentation as a head on a shared 3D backbone. Registration
  has been done similarly: encode fixed and moving with shared backbone,
  predict DDF from concatenated features.
- **Pretrain-then-register**: MAE-pretrained Swin-UNETR encoders followed by
  TransMorph-style decoders have been shown to converge faster and reach
  slightly higher Dice than from-scratch (several 2023–2024 papers, modest
  gains ~1–2 Dice points).
- **Multi-task FMs** (Med3D, SuPreM, VoCo, Merlin 2024) usually report
  segmentation/classification/report-gen heads; registration as a head is
  *rare* in their evaluation. This is a real gap.
- **Risk** if you bake it in: registration losses (NCC, MSE on warped voxels)
  push the backbone toward intensity-equivariant features, which can fight
  the semantic invariances you want for prediction/segmentation tasks. Most
  groups handle this by freezing the backbone or using a small adapter — at
  which point you're essentially preprocessing again.

**Verdict for radiotherapy_fm:** a registration *head* is feasible and a nice
addition for adaptive RT contour propagation, but it shouldn't shape the
pretraining objective. Treat it as a *downstream* head, not as a *pretext*.

---

## 5. CBCT Image Quality / sCT Synthesis (Brief)

Why it matters: a clean sCT removes a lot of registration pain and is also
required for dose calculation on CBCT.

| Method family | Examples | Notes |
|---|---|---|
| CycleGAN / unpaired GAN | Kida 2018, Maspero 2020, Liang 2021 | Workhorse; many vendor products built on this |
| Paired pix2pix / U-Net | when deformable-registered CT-CBCT pairs available | Higher fidelity, less hallucination |
| Diffusion models | Peng et al. 2023, SynthRAD2023 top entries | Sharper, fewer artifacts; slower inference |
| Score-based / consistency | 2024+ | Faster diffusion variants |
| **SynthRAD2023 / 2025 Challenge** | community benchmark | MAE, PSNR, gamma pass-rate metrics; pelvis + brain |

Clinical products: **Elekta ADMIRE / RayStation Adaptive / Varian Ethos** use
some flavor of DIR + sCT internally; **Siemens syngo.via**, **MIM Maestro**,
**Velocity** offer DIR + propagation. So this is largely a solved/commercial
problem; if you need it, you can integrate an open sCT model (SynthRAD
top-entry code is public) as a preprocessing step.

---

## 6. RT-Relevant Registration Benchmarks (Consolidated)

| Benchmark | Years | Key tasks | Why it matters |
|---|---|---|---|
| **Learn2Reg** | 2020-present | CT-CT, CT-MR, CBCT-CT (since 2022), abdomen/thorax/H&N | Standard MICCAI challenge; ground-truth landmarks |
| **SynthRAD2023 / 2025** | 2023, 2025 | CBCT→sCT, MR→sCT, registration sub-task | Best curated CBCT-CT public data |
| **AAPM Grand Challenges** | yearly | various (e.g., 2024 had thoracic adaptive RT) | RT-physics-grade evaluation |
| **DIR-Lab / EMPIRE10** | legacy | 4DCT lung phase registration | Long-standing TRE benchmarks |
| **4D-Lung / SPARE** | ongoing | 4DCBCT motion estimation | SBRT-relevant |
| **DeepFluoro** | 2020+ | 2D-3D fluoro↔CT pose | Only public 2D-3D dataset of substance |
| **HNSCC-3DCT-RT (TCIA)** | ongoing | H&N CT + sometimes CBCT | Real RT cohort |

---

## 7. Minimum Viable Plan for `radiotherapy_fm/`

### 7.1 Option A — preprocessing pipeline (recommended)

1. **Affine** all imaging to planning-CT space using SynthMorph or a small
   affine net (sub-second, robust, label-free).
2. **Deformable** CBCT→planning-CT via TransMorph or uniGradICON checkpoint,
   optionally refined with classical instance-optimization (ANTs or
   GradICON's IO step). 1–5 s/pair on a GPU.
3. **(Optional) sCT** conversion of CBCT via a SynthRAD-style network if you
   need HU consistency for downstream tasks.
4. **(Optional) X-ray** — only rigid pose recovery via DiffDRR/DiffPose if
   2D imaging is in your dataset at all; skip deformable 2D-3D.
5. Feed warped/aligned volumes + the displacement field as a *channel* into
   the FM. This makes the FM "aware" of motion without learning to register.

**Why:** keeps the FM focused on representation/prediction. Registration is
already well-served by open models; reproducing them inside the FM costs
engineering effort and gives no clear benefit.

### 7.2 Option B — registration head on FM (later, optional)

After Option A is working, *if* the dataset is large enough and contour
propagation is a target downstream task, add a TransMorph-style decoder head
that takes two backbone feature pyramids (fixed, moving) and outputs a DDF.
Train with NCC + Dice (semi-sup) + smoothness. Use this for adaptive RT
contour propagation.

This is a modest-effort extension once the backbone exists. It is **not** a
reason to redesign pretraining.

### 7.3 Option C — fold registration into pretraining (not recommended for v1)

Pros: theoretically unifies motion + structure; could give better longitudinal
representations.
Cons: loss balancing is a research project on its own; topology constraints
and Jacobian regularization don't compose cleanly with masked-modeling or
contrastive pretraining; current evidence says you'd be reinventing
uniGradICON inside your FM for marginal gain.

Reconsider only if (i) you have a clear ablation showing aligned vs unaligned
inputs hurts downstream tasks, *and* (ii) the registration step itself becomes
a publishable contribution.

---

## 8. Bottom-Line Reading List (10 papers if time-constrained)

1. Chen et al., *TransMorph*, MedIA 2022.
2. Hoffmann et al., *SynthMorph*, IEEE TMI 2022.
3. Hering et al., *Learn2Reg benchmark*, IEEE TMI 2023.
4. Tian, Greer et al., *uniGradICON*, arXiv 2024.
5. Thummerer et al., *SynthRAD2023*, Medical Physics 2024.
6. Gopalakrishnan & Golland, *DiffDRR*, MICCAI 2022.
7. Gopalakrishnan et al., *Diff X-ray Rendering for 2D/3D registration*,
   CVPR 2024.
8. Fu et al., *Deep learning in medical image registration: a survey update*,
   Phys Med Biol 2024.
9. Mok & Chung, *Affine ViT registration*, CVPR 2022.
10. Maspero et al., *Deep learning CBCT-to-sCT for adaptive RT* — for the
    image-quality angle, repeatedly updated through 2023.

---

## 9. Honest Assessment

- **DL CBCT-CT 3D-3D registration**: solved enough for production. Multiple
  open models (TransMorph, uniGradICON, SynthMorph) and commercial systems
  give sub-2-mm TRE / Dice >0.80 in H&N and lung. Don't re-invent it.
- **2D X-ray-CT registration**: rigid is solved in the clinic and in
  research (DiffPose, DiffDRR). Deformable 2D-3D from a single view is
  under-determined and is *not* worth folding into a radiotherapy FM. Skip
  unless your dataset truly needs it.
- **Foundation-style registration models exist** (uniGradICON, SynthMorph),
  but they are *separate* foundation models for registration — not the same
  one you'd build for prediction/segmentation/longitudinal reasoning. They
  should be **called**, not **subsumed**.
- **Registration as a task head** is a reasonable v2 extension once the
  longitudinal-3D-FM backbone is trained, especially for adaptive RT contour
  propagation. It does not need to drive pretraining.

**Recommended plan**: preprocessing pipeline (Option A) for v1. Optional
head (Option B) for adaptive-RT downstream eval. Defer / drop Option C.
