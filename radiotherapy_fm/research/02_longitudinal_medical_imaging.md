# Longitudinal / Multi-Timepoint Medical Imaging Modeling — Survey (2022-2026)

**Scope.** Survey of longitudinal medical imaging work for the radiotherapy FM project. Focus: does a longitudinal 3D medical foundation model exist? Which architectural patterns work? What RT-specific evaluation tasks are publishable?

**TL;DR for the team.**
1. **No published "longitudinal 3D medical foundation model" exists.** Every 3D imaging FM we found (Merlin, BrainIAC, FM-CT, Triad, CT-CLIP, SPECTRE, SAM-Med3D, MIS-FM) treats each scan as an independent volume. The closest is **STAMP (Dec 2025)**, a Siamese MAE with time-conditioning — but it is small-scale and evaluated only on OCT + a 2D-slice MRI subset, not a "foundation" deployment. Time-to-event pretraining (Huo et al., Nov 2024) is the only large 3D-CT effort that even consumes time information, and it injects time from EHR labels, not from multi-timepoint images.
2. **Longitudinal modeling is well-studied at the task level** (response, recurrence, toxicity, dose accumulation, change detection) but always with bespoke architectures on small cohorts, not as pretraining at FM scale.
3. **The radiotherapy domain is essentially unmined.** Planning CT + weekly CBCT + follow-up CT/MRI is exactly the longitudinal multi-modality regime that no FM has been pretrained on. This is the project's opening.

---

## 1. Does any longitudinal 3D medical foundation model exist?

**Answer: no — the prior is correct.** Reviewed candidates:

| Model | Venue / Year | 3D? | Longitudinal? | Notes |
|---|---|---|---|---|
| Merlin (Blankemeier et al.) | Nature Med 2025 / arXiv 2406.06512 | Yes (CT) | **No** — single CT + EHR pairing | Uses EHR diagnosis codes + report at inference, but image input is one scan. |
| BrainIAC (Tak et al.) | Nat Neurosci 2026 / medRxiv 2024 | Yes (MRI) | Single-scan SSL; *time-to-stroke* is a downstream task but uses only one scan | 48,965 scans, 7 tasks, no multi-visit fusion. |
| FM-CT (Wood et al.) | Nat Biomed Eng 2026 / arXiv 2502.02779 | Yes (head CT) | No | 361k head CTs, SSL only. |
| Triad | arXiv 2502.14064 (2025) | Yes (MRI) | No | SSL ViT on MRI. |
| CT-CLIP / CT-CHAT | 2024 | Yes (chest CT) | No | Vision-language, single scan. |
| SPECTRE | arXiv 2511.17209 (Nov 2025) | Yes (CT) | No | Cross-modal pretraining, single scan. |
| MIS-FM, SAM-Med3D | 2023-24 | Yes | No | Segmentation foundation models. |
| **Time-to-Event Pretraining** (Huo et al., Stanford) | arXiv 2411.09361 (Nov 2024) | Yes (CT, 2D slices) | *Pretrains on time-to-event from longitudinal EHR labels, but each CT is still a single timepoint*. +23.7% AUROC. The first FM-scale work to use temporal signal at all. | Closest precedent. |
| STAMP (Stochastic Siamese MAE) | arXiv 2512.23441 (Dec 2025) | Mixed (OCT 3D, MRI 2D) | **Yes** — Siamese MAE conditioned on Δt | Small-scale; not "foundation" — pretrained ViT on OCT + ADNI. **Direct prior art for our approach.** |
| L-MAE | Comput Biol Med 2024 / arXiv 2403.16272 | 2D fundus | Yes | Time-aware positional embedding + progression-aware masking. |
| 3DTINC | IEEE TMI 2024 / arXiv 2312.16980 | 3D OCT | Yes | Time-equivariant non-contrastive SSL. |

