# 数据整理计划

> 数据下到本地之后怎么整理成能喂给 TimeFM-3D 的格式。
> scope = **全模态全器官**（CT / MRI / PET），所以归一要按模态分开处理。
> 脚本我来写 —— 这份是约定好的**目标格式**和**步骤**。

---

## 目标目录结构

每个数据集下来格式都不一样（DICOM / NIfTI / 各自命名），先全部归一成同一套：

```
data/
  raw/                      # 原始下载，只读，不动
    yale-brain-mets/
    nlst/
    adni/
    ...
  curated/                  # 归一后，训练实际读这里
    <dataset>/
      <patient_id>/
        <timepoint_id>/     # 按扫描日期排序：t00, t01, t02 ...
          CT_chest.nii.gz
          MR_T1.nii.gz
          PET.nii.gz
          ...
  manifest.csv              # 全局索引，训练时读这一个
```

`timepoint_id` 用 **相对序号**（t00/t01...），真实日期和 Δt 存进 manifest。

---

## manifest.csv 字段

训练 dataloader 只读 manifest，不扫目录。每行 = 一个 (病人, timepoint, 影像)：

| 列 | 说明 |
|---|---|
| `dataset` | 来源数据集 |
| `patient_id` | 去标识后的病人 ID |
| `timepoint` | t00 / t01 ... |
| `scan_date` | 真实日期或相对天数（去标识后通常是相对天数）|
| `delta_t_days` | 距上一 timepoint 的天数 —— **Δt-aware 模块要用** |
| `modality` | CT / MR / PET |
| `sequence` | MR 的 T1/T2/FLAIR/T1ce；CT 的 contrast/non-contrast；PET 的 tracer |
| `body_region` | brain / chest / head-neck / abdomen ... |
| `path` | curated/ 下相对路径 |
| `shape` | 重采样后 voxel 维度 |
| `spacing` | 重采样后 mm |

`modality` + `body_region` 两列是全模态 FM 的关键 —— 模型要按它们分支处理 / 加 embedding。

---

## 处理步骤

### 1. DICOM → NIfTI
NLST / ADNI / Yale / HNSCC 等多为 DICOM。用 `dcm2niix` 转 `.nii.gz`，保留方向矩阵。OASIS-3 多已是 NIfTI。

### 2. 纵向分组
按 `patient_id` 聚，按扫描日期排序得 timepoint 序列，算相邻 `delta_t_days`。
**只保留 ≥2 个 timepoint 的病人**（单点无纵向信号，丢辅助池或弃）。

### 3. 模态 / 序列 / 部位识别
DICOM header 命名乱。写映射表把各种写法归到标准 `modality` + `sequence` + `body_region`：
- MR 序列："T1_MPRAGE" / "t1_mprage_sag" → `T1`
- CT："CHEST W/O CONTRAST" → `modality=CT, region=chest`
- PET："PET WB FDG" → `modality=PET, tracer=FDG`
识别不了的标 `unknown`，先不进训练。

### 4. 重采样（按部位分开）
统一 spacing，但**不同器官用不同标准**：
- 脑 MRI：1×1×1 mm，裁/补到 ~160³ 或 182×218×182
- 胸 CT：可 1×1×1 mm 或保留各向异性切片厚度，裁到肺野
- 头颈 / 腹部：按各自 FOV 定
固定尺寸大小看显存定。

### 5. 强度归一化（按模态分开 —— 关键差异）
- **CT**：HU 是绝对单位，**不做 z-score**。按部位做窗宽窗位裁剪（肺窗 / 软组织窗），再线性缩放到 [0,1] 或 [-1,1]。
- **MRI**：强度无绝对单位，必须归一 —— z-score（组织内体素均值/方差）或 white-stripe。
- **PET**：转 SUV（用 DICOM 里的体重/剂量/时间）后再缩放。
混训时 per-scan 归一比 per-dataset 稳。

### 6. 跨 timepoint 配准
同一病人不同 timepoint 配到同一空间 —— 纵向变化建模的前提。
- 选 baseline (t00) 当固定参考。
- 后续 timepoint 刚性配准（rigid，6-DOF）到 baseline。
- 工具：`ANTs` 或 `SimpleITK`。
- 脑：先 skull-strip（`HD-BET`）再配准。胸/腹：呼吸/体位差异大，刚性可能不够，必要时上 deformable，但 FM 预训练阶段刚性通常够。

### 7. 质控
扫一遍剔坏数据：全黑/全白、配准失败、尺寸异常、切片缺失、模态标错。
出 QC 报告（每数据集 / 每模态保留多少 / 丢多少 / 原因）。

---

## 落地顺序

1. **Tier 0 先到**（Yale 脑 MRI + Anti-PD-1 胸 CT + HNSCC PET/CT）→ 先在这三个上把步骤 1-7 跑通，**一次就覆盖三种模态**，验证 pipeline。
2. pipeline 通了 → 同一套脚本套到 NLST / ADNI / OASIS-3 / NACC（只改序列映射表和 DICOM 布局适配）。
3. 全部 curated 完 → 合并 manifest，交给 [prelim-experiment-plan.md](../ideas/direction-a/prelim-experiment-plan.md) 的预训练。

---

## 谁做什么

- **你**：下数据、跑脚本、看 QC 报告判断丢的数据合不合理。
- **我**：写每一步脚本（dcm2niix 封装、模态识别映射表、分组、配准、按模态归一、manifest 生成、QC）。
  Tier 0 一到就先写步骤 1-3，你边下我边写。

---

## 注意

- `raw/` 永远只读，所有处理写到 `curated/` —— 错了能重来。
- 各 DUA 禁止再分发原始数据 —— `raw/` 和 `curated/` **都不能进 git**，`.gitignore` 里加 `data/`。
- 去标识：公开数据集下来时已去标识；Mayo 内部数据进来前必须先过 Mayo 的 de-id 流程。
- 全模态混训最大的坑是**模态/部位标注错**和**归一不一致** —— 步骤 3 和 5 的映射表要仔细核，QC 重点查这两项。
