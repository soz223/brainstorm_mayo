---
title: "TimeFM-3D:纵向 3D 医学影像基础模型"
subtitle: "ACCESS Accelerate 计算资源申请 · 12 个月"
author: "PI: Lifang He(Lehigh University, CSE)· CoPI: Songlin Zhao(Lehigh University, CSE)"
geometry: "margin=1in"
fontsize: 11pt
mainfont: "Times New Roman"
---

> 仅供阅读参考。**提交版本是英文 [main-document.md](main-document.md)。**

# Research Objectives(研究目标)

临床影像决策**根本上依赖时间上的变化**,而不是单张影像:肺结节是否增大(Fleischner 2017)、肿瘤是否响应治疗(RECIST 1.1)、胶质瘤是否进展(RANO)、脑是否萎缩。但所有公开的 3D 医学影像基础模型 —— CT-FM [1]、BrainIAC [2]、M3FM [3]、Merlin [4]、BiomedCLIP [5] —— 都**独立编码每张影像**,丢掉了临床实践依赖的时间维度。**目前没有任何 3D 基础模型原生接受 irregular-Δt 序列输入**(2D 的 BioViL-T [7] 是最接近的类比,但仅限胸片)。规模化的纵向队列已经存在:NLST(26,254 名受试者,每人最多 3 次年度胸 CT)、ADNI / OASIS-3 / AIBL / NACC(十年以上的重复脑 MRI/PET)、肿瘤试验(每人 4–8 次随访)。

**我们要构建 TimeFM-3D —— 第一个以"每患者 3D 影像序列(CT/MRI/PET,任意 Δt)"为原生输入的 3D 医学影像基础模型。** 在约 30,000 名病人(每人 ≥2 个 timepoint)上做自监督预训练,在 7 个临床有意义的纵向任务上**正面对标**最强的单影像基线(Sybil [6]、BrainIAC、CT-FM、M3FM)。

**预注册主要指标(pre-registered)**:TimeFM-3D 在 **7 个纵向任务中至少 5 个**上,绝对 AUC / C-index 比最强单影像基线**提高 ≥ 3%**(Benjamini–Hochberg 校正后 p<0.05;DeLong 检验 + patient-level cluster bootstrap)。剩下 ≤2 个任务最可能是 RECIST 短间隔响应和同日 CT/PET 配对 —— Δt 信号本身就弱 —— 我们预期持平,不期望胜出。

**Supporting grant 对齐**。本申请是已经过同行评审的 grant [PI L. He: NSF / NIH **\[award number 待填\]**, "[title 待填]"] 的 **Aim [N — 待填]** 的算力密集型实现部分。该 grant 资助人员、数据获取以及 Mayo 本地 PHI 算力,**不**资助公开云 HPC。ACCESS 这笔正好补上这个缺口 —— 公开语料的 ablation 矩阵、scaling-law 研究、release reproducibility 重训,这些是 grant aim 要求但不能在 PHI 集群上跑的工作。**未扩展任何超出 grant 范围的科学方向。**

# Estimate of Compute, Storage and Other Resources(算力、存储与其他资源估算)

**预训练语料**。≈30,000 病人 × 平均 3 timepoint = ≈90,000 volumes;192³ fp16 ≈ 14 MB → 1.3 TB 预处理 shard + 10 TB 原始 NIfTI staging。队列(全部去标识、public-DUA):ADNI / OASIS-3 / PPMI(已在手);NLST(≈26 K,TCIA 公开,影像不需 DUA);AIBL / NIFD / NACC-SCAN(DUA 已于 2026-04 提交);Yale-Brain-Mets / LUMIERE(公开);Anti-PD-1 Lung + HNSCC(TCIA 开放子集);Anti-PD-1 Melanoma(受控访问 DUA 处理中 —— 即使 drop Melanoma 语料仍有 ≥27 K)。

