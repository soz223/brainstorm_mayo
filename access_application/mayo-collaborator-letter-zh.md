---
geometry: "margin=1in"
fontsize: 11pt
---

> 仅供阅读参考。**提交版本是英文 [mayo-collaborator-letter.md](mayo-collaborator-letter.md)。**

\[Mayo Clinic 信头]

[日期]

NSF ACCESS Allocation Review
allocations.access-ci.org

**主题:合作信 —— ACCESS 计算资源申请《TimeFM-3D:纵向 3D 医学影像基础模型》(PI: Lifang He, Lehigh University)**

致 ACCESS 资源评审专家组:

我代表 Mayo Clinic [部门待填 —— 例如放射科 / 量化健康科学系],确认我方与 Lehigh University Dr. Lifang He 的研究组在所附 ACCESS 申请《TimeFM-3D:跨模态跨器官的纵向 3D 医学影像基础模型》中的积极合作。本合作自 [日期待填] 起持续至今。

**数据与临床治理**。Mayo Clinic 为本项目本地部分提供受 PHI 限制的临床影像数据。所有 Mayo 数据严格遵守 Mayo 数据治理政策,**不离开 Mayo 基础设施**,仅由持有有效 Mayo affiliate 凭证的人员访问。**没有任何 PHI 上传到 ACCESS 资源。** 在 ACCESS 上跑的训练仅使用去标识、public-DUA 队列(NLST、ADNI、OASIS-3、AIBL、NACC、Yale-Brain-Mets、LUMIERE、Anti-PD-1、HNSCC),严格遵守原始 DUA 条款。

**本地资源确认**。Dr. He 组获得在 Mayo Clinic 一个 20 × NVIDIA H200 GPU 集群上的访问权限,用于 TimeFM-3D 的 PHI-限定 production 预训练与临床 fine-tune 工作。该集群**专门用于 Mayo 数据治理政策下的临床工作负载**;ACCESS 上要跑的公开 DUA 预训练、ablation、scaling-law 研究、reproducibility 重训,与 Mayo 工作负载**互补且不重叠**。

**临床共同研究**。Mayo 共同研究者按器官提供临床背景(放射 / 肿瘤 / 信息学)—— 定义下游任务、验证评测指标、在对外发布前评估 release artifact 的临床合理性。我们对纵向建模这部分特别看重 —— 因为我们专业的日常临床实践高度依赖与既往影像对比,而本项目是首个在 foundation 规模上正面处理这一问题的系统。

**为什么需要 ACCESS 资源**。Mayo 集群不能 —— 也不允许在 Mayo 制度政策下 —— 承载 PI 资助科研计划中要求的公开语料 ablation 矩阵、scaling-law 研究、reproducibility 重训。外部合作者和不在 Mayo affiliate roster 上的 Lehigh 研究生没有 Mayo 集群访问权;公开释放的 reproducibility artifact 也必须跑在他人可检查的基础设施上。这三类工作负载,ACCESS 资源是**必需且不可替代**的,我方合作以这些资源到位为条件。

**评估与背书**。Dr. He 和她的 CoPI Songlin Zhao 完全具备负责任地执行本工作的能力。他们编写了目前在 Mayo H200 集群上 production 中的 FSDP / MONAI / Apptainer 软件栈;主文档中所引用的 throughput 与 scaling-efficiency 数据是 Mr. Zhao 在该硬件上实测得出的,非外推。我方对他们高效使用 ACCESS 资源、交付 proposal 所承诺公开 artifact 的能力有充分信心。

我方强烈支持将 ACCESS Accelerate 资源分配给该项目,并期待最终公开释放的基础模型、代码与 curation pipeline。

此致

\[签名]

**[姓名待填],M.D., Ph.D.(或 Ph.D.)**
[职务待填 —— 例如放射科副教授 / 影像信息学主任]
Mayo Clinic
[地址 —— Mayo Clinic, 200 First Street SW, Rochester, MN 55905]
Email:[待填] · 电话:[待填]
