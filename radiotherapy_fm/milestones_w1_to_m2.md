# Milestones — Week 1 → Month 2

> Concrete deliverables for the first 8 weeks of Mayo-RT-VFM build.
> Spec: [`components_and_stack.md`](components_and_stack.md)

## Week 1 — Environment + Data Inventory

**Deliverables**
- 8× H200 node environment set up: CUDA 12.4+, PyTorch 2.4+, MONAI 1.4+, NCCL multi-GPU verified
- All deps installed (see spec §6); `weights/voco/VoCo-H.pt` and `weights/triad/Triad-L.pt` downloaded
- **Mayo data inventory** complete: count patients per cancer site, count visits per patient, count modalities per visit, count with paired dose maps, count with outcome labels. **Numbers in a single CSV.**
- **TCIA inventory**: which TCIA collections we'll actually pull (HNSCC, NSCLC-Radiomics, OPC-Radiomics, Anti-PD-1, Prostate-MRI, others). Status of access for each.
- **IRB ticket filed**: VoCo PreCT-160K source-list audit + Mayo-internal-data usage for FM pretraining
- **Smoke test passes**: load VoCo-H on 4 H200s with FSDP, encode one CT volume, embeddings come out non-NaN

**Owner**: you (data inventory + IRB) + me (env setup, smoke test code)

**Risk**: IRB might block PreCT-160K-derived weights for clinical-grade work — if so, switch backbone to CT-FM (MIT, IDC-only). Decide by end of week 1.

## Week 2 — Registration Pipeline End-to-End

**Deliverables**
- `register_visit.py` runs ANTsPy rigid+affine → uniGradICON deformable → ConvexAdam parallel deformable on a CBCT/CT pair, outputs aligned NIfTI + DDF + disagreement-field NIfTI
- Validated on **10 H&N + 10 thorax + 10 pelvis** Mayo cases. TRE/Dice within published ranges per anatomy
- `register_batch.py` parallelizes across all Mayo patients on CPU + 2 H200, full run time estimated
- Pipeline output format spec frozen (see spec §0 directory layout)

**Owner**: me (code) + you (radonc/dosimetry review of 5 cases visually)

**Risk**: abdomen with gas redistribution fails — apply TotalSegmentator-driven bowel mask fix (M2 report).

## Week 3-4 — Full Data Curation

**Deliverables**
- All Mayo DICOM → standardized NIfTI per patient
- Per-patient folder structure populated: planning/, visits/{wkN}/, outcome.json
- Train/val/test splits at **patient level** (no leakage), **stratified by cancer site**
- Per-site external validation holdouts locked (TCIA-side)
- Data manifest: ~5-10k patients × avg N visits × per-modality counts → JSON manifest readable by MONAI Dataset
- **Pretraining corpus assembled**: counts confirmed (target ≥ 50k volume-equivalents)
- IRB audit decision known → backbone choice committed

**Owner**: PhD curators (you direct) + me (writing scripts)

**Risk**: outcome label inconsistency across sites → standardize "recurrence", "toxicity grade ≥2", "replan event" definitions with clinical team before training starts.

## Week 5-6 — Pretraining Phase 1: Δt-Siamese MAE on CT only

**Deliverables**
- `pretrain_dt_mae.py` implementation: VoCo-H encoder + Δt-conditioned decoder + 75% patch mask + L2 reconstruction loss + auxiliary contrastive loss
- Training launched on 8× H200 FSDP, mixed precision, ZeRO-3
- W&B / tensorboard tracking: recon loss, embedding linear-probe on held-out HECKTOR (Dice) and on NSCLC outcome (C-index), per-cancer-site loss
- **Mid-pretrain checkpoint @ week 6** evaluated on linear-probe transfer to all sites
- Expected wall-clock: 6-8 weeks for full pretrain → this is in-progress, not done by end of week 6

**Owner**: me (code, training) + you (linear-probe eval cases)

**Risk**: Δt-MAE doesn't beat single-scan MAE on linear-probe → switch to single-scan MAE + temporal cross-attention head only (kept in scope, but not the headline)

## Week 7-8 — Pretraining Phase 2: Add MRI Triad Branch

**Deliverables**
- Triad-L loaded and wrapped as MRI branch
- Cross-modal contrastive head (CT ↔ MRI paired visits) added to pretraining loss
- Joint pretraining continues from week-6 checkpoint
- Cross-modal retrieval sanity check on held-out paired Mayo cases (CT query → correct MRI retrieved)
- Mayo-RT-VFM v0 checkpoint saved at end of week 8 — this is the "first usable foundation model"
- Begin Phase 3 head training in parallel on smaller subset

**Owner**: me + you (cross-modal eval visual review)

**Risk**: paired CT-MRI is rare in Mayo data → if < 200 paired patients, drop cross-modal contrastive and keep MAE-only on MRI branch

## End-of-month-2 status review checkpoint

By end of week 8, you should be able to answer:

1. **Data**: Final corpus count is ___ patients, ___ volumes, ___ paired CT-MRI patients, ___ patients with outcomes
2. **Registration**: Pipeline pass rate is __% on H&N, __% on thorax, __% on pelvis
3. **Pretraining**: Mayo-RT-VFM v0 checkpoint exists; linear-probe shows __ Dice on HECKTOR, __ C-index on NSCLC OS
4. **IRB**: PreCT-160K-derivative status __, Mayo-internal-data FM-pretraining approval __
5. **Backbone commitment**: VoCo-H confirmed, OR fallback to CT-FM committed
6. **External cohorts**: HNSCC TCIA download ___, NSCLC-Radiomics ___, Prostate-MRI ___

Go/no-go decision at week 8 review: does the v0 checkpoint beat off-the-shelf VoCo-H on linear-probe by ≥ 3-5 Dice/C-index points across cancer sites? If yes → continue to head training (months 3-4). If no → debug pretrain or switch objective.

## Critical path summary

```
Week 1: env + inventory + IRB filed
   │
Week 2: registration pipeline working
   │
Week 3-4: full data curated
   │
Week 5-6: Δt-MAE pretrain CT — IN PROGRESS
   │       (8 H200 × 6-8 weeks total)
Week 7-8: + MRI branch + cross-modal
   │
Month 2 end: Mayo-RT-VFM v0 checkpoint exists
   │
Month 3-4: downstream heads + ablations
   │
Month 5-6: external validation + paper
   │
Month 6-7: submit
```

## What you (the PhD student) should personally do in week 1

1. Send Mayo data inventory request to the curators today
2. File IRB amendment for PreCT-160K source-data audit + FM pretraining on Mayo internal data
3. Confirm node access: when can you actually start using the 8× H200, and is it dedicated or shared?
4. Confirm which cancer sites Mayo has substantial cohorts for (the inventory will tell you)
5. Ping me with the data inventory CSV when ready — that's what unlocks the next concrete steps
