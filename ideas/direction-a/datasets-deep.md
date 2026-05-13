# 纵向 CT 数据集深度调研

> 由 3 个 subagent 并行调研，每个数据集附 link + 引用证据 + 精确数字。
> 调研日期: 2026-05-13。
>
> **状态**: 全部 7 个 Parts 完成（含 ADNI/OASIS 详 + 其他 brain MRI longi）。Part 1 + Part 3 数字由独立替换 agent 交叉验证。**⚠️ CT-RATE 的 "多 volume 含义" 两个 agent 结论矛盾**（重建 vs 不同 timepoint），需 HF 原页面确认。

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

> **关键发现**: 公开真正纵向 CT 唯一大规模源仍是 **NLST**。INSPECT 主要是 EHR 纵向但 CT 多为 1-2 次。**CT-RATE 不是纵向**（multi-volume = 重建变体）。

### 3.1 INSPECT (Stanford) ⭐⭐⭐

**基本信息**
- 论文: Huang S-C, Huo Z, ..., Shah NH, Fries JA. NeurIPS 2023 D&B Track.
- arXiv: [2311.10798](https://arxiv.org/abs/2311.10798)
- 官网: https://som-shahlab.github.io/inspect-website/
- 代码: https://github.com/som-shahlab/INSPECT_public
- AIMI: https://aimi.stanford.edu/datasets/inspect-Multimodal-Dataset-for-Pulmonary-Embolism-Diagnosis-and-Prognosis

**规模（一手）**
- **病人: 19,402 distinct**（som-shahlab + Redivis + arXiv 一致）
- **CTPA scans: 23,248**
- 原始 sample 池 26,475 CT，清洗到 24,474，最终 cohort 23,248
- 时间: 2000-2021 (Stanford Health Care)
- **EHR 事件总量: 225M+**（9 个 STARR-OMOP 表）

⚠️ **纵向 CT 子集**（**Direction A 关键数字**）：
- 论文/官网/README **没显式公布** ≥2 CTPA timepoints 病人数
- **数学估计: 23,248 / 19,402 = 1.20 scans/患者 → ~3,000-4,000 病人 ≥2 CTPA**
- ≥3 timepoint: 估 <1,000
- "longitudinal" 主要指 **longitudinal EHR**（每病人多年事件流），**不是多张 CT**
- 真正验证: DUA 后 `df.groupby('person_id').size().value_counts()`

**配对数据**
- 报告: **impression sections only**（不是完整 report）
- EHR: OMOP CDM 9 表（demographics / conditions / procedures / drug / labs / observations / visits）
- **8 个 outcome tasks**: PE +/-; 12-mo mortality / PE recurrence / PH onset; hospitalization / readmission 变体

**Access**: AIMI 申请 + Stanford DUA (non-commercial) → **1-4 周**；CT DICOM (+ 预处理 NIfTI / HDF5)；模型 weight 可分享

**Caveats**:
- ⚠️ **只 CTPA**（contrast-enhanced PE-protocol），不是 routine chest CT，泛化受限
- ⚠️ 单中心 Stanford
- ⚠️ Impression only 不是完整 report

**已用**: **Stanford TTE Pretraining** (2411.09361) 用作 downstream eval；Huo 2024 multimodal ablation；Snorkel weakly-supervised label; EHRSHOT 姊妹 benchmark

---

### 3.2 CT-RATE ⚠️ **关键澄清：不是纵向**

**基本信息**
- Hamamci IE et al. arXiv [2403.17834](https://arxiv.org/abs/2403.17834)（v1 2024.03，v latest 2026.02，30 个作者）
- HF: https://huggingface.co/datasets/ibrahimhamamci/CT-RATE
- 扩展 RadGenome-Chest CT: arXiv 2404.16754 → Nature Sci Data 2025

**规模**
- **病人: 21,304 unique**
- **3D CT volumes: 25,692 non-contrast chest CT**
- 扩展（重建变体）: 50,188 volumes
- train/val: 20,000 / 1,304 病人
- 总大小 21.3 TB

⚠️ **纵向 vs 重建（关键澄清！）**:
- HF dataset card 明确：**多 volume per patient = different reconstructions (kernel/slice)**，**NOT longitudinal timepoints**
- 命名: `split_patientID_scanID_reconstructionID`
- 25,692 / 21,304 ≈ 1.21 volumes/patient，是**重建数不是时间点数**
- **结论：CT-RATE 不能用于纵向预训练**，只能 single-timepoint VLM

✅ **冲突已解决（2026-05-13 verification agent 一手查证）**：

**HuggingFace dataset card 原文**："Our folders are structured as `split_patientID_scanID_reconstructionID`. For instance, 'valid_53_a_1' indicates that this is a CT volume from the validation set, **scan 'a' from patient 53**, and reconstruction 1 of scan 'a'."

**CT-CLIP repo `scripts/data.py`**：目录结构 `patient_folder / accession_folder / *.nii.gz`。中间层变量名 `accession_folder` 确认每个 letter = 一个 accession（PACS 系统里一次独立的 exam order）。

**结论**：
- 21,304 → 25,692（差 4,388）= 多 **accession per patient**（独立 exam，**可能是不同 timepoint**）
- 25,692 → 50,188（×1.95）= **reconstruction 扩展**（同一 scan 不同 kernel/slice）
- **真实可用**: **~3,000-4,400 patients 有 ≥2 distinct accessions**

**关键 caveat（两个 agent 都漏的）**：
- ⚠️ CT-RATE 公开 release **没有 StudyDate / ScanDate 元数据** → 即使是不同 accession，**interval 未知**（可能几分钟到几年）
- ⚠️ CT-CLIP 原作者把每个 volume 当 i.i.d. 处理，没定义 longitudinal 目标
- ⚠️ 想要 Δt-aware → 必须邮件 author 申请 scan-date 元数据

**对 Direction A 的实际价值**：
- ✅ 能加 ~4k patient "same-patient contrastive learning" 作 Δt-free 预训练
- ❌ 不能直接做 interval-aware MVM / Δt-scaled attention（除非拿到 timestamps）
- 综合：**可用作 Direction A 弱 augment，不算主力**

**配对数据**
- **完整 radiology reports**（土耳其原文 + GPT 翻译英文，impression + findings）
- **18 abnormality labels** binary
- demographics 有限
- **无 outcome labels** — 没 mortality / 临床终点

**Access**: HF 注册 + Terms → 立即下载；NIfTI 已标准化；118,973 downloads last month

**License**: **CC BY-NC-SA 4.0** + Terms #5 禁止 redistribution（条款互相冲突）

**Caveats**:
1. ⚠️ **不是纵向**（这是关键 correction）
2. 单中心 Istanbul Medipol，土耳其人口
3. 报告是机翻英文有噪声
4. Non-contrast chest only

**已用**: CT-CLIP, CT-CHAT (Hamamci 自己), M3D, Merlin 部分对比, RadGenome-Chest CT (Zhang 2024 扩展为 197 organ + 665K grounded sentences + 1.2M VQA pairs)

---

### 3.3 MIDRC (NIH)

**基本信息**
- 主导: NIBIB-funded, RSNA + ACR + Univ Chicago
- Baughan N et al., PMC10704184 2023
- 官网: midrc.org / data.midrc.org

**规模**
- 公开 imaging studies: 135K+ (2025-26)
- 总收集: 300K+ (~80% 公开 / ~20% sequestered)
- Modality: 起 chest X-ray + chest CT (COVID)，扩展 MRI/US/PET/其他

**纵向？**: ❌ **没有专门纵向 cohort 设计**；MIDRC 是 cross-sectional ingest；个别机构可能有 follow-up 但**不是设计目标**

**Caveats**: 非纵向；metadata 而非完整 EHR/报告；不适合 Direction A 纵向预训练

---

### 3.4 Stony Brook COVID-19 (COVID-19-NY-SBU)

**基本信息**
- TCIA collection: COVID-19-NY-SBU
- Saltz J et al. 2021 TCIA, DOI 10.7937/TCIA.BBAG-2923
- URL: https://www.cancerimagingarchive.net/collection/covid-19-ny-sbu/

**规模**
- **病人: 1,384**, 7,361 studies, 17,950 series, 562,376 images, 511.48 GB
- Modality: CT, CR, DX, MR, SR, NM, PT, OT

**纵向？**: ⚠️ **部分有 follow-up data type**，但**发布版本每病人选 "most severe encounter"**，公开 CSV 1 row/patient。原始 PACS 有多 visit 但**公开版本压缩为单 encounter**。

**License**: **CC BY 4.0**（宽松，可 redistribute with attribution）

**Caveats**: COVID-only 特定时期 (2020)；公开版只保留每病人 1 encounter；单中心 NY/Long Island

---

### 3.5 LIDC-IDRI

**基本信息**
- Armato SG 3rd et al., Med Phys 38:915-931, 2011
- DOI: 10.1118/1.3528204
- TCIA: https://www.cancerimagingarchive.net/collection/lidc-idri/

**规模**
- 病人: **1,010** / 1,308 studies / 244,527 images

**纵向？**: ⚠️ **只 8 个病人有 2 个 timepoints**（TCIA 官方文档），实际几乎是 single-timepoint，**不能作纵向**

**License**: **CC BY 3.0**（可商用 with attribution）

**特色**: 4 个放射医生独立 nodule 标注；经典 nodule detection baseline；但纵向**完全不适合**

---

### 3.6 DeepLesion

**基本信息**
- Yan K et al., J Med Imaging 5(3):036501, 2018, DOI 10.1117/1.JMI.5.3.036501
- NIH 下载: https://nihcc.app.box.com/v/DeepLesion

**规模**
- **病人: 4,427 unique** / 10,594 studies / 32,120 axial key slices / 32,735 bookmarks (RECIST 测量)

**纵向？**: ✅ **是的！**
- 10,594 / 4,427 = **2.39 studies/patient**——**绝大多数病人有多次扫描**
- Bookmark identifiers 含 "follow-up set number"，**同一病灶跨多次扫描追踪**
- 一手论文："One patient often underwent multiple CT examinations"
- 衍生 **Deep Lesion Tracker (Cai 2021 CVPR)** 构建 **3,891 lesion pairs** 作 longitudinal lesion tracking benchmark
- ⚠️ 但 public release **只 key slices ± 30mm context**，**不是完整 volume**

**配对数据**: RECIST diameter + bbox per lesion；pixel spacing / slice interval / intensity window / gender / age；8 类病灶；**无报告 / 完整 EHR**

**License**: NIH 公开（不显式 CC）；⚠️ **2024 起 NIH 暂停下载**（社区有 academictorrents mirror）

**Caveats**:
1. ⚠️ **不是完整 3D volume** — 只 key slice ± 30mm context（30 slices each）
2. 时间戳信息部分去标识化模糊
3. 适合 **lesion tracking**、不适合 organ segmentation 全卷预训练

**已用**: ULDor, MULAN, Deep Lesion Tracker (Cai 2021), LesionPaste, ModelsGenesis

---

### 3.7 AbdomenAtlas / TotalSegmentator

**AbdomenAtlas (Li 2024 MedIA, arXiv 2407.16697)**
- 3 个版本: 1.0 (5,195 CT, 88 hospitals, 9 organs) / 1.1 (9,262 CT, 25 classes) / full MedIA 2024 (**20,460 CT, 112 hospitals, 22 anatomical structures, 673K masks**)
- 纵向: ❌ **没有纵向设计**——aggregator 聚合 14+ 公开数据集
- License: CC BY-NC-SA 4.0

**TotalSegmentator (Wasserthal 2023, Radiology: AI)**
- 1,228 CT + 616 MR subjects, **117 main classes**
- 纵向: ❌ 无 longitudinal 设计
- License: Apache 2.0 (tool); 数据 CC BY-SA 4.0

**共同 Caveats**: 都不适合纵向预训练；适合 organ seg pretraining / decoder 初始化。AbdomenAtlas 是当前**最大的有标注 abdominal CT 集**。

**已用**: SuPreM (Li 2024 ICLR oral) 用 9,262 AbdomenAtlas-1.1；Touchstone (NeurIPS 2024) 5,172 OOD CT volumes benchmark；TotalSegmentator V2

---

### 3.8 NLST 衍生（详 Part 1.1，重复要点）

- TCIA NLST collection: 26,254 subjects / 203,099 series / **21,082,265 images**
- DOI: 10.7937/TCIA.HMQ8-J677
- License: CC BY 4.0
- **真正纵向 ✅**: 3 annual rounds，~75-80% 完成全部 3 轮
- 配对 outcomes via CDAS

---

### 3.9 IDC (Imaging Data Commons) ⭐⭐ NLST 最佳访问路径

**基本信息**
- Fedorov A et al., Cancer Research 81(16):4188-4193, 2021, DOI 10.1158/0008-5472.CAN-21-0950
- 2023 RadioGraphics 更新, DOI 10.1148/rg.230180
- Portal: https://portal.imaging.datacommons.cancer.gov/

**规模（Release 24.0, 2026-04-27）**
- 总 cases: **85,682**
- Image series: **1,032,911**
- Collections: **176**
- 数据量: **99.27 TB**
- Modality: CT + MR + PET + Slide Microscopy + SEG

**纵向 collections（Direction A 金矿）**
- **NLST**（>75K CT screening on IDC + TCIA）
- NSCLC-Radiomics, NSCLC-Radiomics-Genomics
- TCGA 系列（GBM/LGG/BRCA/COAD/READ/KIRC 等）
- Pediatric (CCDI)
- HTAN
- LIDC-IDRI
- QIN-LUNG-CT, QIN-PROSTATE-Repeatability

**Access**: **完全免费 cloud access**；5 个 interface：GCP+AWS buckets / BigQuery / Python `idc-index` / REST API / DICOMweb；公开 tier 无需 DUA

**License**: 逐 collection 不同（多数 CC BY 4.0）

**Caveats**: IDC 不产生数据 — aggregator；纵向性取决于底层 collection；没 EHR/报告（非 INSPECT 那种 multimodal）

---

### Part 3 汇总 Table（Direction A 视角）

| 数据集 | 病人 | CT volumes | **真正纵向 ≥2 TP** | 配对模态 | 适合度 |
|---|---|---|---|---|---|
| **INSPECT** | 19,402 | 23,248 CTPA | **~3-4K 估**（math：1.20 scans/pt，需 DUA 跑） | ✅ EHR 225M + impression + 8 outcome | ⭐⭐⭐ multimodal eval；纵向 CT 规模有限 |
| **CT-RATE** | 21,304 | 25,692 | **0**（multi-vol = 重建非 TP）| 报告 + 18 标签；无 EHR | ⭐ 仅 single-TP VLM |
| **MIDRC** | N/A | 135K studies | **无统一纵向 cohort** | structured metadata | ⭐ COVID 主要 |
| **Stony Brook** | 1,384 | subset CT | **公开版强制 1 encounter/pt** | OMOP-like + COVID | ⭐ 小规模 baseline |
| **LIDC-IDRI** | 1,010 | 1,308 | **仅 8 病人** ≥2 TP | 4-radiologist nodule annot | ❌ 纵向不可用 |
| **DeepLesion** | 4,427 | 10,594 (key slices only) | **大多数 ≥2 study** (avg 2.39); 3,891 lesion pairs | RECIST + bbox；无报告 | ⭐⭐ lesion tracking only |
| **AbdomenAtlas** | N/A | 5,195/9,262/20,460 | **无纵向设计** | 22-organ seg masks | ⭐ Organ seg init |
| **TotalSegmentator** | N/A | 1,228 CT + 616 MR | **无纵向** | 117 anatomical seg | ⭐ Encoder/decoder init |
| **NLST (TCIA)** ⭐ | 26,254 | 21M images | **~20K ≥2 TP, ~16K ≥3 TP** | 6.5-yr mortality + 肺癌 via CDAS | ⭐⭐⭐ 大规模纵向 |
| **IDC** | 85,682 cases | 1.03M series, 99 TB | **聚合 NLST + 部分 TCGA + QIN-repeat** | 跨 collection metadata | ⭐⭐ NLST 最佳访问 |

### Part 3 关键 takeaway（给 Direction A）

1. **公开真正纵向 CT 唯一大规模源仍是 NLST** (~20K ≥2 TP)。其他所谓"纵向"要么 EHR 纵向但 CT 1-2 次（INSPECT），要么是重建变体（CT-RATE），要么是 key-slice tracking（DeepLesion）

2. **INSPECT 纵向 CT 实际规模**：官方不公布，数学估 ~3-4K ≥2 TP，<1K ≥3 TP。**Direction A 必须 DUA 后跑 cohort 脚本验证**

3. **CT-RATE 不是纵向**（关键 correction）：21,304 病人 / 25,692 volumes 多 volume 是 **`reconstructionID`** 不是 timepoint

4. **IDC 是 NLST 最佳访问路径**：免费、cloud-native、5 种 API；large-scale 纵向 pretraining 最实用

5. **建议 Direction A 数据 stack**:
   - Pretraining: **NLST (via IDC)** longitudinal backbone (~20K patient × 3 scan = ~60-75K longi CT)
   - Eval multimodal: **INSPECT** (CT+EHR+报告 + 8 prognosis tasks)
   - Eval lesion tracking: **DeepLesion + DLT 3,891 pairs**
   - Eval single-TP VLM baseline: **CT-RATE + RadGenome-Chest CT**
   - Decoder init: **AbdomenAtlas 1.1** 或 TotalSegmentator

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

---

## Part 7: AD / 神经退行性疾病 brain MRI 纵向（9 个，跳过 ADNI/OASIS/TADPOLE）

### 7.1 AIBL (Australian Imaging Biomarkers and Lifestyle)

**基本信息**
- 出处: CSIRO + Florey Institute + ECU 联合，2006 启动
- Descriptor: Ellis KA et al., *Int Psychogeriatr* 21(4):672-687 (2009), DOI 10.1017/S1041610209009405, [PubMed 19470201](https://pubmed.ncbi.nlm.nih.gov/19470201/)
- 15-yr 更新: Fowler C et al., *JADR* 5(1):443-468 (2021), [PMC8293663](https://pmc.ncbi.nlm.nih.gov/articles/PMC8293663/)
- 官网: [aibl.org.au](https://aibl.org.au/) / 数据 [LONI IDA](https://ida.loni.usc.edu/collaboration/access/appApply.jsp?project=AIBL)

**规模**
- baseline 1,112 → 2,359 (2021) → **3,045 (2023.02) / 10,494 person-contact years**
- baseline MRI 子集: 287 (53 AD / 57 MCI / 177 HC)
- 后续 +250 MR/Flutemetamol, +200 MR/Florbetapir, +50 MR/PiB
- **18 个月间隔**，19+ 年项目期，长期参与者达 ≥6 TP
- 精确 ≥3/≥5 TP 分布**未公开**，需 LONI dashboard 查

**模态**: 1.5T + 3T 混合；T1 MPRAGE / T2 FSE / FLAIR；PET PiB + Florbetapir + Flutemetamol

**配对**: 血浆 biomarker 强项（血液 panel 是 AIBL 特色） + 部分 CSF；APOE 全员 + 亚组 WGS；MMSE/CDR/neuropsych；**lifestyle data** (饮食/运动/睡眠)；AD/MCI/HC 临床诊断 + 转化时点

**Access**: LONI IDA 与 ADNI 同流程，DUA + PI 资历，1-4 周；免费

**Caveats**: MRI 子集 <30%；1.5T+3T batch effect；公开材料无明确 TP 直方图

**已用**: AIBL 常与 ADNI/OASIS-3 联合做 amyloid PET harmonization (Bourgeat 2022)；blood-biomarker 模型外部验证

---

### 7.2 PPMI (Parkinson's Progression Markers Initiative)

**基本信息**
- 主导: MJFF 资助
- Descriptors: Marek K et al., *Prog Neurobiol* 95(4):629-635 (2011), [PubMed 21930184](https://pubmed.ncbi.nlm.nih.gov/21930184/); Marek K et al., *Ann Clin Transl Neurol* 5(12):1460-1477 (2018), [PubMed 30564614](https://pubmed.ncbi.nlm.nih.gov/30564614/)
- 官网: [ppmi-info.org](https://www.ppmi-info.org/)

**规模**
- PPMI 1.0 (2018): **423 PD + 196 HC + 64 SWEDD** 在 24 sites
- **PPMI 2.0** (2020+): 目标 **>4,000 volunteers**, 含 **2,000 prodromal**；50 国际 sites / 12 国家
- prodromal 已: 67 RBD/hyposmia + DAT 缺失 + 445 携带 SNCA/LRRK2/GBA
- MRI: 几乎全员 baseline T1；rsfMRI/DTI 子集
- 时间点: baseline + 3/6/9/12 月 + 年度 → 多数 ≥3 TP，相当一部分 ≥5 TP（10 年+ 随访）

**模态**: 3T 多 vendor (Siemens/GE/Philips); T1 必做 + T2/FLAIR/DTI/rsfMRI 子集 + neuromelanin-MRI (PPMI 2.0 加入); **DAT-SPECT 诊断 cohort 全员**; tau PET 小子集

**配对**: **CSF α-syn / Aβ42 / t-tau / p-tau** 全员 baseline；血浆 + biospec 库；WGS 全员 + 风险变异；MoCA/MDS-UPDRS/ESS/RBD；**phenoconversion 时点** (prodromal→PD)

**Access**: 注册 + DUA，1-2 周，免费

**Caveats**: MRI 不是 PPMI 主 modality（影像权重远低于 ADNI）；多 site/vendor 异质大

---

### 7.3 NACC / SCAN (National Alzheimer's Coordinating Center)

**基本信息**
- Descriptors: Beekly DL et al., *Alzheimer Dis Assoc Disord* 21(3):249-258 (2007), [PubMed 17804958](https://pubmed.ncbi.nlm.nih.gov/17804958/); Besser L et al. (2018) v3 UDS
- 官网: [naccdata.org](https://naccdata.org/) / 影像门户 [scan.naccdata.org](https://scan.naccdata.org/)

**规模（一手 naccdata.org）**
- 入组: **54,000+ 总参与者** (20,000+ active)
- 有 MRI/PET: **15,000+ 参与者**
- 每人 MRI/PET 扫描数: **1-14 exams per participant**
- 临床评估: 201,000+ assessments; **median 3 / range 1-20**
- ≥2 TP: 大多数活跃 cohort
- ≥3 TP: 约一半受试者
- ≥5 TP: 长期 ADRC cohort 子集

**时间结构**: UDS 每年访问；影像 opportunistic 不强制；37 ADRC × 25 州 × 30 年（自 1999）

**模态**: "mixed protocol" 1.5T / 3T / 多 vendor (来自 37 ADRC); SCAN 标准化后 T1 必有 + T2/FLAIR/DTI/rsfMRI 子集; PET: amyloid (PiB/Florbetapir/Florbetaben) + tau (Flortaucipir) + FDG 子集

**配对**: UDS neuropsych battery (MMSE/MoCA/CDR/v3 battery); **神经病理 8,300+ autopsies (NACC 独家！)**; APOE / WGS 子集 / ADGC GWAS 联动; CSF/血浆子集

**Access**: **完全免费**; 临床数据 web query 即时 / 影像 SCAN portal 2-6 周 (额外 DUA); 模型权重可发布

**Caveats**: 影像极度异质（37 中心 / 30 年）；不是为 DL 设计的，preprocessing 工作量大；部分早期 scan 仅 1.5T

**已用**: ADNI/NACC/OASIS 联合 brain age; Pathology-validated MRI prediction（NACC 独家神病数据）

---

### 7.4 GENFI (Genetic FTD Initiative)

**基本信息**
- 主导: 欧洲/加拿大 consortium (UCL coordination)
- Descriptor: Rohrer JD et al., *Lancet Neurol* 14(3):253-262 (2015), [PubMed 25662776](https://pubmed.ncbi.nlm.nih.gov/25662776/)
- 2024 扩展: Mirza et al. (2024) *Brain*; Neurology 2022 纵向 cognitive paper
- 官网: [genfi.org](https://www.genfi.org/)

**规模**
- GENFI1 (2015): **220 参与者** (118 carriers: 40 sym + 78 asym; 102 non-carriers); 11 sites
- GENFI 2024: 扩到 **710 个体** (118 sym + 305 presym + 287 non-carriers); 24 sites
- 另一纵向 paper: **518 participants from 222 families**，最长 7 yr 随访
- 突变: **C9orf72 / GRN / MAPT**

**时间结构**: baseline + 年度访问 → 18-24 月间隔；2012-01 启动，13 年→部分 5+ TP

**模态**: 3T 多 vendor; T1 volumetric 必做; T2/FLAIR/DTI/rsfMRI 子集; ASL 部分; 近期加 NODDI

**配对**: **CSF Aβ/tau/NfL/GFAP (NfL 是 FTD 早期 biomarker 核心)**; 血浆 NfL 全员; **明确 mutation 状态** (GENFI 核心标签); FTD-specific batteries (CBI-R / Social Cognition / GENFI-Cog); **EYO (estimated years to onset)**

**Access**: 通过 GENFI Steering Committee **项目级申请**，1-3 月（不是 click-and-go）；免费

**Caveats**: 申请门槛比 ADNI 高；样本量虽不大但 **mutation × pre-symptomatic × longitudinal 三重维度**独家

---

### 7.5 DIAN (Dominantly Inherited Alzheimer Network)

**基本信息**
- 主导: WUSTL
- Descriptors: Morris JC et al. *Clin Investig* 2(10):975-984 (2012); Moulder KL et al. *Alz Res Ther* 5:48 (2013), [PubMed 24131566](https://pubmed.ncbi.nlm.nih.gov/24131566/); **Bateman RJ et al. *NEJM* 367:795-804 (2012)**, DOI 10.1056/NEJMoa1202753, [PubMed 22784036](https://pubmed.ncbi.nlm.nih.gov/22784036/); McKay & Benzinger *Nat Neurosci* 26(8):1326-1327 (2023), [PMC10897966](https://pmc.ncbi.nlm.nih.gov/articles/PMC10897966/)
- 2025: 15 yr longitudinal *npj Dementia* (44400-025-00047-7)
- 官网: [dian.wustl.edu](https://dian.wustl.edu/)

**规模**
- Bateman 2012 NEJM: 128 participants (40 PSEN1 / 3 PSEN2 / 8 APP pedigrees, ~50% asym carriers)
- McKay 2023 imaging resource: **533 个体 / 206 ADAD families**
- DIAN-Obs (2024): **664 累计 / 314 active**; 23 sites / 11 国家 / 7 语言
- 17 年纵向 cohort，长期参与者 5-10 TP

**时间结构**: 入组 + 每年（sym）/ 每 2-3 年（asym）；自 2008 起 → 17 年；**EYO** (estimated years to symptom onset) — DIAN 独家时间轴

**模态**: 3T 多 site harmonized; T1 (MPRAGE)/T2/FLAIR/DTI/rsfMRI/ASL; PET: **PiB amyloid + FDG + tau (Flortaucipir)** 都有子集; 21 sites 收 PET

**配对**: **CSF Aβ42/40 + t-tau + p-tau181/217 全员纵向** (DIAN 核心); 血浆 Simoa Aβ + p-tau + NfL + GFAP; **每个家族 mutation 已知** + APOE; DIAN-cog composite; **症状发病时点 vs EYO**

**Access**: DIAN Resource Request 项目级审批，2-3 月；免费

**Caveats**: 罕见疾病 N 小但 mutation 标签 + pre-symptomatic 信号纯度极高；申请门槛高慢；跨国 IRB 协调复杂

**已用**: Bateman 2012 NEJM biomarker cascade（**经典 AT(N) 之源**）; Data-driven progression models; DIAN-TU 抗体药 trial 设计 borrow obs cohort

---

### 7.6 HABS (Harvard Aging Brain Study)

**基本信息**
- 主导: MGH + HMS, Sperling/Johnson lab
- Descriptor: Dagley A et al., *NeuroImage* 144(Pt B):255-258 (2017), [PMC4592689](https://pmc.ncbi.nlm.nih.gov/articles/PMC4592689/)
- 官网: [habs.mgh.harvard.edu](https://habs.mgh.harvard.edu/)

**规模**
- 入组: **284 clinically normal older adults** (baseline)
- MRI: 284 全员; rsfMRI 子集 260
- MRI 时间点: **baseline + 36-month follow-up MRI（仅 2 个影像 TP！）**; longitudinal cognitive/clinical 年度
- 后续 wave 扩展但不在 2017 数字内

**模态**: 全部 **3T** (MGH Martinos 两台 Siemens Tim Trio, 12-ch coil — 极少异质性); T1 (3D MPRAGE)/T2 FLAIR/task fMRI/rsfMRI/DTI/SWI/pulsed ASL; **PiB amyloid (dynamic 0-60min) + FDG + tau Flortaucipir** (Siemens HR+ scanner)

**配对**: 部分 LP→CSF Aβ42/tau/p-tau; 完整 neuropsych battery (**PACC composite** — Sperling 设计); APOE; **纵向认知斜率 → MCI 转化**

**Access**: 在线 data request → DUA → 委员会审批，**~2 周**; 免费

**License**: HABS DUA

**Caveats**: **仅 CN cohort，没 baseline AD**; 影像 TP 数少（设计如此）；单 site → 同质性高但代表性受限

**已用**: A+/A- 预临床 AD 模型; PACC 斜率预测; tau spreading models (Vogel et al.); amyloid PET 标杆

---

### 7.7 NIFD / 4RTNI (Frontotemporal Lobar Degeneration Neuroimaging)

**基本信息**
- 主导: PI Adam Boxer (UCSF), NIA + NINDS AG032306
- 入口: [LONI NIFD project](https://ida.loni.usc.edu/home/projectPage.jsp?project=NIFD) + [4RTNI-2 UCSF](https://memory.ucsf.edu/research-trials/research/4rtni-2)
- 无单一 dataset paper（散见 method/clinical papers）

**规模**
- NIFD/FTLDNI 计划: 120 FTLD + 120 ctrl
- 聚合公开样本: **160 participants** — 15 ctrl / 22 bvFTD / 14 nfvPPA / 21 svPPA / 43 CBS / 45 PSP
- FTLDNI 子集: **136 patients** (70 bvFTD / 36 svPPA / 30 nfvPPA)
- 4RTNI: 106 (47 Richardson / 51 CBS / 8 nfvPPA); 另一 PSP 子集 59 PSP + 117 HC
- 时间点: **baseline + 6 个月 + 12 个月** MRI（短随访）; 4RTNI-2 cycle 2 延长

**模态**: 3T 多 vendor; T1 MPRAGE/T2/FLAIR/DTI/rsfMRI; FDG/tau PET 子集

**配对**: 完整 FTD neuropsych (CDR-FTLD/语言/社会认知); CSF Aβ/tau/NfL 子集; MAPT/GRN/C9orf72 检测; PSPRS/CBS-NSI clinical rating

**Access**: LONI IDA + DUA, 1-4 周; 免费

**Caveats**: 比 ADNI 小 10×，但是 **FTD/PSP/CBS 最大的公开纵向影像集**; 短随访（12 月）不适合长期建模; 诊断标签随时间可能更新（CBS↔PSP 重叠）

---

### 7.8 MIRIAD ⭐ 唯一 CC BY 开放 + 每人 12 TP

**基本信息**
- 主导: UCL Dementia Research Centre
- Descriptor: Malone IB et al., *NeuroImage* 70:33-36 (2013), DOI 10.1016/j.neuroimage.2012.12.044, [PMC3809512](https://pmc.ncbi.nlm.nih.gov/articles/PMC3809512/)
- 下载: [miriad.drc.ion.ucl.ac.uk](http://miriad.drc.ion.ucl.ac.uk/)

**规模**
- 入组: **46 mild-mod AD + 23 controls = 69 total**
- 总 scan: **708 volumetric T1**
- 每人 scan: **up to 12 scans** (多数 ≥6 TP)
- ≥2 TP: 69 (全部); ≥3 TP: 69; ≥5 TP: 绝大多数
- 25 个不同 interscan interval

**时间结构**: baseline → **2, 6, 14, 26, 38, 52 周 + 18, 24 月**; 加 baseline + 2 周 + 6 周 "back-to-back" 重复扫描（test-retest 信号纯度极高）

**模态**: **1.5T GE Signa 单 scanner 单 radiographer**（几乎零异质性，MIRIAD 核心优势）; **T1 only** (IR-FSPGR)；没 T2/FLAIR/DTI

**配对**: demographics + age + sex + MMSE; **没** CSF / 血浆 / 基因 / PET / outcome labels（纯结构影像数据集）

**Access**: **公开下载注册即可**; 免费; **License: CC BY 3.0 → 可自由 redistribute models** （9 个里最开放）

**Caveats**: 1.5T 单 scanner 20+ 年前数据，现代 DL 模型 transfer 受限; **N 极小 (69)** 不适合 train，**适合 algorithm benchmark / test-retest / 多次扫描方差研究**; 仅 T1

**已用**: Atrophy measurement reproducibility 标杆; BSI (Boundary Shift Integral) 标定; Test-retest 噪声 floor 研究

---

### 7.9 OpenBHB (Open Big Healthy Brains) ⚠️ 不是纵向

**基本信息**
- 主导: BaobabLab (CEA / NeuroSpin)
- Descriptor: Dufumier B et al., *NeuroImage* 263:119637 (2022), DOI 10.1016/j.neuroimage.2022.119637, [PubMed 36122684](https://pubmed.ncbi.nlm.nih.gov/36122684/)
- 门户: [baobablab.github.io/bhb](https://baobablab.github.io/bhb/) / IEEE DataPort

**规模**
- **>5,000 T1 scans / >60 centers / 10 datasets** (IXI/ABIDE 1&2/CoRR/GSP/Localizer/MPI-Leipzig/NAR/NPC/RBP)
- 全部 healthy controls; 年龄 6-88
- **主要 cross-sectional**; CoRR 有 test-retest，但大部分 single-TP
- ≥2/≥3/≥5 TP: 极少（不是设计目标）

**模态**: T1 only; 1.5T + 3T; 93 centers; 预处理已完成 **VBM (CAT12) + Quasi-Raw + SBM (FreeSurfer)** + QC 已过

**配对**: age + sex + site 标签; 没临床/CSF/基因; **age 作预测目标 + site 作对抗 debias 目标**

**Access**: IEEE DataPort 公开下载（需 IEEE 账号）; 免费; **只发布衍生特征 (VBM/SBM/Quasi-Raw)**，不发布原始 DICOM

**Caveats**: **不是纵向**——不适合 trajectory 建模; 全 healthy 无法直接训 AD/PD 分类器，但是 **brain age FM pretrain 圣杯**; 多 source license heterogeneity

**已用**: Brain age + site-removal benchmark (RAMP challenge); 自监督预训练 (yAware contrastive); site-effect debiasing methodology

---

### Part 7 汇总 Table

| Dataset | Total N | N w/MRI | MRI TP/person | 跨度 | 疾病 | Field | PET | Access | License | 纵向深度 |
|---|---|---|---|---|---|---|---|---|---|---|
| **AIBL** | 3,045 (2023) | ~600+ | 平均 4-6 (每 18 月) | 19 yr | AD/MCI/HC | 1.5+3T | PiB+Florb+Flut | LONI 1-4w | LONI DUA | ★★★★ |
| **PPMI** | 4,000+ (2.0) | 大部分 | baseline+12/24/36+ | 14 yr | PD+prodromal | 3T | DAT-SPECT 全员 | DUA 1-2w | PPMI DUA | ★★★★ |
| **NACC/SCAN** | 54,000+ | **15,000+** | **1-14 exams** | 25+ yr | AD/MCI/HC+ADRD | 1.5+3T | amyloid+tau+FDG | 临床即时 / 影像 2-6w | **free** | ★★★★★ |
| **GENFI** | 710 (2024) | 几乎全 | 年度 ~5-7 TP | 13 yr | Genetic FTD | 3T | 子集 | 项目 1-3mo | GENFI DSA | ★★★★ |
| **DIAN** | 664 (314 active) | ~533+ | 年度/双年 | 17 yr | ADAD | 3T | PiB+FDG+tau | 项目 2-3mo | DIAN DSA | ★★★★★ |
| **HABS** | 284 | 284 | **2 (baseline+36mo MRI only)** | 16 yr | Preclinical AD CN | 3T 单 site | PiB+FDG+tau | DUA ~2w | HABS DUA | ★★ |
| **NIFD/4RTNI** | ~160-240 | 全员 | baseline+6+12mo | 短 1-2 yr | FTD/PSP/CBS | 3T 多 vendor | FDG/tau 子集 | LONI 1-4w | LONI DUA | ★★ |
| **MIRIAD** ⭐ | 69 | 69 | **up to 12, 含 2/6 周间隔** | 2 yr | AD+HC | 1.5T 单 scanner | 无 | **公开** | **CC BY 3.0** | ★★★★★ (每人 TP 最多) |
| **OpenBHB** ⚠️ | 5,000+ | 5,000+ | **主要 cross-sectional** | n/a | Healthy only | 1.5+3T | 无 | IEEE DataPort 公开 | 衍生特征 open | ★ (不纵向) |

### Part 7 关键 takeaway

1. **NACC/SCAN 是规模最大可访问 cohort** (15K+ MRI) 但异质性最重，免费
2. **DIAN 是 ADAD 数据"金标准"**：mutation × pre-sym × 17 yr 三重独家组合
3. **GENFI 是 FTD 版的 DIAN**（mutation carriers，pre-symptomatic 信号）
4. **MIRIAD 是唯一 CC BY 3.0 完全公开 + 每人 12 TP** → benchmark / test-retest 圣杯
5. **OpenBHB 不纵向**，但是 brain age FM **预训练**圣杯
6. **HABS/4RTNI/NIFD 的"≥2 TP MRI"数字其实小**——设计就只 2-3 个影像 TP
7. **AIBL + PPMI 是 ADNI 最佳伴侣**（同样长随访、相似申请门槛）
8. **"≥5 TP 病人数"精确直方图大部分数据集未公开**——需账号登录 LONI/NACC dashboard 才能查

---

## Part 8: Lifespan / Development / 健康老化 brain MRI 纵向（9 个，非 AD/dementia）

> 与 Part 7 (AD/dementia cohorts) use case 完全不同：normative 轨迹、个体偏差检测、brain age 模型预训练根基。

### 8.1 ABCD Study ⭐⭐⭐⭐⭐ 体量最大

**基本信息**
- 主导: US NIH (NIDA/NIMH/NIAAA/NICHD) 21 站点联合
- Casey BJ et al., *Dev Cogn Neurosci* 32:43-54 (2018), DOI 10.1016/j.dcn.2018.03.001
- 官网: [abcdstudy.org](https://abcdstudy.org) / 数据 [nda.nih.gov/abcd](https://nda.nih.gov/abcd) / [nbdc-datahub.org](https://nbdc-datahub.org)

**规模**
- 入组: **11,880** (9-10 yo baseline) × 21 sites
- Release 6.0 (2025): **11,868** 跨 13 events
- MRI 时间表: baseline / Y2 / Y4 / Y6 / Y8 / Y10（每 2 年）
- **≥2 MRI TP: ~8,000-9,500**（baseline + 2-yr 完成率 ~80%）
- **≥3 MRI TP: ~5,000-7,000**（4-year follow-up 入库）
- 6-year ~75% 受试者完成

**模态**: **3T multi-vendor** (Siemens Prisma / GE 750/750w / Philips Achieva/Ingenia); 3D T1 MPRAGE + 3D T2 SPACE + HARDI dMRI (96 dir, b=500/1000/2000/3000) + 4× rfMRI multiband + 3 tfMRI (MID/SST/N-back); **无 ASL / 无 FLAIR**

**配对**: NIH Toolbox/CANTAB/RAVLT/WISC-V; KSADS-COMP/CBCL; 手机使用 + 社交媒体 + 屏幕 + 睡眠 + 物质使用; **唾液 DNA + WGS subset**; 邻里贫困 + 空气污染 linkage

**Access**: NDA 账户 + DUC (机构签字) → **2-4 周**; 免费; BIDS + minimal-preproc + FreeSurfer derivatives + tabulated CSV

**Caveats**: 多 site/vendor → site/scanner harmonization 关键 (ComBat/CovBat); GE timing offset ~9% (6.0 修复); 青春期 head motion 加剧

**已用**: Owens 2021 PLoS ONE (effect sizes); **Marek 2022 Nature** (reproducible brain-wide associations need thousands); Bethlehem 2022 *Nature* (brain charts — ABCD 核心训练源); Rapuano 2020 PNAS

---

### 8.2 HCP-Aging / AABC

**基本信息**
- Bookheimer SY et al., *NeuroImage* 185:335-348 (2019); Harms MP et al., *NeuroImage* 183:972-984 (2018)
- 官网: [humanconnectome.org/study/hcp-lifespan-aging](https://www.humanconnectome.org/study/hcp-lifespan-aging)

**规模**
- 入组: **1,200+** 健康成人 36-100+ (HCP-A 原始); AABC 扩展 1,500+
- **AABC Release 2: 1,396 受试者 / 2,878 imaging sessions**
- **V1: 1,396 / V2: 915 / V3: 471 / V4: 96**
- **≥2 visits: 915；≥3 visits: 471；≥4 visits: 96**
- 间隔 ~2-3 yr

**模态**: **3T Siemens Prisma** (4 sites 统一); T1 MPRAGE + T2 SPACE + 高分辨率 hippocampal T2 + HARDI dMRI (b=1500/3000, 92 dir) + 4× rfMRI (multiband 8) + ASL (pCASL) + 部分 7T MRS

**配对**: NIH Toolbox 完整成人电池 + Rey AVLT/Trails/processing speed; NEO-FFI + 抑郁焦虑量表; 血压/握力/血样; **血液 DNA + APOE 基因型**

**Access**: NDA + DUC + HCP open data terms → 自助下载，免费; BIDS-like + HCP minimal pipeline + CIFTI surface

**Caveats**: 健康人口（排除重度精神/神经病史→"supernormal"偏差）; 老人 motion 大; 仅 Siemens Prisma vendor 多样性=0

---

### 8.3 HCP-Development

**基本信息**
- Somerville LH et al., *NeuroImage* 183:456-468 (2018), DOI 10.1016/j.neuroimage.2018.08.050
- 官网: [humanconnectome.org/study/hcp-lifespan-development](https://www.humanconnectome.org/study/hcp-lifespan-development)

**规模**
- 入组: **1,300+** healthy 5-21 yo
- Lifespan 2.0 release: ~1,305 V1
- **多 TP**: 5-13 段三波 (baseline + 18mo + 36mo)，14-21 段一次性
- **当前 release ≥2 visits: ~300-400 受试者**（纵向 wave 仍累积，Lifespan 3.0 才补齐 COVID 影响）

**模态**: **3T Siemens Prisma**; T1/T2 0.8mm iso + HARDI dMRI + rfMRI 4×7min + ASL + tfMRI (emotion/guessing/CARIT)

**配对**: 青春期评定 (PDS/Tanner) + 唾液激素 + NIH Toolbox + Wechsler 缩减 + CBCL; 部分血样 DNA

**Caveats**: 健康青少年；COVID 中断纵向收集；vendor 多样性=0

---

### 8.4 dHCP (developing Human Connectome Project) — 婴儿/胎儿

**基本信息**
- Edwards AD et al., *Front Neurosci* 16:886772 (2022), DOI 10.3389/fnins.2022.886772
- Karolis et al., *Imaging Neuroscience* (2024) — fetal release
- 官网: [developingconnectome.org](http://www.developingconnectome.org/)

**规模**
- Neonatal: **783 婴儿 / 887 datasets** (583 健康足月儿 + 早产/高危)
- **≥2 sessions: ~100+ 婴儿**（887-783=104 重复，早产 → term-equivalent 二次扫描）
- ≥3 sessions: 个位数
- Fetal release 2024: **275 fetal scans / 255 fetuses** (PMA 20-38 周)

**模态**: **3T Philips Achieva** (neonatal-adapted RF coil); T1 (FSE+MPRAGE)/T2/rfMRI (818 sessions QC pass)/dMRI (758 multi-shell HARDI b=400/1000/2600); 胎儿专用 SS-FSE T2 + fetal rs-fMRI

**配对**: 出生信息 + PMA + Bayley-III 神经发育评估（部分 2yr 随访）; 早产临床参数

**Access**: 注册 + DUA → NDA portal 迁移中; 免费; BIDS + dHCP preprocessed pipelines

**Caveats**: 婴儿头围/对比与成人极不同；**T1/T2 对比反转**（婴儿 myelination 中）；fetal motion 极高；缺乏 GA-matched 大型 control

**已用**: Fenchel et al. *Cereb Cortex* 2020 microstructural cortical profiles; Williams LZJ *Nat Comms* spatial transcriptomic alignment

---

### 8.5 HBCD (HEALthy Brain & Child Development)

**基本信息**
- 主导: NIH HEAL Initiative + 多 institute 资助
- Volkow ND et al., *Dev Cogn Neurosci* (2024); Dean DC 3rd et al., DOI 10.1016/j.dcn.2024.101452 (PMID 39341120)
- 官网: [hbcdstudy.org](https://hbcdstudy.org) / 数据 [nbdc-datahub.org](https://nbdc-datahub.org)

**规模**
- 入组目标: **~7,500 母婴 dyads** × 27 站点
- 已入组: **>5,000 家庭** (2025 Q1)
- HBCD 2.0 release: **>3,500 受试者** baseline + 部分纵向
- 设计 4 MRI 访问: V2 (0-1mo) / V3 (3-9mo) / V4 (9-15mo) / V6 (18-24mo)
- 当前 2.0: V2+V3+V4 部分; ≥2 MRI hundreds 量级 (快速增长中)
- 完整 4-tp 子集 2026+ 才齐

**模态**: **3T harmonized** (Siemens + GE + Philips); T1 MPRAGE/MP2RAGE (婴儿适配) + T2 + dMRI + rs-fMRI (2×7.5min) + MRS (bilateral thalamus); **FIRMM real-time motion monitoring**

**配对**: **产前物质暴露**（opioids/cannabis/alcohol/tobacco）; 母婴 dyad 评估 + HOME + Bayley + ASQ + MacArthur CDI; 母婴血/唾液/毛发/胎盘/毛细血/母乳/尿生物样本; EEG (多 site) + 眼动; 社会决定因素

**Access**: NBDC DataHub 注册 + DUC; 免费; BIDS + Loris-based curation; Annual releases 2025 起

**Caveats**: 婴儿期 MRI 醒着扫，部分时点 dropout 高; 数据非常新 (2025 才公开)，生态系统刚起步; 婴儿头部模板缺乏

---

### 8.6 IBIS (Infant Brain Imaging Study) — Autism Risk

**基本信息**
- Hazlett HC et al., *Nature* 542:348-351 (2017), DOI 10.1038/nature21369
- 主导: NIH ACE 5 站点 (UNC, WashU, Penn, UMN, UW Seattle)
- 官网: [ibis-network.com](https://ibis-network.com/)

**规模**
- 入组: **>400** baseline (HR-ASD 兄姊 vs LR control)
- 累计 IBIS-1/EP/2/DS/Infant: **~700-800 受试者**
- **设计核心: 6mo + 12mo + 24mo 三时点**
- 完成全部三时点: **~300-400 婴儿**（Hazlett 2017 N=148 HR + ctrl 全部 3-TP）
- + school-age (7-14) 复扫子集: **~200+**（IBIS-EP）
- **≥2 TP: ~500; ≥3 TP: ~300-400; ≥4 TP: ~200**

**模态**: **3T Siemens Tim Trio / Prisma** (站点统一); T1 MPRAGE + T2 turbo SE + dMRI (25-65 dir) + rfMRI subset; 婴儿期自然睡眠扫描

**配对**: ADOS/Mullen/Vineland/AOSI; repetitive behavior/social attention/eye tracking; EEG 部分; DNA + proband 家族遗传

**Access**: **NDA Collection** + DUC; 免费

**已用**: **Hazlett 2017 Nature**（婴儿 surface area 扩张预测 ASD 诊断）; **Emerson 2017 Sci Transl Med**（6mo 功能连接组预测 ASD）

---

### 8.7 Cam-CAN (Cambridge Centre for Ageing & Neuroscience)

**基本信息**
- Shafto MA et al., *BMC Neurology* 14:204 (2014), DOI 10.1186/s12883-014-0204-1
- Taylor JR et al. data repository, *NeuroImage* 144:262-269 (2017)
- **Phase 5 Rescan 2025 protocol**: medRxiv 2025.05.06.25327023
- 官网: [cam-can.mrc-cbu.cam.ac.uk](https://cam-can.mrc-cbu.cam.ac.uk) / 数据 [opendata.mrc-cbu.cam.ac.uk](https://opendata.mrc-cbu.cam.ac.uk/projects/camcan/)

**规模**
- Stage 1: ~2,700 家访 cognitive baseline
- **Stage 2 (CC700): ~700** 参与者 (每 10 年 100 人，18-87 yo)，MRI + MEG + cognitive
- **Stage 3 (CC280): ~280** 子集，3 sessions 额外 fMRI (2012-14)
- **Phase 4 (Enrichment) + Phase 5 (Rescan, 2025 protocol)**: Stage 2 邀请回扫，**~12 年间隔**
- 至 Stage 3: **~280 ≥2 MRI sessions**
- Phase 5 完成 ~300-400 ≥2 structural MRI (12 yr 间隔，纵向 brain ageing 难得！)
- ≥3 TP: 仅 CC280 子集 ~3 sessions

**模态**: **3T Siemens Tim Trio** (固定 scanner 跨 phase); T1 MPRAGE/T2 SPACE/FLAIR (subset)/dMRI 30 dir b=1000+2000/rfMRI/task fMRI; **MEG (Elekta Neuromag VectorView 306 ch) 配对**

**配对**: 完整 cognitive battery (Cattell fluid intelligence / Wechsler logical memory / Hayling / Stroop / processing speed); 听力/视力/握力/生理; 部分基因型

**Access**: 注册申请表 → 学术 review ~2 周; 免费; NIFTI + BIDS-organized + 原始 MEG fif

**Caveats**: 单站点 Cambridge，**caucasian-heavy**; 只 Siemens Trio; Phase 5 数据 release timeline 未定

**已用**: **Cole JH 2017/2018 brain age prediction**（Cam-CAN 核心训练）; Bethlehem 2022 lifespan charts; Tsvetanov functional connectivity ageing

---

### 8.8 Rotterdam Scan Study

**基本信息**
- Ikram MA et al., *Eur J Epidemiol* 30:1299-1315 (2015), DOI 10.1007/s10654-015-0105-7
- Ikram et al., *Eur J Epidemiol* 32:807-850 (2017) 2018 update
- 官网: [ergo-onderzoek.nl/wp/rotterdam-scan-study](https://www.ergo-onderzoek.nl/wp/rotterdam-scan-study/)

**规模**
- Rotterdam Study 母 cohort: **14,926** 总入组
- MRI 子项目: **>5,800 人接受过脑 MRI / ~12,174 MRI scans** (2015)
- 2024 更新整体 **>10,000 scans / >5,286 people 45+**
- **≥2 MRI: ~3,500-4,000**（每 3-4 年随访，2005 起）
- **≥3 MRI: ~1,500-2,000**
- ≥4 MRI: 数百

**时间结构**: 2005 起 MRI 嵌入核心 Rotterdam Study 访问，**~3-4 年间隔**

**模态**: **1.5T GE Signa Excite** (2005 安装，刻意不大改 → 跨年纵向可比性！); T1 3D (FFE-fast SPGR) + Proton-density + FLAIR + 3D T2*-GRE (微出血) + DTI 25 dir + 2D phase contrast + rs-fMRI (2011+)

**配对**: 心血管 risk (BP/ABI/carotid US/ECG/cIMT); 认知 (MMSE/Letter-Digit/Stroop/Word Learning/verbal fluency); **dementia incidence follow-up (neurologist adjudicated) + stroke + PD**; blood DNA (GWAS + WGS subset) + APOE + metabolomics; 视网膜 imaging + 骨密度 + 肺功能

**Access**: **Bilateral collaboration only**（非 NDA self-serve）— 通过 Rotterdam Study Management Team 提交研究计划 + DTA → board review; 通常 collaboration / co-authorship 安排，**不收 fee 但需协作**

**Caveats**: Access 比 ABCD/HCP/Cam-CAN 严格得多; 1.5T 分辨率低于 3T cohort; 单中心荷兰白人为主; Microbleed/WMH 病变 phenotype 丰富 → 与"健康"边界模糊

**已用**: **Vernooij MW et al. silent infarcts NEJM 2007**; Vinke EJ et al. trajectories of imaging markers *Neurobiol Aging* 2018; Ikram MK genome-wide hippocampal volume *Nat Genetics*

---

### 8.9 Generation R Study

**基本信息**
- Kooijman MN et al., *Eur J Epidemiol* 31:1243-1264 (2016) cohort update
- White T et al., *Eur J Epidemiol* 33:99-125 (2018) — second wave neuroimaging
- 官网: [generationr.nl](https://generationr.nl)

**规模**
- 母 cohort: **9,778 母亲 / ~9,749 出生 offspring**
- **MRI Wave 1 (2009-2012): 1,070 个** 6-9 岁孩子
- **MRI Wave 2 (2013-2015): 4,087 个** 9-11 岁孩子 (4,245 来访)
- **MRI Wave 3 (~age 13-14)**: 估 3,000+ (invitation list 7,968)
- **≥2 MRI (wave1∩wave2)**: T1 **640 / DTI 600 / rs-fMRI 525**
- ≥3 MRI (w1+w2+w3): 数百量级，仍累积

**时间结构**: Wave 1: 6-9 → Wave 2: 9-11 → Wave 3: 13-14 → 后续 → young adulthood

**模态**: **3T GE Discovery MR750** (统一单 scanner，**无 vendor 多样性**); T1 (3D IR-FSPGR) + DTI 35 dir b=900 + rs-fMRI + 部分 task fMRI + ASL (部分 wave 2/3)

**配对**: 母亲孕期 (吸烟/酒/毒/营养/心理); 出生 (体重/孕周/并发症); 儿童 (CBCL/IQ/ADHD scales/Bayley); 脐带血 + 母婴 DNA (GWAS array) + blood/urine/buccal; 家庭 SES + 住房 + **空气污染 linkage**

**Access**: **Generation R Management Team review + MoU**（类似 Rotterdam Study collaboration model，非 NDA self-serve）; 无 fee 需合作; DICOM/NIFTI + derived

**Caveats**: Access 严格非 self-serve; 单中心 Rotterdam，多民族但荷兰主导; 单 vendor; 儿童 motion 大 → wave 1/2 QC pass rate ~80%

---

### Part 8 汇总 Table

| 数据集 | 年龄 | 入组总 | MRI 受 | **≥2 TP** | **≥3 TP** | TP median (max) | 间隔 | Vendor |
|---|---|---|---|---|---|---|---|---|
| **ABCD** ⭐⭐⭐⭐⭐ | 9-20+ | 11,880 | ~11,500 | **~8-9.5k** | **~5-7k** | 2-3 (4) | 2 yr | 多 (Siemens/GE/Philips 3T) |
| **HCP-A/AABC** | 36-100+ | 1,500+ | 1,396 | **915** | **471** | 2 (4) | 2-3 yr | 单 (Siemens Prisma 3T) |
| **HCP-D** | 5-21 | 1,300+ | ~1,305 | **~300-400** | 少量 pilot | 1-2 (3) | 1.5 yr | 单 |
| **dHCP** neonatal | 出生 | 783 | 783 | **~100+** | <10 | 1 (3) | 数周 | 单 (Philips 3T) |
| **dHCP** fetal | PMA 20-38wk | 255 | 255 | ~20 | 0 | 1 (2) | 数周 | 单 |
| **HBCD** | prenatal-2y | >5,000 | >3,500 (rel 2.0) | hundreds (growing) | 进行中 | 4 planned (4) | 多间隔 | 多 |
| **IBIS** | 6mo-14y | 700-800 | 700-800 | **~500** | **~300-400** | 3 (4) | 6/12/24mo + school | 单 (Siemens 3T) |
| **Cam-CAN** | 18-88 | ~2,700 | ~700 (Stage 2) | **~280-400 (Phase 5)** | **~280 (CC280)** | 1-2 (3); Phase 5 +12yr | 1-3 yr + 12 yr | 单 (Siemens Trio 3T) |
| **Rotterdam Scan** | 45+ | 14,926 | **>5,800** | **~3.5-4k** | **~1.5-2k** | 2 (4+) | 3-4 yr | 单 (GE 1.5T) |
| **Generation R** | 6-14+ | 9,778 | w1 1,070 / w2 4,087 | **640 T1 / 600 DTI / 525 rsfMRI** | hundreds | 1-2 (3+) | ~2 yr | 单 (GE 3T) |

### Part 8 选型建议（与 AD cohort 完全不同 use case）

| 应用 | 最适合 | 原因 |
|---|---|---|
| **婴儿大脑生长 normative** | dHCP + IBIS + HBCD | 0-2 yo 全套，dHCP gold standard preterm |
| **儿童/青春期纵向轨迹** | **ABCD ≫ Generation R + HCP-D** | ABCD 体量碾压，2-4 TP 已就位 |
| **健康老化跨年纵向** | **Rotterdam + Cam-CAN Phase 5 + HCP-A/AABC** | Rotterdam 唯一 ≥3 TP × thousands；Cam-CAN Phase 5 = 12 yr 超长间隔 |
| **跨 vendor / site harmonization 研究** | ABCD, HBCD | 唯二 multi-vendor 3T 且有 harmonization |
| **brain age / lifespan normative model 训练** | 全部联合 (ABCD + HCP-D/A + Cam-CAN + Rotterdam) → Bethlehem 2022 *Nature* lifespan charts |
| **早期 autism 检测** | IBIS（唯一）|
| **fetal/preterm 微结构** | dHCP（唯一 sizeable）|
| **预训练 + downstream AD 迁移** | ABCD + HCP-A + Cam-CAN + Rotterdam (健康 corpus 上限 ~15,000+ longi MRI sessions) |

### Part 8 Key Caveats

- **Access tier 巨大差异**:
  - **Self-serve via NDA**: ABCD / HCP-A/D / HBCD / IBIS（申请 2-4 周）
  - **Bilateral collaboration only**: Rotterdam / Generation R（PI 同意 + 时常 co-authorship；非 NDA）
  - **专用 portal + DUA**: dHCP / Cam-CAN
- **Vendor 多样性**: 只有 **ABCD + HBCD**；其余基本单 vendor
- **真正能跑 ≥3 TP × ≥1000 人健康 cohort 只有 ABCD（青少年）+ Rotterdam Scan（中老年）+ HBCD（出生-2y, 2026+ 满载）**——normative longitudinal trajectory 的金字塔顶
- **Cam-CAN Phase 5 / HCP-AABC** 提供 **12+ yr 间隔**健康 ageing rescan，远比 ADNI 5-6 yr 长
- **dHCP + HBCD 新**，分割/atlases 工具链不成熟，**婴儿头模板**是瓶颈

---

## 全部 Parts 完成（1-8 + adni-oasis）

至此 datasets-deep.md 包含：
- **Part 1** 肺筛 CT (6 datasets)
- **Part 2** 肿瘤 serial CT (12)
- **Part 3** 多模态/通用 CT corpora (9)
- **Part 4** UK Biobank + 体部 MRI / multimodal (10)
- **Part 5** 2D 纵向 CXR/OCT/Mammo/US/Path (20+)
- **Part 6** ADNI/OASIS/TADPOLE 指针 → [datasets-adni-oasis.md](datasets-adni-oasis.md)
- **Part 7** AD/dementia brain MRI 非 ADNI (9: AIBL/PPMI/NACC/GENFI/DIAN/HABS/4RTNI/MIRIAD/OpenBHB)
- **Part 8** Lifespan/dev/healthy brain MRI (9: ABCD/HCP-A/HCP-D/dHCP/HBCD/IBIS/Cam-CAN/Rotterdam/Gen R)

**总计 ~85 个数据集深度调研完毕**。
