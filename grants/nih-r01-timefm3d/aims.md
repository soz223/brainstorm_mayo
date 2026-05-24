# NIH R01 — Specific Aims (Draft v0.1, 2026-05-22)

**Project Title**: TimeFM-3D: A Pan-Organ, Multi-Modality Longitudinal 3D Imaging Foundation Model for Disease Trajectory Modeling

**Principal Investigator**: [PI name]  · Mayo Clinic
**Mechanism**: NIH R01 (proposed primary IC: NIBIB; dual-assign NIA / NCI)

---

## Specific Aims (1 page)

Medical decisions are rarely made from a single scan. Radiologists routinely compare a new study to one or more priors — to decide if a nodule grew, a lesion responded, a brain atrophied, or a tumor recurred. **Yet every published medical imaging foundation model — CT-FM, BrainIAC, M3FM, Merlin, BiomedCLIP — encodes each 3D volume independently and discards the temporal axis that clinical practice depends on.** Multi-timepoint imaging is already the dominant clinical workflow: NLST acquired three annual lung CTs per participant for 26K individuals; ADNI / OASIS-3 / AIBL have collected a decade of repeat brain MRI on tens of thousands of subjects; oncology trials routinely produce 4–8 follow-up CT/MRI per patient. **No foundation model today natively ingests an irregularly-sampled sequence of 3D volumes per patient at scale.** This gap leaves change detection, progression prediction, and time-to-event tasks dependent on bespoke single-organ pipelines (Sybil for lung; SSL-AD for brain) that do not transfer.

**Long-term goal**: Build a generalizable 3D imaging foundation model whose representations encode **patient-specific disease trajectory** and transfer across organs, modalities, and diseases.

**Central hypothesis**: Self-supervised pretraining on multi-timepoint 3D volumes with irregular Δt — using interval-aware masked modeling, latent next-volume prediction, and cross-modal temporal contrast — will yield representations that significantly outperform single-timepoint foundation models on clinically meaningful longitudinal tasks across CT, MRI, and PET.

We will test this hypothesis through three integrated Specific Aims:

### Aim 1 — Curate a pan-organ, multimodal longitudinal pretraining corpus
Assemble and harmonize ≥30,000 patients with ≥2 timepoints spanning CT, MRI, and PET: NLST (lung CT, n≈26K, 3 yearly screens), ADNI / OASIS-3 / AIBL / NACC-SCAN (brain MRI + amyloid/tau PET), Yale-Brain-Mets-Longitudinal and LUMIERE (glioma MRI, multi-timepoint), Anti-PD-1 Lung / Melanoma and HNSCC (treatment-response CT and head-neck CT/PET). **Output**: a harmonized BIDS-style manifest with continuous Δt, modality and body-region tags, per-modality intensity normalization (HU windowing for CT, z-score for MRI, SUV for PET), and intra-patient cross-timepoint rigid co-registration. **Deliverable**: open curation pipeline (released after IRB / DUA review).

### Aim 2 — Develop and pretrain the TimeFM-3D architecture with three temporal SSL objectives
Build a longitudinal 3D foundation model with three components: (i) a per-volume 3D encoder (ViT or SwinUNETR, initialized from CT-FM); (ii) **continuous-time positional encoding** of Δt via Fourier features (Time2Vec); (iii) a **Δt-aware Temporal Transformer** that attends across a patient's volume sequence. Pretrain jointly on three self-supervised objectives:
- **IA-MVM** — Interval-Aware Masked Volume Modeling, reconstructing masked voxels conditioned on Δt;
- **NVP-LS** — Next-Volume Prediction in Latent Space, with horizon Δt as input;
- **CMTC / TPC** — Cross-Modal Temporal Contrast between paired CT/MRI/PET at matched timepoints (CMTC) or Temporal-Patient Contrast as an image-only fallback (TPC).

Pretraining: 20×NVIDIA H200 GPUs, ~2 weeks for prototype; ~6 weeks at full scale.

### Aim 3 — Evaluate TimeFM-3D on longitudinal downstream tasks across organs
Benchmark fine-tuned and linear-probe performance against single-scan foundation models (CT-FM, BrainIAC, M3FM, Merlin) and task-specific baselines (Sybil for NLST, SSL-AD for ADNI):
- **Brain MRI** — AD conversion within 24 months (ADNI), glioma progression (Brain-Tumor-Progression);
- **Lung CT** — 1- to 6-year lung cancer risk (NLST, Sybil head-to-head);
- **Oncology CT/MRI** — RECIST treatment response (Anti-PD-1, HNSCC);
- **Time-to-event** — cancer-specific mortality, AD diagnosis (concordance index, integrated Brier score).

**Pre-registered primary endpoint**: TimeFM-3D achieves ≥3% absolute AUC / C-index improvement over the strongest single-scan baseline on the majority of longitudinal tasks (≥5/7 with p<0.05 after Benjamini–Hochberg correction).

### Payoff
Successful completion yields **the first pan-organ, pan-modality longitudinal 3D imaging foundation model**, with released weights, curation pipeline, and benchmark suite. This establishes a community baseline for trajectory-aware medical imaging and directly enables follow-on translational work in screening (NCI), neurodegeneration (NIA), and treatment-response monitoring (NIBIB).
