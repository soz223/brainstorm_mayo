# "VLLM with missing data" 深度调研 + 合成

> 6 个 subagent 并行，各钻一个子角度，literature-review + 留白分析。日期 2026-05-21。
> 缘起：老师建议"基于刘老师 project 做 dynamic / causal / **VLLM with missing data**"。本文专调第三个。

---

## 6 个子角度的发现

### ① 方法 landscape
闭集小模态（2-4 个）下"单模型容任意子集缺失"**基本解决**（masked modeling 预训练 + 容缺 attention/prompt）。代表：HEALNet、BM-MAE、PhysioOmni、MUSE、Missing-aware Prompts。
**5 条真留白**：预训练即缺失（现有方法预训练仍需全模态）/ 开放模态集 / **MNAR 结构化缺失** / 生成-vs-不生成判据 / 缺失感知不确定性。

### ② 不确定性 / 校准
"provable calibration as function of present modalities" 这个我们之前猜的留白——**已被占**（AECF, arXiv 2505.15417，含单调性公理 + 跨子集 ECE 上界）。临床实证（2603.02719）也证了"缺模态→overconfident"。
**剩的缝隙**：把 conformal 的 mask-conditional coverage 保证嵌进 modality-incomplete 训练 + 给 deferral 配可证 risk 证书。

### ③ 跨模态生成 / imputation
朴素"任意缺失 MRI 互补"= **红海**（AMM-Diff/DiffM4RI/MISA-LDM），刷 PSNR 没空间。文献公认硬补有"硬造诊断证据"幻觉风险（肿瘤补错）。
**真留白**：带不确定性、**知道自己补得准不准、据此选择性补/拒补**的诚实 imputation。→ 正面回应你"硬补合理吗"的质疑：质疑是对的，朴素补全确实危险。

### ④ MNAR / informative missingness / 因果视角（**关键**）
- EHR 单模态 informative missingness = **红海**（GRU-D 把"哪个 lab 没测"当信号已做透）
- 缺失的因果（Mohan-Pearl **m-graph**：给每个会缺的变量加 missingness 节点 R）= 理论完备**但停在统计/流病社区**
- **Multimodal FM / VLM 里"为什么这个模态缺" = 明确留白**：现有方法全把 missing modality 当"需 robust 掉的随机噪声"；没人把"模态缺失模式当诊断信号"+ collider-aware 建模缺失机制。**GRU-D 精神 + m-graph 从没被抬到 multimodal FM 的模态层级。**

### ⑤ 评测 / benchmark
无跨领域公认 benchmark；主流 synthetic dropout = **MCAR 假设**，**系统性高估鲁棒性**（抹掉了真实 MNAR 的 informative-missingness 信号 + 对评测过拟合）。
**真留白**：用 ADNI/TCGA/MIMIC 的**天然缺失**（非人为 mask）+ MNAR 协议 + calibration/稳定性多指标，造一个 realistic-missingness benchmark。

### ⑥ VLM / MLLM / FM 时代
经典 prompt-based 补缺（Missing-aware Prompts 系）= **红海**。但**"生成式 MLLM / 医学 VLM × missing data" = 半空偏空**，医学侧接近空白（能数出的强工作仅 MissRAG ICCV'25、DiA-gnostic、Dai-2026 数篇）。
→ **这正是 "VLLM with missing data" 项目名最对口的空间**。FM 范式带来的新问题：FM 缺图像会**沉默退化靠文本先验编造**、不报警；FM 不知道"没做这项检查"本身是信号。
最快切入：**missing-aware 文本化**——把"缺什么、为何缺"写成自然语言喂给已有医学 VLM，零改架构。

---

## 收敛的核心留白（6 个 agent 里 5 个独立指向同一处）

> **把"缺失模式本身"当成信息信号，在 multimodal FM / VLM 里，并且 MNAR / 因果-aware 地处理。**

