# 其他 brain MRI 纵向数据集（ADNI/OASIS 之外）

> 调研日期 2026-05-13。ADNI/OASIS/TADPOLE 详见 [datasets-adni-oasis.md](datasets-adni-oasis.md)。
> 状态：Part 7A (AD cohorts) 完成；Part 7B (非 AD: PPMI/ABCD/HCP/dHCP/HBCD/Cam-CAN/Rotterdam/OpenBHB) 待。

---

## Part 7A: AD/FTD 相关 cohorts

### AIBL (Australian Imaging Biomarker & Lifestyle)
- **病人数**: 1,112 (Ellis 2009; 211 AD / 133 MCI / 768 HC)
- **≥2 MRI TP**: ~600（~70% MRI subset 完成 18-mo 随访；Fowler 2021 报告 ~900 MRI subset 中 60%+ 有 longi）
- **≥3 MRI TP**: ~350（18/36/54/72 mo 后续 wave）
- **时间结构**: baseline + 18-mo intervals × ≥6 waves (>10 yr 跟踪)
- **模态**: 3T (主) + 1.5T；T1-MPRAGE + T2 FSE + FLAIR；PET subset ~287 baseline (¹¹C-PiB)；后期 NAV4694/florbetaben
- **配对**: CSF (小子集), APOE/全基因组, 完整 neuropsych, 血液 biomarker (Simoa)
- **Access**: LONI/IDA（与 ADNI 同平台），DUA ~2-4 周，免费学术
- **License**: AIBL DUA（学术、non-commercial，禁 redistribution）
- **引用**:
  - Ellis 2009 *Int Psychogeriatr* doi:10.1017/S1041610209009405
  - Ellis 2014 (18-mo follow-up) doi:10.1017/S1041610213001774
  - https://adni.loni.usc.edu/ (AIBL data access)
- **Caveats**: MRI 仅 ~1/4 sub-cohort；纵向 MRI 数文献不一致，需自行从 LONI 导出统计

---

### NACC-SCAN (含 UDS-linked MRI)
- **病人数**: UDS 平台 >54,000 注册；其中 ~15,000+ 有 MRI/PET
- **≥2 MRI TP**: ~5,000-7,000（SCAN 自 2020 启动 QC-passed subset 偏少；UDS-linked legacy MRI 较多。1-14 exams/participant）
- **≥3 MRI TP**: ~2,000-3,000（需在 cohort 选择工具中导出 per-ADRC）
- **时间结构**: UDS 每年 1 次临床；MRI 取决于各 ADRC，多数 1-2 yr 间隔
- **模态**: 3T 主，T1-MPRAGE + FLAIR (必需)，DWI/rs-fMRI/ASL 可选；SCAN PET (amyloid + tau + FDG)
- **配对**: UDS 神经心理 + 临床 dx、NP autopsy (~6,000)，部分 CSF/血液 biomarker、APOE
- **Access**: 免费，DUA 走 naccdata.org/SCAN，通常 ~3 business days 审批
- **License**: NACC DUA（致谢 NIA P30 ADRC）
- **引用**:
  - Beekly 2007 *Alz Dis Assoc Disord* doi:10.1097/WAD.0b013e318142774e
  - Besser 2018 (UDS v3) doi:10.1097/WAD.0000000000000279
  - https://scan.naccdata.org/
- **Caveats**: SCAN 仅 2020+ standardized prospective；legacy NACC MRI 厂家/协议异构

---

### DIAN (Observational)
- **病人数**: 总入组 664；现役 314 (Bateman 2025, *npj Dementia*)
- **≥2 MRI TP**: ~430（15 yr 纵向，>65% 现役/退出参与者已 ≥2 scans）
- **≥3 MRI TP**: ~280（McKay 2022 报告中位 follow-up 3.4 yr）
- **时间结构**: baseline + 年度（无症状者每 3 yr imaging，症状者每年）；总跟踪 >15 yr
- **模态**: 3T，T1-MPRAGE + T2 + FLAIR + DWI + rs-fMRI + ASL；PET: PiB amyloid + AV1451 tau + FDG（绝大部分 imaging 参与者 ≥1 PET）
- **配对**: CSF (Aβ42/40, tau, p-tau, NfL), 突变 (PSEN1/PSEN2/APP), 详细 neuropsych, 血液 biomarker
- **Access**: dian.wustl.edu/for-investigators，需 concept proposal + steering committee review，~2-3 个月
- **License**: DIAN DUA（学术，需 co-author 或 acknowledgment）
- **引用**:
  - Bateman 2025 (15-yr DIAN) doi:10.1038/s44400-025-00047-7
  - McKay 2023 doi:10.1101/2022.03.25.485799
  - Morris 2012 *Clin Investig* doi:10.4155/cli.12.93
