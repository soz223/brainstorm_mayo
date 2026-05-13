# Stage 1B 中文简版：医学顶刊 trending

> 长版 [stage1b-medical-venues.md](stage1b-medical-venues.md)（~95 篇）。只挑出影响 Direction A 决策的关键 paper + cluster 模式。

## C. Nat Med / NEJM AI / Lancet DH / Nat BME 几个最响 cluster

### C1. 临床部署 RCT 大规模 paper（2025-26 的真主菜）
- **AI Mammography RCT** (Nat Med 2025)：463k 妇女、12 中心，**+17.6% 检出**
- **AI Triage 非劣势试验** (Nat Med 2026)：**63.6% 工作量降低 + 15.2% 检出**
- **ScreenTrustMRI** (Nat Med 2024)：补充 MRI RCT
- **GPT-4 RCT** (Nat Med 2024)：92 医生，+6.5% 推理质量
- **Automation Bias RCT** (NEJM AI 2025)：受 AI 文化训练的医生 **-14%** 准确度（警告）
- **LLM 给普通人用** (Nat Med 2025)：用户 + LLM 只识 34.5% vs 单独 94.9%（**警告**）

→ **趋势：临床 RCT > 算法 paper**。但 Direction A 是基础 FM，不是 RCT，**走 NeurIPS/MICCAI 主线**

### C2. Tier-1 期刊上的 FM (2024-2026)
**最响的 FM paper（按时间倒序）：**

| FM | 期刊 | 数据规模 |
|---|---|---|
| **PanDerm** | Nat Med 2025 | 2M derm images |
| **TITAN** | Nat Med 2025 | 335,645 WSIs（pathology FM）|
| **EchoPrime** | Nature 2025 | 12M echo video-report 对 |
| **AMIE** | Nature 2025 | Differential dx（Google）|
| **ECGFounder** | NEJM AI 2025 | 10.77M ECG |
| **Med-LLM Diagnostic Reasoning** | Nat Med 2025 | 176B params |
| **BUSGen** | Nat BME 2026 | 3.5M 乳腺 US |
| **CT-CLIP / CT-CHAT** | **Nat BME 2025** | **25,692 胸 CT + 报告** |
| **FM-HCT** | Nat BME 2026 | **361,663 头 CT** |
| **Prima** | Nat BME 2025 | 220,000 MRI（neuro）|
| **Merlin** | **Nature 2026 (forthcoming)** | 15,331 CT + EHR |
| **MedSegX** | Nat BME 2025 | open-world seg FM |
| **HONeYBEE** | npj DM 2025 | 多模态肿瘤学 |
| **MIRAGE** | npj DM 2025 | OCT FM |
| **Decipher-MR** | npj DM 2026 | 3D MRI VLM, 200k series |
| **Global RETFound** | Nat Med 2025 | 100M 眼影像 65 国 |
| **PathOrchestra** | npj DM 2025 | 287k slides, 100+ tasks |

→ **每个亚专科都有自家 FM**。**3D CT 已有 Merlin/CT-CLIP/FM-HCT；3D MRI 有 Prima/Decipher-MR/Triad；但都是 single-timepoint**

### C3. 安全 / 监管 / 评测（与 AA 方向相关）
- **Limits of Fair Medical AI** (Nat Med 2024, Ghassemi MIT)
- **FM 是 Social Experiment** (npj DM 2025)
- **FDA SaMD 草案** + **Aidoc 腹部 CT FM clearance** (2026.01)
- **What Does It Mean for Medical AI to Be Right?** (2605.11963)
- **Generative AI in Medicine — Progress and Challenges** (NEJM Sounding Board 2025)

→ **AA 方向（hallucination gate）的 industry 信号在持续强化**

### C4. 评测论文 / 工具
- **CARES** (NeurIPS 2024) - trustworthiness
- **FairMedFM** (NeurIPS 2024) - fairness
- **MedVH** (2407.02730) - hallucination probes
- **GMAI-MMBench** (NeurIPS 2024 D&B) - 284 datasets / 38 modalities — GPT-4o 仅 53.96%

## D. 医学影像 tech 期刊 (MIA / IEEE TMI / npj Imaging)

### D1. 3D imaging FM 时代到了
- **Merlin** (Nature 2026)
- **CT-FM** (148k CTs, Harvard 2025)
- **VISTA3D** (CVPR 2025, NVIDIA)
- **Triad** (131,170 3D MRI)
- **MedDINOv3** (CT-3M, 3.87M slices)
- **3DINO-ViT** (npj DM 2025)
- **FM-Guided Multi-View Semi-Supervised Liver CT Seg** (npj DM 2025)

→ **3D CT/MRI FM 已成主流**。Direction A 的"3D FM" 不是 novelty——novelty 在"longitudinal"

### D2. Robustness / 部署 gap（信号有但不大）
- **MedSegX**: 开放世界分割 FM
- **CheXzero vs RAD-DINO 鲁棒性** — **RAD-DINO 最稳，CheXzero 部署崩溃**
- **The Architectural Gap in Clinical AI** (Lancet DH 2026)
- **Bias of FMs in Mammography** (MICCAI 2025)

## E. MICCAI 2024 / 2025

### Best papers
- **2025**: Fit Pixels Get Labels (meta-learning), Wave Inversion, R-Super (reports → seg)
- **2024**: RoCoSDF (3D US), ORacle (OR domain)

### FM track
- **M4oE** (MICCAI 2024): MoE for medical multimodal seg
- **MedCLIP-SAM / DeSAM / SAM-Med3D-MoE**
- **FDAS** (MICCAI 2025): FM distillation + anatomy-aware
- **Curriculum Prompting FMs**

→ **MICCAI 主流：SAM 衍生 / FM 适应 / 分割创新**。Direction A 完全没人占

### 手术 FM 新兴
- **SurgVLM** / **Surg-3M** / **EndoARSS** — 全是 2025
→ **跨域参考；可借鉴 video / 时间序列模式**

## F. medRxiv / arXiv 关键 preprint

- **AI Healthcare 2025 Year in Review** — multimodal FM **YoY 增长 25→144 篇**
- **LLM Pipeline Beats Physicians in CV Risk** — 真临床场景
- **GMAI-MMBench** — 综合评测
- **Adaptation of FMs Review** (2511.01284)
- **Pathology FM 相似性分析** — UNI2/Virchow2 最不同，Prov-GigaPath 平均最像

## 综合判断（给 Direction A）

**支持 A 的信号：**
1. **3D FM 已成主流但全 single-timepoint** —— 时间维度是真空白
2. **Aidoc 腹部 CT FM clearance** 表明工业界对 3D CT FM 有 deployment pull
3. **Merlin / CT-CLIP 上 Nature/Nat BME** 说明顶刊欢迎 3D CT FM
4. **m1 / Med-R1** 显示 reasoning 子方向已被占——A 主打 representation 而非 reasoning
5. **2025 multimodal FM 出版量 +475% YoY** —— 不是过气热点，是仍在上升

**反对 A 的信号：**
1. **每个亚专科已有 FM**——cross-专科 FM 难写出 narrative
2. **临床 RCT 比基础 FM 更受顶刊欢迎** —— 我们 paper 走 ML 顶会，不是 Nat Med
3. **Aerts / Mahmood / Stanford 等大组都在做**——竞争激烈

**没人发的（结合 Stage 1A 的白点）：**
- 3D FM × longitudinal × outcome（治疗反应、复发预测）
- 3D FM × patient-level multimodal（HONeYBEE 是 pathology + omics，不含 3D radiology）
- 3D medical reasoning RL with imaging verifier
