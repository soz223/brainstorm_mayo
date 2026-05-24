# 下载方式调研:每个数据集怎么拿最省事

> 调研日期 2026-05-22。6 个 subagent 并行联网核实。
> 核心问题:**哪些数据有别人处理好的现成版本,不用碰原始 DICOM?**

## 一句话总览

| 数据集 | 原始格式 | 有现成处理好的版本? | 推荐路线 | 难度 |
|---|---|---|---|---|
| Yale-Brain-Mets | **NIfTI**（官方就是）| 官方释出版本身已是 curated NIfTI | TCIA 直下 ~43GB | **低** |
| LUMIERE | **NIfTI**（Figshare）| 已 skull-strip + 自带分割 | Figshare 直下,免审批 | **低** |
| Brain-Tumor-Progression | DICOM | 无,但只有 20 例 | TCIA（签 restricted license）自转 | 中 |
| NLST | DICOM | **HuggingFace CADS** 7,172 例 NIfTI（单点）；NLSTseg 605 例 NIfTI | CADS 起步;要真纵向走 IDC/CDAS | 低 / 高 |
| Anti-PD-1 Lung | DICOM | 无 NIfTI 整包 | IDC + `idc-index` 自转 | 中 |
| Anti-PD-1 Melanoma | DICOM | 无 | IDC,**需受控访问申请**（面部重建风险）| 中 |
| HNSCC | DICOM | 无(HNSCC 本体);HNTSMRG24 可作替代 | 申请 TCIA 或改用 HNTSMRG24 | 中-高 |
| ADNI | DICOM/NIfTI | **官方 preprocessed MPRAGE collections** | 已有 → 选官方 preprocessed 版 | **低** |
| AIBL | DICOM | 无官方预处理 | LONI 下 → Clinica 转 BIDS | 中 |
| NIFD/4RTNI | DICOM | 无 | LONI 下 → Clinica 转 BIDS | 中 |
| OASIS-3 | **NIfTI + BIDS** | 自带 FreeSurfer derivatives | 已有 → 确认含 derivatives | **低** |
| NACC-SCAN | NIfTI（defaced）| 衍生只有表格,无体素级 | 申请 → 拿官方 NIfTI | 中 |
| PPMI | DICOM | ANTsX phenotypes 衍生（在 LONI）| 已有 → dcm2niix 自转 或 取 ANTsX 衍生 | 中 |
| ABCD | DICOM / minimally-processed | **ABCC Collection 3165 = BIDS derivatives**,纵向 4 时点 | 走 ABCC,不碰 DICOM | 高（审批+体量）|

**最省事的（已是 NIfTI/BIDS,基本开箱即用）**:Yale-Brain-Mets、LUMIERE、OASIS-3、ADNI（官方 preprocessed 版）。
**要自己转 DICOM→NIfTI 的**:Anti-PD-1、HNSCC、AIBL、NIFD、PPMI、Brain-Tumor-Progression。
**有大坑的**:NLST（见下）、ABCD（168TB + 审批门槛高）。

---

## ⚠️ 关键警告:NLST 的"现成版"是单点,不是纵向

- **CADS-dataset**（HuggingFace `huggingface/CADS-dataset` 的 `0033_tcia_nlst/`）—— 7,172 个 NLST 胸 CT,已转 NIfTI、CC BY 4.0、一行命令下载、自带分割掩膜。**听起来完美,但它是单 timepoint 筛查样本,不是同一病人的 T0/T1/T2 配对。**
- 我们做的是**纵向** FM —— NLST 的价值正是每人 3 次年度 CT。CADS 拿不到这个纵向结构。
- **结论**:CADS 7k 适合先**跑通预处理/预训练 pipeline**(省事),但真正的纵向训练还得走 **IDC 公开子集**(`idc-index` 拉,自己 dcm2niix 转)或 CDAS。
- NLSTseg(Zenodo,605 例 NIfTI + 像素标注)只够做带标注的下游验证,规模太小不能预训练。
- OpenM3Chest(M3FM 论文)只放了 1.4GB 标签 pickle,**不含影像本体**,绕不开下 DICOM。

