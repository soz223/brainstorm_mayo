# Agent A vs Agent B 辩论：agent 科研方向

> 10 来回强制辩论。Agent A = 提创新计划方；Agent B = 审核否定方。
> orchestrator 逐轮转发，增量写入。开始时间 2026-05-21。

---

## 来回 1

### A1 — 提案
**Surveillance-Agent: A Risk-Calibrated RL Policy for Longitudinal Imaging Follow-up Decisions**
- 把随访"何时扫/扫什么/要不要预警"建成可训练序贯决策 policy；agent 用 TimeFM-3D 作 perception tool，决策 learned
- novel：留白 #1 纵向监控 agent；state 含真实 3D 影像时序表征；action 带成本调度；额外学 risk calibration
- 方法：State = 多 timepoint TimeFM-3D 表征 + 临床变量；Action = {稳定/短期复查/换模态/预警/升级 tumor board}；Reward = 早发现进展 − 不必要扫描 − 漏诊延迟 − calibration error；offline RL (CQL) on Mayo 历史轨迹；verifier = 真实 outcome
- 评测：自带 benchmark；lead-time/扫描次数/漏诊率/ECE
- 防怼：贡献是 learned+calibrated policy

### B1 — 批判
1. **Offline RL 死穴**：behavior policy 混杂（confounding-by-indication，高危扫得勤 → CQL 学到"扫描=坏 outcome"反向因果）；**没扫的病人没 ground truth**，reward 在未观测 action 上无法定义 → CQL 退化成模仿保守医生
2. **Offline 评测循环论证**：outcome 在医生 action 下产生；推荐医生没做过的 action，lead-time/漏诊率算不出；IPS/DR 在大动作空间方差爆炸
3. **数据矛盾**：Mayo DUA 没走完 + 不可 redistribute → benchmark release 什么？TimeFM-3D 没训出 → perception tool 是空气
4. **Novelty 站不住**：cost-aware surveillance = 经典 POMDP screening（Ayer/Alagoz 一大把）+ active sensing/VoI 几十年
5. **Scope 是 3 篇 paper**
6. **核心一击**：去掉 RL，用监督模型预测"该不该升级"+ 阈值，效果会差吗？证明不了 = RL 是装饰

---

## 来回 2

### A2 — 反驳 + 修正
- **认错**：撤掉 RL（offline RL CQL 会退化成模仿医生；counterfactual 评测循环论证；证明不了 RL 比监督+阈值强）
- **反驳**：经典 POMDP screening 假设固定转移+已知 reward；FM 时代真问题是 perception
- **修正方案**：改做 "下一次随访最优时间间隔预测" —— time-to-next-scan 当 continuous-time survival，纯监督 time-to-event 回归，号称只预测自然病程无未观测 action 问题
- 评测全用医生实际扫过的时点：time-dependent C-index / 固定预算下漏检数 / lead-time
- Scope 砍到 1 篇，用公开 NLST，frozen 3D encoder

### B2 — 批判（指出方向性失败）
1. **"只预测自然病程"双重自欺**：NLST progression 病人随即被治疗，事件时间是"干预后仍进展"，label 把 action 偷偷烤进去了
2. **没 novelty**：Sybil 单 LDCT 预测 1-6yr 风险本质就是 survival；A 的方案 = Sybil + 多时点输入，**和 TimeFM-3D 主线撞车，不是独立 paper 是主线的 ablation**
3. **"agent" 蒸发了**：A 退成 frozen-encoder + survival head，单步无动作无反馈闭环，**违背用户要 agent 的需求**
4. 固定预算比漏检是自造 protocol，reviewer 怼 cherry-pick
5. **逼问二选一**：(A) 找回真 agent——序贯看/不看决策 + 动作改变下次观测 + 用 off-policy evaluation (IPS/DR) 评估固定 policy；(B) 承认 agent 方向做不出独立 paper，回归主线

---

## 来回 3