- **Caveats**: 常染色体显性 AD 罕见；cohort 偏年轻 (18-55 yr)；推广性有限；申请门槛高

---

### HABS (Harvard Aging Brain Study)
- **病人数**: 284 (Dagley 2017 公开版)；项目 ~290-300 clinically normal older adults
- **≥2 MRI TP**: ~240（绝大部分完成 ≥2 年度访视）
- **≥3 MRI TP**: ~180（HAB_3.0/4.0 wave 覆盖 60%+ 入组者）
- **时间结构**: baseline + 年度 clinical/cognitive；MRI/PET 重复 36 mo (HAB_4.0)，部分继续到 60/72/84 mo
- **模态**: 3T Siemens Tim Trio，T1-MEMPRAGE + T2 + FLAIR + DWI + rs-fMRI + ASL；PET: PiB (amyloid) + FTP (tau, 后期)
- **配对**: 完整 neuropsych, APOE, 血液 (NfL/p-tau217 后期), 部分 CSF
- **Access**: habs.mgh.harvard.edu/researchers/request-data，~2-4 周
- **License**: HABS DUA（non-commercial, no re-distribution, acknowledgment required）
- **引用**:
  - Dagley 2017 *NeuroImage* doi:10.1016/j.neuroimage.2015.03.069
  - Sperling 2014 (preclinical AD framework)
  - https://habs.mgh.harvard.edu/
- **Caveats**: cohort 偏 cognitively normal（不含 AD dementia）；适合 preclinical research

---

### 4RTNI / NIFD (FTLDNI)
- **病人数**: NIFD ~340 (bvFTD/svPPA/nfvPPA + controls)；4RTNI/4RTNI-2 ~150-200 (PSP, CBD, so/vPSP + HC)
- **≥2 MRI TP**: NIFD ~200；4RTNI ~120
- **≥3 MRI TP**: NIFD ~130（4 个 TP 协议）；4RTNI ~80
- **时间结构**: NIFD 0/6/12/18 mo (4 TP)；4RTNI PSP+CBD 0/6/12 mo (3 TP)；so/vPSP+HC 0/6/12/24 mo (4 TP)
- **模态**: 3T，T1-MPRAGE + T2 + FLAIR + DWI + rs-fMRI；4RTNI-2 加 amyloid + tau (AV1451 / PI2620) PET subset；CSF
- **配对**: CSF (NfL), 全血/DNA (C9orf72/GRN/MAPT 筛查), 完整 FTD-specific neuropsych
- **Access**: LONI IDA，~1-2 周，免费学术
- **License**: FTLDNI/4RTNI DUA via LONI（与 ADNI 类似）
- **引用**:
  - Boxer 2014 (4RTNI design) doi:10.1016/j.jalz.2013.10.005
  - Whitwell 2019 *NeuroImage Clin* doi:10.1016/j.nicl.2019.102032
- **Caveats**: cohort 比 ADNI 小一个量级；NIFD bvFTD subgroup 有 n<50/group

---

### MIRIAD
- **病人数**: 69 (46 mild-moderate AD + 23 controls)
- **≥2 MRI TP**: 69 (全部，总 708 scans)
- **≥3 MRI TP**: ~67 (设计为每人最多 9 个 TP)
- **时间结构**: baseline + 2 wk, 6 wk, 14 wk, 26 wk, 38 wk, 52 wk, 18 mo, 24 mo（最多 9 TP/subject）
- **模态**: **1.5T GE Signa**，T1 IR-FSPGR **仅**；同 scanner/同 radiographer/同 protocol
- **配对**: MMSE + 年龄/性别；**无 PET/CSF/基因**
- **Access**: 免费公开下载，UCL XNAT 或 NITRC，注册即用
- **License**: Free for non-commercial research（UCL DRC）
- **引用**:
  - Malone 2013 *NeuroImage* doi:10.1016/j.neuroimage.2012.12.044
  - Cash 2015 (MIRIAD atrophy challenge) doi:10.1016/j.neuroimage.2015.07.087
  - https://www.nitrc.org/projects/miriad
