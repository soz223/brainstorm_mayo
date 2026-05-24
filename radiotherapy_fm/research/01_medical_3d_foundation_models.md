# 3D Medical Foundation Models — Survey for RT Backbone Selection

**Scope.** Mayo RT project needs a pretrained 3D medical backbone we can freeze / LoRA-tune and attach heads to (OAR seg, registration, dose prediction, outcome). This document surveys the realistic candidates with downloadable weights as of 2026-05. Focus is 2023-2026 work.

**Methodology.** Web searches + GitHub/HuggingFace fetches. Where I could not verify a fact (e.g., specific license or whether weights are actually downloadable without gating), I say so. I am skeptical of "foundation model" claims that are just a single nnUNet on more data.

---

## 1. Quick verdict (read this first)

- **There is no public RT-specific 3D foundation model.** No one has released a model pretrained on planning CT + CBCT + dose + outcomes. RT-focused work is task-specific (dose prediction networks, OAR auto-contour models for one anatomy site). This is a real gap.
- **The strongest general-purpose CT 3D backbones are VoCo, CT-FM, and SuPreM.** All three: open weights, large-scale CT pretraining, MIT/Apache licenses, SwinUNETR/SegResNet/nnUNet variants.
- **3D MRI is much thinner.** Triad (2025) is currently the only credible large-scale MRI pretrained vision encoder, but it is newer / less battle-tested. For MRI you may end up using MedicalNet + Triad + per-modality fine-tune.
- **CBCT has zero foundation-model coverage.** All CBCT work goes through synthetic-CT translation (CycleGAN/Swin) first. This is a research angle for us.
- **Most "FMs" you'll see cited are pure segmentation models in disguise** (TotalSegmentator, nnUNet, Universal Model). They're useful as initialization but they're trained on labels, not at FM scale, and their encoders are not the strongest representation learners. The supervised-vs-SSL comparison in the SuPreM paper is the cleanest evidence here.

---

## 2. Models — main comparison table

