# Preliminary Experiment Plan — TimeFM-3D on Yale-Brain-Mets-Longitudinal

> 目标不是出 SOTA，是 **validate pipeline + 验证 SSL loss 能联合优化**。最快能跑（43 GB 零审批）。

## 1. 目的（只回答 3 个问题）

1. **数据 pipeline 跑通吗**：Yale NIfTI → co-register → resample → 序列序列化 → dataloader 出 batch
2. **SSL loss 能联合优化吗**：IA-MVM + NVP-LS 同时训会不会一个塌一个炸
3. **frozen feature 有没有信号**：linear-probe sanity（能不能从 frozen embedding 预测 timepoint order / field strength）

**明确不做**：SOTA、下游 benchmark、reasoning post-training。那是后面阶段。

## 2. 数据

- **Yale-Brain-Mets-Longitudinal**：1,430 病人 / 11,884 studies / ~43 GB NIfTI
- 已 HD-BET skull-strip（**别重复**）+ 序列标准化
- 详见 [yale-brain-mets-guide.md](yale-brain-mets-guide.md)

**预处理（必做，数据集没做的）**：
| 步骤 | 配置 |
|---|---|
| 跨 timepoint 共配准 | rigid，register 到病人首个 study |
| 重采样 | 1mm³ 各向同性（prototype 可降到 1.5mm³ 省显存）|
| 强度归一化 | per-volume z-score（1.5T/3T 异质大）|
| 缺序列 | 优先 T1c（76% 覆盖）单序列起步；多序列用 modality-dropout |
| per-patient TP 真实分布 | **先算**（"mean 8" 是右偏均值，别信）；只保留 ≥3 TP 的病人做 prototype |

## 3. 模型（S 档 prototype，~100M）

- Volume encoder：3D-ViT，patch 16³，init from **CT-FM 公开权重**（省算力；CT-FM 是胸 CT，跨域到脑 MRI 仅作 warm start，不行就 scratch）
- 空间池化：per-visit → 256 summary tokens
- Temporal transformer：6 层，dim 512，Fourier(Δt) 时间编码
- 总可训 ~100M

## 4. SSL 目标（**注意：Yale 无文本，只能 2.5 个**）

| Loss | 能否在 Yale 上 | 说明 |
|---|---|---|
| **IA-MVM** | ✅ | image only，interval-aware masked volume modeling |
| **NVP-LS** | ✅ | image only，next-volume latent prediction |
| ~~CMTC~~ | ❌ | **需要 reports/EHR — Yale 完全没有** |
| **TPC**（替代）| ✅ | temporal/patient contrastive：同病人不同 t 为正样本 vs 不同病人。作 CMTC 的 image-only 替身，验证 contrastive 机制 |

```
L_total = α·L_IA-MVM + β·L_NVP-LS + γ·L_TPC
初始 α:β:γ = 1 : 0.5 : 0.5（warmup 时先只开 IA-MVM）
```

→ CMTC 留到有 reports 的数据（NLST 也无 report；要 CT-RATE / INSPECT / MIMIC）。preliminary 不验证 CMTC。

## 5. 训练配置

| 项 | 值 |
|---|---|
| 硬件 | 2-4 × H200（prototype 不用全 20）|
| precision | bf16 + FlashAttention-3 |
| batch | per-GPU 2 病人序列（每序列 ≤4 TP，1.5mm³）|
| optimizer | AdamW, lr 1.5e-4, cosine, warmup 500 step |
| steps | ~20k（≈ 1-3 天）|
| seq len | k = 3-4 timepoints（截断 / 采样）|

## 6. W&B 监控（你要的）

**project / run**：
```
project = "timefm-3d"
run     = "yale-prelim-{YYYYMMDD-HHMM}"
group   = "prelim-ssl"
tags    = ["yale-brain-mets", "S-100M", "ia-mvm+nvp+tpc"]
```

**config（全 hyperparam + 数据统计登记）**：
- model: encoder/dim/depth/patch/params
- ssl: α/β/γ, mask schedule, k
- data: 病人数(≥3TP), TP 分布(median/max), spacing, 序列
- optim: lr/bs/steps/warmup
- hardware: GPU 数/型号

