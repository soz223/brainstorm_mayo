# Brainstorm Round 3：跨出"纵向 3D FM"的 5 块新领域

> 用户要求再发散。5 个 agent 并行，各包一块**之前没深挖的领域**，每个做 literature-review（带引用）+ scientific-brainstorming（发散新方向）。
> 日期 2026-05-21。

---

## 领域 1：生成式 / 世界模型 for 医学

**现状**：医学世界模型（MeWM 2025、EHRWorld）+ 影像数字孪生是 2025 风口、留白大；3D diffusion 合成（MAISI/Med-DDPM）已饱和；**生成式 FM 作表征（Marigold 风格）医学完全空白**。

**发散的新方向**：
- **D1 Genie 风格 action-conditioned 3D 影像世界模型**：输入治疗 action，自回归 rollout 未来 3D 影像。高 ceiling 旗舰故事
- **D2 反事实剂量-响应曲面**：从二元干预 → 连续 dose 轴影像曲面，读个体化最小有效剂量
- **D3 Marigold-Med**：生成式 diffusion 当 3D 影像通用表征（分割/配准/检测）。**医学真空白，标注需求低**
- D4 PDE-约束肿瘤生长世界模型
- D5 因果反事实数字孪生（影像 + EHR 联合）
- D6 生成不确定性驱动主动随访

**agent 推荐**：主攻 **D3（Marigold-Med）** —— 真空、复用 3D FM 背景、易出结果；**D1** 作高 ceiling 故事。可合并成"生成式 3D 影像 FM 既作表征又作世界模型"。

---

## 领域 2：AI for biology / 药物发现 / cell & omics

**现状**：
- 蛋白/分子 FM（ESM3, AlphaFold3, Boltz-2）—— 最成熟最拥挤
- **单细胞 FM 有真争议**：多个 benchmark（Nature Methods 2025 等）证 scGPT/Geneformer/scFoundation 的扰动预测/聚类**输给线性 baseline / 传统方法**；scaling 在单细胞不灵
- 虚拟细胞（Arc Institute State, Virtual Cell Challenge）成显学
- 空间转录组 FM 爆发（SToFM, Novae）；image→spatial transcriptome 热（SpaFoundation, FmH2ST）
- 纵向 omics FM 几乎空白

**发散的新方向**：
- **D1 3D 影像 → 全器官 transcriptome FM**："whole-organ virtual biopsy FM"，整片空白
- D2 纵向虚拟细胞（时序 perturbation FM）
- D3 perturbation = 治疗的跨域类比 counterfactual FM
- D4 反 scaling 诊断 benchmark（蹭 scFM 争议热点）
- D5 image↔omics retrieval 双塔
- D6 多尺度空间桥接（数据不可行，放弃）

**agent 推荐**：主推 **D1（3D 影像 → 全器官 transcriptome FM）** —— 本质是把 CC radiogenomics 做大做深，复用主线 encoder、吃 Mayo paired imaging+omics、命中 Recursion/Insitro 叙事。
**诚实提醒**：纯 bio 方向（造 scFM/蛋白 FM/虚拟细胞核心）跨界成本太高，6-12 月追不上，不划算。

---

## 领域 3：非影像临床信号 FM（ECG/EEG/可穿戴/EHR）

**现状**：
- ECG FM（ECGFounder/ECG-FM/HuBERT-ECG）已饱和，进入"打榜+修补"阶段
- EEG FM 14+ 个（LaBraM/BrainBERT/EEGPT/REVE）
- 可穿戴 FM 由 Apple 主导（PPG/accel 蒸馏）；CGM 有 GluFormer (Nature 2025)
- EHR 事件流 FM（ETHOS/Foresight/CoMET）
- **真空白**：① 纵向/serial 信号 SSL 预训练（仅描述性 AI-ECG aging，无 FM）② 信号↔影像跨模态（仅 ECG-CMR 起步）③ 不规则患者级 multi-visit 信号轨迹 FM 不存在

