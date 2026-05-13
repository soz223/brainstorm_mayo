# Direction A · Paper Proposal v0.2

> v0.1 见 [paper-proposal.md](paper-proposal.md)。v0.2 基于 [Stage 2 trend 分析](../trends/stage2-trend-analysis.md) + [Stage 3 new ideas](../trends/stage3-new-ideas.md) + 全部 [dataset deep dive](datasets-deep.md) 更新。
>
> **关键变化**: 加 Reasoning post-training 章节命中 2026 hire 关键词全家桶；数据集数字精确到一手引用。

---

## 1. 标题（升级）

**主推**:
> **TimeFM-3D: Longitudinal 3D Medical Foundation Model with Verifier-Guided Reasoning Post-training**

**备选**:
- "Patients Are Sequences: Native Multi-Timepoint 3D Medical Foundation Model with Reasoning"
- "Time-Aware Volumetric Pretraining + Verifier-Grounded Chain-of-Thought for Medical Decision Support"

---

## 2. 一句话 Pitch

> 第一个 natively 吃同一病人多张 3D CT/MRI 的 foundation model，**用 IA-MVM + NVP-LS + CMTC 三联 SSL 预训练 + verifier-guided chain-of-thought post-training**（reward 来自真临床 outcome：病理 / RECIST / mortality）。在 NLST 肺癌风险、ADNI 脑萎缩 conversion、INSPECT PE 复发、ISPY 治疗反应上 beat 所有 single-timepoint baseline，**并提供临床可解释 reasoning trace**。

## 2.5 为什么 3D 而不是 2D

（同 v0.1，略。简单说：2D CXR 被 Microsoft 占；3D 是空白；Mayo 数据强项。）

## 2.6 为什么加 Reasoning post-training

Trend 分析显示：
1. 2026 ML 最热关键词 = reasoning / o1 / TTC（DeepSeek-R1 viral）
2. 医学 reasoning 工作 99% 在文本（HuatuoGPT-o1）或 2D（Med-R1）—— **3D imaging-grounded reasoning 完全空白**
3. **Mayo 多读者报告**是 reasoning trace 的独占来源
4. **病理 / RECIST 作 verifier** 是医学独有优势（避开 reasoning evaluation 烂账）

---

## 3. 5 个 Specific Claims（升级）

### Claim 1 — Architecture (与 v0.1 同)
**TimeFM-3D**：第一个 native multi-timepoint 3D medical FM with Δt-aware temporal attention

### Claim 2 — Pretraining objectives (与 v0.1 同)
三联 SSL：IA-MVM + NVP-LS + CMTC

### Claim 3 — **NEW: Reasoning post-training**
> Verifier-guided chain-of-thought post-training，reward 来自 actual clinical outcomes（病理 / RECIST / mortality）。模型输出 reasoning trace + final prediction，**reasoning quality 不仅 GPT-4 judge，更直接绑定到 ground-truth outcome**

### Claim 4 — Scale
> 用 **~30-50k patients ≥3 TP** 联合预训练（**数字 from Part 6+7 deep dive**）

### Claim 5 — Downstream (升级到 6 task)
在 6 个临床任务上 beat all single-timepoint baselines + **provide reasoning explanation**：
- NLST 1-6yr lung cancer risk（beat Sybil）
- INSPECT PE recurrence + 12mo mortality（beat TTE Pretraining）
- ADNI MCI → AD conversion 2yr（beat Merlin/Sybil-like）
- ISPY1/2 RECIST treatment response
- ACRIN-6668 NSCLC SUV change
- **新 benchmark "Longi-RAD"** (自造)

---

## 3.5 任务 input/output（升级，含 reasoning）

### 预训练（SSL，与 v0.1 同）

| 目标 | 输入 | 输出 |
|---|---|---|
| **IA-MVM** | `[V1, V2, mask(V3), V4, V5]` + Δt | 重建 V3 |
| **NVP-LS** | `[V1...V_{k-1}]` + Δt | predicted V_k latent |
| **CMTC** | (volume seq, report/EHR window) | InfoNCE |

### **NEW: Reasoning post-training**

