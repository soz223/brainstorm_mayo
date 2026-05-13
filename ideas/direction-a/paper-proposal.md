# Direction A · Paper Proposal（中文）

> 基于 [lit-review-zh](lit-review-zh.md) 的 white space 分析 + [datasets-zh](datasets-zh.md) 的可用数据。
> 状态：v0.1 草案，待 dataset deep-dive 完成后补数据规模细节。

---

## 1. 标题候选

主推：
> **"Time-Aware Volumetric Pretraining: A Foundation Model for Longitudinal 3D Medical Imaging"**

备选：
- "TimeFM-3D: First Native Multi-Timepoint Foundation Model for Radiology"
- "Patients Are Sequences: Longitudinal 3D Medical Imaging Foundation Model with Interval-Aware Pretraining"

---

## 2. 一句话 Pitch

> 第一个 natively 吃同一病人多张 3D CT/MRI 的 foundation model，用 **interval-aware masked volume modeling + next-volume prediction in latent space + cross-modal temporal contrast** 联合预训练，在治疗反应预测、复发预警、progression slope 估计上 beat Merlin / CT-CLIP / Stanford TTE。

## 2.5 为什么 3D 而不是 2D？（reviewer 必问）

2D 纵向**已成熟、Microsoft 主导**：BioViL-T (CVPR 2023)、MAIRA-2 (Microsoft 2024)、HERGen (MICCAI 2024)、MLRG (CVPR 2025) 占据 CXR 纵向；L-MAE / LongL-Net / 3DTINC 覆盖 fundus / OCT。

3D 纵向**真空白**：lit review 显示无任何 FM-scale 多 timepoint 3D 医学影像 FM（SSL-AD 仅脑 / 小；CRONOS 非 FM；Stanford TTE 单 CT）。

**3D 的 case：**
1. Mayo 数据强项是 3D CT
2. 临床价值更高（实际诊断/治疗决策依赖 3D）
3. 论文影响力更大（更难，contribution 更厚）
4. 同时间可借鉴 2D 方法（BioViL-T loss 设计、L-MAE time-aware mask 等）

**2D 的反驳**：MIMIC-CXR 有 26,625 多 visit 病人，是 3D 总和的 5-10×。**如果 3D 数据真的卡死，2D OCT / fundus / 罕见模态**还是有缝隙的——保留作 plan B。

---

## 3. Specific Claims（按 reviewer 视角排）

### Claim 1 — Architecture
> 提出 **TimeFM-3D**，第一个把"多 timepoint 3D volume 序列 + 不规则时间间隔 + 配对 reports/EHR"作为 native input 的 medical foundation model（vs Stanford TTE 单 CT、SSL-AD 仅脑 MRI、CRONOS 是 forecaster 非 FM）

### Claim 2 — Pretraining objectives
> 提出 **三联 SSL 目标**：(a) Interval-aware Masked Volume Modeling (IA-MVM), (b) Next-Volume Prediction in Latent Space (NVP-LS), (c) Cross-Modal Temporal Contrast (CMTC)。Ablation 显示三个目标互补，缺一掉 5–15% downstream

### Claim 3 — Scale
> 用 ~30k+ 病人 ≥3 timepoint 3D scan 联合预训练（NLST + UK Biobank repeat + ADNI/OASIS + NACC-SCAN + CT-RATE longitudinal 子集 + 内部 Mayo 数据），是已知最大的 longitudinal 3D medical 预训练规模

### Claim 4 — Downstream（这是 reviewer 真在乎的）
在 5 个临床任务上 **beat all single-timepoint baselines**：
- RECIST 治疗反应（ISPY1/2 / NSCLC trial cohorts）
- 1–6 年肺癌风险（NLST，beat Sybil）
- MCI → AD 转换（ADNI / TADPOLE）
- 死亡率 / 复发（INSPECT / Yale-Brain-Mets）
- Progression slope estimation（自定义 evaluation）

### Claim 5 — Zero-shot to new modalities
> 同一个 backbone 既能处理 CT 序列也能处理 MRI 序列（modality-agnostic temporal encoder），cross-modal zero-shot 成立

---

## 4. 方法

### 4.1 Architecture
```
per-timepoint volume → 3D ViT or U-Net-ViT hybrid (SwinUNETR-style)
                       → patch tokens at each timepoint t_i
                       │
                       ├── + Fourier(Δt_i) embedding (借 CRONOS)
                       ├── + modality embedding
                       └── + organ/anatomy embedding (optional)
                       │
                       ▼
Temporal Transformer (cross-visit attention with Δt-scaling)
                       │
                       ▼
unified patient-trajectory embedding
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
      image decoder           text/EHR decoder
   (for IA-MVM)             (for CMTC)
```

**Backbone 选择**：
- 主选 SwinUNETR-style 3D（参考 Merlin / VISTA3D）
- 或 3D ViT + DINOv2 init（参考 3DINO-ViT）
- Backbone size：100M / 500M / 1B 三档 scaling study

