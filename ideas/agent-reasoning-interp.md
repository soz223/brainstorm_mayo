# 三个候选副线方向（带批判性评估）

> 这些不是"另起炉灶"，而是 A 之外**值得权衡**的工业界友好方向。每个都附实话。

## Q. Radiology Reading Agent

### 是什么
LLM controller 看到 CT，自动调工具（分割、prior 检索、量化、guideline lookup）→ 输出结构化报告。

### 现有最像的工作
- MAIRA-2 (arXiv 2406.04449, Microsoft 2024) — CXR grounded report
- ChEX (ECCV 2024)
- RaDialog
- Med-Gemini (Google 2024)
- 商业：Glass AI / Aidoc / RadAI / Annalise

### 数据 / 评测
| 数据集 | 模态 | 规模 |
|---|---|---|
| MIMIC-CXR | 胸 X-ray | 377k |
| CT-RATE | 胸 CT | 25,692 |
| IU X-Ray | 胸 X-ray | 7,470 |

评测：BLEU / ROUGE / CheXpert F1 / RadGraph F1 / RadCliQ / GPT-4 judge

### 实话（不夸版）
- 红海，MAIRA-2 + startup 已 GA
- "Agent novelty" 难证（reviewer 会怼"去掉某步效果一样"）
- 2D X-ray 占绝对主流；3D CT/MRI agent 相对蓝海但**没 public grounding 数据**
- Mayo 数据加成有限——做 Q 用 MIMIC 就够，**Mayo 用不上**
- **信号 ★★★，不是 ★★★★★**

### 唯一真正的窗口
3D CT/MRI agent + Mayo 内部 grounding 数据 + 真正的多 tool RL。但数据 release 受限。

---

## I. Reasoning FM (o1 for medicine)

### 是什么
FM 输出鉴别诊断推理过程而不只是答案。从 Mayo 多读者报告抽 reasoning trace 训 CoT，最终诊断 / 病理作 RL verifier。

### 现有工作（不少）
- HuatuoGPT-o1 (arXiv 2412.18925) — **纯文本**
- Med-R1 (arXiv 2503.13939) — RL post-train，**文本**
- MedReason, MedThink, OpenBioLLM, Med-Gemini — **基本都文本或 2D X-ray**

### 真正的窗口
**3D imaging-grounded reasoning** 还没人专门做。但要解决：
1. Reasoning trace 数据从哪来（用 GPT-4 改写报告 = 循环依赖）
2. Evaluation 没有客观 verifier（最终 metric 还得 GPT-4 judge）

### 实话
- Medical reasoning 在 NLP 圈卷成红海，**reviewer 标准按 NLP 算**
- 3D + Mayo trace = 有窗口但**评测烂账**
- **信号 ★★★★，不是 ★★★★★**

### 与 A 的关系
A 跑通后，把 reasoning 作为 post-training 阶段加进去——比单做 I 性价比高。

---

## K. Mechanistic Interpretability of Medical FM

### 是什么
拿 Anthropic 那套 SAE + activation patching 应用到医学 FM。问"Merlin 内部 feature 长啥样"。

### 类比锚点
**Anthropic Golden Gate Claude (2024)**：发现 Claude 内部有个 feature 专为"金门大桥"激活，clamping 到 100× 让 Claude 每句话都扯金门大桥。**首次清晰证明大模型不是黑盒**。

### 主流技术（按复杂度排）
1. **Probing Classifier**（最简单）：冻结 FM，从某层抽 activation，linear classifier 预测属性
2. **Activation Patching**：跨 input 替换中间 activation，看哪些是因果重要
3. **Sparse Autoencoder (SAE)**：把稠密 activation 拆成稀疏单义 feature
4. **Circuit Analysis**：feature 之间的因果连接图

### 工具链（基本现成）
- TransformerLens
- SAELens
- nnsight
- probing-utils

### 难度
- **理论创新**（造新方法）→ 拼不过 Anthropic 全职团队
- **应用到新领域**（成熟方法 + 新模型）→ **这就是你能做的**

### 12 周路线图（草稿）
| Week | 内容 |
|---|---|
| 1 | pull Merlin checkpoint，TransformerLens 跑通 |
| 2 | 在某一层训 SAE |
| 3 | GPT-4 自动 label feature（看每个 feature 激活最高的 CT slice） |
| 4 | 找 5–10 个 interesting feature |
| 5–8 | 设计实验证明 feature 因果上控制行为 |
| 9–12 | 写 paper |

