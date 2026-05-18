# 环境 + W&B 注册 setup

> ⚠️ **不要把 WANDB API key 写进任何 git 文件**。repo 会 push 到 GitHub = credential 泄露。
> 用 `wandb login`（存 `~/.netrc`，不在 repo）或 `WANDB_API_KEY` 环境变量。
> 你之前在 chat 明文贴过 key → **用完后去 wandb settings rotate 一次**。

## 1. Conda 环境

```bash
conda create -n timefm python=3.11 -y
conda activate timefm

# core
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124
pip install monai torchio nibabel SimpleITK   # 3D medical IO + transforms
pip install wandb einops timm
pip install pydicom dicom2nifti                # 若直接处理 DICOM
pip install antspyx                            # 跨 timepoint 刚性配准

# Sybil pipeline 复用（DICOM loader / 预处理参考）
pip install sybil
```

`environment.yml`（可选，固化版本后再导出）：
```bash
conda env export --no-builds > environment.yml
```

## 2. W&B 登录（**不写进文件**）

三选一：

```bash
# 方式 A（推荐）：交互式，存 ~/.netrc
wandb login

# 方式 B：环境变量（不要写进 repo 的 .env，不要 commit）
export WANDB_API_KEY=<你的key>     # 放 ~/.bashrc 或 shell session

# 方式 C：临时一次性
WANDB_API_KEY=<你的key> python register_run.py
```

key 来源：你自己的 wandb settings（用完 rotate）。

## 3. .gitignore（防 credential / 大文件入库）

仓库根目录建 `.gitignore`：
```
# credentials
.env
*.key
wandb/
# data & checkpoints
data/
*.nii.gz
*.ckpt
*.pt
__pycache__/
*.pyc
```

## 4. W&B 注册 run（登记实验信息，让你监控）

`register_run.py` —— 现在没真训练，先注册一个 **setup run**，把 prelim 计划的 config 登记上去，你 dashboard 立刻能看到：

```python
import wandb, datetime

cfg = {
    "stage": "prelim-setup",
    "dataset": "Yale-Brain-Mets-Longitudinal",
    "dataset_size_gb": 43,
    "n_patients_total": 1430,
    "filter": ">=3 timepoints (compute real TP dist first)",
    "model": {"arch": "3D-ViT", "patch": 16, "dim": 512,
              "depth": 6, "params_M": 100, "init": "CT-FM"},
    "ssl": {"objectives": ["IA-MVM", "NVP-LS", "TPC"],
            "cmtc": "SKIPPED (Yale has no reports/EHR)",
            "weights": {"a": 1.0, "b": 0.5, "g": 0.5}},
    "preprocess": {"skull_strip": "already done (HD-BET)",
                   "coregister": "rigid -> first study",
                   "resample_mm": 1.5, "norm": "per-volume z-score"},
    "optim": {"lr": 1.5e-4, "bs_per_gpu": 2, "steps": 20000,
              "warmup": 500, "k_timepoints": 4},
    "hw": {"gpus": "2-4 x H200", "precision": "bf16"},
    "success_criteria": ["3 losses monotone & no collapse",
                         "mvm psnr>20dB", "nvp cosine>0",
                         "tpc pos-neg gap>0", "probe field-strength acc>0.7"],
}

run = wandb.init(project="timefm-3d",
                 name=f"yale-prelim-setup-{datetime.datetime.now():%Y%m%d-%H%M}",
                 group="prelim-ssl",
                 job_type="setup",
                 tags=["yale-brain-mets", "S-100M", "registration"],
                 config=cfg)

# 把计划文档作为 artifact 存进去，dashboard 可追溯
art = wandb.Artifact("prelim-plan", type="plan")
art.add_file("ideas/direction-a/prelim-experiment-plan.md")
run.log_artifact(art)

wandb.summary["status"] = "planned"
wandb.finish()
print("registered:", run.url)
```

跑（在 timefm 环境，key 已 login）：
```bash
conda activate timefm
python register_run.py
```

→ 输出一个 `run.url`，你打开就能在 W&B dashboard 看到这个实验已登记（config + 计划文档 artifact）。正式训练时复用同 `project="timefm-3d"`，新 run 就会归到一起，可对比监控。

## 5. 监控（正式训练时）

训练脚本里 `wandb.init` 用同 project，metrics 按 [prelim-experiment-plan.md](prelim-experiment-plan.md) 第 6 节的 spec 打点。W&B Alerts 配 NaN / loss 不降 / OOM → 推你手机。

## 启动顺序

```
1. conda create + 装依赖
2. wandb login（你的 key，别写文件）
3. 建 .gitignore
4. python register_run.py        ← 这步让你 dashboard 看到登记
5. 下 Yale 数据 (43 GB, TCIA Aspera)
6. 写预处理 + 3 loss + dataloader（我可以写）
7. smoke test 100 step
8. 正式 20k step run
```

---

**注意**：本仓库是 brainstorm/规划仓，不放数据和代码实现。真正训练代码建议另开一个 repo（`timefm-3d`），本仓库只留 plan/调研文档。
