# 公开纵向数据集 · 中文简版

> 长版 [datasets.md](datasets.md)（~70 数据集）。本文只保留实际能用于 Direction A 的核心 dataset。
> **CT 数据集的深度调研（含链接、引用、精确数字）**：见 [datasets-deep.md](datasets-deep.md)（subagent 跑完后填）

## 关键数字（聚合上限）

- **~80–120k 病人**有 ≥2 个 3D scan
- **~30–50k 病人**有 ≥3 timepoint
- **~20–30k 病人**有丰富配对 label（reports / EHR / outcomes）

## 最重要的 10 个数据集（按对 Direction A 的实用度）

| # | 数据集 | 病人数 | TP | 模态 | 配对 | 评级 |
|---|---|---|---|---|---|---|
| 1 | **NLST** | 26,722 LDCT 臂 | 3 (T0/T1/T2) | LDCT | 死亡率 / 癌症 dx / 吸烟史 | ★★★★★ |
| 2 | **UK Biobank repeat imaging** | ~20k 2nd visit | 2 | 脑/心/腹 MRI | 全 EHR + 基因 + 实验室 | ★★★★★（要钱）|
| 3 | **ABCD Study** | ~11,800 | ≤ 4 | 脑 sMRI/dMRI/fMRI | 认知 / 心理 / omics | ★★★★（青少年）|
| 4 | **INSPECT** (Stanford) | 19,438 | 多为 1 CT | CTPA + 5-yr EHR + reports | PE dx / mortality / recurrence | ★★★★（评测金标准）|
| 5 | **ADNI 1/2/3/4** | ~3,500+ | 2–10+ | 脑 MRI + PET | CSF / blood / 基因 / 认知 | ★★★★★（AD 标准）|
| 6 | **COPDGene** | 10,300 | 2 (Phase1+2) | 吸气 + 呼气 CT | 肺功能 / mortality | ★★★★ |
| 7 | **CT-RATE** | 21,304（~3-4k ≥2 TP）| 多为 1 | 胸 CT + reports | 多标签 abnormality | ★★★★（**开源**）|
| 8 | **NELSON** | 13,195 | 4 | 体素 LDCT | 10/11 yr mortality | ★★★★ |
| 9 | **NACC SCAN** | 54k+ | 多 | 脑 sMRI + PET | UDS / biospec / neuropath | ★★★★（多中心）|
| 10 | **MIMIC-CXR longi** | 26,625 多次访问 | 多 | **2D** CXR + reports + MIMIC-IV EHR | dx codes | ★★★（2D fallback）|

## 治疗反应专用（最小但 label 最强）

| 数据集 | 病人数 | TP | 用途 |
|---|---|---|---|
| **ISPY1 + ISPY2** | 222 + 985 | 4 (NAC) | 乳腺 NAC pCR/EFS（DCE-MRI）|
| **UPenn-GBM** | 630 | baseline + 2nd surgery 部分 | GBM RANO + 基因 |
| **LUMIERE** | 91 | 平均 ~7 TP | GBM 高密度纵向 MRI |
| **MU-Glioma-Post** | 100+ | 多 TP | post-treatment GBM |
| **UCSD-PTGBM** | 298 | 多 | post-treatment GBM (2025) |
| **Yale-Brain-Mets-Longitudinal** | 1,430 | mean 8 | 脑转移 + clinical sub |
| **NSCLC-Cetuximab (RTOG 0617)** | 490 | 多 | NSCLC + OS |
| **ACRIN-6668** | 226 | pre + post chemo | NSCLC + PET-CT + RECIST |
| **HCC-TACE-Seg** | 105 | pre + post TACE | HCC + response |
| **CRLM-CT** | 197 | pre + post chemo | 结直肠肝转移 |
| **HEAD-NECK-Cetuximab** | 111 | pre + post RT | OPC + 试验 outcomes |
| **OPC-Radiomics** | 606 | baseline + on-RT CBCT | RFS/OS |
| **HECKTOR 2025** | 882 | follow-up 部分 | PET-CT + OPC outcomes |
| **HNTSMRG24** | 150 | pre + mid-RT | MRI-guided adaptive RT |

