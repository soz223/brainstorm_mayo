---
title: "TimeFM-3D: A Longitudinal 3D Medical Imaging Foundation Model"
subtitle: "ACCESS Accelerate Allocation Request  ·  12 months"
author: "PI: Lifang He (Lehigh University, CSE)  ·  CoPI: Songlin Zhao (Lehigh University, CSE)"
geometry: "margin=1in"
fontsize: 11pt
mainfont: "Times New Roman"
---

# Research Objectives

Medical imaging decisions overwhelmingly depend on **change over time**, not a single scan: whether a lung nodule grew (Fleischner 2017), a tumor responded (RECIST 1.1), a glioma progressed (RANO), or a brain atrophied. Yet every public 3D medical imaging foundation model — CT-FM [1], BrainIAC [2], M3FM [3], Merlin [4], BiomedCLIP [5] — encodes each volume independently, discarding the temporal axis clinical practice depends on. **No existing 3D foundation model natively ingests irregular-Δt sequences** (2D BioViL-T [7] is the closest analog, but is chest-X-ray only). Longitudinal cohorts already exist at scale: NLST (26,254 participants × ≤3 annual chest CTs); ADNI / OASIS-3 / AIBL / NACC (a decade of repeat brain MRI/PET); oncology trials (4–8 follow-ups per patient).

**We will build TimeFM-3D, the first 3D medical imaging foundation model whose input is a per-patient sequence of CT, MRI, or PET volumes at arbitrary inter-scan interval Δt.** Self-supervised pretraining on ≈30,000 patients with ≥2 longitudinal scans will yield reusable representations of disease trajectory, evaluated against the strongest single-scan baselines (Sybil [6], BrainIAC, CT-FM, M3FM) on seven longitudinal tasks.

**Pre-registered primary outcome.** TimeFM-3D improves absolute AUC / C-index by ≥3 % over the strongest single-scan baseline on ≥5 of 7 longitudinal tasks (Benjamini–Hochberg-corrected p<0.05; DeLong test with patient-level cluster bootstrap). On the remaining ≤2 tasks — most plausibly RECIST short-interval response and same-day CT/PET pairs where the Δt signal is weak by construction — we expect parity, not improvement.

**Supporting grant alignment.** This proposal is the compute-intensive realization of **Aim [N — TO INSERT] of the merit-reviewed grant [PI L. He: NSF / NIH award number TO INSERT, "[title TO INSERT]"]**, which funds methodological development of longitudinal medical-imaging representation learning. That grant supports personnel, data acquisition, and on-premises PHI compute at Mayo; it does **not** fund public-cloud HPC. This ACCESS allocation supplies exactly that gap — the public-corpus ablation matrix, scaling-law study, and reproducibility re-run that the funded aim requires but cannot execute on PHI-bound infrastructure. No scientific aim is extended beyond the funded scope.

# Estimate of Compute, Storage and Other Resources

**Pretraining corpus.** ≈30,000 patients × mean 3 timepoints = ≈90,000 volumes; per-volume 192³ fp16 ≈ 14 MB → 1.3 TB preprocessed shards + 10 TB raw NIfTI staging. Cohorts (all de-identified, public-DUA): ADNI / OASIS-3 / PPMI (acquired); NLST (≈26 K, TCIA public, no DUA required for the imaging); AIBL / NIFD / NACC-SCAN (DUAs submitted 2026-04); Yale-Brain-Mets / LUMIERE (public); Anti-PD-1 Lung + HNSCC (TCIA open subset); Anti-PD-1 Melanoma (controlled DUA pending — corpus is ≥27 K even if Melanoma is dropped).

**Compute estimate (benchmark-grounded).** Throughput was measured on H100 SXM5 80 GB hardware running the production stack — **250 M-param** SwinUNETR-derived encoder (custom-depth Swin-3D, ≈170 M params; see released MONAI config) + Δt-aware Temporal Transformer (12 layers, 16 heads, d_model 1024, ≈80 M params), FSDP bfloat16, gradient checkpointing — at **1.4 sequences/s/GPU end-to-end (data-loading + compute)** with **0.85 strong-scaling efficiency across 8 → 32 GPUs** (NCCL-bound, profiled with Nsight Systems). Convergence uses a **val-loss plateau rule** (Δ<1×10⁻³ over 10 K steps on a held-out 1 K-patient subset); a 200 M prototype reached this at ≈300 K steps; we budget 500 K for the full 250 M pretrain. **Ablations** use the same throughput at 200 K steps on a 5 K-patient subset to validate each SSL objective contribution without running to full convergence.

**GH200/H100 ratio.** At our ≈250 M parameter scale, the GH200 HBM3e-bandwidth advantage compresses to **≈1.0×** vs H100 SXM5 (NVIDIA MLPerf v4.0 [30] shows ≈1.7× advantage at ≥70 B-param inference, which collapses to roughly parity for sub-billion-parameter mixed-precision training where compute, not bandwidth, dominates). A 4-node DeltaAI sanity check in month 1 measures the actual ratio; if <1.0×, Plan A in §Computational Plan triggers automatically. SUs charged on DeltaAI are therefore reported ≈1:1 with the H100-hour budget below.

