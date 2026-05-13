# Stage 1A: ML Venue Trending Papers

> Compiled 2026-05-13. Citation counts approximate (Semantic Scholar / Google Scholar). "high"/"viral"/"n/a" where exact counts unavailable.
> Venues: NeurIPS 2024/2025, ICML 2024/2025, ICLR 2025/2026, CVPR 2024/2025, AAAI 2025, ML4H, NeurIPS D&B, high-citation arXiv.

## A. General Foundation Model (non-medical) — Trending

### A1. Reasoning / Test-time scaling (o1 era)

- **OpenAI o1 / "Learning to reason with LLMs"** — OpenAI tech report, 2024.09. RL-trained long CoT; spawned the entire "reasoning model" era. Tags: reasoning, RL, CoT, test-time compute. Cites: viral 1000+.
- **DeepSeek-R1: Incentivizing Reasoning via RL** — arXiv 2501.12948 → Nature 2025.09. Open-weight o1-competitive; pure RL (GRPO), no SFT cold-start for R1-Zero. Cites: 1000+. Sparked "GRPO everywhere".
- **Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Parameters** — ICLR 2025 Oral, arXiv 2408.03314, Google DeepMind. Adaptive TTC; small + TTC > 14× larger. Cites: 600+.
- **QwQ-32B / "Qwen with Questions"** — Alibaba Qwen, 2024.11. First strong open reasoning model.
- **Marco-o1** — arXiv 2411.14405, Alibaba MarcoPolo. MCTS + self-reflection.
- **s1: Simple Test-Time Scaling** — Stanford arXiv 2501.19393, 2025.02. 1K examples + budget forcing ≈ o1-preview. Viral on Twitter.
- **LIMO: Less is More for Reasoning** — SJTU arXiv 2502.03387. 817 examples strong math.
- **Inference Scaling Laws** — ICLR 2025, CMU.
- **Are More LLM Calls All You Need? Scaling Compound AI Systems** — NeurIPS 2024. Non-monotonic scaling for vote/filter pipelines.

### A2. Multimodal / VLM

- **Qwen2-VL** — arXiv 2409.12191, Alibaba. Naive dynamic resolution, M-RoPE; 72B ≈ GPT-4o. Cites: 500+.
- **Qwen2.5-VL** — arXiv 2502.13923. Stronger doc parsing, long-video, agentic grounding.
- **InternVL 2.5 / 3 / 3.5** — arXiv 2412.05271 / 2504.10479 / 2508.18265, OpenGVLab + Shanghai AI Lab. Open-source GPT-4o competitor.
- **LLaVA-OneVision / 1.5** — arXiv 2408.03326 / 2509.23661, ByteDance + NTU. Unified image/video/multi-image; 1.5 = fully-open w/ RICE-ViT.
- **Molmo + PixMo** — arXiv 2409.17146, Ai2. Open VLM with point-grounding data; outperforms many closed VLMs.
- **NVLM 1.0** — arXiv 2409.11402, NVIDIA. Hybrid decoder + cross-attn.
- **Pixtral 12B** — arXiv 2410.07073, Mistral. Native multimodal, flexible resolution.
- **Cambrian-1** — NeurIPS 2024, NYU/Meta. Vision-centric VLM, CV-Bench.
- **VGGT: Visual Geometry Grounded Transformer** — Oxford + Meta, **CVPR 2025 Best Paper**. Single forward pass solves geometry.
- **VLMs Survey of 26K papers** — arXiv 2510.09586. Sharp rise of multimodal-LLM work.

### A3. Agent / Tool use

- **AvaTaR** — Stanford NeurIPS 2024. Contrastive prompt optimization for tool-use.
- **SWE-agent / SWE-bench Verified** — Princeton + Sierra NeurIPS 2024. Agent-computer interfaces. Cites: 500+.
- **OSWorld** — HKU NeurIPS 2024. Real OS, 369 tasks for multimodal agents. Cites: 300+.
- **Computer-Using Agent / Claude Computer Use / OpenAI Operator** — 2024.10–2025; cited heavily across NeurIPS 2025 GUI-agent workshop (45 papers).
- **Magentic-One** — Microsoft Research 2024. Generalist multi-agent.
- **Reflective Multi-Agent Collaboration** — NeurIPS 2024.

### A4. Diffusion / Generative / Flow matching

