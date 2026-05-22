# 创新性评估:图像查询能不能做成文章?

> 调研方式:3 个并行 agent 分别调研 (A) 放疗领域的图像检索现状、(B) 医学多模态检索技术成熟度、(C) RadOnc-GPT 背景与医学期刊发表门槛。以下为综合结论。

---

## 总结论

**技术本身不创新,但在放射肿瘤这个具体场景里有真空白,可以做成一篇医学文章——前提是论文卖点放在「临床价值」而不是「检索技术」上。**

---

## 1. 技术本身:已经烂大街(不能当卖点)

到 2025 年,「图像 → CLIP 向量 → 在图文共享空间做最近邻搜索」是**成熟、近乎商品化**的技术:

- BiomedCLIP、MedCLIP、PubMedCLIP、PMC-CLIP 等医学图文模型,retrieval(图搜文/文搜图/图搜图)早就是它们论文里的**标准评测项**,不是贡献。
- 多模态 RAG(图像检索案例/报告)在 2024–2025 已是基础设施:MMed-RAG (ICLR 2025)、RULE (EMNLP 2024)、FactMM-RAG (2024) 都把「图像查询检索」当作 building block。
- ImageCLEFmedical 自 2017 年起每年都办医学检索评测——说明这是常规、已基准化的任务。

→ **计算机方向论文:不可能。** 审稿人会直接判定「方法不新」。

近期论文真正的创新点都不在检索机制本身,而在:区域/解剖条件检索(RRA-VL 2025、RegionMed-CLIP 2025)、可靠性/事实性(RULE、MMed-RAG)。

## 2. 放射肿瘤场景:确实有空白

- **没人在放疗里做过「纯图像查询」检索相似病例。** 现有「相似病人」工作(knowledge-based planning / RapidPlan / case-based reasoning)算相似度靠的是**勾画轮廓的几何特征或手工特征**,不是图像本身;而且目的是复用剂量分布做**自动计划**,不是给医生看相似临床病例。
- 唯一接近的工作:Kontaxis et al., *Physics in Medicine & Biology*, 2023(CBIR of radiotherapy treatment plans)——但输入是 CT **+ 轮廓**,目的仍是计划自动化,且未用 CLIP 式图文联合空间。
- 多模态 case-based retrieval 在**诊断放射学**里有(VISCERAL benchmark 等),但**放射肿瘤里没有**,且都不是纯图像查询。
- **RadOnc-GPT 本身没有任何图像检索功能。** 已发表两版均为纯文本:
  - v1(arXiv:2309.10160, 2023):Llama-2 指令微调,做治疗方案/模态推荐/诊断描述。
  - v2(arXiv:2509.25540, 2025):LLM agent,调 EHR API 做患者结局标注;明确不用传统 RAG,不处理图像。
  → 给它加图像检索是一个**没人占的真扩展方向**。

## 3. 做成「医学文章」需要的证据门槛

医学期刊**不会**因为 recall@k 高就收。要算一个贡献,需要:

1. **回顾性临床队列评估** — 明确病种、部位、ground truth(参考 RadOnc-GPT v2 的两层验证设计)。
2. **临床医生 reader study(核心)** — 放疗医生评判检索出的相似病例是否临床相关、是否支持/改变治疗或计划决策(临床相关性评分、评分者一致性、节省时间、决策一致性等指标)。
3. **与现有文本检索基线对比** — 证明「加图像」带来可测量的临床价值,而非纯工程增量。
4. **对齐 ESTRO–AAPM AI 指南**(Hurkmans et al., Radiother Oncol, 2024)做开发/验证/报告。
5. 讨论泛化性、偏倚、可解释性、临床流程整合路径。

**最低可信门槛 = 回顾性队列评估 + 临床医生 utility/reader study。** 只有检索指标会被当成 CS 论文而以「缺乏临床贡献」拒稿。

## 4. 适合的期刊(医学方向)

| 期刊 | 匹配度 | 说明 |
|---|---|---|
| **JCO Clinical Cancer Informatics** | 最匹配 | 明确发表应用于肿瘤数据/影像的「AI 工具」论文,重临床相关性 |
| **Practical Radiation Oncology (PRO)** | 高 | ASTRO 期刊,聚焦临床流程与落地 |
| Int. J. Radiation Oncology•Biology•Physics(Red Journal) | 中,门槛高 | 要求严格临床验证 |
| Radiotherapy and Oncology(Green Journal) | 中 | 期待符合 ESTRO–AAPM 指南的验证 |
| npj Digital Medicine | 中 | 需框定为「经临床验证的 AI 模型」 |
| Medical Physics / PMB | 仅当框定为影像方法学贡献时 |

## 5. 建议:论文卖点怎么立

不要把卖点放在「检索技术」——那是水管,不是贡献。能立住的卖点(三选一或组合):

1. **场景首创**:第一个在放射肿瘤做纯图像相似病例检索、并接入 RadOnc-GPT 的系统。
2. **数据贡献**:发布一个图文配对的放疗数据集——剂量图 / DVH + 临床文本。**这块真没人做**,两个 agent 都点名「剂量分布的 CLIP 式图文空间」是真空白。
3. **临床验证**:reader study 证明检索出的相似病例改变/支持了医生决策。

> 注:与已选方向 [[project_timefm3d_direction]](纵向 3D 医学影像基础模型)可以联动——把检索当作下游应用,真正的新意在「模态(纵向 3D / 剂量图)+ 配对数据集 + 临床验证」。

---

## 关键文献

- Kontaxis et al., *CBIR of radiotherapy treatment plans*, Phys. Med. Biol., 2023(arXiv:2206.02912)— 放疗领域最接近的先例
- BiomedCLIP, arXiv:2303.00915, 2023 / NEJM AI 2025
- *CLIP in Medical Imaging* survey, Medical Image Analysis, 2024
- MMed-RAG, ICLR 2025;RULE, EMNLP 2024;FactMM-RAG, arXiv:2407.15268, 2024
- RadOnc-GPT v1, arXiv:2309.10160, 2023;v2, arXiv:2509.25540, 2025
- RadOncRAG, JCO Clinical Cancer Informatics, 2025
- ESTRO–AAPM AI guideline (Hurkmans et al.), Radiother. Oncol., 2024
