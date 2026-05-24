# Deep Learning for Dose Prediction & RT Planning Automation (2022-2026)

Survey for the **Radiotherapy Foundation Model** project. Focus: can 3D dose
prediction sit as a task head on a general 3D medical FM backbone, and what
inputs/data are required to make this competitive?

---

## 1. Problem framing

**Dose prediction** = given planning CT + segmented OARs + target (PTV/CTV) +
(optionally) beam geometry / energy / prescription, predict a voxel-wise 3D
dose distribution D(x,y,z) in Gy that mimics what an expert planner would
design. Used clinically as (a) a *plan-quality reference* / knowledge-based
planning (KBP) baseline, (b) a *warm-start* for optimization, and (c)
an *NTCP/TCP feature* for outcome modelling and adaptive replan triggering.

Two standard metrics on OpenKBP:
- **Dose score** = mean MAE over voxels inside the dose mask, in Gy.
- **DVH score** = mean absolute error over a fixed set of DVH points
  (D1, D95, D99, mean) for PTV + OARs, in Gy.

Lower is better. State of the art on OpenKBP head-and-neck test set sits
around **dose score 2.0-2.6 Gy** and **DVH score 1.5-1.6 Gy**.

---

## 2. Architecture landscape and benchmark numbers

| Model | Year / Venue | Architecture | Inputs | OpenKBP Dose / DVH score (Gy) | Notes |
|---|---|---|---|---|---|
| HD U-Net (Nguyen) | 2019, PMB | 3D hierarchically densely connected U-Net | CT + OAR + PTV masks | ~2.6 / ~1.7 (reproduced) | First strong 3D dose-net for H&N; the de facto baseline |
| C3D (Liu et al.) | 2021, Med Phys | Cascade 3D U-Net + knowledge distillation | CT + structures | **2.31 / 1.55** | Winner of AAPM 2020 OpenKBP challenge (both streams) |
| DeepDoseNet (Soomro et al.) | 2021 arXiv | ResNet+Squeeze-Excite 3D + MAE+DVH loss | CT + structures | **~2.0 / ~1.6** | Best dose score reported on OpenKBP; importance of DVH-aware loss |
| TrDosePred (Hu et al.) | 2023, JACMP | Swin-Transformer encoder + CNN decoder, ensemble | CT + structures | 2.43 / 1.59 | Showed transformer encoders match top CNN; 3rd / 9th on CodaLab |
| TransDose (Wen et al.) | 2023, Med Image Anal | Transformer backbone + super-pixel GCN | **CT only** (no masks) | competitive with masked methods | Proves dose can be predicted from CT + learned anatomy priors |
| DoseDiff (Zhang et al.) | 2024, IEEE TMI | Conditional diffusion + signed-distance maps | CT + SDM(structures) | beats UNet baselines on two in-house + OpenKBP-like sets | Distance-aware generative model |
| DiffDP | 2023, MICCAI | Diffusion model (DDPM) | CT + structures | competitive | First DDPM applied to dose |
| Cascade Transformer (Gronberg et al.) | 2024, Comp Biol Med | Two-stage CNN+Transformer | CT + structures | strong on H&N | |
| DSANet (2024) | 2024, KBS | Dual-path seg-guided attention | **CT only** | competitive vs CT+mask baselines | Mask-free via auxiliary seg head |
| Multi-Task: Contour + Dose | 2024, arXiv 2411.18767 | Shared encoder, two heads | CT (predicts masks + dose) | competitive with separate models | Closest published precedent for "RT-FM-style" multi-task head |
| LLM-empowered dose net (Dong et al.) | 2025, Med Phys | LLM-conditioned 3D net | CT + structures + text prescription | improves transferability across sites | Language prompt acts as prescription/site conditioning |
| nnDoseNet (Sun et al.) | 2025, medRxiv / Comp Biol Med | nnU-Net auto-config for dose regression | CT + structures + body | **2.579 / 1.540** on OpenKBP H&N | Reproducible, multi-site, IMRT/VMAT/3D-CRT; v2 spans 4 sites, 1.5-84 Gy |
| RADIANT framework | 2025, medRxiv | Configurable training framework | configurable | n/a (framework) | Reproducible experimentation across sites |
| Generalizable DL Dose Framework | 2026, medRxiv | Multi-site dose engine | CT + aperture geometry | trained on six anatomical sites, VMAT+3D-CRT | Pushes toward "dose foundation model" |
| Deep Evidential Dose (Tan et al.) | 2024, CIBM | Evidential U-Net | CT + structures | MAE ~3.09 Gy + uncertainty | Adds epistemic + aleatoric uncertainty maps |
| DoseGAN (Kearney et al.) | 2020, Sci Rep | Attention-gated 3D GAN | CT + structures (prostate SBRT) | site-specific, n=141 | GAN approach, useful for heterogeneous SBRT dose |