**Phase 1: Supervised CoT (SFT)**
```
in:  [CT_t1, CT_t2, CT_t3] + Δt + prior report + clinical question
out: <thinking>
       reasoning chain（从 Mayo 多读者报告 + GPT-4 改写抽取）
     </thinking>
     <answer>
       structured prediction
     </answer>
```

**Phase 2: RL with verifier (GRPO/DPO)**
```
sample N reasoning chains
reward = α · final_answer_correct (vs pathology/RECIST/outcome)
       + β · reasoning_steps_logically_valid (vs report ground truth)
update via GRPO
```

**Phase 3 (optional): Test-time scaling**
```
推理时 sample K chains, self-consistency vote
```

### 下游 (5+1 任务)

1. **疾病进展 / 风险预测**（cls + survival）
2. **治疗反应 RECIST**（cls + regression）
3. **复发预测**（survival）
4. **Progression slope**（regression）
5. **纵向报告生成**（text gen + reasoning）
6. **(新)** **Differential diagnosis with reasoning**（reasoning + classification）

---

## 4. 方法（架构 + post-training pipeline）

```
Phase 1: Pretraining (3 SSL objectives, 与 v0.1 同)
  per-timepoint volume → 3D ViT/SwinUNETR → tokens
                              + Fourier(Δt)
  Temporal Transformer w/ Δt-scaled cross-visit attention
  → unified trajectory embedding
  losses: α·IA-MVM + β·NVP-LS + γ·CMTC

Phase 2: Reasoning SFT
  - 从 Mayo report 抽 reasoning trace (规则 + GPT-4 改写)
  - 监督 FM 输出 <thinking>...</thinking><answer>...</answer> 格式
  - 1-2 weeks training

Phase 3: RL post-training (GRPO)
  - prompts 来自有 outcome label 的 cohorts
  - verifier:
    - INSPECT → 12mo mortality / PE recurrence
    - NLST → 1-6yr lung cancer dx (pathology)
    - ISPY1/2 → pCR
    - ACRIN-6668 → SUV change
  - GRPO with grouped sampling

Phase 4 (optional): Test-time scaling
  - K-way sampling + self-consistency
```

---

## 5. 数据计划（用 deep dive 精确数字更新）

### 5.1 预训练池（≥3 TP 病人）

| 来源 | ≥3 TP 病人 | 一手引用 |
|---|---|---|
| **NLST** | ~22,800 (T0/T1/T2 95% adherence) | Aberle 2011 NEJM |
| **ADNI 1+GO+2+3** | 1,300-1,700 | Aisen 2024 Clinical Core PMC11485391 |
| **OASIS-3** | ~400 (1,378 patients × avg 2.06 sessions) | LaMontagne 2019 OASIS-3 |
| **AIBL** | ~350 | Ellis 2009 |
| **NACC-SCAN** | 2,000-3,000 | scan.naccdata.org |
| **ABCD** | 5,000-6,500 (biennial × 4-5 TP) | Casey 2018 |
| **HCP-A / AABC** | 471 | Bookheimer 2019 |
| **PPMI** | 300-500 | Marek 2018 |
| **HBCD** | 500-1,000 | Volkow 2021 |
| **Rotterdam** | 1,500-2,000（如能合作）| Ikram 2015 |
| **GENFI + NIFD** | ~410 (FTD diversity) | Rohrer 2015 |
| **COPDGene + SPIROMICS** | ~4,763 + 1,500 = ~6,263 | Regan 2010 |

**总计 ≥3 TP**: **~40,000-50,000 patients**（如全部 access；现实最快可达 ~25,000）

### 5.2 多模态弱 augment（无 Δt 但同 patient）
- **CT-RATE**: ~3,000-4,400 patients 有 ≥2 distinct accessions（**confirmed via HF dataset card**）。无 StudyDate → 仅作 SimCLR-style same-patient contrastive
- **MIMIC-CXR longi**: 26,625 patients × ≥2 visits（**2D fallback**）

### 5.3 评测 cohorts（精确）

