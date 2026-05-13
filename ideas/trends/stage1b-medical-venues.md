# Stage 1B: Medical Venue Trending Papers

> Compiled 2026-05-13. ~95 papers across Nat Med / NEJM AI / Lancet DH / Nat BME / npj DM / MIA / IEEE TMI / Radiology / JAMA Open / MICCAI 2024–2025 / medRxiv / arXiv.

## C. Top Tier Journals (Nat Med / NEJM AI / Lancet DH / Nat BME)

### C1. Diagnostic / Prognostic FMs

- **TITAN: Multimodal Whole-Slide FM for Pathology** — Nat Med 2025, Ding/Mahmood (Harvard/BWH). 335,645 WSIs, SSL + report alignment; SOTA rare-cancer dx, survival, zero-shot reports. **FM**.
- **PanDerm: Multimodal Vision FM for Clinical Dermatology** — Nat Med 2025, Yan (Monash). 2M derm images × 4 modalities; +11–16.5% clinician dx; SOTA 28 benchmarks at 10% labels. **FM**.
- **EchoCLIP / EchoPrime** — Nat Med 2024 + Nature 2025, He/Zou (Stanford). >12M echo video–report pairs, multi-view contrastive. **FM**.
- **CONCH v1.5 / TITAN line** — Nat Med 2025, Mahmood. Multimodal slide-level FM extending CONCH for diagnostic report gen. **FM**.
- **Medical LLM for Diagnostic Reasoning Across Specialties** — Nat Med 2025 (s41591-025-03520-1). 176B med-LLM matches specialists on common + rare diseases. **FM**.
- **BUSGen: Generative FM for Breast Ultrasound** — Nat BME 2026. 3.5M breast US images; downstream cls/seg/aug. **FM**.
- **ECGFounder** — NEJM AI 2025, PKU Digital Health. 10.77M ECGs / 1.82M subjects / 150 labels; AUROC >0.95 on 80 dx. **FM**.
- **SpikeNet2** — NEJM AI 2025. 17,812 EEGs / 13,523 patients; expert-level epilepsy markers. *Task-specific.*
- **AMIE: Differential Dx with LLMs** — Nature 2025, Google DeepMind. Clinician-aid mode beats search + standard resources. **FM**.

### C2. Clinical Deployment / Evaluation Studies

- **Nationwide AI Mammography Real-World Implementation** — Nat Med 2024/25 (s41591-024-03408-6). Population-level deployment.
- **AI Improves Breast Cancer Detection in Mammography Screening** — Nat Med 2025. Prospective 463,094 women, 119 radiologists, 12 German sites; +17.6% detection.
- **Mammography AI Triage Paired Non-Inferiority Trial** — Nat Med 2026. 63.6% workload reduction, +15.2% cancer detection.
- **ScreenTrustMRI** — Nat Med 2024. RCT; AI for supplemental breast MRI selection.
- **Reliability of LLMs as Medical Assistants for General Public** — Nat Med 2025 (RCT). Lay users id'd <34.5% with LLM vs 94.9% solo. 警告 paper.
- **Automation Bias in LLM-Assisted Dx (AI-literate physicians)** — NEJM AI 2025. 44 physicians; **14% accuracy decrease** from erroneous LLM suggestions despite AI-literacy training.
- **Pragmatic Trial Playbook for Ambient AI** — NEJM AI 2025. 66 providers, 8 specialties.
- **GPT-4 Assistance for Physician Performance RCT** — Nat Med 2024. 92 physicians; +6.5% reasoning quality.
- **Verifying Facts in LLM-Generated Patient Care Documents via EHR** — NEJM AI 2025.
- **LLMs in Clinical Reasoning Script Concordance Benchmark** — NEJM AI 2025. LLMs UNDERPERFORM vs MCQA benchmarks.
- **"Show Us the Evidence for the Value of Medical AI"** — Nat Med 2026 editorial.
- **How to Meaningfully Evaluate AI in Clinical Medicine** — Nat Med 2026.
- **Scaling Medical AI Across Clinical Contexts** — Nat Med 2025. Generalization, fine-tuning, RAG limits.

### C3. Multimodal Patient FMs