**Takeaways from the benchmark race**
- The plateau at ~2.0 Gy dose / ~1.5 Gy DVH on OpenKBP is reached by very
  different architectures (cascade CNN, transformer, diffusion). Loss design
  (MAE + DVH terms, gamma loss) often matters more than the backbone.
- Transformers do not dominate CNNs; the best results are still mixed
  CNN/transformer/cascade.
- Diffusion models (DoseDiff, DiffDP) are the new wave -- they give
  calibrated, multi-modal dose samples but are slower; not yet beating
  cascade-UNet on score-only metrics.

---

## 3. Inputs: what actually matters

Empirical hierarchy of input importance (from ablations across the papers above):

1. **PTV / target mask** -- by far the most important. Removing it collapses
   model accuracy. Encodes prescription topology.
2. **OAR masks** -- second most important. Sharp dose gradients live on OAR
   boundaries.
3. **Prescription dose value / fractionation** -- usually injected as a
   constant channel or via DVH loss; LLM-empowered models (Dong 2025) inject
   it as text.
4. **Planning CT** -- contributes density information, especially for
   heterogeneous regions (lung, air cavities); less important than masks
   for IMRT/VMAT on H&N but critical for lung and proton dose.
5. **Beam geometry** -- beam angles, isocenter, BEV fluence: significantly
   improves prediction in IMRT/VMAT where dose follows beam paths. Beam-wise
   composition learning (Teng et al., 2024) and BEV-to-fluence networks show
   beam information is the next frontier above CT+masks.
6. **Body/external contour** -- small but consistent benefit (used by nnDoseNet).
7. **Modality / machine info (photons vs protons, energy, MLC vendor)** --
   useful for cross-site generalization; multimodal multi-task models (Jiao
   et al., 2024) leverage this.

**Mask-free trend.** TransDose and DSANet show CT-only prediction with a
learned anatomy prior is possible. For an FM, this is attractive: the FM
backbone *already* knows anatomy from pretraining, so masks become optional
hints rather than required inputs.

---

## 4. Foundation-model approaches

There is **no published RT-specific foundation model** for dose prediction
yet, but several lines converge on the idea:

- **Generalizable DL Dose Engine (2026, arXiv 2601.05348)** -- a single
  network trained on six anatomical sites with VMAT + 3D-CRT data; aperture
  geometry as input. Closest thing to a "dose FM" published.
- **nnDoseNetv2 (2025)** -- one auto-configured pipeline spanning H&N,
  prostate, breast, lung; 1.5-84 Gy prescriptions; IMRT/VMAT/3D-CRT. Multi-site
  but per-site retraining via nnU-Net's config search.
- **Transfer-learning studies (Chen et al., 2025, PMC12059300)** -- pretrain
  on a large multi-site cohort, fine-tune to a new site with limited data.
  Mean-dose error drops from 2.3% to 0.7% with TL.
- **LLM-conditioned dose nets (Dong et al., 2025)** -- text prompt encodes
  site + prescription, enabling one model to span sites.
- **RT-FM precedents (e.g. MedSAM-RT, RT-FM proposals, Mayo/UTSW work)** --
  segmentation FMs (SegVol, MedSAM, TotalSegmentator) are the obvious
  backbone; dose prediction has not yet been published as a head on these.

The opportunity: train a 3D backbone on a *very large unlabeled CT corpus*
(masked-autoencoding or contrastive), then attach a dose-regression head with
target/OAR conditioning. No paper currently does this end-to-end at scale.

---

## 5. Dose accumulation across fractions

Two stages: (i) **deformable image registration (DIR)** across daily
CT/CBCT/MR images and (ii) **dose warping** from each fraction's planned or
delivered dose into the planning frame.

- **Seq2Morph (2023, PMC10388694)** -- DL-based DIR specifically for
  longitudinal RT data; recurrent registration network handles big anatomy
  changes (weight loss, tumor shrinkage in H&N).
- **DL-based DIR uncertainty (Smolders et al., 2023)** -- both supervised
  and unsupervised networks predict per-voxel Gaussian uncertainty of the
  deformation field, then propagate to dose. Enables clinical use of DIR
  for accumulation, addressing the trust gap.
