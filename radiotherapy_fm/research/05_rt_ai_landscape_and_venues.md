# RT AI Landscape and Target Venues (2023-2026)

Survey for the Mayo longitudinal RT foundation model project. Goal: identify what is hot, what is saturated, where a single-institution FM paper realistically lands, and what reviewer concerns to preempt from day one.

Scope: papers 2023-mid 2026 in Nature Medicine, Nature Communications, npj Digital Medicine, Lancet Digital Health, Nature Machine Intelligence, JAMA Oncology, Med Image Anal, IJROBP (Red Journal), Radiother Oncol (Green Journal), Med Phys, plus relevant arXiv/MICCAI.

---

## (a) Recent landmark papers, by venue and contribution type

| Year | First/senior | Title (short) | Venue | Contribution type | Why it landed |
|------|--------------|---------------|-------|-------------------|---------------|
| 2024 | Pai / Aerts (HMS-AIM) | Foundation model for cancer imaging biomarkers (FMCIB) | Nat Mach Intell | Self-supervised 3D CT FM, 11,467 lesions, biomarker discovery | First broadly-validated 3D oncology imaging FM; downstream tasks across cancers |
| 2024 | Pai / Aerts | FMCIB embeddings for quantitative tumor imaging biomarkers | Nat Comms (follow-on) | Biomarker transfer | Generalization across 6 oncology endpoints |
| 2025 | Lu / Mahmood (BWH) | MUSK: multimodal unified self-supervised oncology (pathology + text) | Nature | Multimodal FM (50M WSI + 1B tokens) | Defined the multimodal-FM bar in oncology |
| 2025 | (npj Digital Medicine) | Multicentre evaluation of DL CT autosegmentation of H&N for RT (7 institutions) | npj Digit Med | Prospective multi-site eval, time-savings + IOV | Real multi-institutional clinical utility data |
| 2025 | Stanford / various | Performance of an AI FM for prostate radiotherapy segmentation | medRxiv (target JCO CCI / Red J) | Disease-specific FM, segmentation | Clear clinical task framing |
| 2024-25 | Court (MDACC) | Radiation Planning Assistant: AI contouring/planning for LMIC | JCO Global Oncol | Deployed system, global impact framing | Translational impact angle |
| 2025 | Chung (MDACC) | KBP fully automated RT planning across 10 sites | Radiother Oncol | Multi-site knowledge-based planning | Practical breadth |
| 2025 | NRG Oncology | Assessment of AI for automatic treatment planning in clinical trials | IJROBP | Consensus + cooperative-group framing | Sets RT-FM evaluation expectations |
| 2025 | Cervix online ART group | Fully Automated Online Adaptive RT Decision-Making (cervix) | IJROBP | Adaptive replan trigger, decision support | Clinical workflow integration |
| 2025 | (HK / multi-site) | DL MRI radiomics for NPC recurrence after chemoradiation (4 hospitals) | Clin Exp Metastasis | Multi-center recurrence prediction | Quintessential outcome paper |
| 2025 | Glioma group (Switzerland) | Physics-informed discrete-loss glioma RT planning | Nat Comms | Physics+data hybrid plan optimization | Methodological novelty + Nat Comms appeal |
| 2024-25 | Kim/Yang (Seoul) | RO-LLaMA / RO-LMM end-to-end breast RT planning via LMM | arXiv (MICCAI 2024) | LMM for RT (summarize -> plan -> segment) | First serious RT-specific LMM attempt |
| 2025 | (medRxiv) | AI synthetic sim-CT from diagnostic CT (sim-free spinal palliative RT) | medRxiv | Generative imaging for sim-free workflow | Workflow re-engineering |
| 2025 | (RADIANT group) | RADIANT: configurable RT dose prediction framework | medRxiv | Generalizable dose prediction backbone | "Pre-trainable" dose generator |
| 2025 | TREAT authors | TREAT: text-guided conditioned DL for generalized RT planning | Springer (MICCAI workshop) | CLIP-text-conditioned dose prediction | Cross-protocol generalization |
| 2025 | (action-model RT) | Transforming multimodal models into action models for RT | arXiv 2502.04408 | RL-conditioned LMM for plan generation | Reframes "RT-GPT" as an agent |
| 2024 | (Lancet Digit Health legacy) | Image-based DL for individualized RT dose (NSCLC) | Lancet Digit Health | Outcome-informed dose individualization | Established the prognostic-FM template |