- **CT-CLIP / CT-CHAT** — Nat BME 2025 (s41551-025-01599-y), Hamamci. 25,692 chest CT + reports; zero-shot multi-abnormality + chat. **FM**.
- **FM-HCT: 3D FM for Head CT** — Nat BME 2026. SSL on 361,663 head CTs. **FM**.
- **Prima: Neuroimaging from Health System-Scale Data** — Nat BME 2025. 220,000 MRI studies, hierarchical ViT, clinical-MRI native. **FM**.
- **HONeYBEE: Multimodal AI in Oncology via FM Embeddings** — npj DM 2025. 多模态 (clinical / WSI / radiology / molecular) unified embedding. **FM**.
- **MIRAGE: Multimodal FM for Retinal OCT** — npj DM 2025. OCT + SLO. **FM**.
- **Multimodal VLM for Ophthalmology** — npj DM 2025. **FM**.
- **PathOrchestra** — npj DM 2025. 287,424 slides, 21 tissues, >0.95 acc on 47 tasks. **FM**.
- **Decipher-MR: VL FM for 3D MRI** — npj DM 2026. 200K series / 22K studies, report-guided text supervision. **FM**.
- **MEME: Pseudo-Notes from EHR Streams** — npj DM 2025. 400,019 ED visits.
- **DT-GPT: LLM Forecasts Patient Health Trajectories (Digital Twins)** — npj DM 2025. EHR-native forecasting w/o imputation.
- **Transformer Patient Embedding from EHR** — npj DM 2025. 1M events / 102K patients (eMERGE); AUROC 0.87 future disease.
- **Adaptability of Shared EHR FM Multi-Center** — npj DM 2024. Stanford EHR FM transfers; +13% low-label. **FM**.
- **Global RETFound** — Nat Med 2025. 100M eye images >65 countries. **FM**.
- **FM for Clinician-Centered Drug Repurposing** — Nat Med 2024. KG-based. **FM**.

### C4. Generative / Synthetic Data

- **ChexGen: Generative FM for CXR** — NEJM AI 2025. LDM transformer; 960k radiograph-report pairs; text/mask/bbox guided + fairness debiasing. **FM**.
- **MINIM: Self-Improving Generative FM for Medical Synthesis** — Nat Med 2024/25. Unified medical image-text generator. **FM**.
- **Clinical Validation of Generative AI for CXR Reporting Multicohort** — Radiology 2025.
- **Domain-Specific Multimodal Generative AI for CXR Report Gen** — Radiology 2025. 87.6% clinical acceptance.
- **Efficiency/Quality of Generative AI-Assisted CXR Reporting** — JAMA Open 2025. 11,980 model-assisted; +15.5% efficiency.
- **Generative AI in Medical Image Synthesis (Review)** — Lancet DH 2025.
- **Crossmodal Gene Expression from Pathology (PathGen)** — Nat Commun 2025.

### C5. Safety / Bias / Regulation

- **Foundation Models in Medicine are a Social Experiment** — npj DM 2025. Ethics framework.
- **Rethinking Clinical Trials for Medical AI with Dynamic Deployments** — npj DM 2025.
- **Scoping Review and Evidence Gap of Clinical AI Fairness** — npj DM 2025.
- **The Limits of Fair Medical Imaging AI in Real-World Generalization** — Nat Med 2024, Ghassemi (MIT). Subgroup-shortcut under shift.
- **Bias Recognition and Mitigation Strategies** — npj DM 2025.
- **General Framework for Governing Marketed AI/ML Medical Devices** — npj DM 2025.
- **Responsible Adoption of Multimodal AI in Health Care** — Lancet DH 2025.
- **Rapid Generative AI Rollout in Health Care** — Lancet DH 2025.
- **Generative AI in Medicine — Progress and Challenges** — NEJM Sounding Board 2025.
- **Evaluation Framework for Ambient Digital Scribing** — npj DM 2025.
- **Policy Brief: Ambient AI Scribes and the Coding Arms Race** — npj DM 2025.
- **Generative AI and FMs in Radiology Review** — Radiology 2025.

---

## D. Medical Imaging Tech Journals (MIA / IEEE TMI / npj Imaging)

### D1. 3D Imaging FMs