**时间编码**：
- Fourier features for Δt（borrowed from CRONOS）
- 不规则采样原生支持
- 时间精度到天

### 4.2 Pretraining objectives（核心）

#### Objective 1: Interval-aware Masked Volume Modeling (IA-MVM)
```python
mask_ratio = base_ratio * f(Δt)
# 短 Δt（视觉冗余高）→ 大 mask
# 长 Δt（变化大）→ 小 mask + 预测 delta
```
- 借自 L-MAE (2D fundus) → 推广到 3D
- 重建用 MSE on raw voxels

#### Objective 2: Next-Volume Prediction in Latent Space (NVP-LS)
给 (V_1, ..., V_{k-1}) 预测 V_k 的 latent representation。
- 用 MSE 或 flow matching
- 不在 pixel space 预测，省内存
- 借自 CRONOS / Latent FM 但用作 representation pretraining

#### Objective 3: Cross-Modal Temporal Contrast (CMTC)
对齐 (volume@t, text@window-around-t)，push 同病人 t' ≠ t。
- InfoNCE on (volume_embedding_t, report_embedding_t_window)
- Window = ±7 天的 EHR events + 最近 report

### 4.3 Loss 组合
```
L_total = α · L_IA-MVM + β · L_NVP-LS + γ · L_CMTC
       (+ δ · L_TTE for fine-tune phase only)
```
- α : β : γ = 1 : 0.5 : 0.5（待消融）
- δ 仅 fine-tune 阶段加入

### 4.4 Fine-tune protocol
- Linear probe（评测 feature 质量）
- Full fine-tune（最佳性能）
- LoRA / IA3（参数高效）
- Few-shot（5/10/20 examples per task）

---

## 5. 数据计划

### 5.1 预训练数据（目标 30k+ 病人 ≥3 timepoint）

> 待 dataset deep-dive subagent 回来精确：

| 来源 | 病人数 | TP/病人 | 总 scan | 模态 | License |
|---|---|---|---|---|---|
| NLST | 26,722 | 3 | 80,166 | LDCT | 需 DUA，不可再分发数据但 model OK |
| UK Biobank repeat | ~20,000 | 2 | ~40,000 | 脑/心/腹 MRI + DXA | 付费 DUA |
| ABCD | 11,800 | ≤4 | ~30,000 | 脑 sMRI/dMRI/fMRI | NDA gated |
| NACC-SCAN | ~5–10k | 多 | 多 | 脑 sMRI + PET | DFD gated |
| ADNI + AIBL + OASIS-3 + PPMI | ~8,000 | 2–10 | ~40,000 | 脑 MRI | 开放 DUA |
| COPDGene + NELSON + MESA + SPIROMICS | ~22,000 | 2–4 | ~50,000 | 胸 CT | BioLINCC + NELSON DUA |
| CT-RATE longi 子集 | ~3,000 | 2+ | ~8,000 | 胸 CT + reports | **开源 CC-BY** |
| Mayo (private) | ? | ≥3 | ? | 多模态 | 内部 |

**总计估算**：~80–120k 病人，~30–50k 有 ≥3 TP，~150k+ scan

### 5.2 评测数据（要打 single-timepoint baseline）

- **INSPECT** (Stanford): PE dx + mortality + recurrence + bleed（亚组分析 prior + index CT 病人数待精确）
- **NLST 1-6yr lung cancer**: Sybil 主 baseline；用全 3 个 screening round
- **ADNI MCI conversion**: 1/2/3-yr 标准评测
- **TADPOLE 5-yr forecast**: classic benchmark
- **3D-RAD multi-temporal VQA** (NeurIPS 2025)
- **ISPY1/2 RECIST + pCR**：~1,200 病人 × 4 TP × 乳腺 MRI
- **Yale-Brain-Mets-Longitudinal**: 1,430 病人 mean 8 TP
- **LUMIERE GBM**: 91 病人 avg 7 TP RANO
- **HECKTOR PFS C-index**

---

## 6. Baselines（必 reproduce + beat）

| Baseline | 来源 | 我们要 beat 在哪 |
|---|---|---|
| **Stanford TTE Pretraining** | arXiv 2411.09361 | 长时 outcome（INSPECT 8 tasks，他们 +23.7% AUROC，我们再加） |
| **Merlin** | Nature 2026 | 752 tasks 上 head-to-head；ours win on temporal tasks |
| **CT-CLIP / CT-CHAT** | Nat BME 2025 | CT-RATE 18 abnormality |
| **Sybil** | JCO 2023 | NLST lung cancer 1-6yr（必 beat，否则文章不能讲）|
| **CT-FM** | arXiv 2501.09001 | retrieval / segmentation |
| **RadFM** | Nat Commun 2025 | generalist comparison |
| **SSL-AD** | arXiv 2509.10453 | 同方向最近一篇，必比 |
| **CRONOS** | arXiv 2512.16577 | forecasting subtask（虽然他们是 forecaster，作为时间编码 sanity）|
| **M3FM** | Nat Commun 2025 | NLST screening 任务 |

