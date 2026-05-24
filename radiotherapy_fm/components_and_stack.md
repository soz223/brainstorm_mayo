# Mayo-RT-VFM — Final Component Stack

> Direct outputs of 7 per-module deep-dive subagents. Detailed reports in [`research/modules/`](research/modules/).
> **Final config (2026-05-23): pure vision FM, no LLM. VoCo-H (CT) + Triad-L (MRI) = 2.2B multimodal vision FM, continued-pretrained on pan-cancer RT data with Δt-Siamese MAE.**
> This file = the buildable spec.

## Final config (locked)

| Decision | Value |
|---|---|
| LLM | **None** — pure vision FM |
| CT/CBCT backbone | **VoCo-H** (1.2B, Apache-2.0) |
| MRI backbone | **Triad-L** (~1B, parallel branch) |
| Continued pretraining | **Yes** — Δt-Siamese MAE + cross-cancer MAE + masked dose modeling on Mayo + TCIA pan-cancer RT |
| Total vision params | **~2.2B** |
| Scope | **pan-cancer** (H&N + NSCLC + prostate + …) |
| Trainable in pretrain | full 2.2B |
| Trainable downstream | ~80M heads + LoRA (r=8) ~5M = ~85M |
| Compute | 8× H200 single node (training); same for inference |
| Timeline | ~5-7 months to paper submission |

## 0. Architecture diagram

```
DICOM (CT / CBCT / MRI / RT-Dose / RT-Struct)
    │
    ▼  SimpleITK + pydicom-rt    →  per-patient/per-visit/{ct,cbct,mri,dose,masks}.nii.gz
    │
    ├─────── Registration preprocessing (M2) ───────┐
    │         ANTsPy (rigid→affine)                  │
    │         uniGradICON + ConvexAdam (deformable)  │     QC: uniGradICON ↔ ConvexAdam
    │         (skip sCT for v1)                       │     disagreement field
    │                                                ▼
    │                                       Aligned CT / CBCT / MRI + DDF
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Mayo-RT-VFM (2.2B, continued-pretrained on pan-cancer RT)               │
│                                                                          │
│   CT/CBCT branch  : VoCo-H 1.2B (SwinUNETR-H, Δt-MAE continued pretrain) │
│   MRI branch      : Triad-L ~1B  (parallel encoder, cross-modal align)   │
│   shared latent   : 1024-d cross-modal projection                        │
│                                                                          │
│   Continued-pretraining objectives:                                      │
│      · Δt-Siamese MAE (STAMP-style)                                      │
│      · cross-cancer MAE                                                  │
│      · cross-modal contrastive (CT ↔ MRI when paired)                    │
│      · masked dose modeling                                              │
│                                                                          │
│   produces per-scan multi-scale feature pyramid                          │
└─────────────────────────────────────────────────────────────────────────┘
                 │              │              │
   ┌─────────────┘              │              └─────────────┐
   ▼                            ▼                            ▼
┌──────────────┐   ┌──────────────────────┐   ┌──────────────────────────┐
│ M3 Seg head  │   │ M4 Dose head         │   │ Per-visit pooled         │
│ × 2 decoders │   │ shared encoder +     │   │ embedding (avg-pool)     │
│              │   │ parallel U-Net       │   │                          │
│ Lesion (LFD) │   │ decoder (Gronberg /  │   │   ▼                      │
│   warm-start │   │ TrDosePred geometry) │   │ M5 Replan head           │
│ ← VoCo_B.pt  │   │                      │   │  small temporal-attn +   │
│              │   │ FiLM-conditioned on  │   │  tabular branch          │
│ OAR (DiceCE) │   │ Rx, fractionation,   │   │  (DVH + clinical + Δ)    │
│   warm-start │   │ modality, OAR        │   │                          │
│ ← VoComni_B  │   │ constraint vector    │   │   ▼                      │
│              │   │                      │   │ M6 Outcome heads         │
│ DeepSup [1,  │   │ Loss: L1 + 0.1·MSE   │   │  XGBoost-Cox × 6:        │
│  .5,.25,.125]│   │ + 0.3·DVH_soft       │   │   LC, DM, xerostomia,    │
│ Sliding win  │   │ + 0.05·grad-L1       │   │   pneumonitis,           │
│ 96³ ovl 50%  │   │                      │   │   esophagitis, dysphagia │
└──────────────┘   └──────────────────────┘   └──────────────────────────┘
                                                          │
                                              [paired DeLong vs M7 radiomics+XGB]
                                                          │
                                                          ▼
                                              Decision-curve / net-benefit
                                              (Vickers DCA via `dcurves`)
```

