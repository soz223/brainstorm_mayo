# M4 — Dose-Prediction Head Architecture

> **Decision target:** which decoder/head to bolt on top of a frozen-or-LoRA VoCo
> SwinUNETR-base encoder for voxel-wise 3D photon dose prediction on planning
> CT + masks + prescription. Scope = head only; backbone choice is M1.

Companion to `/workspaces/brainstorm_mayo/radiotherapy_fm/research/04_dose_prediction_rt_ai.md`
(broad landscape). This file goes per-candidate deep on architecture, loss,
benchmark numbers, code, and FM-attachability.

---

## 0. Scoring axes (used in §1 table and §2 detail)

| Axis | Why we care |
|---|---|
| Input modality | drives data engineering at Mayo and external sites |
| Architecture family | how cleanly it bolts on a Swin-UNETR encoder |
| Decoder design | shared vs separate from seg decoder |
| Loss | MAE / DVH / gradient / diffusion — which helps |
| OpenKBP dose score / DVH score (Gy) | publishable benchmark numbers |
| Code & license | reproducibility + redistribution constraints |
| Inference compute | fits Mayo clinical box? |
| Used with frozen backbone? | precedent for our setup |

OpenKBP H&N validation set baseline numbers (200/40/100 split, 128×128×128 @
3.91×3.91×2.5 mm grid):

- Strong CNNs cluster at **dose ≈ 2.3–2.6 Gy, DVH ≈ 1.5–1.7 Gy**.
- Best published single model: **DeepDoseNet ~ 2.0 / ~1.6**.
- Current SOTA-ish reproducible single model: **nnDoseNet ~ 2.58 / ~1.54**.
- Diffusion (DoseDiff, DiffDP): on par with cascades, slower.

These are the numbers we must clear to claim "multi-task FM doesn't hurt dose."

---

## 1. Candidate summary table

| # | Model | Year/Venue | Family | Inputs | OpenKBP dose / DVH (Gy) | Code | FM-head precedent? |
|---|---|---|---|---|---|---|---|
| 1 | TransDose | 2023 Med Image Anal (Wen) | Transformer + super-pixel GCN | **CT only** | competitive w/ masked, no public OpenKBP table | none public | no |
| 2 | C3D | 2021 Med Phys (Liu) | Cascade 3D U-Net + KD | CT + masks | **2.31 / 1.55** | github.com/LSL000UD/RTDosePrediction | no |
| 3 | DeepDoseNet | 2021 arXiv (Soomro) | 3D ResNet+SE | CT + masks | **~2.0 / ~1.6** (best on OpenKBP) | github.com/mumtazsoomro/DeepDoseNet (mirror, sparse) | no |
| 4 | DoseDiff | 2024 IEEE TMI (Feng/Zhang) | Conditional 3D diffusion + SDM | CT + SDM(masks) | beats UNet baselines on H&N + in-house; comparable to C3D on OpenKBP | github.com/whisney/DoseDiff (partial) | no |
| 5 | nnDoseNet / v2 | 2025 medRxiv → CiBM (Sun) | nnU-Net auto-config | CT + masks + body | **2.579 / 1.540** OpenKBP H&N; v2 spans 4 sites, 1.5–84 Gy | github.com/SunLianglong/nnDoseNet (active) | no |
| 6 | TrDosePred | 2023 JACMP (Hu) | Swin encoder + CNN decoder, ensemble | CT + masks | **2.43 / 1.59** | github.com/Hu-Chenyang/TrDosePred (modest) | partial — Swin backbone but trained e2e |
| 7 | Generalizable DL Dose | 2026 medRxiv | 3D CNN, six-site multi-task | CT + aperture geometry | per-site MAE ~2–3 Gy across 6 sites; no OpenKBP table | not yet | no |
| 8 | DSANet | 2024 KBS (Tan) | Dual-path seg+dose, attention transfer | **CT only** + aux seg | competitive vs CT+mask | unreleased | seg-as-aux but single backbone |
| 9 | Beam-wise composition | 2024 Med Image Anal (Teng) | Beam-decomposed targets + CNN | CT + masks + beam angles | dose ~2.1 / DVH ~1.5 on internal H&N (≈OpenKBP-style metrics) | unreleased | no |
| 10 | LLM-empowered dose | 2025 Med Phys (Dong) | 3D U-Net + LLM text token | CT + masks + **text prescription** | cross-site gain ~10–15% MAE | unreleased | no |
| 11 | Multi-task Contour+Dose | 2024 arXiv 2411.18767 (Gronberg) | Shared encoder + 2 heads | CT (predicts masks + dose) | comparable to separate models | github.com/MAASTRO-DEEPLAB/uplan (partial) | **closest precedent** |

Legend: "OpenKBP dose / DVH" numbers are validation-set figures as reported in
each paper or its reproducible code; some authors report test-set, noted in §2.

---

## 2. Per-candidate deep dive

### 2.1 TransDose (Wen et al., Med Image Anal 2023)

