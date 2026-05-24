# NIH R01 — Research Strategy Skeleton (Draft v0.1, 2026-05-22)

> Skeleton for the 12-page Research Strategy. Section-level scaffolding with key bullets, citations to fill in, and pointers to existing repo material. Goal: capture the argument architecture now; expand to full prose closer to submission.

---

## A. Significance (≈2 pages)

### A.1 Clinical decisions depend on temporal change, not single scans
- Cite radiology workflow studies showing > 60% of CT/MRI interpretations involve a prior comparison.
- Domain examples: lung nodule growth thresholds (Fleischner), RECIST 1.1 response criteria, AD progression on serial MRI, glioma RANO.
- → Single-scan foundation models systematically miss the most clinically actionable signal.

### A.2 Longitudinal imaging data already exist at unprecedented scale
- NLST: 26,254 participants × up to 3 yearly LDCT (Mikhael et al., JCO 2023; National Lung Screening Trial Research Team, NEJM 2011).
- ADNI / OASIS-3 / AIBL: > 5,000 subjects with serial brain MRI; ADNI alone has 15+ years of follow-up.
- Oncology trials and clinical cohorts: routinely 4–8 follow-ups; Mayo Clinic enterprise PACS contains tens of millions of paired studies.
- Yet existing foundation models discard the temporal pairing.

### A.3 Current foundation models for 3D medical imaging are single-scan
- Single-scan 3D FMs: CT-FM (Pai et al., Nat Mach Intell 2024), BrainIAC (Nat Neurosci 2026), M3FM (Niu et al., Nat Commun 2025), Merlin (abdominal CT), BiomedCLIP (2D).
- Temporal models in 2D: BioViL-T (Bannur et al., CVPR 2023) — text-guided, chest X-ray only.
- Task-specific longitudinal models: Sybil (Mikhael, JCO 2023), SSL-AD, CRONOS — narrow organ/task, not foundation models.
- Closest published direction: Time-to-Event Pretraining (Stanford, 2024), which is task-coupled and not a general-purpose representation.
- → **The combination "foundation-scale × longitudinal × 3D × multi-modality"** is unfilled.

### A.4 Why this matters to NIH ICs
- **NIBIB**: imaging method development with broad applicability; bench-to-bedside enablement.
- **NIA**: AD trajectory modeling on ADNI / OASIS / AIBL directly serves the National Plan.
- **NCI**: lung cancer screening (NLST), treatment-response biomarkers (anti-PD-1), head-and-neck oncology (HNSCC) — all NCI-funded cohorts.

---

## B. Innovation (≈1 page)

### B.1 Architectural innovation
- **Native sequence-of-3D-volumes input** with continuous-time Δt encoding (Time2Vec / Fourier features) — no existing 3D medical FM accepts variable-Δt sequences as native input.
- **Δt-aware Temporal Transformer** with attention masks modulated by inter-scan interval; principled fallback to GRU-D / neural-CDE for ablation.

### B.2 Methodological innovation
- Three complementary SSL objectives **purpose-built for temporal 3D imaging**, not retrofitted from 2D BioViL-T:
  - IA-MVM (interval-aware masked reconstruction);
  - NVP-LS (latent next-volume prediction with Δt input);
  - CMTC / TPC (cross-modal or image-only temporal contrast).
- Each objective tested in ablation to attribute downstream gain.

### B.3 Scope innovation
- First 3D medical FM jointly pretrained across organs (brain, lung, head-neck, melanoma) and modalities (CT, MRI, PET) **with temporal structure preserved**.
- Releases the pretraining recipe + harmonized manifest schema as a community asset.

### B.4 Translational innovation
- Single backbone covering screening, neurodegeneration, and oncology response — reduces deployment fragmentation in clinical AI.

---

## C. Approach (≈8 pages)