---

## 7. Evaluation Protocol

### 7.1 标准指标
- **AUROC** / AUPRC（classification）
- **Harrell's C-index**（survival）
- **DSC / NSD**（如做 segmentation 评测）
- **RECIST agreement**（response prediction）
- **BLEU/ROUGE/RadGraph-F1/RadCliQ**（如做 report-gen）

### 7.2 公平性 axes（reviewer 会问）
- 跨 scanner manufacturer
- 跨 medical center
- 跨 demographic（age / sex / race）
- 跨 modality（CT vs MRI）

### 7.3 Ablation
- 三个 SSL 目标 leave-one-out
- 时间编码 (Fourier vs Time2Vec vs none)
- backbone size scaling
- pretraining data 量 scaling
- timepoint 数 (k=1, 2, 3, 5) 输入

---

## 8. 风险 + Mitigation

| 风险 | Mitigation |
|---|---|
| Data DUA 延迟（UK Biobank / NACC / NLST 都要数月）| 先用 ADNI + OASIS + CT-RATE 等开放数据跑 v1，DUA 在后台走 |
| Multi-cohort 异质性（scanner / 协议）| domain randomization + site conditioning + Foundation Model 通常更鲁棒 |
| Catastrophic forgetting（联合训练多源）| GEM / iCaRL 风格 replay；先 small-scale 验证 |
| 三 SSL 目标可能互相干扰 | warm-up schedule + 逐步引入；先 IA-MVM only 跑 baseline |
| Sybil 难 beat（他单 CT 已经很强）| 用全 3 个 screening round + 时间编码作为 add-on；fair compare 包含 ours w/o time module |
| 生成 pretrain 输 contrastive（M9 警告）| 我们不依赖单纯 generative；三目标里 NVP-LS 只是其一 |
| 跨疾病 generalization 难 | 每个评测都分疾病/器官分别报数；不强求 universal 单一指标 |

---

## 9. Timeline（理想 12 个月）

```
Month 1-2:   数据 DUA 申请 + 公开数据 download + curation
             小规模 prototype (4 timepoint × 2k patient × 100M params)
             跑通 baseline reproductions (Merlin / CT-CLIP / Sybil / TTE)

Month 3-4:   完整三 SSL 目标实现 + ablation
             scale up 到 500M params

Month 5-6:   全数据预训练（1B params 如算力允许）
             8 个下游任务 evaluation

Month 7-8:   fair compare table + ablation + scaling study
             写第一版 paper

Month 9:    投 MICCAI（早期 deadline ~3月）/ NeurIPS（~5月）/ CVPR（~11月）
Month 10:   submit + 后续 follow-up
```

---

## 10. 投稿目标

**主投**（排序）：
1. **NeurIPS** main track（~5月 deadline）—— 方法 novelty + scale
2. **MICCAI** 主会（~3月 deadline）—— 医学影像 reviewer 友好
3. **CVPR** medical imaging track（~11月）
4. **Nature Biomedical Engineering**（如果加入临床 endpoint + Mayo 实测）

**Backup**：
- ICML（如果 NeurIPS 没中）
- MIDL（如果想快速 iterate）
- IEEE TMI / Medical Image Analysis

---

## 11. 简历卖点（这一篇 paper 让你简历有什么）

> "I trained the first foundation model that natively ingests longitudinal sequences of 3D medical volumes, scaling pretraining across 80k+ patients from 8+ longitudinal cohorts. The model improves Sybil on NLST 1-6yr risk by X%, beats Stanford's TTE pretraining on INSPECT prognosis tasks by Y%, and demonstrates first zero-shot RECIST response prediction."

打中关键词：**foundation model · pretraining · scale · multimodal · longitudinal · clinical evaluation**

适合岗位：
- Google Health / DeepMind medical research
- Microsoft Health Futures（MAIRA team / Merlin author Stanford 也是这条线）
- Nvidia Clara / VISTA team
- Tempus / PathAI / Aidoc / RadAI
- Recursion / Insitro
- 任何 medical FM 团队

---

## 12. 一句话 Note to self

**这不是一篇 paper，是一篇 paper × 6 个月数据 access × 3 个月 engineering**。先 commit 第一段（数据 + prototype），跑通后再决定 scaling。

---

## 待 dataset deep-dive 补的内容

- INSPECT 19,438 病人里有 ≥2 CT timepoint 的精确数字
- CT-RATE 21,304 病人里多少有 ≥2 scan
- NACC-SCAN 实际有 ≥3 TP 的精确病人数
- TCIA NSCLC trial cohorts 的精确序列数
- Mayo 数据 scoping（你回去问 informatics）
