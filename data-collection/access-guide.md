# 数据集申请指南

> 每个数据集怎么拿。scope = **全模态全器官纵向 3D 影像 FM**，所以 CT / MRI / PET 都收。
> 按 Tier 0 → 1 排，**今天能做的全做掉**。申请进度回 [README.md](README.md) 进度表登记。

---

## §1 Tier 0：TCIA 公开数据（零审批，今天全下）

下面这些都在 **The Cancer Imaging Archive (TCIA)**，公开，**点了就能下**。
统一用 TCIA 官方下载器 **NBIA Data Retriever**（Win/Mac/Linux deb 都有）：

1. 装 NBIA Data Retriever。
2. 每个 collection 页 → "Download" → 拿 `.tcia` manifest。
3. 用 NBIA Data Retriever 打开 `.tcia` → 选目录开下。
4. 同页 supplemental 区的 clinical CSV / RTSTRUCT / 时间信息一并下。

许可：TCIA 标准 license（多为 CC BY 类，可发 paper）。等待 **0**。

要下的 collection：

| Collection | 模态/器官 | 纵向性 | 备注 |
|---|---|---|---|
| **Yale-Brain-Mets-Longitudinal** | 脑 MRI | 强（多 timepoint）| TCIA 直下,**官方已是 NIfTI** ~43GB；"平均 8 timepoint" 是均值陷阱 |
| **LUMIERE** | 脑 MRI | 强（glioblastoma 纵向）| ⚠️ **不在 TCIA,在 Figshare**;已 NIfTI + skull-strip,免审批 |
| **Brain-Tumor-Progression** | 脑 MRI | 强（baseline + progression）| ⚠️ 需签 **TCIA Restricted License**;DICOM,仅 20 例 |
| **Anti-PD-1-Lung / Anti-PD-1-Melanoma** | 胸/全身 CT | 强（免疫治疗 response 纵向）| DICOM;Melanoma 需受控访问申请;建议走 IDC + idc-index |
| **HNSCC** | 头颈 CT + PET | 中（部分含随访）| DICOM,**受控访问需申请**;或改用 HNTSMRG24（已 NIfTI）|
| **QIN-GBM / QIN 系列** | 脑 MRI（部分 PET）| 中 | quantitative imaging，test-retest + 随访 |

→ 每个数据集的**最省事下载路线**(有没有现成 NIfTI、走哪个入口)见 [download-research.md](download-research.md) —— 上表只是概览,实际下载前先看那份。
→ 先把 Yale + LUMIERE + Anti-PD-1 + HNSCC 下了,prelim 就有 **MRI + CT + PET 三模态**。

---

## §2 NLST（Tier 0，纵向 CT 主干，今天就能下）

National Lung Screening Trial —— **~26k 受试者、每人最多 3 次年度低剂量胸 CT**，是整个 FM 的纵向主干。
**影像在 TCIA 公开（CC-BY），SSL 预训练不需 label —— 直接下，无 DUA。**

> ⚠️ HuggingFace 上 **CADS-dataset** 有 7,172 例 NLST CT 的现成 NIfTI（即取即用），但**是单 timepoint 筛查样本,不是 T0/T1/T2 配对** —— 只能拿来跑通 pipeline,真纵向数据仍要走下面的 TCIA/IDC。详见 [download-research.md](download-research.md)。

1. TCIA 搜 **"NLST" collection** → 跟 §1 一样用 NBIA Data Retriever 下。
2. **别下全量 11TB**。膨胀主因是每 exam 平均 ~2.8 个 reconstruction —— 按 series description 过滤，**每 exam 只取最薄那一个 series（排除 >2.5mm）** → 压到 ~1.5-3 TB。
3. 或走 **IDC（datacommons.cancer.gov）** BigQuery 查询筛 thinnest series，免全量下载。
4. 预处理直接复用 **Sybil 的 TorchIO on-the-fly pipeline**（`pip install sybil`）。
5. 细节全在 [nlst-practical-guide.md](../ideas/direction-a/nlst-practical-guide.md)（series 选择、resample、各 paper 用法）。

- 等待：**0**（影像公开）。
- **CDAS 是另一回事**：cdas.cancer.gov 申请的是**癌症诊断 / 死亡 label**，预训练用不上，下游评测要 label 时再申请（~4-8 周）。现在不用管。
- 许可：TCIA CC-BY，可发 paper。

---

## §3 ADNI + AIBL + NIFD（Tier 1，LONI / IDA 一个账号全包，今天提交）

脑纵向 MRI（+ 部分 PET）。三个数据集**同一个 IDA 门户**，一次注册全申请。

1. 进 **ida.loni.usc.edu** → 注册账号（要真实机构邮箱、导师/PI 信息）。
2. 账号建好后分别申请：
   - **ADNI**：adni.loni.usc.edu → "Data Samples" → Apply。在线签 **Data Use Agreement**，填用途（"longitudinal 3D imaging foundation model pretraining"）。需 PI 共签。
   - **AIBL**：同 IDA 门户内单独勾选申请。
   - **NIFD / 4RTNI**（额颞叶变性纵向）：同门户内申请。
3. 批准后在 IDA "Download → Image Collections" 建 collection、导 manifest 下载。MRI + PET 都勾上。

- 等待：**~1-2 周**（人工审 + PI 确认邮件）。
- 关键：DUA 要 PI 签 —— **今天就把申请发给导师**。
- 许可：ADNI DUA 禁止再分发原始数据；衍生模型权重通常可发（发布前再核对 DUA 文本）。

---

## §4 OASIS-3（Tier 1，今天提交）

WUSTL 纵向脑老化 / AD MRI + PET。

1. 进 **oasis-brains.org** → OASIS-3 → "Apply for access"。
2. 走 **central.xnat.org** 注册（OASIS 数据托管在 XNAT）。
3. 在线签 OASIS Data Use Terms，填准机构信息。
4. 批准后从 XNAT 项目页下载，或用 `XNATpy` 批量拉。MRI + PET 都要。

- 等待：**几天到 2 周**。
- 许可：禁止再分发；论文需引用 OASIS-3 指定 citation。
- 注意：要 **OASIS-3**，不是 OASIS-4。

---

## §5 NACC-SCAN（Tier 1，最快，今天提交）

NACC 标准化影像子集，纵向覆盖好，**审批最快**。

1. 进 **naccdata.org** → "Request Data"。
2. 注册 → 填 Data Request 表：选 **SCAN（MRI）** 模块，写研究用途。
3. 提交后 NACC 审（**~3 个工作日**）。
4. 批准后给下载凭证 / link。

- 等待：**~3 工作日**。
- 许可：NACC Data Use Agreement，禁止再分发；论文需 acknowledge NACC grant 编号。

---

## 一次性准备好的材料（所有 DUA / 申请都要）

填申请前先备齐：

- 机构邮箱（别用 gmail —— ADNI/NACC/CDAS 可能卡个人邮箱）
- 导师 / PI 姓名 + 邮箱（DUA 共签 / 确认要用）
- 研究用途一句话：
  > "Pretraining a longitudinal 3D imaging foundation model spanning CT, MRI
  > and PET across organs, learning reusable representations of disease
  > trajectory from multi-timepoint scans."
- 机构 + 部门 + 地址
- 是否商用：选 **academic / non-commercial**

---

## 提交后

每提交一个，回 [README.md](README.md) 进度表把状态从 ⬜ 改 🟡 —— 跟我说一声我来改并记日期。批准邮件到了再告诉我，我帮你看下载脚本。