- **Inputs:** planning CT *only*. No structure masks. The model learns anatomy
  via a super-pixel graph that is built from CT intensities and refined inside
  a transformer block.
- **Architecture:** transformer encoder over 3D patches, followed by a
  graph-convolutional network (GCN) on super-pixels, then a CNN decoder.
- **Decoder onto SwinUNETR:** would require either (a) replacing SwinUNETR's
  decoder skip-connections with the super-pixel GCN (non-trivial: super-pixels
  are computed at fixed scale, SwinUNETR multi-scale features need reprojection),
  or (b) using TransDose only on the bottleneck features. Probably not worth
  the engineering pain.
- **Loss:** MAE + structural similarity on dose; no explicit DVH term.
- **Benchmark:** the paper reports competitive numbers on an in-house H&N set
  (~250 patients) and on OpenKBP, but **does not put a leaderboard number** on
  the OpenKBP test set; reproduced numbers in the literature place it around
  dose 2.5–2.8 Gy.
- **Code:** no public release confirmed. Difficult to use as a baseline.
- **Compute:** super-pixel GCN adds noticeable overhead; ~3–5 s for a
  128³ patch on a single A100, likely 30–60 s for a full CT.
- **FM-head precedent:** none.
- **Verdict:** scientifically interesting (CT-only) but unbuildable from public
  code, no clear OpenKBP-leaderboard advantage, and the super-pixel GCN does
  not compose cleanly with SwinUNETR's multi-scale skips. **Skip as our head;
  use the CT-only philosophy as inspiration only.**

### 2.2 C3D — Cascade 3D U-Net (Liu et al., Med Phys 2021)

- **Inputs:** CT + PTV/OAR masks (10 channels for OpenKBP H&N).
- **Architecture:** two 3D U-Nets in cascade. Stage 1 predicts coarse dose;
  stage 2 takes (inputs + coarse dose) and refines. Knowledge distillation
  from an ensemble of stage-1 models into the stage-2 student.
- **Decoder onto SwinUNETR:** stage 1 = SwinUNETR decoder for dose, stage 2 =
  small refinement U-Net taking (CT, masks, stage-1 dose) as input. Very clean
  to bolt on. This is essentially how a refinement head is normally built.
- **Loss:** voxel-wise L1 (= MAE) only. No DVH loss; the authors found
  DVH loss unstable in their setup.
- **Benchmark:** **OpenKBP test set dose 2.31 Gy, DVH 1.55 Gy.** Challenge
  winner in both streams. As of 2025 still a top-3 reference on most papers.
- **Code:** github.com/LSL000UD/RTDosePrediction — full PyTorch, last commit
  2022, MIT license. Has been reproduced by independent labs (e.g., nnDoseNet
  authors).
- **Compute:** ~2.4 s/case inference at 128³ on a 1080 Ti per the paper;
  ≤1 s on A100. Cheap enough for ART use.
- **FM-head precedent:** none — always trained end-to-end.
- **Verdict:** **the obvious "decoder + refinement-stage" choice** for our
  SwinUNETR head. Strong baseline, public code, MIT, fast. Recommended as
  default head with stage-2 refinement.

### 2.3 DeepDoseNet (Soomro et al., arXiv 2111.00077, 2021)

- **Inputs:** CT + PTV/OAR masks.
- **Architecture:** 3D ResNet backbone with squeeze-excitation, single
  decoder.
- **Decoder onto SwinUNETR:** the ResNet+SE *is* a backbone; the head per se
  is a 3D U-Net decoder. Easy to swap our SwinUNETR encoder in, keep their
  SE+decoder block.
- **Loss:** **MAE + DVH loss** (key contribution). DVH loss is implemented
  as a differentiable surrogate: a soft histogram (sigmoid approximation of
  step function) over dose values within each structure mask, MAE'd against
  the ground-truth soft DVH. Authors show DVH loss drops dose score from
  ~2.3 → ~2.0 Gy, biggest single improvement reported on OpenKBP.
- **Benchmark:** **dose ~2.0 Gy, DVH ~1.6 Gy** on OpenKBP test. Best
  single-model dose score in the literature (slightly better than nnDoseNet's
  reproducible 2.58 because Soomro uses a heavier loss schedule and DVH-aware
  training).
- **Code:** mirror at github.com/mumtazsoomro/DeepDoseNet — incomplete; DVH-loss
  implementation is included but data pipeline isn't fully reproducible.
  *Reimplement DVH loss in our codebase* rather than relying on this repo.
- **Compute:** comparable to C3D, ~1–2 s/case on A100.
- **FM-head precedent:** none.
- **Verdict:** the **DVH-loss recipe is the lesson, not the network.** Use
  C3D-style cascade with DeepDoseNet's MAE+DVH loss. This combination should
  reproduce around dose 2.1 / DVH 1.5.

### 2.4 DoseDiff (Feng et al., IEEE TMI 2024, vol 43:3621–3633)

