# 纵向 CT 数据集深度调研

> 由 3 个 subagent 并行调研，每个数据集附 link + 引用证据 + 精确数字。
> 调研日期: 2026-05-13。
>
> **状态**: 肿瘤纵向 CT (Part 2) 完成；肺筛查 (Part 1) 和多模态语料 (Part 3) 待回填。

---

## Part 1: 肺部筛查纵向 CT 数据集

⏳ subagent 调研中，回来更新。

---

## Part 2: 癌症治疗反应纵向 CT 数据集

调研对象: 12 个 TCIA / Grand Challenge 上的肿瘤纵向 CT cohort。

### 2.1 NSCLC-Cetuximab / RTOG 0617

**基本信息**
- 全称: Data from NSCLC-Cetuximab (RTOG-0617)
- TCIA URL: https://www.cancerimagingarchive.net/collection/nsclc-cetuximab/
- TCIA DOI: 10.7937/TCIA.2018.jze75u7v
- 原始 RCT: Bradley et al., *Lancet Oncol.* 2015 Feb;16(2):187-99 (NCT00533949)

**规模**
- 病人数: **490 subjects** (TCIA stats)
- 影像: 490 studies / 2,116 series / **75,063 images**
- 每位病人 CT: **单 baseline timepoint** ("CT of chest within 6 weeks of registration")

**时间结构**: Baseline only (treatment-planning CT)，**不是纵向**

**模态**: Diagnostic/RT-planning CT + RTSTRUCT + RTPLAN + RTDOSE，无 PET / MR

**配对数据**: RTSTRUCT (GTV/OAR)；RECIST 不在 TCIA；survival 需经 NCTN/NCORP

**Access**: **Restricted (NIH Controlled Data Access Policy)**，当前 **无法直接公开下载**。大小 42.65 GB。

**License**: NIH Controlled — **不可 redistribute**

**Caveats**: 单 timepoint，**不能做"治疗前后变化"**；适合 RT planning / GTV seg pretrain，不适合 response prediction。

---

### 2.2 ACRIN-NSCLC-FDG-PET / ACRIN 6668

**基本信息**
- 全称: Data from the ACRIN 6668 Trial NSCLC-FDG-PET (Version 2)
- TCIA URL: https://www.cancerimagingarchive.net/collection/acrin-nsclc-fdg-pet/
- TCIA Descriptor DOI: 10.7937/tcia.2019.30ilqfcl
- 原始 RCT: Machtay et al., *J Clin Oncol* 2013;31(30):3823-3830, https://doi.org/10.1200/JCO.2012.47.5947

**规模**
- 病人数: **242 enrolled**, 226 有 pretreatment PET, **173 with evaluable post-treatment PET (primary cohort)**
- 影像: 950 studies / 3,377 series / **497,367 images**
- 每位病人: **2 timepoints** (baseline + ~14 周 post-RT)

**时间结构**: T0 pre-RT，T1 ~14 weeks post-RT。最少随访 2 年或至死亡。

**模态**: **PET/CT** + NM/MR/CR/DX/SC；CT 是 low-dose 非 diagnostic 质量

**配对数据**: SUV-based 评估（非 RECIST）；OS + 进展时间；SUV ROI 测量 central review。Stage III locally advanced NSCLC + concurrent chemoradiation。

**Access**: **Public**, CC BY 3.0。大小 145.5 GB。**可 redistribute**

**Caveats**: **是真正治疗前后配对的少数 TCIA 数据集之一**，但 N=173 偏小；CT 是 low-dose PET/CT 配的，纹理特征受限。

---

### 2.3 S0819 (SWOG)

**基本信息**
- 全称: Carboplatin/Paclitaxel ± Bevacizumab ± Cetuximab in Advanced NSCLC (S0819)
- TCIA URL: https://www.cancerimagingarchive.net/collection/s0819/
- Annotations: https://www.cancerimagingarchive.net/analysis-result/s0819-tumor-annotations/
- TCIA Descriptor DOI: 10.7937/DT39-JS04
- 原始 RCT: Herbst et al., *Lancet Oncol* 2018

**规模**
- 病人数 (imaging): **1,299 subjects** (TCIA); 原 trial 1,313 ITT
- 影像: 32,324 series / **3,558,078 images** —— TCIA 上**最大的肺癌纵向 CT 数据集之一**
- Annotation cohort: **1,281 subjects**, 2,556 studies, 20,181 annotated series

**时间结构**: **真正纵向**——baseline + progression follow-up；de-identified dates preserved，可重构时序

**模态**: CT + PT + MR + SC + NM，多机构多扫描仪