- **Zhong et al. (2024, JACMP)** -- consensus paper: deformable dose
  accumulation is *required* for adaptive RT practice; voxel-by-voxel
  deformation, not rigid summation.
- **DIR-uncertainty-encompassing dose accumulation (Red Journal, 2025)** --
  propagates DIR uncertainty into accumulated dose to give a band, not a
  single value.

Open problem: end-to-end models that jointly do registration + dose mapping
+ accumulation are still rare; this is a natural multi-head task for a 3D FM.

---

## 6. Outcome prediction from dose (NTCP / TCP via DL)

Modern direction: 3D CNN/Transformer over (CT + dose + segmentations) ->
binary outcome (xerostomia, dysphagia, pneumonitis, local control).

- **Late xerostomia 3D NTCP (Cui et al., 2024, Red Journal / PMC11646177)** -- 3D
  CNN on dose + CT predicts grade>=2 xerostomia; outperforms LKB NTCP.
- **Late dysphagia NTCP (van Dijk et al., 2025, medRxiv 2025.06.20.25329926)** --
  3D dose + CT + segmentations -> dysphagia; AUC 0.80-0.84 on internal test
  vs 0.76 for LKB; AUC 0.73-0.74 on external vs 0.63.
- **NTCP-guided proton patient selection (Brouwer et al., 2023, RTO)** --
  uses DL dose prediction + NTCP to decide proton vs photon for oropharyngeal
  cancer.
- **Multi-omics deep NTCP (NSCLC, PMC8180510)** -- combines dose + PET
  radiomics + cytokines + miRNA for joint actuarial outcome modeling.
- **Dose-omics** -- spatial radiomics over the 3D dose distribution (not just
  DVH summaries); e.g. Gabrys et al., Wei et al. Adds heterogeneity and
  shape descriptors of dose; consistently improves over DVH-only NTCP.

Implication for an FM: outcome head should take **dose + CT + structure**
volumes jointly and produce probability + uncertainty. This naturally
piggybacks on a 3D FM backbone.

---

## 7. Adaptive RT (ART) ML pipelines

- **Replan-trigger prediction** -- still mostly heuristic (dose-volume
  thresholds, anatomical drift metrics). DL-based trigger prediction is
  emerging (Christiansen 2023 on pelvic ART thresholds; OCAR-trigger ML
  pipelines from UMC Utrecht).
- **Mid-treatment dose accumulation** -- see Section 5; DL-DIR + dose
  warping pipelines are clinically maturing.
- **DL dose prediction for online ART** -- 2025 work (Closing-the-gap, PMC12059263)
  fine-tunes patient-specific DL dose models for daily Ethos adaptive plans,
  reducing plan-quality gap.
- **Secondary dose verification for ART** -- geometry-encoded U-Net
  (PMC11467776, 2024) provides fast QA-grade independent dose calculation
  during the on-couch adaptive workflow.
- **MR-Linac adaptive plans (Eppenhof et al., 2023)** -- DL predicts
  deliverable adaptive plans for MR-guided ART; feasibility shown.

Workflow opportunity: a single FM that ingests today's CBCT/MR, propagates
contours via registration, predicts today's deliverable dose, and accumulates
into the planning frame -- all from one backbone -- is unpublished.

---

## 8. Datasets and challenges

| Dataset | Size | Site | Modality | Includes Dose? | License | Use |
|---|---|---|---|---|---|---|
| **OpenKBP** (Babier et al., 2021, Med Phys) | 340 H&N (200 train / 40 val / 100 test) | head-and-neck | CT + masks + dose | yes | **CC BY-NC-SA 4.0** (non-commercial, share-alike) | standard benchmark for KBP / dose prediction |
| **OpenKBP-Opt** (2022, PMB) | 100 H&N | H&N | + KBP optimizer outputs | yes | same as OpenKBP | benchmarking 76 KBP pipelines |
| **AAPM RT-MAC 2019** (TCIA: AAPM-RT-MAC) | 55 H&N | H&N | T2 MR + RTSTRUCT | no (segmentation challenge) | TCIA terms (CC BY 3.0 / 4.0 attribution typically) | MR auto-contouring |
| **AAPM Thoracic Auto-segmentation 2017** | 60 thoracic | lung | CT + RTSTRUCT | no | TCIA | OAR segmentation |
| **TROG 15.01 SPARK** (2024 release) | prostate SBRT | prostate | CT + KIM tracking + plans | partial | TROG data-sharing agreement | adaptive prostate research |
| **HNSCC-3DCT-RT (TCIA)** | 31 H&N | H&N | planning CT + RTSTRUCT + dose | yes | TCIA CC BY 3.0/4.0 | small dose-prediction set |
| **Head-Neck-PET-CT (Vallieres)** | 298 | H&N | CT/PET + outcomes | no dose | TCIA | NTCP / outcome |
| **NSCLC-Radiomics / Lung1** | 422 NSCLC | lung | CT + outcomes + dose (subset) | partial | TCIA CC BY-NC 3.0 | outcome + dose-omics |
| **SynthRAD2023 / TrackRAD2025** | hundreds | pelvic/brain/H&N | CT/CBCT/MR pairs | no | challenge license | sCT generation, tumor tracking |
| **GLIS-RT / Glioma-RT** | ~230 | brain | CT + MR + dose | yes | TCIA | brain dose |

