# Proposal C — Failure-Mode-Localizing RT Foundation Model

> **One-line pitch**: A foundation model that predicts **where inside the target volume recurrence is likely to occur**, voxel-by-voxel, given the planning CT + dose distribution — directly enabling **dose painting / boost-region selection**. Higher clinical-utility ceiling than A or B, narrower scope.

## Why this exists

Subagent 05's framing #3: most outcome ML produces a single risk number per patient. Predicting the **spatial distribution** of recurrence inside the GTV/CTV/dose-cloud is much rarer, and it maps directly to a clinical action — **dose painting**, **adaptive boost**, **GTV margin redesign**. This is the kind of paper a Red Journal / IJROBP editor wants. Lancet Digital Health is in reach with a multi-site cohort.

## What's needed in the data

Mayo's longitudinal RT cohort is a near-unique asset for this because:
- Planning CT + dose cloud → input
- Post-RT follow-up imaging (MRI, PET, CT) with **recurrence delineations** → spatial labels
- PhD-curated contours of recurrence sites (the user said expert curators are available — this is exactly the task that justifies them)

If the data side doesn't yet have recurrence sites contoured at pixel resolution, **this proposal becomes a data-curation project before it becomes a model project**. That's worth knowing before committing.

## Architecture sketch

```
Planning CT + GTV/CTV/OAR contours → VoCo-B / CT-FM (LoRA)      → CT tokens
Dose cloud (3D + DVH)               → Dose-CNN                  → Dose tokens
                                          ▼
                          Multimodal Cross-attention fusion
                                          ▼
                  Spatial decoder (UNETR-style upsampler)
                                          ▼
            Per-voxel recurrence probability map (inside GTV/dose ROI)

                                          ▼
                       Decision-curve over dose-painting plans
```

**No longitudinal pretraining required** — but multi-timepoint follow-up is the *label source* (recurrence at month 12 vs 24 etc.). Time-to-recurrence can be the label format (per-voxel hazard) — borrow ideas from per-voxel survival (e.g., DeepHit).

## Training

- Phase 1 (months 1-2): data curation — recurrence-site contours QC, paired with planning data.
- Phase 2 (months 3-4): backbone + spatial decoder training, single-site.
- Phase 3 (months 5-6): external cohort with recurrence localizations (this is the bottleneck — possibly partner with another center).
- Phase 4 (months 7-8): dose-painting decision-curve simulation — does using the model's map to redistribute dose change predicted outcomes? Clinical-utility paper.

## Evaluation

- Per-voxel discrimination (AUC, spatial AUPRC).
- Spatial-overlap with observed recurrence (Dice between predicted high-risk map and observed recurrence contour).
- **Plan-redesign simulation**: take the predicted recurrence map, re-optimize dose distribution to boost high-risk voxels (within OAR constraints), report DVH and dose-painting net-benefit.
- Calibration of voxel-wise probabilities.

## Target venue

- **Primary**: IJROBP / Red Journal — this is exactly their type of paper.
- **Stretch**: Lancet Digital Health if a multi-site cohort is locked in (dose-painting is in their wheelhouse).
- **Less suitable**: Nature Medicine (they want bigger cohorts), MICCAI (less clinical-utility framing).

## Why it lands

- Maps directly to a clinical decision (dose painting / adaptive boost). Decision-curve analysis is natural.
- Uses Mayo's PhD curators on the highest-leverage labels (recurrence-site contours).
- The "where" question is much less crowded than the "how much" question in RT AI.

## Risks

1. **Label scarcity**: voxel-resolved recurrence labels are expensive. Need to confirm the data exists or can be created in scope.
2. **Modeling per-voxel time-to-event is non-trivial**. May need to simplify to binary "any recurrence at this voxel by year T".
3. **External cohort with recurrence localization is rare** — may force partnership negotiation that adds time.
4. **Not really an "FM" paper** — closer to a focused application of a pretrained backbone. The advisor's "FM" framing applies only loosely. If the advisor insists on FM-as-headline, Proposal A or B is a better fit.

## When to pick this

- If the data side can deliver recurrence localizations at scale.
- If the advisor is open to "FM as backbone, clinical utility as headline" rather than "FM as the contribution".
- If you want the clearest clinical-impact story.