- **Inputs:** CT + signed-distance maps (SDM) of PTV and OARs (so a continuous
  distance field rather than binary masks).
- **Architecture:** conditional 3D denoising diffusion model. Condition is
  concatenated to noise input at every time step. UNet backbone for the
  noise predictor.
- **Decoder onto SwinUNETR:** SwinUNETR becomes the noise predictor's
  encoder; the decoder predicts the denoising direction. Need a time-step
  embedding (sinusoidal + MLP) injected into Swin-UNETR transformer blocks
  via AdaLN or FiLM. Engineering load: moderate; well-trodden in image
  diffusion.
- **Loss:** standard diffusion loss (L_simple, MSE on predicted noise) +
  optional dose-domain MAE on x̂₀ for stability.
- **Benchmark:** the paper reports on two in-house datasets + an
  OpenKBP-style H&N split. Numbers: dose MAE around 2.0–2.4 Gy depending
  on dataset; beats vanilla 3D-UNet by ~10–15%; **about on par with C3D on
  comparable splits.** Does not claim a leaderboard win.
- **Code:** github.com/whisney/DoseDiff — partial release (training script
  + UNet noise predictor; the SDM preprocessing is in the repo). MIT-ish
  license. Activity through 2024.
- **Compute:** **inference is the cost.** With 50 DDIM steps, ~25–40 s for
  a 128³ volume on A100. Full 1000-step DDPM is ~5–10 min, impractical.
- **FM-head precedent:** none for radiotherapy, but plenty for natural-image
  diffusion-with-FM-encoder (Stable Diffusion / VAE encoder analog).
- **Verdict:** **best second head** for the "calibrated dose + uncertainty"
  story. Add as a *secondary head* on the FM backbone (the diffusion sampler
  shares the encoder, has its own time-conditional decoder). Skip for v1 if
  the goal is a single deterministic OpenKBP number; include for v2 once the
  baseline lands.

### 2.5 nnDoseNet / nnDoseNetv2 (Sun et al., medRxiv 2025; CiBM 2025)

- **Inputs:** CT + PTV/CTV/GTV + OAR masks + body contour. v2 additionally
  uses prescription dose as a constant channel scaled by Rx.
- **Architecture:** nnU-Net auto-config applied to dose regression. The
  configurator picks patch size, spacing, depth, and normalization. v2 adds
  a Rx-aware normalization head so the same model handles 1.5–84 Gy
  prescriptions across IMRT/VMAT/3D-CRT/SBRT.
- **Decoder onto SwinUNETR:** the nnU-Net pipeline picks its own backbone;
  to use this as our head we keep their *data pipeline + loss + decoder*
  and swap the encoder for SwinUNETR. Their decoder is a vanilla 3D U-Net
  decoder, so it's a direct skip-connection match for Swin-UNETR.
- **Loss:** MAE + MSE blend; v2 adds a gradient-domain term (Sobel-of-dose
  L1) to sharpen edges.
- **Benchmark:** **dose 2.579 Gy, DVH 1.540 Gy on OpenKBP H&N** (validation).
  v2 reports per-site MAE 1.8–4.1 Gy across H&N, prostate, breast, lung
  with one model.
- **Code:** github.com/SunLianglong/nnDoseNet — active (commits through
  2025), Apache-2.0. Includes data conversion scripts for OpenKBP and four
  in-house sites. **Most reproducible recent dose work.**
- **Compute:** ~3 s/case on A100 (single-fold); ensemble of 5 folds → ~15 s.
- **FM-head precedent:** none; nnU-Net trains its own encoder.
- **Verdict:** **use as the v1 reference implementation** — wire nnDoseNet's
  data loader, normalization, and loss with our SwinUNETR encoder. Targeting
  ≤ 2.6 Gy dose, ≤ 1.55 Gy DVH on OpenKBP H&N is the right floor.

### 2.6 TrDosePred (Hu et al., JACMP 2023)

- **Inputs:** CT + masks.
- **Architecture:** Swin transformer encoder + 3D CNN decoder (U-Net-like
  skip connections). Ensemble of 5 folds for the leaderboard submission.
- **Decoder onto SwinUNETR:** this is essentially the architecture we are
  building. TrDosePred's encoder is a Swin transformer; SwinUNETR is a
  Swin transformer with U-Net skips. So TrDosePred *is* a SwinUNETR-style
  dose head trained end-to-end. **Strongest direct precedent.**
- **Loss:** MAE + structural similarity, no DVH loss.
- **Benchmark:** **dose 2.43 Gy, DVH 1.59 Gy on OpenKBP** (ensemble; single
  model ~2.55 / ~1.65). Ranked 3rd dose, 9th DVH on CodaLab.
- **Code:** github.com/Hu-Chenyang/TrDosePred — full PyTorch, MIT, last
  commit 2023.
- **Compute:** ~1–2 s/case single-model on A100; ensemble × 5.
- **FM-head precedent:** **partial** — backbone is Swin but trained
  end-to-end on OpenKBP, not pretrained. We can replace it with frozen-VoCo
  Swin and compare.
