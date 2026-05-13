# Direction A 文献综述 · 中文简版

> 长版 [lit-review.md](lit-review.md)（~75 篇，英文，12 sections）。本文只保留关键判断。

## 一句话定位
**Direction A = 第一个 native 吃多个 3D timepoint 的 medical FM**。其他人要么是 single-timepoint，要么是 2-timepoint pair，要么是非 FM 的 forecaster。

---

## 直接竞品 8 强（按威胁度排）

| # | 作品 | 输入 | 弱点 |
|---|---|---|---|
| **1** | **TTE Pretraining**（Stanford, arXiv 2411.09361）| 单 CT | label 时序，影像不是序列 |
| 2 | SSL-AD (2509.10453) | 3D 序列 | 仅脑 MRI，3,161 病人，小 |
| 3 | CRONOS (2512.16577) | 多 timepoint | forecaster 不是 FM，无 text/EHR |
| 4 | Temporal Flow Matching (2508.21580, MIC-DKFZ) | 3D 序列 | generative，不是 representation FM |
| 5 | **Merlin** (Nature 2026, Stanford) | 单 CT + EHR + reports | 5-yr risk 用 EHR label 的时序，影像静态 |
| 6 | BrLP (2502.08560) | 3D 序列 | 仅脑 MRI 生成 |
| 7 | TAMME / Holistic Time-Aware (MICCAI 2025) | 多模态序列 | 没 native 3D image 编码器 |
| 8 | BioViL-T / MAIRA-2 (Microsoft) | 2 张 CXR | 2D 不是 3D |

**结论**：**没人 ship 过 "FM-scale + 多器官 + 3D 序列 + interval-aware SSL + multimodal" 的全套**。最近的两个 (SSL-AD, CRONOS) 都是窄场景或非-FM。

---

## 五大领域的成熟度

| 领域 | 成熟度 | 代表 |
|---|---|---|
| Single-timepoint 3D FM | **饱和** | Merlin, CT-CLIP, CT-FM, RadFM, M3FM, 3DINO, Triad, Decipher-MR |
| 单图 + EHR label 时序 | **被 TTE 占** | Stanford TTE Pretraining |
| 2D 纵向 SSL | 成熟（CXR 居多）| BioViL-T, MAIRA-2, L-MAE |
| 3D 纵向 SSL | **几乎零（关键缺口）** | SSL-AD（脑 only / 小）|
| 3D 纵向生成 | 升温中 | BrLP, SADM, TFM, Latent FM |

---

## White Space（最重要部分）

### 架构层
- 3D-volume encoder + Δt-aware temporal attention 在一个 **FM 而不是 forecaster** 里（CRONOS 是 forecaster；SSL-AD 是脑专用小规模）
- 3D image tokens × EHR event tokens × shared continuous-time PE 的 **per-visit cross-attention**（Merlin 单 timepoint；没人合 3D image 序列 + EHR 序列在同一时间轴）
- 混合模态序列（CT@t1, MRI@t2, report@t3, lab@t4）统一 tokenization（最近的 CLDM 仅 generative）

### Objective 层
- **Interval-aware Masked Volume Modeling (IA-MVM)**: 短 Δt 高冗余高 mask 比率；长 Δt 保守 mask 预测 delta。L-MAE 在 2D fundus 做了；3D zero
- **Next-volume prediction in latent space** 作 SSL 的 primary objective（CRONOS / Latent FM 框成 forecasting，没人用作 representation 预训练 primary）
- **Cross-modal temporal contrast**: volume@t 与 report/EHR window 配对，push same-patient t' ≠ t 远离（ChronoCon 是 2D；Temporal-SCL 是 tabular）
- **Trajectory-aligned contrast across patients**（LNE 的 FM-scale 版）

### 临床评测
- **RECIST 预测**从 ≥3 prior CT + interval awareness + zero-shot —— 没人做
- 跨疾病、跨模态 progression benchmark（3D-RAD 是基础）
- Time-to-event Harrell's C 跨 ≥5 器官系统从一个 3D temporal FM checkpoint
- 非-CXR 3D 模态的纵向报告生成

### 数据层
- **没人**统一用 NLST + INSPECT + AbdomenAtlas-longitudinal + ADNI/OASIS + UK Biobank repeat 预训练
- Federated longitudinal cross-institution
- 重 tokenize Stanford PACS 为 3D image 序列

---

## 可直接借用的 building blocks（开源 / 现成）

### Pretrained 权重
Merlin · CT-FM · CT-CLIP / CT-RATE · 3DINO · Triad · VISTA3D · SuPreM · VoCo · BrainIAC · Decipher-MR · Sybil · SADM · Temporal Flow Matching (MIC-DKFZ) · ImageFlowNet · LNE · 3D-RAD · BioViL-T · MAIRA-2（全部 HF / GitHub 公开）

### 时序 recipe
| 来源 | 借用什么 |
|---|---|
| **CRONOS** | Fourier continuous-time PE |
| **TaViT** | Δt-scaled attention |
| **L-MAE** | time-aware PE for MAE |
| **TAMME** | time-aware multimodal tokenization |
| **SADM** | sequence-aware diffusion conditioning |
| **LNE** | trajectory-aligned neighborhood loss |
| **TTE (Huo)** | survival head 损失 |
| **ETHOS / Foresight / CoMET** | PHT-style EHR tokenizer |

### 评测 benchmark（ready to use）
- **RECIST 1.1** (Cancers 2025 baselines)
- **INSPECT** (Stanford, 19k CT + 5-yr EHR)
- **3D-RAD multi-temporal** (NeurIPS 2025)
- **ADNI MCI conversion** 1/2/3-yr
- **NLST 1–6 yr** (Sybil baseline + 多 screen 输入)
- **HECKTOR PFS C-index**
- **BraTS 2024 post-treatment**
- **TADPOLE 5-yr forecast**

---

## 推荐 loss 组合（lit review agent 的建议）

```
total = α · IA-MVM           # interval-aware masked volume reconstruction
      + β · NVP-LS           # next-volume prediction in latent space (MSE or flow matching)
      + γ · CMTC             # cross-modal temporal contrast (volume(t) ↔ text/EHR window)
      + δ · TTE-head         # Huo-style survival on longitudinal labels (fine-tune only)
      + ε · trajectory-loss  # LNE-style manifold
```

**Encoder**：3D-ViT 或 U-Net-ViT-hybrid（参考 M3T / CT-ViT / SwinUNETR），加 Fourier(Δt) 到 patch token + Δt-scaled cross-visit attention

---

## 一句话给 Direction A 的最终判断

> **空间是真的存在的，前 5 强竞品有 4 个公开权重 + 1 个被 Stanford 占着但他们走的是"单图 + 时序 label"那条路，刚好留出"序列 + label"那块。最大的不是 novelty 问题而是 (1) 工程 (2) 拿到足够的多-timepoint 数据。**
