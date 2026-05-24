# Proposal A — Longitudinal Dose-Aware RT Foundation Model

> **One-line pitch**: A 3D foundation model that ingests the **full RT timeline** (planning CT + on-treatment CBCT/MRI + post-RT follow-up + 3D dose cloud) and predicts **recurrence, toxicity, and adaptive-replan triggers** jointly — owning a publication niche that no current FM occupies.

## Why this exists

Subagent findings (`research/02`, `research/05`) converge: no published 3D medical FM ingests longitudinal multi-modality + dose. Stanford / Yonsei / HMS occupy the **single-scan oncology FM** space (FMCIB, RO-LMM, Time-to-Event Pretraining), but nobody owns the **temporal-trajectory + dose-aware** angle. Mayo's longitudinal RT depth is the natural moat.

## Architecture sketch

```
Per-timepoint encoders (frozen + LoRA):
  CT/CBCT  →  VoCo-B (160K-pretrained 3D Swin)         →  ─┐
  MRI      →  Triad (131K-pretrained 3D MRI FM)        →  ─┼─┐
  Dose cloud + DVH → light 3D-CNN (trained from scratch) → ─┘ │
                                                              ▼
  Per-visit token  ← spatial pool + modality embed + Δt embed
                                                              │
                                                              ▼
  Temporal Transformer (4-8 layers, Δt-conditioned positional encoding)
                                                              │
                ┌──────────────────────────┬─────────────────┼──────────────┐
                ▼                          ▼                 ▼              ▼
       Seg head (UNETR)        Dose head (TransDose)    Recurrence    Toxicity head
       (per-timepoint)         (planning visit only)    survival      multi-label
                                                        (DeepSurv)     (per OAR)

  Optional v2 head: DDF head (TransMorph-style) for contour/dose propagation
                    — added AFTER backbone is trained, not in pretraining loss
```

**Why two backbones not one** (subagent 01): no credible 3D multi-modal encoder exists; RadFM is VLM-trained, not great as a dense encoder. CT+CBCT can share VoCo (both Hounsfield-ish). MRI uses Triad. Dose is a separate small CNN — its statistics are unlike CT.

**Why registration is OUTSIDE the FM** (subagent 03): registration losses (NCC, Jacobian) push the backbone toward intensity-equivariant features that fight segmentation/prediction invariances. Use **SynthMorph (affine) → TransMorph or uniGradICON (deformable) → optional sCT** as a preprocessing pipeline before tokenization. Treat the displacement field as an extra input channel if useful.

## Pretraining objective: Δt-conditioned Siamese MAE

Adapt **STAMP** (arXiv 2512.23441) to 3D RT:

- Sample a patient with ≥2 visits.
- Encode visit A. Encode visit B with 60-75% patch masking.
- Train cross-modal cross-time decoder to reconstruct B's masked patches given A's tokens + scalar Δt + modality flags.
- Auxiliary loss: contrastive pull-together for same-patient tokens, push-apart across patients.
- Auxiliary loss: **next-visit dose-difference prediction** when consecutive plans exist (use dose as a self-supervised signal — no extra labels needed for this loss).

Pretrain duration: 4-8 GPU-weeks on A100s for backbone continued pretrain (VoCo and Triad already started; we add the temporal transformer and the cross-time decoder).

## Downstream heads (in priority order)

1. **OAR + target segmentation** (per-timepoint) — re-use VoCo's native task. Sanity check.
2. **Dose prediction** (TransDose head conditioned on PTV+OAR masks + prescription scalar). Bench against OpenKBP (CC BY-NC-SA, academic only) + Mayo internal.
3. **Recurrence prediction** — time-to-event head (DeepSurv-style) on full longitudinal embedding + dose features. **This is the headline result.**
4. **Toxicity prediction** — per-OAR multi-label (xerostomia, esophagitis, dysphagia, pneumonitis), conditioned on dose features.
5. **Adaptive-replan trigger** — binary head on early CBCT trajectory delta. Clinical utility framing.
6. *(v2)* DDF head for contour/dose propagation; *(v2)* next-visit CBCT prediction (SADM-style).

## Data plan

**Internal (the moat)**: Mayo longitudinal RT cohort. Targets:
- ≥ 2,000 patients with planning CT + ≥3 on-treatment CBCTs + post-RT follow-up imaging
- Dose maps and DVHs per fraction or per plan
- Outcomes: local control, distant recurrence, ≥1y toxicity grades, replan events

**External validation** (mandatory — subagent 05 reviewer killshot #1): at least one of TCIA HNSCC / NSCLC-Radiomics / OPC-Radiomics / Anti-PD-1 Lung (already in Tier-0 download list of TimeFM-3D data collection — **this RT FM project can share that data pull**, though projects are otherwise independent).

**Pretraining corpus** (for the Δt-MAE objective): Mayo RT longitudinal + TCIA longitudinal RT cohorts that are open. Don't need labels.

## Evaluation plan

Headline tables:
- Recurrence C-index, calibration, decision-curve at clinically meaningful thresholds — vs (a) clinical baseline (TNM/dose-volume), (b) single-scan FM (FMCIB), (c) ablation removing dose channel ("dose-blind ablation", subagent 05 killshot #2).
- Toxicity AUC per endpoint, dose-vs-no-dose ablation.
- Adaptive-replan trigger: net-benefit / decision-curve analysis (subagent 05 killshot #3) — NOT just AUC.
- Pretraining-vs-no-pretraining ablation on low-data subgroups (justifies the FM framing).

## Target venue + timeline

- **Primary target**: Medical Image Analysis or IJROBP (most realistic for single-site-with-external-validation).
- **Stretch target**: Nature Communications, if we secure a clean external cohort with consistent outcome labels.
- **Phase 0 (months 1-2)**: data curation, registration pipeline, baselines.
- **Phase 1 (months 3-5)**: Δt-MAE continued pretrain on Mayo + TCIA RT.
- **Phase 2 (months 6-8)**: head training, ablations.
- **Phase 3 (months 9-10)**: external validation, decision-curve analysis, paper.
- **Submission**: month 11.

## Critical risks

1. **Δt-MAE doesn't beat single-scan baselines.** Fall back to per-timepoint encoding with simple temporal attention (still novel for RT, less impactful).
2. **External cohort outcome labels noisy.** Mitigate by picking endpoints (recurrence on imaging, dose toxicity) that don't depend on long-term EHR follow-up.
3. **Dose-cloud encoder under-fits.** Pretrain it with masked-dose-modeling on the same RT pretrain corpus.
4. **Compute.** Realistic ask: 4-8 A100s for 6 weeks of pretrain + downstream training.

## Why it lands

- Owns a moat (longitudinal + dose-aware + 3D) that no current FM occupies (subagent 05).
- Uses public backbones (VoCo, Triad) so the FM-from-scratch criticism doesn't apply (subagent 01).
- Pretraining objective is novel for 3D RT (Δt-MAE extension, subagent 02).
- Multi-task heads (seg + dose + recurrence + toxicity + replan) — no published work covers more than 2 of these on one backbone (subagent 04).
- Clinical-utility framing with decision-curve evidence (subagent 05).