### A3 — 选 (A)，方案 = Imaging Surveillance Schedule Evaluation
- Agent 属性：动作 = 离散随访间隔 {3,6,12 月}，序贯决策
- **不训 RL**：candidate policy 全是规则式（固定间隔 / 病灶增速分档启发式 / Fleischner 指南）；只**评估**
- 控方差：3 档动作 + propensity 拟合 + WDR + clipping + 只在 overlap 子群报告 + **ESS 可行性闸门**（不够就缩 horizon）
- label 污染：放弃"自然病程"，改"决策效用" + 竞争风险框架，治疗是 policy 下游合法成分
- 不撞主线：TimeFM-3D 作 DR estimator 的 outcome model 插件
- Scope = 1 篇

### B3 — 批判（认 3 点 + 2 致命硬伤）
**认对的**：①OPE 评估 > offline RL 训练 ②ESS 闸门诚实 ③竞争风险 framing 解决 label 污染
**致命硬伤**：
1. **序贯性自我蒸发**：3 档 × H 步 = 3^H 轨迹空间，ESS 必然闸到 H=1 → "序贯 agent"名存实亡，变单步决策
2. **这不是 agent paper 是 OPE 方法 paper**：动作 3 档、policy 是现成规则、模型只做 estimator，没有自主决策体在学习/推理 → agent 热词命中≈0，reviewer 说这是 causal inference
3. **贡献量不够顶会**：Fleischner 已是临床 SOTA，"用 WDR 比指南"是临床期刊 letter 量级
4. **说不出一句话卖点**："我们用 DR-OPE 评估了影像随访间隔规则"——agent 在哪？
**R4 必答**：(a) H=1 时 agent 怎么不蒸发？(b) 相对 Fleischner 的真增量？(c) 给一句含真 agent 机制（主动选下次扫什么/何时停）的顶会卖点，否则转投临床期刊

---

## 来回 4（关键转折）

### A4 — 大转向到 active acquisition agent
- agent 每个随访 timepoint **主动决定下次获取什么 MRI 序列**（T1post/T2-FLAIR/DWI/灌注/跳过）—— 动作改变未来观测
- **核心 trick**：数据集病人本做了全序列多 timepoint，mask 掉一部分当"未获取"，agent 学"该 unmask 哪个"，被 mask 真值 = **ground truth** → 监督式可训练，无 counterfactual 无 propensity
- 序贯性自带（T=4，每步依赖已 unmask 信息）
- 增量 vs Fleischner：F 只管"多久扫"；A 管"扫什么模态"，per-lesion 自适应
- 卖点：首个把 active sensing 做进 3D 影像 FM，30-40% 成本达全序列判读精度

### B4 — 批判（认这次真是 agent 了 + 4 硬伤）
**认对的**：mask-as-unacquired 真绕过 counterfactual；序贯性真站住；**这次真的是 agent**
**4 硬伤**：
1. **realism gap**：真实"没下 DWI 单"是非随机的（病人/协议/临床预判）；随机 mask → covariate shift
2. **非首创**：MRI k-space active sampling (Bakker/Pineda/Zhang) 早有；"序列级"vs"k-space 级"差异要讲清
3. **reward 信号拿不到**（致命）："与全序列相当的进展判读"需 RANO/放射金标准，Yale-Brain-Mets **零标注**
4. **鸡生蛋**：判断"该不该跳过 DWI"得先知道病灶状态，而病灶状态正需 DWI
**R5 必答**：(a) reward 判读 ground truth 从哪来？换 BraTS-Mets？还是放弃硬 reward？(b) 怎么建模 acquisition 非随机性？(c) 与 k-space active acquisition 的定位差异

---

## 来回 5

