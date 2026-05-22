# 先例:检索方法普通 + 独立数据贡献 = 发表

> 问题:有没有人「检索技术很一般,但靠自己独立的数据贡献发了文章」?
> 答案:**有,而且很多。** 这是医学领域一条成熟的发表路径。以下为 2 个并行 agent 的调研汇总。

---

## A 类:图像检索 + 数据集贡献(方法用现成 CLIP / 最近邻)

| 论文 | 年份 / 期刊 | 数据贡献 | 检索方法 |
|---|---|---|---|
| **OpenPath / PLIP** | 2023, **Nature Medicine** | 20.8 万病理图文对(从医学 Twitter 爬取) | 标准 CLIP 对比学习 + 现成最近邻——方法完全不新 |
| **ROCO** | 2018, MICCAI workshop | ~8.1 万放射图文对 + UMLS CUI 标注 | 无新方法,定位为资源 |
| **ROCOv2** | 2024, **Scientific Data**(Nature) | ROCO 刷新扩充,79,789 图 | 纯数据集论文,方法留给评测参赛者 |
| **MedICaT** | 2020, EMNLP Findings | 21.7 万图 + 子图/子标题对齐标注 | 标准对比/匹配机制 |
| **PMC-CLIP / PMC-OA** | 2023, MICCAI | 160 万生物医学图文对 | 标准 CLIP 对比 + MLM |
| **3D-MIR** | 2023, benchmark | 4 个 CT 解剖部位的 3D 检索基准 | 现成基础模型 embedding,「检索策略」非新算法 |
| **RadIR(MIMIC-IR / CTRATE-IR)** | 2025, arXiv | 胸片 + CT 的图-图分级相关性标注 | 标准 embedding 相似度 |
| ImageCLEFmedical Caption 系列 | 2018–2025, CEUR-WS | 每年的精选语料 + 标准化指标 | 数据/基准论文,方法由参赛者提供 |

## B 类:临床案例检索 / 搜索 + 数据贡献(可不用图像)

| 论文 | 年份 / 期刊 | 数据贡献 | 检索方法 |
|---|---|---|---|
| **EMERSE**(EHR 全文搜索引擎) | 2006 AMIA / 2015 *J Biomed Inform* / **2020 JCO Clinical Cancer Informatics** | 部署级 EHR 全文搜索工具 + 多中心使用经验 | 「类 Google」全文索引,零算法创新——发了三次 |
| **Schmidt et al.**(头颈癌剂量决策支持) | 2016, *Int. J. CARS* | 精选回顾性 DICOM-RT 头颈癌案例库 | 手工几何相似度特征 + 最近邻——**放疗领域最接近的先例** |
| **Kapoor et al.**(放疗 learning health system) | 2023, *J. Appl. Clin. Med. Phys.* | 1,660 例临床+剂量数据 → ~50 万 RDF 三元组 | 现成 Word2Vec/Doc2Vec + 余弦相似度 |
| 口咽癌相似度决策支持 | 2022, PMC9029638 | 102 例口咽癌案例编码为特征向量 + 治疗决策实体 | 标准加权距离/相似度 |
| 基因组患者相似度(精准肿瘤) | 2025, medRxiv | 基因组刻画的既往患者队列 + 治疗轨迹 | 常规基因组特征相似度检索 |
| ImageCLEFmed 检索测试集 | *J. Digital Imaging* | 66,662 图 + 85 topics + 相关性判断 | 无新方法,论文即数据集 |
| TREC Medical Records Track | 2012, AMIA | 17,264 encounters / 93,551 文档 + 专家相关性判断 | 标准 Cranfield 式 IR 评测 |

---

## 综合结论

**「普通检索方法 + 独立数据/队列贡献 = 可发表」在医学期刊里是稳固、常见的模式**,横跨顶刊(Nature Medicine 收了 PLIP)、数据期刊(Scientific Data)、临床期刊(JCO CCI 收了 EMERSE)、医学物理期刊和会议。新意一律在**数据**:精选的机构队列、结构化 DICOM-RT 数据库、标注案例语料、带专家相关性判断的基准。

### 对 RadOnc-GPT 图像检索想法的直接启示

- **Schmidt 2016 和 Kapoor 2023 就是放疗领域的现成模板**——精选放疗队列 + 普通相似度搜索,足以在临床/医学物理期刊发表。
- 数据贡献要能撑起一篇文章,通常需满足三点:
  1. **真·新,且经过非平凡的整理/标注**——结构化特征、ground-truth 标签或相关性判断,不能只是原始记录堆叠;
  2. **有规模或临床特异性**——明确的病种、机构或模态;
  3. **配临床效用展示或可复用声明**——如「72% 相似解剖案例可预测剂量分布」「三中心采用」「可复用测试集」。

### 推荐论文卖点框法

> 「我们构建并发布了一个**放疗图文配对案例库**(影像/剂量图 + 临床文本 + 相关性标注),为 RadOnc-GPT 增加图像检索能力,并通过**临床医生 reader study** 证明检索出的相似病例支持治疗/计划决策。」

检索本身是普通的;**数据库 + 临床验证**才是贡献。这条路有大量先例支撑。参见 [[novelty-assessment]]。

---

## 关键链接

- OpenPath/PLIP — Nature Medicine 2023
- ROCOv2 — Scientific Data 2024;ROCO — MICCAI workshop 2018
- MedICaT — EMNLP Findings 2020;PMC-CLIP — MICCAI 2023
- 3D-MIR — arXiv:2311.13752;RadIR — arXiv:2503.04653
- EMERSE — JCO Clinical Cancer Informatics 2020(ascopubs.org/doi/abs/10.1200/CCI.19.00134)
- Schmidt et al. — Int. J. CARS 2016(doi:10.1007/s11548-016-1403-6)
- Kapoor et al. — J. Appl. Clin. Med. Phys. 2023(doi:10.1002/acm2.14127)
- ImageCLEFmed 测试集 — PMC3043731;TREC Medical Records — PMC3540501
