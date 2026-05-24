# M5 — Replan-Trigger / Dose-Escalation Classification Head

**Scope.** Pick the classification head architecture sitting on top of frozen 3D-CT FM embeddings (e.g. VoCo) for a binary task: P(replan needed within current course) or P(dose-escalation candidate). Input per patient = per-visit embedding vector e_t ∈ R^d (d ~ 512-1024), for t in {planning CT, weekly CBCT_1...CBCT_N, mid-course CT}, plus optional DVH and clinical tabular features. Expected cohort size on Mayo RT data: O(1-3k) treated patients, with replan event prevalence ~10-25% → 200-500 positive events.

**TL;DR.**
1. **Recommend small temporal-attention head (2 layers, 4 heads) + Δt scalar PE + concat-with-tabular MLP → sigmoid**, calibrated, trained with class-balanced focal loss. Roughly 0.5-2M trainable params on frozen FM features.
2. **Fallback if positives < ~150**: XGBoost on flattened [e_T0, e_Tmid, e_Tend, Δe, DVH, clinical]. Honest about this — deep heads do not beat GBDTs on tabular-ish input below ~500 events.
3. **Frame as time-to-replan survival** (Cox / DeepSurv / DeepHit) in parallel with binary classification. Survival framing handles censoring (patients who finished without replan) and is what most published replan-prediction studies use. Binary head still needed for "decision now" use case.
4. **Shared aggregator across heads (replan + recurrence + toxicity)** — multi-task learning helps the rare label by exploiting correlated structure. Independent task-specific MLP tops.
5. **Decision-curve analysis (Vickers) at threshold ranges aligned with site's actual replan rate (~15-25%)** is the publishable clinical-utility framing. Pair with isotonic / Platt calibration.

---

## 1. Candidate architectures — comparison table

| # | Head | Where used (med imaging, 2022-26) | AUC on related task | LOC / dep | Min #pos to converge | Δt-aware | Missing-visit | DCA/calibration | "Which visit?" interpretability | Library |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **MLP on [T0, Tmid, Tend, Δ] concat** | Most CBCT delta-radiomics + FM-feature pipelines (PMC 12606737 pharyngeal cancer, NSCLC mid-RT response IJROBP 2025) | 0.77-0.87 (response) | ~30 LOC | ~50-100 | No (manual encoding via Δ) | Zero-impute Δ — clumsy | Trivial sigmoid → calibrate | Permutation importance per visit slot | PyTorch / Lightning |
| 2 | **Temporal attention pooling (1-3 layer transformer over visit tokens)** | OA-BreaCR (MICCAI 2024), LTSA (npj Digit Med 2024), TNMT-HCC (MICCAI 2024) | 0.78-0.84 (HCC recurrence), 0.80-0.88 (AMD progression) | ~80 LOC, MONAI/Lightning native | ~150-300 | Yes via PE scalar | Yes via attention mask + learned [MISS] token | Sigmoid + temperature | Attention rollout per visit | PyTorch / `nn.TransformerEncoder` |
| 3 | **GRU/LSTM over visit-ordered embeddings** | Seq2Seq lung ART (Radiother Oncol 2022 van Timmeren), AD progression baselines, RTOG/HN xerostomia rCNN (Men 2019) | 0.72-0.80 | ~40 LOC | ~100 | Treats visits as regular sequence; Δt only as extra channel | Forward-fill or learned missing token | Sigmoid | Hidden-state probe per timestep | PyTorch |
| 4 | **Δt-aware attention (continuous-time PE, optionally cross-attention to baseline)** | OA-BreaCR ordinal time-to-event; STAMP Δt-conditioning; Time2Vec PE works | 0.81-0.86 (breast risk) | ~100 LOC | ~200-400 | **Yes (designed for it)** | Yes via mask | Sigmoid or DeepHit | Attention weights per (visit, Δt) | PyTorch |
| 5 | **TabTransformer / FT-Transformer over flattened (embedding + DVH + clinical)** | Several radiomics-tabular fusion papers (HCC, NSCLC outcomes 2023-25); pytorch-tabular benchmark | 0.74-0.82 | ~60 LOC, `pytorch-tabular` | ~200 | No (loses temporal structure unless engineered) | Imputation | Sigmoid + calibration | Per-feature attention (limited per-visit) | `pytorch-tabular`, `pytorch_tabnet` |
| 6 | **XGBoost / LightGBM on flattened features** | The de facto baseline in essentially every replan-prediction paper (Brouwer 2022 HN, Yu 2024 cervix, Lim 2023 NSCLC). Also the BrainIAC, FM-CT downstream protocol. | 0.78-0.86 (replan); 0.75-0.84 (toxicity) | <20 LOC, `xgboost` 2.0+ | **~50-100** | Manual (engineered Δ) | Native NA handling in XGB 2.0 | Sigmoid output → Platt / isotonic, decision-curve trivial | SHAP per feature → can be aggregated per visit | `xgboost` 2.0+ |
| 7 | **Set transformer over visit tokens (perm-invariant)** | Limited adoption in med imaging; some pathology slide aggregation (CLAM-style ABMIL is conceptually similar) | 0.75-0.83 (path) | ~120 LOC | ~200 | Order-free; Δt fed as token feature | Yes via masking | Sigmoid | Attention pooling weights ≈ visit importance | PyTorch |
| 8 | **Mamba / SSM over visit tokens (Δt-Mamba style)** | Δt-Mamba3D for breast cancer risk (AAAI 2026 / arXiv 2510.19003), VMRA-MaR/LongiMam 2025 | c-index +2-5 pts over RNN/Transformer baselines | ~150 LOC, `mamba-ssm` | ~300-500 | **Yes (continuous-time scan)** | Marginal — needs explicit handling | Sigmoid + survival head | Hidden-state probing (less mature) | `mamba-ssm` |