**配对数据**:
- **RECIST 1.1** annotations
- DICOM RTSTRUCT seed points + measurements + CSV metadata
- Survival (OS, PFS) 在外部 NCTN/NCORP Data Archive
- EGFR FISH/IHC 在 external paper

**Access**:
- **Imaging: Restricted (NIH Controlled)**，login removed，等新 policy
- **Annotations: Public, CC BY 4.0** (596.65 MB)
- 影像大小: **1.82 TB**

**Caveats**: **最大、最全的 RECIST-annotated NSCLC trial data**，但**影像本身当前 restricted**。Annotations 可用于评测 fair compare，影像不行。Linkage 到 outcome 需额外 NCTN application。

---

### 2.4 Anti-PD-1_Lung

**基本信息**
- 全称: Anti-PD-1 Immunotherapy Lung
- TCIA URL: https://www.cancerimagingarchive.net/collection/anti-pd-1_lung/
- 无指定 publication（authors none）

**规模**
- 病人数: **46 subjects**
- 影像: 86 studies / 677 series
- 每位病人: baseline + 1 follow-up timepoint

**时间结构**: T0 pre-treatment + T1 1 follow-up，真正前后配对但 N=46 极小

**模态**: PT + CT + SC/OT；治疗 2016

**配对数据**: RECIST 未明确发布；survival 未指定；anti-PD-1 immunotherapy 具体药物未列。AIMI Annotations initiative (BAMF) 补充 seg。

**Access**: **Public**, CC BY 3.0。大小 61.24 GB。

**Caveats**: **N=46 太小**，不能单独做 fair comparison；缺 OS/PFS labels；只适合作 external validation。

---

### 2.5 NSCLC-Radiomics (Lung1, Aerts 2014)

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/nsclc-radiomics/
- Descriptor: Aerts et al., *Nat Commun* 5:4006, 2014, https://doi.org/10.1038/ncomms5006

**规模**: **422 subjects** / 1,265 series / 52,073 images

**时间结构**: **不是纵向**。仅 pretreatment 单 baseline CT。

**模态**: Spiral CT 3mm slices，无 PET (GTV 是 fused PET-CT 绘的，但 PET 不在 collection)

**配对数据**: GTV-1 manual + lung/heart/esophagus OAR (RTSTRUCT + DICOM-SEG)；deadstatus + survival days；MAASTRO 单中心 RT/chemo-RT

**Access**: **Public**, **CC BY-NC 3.0** (NC = 非商业)。大小 35.78 GB。

**Caveats**: 单 timepoint，**对"治疗前后变化"评测不适用**；单中心 site bias；适合 OS prognostic baseline。

---

### 2.6 NSCLC-Radiogenomics (Bakr 2018)

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/nsclc-radiogenomics/
- Descriptor: Bakr et al., *Sci Data* 5:180202, 2018, DOI 10.1038/sdata.2018.202
- RNA-Seq: NCBI GEO GSE103584

**规模**: **211 subjects total**; 130 with full clinical+imaging+RNA-Seq；286,754 images

**时间结构**: **不是纵向**。Cross-sectional pre-surgical staging CT + PET/CT。

**配对数据**: tumor seg maps；EGFR/KRAS/ALK/other mutations；RNA-Seq 130/211；有 survival

**Access**: **Public**, CC BY 3.0。大小 98 GB。

**Caveats**: 单 timepoint **不适合纵向 response prediction**；但 EGFR/KRAS+survival+RNA-Seq 配对极少有，适合 **radiogenomic / mutation prediction**。Stanford 单中心 site bias。

---

### 2.7 HCC-TACE-Seg (Morshid 2019)

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/hcc-tace-seg/
- TCIA DOI: 10.7937/TCIA.5FNA-0924
- Descriptor: Morshid et al., *Radiology: AI* 1(5), 2019, https://doi.org/10.1148/ryai.2019180021

**规模**: **105 confirmed HCC** / 211 baseline pre-TACE CT studies / 51,968 images

**时间结构**: **Pre-TACE only (1-12 周 first TACE)** —— 关键 caveat！标题有 TACE 但**没有 post-TACE follow-up CT in TCIA**。Multiple baseline studies 是 multi-phase (arterial/portal/delayed)。

**模态**: Multi-phase contrast CT；AMIRA semi-auto seg → NIfTI → DICOM-SEG

**配对数据**: liver / tumor / blood vessels seg；**time-to-progression + overall survival**；demographics / molecular / exposure / treatment

**Access**: **Public**, CC BY 4.0。大小 28.57 GB。

**Caveats**: **没 post-TACE imaging**！只能 baseline → outcome label 预测，不能 imaging response prediction。

---

### 2.8 Colorectal-Liver-Metastases (CRLM)

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/colorectal-liver-metastases/
- Descriptor: *Scientific Data* 2024, DOI 10.1038/s41597-024-02981-2