---

## 各数据集详情

### Yale-Brain-Mets-Longitudinal —— 低难度,首选
- 官方 TCIA 释出版**本身就是 NIfTI(.nii.gz)**,不是 DICOM。1,430 患者 / 11,892 study / 4 序列(T1 pre/post、T2、FLAIR)。~43GB + 一个临床 xlsx。
- CC BY 4.0,**无需审批**,Aspera 下载。
- 注意:官方做了序列归类,但未必统一 skull-strip / co-register / 重采样 —— 标准化仍需自己跑一遍(curation-plan 步骤 4-6)。
- 无第三方衍生版,也不需要 —— 官方版就够。

### LUMIERE —— 低难度,首选
- **Figshare** 直下(DOI 10.6084/m9.figshare.c.5904905),Nature Sci Data 论文随附。91 例 GBM / 638 study date。
- **已是 NIfTI、已 HD-BET skull-stripped**,自带 DeepBraTumIA / HD-GLIO-AUTO 分割 + radiomics + RANO 评分。非商业许可,**无需审批**。
- 处理代码:github.com/ysuter/gbm-data-longitudinal。对 FM 预训练几乎开箱即用。

### Brain-Tumor-Progression —— 中难度,但量极小
- TCIA,**仅 20 例 GBM**,每例 2 次 MRI(CRT 后 + 进展时)。DICOM 格式。
- 需向 help@cancerimagingarchive.net 提交 **TCIA Restricted License Agreement** 才能下。
- 无预处理衍生版,但 20 例 `dcm2niix` 自转工作量可忽略。作补充语料,非主力。

### NLST —— 见上方关键警告
- 影像 TCIA / IDC 公开(部分子集免审批);完整纵向全量(数十 TB)走 CDAS。
- 路线:CADS 7k(HuggingFace,即取即用)做 pipeline 验证 → IDC 公开子集 / CDAS 拿纵向全量。

### Anti-PD-1-Lung / Anti-PD-1-Melanoma —— 中难度
- TCIA,DICOM。Lung 61GB / 46 例(CC BY 3.0,开放);Melanoma 98GB / 47 例(**含面部可重建影像,需 NIH 受控访问申请**)。
- 纵向:Lung 多为 2 个 timepoint;Melanoma 平均 ~4 study,纵向更扎实。每例 timepoint 偏少(2-4)。
- 无现成 NIfTI 整包。推荐走 **IDC + `idc-index`** 云端拉取,就近 dcm2niix 转 NIfTI。
- BAMF/AIMI(Zenodo 13244892)有 Anti-PD-1-Lung 的分割,但是 DICOM-SEG、不覆盖 Melanoma。

### HNSCC —— 中-高难度
- TCIA,~310GB / 627 例,DICOM(CT/PET/MR/RT 全套)。**全集合受 NIH 受控访问限制,需申请。**
- 纵向:以 pre/post RT 两点为主(Head-Neck-CT-Atlas 子集 215 例明确 RT 前后),并非全部多 timepoint。
- 无 HNSCC 本体的 NIfTI 整包。替代:**HNTSMRG24**(Zenodo,MDACC 头颈,已 NIfTI,pre/mid-RT 两点真纵向,规模小)—— 想要"现成 NIfTI + 纵向"可直接用它当低成本补充。
- HECKTOR challenge 数据已 NIfTI + 算好 SUV,但单点(治疗前)、来源不完全等同 HNSCC。