- **Merlin** — Nature 2026 / arXiv 2406.06512, Stanford. 6M+ images / 15,331 CTs + EHR + reports; single-GPU; +24.7% over CT-CLIP. **FM**.
- **CT-FM** — arXiv 2501.09001, AIM Harvard. 148,000 CTs (IDC); label-agnostic contrastive. **FM**.
- **VISTA3D** — CVPR 2025, NVIDIA. Unified 3D segmentation FM. **FM**.
- **Triad** — arXiv 2502.14064. Triad-131K (largest 3D MRI corpus); +6.88% nnUNet seg across 17 datasets. **FM**.
- **MedDINOv3** — arXiv 2509.02379. CT-3M (3.87M slices), DINOv3 adaptation. **FM**.
- **3DINO-ViT** — npj DM 2025. ~100k 3D scans / 10+ organs. **FM**.
- **VL FM for 3D Medical Imaging** — npj AI 2025. Review/methods.
- **FM-Guided Multi-View Semi-Supervised CT Liver Tumor Seg** — npj DM 2025.

### D2. Pathology / Histology FMs

- **UNI / UNI2** — Nat Med 2024. UNI2 (Jan 2025): 200M+ images / 350K+ WSIs (H&E + IHC). **FM**.
- **Virchow** — Nat Med 2024, Paige. 1.5M WSIs / 100K patients; 16 cancer types incl. 7 rare. **FM**.
- **Prov-GigaPath** — Nature 2024, Microsoft + Providence. 1.3B tiles / 171,189 WSIs / 31 tissues. **FM**.
- **CONCH** — Nat Med 2024, Mahmood. Image+text pathology FM. **FM**.
- **MedCLIP-SAMv2** — MIA 2025. Text-driven medical seg + SAM, BiomedCLIP-based.
- **PathOrchestra** (above)
- **UAD-FM** — npj DM 2025. CRC pathology w/ TTA + causal.
- **SPARK Agentic Framework for Cancer Pathology** — Nat Med 2026.

### D3. Vision-Language for Radiology

- **MAIRA-2: Grounded Radiology Report Generation** — Microsoft 2024/25. Image-encoder + LLM; grounded CXR; SOTA MIMIC-CXR. **FM**.
- **RaDialog** — MIDL 2025. LLM + visual + structured findings; PEFT.
- **MIMO: Medical VLM with Visual Referring Multimodal Input** — CVPR 2025.
- **MRG-LLM: Dynamic-Prompt RRG** — 2025.
- **µ² Tokenizer: Differentiable Multi-Scale Multimodal Tokenizer for RRG** — MICCAI 2025.
- **MedDual: Dual-Decoding for Hallucination in Medical VLMs** — MICCAI 2025 oral.
- **MedM-VL: What Makes a Good Medical LVLM?** — MICCAI 2025.

### D4. Self-Supervised Pretraining Recipes

- **SurgeNet / SurgeNetXL: Scaling SSL for Surgical FM** — MIA 2025. **FM**.
- **3DINO-ViT** (above) — npj DM 2025. **FM**.
- **UltraFedFM: Federated Ultrasound FM with SSL** — npj DM 2025. 16 clients / 9 countries / 1M+ unlabeled US; AUROC 0.927. **FM**.
- **FDAS: FM Distillation + Anatomic Structure-Aware Multi-Task SSL** — MICCAI 2025. SAM-guided structure-aware MIM.
- **BiomedParse: Unified Biomedical Image Analysis** — Nat Methods 2024. **FM**.
- **REMEDIS: Robust Data-Efficient SSL for Diagnostic Imaging** — Nat BME 2023 (still heavily cited 2025).

### D5. Robustness / OOD / Distribution Shift

- **MedSegX: Generalist FM for Open-World Medical Image Seg** — Nat BME 2025. MedSegDB + ConMoAE adapter. **FM**.
- **Bias & Generalizability of FMs in Mammography** — MICCAI 2025.
- **BiasICL: ICL and Demographic Biases of VLMs** — MICCAI 2025.
- **FM Robustness to Technical Acquisition Parameters (RAD-DINO vs CheXzero)** — NEJM AI / medRxiv 2026. RAD-DINO most stable; CheXzero collapses externally.
- **The Architectural Gap in Clinical AI** — Lancet DH 2026. Deployment gap.
- **Embedded SAM for Resource-Limited Healthcare** — npj DM 2025.

---

## E. MICCAI 2024 / 2025

### E1. Best Papers and Oral Picks