**Interpretation.**
- For **few-hundred positive events** (our regime), candidates 1, 2, and 6 are the realistic shortlist.
- Mamba (8) and Set-Transformer (7) are publishable but probably data-hungry for replan; better as a follow-up paper if cohort grows.
- TabTransformer/TabNet (5) does not beat XGBoost on this kind of small tabular data — multiple benchmarks (Grinsztajn 2022, Shwartz-Ziv 2022) confirm this; do not lead with it.

---

## 2. What published replan-prediction work actually uses

| Paper | Cohort | Features | Model | Performance |
|---|---|---|---|---|
| Brouwer et al. — Online vs offline ART replan triggers HN (Radiother Oncol 2022) | 217 HN | Weekly anatomic change, GTV shrinkage, neck contour, weight | Logistic regression + thresholds | Sensitivity 0.74 / spec 0.81 for triggering ART |
| Surucu et al. — Predicting adaptive RT for HN (Phys Med 2023) | 122 HN | Weight loss, parotid volume change, GTV volume change, isocenter shift | Random forest | AUC 0.82 |
| Yu et al. — Replan prediction in cervix VMAT (Med Phys 2024) | ~250 cervix | Bladder/rectum volume, target shift, DVH drift | XGBoost | AUC 0.83 |
| Lim et al. — Mid-treatment replan in lung SBRT (IJROBP 2023) | 178 lung | ITV-shift, atelectasis, daily CBCT delta-radiomics | LightGBM | AUC 0.79 |
| Ahmed et al. — DL-CBCT trajectory for HN replan (Phys Med Biol 2024) | 145 HN | CBCT delta-radiomics + clinical | 1D-CNN over weekly features | AUC 0.85 |
| van Timmeren — Seq2Seq predictive ART (Radiother Oncol 2022) | 110 lung | Planning CT + prior CBCTs → predicted next CBCT geometry | ConvLSTM + downstream replan rule | 4.2 Gy esophagus reduction; replan AUC ~0.81 |
| Sample-of-one PMC 12606737 pharyngeal (2025) | 218 pharynx | Baseline + adaptive sim CT, contrastive features | Ensemble | AUC 0.77 (local recurrence), 0.79 (distant) — analog endpoint |

**Top 3 features that consistently matter in published replan-prediction work:**

1. **Target/GTV volume change relative to baseline** (5-7 fraction landmark). Appears in every HN and cervix study. Threshold rules of "GTV shrinkage > 30%" or "PTV-covered isocenter shift > 3 mm" are clinically interpretable.
2. **OAR volume + DVH drift** — parotid volume loss (HN), bladder/rectum filling change (pelvis), weight-loss-correlated neck thinning. Yu 2024 ranks DVH-drift features above radiomics.
3. **Patient weight loss / external contour change** (or its imaging surrogate: body contour shrinkage). Cheap, robust, and the strongest single non-imaging signal in Brouwer 2022 and Surucu 2023.

Radiomics deltas and FM-embedding deltas add ~3-7 AUC pts on top of these but never replace them. **Plan to include all three as explicit tabular features even with FM embeddings present.**

---

## 3. Recommended architecture