- **Caveats**: 仅 T1 + 1.5T，无 multimodal；样本小；主要 algorithm benchmark（atrophy 估计），不适合 large FM 训练

---

### GENFI (Genetic Frontotemporal Dementia Initiative)
- **病人数**: 5th data freeze 850 入组（24 sites）；710 有 3T volumetric T1 + DWI
- **≥2 MRI TP**: ~500（设计为年度随访；多数参与者 2-4 TP）
- **≥3 MRI TP**: ~280（presymptomatic carriers 完整随访集）
- **时间结构**: baseline + 年度 clinical + MRI；中位 follow-up ~3 yr，range 0.8-7 yr
- **模态**: 3T (86%) + 1.5T (14%)，T1-MPRAGE + DWI/DTI + T2/FLAIR + rs-fMRI（子集）；无统一 PET；CSF subset ~200
- **配对**: 突变 (C9orf72 / GRN / MAPT), NfL 血/CSF, 完整 neuropsych (CDR-FTLD, CBI-R)
- **Access**: GENFI Steering Committee proposal (genfi@ucl.ac.uk)，需 collaboration agreement，~2-3 个月
- **License**: GENFI Data Sharing Agreement（学术，需 co-authorship）
- **引用**:
  - Rohrer 2015 (GENFI baseline) *Lancet Neurol* doi:10.1016/S1474-4422(14)70324-2
  - Cash 2018 *Neurobiol Aging* doi:10.1016/j.neurobiolaging.2017.10.008
  - Greaves & Rohrer 2022 *Neurology* doi:10.1212/WNL.0000000000200384
- **Caveats**: scanner heterogeneity 跨 24 sites；presymptomatic vs symptomatic 严重 imbalanced (symptomatic ~120/710)

---

### Part 7A 实用结论

| Cohort | ≥3 TP est. | Access 周期 | 关键独占 |
|---|---|---|---|
| **AIBL** | ~350 | 2-4 周 | Australian 版 ADNI，18-mo 间隔 |
| **NACC-SCAN** | ~2-3k | ~3 days | **最大** 多 ADRC pool，UDS clinical |
| **DIAN** | ~280 | 2-3 个月 | 显性遗传 AD（独特） |
| **HABS** | ~180 | 2-4 周 | preclinical AD (cognitively normal) |
| **NIFD** | ~130 | 1-2 周 | FTD diversity（独特） |
| **MIRIAD** | ~67 | 几天 | 极密集（9 TP）但小 + 1.5T only |
| **GENFI** | ~280 | 2-3 个月 | 遗传 FTD（C9orf72/GRN/MAPT） |

**给 Direction A 的建议**：
- 主干：**ADNI + NACC-SCAN + AIBL**（合起来 ~5k+ patients ≥3 TP）
- 加 FTD 多样化：**GENFI + NIFD**
- DIAN/HABS 太特定，作 evaluation subset
- MIRIAD 仅 algorithm sanity check（**1.5T + T1 only 限制大**）

**重要提醒**：AIBL/NIFD/4RTNI 与 ADNI 共享 LONI 基础设施 → **一次 LONI 账户**可申请多个。

---

## Part 7B: 非-AD brain MRI cohorts

### PPMI (Parkinson's Progression Markers Initiative)
- **病人数**: ~1,400 (PPMI 1.0, 2010-2018)；PPMI 2.0 目标 ~4,000+
- **≥2 MRI TP**: ~700-800（PD+HC subset 5-yr follow-up）
- **≥3 MRI TP**: ~300-500
- **时间结构**: Baseline + 12/24/36/48 mo（每 12 mo MRI in PPMI 2.0）
- **模态**: 3T, T1 MP-RAGE (1.2mm), 3D T2-FLAIR, DTI, rsfMRI, **NM-MT (neuromelanin)**
- **配对**: **DaTSCAN**, DNA/RNA/CSF/血液, GBA/LRRK2/SNCA 基因, MDS-UPDRS, 嗅觉, 睡眠, neuropsych
- **Access**: ppmi-info.org，DUA 1-2 周，免费
- **License**: PPMI DUA（非商业，需 acknowledgment）
- **引用**: Marek 2018 *Ann Clin Transl Neurol* doi:10.1002/acn3.644 · medRxiv 2024 doi:10.1101/2024.09.23.24313179 · https://www.ppmi-info.org/
- **Caveats**: MRI 仅 sub-study；scanner 跨 ~50 site 异质；**DaTSCAN 比 MRI 更核心**

