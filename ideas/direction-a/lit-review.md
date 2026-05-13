# Direction A: Longitudinal 3D Medical Imaging FM — Literature Review

**Scope.** A 3D medical imaging foundation model (FM) that natively ingests a SEQUENCE of patient-aligned 3D volumes (CT/MRI), with variable time intervals, optionally paired with longitudinal reports and EHR events, trained with temporal self-supervised objectives (interval-aware masked volume modeling, next-volume prediction in latent space, cross-modal temporal contrast). Downstream targets: disease progression, treatment response (RECIST), recurrence forecasting, longitudinal report generation.

**Date of review:** 2026-05-13.
**Coverage:** ~75 papers across 12 sections, organized to expose the white space at the intersection of (a) native 3D FM, (b) variable-interval temporal SSL, and (c) multimodal longitudinal context.

---

## 1. Foundation Models for 3D Medical Imaging (single-timepoint baseline)

This section catalogues the SOTA single-scan 3D medical FMs that any longitudinal 3D FM must outperform on standard tasks while additionally handling time.

### 1.1 Merlin — Stanford CCSL
- **Title:** Merlin: A Vision-Language Foundation Model for 3D Computed Tomography
- **Lead author / year / venue:** Louis Blankemeier, 2024, arXiv:2406.06512 (later expanded version 2026)
- **Description.** A 3D CT VLM trained on 15,331 abdominal CTs with 6M+ paired report tokens and 1.8M+ structured EHR codes (ICD/CPT).
- **What they did.** Dual supervision from (a) radiology reports (contrastive) and (b) EHR diagnosis codes (multi-label phenotype prediction). Evaluated on 752 tasks: 30 zero-shot findings, 692 phenotypes, 6-disease 5-year risk, retrieval, report gen, 20-organ segmentation.
- **Gap vs. full longitudinal 3D FM.** Strictly single-CT input. The "5-year risk" is supervision from future EHR labels only — no future imaging modeling. No sequence input, no interval-aware objective, no next-volume prediction.

### 1.2 CT-CLIP / CT-RATE
- **Title:** Developing Generalist Foundation Models from a Multimodal Dataset for 3D Computed Tomography
- **Lead author / year / venue:** Ibrahim Ethem Hamamci, 2024, arXiv:2403.17834, published Nature Biomedical Engineering 2025
- **Description.** First public 3D CT-text dataset (CT-RATE: 25,692 non-contrast chest CTs / 50,188 reconstructions / 21,304 patients) and CLIP-style 3D model.
- **What they did.** ViT (CT-ViT) image encoder + text transformer; contrastive image-report alignment; zero-shot abnormality detection across 18 labels; case retrieval.
- **Gap.** Single-volume only. No temporal awareness. CT-RATE itself contains repeated patients but the model ignores intra-patient sequence.

### 1.3 CT-FM — DFCI/Mass General Brigham
- **Title:** Vision Foundation Models for Computed Tomography
- **Lead author / year / venue:** Suraj Pai et al., 2025, arXiv:2501.09001
- **Description.** A 3D CT FM pre-trained with label-agnostic contrastive learning on 148,000 CTs from Imaging Data Commons.
- **What they did.** Evaluated across whole-body and tumor segmentation, head-CT triage, image retrieval, semantic clustering; strong test-retest stability.
- **Gap.** Single-volume FM. No paired text, no longitudinal modeling.

### 1.4 RadFM
- **Title:** Towards Generalist Foundation Model for Radiology by Leveraging Web-scale 2D&3D Medical Data
- **Lead author / year / venue:** Chaoyi Wu, Weidi Xie et al., 2024 (arXiv:2308.02463); Nature Communications 2025
- **Description.** Multimodal generalist over X-ray/CT/MRI/PET with 13M 2D and 615K 3D scans + paired text (MedMD).
- **What they did.** Single arch ingests 2D or 3D + text; outputs free-text diagnoses, VQA, reports. Benchmarked via RadBench.
- **Gap.** Single-study input. No native sequence modeling; multi-image input is concatenation of unrelated studies, not patient time series.

### 1.5 M3FM
- **Title:** Medical multimodal multitask foundation model for lung cancer screening
- **Lead author / year / venue:** Chuang Niu, 2025, Nat Commun s41467-025-56822-w
- **Description.** Foundation model for low-dose chest CT screening trained on 49 clinical data types, 163,725 CT series, 17 LCS tasks.
- **What they did.** CT-ViT + Text Transformer + Task Encoder. Improves lung cancer risk and CV mortality prediction by up to 20% / 10%.
- **Gap.** While NLST data is longitudinal, M3FM treats each scan as a single-study + tabular input. No temporal SSL; the longitudinal structure of NLST screening intervals is not exploited at pretraining.

### 1.6 SuPreM
- **Title:** Supervised Pre-Trained 3D Models for Medical Image Analysis
- **Lead author / year / venue:** Wenxuan Li et al., ICLR 2024 oral
- **Description.** Suite of 3D models supervised-pretrained on AbdomenAtlas 1.1 (9,262 CT volumes, 25 organs, 7 pseudo-tumor classes); AbdomenAtlas 1.0 v3 has 20,460 CT volumes.
- **Gap.** Supervised on segmentation; no temporal awareness; no longitudinal data used.

### 1.7 VoCo
- **Title:** A Simple-yet-Effective Volume Contrastive Learning Framework for 3D Medical Image Analysis
- **Lead author / year / venue:** Linshan Wu, CVPR 2024, arXiv:2402.17300 (TPAMI 2025 extension "Geometric Context Priors")
- **Description.** Self-supervised pretraining that contrasts sub-volume crops against base-crop anchors using positional/geometric priors.
- **Gap.** Within-volume positional contrast only. No inter-scan / inter-time contrast.

### 1.8 3DINO / 3DINO-ViT
- **Title:** A generalizable 3D framework and model for self-supervised learning in medical imaging
- **Lead author / year / venue:** Pohl group + collaborators, npj Digital Medicine 2025 (s41746-025-02035-w)
- **Description.** Memory-efficient adaptation of DINOv2 to 3D, pretrained on ~100K scans (70K MRI + 27.8K CT + 566 PET) across 10+ organs.
- **What they did.** Image-level + patch-level self-distillation with 2 global + 8 local crops; releases weights.
- **Gap.** Single-volume self-distillation only; no temporal pair / sequence handling.

### 1.9 BrainIAC
- **Title:** A generalizable foundation model for analysis of human brain MRI
- **Lead author / year / venue:** Kann lab (AIM-KannLab), Nature Neuroscience 2026 (s41593-026-02202-6)
- **Description.** Brain MRI FM trained SSL on 48,519 brain MRIs.
- **What they did.** Demonstrates brain age, dementia, time-to-stroke, brain-cancer outcomes; multi-task downstream evaluation.
- **Gap.** SSL is single-scan; downstream temporal tasks use FM as feature extractor and a separate head — no longitudinal pretraining objective.

