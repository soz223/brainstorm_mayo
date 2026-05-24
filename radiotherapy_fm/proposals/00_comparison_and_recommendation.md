# Proposals A / B / C — Comparison & Recommendation

> Read first. Detailed proposals in [A](A_longitudinal_rt_fm.md), [B](B_dose_as_input_outcome_fm.md), [C](C_failure_mode_localizing_fm.md).

## TL;DR

| Axis | A — Longitudinal RT FM | B — Dose-as-Input Outcome FM | C — Failure-Mode Localizer |
|---|---|---|---|
| **FM-as-contribution?** | Yes — temporal pretrain is the novelty | Backbone only, fine-tune is novelty | Backbone only, spatial decoder is novelty |
| **Timeline to submission** | ~11 months | ~3-4 months | ~7-8 months |
| **Pretraining required** | Yes (Δt-MAE on RT corpus) | No | No |
| **Compute** | 4-8 A100 × 6 weeks pretrain + heads | 1-2 A100 × 3 weeks | 2-4 A100 × 4 weeks |
| **Data risk** | Need ≥2k longitudinal RT patients | Need ≥1.5k single-site outcomes + dose | Need voxel-level recurrence contours |
| **Reviewer killshot risk** | Single-site (mitigable) | "Just fine-tuning" framing | "Not really an FM" framing |
| **Target venue ceiling** | Nat Comms (stretch) / Med Image Anal | IJROBP / Radiother Oncol | Lancet Dig Health (stretch) / IJROBP |
| **Aligns with user's "pragmatic FM" stance** | Moderate (does pretrain) | Strong (closest to stated preference) | Moderate (no real pretrain) |
| **Owns a defensible niche per subagent 05** | Best — longitudinal+dose-aware is unmined | Good — dose-as-input is fresh | Best — spatial recurrence is rare |

## Recommendation

**Two viable strategies depending on your risk appetite:**

### Strategy 1 — "B → A" (lower risk, two papers)

Ship **Proposal B** as paper 1 (3-4 months, low risk, establishes Mayo-RT-FM brand and external-validation infrastructure). Then ship **Proposal A** as paper 2 (now you have the pipeline + a tested dose encoder + an external partner). This maximizes shots on goal and gets a paper out before competing labs claim the dose-aware niche.

### Strategy 2 — "Go for A directly" (higher risk, bigger first paper)

Skip B and put the team on **Proposal A** for 11 months. Higher upside (Nat Comms ceiling). Higher risk (Δt-MAE may not beat baselines; external cohort lockup harder for a longitudinal claim). Justified only if (a) the data is clearly ≥2k longitudinal patients and (b) the advisor wants a bigger first paper rather than two smaller ones.

### When to consider C

Only if **voxel-resolved recurrence contours are already available or imminent** at Mayo. C is the most clinically compelling story but it lives or dies on label availability. If the curators are mid-stream on this exactly, lean in. If not, B or A first, C as paper 3.

## What all three share (do this immediately, regardless of choice)

1. **Backbone**: VoCo (160K-vol Apache-2.0 3D CT FM) or CT-FM (Harvard AIM, MIT) — both fine. Triad for MRI (subagent 01).
2. **Registration as preprocessing** with SynthMorph + TransMorph/uniGradICON, optional sCT (subagent 03). Don't try to learn registration inside the FM.
3. **Dose-vs-no-dose ablation** is mandatory in every paper (subagent 05 killshot #2).
4. **Decision-curve / net-benefit analysis** instead of (or in addition to) AUC (subagent 05 killshot #3).
5. **At least one external cohort** — pick from TCIA HNSCC, NSCLC-Radiomics, OPC-Radiomics, Anti-PD-1 Lung (subagent 05 killshot #1).
6. **Avoid as backbones**: TotalSegmentator, MedSAM2, BiomedCLIP, Merlin, MedicalNet, CLIP-Driven Universal Model (subagent 01 landmines).

## Open decisions for the user

1. **Cancer site** for paper 1? H&N has the cleanest CBCT trajectory + dose accumulation literature; NSCLC has the largest external cohorts. Pick one site for v1.
2. **External cohort**: which TCIA cohort can we realistically use? (need consistent outcome labels)
3. **Compute budget**: how many A100-weeks can the team get?
4. **Strategy**: B-then-A, or straight A?
5. **Advisor expectation alignment**: does the advisor accept "backbone is reused, fine-tune is the contribution" framing (Proposal B), or do they want a genuine pretrained model (Proposal A)?
