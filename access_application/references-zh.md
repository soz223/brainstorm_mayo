---
title: "参考文献 —— TimeFM-3D ACCESS 申请(中文标注)"
geometry: "margin=1in"
fontsize: 10pt
---

> 仅供阅读参考。**提交版本是英文 [references.md](references.md)。**
> 这里给每条引用一段中文说明:**是什么 / 我们引它做什么用**。
> [1]–[8] 与 [30] 是主文档(main-document.md)的内联引用,其余是背景文献。

---

[1] **Pai 等,2024,*Nat Mach Intell***。CT-FM —— 癌症影像生物标志物的 3D CT 基础模型。**用途**:单影像 3D 医学基础模型的代表;也是我们 SwinUNETR encoder 的初始化权重来源。

[2] **BrainIAC,*Nat Neurosci*(2026 in press)**。成人脑 MRI 的 3D 基础模型。**用途**:脑 MRI 下游任务的主要单影像基线。预印本 https://arxiv.org/abs/2412.11042

[3] **Niu 等,2025,*Nat Commun***。M3FM —— 用于肺癌筛查及其他任务的多模态多任务医学基础模型。**用途**:NLST CT 上的关键基线 + ablation 比较对象。

[4] **Blankemeier 等,2024,arXiv**。Merlin —— 3D CT 的视觉语言基础模型。**用途**:CT 类基础模型的另一代表。

[5] **Zhang 等,2023,arXiv**。BiomedCLIP —— 1500 万图文对预训练的生物医学多模态基础模型。**用途**:VLM 类基础模型对照。

[6] **Mikhael 等,2023,*JCO***。Sybil —— 单 LDCT 预测 1–6 年肺癌风险。**用途**:NLST 任务上的最强公开 baseline,**正面对标**。

[7] **Bannur 等,2023,CVPR**。BioViL-T —— 在生物医学 VLM 里利用时序结构(2D 胸片)。**用途**:最接近的 2D 时序医学 FM 类比;我们在 3D 上推广这一思路。

[8] **Kazemi 等,2019,arXiv**。Time2Vec —— 时间的向量化表示。**用途**:Δt 的连续时间位置编码方法依据(Fourier 特征)。

[30] **MLCommons,MLPerf Inference v4.0**(2024)。GH200 vs H100 SXM5 的公开 benchmark。**用途**:支撑主文档 §Estimate of Compute 中 "GH200/H100 ≈1.0× at <1B params training" 的断言。
> https://mlcommons.org/benchmarks/inference-datacenter/

---

## 背景文献(主文档未直接引用,但支撑方法学 / 评测 / 软件选择)

[9] **NLST 研究组,2011,*NEJM***。低剂量 CT 筛查降低肺癌死亡率的关键临床试验。NLST 队列的根证据。

[10] **LaMontagne 等,2019,medRxiv**。OASIS-3 —— 正常老化与 AD 的纵向脑影像与临床认知数据集。

[11] **Jack 等,2008,*JMRI***。ADNI MRI 方法论。

[12] **Ellis 等,2009,*Int Psychogeriatrics***。AIBL —— 澳大利亚老化影像与生活方式研究。

[13] **Beekly 等,2007,*Alzheimer Dis Assoc Disord***。NACC 数据库。

[14] **Aboian 等,2022/2023,TCIA**。Yale-Brain-Mets-Longitudinal —— Yale 脑转移瘤纵向 MRI。

[15] **Suter 等,2022,*Scientific Data***。LUMIERE —— 胶质母细胞瘤纵向 MRI + RANO 评测。

[16] **TCIA Anti-PD-1 Lung / Melanoma collections**。免疫治疗肿瘤 CT 纵向。

[17] **Grossberg 等,TCIA HNSCC collection**。头颈鳞癌 CT/PET 队列。

[18] **Hatamizadeh 等,2022,MICCAI BrainLes**。SwinUNETR —— 脑肿瘤 MRI 分割的 Swin Transformer。**用途**:per-volume 3D encoder 的基础架构 family。

[19] **Dosovitskiy 等,2021,ICLR**。ViT —— "An image is worth 16×16 words"。**用途**:ablation backbone 之一。

[20] **Eisenhauer 等,2009,*EJC***。RECIST 1.1 标准 —— 治疗响应任务定义。

[21] **Wen 等,2010,*JCO***。RANO —— 高级别胶质瘤响应评估。

[22] **MacMahon 等,2017,*Radiology***。Fleischner Society 肺结节管理指南 —— 支撑"临床依赖时间变化"的论点。

[23] **Cardoso 等,2022,arXiv**。MONAI 框架。

[24] **Pérez-García 等,2021,*CMPB***。TorchIO —— 医学影像数据增强 / patch 采样。

[25] **Rajbhandari 等,2020,SC20**。ZeRO —— 训练超大模型的内存优化。fallback 方案的依据。

[26] **Zhao 等,2023,arXiv**。PyTorch FSDP —— 主分布式训练策略的论文。

[27] **Tustison 等,2010,*IEEE TMI***。N4ITK 偏置场校正 + ANTs。

[28] **Avants 等,2014,*Front Neuroinform***。ANTs / ITK 配准框架。

[29] **Rorden 等**。dcm2niix —— DICOM → NIfTI 转换。

---

*提交前请核对 [verify at submission time] 标记的几条(BrainIAC、M3FM 终版 DOI)。*
