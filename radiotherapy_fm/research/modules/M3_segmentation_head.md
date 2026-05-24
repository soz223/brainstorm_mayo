# M3 — Segmentation Decoder / Head Architecture

**Scope.** Pick the decoder(s) bolted on top of a frozen VoCo (SwinUNETR-Base, ~31 M params, 5-scale CT FM encoder) + LoRA, for two RT tasks:
- **T1 — Lesion / target seg** (RT-style, mostly H&N tumor at first; later: lung, pelvis tumors). HECKTOR / HNTSMRG-style.
- **T2 — OAR seg** (TotalSegmentator-class set, 100+ structures).

Backbone is frozen + LoRA; only the **decoder + a small bottleneck adapter** are trained.

---

## 1. Candidate decoders — compact comparison table

| # | Decoder | Native compat with SwinUNETR-B 5-scale features | Code source | Decoder-only params (est.) | Best published Dice (relevant benchmarks) | Loss / DS support | 100+ class? | Inference mem (96³ patch, FP16) | License | Multi-head friendly |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **UNETR decoder** (Hatamizadeh CVPR 2022) | Built for ViT-B (single-scale) → needs 4 deconv reshape blocks per scale. Works with Swin features but loses the multi-scale advantage; not first choice on Swin encoder. | `monai.networks.nets.UNETR` | ~16 M (when paired with ViT-B); ~10–14 M if grafted on Swin. | BTCV avg DSC 0.891; MSD Spleen 0.964 (Hatamizadeh 2021) | Native deep supervision via aux heads; DiceCE works out-of-box | Yes (set out_channels) | ~3 GB | Apache-2.0 | Good — encoder-agnostic |
| 2 | **SwinUNETR decoder** (Hatamizadeh MICCAI BraTS-21 workshop / CVPRW 2022) | **Native fit.** Exactly the 5 res-block skip pathway VoCo was pre-trained against. | `monai.networks.nets.SwinUNETR` (decoder portion is `UnetrUpBlock` × 5) | ~30 M for SwinUNETR-B total; **decoder + skips ≈ 14–18 M** | BTCV 0.918; AMOS-CT 0.886; BraTS-21 mean 0.910; HECKTOR'22 reported 0.656 (one team) | Built-in `DeepSupervision=False` flag; easy to enable; DiceCE/DiceFocal both supported | Yes | ~4 GB | Apache-2.0 | **Best** — VoCo ships pretrained decoder weights too, so we can warm-start |
| 3 | **nnUNet plain decoder** (Isensee 2018 → ResEnc 2024) | Needs feature-channel matching adapter at each scale; not plug-and-play with Swin features (channel widths differ). | `nnunetv2` (MIC-DKFZ); MIT/BSD-style | Plain ~10 M; ResEnc-L decoder ~25 M | nnU-Net Revisited 2024: AMOS 0.901, BTCV 0.857, KiTS 0.866 (ResEnc-L); HECKTOR'22 winner-equivalent 0.78 (NVAUTO SegResNet+nnUNet hybrid) | Native deep supervision (multi-scale loss is default); DiceCE is the default | Yes, but framework expects to own the encoder — awkward to bolt on a frozen Swin encoder | ~3 GB | Apache-2.0 | Painful — nnUNet's framework wants to control the full network |
| 4 | **Mask2Former-3D / Universal Segmentor** (Cheng CVPR 2022 + medical adaptations, CAT NeurIPS 2024) | Compatible with any multi-scale backbone (designed encoder-agnostic); query-based, not pixel-grid–based | `facebookresearch/Mask2Former` (2D); 3D adaptations: `CAT` (Huang NeurIPS 2024), `Universal Model` (Liu ICCV 2023) | Query-decoder ~25–40 M depending on #queries | CLIP-Driven Universal Model: **MSD leaderboard 1st** on 6 CT tasks; CAT: BTCV 0.886, FLARE 0.917 | Mask + class loss (Hungarian matching) — different from Dice; can be combined | **Yes — built for large class sets and panoptic-style mixing**; lesion+OAR can be one head with class queries | ~5 GB; query attention scales with patch volume | Apache-2.0 (M2F), MIT (CAT) | **Excellent** — class queries already give us a unified head |
| 5 | **SegResNet decoder** (Myronenko BraTS 2018) | Conv-only decoder; needs a 1×1×1 channel-match adapter per Swin skip. Simple. | `monai.networks.nets.SegResNet` / `SegResNetDS` | ~5–8 M (with DS); ~12 M for `SegResNetDS` deep variant | BraTS-21 0.892; **HECKTOR'22 challenge winner NVAUTO Dice 0.788** (ensemble of 15); MSD multi-task strong | Native deep supervision in `SegResNetDS`; DiceCE/DiceFocal | Yes | ~2 GB — smallest | Apache-2.0 | Good — small enough to run 2 decoders in parallel |
| 6 | **CT-FM bundled head** (Pai et al. 2025) | Designed for SegResEncoder; pairs with `SegResNetDS`. Wraps SegResNet decoder; with our VoCo Swin encoder we'd need the channel adapter (same as #5). | `project-lighter/CT-FM` (Harvard AIM) | Same as SegResNetDS (~12 M) | TotalSegmentator (117 labels): **mean Dice 0.898** (CT-FM SegResEncoder); LesionTriage and head-CT triage strong | DiceCE default; deep supervision yes | Yes — explicitly tested on 117 classes | ~2 GB | MIT | Good |
| 7 | **VoCo's recommended decoder** | VoCo paper uses **the full SwinUNETR** for downstream — i.e., same as #2. They also release a **VoComni** variant pre-finetuned on TotalSegmentator-style organs (decoder weights included). | `Luffy03/Large-Scale-Medical` | Same as #2; weights downloadable | TPAMI 2025 reports VoCo-B/L/H across 48 medical tasks; whole-body seg & tumor seg state-of-the-art on multiple benchmarks | DiceCE; recipe uses standard MONAI losses | Yes (VoComni initializes for ~100-class organ set) | ~4 GB | Apache-2.0 | **Best** — matches our backbone exactly |
| 8 | **MedNeXt / 3D ConvNeXt head** (Roy MICCAI 2023; MedNeXt-v2 2025) | Pure ConvNeXt decoder; channel-adapter at each scale needed. Standalone architecture, not designed as a "head" — usually full encoder+decoder. | `MIC-DKFZ/MedNeXt` | Decoder of MedNeXt-L ~30 M (it's the heavier half); MedNeXt-S decoder ~12 M | **BTCV 0.846, AMOS 0.896 (MedNeXt-L)**; MedNeXt-v2 (pretrained on 18K CTs) sets new SoTA across 144 structures, 6 benchmarks | Native deep supervision (inherits nnUNet recipe); DiceCE | Yes | ~4 GB | Apache-2.0 | OK — but heavy if we add it on top of an already-pretrained Swin encoder |
| 9 | **Diff-UNet / DUFormer** (Xing 2023 → Medical Image Analysis 2025) | Diffusion-based decoder; uses encoder features as condition. Compatible with any encoder. | `ge-xing/Diff-UNet` | ~20 M for the conditioned U-Net step network | BraTS-2023 0.886, SegRap-2023 0.852, LA 0.905 | Custom (Monte-Carlo + Dice + uncertainty); deep supervision not native | Possible but not validated at 100-class scale | ~6 GB + slow (multi-step sampling) | MIT | Poor for shared multi-task (diffusion sampling at inference) |

### Decoder feature-scale compatibility note
VoCo / SwinUNETR-B emits skips at **5 spatial scales** with channels `(48, 96, 192, 384, 768)` for patch 96³. Decoders 2, 5, 6, 7 are drop-in. Decoders 1, 3, 8 need a `Conv1×1×1` "skip projector" per scale (cheap, ~50 k params total). Decoder 4 (Mask2Former-3D) consumes a single FPN-fused feature map, so we add a tiny 3D-FPN (~1 M). Decoder 9 conditions on the bottleneck, no adapter needed.

---

## 2. Recommendation

### Lesion / target seg (T1) — H&N tumor first
**Adopt the VoCo-shipped SwinUNETR decoder (option 7 ≡ option 2 weights warm-started from VoCo).** Reasons:
- VoCo ships pretrained decoder weights aligned to its encoder — we recover ~70 % of a fully-pretrained UNet for free.
- HNTSMRG'24 top score 0.825 / 0.733 (Task-1 / Task-2 mean aggregated DSC) was achieved by **staged nnU-Net**, but the second-rank tier used SwinUNETR-style decoders within 0.5 DSC. The advantage of using VoCo's own decoder is more about transferability than absolute peak.
- HECKTOR'22 winner NVAUTO used **SegResNet** ensemble (DSC 0.788 aggregated). This is the single biggest piece of evidence for swapping **the lesion head to SegResNetDS** (option 5/6) — SegResNet is empirically the strongest single decoder for H&N tumor at small data scales. **Final pick for lesion: SwinUNETR decoder warm-started from VoCo, with SegResNetDS as a parallel "specialist" head we add when fine-tuning to a specific tumor site if mean DSC stagnates.**

### OAR seg (T2) — TotalSegmentator-class
**Adopt the VoCo decoder warm-started from VoComni weights.** Reasons:
- VoComni was pre-finetuned on TotalSegmentator-style 100+ classes; the decoder weights are essentially a free pretrained organ-aware initialization for our task.
- CT-FM (option 6) achieves 0.898 mean Dice on TotalSegmentator's 117 labels using SegResEncoder + SegResNetDS — but that pairing requires us to swap encoders (CT-FM is SegResEncoder, not Swin). Staying with VoCo + VoComni decoder buys us most of that gain while keeping the backbone consistent across both tasks.

### Share or split?
**Share encoder, separate decoders.** This is the standard recipe and what recent multi-task med-seg work (Co-Seg++ 2025; CAT NeurIPS 2024; TP-Seg 2026; Versatile Medical Image Segmentation CVPR 2024) converges on.
- Pros: ~30 M frozen encoder is shared cost; each decoder ~15 M trains independently → ~30 M trainable total, vs 60 M for two full networks.
- Cons: minor — modern multi-task med-seg literature notes "task interference at the decoding phase" but the published mitigations (task-conditioned adapters, learnable task prototypes) only buy ~0.5–1.0 Dice.
- Why not one shared decoder with N output channels? Because lesion classes and OAR classes have wildly different label statistics (lesion: 1 fg class, very sparse; OAR: 100+ dense classes). Sharing the decoder causes the focal/Dice loss for OAR to dominate gradients, washing out the rare-tumor signal. CLIP-Driven Universal Model and CAT handle this with class-conditioned heads, but that's a research direction, not a default.

**Optional T3 path:** if we later want a single universal head (RadOnc-style "any structure"), swap T2's decoder for **CAT (NeurIPS 2024)** or **CLIP-Driven Universal Model (ICCV 2023)** — class-queried Mask2Former-3D variants that naturally handle 100+ classes plus lesion classes in one head. Park this as a v2 milestone.

---

## 3. Loss + sampling recipe (current SOTA for HECKTOR-style RT tumor seg)

The recipe that the 2022 HECKTOR winner (NVAUTO, Myronenko) and the 2024 HNTSMRG top entries converged on:

- **Loss:** `DiceCELoss` (MONAI) **+ deep supervision** at every decoder scale, weights `[1, 0.5, 0.25, 0.125]` from full-res down. For very imbalanced sites (small tumor), add a **Focal term** (`DiceFocalLoss` with γ=2.0).
- **Boundary loss** (Kervadec 2019) is optional; the HECKTOR-2020 winners (Iantsen) used `DiceFocal`; the 2022 winner used `DiceCE` only. Boundary loss helps for thin structures (esophagus, optic nerves) more than tumors.
- **Sampling:** sliding-window inference, 96³ patches at 1×1×1 mm, **50 % overlap**, Gaussian-weighted aggregation. At training, **`RandCropByPosNegLabeld` with `pos:neg = 2:1`** to ensure tumor coverage. Without this, mean DSC drops 3–5 points on HECKTOR.
- **Augmentations:** intensity (`RandScaleIntensity`, `RandShiftIntensity`), spatial (`RandRotate90`, `RandFlip`, mild `RandAffine` ±15°), and **`RandGaussianNoise` + `RandAdjustContrast`** (the MONAI HECKTOR recipe; NVAUTO used these).
- **Optimization:** AdamW, lr 1e-4, cosine warmup, 1000 epochs (with early stopping on val DSC).
- **Ensemble:** the HECKTOR'22 winner reported 0.762 single-model → 0.788 with a 15-model ensemble. We don't need ensembling for the FM paper headline, but it's a 2–3 point reserve to deploy at submission.

The one published recipe most worth copy-pasting verbatim:
**NVAUTO HECKTOR-2022 winner (Myronenko et al., MICCAI 2022 challenge proc.)** — `monai.networks.nets.SegResNet` + `DiceCELoss` + `DeepSupervision`, 5-fold CV, sliding-window inference. Repo: <https://github.com/Project-MONAI/tutorials/tree/main/competitions/HECKTOR22>. This is a clean MONAI tutorial; the same data pipeline plugs straight into a VoCo-encoder pipeline if we replace the SegResNet encoder with the frozen VoCo encoder and keep the SegResNet decoder as our lesion specialist head.

---

## 4. Code template — plug into a frozen VoCo encoder

```python
# radiotherapy_fm/models/heads.py
import torch
import torch.nn as nn
from monai.networks.nets import SwinUNETR, SegResNetDS
from monai.networks.blocks import UnetrBasicBlock, UnetrUpBlock, UnetOutBlock
from monai.losses import DiceCELoss, DiceFocalLoss


# ---------- 1. Frozen VoCo backbone + LoRA adapters --------------------------
class VoCoEncoder(nn.Module):
    """Wrap pretrained SwinUNETR-B from VoCo. Returns 5 multi-scale feature maps."""
    def __init__(self, voco_ckpt_path: str, lora_rank: int = 8):
        super().__init__()
        net = SwinUNETR(img_size=(96, 96, 96), in_channels=1, out_channels=1,
                        feature_size=48, use_checkpoint=True)
        state = torch.load(voco_ckpt_path, map_location="cpu")
        net.load_state_dict(state["state_dict"], strict=False)
        self.swin = net.swinViT       # encoder only
        for p in self.swin.parameters():
            p.requires_grad = False
        # ... attach LoRA modules to each SwinTransformerBlock's qkv projections
        # (omitted — see radiotherapy_fm/models/lora.py)

    def forward(self, x):
        # SwinViT returns [hidden_states_out, x_in_post_patch_embed,
        #                  layer1, layer2, layer3, layer4]
        hs = self.swin(x, normalize=True)
        return hs  # tuple of 5 feature maps at strides 2,4,8,16,32


# ---------- 2. SwinUNETR-style decoder (T1 lesion + T2 OAR share this class) -
class SwinUNETRDecoder(nn.Module):
    def __init__(self, feature_size=48, out_channels=2, deep_supervision=True):
        super().__init__()
        f = feature_size
        # exactly mirrors monai.networks.nets.SwinUNETR.decoder*
        self.encoder1 = UnetrBasicBlock(3, 1, f, kernel_size=3, stride=1, norm_name="instance", res_block=True)
        self.encoder2 = UnetrBasicBlock(3, f, f, kernel_size=3, stride=1, norm_name="instance", res_block=True)
        self.encoder3 = UnetrBasicBlock(3, 2*f, 2*f, kernel_size=3, stride=1, norm_name="instance", res_block=True)
        self.encoder4 = UnetrBasicBlock(3, 4*f, 4*f, kernel_size=3, stride=1, norm_name="instance", res_block=True)
        self.encoder10 = UnetrBasicBlock(3, 16*f, 16*f, kernel_size=3, stride=1, norm_name="instance", res_block=True)
        self.decoder5 = UnetrUpBlock(3, 16*f, 8*f, kernel_size=3, upsample_kernel_size=2, norm_name="instance", res_block=True)
        self.decoder4 = UnetrUpBlock(3, 8*f, 4*f, kernel_size=3, upsample_kernel_size=2, norm_name="instance", res_block=True)
        self.decoder3 = UnetrUpBlock(3, 4*f, 2*f, kernel_size=3, upsample_kernel_size=2, norm_name="instance", res_block=True)
        self.decoder2 = UnetrUpBlock(3, 2*f, f, kernel_size=3, upsample_kernel_size=2, norm_name="instance", res_block=True)
        self.decoder1 = UnetrUpBlock(3, f, f, kernel_size=3, upsample_kernel_size=2, norm_name="instance", res_block=True)
        self.out = UnetOutBlock(3, f, out_channels)
        self.deep_supervision = deep_supervision
        if deep_supervision:
            self.ds_heads = nn.ModuleList([
                UnetOutBlock(3, c, out_channels) for c in (2*f, 4*f, 8*f)
            ])

    def forward(self, x_in, hidden_states):
        enc0 = self.encoder1(x_in)
        enc1 = self.encoder2(hidden_states[0])
        enc2 = self.encoder3(hidden_states[1])
        enc3 = self.encoder4(hidden_states[2])
        dec4 = self.encoder10(hidden_states[4])
        dec3 = self.decoder5(dec4, hidden_states[3])
        dec2 = self.decoder4(dec3, enc3)
        dec1 = self.decoder3(dec2, enc2)
        dec0 = self.decoder2(dec1, enc1)
        out_full = self.decoder1(dec0, enc0)
        logits = self.out(out_full)
        if self.deep_supervision and self.training:
            ds = [self.ds_heads[i](x) for i, x in enumerate((dec1, dec2, dec3))]
            return logits, ds
        return logits


# ---------- 3. Two-head wrapper (shared encoder, separate decoders) ----------
class RTFMTwoHead(nn.Module):
    def __init__(self, voco_ckpt_path, n_lesion=2, n_oar=105):
        super().__init__()
        self.encoder = VoCoEncoder(voco_ckpt_path)
        self.lesion_decoder = SwinUNETRDecoder(feature_size=48, out_channels=n_lesion)
        self.oar_decoder    = SwinUNETRDecoder(feature_size=48, out_channels=n_oar)

    def forward(self, x, task: str):
        hs = self.encoder(x)
        if task == "lesion":
            return self.lesion_decoder(x, hs)
        elif task == "oar":
            return self.oar_decoder(x, hs)
        raise ValueError(task)


# ---------- 4. Losses --------------------------------------------------------
loss_lesion = DiceFocalLoss(to_onehot_y=True, softmax=True, gamma=2.0, lambda_dice=1.0, lambda_focal=1.0)
loss_oar    = DiceCELoss(to_onehot_y=True, softmax=True, lambda_dice=1.0, lambda_ce=1.0)

def deep_supervision_loss(loss_fn, logits, ds_logits, target):
    weights = [1.0, 0.5, 0.25, 0.125]
    total = weights[0] * loss_fn(logits, target)
    for w, ds in zip(weights[1:], ds_logits):
        t_ds = torch.nn.functional.interpolate(target.float(), size=ds.shape[2:], mode="nearest").long()
        total = total + w * loss_fn(ds, t_ds)
    return total
```

VoCo checkpoints (B / L / H, plus VoComni) at <https://github.com/Luffy03/Large-Scale-Medical#-pre-trained-models>; load `VoCo_B.pt` for the 31 M encoder, `VoComni_B.pt` if you want decoder warm-start for the OAR head.

---

## 5. Decision summary

| Decision | Choice | Rationale |
|---|---|---|
| Lesion decoder | **SwinUNETR decoder warm-started from VoCo (`VoCo_B.pt`)**; optional SegResNetDS specialist for stagnated sites | Matches encoder, free pretrain; SegResNet is the empirical H&N winner |
| OAR decoder | **SwinUNETR decoder warm-started from VoComni** | VoComni gives a TotalSegmentator-aware init |
| Share encoder? | **Yes** (frozen + LoRA), separate decoders | Standard practice in 2024–2025 universal-medseg literature |
| Share decoder? | **No** (for now); revisit with CAT / CLIP-Driven Universal if v2 needs panoptic | Avoids T1↔T2 gradient interference |
| Loss | `DiceFocalLoss` for lesion, `DiceCELoss` for OAR, both with deep supervision | NVAUTO HECKTOR'22 + nnUNet defaults |
| Sampling | 96³ sliding window, 50 % overlap, Gaussian agg; `RandCropByPosNegLabeld` 2:1 at train | NVAUTO recipe |
| Headline recipe to copy | MONAI HECKTOR'22 tutorial (`Project-MONAI/tutorials/competitions/HECKTOR22`) | Battle-tested, MIT-licensed, swaps cleanly to our encoder |

---

## 6. References / repos

- VoCo / Large-Scale-Medical — TPAMI 2025 — <https://github.com/Luffy03/Large-Scale-Medical>
- UNETR — Hatamizadeh et al., CVPR 2022, arXiv 2103.10504
- SwinUNETR — Hatamizadeh et al., MICCAI BraTS 2021, arXiv 2201.01266
- nnU-Net Revisited — Isensee et al., arXiv 2404.09556 — <https://github.com/MIC-DKFZ/nnUNet>
- Mask2Former — Cheng et al., CVPR 2022 — <https://github.com/facebookresearch/Mask2Former>
- CAT — Huang et al., NeurIPS 2024, arXiv 2406.07085
- CLIP-Driven Universal Model — Liu et al., ICCV 2023, arXiv 2301.00785
- SegResNet — Myronenko, BraTS 2018, arXiv 1810.11654
- CT-FM — Pai et al. 2025, Harvard AIM — <https://github.com/project-lighter/CT-FM>
- MedNeXt — Roy et al., MICCAI 2023, arXiv 2303.09975; MedNeXt-v2 arXiv 2512.17774
- Diff-UNet — Xing et al., Medical Image Analysis 2025, arXiv 2303.10326
- HECKTOR'22 challenge report — Andrearczyk et al., arXiv 2209.10809
- HNTSMRG'24 challenge overview — Wahid et al., arXiv 2411.18585
- NVAUTO HECKTOR'22 winner code — <https://github.com/Project-MONAI/tutorials/tree/main/competitions/HECKTOR22>
