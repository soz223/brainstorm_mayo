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

## Part 7B: 非-AD brain MRI cohorts (PPMI / ABCD / HCP / dHCP / HBCD / Cam-CAN / Rotterdam / OpenBHB)

⏳ subagent 调研中，回来更新。