**Pattern recognition:**
- **Top journals (Nature Med / Nat Comms / Lancet DH)** reward either (i) clearly multimodal + multi-site + outcome-linked, (ii) physics+DL hybrids with new methodology, or (iii) generalist FMs with embedding-level evidence on many tasks.
- **IJROBP / Green Journal / Med Phys** reward clinical workflow integration, prospective evaluation, multi-site planning consistency, and toxicity/recurrence prediction with clear DVH context.
- **Med Image Anal / MICCAI** reward novel architecture, longitudinal modeling, generative dose, and segmentation generalization with strong benchmarks.
- **npj Digital Medicine** sits between: multi-institutional clinical evaluation of an ML tool with explicit utility framing.

---

## (b) Hot clinical endpoints (what reviewers light up over)

Ranked by reviewer enthusiasm in 2024-2026:

1. **Local control / locoregional recurrence-free survival (LRFS)** - the gold standard RT endpoint. Multi-center recurrence prediction (NPC, HNSCC, glioma, NSCLC) is the dominant template.
2. **Adaptive replan trigger / online ART decision support** - hottest workflow endpoint; cervix, H&N, lung. Reviewers love decisions that change actions.
3. **Toxicity prediction at clinically actionable thresholds** - xerostomia, radiation pneumonitis, esophagitis, GU/GI toxicity, lymphopenia. Must be combined with dose / DVH; dose-blind models get killed.
4. **Treatment response (early on-treatment / pCR / post-RT response)** - delta-radiomics, mid-treatment CBCT/MR-Linac response prediction.
5. **Dose individualization / dose-escalation candidate identification** - "who benefits from higher dose" framings, in the Lancet DH lineage.
6. **Survival / OS-DFS** - still useful but reviewers increasingly demand it be RT-specific (e.g. RT-attributable benefit), not generic cancer survival.
7. **Failure mode localization** - predicting *where* recurrence will occur within the GTV / dose cloud. Reviewers love this because it visually justifies dose painting.
8. **Patient-reported outcomes / quality-of-life** - rising; especially with H&N and pelvic RT.
9. **Re-irradiation / late toxicity** - long-tail endpoints that single-site Mayo data can uniquely cover.

Reviewers are *cooler* on: pure auto-segmentation papers (saturated unless multi-center prospective), pure dose-prediction papers without outcome anchoring, and standalone LLM-summarization papers without clinical action.

---

## (c) Existing RT foundation-model efforts

Honest tally as of mid-2026:

- **RO-LLaMA / RO-LMM (Yonsei / Seoul)** - first credible RT-specific large multimodal model. Summarization -> plan suggestion -> target volume segmentation, end-to-end. Breast cancer focus. Published arXiv 2311.15876, MICCAI 2024 follow-on. Architecture: instruction-tuned LLM + vision encoder + consistency embedding fine-tuning (CEFTune) + segmentation head (CESEG).
- **TREAT** - text-guided RT dose prediction. CLIP text encoder conditions a 3D dose decoder. Per-protocol dose generation across sites.
- **RADIANT** - configurable RT dose-prediction "framework" pre-trained backbone, multi-site dose distributions. Closest to a "dose FM."
- **Action-model RT (arXiv 2502.04408)** - reframes a multimodal LM as an RL-tuned planning agent.
- **FMCIB (Aerts/HMS)** - oncology imaging FM widely used as a *backbone* for RT downstream tasks (recurrence, response), but not RT-specific.
- **MedVista3D / CT-CLIP / Merlin** - general 3D-CT vision-language FMs (Stanford, Vanderbilt etc.) that anyone can finetune; many RT papers now start from these.
- **MUSK / TITAN (BWH)** - pathology-text FMs - relevant if RT-FM wants to fuse histology.
- **Stanford prostate RT FM (medRxiv 2025)** - disease-specific RT segmentation FM. Limited scope but well executed.