**OpenKBP licensing note (CRITICAL).** The OpenKBP dataset and code repo
distribute under **CC BY-NC-SA 4.0** (non-commercial, share-alike), per the
challenge website and repo. This means:
- Allowed: academic use, publication, derivative models distributed under
  the same license.
- **Not allowed without renegotiation**: training a model intended for
  commercial deployment (e.g. an FDA-cleared product) on OpenKBP alone.
- For an FM intended to be clinically deployable, OpenKBP can be used for
  *benchmarking and pretraining the public release*, but the clinically
  deployed weights should be re-trained on a permissively licensed or
  in-house corpus. Cite Babier et al. 2021 Med Phys.

---

## 9. Multi-task work (dose head sharing a backbone with seg / outcome)

This is the most directly relevant prior art to the RT-FM agenda.

- **Multi-task contouring + dose (Gronberg et al., 2024, arXiv 2411.18767)** --
  one network with shared encoder predicts OAR contours *and* the dose
  distribution. Demonstrates the joint task is learnable; the two tasks help
  each other (segmentation regularizes dose, dose teaches anatomical context).
- **DSANet (Tan et al., 2024, KBS)** -- shared encoder + auxiliary segmentation
  branch transfers attention maps to the dose branch; allows CT-only dose
  prediction.
- **Mask-free dose via multi-task (IEEE ISBI 2022)** -- earlier version of
  the same idea.
- **Multi-modal multi-task dose (Jiao et al., 2024, Med Phys)** -- one model
  predicts dose for photon IMRT, VMAT, and proton plans by sharing a backbone
  with modality-specific heads.
- **Isodose + gradient auxiliary tasks (Tan et al., 2021)** -- isodose-line
  prediction and dose-gradient prediction as auxiliary heads improve main
  dose prediction.

What is NOT yet published: a single shared backbone with **(segmentation +
dose + outcome + dose-accumulation registration)** heads, trained
pretrain-then-finetune across many anatomical sites. That is the open lane.

---

## 10. Key references (paper, venue, year, 1-line takeaway)

