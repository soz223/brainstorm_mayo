# Stage 2: Trend 分析

> 基于 Stage 1A (ML 顶会 ~85 篇) + Stage 1B (医学顶刊 ~95 篇) + Direction A lit review (~75 篇) + dataset deep-dive (~80 个) 的综合分析。
> 目的：抽出 cluster 模式 / 哪个方向在火 / 谁在领导 / 谁来买单 / 留白在哪里。

---

## 1. 整体 "热度" 雷达

### 1.1 ML 顶会的火点（从 high → low）

| Cluster | 热度 | 量级 | 谁领导 |
|---|---|---|---|
| **推理 / o1 / TTC** | 🔥🔥🔥🔥🔥 | DeepSeek-R1 引用 1000+，几乎每周新 paper | OpenAI / DeepSeek / 阿里 Qwen / Stanford |
| **开源 VLM 追赶 GPT-4o** | 🔥🔥🔥🔥 | Qwen2.5-VL / InternVL 3.5 / Molmo / Pixtral | Alibaba / Shanghai AI Lab / Mistral / NVIDIA |
| **DeepSeek MoE + MLA** | 🔥🔥🔥🔥 | V3 / V2 / R1 全用 | DeepSeek 独立一家 |
| **Agent / GUI / Computer Use** | 🔥🔥🔥🔥 | NeurIPS 2025 workshop 45 篇 | Anthropic / OpenAI / Microsoft |
| **Diffusion → Flow Matching** | 🔥🔥🔥 | SD3 ICML Best Paper, Flux 接力 | Stability / Black Forest Labs |
| **解释性 SAE** | 🔥🔥🔥 | Scaling Monosemanticity 引用 viral | Anthropic 主导 |
| **Post-training (DPO/SimPO/KTO)** | 🔥🔥🔥 | 替代 RLHF 主流 | Stanford / Princeton / KAIST |
| Speculative decoding | 🔥🔥 | EAGLE-2/Medusa-2 | 各 startup |
| Mamba / SSM | 🔥🔥（**降温**）| Mamba-2 ICML 后无突破 | CMU |
| Memory Layers | 🔥（冷）| 33 cite，无跟进 | Meta 独占 |

### 1.2 医学顶刊的火点

| Cluster | 热度 | 引用 |
|---|---|---|
| **临床部署 RCT** | 🔥🔥🔥🔥🔥 | Nat Med 2025 mammography (463k women, +17.6%)；NEJM AI automation bias (-14%) | 整个领域风向 |
| **亚专科 FM** | 🔥🔥🔥🔥 | PanDerm (derm), EchoPrime (echo), ECGFounder (ECG), TITAN (pathology), Merlin (CT) | Stanford / Mahmood / Google / Microsoft |
| **3D CT/MRI FM** | 🔥🔥🔥🔥 | Merlin Nature 2026, CT-CLIP Nat BME 2025, FM-HCT Nat BME 2026, Prima Nat BME 2025 | Stanford / Microsoft / NVIDIA |
| **Pathology FM** | 🔥🔥🔥🔥 | UNI/Virchow/Prov-GigaPath/CONCH/CHIEF/TITAN/PathChat | Mahmood / Paige / MSFT 主导 |
| **EHR FM / Patient timeline** | 🔥🔥🔥 | ETHOS / CLIMB / APOLLO / Epic CoMET (118M patients) | Epic+Stanford / MIT / Harvard |
| **Hallucination / Safety / FDA** | 🔥🔥🔥（**新热点**）| FDA Jan 2025 SaMD 草案；Aidoc 腹部 CT 拿到 clearance 2026.01 | 整个 deployment 圈 |
| **Medical Reasoning** | 🔥🔥🔥 | HuatuoGPT-o1 / Med-R1 / m1 / MedReason | 中科院 / CUHK / 中国主导 |
| **Medical Agent (multi-agent)** | 🔥🔥🔥 | MDAgents (NeurIPS 2024 引 200+) / Agent Hospital / DoctorAgent-RL | MIT/Google / Tsinghua |
| 多模态 patient FM | 🔥🔥 | HONeYBEE / CLIMB | 已基本卷完 |
| 生成 / 合成数据 | 🔥🔥 | ChexGen / MINIM | 中等 |

### 1.3 跨 ML / 医学的强信号

**最强信号（同时在 ML 和医学都热）：**
1. **Reasoning + RL post-training** —— ML 烫，medical 刚起步（HuatuoGPT-o1 只 100 cites）
2. **3D imaging FM** —— ML/医学都在 Nature 级期刊
3. **Hallucination detection** —— ML 已成熟，medical 是 FDA 驱动新需求
4. **Agent / multi-agent** —— ML 火，medical 跟进（MDAgents）

---

## 2. 谁在做什么（领导 lab / 公司 map）

### 2.1 学术圈

