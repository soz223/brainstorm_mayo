# ACCESS 计算资源申请 —— 表单答案 + 提交清单(v0.3,R4)

> 仅供阅读参考。**实际提交时把英文 [answers.md](answers.md) 的内容填进 ACCESS 网页表单。**
> **Tier:Accelerate**。PI:**Lifang He**(Lehigh University)。CoPI:**Songlin Zhao**(Lehigh)。
> 主文档 PDF 来自 [main-document.md](main-document.md),转 PDF 后上传。

---

## ⚠️ 提交前必填(6 处空格,Round 4 reviewer 标记)

主文档已通过技术评审,只剩 6 处行政性空格:

- [ ] **Supporting grant** 在 main-document.md §Research Objectives(约第 18 行):
      `Aim [N — TO INSERT]` · `NSF / NIH award number TO INSERT` · `"[title TO INSERT]"`
- [ ] **ACCESS credits** 在 main-document.md §Estimate of Compute(约第 38 行):
      用 ACCESS Exchange Calculator 把 89,000 H100-eq GPU-hr 算成实际 credit 数,填进去。确认落在 **[1.5 M, 3 M]** → Accelerate;若 <1.5 M,改投 Discover 重交。
- [ ] **Mayo H200 累计 GPU-hr** 在 main-document.md §Computational Plan(约第 66 行):
      `≈[USAGE TO INSERT] GPU-hr`(自 2025-09 起的真实累计数)。
- [ ] **GitHub org** 在 main-document.md §Computational Plan(约第 66 行):
      `github.com/[org TO INSERT]/timefm3d-runtime`
- [ ] **PI 职称** 在 main-document.md §Team and Team Preparedness(约第 76 行):
      `(Lehigh CSE, [rank TO CONFIRM])` → Assistant / Associate / Full Professor
- [ ] **Mayo 合作信** 占位符(在 [mayo-collaborator-letter.md](mayo-collaborator-letter.md)):
      信头、日期、部门、合作起始日期、签字人姓名 + 职务 + 联系方式。

非阻塞(可选):
- [ ] 主文档 §Computational Plan 给 "Swin-3D" 加内联 `[18]` 引用。
- [ ] references.md 中标 `[verify at submission time]` 的条目(BrainIAC、M3FM 终版 DOI)。

---

## 请求信息(Request Information)

### 项目标题
**TimeFM-3D: A Pan-Organ, Multi-Modality Longitudinal 3D Imaging Foundation Model for Disease Trajectory Modeling**
*(中文释义:跨器官跨模态的纵向 3D 影像基础模型,用于疾病轨迹建模)*

### 公开项目简介(Public Overview,提交英文版)

我们要构建 **TimeFM-3D**,第一个原生接受"每病人 3D 影像序列(CT/MRI/PET,任意 Δt)"输入的 3D 医学影像基础模型 —— 当前所有公开的 3D 医学影像基础模型(CT-FM、BrainIAC、M3FM、Merlin、BiomedCLIP)都独立编码每张影像,丢掉了时间维。在公开队列(NLST、ADNI / OASIS-3 / AIBL / NACC、Yale-Brain-Mets / LUMIERE、Anti-PD-1、HNSCC)的约 30,000 名病人(每人 ≥2 个 timepoint)上自监督预训练,用三个时序 SSL 目标,在 7 个纵向任务(AD 转化、胶质瘤进展、肺癌风险、RECIST 响应、生存时间)上正面对标 Sybil / BrainIAC / CT-FM / M3FM。

ACCESS GPU 资源(首选 NCSA DeltaAI GH200,次选 Purdue Anvil AI H100,备选 PSC Bridges-2 GPU-AI H100)用于公开 DUA 的 ablation 矩阵、scaling-law、full-corpus release 预训练、reproducibility 重训 —— 与 Mayo Clinic 上 PHI-限定的本地 pipeline 互补且不可替代。软件栈:PyTorch 2.x、FSDP、MONAI、torchio、ANTs、dcm2niix、HuggingFace `transformers`、Apptainer(两个针对架构的 image 共享一个 Dockerfile)、Slurm、Weights & Biases。所有 artifact(预训练权重、代码、manifest schema、curation 脚本)将以 BSD-3 / open license 释出,符合 NSF 公开访问政策。

