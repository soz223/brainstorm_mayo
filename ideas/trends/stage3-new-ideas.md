# Stage 3: 基于 trend 的新 idea

> 基于 [Stage 2 trend 分析](stage2-trend-analysis.md) 的输入。
> 目标：在 Direction A 基础上加 **add-on 章节** 让 paper 命中 2026 hire 关键词全家桶，但**不让 paper 过 bloated**。

---

## 0. Stage 2 给的关键约束

| 约束 | 说明 |
|---|---|
| 时间窗口 | 6-12 个月 |
| Direction A 已占 keyword | foundation model, multimodal, 3D medical, clinical deployment |
| Direction A 漏的 keyword | **reasoning, RLHF/post-training, agent, mech interp, FDA SaMD safety** |
| 工程上限 | Mayo 数据未拿到时纯公开 ~50-80k 病人 ≥2 TP |
| Paper 数量 | 1-2 篇（不能搞 3 篇平铺）|

---

## 1. 新 idea 总览

把 Direction A 当核（"Longi-FM"），叠加不同 add-on：

| Combo | hire signal | 工程量 | paper venue | risk |
|---|---|---|---|---|
| **A + Reasoning post-training** ⭐ | ★★★★★ | 中 (RL recipe 现成) | NeurIPS / Nature Med | reasoning 评测烂账 |
| **A + Hallucination gate** | ★★★★ | 中 | Nat Med / NEJM AI | FDA-ready 但学术 novelty 中 |
| **A + Mech Interp** | ★★（窄但深）| 中低 | ICLR / Anthropic 敲门 | 与 GeoSAE 划界 |
| **A + Federated** | ★★★ | 高 | Nat Med / Sci Transl Med | 工程复杂 |
| **A + Agent** | ★★★★ | 中高 | NeurIPS / Microsoft 友好 | agent novelty 难证 |

---

## 2. 详细方案 1: A + Reasoning（**主推**）

### 2.1 一句话 pitch
> **第一个能 explain 自己 reasoning 的纵向 3D 医学 FM**。看 2 张 CT 序列，先输出鉴别诊断推理链（"3 mo 前结节 8mm，现 15mm，growth doubling time 90 d，符合 stage IB ade"），再给最终预测。

### 2.2 在 Direction A 之上要加什么

**预训练阶段（不变）**：IA-MVM + NVP-LS + CMTC（见 paper-proposal.md）

**新增 post-training 阶段**：
```
1. Supervised CoT (SFT):
   从 Mayo 多读者报告抽 implicit reasoning trace
   或用 GPT-4 把报告改写成 CoT 格式（带 caveat）
   监督 FM 输出 reasoning + answer

2. RL with verifier (GRPO/DPO):
   verifier = 真临床 outcome（病理 / RECIST / mortality）
   reward = 推理对吗 + 答案对吗（双层）

3. Test-time scaling:
   在推理时让 FM 自己采样多条 reasoning chain
   self-consistency vote
```

### 2.3 任务 input/output

```
in:  [CT_t1, CT_t2, CT_t3] + Δt + prior_report + clinical_q
out: <thinking>
       右上肺 8mm → 15mm，60 day Δt，volume doubling ~90d (Wegner & Mendenhall)
       边缘 spiculation，FDG-PET +
       鉴别: 1. adenocarcinoma (most likely) 2. 结核（PPD-, 排除）
     </thinking>
     <answer>
       stage IB adenocarcinoma 可能性 0.87
       建议 PET-CT + 活检
     </answer>
```

### 2.4 评测
- **NLST 1-6yr lung cancer**：beat Sybil + show reasoning matches 病理
- **ADNI MCI conversion**：beat Merlin/TTE
- **NEJM-style clinical case challenge**：人 vs FM reasoning
- **新 benchmark**: "Longi-RAD"（自造）—— 多个 timepoint + reasoning expected