| Lab | 强项 | 代表作 |
|---|---|---|
| **Stanford AIMI (Chaudhari/Langlotz)** | 3D CT FM, EHR linkage | Merlin / TTE Pretraining / INSPECT |
| **Stanford CCSL (Pohl/Adeli)** | Longi brain MRI SSL | LSSL / LNE / 3D temporal |
| **Microsoft Health Futures (MAIRA team)** | Radiology VLM | BiomedCLIP / MAIRA-2 / BioViL-T |
| **Mahmood Lab (Harvard/BWH)** | Pathology FM | UNI / CONCH / TITAN / PathChat |
| **MIT Jameel Clinic (Barzilay/Rajpurkar)** | Lung CT, Mirai | Sybil / Mirai / RadFlag |
| **Google Med (Tu et al.)** | Generalist medical | Med-PaLM 2 / Med-Gemini / AMIE |
| **NVIDIA (Roth/He)** | 3D segmentation FM | VISTA3D / MAISI / MedDINOv3 |
| **MGH/Brigham (Aerts/Kann)** | Cancer imaging FM | CT-FM / BrainIAC |
| **Microsoft + Providence** | Pathology scale | Prov-GigaPath |
| **CUHK (Chen et al.)** | Medical reasoning | HuatuoGPT 系列 |

### 2.2 工业界

| 公司 | 状态 |
|---|---|
| **Aidoc** | 2026.01 拿到腹部 CT FM clearance（FDA）|
| **Glass AI** | 临床决策 agent |
| **RadAI / Annalise** | Radiology workflow |
| **Tempus / PathAI** | Pathology FM 产品化 |
| **Paige** | Virchow / TITAN 商业化 |
| **Hippocratic AI** | 临床 LLM agent |
| **Recursion / Insitro** | Drug discovery + imaging |
| **Nvidia Clara** | 医疗 AI 平台 |
| **Microsoft Nuance DAX** | Ambient scribe |

### 2.3 谁招人最多（2026）

- **OpenAI / Anthropic / DeepSeek**: post-training, reasoning, alignment（最难进，竞争激烈）
- **Microsoft Health Futures (MAIRA team)**: medical VLM 全梯队
- **Stanford AIMI**: research scientist + applied
- **Aidoc / RadAI / Annalise**: 部署 + safety
- **Pathology 厂**: TITAN / Virchow 类 hire
- **Mayo Clinic（本地优势）**: applied medical AI

---

## 3. Direction A 的 cluster 定位

把 Direction A 放在这张地图上：

```
                    冷                    热
3D imaging FM       o------|----O----|----o
Longitudinal        o------------------O--o   ← Direction A 在这儿
Reasoning           o-------------|---O---o
Pathology           o-----------------O----o
Agent               o----------------O-----o
EHR FM              o-------------O--------o
Hallucination       o------------O---------o   ← 第二选 AA
```

**Direction A 的 cluster 定位**：
- 在 **3D imaging FM**（成熟）+ **longitudinal**（空白）交叉处
- 邻居是 **Merlin** / **CT-CLIP** / **TTE Pretraining** / **SSL-AD** / **CRONOS**
- 距离 reasoning / agent 较远（**这是 weakness**，2026 hire 关键词没全占）

---

## 4. 留白 / 真空白点（最重要的输出）

### 4.1 ML 顶会角度的留白

1. **3D Reasoning Model**：所有 reasoning 工作都是文本/2D（HuatuoGPT-o1, m1, Med-R1）。**3D imaging-grounded reasoning** 几乎零
2. **Medical Mech Interp on 3D FMs**：SAE 已有 brain MRI (GeoSAE) + 2D path/CXR，**3D CT FM SAE 还空**（已确认）
3. **Federated medical pretraining**：UltraFedFM 是 ultrasound，其他模态 zero
4. **In-context learning for 3D imaging**：完全空白
5. **TTT on 3D radiology FM**：已确认 virgin（per-patient adapt）
6. **Joint retriever + medical VL FM (MedREALM)**：已确认 OPEN（REALM-style，零工作）

### 4.2 医学顶刊角度的留白

1. **Longitudinal CT/MRI FM**：见 Direction A
2. **Hallucination runtime gate**：AA 方向，FDA-driven
3. **Cross-cohort generalization**：CheXzero/RAD-DINO 鲁棒性是真问题但工作少
4. **Multimodal radiology + 病理 + omics + longi**：HONeYBEE 是 pathology，radiology 端没有
5. **Medical AI 简单 deployment monitoring**：post-deployment drift detection 工作少

### 4.3 跨域留白（最 sexy）

**最 underserved 的 intersection：**
| Intersection | 状态 |
|---|---|
| 3D longi FM × reasoning | **完全空白** |
| 3D longi FM × hallucination gate | 空白 |
| 3D longi FM × federated training | 空白 |
| 3D longi FM × mech interp | 空白 |
| Multi-cohort 3D FM × demographic fairness | 空白（FairMedFM 是 2D） |

---

## 5. 谁来买单（工业界 hire signal map）

### 5.1 最强信号的关键词组合（2026）

