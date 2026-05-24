# TimeFM-3D 数据收集

> 第一步：收集纵向 3D 影像数据。
> **scope = 全模态、全器官的纵向 3D 影像 FM**（CT + MRI + PET，脑/胸/腹/头颈等都要）。
> 四个文件：本 README（总计划 + 进度追踪）· [access-guide.md](access-guide.md)（每个数据集怎么申请）· [download-research.md](download-research.md)（**每个数据集怎么下最省事 / 有没有现成处理好的版本**）· [curation-plan.md](curation-plan.md)（数据到了怎么整理）。

## 目标

预训练一个**不限器官、不限模态**的纵向 3D 影像 FM —— 从多 timepoint 扫描学疾病轨迹的可复用表征。
所以数据要**跨模态 + 跨器官**铺开：

- **CT**：肺（NLST 是主力）、头颈、腹部、免疫治疗 response 队列
- **MRI**：脑（ADNI/OASIS/Yale/glioma 纵向）、腹/盆
- **PET**：随 PET/CT、ADNI PET 一起进

规模目标：先凑 **~30k+ 病人、≥2 个 timepoint** 启动预训练 —— NLST 一个就近 26k，是主干；其余补模态/器官多样性。

## 优先级分层

| Tier | 数据集 | 模态/器官 | access | 等待 | 何时 |
|---|---|---|---|---|---|
| **在手** | ADNI · PPMI · OASIS-3 | 脑 MRI/PET | **已有** | — | 直接 curate |
| **0 即时** | Yale-Brain-Mets-Longitudinal | 脑 MRI | TCIA 公开下载 | 0 | **今天** |
| **0 即时** | Brain-Tumor-Progression / LUMIERE | 脑 MRI（glioma 纵向）| TCIA 公开下载 | 0 | 今天 |
| **0 即时** | Anti-PD-1 Lung / Melanoma | 胸/全身 CT（免疫治疗纵向）| TCIA 公开下载 | 0 | 今天 |
| **0 即时** | HNSCC | 头颈 CT/PET | TCIA 公开下载 | 0 | 今天 |
| **0 即时** | NLST | 肺 CT（纵向主干，~26k）| TCIA 公开下载（影像）| 0 | **今天** |
| **1 快** | AIBL + NIFD（LONI 一站）| 脑 MRI | IDA 注册 + DUA | ~2 周 | **今天提交** |
| **1 快** | NACC-SCAN | 脑 MRI | naccdata.org + DUA | ~3 工作日 | **今天提交** |
| **2 后续** | ABCD | 脑 MRI（青少年纵向）| NDA 申请（**先确认是否已有**）| 4-8 周 | 已有则直接用 |
| **2 后续** | UK Biobank | 全身+脑+心 MRI（含重复成像）| AMS 申请 + 付费 | 2-4 月 + £ | 扩规模时 |
| **2 后续** | HCP-A/D | 脑 MRI | ConnectomeDB | 4-8 周 | 扩规模时 |

**核心思路**：Tier 0 今晚全下了就有脑 MRI + 胸 CT（含 NLST 纵向主干）+ 头颈 PET/CT，prelim 直接能验证"跨模态联合预训练"；Tier 1 三个申请今天一起提交，等待期用 Tier 0 做原型。

## 下载调研结论（2026-05-22，详见 [download-research.md](download-research.md)）

派了 6 个 subagent 联网核实"有没有别人处理好的现成版本"。要点：

- **已是 NIfTI/BIDS、基本开箱即用**：Yale-Brain-Mets、LUMIERE、OASIS-3、ADNI（用官方 preprocessed collection）—— 不用碰 DICOM。
- **要自己转 DICOM→NIfTI**：Anti-PD-1、HNSCC、AIBL、NIFD、PPMI、Brain-Tumor-Progression —— 脚本我来写。
- **⚠️ NLST 大坑**：HuggingFace 上 CADS-dataset 有 7,172 例 NLST CT 的现成 NIfTI，但**是单 timepoint 筛查样本，不是同一病人的 T0/T1/T2 配对**。我们要纵向，所以 CADS 只能拿来跑通 pipeline；真纵向数据还得走 IDC 公开子集或 CDAS。
- **ABCD**：ABCC（NDA Collection 3165）有现成 BIDS derivatives + 纵向 4 时点，但全集 168TB、审批 2-6 周 —— 先确认本地是否已有。

## 本周该做的事（你的 action）