**规模**: **197 patients** (pathology-confirmed) / 197 studies / 394 series / 17,836 CT images

**时间结构**: **单 timepoint preoperative CT only** (内 6 weeks of hepatic resection)。不是纵向。

**模态**: Portal-venous phase contrast-enhanced MDCT 单 phase

**配对数据**: liver / liver_remnant / hepatic veins / portal veins / tumor_x (multi-tumor) seg；≥24 mo follow-up；BMI / 节点 / CEA / max 肿瘤 / bilobar / preop PVE 等 (v2 8 个 vars 新增)

**Access**: **Public**, CC BY 4.0。大小 10.91 GB。

**Caveats**: Preop only，**不是纵向**；seg 质量高 + survival labels 全，适合 surgical planning baseline。

---

### 2.9 OPC-Radiomics

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/opc-radiomics/
- Descriptor: Kwan et al., *Int J Radiat Oncol Biol Phys* 102(4):1107-1116, 2018
- **重要**: collection **已 deprecated**，被 RADCURE 取代

**规模**: **606 subjects** (300 subset 用于原 publication) / 606 studies / 1,220 series / 108,813 images

**时间结构**: **不是纵向**。仅 RT-planning CT。**no on-RT CBCT in collection**。

**模态**: CT (RT planning) + RTSTRUCT，无 PET 无 CBCT

**配对数据**: GTV (primary + nodes) seg；distant metastasis / local failure / regional failure / distant failure；**all p16-positive (HPV-related OPC)** 2005-2010；Princess Margaret 单中心 RT/chemo-RT

**Access**: **Images NIH Controlled**（face-reconstructible）；clinical CC BY 3.0。大小 61.75 GB。

**Caveats**:
- **与原 brief 描述不符**: 不是纵向、不是 CBCT
- 单中心；images restricted access
- **建议改用 RADCURE** (3,346 subjects superset，但也 controlled access)

---

### 2.10 Head-Neck-Cetuximab / RTOG 0522

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/head-neck-cetuximab/
- TCIA DOI: 10.7937/K9/TCIA.2015.7AKGJUPZ
- 原始 RCT: Ang et al., *J Clin Oncol* 2014, https://doi.org/10.1200/JCO.2013.53.5633

**规模**: **111 subjects** / 1,682 series / **202,574 images**

**时间结构**: **2 timepoints: pre-treatment + post-treatment (8-9 weeks after completion)** —— head/neck 中真正纵向 trial data 之一

**模态**: PT + CT + RTDOSE/RTPLAN/RTSTRUCT + Protocol（含 PET/CT 可做 SUV change）

**配对数据**: RECIST 不单独发布；RTSTRUCT；survival 不直接在 TCIA（NCTN）；HPV 未在 TCIA 上特别列；concurrent accelerated RT + cisplatin ± cetuximab

**Access**: **Images NIH Controlled** (面部可重构)；protocol CC BY 3.0。大小 52.36 GB。

**Caveats**: N=111 偏小；access controlled；真正 paired pre/post + PET/CT 是亮点。

---

### 2.11 HECKTOR (2022)

**基本信息**
- **不在 TCIA**，在 Grand Challenge
- URL: https://hecktor.grand-challenge.org/Data/
- Descriptor: Andrearczyk et al., *Lect Notes Comput Sci* 2023; PMC 10171217

**规模**: **883 cases total** (524 training + 359 test)；9 个 centers (Canada/Switzerland/France/USA)

**时间结构**: **Cross-sectional, single timepoint** (initial staging PET/CT before RT)。**不是纵向**——只是 baseline + RFS outcome label。

**模态**: **FDG-PET + low-dose non-contrast CT**（NIfTI .nii.gz，已 SUV preprocessed）

**配对数据**:
- **GTVp (primary) + GTVn (nodes)** manual seg
- **RFS** primary outcome (~21% recurrence, median 14 mo)
- 临床: age/gender/weight/tobacco/alcohol/performance/HPV/treatment

**Access**: **Public via challenge registration**（需 approval）。License 未明确公开 CC（"restricted pending hospital agreement extension"）。

**Caveats**: PET+CT 配对（不是纯 CT）；CT 是 low-dose；不是纵向；license 不清晰，**redistribution 有风险**。

---

### 2.12 CMB-LCA (Cancer Moonshot Biobank — Lung Cancer)

**基本信息**
- TCIA URL: https://www.cancerimagingarchive.net/collection/cmb-lca/
- TCIA DOI: 10.7937/3CX3-S132
- 关联 dbGaP（临床+基因组 controlled access）

**规模**: **206 subjects** (v10, 2025/10/10)；大小 **347.48 GB**；多模态混合