### 1.10 MedSAM / MedSAM2 / SAM-Med3D
- **Titles:** Segment Anything in Medical Images (Bo Wang, Nat Commun 2024); MedSAM2 (arXiv:2504.03600); SAM-Med3D
- **Description.** Promptable segmentation FMs. MedSAM2 fine-tunes SAM2.1 for both 3D images and temporal video with a memory-attention module.
- **Gap vs. Direction A.** Segmentation-focused; MedSAM2 has memory-attention across slices/frames but does not handle interval-spaced visits / cross-modal temporal context. Not designed for outcome prediction.

### 1.11 Aerts cancer-imaging FM
- **Title:** Foundation model for cancer imaging biomarkers
- **Lead author / year / venue:** Suraj Pai, Hugo Aerts et al., Nature Machine Intelligence 6: 354–367, 2024
- **Description.** SSL convolutional encoder on 11,467 radiographic lesions; predicts anatomical site, malignancy, prognosis.
- **Gap.** Lesion-patch level, not whole-volume; single-time-point only; precursor to CT-FM.

### 1.12 BTB3D
- **Title:** Better Tokens for Better 3D: Advancing Vision-Language Modeling in 3D Medical Imaging
- **Lead author / year / venue:** 2025, arXiv:2510.20639
- **Description.** Causal conv encoder-decoder unifying 2D/3D into compact frequency-aware volumetric tokens. SOTA on text-to-CT synthesis (FID −75%, FVD halved) and report-gen (+40% clinical F1 over Merlin/CT-CHAT).
- **Gap.** Tokenizer + decoder for single CT; no temporal sequence modeling.

### 1.13 Triad
- **Title:** Triad: Vision Foundation Model for 3D Magnetic Resonance Imaging
- **Lead author / year / venue:** 2025, arXiv:2502.14064
- **Description.** Autoencoder pretrained on Triad-131K (131,170 3D MRI volumes; largest MRI pretraining set), with organ-independent text descriptions constraining the visual distribution.
- **Gap.** Single-volume MRI FM; no temporal SSL.

### 1.14 VISTA3D
- **Title:** VISTA3D: A Unified Segmentation Foundation Model For 3D Medical Imaging
- **Lead author / year / venue:** Yufan He et al., CVPR 2025, arXiv:2406.05285
- **Description.** Unified 3D automatic (127 classes) + interactive segmentation; distills 2D pretrained backbones via 3D supervoxel.
- **Gap.** Segmentation only; no temporal awareness.

### 1.15 Decipher-MR (GE HealthCare)
- **Title:** Decipher-MR: A Vision-Language Foundation Model for 3D MRI Representations
- **Lead author / year / venue:** Yang, DSouza et al., npj Digital Medicine 2026 (s41746-026-02596-4); arXiv:2509.21249
- **Description.** 3D MRI VL FM trained on 203,233 MRI series from 22,594 studies, ages 0–90, multi-vendor; combines vision SSL with report-guided text supervision.
- **Gap.** Single-study only; modular task heads sit on frozen single-volume encoder.

### 1.16 MedImageInsight
- **Title:** MedImageInsight: An Open-Source Embedding Model for General Domain Medical Imaging
- **Lead author / year / venue:** Microsoft, 2024, arXiv:2410.06542
- **Description.** Domain-general embedding model (radiography, CT, MRI, US, pathology, dermoscopy, fundus); strong on retrieval and fairness audits.
- **Gap.** 2D, no temporal modeling.

### 1.17 BiomedGPT
- **Title:** A generalist vision–language foundation model for diverse biomedical tasks
- **Lead author / year / venue:** Kai Zhang et al., Nature Medicine 2024
- **Description.** Open-source generalist VLM (16/25 SOTA tasks). 3D-image encoder is an optional extension.
- **Gap.** Largely 2D backbone; sequence-of-volumes not native.

### 1.18 BioViL-T (CXR temporal baseline, comparator)
- **Title:** Learning to Exploit Temporal Structure for Biomedical Vision–Language Processing
- **Lead author / year / venue:** Shruthi Bannur et al., Microsoft Health Futures, CVPR 2023
- **Description.** CNN-Transformer hybrid trained on chest X-ray sequences with paired reports; SOTA on progression classification, phrase grounding, longitudinal report gen.
- **Gap relative to A.** 2D CXR not 3D; no interval-conditioning; pair-based not sequence-of-many.

### 1.19 EchoCLIP / EchoPrime / EchoFM / Echo-Vision-FM
- **Titles / Authors / Years.** EchoCLIP (Bryan He, Nat Med 2024); EchoPrime (Stanford/Cedars, Nature 2026, arXiv:2410.09704); EchoFM (PMC12616925, arXiv:2410.23413); Echo-Vision-FM (Nat Commun 2025).
- **Description.** Video echo FMs trained on ~1M–12M videos with view-informed retrieval and periodic-contrast MAE objectives.
- **Gap.** Specific to ultrasound video; periodicity assumption does not transfer to multi-month interval CT/MRI; no patient-level long sequence.

### 1.20 NeuroSTORM (4D fMRI FM)
- **Title:** Towards a general-purpose foundation model for fMRI analysis
- **Lead author / year / venue:** Wang et al., Nat Biomed Eng 2026 (s41551-026-01666-y), arXiv:2506.11167
- **Description.** Pretrained on 28.65M fMRI frames, 50K participants, 5–100 yo. Shifted-Window Mamba backbone + STRD (spatiotemporal redundancy dropout) masked pretraining.
- **Gap.** 4D fMRI (intra-scan time, second-level) — fundamentally different from inter-visit weeks/years intervals.

---

## 2. Label-side Longitudinal: 3D imaging + future EHR labels

Models that use longitudinal supervision but ingest a single image.

### 2.1 TTE Pretraining (Stanford) — KEY BASELINE
- **Title:** Time-to-Event Pretraining for 3D Medical Imaging
- **Lead author / year / venue:** Zepeng Huo, Jason Fries, Akshay Chaudhari, Nigam Shah et al., ICLR 2025, arXiv:2411.09361
- **Description.** Pretrains a 3D CT encoder by predicting time-to-event distributions across thousands of EHR-derived endpoints from longitudinal records — bridging "missing context" between local imaging features and long-term outcomes.
- **Numbers.** 18,945 CTs / 4.2M 2D images. +23.7% AUROC, +29.4% Harrell's C across 8 benchmarks.
- **Gap.** Input is a single CT; the *labels* are temporal. No use of multiple imaging timepoints as input. This is the most direct comparator for any future-EHR-supervised single-volume FM but does not address image-sequence modeling.