---

### ABCD Study
- **病人数**: 11,868 baseline (age 9-10) — Release 6.1
- **≥2 MRI TP**: ~7,800-9,000（2-yr follow-up 完成）
- **≥3 MRI TP**: ~5,000-6,500（4-yr 完成，6-yr 部分）
- **时间结构**: Baseline + bi-annual MRI 每 2 年（2y/4y/6y/8y/10y）；annual 行为
- **模态**: 3T (Prisma/GE 750/Philips), T1 MPRAGE, T2, DTI multi-shell, rsfMRI, task-fMRI
- **配对**: 基因型 (Smokescreen), 唾液 hormone, 头发 cortisol, NIH Toolbox, CBCL, K-SADS, 物质使用, 家庭/SES
- **Access**: NDA, DUC 4-8 周，免费学术
- **License**: NDA DUC, mandatory data contributions back
- **引用**: Casey 2018 *Dev Cogn Neurosci* doi:10.1016/j.dcn.2018.03.001 · Hagler 2019 *NeuroImage* doi:10.1016/j.neuroimage.2019.116091
- **Caveats**: scanner harmonization 难题；同 family siblings 需 mixed-effect

---

### HCP-Aging (HCP-A) / AABC
- **病人数**: 1,396 (age 36-100+), AABC Release 2
- **≥2 MRI TP**: **915 (V2)**
- **≥3 MRI TP**: **471 (V3)**；≥4 TP: 96 (V4)
- **时间结构**: V1 + 2-3 yr 间隔，最长 ~10 yr trajectory
- **模态**: 3T Prisma, T1 MPRAGE 0.8mm, T2 SPACE, dMRI multi-shell, rfMRI, task-fMRI, ASL, hi-res hippocampal T2; 部分 7T MRS
- **配对**: NIH Toolbox, Penn CNB, 血液 (Aβ, p-tau), 步态/握力, 听力, APOE
- **Access**: ConnectomeDB + NDA，免费
- **License**: WU-Minn HCP Open Access (restricted 部分需 RDUA)
- **引用**: Bookheimer 2019 doi:10.1016/j.neuroimage.2018.10.009 · Harms 2018 doi:10.1016/j.neuroimage.2018.06.073
- **Caveats**: 原 cross-sectional，longitudinal 后加；不均衡 follow-up rate

---

### HCP-Development (HCP-D)
- **病人数**: 1,350 (age 5-21)
- **≥2 MRI TP**: ~300-650
- **≥3 MRI TP**: ~100-200（仅部分老年龄段）
- **时间结构**: 横断为主，5-21y subset burst design (baseline + ~2 yr 复扫)
- **模态**: 3T Prisma, T1 0.8mm, T2, dMRI multi-shell, rfMRI, task-fMRI, ASL
- **配对**: NIH Toolbox, Pubertal Development Scale, 唾液 hormones
- **Access**: NDA/ConnectomeDB，免费
- **License**: HCP Open Access
- **引用**: Somerville 2018 doi:10.1016/j.neuroimage.2018.08.050
- **Caveats**: longitudinal 不如 HCP-A 完整；puberty 异质性大

---

### dHCP (Developing Human Connectome)
- **病人数**: ~887 neonatal (783 unique) + 297 fetal (273 subjects)
- **≥2 MRI TP**: ~100 neonates（preterm 复扫）
- **≥3 MRI TP**: 极少 (<20)
- **时间结构**: 胎儿 20-40 PMA wks 单扫；新生儿 ~40 PMA wks 单扫；preterm 出生时 + term-equivalent 二扫
- **模态**: 3T Philips Achieva, 定制 32-ch neonatal coil, T2w 0.5mm, T1w, 多壳 dMRI (300+ dir), rsfMRI
- **配对**: 母亲健康问卷, 围产期临床, Bayley/Q-CHAT 18-mo neurodev, genetic subset
- **Access**: developingconnectome.org，DUA 几天-1 周
- **License**: **CC BY-NC-SA**
- **引用**: Edwards 2022 doi:10.3389/fnins.2022.886772 · Makropoulos 2018
- **Caveats**: 主要单次扫描设计；motion artifact 严重

