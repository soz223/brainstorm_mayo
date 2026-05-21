# 因果推断 / 可信 AI / 评测科学 in Medical ML — 调研 + 发散

> 方法论：literature-review + scientific-brainstorming（~/.claude/skills/）。检索 2026-05-21，WebSearch（parallel-cli/arxiv API 在 sandbox 不可达）。
> 关联主线见 [IDEAS.md](../IDEAS.md)；用户背景：纵向 3D 医学影像 FM（Direction A），Mayo 纵向数据，求职导向。

---

## Part 1 — Literature review（领域现状）

### Cluster 1: 因果 ML / treatment effect 估计

成熟领域，深度学习架构层面已收敛。CATE/ITE 估计的 meta-learner（S/T/X/DR/R-learner）+ 神经网络变体（TARNet, Dragonnet, CFRNet）是标配。

- **DL for Causal Inference: A Comparison of Architectures for HTE** — arXiv:2405.03130 (2024)。系统比较 CATE 神经架构，结论是架构（权重组成、正则、训练技巧）比 estimator 选择更关键。
- **Causal ML for predicting treatment outcomes** — arXiv:2410.08770 (2024)，临床决策支持视角综述。
- **CATE with missing outcome data** — arXiv:2412.19711 (2024)，mDR-learner / mEP-learner，把 IPCW 并入 learner（去偏 + 缺失）。
- Causal forests（Wager & Athey 系）仍是无需预设交互项的强 baseline。

**留白判断**：方法论本身红海，理论门槛高（半参数效率、影响函数）。

### Cluster 2: 纵向 / time-varying confounding ITE

与用户 Mayo 纵向数据最契合的子领域。

- **Estimating ITE with Time-Varying Confounders** / Deep Sequential Weighting (DSW) — arXiv:2008.13620。RNN 推断隐藏混杂。
- **Perspective on ITE from time-series health data** — PMC12758458 (2025)。
- **ML methods to estimate ITE for HTA** — Med Decis Making, Zhang et al. 2024（doi:10.1177/0272989X241263356）；LTMLE 处理 time-varying confounding + time-to-event。
- **Joint TE Estimation from Incomplete Healthcare Data: Temporal Causal Normalizing Flows** — arXiv:2605.05125 (2025)，缺失 + 反事实。
- 经典理论基座：g-methods / MSM / LTMLE（Robins, van der Laan）。

### Cluster 3: 可信 AI — conformal / calibration / shift

最活跃、门槛适中、与影像最易嫁接。

- **A Gentle Introduction to Conformal Prediction** — arXiv:2107.07511（Angelopoulos & Bates，入门基座）。
- **Estimating Test Performance for AI Medical Devices under Distribution Shift with CP** — arXiv:2207.05796。
- **Pitfalls of Conformal Predictions for Medical Image Classification** — arXiv:2506.18162 (2025, DKFZ)，安全关键场景的假设陷阱。
- **CP as Bayesian Quadrature** — ICML 2025，解决单一 calibration set 失控、降低 failure rate。
- **Robust CP under Distribution Shift via Physics-Informed SCM** — arXiv:2403.15025 (2024)，因果 × conformal 交叉。
- **Test-time Recalibration of Conformal Predictors** — arXiv:2210.04166（仅用 unlabeled 目标域）。
- 条件分布漂移下 coverage 无保证，是公认开放问题。

### Cluster 4: 医学 AI 评测科学

正升温，"benchmark 不只是 leaderboard"成为共识叙事。

- **HealthBench** (OpenAI, 2025)：5000 多轮临床对话，48562 条 clinician rubric。配套批判 PMC12547120 "not yet clinically ready"、PMC12304011 解剖其疾病谱。
- **Touchstone Benchmark** — arXiv:2411.03670 (2024)："Are We on the Right Way for Evaluating AI Algorithms for Medical Segmentation?" 公开 leaderboard + 批评 in-distribution/小测试集/过简 metric。
- **Beyond the Leaderboard: Rethinking Medical Benchmarks for LLMs** — arXiv:2508.04325；提出 **MedCheck**，生命周期导向，46 条医学定制 checklist（设计→治理 5 阶段）。
- **Benchmark suites instead of leaderboards for fairness** — PMC11573903，反对单一 leaderboard。
- CheckList 风格行为测试（Ribeiro et al. ACL 2020）在医学 NLP 有零星应用，3D 影像/纵向几乎空白。