| Benchmark | 数据集 | N | 评测内容 |
|---|---|---|---|
| Lung cancer 1-6yr risk | NLST | 26,722 LDCT × 3 TP | beat Sybil C-index |
| PE recurrence + mortality | INSPECT | 19,402 patients (4,410 deaths) | 8 outcome tasks |
| MCI → AD conversion | ADNI + TADPOLE D4 | 219 D4 test | mAUC |
| RECIST treatment response | ISPY1 + ISPY2 | 222 + 985 patients × 4 TP DCE-MRI | pCR / EFS |
| NSCLC chemo response | ACRIN-6668 | 173 paired pre/post | SUV change |
| GBM RANO | LUMIERE + UPenn-GBM | 91 + 630 × 多 TP | RANO progression |
| 长时风险 | Merlin's 752 task | follow Merlin paper | head-to-head |
| Reasoning quality | Longi-RAD (新造) | TBD | 3 radiologist blind rating |

---

## 6. Baselines（必 reproduce + beat）

| Baseline | 评测在 | 我们要 beat |
|---|---|---|
| **Stanford TTE Pretraining** (2411.09361) | INSPECT 8 tasks | AUROC / C-index |
| **Merlin** (Nature 2026) | 752 tasks subset | longitudinal-relevant 任务 |
| **CT-CLIP / CT-CHAT** (Nat BME 2025) | CT-RATE 18 abnormality | + 加我们 longi 信息 |
| **Sybil** (JCO 2023) | NLST 1-6yr | C-index（**必 beat**）|
| **CT-FM** (2501.09001) | retrieval/seg | 通用 |
| **RadFM** (Nat Commun 2025) | generalist | 通用 |
| **SSL-AD** (2509.10453) | brain MRI 纵向 | 同向最近，必比 |
| **CRONOS** (2512.16577) | trajectory forecasting subtask | sanity |
| **M3FM** (Nat Commun 2025) | NLST | screening |
| **HuatuoGPT-o1** (medical reasoning, 文本) | 文本 medical QA | 我们 3D imaging 入手 |
| **Med-R1** (VLM + RL) | 2D 医学 VLM reasoning | 跨域比较 |

---

## 7. Evaluation Protocol（升级，含 reasoning）

### 7.1 标准指标
- AUROC / AUPRC（cls）
- Harrell's C-index（survival）
- RECIST agreement
- BLEU / ROUGE / RadGraph-F1 / RadCliQ（report gen）

### 7.2 Reasoning 指标（新加）
- **Reasoning faithfulness**: 用 path / RECIST 作客观 verifier 测 reasoning chain → final answer 一致性
- **GPT-4 judge**（仅 sanity）
- **3 Mayo radiologist blind rating**（金标准，但贵 → 抽样）

### 7.3 公平性 axes（reviewer 必查）
- 跨 scanner manufacturer
- 跨 medical center
- 跨 demographic (age/sex/race)
- 跨 modality (CT vs MRI vs paired multimodal)

### 7.4 Ablation
- 三 SSL 目标 leave-one-out
- ± reasoning post-training
- ± verifier RL
- backbone size scaling (100M / 500M / 1B)
- pretrain data size scaling (5k / 15k / 30k+ patients ≥3 TP)
- timepoint 数 (k=1/2/3/5) 输入

---

## 8. 风险 + Mitigation

| 风险 | Mitigation |
|---|---|
| Mayo 数据 DUA 延迟 | 公开数据可达 ~25k ≥3 TP（NLST 是主力），先跑 v1 |
| Multi-cohort scanner 异质 | domain randomization + site conditioning + FM 通常更鲁棒 |
| Catastrophic forgetting | replay buffer，先 small-scale 验证 |
| 三 SSL 目标互相干扰 | warm-up schedule，先 IA-MVM only |
| **Reasoning trace 来源**（GPT-4 改写循环） | **用真 outcome 作 verifier**（病理/RECIST/mortality）——避开 GPT-4 judge |
| Reasoning evaluation 烂账 | 客观 verifier + 3 radiologist 抽样 + GPT-4 仅 sanity |
| Sybil 难 beat | 用全 3 个 screening round 输入 vs Sybil 单 CT |
| 6-12 月窗口 | **不能拖** —— Stanford CCSL / Microsoft / NVIDIA 都可能抢 |
| **CT-RATE 无 timestamp** | 作 contrastive augment，不算主预训练 |

