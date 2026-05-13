# Time-to-Event Pretraining 拆解

> arXiv 2411.09361 · Stanford · Huo, Fries, Lozano, Langlotz, Shah 等 · 2024.11

## 一句话定位
**最强 baseline，不是威胁。** 他们走 "**single image + longitudinal labels**" 路线，我们走 "**longitudinal images + longitudinal labels**" 路线，正交。

## 核心 idea
不要在图像里造监督，去 **EHR 里挖 8,192 个 survival/time-to-event 任务**作为 supervise 信号。

## 方法栈
```
单张 CT
  → SwinUNETR / DenseNet-121 / ResNet-152 (3D inflated)
  → embedding M
  → PEANN: hazard λ = exp(A·M + b)
  → piecewise exponential survival likelihood
     L = [S(t)]^(1-Δ) · [f(t)]^Δ
  × 8,192 个 OMOP code tasks 并行
```

## 任务怎么造
用 conditional Shannon entropy + vertex cover 从 OMOP ontology 选 8,192 个 diverse 临床事件，每个事件预测 "CT 后多久首次发生"，死亡 / 随访结束 = right-censoring。

时间轴切 **8 个 piecewise interval**，每段 hazard 常数。

## 数据
- **INSPECT**（Stanford 公开）
- 18,945 chest CT / 19,402 病人 / 225M EHR 事件 / 中位 follow-up 5 年
- OMOP Common Data Model

## 算力
- SwinUNETR：4×H100 (80GB) × 15 天 = ~1,440 GPU 小时
- DenseNet-121：4×A100 (40GB) × 9 天 = ~864 GPU 小时
- ResNet-152：4×A100 (80GB) × 10 天 = ~960 GPU 小时
- → 我们的 20×H200 是这个的 5–10×

## 下游任务（8 个）
**Prognostic（INSPECT）：** mortality / readmission / pulmonary hypertension / atelectasis / cardiomegaly / consolidation / edema / pleural effusion
**Diagnostic（RSPECT）：** PE 分类 + 解剖亚型 + RV/LV ratio

## 结果
- 8 个预后任务平均 AUROC **+23.7%**
- C-index **+29.4%**
- 诊断任务 no degradation

## Baselines
- base：backbone 不继续预训练
- base/MTL：在 8 个 INSPECT 任务上 multitask 监督
- base/visit：只用 concurrent visit 标签（消融 temporal）
- base/TTE：完整方法

## 他们自己说的局限（→ 我们的机会）
1. ❌ 只用单 CT
2. ❌ 没 MRI / X-ray / 多中心
3. ❌ 只测 frozen encoder
4. ❌ 18,945 scans "relatively small"
5. ❌ 没 fairness 分析

## 关键 quote
> "Current SSL approaches excel at segmentation tasks and diagnostic classification but **fail to learn prognostic biomarkers** because supervision is restricted to narrow time windows around the image."

## 对我们的战略含义

| 维度 | TTE | 方向 A |
|---|---|---|
| 图像输入 | 1 张 | **k 张序列** |
| 时间维度 | label 侧 | image + label 双侧 |
| 监督 | 8,192 survival task | MVM + next-volume + contrast + (可选)survival |
| 数据 | INSPECT 19k | Mayo + INSPECT + NLST + ADNI 50k+ |
| 下游 | 8 个 prognostic | RECIST 反应 / 复发 / progression slope |

**复用策略**：TTE 的 8,192-task survival loss 直接当第 4 个 objective 加进去，等于
- 免费 baseline（在他们的 8 个 INSPECT 任务上 fair compare）
- 免费方法借鉴（survival head 现成）
- 自然的 paper narrative："we extend X by introducing native temporal *imaging* input"

## 与我们 paper 的关系
**必引、必 reproduce、必在他们 INSPECT 上跑赢。**
