# Radiotherapy Foundation Model — Project Workspace

> Exploration of a radiotherapy-focused FM project, leveraging Mayo Clinic longitudinal RT data.
> Distinct from but related to the broader [TimeFM-3D](../data-collection/) project.

## Structure

- [`00_intake_and_framing.md`](00_intake_and_framing.md) — user's brief + lead-agent framing & priors
- [`research/`](research/) — subagent research reports
  - `01_medical_3d_foundation_models.md` — survey of pretrained 3D medical backbones
  - `02_longitudinal_medical_imaging.md` — longitudinal modeling patterns
  - `03_registration_dl.md` — CBCT-CT and X-ray-CT registration with DL
  - `04_dose_prediction_rt_ai.md` — dose prediction & RT planning AI
  - `05_rt_ai_landscape_and_venues.md` — landscape, venues, reviewer concerns
- [`proposals/`](proposals/) — concrete project proposals (filled after research returns)

## Status

- 2026-05-23: 5 research subagents dispatched, all returned.
- 2026-05-23: 3 proposals drafted + comparison. See [`proposals/00_comparison_and_recommendation.md`](proposals/00_comparison_and_recommendation.md).

## 🔧 Buildable spec

- [`components_and_stack.md`](components_and_stack.md) — **the actual build doc**, one component per module, with versions, licenses, code recipes, ablations, and compute estimate.
- [`milestones_w1_to_m2.md`](milestones_w1_to_m2.md) — **concrete week-1 to month-2 execution plan**

## Locked decisions (2026-05-23)

- **No LLM** — pure vision FM
- **Backbone**: VoCo-H (1.2B, CT) + Triad-L (~1B, MRI) = **2.2B multimodal vision FM**
- **Continued pretraining**: Δt-Siamese MAE + cross-cancer MAE + cross-modal contrastive on **Mayo + TCIA pan-cancer RT**
- **Compute**: 8× H200 single node, training (not deployment)
- **Scope**: pan-cancer (H&N + NSCLC + prostate + …)
- **Heads**: lesion seg, OAR seg, dose prediction, replan classification, outcome (recurrence + toxicity)

## Quick decision tree

- **Want a paper fast (3-4 months) using a real trainable FM?** → [Proposal B](proposals/B_dose_as_input_outcome_fm.md)
- **Want to own the longitudinal+dose-aware RT FM niche?** → [Proposal A](proposals/A_longitudinal_rt_fm.md)
- **Have voxel-resolved recurrence contours and want clinical-utility headline?** → [Proposal C](proposals/C_failure_mode_localizing_fm.md)
- **Not sure**: read [comparison](proposals/00_comparison_and_recommendation.md) first.