**时间结构**: **真正纵向**——DICOM tag (0012,0053) "days from enrollment" embedded 支持时序对齐。Standard of care follow-up。

**模态**: **极多模态** —— Histopathology WSI + CT + PT + MR + NM + DX + US

**配对数据**: seg 未明确包含；survival via dbGaP；genomic via dbGaP；治疗 SOC

**Access**: **混合**——一般 radiology/path CC BY 4.0；head NIH Controlled；genomic dbGaP controlled

**Caveats**: 真 longitudinal SOC + 多模态丰富；但 N=206 中等；genomic/clinical 需 dbGaP application；**复杂 access 结构需谨慎 license**

---

### 汇总 Table (Part 2 肿瘤)

| 数据集 | 病人数 | 真纵向 | RECIST | 生存 | 大小 | 公开度 | License | 推荐用途 |
|---|---|---|---|---|---|---|---|---|
| NSCLC-Cetuximab (RTOG 0617) | 490 | **否** | 否 | external | 42.65 GB | **Restricted** | NIH controlled | RT planning only |
| **ACRIN-NSCLC-FDG-PET (6668)** | 242 (173 paired) | **是** | 否 (SUV) | OS + prog | 145.5 GB | Public | CC BY 3.0 | ★ Recommended for response |
| **S0819 (SWOG)** | 1,299 | **是** | **是 (1.1)** | external | 1.82 TB | Restricted (annot public) | NIH / CC BY 4.0 annot | Annot-only fair compare |
| Anti-PD-1_Lung | 46 | 是 | 否 | 缺 | 61.24 GB | Public | CC BY 3.0 | External val 小样本 |
| NSCLC-Radiomics | 422 | **否** | 否 | OS | 35.78 GB | Public | **CC BY-NC** | Single-tp prognostic |
| NSCLC-Radiogenomics | 211 (130 RNA) | **否** | 否 | OS | 98 GB | Public | CC BY 3.0 | Radiogenomic |
| HCC-TACE-Seg | 105 | **否** | 否 | OS + TTP | 28.57 GB | Public | CC BY 4.0 | HCC outcome baseline |
| CRLM | 197 | **否** | 否 | OS | 10.91 GB | Public | CC BY 4.0 | Surgical outcome |
| OPC-Radiomics | 606 | **否** | 否 | DM/LF/RF | 61.75 GB | Restricted | NIH / CC BY 3.0 | Deprecated → RADCURE |
| **HEAD-NECK-CETUXIMAB (RTOG 0522)** | 111 | **是** | 否 | external | 52.36 GB | **Restricted** | NIH controlled | Paired pre/post H&N |
| HECKTOR 2022 | 883 | **否** | 否 | **RFS** | n/a | Public via challenge | Restricted | H&N outcome pred |
| **CMB-LCA** | 206 | **是** | 否 | via dbGaP | 347.48 GB | Mixed | CC BY 4.0 / dbGaP | Longitudinal SOC multi-modal |

### Part 2 关键判断

**真正可用于 "治疗前后纵向 CT" 评测（TCIA 上有 paired pre/post imaging）:**
1. **ACRIN-NSCLC-FDG-PET (6668)** — N=173 paired，公开 CC BY 3.0，**最干净的 NSCLC longitudinal**，缺 RECIST (SUV)
2. **HEAD-NECK-CETUXIMAB (RTOG 0522)** — N=111 paired，**access restricted**
3. **CMB-LCA** — N=206 longi SOC，**access 复杂 (dbGaP+NIH)**
4. **S0819** — 影像纵向 + RECIST 1.1 annotations，**影像 restricted，annotation 公开**

**误标为纵向但实际单 timepoint**（paper 中要明确不能用作 paired evaluation）：
- NSCLC-Cetuximab (RTOG 0617) — baseline only
- NSCLC-Radiomics (Lung1) — pretreatment only
- NSCLC-Radiogenomics — surgical staging only
- HCC-TACE-Seg — pre-TACE only (despite name!)
- CRLM — preop only
- OPC-Radiomics — RT-planning only (no CBCT)
- HECKTOR — staging only

**Fair-comparison 障碍**：paired N 大多 <200（FM scale 评测 underpowered）；License 一半 NIH controlled（不能 redistribute → benchmark release 难）；RECIST 仅 S0819 annotations 公开。

**实操建议**：
- 主评测: **ACRIN-NSCLC-FDG-PET**（公开 + paired + 中等规模）
- 辅助: **S0819-TUMOR-ANNOTATIONS** + IDC-cached imaging
- **不要单依赖 NSCLC-Radiomics / Radiogenomics / NSCLC-Cetuximab 做 response prediction**

---

## Part 3: 多模态 / 通用纵向 CT 语料库

⏳ subagent 调研中，回来更新。