**Verdict on novelty**: "an RT foundation model" is no longer a *blue-ocean* claim. RO-LMM, TREAT, RADIANT, and the action-model paper already stake out segmentation+planning, text-conditioned dose, and agentic planning. **What is still open**:
- A **longitudinal** RT FM (planning-CT + on-treatment CBCT/MR + post-RT imaging + dose + EHR + outcomes), trained as a temporal sequence, *not yet* convincingly done.
- Outcome-anchored RT FM where embeddings predict recurrence, toxicity, and adaptive triggers *jointly*.
- Plan-aware FM that ingests the 3D dose cloud + DVH as first-class input rather than as a target.

These three are publishable framings. "Just another RT FM" is not.

---

## (d) Competitor labs and what they are working on

| Lab / PI | Institution | Current RT-AI thrust |
|----------|-------------|----------------------|
| Lei Xing | Stanford | DL imaging, plan optimization, ensemble lung tumor seg (Radiology 2025), autocontouring + image reconstruction |
| Daniel Chang / Adler | Stanford | CyberKnife, SBRT planning, AI for SRS workflows |
| Hugo Aerts / Danielle Bitterman | Harvard-DFCI / Mass General Brigham AIM | FMCIB, prospective AI deployment in clinical RT, LLM reliability for cancer drugs |
| MSKCC (Deasy, Veeraraghavan, Apte) | MSKCC | Radiomics + DL outcome prediction; CERR; H&N and lung |
| Laurence Court | MD Anderson | Radiation Planning Assistant (LMIC deployment), KBP scaling |
| Steve Jiang / Mu-Han Lin | UT Southwestern | DL dose prediction, MR-Linac AI |
| Bortfeld / Paganetti | MGH | Proton therapy AI, biological modeling, GPU MC + DL |
| Marks / Das | UNC | Toxicity modeling, lung RT outcomes |
| Lambin / Dekker | Maastricht (D-Lab) | Radiomics, distributed federated learning (Personal Health Train) |
| Beltran / Foote | Mayo (Jacksonville / Rochester) | Proton therapy interplay, FLASH, dose-LET interactions |
| Yonsei (Yang, Kim) | Yonsei | RO-LMM, LMM-driven contouring, RT-LLM |
| BWH / Mahmood | BWH | Pathology FMs (MUSK, TITAN, UNI) - adjacent but increasingly RT-relevant |
| Elekta / Varian/Siemens applied groups | Industry | Ethos / HyperSight adaptive, embedded AI |

Implication for Mayo: differentiation requires either (i) data depth no one else has (longitudinal + proton + outcomes + PROs across decades), (ii) a *task* no one else has nailed (joint outcome+toxicity+replan from a single FM), or (iii) physics+AI integration that the proton-team angle gives Mayo a natural edge in.

---

## (e) Realistic target venues for a "longitudinal RT FM from Mayo"

**Reality check**: single-institution work, however high-quality, is a hard sell at *Nature Medicine* and *Lancet Digital Health* unless you bring external validation cohorts (TCIA, public benchmarks, or partner sites). Without that, target the tier below and aim up if external validation materializes.

Ranked by realism, single-site:

1. **Med Image Anal** - very realistic for a longitudinal RT FM with strong methodology + multi-task benchmarks. Reviewer culture rewards new architecture + careful eval.
2. **IJROBP (Red Journal)** - realistic if framed as outcome / decision-support, with DVH context and prospective-style evaluation. Highest clinical RT impact factor.
3. **Radiotherapy and Oncology (Green Journal)** - realistic, especially for workflow/adaptive/dose framings; ESTRO audience.
4. **npj Digital Medicine** - achievable if you can show clinical utility and at least one external/test cohort or simulated multi-site eval (federated, leave-site-out).
5. **Nature Communications** - achievable with strong methodology novelty (longitudinal architecture, plan-aware FM) plus at least one external benchmark. Open-access friendly.
6. **JCO Clinical Cancer Informatics** - realistic, lower IF but RT-AI-tolerant.
7. **Medical Physics / Physics in Medicine and Biology / Journal of Applied Clinical Medical Physics** - safe targets for technical components (dose-aware encoder, segmentation backbone), not the headline paper.
8. **Lancet Digital Health** - stretch; needs prospective or multi-site validation.
9. **Nature Medicine** - very hard from a single institution; usually demands prospective multi-center evidence and clinical action change. Realistic only as a *follow-up* paper after the MIA/Red-Journal paper establishes the FM.
10. **Nature Machine Intelligence** - realistic if the framing is methodological (longitudinal-temporal medical imaging FM), with RT as the application. FMCIB lineage.