### 2.5 为什么这个组合特别强
1. **Reasoning 是 2026 最热**——OpenAI/Anthropic/DeepSeek 全在做
2. **3D imaging + reasoning 完全空白**（HuatuoGPT-o1 是文本，Med-R1 是 2D）
3. **Mayo 多读者报告**是 reasoning trace 的独占来源
4. **临床落地强**——医生需要看到为什么，不只是预测

### 2.6 风险
- Reasoning evaluation 烂账（无客观 verifier 全是 GPT-4 judge）
- Reasoning trace 数据来源：用 GPT-4 改写 = 循环依赖
- → 用 **病理 / RECIST 作 verifier** 避开这个坑（医学独有优势）

### 2.7 paper venue
- 主投: **NeurIPS 2026 / Nat Med**（reasoning + 3D + RL 三重 hit）
- 备: **CVPR Medical / NEJM AI**

### 2.8 hire 简历卖点
> "Trained a 3D medical foundation model that natively ingests longitudinal patient scans, post-trained with verifier-guided chain-of-thought reasoning where the reward signal comes from actual clinical outcomes (RECIST, pathology). The model outperforms Sybil on NLST 1-6yr lung cancer risk by X% while providing clinically grounded rationale."

打中 2026 关键词：**foundation model · pretraining · multimodal · longitudinal · reasoning · RLHF · post-training · clinical deployment**

---

## 3. 方案 2: A + Hallucination Gate

### 3.1 一句话
> 训完 Direction A 的 longi-FM 后，加一个 **conformal-calibrated hallucination 检测层**，per-finding 给出 coverage 保证 + 拒识 unsupported claims。

### 3.2 加什么
```
Stage 1 (Direction A 不变): pretrain longi-FM
Stage 2: 
  - sample N=5 reasoning/output, 计算 semantic entropy
  - hidden-state probe (ReXTrust style)
  - conformal prediction give marginal coverage
Stage 3:
  - Prospective Mayo cohort: model output + flag + radiologist edit
  - 测 clinician edit burden 是否下降
```

### 3.3 task input/output
```
in:  [CT_t1, CT_t2] + report query
out: report + per-sentence {confidence, conformal_lower_bound, abstain_flag}
     "Right upper lobe nodule 12mm (high conf, evidence: slice 47-52)"
     "Mediastinal lymphadenopathy (LOW conf, ABSTAIN, refer radiologist)"
```

### 3.4 Mayo 独占优势
**draft report + radiologist-edited final** 配对语料 —— 这是 hallucination/edit 的直接 ground truth，公开数据零

### 3.5 paper venue
- 主投: **Nat Med / NEJM AI**（FDA-ready）
- 备: **ML4H workshop / MICCAI**

### 3.6 hire signal
- **Aidoc / RadAI / Annalise 直接对口**（FDA SaMD safety）
- Microsoft Health Futures（MAIRA team 关注 safety）
- 但 reasoning / agent keyword 没占

---

## 4. 方案 3: A + Mech Interp

### 4.1 一句话
> 训完 Direction A longi-FM 后，**第一个用 Sparse Autoencoder 解剖 3D CT 时序 FM**——找出哪些 feature 编码 "肿瘤增长" / "治疗反应" / "scanner bias"。

### 4.2 加什么
```
Direction A FM 训完后 (frozen)
  → 在某层抽 activation
  → 训 SAE (TopK / JumpReLU)
  → 自动 label (用 MedGemma + radiologist 抽查)
  → 找：
    - "肿瘤生长" feature
    - "治疗反应" feature
    - "扫描仪 bias" feature（→ scanner shortcut detection）
    - "时间间隔" feature
  → activation patching 证明因果性
  → steering: "clamp 肿瘤生长 feature 到 0" 看预测怎么变
```

### 4.3 与 GeoSAE 划界
GeoSAE 做了 3D brain MRI 但**没做 longi 维度**。Direction A SAE 的 unique angle:
- **temporal feature**: "feature X 在 t1 强 t2 弱 = 表示什么"
- **trajectory feature**: 编码整条 trajectory 的 latent