**发散的新方向**（用户纵向 3D FM 框架可整体迁移到信号）：
- **D1 Serial-ECG/EEG Trajectory FM**：样本 = 患者全部历史 ECG 序列（不规则 Δt），interval-aware masked-ECG + next-ECG prediction。最直接迁移
- D2 跨信号纵向蒸馏（住院 ECG 监督家用 PPG/accel，跨月/年插值生理状态）
- **D3 信号→未来影像 forecasting**：给 ECG/wearable 时序，预测未来一次影像（cardiac MRI EF 等）。跨模态 + 未来轴双空白
- D4 统一不规则多生理流 FM（patient timeline of waveforms）
- D5 时间分辨率桥接 FM（毫秒波形 vs 月级就诊）
- D6 影像-信号联合患者轨迹 FM（主线姊妹篇，双社区覆盖）

**agent 推荐**：求稳 → **D1（Serial-ECG Trajectory FM）**，MIMIC-IV-ECG 公开可立即跑，Mayo serial ECG 独占；要新颖度 → **D3（信号→未来影像 forecasting）**，留白最大，天然衔接影像主线。

---

## 领域 4：手术 / 介入 / 医学视频 AI

**现状**：
- 手术 video FM 2025 元年（SurgVLM/Surg-3M/SurgeNetXL）—— 已被大组占位
- 相位识别/workflow 成熟红海，痛点多中心泛化差
- 机器人手术 VLA（RoboNurse-VLA/Surgical-LVLM）
- **留白最大**：术中超声 FM、IR 实时引导、preop-intraop 桥接

**发散的新方向**：
- S1 手术视频"未来相位/动作预测"FM（time-to-event 迁移）
- **S2 Preop-3D ↔ Intraop-video 跨阶段桥接 FM**：联合编码术前 3D CT/MRI + 术中视频。用户 3D 强项核心切口
- S3 术中超声实时时序 FM
- S4 viewpoint-aware 手术 VLA 最小切片
- S5 drift-aware workflow 评测 + TTT
- **S6 术前 3D CT → 预测术中事件**（出血/转开放概率，preop-only 无需手术视频标注）

**agent 推荐 + 诚实提醒**：手术视频是独立社区（术语/数据/reviewer 圈都不同），从零进**跨界成本高**，SurgVLM 等已占位。若必须进，选 **S2 或 S6**（最大化复用 3D CT/MRI 强项、跨界成本最低）；纯手术视频 FM 不建议作主线。

---

## 领域 5：因果 / 可信 / 评测科学 medical ML

**现状**：
- 因果 ML / treatment effect（CATE meta-learner + TARNet/Dragonnet）—— 成熟红海，理论门槛高
- 纵向 time-varying confounding ITE（g-methods/MSM/LTMLE）—— 与 Mayo 纵向数据契合
- 可信 AI（conformal prediction/calibration/OOD）—— 最活跃、门槛适中
- 评测科学（HealthBench/Touchstone/MedCheck）—— 升温
- **FM × 因果最有留白**：CausalFM/Do-PFN 都还是 tabular，没 imaging

**发散的新方向**：
- **#1 纵向影像 FM 反事实评测协议**（CounterBench 从文本搬到 3D 纵向影像）
- #2 FM-as-CATE（用纵向影像 FM 表征估 ITE）—— 留白极大但因果理论门槛高
- **#3 Conformal 包裹 TimeFM-3D**（给纵向预测套 calibrated coverage，处理 scanner/间隔漂移）—— 门槛低最稳
- #4 FM 因果/shortcut 探针（SAE 分离病理因果维 vs 人口学捷径维）
- #5 纵向 FM MedCheck 生命周期 benchmark
- #6 prospective-ready target trial emulation

**agent 推荐 + 诚实提醒**：主推 **#3（conformal 包裹 TimeFM-3D，可信性插件，门槛低最稳）**，**#1（纵向反事实评测）**做差异化亮点；#2 因果理论门槛高，FM 背景不占优，降级为工程缝合。新 CATE estimator（cluster 1）红海别碰。

