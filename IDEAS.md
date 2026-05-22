# 研究 idea 索引

> 更新 2026-05-22。主线已定：**TimeFM-3D（纵向 3D 医学影像 FM）= 老师说的 "dynamic VLLM"**。

## 当前状态（一页看懂）

经过 6+ 轮 brainstorm、40+ 方向、多轮 subagent 调研，**搜索已收敛**：

- **主线 = TimeFM-3D**：纵向 3D 医学影像 foundation model（脑 + 多模态可特化）。= 老师三方向里的 "dynamic"。Survey 确认核心（FM-scale 多 timepoint 3D）没人 ship，窗口 6-12 月。
- **为何收敛**：用户约束（医学 3D 影像 + 脑 + 多模态 + FM + 求职 + 不碰因果 + 不跨界 + 窗口紧）交集，可行域只剩 TimeFM-3D 及近邻。5 个独立 Round-3 调研都路由回纵向。**继续发散边际收益 ≈ 0。**
- **下一步瓶颈不是"找方向"**，是 (1) 和老师/刘老师确认（见下表后），(2) 走 DUA + 跑 prelim。

## 老师的三个方向 + 各自结论

老师建议"基于刘老师 project 做 dynamic / causal / VLLM with missing data"。⚠️ 用户反馈：刘老师 project 实际"基本没东西"（就一个 agent 雏形）→ "基于"无从谈起，相当于从零。

| 老师方向 | 我们的结论 |
|---|---|
| **dynamic VLLM** | ✅ = TimeFM-3D，最实，**主线**。详 [paper-proposal-v0.2.md](ideas/direction-a/paper-proposal-v0.2.md) |
| **causal VLLM** | ⏸ 用户不熟因果、不想碰理论。可做版（因果表征学习 / 反事实生成，门槛较低）用户没接。搁置 |
| **VLLM with missing data** | ⏸ 深调研（[missing-data-vllm-survey.md](ideas/missing-data-vllm-survey.md)）：简单版（robustness）红海、诚实版塌进幻觉检测、有 novelty 版要 MNAR/因果——**和"不碰因果"冲突**。需问老师他指哪个版本 |

## 候选方向（更新状态）

| 方向 | 状态 | 备注 |
|---|---|---|
| **A** TimeFM-3D 纵向 3D FM（= dynamic VLLM）| ✅ **主线** | 脑 + 多模态可特化；[longitudinal-3d-fm.md](ideas/longitudinal-3d-fm.md) |
| Missing-data VLLM | ⏸ 待问老师 | MNAR-vs-不碰因果 矛盾未解 |
| Causal VLLM | ⏸ 搁置 | 用户不想碰因果理论 |
| **AA** Hallucination gate | ⏸ 搁置 | 用户判定"偏"，不在 brain+多模态 兴趣内 |
| **M8 / N2** Diffusion-as-FM (Marigold-Med) | ⬇ 降级 | 核实后**半空非空白**：Li et al. 2501.19265 已占 frozen-diffusion-as-backbone 核心；MICCAI modest，**只配作 prelim 探针 / 评测基建**，非独立 flagship |
| **X** MedREALM joint retriever | 冷 | 用户不熟、不自信 |
| **M5** TTT on 3D radiology FM | 冷 | 幸存候选但用户冷淡 |
| **CC** Radiogenomics FM | 待数据 | 需 Mayo paired imaging+omics |
| **K** SAE / **W** CheckList | Plan B / 温吞 | |
| Agent（监控 / acquisition）| ⬇ 降级 | 10 轮 A/B 辩论否了独立性 → 降为 TimeFM-3D 的 acquisition-aware 小切片（[agent-debate.md](ideas/direction-a/agent-debate.md)）|

## 需要和老师/刘老师确认的（比再发散值钱）

1. **刘老师 project 到底有没有东西、是什么** —— "基于"成不成立全看这个
2. **老师 "missing data" 指哪个版本** —— 简单 robustness 版没 novelty；有 novelty 版要因果（与用户"不碰因果"冲突）
3. **dynamic 是不是就是他要的** —— 若是 → TimeFM-3D 直接做

## 已弃