- **SD3 / Stable Diffusion 3: Scaling Rectified Flow Transformers** — Stability arXiv 2403.03206 → **ICML 2024 Best Paper**. Rectified flow + MM-DiT. Cites: 500+.
- **Flux.1** — Black Forest Labs 2024.08. Successor of SD3.
- **Train for the Worst, Plan for the Best (Masked Diffusion)** — **ICML 2025 Outstanding**. Masked diffusion 7% → 90% with planning.
- **Genie 2** — Google DeepMind. Foundation world model from images.
- **Meta Movie Gen 32B** — arXiv 2410.13720.
- **FAD (Full-Atom Diffusion Transformer)** — Meta + Cambridge + MIT, ICML 2025. Unified periodic + non-periodic atomic systems.
- **On the Guidance of Flow Matching** — ICML 2025. CFG-equiv for FM.

### A5. Architecture innovations

- **Mamba-2 / Transformers are SSMs** — ICML 2024, Dao & Gu. State-Space Duality. Cites: 400+.
- **Mixtral / Mixtral 8x22B** — arXiv 2401.04088. Open MoE. Cites: 1000+.
- **DeepSeek-V3** — arXiv 2412.19437, 2024.12. 671B MoE / 37B active; MLA + DeepSeekMoE; 2.8M H800-hours. Cites: 1000+ viral.
- **DeepSeek-V2** — arXiv 2405.04434. Introduced MLA.
- **Llama 3 Herd of Models** — arXiv 2407.21783, Meta. Cites: 1500+.
- **Llama 4 Scout / Maverick** — Meta 2025.04. MoE era.
- **Memory Layers at Scale** — Meta arXiv 2412.09764. Trainable KV memory as drop-in.
- **Gated Attention for LLMs** — Qwen, **NeurIPS 2025 Best Paper Oral**. Sigmoid gate post-SDPA; deployed in Qwen3-Next-80B.
- **TTT layers (Test-Time Training)** — Stanford arXiv 2407.04620. RNN hidden state is itself a model.
- **MoR (Mixture of Recursions)** — KAIST 2025.
- **BitNet b1.58 / 1-bit LLMs** — Microsoft arXiv 2402.17764. Cites: 500+.

### A6. Post-training (RLHF / DPO / RLAIF / Constitutional)

- **Tülu 3** — Ai2 arXiv 2411.15124. Open SFT → DPO → RLVR recipes. Cites: 300+.
- **SimPO** — Princeton NeurIPS 2024. Reference-free preference optim.
- **ORPO** — KAIST EMNLP 2024. Monolithic preference optim.
- **KTO** — Stanford ICML 2024. Kahneman-Tversky.
- **Asynchronous RLHF** — ICLR 2025.
- **Direct Nash Optimization (DNO)** — Microsoft arXiv 2404.03715.
- **Self-Rewarding LLMs** — Meta ICML 2024.
- **Inverse Constitutional AI** — ICLR 2025.

### A7. Interpretability / Safety / Alignment

- **Scaling Monosemanticity (Claude 3 Sonnet SAE)** — Anthropic transformer-circuits.pub 2024.05. Featured Golden Gate Bridge demo.
- **Sparse Autoencoders Find Highly Interpretable Features in LMs** — ICLR 2024.
- **Survey on SAEs** — arXiv 2503.05613.
- **Gemma Scope** — DeepMind arXiv 2408.05147. Open SAE library across Gemma layers.
- **Safety Alignment Should Be More Than a Few Tokens Deep** — Princeton **ICLR 2025 Outstanding**. Shallow alignment fragility. Cites: 200+.
- **SORRY-Bench** — ICLR 2025. Fine-grained safety refusal.
- **Alignment Faking in LLMs** — Anthropic arXiv 2412.14093. Viral.

### A8. Scaling laws / Efficiency

- **FlashAttention-3** — Princeton + NVIDIA arXiv 2407.08608. Cites: 400+.
- **Triton + ThunderKittens** — Stanford Hazy Research 2024.
- **Compute-Optimal Inference for Problem Solving** — ICLR 2025.
- **Speculative Decoding: EAGLE, EAGLE-2, Medusa-2** — 2024–2025 family.

---

## B. Medical Foundation Models at ML Venues — Trending

### B1. 3D CT/MRI Foundation Models

