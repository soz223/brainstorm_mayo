# Method 维度调研

> 按 ML 技术分类，不按应用领域。

## 总览

| Method | 状态 | 信号 | Mayo 杠杆 |
|---|---|---|---|
| ~~**M3** Memory Layer~~ | 弃（33 cite 信号 + 反 scaling）| - | - |
| **M4** Speculative decoding | 弃（engineering）| ★（绑定才有戏）| 弱 |
| **M5** Test-time training | 候选 | ★★★ | optional |
| **M8** Diffusion-as-FM | 已 log（参考用）| ★★ | optional |
| **M9** Flow matching | 谨慎 | ★★（reviewer barrier 高） | optional |
| ~~**M10** Self-improving~~ | 弃（医学无 verifier）| - | - |

调研完毕的方向回到 [IDEAS.md](../IDEAS.md) 主索引。

---

## AA. Hallucination Gate {#aa}

**verdict**：方法论活跃，**零端到端 runtime gating**。FDA Jan 2025 SaMD 草案明文要求。

**closest works**：
- RadFlag (2411.00299, Rajpurkar 2024) —— 温度采样 + LLM judge
- ReXTrust (2412.15264) —— hidden-state probe，AUROC 0.875
- MAIRA-2 + RadFact (2406.04449) —— 离线 factuality
- DSE for radiology (2510.09256, n=206)
- Conformal Triage (medRxiv 2024.02.09.24302543)

**未做**：runtime gate + per-finding coverage / cross-VLM 通用 / 3D modality / drift-aware / FDA SaMD 闭环

**Mayo 独占**：draft + radiologist-edited 配对语料

**claim**：drift-aware, conformal-calibrated hallucination gate with Mayo prospective edit-burden study

**venue**：Nat Med / NEJM AI · **难度**：中高 · **风险**：offline → prospective 跨度大

---

## X. MedREALM joint retriever+VL FM {#x}

**verdict**：**OPEN**。没人做 REALM/Atlas-style joint pretraining for medical vision。

**分类**：
- Frozen RAG（推理时检索）：MMed-RAG, X-REM, X-TRA, PathRAG —— 医学多
- Joint fine-tune：JMLR, MedRGAG —— 文本 only
- **Pretraining-with-retrieval (REALM/Atlas)：medical vision 零**

**通用域可移植**：REALM (Guu 2020), RETRO (DeepMind 2022), Atlas (Meta 2022, EMDR2/PDist), RA-DIT, REPLUG

**claim**：First REALM-style joint pretraining of dense image retriever + medical VL FM, retrieval as latent variable in pretraining loss.

**Mayo 杠杆**：长尾 case retrieve at train time（REALM 设计动机），Mayo 大量 image-report = memory bank

**venue**：NeurIPS / ICML · **难度**：中高 · **风险**：retrieval collapse、gradient 不稳

---

## CC. Radiogenomics FM {#cc}

**verdict**：task-specific（EGFR/IDH/MGMT）饱和，**FM scale 零**；spatial transcriptomics + 影像 virgin。

**done**：
- EGFR / IDH / MGMT 任务级 100–200 paper
- MGMT 公认 doesn't generalize（AUC 0.55–0.70）
- 所有 medical FM (Merlin, M3FM, CT-FM, BrainIAC) 都无 omics signal

**closest**：
- Pai/Aerts cancer FM (Nat Mach Intell 2024)
- BrainIAC (Nat Neurosci 2026, IDH AUC 0.79)
- FoundBioNet (2508.06756, 1,705 病人)
- MTS-UNET (2503.06828, ~2,200 病人)

**spatial transcriptomics + 影像**：Cell Reports 2025 (S2211-1247(25)00844-7) co-registration only；学习型 mapping 零

**claim**：First FM jointly pretrained on paired 3D radiology + bulk transcriptomics across cancers, analog to TITAN/PRISM for pathology

**Go/No-Go**：Mayo paired imaging + sequencing > 5k 病人

**venue**：Nat Med / Nature · **难度**：硬

---

## M3. Memory Layers {#m3}

**核心**：把 transformer 的 MLP 换成超大 key-value memory（100 万对 (key, value)，每次激活 top-k）。参数量大但 FLOPs 低。

**source**：Lample, Joulin et al. "Memory Layers at Scale" (arXiv 2412.09764, 2024.12, Meta)

**为什么对医学有意思**：
- 医学知识本质是 sparse fact lookup（finding + 患者 → dx）
- MLP 强行压缩 sparse fact 浪费
- Memory key 可直接预加载 Mayo 案例 → memory = case bank

**vs X (MedREALM)**：表亲——X 显式 retriever，M3 把 memory 烤进权重

**风险**：技术 2024.12 才出，引用 base 小，1 年后可能"也就那样"