### C.0 Preliminary data (pull from repo)
- Yale-Brain-Mets prelim experiment (`ideas/direction-a/prelim-experiment-plan.md`) — pipeline demonstration of IA-MVM + NVP-LS + TPC on a small longitudinal cohort.
- Dataset deep dives (`ideas/direction-a/datasets-deep.md`, `datasets-adni-oasis.md`, `datasets-brain-other.md`, `nlst-practical-guide.md`) — feasibility of curation at scale.
- Compute baseline: 20× H200 cluster (Mayo).

### C.1 Aim 1 — Pan-organ multimodal longitudinal corpus

**C.1.1 Data sources and access status** (see `data-collection/README.md`)
- In-hand at award start: ADNI, OASIS-3, PPMI; pending: AIBL, NIFD, NACC-SCAN, NLST, Yale, LUMIERE, Anti-PD-1, HNSCC.
- All access paths documented in `data-collection/access-guide.md` and `data-collection/download-research.md`.

**C.1.2 Curation pipeline** (see `data-collection/curation-plan.md`)
- DICOM → NIfTI (`dcm2niix`); skip for OASIS-3, Yale, LUMIERE (already NIfTI).
- Modality / sequence / body-region identification via DICOM-header mapping table.
- Per-modality intensity normalization (HU window for CT, z-score for MRI, SUV for PET).
- Cross-timepoint rigid registration (ANTs); deformable as fallback for thorax/abdomen.
- Per-patient grouping, Δt computation, manifest generation (CSV/Parquet).

**C.1.3 Quality control**
- Automated QC: brightness/contrast outliers, registration error metric, sequence-tag confidence.
- Manual review of QC failures (~2% expected).

**C.1.4 Expected output**
- ~30K patients, ~120K volumes, harmonized manifest.

### C.2 Aim 2 — Architecture and pretraining

**C.2.1 Backbone**
- Per-volume 3D encoder: SwinUNETR base (init from CT-FM weights); 3D ViT-B variant for ablation.
- Continuous-time positional encoding: Fourier features over Δt (days); Time2Vec ablation.
- Temporal Transformer: 6-layer, 8-head, attention biased by Δt via learned scalar.

**C.2.2 SSL objectives** (formal definitions, loss terms, mixing schedule)
- IA-MVM: mask 50% of voxels per volume, reconstruct conditioned on Δt to nearest prior; cross-entropy on discretized HU / z-score bins.
- NVP-LS: predict latent of t+1 from latents of {t-k, …, t}; cosine loss + InfoNCE negative.
- CMTC: contrast paired modality embeddings at matched timepoints; TPC fallback (same-patient ≠ different-patient).

**C.2.3 Pretraining configuration**
- 20× H200, FSDP, mixed precision; gradient checkpointing for memory.
- Prototype: ~14 days on 5K-patient subset; full: ~6 weeks on 30K.
- Monitoring: W&B (see `ideas/direction-a/setup.md`).

**C.2.4 Risk and mitigation**
- Registration failure on body CT → fallback to learned deformable + Δt-aware loss masking.
- SSL objective instability → curriculum (start IA-MVM only, add NVP-LS / CMTC after 10K steps).
- Compute over-budget → reduce to 2 modalities (CT+MRI) for full pretrain; PET ablation only.

### C.3 Aim 3 — Longitudinal downstream evaluation

**C.3.1 Tasks and cohorts**
| Task | Cohort | Endpoint | Baseline |
|---|---|---|---|
| AD conversion ≤24mo | ADNI | AUC | SSL-AD, BrainIAC |
| Glioma progression | Brain-Tumor-Progression / LUMIERE | AUC | LUMIERE baselines |
| 1-6yr lung cancer risk | NLST | AUC@1,2,6yr | **Sybil** (head-to-head) |
| RECIST response | Anti-PD-1, HNSCC | AUC | task-specific |
| Time-to-event mortality | NLST, anti-PD-1 | C-index, IBS | CoxPH on demographics |