---

# 跨领域合成（orchestrator）

## 各领域 top 推荐汇总

| 领域 | agent 首推 | 类型 |
|---|---|---|
| 1 生成式/世界模型 | **Marigold-Med**：生成式 diffusion 作 3D 影像表征 | 新范式 |
| 2 bio/omics | **3D 影像 → 全器官 transcriptome FM** | 跨模态（= CC 升级）|
| 3 信号 FM | **Serial-ECG Trajectory FM** / 信号→未来影像 | 框架迁移 |
| 4 手术 | **Preop-3D ↔ Intraop-video 桥接** / 术前 CT 预测术中事件 | 跨阶段 |
| 5 因果/可信 | **Conformal 包裹 TimeFM-3D** / 纵向反事实评测 | 插件/方法 |

## 关键 meta-观察（诚实）

**5 个领域、各自独立 lit review，但几乎每个领域的 #1 推荐都路由回"把用户的纵向/时序 FM 框架迁移过去"。**

- 信号 FM 首推 = 纵向框架搬到 ECG
- 手术首推 = 纵向 + 3D 强项搬到 preop-intraop
- 因果首推 = conformal 包裹纵向 FM
- bio 首推 = 纵向影像 encoder 接 omics
- 生成式首推 = 复用 3D FM 背景

→ 这是个**强信号**：用户真正的护城河是"纵向/时序建模能力 + 3D 影像"。最高价值的"新"动作不是抛弃它，是**把它做得更通用**。

## 真正"新"的跨领域 idea（这才是用户要的）

**N1. Universal Multi-Stream Patient Trajectory FM**（领域 1+3 交叉）
不是纵向 3D 影像 FM，是**纵向"一切"FM**——一个病人 = 时间轴上的异步多流（3D 影像 timepoint + ECG 段 + wearable 流 + EHR 事件），全部带绝对时间戳，masked-modality + masked-time 双 SSL。一篇 paper 同时覆盖影像 FM 社区 + 信号 FM 社区 + EHR FM 社区。**比 TimeFM-3D 大一圈，求职面最宽**。

**N2. Generative-as-Representation 3D 医学 FM**（领域 1，真新范式）
Marigold-Med：训一个 3D 医学 diffusion，**用它的中间表征作 backbone**（不是用来合成）。和 TimeFM-3D 的 contrastive/MAE 范式正交——**这是真不一样的方向**，医学完全空白，标注需求低。

**N3. Cross-Modal Future Forecasting FM**（领域 2+3 交叉）
agent 反复提"从 modality X 现在预测 modality Y 未来"——信号→未来影像、影像→omics。统一成一个 **cross-modal forecasting FM**：给定任意一种当前模态，预测任意另一种模态在未来时间点的状态。

**N4. Conformal/Trustworthy 作独立方法 paper**（领域 5，最快）
不依赖 TimeFM-3D 训完——给任意纵向医学预测套 calibrated coverage、处理 scanner/间隔漂移。**门槛低、compute 少、可快速出 paper**，是真正能在 2-3 个月独立产出的方向。

## 给用户的诚实总结

跨 5 领域发散的净结论：
1. **真正不同的新范式只有 2 个**：N2（生成式作表征）和 N4（conformal 独立方法）—— 其余都是"纵向框架 + 换数据模态"
2. **最大野心 = N1**（universal multi-stream patient FM）—— 但本质是 TimeFM-3D 的放大版，不是逃离它
3. **最快出活 = N4**（conformal 方法 paper，2-3 月，不等数据）
4. **跨界成本警告**：纯 bio（造 scFM）、纯手术视频 —— 6-12 月追不上，不划算
5. **不变的事实**：用户的护城河是纵向 + 3D 影像。5 个 agent 独立调研都指回这——这不是巧合，是该信的信号