### 4.4 paper venue
- 主投: **ICLR 2027 / Anthropic Interp Workshop**
- 备: **NeurIPS Interp Workshop**

### 4.5 hire signal
- **Anthropic interp team 唯一可能感兴趣的医学 paper**
- **Goodfire AI** 也喜欢
- 但其他公司不一定 care

### 4.6 风险
- novelty 与 GeoSAE 划界要小心
- interp 在 medical 上 paper 影响力**有限**（除非进 Anthropic）

---

## 5. 方案 4: A + Federated（**风险高，暂不推荐**）

### 5.1 一句话
> Direction A FM 在 Mayo + 5 个合作医院 federated 训练，数据不出院。

### 5.2 问题
- 工程量极大（FedAvg / FedProx / personalization）
- 与单中心 Direction A 的可比性证明难（**主 ablation 难写**）
- Mayo 合作伙伴关系不一定就位
- → **作为 future work 一句话提，不主做**

---

## 6. 方案 5: A + Agent

### 6.1 一句话
> Direction A 的 longi-FM 当 backbone，外面套 LLM controller 当 agent —— 自动调"检索 prior scan / 量化结节 / 查 NCCN guideline"工具。

### 6.2 问题
- Agent novelty 难 paper 化（已警告过）
- 工程量大
- → **不主做**，可作 Direction A v2 paper

---

## 7. 综合推荐

### 7.1 单 paper 路径
> **Direction A + Reasoning post-training** （方案 1）作为一个 paper 投 NeurIPS 2026

理由：
1. **覆盖 2026 hire 关键词最全**
2. **Mayo 多读者报告**是 reasoning trace 独占来源
3. **病理 / RECIST 作 verifier** 避开 reasoning evaluation 烂账
4. 6-12 月窗口期可完成

### 7.2 双 paper 路径
- **Paper 1 (6 月)**: Direction A pure pretraining + 标准下游评测 → MICCAI / CVPR Medical
- **Paper 2 (12 月)**: A + Reasoning → NeurIPS / Nat Med

### 7.3 三 paper 长线
- Paper 1: Direction A core (MICCAI)
- Paper 2: A + Reasoning (NeurIPS)
- Paper 3: A + Hallucination gate（如有 Mayo edit 数据）（Nat Med）

---

## 8. 给 paper proposal v0.2 的更新方向

基于 Stage 2 + 3 finding，paper-proposal.md 应该：

1. **Title 改成包含 reasoning**：
   > "TimeFM-3D: Longitudinal 3D Medical Foundation Model with Verifier-Guided Reasoning Post-training"

2. **Method 增加 post-training section**:
   - SFT on report-derived CoT
   - RL with pathology/RECIST verifier

3. **Evaluation 增加 reasoning benchmark**:
   - Longi-RAD（自造）
   - NEJM clinical case 风格 eval
   - 临床医生评分

4. **数据 inventory 写精确**：
   - NLST 26,722 LDCT × 3 TP
   - ADNI 2,482 patients (1,300-1,700 ≥3 TP)
   - OASIS-3 1,378 patients
   - INSPECT 19,402 patients (~3,800 ≥2 CTPA, 4,410 deaths)
   - 加 CT-RATE if verified longitudinal

5. **Risk 段加 reasoning evaluation 烂账 + mitigation**:
   - 用 pathology/RECIST 作客观 verifier
   - GPT-4 judge 仅作 sanity check
   - 邀请 3 个 Mayo radiologist 做 blind rating

6. **Timeline 调整**:
   - Month 1-3: Direction A pretrain + baseline
   - Month 4-6: SFT CoT
   - Month 7-9: RL with verifier
   - Month 10-12: writing + submission

---

## 9. 一句话总结 Stage 3

> **Direction A (longi 3D FM) + Reasoning post-training** 是 single-paper 最优组合 ——
> Mayo 数据独占 + 时间窗口对、技术风险可控 + 2026 hire 关键词全占。

剩下 add-on（hallucination, mech interp, federated, agent）作 future paper / chapter，**不放进 v1**。