**状态**：**弃**（2026-05-13）。决策理由：
1. 反 scaling law 时代叙事（参数多但 compute 不增）
2. 出来 1 年只 33 cite —— 真好东西半年内引用爆炸
3. 在 transformer 上再叠 sparse routing 增加故障点

---

## M8. Diffusion-as-FM (Marigold for medical) {#m8}

**verdict**：light tapped，3D medical Marigold 风格空白。

**done**：
- 3D medical diffusion **generator**：多（MAISI, 3D-MedDiffusion, Med-DDPM, MedDiff-FM）
- 3D medical diffusion **as representation**：仅 2-3 篇 narrow
- 2D medical：5-8 篇 task-specific

**closest**：
- Li et al. 2501.19265 (Jan 2025) —— diffusion pretrain + 3D CT seg only，no DINO compare
- Li et al. 2025 —— DDPM on MRI classification only
- LEAF (MICCAI 2025) —— 2D
- CLDF (2506.23460) —— 2D weak seg
- D-Cube (2411.11087) —— 2D
- MedDiff-FM (2410.15432) —— 3D 但只做 generative task

**未做**：把已有 3D medical LDM (MAISI / 3D-MedDiffusion) 的 frozen feature head-to-head benchmark vs DINOv2/RAD-DINO/3DINO/SuPreM/SAM-Med3D 在统一 3D perception suite (BTCV/AMOS/TotalSeg/MSD/MedMNIST3D/retrieval)

**claim**：First to systematically evaluate frozen 3D medical diffusion features as a FM on unified 3D perception suite, beat DINOv2/RAD-DINO/3DINO on K of N tasks.

**venue**：CVPR / NeurIPS / MICCAI · **难度**：中 · **Mayo 必需**：no（v1 用公开数据；Mayo 作 case study）

**优势**：MAISI 权重公开，**不需要预训练 diffusion**（用现成 checkpoint），探针实验为主，工程量小

---

## M10. Self-Improving FM {#m10}

**核心**：模型给自己生成 pseudo-label → 用一致性/自检过滤 → 重训。不依赖外部 reward（区别于 RL）。

**关键技术**：
- STaR (Zelikman 2022) —— 自己 reasoning 对的留下重训
- Self-Rewarding LM (Meta 2024) —— 模型当 self-judge
- ReST^EM (Singh 2023) —— EM self-training
- SPIN —— Self-Play Fine-Tuning

**vs RL**：RL = gradient on reward；self-improving 经常就是 SFT on filtered self-generations，不带 RL 复杂度

**医学场景**：
```
1. Mayo unlabeled CT 100 万张
2. 当前 FM 生成 pseudo-label
3. self-consistency 过滤（同一 CT augment 多次看预测稳否）
4. 稳的当 ground truth 重训
5. iterate
```

**风险**：bias amplification（系统错误强化）

**状态**：**弃**（2026-05-13）。决策理由：
- 医学诊断**无客观 verifier**（不像围棋 / 数学 / 代码可机器判）
- pseudo-label 来自 FM 自己 → 系统错误自我强化
- 唯一可救：锁定有 verifier 的窄子任务（如 seg with TotalSegmentator 对照），但 paper 就缩成小 contribution

---

## M4. Speculative Decoding for Medical {#m4}

**verdict**：technically open，但被看作 engineering 不是 ML。**弃**（除非绑定 reasoning chain 或 EHR drafter 泛化）。

**closest**：
- "Training Domain Draft Models for Speculative Decoding" (2503.07807, 2025) —— 模板，但研究 Function Calling / Biology / 中文，没 medical
- Speculative Decoding and Specialized Drafters (EMNLP 2024)
- ECHO (2604.09450) —— CXR 报告生成加速但用 block diffusion，不是 speculative
- MedAide (2403.00830) —— edge deploy 但用 quantization

**为什么不被发**：
- 纯 ML 不够 novel
- Vanilla speculative decoding **lossless** → 无 clinical safety 故事
- 厂商 (Epic/Nuance/Hippocratic AI/Abridge) 都已经用 vLLM + EAGLE 但不发
- 现在 bottleneck 在 reasoning-time scaling

**3 个 framing**：
1. 中等：domain drafter benchmark on MedQA + MIMIC-CXR （MLHC/MLSys）
2. 较强：accelerate medical reasoning CoT（绑定到 I 方向）
3. 弱：单纯 Medusa on CXR VLM → blog 不是 paper

**Mayo 加成**：弱（仅在 "EHR drafter vs PubMed drafter 泛化 gap" 子 claim 有用）

**venue**：MLHC / MLSys / workshop · **难度**：低 · **Mayo 必需**：no

**结论**：弃，除非和 reasoning chain 或 EHR drafter 绑定。