## 数据野心 tier 建议

### Tier 1（5k 病人 ≥3 timepoint）—— 6 周可达
- ADNI ~3k + OASIS-2/3 ~1.5k + AIBL ~2k + PPMI ~1.5k = **~8k 脑 MRI**
- 或单 NLST = 26k × 3 TP（**仅胸 CT**）

### Tier 2（20k 病人 ≥3 timepoint）—— 3–6 个月可达
- UK Biobank repeat (~20k × 2) + ADNI/AIBL/OASIS-3/PPMI/NACC/Rotterdam ≥3 TP layer 加起来 ~30k
- 但 UK Biobank repeat 只 **2 TP**

### Tier 3（50k 病人 ≥2 CT）—— **理论上限**
- NLST (~26k × 3) + NELSON (~7.9k × 4) + COPDGene (~10k × 2) + MESA-Lung (~3k × 2) + SPIROMICS (~3k) = **~50k**
- 加 CT-RATE longi + TCIA NSCLC trial cohorts 多 ~3–5k

## 多模态配对（image + reports + EHR）独占

- **INSPECT**：最佳 CT + EHR + reports + outcomes
- **UK Biobank**：image + genomics + dense EHR（**付费 DUA**）
- **CT-RATE**：开源 license + reports
- **MIMIC-CXR + MIMIC-IV**：**2D X-ray** + EHR longi
- **NACC SCAN**：多 ADRC 协调 imaging + UDS + neuropath

## 重要 caveat

1. **License redistribution**：UK Biobank / NLST / NACC / NDA **不能再分发数据**（model weight 通常可以）
2. **TCIA 多 CC-BY** 可再分发
3. **DUA 等待时间**：ADNI/PPMI/OASIS 几天；UK Biobank 8–16 周 + 付费；NLST/PLCO/COPDGene/MESA 4–12 周；NACC-SCAN 几周
4. **Pediatric**（ABCD/HBCD/dHCP/IBIS）需 IRB 级别控制
5. **去重**：BraTS 与 UPenn-GBM/UCSF-PDGM/MU-Glioma-Post 等有重叠
6. **Dropout bias**：纵向 cohort 病重的人更易 dropout，要处理 informative censoring

## Pretraining 联合策略（推荐）

按优先级合并以下来源（去重后 ~80–120k 病人，~30–50k 有 ≥3 TP）：

1. NLST（胸 CT 锚点）
2. UK Biobank repeat（多器官 2 TP）
3. ABCD（脑 4 TP）
4. NACC-SCAN + ADRC raw
5. COPDGene + NELSON + SPIROMICS + MESA-Lung
6. ADNI + AIBL + OASIS + PPMI + 4RTNI + Cam-CAN + Rotterdam（脑 MRI）
7. CT-RATE（开源 license，用于 report 预训练）
8. MIMIC-CXR（2D fallback）
9. Yale-Brain-Mets + ISPY1/2 + UPenn-GBM + LUMIERE + Duke-Liver + NSCLC + HEAD-NECK（治疗反应评测）
10. HCP-D / HCP-A / dHCP / HBCD / IBIS（lifespan）

---

## 给 Direction A 的具体 datasets 推荐

| 阶段 | 用什么 |
|---|---|
| **预训练**（要规模）| NLST + UK Biobank + ABCD + NACC + COPDGene + ADNI + CT-RATE = ~60-80k 病人 |
| **多模态预训练** | INSPECT + CT-RATE + MIMIC-CXR + UK Biobank（要 DUA）|
| **fine-tune & 评测** | INSPECT（PE/mortality）+ NLST（lung cancer 1-6yr）+ ADNI（MCI conversion）+ TADPOLE + 3D-RAD + ISPY1/2（RECIST）+ Yale-Brain-Mets + LUMIERE |