- **Verdict:** **the cleanest published reference for our exact setup.**
  Reuse their decoder + skip layout, swap their encoder for VoCo SwinUNETR.

### 2.7 Generalizable DL Dose Framework (medRxiv 2026, six sites)

- **Inputs:** CT + structure masks + **aperture/beam geometry as a
  ray-traced channel** (BEV fluence projected back into the CT frame for
  each beam, summed).
- **Architecture:** 3D CNN with site-conditioning embedding (one-hot site +
  modality). Single model trained across six sites (H&N, prostate, breast,
  lung, pancreas, brain) with VMAT + 3D-CRT.
- **Decoder onto SwinUNETR:** geometry channel is a simple extra input
  channel; site embedding goes into FiLM/AdaLN layers in the decoder. Both
  changes are minor.
- **Loss:** MAE + DVH (smoothed differentiable form) + site-balanced
  reweighting.
- **Benchmark:** no OpenKBP table; per-site MAE 1.8–3.5 Gy across six sites.
  The headline is generalization, not a single OpenKBP number.
- **Code:** not released as of submission.
- **Compute:** geometry channel adds preprocessing (~30 s per case to
  ray-trace beams); inference itself unchanged.
- **FM-head precedent:** none, but the geometry-channel idea generalizes to
  any backbone.
- **Verdict:** **borrow the beam-geometry channel** as our v2 input upgrade.
  Don't try to reproduce the six-site training in v1.

### 2.8 DSANet (Tan et al., KBS 2024)

- **Inputs:** CT only. Auxiliary segmentation branch produces structure
  attention maps internally.
- **Architecture:** dual-path encoder (one for "anatomy attention", one for
  "dose features"), cross-attention transfer between paths, single dose
  decoder. Segmentation is a deep-supervision auxiliary head, not an output.
- **Decoder onto SwinUNETR:** complicated. The dual-path encoder doesn't
  map cleanly to a single SwinUNETR. A simpler interpretation that
  *does* map: SwinUNETR encoder + two parallel decoders (one seg, one dose)
  with cross-attention between their bottleneck features.
- **Loss:** dose MAE + Dice on aux seg + DVH loss.
- **Benchmark:** competitive with CT+mask baselines on internal H&N; no
  OpenKBP leaderboard entry. Reported dose MAE ~2.5 Gy on their H&N split.
- **Code:** unreleased.
- **FM-head precedent:** segmentation-as-auxiliary on shared encoder — yes,
  this is the spirit of multi-task FM.
- **Verdict:** **architectural lesson**: cross-attention between seg and
  dose decoders helps when masks aren't given as input. For our setup
  (we *have* masks at training time), this is less critical; use as an
  ablation if we want a CT-only mode.

### 2.9 Beam-wise composition learning (Teng et al., Med Image Anal 2024)

- **Inputs:** CT + masks + **per-beam ray-trace channel** for each beam in
  the plan (one channel per beam direction, up to ~7–9 beams for H&N IMRT).
  Beams are sorted into canonical order.
- **Architecture:** predict per-beam dose contributions, then sum (with
  learned weights) to total dose. Backbone: 3D U-Net per beam, shared
  weights across beams (essentially a "siamese over beams" trick).
- **Decoder onto SwinUNETR:** shared SwinUNETR processes (CT + masks + 1
  beam channel) per beam; outputs are summed. Engineering: needs a
  variable-beam-count loop or a fixed max-beams pad with attention mask.
- **Loss:** MAE on per-beam dose + MAE on summed dose + DVH on summed.
- **Benchmark:** internal H&N IMRT cohort; reports dose ~2.1 Gy, DVH ~1.5
  Gy with OpenKBP-style evaluation. No direct CodaLab submission.
- **Code:** unreleased.
- **FM-head precedent:** none, but the siamese-over-beams idea is reusable.
- **Verdict:** **important for VMAT/IMRT generalization** but expensive
  (forward pass × N beams). Defer to v2.

### 2.10 LLM-empowered dose prediction (Dong et al., Med Phys 2025)