| Model | Year | Modalities | Input | Arch | Pretrain data | License | Weights | RT-relevant downstream? |
|---|---|---|---|---|---|---|---|---|
| **VoCo / Large-Scale-Medical** | CVPR 2024 → TPAMI 2025 | CT only | 3D, 96^3 patches (flexible) | SwinUNETR (B/L/H) + nnUNet variant | PreCT-160K (160K CT volumes) | Apache-2.0 | GitHub release; 7 checkpoints 31M–1.2B params | Validated on whole-body seg / tumor seg / classification / registration across 51 datasets. No published RT use, but VoComni includes TotalSegmentator-style organs. |
| **CT-FM** | arXiv 2501.09001 (2025), Harvard AIM | CT only | 3D volumes | SegResEncoder (77M, SimCLR-style) | 148K CT from IDC | MIT | HuggingFace + GitHub | Whole-body seg (117 labels), tumor seg (lung/hepatic/pancreatic), head-CT triage, image retrieval. No explicit RT/OAR work but seg labels overlap with RT OAR set. |
| **SuPreM** | ICLR 2024 oral | CT only | 3D | Swin UNETR (62M), U-Net (19M), SegResNet (4.7M) | AbdomenAtlas 1.1: 9,262 CT, 25 organs + 7 tumor pseudo-labels | (file present; check repo) | GitHub | Supervised pretrain → transfers very well to novel seg classes. Abdominal RT relevance high; H&N not covered. |
| **SAM-Med3D / SAM-Med3D-turbo** | ECCV 2024 oral (BIC) | "Volumetric medical" — CT + MRI + others (SA-Med3D-140K) | 3D + 3D point prompts | ViT-based promptable seg | SA-Med3D-140K (22K volumes, 143K masks, 70 public + 8K private) | Apache-2.0 | GitHub (Google Drive / Baidu) | Promptable seg, including OAR-like tasks. Has been benchmarked on WORD, ACDC, etc. Useful as an *interactive contour assist*, not as a general feature extractor. |
| **Merlin (Stanford MIMI)** | Nature Med 2026 (arXiv 2406.06512) | Abdominal CT + EHR + reports | 3D CT volumes | I3D ResNet + Clinical Longformer (VLM) | 15K paired CT + 1.8M EHR codes + 6M report tokens | MIT | HuggingFace (`stanfordmimi/Merlin`) — includes nnUNet seg head, GPT-2 report-gen head, disease-prediction head | Strong for abdominal CT phenotyping / report generation / disease prediction. Not RT-specific. Useful for outcome prediction head where reports are available. |
| **RadFM** | arXiv 2308.02463 (Nat Comm 2025) | X-ray, CT, MRI, PET (2D + 3D) | 2D + 3D scans + text | Generalist VLM (3D ViT + text decoder) | MedMD: 13M 2D + 615K 3D scans + reports | Open (per repo) | GitHub (chaoyi-wu/RadFM) | Diagnosis, VQA, report-gen, "rationale". Generalist, but optimized for VQA / report-gen, not segmentation. Encoder reusable for downstream heads. |
| **BiomedCLIP** | Microsoft 2023 (NEJM AI) | 2D biomedical (PubMed figure-caption) | 2D | ViT-B/16 + PubMedBERT | PMC-15M (15M image-text from PubMed) | MIT (likely; check) | HuggingFace `microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224` | 2D only — not directly useful for 3D RT, but works well as a per-slice feature extractor (2.5D pipelines). |
| **CT-CLIP / CT-CHAT** | arXiv 2403.17834 (Nat BME 2025) | Chest CT + reports | 3D CT volumes | ViT (vision) + text transformer | CT-RATE: 25,692 chest CTs from 21,304 patients + reports (50K with reconstructions) | Open (check; dataset gated) | GitHub `ibrahimethemhamamci/CT-CLIP` + HF dataset | Zero-shot abnormality detection, case retrieval, VQA via CT-CHAT. Chest-only → relevant for lung RT. |
| **MIS-FM** | arXiv 2306.16925 | CT | 3D | Parallel Conv+Transformer (custom) | 110K unannotated CT | Open | GitHub `openmedlab/MIS-FM` | H&N organs + thoracic / abdominal — already validated for H&N segmentation, which is the most RT-relevant of the candidates. |
| **CLIP-Driven Universal Model** | ICCV 2023 (Liu, Zhou et al.) | CT | 3D | SwinUNETR / UNet / DiNTS + CLIP text labels | 14 datasets, 3,410 CT | (research code) | GitHub `ljwztc/CLIP-Driven-Universal-Model` | Segments 25 organs + 6 tumors. Overlaps with RT OAR set. Strong segmentation baseline; not a general feature extractor. |
| **MedicalNet (Tencent)** | 2019 | Mixed 3D modalities | 3D | 3D ResNet-10/18/34/50/101/152/200 | 23 medical datasets | MIT | GitHub + HuggingFace | Classic 3D backbone. Outdated (small data, supervised) but commonly used as a baseline; widely cited as the "previous-gen" reference. |
| **SwinUNETR-pretrained (MONAI)** | CVPR 2022 | CT | 3D | Swin Transformer encoder | 5,050 public CT (BTCV pretrain) | Apache-2.0 | MONAI tutorials + HF (`darragh/swinunetr-btcv-*`) | Solid pretrained Swin for abdominal CT seg. Smaller scale than VoCo / CT-FM; useful as MONAI-native baseline. |
| **Triad** | arXiv 2502.14064 (2025) | 3D MRI | 3D | Autoencoder (SwinUNETR-compatible, nnUNet-compatible) | Triad-131K (131,170 volumes, 19,721 patients, 36 datasets) | Open | GitHub (per paper) | Demonstrated on seg, classification, registration for MRI. **Currently the strongest open MRI 3D FM.** Important for our MRI follow-up data. |
| **BrainIAC** | Nat Neurosci 2026 (preprint medRxiv 2024) | Brain MRI (multi-sequence) | 3D | SimCLR-based SSL encoder | 48,519 brain MRIs, 35 datasets, 10 conditions, 4 sequences | Open (check) | Author repo | Brain age, dementia, brain cancer prediction. Useful if Mayo has brain-RT cohort. |
| **TotalSegmentator (v2)** | RSNA AI 2023 + arXiv 2208.05868 | CT + MRI (v2) | 3D | nnU-Net | 1,228 CT (v1); extended for v2 + MRI | Apache-2.0 | `pip install totalsegmentator` | 117 anatomic structures incl. many OARs. Not an FM — but the gold standard "off-the-shelf" OAR contour for CT. Should be a baseline in every RT seg head. |
| **MedSAM / MedSAM2** | Nat Comm 2024 / arXiv 2408.00874 | Mostly 2D, MedSAM2 adds 3D-as-video | 2D / 2.5D | SAM ViT-B (+ video for 2D MR/CT stacks in MedSAM2) | ~1.5M masks (MedSAM); video-style 3D extension | Apache-2.0 | GitHub + HF | Promptable 2D seg, MedSAM2 handles 3D volumes as video. 2D-first → weaker than SAM-Med3D for true 3D seg. |
| **Prov-GigaPath** | Nature 2024 | Pathology WSI | 2D tiles + slide aggregation | DINOv2 ViT + LongNet | 1.3B tiles, 171K slides (Providence) | Open (gated) | HF | **Pathology — skip per spec.** |
| **MICLe** | ICCV 2021 (Google) | 2D dermatology / chest X-ray | 2D | SimCLR + multi-instance | ~ImageNet → in-domain | Open | Google research | 2D, dermatology + CXR. Not useful for 3D RT. |
| **TAP-CT** | arXiv 2512.00872 (Dec 2025) | CT | 3D | 6-model family | 105K CT volumes (in-house) | "Published" weights (verify) | per paper | Brand new; not yet community-validated. Worth tracking. |
| **SPECTRE** | 2025, arXiv 2511.17209 | CT | 3D | Transformer (geometry-aware) | scaled CT | Per paper | Per paper | New; two-stage SSL + VL alignment. Tracking. |
| **MedDINOv3** | arXiv 2509.02379 (2025) | 2D CT + MRI slices | 2D | DINOv2 adapted | n/a | Per paper | Per paper | 2D adaptation of DINOv2. Useful for 2.5D RT pipelines. |
| **STAMP (Stochastic Siamese MAE)** | arXiv 2512.23441 (Dec 2025) | OCT, MRI longitudinal | 3D + temporal | ViT MAE Siamese | OCT + MRI multi-visit datasets | Per paper | Per paper | **Explicitly longitudinal pretraining** — closest in spirit to our use case. Validated on disease progression prediction. |
| **Time-to-Event Pretraining (Stanford)** | arXiv 2411.09361 | CT | 3D | (SegResEncoder-like) | 18,945 CTs with EHR time-to-event labels | Per paper | Per paper | Pretraining objective uses survival outcomes — directly aligned with RT outcome prediction. Authors are Stanford MIMI (same group as Merlin). |

