# 二轮 landscape 调研（4 个新方向 + 综合排序）

> 第二轮发散后挑出 5 个让 subagent 调研：W / AA / CC / K 更新 / X joint-RAG。

## W. CheckList-style 医学 FM 行为测试

**verdict**：medium 状态，没人做 unified cross-FM。

**closest works**：
- FairMedFM (NeurIPS 2024, 2407.00983) —— 20 FM × 17 dataset 的 fairness audit
- CARES (NeurIPS 2024, 2406.06007) —— Med-LVLM trustworthiness
- MedVH (2407.02730) —— 6 hallucination probe
- MEDFAIR (ICLR 2023 spotlight) —— pre-FM 时代
- RoentMod (npj DM 2025/2026, 2509.08640) —— CXR 反事实生成
- DeVisE (2506.15339) —— 文本 LLM 上做了 CheckList，正好缺影像版

**真正没人做**：
- 统一跨 10+ 3D medical FM 的 behavioral suite
- 7-category 失败 taxonomy（shortcut / demographic / scanner / lesion-size / spatial reasoning / negation / hallucination）
- Counterfactual minimal-edit 测试在 CT/MRI 上
- 标准 benchmark 排名 vs 行为 robustness 排名的不一致研究

**defensible claim**：MedFM-CheckList unified behavioral suite over 10+ FMs

**难度**：medium。Mayo 数据 optional（公开 FM checkpoint + 公开数据足够）。

---

## AA. Hallucination Detection / Safety Gate（**升级为强候选**）

**verdict**：方法论活跃增长，但**零端到端 runtime gating**。FDA Jan 2025 SaMD 草案明文需要 hallucination + drift —— 监管驱动需求。

**closest works**：
- RadFlag (Rajpurkar 2024, 2411.00299) —— 温度采样 + LLM judge
- ReXTrust (2412.15264) —— 隐藏状态 probe，AUROC 0.875
- MAIRA-2 + RadFact (2406.04449) —— 离线 factuality
- UniVRSE (2503.20504) —— vision-conditioned semantic entropy
- DSE for radiology (2510.09256) —— 黑盒，n=206
- Conformal Triage (medRxiv 2024.02.09.24302543)

**主流技术**：semantic entropy / self-consistency / hidden-state probe / conformal prediction / RadFact-RadGraph / contrastive decoding

**真正没人做**：
1. 端到端 runtime gate（detector + conformal + clinician routing）
2. Prospective deployment 研究
3. 跨 VLM 通用 detector
4. 3D modality grounding-aware detection
5. Drift-aware uncertainty
6. FDA SaMD 闭环

**工业信号**：
- Aidoc 2026.01 拿到腹部 CT FM clearance
- Mayo 内部有 post-deployment monitoring 项目（你天然 access）
- Stanford AIDE Lab + Radiology Partners 2026 是 explicit safety 节点
- Rhino Health / Centaur Labs 卖 QA 层

**Mayo 独占价值**：
> draft report + radiologist-edited final report 配对语料 —— 公开零

这是 hallucination/edit prediction 的 direct ground truth。

**defensible claim**：drift-aware, conformal-calibrated hallucination gate with per-finding marginal coverage + ensemble semantic entropy + Mayo prospective edit-burden study

**难度**：medium-hard。Mayo 数据 highly valuable。

---

## CC. Radiology + Genomics FM（高风险高回报）

**verdict**：task-specific 饱和，FM scale 零；spatial transcriptomics + 影像 virgin。

**done**：
- EGFR / IDH / MGMT 任务级 100–200 paper
- MGMT 公认不能 generalize（AUC 0.55–0.70）
- 所有 medical FM (Merlin, M3FM, CT-FM, BrainIAC) 都没 omics signal

**closest works**：
- Pai/Aerts cancer FM (Nat Mach Intell 2024)
- BrainIAC (Nat Neurosci 2026, IDH AUC 0.79 是 fine-tune)
- FoundBioNet (2508.06756, 1,705 病人)
- MTS-UNET (2503.06828, ~2,200 病人)

**spatial transcriptomics + 影像**：
- Cell Reports 2025 (S2211-1247(25)00844-7) —— 鼠 / 人脑 MRI + Visium 共注册，proof of concept
- arXiv 2601.07871 —— 心血管 imaging multiomics review
- **学习型 mapping 零**