### 2.2 Merlin 5-yr Disease Risk (sub-component, §1.1)
- Already covered. Merlin treats 5-yr risk as another classification head over a single abdominal CT.

### 2.3 Sybil (label-side longitudinal lung cancer risk)
- **Title:** Sybil: A Validated Deep Learning Model to Predict Future Lung Cancer Risk From a Single Low-Dose Chest Computed Tomography
- **Lead author / year / venue:** Peter Mikhael, Regina Barzilay et al., MIT Jameel Clinic, JCO 2023
- **Description.** Predicts 1–6 yr lung cancer from a single LDCT; AUC 0.92 (1-yr NLST) / C-index 0.75 (6-yr). Public code (reginabarzilaygroup/Sybil).
- **Gap.** Single-CT input despite NLST being a longitudinal screening trial. A natural baseline for "what does adding the prior screening CTs buy you" — direction A would aim to surpass Sybil by ingesting the full screening history.

### 2.4 DLST / MIRAI (longitudinal label-side breast)
- **Description.** Mirai (Lehman, Barzilay, 2021) predicts 5-yr breast cancer risk from one mammogram; LRP-NET, Karaman et al. (2023) extends with 2–4 prior mammograms.
- **Gap relative to A.** 2D mammography, not 3D.

---

## 3. Image-side Longitudinal: works using ≥2 imaging timepoints

### 3a. Two-timepoint (Siamese / pair-based)

#### 3a.1 LSSL
- **Title:** LSSL: Longitudinal Self-Supervised Learning
- **Lead author / year / venue:** Qingyu Zhao, Ehsan Adeli, Kilian Pohl, MIDL 2020 / MedIA 2021, arXiv:2006.06930
- **Description.** Autoencoder with cosine loss disentangling brain age from image representation using two longitudinal MRI scans per subject.
- **Gap.** 2-timepoint pair; small datasets (ADNI/NCANDA); not foundation-scale.

#### 3a.2 LNE
- **Title:** Self-Supervised Longitudinal Neighbourhood Embedding
- **Lead author / year / venue:** Jiahong Ouyang, Pohl lab, MICCAI 2021 / MedIA (PMC10168684)
- **Description.** Builds a graph in latent space at each iter and aligns each subject's trajectory vector to its neighborhood mean.
- **Gap.** Two-timepoint, brain-only, fixed-interval implicit; no native variable Δt or text/EHR.

#### 3a.3 STAMP
- **Title:** Stochastic Siamese MAE Pretraining for Longitudinal Medical Images
- **Lead author / year / venue:** 2025, arXiv:2512.23441
- **Description.** Extends MAE to a Siamese setup; reframes reconstruction as conditional variational inference; ViT trained on 2 OCT + 1 MRI longitudinal datasets.
- **Gap.** Two-visit pairs only; 2.5D/2D mostly; ViT pre-training but not foundation-scale; AMD + AD downstream.

#### 3a.4 TeViT / TaViT (Time-distance ViT)
- **Title:** Time-distance vision transformers in lung cancer diagnosis from longitudinal computed tomography
- **Lead author / year / venue:** Thomas Li et al., 2022 (arXiv:2209.01676), J Med Imaging 2023 (PMC10353776)
- **Description.** Two extensions of ViT for longitudinal CT: TeViT adds time-distance to positional encoding; TaViT scales self-attention weights by continuous time deltas via "temporal emphasis."
- **Gap.** Synthetic + small NLST subsets; not pretrained as a FM; uses pre-extracted nodule features.

#### 3a.5 LongFormer (LongFormer-MRI)
- **Title:** Longformer: Longitudinal Transformer for Alzheimer's Disease Classification with Structural MRIs
- **Lead author / year / venue:** Qiuhui Chen, Yi Hong, WACV 2024 / arXiv:2302.00901
- **Description.** Hybrid 3D-CNN + Transformer that does spatial attention per scan then temporal aggregation. SOTA on ADNI/OASIS/AIBL.
- **Gap.** Supervised classification only; no SSL pretraining; small-scale.

#### 3a.6 MambaX-Net
- **Title:** Dual-Input Mamba-Enhanced Cross-Attention Network for Longitudinal MRI Segmentation
- **Lead author / year / venue:** 2025, arXiv:2510.17529
- **Description.** Dual-input Mamba arch for paired-visit segmentation, evaluated on prostate active-surveillance MRI.
- **Gap.** Two-visit segmentation; not generative / not FM.

### 3b. Multi-timepoint (≥3 scans)

#### 3b.1 SSL-AD
- **Title:** SSL-AD: Spatiotemporal Self-Supervised Learning for Generalizability and Adaptability Across Alzheimer's Prediction Tasks and Datasets
- **Lead author / year / venue:** 2025, arXiv:2509.10453
- **Description.** Adapts 3 temporal SSL methods (LSSL-style, MAE, ordering) to 3D brain MRI with variable-length input handling; pretrains on 3,161 patients across 4 public AD datasets.
- **Gap.** Brain-only, AD-only; small data; no text/EHR; "variable-length" but no continuous-time interval-aware encoding study.

#### 3b.2 CRONOS — KEY COMPARATOR
- **Title:** CRONOS: Continuous Time Reconstruction for 4D Medical Longitudinal Series
- **Lead author / year / venue:** 2025, arXiv:2512.16577 (OpenReview XxqdbYD74l)
- **Description.** Many-to-one prediction from multiple past scans; supports both discrete and continuous (real-valued) timestamps; learns spatio-temporal velocity field in 3D voxel space; Fourier embeddings for flow-time and clock-time.
- **Numbers.** Cine-MRI, perfusion CT, longitudinal MRI; outperforms baselines.
- **Gap.** Trajectory/forecasting model, not a self-supervised FM. No paired text/EHR. The Fourier continuous-time recipe is a building block to borrow.

#### 3b.3 3DTINC
- **Title:** Time-Equivariant Non-Contrastive Learning for Predicting Disease Progression from Longitudinal OCTs
- **Lead author / year / venue:** Taha Emre, Hrvoje Bogunović et al., IEEE TMI 2024 / arXiv:2312.16980
- **Description.** Non-contrastive SSL with OCT-specific 3D augmentations; explicit temporal similarity loss across intra-patient scans.
- **Gap.** OCT-only; relatively small data; no text.

#### 3b.4 L-MAE
- **Title:** Longitudinal masked auto-encoder with time and severity-aware encoding for diabetic retinopathy progression prediction
- **Lead author / year / venue:** Rachid Zeghlache et al., Comput Biol Med 2024 / arXiv:2403.16272
- **Description.** ViT-based longitudinal MAE with (i) time-aware positional embedding using inter-visit Δt and (ii) disease-progression-aware masking that evolves through follow-up.
- **Gap.** 2D fundus; small. The recipe (time-aware PE + progression-aware masking) is transferable to 3D.