## 1. Component table — one row per module

| # | Module | Pick | License | Repo / weights | Fallback |
|---|---|---|---|---|---|
| M1-CT | CT/CBCT backbone | **VoCo-H** (1.2B) | **Apache-2.0** ⚠️ source-data audit | [Luffy03/Large-Scale-Medical](https://github.com/Luffy03/Large-Scale-Medical) · [HF Luffy503/VoCo](https://huggingface.co/Luffy503/VoCo) | VoComni_L (290M) for quick prototype |
| M1-MRI | MRI backbone | **Triad-L** (~1B) | check | [wangshansong1/Triad](https://github.com/wangshansong1/Triad) · [arXiv 2502.14064](https://arxiv.org/abs/2502.14064) | BrainIAC (brain-only) |
| M1-PT | Continued pretraining | **Δt-Siamese MAE** (STAMP-style) + cross-cancer MAE + cross-modal contrastive + masked dose modeling | n/a (our code) | based on [STAMP arXiv 2512.23441](https://arxiv.org/abs/2512.23441) | — |
| M2-A | Affine | **ANTsPy** `Rigid → Affine` | BSD-3 | `pip install antspyx` | SimpleITK Elastix |
| M2-B | Deformable | **uniGradICON** + **ConvexAdam** (both, parallel) | Apache-2.0 / MIT | [uniGradICON](https://github.com/uncbiag/uniGradICON) · [ConvexAdam](https://github.com/multimodallearning/convexAdam) | TransMorph (MedIA 2022) |
| M2-C | sCT | **SKIP v1** | — | — | Revisit if HU instability hurts |
| M3 | Seg head × 2 | **SwinUNETR decoder (lesion)** + **SwinUNETR decoder (OAR)** — separate, share encoder | Apache-2.0 (MONAI) | `monai.networks.nets.SwinUNETR` | + SegResNetDS parallel for H&N tumor if Dice stalls |
| M3 | Seg recipe to copy | **NVAUTO HECKTOR'22 winner** | MIT | `Project-MONAI/tutorials/competitions/HECKTOR22` | — |
| M4 | Dose head | **Gronberg-style shared encoder + parallel U-Net decoder**, TrDosePred geometry | code mostly MIT/Apache | TrDosePred paper code, Gronberg arXiv 2411.18767 | C3D / DeepDoseNet for baseline |
| M5 | Replan head | **2-layer 4-head temporal Transformer + Time2Vec Δt + masked attention pool + tabular branch (DVH+clinical+Δ) + MLP** | own code | — | **XGBoost 2.0 if positives < 150** |
| M6 | Outcome (×6) | **XGBoost-Cox primary** + scikit-survival GBSA cross-check + lifelines penalized CoxPH | Apache-2.0 / BSD | `xgboost ≥ 2.0`, `scikit-survival`, `lifelines` | DSM (auton-survival) as multi-task supplementary |
| M7 | Radiomics baseline | **PyRadiomics** primary + **MIRP** sensitivity | BSD-3 / EUPL | [pyradiomics](https://github.com/AIM-Harvard/pyradiomics) · [MIRP](https://github.com/oncoray/mirp) | — |

## 2. Loss & training recipes

### Segmentation (M3)

```python
# Lesion
loss_lesion = monai.losses.DiceFocalLoss(
    gamma=2.0, include_background=False, to_onehot_y=True, softmax=True)
# OAR
loss_oar = monai.losses.DiceCELoss(
    include_background=False, to_onehot_y=True, softmax=True)
# Deep supervision weights at decoder stages
ds_weights = [1.0, 0.5, 0.25, 0.125]
# Sampling
sampler = monai.transforms.RandCropByPosNegLabeld(
    keys=["image","label"], spatial_size=(96,96,96),
    pos=2, neg=1, num_samples=4)
```

### Dose (M4)

```python
# Body-masked composite
L = 1.0 * L1(dose_pred, dose_gt)         \
  + 0.1 * MSE(dose_pred, dose_gt)        \
  + 0.3 * DVH_soft(dose_pred, dose_gt, structure_masks)   # ramp in after epoch 10
  + 0.05 * grad_L1(dose_pred, dose_gt)
# Multi-task with seg (Kendall–Gal):
L_total = sigma_seg.exp().rec() * L_seg + sigma_dose.exp().rec() * L_dose \
        + log(sigma_seg * sigma_dose)
```

### Replan (M5)

```python
# class-balanced focal BCE
loss = sigmoid_focal_loss(logits, y, alpha=class_weight, gamma=2.0)
sampler_weights = 1.0 / sqrt(class_counts)   # sqrt-inv-frequency
# threshold tuned to clinical replan rate (HN: 0.10-0.30) via net-benefit
```

### Outcome (M6)

```python
# XGBoost-Cox per endpoint
xgb.XGBRegressor(
    objective='survival:cox', eval_metric='cox-nloglik',
    max_depth=3, min_child_weight=8,
    learning_rate=0.05, reg_alpha=0.1, reg_lambda=1.0,
    n_estimators=2000, early_stopping_rounds=100)
# Six separate models (LC, DM, xerostomia, pneumonitis, esophagitis, dysphagia)
# Multi-task DSM only as supplementary "joint risk profile" figure
```

### Radiomics baseline (M7)

```
PyRadiomics extract: 107 base × {Original, LoG σ∈{1,2,3}, Wavelet coif1 ×8}
  → 1130 features per ROI per timepoint per modality
Delta: T0, T_mid (wk3 CBCT), T_end (wk6 CBCT)
  per feature → {abs delta, rel delta, OLS slope, traj AUC, last value} = 5×
Harmonize: ComBat per modality (batch=scanner_model)  [NOT across CT vs CBCT]
Stability: ICC(3,1) >= 0.80 on ±1-voxel perturbation
Select: nz-var → Spearman |ρ|<0.90 → mRMR top-30 → LASSO-Cox final 10-20 (EPV ≥ 10)
Classify: XGBoost Cox + LASSO-Cox linear baseline; Cox meta-learner stack
```

## 3. Targets we must hit / beat

| Endpoint | Radiomics+XGB literature | FM bar to clear |
|---|---|---|
| H&N LRC (recurrence) | C-idx 0.66-0.74 | **C-idx ≥ 0.72 on Mayo, ≥ 0.68 on external; or ≥ 0.05 abs gain + DeLong p<0.05** |
| NSCLC 2y OS | AUC 0.65-0.75 | external AUC > 0.75 or ≥ 0.05 gain + DeLong p<0.05 |
| Xerostomia / pneumonitis | AUC 0.65-0.78 | AUC ≥ 0.70 with dose-vs-no-dose ablation showing positive contribution |
| Replan trigger | published AUC 0.79-0.85 | beat clinical rule (GTV-shrink>30% or weight-loss>5%) on **net benefit**, not AUC |
| Dose prediction (OpenKBP H&N) | nnDoseNet 2.579 / 1.540 Gy | **pass:** ≤ 2.6 / ≤ 1.55. **stretch:** ≤ 2.3 / ≤ 1.50 (multi-task doesn't hurt) |
| Seg — H&N tumor (HECKTOR'22) | NVAUTO DSC 0.788 | match within 0.02 with frozen-VoCo + LoRA |
| Seg — OAR (TotalSegmentator) | CT-FM 0.898 (117 cls) | match within 0.01 |

## 4. Mandatory ablations (don't ship paper without these)

- ✅ **From-scratch vs FM** (justifies "F" in FM)
- ✅ **Frozen vs LoRA vs full fine-tune**
- ✅ **Dose-blind ablation** (zero out dose input → outcome) — subagent 05 reviewer killshot #2
- ✅ **Single-timepoint vs longitudinal**
- ✅ **Clinical-only / +DVH / +Embed / Full** 4-way (M6)
- ✅ **DVH-loss on/off** (M4)
- ✅ **FiLM-Rx on/off** (M4)
- ✅ **Multi-task (seg+dose) vs single-task** (Gronberg replication)
- ✅ **uniGradICON vs ConvexAdam vs both** (M2 QC)
- ✅ **Paired DeLong: FM vs radiomics+XGB on the same fold splits**

## 5. License & compliance checklist (do NOT skip)

| Item | Status | Action |
|---|---|---|
| ⚠️ **VoCo PreCT-160K source audit** | OPEN | Mayo IRB / data-use to audit the source dataset list for non-commercial covenants before basing clinical work on VoCo |
| ⚠️ **OpenKBP CC BY-NC-SA** | KNOWN | Use for benchmarking only. Train a **separate Mayo-only deployment checkpoint** that excludes OpenKBP. Do NOT include OpenKBP in backbone pretrain corpus |
| ⚠️ **SuPreM** | OUT | CC-BY-NC-ND blocks fine-tune. Cite as literature, do not build on it |
| ✅ VoCo weights | OK | Apache-2.0 |
| ✅ uniGradICON | OK | Apache-2.0 |
| ✅ ConvexAdam | OK | MIT |
| ✅ ANTsPy | OK | BSD-3 |
| ✅ MONAI / PyRadiomics / MIRP / xgboost / sksurv / lifelines | OK | All permissive |

## 6. Install (single command for v1 environment)

```bash
# Core
pip install torch==2.4.* torchvision monai==1.4.* peft==0.13.* \
            xgboost==2.1.* scikit-survival==0.23.* lifelines \
            pyradiomics mirp \
            antspyx unigradicon SimpleITK nibabel pydicom-rt \
            dcurves dceurves shap

# ConvexAdam (no pip; clone)
git clone https://github.com/multimodallearning/convexAdam.git

# VoCo weights (HuggingFace)
huggingface-cli download Luffy503/VoCo --local-dir ./weights/voco

# (optional v2) TotalSegmentator for OAR baseline
pip install totalsegmentator
```

## 7. First-week verification script (5 lines)

```python
# v1_smoke_test.py — verify backbone, decoders, and embeddings work
import torch, monai
from monai.networks.nets import SwinUNETR
m = SwinUNETR(img_size=(96,96,96), in_channels=1, out_channels=14,
              feature_size=48, use_v2=True).cuda()
m.load_state_dict(torch.load("./weights/voco/VoCo_B.pt"), strict=False)
x = torch.randn(1,1,96,96,96).cuda(); y = m(x); print(y.shape)
# Expect: torch.Size([1, 14, 96, 96, 96])
```

## 8. Compute estimate (revised — 8× H200 single node)

| Phase | GPU × time | Cumulative |
|---|---|---|
| Phase 0 — Data curation + registration pipeline | CPU + 2× H200 × 4 wk | 4 wk |
| Phase 1 — Δt-Siamese MAE continued pretrain (VoCo-H, CT only) | **8× H200 × 6-8 wk** | 12 wk |
| Phase 2 — Cross-modal alignment (add Triad-L MRI branch) | 8× H200 × 4 wk | 16 wk |
| Phase 3 — Downstream heads + ablations | 8× H200 × 6-8 wk | 23 wk |
| Phase 4 — External validation + paper writing | 4× H200 × 4-6 wk | **29 wk ≈ 7 mo** |
| **Total** | **8× H200 single node** | **≈ 5-7 mo to submission** |

## 9. Open decisions (still on you)

1. ✅ **Scope** — **pan-cancer** (H&N + NSCLC + prostate + others Mayo has). Locked.
2. ✅ **LLM** — **none, pure vision FM**. Locked.
3. ✅ **Parameter target** — **2.2B vision (VoCo-H + Triad-L)**. Locked.
4. **External cohort per cancer site** — TCIA HNSCC, NSCLC-Radiomics, Prostate-MRI etc. Lock before pretraining begins.
5. **Mayo IRB audit on VoCo PreCT-160K source list** — needed for safe clinical-grade derivative
6. **Advisor sign-off** on "**Mayo-RT-VFM = 2.2B pan-cancer multimodal vision FM, continued-pretrained with Δt-Siamese MAE on Mayo + TCIA RT, with 5 task heads**"