- **Fit Pixels, Get Labels: Meta-Learned Implicit Networks for Segmentation** — MICCAI 2025 Best Paper, Rice.
- **Multifrequency Neural Network-Based Wave Inversion** — MICCAI 2025 Best Paper, Charité (elastography).
- **Learning Segmentation from Radiology Reports (R-Super)** — MICCAI 2025 Best Paper. Weak supervision reports→masks.
- **Concept-Driven Logical Rules for Interpretable & Generalizable Medical Image Classification** — MICCAI 2025 Young Scientist Award (Yibo Gao).
- **RoCoSDF: Row-Column Scanned Neural SDFs for Freehand 3D US** — MICCAI 2024 Best Paper.
- **ORacle: VLM for OR Domain Modeling** — MICCAI 2024 runner-up, TUM Navab group.
- **DB-SAM: Dual-Branch Universal Medical Image Segmentation** — MICCAI 2024 Oral.

### E2. Foundation Model Track

- **Curriculum Prompting FMs for Medical Image Seg** — MICCAI 2024.
- **M4oE: FM for Medical Multimodal Image Seg** — MICCAI 2024. MoE. **FM**.
- **SAM-Med3D-MoE: Non-Forgetting SAM (3D + MoE)** — MICCAI 2024.
- **MedCLIP-SAM** — MICCAI 2024. Text+image+SAM.
- **DeSAM: Decoupled SAM** — MICCAI 2024.
- **SAM-aware TTA for Universal Medical Image Seg** — 2025 post-MICCAI workshop.
- **FDAS** (above) — MICCAI 2025. **FM**.
- **SemiT-SAM: FM for Tooth Instance Segmentation on Panoramic** — MICCAI 2024 workshop. **FM**.

### E3. Multimodal Track

- µ² Tokenizer, MedDual, MedM-VL, BiasICL, FM Bias in Mammography (all above).
- **Text-Driven Adaptation of FMs for Few-Shot Surgical Workflow** — MIA 2025.
- **SurgVLM** — arXiv 2506.02555. Built on Qwen2.5-VL; 10+ surgical tasks. **FM**.
- **Surg-3M: Dataset + FM for Perception in Surgical Settings** — arXiv 2503.19740. **FM**.
- **EndoARSS: Spatially-Aware FM for Endoscopic Surgery** — Adv. Intelligent Systems 2025. **FM**.

---

## F. Notable medRxiv / arXiv Preprints

- **Medical Hallucination in Foundation Models** — medRxiv 2025.02.28. Survey.
- **LLM Pipeline Surpassing Physicians in CV Risk Scoring** — medRxiv 2025.11. 5 LLMs in pipeline beats clinicians on unstructured EHR.
- **Benchmarking LLMs and Clinicians (multi-dim clinical quality)** — medRxiv 2025.10.
- **MAX-EVAL-11 Comprehensive Benchmark for LLMs** — medRxiv 2025.10.
- **Leveraging FMs in Maternal & Child Health Systematic Review** — medRxiv 2025.08.
- **AI in Healthcare 2025 Year in Review** — medRxiv 2026.02. Multimodal FMs surged 25→144 publications YoY.
- **Rx-LLM: Safety Benchmarking Suite for LLMs** — medRxiv 2025.12.
- **PsyRoBERTa: LLM for Clinical Psychiatry** — medRxiv 2025. 44M Danish clinical notes. **FM**.
- **GMAI-MMBench** — NeurIPS 2024 D&B / arXiv 2408.03361. 284 datasets, 38 modalities, 18 specialties; GPT-4o only 53.96%.
- **MedVersa: Generalist FM for Medical Image Interpretation** — arXiv 2405.07988. **FM**.
- **Foundation Models in Medical Imaging Review** — arXiv 2506.09095.
- **Biomedical Foundation Model Survey** — arXiv 2503.02104.
- **Adaptation of FMs for Medical Image Analysis** — arXiv 2511.01284.
- **Pathology FM Representational Similarity Analysis** — arXiv 2509.15482. UNI2/Virchow2 most distinct; Prov-GigaPath highest avg similarity.
- **AnyMC3D: 2D FMs for Scalable 3D Medical Classification** — arXiv 2512.12887.
- **ORQA: Specialized FMs for Intelligent Operating Rooms** — npj DM 2026. **FM**.
- **CheXNet Reproducibility** — arXiv 2505.06646.
- **CARE-AD: Multi-Agent LLM for Alzheimer's via Longitudinal Notes** — npj DM 2025.
- **Hopkins LLM: Multimodal EHR Predictive Analytics** — npj DM 2026. 7B Llama on 42,160 JHH patients. **FM**.

---

**Total: ~95 papers** with venue / lead / 1-line / FM-vs-task-specific tag.
