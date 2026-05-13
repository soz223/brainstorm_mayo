# 纵向 CT 数据集深度调研

> 由 3 个 subagent 并行调研，每个数据集附 link + 引用证据 + 精确数字。
> 调研日期: 2026-05-13。
>
> **状态**: 肿瘤纵向 CT (Part 2) 完成；肺筛查 (Part 1) 和多模态语料 (Part 3) 待回填。

---

## Part 1: 肺部筛查纵向 CT 数据集

### 1.1 NLST (National Lung Screening Trial) ⭐⭐⭐⭐⭐

**基本信息**
- 主结果论文: NLST Research Team, *NEJM* 2011;365:395-409, DOI: [10.1056/NEJMoa1102873](https://doi.org/10.1056/NEJMoa1102873)
- 设计: Aberle DR et al., *Radiology* 2011;258:243-253, [10.1148/radiol.10091808](https://doi.org/10.1148/radiol.10091808)
- 入口: [CDAS](https://cdas.cancer.gov/nlst/) / [TCIA](https://www.cancerimagingarchive.net/collection/nlst/) / IDC

**规模（一手引用）**
- 入组: **53,454**（NEJM 主论文），LDCT 26,722 / CXR 26,732
- TCIA 上 LDCT 影像可访问的: **26,254 病人**（TCIA metadata）
- 影像规模: **21,082,265 DICOM images / 73,116 studies / 203,099 series**
- timepoint 结构: T0 / T1 / T2 年度 3 轮
- adherence: T0 95.0%、T1 94.8%、T2 94.8%（NEJM）
- **≥2 CT TP: ~23,600-25,000**（adherence 推算）
- **≥3 CT TP: ~22,800**（0.95³ × 26,722，NLST Table 1 显示 75% 完成全 3 轮）

**协议**: ≥4 detector rows; tube current-time ≤40 mAs (avg-size); effective dose ~1.5 mSv; slice thickness 1.0–2.5 mm 因 scanner 异构

**配对**: demographics + 吸烟史; CT abnormalities ~177,500 records; 肺癌 dx ~2,100; cause of death ~15,200; **extended mortality FU 12.3 年 median** (Black 2019)

**Access**: **影像 CC BY 4.0 公开 (TCIA 11.92 TB)**；临床全集 CDAS DTUA 2-8 周

**已用**: Ardila 2019 Nat Med (Google 3D CNN); **Sybil** (Mikhael JCO 2023, 必 beat); Liao 2019 DSB17; NLSTseg 2025 Sci Data (pixel-level subset)

---

### 1.2 NELSON (Dutch-Belgian)

**基本信息**
- de Koning HJ et al., *NEJM* 2020;382:503-513, [10.1056/NEJMoa1911793](https://doi.org/10.1056/NEJMoa1911793)
- Horeweg N et al., *Eur Respir J* 2013 三轮结果
- 无统一公开 portal

**规模**
- 入组: **15,792**（男 13,195 + 女 2,594）
- 有 CT: ~7,900（影像不公开发布）
- CT 总数: ~28,000-30,000 (4 轮)
- timepoint: T0/T1/T2 (year 1)/T3 (year 5.5) —— **递增间隔**
- adherence: 95.4%/96.6%/92.7% (前 3 轮)
- **≥2 TP: ~6,200，≥3 TP: ~5,800**

**协议**: 16-detector spiral; 120/140 kVp body-weight adaptive; 30 mAs (<50kg) 渐进至 140 mAs; **slice 1.0 mm / 0.7 mm increment**; **剂量 0.8-1.0 mSv (低于 NLST)**; **volume-based 评估**（不同于 NLST diameter-based）

**Access**: ⚠️ **几乎不可获取**——需联系 NELSON PI (de Koning / de Jong / Oudkerk) + 双 IRB + DTA，月级别审批，**很少授予外部 group**

**Caveats**: 数据分散多中心无统一 DICOM repo；volume-based vs Lung-RADS 不兼容；男性 83%。**别在 proposal 里依赖它**；引用 NEJM 数字做对照即可。

---

### 1.3 COPDGene

**基本信息**
- Regan EA et al., *COPD* 2010;7:32-43, [10.3109/15412550903499522](https://doi.org/10.3109/15412550903499522)
- [copdgene.org](https://copdgene.org/) / dbGaP **phs000179** / TOPMed phs000951

**规模**
- 入组 Phase 1: **10,198 current/former smokers** (2007.11–2012.7) + non-smoker ctrl → **总 10,718-10,720**
- 有 CT: ~10,300 (baseline)
- CT 总数: **>40,000 chest CT (Phase 3 进行中)**（COPDGene 官网）
- 每 visit = **inspiratory + expiratory** 2 个 CT
- Phase 2 retention: **5,929 returning** (~58%, ~14% 死亡 by P2)
- **≥2 CT TP: ~5,900；Phase 3 进行中，目标 ≥3 TP ~5,000**

**协议**: 多 vendor 标准化；**120 kVp**; inspiratory 200 mAs / expiratory 50 mAs; **slice 0.625-0.9 mm, 0.5 mm interval**; sharp + standard 双 kernel; 单次 ~7 mSv (insp+exp 合计)

**配对**: spirometry pre+post BD, 6MWT, SGRQ, mMRC, CAT; **GWAS phs000179**, TOPMed **WGS phs000951**; blood biomarkers (CRP, SP-D, CC16); ILA 进展; lung cancer incident

**Access**: dbGaP DAR via eRA Commons + IRB + NHLBI DAC，3 周-3 月，**免费**；ancillary collaboration 更快

**已用**: Humphries SM et al. *Radiology* 2022（emphysema DL 预测 mortality）; González G et al. AJRCCM 2018; Castaldi (COPD subtype clustering); Bodduluri (airway DL)

---

### 1.4 SPIROMICS

**基本信息**
- Couper D et al., *Thorax* 2014;69:491-494, [10.1136/thoraxjnl-2013-203897](https://doi.org/10.1136/thoraxjnl-2013-203897)
- QCT 协议: Sieren JP et al., *AJRCCM* 2016;194:794-806（精确扫描参数）
- [spiromics.org](https://www.spiromics.org/) / [BioLINCC](https://biolincc.nhlbi.nih.gov/studies/spiromics/) / dbGaP phs001119

**规模**
- 入组: **2,982** 跨 12 个中心
- CT: 每人 baseline + 3 annual FU × (TLC + RV) = 最多 8 CT；总 ~15,000-20,000
- **≥2 CT TP: ~2,200，≥3 TP: ~1,500**（估）

**协议（Sieren 2016 AJRCCM 精确）**: 120 kVp; TLC 80-270 mAs (BMI-adaptive, CTDIvol 6.1-11.4 mGy); RV 50-145 mAs (CTDIvol 4.2-6.1 mGy); **slice Siemens 0.75 / GE 0.625 / Philips 0.67 mm**; emphysema 阈值 **-950 HU**; air trapping **-856 HU**

**配对**: 4 strata (never/smokers-no-COPD/mild-mod COPD/severe); spirometry; **深度 fluid biomarker** (IL-6, fibrinogen, CC16, SP-D...) — 比 COPDGene fluid panel 更深; sputum/BAL; adjudicated exacerbations

**Access**: ancillary application to SPIROMICS Steering Committee + BioLINCC + dbGaP DAR

---

### 1.5 MESA-Lung

**基本信息**
- Hoffman EA, Barr RG 系列；Lederer DJ et al., *AJRCCM* 2009;180:407
- [mesa-nhlbi.org](https://www.mesa-nhlbi.org/) / [BioLINCC](https://biolincc.nhlbi.nih.gov/studies/mesa/) / dbGaP phs000209, phs001416

**规模**
- Parent MESA: **6,814** (2000-2002 入组 45-84 yo, 4 race/ethnic groups)
- **Exam 1 (2000-02) cardiac CT**: 全员 6,814 (含部分肺野)
- **Exam 3/4 (2004-06) MESA Lung subset**: **3,965**
- **Exam 5 (2010-12) full-lung CT**: **3,205**
- **Exam 6 (2017-18) full-lung CT**: **>2,600**
- **≥2 CT TP: 3,205；≥3 TP: >2,600**

**协议**:
- Exam 1: **EBCT/MDCT cardiac**（限 heart 区，~3cm 肺野 visible，emphysema 阈值 **-910 HU**）
- Exam 5/6: **full-lung CT** (120 kVp ≤180 mAs ~0.625 mm, TLC inspiration only, **-950 HU**)

**特色**: **17 年 CT 纵向跨度**（2000→2018），CVD events + COPD events + mortality + lung function decline 多 outcome

**Access**: BioLINCC 免费注册 + DUC；ancillary 需 MESA Pubs Committee 批准

**Caveats**:
- baseline 是 cardiac CT 部分肺野，与 Exam 5/6 full-lung CT 字段不一致 → harmonization 必做
- 主要是 CVD cohort，肺癌 outcome 少
- 60% never-smoker → COPD power 小但泛化好

---

### 1.6 PLCO ⚠️ 注意：是 CXR 不是 CT

**基本信息**: Oken MM et al., *JAMA* 2011;306:1865, [10.1001/jama.2011.1591](https://doi.org/10.1001/jama.2011.1591)

**规模**: 入组 **154,901**（intervention 77,445）；4 个年度 **PA chest X-rays** (T0-T3) + 长 FU；T0 adherence 86.6%, T3 78.8%；events through 2009.12 (median 13 yr)

**对 Direction A 的实际相关性**: ❌ **不适合 CT 项目**（PLCO 用 CXR 筛查肺癌，不是 CT）。但保留它的 **PLCOm2012 risk score** 作 external validation。

---

### Part 1 汇总 Table

| 数据集 | 入组 N | 有 CT | CT 总数 | TP | 间隔 | 可访问性 | 推荐 |
|---|---|---|---|---|---|---|---|
| **NLST** ⭐⭐⭐⭐⭐ | 53,454 | 26,254 | 73k studies / 21M images | 3 | 12 月 | **CC-BY 4.0 公开** | 必用 |
| **NELSON** ❌ | 15,792 | ~7,900 | ~30k | 4 (T0/T1/T2/T3.5y) | 递增 | **非公开** | 别依赖 |
| **COPDGene** | 10,300 | ~10,300 | >40k (insp+exp) | 3 phases | ~5 yr | dbGaP DAR | 强候选 |
| **SPIROMICS** | 2,982 | ~2,982 | ~15-20k | 4 (baseline+3y) | 12 月 | BioLINCC + ancillary | COPD 专用 |
| **MESA-Lung** | 6,814 | 3,965 lung subset | ~15k+ | 2-4 (Ex 1/3-4/5/6) | 5-10 yr | **BioLINCC 免费** | **17 yr 跨度** |
| **PLCO** ⚠️ | 154,901 | **0 CT (CXR only)** | 0 | N/A | N/A | CDAS | **不用** |

### Part 1 关键 takeaway

1. **首选起点：NLST**——唯一开放（CC-BY）、26k × 3 TP × 73k studies。但**时间跨度只有 2 年**，慢病进展信号弱
2. **想要更长 5-17 年跨度**：**MESA-Lung（17 yr）→ COPDGene（10 yr）→ SPIROMICS（3-4 yr）**。注意 MESA-Lung Exam 1 是 cardiac CT（部分肺野），与 Exam 5/6 full-lung 协议不一致
3. **NELSON 别依赖**——基本不可获取
4. **PLCO 不要放进 CT 池**（CXR only），只保留它的 mortality score
5. **跨集 harmonization 必做**：slice (1.0-2.5 vs 1.0 vs 0.625-0.9 mm)、kernel (sharp/standard)、dose (NELSON 0.8 / NLST 1.5 / COPDGene 7 mSv)，且 NELSON 用 volume-based nodule semantics 不能与 Lung-RADS 直接比

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

---

## Part 4: UK Biobank + 体部 MRI / cardiac / Multimodal Population 纵向数据集

### 4.1 UK Biobank Imaging ⭐⭐⭐⭐⭐

**基本信息**
- 论文：Littlejohns TJ et al. *Nat Commun* 11:2624 (2020), DOI: 10.1038/s41467-020-15948-9
- Cardiac: Petersen SE et al. *J Cardiovasc Magn Reson* 18:8 (2016)
- Brain: Miller KL et al. *Nat Neurosci* 19:1523-1536 (2016)
- 官网: https://www.ukbiobank.ac.uk

**规模（关键）**
- 总入组: 500,000 (2006-2010, 40-69 yo)
- **影像 cohort baseline: 100,000** —— **2025-07-16 完成**
- **≥2 imaging timepoints: ~20,000 完成（截至 2025）；目标 60k by 2029**
- ≥3 timepoints: Newcastle 已启动 third visit（≥2 yr after 2nd）
- Brain MRI ~100k；Cardiac MRI ~100k；Abdominal MRI ~100k（**同人**）
- DXA / Carotid US ~100k（>90% complete）
- OCT + fundus baseline: 68,514

**模态详情**
- Brain: **3T Siemens Skyra** (T1, T2-FLAIR, swMRI, dMRI, rfMRI, task-fMRI)
- Cardiac + Abdomen: **1.5T Siemens Aera** (cine SSFP, T1 map, Dixon, liver PDFF, pancreas T1)

**配对数据**
- HES + GP + cancer registry + death registry
- WGS: **490,640 全部发布**（Li 2025 Nature, DOI: 10.1038/s41586-025-09272-9）
- WES: 454,787 (Backman 2021)
- ~30 blood biomarkers, NMR metabolomics 250k, Olink proteomics ~50k
- Accelerometer 103,695

**Access (2025 价格)**
- Tier 1: £3,000 / Tier 2: £6,000 / **Tier 3: £9,000**（含 WGS + 全影像）
- **无 academic/commercial 区别**
- LMIC/学生: £500/3yr
- £1,000 UKB-RAP 平台 credit
- 等待: 4–12 weeks AMS 审核
- **数据 cloud-only (UKB-RAP)，原始影像不能 egress**

**Model weights 关键**: FM weights 视为 **derived variables**，必须 return 给 UKB；UKB 可再分发。实操：发布 inference code + training script，**不直接 host weights**。

**Caveats**
- Healthy volunteer bias (Fry 2017 AJE)
- ~94% 白人
- Imaging visits 偏 healthier/younger

**已用 FM 工作**: ViTa (2504.13037, 42k cardiac CMR), BrainFounder (2406.10395), RETFound (Nature 2023), Bai et al. cardiac segmentation phenome-wide

---

### 4.2 NAKO (German National Cohort)

**基本信息**
- Peters A et al. *Eur J Epidemiol* 37:1107-1124 (2022), DOI: 10.1007/s10654-022-00890-5
- MRI: Bamberg F et al. *Radiology* 277:206-220 (2015)
- 官网: https://nako.de/en/

**规模**
- 总入组 baseline: **205,415** (2014-2019)
- MRI sub-cohort baseline: **30,861** 全身 MRI
- **First re-examination MRI (2024): 18,707** —— 即 **~18,000 病人 ≥2 MRI timepoints**
- Second re-exam (3U) 开始 2024，目标 ~12,000

**时间结构**
- Baseline 2014-2019 → 1st re-exam 2019-2024 → 2nd re-exam 2024-
- 间隔 **4–5 年**

**模态**
- **5 MRI 中心全部 Siemens MAGNETOM Skyra 3T**（比 UKB 更一致）
- NEURO + MSK + BODY + CARDIO 4 blocks (~60 min total)

**Access**
- TransferHub，UAC 审核 ~4 周
- **EU/EEA + GDPR 兼容**（美国研究者麻烦）
- TRE pilot 2025 launched
- 2,400 注册研究者
- MRI 提供 **defaced NIfTI**

**Caveats**: 美国 access 比 UKB 麻烦；论文产出比 UKB 少

---

### 4.3 MESA (Multi-Ethnic Study of Atherosclerosis)

**规模**: 6,814 baseline (1999-2000), 4 种族
- **Cardiac MRI**: Exam 1 (2000-02) 5,098 scans → Exam 5 (2010) 3,015 完成 → **≥2 CMR timepoints ~3,015**
- Brain MRI: ~1,000 (Exam 6, 2016-2018)
- Cardiac CT (CAC): ~6,000 serial multiple exams
- Exam 7 (2022-2024)

**Access**: BioLINCC / dbGaP，免费 academic。Cardiac Atlas Project 公开 2,450 cases。

**Caveats**: 样本比 UKB 小 ~30x，但多族裔代表性好。

---

### 4.4 Framingham Heart Study

**规模**: ~15,400 跨所有 cohorts；**brain MRI ~2,700**（Offspring Exam 7 2,307 + Original 372）
- Cardiac MRI sub-study: **1,114 Offspring 同时有 brain + cardiac**
- ≥2 MRI: ~1,000–2,000

**特色**: **77 年纵向**（最长）；多代家系

**Caveats**: 种族 representation 差（原始 cohort 几乎全白）

---

### 4.5 Project Baseline (Verily)

**规模**: 计划 10k → 实际 ~2,500 deeply characterized
- echo + CAC CT + retinal + carotid US + ECG（**无 brain/cardiac MRI**）
- ≥2 timepoints: yes（年度 ≥4 yr）

**Access**: **Closed** —— 不开放 academic 申请 ❌

---

### 4.6 All of Us

**重要更正**: **目前 NOT an imaging dataset**！
- 832,000+ enrolled (2025)，core data = survey + EHR + genomics + biospecimen
- WGS: 245,388 (2023)
- **EHR-linked DICOM 计划 2025-2026 才开始**
- **Diversity 优势**: >50% non-white

**对 Direction A**: 暂时不能用 imaging

---

### 4.7 Generation R Study

**规模**: 9,778 mothers / **3,542 offspring**
- Wave 1 MRI (2009, ages 6-9): 1,070
- **Wave 2 MRI (2013-15, ages 9-11): 4,087**
- Wave 3 MRI (~2019-21, age 13): ~5,000 目标
- Wave 4 MRI (2022+, ages 16-17): 进行中
- **≥2 MRI: ~3,500；≥3: ~1,000+**

**特色**: pediatric → 长大成人，3T GE，brain + body 混合

**Access**: DUA with Erasmus MC

---

### 4.8 MIDRC

**规模**: **>300,000 imaging studies / ~68k patients**
- RICORD-1A: 120 thoracic CT (COVID+)
- RICORD-1B: 120 CT (COVID−)
- RICORD-1C: 998 CXR / 361 patients

**关键事实**: **不是 longitudinal cohort**——是 multi-institutional ingest，主要 cross-sectional

**Access**: data.midrc.org 免费 (CC BY)。**20% sequestered for held-out testing**。

---

### 4.9 ABCD Study

**规模**: 11,878 youth (9-10 yo baseline 2016-18)
- biennial MRI cadence (Y0, Y2, Y4, Y6, Y8, Y10)
- **≥2 timepoints: majority (~7,000+ with follow-up)**
- ≥3 timepoints: 进行中（Y4 release 2024+）

**仅 brain MRI**——no cardiac / abdominal

**Access**: NDA, 免费 academic

---

### 4.10 CARDIA

**规模**: 5,114 baseline (1985-86, ages 18-30, bi-racial Black/White)
- Brain MRI Y25 (2010-11): 719
- Y35 (2020-22): **1,074**
- Echo Y5/10/25/30，Cardiac CT Y15/20/25
- ≥2 brain MRI: ~500-700

**特色**: **38+ 年纵向** (仅次于 Framingham)；imaging from young age

**Access**: BioLINCC 免费

---

### 4.11 CHILD Study (用户可能记错了)

CHILD = Canadian Healthy Infant Longitudinal Development —— **没有系统 MRI**

用户可能想说的是 **HBCD (HEALthy Brain & Child Development)** —— NIH 0-10 yr neuroimaging cohort，~7,500 mothers + 婴儿；2021 launch，尚未大规模 release。

---

### Part 4 汇总 Table

| 数据集 | Imaging N | ≥2 MRI TP | ≥3 MRI TP | 模态 | 同人多器官 | 费用 | 总跨度 |
|---|---|---|---|---|---|---|---|
| **UK Biobank** ⭐ | 100,000 | **~20,000** → 60k by 2029 | 进行中 | brain+cardiac+abdomen+DXA+US+OCT | ✓ | £3-9k | 25+ yr |
| **NAKO** | 30,861 | **~18,000** | 进行中 | brain+cardiac+abdomen+MSK | ✓ | cost-rec | 2014- |
| **MESA** | 5,098 CMR | ~3,015 | small | Cardiac MRI/CT + brain (later) | partial | $0 | 26 yr |
| **Framingham** | ~2,700 brain | ~1,000+ | subset | brain+cardiac+echo | 1,114 ovrlp | $0 | **77 yr** |
| **Project Baseline** | 2,500 | yes (annual) | yes | echo+CAC+retinal (no MRI) | partial | n/a | 2017- |
| **All of Us** | ~0 native | n/a | n/a | EHR-derived (in dev) | n/a | 免费 acad | 2018- |
| **Generation R** | 4,087 (W2) | ~3,500 | ~1,000+ | brain + body MRI | partial | DUA | 24 yr |
| **MIDRC** | 300k+ studies | **mostly cross-sectional** | ✗ | CXR+CT+expanding | mostly chest | 免费 | 2020- |
| **ABCD** | 11,878 | ~7,000+ | growing | brain MRI only | ✗ | 免费 acad | 10 yr planned |
| **CARDIA** | ~1,074 brain | ~500-700 | smaller | brain+cardiac MRI/CT+DXA | ~70 all | $0 | **38+ yr** |

---

### Part 4 关键结论（对 Direction A）

1. **UK Biobank 是 king**：100k 同人 brain+heart+abdomen 多模态，~20k ≥2 TP (2025)，目标 60k by 2029。**但 model weights 必须 return UKB**（march-in clause）
2. **NAKO 是最佳补充**：~18k ≥2 MRI TP，3T 统一 Skyra（比 UKB cardiac 1.5T 更一致），但 access 卡 GDPR
3. **真正可用 multimodal + ≥2 TP + 同人的数据集**：实际只有 **UKB (~20k)**、**NAKO (~18k)**、**Generation R (pediatric)**、**CARDIA (small)**
4. **All of Us 暂时不是 imaging dataset** —— 简版有歧义，更正
5. **MIDRC 不适合纵向 FM**（cross-sectional ingest）
6. **Weight redistribution 难题**: UKB-trained FM 无法 release 权重（只能 release inference code + training recipe）。RETFound 是 exception（数据 partly external from Moorfields）
7. 用户列的 "CHIRP" 不存在，可能是 **HBCD** (NIH 0-10 yr 神经影像 cohort)

---

## Part 5: 2D 纵向数据集（CXR / OCT / Fundus / Mammography / US / Pathology）

> 用于回答 "如果 Direction A 改 2D，哪些 dataset 真的能撑起 FM scale"。

### 5A. CXR 纵向

#### MIMIC-CXR ⭐⭐⭐⭐⭐
- **病人数**: 65,379 unique
- **≥2 TP: 26,625** | **≥3 TP: 16,135** | **≥5 TP: 8,035** (一手 Hou 2023 PMC10370215 Table 1)
- 时间: 2011-2016 BIDMC
- 配对: 自由报告 + CheXpert/NegBio labels + **MIMIC-IV linkage** (labs / meds / ICU vitals / mortality)
- Access: **PhysioNet credentialed**（1-2 周）
- **Direction A 2D 首选**

#### CheXpert Plus
- 病人 64,725 / 报告 223,228 / **关键字段 `patient_report_date_order`**
- ~40k+ ≥2 studies（估算 187,711 / 64,725 ≈ 2.9 avg）
- 时间: 2002-2017 Stanford
- 2024 才公开 reports → **underused for longitudinal**
- License: Stanford research-only

#### PadChest
- 67,000 病人 / 109,931 studies / **2009-2017 西班牙 Alicante**
- ~30-35k ≥2 TP（估）；官方未发 longitudinal split
- Reports 西班牙文
- License: research-only

#### PLCO CXR ⭐
- **56,071 患者 / 185,241 CXR / TIF**
- **结构化 T0-T3 annual screen** + **lung cancer outcomes** (median ~12yr follow-up)
- Image 申请 **cap 25k subset**
- CDAS 等待 3-6 月
- **最适合 longitudinal risk FM**

#### ChestX-ray14 (NIH)
- 30,805 病人 / 112,120 frontal images
- **无 absolute timestamps**（只有 follow-up index）
- 无 reports
- 完全开放下载（无 DUA）

#### VinDr-CXR
- 18,000 images，**cross-sectional only**，detection benchmark
- ❌ 不适合 longitudinal

#### MIMIC-IV-linked CXR
- = MIMIC-CXR ∩ MIMIC-IV
- ~60,000+ overlap → **CXR + EHR over time** 多模态 longitudinal 核心

---

### 5B. Retinal (OCT / Fundus) 纵向

#### OPHDIAT ⚠️ 不公开
- **101,383 糖尿病患者 / 763,848 fundus / 2004-2017 / annual**
- L-MAE 等 paper 用了
- **法国 IMT Atlantique 私有，需建立合作**
- 不要 plan 在它上面除非已有 collaborator

#### AREDS / AREDS2
- 4,757 + 4,203 patients (~9k total)
- 长 follow-up: AREDS median 6.5yr，AREDS2 median 5yr，**annual structured**
- dbGaP controlled，等待 6-8 周
- 基本所有 patient ≥2 TP
- **样本量太小做 FM 但 evaluation/finetune 优秀**

#### EyePACS Kaggle (公开版)
- 88,702 images / 44,351 patients × 2 eyes
- **Cross-sectional only**（每病人 1 visit）
- 完整 EyePACS network (107k+ longi) **不公开**

#### Messidor / Messidor-2
- &lt;1.2k images，cross-sectional，**仅 evaluation**

#### UK Biobank fundus + OCT ⭐
- ~67k baseline + repeat ongoing
- **~50k+ 完成 first repeat**
- 多模态 phenotype: WGS + EHR + brain/cardiac/abdomen MRI
- 付费 access，4-10 yr 间隔
- 已用于 RETFound (Nature 2023), retinal aging clock (eLife 2023)

---

### 5C. Mammography 纵向

#### EMBED (Emory) ⭐⭐⭐⭐⭐
- **115,910 病人 / 3.65M images / 2013-2020**
- **3-yr follow-up: 37,939 patients ⭐**
- **5-yr follow-up: 24,933 patients ⭐**
- 40,000 ROI annotations，**Race 平衡 Black/White**
- **AWS 20% subset 立即可用**；完整 access Emory DUA ~2-3 月
- **唯一公开 5-yr follow-up &gt;20k patients 的 2D dataset**

#### OPTIMAM ⭐⭐⭐⭐⭐ 规模最大
- **&gt;10M images / &gt;740,000 women / UK NHS triennial screen**
- 中位 follow-up 6-9 yr，每 woman 2-3 screening rounds
- License: CRUK + Royal Surrey DAC，等 3-6 月
- 已被 30+ 商业/学术组用 (Lunit, ScreenPoint, Kheiron)

#### CSAW (Karolinska)
- ~1.1M exams / ~470k women，**不公开**（仅 Mirai 等合作）
- CSAW-CC subset (~9.5k) 部分公开

#### CMMD
- 1,775 病人，**cross-sectional**，仅 evaluation

#### CBIS-DDSM
- 1,566 病人，cross-sectional，**SFM (扫描胶片)** 不是 FFDM，仅 benchmark

#### MIRAI MGH 数据
- &gt;200k mammography exams for training，**不公开**

---

### 5D. Ultrasound 纵向

❌ **几乎不存在公开的 longitudinal US dataset**

- UltraFedFM: 1M+ images / federated → 不可下载
- BUSI / BUS-BRA / BUS-UCLM: 全 cross-sectional
- Echocardiography (TMED-2, EchoNet-Dynamic) 有 multi-clip 但不是 multi-visit
- → **建议放弃 US 模态**

---

### 5E. Pathology 纵向

⚠️ **不存在 FM-scale longitudinal 病理 dataset**

- TCGA WSI: 30k slides，**no pre/post-treatment pairing**
- IMPRESS: 126 WSIs，HER2+/TNBC NAC pre/post，**太小**
- Post-NAT breast: 54 patients，**太小**
- 病理本质上极少做配对前后取样（创伤大）
- → **Pathology direction A 在 longitudinal 上 essentially DOA**

---

### 2D 数据集汇总（按 FM-scale 可达度）

| 数据集 | 模态 | 病人 ≥2 TP | Access 难度 | FM-scale? | 推荐度 |
|---|---|---|---|---|---|
| **MIMIC-CXR** | CXR | **26,625** | 易（PhysioNet）| ✅ | ⭐⭐⭐⭐⭐ |
| **CheXpert Plus** | CXR | ~40k+ | 易（Stanford AIMI）| ✅ | ⭐⭐⭐⭐ |
| **PadChest** | CXR | ~30-35k | 中（BIMCV）| ✅ | ⭐⭐⭐⭐ |
| **PLCO CXR** | CXR | majority | 3-6 月 CDAS | ✅ structured | ⭐⭐⭐⭐⭐ for risk |
| **ChestX-ray14** | CXR | ~15-18k | 开放 | borderline | ⭐⭐⭐ |
| VinDr-CXR | CXR | NONE | 易 | ❌ | ⭐ eval only |
| **OPHDIAT** | Fundus | majority | **不公开** | ✅ if access | ⭐⭐⭐⭐⭐ if 可达 |
| **AREDS+AREDS2** | Fundus | ~9k all ≥2 | dbGaP 6-8wk | ⚠️ borderline | ⭐⭐⭐⭐ for AMD |
| EyePACS Kaggle | Fundus | NONE | 易 | ❌ | ⭐⭐ |
| **UK Biobank fundus** | Fundus+OCT | ~50k+ | UKB AMS 3-6mo 付费 | ✅ multi-modal | ⭐⭐⭐⭐⭐ for aging |
| Messidor/-2 | Fundus | NONE | 开放 | ❌ | ⭐ eval |
| **EMBED** | Mammo | **24,933 (5yr)** | AWS 20% / Emory DUA | ✅ rich follow-up | ⭐⭐⭐⭐⭐ |
| **OPTIMAM** | Mammo | **majority of 740k** | CRUK 3-6mo | ✅ **biggest** | ⭐⭐⭐⭐⭐ |
| CMMD / CBIS-DDSM | Mammo | NONE | 易 | ❌ | ⭐ eval |
| MIRAI MGH | Mammo | longi | **不公开** | N/A | ⭐ |
| UltraFedFM | US | unclear | **不可访问 raw** | ❌ | ⭐ weights only |
| BUSI/BUS-* | US | NONE | 易 | ❌ | ⭐ eval |
| IMPRESS WSI | Path | 126 pairs | 公开 | ❌ 太小 | ⭐⭐ small case |
| TCGA WSI | Path | mostly NO | 开放 | ❌ NOT longi | ⭐ |

### 2D Direction A 现实方案

**方案一：CXR 路线（最稳）**
- Pretrain: MIMIC-CXR + CheXpert Plus + PadChest → **80k-100k 病人 ≥2 TP**
- Evaluation: PLCO (lung cancer)、VinDr (detection)、Messidor cross-domain

**方案二：Mammography 路线（最适合 risk）**
- Pretrain: EMBED + OPTIMAM → **~700k+ women, structured intervals**
- Evaluation: CMMD / CBIS-DDSM / Mirai cohorts

**方案三：Retinal 路线（需 access）**
- Pretrain: UK Biobank fundus + AREDS/2 + 公开 fundus 集 (如能拿 OPHDIAT or EyePACS full)
- Evaluation: Messidor-2, IDRiD, APTOS

**Pathology / Ultrasound**: 数据上 infeasible，建议放弃或 reframe single-timepoint。

---

### 2D vs 3D 总结判断

| 维度 | 2D | 3D |
|---|---|---|
| 数据量 | MIMIC ~27k + Plus ~40k + EMBED ~25k = **&gt;90k 病人 ≥2 TP** | NLST + UKB + ABCD + ADNI etc. **30-50k ≥3 TP** |
| 数据可达 | **公开 access 普遍** | DUA + 付费多 |
| 竞争 | **Microsoft 主导 CXR**（BioViL-T/MAIRA-2/HERGen/MLRG）| 真空白 |
| 临床价值 | screening / 报告生成 | dx / treatment / 预后 |
| paper 影响力 | 中（增量）| 高（首次）|

**结论**：2D 数据更多更易，但被 Microsoft / Stanford 占；3D 数据稀缺但**整片空白**。Direction A 维持 3D 主线，但 paper 可考虑 2D 作 "demonstrating method also works on 2D" 的 robustness 章节。

---

## Part 6: ADNI / OASIS / TADPOLE 深度调研

> 805 行独立文件 → [datasets-adni-oasis.md](datasets-adni-oasis.md)

**关键 finding（澄清几个常被搞错的数字）：**

| 数据集 | 病人数（一手） | MR sessions | ≥3 TP 估算 |
|---|---|---|---|
| **ADNI 1** | 819 | ~4-5k T1 | ~600-700 |
| **ADNI GO** | 131 EMCI | bridge | ~70% |
| **ADNI 2** | 790 | ~5k+ | ~500-600 |
| **ADNI 3** | 692 active | ~8k+ | ~300（CN 双年访视）|
| **ADNI 4** | 50 (2024-04) → ~200-500 估 2026 | early | TBD |
| **ADNI 累计** | **2,482** | **17,141 T1** | **~1,300-1,700** |
| **OASIS-1** | 416 (cross-sec) | 434 | 0 |
| **OASIS-2** | 150 | 373 | ~50% |
| **OASIS-3** | **1,378** | **2,842** + 2,608 PET (含 451 tau) + 1,472 CT | ~30% |
| **OASIS-4** | 663 | 676（**cross-sec 临床**，不是 longi）| 0 |
| **TADPOLE D1** | **1,667** (CN 508/MCI 841/AD 318) | features only | 8.3 visits avg, ≥3 TP ~80% = ~1,300 |

**澄清 / 修正：**

1. **OASIS-3 vs OASIS-4 关键区别**（很多人混）：OASIS-4 **不是** OASIS-3 续集。OASIS-3 是 longitudinal 研究 cohort (1,378 人，30 年 Knight ADRC)，OASIS-4 是 cross-sectional 临床 memory-clinic referrals (663 人，包含 non-AD dementia 用于鉴别 dx)

2. **TADPOLE "1737" 错误**：用户记忆是 visit-rows，真实 unique subject = **1,667**（Marinescu 2020 Table 1）。平均 8.3 ± 4.5 visits/人，总 visit-rows ≈ 13,800

3. **ADNI 累计 ~2,482 人**（Aisen 2024 ADNI Clinical Core Table 1, PMC11485391）——不是常传的 >3,000

4. **ADNI 累计 T1 = 17,141 series**（Jack 2024 PMC11485416, as 2024-04-25）

5. **ADNI4 进度**：2024-04 仅 35-50 in-clinic + 654 digital。2025-2026 公开数字缺失（需登 LONI 查 enrollment dashboard）

**给 Direction A 的实操建议**：
- 主预训练 corpus：ADNI 1+GO+2+3 (按 RID dedupe) + OASIS-3 → **~3,800 subjects / ~16,000 longi MRI sessions**
- 量级仍比 BrainIAC (48,965 scans) 小 1/3 → 必须再补 ABCD + UK Biobank brain + Open BHB (见 Part 4)
- TADPOLE D1 = features only，不能补 raw image，但是下游 AD prediction benchmark
- OASIS-4 当 differential dementia dx benchmark
- ADNI4 太新，做 zero-shot evaluation

**Access 简化（最重要）：**
- ADNI: LONI IDA 注册 → DUA → **~2 周**审核，**免费**，**可 redistribute model weights**
- OASIS: portal/NITRC → ~几天到 2 周 → 免费 → 但需 cite specific NIH grants

**License 关键**：ADNI 和 OASIS 都不能 redistribute raw imaging data，但 model weights 通常 OK（避免可逆识别即可）

详细每个数据集的 access / scanner / 配对 biomarker / 已用 FM 工作 等信息见 [datasets-adni-oasis.md](datasets-adni-oasis.md)。