**Recommendation**: aim primary submission at **Med Image Anal** (methodological + benchmark-rich) *or* **IJROBP** (clinical utility framing), with **Nat Comms** as the reach target if methodology is genuinely new and at least one out-of-Mayo evaluation cohort is in place.

---

## (f) Common reviewer killshots (and how to preempt)

1. **"Single-site - won't generalize."** -> Preempt with TCIA / public-cohort external eval (HNSCC NSCLC OPC datasets, TCGA-RT, AAPM thoracic, PROSTATEx). Cross-vendor (Varian + Elekta + proton) within Mayo helps but is not sufficient.
2. **"Dose-blind / ignores DVH."** -> Make dose a first-class input or output. If you predict outcome, condition on the 3D dose and DVH; reviewers from Med Phys / IJROBP will reject otherwise.
3. **"No clinical utility - it is just an AUC."** -> Define a decision the FM changes (replan trigger, dose-escalation candidate, toxicity-guided plan modification) and report decision-curve / net-benefit analysis (Vickers DCA), not just AUC.
4. **"Missing baselines."** -> Compare against (i) clinical DVH-only models, (ii) radiomics + clinical, (iii) existing FMs finetuned (FMCIB, Merlin, CT-CLIP). Without these your novelty is invisible.
5. **"Label leakage / temporal leakage."** -> Strictly time-respecting splits, especially for longitudinal designs. Document time-zero, censoring, follow-up windows.
6. **"Selection bias."** -> Describe inclusion/exclusion as a CONSORT-style flow diagram. Report performance by stage, site, vendor, and demographic.
7. **"No prospective evidence."** -> Even a silent-mode prospective audit on recent cases (2024-2026) helps a lot.
8. **"Imbalanced rare outcomes."** -> Use calibrated probability estimates; show Brier, calibration plots; do not over-claim from a handful of recurrences.
9. **"Privacy / data governance."** -> Document IRB, de-identification, federated-style alternatives if any, and explicit statement on model weight release.
10. **"Reproducibility."** -> Release code, model weights (or at least architecture cards), training recipes, and a public benchmark subset.
11. **"LLM hallucination / safety"** (if any text component) -> grounded generation, RAG over Mayo guidelines, human-in-loop framing, and explicit guardrails.
12. **"Why FM not task-specific model?"** -> Have a panel demonstrating positive transfer to a *low-data* task (e.g. rare site, pediatric, re-irradiation) where the FM beats a task-specific baseline. This is the only argument that justifies the FM framing.
13. **"Is the longitudinal signal real or just baseline-CT?"** -> Ablation: baseline-only vs. on-treatment-only vs. longitudinal. Show longitudinal gain, ideally on adaptive trigger or response endpoints.
14. **"What about confounders - smoking, performance status, comorbidities?"** -> Cox + clinical covariates as a baseline; show the FM adds independent signal (multivariable HR, c-index delta).

---

## Take-home summary

- "RT FM from a single site" is **not blue ocean** anymore. RO-LMM, TREAT, RADIANT and the FMCIB lineage already occupy the obvious framings.
- Mayo's edge is **longitudinal + outcome + proton + PRO + decades of follow-up**, not "we built another FM."
- Frame the paper around a **task no one else can do well**: longitudinal adaptive-replan/recurrence/toxicity joint prediction with dose-aware inputs.
- Target **Med Image Anal or IJROBP** first; reach for **Nat Comms** with at least one external cohort.
- Lock down dose-awareness, external validation cohort, longitudinal-vs-baseline ablation, decision-curve analysis, and FM-vs-task-specific transfer from day one.
