# Yale-Brain-Mets-Longitudinal 实战判断

> 调研日期 2026-05-13。一手：TCIA collection + arXiv:2506.14021。

## 一句话结论
**真实、免费、即下、强纵向（85% follow-up）—— Direction A pretraining 优质候选；但 "mean 8 TP" 被均值美化、零标注、未配准，只适合 pretraining 不适合带 label 评测。**

## 关键数字（一手）

| 项 | 值 |
|---|---|
| 病人数 | **1,430**（EHR 人工审核确诊脑转移）|
| 总 MRI studies | **11,884**（TCIA 写 11,892，以 arxiv 为准）|
| 总 series | 33,811 |
| **总体积** | **~43 GB**（NIfTI .nii.gz 压缩！）← vs NLST 11 TB |
| timepoint/病人 | **均值 8.3 = 11,884/1,430，但分布强右偏，中位数 << 8** |
| 构成 | pre-treatment 1,633 (15%) / follow-up **9,455 (85%)** / 外院 803 (7%) |
| 时间跨度 | **2004–2023**（近 20 年）|
| 序列覆盖 | T1 71% / T1c 76% / T2 62% / FLAIR 76%（**非全病人全序列**）|
| field strength | 1.5T 58% / 3T 41%；**3D 采集仅 20%**（多数 2D 厚层）|
| scanner | Siemens 86% / GE 13%（多旧机型，异质高）|

## Access（核心优势）

- **完全公开 CC BY 4.0，无 DUA，无 NIH controlled** —— 因为已 **HD-BET 颅骨剥离去脸**，规避 head MRI 身份风险
- **立即可下**（TCIA Aspera-Connect）
- NIfTI 格式，**已脑提取 + 序列命名标准化**
- **可商用、可训练并发布 model weights**，仅需引用

## 三个必须知道的坑

### 1. "mean 8 TP" 是均值陷阱 ⚠️
8.3 = 11,884 ÷ 1,430 的算术均值。**分布强右偏**——少数病人贡献大量随访 study 撑高均值，**大多数病人 timepoint 远少于 8**。
→ **用前必须自己从 metadata 算 per-patient timepoint 真实分布，别信 "8"**

### 2. 零标注 ⚠️
**没有 segmentation / RANO / bbox / 生存 / 原发癌种 / 量化 response**。纯影像 + 采集参数 metadata。
→ **不能直接做 treatment response / RANO 评测**。要评测得自己跑分割或人工标

### 3. 治疗混杂 —— 既是优势也是混杂
- ✅ 优势：85% 是 follow-up（SRS/WBRT 后高频复查），**罕见的强纵向信号**，对学"时间演化表征"极好
- ⚠️ 混杂：每个 timepoint 嵌在治疗轨迹里（**手术腔 / 放疗坏死 / 假性进展**），表征会混入治疗效应；无 label 无法解耦

## 预处理建议

| 步骤 | 状态 |
|---|---|
| skull-strip | ✅ 已做（HD-BET）—— **别重复** |
| 序列命名标准化 | ✅ 已做 |
| **跨 timepoint 共配准** | ❌ **必须自己做**（co-register 到病人首个 study 或 MNI）|
| 统一 spacing | ❌ 自己做（建议 1mm³ 各向同性）|
| 强度归一化 | ❌ 必做（1.5T/3T、Siemens/GE 异质大，z-score / 直方图匹配）|
| 缺序列处理 | 仅 62-76% 覆盖 → **modality-dropout / masked-modality**，别强求四序列齐 |

## 对 Direction A 的定位

| 用途 | 判断 |
|---|---|
| **SSL pretraining** | ✅✅ 优质——43 GB 即下、强纵向、免费、可发权重 |
| **labeled 评测 benchmark** | ❌ 不行——零 label + 治疗混杂 + 无统一 baseline |
| 在数据池中的角色 | **brain MRI 纵向 pretraining 的即时启动源**（补 NLST 胸 CT）|

**别混淆**（另几个 Yale/其他脑转移数据集，非本 collection）：
- Sci Data 2025 s41597-025-06131-0：40 病人含三区分割（Cyprus，**非 Yale**）
- Yale Sci Data 2024 s41597-024-03021-9：有 3D 分割但**非纵向**
→ 想做带分割的脑转移评测，用这些小的；纵向 pretraining 用本 collection

## 对比 NLST（两个即时可下的纵向主力）

| | NLST 影像 | Yale-Brain-Mets-Longi |
|---|---|---|
| 模态 | 胸 LDCT | 脑 MRI (T1/T1c/T2/FLAIR) |
| 病人 | ~26k | 1,430 |
| timepoint | 规则 3 (T0/T1/T2) | 不规则，均值 8.3（右偏）|
| 体积 | 11 TB（压缩后 1.5-3 TB）| **43 GB（即下）** |
| Access | TCIA 公开影像 + CDAS label | **完全 CC BY 4.0 即下** |
| 标注 | 需 CDAS（癌症 dx/mortality）| **零标注** |
| 角色 | 胸 CT pretraining 主力 + 可评测 | 脑 MRI pretraining 补充 |
| 启动速度 | 影像即下，label 等 4-8 周 | **今晚全部即下** |

**结论**：Yale-Brain-Mets 是**最快能跑起来的纵向数据**（43 GB，零审批，零等待），适合**今晚就拿来 debug pipeline + 验证 3 个 SSL loss 能不能联合优化**（paper-proposal 的 prototype 阶段）。规模化预训练再叠 NLST。