所有现有工作都在做 **"robustness via random dropout"**——假设缺失随机（MCAR），把 missing 当噪声去 robust 掉。**没人做**：
1. "**这个模态缺失**"这件事本身是诊断信号（医生没开 PET → 本来就低度怀疑转移）
2. 缺失是**非随机的（MNAR）**——缺失机制由临床决策驱动
3. MNAR 下朴素补全会引入 **collider bias**（补全=对 collider 做条件→selection bias）
4. FM 缺模态时**沉默幻觉**，不知道也不报告自己更没把握

---

## 合成出的推荐方向

> **Informative-Missingness VLLM：把"为什么某模态缺失"建模成诊断信号 + MNAR/collider-aware 融合**

基于刘老师的 VLLM（backbone 复用），加：
- **(a) Modality-availability pattern 作显式可学习 token** —— GRU-D 的"mask 当信号"精神，抬到模态层级。"哪些模态在场"这个二进制向量本身喂进 FM
- **(b) m-graph of missingness** —— 给每个模态的在场与否加 missingness 节点，建临床先验因果图（low suspicion → no PET），用 recoverability 理论判定"补全某模态再预测"何时有偏
- **(c) Collider-aware 融合** —— 补全/对比损失里加去偏校正
- **(d) 诚实不确定性** —— 缺得多→输出更不确定且 calibrated（接子角度②的 mask-conditional conformal 缝隙）
- **(e) 评测** —— 用 ADNI/TCGA 天然缺失做 realistic-missingness benchmark（子角度⑤）

**为什么这个方向强**：
1. **6 个 agent 独立调研，5 个指向 MNAR/informative-missingness 是留白** —— 不是巧合
2. **它把老师三个方向里的两个合并了**：missingness 机制本身是因果对象（m-graph）→ **"causal VLLM" 和 "VLLM with missing data" 在这里是同一件事**。等于一个方向同时命中老师两个建议
3. **正面化解你的质疑**："数据缺了硬补合理吗"——答案是"MNAR 下硬补确实有偏，所以我们不硬补，我们建模缺失机制"。你的直觉变成了方法的出发点
4. **Mayo 数据天然契合**：真实临床数据就是 MNAR-缺失的
5. 跨界成本低——复用刘老师 VLLM，不从零

---

## 三档落地选择

| 选择 | 内容 | 工期 | 风险 |
|---|---|---|---|
| **快**（low-risk） | Missing-aware 文本化：把"缺什么/为何缺"写成自然语言喂给已有医学 VLM + 缺模态校准/拒答 | 2-3 月 | 低，零改架构，但 novelty 偏轻 |
| **中**（benchmark） | Realistic-missingness benchmark：ADNI/TCGA 天然缺失 + MNAR 协议 + 多指标 | 3-4 月 | 中，需"真实数据+MNAR协议+多指标"三合一才够 novelty |
| **高 ceiling** | 完整 Informative-Missingness VLLM（上面 a-e） | 8-12 月 | 中高，但留白最实、命中老师两个方向 |

建议：**高 ceiling 方向作主线**，但**先用"快"那档（missing-aware 文本化）2-3 个月出一个 proof-of-concept / workshop**，验证"缺失模式当信号"确实有增量，再 scale 到完整版。

---

## 诚实 caveat

- 子角度②（校准）已被 AECF 占——别走纯 calibration 路线
- 子角度①③⑥的"经典/prompt/朴素补全"都是红海——别碰
- m-graph + collider bias 涉及**因果理论**——门槛中等偏高（但比纯 CATE 估计低，属"用因果图判定可识别性"，不是"推半参数效率界"）
- 仍取决于**刘老师的 VLLM 是什么**——它吃几个模态、是不是医学、缺一个会怎样，决定 a-e 哪些能直接加
- arXiv 2026 编号（2602/2603/2605 等）多为预印本，写 proposal 前需联网核实最终版