### A5 — 收敛方案
- **(a) reward**：训练用**自监督蒸馏**（全序列训 teacher，agent 子集 match teacher soft label/病灶 mask，KL+Dice，无需人工标注）；评测换有标注集——**LUMIERE (有 RANO) 主评测，BraTS-Mets 验证，Yale 仅无标注预训练**
- **(b) 非随机**：承认随机 mask 是简化；mask 概率**条件于协变量**（病灶体积/上次判读/序列间隔）拟合临床先验 propensity + 敏感性分析
- **(c) k-space 定位**：k-space 是单次扫描内加速；A 是跨 timepoint 序列/模态级纵向，正交互补
- 收敛：纵向 active acquisition agent，Yale 训 / LUMIERE+BraTS-Mets 评

### B5 — 批判（认 3 点 + 5 工程硬伤）
**认对的**：蒸馏 reward 绕开无标注、propensity mask 处理非随机、k-space 定位正交——方向性问题清掉
**5 工程硬伤**：
1. **蒸馏天花板 = 致命 framing**：agent 上限是 teacher，结论永远"少序列≈全序列"，reviewer 怼"没 net gain"。出路：net gain 必须落在"降噪"或"成本-精度 Pareto 占优"
2. **样本量**：LUMIERE 91 人切 timepoint 后测试集可能 <30，必须 bootstrap CI + paired test
3. **propensity GIGO**：mask 模型自拟合，必须独立验证 + 随机 mask 当失效下界
4. **baseline 要明确**：真正要 beat 的是**固定缩减协议**（如永远 T1post+FLAIR），全序列只是 oracle 上界
5. **domain shift**：Yale 训/LUMIERE 评，扫描仪/人群不同，至少 LUMIERE 内部 split 复现
**R6 必答**：(a) 让 agent 可能**超过**朴素全序列的机制 + 指标；(b) 测试集确切 N + 显著性方案；(c) propensity 怎么独立验证、失效下界；(d) 锁定主 baseline

---

## 来回 6

### A6 — 实验设计打磨
- **(a) 超全序列机制**：朴素全序列把劣质序列（运动伪影/低质 DWI）无条件喂下游 = 注入噪声；agent 学"按质量×病灶贡献选择性采纳"；net gain 落 **Pareto 占优**；评测两轴 = RANO κ (vs 专家) + 扫描成本；承认超全序列窗口仅在"含噪区"，干净数据退化为 cost-match（写进 limitation）
- **(b) 样本量**：分析单元改 **per-lesion**；bootstrap 95% CI（病人级 resample）+ paired Wilcoxon
- **(c) propensity**：held-out reliability diagram + AUC；失效下界 = random mask
- **(d) baseline**：主 = 固定缩减协议（T1post+FLAIR）；oracle = 全序列；下界 = random

### B6 — 战略层批判（认方法论清干净 + 4 战略硬伤）
**认对的**：Pareto framing、per-lesion、propensity 独立验证、固定缩减协议——4 工程硬伤全清，**方法论层无反对**
**4 战略硬伤**：
1. **撑不起 NeurIPS/ICML/CVPR**：应用驱动 + 单数据集 + 临床指标 = **MICCAI 量级**，顶会要可迁移方法创新
2. **实验风险 50/50**：net gain 全压"含噪窗口"，但高质量科研数据集运动伪影少 → 含噪窗口可能≈0 → agent 只 cost-match → paper 当场没 story
3. **可并进 TimeFM-3D 当一章**：active acquisition 的 perception 就是 TimeFM-3D，本质是其下游 agentic 应用
4. **求职太 niche**："脑转移 MRI 序列选择 agent"——非影像背景面试官 30 秒 get 不到
**R7 必答（三选一表态）**：(a) 给可迁移方法贡献，否则承认 MICCAI；(b) 坚持独立顶会就先 verify LUMIERE 低质序列占比；(c) 并回 TimeFM-3D。**别再修微观，回答它到底是不是一篇 paper**

---

## 来回 7