### 关键词
medical imaging, foundation model, self-supervised learning, longitudinal modeling, 3D CT, 3D MRI, PET, transformer, vision transformer, deep learning, distributed training, computational radiology

### 用途选项
- [x] **Research (non-dissertation)** —— 主用途
- [x] **Dissertation or Thesis** —— 副用途(CoPI 的博士论文)

### Opportunity Questions
- [x] Machine learning
- [x] Software development
- [ ] Rapid response

### 如何得知 ACCESS?
*(填你实际渠道:校内 research computing 中心 / Mayo 合作者 / NSF ACCESS 官网 / 同行推荐...)*

### 学科领域
- **主**:CISE → **Machine Learning**(IIS)
- **副**:Biological Sciences → **Biomedical Imaging**(若表单允许,可加 Health / Clinical Medicine)

---

## 相关人员(Related Personnel)

### PI
- **He, Lifang** —— Lehigh University —— **PI**

### CoPI / Allocation Manager
- **Zhao, Songlin** —— Lehigh University —— **CoPI**(博士生,导师 L. He)
- [可选:一位 Mayo Clinic 临床合作者作为额外 CoPI,看是否要让他们也进 ACCESS 申请]
- [可选:实验室 Allocation Manager —— 用 ACCESS ID 搜加]

### 其他合作者(用于 COI 审查,不在申请本身上)
- Mayo Clinic 临床共同研究者(放射 / 肿瘤 / 信息学)—— 姓名待填
- NLST / ADNI / OASIS 数据使用协调人(如适用)

---

## 支持基金(Supporting Grants)

**是否包含 NSF / NIH 支持基金?**
- 有 → 填 award number,确保与 main-document.md 里的 `[Aim N]` / `[title]` 一致。
- 无 → NSF 允许每位研究者**一个**"无 NSF 基金"的项目;确认这是你唯一这样的项目。

---

## 文档(Documents)上传清单

每行 = 表单 Type 下拉选哪个 → 哪份 PDF。

| 表单 "Type" | 来源 | 页数 | 备注 |
|---|---|---|---|
| **Main Document**(必)| [`main-document.md`](main-document.md) → PDF | 3 | R4 reviewer-passed |
| **PI CV or resume**(必)| *PI 自己提供* | 3 | Lifang He |
| **CoPI CV or resume**(必)| *CoPI 自己提供* | 3 | Songlin Zhao |
| **References** | [`references.md`](references.md) → PDF | 无 | 与主文档 [1]–[8] 和 [30] 对齐 |
| **Other**(Mayo 合作信)| [`mayo-collaborator-letter.md`](mayo-collaborator-letter.md) → PDF | 无 | 推荐,可选 |

**不用做**(不适用):
- **Progress Report** —— 续约才用
- **Addressing Reviewer Comments** —— 被拒后重交才用

### 一条命令转 3 份英文 PDF
```bash
cd access_application
for f in main-document references mayo-collaborator-letter; do
  pandoc "$f.md" -o "$f.pdf" --pdf-engine=xelatex \
    -V geometry:margin=1in -V fontsize=11pt -V mainfont="Times New Roman"
done
```

### Mermaid 图(可选;主文档目前未嵌图)
```bash
cd access_application
npx -y @mermaid-js/mermaid-cli -i figures/workflow.mmd     -o figures/workflow.png
npx -y @mermaid-js/mermaid-cli -i figures/architecture.mmd -o figures/architecture.png
```

---

## Tier 选择

ACCESS 4 个 tier(来自 allocations.access-ci.org/project-types):

| Tier | 额度上限 | Main Doc | 评审 | 节奏 |
|---|---|---|---|---|
| Explore | 400 K | 摘要 | eligibility | 滚动 |
| Discover | 1.5 M | 1 页 | eligibility + suitability | 滚动 |
| **Accelerate** | **3 M** | **3 页** | **专家组 merit review** | **滚动** |
| Maximize | 无上限 | 10 页 | 完整专家组 | 12/15–1/31 窗口 |

**TimeFM-3D 选 Accelerate**:89,000 H100-eq GPU-hr 对 Discover(1.5 M 上限)太大;不需要 Maximize 5 页 code-performance 卷(scaling 效率已内联到主文档)。提交前用 Exchange Calculator 算出 credits,确认落在 [1.5 M, 3 M]。
