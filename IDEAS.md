# 研究 idea 索引

> 主线：**纵向 3D 医学影像 FM**。详见 [longitudinal-3d-fm.md](ideas/longitudinal-3d-fm.md)

## 当前候选

| 方向 | 状态 | Mayo 必需 | 详情 |
|---|---|---|---|
| **A** 纵向 3D FM | 主线 | ✅ | [longitudinal-3d-fm.md](ideas/longitudinal-3d-fm.md) |
| **AA** Hallucination gate | 强候选 | ✅ draft+edited 配对 | [methods-survey.md](ideas/methods-survey.md#aa) |
| **X** MedREALM joint retriever | 候选 | ✅ image-report 库 | [methods-survey.md](ideas/methods-survey.md#x) |
| **CC** Radiogenomics FM | 待数据 | ✅ paired imaging+omics | [methods-survey.md](ideas/methods-survey.md#cc) |
| **M8** Diffusion-as-FM | 候选 | optional | [methods-survey.md](ideas/methods-survey.md#m8) |
| **K** SAE on 3D CT FM | Plan B | ❌ | [agent-reasoning-interp.md](ideas/agent-reasoning-interp.md) |
| **W** CheckList medical FM | 温吞 | optional | [landscape-survey-round2.md](ideas/landscape-survey-round2.md#w) |
| **M5** TTT on 3D radiology FM | 候选 | optional | [methods-survey.md](ideas/methods-survey.md#m5) |
| **M9** Flow matching | 谨慎（barrier 高）| optional | [methods-survey.md](ideas/methods-survey.md#m9) |

## 已弃

Q (Radiology Agent, 红海) · I (Reasoning FM, 评测烂账) · R (Trial Matching) · M1 (Mamba) · M2 (MoE) · M3 (Memory Layer, 反 scaling 33cite) · M4 (Speculative, 看作 engineering) · M6 (V-JEPA) · M7 (3D tokenizer) · M10 (Self-improving, 医学无 verifier) · T (Eval methodology, 别人在做) · U (Open-vocab anomaly) · V (Pediatric) · Z (Active learning) · BB (Cross-lang) · Y (Efficient FM)

## 决策日志

| 日期 | 决策 | 关键 |
|---|---|---|
| 2026-05-13 | 主攻 A | 三方向调研 A 30-40% 留白；Mayo 纵向数据是社区独占缺口 |
| 2026-05-13 | AA 升级为强候选 | FDA 驱动 + Mayo draft+edited 配对独占 |
| 2026-05-13 | X 不是 RAG | REALM-style joint pretraining 整片空白 |

## 历史调研记录

### Brainstorming rounds
- [一轮 landscape (A/B/C)](ideas/landscape-survey.md)
- [二轮 landscape (W/AA/CC/X/K)](ideas/landscape-survey-round2.md)
- [Agent / Reasoning / Interp 副线](ideas/agent-reasoning-interp.md)
- [Method 维度调研](ideas/methods-survey.md)
- [Time-to-Event Pretraining 拆解](ideas/time-to-event-pretraining.md)

### Direction A 深度
- **Paper proposal v0.2** ⭐：[paper-proposal-v0.2.md](ideas/direction-a/paper-proposal-v0.2.md)（含 reasoning post-training 章节 + 一手验证数字 + 升级 venue/keyword）
- Paper proposal v0.1：[paper-proposal.md](ideas/direction-a/paper-proposal.md)（含 task I/O + 2D-vs-3D rationale）
- 文献综述：[lit-review.md（英文~75 篇）](ideas/direction-a/lit-review.md) · [中文简版](ideas/direction-a/lit-review-zh.md)
- 数据集 inventory：[datasets.md（英文~70 个）](ideas/direction-a/datasets.md) · [中文简版](ideas/direction-a/datasets-zh.md)
- **数据集深度调研**：[datasets-deep.md](ideas/direction-a/datasets-deep.md)（Part 2 肿瘤 + Part 4 UKB/体部 + Part 5 2D + Part 6 ADNI/OASIS 指针；Part 1 肺筛 + Part 3 多模态 CT + 其他 brain MRI 待）
- **ADNI/OASIS/TADPOLE 详**：[datasets-adni-oasis.md](ideas/direction-a/datasets-adni-oasis.md)（805 行 deep dive，澄清 OASIS-3 vs OASIS-4 + TADPOLE 1667 真实数）
- **其他 brain MRI longi**：[datasets-brain-other.md](ideas/direction-a/datasets-brain-other.md)（AIBL/NACC/DIAN/HABS/4RTNI/MIRIAD/GENFI/PPMI/ABCD/HCP-A/HCP-D/dHCP/HBCD/Cam-CAN/Rotterdam/OpenBHB 共 16 个）
- **NLST 实战指南**：[nlst-practical-guide.md](ideas/direction-a/nlst-practical-guide.md)（11TB 怎么用 + Sybil/Ardila/Liao/M3FM 预处理 pipeline）

### Trend 分析（Stage 1–3）
- [Stage 1A: ML 顶会 trending（~85 篇）](ideas/trends/stage1a-ml-venues.md) · [中文简版](ideas/trends/stage1a-ml-venues-zh.md)
- [Stage 1B: 医学顶刊 trending（~95 篇）](ideas/trends/stage1b-medical-venues.md) · [中文简版](ideas/trends/stage1b-medical-venues-zh.md)
- [Stage 2: trend 分析](ideas/trends/stage2-trend-analysis.md)（cluster 模式 + 谁领导 + 留白 + 时间窗口）
- [Stage 3: trend-based new ideas](ideas/trends/stage3-new-ideas.md)（推荐 A + Reasoning post-training）

## 数据 scoping 待办

- [ ] Mayo ≥3 follow-up 3D 病人数？（决定 A 启动）
- [ ] Mayo draft + radiologist-edited 配对语料量？（决定 AA 启动）
- [ ] Mayo image-report 总量？（决定 X 启动）
- [ ] Mayo paired imaging + sequencing ≥5k？（决定 CC go/no-go）