---

## 3. Coverage by question

### 3a. Multi-modality (single model handles CT + MRI + CBCT + X-ray)

True multi-modal 3D models with downloadable weights are **rare**:

- **RadFM** is the only "everything" generalist (X-ray, CT, MRI, PET). But it's optimized for report-gen / VQA, not segmentation. Encoder is reusable.
- **SAM-Med3D** is trained across many modalities in its SA-Med3D-140K (CT, MRI dominant) — closest to a single seg model that "just works" across modalities, but it's prompt-driven.
- **Foundation Model for Whole-Heart Segmentation** (arXiv 2503.19005) does CT + MRI joint pretraining via xLSTM; new, niche.

Everything else is **single-modality**: VoCo (CT), CT-FM (CT), SuPreM (CT), Triad (MRI), BrainIAC (brain MRI), CT-CLIP (chest CT).

**Realistic plan for Mayo:** pick CT FM + MRI FM separately, share late-stage heads. Not one encoder for everything.

### 3b. RT-specific pretrained models

**None at FM scale.** What exists:

- **OAR auto-contouring** is well solved per-site (H&N 3D U-Net, prostate, breast). All bespoke nnUNets / U-Nets.
- **Dose prediction**: DoseDiff (diffusion), RADIANT (modular framework), Seg2Dose, Swin UNETR++. All task-specific, no shared pretraining.
- **CBCT**: synthetic-CT translation (Res U-Net, SwinUNETR-based) — but no pretrained CBCT representation model.
- **RT outcome prediction**: scattered radiomics+DL papers, no foundation model.

This is consistent with the team's pragmatic plan: there is no "RT-FM" to skip our work — building one (even via task-head approach on top of an existing CT/MRI backbone) is novel.

### 3c. Longitudinal / multi-timepoint support

This is the largest gap in mainstream FMs. Almost all listed models take a single volume.