**Conclusion.** No one has done a *large-scale, 3D, longitudinal, multi-modality* (CT+CBCT+MRI) foundation model. STAMP + Time-to-Event-Pretraining together suggest the technical recipe is ready; nobody has executed it at FM scale on RT data.

---

## 2. Architectural patterns for multi-timepoint 3D imaging

### 2.1 Siamese / change-detection encoders

- **STAMP — Stochastic Siamese MAE Pretraining for Longitudinal Medical Images** (Emre et al., arXiv 2512.23441, Dec 2025). Two MAE branches share weights; reconstruction loss reframed as conditional VI objective conditioned on Δt between scans. Outperforms temporal MAEs + FMs on AMD + ADNI Alzheimer's progression.
- **Siamese U-Transformer for MS change detection on brain MRI** (medRxiv 2024). Pairwise registered MRI → per-voxel new-lesion mask. Strong external validation.
- **Longitudinal CE-MRI Siamese for HCC after DEB-TACE** (Cancer Imaging 2025). Two-branch CNN + ML fusion for tumor response.
- **Siamese networks for continuous disease severity / change detection** (Li et al., 2020) — early seminal change-detection siamese paper.
- **Verdict.** Effective when only 2 timepoints (baseline + follow-up). Saturates beyond 2. Good RT fit for "planning CT vs final CBCT."

### 2.2 Temporal positional encoding on a 3D ViT

- **L-MAE** (Hassan et al., 2024) — time-difference (Δt in days) injected as additional positional encoding alongside spatial PE. Disease-progression-aware masking.
- **STAMP** uses Δt to condition the stochastic latent rather than as PE — a stronger inductive bias.
- **GLOMIA-Pro** (arXiv 2507.12500, 2025) — *piecewise orthogonal attention* + ordinal-progression constraint to avoid representation collapse between similar adjacent timepoints. Knee OA + esophageal cancer response.
- **OA-BreaCR** (Wang et al., MICCAI 2024, arXiv 2409.06887) — longitudinal attention alignment between prior + current mammograms, ordinal time-to-event loss.
- **Verdict.** Temporal PE is the cheapest add-on to any existing 3D ViT/MAE. Highest engineering ROI for a first-pass FM.

### 2.3 Cross-attention across timepoints

- **LTSA — Longitudinal Transformer for Survival Analysis** (npj Digit Med 2024). Sequence of fundus photos → cross-attention across visits → time-to-event head. Beat single-image baseline 19/20 + 18/20 on AMD/POAG.
- **Temporal Neighboring Multi-modal Transformer + Missingness-Aware Prompt for HCC** (Xu et al., MICCAI 2024, paper 0728). Tokens are CT + temporally-neighboring clinical timeseries; cross-modal attention; explicit missing-modality prompts. 36k patients.
- **Multimodal Fusion Cross-Attention Transformer for HCC Recurrence** (MLMI 2024) — multi-phase CT + clinical, cross-attention fusion.
- **Verdict.** Best when you have ≥3 visits and want global mixing. Handles missing visits gracefully via masking. Strong fit for RT (irregular follow-up schedule).

### 2.4 Recurrent / state-space across visits

- **Δt-Mamba3D — Time-Aware Spatio-Temporal SSM for Breast Cancer Risk** (arXiv 2510.19003, AAAI 2026). Continuous-time selective scan integrates true Δt into Mamba state transitions. +2-5 c-index pts over RNN/Transformer/Mamba baselines for 1-5 yr breast cancer risk. **Most compelling longitudinal architecture in 2025.**
- **Seq2Morph** (Lee et al., Med Phys 2023). VoxelMorph + ConvLSTM for longitudinal DIR on weekly CBCTs. Inverse-consistent.
- **Seq2Seq (lung adaptive RT)** (van Timmeren et al., Radiotherapy & Oncology 2022). ConvLSTM predicts weekly tumor + esophagus geometry from planning CT + prior CBCTs. Achieved 4.2 Gy esophagus dose reduction.
- **VMRA-MaR / LongiMam** (2025) — Vision Mamba RNN for serial mammograms.
- **AD progression transformer vs LSTM/GRU/minimalRNN** (Moghaddami et al., 2025, arXiv 2507.03899) — Transformer wins on TADPOLE.
- **Verdict.** Mamba with explicit Δt-conditioned scan is now state-of-the-art for irregularly-sampled visit series. ConvLSTM still standard for dense CBCT-fraction trajectories in RT.