#### 3b.5 LongL-Net
- **Title:** Temporal Correlation Structure Guided Deep Learning Model for AMD Severity
- **Lead author / year / venue:** PNAS Nexus 2022
- **Description.** RNN+CNN for fundus AMD longitudinal severity prediction.
- **Gap.** 2D, application-specific; no SSL pretrain.

#### 3b.6 Holistic Time-Aware (TAMME)
- **Title:** A Holistic Time-Aware Classification Model for Multimodal Longitudinal Patient Data
- **Lead author / year / venue:** Susetzky, Qiu, Braren, Rueckert; MICCAI 2025 (paper 3193)
- **Description.** Time-aware multimodal transformer encoder. Each element = sum of (categorical type) + (type specification) + (time embedding incl. Δt to prev) + (value). Open-vocabulary; works on imaging + text + numerical + categorical, irregular intervals.
- **Gap.** Treats images as embedding tokens; does not include native 3D image encoder pretraining; classification head only.

### 3c. Per-patient temporal contrastive / chronological

#### 3c.1 LEARNER
- **Title:** Contrastive Pretraining for Learning Fine-Grained Patient Progression from Coarse Inter-Patient Labels
- **Lead author / year / venue:** 2024, arXiv:2411.01144
- **Description.** Uses coarse inter-patient labels as proxy to learn intra-patient progression; TSM (Temporal Shift Module) + ResNet-18.
- **Gap.** 2D / 2.5D; relies on coarse labels; not pure SSL; small.

#### 3c.2 Chronological Contrastive Learning (ChronoCon)
- **Title:** Chronological Contrastive Learning: Few-Shot Progression Assessment in Irreversible Diseases
- **Lead author / year / venue:** 2026, arXiv:2603.21935
- **Description.** Generalizes Rank-N-Contrast to use patient visit order as ranking signal — learns severity representations without expert labels. Evaluated on rheumatoid arthritis radiographs.
- **Gap.** 2D radiographs, monotonic-progression assumption; not 3D not multimodal.

#### 3c.3 Temporal Supervised Contrastive Learning (Temporal-SCL)
- **Title:** Temporal Supervised Contrastive Learning for Modeling Patient Risk Progression
- **Lead author / year / venue:** 2023, arXiv:2312.05933 (PMC10976929)
- **Description.** Supervised contrastive on tabular patient time-series for risk progression.
- **Gap.** Tabular only.

#### 3c.4 LRP-NET (mammography longitudinal SSL)
- **Description.** Uses 4 consecutive prior negative mammograms for spatiotemporal feature learning of cancer risk; CNN-LSTM family.
- **Gap.** 2D, modality-specific.

---

## 4. Disease Progression Prediction (longitudinal modeling, clinical task)

### 4.1 TADPOLE
- **Title:** The Alzheimer's Disease Prediction Of Longitudinal Evolution (TADPOLE) Challenge
- **Lead author / year / venue:** Răzvan Marinescu, Daniel Alexander et al., 2018–2021 (arXiv:1805.03909, 2002.03419)
- **Description.** Crowdsourced benchmark: 92 algorithms / 33 teams predicting clinical Dx, ADAS-Cog13, ventricle volume monthly over 5 yr from ADNI.
- **Gap as benchmark.** Tabular features dominate; raw image-sequence baselines underrepresented; an opportunity to set the imaging-sequence FM benchmark.

### 4.2 Predicting Future Brain Atrophy (2025 medRxiv)
- Multiple recent works (Marinescu lab follow-ups; Wachinger / TimeFlow group) directly use longitudinal MRI to forecast atrophy or cognitive scores.

### 4.3 Glioma progression
- **Multi-Task Diffusion Approach For Prediction of Glioma Tumor Progression** (arXiv:2509.10824). Generates future FLAIR MRI at any time + pixel-level tumor evolution map from two prior scans.
- **Gap.** Single-disease, generative; not a FM.

### 4.4 Lung nodule growth / Sybil (covered §2.3)

### 4.5 Brain age models
- **Brain age prediction** is a long-standing benchmark (Cole 2019; AgeDiffuse 2023; Frontiers Aging Neurosci 2023). Many are single-scan + age regression; longitudinal predicted brain age tracking is an emerging evaluation.

### 4.6 BrLP
- **Title:** Brain Latent Progression: Individual-based Spatiotemporal Disease Progression on 3D Brain MRIs via Latent Diffusion
- **Lead author / year / venue:** Lemuel Puglisi, MICCAI 2024 early-accepted / MedIA 2025 / arXiv:2502.08560
- **Description.** Latent diffusion in 3D brain MRI conditioned on subject metadata + auxiliary disease-dynamics model; Latent Average Stabilization for spatiotemporal consistency.
- **Numbers.** 11,730 T1w from 2,805 subjects + external 2,257/962.
- **Gap.** Generative model not a discriminative FM; brain-only; no text/EHR; though provides voxel uncertainty.

### 4.7 Enhancing Spatiotemporal Disease Progression
- arXiv:2405.03328 — latent diffusion + prior knowledge for AD trajectory generation.

---

## 5. Treatment Response Prediction

### 5.1 RECIST automation
- **Systematic review:** "Artificial Intelligence for RECIST-Based Radiologic Treatment Response Assessment in Solid Tumors" (Cancers 2024/2026, PMC12984241).
- **Findings.** nnU-Net + 3D U-Net pipelines achieve DSC 0.85, VS 0.89, response classification 0.77 (κ=0.60). LLM-based report mining (DeepSeek-V3, GatorTron) hits 96.5% / 89% accuracy with κ 0.85–0.90.
- **Toward automating RECIST 1.1 with longitudinal image data** (ASCO 2023, e13545) — explicitly proposes leveraging baseline + follow-up CTs to improve new-lesion detection.
- **Gap.** Almost all approaches are single-task per cohort; no general FM that does RECIST end-to-end on multi-time-point CTs.

### 5.2 Pre/post-chemo imaging response
- **Predicting treatment response from longitudinal images using multi-task deep learning** (Xu, Mak, Aerts; Nat Commun 2021, s41467-021-22188-y). Time-series CT deep model significantly predicts survival, progression, distant metastasis, local recurrence in NSCLC.

### 5.3 Immunotherapy response prediction
- "AI-based non-invasive profiling of TIME using longitudinal CT radiomics predicts immunotherapy response in lung cancer" (Front Immunol 2025).
- "Integration of deep learning and habitat radiomics for predicting the response to immunotherapy in NSCLC" (Cancer Immunol Immunother 2024). Ensemble AUC 0.94 train / 0.87 ext.
- **Gap.** Radiomics + lightweight DL; not foundation models; small cohorts; rarely uses ≥3 timepoints natively.

