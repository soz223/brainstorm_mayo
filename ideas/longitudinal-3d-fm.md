# 纵向 3D 医学影像 FM（方向 A）

> **核心**：第一个 natively 吃**多个 timepoint × 3D volume** 的医学影像基础模型。

## Pitch
> "First 3D medical foundation model pretrained on multi-cohort longitudinal sequences (Mayo + ADNI + UK Biobank + NLST + OASIS), each sample = a patient's full ≥3-scan trajectory with continuous Δt embedding + masked-volume reconstruction + order/next-volume prediction objectives — the first to scale longitudinal 3D imaging SSL past 10k patients."

## 数据格式（关键对比）

**别人的（TTE / Merlin / CT-CLIP）：**
```
Patient #001
2020-01-15  [CT scan]  ← 一张
+ 5 年 EHR 事件流
```

**我们的：**
```
Patient #001
2020-01-15  [CT #1] + report #1
2020-04-22  [CT #2] + report #2   ← 不规则间隔
2020-10-30  [CT #3] + report #3
2021-05-14  [CT #4] + report #4
2022-02-09  [CT #5] + report #5
+ 全时间轴 EHR 事件
```

## 架构草图
```
per-timepoint CT/MRI  →  3D ViT / SwinUNETR  →  volumetric tokens
                                                       │
            ┌──────────────────────────────────────────┘
            ▼
  temporal transformer + 连续时间编码 (Fourier / Time2Vec)
            │
            ├── masked-volume reconstruction loss
            ├── next-volume latent prediction loss
            ├── temporal cross-modal contrast (vs. reports + EHR)
            └── (可选) survival head 套 TTE 的 8,192-task loss
```

## 三个 pretraining objective（缺一不可）

1. **Interval-aware masked volume modeling**：mask 整个 timepoint，用前后 volumes + 时间差重建
2. **Next-volume prediction in latent space**：t1…tk-1 预测 tk 的 latent
3. **Cross-modal temporal contrast**：(volume sequence) ↔ (time-stamped reports + EHR events) InfoNCE
4. **(可选 4)**：TTE 的 8,192 个 survival task 加进去，免费 cite + 免费 baseline

## 下游任务（要 beat 当前 FM 全军覆没的）
- RECIST 治疗反应预测
- 复发预警 / recurrence-free survival
- Progression slope estimation
- 与 Merlin / TTE / CT-CLIP fair compare：他们只能用 baseline scan，我们能用全序列

## 为什么我们能做、别人做不出

| 障碍 | 现状 | 我们的解法 |
|---|---|---|
| **数据**（70% 的瓶颈） | 公开数据没有 ≥3 timepoint × 3D × >10k | Mayo 自有 + 多 cohort 拼接 |
| **算力**（20%） | 5×3D volume = 巨大 activation | 20×H200 = 2.8TB GPU memory |
| **方法**（10%） | 已被 CRONOS / STAMP / SSL-AD 验证可行，没人放大 | 复用现成时间编码即可 |

## 目标 venue
- MICCAI best paper（影像领域权威）
- NeurIPS Datasets & Benchmarks（数据 contribution 强）
- CVPR Medical Imaging
- Nat. Biomed. Eng（如果能拿到临床 endpoint）

## 风险 / 已知坑

- **Cross-timepoint registration**：不同机器、不同对比剂、病人位置差异。需要预对齐 pipeline 或让模型自行学（LSSL/LNE 都做了预对齐，我们可能可以省略）
- **Variable modality drift across visits**：FLAIR 后加、扫描仪升级——需要 modality dropout
- **Mayo 数据 access**：需要确认能拿到多少 ≥3 follow-up 的病人
- **Reviewer 会问**：是不是任务太"窄"（只在有随访的病人 work）→ 准备好"广义化到单 scan 也能 work（序列长度=1 的退化情形）"的论证

## 关联工作
- 详见 [Time-to-Event Pretraining 拆解](time-to-event-pretraining.md)（最强互补工作）
- 详见 [landscape 调研](landscape-survey.md)（CRONOS / STAMP / SSL-AD 等近邻）