Q (Radiology Agent, 红海) · I (Reasoning FM, 评测烂账) · R (Trial Matching) · M1 (Mamba) · M2 (MoE) · M3 (Memory Layer, 反 scaling 33cite) · M4 (Speculative, 看作 engineering) · M6 (V-JEPA) · M7 (3D tokenizer) · M9 (Flow matching, reviewer barrier 高) · M10 (Self-improving, 医学无 verifier) · T (Eval methodology) · U (Open-vocab anomaly) · V (Pediatric) · Z (Active learning) · BB (Cross-lang) · Y (Efficient FM)

## 决策日志

| 日期 | 决策 | 关键 |
|---|---|---|
| 2026-05-13 | 主攻 A | 三方向调研 A 30-40% 留白；Mayo 纵向数据是社区独占缺口 |
| 2026-05-13 | AA 升级为强候选 | FDA 驱动 + Mayo draft+edited 配对独占 |
| 2026-05-13 | X 不是 RAG | REALM-style joint pretraining 整片空白 |
| 2026-05-21 | Agent 不作独立方向 | 10 轮 A/B 辩论：offline RL 死穴 / agent 蒸发 / OPE 序贯性塌；降为 acquisition-aware 小切片 |
| 2026-05-21 | Round 3 五领域发散 | 生成式/bio/信号/手术/因果——5 个独立调研都路由回"纵向 + 3D 影像" |
| 2026-05-21 | Missing-data 深调研 | 6 子角度；MNAR/informative-missingness 是唯一真留白，但要因果，与"不碰因果"冲突 |
| 2026-05-22 | N2/M8 降级 | 核实：Li et al. 2501.19265 (2025-01) 已占 frozen 3D diffusion-as-backbone 核心；半空非空白，降 MICCAI modest |
| 2026-05-22 | AA 搁置 | 用户判定偏离 brain+多模态 兴趣 |
| 2026-05-22 | 搜索收敛确认 | 40+ 方向，约束交集 = TimeFM-3D 及近邻；瓶颈转为 commit + 问老师 |
| 2026-05-22 | 用户兴趣过滤器明确 | brain（脑驱动）+ multimodal —— TimeFM-3D 脑+多序列特化正好命中 |

## 历史调研记录

### Brainstorming rounds
- [一轮 landscape (A/B/C)](ideas/landscape-survey.md)
- [二轮 landscape (W/AA/CC/X/K)](ideas/landscape-survey-round2.md)
- [Agent / Reasoning / Interp 副线](ideas/agent-reasoning-interp.md)
- [Method 维度调研](ideas/methods-survey.md)
- [Round 3：5 块新领域发散](ideas/brainstorm-round3-territories.md)（生成式/bio-omics/信号/手术/因果 + 跨领域合成 N1-N4）
- [VLLM with missing data 深度调研](ideas/missing-data-vllm-survey.md)（6 子角度；收敛留白 = MNAR/informative-missingness in FM era；推荐 Informative-Missingness VLLM，合并老师 causal + missing-data 两方向）
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
- **Yale-Brain-Mets 实战判断**：[yale-brain-mets-guide.md](ideas/direction-a/yale-brain-mets-guide.md)（43GB 即下，零审批；"mean 8" 是均值陷阱；零标注仅 pretraining）
- **Preliminary 实验计划** ⭐：[prelim-experiment-plan.md](ideas/direction-a/prelim-experiment-plan.md)（Yale 上跑 IA-MVM+NVP-LS+TPC，W&B 监控，2 周验证 pipeline）
- **环境 + W&B setup**：[setup.md](ideas/direction-a/setup.md)（conda env + wandb 安全登录 + register_run.py 注册脚本；key 不入 repo）
- **Agent follow-up 方向**：[agent-followup.md](ideas/direction-a/agent-followup.md)（8 子方向留白排名；推荐"纵向监控 agent + RL 决策"；⚠️ 知识库调研未联网核实）
- **Agent A/B 辩论（10 来回）**：[agent-debate.md](ideas/direction-a/agent-debate.md)（终局：agent 不作独立主线，降为 TimeFM-3D 的 acquisition-aware 最小切片，3-4 周 1 图 1 表）

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
