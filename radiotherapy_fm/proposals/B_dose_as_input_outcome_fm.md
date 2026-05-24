# Proposal B — Plan-Aware Outcome FM (dose-cloud as first-class input)

> **One-line pitch**: A foundation model that **consumes the 3D dose cloud + DVH as primary inputs** (not as an output to predict) and produces calibrated **recurrence + toxicity predictions** — flipping the standard "predict dose" framing into "**predict outcome given plan**". Fastest path to a publication.

## Why this exists

Subagent 05's framing #2: most dose-related ML predicts dose from anatomy. Treating dose as a **first-class input modality** to a foundation model — encoding the actual delivered 3D dose cloud at multiple voxel resolutions — is comparatively unmined and naturally answers a clinically meaningful question ("given this plan, what is the outcome distribution?"). Subagent 04 notes the dose-vs-no-dose ablation is critical for reviewers.

## Architecture sketch

```
  Planning CT + structures → VoCo-B (frozen, LoRA-adapted)  →  CT tokens
  Dose cloud + DVH         → light 3D-CNN (trained)         →  Dose tokens
  Optional: T0/Tmid CBCT   → VoCo-B (shared)                →  CBCT tokens (avg)

                                          ▼
         Cross-modal fusion transformer (2-4 layers, modality-typed PE)
                                          │
                ┌─────────────────────────┼─────────────────────────┐
                ▼                         ▼                         ▼
         Recurrence (DeepSurv)     Toxicity (multi-label)     Calibrated risk
                                                              (with conformal)
```

**No new pretraining**. Take VoCo or CT-FM off-the-shelf (Apache-2.0 / MIT), LoRA-adapt during fine-tune. The novelty is in **the dose-as-input encoder + the multimodal fusion + the clinical-utility evaluation**, not in building an FM.

This is the **closest to the user's stated pragmatic preference**: "find a decent pretrained backbone + attach strong heads".

## Data plan

- Mayo planning CT + dose cloud + outcomes for ≥1,500 patients (any single cancer site to start — H&N or NSCLC most likely).
- External cohort: TCIA HNSCC / NSCLC-Radiomics with public dose data (subagent 05 killshot #1).
- Optional CBCT inclusion if time permits — but Proposal B explicitly does **not** depend on longitudinal modeling. It's a single-timepoint plan-aware FM.

## Training

- Phase 1 (weeks 1-3): freeze VoCo, train dose encoder + fusion + heads.
- Phase 2 (weeks 4-6): LoRA-tune VoCo.
- Phase 3 (weeks 7-9): external validation, calibration, decision-curve.
- Paper draft in parallel.

**Total timeline**: 3-4 months to submission (vs 10-11 for Proposal A).

## Evaluation

- Recurrence + toxicity C-index / AUC on Mayo and external cohort.
- **Dose-vs-no-dose ablation as the headline experiment** (subagent 05 killshot #2): the same model with dose channel zeroed.
- Calibration plots + decision-curve / net-benefit (subagent 05 killshot #3).
- Sub-analysis: which dose-volume features the model attends to (SHAP / attention rollout) — clinical interpretability.

## Target venue

- **Primary**: IJROBP / Radiotherapy & Oncology (clinical utility, RT-specific).
- **Stretch**: Medical Image Analysis if methodology is novel enough.
- **Lower realism for Nature Comms**: this version is "applied FM" — Proposal A is the better Nat Comms bet.

## Why it lands

- Shortest path to publication that still uses a *real* FM (addresses the user's "not just RAG" requirement).
- Sidesteps every hard problem (longitudinal modeling, registration in FM, multi-modality 3D pretrain) and concentrates effort on the **clinical claim**.
- Dose-as-input is fresh framing (subagent 05).
- High-quality Mayo data + clean external validation makes reviewers happy.

## Risks

1. **Methodological depth criticism.** Reviewers may say "this is fine-tuning, not an FM contribution". Counter: the FM is the *backbone we adapt*; the contribution is the dose-conditioned outcome model and clinical-utility analysis. Frame accordingly.
2. **Single-site outcome label drift.** Standardize outcome definitions before training.
3. **Competition**: TREAT, RADIANT, Yonsei dose-conditioned work is active. Move fast, lock the external-validation cohort early.

## When to pick this

- If timeline pressure is real (paper this year).
- If team bandwidth is limited (1-2 grad students).
- If we want a low-risk first paper that establishes Mayo-RT-FM as a brand, then follow up with Proposal A as the next paper.
