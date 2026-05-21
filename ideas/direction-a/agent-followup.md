# Agent 方向（TimeFM-3D 的 follow-up paper）

> ⚠️ **本文基于 subagent 知识库调研（截至 2026-01），联网工具当时被环境拒，未核实**。
> arxiv 编号 / venue / 方法细节**写进 proposal 前必须自己联网查**。标 [需核实] 的尤其要查。
> 战略分析（留白排名、novelty 逻辑）不依赖具体编号，仍可信。

## 背景

用户想要 agent 方向。已有主线 TimeFM-3D（纵向 3D 医学影像 FM）。Agent 方向最好**复用 TimeFM-3D 作 backbone/tool**，当 follow-up paper。

## 8 个 agent 子方向 + 留白排名

| 排名 | 子方向 | 状态 | 代表工作（[需核实]）|
|---|---|---|---|
| 🟢 #1 | **纵向/监控 agent** | **接近真空白** | 几乎无正式 paper |
| 🟢 #2 | 3D imaging FM 作核心 tool 的 tool-use agent | 空白 | MMedAgent 零星 |
| 🟡 #3 | 纵向 3D 影像 agent benchmark | 半空 | ABRA / MedAgentBench [需核实] |
| 🟡 #4 | trial matching 影像入排自动化 | 半空 | TrialGPT (NIH) 偏文本 |
| 🟡 #5 | 带真实 3D 影像证据的多模态 tumor board | 半空 | MDAgents 偏文本 |
| 🟡 #6 | 3D FM 嵌入证据链的 CDS agent | 半空 | MedAgent-Pro [需核实] |
| 🟠 #7 | 影像 discovery agent | 半红 | SPARK (Nat Med 2026) [需核实] |
| 🔴 #8 | radiology reporting agent | **红海** | MAIRA-2 / RaDialog / Glass AI |

## 核心洞察：agent paper 怎么有真 ML contribution

**通病**：90% medical agent paper 是 prompt + 工具编排，**零可训练参数** → reviewer 必怼"去掉某 step 效果一样，ML contribution 在哪"。

**范例：DoctorAgent-RL**（RL-trained medical agent，[arxiv 编号需核实，约 2505.xxxxx]）
- 把"医生 agent 问诊策略"建成 **RL 问题**：医生 agent vs 病人模拟器（LLM 扮演）多轮交互
- reward = 诊断正确 + 问诊效率（轮数惩罚）+ 信息增益
- 病人模拟器自动生成轨迹，避开人工标注瓶颈
- **贡献是 learned policy** → "去掉 step"攻击无效

**有真 ML contribution 的少数**：DoctorAgent-RL（RL 策略）✅、AMIE（self-play 数据 + 微调）✅、MDAgents（自适应路由，弱）。其余基本纯编排。

→ **铁律：agent 要可发顶会，决策策略必须可训练（RL / DPO / 过程奖励），不能纯 prompt 编排。**

## 推荐方向：纵向 3D 影像监控 Agent

> **"Longitudinal Imaging Surveillance Agent: A Verifier-Trained Policy for Follow-up Decision-Making"**

### 定位
一个 agent，把 **TimeFM-3D 当 perception tool**，维护病人多 timepoint CT/MRI 时间线：
```
新扫描进来
  → agent 调 TimeFM-3D 算变化表征（vs 历史）
  → 自主决策: 稳定 / 安排短期复查 / 预警进展 / 触发 tumor board
  → 输出决策 + reasoning
```

### 怎么防"去掉 step 一样"的怼
照 DoctorAgent-RL 思路 —— **把"何时复查/何时预警"建成可训练 RL policy**：
- state = 病人时间线 + TimeFM-3D 当前表征
- action = {稳定观察, 短期复查, 预警进展, 升级 tumor board}
- reward = 早发现真进展（+）− 不必要扫描（−）− 漏诊延迟（−−）
- verifier = 真实 outcome（病理 / RECIST / 后续确诊进展）

→ 贡献是 **learned surveillance policy**，不是 pipeline 编排。

### 配套：自带 benchmark
同篇放出 **纵向 3D 影像 agent benchmark**（基于 Mayo 纵向数据 + 公开 NLST/Yale）：
- 任务：多 timepoint CT 上的随访决策
- benchmark + method 一篇出 → 引用 + 影响力双收

### 数据护城河
Mayo 纵向多 timepoint 3D 影像 = 稀缺资源。通用 agent 组（OpenAI/DeepMind）做不了这个——他们没有纵向临床随访数据。

### 与 TimeFM-3D 的关系
- **Paper 1**: TimeFM-3D（FM 本体，预训练 + reasoning post-training）
- **Paper 2 (本方向)**: Surveillance Agent，复用 TimeFM-3D 作 tool
- 两篇共享 backbone，效率最高

## 次选

若想更快出成果、方向更窄：
- **Trial-matching 影像入排判定 agent**：用 TimeFM-3D 自动判 RECIST 可测量病灶 / 新发转移（试验入排里影像条件目前全靠文本近似）。窄、空白、临床价值清晰。

## 不要做

- ❌ radiology reporting agent（红海，MAIRA-2 占满）
- ❌ 纯多 agent QA（MedQA 刷分，难证 novelty）
- ❌ 任何纯 prompt 编排无可训练参数的 system

## 工具：Claude Agent SDK

要 build 这个 agent，**Claude Agent SDK 是现成框架**（定义 agent、编排、工具调用）。不用从零写 orchestration。

## TODO（联网恢复后核实）

- [ ] DoctorAgent-RL 真实 arxiv 编号 + 方法细节
- [ ] SPARK (Nat Med 2026)、ABRA、MedAgent-Pro、EHR agent (ICLR 2026) 是否真存在 + 编号
- [ ] "纵向监控 agent 真空白"——联网确认有没有 2025-2026 新工作抢先
- [ ] MedAgentBench / AgentClinic 等 benchmark 现状