---

## 9. Timeline（升级）

```
Month 1-3:  数据 DUA 申请（LONI + NDA + BioLINCC + AIMI/Redivis）
            公开数据 download + curation
            小规模 prototype (100M params, 5k 病人 × 3 TP)
            Reproduce Merlin / TTE / Sybil baseline

Month 4-6:  完整三 SSL 目标实现 + ablation
            scale up 到 500M params on 30k patients

Month 7-9:  Reasoning SFT phase
            Mayo report → reasoning trace pipeline
            RL with outcome verifier (GRPO)
            ablation: ± reasoning

Month 10-12: 全数据预训练（1B params if 算力允许）
             8 个下游 evaluation
             scaling study
             写 paper

Month 13:    投 NeurIPS（5 月 deadline）/ Nature Med
```

---

## 10. 投稿目标（升级）

**主投**:
1. **NeurIPS 2026 main track** —— foundation model + reasoning + scale，三重 hit
2. **Nature Medicine** —— 如有完整 reasoning + clinical 验证（Mayo cohort 实测）
3. **MICCAI 2027** —— 医学影像 reviewer 友好

**Backup**: ICML 2027, CVPR Medical 2027, Nat Biomed Eng

---

## 11. 简历卖点（**升级到 2026 hire 全家桶**）

> "Trained the first 3D medical foundation model that natively ingests longitudinal sequences of CT/MRI scans, post-trained with verifier-guided chain-of-thought reasoning where the reward signal comes from actual clinical outcomes (RECIST, pathology, mortality). The model outperforms Sybil on NLST 1-6yr lung cancer risk by X%, beats Stanford's Time-to-Event Pretraining on INSPECT 8 prognosis tasks by Y%, and provides clinically grounded rationale that 3 Mayo radiologists rated as clinically valid in Z% of cases."

**打中关键词全家桶**：
- **Tier 1**: foundation model · multimodal · post-training · reasoning · RLHF / GRPO ✓
- **Tier 2**: 3D medical imaging · clinical deployment · longitudinal ✓
- **Tier 3 部分**: hallucination-adjacent（verifier-grounded）✓

**适配岗位**:
- OpenAI / Anthropic / DeepSeek post-training team（reasoning 牌打到）
- Google Med / Microsoft Health Futures / Stanford AIMI
- Aidoc / RadAI / Annalise（部署 + safety）
- NVIDIA Clara / VISTA
- Tempus / PathAI / Recursion / Insitro

---

## 12. 与 v0.1 的区别

| 维度 | v0.1 | v0.2 |
|---|---|---|
| 主线 | 纯 Direction A | Direction A + Reasoning post-training |
| Claims | 5 个 | 5 个（claim 3 升级到 reasoning）|
| Tasks | 7-8 种 | 6 种 + reasoning trace |
| 数据数字 | 估算 | **一手 verified**（deep dive）|
| CT-RATE | 用 | **降级到 contrastive augment**（no timestamps） |
| Baselines | 9 个 | 11 个（加 HuatuoGPT-o1, Med-R1） |
| Timeline | 12 月 | 13 月（多 2-3 月 reasoning） |
| Venue | MICCAI/NeurIPS/Nat BME | **NeurIPS / Nature Med**（升级）|
| 简历 keyword | Tier 1+2 部分 | **Tier 1+2 全占** |

---

## 13. 给自己的 note

**这是 v0.2，不是定稿**。下次更新触发条件：
- Mayo 数据 scoping 结果回来（决定 reasoning trace 量）
- 第一个 prototype 跑通（验证 IA-MVM 三目标可联合训）
- Stanford CCSL 或 Microsoft MAIRA 发了类似 paper（决定是否要 pivot）

---

## 14. 待数据 scoping 确认

仍待 Mayo informatics 确认：
1. Mayo ≥3 follow-up CT/MRI 病人数（决定 A 真启动）
2. Mayo draft report + radiologist-edited 配对语料量（**关键** —— 决定 reasoning trace 量）
3. Mayo paired imaging + sequencing ≥5k（如有，可加 radiogenomics future-paper）