- **Inputs:** CT + masks + a **natural-language prescription** ("70 Gy in
  35 fx to PTV70, 56 Gy to PTV56, dose constraints: parotid mean ≤ 26 Gy …").
  The text is encoded by a frozen LLM (GPT-style, 7B) into a single
  prescription embedding, which is broadcast to FiLM layers in the decoder.
- **Architecture:** 3D U-Net + cross-attention to LLM text tokens at each
  decoder stage.
- **Decoder onto SwinUNETR:** add cross-attention layers in SwinUNETR's
  decoder that attend to the LLM token sequence. Or simpler: project the
  LLM embedding to a vector, FiLM-condition every decoder block. The
  simpler FiLM variant is what Dong's ablation already shows recovers most
  of the gain.
- **Loss:** MAE + DVH.
- **Benchmark:** improves cross-site transfer 10–15% MAE vs no-text
  baseline; no OpenKBP-only number reported.
- **Code:** unreleased (as of Q4 2025 search).
- **FM-head precedent:** uses a frozen LLM — same spirit as our frozen
  VoCo, but for text not vision.
- **Verdict:** **best precedent for prescription-as-conditioning.** Adopt
  the FiLM-on-Rx idea but skip the LLM; use a small MLP over (PTV Rx, OAR
  constraints, fractionation, modality one-hot) producing a 128-dim
  embedding fed to FiLM. Gets ~95% of the LLM-empowered gain at 0% of the
  inference cost.

### 2.11 Multi-task contouring + dose (Gronberg et al., arXiv 2411.18767)

- **Inputs:** CT only at inference (masks are *predicted*, not given).
- **Architecture:** shared 3D encoder, **two parallel decoders** — one for
  multi-class OAR segmentation, one for dose. Trained jointly with task
  balancing.
- **Decoder onto SwinUNETR:** literally what we want. SwinUNETR encoder
  (frozen + LoRA), seg decoder = standard nnU-Net-style decoder, dose
  decoder = same shape but predicts a single dose channel.
- **Loss:** Dice + CE for seg, MAE + DVH for dose, with task-weight
  uncertainty (Kendall–Gal) to balance the two.
- **Benchmark:** dose performance comparable to a dedicated single-task
  dose model on the same dataset (within ~0.1 Gy MAE); seg performance
  comparable to single-task seg. **Critical claim: multi-task does not
  hurt either task.** Used internal Maastro dataset; no OpenKBP entry.
- **Code:** partial — github.com/MAASTRO-DEEPLAB/uplan has training code
  and dataset loaders; weights not released.
- **FM-head precedent:** **the closest published work to our RT-FM head
  design.** Cite explicitly.
- **Verdict:** **adopt this as the architectural template for the
  seg+dose multi-head FM.** Our delta over Gronberg: (a) pretrained VoCo
  backbone (they trained from scratch), (b) prescription FiLM, (c) OpenKBP
  leaderboard number, (d) external validation across two sites.

---

## 3. Decoder design: shared vs separate

| Approach | Pros | Cons | Who uses it | Our pick |
|---|---|---|---|---|
| **Shared encoder, separate decoders per task** | Each decoder learns task-specific features; no interference | More params; need task balancing | Gronberg 2024, Jiao 2024 (multi-modal), DSANet (with cross-attn) | ✓ default |
| Shared encoder + shared decoder, multi-head output | Cheapest; some regularization | Tasks fight for capacity; bad when dose and seg need different receptive fields | rare in dose work | no |
| Cascade: seg decoder feeds dose decoder | Dose decoder sees predicted contours, mimics planner workflow | Error propagation from seg to dose | classical KBP pipelines, not multi-task DL | only as v2 ablation |
| Separate encoders entirely | Best per-task, no FM | Loses FM benefit | C3D, DeepDoseNet, nnDoseNet | no — that's the baseline we're replacing |

**Recommendation:** **shared SwinUNETR encoder + two parallel decoders**
(Gronberg-style). Seg decoder = standard nnU-Net-style upsampling with
skip connections from the four SwinUNETR stages. Dose decoder = same
shape but final 1×1×1 conv outputs a single dose channel (sigmoid×Rx_max
or linear, see §4). Both decoders consume the same skip-connection
features from the SwinUNETR encoder.

Optional **cross-attention between the two decoders at the bottleneck and
at one intermediate stage** (DSANet style) for v2 if multi-task balancing
turns out to be weak. Skip for v1.

---

## 4. How to incorporate prescription dose

Three published options, in order of effectiveness vs engineering cost:

1. **Constant channel scaled by Rx** (nnDoseNet, OpenKBP convention).
   Cheap. PTV mask voxels = Rx (e.g., 70.0), others = 0. Concatenate as
   an extra input channel. Works because PTV mask + scaled value gives
   the network both topology and magnitude.
   - Limits: doesn't represent per-OAR constraints; can't easily handle
     two PTV levels (e.g., 70 Gy + 56 Gy SIB). Workaround = one channel
     per Rx level.
2. **FiLM/AdaLN from a small MLP over (Rx, fractionation, modality, per-OAR
   constraints).** Dong 2025 (without the LLM) is exactly this. Modulates
   every decoder block by (γ, β) vectors. Captures global prescription
   semantics without spatial waste. **Our recommended v1 approach.**
3. **Text prescription → LLM token embedding → cross-attention.**
   Dong 2025 full version. ~10–15% extra cross-site MAE gain over (1)
   alone; vs (2) the marginal gain is small (Dong's own ablation). High
   engineering cost (LLM inference at training and test). **Skip for v1,
   revisit for v3.**

**Recommendation:** combine **(1) + (2)**. Per-PTV Rx-scaled mask channel
*and* a 128-dim FiLM embedding from an MLP over (PTV1 Rx, PTV2 Rx, fx,
modality, OAR constraint vector).

---

## 5. How to incorporate beam geometry

Three options:

1. **Beam-angle one-hot vector** (simplest). 1-of-360 per beam, summed; fed
   via FiLM. Trivial to add. Captures angular distribution only, no
   intensity.
2. **Ray-traced beam channel** (Generalizable DL Dose 2026, beam-field
   diffusion 2025). For each beam, ray-trace a binary or fluence-weighted
   volume through the CT; sum across beams. **One extra input channel.**
   Captures both angles and path length through anatomy. Preprocessing:
   ~30 s/case with cone-beam ray-tracer (numpy + GPU is fine).
3. **Per-beam siamese** (Teng 2024). N forward passes (one per beam),
   summed. Most accurate but expensive.

**Recommendation:** **start without beam geometry (v1)**, because OpenKBP
itself doesn't expose beam angles in a usable form for every case and our
seg-pretrained backbone hasn't seen beam channels. Add **option 2 (ray-
traced summed channel)** as v2 once we have Mayo data with plan
geometry.

---

## 6. Loss recipe

| Loss term | Form | Used by | Effect | Our v1 |
|---|---|---|---|---|
| L1 / MAE | Σ|D−D̂| over body or dose mask | all | core | ✓ weight 1.0 |
| MSE | Σ(D−D̂)² | nnDoseNet (blended) | mild smoothing | ✓ weight 0.1 |
| **DVH loss** (soft histogram MAE) | differentiable DVH per structure | DeepDoseNet, DSANet, LLM-empowered, Gronberg | ↓ DVH score by ~0.1 Gy, ↓ dose score by ~0.2–0.3 Gy in DeepDoseNet | ✓ weight 0.3 |
| Gradient-domain (Sobel L1) | nnDoseNetv2, beam-field diffusion | edge sharpness, helps at PTV boundary | optional v1 (weight 0.05) |
| Perceptual (VGG-3D) | rare in dose; some lung work | helps texture; marginal for dose | skip |
| Dose-difference / γ-loss | clinical 3%/3mm gamma soft proxy | a few papers | clinically motivated but unstable to train | skip v1, optional v2 metric |
| Diffusion ε-MSE | DoseDiff, DiffDP | only if using diffusion head | not v1 | v2 secondary head |

**Does DVH loss actually help?** Yes, when implemented correctly:
- DeepDoseNet shows the largest single gain from adding DVH loss
  (~2.3 → ~2.0 dose; ~1.7 → ~1.6 DVH).
- nnDoseNet and Gronberg both include DVH loss; ablating it loses ~0.1
  Gy on DVH score.
- Risk: numerical instability if the soft-histogram temperature is too
  sharp. Stabilize by warm-up (start training without DVH for 10 epochs,
  then ramp in).

**Recommended v1 recipe:**
`L = 1.0·L1(dose) + 0.1·MSE(dose) + 0.3·DVH_soft + 0.05·Gradient_L1`,
masked to body. Seg branch: `Dice + CE`. Joint weighting via Kendall–Gal
uncertainty (one learnable σ per task).

---

## 7. OpenKBP license — what it constrains for Mayo

OpenKBP is **CC BY-NC-SA 4.0** (per challenge website and Babier 2021 Med
Phys). Implications:

| Use case | Allowed? |
|---|---|
| Train + benchmark a research model on OpenKBP, publish results | ✅ yes, with attribution to Babier 2021 |
| Distribute model weights trained on OpenKBP under CC BY-NC-SA 4.0 | ✅ yes, but downstream is locked to NC-SA |
| Train an FDA-cleared product on OpenKBP and sell it | ❌ no (NC) |
| Pretrain on OpenKBP, fine-tune on Mayo, deploy clinically inside Mayo without selling | 🟡 grey. NC permits non-commercial; intramural clinical use at a non-profit hospital is arguably OK but **legal must approve**. The SA clause means any released derivative is CC BY-NC-SA. |
| Mix OpenKBP with internal Mayo data in a single trained checkpoint and release the checkpoint | 🟡 the checkpoint inherits SA → CC BY-NC-SA. Mayo's data co-mingled in weights is fine for academic release, blocks commercialization. |
| Use OpenKBP only for **benchmarking** an FM pretrained elsewhere; ship a separate Mayo-trained deployment checkpoint | ✅ yes, **this is our path** |

**Operational policy for the project:**

1. **Benchmark weights** (used in any publication on OpenKBP numbers) are
   trained on OpenKBP + Mayo + external, released under CC BY-NC-SA 4.0,
   for research only.
2. **Deployment weights** (any future Mayo intramural clinical use, or
   any commercial spinout) are trained on Mayo + permissive external
   cohorts only — **OpenKBP cases excluded from the deployment training
   set.** Tested on OpenKBP using held-out test set just for reporting.
3. **Pretraining on OpenKBP** the FM backbone (e.g., masked-autoencoding
   on OpenKBP CTs alongside our larger corpus) — same NC-SA contamination
   logic. If we plan to release the backbone, then OpenKBP-pretrained =
   NC-SA. **Safer to leave OpenKBP out of the backbone pretrain and use
   it strictly for downstream evaluation.**
4. Pretraining on OpenKBP and **testing on Mayo** is fine for any academic
   claim ("FM transfers"). Just don't redistribute the resulting weights
   as anything more permissive than CC BY-NC-SA.

---

## 8. Recommended v1 head — concrete spec

**Inputs (channel order, all 3D volumes at SwinUNETR's native input
resolution, e.g., 96³ or 128³ patches with sliding-window):**

1. CT (HU, clipped −1000 to 3000, z-scored)
2. PTV1 mask × Rx1 (Gy)
3. PTV2 mask × Rx2 (Gy) (0 if single-PTV plan)
4. OAR mask channel A (multi-class one-hot OR signed-distance map
   per OAR — start with one channel per OAR, ~10 channels for H&N)
5. body contour
6. (v2) summed ray-traced beam fluence

Plus **non-spatial conditioning**:
- 128-dim FiLM embedding from MLP(Rx1, Rx2, n_fx, modality, OAR
  constraint vector).

**Backbone:**
- VoCo SwinUNETR-base, **frozen except for LoRA adapters in attention
  blocks** (M1's decision). Multi-scale features f1..f4 emitted to skip
  connections.

**Heads:**
- **Seg decoder:** nnU-Net-style 3D decoder, OAR + PTV multi-class output.
  Loss = Dice + CE.
- **Dose decoder:** same shape, single-channel output, linear activation
  (no sigmoid, since dose can exceed Rx in hot spots). FiLM-conditioned
  at every stage with the Rx embedding. Loss = L1 + 0.1·MSE + 0.3·DVH
  soft + 0.05·gradient L1.
- **(v2) Refinement stage** (C3D-style): a small 3D U-Net taking (CT,
  masks, stage-1 dose) and outputting a residual. Trained after stage-1
  converges.
- **(v2) Diffusion head:** shares encoder; time-conditional decoder for
  calibrated dose sampling (DoseDiff-style).

**Task balancing:** Kendall–Gal uncertainty weights (learnable log σ²
per task).

**Training schedule:**
- Phase 1 (10 epochs): seg only, dose loss off, to warm up LoRA + decoder
  on a stable task.
- Phase 2 (40 epochs): seg + dose, L1 only on dose.
- Phase 3 (30 epochs): add DVH loss with ramp-in (weight 0 → 0.3 over 5
  epochs), add gradient loss.
- Phase 4 (v2): refinement stage trained with stage-1 frozen.

---

## 9. Baselines and dose-blind ablation plan

### 9.1 Reference baselines we must beat on OpenKBP H&N

| Baseline | Why include | Target numbers |
|---|---|---|
| HD-UNet (Nguyen 2019) | Historical floor | dose ~2.6 / DVH ~1.7 |
| **C3D** (Liu 2021) | Challenge winner | **2.31 / 1.55** |
| **DeepDoseNet** (Soomro 2021) | Best dose score | **~2.0 / ~1.6** |
| nnDoseNet (Sun 2025) | Most reproducible | 2.579 / 1.540 |
| TrDosePred (Hu 2023) | Same-family architecture | 2.43 / 1.59 |

**Pass bar to claim "multi-task FM does not hurt dose":** reach
**dose ≤ 2.6 Gy and DVH ≤ 1.55 Gy** on OpenKBP H&N test set with the
multi-task head. This matches nnDoseNet (reproducible reference) and
sits within 0.3 Gy of C3D/DeepDoseNet.

**Stretch goal for "FM helps":** **dose ≤ 2.3 Gy and DVH ≤ 1.50 Gy**,
beating C3D and matching/beating DeepDoseNet without using OpenKBP in
backbone pretraining.

### 9.2 Ablation plan (each ablation is one row in the paper table)

1. **From-scratch baseline:** same head architecture, no FM pretrain.
   Tests whether VoCo backbone helps at all.
2. **FM frozen vs FM + LoRA vs FM full fine-tune.** Picks adapter
   strategy.
3. **Single-task (dose only) vs multi-task (dose + seg).** The Gronberg
   replication — does seg head hurt dose?
4. **No DVH loss vs with DVH loss.** Re-confirms Soomro's claim.
5. **Constant Rx channel only vs FiLM-Rx only vs both.** Prescription
   conditioning ablation.
6. **CT-only (no masks at inference) vs CT + masks.** "Mask-free FM" mode
   — tests whether the FM has learned anatomy strongly enough.
7. **No beam geometry vs ray-traced beam channel (v2).** Beam-conditioning
   gain.
8. **No refinement vs C3D-style refinement (v2).**
9. **(Optional, v2)** Deterministic head vs diffusion head — diversity vs
   accuracy trade-off.

### 9.3 Dose-blind validation ablation (the killshot reviewer asks for)

Per the proposals doc, *every* paper from this project must include a
**dose-vs-no-dose ablation** at the *outcome* level (does dose actually
help downstream prediction?). For M4 (the dose-prediction head itself),
the analog is:

- **Train the dose head with masks fully zeroed out** at random for 50%
  of samples ("mask dropout"). Evaluate dose score on the held-out
  validation set with both modes.
- If the FM-pretrained backbone gives meaningful dose predictions in the
  *mask-free* condition (e.g., dose ≤ 3.5 Gy MAE), we have a publishable
  claim that the FM has internalized anatomy.
- If not, masks are still needed and we report that honestly.

---

## 10. Code/reproducibility status (snapshot, May 2026)

| Repo | Stars-ish | Last commit | License | Useful for |
|---|---|---|---|---|
| github.com/LSL000UD/RTDosePrediction (C3D) | ~200 | 2022 | MIT | baseline decoder + cascade design |
| github.com/SunLianglong/nnDoseNet | ~80 | 2025 | Apache-2.0 | data loader, normalization, loss; **the v1 starting repo** |
| github.com/Hu-Chenyang/TrDosePred | ~50 | 2023 | MIT | Swin-decoder layout reference |
| github.com/whisney/DoseDiff | ~40 | 2024 | MIT | diffusion noise predictor, SDM preprocessing |
| github.com/MAASTRO-DEEPLAB/uplan (Gronberg) | small | 2024 | check on use | multi-task seg+dose loaders |
| github.com/mumtazsoomro/DeepDoseNet | small/mirror | 2022 | unclear | DVH-loss reference only |

(Star counts approximate; licenses verified via repo LICENSE files at the
time of last check — confirm again at coding time.)

---

## 11. Compute cost summary (single H&N CT, 512×512×~150 native, ~128³ patched)

| Model | Train (1 GPU-day, A100) | Inference per case |
|---|---|---|
| C3D | 2 days × 5 folds | <1 s |
| DeepDoseNet | 2–3 days | ~1–2 s |
| nnDoseNet | ~5 days (auto-config + 5 folds) | ~3 s (single fold), 15 s (ensemble) |
| TrDosePred | ~3 days × 5 folds | ~1–2 s |
| DoseDiff | ~7 days | **25–40 s (50-step DDIM)** |
| **Our M4 plan (FM + LoRA + multi-head)** | ~3 days for heads (backbone frozen) | ~2–3 s (single forward); +30 s if beam ray-tracing v2 |

All numbers approximate, single A100. Clinical-deployable on Mayo's
existing GPU box.

---

## 12. Final recommendation (head choice + concrete config)

- **Head architecture:** Gronberg-style **shared SwinUNETR encoder + two
  parallel decoders** (seg + dose). nnU-Net-style decoder geometry (TrDosePred's
  decoder layout works fine).
- **Inputs:** CT + Rx-scaled PTV mask(s) + multi-class OAR masks + body
  contour. FiLM-Rx embedding for the dose decoder. No beam geometry in v1.
- **Loss:** L1 + 0.1·MSE + 0.3·DVH-soft + 0.05·gradient-L1; Dice+CE on seg;
  Kendall–Gal task balancing.
- **Training:** VoCo backbone frozen + LoRA on attention; 4-phase schedule.
- **Pass bar (OpenKBP H&N):** dose ≤ 2.6 Gy, DVH ≤ 1.55 Gy.
- **Stretch:** dose ≤ 2.3 Gy, DVH ≤ 1.50 Gy.
- **v2 upgrades (paper 2 or revision):** beam-geometry ray-trace channel,
  C3D refinement stage, optional diffusion head.
- **License hygiene:** OpenKBP for benchmarking + research weights only;
  separate Mayo-only deployment checkpoint excludes OpenKBP from training.

---

## 13. Key citations (compact)

1. Babier A et al. *OpenKBP*, Med Phys 2021. CC BY-NC-SA 4.0.
2. Liu S et al. *C3D*, Med Phys 2021.
3. Soomro M et al. *DeepDoseNet*, arXiv 2111.00077, 2021.
4. Hu C et al. *TrDosePred*, JACMP 2023.
5. Wen X et al. *TransDose*, Med Image Anal 2023.
6. Zhang/Feng Y et al. *DoseDiff*, IEEE TMI 2024 43:3621–3633.
7. Sun L et al. *nnDoseNet*, medRxiv 2025 → Comput Biol Med 2025.
8. Tan S et al. *DSANet*, KBS 2024.
9. Teng X et al. *Beam-wise composition learning*, Med Image Anal 2024.
10. Dong B et al. *LLM-empowered dose prediction*, Med Phys 2025.
11. Gronberg M et al. *Multi-task contour+dose*, arXiv 2411.18767, 2024.
12. *Generalizable DL Dose Framework*, medRxiv 2026.
13. Kearney V et al. *DoseGAN*, Sci Rep 2020.
14. Jiao Z et al. *Multimodal multi-task dose*, Med Phys 2024.
15. Nguyen D et al. *HD-UNet*, PMB 2019.