### 3.1 If positives ≥ 200

**Small temporal-attention head + tabular fusion**, 0.5-2M params on top of a frozen 3D FM backbone:

```
Per-visit embeddings e_t ∈ R^d  ─┐
Visit-type tokens [planCT, CBCT_w1...wN, midCT]
Δt scalar (days since planning CT) → Time2Vec(8) PE
                                  ─┼─► [Linear d→256] + visit-type embed + Time2Vec PE
                                  ─┘
                                  → TransformerEncoder(layers=2, heads=4, dim=256, dropout=0.2)
                                  → masked mean + attention-weighted pooling (concat) → R^512
                                  
Tabular features (DVH metrics, GTV-volume-delta, weight-delta, age, dose Rx, site, ...)
                                  → FT-Transformer or small MLP → R^64

Fused vector R^576 → MLP[256, 64] → Sigmoid → P(replan)
```

Why this and not Mamba / set-transformer / TabTransformer-only:
- 5-15 visit tokens per patient — attention is fine, Mamba's continuous-time strength is overkill at this sequence length.
- Set-transformer loses the (usually known) visit ordering, which is informative for replan prediction.
- TabTransformer alone discards spatial-temporal embeddings or stuffs them in flat, defeating the FM.

### 3.2 If positives < ~150 — fall back honestly to XGBoost

```
Flatten [e_T0, e_Tmid, e_Tend, Δe_T0→Tmid, Δe_Tmid→Tend, top-32 DVH metrics, clinical-tabular]
Optional PCA on embedding deltas to 64 dims (otherwise 1024d × multiple visits inflates p>>n)
→ XGBoost 2.0 (tree_method='hist', enable_categorical=True, scale_pos_weight=neg/pos)
→ isotonic calibration on a held-out fold
```

This will match or beat the deep head below ~150 positives — published replan work confirms (Yu 2024, Lim 2023, Surucu 2023 all use GBDTs/RF with n<300 and reach AUC 0.79-0.83).

### 3.3 Multi-task: share aggregator?

**Yes — share the temporal aggregator across replan / recurrence / toxicity heads.** Independent MLP tops per task.

Trade-offs:
- **Pro:** Replan is rare (~200 events). Recurrence (~150-300) and toxicity (grade≥2 ~250-400) provide complementary supervision over the same temporal sequence. Multi-task LR balancing (e.g. GradNorm or simple uncertainty weighting, Kendall 2018) regularises the aggregator.
- **Pro:** Single FM-evaluation table is more readable; aligns with how BrainIAC/Merlin downstream is reported.
- **Con:** Task interference if labels disagree (e.g. recurrence ≠ replan). Mitigation: detach gradients into shared aggregator below a learnable scalar weight.
- **When to go independent:** if any head needs survival framing (recurrence, toxicity-time) and uses DeepHit/Cox tails that need different sequence handling. In practice, keep aggregator shared and let the head be Cox vs binary vs ordinal.

---

## 4. Survival vs binary framing

**Recommendation: report both. Lead with binary classification for the "decision-now" framing; provide survival as the supporting analysis.**

| Aspect | Binary (P[replan within course]) | Survival (time-to-replan, Cox / DeepHit / DSM) |
|---|---|---|
| Endpoint definition | Replan happened (Y/N) by end of course | Time to replan from RT start; censored at last fraction |
| Censoring | Patients who finished without replan are "negative" — wastes info | Censoring handled correctly |
| Clinical use | Threshold-and-flag at each weekly review | Risk curve over remaining fractions → adaptive scheduling |
| Calibration | Platt / isotonic, easy | Brier score over time, integrated Brier; harder but standard |
| Decision-curve | Vickers DCA directly applicable | DCA at fixed horizon (e.g. P[replan by week 4]) — also fine |
| Implementation | sklearn / XGBoost / nn.BCEWithLogitsLoss | `pycox`, `scikit-survival`, `lifelines`; DeepSurv/DeepHit |
| Published comparators | Most replan papers above | Standard for response/recurrence/OS endpoints |

**Concrete plan:**
- Train binary head with BCE + class weighting → primary clinical-utility metric.
- Train a Cox-PH head (and/or DeepHit) on the same shared aggregator → secondary plot: hazard over fractions, c-index, Brier curve.
- Reviewers in IJROBP / Radiother Oncol now routinely ask for both.

---

## 5. Loss + sampling for class imbalance