### ADNI —— 低难度(用户已有)
- 官方在 IDA 内提供 **preprocessed image collections**:已做 gradwarp + B1/强度非均匀校正的 MPRAGE/IRFSPGR,可整批下载 —— **这是最该用的省事层级**。
- 注意:ADNI3 不再生成 preprocessed 版(现代扫描仪自带校正),Philips 数据也无 —— 这些用原始 NIfTI 即可。
- ADNI Standardized collections(1.5T/3T)可一次整批下,省去逐 visit 拼接。
- TADPOLE(D1-D4 CSV)是 FreeSurfer 表格特征,**无体素影像** —— 只能做 curation 的标签/QC,不能替代 3D 预训练。
- 用户已有数据 → 确认手里是不是官方 preprocessed 版;不是的话在 IDA 里重选 preprocessed collection。

### AIBL —— 中难度
- 与 ADNI 同 LONI IDA,单独 DUA。~1100 受试者,4.5 年纵向 T1 + 多种 PET。
- **官方明确未做 post-processing**,IDA 内没有 preprocessed 合集。
- 路线:下原始 NIfTI → Clinica `aibl-to-bids` 转 BIDS → `t1-linear` 做 MNI 仿射对齐。无捷径但流程与 ADNI 同构。

### NIFD / 4RTNI —— 中难度,量小
- LONI IDA,各自 DUA。额颞叶变性纵向 T1(+fMRI/DTI),规模较小。
- 无任何公开预处理释出版。路线:下原始 → Clinica `nifd-to-bids` → `t1-linear`。量小,自跑成本可控。

### OASIS-3 —— 低难度(用户已有)
- 官方经 XNAT Central 下载,**格式本身就是 NIfTI + BIDS**(.nii.gz + json sidecar),不是 DICOM。1378 受试者 / 2842 MR session。
- **自带 FreeSurfer derivatives**(1912 个过 QC 的 T1 分割)和 PUP PET 处理结果 —— 用 oasis-scripts 的 `download_oasis_freesurfer.sh` 直接下,不用自己跑。
- 用户已有数据 → 确认手里那份**有没有包含 FreeSurfer derivatives**;没有就补跑一次下载脚本。

### NACC-SCAN —— 中难度
- 经 NACC "Data Front Door" Quick Access File 申请,免费,~3 工作日回复。
- 2024-08 起提供**去面部(defaced)的 DICOM**,也提供 **NIfTI** —— 省去 DICOM 转换。
- 衍生数据只有 **表格**(FreeSurfer 体积/厚度、PET SUVR),**没有体素级预处理释出版** —— 做 3D FM 预训练仍需自己从 NIfTI 起步(配准/裁剪)。
- 按 zip 云端分发,下载链接 2 周过期(可邮件 consnacc@uw.edu 重置)。

### PPMI —— 中难度(用户已有)
- LONI IDA,官方只给原始 **DICOM**,不提供预处理 NIfTI/BIDS。
- **ANTsX PPMI imaging phenotypes**(medRxiv 2024.09.23.24313179):用 ANTsX 处理了 2010-2024 全部 PPMI MRI,衍生数据**回传到 LONI**(NIfTI,NRG 目录),同一套 LONI 权限即可取 —— 最接近"现成预处理版"。
- DIPY PPMI derivatives(NIH Figshare)只有 64 人扩散数据,太小。
- 用户已有数据 → 用 `dcm2niix` + `ppmitobids` 把已有 DICOM 转 BIDS(几小时),或直接取 ANTsX 衍生版。

### ABCD —— 高难度
- 经 NIMH Data Archive / NBDC Data Hub。需 NDA 账号 + 机构签的 Data Use Certification,审批 2-6 周。
- **ABCD-BIDS Community Collection(ABCC),NDA Collection 3165** = 现成 **BIDS derivatives**,涵盖 Baseline/Y2/Y4/Y6 **四个纵向时点**,社区标准管线跑好 —— 正是"别人处理好的版本"。
- 但全集 **~168 TB / 1300 万+ 文件** —— 必须按被试/模态做子集下载。工具:`DCAN-Labs/nda-abcd-s3-downloader`。
- 访问入口正从 NDA 迁到 NBDC Data Hub,申请时确认当前入口。
- **先确认本地是否已有** —— 有就省掉整个审批。