**logged metrics（每 step / 每 100 step）**：
| 类别 | 指标 |
|---|---|
| loss | `loss/total`, `loss/ia_mvm`, `loss/nvp_ls`, `loss/tpc` |
| 健康 | `lr`, `grad_norm`, `gpu_mem_GB`, `throughput_vol_per_s` |
| 质量 | `mvm/psnr`（重建质量）, `nvp/cosine`（预测 latent vs 真 cosine）, `tpc/pos_neg_gap` |
| sanity probe（每 2k step）| `probe/field_strength_acc`, `probe/tp_order_acc`（frozen feature linear probe）|
| artifacts | 每 1k step log 8 张 masked-vs-recon 切片图；checkpoint |

**alert**（W&B Alerts → 你手机/邮件）：
- 任一 loss NaN / inf → alert
- `loss/total` 连续 2k step 不降 → alert
- GPU OOM → alert

## 7. 成功判据（preliminary 通过 = 这些都 yes）

1. 3 个 loss 都**单调下降**且不互相塌（无一恒为 0 / 爆炸）
2. `mvm/psnr` > 20 dB（重建肉眼可辨解剖）
3. `nvp/cosine` 显著 > 0（预测 latent 不是噪声）
4. `tpc/pos_neg_gap` > 0 且增大（同病人比不同病人近）
5. probe sanity：frozen feature 能预测 field strength acc > 0.7（说明 encoder 学到东西）
6. 训练 24h 不崩、显存稳定

**任一不过 → debug，不进 M 档 scale-up**

## 8. 时间 + 算力

| 阶段 | 时间 |
|---|---|
| 下数据 (43 GB) | 数小时 |
| 预处理 pipeline（配准/resample/norm）| 2-3 天 |
| dataloader + model + 3 loss 实现 | 3-5 天 |
| W&B instrument + smoke test (100 step) | 0.5 天 |
| 20k step run | 1-3 天 |
| 看结果 / debug | 2-3 天 |
| **合计** | **~2 周** |

## 9. 可跑骨架（W&B 已 instrument）

```python
import wandb, torch

def main(cfg):
    wandb.init(project="timefm-3d",
               name=f"yale-prelim-{cfg.stamp}",
               group="prelim-ssl",
               tags=["yale-brain-mets", "S-100M"],
               config=cfg.as_dict())

    model = TimeFM3D(encoder=load_ct_fm(), dim=512, depth=6).cuda()
    opt = torch.optim.AdamW(model.parameters(), lr=1.5e-4)
    loader = YaleLongiLoader(cfg.data, min_tp=3, k=cfg.k, spacing=1.5)

    for step, batch in enumerate(loader):
        V, dt, mod = batch.to_cuda()
        L_mvm, psnr = ia_mvm(model, V, dt, mod)
        L_nvp, cos  = nvp_ls(model, V, dt, mod)
        L_tpc, gap  = tpc(model, V, dt, mod, batch.patient_id)
        loss = cfg.a*L_mvm + cfg.b*L_nvp + cfg.g*L_tpc

        opt.zero_grad(); loss.backward()
        gnorm = torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()

        if step % 100 == 0:
            wandb.log({"loss/total": loss, "loss/ia_mvm": L_mvm,
                       "loss/nvp_ls": L_nvp, "loss/tpc": L_tpc,
                       "mvm/psnr": psnr, "nvp/cosine": cos,
                       "tpc/pos_neg_gap": gap, "grad_norm": gnorm,
                       "gpu_mem_GB": torch.cuda.max_memory_allocated()/1e9},
                      step=step)
        if step % 1000 == 0:
            wandb.log({"recon": wandb.Image(make_recon_grid(model, V))}, step=step)
        if step % 2000 == 0:
            wandb.log(linear_probe_sanity(model, loader.heldout), step=step)
        if not torch.isfinite(loss):
            wandb.alert(title="loss NaN", text=f"step {step}")
            break

    wandb.finish()
```

## 10. 启动前 checklist

- [ ] `wandb login`（需 WANDB_API_KEY；告诉我 key 或你自己 login）
- [ ] 下 Yale-Brain-Mets-Longitudinal（TCIA Aspera，43 GB）
- [ ] 算 per-patient TP 真实分布，筛 ≥3 TP 病人
- [ ] 写预处理脚本（配准 + resample + norm）
- [ ] 实现 3 个 loss（IA-MVM / NVP-LS / TPC）
- [ ] smoke test 100 step（确认 W&B 出图、不 OOM）
- [ ] 正式 20k step run

---

**一句话**：这是 prototype 阶段（paper-proposal v0.2 的 Month 1-3 第一步），只为验证"pipeline 通 + loss 能联合优化"，**不碰 reasoning、不碰 NLST 11TB、不等 Mayo**。Yale 43 GB 今晚能下，2 周出结果。