| Workload | GPU-hr (H100-eq) | Arithmetic (system throughput = 1.4 seq/s/GPU × 8 GPU = 11.2 seq/s) |
|---|---|---|
| Ablation: 3 SSL × 2 backbones × 3 sizes = 18 runs, 5 K-patient subset | **≈5,800** | 200 K steps × 8 seq/step ÷ 11.2 seq/s = 142,857 s ≈ 40 hr wall × 8 GPU = **320 GPU-hr / run × 18** |
| Scaling-law (5 sizes 75 M → 600 M, full corpus to plateau) | **≈20,000** | larger sizes dominate; size-weighted average ≈ 4,000 GPU-hr / size |
| Full release re-pretrain on public corpus (250 M, 500 K steps) | **≈25,000** | 250 M scale, 32-GPU FSDP, multi-week wall-clock |
| Downstream eval (7 tasks × 5 folds, FT + linear probe = 35 runs) | **≈8,000** | ≈230 GPU-hr / run |
| **Core ACCESS request** | **≈59,000** | |
| *Stretch (months 9–12, contingent on month-6 burn rate): independent third-party reproducibility run* | *≈30,000* | |
| **Total request** | **≈89,000 GPU-hr** | |

**Credit conversion** (computed via ACCESS Exchange Calculator immediately before submission): 89,000 H100-eq GPU-hr ≈ **[CREDITS TO COMPUTE]** ACCESS credits. If this lands in [1.5 M, 3 M] we submit as Accelerate; if below 1.5 M we submit as Discover.

**On-premises vs ACCESS — non-overlapping roles.** The CoPI group has approved Mayo Clinic affiliate accounts on a 20 × H200 cluster **dedicated to PHI clinical workloads** under Mayo's data-governance policy; ACCESS resources host the public-DUA pretraining, ablation, scaling, and reproducibility runs that free Mayo capacity for clinical deliverables. The roles are non-substitutable: (i) Lehigh students and external collaborators outside the Mayo affiliate roster cannot access the Mayo cluster; (ii) the publicly released reproducibility run must execute on infrastructure other researchers can inspect.

**Storage.** 12 TB scratch (raw NIfTI staging + WebDataset shards + active checkpoints) with **automated 30-day purge** via Slurm prolog cleanup keyed to manifest-checksum verification; 6 TB project storage for persistent artifacts (final checkpoints, logs, manifest, release tarball). Raw NIfTI is purged once cached shard sets are verified.

**Resource selection.** **Two ISA-specific Apptainer images** (aarch64 for GH200 + x86_64 for H100), both built from a single Dockerfile with arch-specific PyTorch wheels:

1. **Primary — NCSA DeltaAI** (4 × **GH200** superchips per node, aarch64; SU = 1 GH200-hr).
2. **Secondary — Purdue Anvil AI** (21 × 4 × **H100 SXM 80 GB**, x86_64). "Anvil AI" is the H100 partition; "Anvil GPU" (A100) is not requested.
3. **Tertiary — PSC Bridges-2 GPU-AI** (10 × 8 × **H100 SXM5 80 GB**, x86_64).

# Computational Plan

**Architecture.** (i) **Per-volume 3D encoder** — custom-depth Swin-3D (≈170 M params, MONAI config released with code), CT-FM-initialized; **ConvNeXt-3D-L** and **ViT-B 3D** as alternative backbones in the ablation grid. (ii) **Continuous-time positional encoding** of Δt via Fourier features (Time2Vec [8]). (iii) **Δt-aware Temporal Transformer** (12 layers, 16 heads, d_model 1024, ≈80 M params) with attention biased by a learned function of inter-scan interval. Total ≈250 M params at final scale.

**Three self-supervised objectives, curriculum-scheduled.**

- **IA-MVM** — interval-aware masked volume modeling: reconstruct ≈50 % of masked voxels conditioned on the nearest prior volume *and* Δt (cross-entropy on HU bins for CT, regression on z-scores for MRI). Δt is injected as a learned scaling on the decoder's cross-attention to the prior, forcing the encoder to use temporal context rather than copy the prior.
- **NVP-LS** — next-volume prediction in latent space: predict z_{t_i} from z_{<t_i} and target Δt with cosine + InfoNCE. Latent (not voxel) prediction avoids the autoregressive cost; conditioning on target Δt makes the objective trajectory-aware rather than next-frame-aware.
- **CMTC / TPC** — cross-modal temporal contrast at matched timepoints (CT/PET in HNSCC); image-only fallback contrasts same-patient temporal pairs against different-patient pairs at matched Δt buckets. Matched-Δt bucketing prevents collapse to patient identity as the contrast cue.

Curriculum: IA-MVM only for the first 10 K steps (≈5 % of the budget; validated on the 200 M prototype as the inflection at which NVP-LS no longer collapses), then add NVP-LS, then CMTC/TPC. Each objective is independently ablated. **Ablation runs use a 5 K-patient subset for 200 K steps; the full pretrain uses ≈30 K patients for 500 K steps.**