**算力估算(benchmark 实测)**。throughput 在 H100 SXM5 80 GB 上实测 —— 250 M 参数 SwinUNETR 衍生 encoder(custom-depth Swin-3D,≈170 M;config 随代码 release)+ Δt-aware Temporal Transformer(12 层 16 头 d_model 1024,≈80 M),FSDP bfloat16 + gradient checkpointing —— 端到端(含 data loading + 计算)**1.4 sequences/s/GPU**,从 8 → 32 GPU 的 **strong-scaling 效率 0.85**(NCCL-bound,Nsight Systems 实测)。收敛判据用 **val-loss plateau**(Δ<1×10⁻³ 持续 10 K 步,1 K-patient held-out 子集);200 M prototype 在 ≈300 K 步达到,full 250 M 预算 500 K。Ablation 用同一 throughput 在 5 K-patient 子集上跑 200 K 步验证每个 SSL 目标的贡献,不跑到 full 收敛。

**GH200 / H100 比值**。在 250 M 参数尺度,GH200 的 HBM3e 带宽优势压缩到 **≈1.0× H100**(NVIDIA MLPerf v4.0 [30] 数据显示 ≥70 B 参数 inference 优势 ≈1.7×,降到 <1 B 参数 mixed-precision 训练时大致持平,因为此时是 compute-bound 而非 bandwidth-bound)。第 1 个月在 DeltaAI 上 4 节点 sanity check 测真实比值;如果 <1.0×,自动触发下面 §Computational Plan 的 Plan A。DeltaAI 上的 SU 按 1:1 等价于下表的 H100-hour 预算。

| 工作负载 | GPU-hr(H100 等效)| 算式(系统 throughput = 1.4 seq/s/GPU × 8 GPU = 11.2 seq/s)|
|---|---|---|
| Ablation:3 SSL × 2 backbones × 3 sizes = 18 runs,5 K-patient 子集 | **≈5,800** | 200 K 步 × 8 seq/step ÷ 11.2 seq/s = 142,857 s ≈ 40 hr wall × 8 GPU = **320 GPU-hr / run × 18** |
| Scaling-law(5 尺寸 75 M → 600 M,全语料到 plateau)| **≈20,000** | 大尺寸主导;尺寸加权平均 ≈ 4,000 GPU-hr / 尺寸 |
| 公开 release 重训(250 M 全语料 500 K 步)| **≈25,000** | 250 M 规模 32-GPU FSDP,多周墙钟 |
| 下游评测(7 task × 5 fold,FT + linear probe = 35 runs)| **≈8,000** | ≈230 GPU-hr / run |
| **Core ACCESS 申请** | **≈59,000** | |
| *Stretch(月 9–12,看月 6 burn rate):独立第三方复现 run* | *≈30,000* | |
| **总计** | **≈89,000 GPU-hr** | |

**Credit 换算**(提交前用 ACCESS Exchange Calculator 即时算):89,000 H100-eq GPU-hr ≈ **[CREDITS 待算]** ACCESS credits。落在 [1.5 M, 3 M] 区间 → Accelerate;若 <1.5 M → 改投 Discover。

**On-prem vs ACCESS 角色不重叠**。CoPI 组拥有 Mayo Clinic affiliate 账号,可使用 **专用于 PHI 临床工作负载** 的 20 × H200 集群;ACCESS 跑公开 DUA 预训练、ablation、scaling、reproducibility,释放 Mayo 容量给临床任务。两者**不可替代**:(i) 没有 Mayo affiliate 凭据的 Lehigh 学生与外部合作者不能用 Mayo 集群;(ii) 公开 reproducibility 必须在他人可检查的资源上跑。

**存储**。12 TB scratch(原始 NIfTI staging + WebDataset shard + 活跃 checkpoint),**自动 30 天清理**(Slurm prolog + manifest checksum 校验);6 TB project 存储用于持久 artifact(最终 checkpoint、日志、manifest、release tarball)。原始 NIfTI 在 cache 验证后清除。