- **Merlin: VL FM for 3D CT** — Stanford AIMI arXiv 2406.06512, 2024.06. 15.5K CT + reports + EHR. Cites: 100+. Flagship 3D CT FM.
- **CT-CLIP / CT-CHAT** — arXiv 2403.17834. 50K 3D chest CT, ViT-3D CLIP + chat. Cites: 150+.
- **RadFM** — SJTU arXiv 2308.02463 → Nat Commun 2025. 13M 2D + 615K 3D. Cites: 300+.
- **M3D** — arXiv 2404.00578. 120K image-text pairs for 3D MRI/CT VLM. Cites: 80+.
- **MISFM / Volumetric Medical Imaging FM** — Microsoft Health, NeurIPS 2024 D&B.
- **BrainGPT** — Nat Commun 2025. 18,885 text-scan pairs, 74% Turing-test indistinguishable for 3D brain CT report gen.
- **3D FM for Generalizable Disease Detection in Head CT** — arXiv 2502.02779.
- **TotalFM** — arXiv 2601.00260. Organ-separated 3D CT VLM.
- **MambaMIM** — arXiv 2408.08070. Mamba SSM 3D pretraining.
- **SegMamba / SegMamba-V2** — IEEE TMI 2025.

### B2. Medical VLMs / Report Generation

- **Med-Gemini** — Google DeepMind arXiv 2404.18416. SOTA 10/14 benchmarks, 91.1% MedQA. Cites: 300+.
- **LLaVA-Med** — Microsoft NeurIPS 2023 D&B. Cites: 800+.
- **BiomedCLIP** — Microsoft arXiv 2303.00915 → NEJM AI 2024. Cites: 600+.
- **CONCH** — Mahmood Lab Nat Med 2024. 1.17M image-caption pairs for pathology. Cites: 400+.
- **PathChat** — Mahmood Lab Nature 2024. UNI + Llama-2-13B + 456K instructions. Cites: 250+.
- **CheXagent** — Stanford AIMI arXiv 2401.12208. 8B params, CheXinstruct. Cites: 200+.
- **VILA-M3** — NVIDIA CVPR 2025. 4th-stage specialized tuning, +9% over Med-Gemini.
- **HealthGPT** — arXiv 2502.09838. H-LoRA unified med-LVLM.
- **Lingshu** — arXiv 2506.07044, 2025.06. Generalist med VLM.
- **Uni-Med** — NeurIPS 2024. 6 medical tasks unified.
- **MedPLIB** — AAAI 2025. MeCoVQA, pixel-level grounding, 8 modalities.
- **CXPMRG-Bench / DART / MLRG** — CVPR 2025. Multi-view longitudinal CXR.
- **FactCheXcker** — CVPR 2025. Mitigating measurement hallucinations.
- **Multi-Resolution Pathology-Language Pretraining** — CVPR 2025.

### B3. Medical Reasoning / o1-medical

- **HuatuoGPT-o1** — CUHK-Shenzhen arXiv 2412.18925, 2024.12. 40K CoT, +8.5pt. Cites: 100+.
- **m1: Test-Time Scaling for Medical Reasoning** — arXiv 2504.00869. 1K examples → 60.32% (beat HuatuoGPT-o1-7B).
- **MedReason** — arXiv 2504.00993. Factual reasoning via knowledge graphs.
- **Disentangling Reasoning and Knowledge in Medical LLMs** — arXiv 2505.11462.
- **Med-U1** — arXiv 2506.12307. RL for unified medical reasoning.
- **Med-R1** — arXiv 2503.13939. RL for medical VLM reasoning; +29.94% over Qwen2-VL-2B.
- **MedTVT-R1** — arXiv 2506.18512. Multimodal LLM reasoning + diagnosis.
- **ControlMed** — arXiv 2507.22545. Controllable reasoning depth.
- **RadThinking** — arXiv 2605.10761 (2026.05). Longitudinal clinical reasoning dataset.

### B4. Medical Agent / Tool use

- **MDAgents** — MIT/Google NeurIPS 2024. Adaptive multi-agent for med decisions; +4.2% over solo; SOTA on 7/10 benchmarks. Cites: 200+.
- **MedAgents (NAACL 2024)** — Specialist role assignment.
- **MedAgent-Pro** — arXiv 2503.18968. Evidence-based multimodal agentic workflow.
- **DoctorAgent-RL** — arXiv 2505.19630. Multi-agent collaborative RL clinical dialogue.
- **Agent Hospital** — Tsinghua arXiv 2405.02957. Simulated hospital with LLM agents.
- **MMedAgent / MedAgentSim** — MICCAI 2025.
- **Tree-of-Reasoning** — arXiv 2508.03038. Tree search for medical dx.
- **ABRA** — arXiv 2605.11224. Radiology agent benchmark.
- **EHR Database Agents** — ICLR 2026.