### 2.5 Pretraining objectives that use time

- **STAMP** — Siamese MAE; reconstruct masked patches of scan B given scan A and Δt. Variational.
- **L-MAE** — disease-progression-aware masking schedule; severity-aware reconstruction.
- **3DTINC — Time-Equivariant Non-Contrastive Learning** (IEEE TMI 2024). Non-contrastive (BYOL-style) loss that is *equivariant* to time-difference between intra-patient scans. Predicts AMD conversion.
- **Time-to-Event Pretraining** (Huo et al., Stanford, Nov 2024). 18,945 CTs + EHR-derived time-to-event distributions across thousands of tasks. Pretrain to predict time-to-event hazards.
- **SADM — Sequence-Aware Diffusion** (Yoon et al., IPMI 2023, arXiv 2212.08228). Diffusion conditioned on a sequence-aware transformer — generates *next* longitudinal frame, handles missing data.
- **Pretrain hierarchy that lifts to RT:**
  1. Spatial SSL on single scans (VoCo, MIS-FM-style geometric contrastive).
  2. Temporal SSL on multi-visit pairs (STAMP, 3DTINC).
  3. Generative next-visit (SADM-style) — also gives a counterfactual generator for dose/response.
  4. Time-to-event hazard heads (Huo et al.) using RT outcomes.

---

## 3. Radiotherapy-specific longitudinal work

### 3.1 Response prediction from baseline + mid-treatment imaging

- **Integrated pretreatment + midtreatment CT for NSCLC response** (Int J Radiat Oncol Biol Phys, 2025, S0360-3016(25)00371-2). AUC 0.869 vs single-timepoint 0.798 — direct evidence that adding mid-treatment scan helps.
- **Baseline + adaptive sim CT for pharyngeal cancer** (PMC 12606737, 2025). Contrastive learning + ensemble. AUC 0.773 / 0.747 / 0.793 for local recurrence / nodal relapse / distant metastasis.
- **Apriori chemo response prediction in LABC: transformer vs transfer learning** (PMC 11096486, 2024).
- **ESCC radiotherapy response radiomics ANN** (Sci Rep 2023).
- **Multimodal lung RT response prediction** (PMC 12504048, 2024).

### 3.2 Daily CBCT trajectory modeling

- **Comparing 3D deformations between longitudinal daily CBCTs using CNN for HN toxicity** (arXiv 2303.03965). DVFs from daily CBCT → toxicity classifier.
- **CBCT delta-radiomics for early response in LA-NSCLC** (2019, foundational).
- **CBCT delta-radiomics for lung toxicity** (Red Journal 2022, S0360-3016(22)01655-8).
- **Seq2Morph longitudinal CBCT DIR** (Med Phys 2023).
- **Inter-fraction DIR unsupervised for CBCT abdomen** (arXiv 2208.13686).

### 3.3 Recurrence prediction

- **Locoregional recurrence 3D DL on radiotherapy images** (PMC 8875706). AUC 0.856 → 0.892 with clinical.
- **HNSCC recurrence radiomics + target volume approach** (PMC 8320130).
- **RADAR-CARE early NSCLC recurrence multimodal DL** (JCO Precision Oncol 2025).
- **Longitudinal + multimodal radiomics for HNC outcome** (PMC 9913206).

### 3.4 Dose accumulation across fractions