1. [ ] **下 Tier 0 TCIA 那批**（Yale + Brain-Tumor-Progression/LUMIERE + Anti-PD-1 + HNSCC，零审批）→ 立刻有多模态数据。步骤见 access-guide §1
2. [ ] **下 NLST**（TCIA 公开，影像不需 DUA）—— 别下全量 11TB，只取 thinnest series ~1.5-3TB。access-guide §2
3. [ ] **注册 LONI / IDA 账号** → 提交 **AIBL + NIFD**（ADNI 已有，不用再申请）。access-guide §3
4. [ ] **注册 NACC** → 提交 SCAN DUA（最快，~3 天）。access-guide §5
5. [ ] **确认 ABCD** 本地到底有没有 → 有就标 ✅，没有再走 NDA 申请
6. [ ] 把 **ADNI / PPMI / OASIS-3**（已有）的本地路径 + 原始格式告诉我 → 我开写 curation 脚本

→ 1、2 是马上能下载的；3-4 是"提交完就等"；6 是现在就能推进的（已有数据直接进 curation）。
→ NLST 的**癌症/死亡 label** 走 CDAS（~4-8 周），那是下游评测才用，预训练不用，现在不管。
→ OASIS-3 已有，不用再申请。

## 进度追踪表（我维护，你做完一步告诉我我就更新）

| 数据集 | 模态 | 推荐路线（详见 download-research.md）| 难度 | 状态 | 更新日期 |
|---|---|---|---|---|---|
| **ADNI** | 脑 MRI/PET | 已有 → 用官方 preprocessed collection,待 curate | 低 | ✅ 已有数据 | 2026-05-22 |
| **PPMI** | 脑 MRI（帕金森纵向）| 已有 → dcm2niix 自转 或取 ANTsX 衍生 | 中 | ✅ 已有数据 | 2026-05-22 |
| **OASIS-3** | 脑 MRI/PET | 已有 → 确认含 FreeSurfer derivatives | 低 | ✅ 已有数据 | 2026-05-22 |
| **ABCD** | 脑 MRI（青少年纵向）| 确认本地是否已有;没有走 ABCC Collection 3165 | 高 | ❓ 待确认 | 2026-05-22 |
| Yale-Brain-Mets | 脑 MRI | TCIA 直下 ~43GB（**官方已是 NIfTI**）| 低 | ⬜ 未开始 | — |
| LUMIERE | 脑 MRI | Figshare 直下（**已 NIfTI + skull-strip**，免审批）| 低 | ⬜ 未开始 | — |
| Brain-Tumor-Progression | 脑 MRI | TCIA（签 restricted license）,仅 20 例自转 | 中 | ⬜ 未开始 | — |
| Anti-PD-1 Lung / Melanoma | 胸 CT | IDC + idc-index 拉取后自转;Melanoma 需受控访问 | 中 | ⬜ 未开始 | — |
| HNSCC | 头颈 CT/PET | 申请 TCIA(受控)自转,或改用 HNTSMRG24（已 NIfTI）| 中-高 | ⬜ 未开始 | — |
| NLST | 肺 CT | CADS（HF,7k 单点）跑 pipeline + IDC/CDAS 拿纵向 | 低/高 | ⬜ 未开始 | — |
| AIBL | 脑 MRI | LONI DUA → 下原始 → Clinica 转 BIDS | 中 | ⬜ 未开始 | — |
| NIFD/4RTNI | 脑 MRI | LONI DUA（随 AIBL 一起）→ Clinica 转 BIDS | 中 | ⬜ 未开始 | — |
| NACC-SCAN | 脑 MRI | NACC 申请 → 拿官方 NIfTI（衍生只有表格）| 中 | ⬜ 未开始 | — |

状态记号：⬜ 未开始 · 🟡 已提交等待 · 🟢 已批准 · ✅ 已有数据/已下载 · ❓ 待你确认

> ✅ 的三个（ADNI/PPMI/OASIS-3）已经在手 —— **不用再申请**。下一步是 curate（见 [curation-plan.md](curation-plan.md)），告诉我数据在哪个路径、原始格式（DICOM/NIfTI）我就能开写脚本。

**用法**：你每做完一步（比如"NLST CDAS 提交了"），跟我说一声，我就更新这张表 + 记日期。需要的话我也帮你看申请材料、写 curation 脚本。

## 数据到位之后

见 [curation-plan.md](curation-plan.md)：目录结构、DICOM→NIfTI、CT/MRI/PET 分别归一、跨 timepoint 配准、生成 manifest。这部分脚本我可以写。

## 备注

- 不需要等所有数据齐 —— Tier 0 一到就开 prelim（验证跨模态 3 个 SSL loss 能联合优化）
- DUA **不能再分发数据**（NLST/ADNI/OASIS/NACC），但训出的 model weights 通常可以
- 全模态/全器官比单纯脑要杂得多 —— curation 的序列识别、不同器官 spacing、CT-vs-MRI 归一都要分开处理，见 curation-plan
- Mayo 内部数据另算 —— 你和 informatics 那边的进度单独跟，到位了加进来