### A7 — 诚实定论
- 选 (a)，承认改变定性。**价值内核**：剥掉脑转移/MRI = "预算约束下，agent 学 acquisition policy 决定下个获取哪个信息源以最大化下游决策质量"；关键技术 = **counterfactual-free 训练 (mask-as-unacquired)**
- 诚实定性：① 不是纯 MICCAI（有方法论普适性）② 也不是 NeurIPS spotlight（mask-as-unacquired 非全新机制）→ **MICCAI oral / 二线方法 paper**
- 求职 niche 没解（portfolio 问题，非一篇论文能修）
- **不并进 TimeFM-3D**（声称正交）

### B7 — 批判（认降级诚实 + 逼"正交"+ 收向真实建议）
1. **同意降级**：MICCAI oral / 二线方法 paper 量级，自我定性准确
2. **"正交"是话术不成立**：active acquisition 的 perception encoder 要么就是 TimeFM-3D（→ 依赖主线，非独立）要么是劣构件（→ reviewer 问为什么不用本组 backbone）。两头占不住
3. **机会成本**：同样 6-9 月，独立做 = 一篇 MICCAI + 求职 niche 没解；作 TimeFM-3D 的章节 = 主线更完整 + agent 故事，边际成本低
4. **辩论 7 轮净结论**：**agent 独立方向对该用户（影像背景+求职）整体偏弱**；辩论价值是**证伪"agent 独立成方向"**；最优解 = TimeFM-3D 主线 + active acquisition 作其中一章
**R8 必答（三选一，不许全要）**：active acquisition 是 (a) TimeFM-3D 的一章 (b) 用独立弱 encoder 的真独立 paper（须答凭什么不用本组 backbone）(c) 砍掉

---

## 来回 8

### A8 — 选 (a)，收敛方案
- active acquisition 作 TimeFM-3D 的**第二 contribution**：主线重定位为"纵向 3D 影像 FM + 基于 FM 不确定性的 agentic acquisition 策略"，FM 不确定性 → 决策信号，标题/摘要出 "agentic"，简历有 agent 标签，零额外二线 paper
- **Plan B**（仅当求职明确需独立一作 agent paper）：拆 workshop paper（正刊投 TimeFM-3D 全文 + workshop 投 acquisition 单点）
- 不取 (c)

### B8 — 批判（认收敛合理 + 3 最后硬伤）
1. **"双 contribution"是最大风险**：TimeFM-3D v0.2 已塞满（3 SSL + reasoning 4 phase + 6 下游 + 11 baseline + 自造 benchmark），再加 acquisition 是**第三条线**，reviewer 怼"unfocused/diluted"。建议 acquisition **降为 reasoning 的下游 application**，不另立 contribution 编号
2. **Plan B workshop 有 salami 嫌疑**：同套实验拆两篇 = dual submission 风险。安全做法 = workshop 投正刊未覆盖单点，时间上 workshop 在前
3. **时间线**：v0.2 已 13 月，加 acquisition +2-3 月 = 16 月，撞窗口
**R9 必答**：(a) acquisition 是独立编号 contribution 还是 reasoning 的下游 application？(b) 16 月可接受否，acquisition 进 v1 还是 follow-up？(c) Plan B workshop 具体投哪个单点、如何零实验重叠

---

## 来回 9

### A9 — 逐条答
- **(a)** acquisition **不另立 contribution 编号**，降为一个 section（"证明 FM 不确定性有用"的下游 application）；主线保持 FM + reasoning 两个 headline
- **(b)** v1（13 月）**不含** acquisition，守窗口；acquisition 延到 v1 后 follow-up
- **(c)** Plan B workshop 投 "mask-as-unacquired: counterfactual-free training scheme"，公开数据 + 现成 encoder，不依赖 TimeFM-3D，零重叠

### B9 — 批判（认方案可执行 + 摆出根本矛盾）
**承认**：方案诚实、可执行、不灌水、守窗口
**根本矛盾**：用户原始诉求 = "想做 agent 方向"；9 轮辩论终点 = agent 不独立、降 section、v1 不含、延 follow-up → **交付层面等于没满足原始诉求**
**必须归因（二选一）**：① 辩论真的证明诉求不合理（对该用户：13 月窗口/单中心数据/无 agent 基建，独立 agent 风险回报不划算）② 9 轮过度防御，把可以更激进的 agent 方向阉割成"FM 不确定性消费者"
**R10（终轮）必答**：① 明确二选一并给证据 ② 给用户诚实结论（该不该做 agent、最小可行版是什么、不做的代价）③ 说清 9 轮的真正价值

