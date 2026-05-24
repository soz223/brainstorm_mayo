# M1 — Pretrained 3D CT/CBCT Backbone for Mayo RT-FM

**Scope.** Deep technical comparison of pretrained 3D CT (and CBCT-capable) foundation-model backbones that we could freeze / LoRA-tune and reuse as the shared encoder for: lesion seg, OAR seg, dose prediction, replan classification, outcome prediction.

**Method.** Web + GitHub + HuggingFace verification (May 2026). Repo activity checked via GitHub API. License files inspected verbatim. Where a number is paper-claimed I tag it; where I could not verify I say "not documented".

**Headline.** Two clean choices. **VoCo (TPAMI 2025) is the primary pick.** **CT-FM is the fallback.** **SuPreM is dropped on license grounds** (see §3 — CC-BY-NC-ND, not usable). Triad enters the picture only when MRI is in the loop. Plus four 2025-2026 contenders I had not properly checked before: SPECTRE, Google CT-Foundation, FM-CT (NYU head-only), Merlin.

---

## 1. Per-candidate deep dive

### 1.1 VoCo / Large-Scale-Medical (TPAMI 2025, Luffy03)

| Field | Value |
|---|---|
| Repo | https://github.com/Luffy03/Large-Scale-Medical |
| HF weights | https://huggingface.co/Luffy503/VoCo |
| Last push | 2026-04-09 (active, 265 stars, 2 open issues) |
| License | **Apache 2.0** — clean for clinical & commercial |
| Pretraining corpus | **PreCT-160K** — 160K CT volumes, 42M slices, multiple institutions |
| Modalities | CT only (planning-CT compatible; **CBCT not in corpus**) |
| Architecture | SwinUNETR v2 (B/L/H) + an nnUNet variant |
| Checkpoints (on HF) | VoCo_B_SSL_head.pt **220 MB** (53M), VoCo_L_SSL_head.pt **856 MB** (206M), VoCo_H_SSL_head.pt **3.4 GB** (818M); VoComni_B **299 MB** (72M), VoComni_L **1.17 GB** (290M), VoComni_H **4.65 GB** (1.2B); VoComni_nnunet **125 MB** (31M) |
| Input | Default ROI 96×96×96 (configurable; SwinUNETR uses 32× patch — works at 96/128/160/192) |
| Embedding dim | feature_size 48 / 96 / 192 for B/L/H (i.e. final stage = 48·8=384 / 96·8=768 / 192·8=1536) |
| Pretraining objective | **Volume Contrastive (VoCo)** — geometric context priors via spatially-arranged positive/negative crops. **Anatomy-aware contrastive**, not MAE. This is a good fit for RT where geometry/anatomy is the signal. |
| Reported downstream | 50+ tasks across seg / class / registration. VoComni explicitly trained with TotalSegmentator-style pseudo-labels (20 organ + tumor classes) → very RT-OAR-compatible. Specific Dice numbers in the paper, not on README. |
| MONAI integration | **First-class**. Loads directly into `monai.networks.nets.SwinUNETR(img_size=…, feature_size=…, use_v2=True)` with a one-liner `load(model, torch.load(ckpt))`. Their `load(...)` helper handles key prefix mismatches. |
| LoRA-friendliness | **Excellent**. Standard SwinUNETR → MSA blocks have nameable `qkv` / `proj` linear layers. `peft.LoraConfig(target_modules=["qkv","proj"])` works out of the box. |
| Memory (96³ patch, B/L/H) | ~6 / ~12 / ~28 GB at batch=1 fp16 (estimated from SwinUNETR-v2 norms); H model only realistic on A100/H100. |
| Gotchas | (a) Pretrained on rectified-spacing CT; CBCT will need synthetic-CT or domain-adaptive fine-tune. (b) NLST dataset extraction has an open issue (#37) — but this is dataset acquisition, not weights. (c) Some "discrepancies between paper and source code" closed in #30. |
| Author claim | "Load and fine-tune" — strongly emphasizes the omni-organ initialization (VoComni) for fastest adaptation. |

**Verdict.** This is the strongest open 3D CT backbone today. SwinUNETR base means everything in the MONAI/nnUNet/PEFT toolchain works.

---

### 1.2 CT-FM (Harvard AIM / project-lighter, arXiv 2501.09001)

| Field | Value |
|---|---|
| Repo | https://github.com/project-lighter/CT-FM |
| HF | https://huggingface.co/project-lighter/ct_fm_feature_extractor (32k downloads/mo); also `ct_fm_segresnet`, `whole_body_segmentation` |
| Last push | 2026-04-22 (active, 68 stars, 4 open issues) |
| License | **MIT** — clean |
| Pretraining corpus | 148K CT volumes from Imaging Data Commons (publicly traceable; good for IRB) |
| Modalities | CT only |
| Architecture | **SegResEncoder (3D conv U-Net encoder), ~77M params**. **No self-attention.** |
| Input | Not strictly fixed; preprocessing pipeline crops foreground, uses spacing-normalized input. Empirically used at ~160³ patches. |
| Embedding dim | 512 after `adaptive_avg_pool3d` (per HF model card) |
| Pretraining objective | Contrastive SSL (SimCLR-style on volume views) |
| Reported downstream | Whole-body seg **mean Dice 0.898** on TotalSegmentator (117 labels), tumor seg on MSD lung/hepatic/pancreatic, head-CT triage **F1 0.776 / 0.754**, retrieval (top precision on 3D-MIR), anatomical clustering |
| MONAI integration | **Clean**. `SegResEncoder.from_pretrained("project-lighter/ct_fm_feature_extractor")` via `lighter_zoo`. MONAI transforms compose cleanly. |
| LoRA-friendliness | **Poor for standard LoRA**. SegResEncoder is pure conv — no Q/K/V to inject into. Options: (a) IA³ on conv outputs, (b) conv-LoRA (low-rank conv factorization), (c) adapter blocks between stages, (d) full fine-tune of the encoder. Decision: this is the single biggest cost vs. VoCo. |
| Memory (160³, fp16) | ~8 GB at batch=1 (estimated; SegResNet is conv-heavy but memory-efficient) |
| Gotchas | **Issue #38 ("Low validation Dice during CT-FM fine-tuning") is open with no maintainer response.** A user reports ~0.15 lesion Dice during 4-GPU DDP fine-tune. Either user error or a real fine-tuning recipe gap; either way it warns us to budget time for fine-tuning experiments. |
| Author claim | "Load and use" — model card shows out-of-box feature extraction for retrieval / clustering. Fine-tuning narrative is thinner. |

**Verdict.** Excellent if we want clean MIT license, IDC-provenance pretraining, and small-model deployment. **The pure-conv encoder hurts** when our agenda explicitly says "freeze + LoRA-tune" — LoRA was designed for attention. Still my fallback.

---

### 1.3 SuPreM (ICLR 2024 oral, MrGiovanni / JHU)

| Field | Value |
|---|---|
| Repo | https://github.com/MrGiovanni/SuPreM |
| HF | https://huggingface.co/MrGiovanni/SuPreM (17 checkpoints, 6.89 GB total) |
| Last push | 2026-01-13 (somewhat stale, 417 stars, 13 open issues incl. #21 "Fine-tune" still open) |
| License | **CC-BY-NC-ND 4.0** — **NON-COMMERCIAL + NO-DERIVATIVES**. License text reads: "© The Johns Hopkins University. This work is openly licensed via CC BY-NC-ND. Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Public License." |
| Pretraining corpus | AbdomenAtlas 1.1: 9,262 CT, 25 organs + 7 tumor pseudo-labels — **abdomen-only** |
| Architecture | Swin UNETR (62.19M), U-Net (19.08M), SegResNet (4.70M). Notable checkpoints: `supervised_suprem_swinunetr_2100.pth` (759 MB), `supervised_suprem_unet_2100.pth` (233 MB), `supervised_suprem_segresnet_2100.pth` (56.5 MB) |
| Pretraining objective | **Supervised** with pseudo-labels (25 organ + 7 tumor); paper shows this beats SSL when label-scarce downstream tasks. |
| Reported downstream | TotalSegmentator organ/muscle/vertebrae/cardiac/rib; pancreas tumor detection (JHH dataset). Numbers strong but abdomen-skewed. |
| MONAI integration | Drop-in into MONAI SwinUNETR; the repo provides explicit loader scripts. |
| LoRA | Same as VoCo — SwinUNETR base, friendly to PEFT. |
| **License blocker** | **NoDerivatives clauses cover fine-tuning derivatives**. Mayo cannot LoRA-tune a CC-BY-NC-ND model and clinically deploy / publish the derivative without violating the license. NonCommercial blocks any clinical commercialization. **This rules SuPreM out of our pipeline.** |

**Verdict.** Technically excellent. **Licensing kills it for our use case.** Worth a short footnote citation as a baseline; do not build on it.

> **Skeptic check.** SuPreM is essentially a *pretrained nnUNet / SwinUNETR via supervised label expansion*. The paper sells the "less data + supervised > more data + SSL" finding, but on small downstream sets only. It is not an FM in the sense we want (the encoder generalizes weakly to non-abdomen sites). License aside, SuPreM is more "strong segmentation init" than "general representation".

---

### 1.4 Triad (MRI, arXiv 2502.14064, wangshansong1)

| Field | Value |
|---|---|
| Repo | https://github.com/wangshansong1/Triad |
| Last push | 2026-03-10 (active, 51 stars, 4 open issues) |
| License | **None declared** (GitHub `license: null`). The paper says "open-sourcing weights, code, and data" but a missing repo license is a legal red flag — treat as research-only until clarified. |
| Pretraining corpus | Triad-131K: 131,170 MRI volumes, 19,721 patients, 36 datasets — currently the largest open MRI pretraining corpus |
| Modalities | MRI multi-sequence |
| Architecture | (i) PlainConvUNet (nnUNet-style), (ii) SwinB — both released with MAE and SimMIM objectives = 4 checkpoints total |
| Weights | Google Drive: `Triad-PlainConvUNet-MAE.pth`, `Triad-PlainConvUNet-SimMIM.pth`, `Triad-SwinB-MAE.pth`, `Triad-SwinB-SimMIM.pth` (sizes not published) |
| Pretraining objective | MAE and SimMIM — both reconstruction-based |
| Reported downstream | Seg / classification / registration on MRI; **SwinUNETR-Triad +4.00% over SwinUNETR-scratch on registration** |
| MONAI integration | Authors note "SwinUNETR-compatible, nnUNet-compatible". A QuickStart.py is provided. Not as clean as MONAI's first-party loaders, but should be a one-evening port. |
| LoRA | SwinB variant has standard attention layout → LoRA-friendly. PlainConvUNet variant is pure conv → same caveat as CT-FM. |

**Verdict.** **Only choice** if we want to bring MRI follow-ups into the same FM. Use the SwinB-MAE checkpoint. Note the license gap and document it for Mayo legal.

---

### 1.5 SPECTRE (arXiv 2511.17209, 2025)

Brand new, fully transformer (local + global), DINO-style self-distillation + SigLIP vision-language alignment with paired reports, trained exclusively on openly available CT datasets. Authors claim it beats prior CT FMs in zero-shot and fine-tuned settings. **Weights/repo not located** — no GitHub link in the paper. License badge CC-BY 4.0 on arXiv (paper), not weights. **Action: track; do not build on it yet.**

---

### 1.6 FM-CT (NYU, headCT_foundation)

Repo https://github.com/NYUMedML/headCT_foundation, last push 2026-04-22. Pretrained on **361,663 non-contrast head CTs**, 3D ViT, demonstrated on ICH, tumor detection, multi-label diagnosis, retrieval. **Weights are GATED**: "Due to the possibility of inferring private patient facial features … public release of the model weights is not permitted. Requests must be directed to corresponding authors and NYU's DataSharing@nyulangone.org." For our timeline this is a non-starter. **Skip.**

---

### 1.7 Google CT-Foundation (Health AI Research, Oct 2024)

https://github.com/Google-Health/imaging-research/tree/master/ct-foundation. Pretrained on **527,078 CT studies + reports, 430,772 patients, 3 hospital regions**. Hosted as an **API-only embeddings service** (no weights download — you call a Google endpoint and get back vectors). Validated on lung cancer ID, AAA, ICH, calcifications, urolithiasis, abdominal lesions. **Not usable as a freezable / LoRA-tunable backbone**; it's an embedding API, not a downloadable model. **Skip for our use case** but worth as a strong inference-only baseline if Mayo legal allows third-party API on PHI (probably not).

---

### 1.8 Merlin (Stanford MIMI)

HF `stanfordmimi/Merlin`, MIT, I3D ResNet + Clinical Longformer VLM, **abdominal CT only**, 15K CT + EHR + reports. Includes nnUNet seg head, GPT-2 report-gen head, disease-prediction head. **CT-only, abdomen-only**, paired with reports — perfect for report-conditioned outcome prediction in abdominal RT, but not a general 3D backbone. **Use as auxiliary, not primary.**

---

### 1.9 MIS-FM (OpenMedLab)

Apache-2.0, two checkpoints (`fmunet_abk1k_volf.pt`, `pctnet_ct10k_volf.pt`) on Google Drive. PCT-Net (hybrid CNN+Transformer) on 110K CT. README only highlights left-atrial seg (90.71 → 91.80 DSC with pretrain). Less polished, smaller corpus than VoCo/CT-FM, no clear H&N results despite earlier survey claims. **Drop unless we hit a specific gap.**

---

## 2. Comparison table

| Model | License | Pretrain N (CT) | Params | Arch | LoRA-friendly | MONAI | Active? | Verdict |
|---|---|---|---|---|---|---|---|---|
| **VoCo** | Apache-2.0 | 160K | 53M–1.2B | SwinUNETR v2 | Yes (Q/K/V) | First-class | Yes (push 2026-04) | **Primary** |
| **CT-FM** | MIT | 148K | 77M | SegResEncoder (conv) | Weak (need conv-LoRA / IA³) | Clean | Yes (push 2026-04) | Fallback |
| **SuPreM** | **CC-BY-NC-ND** | 9K (abdomen) | 4.7M–62M | Swin/UNet/SegResNet | Yes | Drop-in | Stale (push 2026-01) | **Dropped — license** |
| Triad (MRI) | None declared | 131K MRI | SwinB / PlainConvUNet | Mixed | Yes for Swin variant | Manual port | Yes (push 2026-03) | MRI-only role |
| SPECTRE | CC-BY 4.0 (paper) | "scaled" CT | Transformer | Yes | Unknown | n/a (no weights) | n/a | Track |
| Google CT-FM | API-only | 527K | n/a (closed) | ViT | No (API) | No | Yes (Google) | Skip |
| FM-CT (NYU) | Gated | 361K head CT | 3D ViT | Yes | Manual | Yes | Yes | Skip (gated) |
| Merlin | MIT | 15K abdomen + reports | I3D ResNet + Longformer | Partial | Yes (text side) | Custom | Yes | Auxiliary |
| MIS-FM | Apache-2.0 | 110K | PCT-Net | Partial | Manual | No | Quiet | Drop |

---

## 3. Recommendation

**Primary: VoCo-L (`VoComni_L.pt`, 290M params, 1.17 GB).**

Justification (concrete, not vibes):

1. **License is clean.** Apache 2.0 → derivatives allowed (LoRA-tuned variants are derivatives), commercial path open. SuPreM's CC-BY-NC-ND blocks both. (License files inspected verbatim.)
2. **Architecture is LoRA-native.** SwinUNETR v2 has nameable Q/K/V projections → `peft.LoraConfig(target_modules=["qkv","proj"])` works straight out of the box. CT-FM (SegResNet, pure conv) does not.
3. **Drop-in MONAI loader** — exact same SwinUNETR class we'd use for downstream segmentation heads. No custom plumbing for any of: lesion seg, OAR seg, dose pred (decoder swap), classification, embedding extraction.
4. **VoComni initialization** already encodes 20 organ + tumor categories (TotalSegmentator-style) → first-week OAR results will be competitive without any RT-specific data, giving us a real baseline fast.
5. **Pretraining objective (Volume Contrastive with geometric priors)** is *anatomy-aware*. RT is fundamentally anatomy-aware (geometric relationships between OARs, target, dose). MAE/SimMIM models (Triad, SPECTRE-style) emphasize texture reconstruction — less aligned with our downstream geometry-heavy tasks.
6. **Scale ladder.** We can prototype on VoCo-B (53M, 220 MB), validate on VoCo-L (206M, 856 MB), and have a clear path to VoCo-H (818M, 3.4 GB) if scale helps. CT-FM, SuPreM each give a single size.
7. **Repo is alive** (push 2026-04-09, 265 stars, 2 open issues) and the maintainer is the first author.

**Fallback: CT-FM `ct_fm_feature_extractor` (SegResEncoder, 77M, MIT).**

Reasons to keep CT-FM in reserve:
- If Mayo legal flags any provenance issue with VoCo's PreCT-160K mix of sources, CT-FM's pretraining is 100% IDC (publicly traceable, NIH-funded).
- If we need a smaller, conv-only model for edge / on-prem GPU constraints, CT-FM is half the size and conv-only.
- If our embedding-retrieval head (for replan classification or case retrieval) becomes a primary task, CT-FM is explicitly engineered for it (`adaptive_avg_pool3d` → 512-d).

**Conditional add: Triad SwinB-MAE — only when MRI data is in scope.** Apply as a parallel MRI encoder; share late-stage heads.

**Do not build on:** SuPreM (license), FM-CT (gated), Google CT-FM (API), MIS-FM (small footprint), SPECTRE (no weights yet), MedicalNet (outdated), TotalSegmentator (decoder, not a representation).

**The one thing that could derail VoCo:** Mayo IRB / legal flags PreCT-160K's mixed institutional provenance. The 160K corpus aggregates many public CT datasets — most are open, but if any subset has a covenant against use in commercial derivatives, our Apache 2.0 weight license does not retroactively launder the data lineage. **Action item M1-A:** before committing engineering effort, get the PreCT-160K source-list (it's in the paper / supplementary) and run it past Mayo data-use compliance. If this blocks, swap to CT-FM (IDC-only provenance, no covenant ambiguity).

**CBCT.** No FM in this list was pretrained on CBCT. The least-bad approaches, in order:
1. Synthetic-CT translation (Swin CycleGAN) → feed VoCo. Decoupled, swappable, publishable as the "CBCT bridge" contribution.
2. Domain-adaptive continued pretraining: take Mayo's CBCT cohort, run a short VoCo-style contrastive on it starting from VoComni_L. This is itself a publishable contribution and the most defensible RT-FM angle.
3. Plain fine-tune VoCo with CBCT inputs and accept the domain gap. Worst option, only as a sanity baseline.

---

## 4. First-week integration test (5 lines)

```python
# Verify VoCo loads, accepts an RT-sized 3D patch, produces sensible embeddings.
import torch
from monai.networks.nets import SwinUNETR

model = SwinUNETR(img_size=(96,96,96), in_channels=1, out_channels=14,
                  feature_size=96, use_v2=True)              # VoCo-L geometry
sd = torch.load("VoComni_L.pt", map_location="cpu")
msg = model.load_state_dict(sd, strict=False)                # expect a few decoder-head mismatches; encoder keys must all match
print("missing:", len(msg.missing_keys), "unexpected:", len(msg.unexpected_keys))
with torch.inference_mode():
    z = model.swinViT(torch.randn(1,1,96,96,96))[-1]         # deepest feature map; shape ~ (1, 768, 3, 3, 3) for VoCo-L
print(z.shape, z.std().item())                                # std > 0.1 means weights actually loaded, not random init
```

**Pass criteria:**
- `missing_keys` only on decoder/head; **zero unexpected encoder keys**.
- `z.shape == (1, 768, 3, 3, 3)` for VoCo-L (feature_size=96 → final stage 96·8=768, 96/32=3).
- `z.std() > 0.1` on a noise input — a randomly-init Swin gives ~0.01–0.03; a pretrained one gives ~0.2–0.6.
- Repeat with two real planning CTs of the same patient at different timepoints → cosine similarity of their pooled embeddings should be > 0.85 (same-patient anatomy should be near in feature space).

Then the same script with `VoCo_L_SSL_head.pt` (encoder-only SSL checkpoint) to confirm we can also load the SSL-only weights for downstream tasks that don't want any decoder bias.

---

## 5. Open questions for M1 follow-up

- (M1-A) PreCT-160K provenance audit for Mayo data-use compliance.
- (M1-B) Empirical LoRA target-module map for SwinUNETR v2 — confirm `qkv`, `proj`, and optionally `mlp.fc1/fc2` are the right injection points on the actual checkpoint (verify by `model.named_modules()`).
- (M1-C) Memory benchmarks at 96³ / 128³ / 160³ / 192³ on the GPUs Mayo can realistically allocate, for B / L / H sizes; pin the largest size that fits batch=2 with gradient checkpointing.
- (M1-D) Light continued-pretraining experiment on Mayo planning-CT cohort starting from VoComni_L — 1–5% accuracy on downstream is enough to justify it; >10% is a publishable RT-domain-adapt result.
- (M1-E) Decision on Triad SwinB-MAE: either we commit to a parallel MRI encoder or we drop MRI from the FM scope. Don't half-do it.

---

## 6. References

- VoCo / Large-Scale-Medical — arXiv 2410.09890 / TPAMI 2025 — https://github.com/Luffy03/Large-Scale-Medical — https://huggingface.co/Luffy503/VoCo
- CT-FM — arXiv 2501.09001 — https://github.com/project-lighter/CT-FM — https://huggingface.co/project-lighter/ct_fm_feature_extractor
- SuPreM — ICLR 2024 — https://github.com/MrGiovanni/SuPreM — https://huggingface.co/MrGiovanni/SuPreM — LICENSE: CC-BY-NC-ND 4.0
- Triad — arXiv 2502.14064 — https://github.com/wangshansong1/Triad
- SPECTRE — arXiv 2511.17209 (no weights yet)
- FM-CT — NYU, https://github.com/NYUMedML/headCT_foundation (gated weights)
- Google CT-Foundation — https://github.com/Google-Health/imaging-research/tree/master/ct-foundation (API only)
- Merlin — https://huggingface.co/stanfordmimi/Merlin
- MIS-FM — https://github.com/openmedlab/MIS-FM