### B5. Pathology Foundation Models

- **UNI** — Mahmood Lab Nat Med 2024. 100M patches / 100K slides, MGB. Cites: 600+.
- **Virchow** — Paige.AI Nat Med 2024. 1.5M WSIs / 100K patients; 632M ViT, DINOv2. Cites: 400+.
- **Virchow2 / 2G** — arXiv 2408.00738. Mixed-magnification scaling.
- **Prov-GigaPath** — Microsoft + Providence Nature 2024. 1.3B tiles. LongNet aggregator. Cites: 200+.
- **TITAN** — Mahmood Lab arXiv 2411.19666. Slide-level FM.
- **PRISM** — Paige slide-level FM.
- **CHIEF** — Harvard Nature 2024. 60K WSIs across 19 sites.
- **GPFM** — arXiv 2407.18449. DINOv2 pathology FM.
- **Hibou** — arXiv 2406.05074. 1.2B patches.
- **RudolfV** — 2024. Pathologist-knowledge DINOv2, 58 tissues, 129 stains.
- **Are Pathology FMs Robust to Center Differences?** — arXiv 2501.18055. Site-leakage critique.

### B6. EHR / Multimodal Patient FMs

- **ETHOS** — MGH/Harvard npj DM 2024. GPT on tokenized patient timelines, zero-shot. Cites: 100+.
- **CLIMB** — arXiv 2503.07667. 4.51M patient samples, 19TB across imaging/lang/temporal/graph.
- **APOLLO** — arXiv 2604.18570. Multimodal temporal FM for virtual patient.
- **EHR FM via Next Event Prediction** — arXiv 2509.25591.
- **Generative Medical Event Models Improve with Scale** — Epic + Stanford arXiv 2508.12104.
- **Integrating Genomics into Multimodal EHR FMs** — Verily 2025.10.
- **From EHRs to Patient Pathways with LLMs** — arXiv 2506.04831.
- **Foundation Models for EHRs: Representation Dynamics and Transferability** — arXiv 2504.10422.
- **FORMED** — ICLR 2026. Generalizable medical time series FM.
- **Benchmarking ECG FMs Across Clinical Tasks** — ICLR 2026.
- **Joint Adaptation of Uni-modal FMs for Multi-modal Alzheimer's Diagnosis** — ICLR 2026.
- **NurValues** — ICLR 2026. Real-world nursing values eval.

### B7. Other (specialty / evaluation / safety)

- **MedSAM** — Bo Wang lab Nat Commun 2024. 1.57M image-mask pairs, 10 modalities, 30+ cancers. Cites: 800+ viral.
- **MedSAM-2** — arXiv 2408.00874. Segment as video, one-prompt across slices.
- **SAM 2 (Meta)** — arXiv 2408.00714. Massive medical follow-on. Cites: 800+.
- **MedDINOv3** — arXiv 2509.02379. DINOv3 adaptation for medical seg.
- **Does DINOv3 Set a New Medical Vision Standard?** — arXiv 2509.06467. Benchmarks 2D/3D cls/seg/reg.
- **FairMedFM** — NeurIPS 2024 D&B. 17 datasets × 20 FMs fairness. Cites: 100+.
- **Demographic Bias of Expert-Level VLM in Medical Imaging** — NeurIPS 2024.
- **Enhancing VLMs for 3D Medical via Slice Selection** — NeurIPS 2024 D&B.
- **BrainMD** — NeurIPS 2024 D&B. 3D MRI + reports + EHR + Vote-MI selection (+14.6% zero-shot).
- **Foundation Models in Medical Imaging — Review and Outlook** — arXiv 2506.09095.
- **What Does It Mean for a Medical AI System to Be Right?** — arXiv 2605.11963.
- **Verification Mirage** — arXiv 2605.10850. Self-verification reliability boundary.
- **GenMed** — arXiv 2605.10645. Pairwise generative reformulation.
- **Beyond Masks: Case for Medical Image Parsing** — arXiv 2605.11438.
- **Checkup2Action** — arXiv 2605.11533. Multimodal check-up report dataset.
- **MedPaLM 2 / M** — Google 2023–24.
- **AIM-FM Workshop** — NeurIPS 2024.
- **CVPR 2025 FMV Workshop** — 2nd Foundation Models for Medical Vision.
- **MICCAI 2024 FM track** — UNI-Med, MedSAM follow-ups, RadFM extensions.

---

**Total surveyed: ~85 papers** spanning General FM (~50) + Medical FM (~35) at ML venues.