### 5.4 ESCC neoadjuvant
- **Sub-regional radiomics + 2D/3D DL for neoadjuvant chemo-immunotherapy response prediction** in esophageal SCC (Niu et al., npj Precision Oncology 2025).

### 5.5 RADAR CARE (NSCLC recurrence)
- **JCO Precision Oncology 2025**: multimodal transformer with baseline + longitudinal labs + radiology for NSCLC recurrence. Baseline AUC 0.82, longitudinal 0.77, combined 0.85.

### 5.6 HCC recurrence from baseline MRI
- Predicting tumor recurrence on baseline MR imaging in early-stage HCC (Sci Rep 2023). VGG16 + XGBoost; 1–6 yr horizons.

---

## 6. Longitudinal Image Synthesis / Forecasting

### 6.1 SADM
- **Title:** SADM: Sequence-Aware Diffusion Model for Longitudinal Medical Image Generation
- **Lead author / year / venue:** Jee Seok Yoon et al., IPMI 2023, arXiv:2212.08228 (UBC TEA group)
- **Description.** Diffusion + sequence-aware transformer condition; handles missing frames; autoregressive at inference. Cardiac + brain MRI.
- **Gap.** Generative; small datasets; intra-sequence regular intervals.

### 6.2 Forecasting Future Anatomies
- **Title:** Forecasting Future Anatomies: Longitudinal Brain MRI-to-MRI Prediction (arXiv:2511.02558, Nov 2025).
- **Description.** Five architectures (UNet, U²-Net, UNETR, Time-Embedding UNet, ODE-UNet) predict full future brain MRI from baseline. Trained on ADNI/AIBL; generalizes cross-cohort.
- **Gap.** Single baseline → single future; supervised mapping, not FM.

### 6.3 TimeFlow (Temporal Conditioning)
- **Title:** TimeFlow: Temporal Conditioning for Longitudinal Brain MRI Registration and Aging Analysis (arXiv:2501.08667; IEEE TPAMI 2025).
- **Lead author.** Bailiang Jian, Daniel Rueckert, Christian Wachinger et al.
- **Description.** U-Net with temporal conditioning modeling neuroanatomy as continuous function of age; learns deformation field with inter/extrapolation consistency. Only two scans needed.
- **Gap.** Brain registration / age extrapolation; not multi-modality / not FM.

### 6.4 Temporal Flow Matching (TFM)
- **Title:** Temporal Flow Matching for Learning Spatio-Temporal Trajectories in 4D Longitudinal Medical Imaging (arXiv:2508.21580).
- **Lead author / venue.** Nico Albert Disch, MIC-DKFZ, 2025.
- **Description.** Unified generative trajectory framework; supports 3D, multiple priors, irregular sampling; falls back to nearest-image predictor. Benchmarks: ACDC, LUMIERE (brain tumor), ISLES (stroke). Code on GitHub MIC-DKFZ/Temporal-Flow-Matching.
- **Gap.** Generative trajectory in pixel/voxel space; not a representation FM; no text.

### 6.5 Latent Flow Matching for Longitudinal Imaging (ICLR 2026)
- **Title:** Learning Patient-Specific Disease Dynamics with Latent Flow Matching for Longitudinal Imaging Generation (arXiv:2512.09185).
- **Description.** Two-stage: ArcRank Loss to construct patient-specific latent; FM on disease-specific time scale T. Introduces Δ-RMAE metric.
- **Gap.** Generative latent FM; brain MRI focused; no text.

### 6.6 Conditional Latent Diffusion for Irregularly Spaced Longitudinal Radiological Data
- **Lead author / year / venue:** Mouadden, Christodoulidis, Vakalopoulou et al., MICCAI 2025 (paper 2656).
- **Description.** Universal 2D/3D vision encoder + temporal transformer + conditional latent diffusion. Predicts ILD progression in systemic sclerosis and generates reports.
- **Gap.** Generative + report-only end output; the encoder is not released as a standalone FM.

### 6.7 ImageFlowNet
- **Title:** ImageFlowNet: Forecasting Multiscale Image-Level Trajectories of Disease Progression with Irregularly-Sampled Longitudinal Medical Images (arXiv:2406.14794, ICASSP 2025 Oral, Krishnaswamy lab).
- **Description.** Multiscale joint patient-time latent + position-parameterized Neural ODE/SDE flow field. Datasets: retinal geographic atrophy, MS, GBM.
- **Gap.** Trajectory forecasting per image, mostly 2D/2.5D; not FM-scale.

### 6.8 Conditional Neural ODE for PD progression
- arXiv:2511.04789 — Conditional Neural ODE forecasting Parkinson's brain changes.

### 6.9 Temporal Atlas-Guided Generation via Geometric Latent (MICCAI 2025)
- Atlas-conditioned generation pipeline for longitudinal data synthesis.

### 6.10 Conditional Diffusion + Ordinal Regression (MICCAI workshop)
- Longitudinal data generation with ordinal disease-stage conditioning.

### 6.11 BrLP (covered §4.6)

---

## 7. Continuous-Time Embeddings / Position Encoding for Irregular Intervals

### 7.1 Time2Vec
- **Title:** Time2Vec: Learning a Vector Representation of Time
- **Lead author / year / venue:** Seyed Mehran Kazemi, 2019, arXiv:1907.05321.
- **Description.** Model-agnostic time embedding: one linear component + multiple sin components with **learnable** ω, φ; substitutable into transformers as continuous-time PE.

### 7.2 Sinusoidal / Fourier time embeddings
- The Vaswani-style sinusoidal PE generalizes to continuous t.
- **CRONOS** uses Fourier features for both flow-step and clock-time.
- "Continuous-Time Linear Positional Embedding for Irregular Time Series Forecasting" (arXiv:2409.20092).

### 7.3 Δt-aware attention / Time-Aware Transformer
- **TaViT** (§3a.4) scales QK by continuous Δt via a temporal emphasis model.
- "Time-Aware Attention for Enhanced Electronic Health Records Modeling" (arXiv:2507.14847).
- "Time-to-Event Transformer to Capture Timing Attention of Events in EHR Time Series" (arXiv:2602.10385).

### 7.4 Neural ODE for medical sequence
- ImageFlowNet, CNODE Parkinson's, BrLP auxiliary models (§§4–6) — Neural ODE/SDE for trajectory.
- "On the applications of neural ODEs in medical image analysis" (Artif Intell Rev 2024).

### 7.5 Time-aware MAE
- L-MAE (§3b.4): time-aware positional embedding inside an MAE.
- 3D MAE with spatiotemporal transformer for 4D fMRI (PubMed 41197226).