### Cluster 5: 公平性 / 去偏 / shortcut learning

- **The limits of fair medical imaging AI in real-world generalization** — Nature Medicine 2024（s41591-024-03113-4）：纠正 demographic shortcut 反而损害跨域泛化 —— 公平-泛化 trade-off。
- **Detecting Shortcut Learning for Fair Medical AI (shortcut testing, ShorT)** — Nat Commun / arXiv:2207.10384。
- **Survey of AI fairness/bias in biomedicine** — PMC11129918 (JBI 2024)。
- **One Size Fits None: Rethinking Fairness in Medical AI** — arXiv:2506.14400 (2025)。

### Cluster 6: FM 的因果性 / FM × treatment effect（新兴，最有留白）

- **CausalFM: Foundation Models for Causal Inference via Prior-Data Fitted Networks** — arXiv:2506.10914 (2025)。PFN 在合成 SCM 上预训练，in-context 估 CATE，超过 SOTA CATE estimator。
- **Do-PFN: In-Context Learning for Causal Effect Estimation** — arXiv:2506.06039 (2025)。in-context do-演算。
- **CounterBench** — arXiv:2502.11008 (2025)，LLM 反事实推理 5 类型（Basic/Joint/Nested/Conditional/Backdoor）。
- **Counterfactual reasoning emerges in self-attention** — arXiv:2506.05188 (2025)。
- **Causal Inference with LLM: A Survey** + **LLM for Causal Discovery** survey (2024-25)。
- **Causal Representation Learning with Generative AI: Texts as Treatments** — arXiv:2410.00903。

### Cluster 7: 监管对接

- FDA 2025-01-06 draft guidance "AI-Enabled Device Software Functions: Lifecycle Management"，强调 TPLC、data lineage/splits、PCCP（预定变更控制）。
- 2024 GMLP 10 原则；2024 年获批 ML 设备多依赖 retrospective 数据，prospective trial 方法学是空白。

---

## Part 2 — Scientific brainstorming（4-6 新方向）

用 assumption reversal：**"FM 学的是相关不是因果" → 能不能反过来 / 能不能测出来 / 能不能用纵向数据强行喂因果"**。

### 方向 1 — TimeFM-3D 的反事实评测协议（CheckList × counterfactual for longitudinal imaging FM）
把 CounterBench 思路从 LLM 文本搬到 3D 纵向影像 FM。构造影像层面的反事实扰动测试：同一病人若 baseline 病灶小 X%、若中间多一次随访、若治疗时点提前——模型预测是否单调/一致。本质是 behavioral testing 而非 leaderboard。
**Assumption reversal**：不问"FM 准不准"，问"FM 的预测在反事实扰动下行为对不对"。

### 方向 2 — 纵向 FM 作为 treatment-effect estimator（FM-as-CATE on imaging）
CausalFM/Do-PFN 把 PFN 用在 tabular。反过来：用纵向 3D 影像 FM 的表征做 CATE/ITE。Mayo 纵向数据天然有"治疗前后影像 + 治疗类型 + 结局"，做 imaging-based ITE：哪些病人对某治疗影像层面响应。可与 Direction A 的 time-to-event pretraining 直接缝合。
**留白大**：imaging-based ITE 几乎无人做（多数 ITE 是 tabular EHR）。

### 方向 3 — Conformal prediction 包裹 TimeFM-3D 的纵向预测（distribution-shift-aware）
给 Direction A 的纵向预测（如未来病灶增长、time-to-event）套 conformal，保证 coverage；重点处理纵向特有的漂移（scanner 漂移、随访间隔不规则 → 条件分布漂移）。结合 arXiv:2210.04166 的 test-time recalibration。
**最务实**：是 Direction A 的"可信性插件"，门槛低，求职故事完整（"我的 FM 带 calibrated uncertainty"）。