---

### HBCD (HEALthy Brain & Child Development)
- **病人数**: >5,000 families；Release 2.0 含 ~3,500 婴儿
- **≥2 MRI TP**: ~1,500-2,000
- **≥3 MRI TP**: ~500-1,000（逐年增加）
- **时间结构**: V1 prenatal (非 MR) → V2 (0-1mo) → V3 (3-9mo) → V4 (9-15mo) → V6 later
- **模态**: 3T Siemens XA30 harmonized, 婴儿睡眠态 T1/T2, dMRI multi-shell, rfMRI, task-fMRI; MRS; EEG
- **配对**: **产前药物/物质暴露 (opioid 重点)**, 母乳/血液样本, Bayley, 母心理健康
- **Access**: NDA + DUC，免费，每年 release
- **License**: NDA DUC (HEAL Initiative open science)
- **引用**: Volkow 2021 doi:10.1016/j.dcn.2020.100876 · Dean 2024 doi:10.1016/j.dcn.2024.101452
- **Caveats**: 婴儿睡眠扫描成功率 ~70%；prenatal 暴露 enrichment 影响 generalizability

---

### Cam-CAN
- **病人数**: Stage 2 = 700 (age 18-87); Stage 3 = 280
- **≥2 MRI TP**: **0**（主要 cross-sectional）；Cam-CAN 2 子集 ~200 重扫但数据释放有限
- **≥3 MRI TP**: ~0
- **时间结构**: **横断**为主，一次 MRI + MEG + 行为
- **模态**: 3T Tim Trio, T1 MPRAGE, T2 SPACE, DWI, rfMRI, task-fMRI; **MEG (Elekta 306-ch)**
- **配对**: 广泛认知 battery, MEG, 健康/生活方式
- **Access**: camcan-archive.mrc-cbu.cam.ac.uk，DUA 2-4 周
- **License**: Cam-CAN Data License (非商业)
- **引用**: Shafto 2014 *BMC Neurol* doi:10.1186/s12883-014-0204-1
- **Caveats**: **几乎纯横断**——不适合 longitudinal；常用做 brain age 训练

---

### Rotterdam Scan Study
- **病人数**: 5,286 unique with MRI (2005-2016)；最新 ~6,000+ (RS-I/II/III)
- **≥2 MRI TP**: **~3,400**（10,755 scans / 5,286 subjects ≈ 2 avg）
- **≥3 MRI TP**: ~1,500-2,000
- **时间结构**: 从 2005 起整合 MRI；每 3-4 yr 一次，最多 4 wave
- **模态**: **1.5T GE Signa Excite (HDxt)**, T1 3D FSPGR, PD, FLAIR, 2D DTI (25 dir), 部分 rfMRI, SWI
- **配对**: 心血管/代谢临床, 全基因组芯片, MMSE/15WLT, **痴呆诊断终点**, APOE
- **Access**: Erasmus MC (rs@erasmusmc.nl)，**需合作者**，非完全开放
- **License**: 协作型，**非公开下载**，PI 协议
- **引用**: Ikram 2015 *Eur J Epidemiol* doi:10.1007/s10654-015-0105-7 · Vinke 2018 doi:10.1016/j.neurobiolaging.2018.07.001
- **Caveats**: **1.5T 老协议**；access 比 ADNI/PPMI 难得多；荷兰白人为主

---

### OpenBHB (Open Big Healthy Brains)
- **病人数**: **5,330 unique T1 MRI scans**（all HC, age 6-88, 71 sites, 10 源数据集: IXI/ABIDE 1+2/CoRR/GSP/Localizer/MPI-Leipzig/NAR/NPC/RBP）
- **≥2 MRI TP**: ~几百（CoRR test-retest；多数底层 cross-sec）
- **≥3 MRI TP**: ~几十（限 CoRR）
- **时间结构**: 聚合 **cross-sectional**；无统一纵向
- **模态**: 3T 为主（混 1.5T），**T1 only**（已 preprocess: VBM-quasi-raw + CAT12 + FreeSurfer）
- **配对**: **仅 age/sex/site**；无认知/基因
- **Access**: IEEE DataPort 免费下载，**无审批**
- **License**: 各源数据集 license 继承（CC BY / CC BY-NC 混合）
- **引用**: Dufumier 2022 *NeuroImage* doi:10.1016/j.neuroimage.2022.119637
- **Caveats**: **不是 longitudinal**——为 brain age + site debiasing 设计