### 7.6 RoPE temporal / Rotary
- "Learning to Rotate: Temporal and Semantic Rotary Encoding for Sequential Modeling" (arXiv:2604.24717) — explicit temporal RoPE.

---

## 8. Cross-modal Temporal Models (image + text + EHR with time)

### 8.1 BioViL-T (covered §1.18)
The canonical 2D temporal VL model — important methodological reference for paired image–prior-report contrast.

### 8.2 Holistic Time-Aware / TAMME (covered §3b.6)

### 8.3 IRENE
- **Title:** A transformer-based representation-learning model with unified processing of multimodal input for clinical diagnostics
- **Lead author / year / venue:** Hong-Yu Zhou et al., Nature Biomedical Engineering 2023.
- **Description.** Unified transformer producing diagnoses from combined image/text/structured input via bidirectional cross-modal attention.
- **Gap.** Single-timepoint; no time encoding.

### 8.4 ETHOS
- **Title:** Zero Shot Health Trajectory Prediction Using Transformer (npj Digital Medicine 2024, arXiv:2407.21124).
- **Description.** Tokenizes Patient Health Timelines (PHTs) from EHR; zero-shot prediction of future events. Influential for "what does an EHR-side patient timeline transformer look like."
- **Gap.** EHR-only; no images.

### 8.5 Foresight
- **Title:** Foresight—a generative pretrained transformer for modelling of patient timelines using EHRs (Lancet Digital Health 2024, arXiv:2212.08072).
- **Gap.** EHR-only.

### 8.6 CoMET (Cosmos Medical Event Transformer)
- **Title:** Generative Medical Event Models Improve with Scale (arXiv:2508.12104, Epic / Microsoft Research, 2025).
- **Description.** Decoder-only transformer up to 1B params on 118M patients / 115B events / 151B tokens (Epic Cosmos). Establishes power-law scaling for EHR FMs. Evaluated on 78 downstream tasks zero-shot.
- **Gap.** EHR-only; no images.

### 8.7 MAIRA-2
- **Title:** MAIRA-2: Grounded Radiology Report Generation (Microsoft Health Futures, arXiv:2406.04449).
- **Description.** Multimodal LLM ingesting current frontal/lateral + prior frontal + prior report + Indication/Technique/Comparison sections. Grounded report generation on MIMIC-CXR.
- **Gap.** CXR only; prior is one frame; no native variable-Δt.

### 8.8 CXR-LLaVA (longitudinal extension lit, §1)
- Several extensions: longitudinal-MIMIC (26,625 patients), HERGen, MLRG (CVPR 2025).
- "A Review of Longitudinal Radiology Report Generation" (arXiv:2510.12444) — recent survey.

---

## 9. Benchmarks / Eval Datasets for Longitudinal Tasks

### 9.1 3D-RAD
- **Title:** 3D-RAD: A Comprehensive 3D Radiology Med-VQA Dataset with Multi-Temporal Analysis (arXiv:2506.11147, NeurIPS 2025).
- **Description.** 170K Q-A entries across 6 VQA tasks including **longitudinal temporal diagnosis** and **static temporal diagnosis**. Spans 18+ diseases. Existing VLMs (incl. medical) fail on multi-temporal tasks → **direct benchmark to beat for Direction A**.

### 9.2 TADPOLE (§4.1)

### 9.3 INSPECT
- **Title:** INSPECT: A Multimodal Dataset for Pulmonary Embolism Diagnosis and Prognosis (NeurIPS 2023 D&B, arXiv:2311.10798, Stanford SOM Shah lab).
- **Description.** 19,402 Stanford patients / 23,248 CTs + reports + longitudinal EHR with clinician-validated labels — first to link longitudinal EHR + paired 3D CT + reports.

### 9.4 NLST (National Lung Screening Trial)
- ~26,254 LDCT-screening patients with up to 3 screening rounds (T0/T1/T2) + outcomes. ~75K screening exams. CDAS access. **The natural pretraining + eval corpus for lung-cancer longitudinal screening FM.** NLSTseg adds pixel-level cancer masks (Sci Data 2025).

### 9.5 BraTS-Reg / BraTS-Longitudinal
- **BraTS-Reg** (Baheti et al., arXiv:2112.06979): 259 diffuse-glioma patients with pre-op + follow-up MRI.
- **BraTS 2024 Post-treatment** and **BraTS 2025 Lighthouse** explicitly add post-treatment / longitudinal cohorts.

### 9.6 HECKTOR (head and neck)
- HECKTOR 2020 → 2025 (Andrearczyk, Depeursinge et al.). FDG-PET/CT segmentation + recurrence-free survival prediction; >1200 patients / 11 centers. Best PFS C-index ≈ 0.72.

### 9.7 ADNI / OASIS / AIBL (the brain trilogy)
- Canonical Alzheimer longitudinal datasets — heavily used by LSSL, LNE, SSL-AD, BrLP, TimeFlow, LongFormer.

### 9.8 ProstateX active surveillance
- Used by MambaX-Net (§3a.6) and others; smaller longitudinal subset.

### 9.9 LUMIERE / ISLES (longitudinal brain tumor / stroke)
- Used by Temporal Flow Matching.

### 9.10 Longitudinal-MIMIC (CXR)
- 26,625 patients with multi-visit chest X-rays + reports; used for longitudinal CXR report-gen.

### 9.11 OPHDIAT / RoTOG-AMD (OCT/fundus)
- L-MAE / 3DTINC / LONGL-Net benchmarks.

### 9.12 Cosmos (Epic 300M patients) — EHR-side only
For label supervision at scale.

---

## 10. White Space Analysis (our synthesis)

Concrete unfilled gaps at the intersection of **native 3D FM**, **variable-interval temporal SSL**, and **multimodal longitudinal context**:

### 10.1 Joint architecture choices not yet tried
- **3D-volume encoder + Δt-aware temporal attention** in a single FM trained on real-world inter-visit intervals. CRONOS gets close but is a forecaster, not a generic encoder. BioViL-T/MAIRA-2 do this for 2D CXR only. SSL-AD does it for 3D brain MRI only, brain-only, not foundation-scale.
- **Per-visit cross-attention between 3D image tokens and EHR-event tokens with shared continuous-time positional encoding.** TAMME does it for tabular/text without a 3D image encoder; Merlin does single-time joint image-EHR. Nobody fuses 3D image sequence + EHR sequence under one time axis.
- **Mixed-modality sequences** (CT visit at t1, MRI visit at t2, report at t3, lab at t4) under one tokenization. Closest is CLDM (§6.6) for synthesis only.

