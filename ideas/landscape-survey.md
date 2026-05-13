# 三方向 landscape 调研

> 三个 subagent 并行调研 + 一个 deep-dive。结论：**A 是唯一真有留白的方向**。

## 三方向留白对比

| 方向 | 留白 | 关键威胁 | 判定 |
|---|---|---|---|
| **A. 纵向 3D FM** | **30–40%** ✅ | Merlin / TTE 都只用单 scan | 主攻 |
| **B. 病人级多模态 FM** | 15–25% ⚠️ | HONeYBEE / CLIMB / Med-PaLM M / Merlin 已盖 | 不推荐 |
| **C. 解剖感知 tokenization** | 15–25% ⚠️ | OWT 已发表占核心 | 可作 follow-up |

## A 方向 deep-dive：最接近的工作

| 工作 | 输入 | 病人数 | 差在哪 |
|---|---|---|---|
| **SSL-AD** (2509.10453, 2025) | 1–4 张 MRI + Δt | 3,161（仅 1,114 有 ≥3） | 自己不叫 FM；规模差 3× |
| **STAMP** (2512.23441, 2025) | **2 张** Siamese + Δt | 2,569 | N=2 不是序列 |
| **CRONOS** (2512.16577) | **7–11 张**+ Fourier 时间编码 | 48–92 | 架构对了但没预训练 |
| **LSSL** (Stanford 2021) | 2 张 + Δt | 811 ADNI | pairwise，task-specific |
| **LNE** (Pohl 2022) | 2 张 + Δt | <1,700 | pairwise + k-means 瓶颈 |
| **LongFormer-MRI** (WACV 2024) | current + prior + flow (N=2) | 1,306 ADNI | 监督学习，pair |
| **TeViT** (2023 NLST) | 2 张 + MAE | ~1,932 | pair only，<2k 病人 |
| **BrainIAC** (Nat Neurosci 2026) | 单 MRI（独立采样） | 32k 预训练 | **故意忽略 ordering 和 Δt** ← 最讽刺 |
| **TTE Pretraining** | 单 CT | 18,945 | 见 [拆解](time-to-event-pretraining.md) |
| **M3FM** (Nat Commun 2025) | 单 CT 多任务 | 163,725 | FM 规模但 single scan |

## 为什么没人做（70 / 20 / 10）

### 70%：数据
- 没有任何公开数据集满足 ≥3 timepoint × 3D × >10k 病人 × 带 reports
- ADNI 有 ≥3 的 <2k；UK Biobank reimaging 多数 N=2；NLST Sybil 故意当独立样本
- 跨 cohort 拼接 = 不同扫描仪 / 序列 / 场强

### 20%：算力
- 5 × (160³) volume ≈ 125 GB activation
- 10k 病人 × 序列 = 严重 sharding 需求
- 大多数学术组没烧得起

### 10%：方法
- 连续时间编码已被 CRONOS / STAMP / Time2Vec 解决
- 现成可用，不是 blocker
- 整个 community 卡在 **pair-Siamese local optimum**

## 关键洞察

**BrainIAC 是最讽刺的反例**：有 48,965 张 MRI、32k 预训练，却选了 SimCLR + 每病人独立采样一张 scan 的路径，**主动放弃** longitudinal 结构。

> "Each patient is seen once per epoch, sampling one scan."

→ 证明即使有数据，方法路径错也会错过这个方向。

## B 方向 deep-dive（不推荐做的理由）

主要威胁：
- **HONeYBEE** (npj Digital Medicine 2025)：11,400+ TCGA 病人 unified embedding
- **CLIMB** (MIT, ICML 2025)：4.51M 病人 × 15 modalities
- **Merlin** (Nature 2026)：CT + EHR + reports
- **Med-PaLM M** (Google 2023)：imaging + text + genomics

→ "patient-level multimodal + modality-incomplete + cross-modal gen" 在 2026 已不是 headline novelty。

可救：加 longitudinal 维度 + uncertainty calibration → 但这等于退化成 A + 加料。

## C 方向 deep-dive（可作 follow-up）

主要威胁：
- **OWT** (2505.04899, 2025)：organ-wise tokenization 核心 idea 已实现
- **Merlin**：anatomy 引导对比（不是 token grid）
- **Reg2RG / GK-MVLP / AFiRe**：region-pool 对齐 reports
- **VasoMIM / AMAP / ADAM**：anatomy-guided masking

剩余 white space：anatomy-token + sentence-level alignment + FM-scale 同时具备的工作没人做过。

→ **作为 A 的 follow-up paper 来做**：A 跑通后，把 anatomy-defined tokens 加进去，写第二篇。

## 决策
**先做 A，2–4 个月内出第一篇。A 跑通后选 (a) A + anatomy token 进 follow-up，或 (b) A + 病人级多模态扩展。**