```
Tier 1（每家都要）:
  + foundation model
  + multimodal
  + post-training (RLHF/DPO)
  + reasoning / TTC

Tier 2（高需求）:
  + 3D medical imaging
  + clinical deployment
  + FDA SaMD
  + agent / tool use

Tier 3（细分但稀缺）:
  + mech interp / SAE
  + hallucination detection
  + federated learning
```

### 5.2 Direction A 简历命中率

如果 paper 写"longitudinal 3D medical FM"：
- Tier 1 全打：foundation model ✓ multimodal ✓（如果加 reports/EHR）
- Tier 2 打 2/4：3D medical imaging ✓ clinical deployment ✓
- Tier 3 打 0/3

**结论**：A 命中**前 2 个 Tier 的 4-5 个关键词**。但**没占 reasoning / RLHF / agent / mech interp**。

→ **如果想全占 Tier 1，paper 需要加 reasoning 或 agent 章节作 add-on**

### 5.3 哪些公司直接对 Direction A 感兴趣

**直接对口（最有可能 hire 你）：**
- Stanford AIMI（Merlin 团队，方向最近）
- Microsoft Health Futures (MAIRA team)
- Aidoc / RadAI / Annalise
- NVIDIA Clara / VISTA team
- Tempus / PathAI（虽是病理但 longi 概念可迁移）
- Mayo Clinic（**本地**）
- Recursion / Insitro（drug discovery + imaging trajectory）

**不会直接 hire 但简历加分：**
- OpenAI / Anthropic（除非加 reasoning chapter）
- Google Med（Med-Gemini 团队）

---

## 6. 时间窗口分析

### 6.1 这个 cluster 还会火多久

**3D medical FM**：Merlin Nature 2026, CT-CLIP Nat BME 2025, FM-HCT Nat BME 2026 —— 顶刊接受度高，**未来 2 年仍是 mainstream**。

**Longitudinal angle**：
- TTE Pretraining (Stanford) 2024.11 出
- SSL-AD 2025.09 出（小规模）
- CRONOS 2025.12 出（forecaster）
- Temporal Flow Matching 2025.08 出
- **2025 后半年集中出 longitudinal 相关工作** → cluster **正在升温**
- Direction A 现在做正当时；**1 年内 publish 还能抢占**

### 6.2 谁可能抢先

**最大威胁是 Stanford CCSL（Pohl/Adeli/LSSL 系）**：
- 他们正在做这条线（LSSL 2021 → 2025+ 各种 follow-up）
- Stanford 还有 TTE Pretraining (Chaudhari/Shah lab)
- **如果他们决定从 single-scan 跳到 multi-scan，会很快**

**第二威胁是 Microsoft（MAIRA team）**：
- BioViL-T 是 2D longitudinal CXR 的祖师
- 如果他们扩到 3D —— Direction A 完蛋

**第三威胁是 NVIDIA Clara / Aerts (DFCI)**：
- 已有 CT-FM；扩 longitudinal 不难

---

## 7. 综合给 Direction A 的判断

### 7.1 时间紧迫性
**6-12 个月窗口期**。超过 1 年 Stanford 或 Microsoft 大概率会 ship 类似工作。

### 7.2 paper venue 优先级
1. **NeurIPS 2026**（Q3 deadline）—— **首推**：method novelty + scale
2. **MICCAI 2027**（Q1 2027 deadline）—— 医学 reviewer 友好
3. **CVPR 2027**
4. **Nature BME** / **Nat Med**（如能 finalize 临床 endpoint + Mayo 实测）

### 7.3 必做的 add-on（提升 hire signal）
不加 reasoning / agent paper 进 Tier 1 不容易。**建议在 Direction A paper 加一个 "reasoning add-on"**：
- post-train FM 加 chain-of-thought
- 用 longitudinal context 做 differential diagnosis
- = 同时命中 foundation model + multimodal + longitudinal + reasoning

### 7.4 最大 hidden risk
**Mayo 数据访问慢**——如果 6 个月还没拿到 ≥3 timepoint 数据，应该 plan B：
- 切到纯公开数据（NLST 26k + ADNI 17k + AIBL 350 + OASIS-3 400 + COPDGene 5,929 = ~50k patients ≥2 TP）

---

## 8. 摘要：Stage 2 → Stage 3 的 prompt

**关键 finding 给 Stage 3：**
1. **3D longi FM 单做不够，必须加 add-on** 才能命中 2026 hire 关键词全家桶
2. **6-12 月窗口期**——再晚 Stanford / Microsoft 抢先
3. **空白 intersection 在**：3D longi × reasoning / hallucination / mech interp / federated
4. **数据上限**：公开 ~80-120k 病人 ≥2 TP（脑 MRI 主），CT ~50k；Mayo 加成关键
5. **简历目标公司**：Stanford AIMI / Microsoft / Aidoc / NVIDIA / Mayo / Tempus / PathAI / Recursion
6. **必做**: 加 reasoning post-training 章节作 hire signal booster

**Stage 3 要回答的核心问题：**
> 在 Direction A 基础上，加哪些 add-on 能 (a) 占满 2026 hire 关键词 (b) 不让 paper 过 bloated (c) 与 6-12 月窗口期兼容？
