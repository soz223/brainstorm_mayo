# Stage 1A 中文简版：ML 顶会 trending

> 长版 [stage1a-ml-venues.md](stage1a-ml-venues.md)（~85 篇）。本文只挑出最影响 Direction A 决策的 paper + cluster 模式。

## A. 通用 FM 的几个最响 cluster（2024-26）

### A1. 推理模型（o1 时代）
- **OpenAI o1** (2024.09) — 开启整个范式
- **DeepSeek-R1** (Nature 2025) — GRPO 让 RL 推理民主化，**引用 1000+**
- **Scaling Test-Time Compute** (ICLR 2025 Oral) — 小模型 + TTC > 14× 大模型
- **s1 / LIMO** — 极少样本 (1K / 817) 复现 o1 级表现，证明 reasoning 主要靠 SFT 数据质量

→ **趋势：把"训更大模型"换成"训会想得更久的模型"**

### A2. VLM 开源追赶
- **Qwen2.5-VL** / **InternVL3.5** / **LLaVA-OneVision-1.5** / **Molmo** / **Pixtral** — 全 2024 后半到 2025，达到 GPT-4o 级
- **VGGT** — **CVPR 2025 Best Paper**，3D geometry 单次前向

→ **VLM 开源已追平 GPT-4o**，medical 的劣势变小

### A3. 架构：DeepSeek 一家独大 + 新尝试
- **DeepSeek-V3** (2024.12) — 671B MoE / 37B active；引用 1000+
- **Mixtral 8x22B** — 开 MoE 时代
- **Llama 4 Scout / Maverick** — Meta 转向 MoE
- **Gated Attention** — **NeurIPS 2025 Best Paper**，部署在 Qwen3
- **Memory Layers** (Meta, 2024.12) — 引用低（前面已弃）

→ **MoE 成主流；其他架构 (Mamba / SSM / Memory Layer) 信号弱**

### A4. 解释性（与 K 方向相关）
- **Scaling Monosemanticity** (Anthropic 2024.05) — Golden Gate Claude
- **Gemma Scope** (DeepMind) — 开源 SAE 库
- **SAE Survey** (2503.05613) — 综述
- **Alignment Faking** (Anthropic 2024.12) — viral

→ **interp 已成熟子领域，应用到 medical 是 GeoSAE 那条线（我们已 cover）**

### A5. 安全 / 对齐
- **Shallow Safety Alignment** — **ICLR 2025 Outstanding** — alignment 脆弱性

## B. ML 顶会的 medical FM cluster

### B1. 3D CT/MRI FM
**Merlin / CT-CLIP / RadFM / M3D / CT-FM / Triad / 3DINO-ViT / BrainIAC / BTB3D**

→ **全是 single-timepoint**。这是 Direction A 的核心机会

### B2. Medical VLM / 报告生成
- **Med-Gemini** (Google 2024) — 91.1% MedQA，引用 300+
- **LLaVA-Med** — 引用 800+
- **MedPLIB** — **AAAI 2025**，pixel-level grounding
- **VILA-M3** — **CVPR 2025**，+9% over Med-Gemini
- **MAIRA-2** — Microsoft，grounded CXR

→ **报告生成是红海**

### B3. Medical Reasoning（与 I 方向相关）
- **HuatuoGPT-o1** (2024.12) — 第一波，**纯文本**
- **m1** (2025.04) — TTS for medical reasoning
- **Med-R1** — VLM + RL，**+29.94%** over Qwen2-VL-2B
- **MedReason** — KG-grounded

→ **3D imaging-grounded reasoning 真的还空**

### B4. Medical Agent
- **MDAgents** (NeurIPS 2024, MIT/Google) — 引用 200+
- **Agent Hospital** — Tsinghua simulation
- **DoctorAgent-RL**
- **ABRA** — 放射 agent benchmark

→ **MDAgents 已经成 reference paper**

### B5. Pathology FM（与 Direction A 不直接竞争但参考）
**UNI / Virchow / Prov-GigaPath / TITAN / CONCH / CHIEF / GPFM** —— 全部 Nat Med / Nature 级

→ **Pathology FM 比 radiology FM 成熟 1-2 年。Radiology 还有空间**

## 重要 takeaway 给 Direction A

1. **3D FM 全是 single-timepoint** —— 没人在 ML 顶会发过 multi-timepoint 3D medical FM
2. **Reasoning + multimodal + RL** 是 2026 工业界 hire 关键词全家桶
3. **MoE + Gated Attention** 是当前架构主流；Mamba / Memory Layer 不要碰
4. **MDAgents / Merlin / RadFM / CT-CLIP** 必引必 beat
5. **VLM 开源已追平 GPT-4o**——medical FM 训出来不会被闭源吊打

## 没人发的（白点）

- 3D + longitudinal + reasoning **三合一**
- 3D medical FM 的 mech interp 系统应用（GeoSAE 是 brain MRI / 2D 投影）
- Medical reasoning 的 verifier-grounded RL（HuatuoGPT-o1 verifier 烂）
- 真正 patient-level multimodal + longitudinal（HONeYBEE / CLIMB / Merlin 都是单 timepoint）