### 为什么对求职吸引
- Anthropic 面试敲门砖
- Goodfire AI（专门做 interp 的初创，刚 50M）
- 应用层公司也认（"会拆 FM" = debug 能力强）

### 优势 vs 风险
**优势：**
- 不依赖 Mayo 数据（**用公开 Merlin / CT-CLIP checkpoint 即可**）
- 不需要 train FM
- 12 周可出 paper
- 学术界首发"医学 FM 上的 SAE"是清晰 contribution

**风险（subagent 正在调研，结果未到）：**
- 也许已经有人做过，待 confirm
- 即使没做过，可能存在的原因：医学 FM 没那么有趣（feature 主要就是"器官 X"），出 figure 但缺深度故事
- Anthropic 招人窄

### Subagent 调研结果（2026-05-13）

**bad news：18 个月里已 8–10 篇 SAE 医学 FM paper**

| Paper | 时间 | 目标 | 是否威胁 |
|---|---|---|---|
| **GeoSAE** (2605.01829) | 2026.05 | **3D Brain MRI FM + SAE** | ⚠️ 最直接竞品 |
| **SAIL** (2603.23794) | 2026.03 | 2D CT/MRI slice + DINOv3 | 强 |
| **MedSAE** (2510.26411) | 2025.10 | MedCLIP CXR | 中 |
| **CXR-LanIC** (2510.21464) | 2025.10 | BiomedCLIP CXR | 中 |
| **SAE-Rad** (2410.03334) | 2024.10 | CXR + SAE→报告 | 中（最早） |
| **MAIRA-2 SAE** (2507.12950) | 2025.07 | VLM 文本侧 | 弱 |
| **Mammo-SAE** (2507.15227) | 2025.07 | Mammo-CLIP | 弱 |
| **Pathology SAE / CytoSAE** | 2024.07–25.07 | 2D 病理 tile | 弱 |

**结论：之前说"首发"是错的。**

### 但 3D 体素 medical FM 仍有窗口

真正没人做：
1. Merlin / CT-CLIP / M3FM / RadFM 的 SAE（GeoSAE 只做 brain MRI 自家 FM 且 2D 投影）
2. 跨 medical FM 的 feature universality 研究
3. 3D CT FM 的 activation patching（zero）
4. 3D CT FM steering / Golden Gate 风格演示（zero）

### 难度修正

**中难度**，不是低。三个 rough edge：
1. 3D ViT activations 内存爆（per-volume 8–15k token），需 streaming cache
2. Feature collapse 是真问题（GeoSAE 整篇都在解决）
3. Auto-interp pipeline 不成熟，需 MedGemma + 放射医生 spot check

### 可写 paper 标题（避开 GeoSAE claim）

- "First Sparse Autoencoder Analysis of 3D Volumetric CT Foundation Models"（限定 CT）
- "Cross-Model Feature Universality in Medical Imaging Foundation Models"（多模型 universality）

### 修订评估

| 之前 | 之后 |
|---|---|
| "首发 SAE on medical FM" | ❌ 错，已 8+ paper |
| 难度低 | 中 |
| 信号 ★★★ | 维持 ★★★（不是炸场） |
| Mayo 加成弱 | 维持 |

K 现在更像 GeoSAE 的 **concurrent work**，不是 slam dunk。但 3D CT 窗口真的存在，故事可以讲。

---

## 决策表（更新）

| 方向 | 工业信号 | 实施难度 | 数据风险 | Mayo 加成 |
|---|---|---|---|---|
| **A 纵向 3D FM** | ★★★★ | 中 | 中 | 极强 |
| **K Mech Interp** | ★★★ | 低 | 低 | 不需要 |
| **I Reasoning FM** | ★★★★ | 中高 | 中高 | 中 |
| **Q Radiology Agent** | ★★★ | 中 | 中 | 中 |

### 几种组合
1. **保守 / 单线**：只做 A
2. **快出 paper + 求职**：K 先（4 个月）+ A 主线（10 个月）
3. **2026 hire 关键词全打**：A + 后训 reasoning 阶段（合一篇 paper）
4. **3D agent 红海赌徒**：Q + 自造 3D grounding benchmark