**C.3.2 Evaluation protocol**
- Linear probe and full fine-tune both reported.
- 5-fold cross-validation; held-out site for OOD generalization.
- Pre-registered primary endpoint: ≥3% absolute improvement over strongest baseline on ≥5/7 tasks (BH-corrected p<0.05).
- Power analysis: with NLST n≈10K test cases, 80% power to detect 1.5% AUC delta (α=0.05).

**C.3.3 Rigor and reproducibility**
- Fixed seeds, archived configs (Hydra), W&B run lineage.
- Independent re-run by collaborator before release.
- Released weights, configs, eval scripts, manifest schema (DUA-permitting).

### C.4 Timeline (5-year R01)

| Year | Aim 1 | Aim 2 | Aim 3 |
|---|---|---|---|
| Y1 | Curate brain MRI (ADNI/OASIS/AIBL) + Yale + LUMIERE | Prototype TimeFM-3D on brain subset (5K) | — |
| Y2 | Add NLST CT + Anti-PD-1 | Full pretrain v1 (brain+CT) | Linear-probe eval on Y1 tasks |
| Y3 | Add HNSCC PET + Mayo internal | Full pretrain v2 (multimodal) | Full eval + Sybil head-to-head |
| Y4 | Expand Mayo enterprise data | Pretrain v3 with all data | Time-to-event eval; OOD site test |
| Y5 | Maintain + release | Final ablation set | Prospective Mayo validation; release |

### C.5 Data management and sharing
- Code: GitHub (BSD-3); weights: HuggingFace Hub.
- Manifest schema and curation scripts: public.
- Original imaging: not redistributable per DUA; pointers + DUA instructions only.
- Mayo Clinic enterprise data: governed by Mayo IRB / data-sharing committee.

---

## D. Mandatory NIH sections (placeholder pointers — fill closer to submission)

- **Vertebrate Animals**: N/A (retrospective imaging).
- **Human Subjects**: secondary use of de-identified, IRB-approved cohorts (ADNI, OASIS-3, NLST DUAs); Mayo IRB authorization for institutional data.
- **Inclusion of Women / Minorities / Children**: report cohort demographics; flag pediatric scope as future direction (current cohorts adult/aging-heavy).
- **Authentication of Key Resources**: pretrained weights provenance, DICOM source traceability.
- **Resource Sharing Plan**: weights, code, manifest schema released under DUA-compliant terms.
- **Rigor & Reproducibility**: see §C.3.3.
- **Facilities**: Mayo Clinic 20× H200 cluster, enterprise PACS, IRB-approved data warehouses.
- **Biosketches**: PI + co-Is + collaborators (Mayo informatics, statistics, clinical co-Is per organ).

---

## E. References cited (placeholder — populate from `ideas/direction-a/lit-review.md`)

→ See [`ideas/direction-a/lit-review.md`](../../ideas/direction-a/lit-review.md) for the ~75-paper bibliography already compiled.

---

## F. Figures

- [`figures/timefm3d-workflow.md`](figures/timefm3d-workflow.md) — pipeline overview (data → curation → SSL pretraining → downstream).
- [`figures/timefm3d-architecture.md`](figures/timefm3d-architecture.md) — model architecture with Δt-aware temporal attention.

(Both as Mermaid sources; render to PNG/PDF for the final PDF submission via mermaid-cli.)

---

## G. Open items before submission

- [ ] Confirm IC primary (NIBIB vs NIA vs NCI) by talking to a Program Officer.
- [ ] Lock co-Is and assemble letters of support (Mayo informatics, NLST PI proxy, etc.).
- [ ] Generate ≥1 page of preliminary results (Yale prelim run finished + Sybil head-to-head on a small NLST slice).
- [ ] Finalize Mayo data-sharing wording for Resource Sharing Plan.
- [ ] Budget (modular vs detailed) — pin against 5-year scope and personnel.
- [ ] Populate full reference list from `lit-review.md`.