**资源选择**。**两个针对架构的 Apptainer image**(aarch64 for GH200 + x86_64 for H100),来自同一个 Dockerfile + 架构特定 PyTorch wheel:

1. **首选 — NCSA DeltaAI**(每节点 4 × **GH200** superchip,aarch64;SU = 1 GH200-hr)。
2. **次选 — Purdue Anvil AI**(21 × 4 × **H100 SXM 80 GB**,x86_64)。"Anvil AI" 是 H100 partition;不申请 "Anvil GPU"(A100)。
3. **备选 — PSC Bridges-2 GPU-AI**(10 × 8 × **H100 SXM5 80 GB**,x86_64)。

# Computational Plan(计算计划)

**架构**。(i) 单影像 3D encoder —— custom-depth Swin-3D(≈170 M 参数,MONAI config 随代码 release),CT-FM 权重初始化;ConvNeXt-3D-L、ViT-B 3D 作 ablation backbone。(ii) Δt 的**连续时间位置编码**:Fourier 特征(Time2Vec [8])。(iii) **Δt-aware Temporal Transformer**(12 层 16 头 d_model 1024,≈80 M 参数),注意力被一个 Δt 的可学习函数偏置。总参数 ≈250 M。

**三个自监督目标,curriculum 调度**。

- **IA-MVM** —— 间隔感知的 masked volume modeling:在 Δt 条件下重建 ≈50 % 被遮盖的体素(CT 用 HU bin cross-entropy,MRI 用 z-score regression)。Δt 作为可学习 scaling 加在 decoder 的 cross-attention 上,强制 encoder 使用时间上下文而非直接 copy 前一时刻。
- **NVP-LS** —— latent 空间下一时刻预测:用 z_{<t_i} 和目标 Δt 预测 z_{t_i},cosine + InfoNCE。在 latent 空间而非体素空间预测,避免自回归代价;以目标 Δt 为输入使任务"轨迹感知"而非"下一帧感知"。
- **CMTC / TPC** —— 同 timepoint 跨模态对比(HNSCC 的 CT/PET);纯影像 fallback 是同病人时序对比 vs 不同病人时序对比,按 Δt bucket 匹配,防止模型坍缩到"病人 ID"作为对比线索。

Curriculum:前 10 K 步只跑 IA-MVM(≈5 % 预算;200 M prototype 实测在这个点之后加 NVP-LS 不会坍缩);之后加 NVP-LS,再加 CMTC/TPC。每个目标独立 ablate。**Ablation runs 用 5 K-patient 子集跑 200 K 步;full pretrain 用 ≈30 K 病人跑 500 K 步。**

**Curation(作为社区 asset 释出)**。DICOM → NIfTI(`dcm2niix`);每模态强度归一(CT:HU 窗位窗宽;MRI:z-score;PET:SUV);跨 Δt 刚体配准到 baseline(体部 CT fallback 用 ANTs SyN deformable);BIDS 风格 manifest,带连续 Δt + 模态/部位 tag。

**评测**。AD 24 个月内转化(ADNI)vs SSL-AD / BrainIAC;胶质瘤进展(Brain-Tumor-Progression / LUMIERE);1/2/6 年肺癌风险(NLST)**与 Sybil [6] 公开 checkpoint 正面对标**;RECIST 治疗响应(Anti-PD-1, HNSCC);生存时间死亡(NLST, Anti-PD-1)用 C-index + integrated Brier score。Linear probe 和 full fine-tune 都报告;5-fold CV + 留出 OOD 站点。**Power 分析**:NLST n ≈ 10 K 测试,80 % power 检出预注册的 3% AUC delta(α=0.05;DeLong + patient-level cluster bootstrap)。