### 方向 4 — FM 表征里的 shortcut/因果探针（causal probing of a medical FM）
反转 Nature Medicine 2024 的发现：既然 FM 编码 demographic shortcut，能否设计探针定位 FM 哪些 representation 维度是 shortcut（相关）vs 因果（病理）。用 SAE / linear probe 在纵向 3D CT FM 上分离"病灶因果方向"与"scanner/人口学捷径方向"。与 IDEAS.md 已弃的 K（SAE on 3D CT FM）可复活合并。
**Assumption reversal**："FM 学的是相关" → 那就把相关维度找出来并切除。

### 方向 5 — 评测科学：纵向医学 FM 的 MedCheck 式生命周期 benchmark
MedCheck 是 LLM benchmark 的 checklist。空白：纵向 3D 影像 FM 没有对应的"生命周期评测框架"。设计一套纵向 FM 专用的行为测试套件（时间一致性、随访鲁棒性、反事实单调性、采集协议不变性），定位"3D 纵向版 HealthBench"。
**风险**：IDEAS.md 已把 T（eval methodology）标"别人在做"；需差异化 = 必须绑定 3D + 纵向 + 反事实，纯评测会撞车。

### 方向 6 — Prospective-ready 设计：retrospective FM 如何为 prospective trial 做准备（方法学论文）
FDA 痛点：ML 设备靠 retrospective 数据。提出方法学：在 Mayo 纵向 retrospective 数据上，如何用因果框架（target trial emulation）估计 FM 部署后的 prospective 性能 + 给出 PCCP 友好的监控指标。偏 perspective/methodology paper。
**契合监管对接 + AA（hallucination gate）的 FDA 叙事**，但顶会接受度不确定（更像 NEJM AI / Lancet Digital Health）。

---

## Part 3 — 评估

| 方向 | 留白度 | 数据可行性 | FM背景契合 | Mayo纵向契合 | 求职契合 | 理论门槛 | 综合 |
|---|---|---|---|---|---|---|---|
| 1 反事实评测协议 | 高 | 高（Yale 即可起步） | 高 | 高 | 中高 | 中 | 强候选 |
| 2 FM-as-CATE imaging ITE | 很高 | 中（需治疗+结局标注） | 很高 | 很高 | 高 | **高**（半参数/识别） | 高回报高风险 |
| 3 Conformal 包裹 TimeFM-3D | 中 | 高 | 高 | 高 | 高 | 低-中 | 最稳 |
| 4 FM 因果/shortcut 探针 | 中高 | 高（纯分析） | 高 | 中 | 中 | 中 | 可作副线 |
| 5 纵向 FM MedCheck | 中（撞车风险） | 高 | 高 | 高 | 中 | 低 | 需差异化 |
| 6 Prospective-ready 方法学 | 中 | 中 | 中 | 高 | 中（监管岗强） | 中高 | venue 不确定 |

**诚实提醒（哪些对用户太理论）**：
- **方向 2** 的硬核因果识别（time-varying confounding 下 ITE 的 identification、影响函数、半参数效率界）门槛高，纯做理论会与统计/计量背景的人正面竞争，用户 FM 背景不占优。**可行的降维做法**：只做"FM 表征 + 现成 DR-learner"的工程缝合，把因果当工具不当贡献点。
- **Cluster 1 整体**（新 CATE estimator）红海 + 理论重，不建议作主线。
- 方向 6 偏 methodology/perspective，顶 ML 会（NeurIPS/ICML）不收，适合 NEJM AI / Nat Med 视角，与"求职 ML 岗"匹配度一般。

---

## 一句话推荐

**主推方向 3（conformal 包裹 TimeFM-3D，作 Direction A 的可信性插件，门槛低、最稳、求职故事完整），用方向 1（纵向反事实评测协议）做差异化亮点；方向 2 极有留白但因果识别理论门槛高，建议降级为"FM 表征 + 现成 learner"的工程化切片而非理论主线。**
