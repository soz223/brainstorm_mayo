# NLST 实战指南：体量与预处理

> 调研日期 2026-05-13。回答"11-12 TB 怎么用"。

## 0. NLST 原始结构（为什么 11 TB）

- **26,254 病人 / 73,116 exams / 203,099 series / 21M images / 11.3 TB DICOM**
- 每病人最多 3 轮：**T0 (baseline) / T1 (+1yr) / T2 (+2yr)**
- **每 exam 平均 ~2.8 个 reconstruction**（不同 slice thickness 1.0-3.2mm × soft/sharp/lung kernel）—— **这是 11 TB 膨胀主因**

## 1. 核心压缩共识（所有 paper 一致）

> **每个 exam 只取 thinnest-slice 的一个 series，丢弃其余 reconstruction** → raw 压到 **~1.5-3 TB**；resample 后单 volume 仅 10-50 MB → 全集可到**几百 GB**

不要下 11 TB。三条路：
1. **IDC 云查询**（datacommons.cancer.gov）—— BigQuery 查询免下载
2. **TCIA search 只下 thinnest series**
3. **NLSTseg**（605 病人 NIfTI 像素级标注，直接下小体积版）

## 2. 别人怎么用（关键 paper）

### Sybil (Mikhael, JCO 2023, MIT) ⭐ 代码开源必参考
- 用量: 申请 15k → 过滤 **14,185 病人**（train 10,200 / 28,162 LDCT）
- **series 规则**: 每 LDCT 只选 slice 最薄的一个；排除 >2.5mm
- **预处理**（源码 `sybil/loaders/`）:
  - TorchIO `Resample` 到 **spacing (0.703, 0.703, 2.5) mm**（各向异性，z 留 2.5mm 省显存）
  - `CropOrPad` 到 **(256, 256, 200)**
  - 归一化 mean 128.17 / std 87.18
  - DICOM 按 `ImagePositionPatient` z 排序
  - **on-the-fly 加载，不预生成大文件**
- task: 单 LDCT → 1-6yr 肺癌风险
- 架构: 3D ResNet-18 + multi-attention pooling（bbox 弱监督）+ 5-model ensemble
- 代码: github.com/reginabarzilaygroup/Sybil（pip 可装 + NLST 预训练权重）

### Ardila (Google, Nat Med 2019)
- 用量: train ~14,851 病人 / 42,290 LDCT；test 6,716；AUC 94.4%
- 预处理: DICOM → 统一体素 resample，全肺 volume 端到端；用 current + prior CT
- 架构: 3D Inception 两阶段（region proposal + full-volume）
- 代码: **未开源**（Google 内部）

### Liao DSB2017 winner (IEEE TNNLS 2019) ⭐ 最省内存
- 用量: 主要 Kaggle DSB2017 (~1,400 CT，源自 NLST 人群) + LUNA16
- **预处理**（github.com/lfz/DSB2017）:
  - resample **1×1×1 mm**
  - HU clip **[-1200, 600]** → 0-255 → **uint8**（省内存关键）
  - 肺 mask 外填 **170**
  - **patch/cube 采样 96³**（不载全 volume）
- 训练: **8× TITAN X 12GB，3-4 天**（唯一公开 GPU 数字）

### M3FM (Niu, Nat Commun 2025) FM 级
- 用量: **26,254 病人 / 125,090 volumetric CT**；预训练 151,569 CT (NLST+MIDRC)
- 预处理: **不统一 resample**，CTViT 多尺度 tokenizer（4 个预定义尺度，patch 16×16×16）
- 架构: CTViT + Text Transformer + Task Encoder，17 任务
- 代码: 承诺发布 OpenM3Chest + 权重

### NLSTseg (Sci Data 2025) 小体积分割版
- 605 病人 / 715 病灶，CT + 标注都 NIfTI
- **直接可下小体积版**，省 11 TB

## 3. 关键 takeaway 给 TimeFM-3D

| 问题 | 答案 |
|---|---|
| 要不要下 11 TB | **不要**。IDC 云查询 或 TCIA 只下 thinnest series → ~1.5-3 TB |
| series 选择 | 每 exam 只取 thinnest（排除 >2.5mm），所有 paper 共识 |
| 预处理复用谁 | **Sybil 的 TorchIO on-the-fly pipeline**（pip 装现成）或 **Liao 的 1×1×1 + HU clip + uint8 + 96³ patch**（最省内存）|
| storage/compute 怎么扛 | ① 单 series ② patch/cube 采样 ③ on-the-fly resample ④ ViT tokenization ⑤ IDC 云查询免下载 |
| 官方 split | **无**。Sybil 自定 0.6/0.2/0.2 按病人分层（防泄漏）|
| GPU 实战 | Liao 公开 8×TITAN X 3-4 天；其余未公开（内部集群）|
| 我们 longi 优势点 | 别人**都只用单 LDCT**（Sybil/Ardila 部分用 prior）；TimeFM-3D 用**全 T0/T1/T2 序列**是 differentiator |

## 4. 实操起步建议

```
1. 走 IDC（datacommons.cancer.gov）BigQuery 筛 thinnest series → 选 subset
   或 TCIA NBIA 按 series description 过滤下载
2. 复用 Sybil pipeline：pip install sybil，直接拿它的 DICOM loader
3. 预训练用全 T0/T1/T2 序列（vs Sybil 单 scan）—— 这是 TimeFM-3D 的 novelty
4. 评测 baseline 直接 pip 装 Sybil 跑（它有 NLST 预训练权重）
5. 分割任务用 NLSTseg 605 例 NIfTI（直接下）
```

**重要**：NLST 影像 TCIA 公开（CC-BY），**SSL 预训练不需 label**，今晚就能起步；癌症 dx / mortality label 走 CDAS（4-8 周）等下游评测再用。