## M5. Test-Time Training for 3D Radiology FM {#m5}

**verdict**：经典 TTA 在 medical seg 已饱和（MedSeg-TTA benchmark 2025.12，20 方法），但 **per-patient TTT on 3D radiology FM (Merlin/CT-FM/CT-CLIP) 是 virgin**。

**done**：
- 经典 TTA（TENT/AdaBN/MEMO/EATA/SAR/NOTE）—— 饱和
- 几个 2024-25 medical TTT pre-FM 工作（Karani 2021, SicTTA, Zhang 4D interp）
- TTT-KD（点云非医学）

**closest**：
- TTT-KD (2403.11691, 2024) —— DINOv2 KD，点云非医学
- SAM-TTA (2506.05221, 2025/26) —— 2D MedSAM 8 dataset
- MedSAM no-param TTA (2504.02008, 2025) —— 只调 embedding，+3% Dice
- Joshi single-image co-training (MICCAI 2025) —— nnUNet 单病人 SGD
- TTT for 4D interp (2502.02341) —— interp task
- Progressive TTEA (ICCV 2025) —— 模型无关小网络

**未做**：
- Per-patient TTT on 3D CT/MRI FM (Merlin/CT-FM/CT-CLIP/RadFM/3DINO/Triad) with SSL aux loss
- TTT-MLP / probe + frozen FM update
- 分类任务 per-patient FM TTT（现有 TTA 全是 seg）
- Catastrophic forgetting / compute budget 系统研究
- Multi-modal (CT+MRI+EHR) per-patient FM TTT

**claim**：First per-patient test-time training framework for 3D radiology FM with self-supervised auxiliary loss, X% AUROC/Dice gain over zero-shot on OOD CT cohorts with bounded compute per scan.

**venue**：MICCAI / NeurIPS · **难度**：中 · **Mayo 必需**：no（公开 OOD splits 够；Mayo 加 per-site shift 故事）

**风险**：实证 — TTT 在 3D FM 上有效性未验证，可能 negative result

---

## M9. Flow Matching as FM Pretraining {#m9}

**verdict**：generative side 活跃（20-40 篇 2024-26），**作 FM pretraining objective 基本零**。

**⚠️ Subagent 关键警告**：
> "90% of medical FM papers literally swap DDPM for CFM and report a speedup. That alone is not a strong contribution anymore. Prior generative-pretrain work in natural images mostly **loses** to MIM/contrastive."

→ Single 'first FM with flow matching' angle reviewer 会怼 "why not MAE/DINOv2?"

**done**：
- 3D Medical generation: MAISI-v2、WFM、FlowLet、SynthRAD FM、Yazdani MICCAI 2025 OT-FM
- FM as pretraining objective: 几乎零（MedSymmFlow 是 2D MedMNIST hybrid）
- Rectified flow: MAISI-v2、PMRF (CE-MRI)、multi-modal straight FM

**closest**：
- MAISI-v2 (AAAI 2026) —— 3D 高清 CT 合成 + region contrastive，33x 加速
- WFM (MIDL 2026, 2604.21146) —— 3D wavelet FM, BraTS only
- FlowLet (2601.05212) —— age-conditioned 3D brain MRI
- Yazdani MICCAI 2025 (2503.00266) —— first OT-FM medical 但纯合成
- MedSymmFlow (DGM4MICCAI 2025) —— symmetric FM joint cls+gen, 2D MedMNIST
- Temporal FM (2508.21580) —— 4D 纵向轨迹

**真正能写的角度（必备一个）**：
1. FM 在 transfer 上**真的赢** MAE/DINOv2（历史经验：generative pretrain 大概率输）
2. **Joint generative+representation 目标**（REPA / RCG / l-DAE 适配 3D 医学）
3. **OT 直线路径性质 → 中层 feature 更好**（可测的，novel）
4. FM velocity field 作 inverse problem 物理先验（MRI recon / 低剂量 CT）+ 不确定性

没有以上任一 = workshop paper，不是顶会。

**claim**：First 3D medical FM with flow matching objective, matching/beating MAE/DINOv2 on transfer (要先实证 win 才能 claim).

**venue**：CVPR / NeurIPS（成功）/ workshop（不成功）· **难度**：中 · **Mayo 必需**：no（公开数据 50k–200k volumes 够）

**风险**：generative pretrain 历史败给 contrastive，要赢难

**结论**：比初印象暗，trendy 但 reviewer barrier 高

---

## 已弃 (with reason)

| Method | 弃因 |
|---|---|
| M1 Mamba | Mamba 信任降低 + vision 上未必赢 |
| M2 MoE | "很多人做过"（用户判断）|
| M6 V-JEPA | 用户跳过 |
| M7 3D learnable tokenizer | "肯定有人做过"（用户怀疑）|
