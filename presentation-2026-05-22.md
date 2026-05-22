# Presentation Plan — 2026-05-22

> 用途：和老师汇报 / 讨论研究方向。语言：slides 英文。长度：~33 页，30+ 分钟（seminar 量级）。
> 工作流：本文件 = deck 计划（逐页）。确认后用 scientific-slides skill 的 `generate_slide_image.py` 逐页生成 PNG，再 `slides_to_pdf.py` 合成 PDF。
>
> **统一格式目标（每条 prompt 都带）**：deep navy background (#0d1b2a), white text, cyan accent (#4cc9f0), warm-amber highlight (#ffb703), clean sans-serif, generous white space, minimal, no decorative clutter, academic.
> **作者署名**：Songling Zhu（默认 K-Dense → 改成用户名）。
>
> 图例：[PHOTO/FIG] = 需附外部真实图片；[SCHEMATIC] = 需画方框+箭头示意图（generate_schematic.py 或 slide prompt 内画）。

---

## 叙事结构（4 个方向）

1. **TimeFM-3D**（主线，详讲，~15 页）= 老师说的 "dynamic VLLM"
2. **Missing-data VLLM**（详讲，~6 页）= 老师第 3 个方向
3. **Diffusion-as-FM / Marigold-Med**（详讲，~5 页）= Round-3 调研出的 N2
4. **Causal VLLM**（末尾略提，~2 页）= 老师第 2 个方向，"我们不熟"

收尾：4 方向对比 + 给老师的 3 个问题 + 下一步。

---

# PART 0 — Framing（3 页）

## Slide 1 — Title
- **Title**: Longitudinal & Generative Foundation Models for 3D Medical Imaging
- **Subtitle**: A Research-Direction Survey & Proposal
- **Author**: Songling Zhu · Advisor meeting · May 22, 2026
- **Visual**: [SCHEMATIC] 背景淡淡一条时间轴上 3 个 3D 脑/胸 volume 缩影，左→右，箭头连接。subtle，不抢标题。
- 备注：开场一句——"老师给了 3 个方向，我把它们各自调研到底，今天汇报哪个能做、哪个卡住。"

## Slide 2 — Agenda
- **Title**: Four Directions on the Table
- **Content**（4 个带编号的卡片）:
  1. TimeFM-3D — longitudinal 3D imaging FM  → **main line, detailed**
  2. Missing-data VLLM — missing modality as signal  → surveyed
  3. Diffusion-as-FM — generative model as backbone  → surveyed
  4. Causal VLLM — counterfactual reasoning  → brief / not our strength
- **Visual**: [SCHEMATIC] 4 个横排卡片，第 1 个 cyan 高亮放大，后 3 个灰一点。
- 备注：告诉老师今天的时间分配——1 详、2&3 中、4 略。

## Slide 3 — How We Got Here
- **Title**: From Three Suggestions to One Converged Line
- **Content**: advisor 的 3 个方向 → 6 轮 brainstorm + 40+ 候选 + 多轮文献调研 → 收敛
- **Visual**: [SCHEMATIC] 漏斗图：顶部 "Advisor: dynamic / causal / missing-data" 三入口 → 中间 "40+ candidate directions, 6 survey rounds" → 底部窄口 "TimeFM-3D + neighbors"。方框+箭头。
- 备注：诚实说——继续发散边际收益≈0，瓶颈转为 commit + 跑实验。

---

# PART 1 — TimeFM-3D（详讲，15 页）

## Slide 4 — The Clinical Problem
- **Title**: Patients Are Sequences, Not Snapshots
- **Content**: 一个病人随访 = 时间轴上多张 3D CT/MRI；间隔不规则（3 月 / 6 月 / 1 年）；临床决策（进展？反应？复发？）本质是看「变化」
- **Visual**: [PHOTO/FIG] 真实纵向影像示例：同一病人 3 个 timepoint 的轴位 CT/MRI（肺结节或脑转移，可见病灶随时间变化）。**需找一张公开纵向影像图**（NLST / Yale-Brain-Mets 论文图）。
- 备注：用户兴趣 = brain + multimodal，举例就用脑转移随访。

## Slide 5 — The Gap in Today's Medical FMs
- **Title**: Current Foundation Models See One Timepoint
- **Content**: Merlin / CT-CLIP / CT-FM / RadFM / M3FM 全是 single-timepoint；要么单张，要么把时序塞进 EHR label，影像本身仍静态
- **Visual**: [SCHEMATIC] 对比图：左 "Existing FM" 单个 volume → encoder → embedding；右 "What's missing" 多个 volume 序列 → ? 。右侧打问号高亮。
- 备注：这是 white space 的第一刀。

## Slide 6 — Why a Foundation Model At All
- **Title**: Pretrain Once, Transfer Everywhere
- **Content**: FM 范式 = 大规模自监督预训练学通用表征 → 少量标注 fine-tune 到多任务；解决医学标注稀缺 + one-model-many-tasks
- **Visual**: [SCHEMATIC] 经典两段式：上 "Self-supervised pretraining (huge unlabeled data)" → 中 "Reusable representation" → 下 fan-out 到 4 个下游任务方框（risk / response / recurrence / report）。方框+箭头。
- 备注：回应老师/自己之前的疑问"为什么需要大模型学时序"——因为标注少 + 想一个模型覆盖多任务。

## Slide 7 — Survey: The Longitudinal Landscape
- **Title**: Who Else Is Working on This
- **Content**: 直接竞品对比表（威胁度排序）

| # | Work | Input | Key limitation |
|---|---|---|---|
| 1 | TTE Pretraining (Stanford) | single CT | timeline in labels, image not a sequence |
| 2 | SSL-AD | 3D sequence | brain MRI only, ~3.2k patients, small |
| 3 | CRONOS | multi-timepoint | forecaster, not an FM; no text/EHR |
| 4 | Temporal Flow Matching | 3D sequence | generative, not a representation FM |
| 5 | Merlin (Nature 2026) | single CT + EHR | image static, timeline in EHR labels |
| 6 | BioViL-T / MAIRA-2 (Microsoft) | 2 chest X-rays | 2D, not 3D |

- **Visual**: 表格本身即视觉；最后一行 BioViL-T 用 amber 高亮（下一页要 deep-dive）。
- 备注：结论——没人 ship 过 "FM-scale + 多器官 + 3D 序列 + interval-aware SSL + multimodal" 全套。

## Slide 8 — Survey: Maturity by Sub-area
- **Title**: Where the Field Is Saturated — and Where It's Empty
- **Content**: 成熟度表

| Sub-area | Maturity | Representative |
|---|---|---|
| Single-timepoint 3D FM | Saturated | Merlin, CT-CLIP, CT-FM, RadFM, M3FM |
| Single image + EHR-label timeline | Taken (Stanford) | TTE Pretraining |
| 2D longitudinal SSL | Mature (mostly CXR) | BioViL-T, MAIRA-2, L-MAE |
| **3D longitudinal SSL** | **~Empty (the gap)** | SSL-AD (brain-only, small) |
| 3D longitudinal generation | Heating up | BrLP, SADM, Temporal Flow Matching |

- **Visual**: [SCHEMATIC] 也可做成热度条（红=饱和 → 绿=空）。第 4 行 amber 高亮。
- 备注：一句话——3D 纵向 SSL 几乎零，这就是我们的口子。

## Slide 9 — The White Space
- **Title**: TimeFM-3D — The Untaken Quadrant
- **Content**: 定位——native 吃同一病人多张 3D volume + interval-aware SSL + multimodal，作 FM（不是 forecaster）
- **Visual**: [SCHEMATIC] 2×2 矩阵：X 轴 = single-timepoint → longitudinal；Y 轴 = 2D → 3D。三格填竞品（2D-single: CT-CLIP类；2D-longi: BioViL-T；3D-single: Merlin），右上 3D-longi 格空着、cyan 高亮、写 "TimeFM-3D"。
- 备注：这张是整个 part 1 的锚图。

## Slide 10 — Deep-Dive: BioViL-T（the one paper to study）
- **Title**: Deep-Dive — BioViL-T (Microsoft, CVPR 2023)
- **Content**: 最接近的 2D 纵向 FM。它做的事：(a) 现有 VLP 只用单图做 InfoNCE；(b) 丢掉时序连接 → image-text 对齐次优；(c)(d) BioViL-T 引入 prior+current image，做 spatiotemporal modelling，把 "unchanged / worsening" 这类时序语义学进来
- **Visual**: [PHOTO/FIG] **用户已提供的 BioViL-T Figure 1**（existing vs proposed，affinity matrix，spatial vs spatiotemporal modelling）。需保存为 `figures/biovilt-fig1.png` 后 `--attach`。
- 备注：这是"挑一篇讲"的那篇。讲清楚 (a)(b)(c)(d) 四格在说什么。

## Slide 11 — BioViL-T: What It Proves, What It Leaves Open
- **Title**: BioViL-T Validates the Idea — in 2D
- **Content**: 
  - ✅ 证明了：时序连接 = 免费的额外监督信号，提升表征 + 下游 SOTA
  - ⚠️ 局限：只 2 张图（prior+current），只 2D 胸片，只一个解剖部位
  - → 3D volume、>2 timepoints、不规则 Δt、多器官、多模态——全部未做
- **Visual**: [SCHEMATIC] 左 BioViL-T "2D · 2 timepoints · CXR" vs 右 TimeFM-3D "3D · K timepoints · multi-organ · irregular Δt"，箭头表示 generalization。
- 备注：把 deep-dive 自然接到我们的方案。

## Slide 12 — TimeFM-3D: Architecture
- **Title**: TimeFM-3D — Native Multi-Timepoint 3D Encoder
- **Content**: pipeline——每个 timepoint 的 volume → 3D ViT/SwinUNETR → tokens（+ Fourier(Δt) 时间编码）→ Δt-scaled cross-visit Temporal Transformer → unified trajectory embedding
- **Visual**: [SCHEMATIC] **主架构图**。横向 pipeline：3 个 3D volume 方框（标 t1/t2/t3, Δt 标注）→ 各自进 "3D Volume Encoder"（共享权重）→ token + "Fourier(Δt)" 小方框相加 → "Temporal Transformer (Δt-aware attention)" 大方框 → "Trajectory Embedding" → fan-out 下游。方框+箭头，画漂亮。
- 备注：这是全场最重要的一张图，重点画。

## Slide 13 — The Three SSL Objectives
- **Title**: How It Learns — Three Self-Supervised Objectives
- **Content**:
  - **IA-MVM** (Interval-Aware Masked Volume Modeling): mask 中间一个 volume，用前后重建；Δt 短→高 mask 比率，Δt 长→预测 delta
  - **NVP-LS** (Next-Volume Prediction in Latent Space): 给 V1..V_{k-1} 预测 V_k 的 latent
  - **CMTC** (Cross-Modal Temporal Contrast): volume@t ↔ report/EHR window 配对，InfoNCE
- **Visual**: [SCHEMATIC] 三栏，每栏一个小示意图：①序列中间一格打 mask + 双向箭头重建；②序列→预测下一格（虚线框）；③volume 与 text 框之间双向对齐 + 推远不同 timepoint。
- 备注：三个目标各一句话，配图最清楚。

## Slide 14 — Handling Irregular Time Intervals
- **Title**: Time Is Continuous and Irregular — Model It Explicitly
- **Content**: 真实随访间隔不规则（3mo / 7mo / 14mo）；用 Fourier / Time2Vec 连续时间编码 + Δt-scaled attention（间隔越长，cross-visit attention 衰减），借鉴 CRONOS / TaViT
- **Visual**: [SCHEMATIC] 时间轴上 3 个不等距点，标 Δt₁=3mo / Δt₂=7mo；下方 "Time2Vec encoding" 方框 → 注入 attention；attention 权重随 Δt 衰减的小曲线。
- 备注：这是和"把序列当等距"的朴素做法的区别点。

## Slide 15 — Reasoning Post-training
- **Title**: From Representation to Decision — Verifier-Guided Reasoning
- **Content**:
  - Phase 1 — SFT CoT：从临床报告抽 reasoning trace，监督模型输出 `<thinking>...</thinking><answer>...</answer>`
  - Phase 2 — RL (GRPO)：reward = 最终答案对不对（vs 病理 / RECIST / mortality 真实 outcome）+ reasoning 步骤是否合理
  - 关键：verifier 是**真实临床 outcome**，绕开 "reasoning 评测烂账"
- **Visual**: [SCHEMATIC] 两段 pipeline：上 "SFT: report → CoT trace"；下 "GRPO: sample K chains → verifier (pathology/RECIST) → reward → update"。方框+箭头。
- 备注：这一页命中 2026 求职关键词（reasoning / post-training / GRPO）。

## Slide 16 — Data: Usable Now
- **Title**: Data We Can Start With
- **Content**: 

| Dataset | Patients | TP | Modality | Access |
|---|---|---|---|---|
| NLST | 26,722 (LDCT arm) | 3 | chest LDCT | 4–12 wk DUA |
| ADNI 1/2/3/4 | ~3,500+ | 2–10+ | brain MRI+PET | days |
| OASIS-3 | ~1,378 | multi | brain MRI | days |
| AIBL / PPMI | ~350 / ~400 | 3+ | brain MRI | days |
| Yale-Brain-Mets | 1,430 | mean 8 | brain MRI | instant, no approval |
| CT-RATE | 21,304 (~3–4k ≥2TP) | mostly 1 | chest CT + reports | **open** |

- **Visual**: 表格即视觉；Yale-Brain-Mets + CT-RATE（最快可用）amber 高亮。
- 备注：prelim 实验先用 Yale-Brain-Mets（即下、零审批、命中 brain）。

## Slide 17 — Data: Possibly Usable / Needs Access
- **Title**: Data That Would Scale It Up — Pending Access
- **Content**:

| Dataset | Patients | TP | Note |
|---|---|---|---|
| **Mayo Clinic (ours)** | TBD | longitudinal multimodal | DUA in progress — the moat |
| UK Biobank repeat | ~20k 2nd visit | 2 | paid DUA, 8–16 wk |
| NACC-SCAN | 54k+ | multi | multi-center brain |
| ABCD | ~11,800 | ≤4 | adolescent brain, IRB |
| INSPECT (Stanford) | 19,438 | mostly 1 | CTPA + 5-yr EHR, eval gold-standard |
| ISPY1/2, LUMIERE, UPenn-GBM | small | 4–7 | treatment-response eval |

- **Visual**: 表格；Mayo 行 cyan 高亮（独占数据 = 护城河）。
- 备注：诚实——真正瓶颈是数据 access，不是 compute（有 20×H200）。

## Slide 18 — Preliminary Plan
- **Title**: Preliminary Experiment & Timeline
- **Content**: 
  - 先在 Yale-Brain-Mets 跑 prototype（100M params, IA-MVM + NVP-LS + CMTC），2 周验证 pipeline，W&B 监控
  - M1–3 DUA + curation + 复现 baseline；M4–6 完整三 SSL + scale；M7–9 reasoning post-training；M10–12 全数据 + 评测 + 写 paper
  - 算力：20×H200 充足
- **Visual**: [SCHEMATIC] 横向 timeline 甘特条，4 个 phase 色块。
- 备注：给老师一个"我下个月能动手"的具体落点。

---

# PART 2 — Missing-data VLLM（详讲，6 页）

## Slide 19 — Direction 2: VLLM with Missing Data
- **Title**: Direction 2 — When Modalities Are Missing
- **Content**: 老师第 3 个方向；真实临床数据总是不全（没做 PET、缺一个 MRI 序列、报告缺失）；问题——FM 缺模态时会怎样？
- **Visual**: [SCHEMATIC] 一个病人多模态卡片（CT / MRI / PET / report），其中 2 个打叉缺失 → 喂进 FM → 输出打问号。
- 备注：过渡——这是老师另一个方向，我也调研到底了。

## Slide 20 — Survey: Six Sub-angles
- **Title**: What's Solved, What's Open
- **Content**:

| Sub-angle | Status |
|---|---|
| Method landscape (masked modeling, missing-aware prompts) | closed-set mostly solved |
| Uncertainty / calibration | taken (AECF, 2025) |
| Cross-modal imputation | red ocean (PSNR-chasing) |
| **MNAR / informative missingness / causal** | **open — the gap** |
| Benchmark / evaluation | MCAR assumption overestimates robustness |
| Generative MLLM × missing data (medical) | half-empty |

- **Visual**: 表格；第 4 行 amber 高亮。
- 备注：6 个子角度 5 个独立指向同一处。

## Slide 21 — The White Space: Missingness as Signal
- **Title**: The Missing Pattern Itself Carries Information
- **Content**: 现有方法把缺失当随机噪声去 robust 掉（MCAR 假设）；真实临床缺失是非随机的（MNAR）——医生没开 PET，是因为本来就低度怀疑转移。"缺什么" = 诊断信号
- **Visual**: [SCHEMATIC] 两条路对比：上 "MCAR view: missing = random noise → drop it"；下 "MNAR view: missing ← clinical decision → it's a signal"。箭头方向不同。
- 备注：这是这个方向唯一真留白。

## Slide 22 — Why Naive Imputation Is Dangerous
- **Title**: Filling In Missing Modalities Can Inject Bias
- **Content**: MNAR 下硬补全 = 对 collider 做条件 → selection bias；硬补肿瘤可能"造出"不存在的诊断证据（hallucination 风险）；正确做法——建模缺失机制，不盲目补
- **Visual**: [SCHEMATIC] 简单因果图：disease → finding ← (missingness R)；标 collider；箭头说明补全在 collider 上条件化引入偏。
- 备注：回应自己之前的质疑——"硬补合理吗"，答案是不一定。

## Slide 23 — The Catch
- **Title**: The Honest Problem With This Direction
- **Content**: 简单版（robustness via dropout）= 红海，没 novelty；有 novelty 的版本（MNAR / m-graph / collider-aware）**需要因果理论**——和"我们不碰因果"冲突
- **Visual**: [SCHEMATIC] 岔路：一条 "Simple: robustness" → 死路（红海）；一条 "Novel: MNAR/causal" → 门挡着写 "needs causal theory"。
- 备注：诚实地把矛盾摆给老师。

## Slide 24 — Direction 2 Verdict
- **Title**: Where Direction 2 Stands
- **Content**:

| Option | Scope | Timeline | Risk |
|---|---|---|---|
| Fast | missing-aware text prompt to existing medical VLM | 2–3 mo | low novelty |
| Benchmark | realistic-missingness benchmark (ADNI/TCGA natural missing) | 3–4 mo | medium |
| High-ceiling | full informative-missingness VLLM (needs causal) | 8–12 mo | conflicts with "no causal" |

- 结论：⏸ 待问老师——他指的是哪个版本？
- **Visual**: 表格。
- 备注：把球踢回给老师。

---

# PART 3 — Diffusion-as-FM / Marigold-Med（详讲，5 页）

## Slide 25 — Direction 3: Generative Model as Backbone
- **Title**: Direction 3 — Can a Generative Model Be the Backbone?
- **Content**: 主流 FM 用 contrastive / MAE 学表征；另一条路——训一个 diffusion 生成模型，用它的中间表征当 backbone 做感知任务（分割/检测/检索），不是用来合成
- **Visual**: [SCHEMATIC] 对比：上 "Diffusion as generator: noise → image"；下 "Diffusion as representation: image → frozen intermediate features → perception head"。
- 备注：这是 Round-3 调研出的 N2。

## Slide 26 — The Marigold Idea
- **Title**: Marigold — Repurposing Diffusion Features
- **Content**: Marigold（CVPR 2024）证明：自然图像上预训练的 diffusion，frozen 后接轻量 head，能做深度估计等密集预测，超过专门模型。问题——医学 3D 能不能照搬？
- **Visual**: [PHOTO/FIG] Marigold 论文示意图（如能找到公开图）；或 [SCHEMATIC] frozen diffusion U-Net → 多层 feature → 轻 head。
- 备注：讲清楚 Marigold 范式，再问"医学版有没有人做"。

## Slide 27 — Survey: The Medical Landscape
- **Title**: Half-Empty, Not Empty
- **Content**: 核实结论——
  - frozen 3D 医学 diffusion 当 backbone 的**核心**已被 **Li et al. (arXiv 2501.19265, Jan 2025)** 占（frozen diffusion → 3D CT 器官分割）
  - DiffuGTS (CVPR 2025)、LDAE 相邻
  - 仅剩：系统 vs DINOv2/MAE head-to-head + 多任务（分类/检索）+ CT/MRI 多模态——没人做
- **Visual**: [SCHEMATIC] 占位地图：一块大区域标 "Li et al. 2501.19265 — occupied"，旁边小空隙标 "head-to-head benchmark — open"。
- 备注：原来以为是空白，核实后是半空。

## Slide 28 — Direction 3 Verdict
- **Title**: Where Direction 3 Stands
- **Content**: ⬇ 降级——不是新范式，是"差异化于 2501.19265 的 empirical study"，MICCAI 量级、modest；**最佳定位 = 作 TimeFM-3D 的评测探针 / 基建**，不是独立 flagship
- **Visual**: [SCHEMATIC] N2 一个小方框，箭头汇入 TimeFM-3D 大方框，标 "evaluation probe"。
- 备注：诚实——这个方向能用，但是配角。

---

# PART 4 — Causal VLLM（略提，2 页）

## Slide 29 — Direction 4: Causal VLLM
- **Title**: Direction 4 — Causal / Counterfactual VLLM
- **Content**: 老师第 2 个方向；问"如果给了别的治疗，影像会怎样"——counterfactual / treatment effect；与 Mayo 纵向数据契合
- **Visual**: [SCHEMATIC] factual vs counterfactual 两条分支（同一 baseline，治疗 A → 观测；治疗 B → 反事实）。
- 备注：略讲，点到为止。

## Slide 30 — Direction 4 Verdict
- **Title**: Honest Assessment of Direction 4
- **Content**: 因果推断理论门槛高（confounding / identifiability / 半参数效率）；不是我们目前的强项；⏸ 搁置——除非和 missing-data 的 m-graph 合并（但那又把 missing-data 拖进因果）
- **Visual**: 纯文字 + 一个 "shelved" 标记。
- 备注：直说不熟、不碰理论。

---

# PART 5 — Synthesis（3 页）

## Slide 31 — Summary
- **Title**: Four Directions — Side by Side
- **Content**:

| Direction | Verdict | Why |
|---|---|---|
| TimeFM-3D | ✅ main line | real white space, fits brain+multimodal, can start now |
| Missing-data VLLM | ⏸ pending | novel version needs causal — conflict |
| Diffusion-as-FM | ⬇ downgraded | core occupied; good as eval probe only |
| Causal VLLM | ⏸ shelved | high theory barrier, not our strength |

- **Visual**: 表格；第 1 行 cyan 高亮。
- 备注：一张表收口。

## Slide 32 — Questions for You
- **Title**: Three Things I Need to Confirm
- **Content**:
  1. 刘老师 project 到底有什么？"基于"它成不成立？
  2. "Missing data" 您指哪个版本——简单 robustness 还是要因果的 informative-missingness？
  3. "dynamic" 是不是就是 TimeFM-3D 这个意思？如果是 → 我直接开做
- **Visual**: [SCHEMATIC] 3 个问号卡片。
- 备注：这页是这次汇报的真正目的。

## Slide 33 — Next Steps
- **Title**: What I'll Do Next
- **Content**:
  - 走 Mayo DUA + 下 Yale-Brain-Mets / CT-RATE
  - 2 周内跑 TimeFM-3D prototype（IA-MVM + NVP-LS + CMTC）on 20×H200
  - 复现 Sybil / TTE / Merlin baseline
  - 等老师对上面 3 个问题的回答再定 missing-data 取舍
- **Visual**: [SCHEMATIC] 4 步 checklist。
- 备注：结束语——方向已收敛，下一步是动手 + 等老师确认。

---

## 待办 / 阻塞

- [ ] **API key**：`generate_slide_image.py` 用 Nano Banana Pro，需 `OPENROUTER_API_KEY`，当前未设置。等用户提供（即用户说的"我会给你一个工具"）。
- [ ] **BioViL-T Figure 1**：用户已贴图，需存为 `figures/biovilt-fig1.png`（Slide 10 要 `--attach`）。
- [ ] **Slide 4 纵向影像图**：需找一张公开纵向 CT/MRI 示例图。
- [ ] **Slide 26 Marigold 图**：可选，找公开图或改用纯 schematic。
- [ ] 确认作者署名 = Songling Zhu。
- [ ] 确认配色方案（当前定 deep navy + cyan + amber）。

## 生成流程（确认后执行）

```bash
export OPENROUTER_API_KEY='<key>'
# 逐页生成，每页 --attach 上一页保持风格统一
python generate_slide_image.py "<prompt>" -o slides/01_title.png
python generate_slide_image.py "<prompt>" -o slides/02_agenda.png --attach slides/01_title.png
# ... 33 页
python slides_to_pdf.py slides/*.png -o presentation-2026-05-22.pdf
```