### 10.2 Specific objective combinations not yet tried
- **Interval-aware Masked Volume Modeling (IA-MVM):** masking ratio modulated by Δt — short Δt → high redundancy → mask more aggressively; long Δt → mask conservatively, predict deltas. L-MAE prototypes this in 2D fundus only.
- **Next-volume prediction in latent space** as autoregressive SSL objective (LM-style on volumes). Latent Flow Matching and CRONOS frame this as forecasting; nobody uses it as the *primary* pretraining objective for a general representation FM.
- **Cross-modal temporal contrast:** match volume at time t with report/EHR-window around t while pushing apart same-patient at t' ≠ t. Closest: ChronoCon (2D) and Temporal-SCL (tabular).
- **Trajectory-aligned contrast across patients:** LNE-style neighborhood embedding but at FM scale across diseases — would inherit a global "progression manifold."

### 10.3 Specific clinical evaluations missing
- **RECIST prediction in latent space from ≥3 prior CTs** — no 3D FM has been shown to predict response on a multicenter held-out set with all of (a) interval awareness, (b) RECIST 1.1 fidelity, (c) zero-shot.
- **Cross-disease, cross-modality progression benchmarks.** 3D-RAD has multi-temporal VQA but no FM has yet posted a complete leaderboard.
- **Time-to-event Harrell's C improvements on ≥5 organ systems** using the *same* 3D temporal FM checkpoint. TTE pretraining gets close on Stanford EHR but only on single-CT input.
- **Longitudinal report generation with prior-image + prior-report context for non-CXR 3D modalities** (CT-CT, MRI-MRI). Almost all longitudinal report-gen literature is 2D CXR.

### 10.4 Data regimes not yet tried
- **NLST + INSPECT + AbdomenAtlas longitudinal + ADNI/OASIS + UK Biobank repeat-imaging** as a unified pretraining pool. Currently each FM trains on at most one of these.
- **Mining variable-Δt sequences from PACS** — Stanford has done this (Merlin, TTE) but only for single-CT input. Same data can be re-tokenized as 3D image sequences.
- **Federated longitudinal pretraining** across institutions (each has long follow-up of a fraction of patients) — open challenge.

---

## 11. Direct competitors for Direction A — closest 8 papers

Ranked by closeness to "a 3D medical imaging FM that natively ingests a sequence of patient-aligned 3D volumes with variable Δt and longitudinal text/EHR context, trained with temporal SSL":

1. **TTE Pretraining (Stanford 2024, arXiv:2411.09361)** — same goal of pretraining 3D imaging models with longitudinal supervision, but **input is single CT** with temporal *labels*. Direction A flips this: temporal *inputs* + arbitrary labels.

2. **SSL-AD (arXiv:2509.10453)** — actual 3D temporal SSL on 3D brain MRI sequences. Brain-only, AD-only, 3,161 patients. The clearest existing in-domain template for what we propose, just narrow.

3. **CRONOS (arXiv:2512.16577)** — multi-input continuous-time 4D forecasting in voxel space. Provides the continuous-time recipe but is a forecaster not a generic FM.

4. **Temporal Flow Matching (arXiv:2508.21580, MIC-DKFZ)** — sibling of CRONOS, generative 3D trajectory; competes on the "predict next volume" objective.

5. **Merlin (arXiv:2406.06512)** — single-CT 3D VLM with longitudinal EHR-label supervision; direct comparator on Stanford 5-yr risk + report-gen tasks.

6. **BrLP (arXiv:2502.08560)** — 3D brain MRI latent diffusion progression model. Strong comparator for trajectory tasks.

7. **TAMME / Holistic Time-Aware (MICCAI 2025)** — multimodal time-aware transformer with explicit Δt encoding; lacks a native 3D image encoder.

8. **BioViL-T / MAIRA-2 (CVPR 2023 / arXiv:2406.04449)** — defines the 2D-CXR longitudinal-VLM SOTA; methodological reference for image+prior-report cross-attention.

**Honorable mentions / next 5:** L-MAE (2D recipe to lift to 3D), ImageFlowNet, BioViL-T sibling longitudinal CXR works (HERGen, MLRG), CT-CLIP / CT-RATE (data scaffolding), 3D-RAD (eval).

---

## 12. Methodological Building Blocks Ready to Use

### 12.1 Public code / checkpoints we can build on
- **Merlin** (Stanford, abdominal CT VLM): https://github.com/StanfordMIMI/Merlin (checkpoint + tokenizer).
- **CT-FM** (DFCI): public, Imaging Data Commons-pretrained.
- **CT-CLIP / CT-RATE** (Hamamci): GitHub + HF dataset.
- **3DINO** (AICONSlab): https://github.com/AICONSlab/3DINO + ViT weights.
- **Triad / VISTA3D / SuPreM / VoCo / BrainIAC / Decipher-MR**: all open-source.
- **Sybil**: https://github.com/reginabarzilaygroup/Sybil — lung-cancer single-CT risk baseline.
- **SADM**: https://github.com/ubc-tea/SADM-Longitudinal-Medical-Image-Generation.
- **Temporal Flow Matching**: https://github.com/MIC-DKFZ/Temporal-Flow-Matching.
- **ImageFlowNet**: https://github.com/KrishnaswamyLab/ImageFlowNet.
- **LNE**: https://github.com/ouyangjiahong/longitudinal-neighbourhood-embedding.
- **3D-RAD**: https://github.com/Tang-xiaoxiao/3D-RAD (benchmark + leaderboard).
- **BioViL-T**: HF microsoft/BiomedVLP-BioViL-T.
- **MAIRA-2**: HF microsoft/maira-2.

### 12.2 Existing temporal recipes to combine
- **Fourier continuous-time embedding** (CRONOS) — drop-in to encode any clock-time in 3D volume tokens.
- **Δt-scaled attention** (TaViT) — multiplicative time-emphasis on QK.
- **Time-aware positional embedding for MAE** (L-MAE) — add Δt embedding to patch tokens.
- **Time-aware tokenization for multimodal** (TAMME) — sum of type + spec + time + value embeddings.
- **Sequence-aware diffusion conditioning** (SADM) — handles missing frames at training/inference.
- **Trajectory-aligned neighborhood loss** (LNE) — for the "progression manifold" prior.
- **TTE pretraining** (Huo et al.) — losses for predicting time-to-event distributions across thousands of EHR-derived endpoints.
- **Patient health timeline tokenizer** (ETHOS, Foresight, CoMET) — for the EHR side; can interleave with imaging tokens.