---

### Part 7B 决策表

| Cohort | ≥2 MRI TP | ≥3 MRI TP | 真 longi? | Access 难度 |
|---|---|---|---|---|
| **ABCD** | 7,800-9,000 | 5,000-6,500 | ✅ 真 | NDA 4-8 周 |
| **Rotterdam** | ~3,400 | 1,500-2,000 | ✅ 真（1.5T 老）| 难（需合作）|
| **HBCD** | 1,500-2,000 | 500-1,000 | ✅ 真（婴儿）| NDA |
| **HCP-A/AABC** | 915 | 471 | ✅ 真 | ConnectomeDB |
| **PPMI** | 700-800 | 300-500 | ✅ 真 (PD) | 1-2 周 |
| **HCP-D** | 300-650 | 100-200 | partial | NDA |
| **dHCP** | ~100 | <20 | partial | 几天 |
| **OpenBHB** | ~几百 | ~几十 | ❌ cross-sec | **直接下载** |
| **Cam-CAN** | 0 | 0 | ❌ 横断 | DUA |

---

## Part 7 终极汇总（含 7A + 7B + ADNI/OASIS）

### 真 longitudinal brain MRI (按 ≥3 TP 病人数排)

| Cohort | ≥3 TP | 适合用途 |
|---|---|---|
| **ABCD** | 5,000-6,500 | 青少年发育（不能直接给老年 FM 用，但可作 pretraining）|
| **NACC-SCAN** | 2,000-3,000 | 多 ADRC pool，UDS clinical |
| **Rotterdam** | 1,500-2,000 | population-based 老化（1.5T 限）|
| **TADPOLE D1** | ~1,300 | features only, prediction benchmark |
| **ADNI 累计** | 1,300-1,700 | AD/MCI 金标准 |
| **HBCD** | 500-1,000 | 婴儿，0-10 yr 设计中 |
| **HCP-A/AABC** | 471 | 健康老化 36-100+，**高质量 3T** |
| **OASIS-3** | ~400 | 30-yr Knight ADRC |
| **AIBL** | ~350 | Australian AD |
| **PPMI** | 300-500 | Parkinson's |
| **DIAN** | ~280 | 显性 AD（独特，但难 access）|
| **GENFI** | ~280 | 遗传 FTD |
| **HABS** | ~180 | preclinical AD |
| **NIFD** | ~130 | 散发 FTD |
| **MIRIAD** | ~67 | 极密集 9 TP 但小 + 1.5T only |
| **4RTNI** | ~80 | PSP/CBD |

### 给 Direction A 的最终数据策略

**核心 pretraining 池**（按 ≥3 TP 病人累加）：
- ADNI 1+GO+2+3 + OASIS-3 + AIBL + NACC-SCAN = **~5,000+ patients ≥3 TP** (AD-aging 路线)
- 加 ABCD = **+5,000-6,500 (青少年发育，但配对 AD 数据集时要分组评测)**
- 加 Rotterdam（如能合作）= **+1,500-2,000**
- 加 HCP-A、PPMI、HBCD = **+700-2,000**
- 加 GENFI/NIFD = **+400 (FTD diversity)**

**理论上限 ≥3 TP brain MRI**: **~10,000-15,000 unique patients**（如 NDA + LONI + 合作全部拿到）

**对比**：BrainIAC 用 48,965 scans（多源混 ADNI/ABCD/OASIS）→ **scan 数 ≈ 70,000-100,000**（如全 access）

**不能直接用的**:
- Cam-CAN, OpenBHB, dHCP, HCP-D = cross-sec 或 longi 极少

**最快可启动**:
- ADNI + AIBL + NIFD（LONI 一站）+ OASIS-3（WUSTL portal）= 几周内拿到
- 加 NACC-SCAN（~3 days）+ OpenBHB（直接下载）= 1 个月内拿到大半数据