**真正没人做**：
- FM-scale (>50k 3D scans) paired imaging + omics 跨癌
- 3D imaging FM 联合 germline + somatic variant 预训练
- Imaging → transcriptome-wide expression regression (HE2RNA 的 CT/MRI 版)
- Cross-cancer molecular prediction transfer

**defensible claim**：First FM jointly pretrained on paired 3D radiology (CT+MRI) and bulk transcriptomics across cancers, analog to TITAN/PRISM for pathology

**难度**：硬。

**Go/No-Go**：Mayo 是否有 paired imaging + sequencing > 5k 病人。
- 是 → Nature 级
- 否 → 放弃（公开数据 < 10k 不够）

---

## K. Mech Interp on 3D CT FM（plan B）

详见 [agent-reasoning-interp.md](agent-reasoning-interp.md) ——已更新 GeoSAE 等竞品。

**状态**：3D brain MRI 被 GeoSAE 占；3D CT 仍有窗口。

---

## X. MedREALM/MedRETRO（**OPEN，被低估**）

**verdict**：**OPEN**。没人做 REALM/Atlas-style joint pretraining for medical vision。

**closest works**：
| 类型 | 例子 | 状态 |
|---|---|---|
| Frozen RAG | MMed-RAG, X-REM, X-TRA, PathRAG | 医学很多 |
| Joint fine-tune | JMLR, MedRGAG | 文本 only |
| **True pretraining-with-retrieval (REALM/Atlas)** | RAMM 部分, OphCLIP 部分 | **vision zero** |

**通用域可移植**：REALM (Guu 2020), RETRO (DeepMind 2022), Atlas (Meta 2022, EMDR2/PDist), RA-DIT (2023), REPLUG (2023)

**defensible claim**：First REALM-style joint pretraining of dense image retriever + medical VL FM, with retrieval over Mayo image-report memory bank as latent variable in pretraining loss.

**Mayo 杠杆**：强 —— 长尾 case 在 training 时被 retrieve（正是 REALM 设计动机）。Mayo 大量 in-house image-report = memory bank。

**难度**：medium-hard。Atlas 已给 recipe，但 retrieval collapse / gradient instability 是真坑。

**Venue**：NeurIPS / ICML（method paper）

---

## 6 方向横向对比

| | A 纵向 FM | K SAE 3D CT | W CheckList | AA 幻觉 gate | CC 放射基因组 | X MedREALM |
|---|---|---|---|---|---|---|
| Mayo 杠杆 | ★★★★★ 必需 | 不需 | optional | ★★★★ | ★★★★★ | ★★★★ |
| 难度 | 中 | 中 | 中 | 中高 | 硬 | 中高 |
| 工业信号 | ★★★★ | ★★★（窄）| ★★★ | ★★★★★ FDA | ★★★（pharma 窄）| ★★★★ |
| 留白 | 真有 | 缝隙 | 缝隙 | 真有 | 数据卡死 | **真有** |
| Venue | MICCAI/NeurIPS | ICLR interp | NeurIPS D&B | Nat Med/FDA | Nat Med/Nature | NeurIPS/ICML |
| 风险 | 工程量 | 与 GeoSAE 划界 | "survey" 标签 | offline→prospective 跨度 | Mayo 数据 go/no-go | retriever 训练不稳 |

---

## 综合判断（更新版）

**主选**：**A**（保留）
**新强候选**：**AA**（FDA 驱动 + Mayo 独占语料 + 工业 explicit hire）
**Method paper 候选**：**X MedREALM**（被低估，REALM-style 整片空白）
**Plan B**：**K**（A 卡住时小篇兜底）
**赌博**：**CC**（仅当 Mayo paired omics > 5k 时启动）
**温吞**：**W**（能写但不炸场，可作 paper 2）

---

## 三线 roadmap 草稿（A / AA / X 互补）

```
Year 1
  Q1-Q2: A 主线 prototype (data curation + 4-timepoint 小规模)
  Q3-Q4: A paper 投 MICCAI / NeurIPS

  // 并行 AA：
  Q1: Mayo draft+edited 语料 scoping
  Q2-Q3: AA prototype (RadFlag + conformal)
  Q4: AA paper 投 Nat Med / NEJM AI

Year 2
  Q1-Q2: X (MedREALM) prototype，基于 A 的 backbone + image-report memory bank
  Q3-Q4: X paper 投 NeurIPS / ICML

→ 3 papers，分别打 Research Scientist (A) / Applied Scientist (AA) / ML Researcher (X)
```

或单线狠做 A，6 个月后看 AA / X / K / CC 哪个 follow-up。