### 12.3 Evaluation benchmarks ready to use
- **RECIST 1.1** automation — open systematic review (Cancers 2025) sets baselines. Use multi-time-point CT cohorts (DeepRECIST, internal lung-cancer / hepatic-mets).
- **INSPECT** — Stanford PE longitudinal CT + EHR + report; perfect testbed.
- **3D-RAD multi-temporal subset** — VQA + longitudinal diagnosis; NeurIPS 2025 leaderboard.
- **ADNI MCI-conversion 1/2/3-year horizons** — gold-standard brain longitudinal Hold-out.
- **NLST 1–6 yr risk** — Sybil baseline; we should add ≥2-screen-history input.
- **HECKTOR PFS C-index** — multi-center 1200+ pts.
- **BraTS-Reg / BraTS 2024 post-treatment** — longitudinal glioma.
- **TADPOLE** — 5-year monthly forecast of Dx, ADAS-Cog13, ventricle volume.
- **OPHDIAT (DR) / AREDS (AMD)** — non-3D control modalities to cross-check.

### 12.4 Likely losses for Direction A
- L = α·**IA-MVM** (interval-aware masked volume modeling, reconstruction)
- + β·**NVP-LS** (next-volume prediction in latent space, MSE or flow-matching)
- + γ·**CMTC** (cross-modal temporal contrast: align volume(t) with text/EHR window around t, push apart with same patient at t')
- + δ·**TTE head** (Huo-style time-to-event auxiliary across thousands of endpoints; only requires longitudinal labels at fine-tune)
- + ε·**Trajectory-manifold loss** (LNE-style, optional, for representation geometry)
- Encoder: 3D-ViT or U-Net-ViT-hybrid à la M3T/CT-ViT/SwinUNETR, with Fourier(Δt) added to patch tokens + Δt-scaled cross-visit attention.

---

## Appendix: One-line summaries of papers covered

| § | Paper | Year | Modality | Time-aware? | Foundation? |
|---|-------|------|----------|-------------|-------------|
| 1.1 | Merlin | 2024 | 3D CT | No (label-time only) | Yes |
| 1.2 | CT-CLIP | 2024 | 3D CT | No | Yes |
| 1.3 | CT-FM | 2025 | 3D CT | No | Yes |
| 1.4 | RadFM | 2023→2025 | 2D+3D mix | No | Yes |
| 1.5 | M3FM | 2025 | 3D CT | No (single scan) | Yes |
| 1.6 | SuPreM | 2024 | 3D CT | No | Yes (supervised) |
| 1.7 | VoCo | 2024 | 3D CT/MRI | No | Yes |
| 1.8 | 3DINO | 2025 | 3D CT/MRI/PET | No | Yes |
| 1.9 | BrainIAC | 2026 | 3D MRI | No | Yes |
| 1.10 | MedSAM2 | 2025 | 3D + video | Frame-only | Yes (seg) |
| 1.11 | Aerts cancer FM | 2024 | 3D lesion | No | Yes |
| 1.12 | BTB3D | 2025 | 3D CT | No | Yes (tokenizer) |
| 1.13 | Triad | 2025 | 3D MRI | No | Yes |
| 1.14 | VISTA3D | 2025 | 3D | No | Yes (seg) |
| 1.15 | Decipher-MR | 2026 | 3D MRI | No | Yes |
| 1.16 | MedImageInsight | 2024 | 2D mixed | No | Yes (emb) |
| 1.17 | BiomedGPT | 2024 | 2D+ | No | Yes |
| 1.18 | BioViL-T | 2023 | 2D CXR | Yes (pair) | Yes |
| 1.19 | EchoPrime/EchoFM | 2024–26 | US video | Frame-only | Yes |
| 1.20 | NeuroSTORM | 2026 | 4D fMRI | Intra-scan | Yes |
| 2.1 | TTE Pretraining | 2025 | 3D CT | Label-time | Pretrain |
| 2.3 | Sybil | 2023 | 3D LDCT | Label-time | No |
| 3a.1 | LSSL | 2020 | 3D MRI | Pair | No |
| 3a.2 | LNE | 2021 | 3D MRI | Pair | No |
| 3a.3 | STAMP | 2025 | 2D/3D | Pair | Pretrain |
| 3a.4 | TeViT/TaViT | 2022/23 | 3D CT | Yes (Δt) | No |
| 3a.5 | LongFormer-MRI | 2024 | 3D MRI | Multi | No |
| 3a.6 | MambaX-Net | 2025 | 3D MRI | Pair | No |
| 3b.1 | SSL-AD | 2025 | 3D MRI | Multi | Pretrain |
| 3b.2 | CRONOS | 2025 | 3D | Continuous | No (forecaster) |
| 3b.3 | 3DTINC | 2024 | 3D OCT | Multi | Pretrain |
| 3b.4 | L-MAE | 2024 | 2D fundus | Yes (Δt+sev) | Pretrain |
| 3b.6 | TAMME | 2025 | Mixed | Yes (Δt) | No |
| 3c.1 | LEARNER | 2024 | 2D US/MRI | Implicit | Pretrain |
| 3c.2 | ChronoCon | 2026 | 2D Xray | Order | No |
| 4.1 | TADPOLE | 2018–21 | Mixed | Yes | Benchmark |
| 4.6 | BrLP | 2025 | 3D MRI | Yes | No (generative) |
| 5.2 | Xu/Mak/Aerts | 2021 | 3D CT | Multi | No |
| 6.1 | SADM | 2023 | 3D MRI | Multi | Generative |
| 6.2 | Forecasting Future Anatomies | 2025 | 3D MRI | Single→single | No |
| 6.3 | TimeFlow | 2025 | 3D MRI | Continuous | No |
| 6.4 | Temporal Flow Matching | 2025 | 3D | Irregular | Generative |
| 6.5 | Latent Flow Matching | 2026 | 3D MRI | Yes | Generative |
| 6.6 | CLDM (MICCAI 2025) | 2025 | 2D+3D | Irregular | Generative |
| 6.7 | ImageFlowNet | 2025 | 2D+ | Irregular | No |
| 7.1 | Time2Vec | 2019 | — | Yes | Module |
| 8.3 | IRENE | 2023 | Mixed | No | Yes |
| 8.4 | ETHOS | 2024 | EHR | Yes | Yes |
| 8.5 | Foresight | 2024 | EHR | Yes | Yes |
| 8.6 | CoMET | 2025 | EHR | Yes | Yes |
| 8.7 | MAIRA-2 | 2024 | 2D CXR | Pair | Yes |
| 9.1 | 3D-RAD | 2025 | 3D | Multi | Benchmark |
| 9.3 | INSPECT | 2023 | 3D CT+EHR+rpt | Yes | Benchmark |
| 9.4 | NLST | 2002–11 | 3D LDCT | Yes (3 rounds) | Benchmark |
| 9.5 | BraTS-Reg / 2024 | 2022–24 | 3D MRI | Pair / Multi | Benchmark |
| 9.6 | HECKTOR | 2020–25 | 3D PET/CT | Outcome | Benchmark |

**Total tracked papers / artifacts: ~75.**

---

*End of review.*