---

## 来回 10（终轮）

### A10 — 终轮交付
- **二选一判断**：偏 ① —— 硬约束（13 月窗口 / Mayo 数据未到 / 零 agent 基建）让 agent 撑不起独立主线是真的；但 R8-R9 矫枉过正
- **结论**：agent 不做主线，做**轻量第二产物**——主线 TimeFM-3D，agent 以 "acquisition application section" 挂上
- **最小可行 agent**：冻结 TimeFM-3D encoder 不重训 → mask 预测信息增益 → 阈值化 acquire/skip → 只比固定缩减协议 → LUMIERE 评测不等 Mayo → **单步不序贯**绕开 ESS 死穴 → 约 3-4 周，1 图 1 表
- **代价**：不做 = 简历少 agent 标签；做最小版 = 几乎无风险但不是亮点
- **10 轮价值**：把"我想做 agent"翻译成"该交付 TimeFM-3D 表征，agent 是应用切片"

### B10 — 终轮裁决
1. **通过**：冻结 encoder + mask-as-unacquired + 单步阈值 = 唯一工期/基建/数据三项都对得上的方案，诚实可交付
2. **保留意见（须写进 limitation）**：
   - **"信息增益"怎么算是真问题**：冻结 encoder 下只能用代理指标（特征熵/预测方差/mask 重建误差），不是真下游增益。须用 LUMIERE 上"加该时间点后预测误差真实下降"反验代理指标
   - **单步绕开 ESS 也绕掉 agent 灵魂**：单步 = 一次性分类器，对外措辞写 **acquisition-aware**，别写 **agent**
   - **始终没解决**：Mayo 不到 → v1 临床落地是 LUMIERE 单数据集自证，外部效度问题挂账
3. **最终建议**：TimeFM-3D 表征为唯一主线全力打；agent 降级成 3-4 周 acquisition-aware 切片，1 图 1 表，到此为止；简历写 "acquisition-aware longitudinal modeling" 不写 "agent"

---

# 辩论总结（orchestrator）

## 收敛轨迹
```
RL policy → survival 回归 → OPE 评估 → active acquisition agent
→ 蒸馏 reward+propensity → Pareto 评测 → 降级 MICCAI → 主线一章
→ application section → 最小可行 acquisition-aware 切片
```

## 终局共识（A 与 B 一致）
1. **agent 不作独立主线方向** —— 13 月窗口 + Mayo 数据未到 + 零 agent 基建，三重硬约束下独立 agent paper 风险/回报不划算
2. **主线唯一 = TimeFM-3D**（纵向 3D 影像表征 + reasoning）
3. **agent 以最小切片形式挂上**：冻结 TimeFM-3D encoder + mask-as-unacquired 单步 acquire/skip 决策，3-4 周，1 图 1 表
4. **对外措辞**：写 "acquisition-aware longitudinal modeling"，**不写 "agent"**（单步分类器撑不起 agent 一词）
5. **挂账问题**：信息增益代理指标需 LUMIERE 反验；Mayo 未到 → 外部效度靠单数据集自证

## 一句话产出
> **用户要的不是 agent，是一个值得被 agent 调用的表征。先把 TimeFM-3D 表征做出来。**

## 辩论本身的价值
- 不是劝退，是把"我想做 agent"这个**身份诉求**翻译成**工程现实**
- 10 轮逼出了 4 个真硬伤（offline RL counterfactual / agent 蒸发 / OPE 序贯性 ESS / 含噪窗口 50/50），每个都会在 reviewer 处复现——提前消解
- 留下一个真正可执行的最小落点，而非一个好听但做不动的方案

