# 研究 idea 索引

> 主线：**纵向 3D 医学影像 FM**。详见 [longitudinal-3d-fm.md](ideas/longitudinal-3d-fm.md)

## 当前候选

| 方向 | 状态 | Mayo 必需 | 详情 |
|---|---|---|---|
| **A** 纵向 3D FM | 主线 | ✅ | [longitudinal-3d-fm.md](ideas/longitudinal-3d-fm.md) |
| **AA** Hallucination gate | 强候选 | ✅ draft+edited 配对 | [methods-survey.md](ideas/methods-survey.md#aa) |
| **X** MedREALM joint retriever | 候选 | ✅ image-report 库 | [methods-survey.md](ideas/methods-survey.md#x) |
| **CC** Radiogenomics FM | 待数据 | ✅ paired imaging+omics | [methods-survey.md](ideas/methods-survey.md#cc) |
| **M8** Diffusion-as-FM | 候选 | optional | [methods-survey.md](ideas/methods-survey.md#m8) |
| **K** SAE on 3D CT FM | Plan B | ❌ | [agent-reasoning-interp.md](ideas/agent-reasoning-interp.md) |
| **W** CheckList medical FM | 温吞 | optional | [landscape-survey-round2.md](ideas/landscape-survey-round2.md#w) |
| **M3** Memory Layer | 待评 | 中 | [methods-survey.md](ideas/methods-survey.md#m3) |
| **M10** Self-improving | 待评 | ✅ unlabeled | [methods-survey.md](ideas/methods-survey.md#m10) |

## 调研中

M4 (speculative decoding) · M5 (TTT) · M9 (flow matching)

## 已弃

Q (Radiology Agent, 红海) · I (Reasoning FM, 评测烂账) · R (Trial Matching) · M1 (Mamba) · M2 (MoE) · M6 (V-JEPA) · M7 (3D tokenizer) · T (Eval methodology) · U (Open-vocab anomaly) · V (Pediatric) · Z (Active learning) · BB (Cross-lang) · Y (Efficient FM) · X 之前误判（已恢复）

## 决策日志

| 日期 | 决策 | 关键 |
|---|---|---|
| 2026-05-13 | 主攻 A | 三方向调研 A 30-40% 留白；Mayo 纵向数据是社区独占缺口 |
| 2026-05-13 | AA 升级为强候选 | FDA 驱动 + Mayo draft+edited 配对独占 |
| 2026-05-13 | X 不是 RAG | REALM-style joint pretraining 整片空白 |

## 历史调研记录

- [一轮 landscape (A/B/C)](ideas/landscape-survey.md)
- [二轮 landscape (W/AA/CC/X/K)](ideas/landscape-survey-round2.md)
- [Agent / Reasoning / Interp 副线](ideas/agent-reasoning-interp.md)
- [Method 维度调研](ideas/methods-survey.md)
- [Time-to-Event Pretraining 拆解](ideas/time-to-event-pretraining.md)

## 数据 scoping 待办

- [ ] Mayo ≥3 follow-up 3D 病人数？（决定 A 启动）
- [ ] Mayo draft + radiologist-edited 配对语料量？（决定 AA 启动）
- [ ] Mayo image-report 总量？（决定 X 启动）
- [ ] Mayo paired imaging + sequencing ≥5k？（决定 CC go/no-go）