1. Babier A et al. **"OpenKBP: the open-access knowledge-based planning grand challenge and dataset."** Med Phys 2021. -- The benchmark; 340 H&N cases with CT, masks, dose; CC BY-NC-SA.
2. Liu S et al. **"Technical Note: A cascade 3D U-Net for dose prediction in radiotherapy."** Med Phys 2021. -- C3D won OpenKBP (dose 2.31 / DVH 1.55).
3. Nguyen D et al. **"3D radiotherapy dose prediction on H&N patients with a hierarchically densely connected U-Net."** PMB 2019. -- HD-UNet baseline.
4. Soomro MH et al. **"DeepDoseNet."** arXiv 2111.00077, 2021. -- Importance of MAE+DVH loss; ~2.0 / ~1.6 on OpenKBP.
5. Hu C et al. **"TrDosePred."** J Appl Clin Med Phys 2023. -- Transformer encoder is competitive with cascade CNNs.
6. Wen X et al. **"TransDose: Transformer + super-pixel GCN from CT only."** Med Image Anal 2023. -- Mask-free dose prediction; CT-only is feasible.
7. Zhang Y et al. **"DoseDiff: distance-aware diffusion model."** IEEE TMI 2024 (43:3621-3633). -- Diffusion + signed-distance maps; calibrated dose generation.
8. Kearney V et al. **"DoseGAN."** Sci Rep 2020. -- Attention-gated 3D GAN; useful for heterogeneous SBRT dose.
9. Gronberg M et al. **"Multi-task learning for integrated automated contouring and voxel-based dose prediction."** arXiv 2411.18767, 2024. -- Strongest precedent for a shared-backbone RT-FM head set.
10. Sun L et al. **"nnDoseNet: intuitive and flexible DL framework for RT dose prediction."** Comput Biol Med 2025 (preprint medRxiv 2025.03.21). -- Reproducible nnU-Net-style baseline; 2.579 / 1.540 OpenKBP H&N; v2 spans 4 sites and 1.5-84 Gy.
11. **"Generalizable DL framework for radiotherapy dose prediction."** medRxiv 2026.04.17. -- Trains across six anatomical sites with aperture geometry; the closest thing to a published "dose FM."
12. Dong B et al. **"LLM-empowered 3D dose prediction for IMRT."** Med Phys 2025. -- Prescription/site conditioning via text.
13. Tan S et al. **"Deep evidential learning for radiotherapy dose prediction."** Comput Biol Med 2024. -- Adds uncertainty quantification.
14. Cao Y et al. **"Beam-field guided diffusion model for liver dose prediction."** Med Phys 2025. -- Diffusion conditioned on beam geometry.
15. Teng X et al. **"Beam-wise dose composition learning for H&N dose prediction."** Med Image Anal 2024. -- Beam-decomposed targets.
16. Cui S et al. **"Three-Dimensional Deep Learning NTCP for Late Xerostomia in H&N."** 2024 (PMC11646177). -- 3D dose+CT outperforms LKB.
17. Van Dijk LV et al. **"Deep learning NTCP for late dysphagia."** medRxiv 2025.06.20.25329926. -- AUC 0.80-0.84 vs 0.76 for LKB.
18. Zhong H et al. **"Deformable dose accumulation is required for adaptive radiotherapy practice."** JACMP 2024. -- Consensus on DIR-based accumulation.
19. Smolders A et al. **"DL-based uncertainty prediction of DIR for contour propagation and dose accumulation in online ART."** Phys Med Biol 2023. -- Per-voxel DIR uncertainty for trustable accumulation.
20. Closing-the-gap (PMC12059263, 2025). -- Patient-specific DL dose for daily Ethos adaptive replanning.
21. Cao L et al. **"Closing the gap in plan quality: leveraging DL dose prediction for ART."** 2025. -- Demonstrates online adaptive deployment.
22. Brouwer CL et al. **"Patient selection for proton therapy using NTCP with DL dose prediction for oropharyngeal cancer."** Radiother Oncol 2023. -- Dose-prediction-driven proton selection in clinic.
23. Mahmood R et al. **"OpenKBP-Opt."** PMB 2022. -- 76 KBP pipelines benchmarked.
24. Chen L et al. **"Enhanced dose prediction with transfer learning."** 2025 (PMC12059300). -- TL drops PTV mean-dose error from 2.3% to 0.7%.
25. Jiao Z et al. **"Multimodal radiotherapy dose prediction using a multi-task DL model."** Med Phys 2024. -- One backbone, photon+proton heads.

---

## 11. Synthesis for the RT FM project

**Yes, dose prediction is a natural head on a 3D FM backbone.** Multi-task
work (Gronberg 2024, DSANet 2024, Jiao 2024) and CT-only models (TransDose
2023) already show that anatomy and dose share representations. A 3D FM
pretrained on a large CT corpus + conditioned on target/OAR masks (or
text prescription) should outperform from-scratch dose nets in low-data
regimes (cf. Chen 2025 transfer-learning gains).

**Required inputs:** at minimum CT, PTV/target mask, OAR masks,
prescription dose. Beam geometry (angles, isocenter, BEV fluence) is the
next-most-valuable conditioning and is the differentiator for cross-machine
generalization. The FM should accept all of these as optional channels /
prompts, falling back gracefully when some are missing.

**Most publishable novel angle:** a *single 3D FM that ships dose, segmentation,
deformable registration, dose accumulation, and outcome heads*, evaluated on
OpenKBP + multi-site internal data. No published work covers more than two
of these on one backbone. A close second is *beam-conditioned dose generation
(diffusion)* on top of an FM, which would give calibrated dose distributions
under varying beam configurations and would advance both adaptive RT and
plan-quality assurance.

Avoid OpenKBP-only training for any future clinical product (CC BY-NC-SA);
benchmark there, train deployable weights on permissive / in-house data.