- **Deformable dose accumulation is required for ART** (Zhong et al., J Appl Clin Med Phys 2024, 10.1002/acm2.14457). Position paper.
- **DIR uncertainty-encompassing dose accumulation for ART** (IJROBP 2025, S0360-3016(25)00371-2).
- **DL-based DIR uncertainty for contour propagation + dose accumulation in online ART** (ResearchGate 374656958, 2023).
- **Probabilistic dose accumulation for HN online vs triggered offline adaptation** (Phys Med Biol 2024).

### 3.5 Toxicity prediction (longitudinal imaging)

- **RTOG 0522 3D rCNN xerostomia from planning CT + dose** (Men et al., 2019). 784 patients.
- **CT delta-radiomics weekly parotid → xerostomia** (multiple, 2022-24).
- **Multi-channel fusion DL for xerostomia** (PMC 12312364, 2025).
- **Early post-RT MRI CNN for toxicity (murine HN)** (PMC 12490106, 2025).

### 3.6 MR-Linac / MRgRT longitudinal

- **Longitudinal ADC on MR-Linac for prostate response** (PubMed 37341194, 2023). ADC as response biomarker.
- **AI-based in-treatment change detection on prostate MR-Linac** (arXiv 2602.04983).
- **Deep learning in MRgRT systematic review** (Eidex et al., J Appl Clin Med Phys 2024).
- **MR-Linac radiomics repeatability** (Xue et al., Med Phys 2021).

---

## 4. How are timepoints aligned in existing work?

Three strategies, no clear winner; all are used:

1. **Hard registration → common coordinate frame.** Most RT work (Seq2Morph, CBCT delta-radiomics, DIR-based dose accumulation, MS lesion change-detection). Pros: voxel-aligned, change maps trivial. Cons: registration errors compound; deformation = signal, not nuisance.
2. **Per-timepoint embedding → attention/RNN across embeddings.** LTSA, OA-BreaCR, TNMT-HCC, Δt-Mamba3D. Pros: no registration step, handles different FOVs/modalities. Cons: spatial correspondence lost — pure global features.
3. **Resample to common grid + temporal channel.** Older delta-radiomics, some siamese variants. Cleanest for change maps but rigid to FOV mismatch.

**Hybrid (likely best for RT FM):** affine-align scans → per-patch tokens with spatial PE + temporal PE → cross-attention across timepoints. STAMP + GLOMIA-Pro both move in this direction.

---

## 5. Published evaluation tasks (what referees expect)

| Task family | Representative endpoints | Datasets / cohorts |
|---|---|---|
| Treatment response | RECIST / volumetric response at 3-6 mo (AUC) | NSCLC, ESCC, HCC, HNC, breast |
| Time-to-recurrence | Locoregional, nodal, distant (C-index, 1/3/5 yr AUC) | HNSCC, NSCLC, prostate |
| Survival | OS, PFS (C-index, Brier score) | brain tumor (BrainIAC), HNC, lung |
| Toxicity | Xerostomia, esophagitis, pneumonitis, GU/GI (AUC) | RTOG 0522, HN cohorts |
| Dose accumulation | DVH agreement vs ground truth, target/OAR dose error | HN, cervix, prostate ART |
| Change detection | New-lesion Dice, sensitivity/specificity | MSSEG2, spine met, brain met |
| Next-visit prediction | Image similarity (SSIM/PSNR), DVF accuracy | Lung CBCT (Seq2Seq), brain MRI (SADM) |
| Progression classification | Stage transitions (ordinal AUC) | ADNI, AMD, knee OA |

---

## 6. Synthesis — what to build

**Recommended FM-prep stack for RT:**

1. **Backbone.** 3D ViT (Triad/Merlin-class) with patch-level spatial PE.
2. **Temporal conditioning.** Δt-conditioned cross-attention across timepoint tokens (STAMP + Δt-Mamba3D style). Avoid pure ConvLSTM — caps at small backbones.
3. **Pretraining objectives, sequenced:**
   - (a) single-scan MAE on planning CT / CBCT / follow-up CT / MRI.
   - (b) Siamese MAE conditioned on Δt (STAMP).
   - (c) Next-visit prediction (SADM-flavored).
   - (d) Time-to-event hazard head over EHR outcomes (Huo et al.).