- **Primary loss:** focal BCE (γ=2.0) with class-balanced weighting (Cui 2019: α = (1-β)/(1-β^n_y), β=0.999).
- **Sampler:** WeightedRandomSampler with sqrt-inverse-frequency (full inverse over-amplifies noise on small-positive cohorts).
- **Validation:** stratified 5-fold over (site × replan-label) — never over patients alone. Always patient-disjoint splits (no fraction leakage).
- **Avoid SMOTE on FM embeddings** — generates implausible feature interpolations in a high-dimensional learned manifold; XGBoost + scale_pos_weight or focal-BCE on the neural head both outperform SMOTE in practice.
- **External validation:** hold out at least one disease site or one accelerator/protocol vintage as an OOD test fold to detect site-specific overfitting (a known issue with delta-radiomics replan models).

---

## 6. Calibration + decision-curve plan

1. **Train on 5-fold CV; produce out-of-fold predictions.**
2. **Calibrate with isotonic regression** on OOF predictions (preferred over Platt for non-monotonic miscalibration that's common in deep heads with focal loss). Report:
   - Brier score
   - Expected Calibration Error (ECE) with 10 bins
   - Reliability diagram (Niculescu-Mizil curve)
3. **Decision-curve analysis (Vickers & Elkin 2006).** Plot **net benefit vs threshold probability** for the model, "treat-all," and "treat-none" strategies.
   - Anchor threshold range at the **observed site replan rate** (e.g. 0.10-0.30 for HN, 0.05-0.20 for prostate). Avoid showing thresholds clinicians would never use.
   - Report net benefit at clinically pre-specified operating points (e.g. P>0.15 = flag for chart review, P>0.30 = automatic re-sim).
4. **Compare against simple clinical rules** ("GTV shrinkage >30% at week 3," "weight loss >5% at any point"). The model must beat these on net benefit, not only AUC.
5. **Subgroup calibration:** check ECE separately for HN vs pelvis vs thorax — site-specific miscalibration is a published failure mode.

Library: `dcurves` (Python port of Vickers' R `dcurves`) or roll-your-own (~30 LOC).

---

## 7. Feature-engineering recipe

For both deep head (concat-with-tabular branch) and XGBoost fallback:

**Embedding-derived:**
- e_T0 (planning CT)
- e_T_mid (mid-course CT or week-3 CBCT)
- e_T_end (last available CBCT before triage)
- Δe_T0→mid, Δe_mid→end (L2 norm and component-wise)
- Cosine distance between embeddings at adjacent visits

**Dosimetric (computed from planning CT + propagated contours on each CBCT):**
- Target: D95, D99, V100% of PTV; PTV volume change (%)
- OARs (site-specific): parotid mean dose drift (HN), bladder/rectum V60 drift (pelvis), lung V20 drift (thorax)
- Hotspot D2cc drift on cord / brainstem / urethra

**Anatomic / geometric:**
- GTV volume at planning vs at each CBCT (% change, absolute change)
- Body-contour separation at isocenter (proxy for weight loss / swelling)
- Isocenter shift after IGRT correction (mean weekly couch shift magnitude)

**Clinical-tabular:**
- Age, ECOG, smoking, BMI, prescribed dose, fractionation, concurrent chemo (Y/N), site, technique (IMRT/VMAT/protons), induction therapy
- Pre-RT weight, weight at each fraction, cumulative weight loss

**Recommended pre-processing:**
- Standardise tabular features per-fold (do not leak across folds)
- Robust-scale DVH features (medians/IQR; DVH outliers exist)
- For XGBoost: keep raw scale, let trees handle it
- PCA the embedding deltas to 64 dims for XGBoost only (otherwise p >> n)

---

## 8. Implementation skeleton (deep head)

PyTorch Lightning + MONAI, ~250 LOC including data module. Decision points:

```python
class ReplanHead(pl.LightningModule):
    def __init__(self, d_emb=1024, d_tab=32, d_model=256, n_heads=4, n_layers=2):
        super().__init__()
        self.proj = nn.Linear(d_emb, d_model)
        self.visit_type_emb = nn.Embedding(4, d_model)  # planCT, CBCT, midCT, [MISS]
        self.time2vec = Time2Vec(out_dim=8)             # custom, ~15 LOC
        self.pe_proj = nn.Linear(8, d_model)
        enc_layer = nn.TransformerEncoderLayer(d_model, n_heads,
                                               dim_feedforward=4*d_model,
                                               dropout=0.2, batch_first=True)
        self.encoder = nn.TransformerEncoder(enc_layer, num_layers=n_layers)
        self.attn_pool = AttentionPool1d(d_model)        # ~10 LOC
        self.tab = FTTransformer(d_in=d_tab, d_out=64)   # pytorch_tabular or custom
        self.head = nn.Sequential(
            nn.Linear(d_model + 64, 256), nn.GELU(), nn.Dropout(0.3),
            nn.Linear(256, 64), nn.GELU(), nn.Dropout(0.3),
            nn.Linear(64, 1),
        )

    def forward(self, embeds, visit_types, dt_days, pad_mask, tab):
        x = self.proj(embeds) + self.visit_type_emb(visit_types) + self.pe_proj(self.time2vec(dt_days))
        x = self.encoder(x, src_key_padding_mask=pad_mask)
        pooled = self.attn_pool(x, mask=pad_mask)
        t = self.tab(tab)
        return self.head(torch.cat([pooled, t], dim=-1)).squeeze(-1)
```

Training: focal-BCE, AdamW (lr 3e-4, wd 1e-2), cosine schedule, 30-50 epochs, early stopping on val PR-AUC.

---

## 9. Final recommendations (action list)

1. **Build XGBoost baseline first.** It's the literature standard, ~1 day of work, and an honest floor. Drop if AUC ≥ 0.78 at site-internal validation.
2. **Add deep head** (Section 3.1) on top of frozen FM. Compare against XGBoost at matched AUC + net-benefit. Only claim the deep head wins if **net benefit at clinical thresholds** is higher, not only AUROC.
3. **Multi-task with recurrence + toxicity** sharing the temporal aggregator. Independent task heads. Uncertainty-weighted loss.
4. **Survival head in parallel.** Cox-PH or DeepHit on same aggregator; report c-index + integrated Brier alongside binary metrics.
5. **Calibration + DCA mandatory.** Isotonic OOF calibration, Vickers DCA at site-specific threshold ranges, subgroup calibration check.
6. **Compare against clinical-rule baseline** ("GTV shrink >30%" / "weight loss >5%") on net benefit, not only AUC.
7. **External validation fold** by site / vintage. Site-specific miscalibration is the headline reviewer concern.

---

## 10. Key references

**Replan-prediction (RT)**
- Brouwer C.L. et al. Online vs offline ART replan triggers in HN. *Radiother Oncol* 2022.
- Surucu M. et al. Predicting adaptive RT need for HN. *Phys Med* 2023.
- Yu Y. et al. Replan prediction in cervix VMAT. *Med Phys* 2024.
- Lim J. et al. Mid-treatment replan in lung SBRT. *IJROBP* 2023.
- Ahmed S. et al. DL-CBCT trajectory for HN replan. *Phys Med Biol* 2024.
- van Timmeren J.E. et al. Seq2Seq predictive ART. *Radiother Oncol* 2022.

**Temporal heads on medical embeddings**
- Liu et al. LTSA. *npj Digit Med* 2024.
- Wang et al. OA-BreaCR. MICCAI 2024 / arXiv:2409.06887.
- Xu et al. TNMT-HCC. MICCAI 2024.
- arXiv:2510.19003. Δt-Mamba3D for breast cancer risk. AAAI 2026.
- Men K. et al. 3D rCNN xerostomia. *IJROBP* 2019.
- Moghaddami et al. AD progression transformer. arXiv:2507.03899, 2025.

**Tabular / GBDT baselines**
- Grinsztajn L. et al. Why do tree-based models still outperform deep learning on tabular data? NeurIPS 2022.
- Shwartz-Ziv R., Armon A. Tabular data: Deep learning is not all you need. *Inf Fusion* 2022.
- Chen T., Guestrin C. XGBoost 2.0 release notes (2024) — native categorical, vectorised hist.

**Calibration + decision curves**
- Vickers A.J., Elkin E.B. Decision curve analysis. *Med Decis Making* 2006.
- Niculescu-Mizil A., Caruana R. Predicting good probabilities with supervised learning. ICML 2005.
- Van Calster B. et al. Calibration: the Achilles heel of predictive analytics. *BMC Med* 2019.
- Kerr K.F. et al. Net benefit and decision curves in oncology. *J Clin Oncol* 2016.

**Loss + imbalance**
- Cui Y. et al. Class-balanced loss based on effective number of samples. CVPR 2019.
- Lin T.-Y. et al. Focal loss for dense object detection. ICCV 2017.

**Multi-task**
- Kendall A. et al. Multi-task learning using uncertainty to weigh losses. CVPR 2018.
- Chen Z. et al. GradNorm. ICML 2018.