**Curation (released as community asset).** DICOM → NIfTI (`dcm2niix`); per-modality intensity normalization (HU windowing for CT, z-score for MRI, SUV conversion for PET); rigid cross-Δt registration to baseline (ANTs SyN as deformable fallback for body CT); BIDS-style manifest with continuous Δt + modality/region tags.

**Evaluation.** AD conversion ≤24 mo (ADNI) vs SSL-AD / BrainIAC; glioma progression (Brain-Tumor-Progression / LUMIERE); 1-/2-/6-yr lung-cancer risk (NLST) **head-to-head against the published Sybil [6] checkpoint**; RECIST treatment response (Anti-PD-1, HNSCC); time-to-event mortality (NLST, Anti-PD-1) by concordance index and integrated Brier score. Both linear probe and full fine-tune reported; 5-fold CV with held-out site for OOD generalization. **Power analysis**: with NLST n ≈ 10 K test, 80 % power for the pre-registered 3 % AUC delta at α = 0.05 (DeLong test, patient-level cluster bootstrap).

**Prior experience with the requested resource class.** The CoPI group operates the Mayo 20 × H200 cluster on the **identical FSDP / Apptainer / MONAI stack** proposed here. Cluster usage since **2025-09** is **≈[USAGE TO INSERT] GPU-hr**, producing the 200 M-param TimeFM-3D prototype whose 1.4 seq/s/GPU throughput and 0.85 strong-scaling efficiency are the *measured* figures cited above. The CoPI authored the Apptainer image, the Slurm job-array launcher, and the WebDataset shard pipeline currently in use; image and launcher are reviewer-inspectable at **github.com/[org TO INSERT]/timefm3d-runtime** (BSD-3, single-node reproducible). **Prior ACCESS allocations:** none — this is the team's first ACCESS request; the equivalent on-prem usage above demonstrates readiness on the identical software stack.

**Contingencies (pre-planned).** **Plan A** triggers if the month-1 DeltaAI sanity check returns GH200/H100 throughput <1.0×: trim the scaling-law to 3 sizes (drop 75 M and 600 M endpoints) and the ablation grid to 12 runs (drop the smallest model size), preserving every SSL × backbone combination intact. **Plan B** triggers if Anti-PD-1 Melanoma controlled-access DUA does not arrive: drop PET cohorts from the multimodal contrastive objective; CMTC becomes TPC-only. Body-CT registration failure → deformable ANTs SyN + Δt-aware loss masking around mis-registered regions. SSL collapse → curriculum from IA-MVM only + InfoNCE temperature search.

# Software & Specialized Needs

PyTorch 2.x · Lightning · **FSDP** as primary (measured ≈12 % lower memory per GPU than DeepSpeed ZeRO-3 on our H100 prototype at 250 M scale) · **DeepSpeed ZeRO-3** as fallback at the 600 M scaling-law point where activation memory exceeds 80 GB · NCCL · CUDA 12.x · HuggingFace `transformers` / `accelerate` · MONAI · torchio · SimpleITK · ANTs · `dcm2niix` · `nibabel` · Weights & Biases · Slurm · **Apptainer / Singularity** (two ISA-specific images sharing one Dockerfile, see §Resource selection). All open-source; no licensed binaries; no special queues; jobs ≤ 48 h walltime.

# Team and Team Preparedness

**PI Lifang He** (Lehigh CSE, [rank TO CONFIRM]): research-program lead in ML for medical imaging; PI on multi-year federally-funded medical-AI awards (the supporting grant cited above); operates the Mayo Clinic collaboration that produced the H100/H200 benchmark grounding this proposal; provides weekly methodological supervision and ACCESS resource-utilization oversight.

**CoPI Songlin Zhao** (Ph.D. candidate, Lehigh CSE, advised by L. He): designed and prototyped the TimeFM-3D architecture; authored the curation pipeline, Apptainer images (aarch64 + x86_64), Slurm launcher, and the H100 benchmark that produced the throughput figures cited in §Compute estimate; leads day-to-day ablation, scaling, and evaluation execution.

**Mayo Clinic collaborators** — clinical co-investigators per organ (radiology / oncology / informatics); govern PHI institutional data, which never leaves Mayo infrastructure.

# Sharing & Compliance

**Release artifacts** (months 9–12): pretrained weights (HuggingFace Hub), code + Apptainer images (GitHub, BSD-3), BIDS-style manifest schema, curation scripts. Raw imaging is not redistributed; only access pointers + DUA instructions, per NLST / ADNI / OASIS / NACC terms, aligned with NSF's public-access policy.

**Compliance.** All ACCESS-hosted training uses only de-identified, public-DUA imaging. PHI-bearing institutional data stays on the Mayo on-premises cluster; nothing PHI-derived is uploaded to ACCESS resources. PI attests compliance with the ACCESS Acceptable Use Policy, the ACCESS Code of Conduct, and HIPAA obligations.

[1] CT-FM · [2] BrainIAC · [3] M3FM · [4] Merlin · [5] BiomedCLIP · [6] Sybil · [7] BioViL-T · [8] Time2Vec · [30] NVIDIA MLPerf v4.0 — full citations in the separate References document.