**对所申请资源的先有经验**。CoPI 组在 Mayo 20 × H200 集群上运行**与本申请完全相同的** FSDP / Apptainer / MONAI 栈,自 **2025-09** 累计已消耗 **≈[USAGE 待填] GPU-hr**,产出 200 M 参数 TimeFM-3D prototype —— 上面 1.4 seq/s/GPU 的 throughput 和 0.85 strong-scaling 效率就是在该 prototype 上**实测**(非外推)。CoPI 编写了 Apptainer image、Slurm job-array launcher、WebDataset shard pipeline(现役),代码可供 reviewer 检查:**github.com/[org 待填]/timefm3d-runtime**(BSD-3,单节点可复现)。**Prior ACCESS allocation**:目前没有 —— 这是团队首次 ACCESS 申请;上面同栈的本地经验证明能力。

**Contingency(预先制定)**。**Plan A**:若第 1 月 DeltaAI sanity check 测出 GH200/H100 throughput <1.0×,scaling-law 砍到 3 个尺寸(去掉 75 M / 600 M 端点),ablation grid 砍到 12 runs(去掉最小尺寸),完整保留每个 SSL × backbone 组合。**Plan B**:Melanoma 受控 DUA 不下来,从 multimodal contrastive 中删除 PET 队列;CMTC 退化为 TPC-only。体部 CT 配准失败 → ANTs SyN + Δt-aware loss masking。SSL 坍缩 → curriculum 仅 IA-MVM + InfoNCE 温度搜索。

# Software & Specialized Needs(软件与特殊需求)

PyTorch 2.x · Lightning · **FSDP**(首选,在 H100 prototype 250 M 尺度实测比 DeepSpeed ZeRO-3 每 GPU 内存低 ≈12 %)· **DeepSpeed ZeRO-3**(fallback,scaling-law 600 M 端点 activation 超 80 GB 时启用)· NCCL · CUDA 12.x · HuggingFace `transformers` / `accelerate` · MONAI · torchio · SimpleITK · ANTs · `dcm2niix` · `nibabel` · Weights & Biases · Slurm · **Apptainer / Singularity**(两个针对架构的 image,共享一个 Dockerfile)。全部开源,无 licensed binary,无特殊队列,无长 walltime 任务(单任务 ≤ 48 h)。

# Team and Team Preparedness(团队及准备情况)

**PI Lifang He**(Lehigh CSE,[职称待确认]):机器学习 + 医学影像方向研究组长;多个联邦资助医学 AI 项目的 PI(即上述 supporting grant);主导 Mayo Clinic 合作,产出本申请所引 H100/H200 实测;每周提供方法学指导和 ACCESS 资源使用监督。

**CoPI Songlin Zhao**(Lehigh CSE 博士生,导师 L. He):设计并 prototype TimeFM-3D 架构;编写 curation pipeline、Apptainer image(aarch64 + x86_64)、Slurm launcher、本申请引用的 H100 benchmark;负责 ablation / scaling / 评测的日常执行。

**Mayo Clinic 合作者** —— 各器官临床共同研究者(放射 / 肿瘤 / 信息学);管理 Mayo PHI 数据,数据不离开 Mayo 基础设施。

# Sharing & Compliance(共享与合规)

**Release artifact**(月 9–12):预训练权重(HuggingFace Hub)、代码 + Apptainer image(GitHub,BSD-3)、BIDS 风格 manifest schema、curation 脚本。原始影像不再分发,只释出 access 指针 + DUA 申请说明,严格遵守 NLST / ADNI / OASIS / NACC 条款,符合 NSF 公开访问政策。

**合规**。所有 ACCESS 上的训练只用去标识、public-DUA 影像。PHI 临床数据留在 Mayo 本地集群,任何 PHI 衍生品不上传 ACCESS。PI 承诺遵守 ACCESS Acceptable Use Policy、ACCESS Code of Conduct 及 HIPAA 义务。

[1] CT-FM · [2] BrainIAC · [3] M3FM · [4] Merlin · [5] BiomedCLIP · [6] Sybil · [7] BioViL-T · [8] Time2Vec · [30] NVIDIA MLPerf v4.0 —— 完整 citation 见单独的 References 文档。