4. **Alignment.** Affine-register all scans to planning CT frame; let attention handle residual deformation.
5. **Downstream eval suite.** Response, recurrence, toxicity, dose-accumulation-improvement, MS-style change detection — exactly the published task families above.

**What makes this novel vs literature:**
- First *3D, multi-modality, longitudinal* pretrained FM (CT + CBCT + MRI).
- First FM evaluated on RT-native endpoints (dose accumulation, fractionwise toxicity).
- First FM to combine STAMP-style temporal SSL with time-to-event hazards on imaging.

**Risks already addressed in literature:**
- Representation collapse from similar adjacent visits → GLOMIA-Pro's ordinal constraint.
- Irregular visit timing → Δt-Mamba3D / STAMP Δt-conditioning.
- Missing modalities → TNMT-HCC missingness-aware prompts.

---

## 7. Key references (master list)

**Longitudinal SSL / pretraining**
- Emre T. et al. STAMP: Stochastic Siamese MAE Pretraining for Longitudinal Medical Images. arXiv:2512.23441, 2025.
- Hassan E. et al. L-MAE. Comput Biol Med 2024 / arXiv:2403.16272.
- Emre T. et al. 3DTINC. IEEE TMI 2024 / arXiv:2312.16980.
- Huo Z. et al. Time-to-Event Pretraining for 3D Medical Imaging. arXiv:2411.09361, 2024 (Stanford).
- Yoon J.S. et al. SADM. IPMI 2023 / arXiv:2212.08228.

**Longitudinal architectures**
- arXiv 2510.19003. Δt-Mamba3D for Breast Cancer Risk. AAAI 2026.
- arXiv 2507.12500. GLOMIA-Pro. 2025.
- arXiv 2409.06887. OA-BreaCR. MICCAI 2024.
- Xu J. et al. Temporal Neighboring Multi-modal Transformer for HCC. MICCAI 2024.
- LTSA. npj Digit Med 2024.
- Moghaddami M. et al. Transformer for AD progression. arXiv:2507.03899, 2025.
- VMRA-MaR. arXiv:2506.17412, 2025.

**3D FMs (single-scan baselines)**
- Blankemeier L. et al. Merlin. Nat Med 2025 / arXiv:2406.06512.
- Tak D. et al. BrainIAC. Nat Neurosci 2026 / medRxiv 2024.12.02.
- Wood D. et al. FM-CT (head CT). Nat Biomed Eng 2026 / arXiv:2502.02779.
- Triad MRI FM. arXiv:2502.14064.
- SPECTRE CT. arXiv:2511.17209.
- CT-CLIP / CT-CHAT.

**Radiotherapy-specific longitudinal**
- Lee J. et al. Seq2Morph. Med Phys 2023, 10.1002/mp.16026.
- van Timmeren et al. Seq2Seq predictive ART planning. Radiother Oncol 2022.
- IJROBP S0360-3016(25)00371-2. Pre+mid-treatment CT for NSCLC response. 2025.
- PMC 12606737. Baseline + adaptive sim CT for pharyngeal cancer. 2025.
- PMC 8875706. 3D DL for locoregional recurrence.
- arXiv 2303.03965. Longitudinal daily CBCT CNN for HN toxicity.
- Zhong H. et al. Deformable dose accumulation for ART. J Appl Clin Med Phys 2024.
- Men K. et al. RTOG 0522 3D rCNN xerostomia. 2019.
- Eidex et al. Deep learning in MRgRT systematic review. J Appl Clin Med Phys 2024.

**Change detection**
- Siamese U-Transformer for MS. medRxiv 2024.04.05.
- MSSEG2 challenge (MICCAI baseline benchmark).
- Time Travelling Pixels (remote sensing, foundation model approach — transferable). arXiv:2312.16202.
- Spine CT longitudinal registration. arXiv:2402.09341.