- **STAMP** (Dec 2025) — Siamese MAE on temporally paired volumes. Closest to what we need; OCT + MRI, not RT, but the *recipe* is reusable.
- **Time-to-Event Pretraining** (Stanford, Nov 2024) — pretrains with survival outcomes as supervision, not multi-timepoint inputs per se, but conceptually aligned.
- **Merlin** uses paired CT + EHR but single timepoint.
- Every CT/MRI FM in the table can in principle be wrapped with a temporal aggregator (transformer over per-timepoint embeddings, or registration-aligned 4D input) — this is what we'd build.

### 3d. Landmines (models that look attractive but aren't reusable as backbones)

- **TotalSegmentator** — superb tool, but it's a single nnUNet for fixed labels. The encoder is not a general representation; using it as a backbone is suboptimal vs. VoCo/CT-FM.
- **MedSAM / MedSAM2** — 2D-first. The "3D" mode in MedSAM2 is slice-by-slice as video. Don't pick this as a 3D backbone.
- **BiomedCLIP** — 2D only. Useful for per-slice features in a 2.5D pipeline, not as a 3D encoder.
- **MICLe** — 2D, dermatology + CXR. Irrelevant for our 3D RT use case.
- **Universal Model (CLIP-driven)** — segmentation model, not a general FM. License is "research code"; commercial use unclear (matters for Mayo).
- **MedicalNet** — old (2019), supervised, small data. SuPreM's own ablation shows this class of model is dominated by modern SSL.
- **RadFM** — looks like the dream "generalist" but in practice the 3D encoder was trained jointly with VQA / report-gen objectives. Reusing the visual encoder for dense seg / registration is non-trivial; community has done little of this.
- **Merlin** — abdominal-CT focused; head and neck / thorax / pelvis RT cohorts won't benefit directly. nnUNet head is for liver/lesion, not OAR.
- **CT-CLIP** — chest-only. If we have lung RT cohort, useful; otherwise narrow.

---

## 4. Shortlist — top 3 backbones for the Mayo RT use case

Ranked for "we want to freeze / LoRA-tune and bolt heads for OAR seg, registration, dose prediction, outcome — on planning CT + follow-up MRI/CT/CBCT — at Mayo Clinic scale."

### #1 — VoCo (Large-Scale-Medical, Luffy03 / TPAMI 2025)

**Why:**
- Largest open 3D CT pretrain (160K volumes, vs. CT-FM's 148K and SuPreM's 9K).
- SwinUNETR backbone — compatible with MONAI / nnUNet ecosystems, drop-in for seg / registration heads.
- 7 weight sizes (31M → 1.2B params) — lets us scale from prototype to flagship.
- Apache-2.0 — clean for clinical research and (eventually) commercial.
- Validated on 51 downstream tasks including seg + registration + classification. Geometric context priors objective is well-suited to anatomy-aware tasks (RT is fundamentally anatomy-aware).
- "VoComni" pre-finetuned variant gives us a TotalSegmentator-like organ-aware initialization.

**Risks:** CT only — MRI/CBCT need a different backbone. Some checkpoints are large; HF mirror unclear.

### #2 — CT-FM (Harvard AIM / project-lighter)

**Why:**
- Harvard MGH track record + clear engineering: HF-hosted weights, MIT license, SegResEncoder 77M (compact and fast for clinical inference).
- 148K CT IDC pretrain via SimCLR. Validated on whole-body seg (117 anatomy labels — covers most CT OARs), tumor seg (lung, hepatic, pancreatic), retrieval.
- IDC data is publicly traceable, easier for IRB / Mayo provenance review than mixed in-house sources.
- Lighter than VoCo (one ~77M model vs. 7 variants) — faster onboarding.

**Risks:** SegResNet-style encoder is less "fashionable" than Swin/ViT — some downstream heads (e.g., registration via cross-attention) may need adaptation. No reported RT validation, though OAR coverage is implicit in the 117-label seg head.

### #3 — Triad (for the MRI side) + SuPreM (for abdominal CT) — tied / use case dependent

**Triad** (arXiv 2502.14064, 2025): only credible 131K-volume MRI 3D FM. We *will* have MRI follow-up; this is essentially the only choice if we don't want to retrain from scratch on Mayo MRI. SwinUNETR-compatible, demonstrated on seg + classification + registration. Brand new — small community footprint, expect rough edges.

**SuPreM** (ICLR 2024 oral): smaller pretrain (9K CT) but *supervised* with 25 organ labels — the ablations in their paper show this transfers better than SSL on label-scarce downstream tasks. If our outcome / dose-prediction heads have small label sets, SuPreM is a smart fallback CT backbone. Especially strong for abdominal RT.

