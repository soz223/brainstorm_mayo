# Radiotherapy Foundation Model — Intake & Framing

> Captured from advisor/student conversation, 2026-05-23.
> This is the "lead-agent thinks first" deliverable. Proposals (see `proposals/`) build on this.

## 1. User-described context

**Setting**: Mayo Clinic radiotherapy. Per-patient longitudinal pipeline:

1. **Sim / planning**: high-quality planning CT (sometimes also MRI). Structures contoured by clinicians.
2. **Many follow-up visits**: imaging varies — sometimes another CT/MRI, more often cheaper **CBCT** (3D, lower quality) or **kV/MV X-ray** (2D). Each follow-up is **registered** back to the planning CT.
3. **Per-visit treatment plan** updates (could be adaptive replanning).
4. **Final outcome / response assessment**: was the patient "cured" or not, toxicity, local control, etc.

**Assets the team has**:
- High-quality longitudinal RT data
- PhD-level domain-expert curators
- Mayo institutional weight (clinical credibility, but single-site)

**Advisor's stance**:
- Explicitly wants a **Foundation Model** angle.
- Team's current "FM" work is actually a RAG system (prompt-engineered API calls). User considers this insufficient.

**User's stance**:
- RAG-only is not acceptable — wants a **real trainable model**, even if it's "pretrained backbone + task heads".
- Skeptical that a single FM can natively solve all RT tasks (dose, registration, outcome) end-to-end.
- Pragmatic technical bet: take an existing pretrained 3D medical backbone → freeze or LoRA → attach **multiple strong task heads** for the things that matter → ship as one system.
- Selling point of the paper: **high-quality clinical data × impactful framing**, not "we invented the architecture".

## 2. The hard technical tensions

| Tension | What's at stake |
|---|---|
| **No existing longitudinal medical 3D FM** | Either we build one (risky, slow), or we adapt a single-timepoint FM with temporal heads (pragmatic) |
| **Modality heterogeneity** (CT / MRI / CBCT / X-ray) | Single backbone for all? Per-modality encoders with shared latent? Preprocessing to a canonical modality? |
| **Registration is hard but mature** | CBCT-CT (3D-3D deformable), X-ray-CT (2D-3D) — does this belong **inside** the FM as a task head, or **as preprocessing** outside? Probably outside (see subagent 03). |
| **Dose maps are RT-specific** | Predicting dose is well-studied (OpenKBP era). Natural as a head on a 3D backbone. |
| **Outcome prediction needs labels at scale** | Mayo data quality is the selling point — the head must use the high-quality labels meaningfully. |
| **Single-institution data** | Reviewers will ask for external validation. Need a plan for this from day one. |

## 3. Question routed to subagents (in parallel)

| # | Subagent | Question it resolves | Output file |
|---|---|---|---|
| 01 | Medical 3D FMs survey | Which pretrained backbone(s) realistically to use | `research/01_medical_3d_foundation_models.md` |
| 02 | Longitudinal medical imaging | Does any longitudinal 3D medical FM exist; if not, which patterns to borrow | `research/02_longitudinal_medical_imaging.md` |
| 03 | Registration DL (CBCT-CT, X-ray-CT) | Is registration "inside the FM" or preprocessing | `research/03_registration_dl.md` |
| 04 | Dose prediction & RT planning AI | Is dose prediction a natural head; novel angle for our FM | `research/04_dose_prediction_rt_ai.md` |
| 05 | RT AI landscape & venues | Is "RT FM" crowded; best publishable framing; reviewer killshots | `research/05_rt_ai_landscape_and_venues.md` |

## 4. Strategic priors (to be validated/refuted by subagents)

These are the **lead-agent priors** going in; subagent findings will adjust them:

1. **Backbone**: not training from scratch. Likely starting from one of {Merlin-CT, SuPreM, SAM-Med3D, BiomedCLIP-3D, RadFM} → adapt with LoRA / adapter / partial fine-tune.
2. **Modality**: separate encoders for CT-family (CT/CBCT) vs MRI vs X-ray, with **shared latent / late fusion**. Don't force one encoder for all.
3. **Longitudinal**: timepoints encoded individually → **temporal transformer over visit embeddings** (à la per-frame ViT then temporal attention). Time gap encoded explicitly (treatment day, fraction number).
4. **Registration**: keep as **preprocessing** using best available open-source tool (likely TotalSegmentator → affine + deformable like VoxelMorph or commercial RT toolkit). Don't put it in the FM.
5. **Dose prediction**: keep as **task head** on the FM backbone, conditioned on contours + beam config. Natural fit.
6. **Outcome prediction**: **task head** consuming the full longitudinal embedding (planning + all follow-ups + dose).
7. **Paper framing**: NOT "we built an RT FM that does everything." Better framings TBD by subagent 05 — likely something like "**longitudinal RT response prediction from a unified imaging+dose representation, with clinical utility analysis**".

## 5. What gets decided after subagents return

- Top-3 backbone candidates (from 01)
- Whether to do longitudinal or stick with per-timepoint (from 02)
- Whether registration is inside or outside FM (from 03)
- Which task heads to ship in v1 (from 04)
- The publishable framing and target venue (from 05)

Then `proposals/` will have 2–3 concrete proposals to compare.
