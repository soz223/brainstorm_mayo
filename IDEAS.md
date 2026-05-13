# 研究 idea 索引

> 主线：**纵向 3D 医学影像基础模型**——Mayo 数据 + 20×H200，做全社区唯一能做的事。

## 核心一句话
公开数据集没有 ≥3 timepoint × 3D × >10k 病人的纵向影像，所以全社区被卡在 pair-Siamese 的 local optimum；Mayo 有这块数据。**这不是小创新，是整片空地。**

## 详细 idea 索引

- [纵向 3D 医学影像 FM（主线方向 A）](ideas/longitudinal-3d-fm.md)
- [Time-to-Event Pretraining 拆解（最强 baseline / 互补工作）](ideas/time-to-event-pretraining.md)
- [三方向 landscape 调研（A / B / C 留白对比）](ideas/landscape-survey.md)
- [Q/I/K 工业界副线（带批判性评估）](ideas/agent-reasoning-interp.md)

## 决策记录

| 日期 | 决策 | 理由 |
|---|---|---|
| 2026-05-13 | 主攻 A（纵向 3D FM） | 三方向调研显示 A 留白 30–40%，B/C 仅 15–25%；Mayo 数据正好填 A 的核心缺口 |

## 下一步 backlog
- [ ] Mayo 数据 scoping：≥3 次随访的 CT / MRI 病人数清单
- [ ] 公开纵向数据 inventory（ADNI / UK Biobank / NLST / OASIS / TADPOLE / IXI）
- [ ] 三种 pretraining objective 的 loss 写法草稿
- [ ] 小规模 prototype（4 timepoints × 2k 病人 × 100M params）
- [ ] reproduce Merlin / TTE / CT-CLIP 在自有数据上的数字作 baseline