---

## 5. What to do next (operational)

1. **Pull and benchmark** VoCo-B (53M), VoCo-L (206M), CT-FM (77M), SuPreM Swin-UNETR (62M) on a Mayo H&N OAR cohort (DSC + HD95). Frozen backbone + linear/UNETR-decoder head; LoRA-tune second.
2. **Pull Triad** for any MRI follow-up cohort task. If access issues, fall back to MedicalNet ResNet-50 (older but reliable).
3. **Use TotalSegmentator v2** as a strict baseline contour generator on every RT-CT — this is the bar to beat.
4. **For longitudinal**: don't pretrain from scratch. Wrap chosen backbone with a temporal transformer; copy the STAMP recipe (Siamese MAE on Mayo's paired planning-CT + first-CBCT pairs).
5. **CBCT**: no FM exists. Either (a) synthetic-CT via Swin CycleGAN then feed planning-CT backbone, or (b) fine-tune the CT backbone with a small CBCT contrastive run. This is a publishable contribution.
6. **Document a no-go list**: TotalSegmentator-as-backbone, MedSAM2-as-3D-encoder, MedicalNet-as-primary — these are common mistakes in the literature, we should avoid.

---

## 6. References (paper + repo per model)

- **VoCo / Large-Scale-Medical** — arXiv 2402.17300 / TPAMI 2025 — https://github.com/Luffy03/Large-Scale-Medical
- **CT-FM** — arXiv 2501.09001 — https://github.com/project-lighter/CT-FM — https://aim.mgh.harvard.edu/ct-fm
- **SuPreM** — ICLR 2024 oral — https://github.com/MrGiovanni/SuPreM
- **SAM-Med3D** — arXiv 2310.15161 / ECCV 2024 — https://github.com/uni-medical/SAM-Med3D
- **Merlin** — arXiv 2406.06512 / Nature Med 2026 — https://huggingface.co/stanfordmimi/Merlin — https://github.com/StanfordMIMI/Merlin
- **RadFM** — arXiv 2308.02463 / Nat Comm 2025 — https://chaoyi-wu.github.io/RadFM/
- **BiomedCLIP** — arXiv 2303.00915 — https://huggingface.co/microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224
- **CT-CLIP / CT-RATE** — arXiv 2403.17834 / Nat BME 2025 — https://github.com/ibrahimethemhamamci/CT-CLIP — https://huggingface.co/datasets/ibrahimhamamci/CT-RATE
- **MIS-FM** — arXiv 2306.16925 — https://github.com/openmedlab/MIS-FM
- **CLIP-Driven Universal Model** — ICCV 2023 — https://github.com/ljwztc/CLIP-Driven-Universal-Model
- **MedicalNet** — Med3D 2019 — https://github.com/Tencent/MedicalNet
- **SwinUNETR pretrained (MONAI)** — CVPR 2022 — https://github.com/Project-MONAI/research-contributions/tree/main/SwinUNETR/BTCV
- **Triad** — arXiv 2502.14064 (2025) — repo per paper
- **BrainIAC** — Nat Neurosci 2026 / medRxiv 2024.12.02.24317992
- **TotalSegmentator** — arXiv 2208.05868 / RSNA AI 2023 — https://github.com/wasserth/TotalSegmentator
- **MedSAM / MedSAM2** — Nat Comm 2024 / arXiv 2408.00874
- **MICLe** — arXiv 2101.05224 (Big SSL Med Img Classification, ICCV 2021)
- **STAMP (Siamese MAE longitudinal)** — arXiv 2512.23441 (Dec 2025)
- **Time-to-Event Pretraining** — arXiv 2411.09361 (Stanford, Nov 2024)
- **TAP-CT** — arXiv 2512.00872 (Dec 2025)
- **SPECTRE** — arXiv 2511.17209 (2025)
- **MedDINOv3** — arXiv 2509.02379 (2025)
- **SAM for Radiation Oncology (eval)** — arXiv 2306.11730
- **3D SAM Progressive Prompting for RT-induced injuries** — arXiv 2604.13367
- **DoseDiff** — arXiv 2306.16324
- **RADIANT** — medRxiv 2025.06.20.25330029
- **Swin UNETR++ for dose prediction** — arXiv 2311.06572
