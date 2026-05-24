# M6 — Longitudinal Outcome Modeling (Recurrence + Toxicity)

> **Module scope**: pick the outcome head for the radiotherapy FM project given frozen 3D-CT FM (VoCo) embeddings at T0 / mid-RT / end-RT / follow-up, plus DVH + clinical. Endpoints: time-to-recurrence (LC, DM) and per-OAR toxicity. Cohort: ≤2k Mayo patients, 30-60% event rate, 3-10 timepoints. Goal: **ship**, not invent survival methodology.

---

## TL;DR

- **Primary head**: `xgboost ≥ 2.0` with `objective="survival:cox"` (or `survival:aft`) on a **flattened feature vector** = `[PCA(embed_T0) | Δembed_mid | Δembed_end | DVH-per-OAR | clinical]`.
- **Cross-check**: `scikit-survival` `RandomSurvivalForest` and `GradientBoostingSurvivalAnalysis` on the same matrix. If both agree on C-index ±0.02, you have an honest baseline.
- **One model per endpoint** (LC, DM, xerostomia G≥2, pneumonitis G≥2, esophagitis G≥2, dysphagia G≥2). Multi-task (DeepHit / DSM) is a stretch v2 — adds engineering cost, marginal C-index gain at this n.
- **Toxicity**: model both as **binary at 12-mo fixed horizon** (primary, simpler, decision-curve-friendly) AND **time-to-toxicity Cox** (secondary, supports competing-risks framing). Use 12-mo as the headline number in the paper.
- **Calibration + DCA**: `lifelines.calibration` (`survival_probability_calibration`) + `dcurves` (Sjoberg's Python port of `dcurves` R package).
- **Published C-index target to claim parity**: **0.68-0.78** for RT recurrence on imaging+DVH+clinical; **0.70-0.80** for major toxicities. Above 0.80 needs strong external validation to be credible.

---

## 1. Candidate comparison

Legend: ✅ first-class · 🟡 possible with glue code · ❌ not supported · *cr* = competing risks · *me* = multi-event · *lc* = longitudinal covariates

| # | Method | Library / repo | License | Last release | *cr* | *me* | Censor | n≈1k OK? | Interpret | Calib | C-idx native | Longitudinal native |
|---|--------|----------------|---------|--------------|:----:|:----:|:------:|:--------:|:---------:|:-----:|:------------:|:-------------------:|
| 1 | **XGBoost-Cox / AFT** | `xgboost ≥2.0` | Apache-2.0 | active (2024-25) | ❌ | ❌ | ✅ | ✅ | SHAP ✅ | 🟡 (post-hoc isotonic) | 🟡 (compute yourself) | ❌ (flatten) |
| 2 | **scikit-survival** (GBSA / RSF / CoxPH / CoxNet) | `scikit-survival` | GPL-3 | active | ❌ | ❌ | ✅ | ✅ | feat_imp + SHAP-tree ✅ | 🟡 | ✅ (`concordance_index_censored`) | ❌ (flatten) |
| 3 | **DeepSurv** | `pycox.models.CoxPH` (and `auton-survival`) | BSD-3 / MIT | active | ❌ | ❌ | ✅ | 🟡 (overfits easy) | weak | 🟡 | ✅ | 🟡 (concat) |
| 4 | **DeepHit** | `pycox.models.DeepHit` / `DeepHitSingle` | BSD-3 | active | ✅ | ✅ (single-risk MTL via timegrid) | ✅ | 🟡 | weak | ✅ (discrete-time → calibrated buckets) | ✅ | 🟡 |
| 5 | **DSM** (Deep Survival Machines) | `auton-survival` (`DeepSurvivalMachines`) | MIT | active | ✅ | ✅ | ✅ | ✅ (parametric → data-efficient) | weak | ✅ (mixture-of-Weibulls → smooth) | ✅ | 🟡 |
| 6 | **Auton-Survival / pycox suite** | `auton-survival`, `pycox`, `torchtuples` | MIT / BSD-3 | active | ✅ via DSM/DeepHit | ✅ | ✅ | ✅ | weak | ✅ | ✅ | 🟡 |
| 7 | **N-MTLR** | `pycox.models.MTLR` / `pysurvival` | BSD-3 / Apache | `pycox` active; `pysurvival` stale (2020) | ❌ | 🟡 (joint loss) | ✅ | 🟡 | weak | ✅ (discrete logits) | ✅ | 🟡 |
| 8 | **Stanford Time-to-Event Pretraining** (Huo 2024, arXiv:2411.09361) — **what FM downstream actually looks like** | code: `som-shahlab/femr` + Huo's repo | Apache-2.0 | 2024-25 | ❌ | partial (sep heads) | ✅ | ✅ | low (embedding-level) | 🟡 | ✅ | ✅ (the FM does it) |
| 9 | **Cox PH on radiomics+clinical** | `lifelines.CoxPHFitter` | MIT | active | ❌ (cause-spec only) | ❌ | ✅ | ✅ | β coefs + HR ✅ | ✅ (`survival_probability_calibration`) | ✅ | ❌ (flatten + time-varying via `CoxTimeVaryingFitter`) |
| 10 | **DeepHazard / RNN-Surv** | `pycox.models.CoxTime`, `DeepHazard` repo (Rava 2020), `RNN-Surv` repo | various, repos mostly stale (2020-21) | ❌ | ❌ | ✅ | 🟡 | weak | 🟡 | ✅ | ✅ |

### Per-row detail (the parts the table can't carry)

**1. XGBoost-Cox / AFT** (`xgboost ≥ 2.0`)
- `objective="survival:cox"` uses negative log-partial-likelihood; label = signed time (`+t` event, `-t` censored). `survival:aft` (since v1.2, robust in v2+) handles interval censoring and lets you choose log-normal / log-logistic / Weibull distribution + `aft_loss_distribution_scale`.
- No native competing risks. Workaround: fit one cause-specific model per cause (recurrence Cox; death Cox); combine with cumulative-incidence reconstruction (Aalen-Johansen) post-hoc.
- SHAP via `TreeExplainer` works out of the box — this is the single biggest reason to prefer it for the paper's interpretability figure.
- C-index not natively reported; use `sksurv.metrics.concordance_index_censored` or `lifelines.utils.concordance_index` on the predicted risk score (note sign convention: XGBoost-Cox returns log-hazard, higher = worse; pass `-score` to `lifelines`).
- Data appetite: comfortable from ~300 events. Best at this n if you regularize hard (`max_depth=3-4`, `min_child_weight≥5`, `reg_alpha≥0.1`, early stopping on validation C-index).

**2. scikit-survival**
- `RandomSurvivalForest`: tree-based, nonparametric, handles nonlinearity, no need to scale features. Slower than XGBoost but very stable at small n; permutation importance is the standard interpretability.
- `GradientBoostingSurvivalAnalysis` (`loss="coxph"` or `loss="ipcwls"`): a Cox-loss GBM, the direct apples-to-apples comparison for XGBoost-Cox.
- `CoxnetSurvivalAnalysis`: ElasticNet-penalized Cox — the right baseline against high-dim embeddings.
- Calibration via predicted survival curves (`predict_survival_function`) + Hosmer-Lemeshow at fixed horizon, or use `lifelines.calibration.survival_probability_calibration`.

**3. DeepSurv** (Katzman 2018)
- `pycox.models.CoxPH`: MLP that outputs log-hazard, trained on Cox partial likelihood (Efron tie-handling).
- At 1k patients and 1-2k input dim it will overfit unless you (a) PCA the embedding to 32-128, (b) use dropout ≥0.3, (c) early-stop on validation C-index.
- No advantage over XGBoost-Cox at this scale per multiple benchmarks (Kvamme 2019, Wang 2022) unless the relationship is strongly non-additive in raw embedding dims — which a tree-GBM also captures.

**4. DeepHit** (Lee 2018)
- Discretizes time into K bins, outputs a softmax over (cause × bin). Loss = log-likelihood + ranking loss for concordance.
- **The right pick if you commit to a multi-event head**: jointly models e.g. {local-fail, distant-fail, death} as competing risks with shared trunk.
- Outputs calibrated PMFs (sum to 1 over time bins + censor), so calibration is natural at the chosen horizon.
- Costs: choosing K (we'd use ~20 bins quantile-spaced over follow-up), needs more tuning than XGBoost, weaker interpretability.

**5. DSM** (Nagpal 2021, IEEE JBHI)
- Outputs a mixture of K parametric distributions (Weibull or log-normal). Continuous time, supports competing risks.
- **The right pick if calibration is mission-critical**: parametric → smooth survival curves, often better calibrated than DeepHit at small n.
- `auton-survival` API is sklearn-like and pleasant. Multi-event via `DeepRecurrentSurvivalMachines` (RDSM) when you have longitudinal covariates — this is the one neural approach that actually uses time-varying covariates natively.

**6. Auton-Survival + pycox** (the umbrella)
- `auton-survival` (CMU Auton Lab, Nagpal) wraps Cox-MLP, DeepSurv, DSM, DCM (Deep Cox Mixtures), counterfactual estimation, phenotyping. Same `fit/predict_survival/predict_risk` API across models. **This is the library to standardize on for neural survival**, even if XGBoost stays the primary head.
- `pycox` (Kvamme) wraps DeepSurv, CoxTime, CoxCC, DeepHit, MTLR, PC-Hazard, LogisticHazard. Lower-level (PyTorch + `torchtuples`).

**7. N-MTLR** (Multi-Task Logistic Regression for survival)
- Predicts P(event in bin k) as independent logistic per bin with smoothness penalty between bins. Naturally yields a discrete PMF; good for calibrated horizon predictions.
- Niche compared to DeepHit (which subsumes it). Use only if you specifically want a non-proportional-hazards baseline against Cox.

**8. Stanford Time-to-Event Pretraining** (Huo 2024, arXiv:2411.09361)
- Their downstream actually used **shallow heads (linear / small MLP / Cox) on frozen FM embeddings** for each endpoint — this is the canonical playbook for "FM + outcome head" and it matches what we will do.
- Useful as a citation to justify "freeze backbone + outcome head" not as a model to copy wholesale.

**9. Classical Cox PH on radiomics + clinical** (`lifelines`)
- The mandatory baseline. Pyradiomics features (~100 per ROI) + DVH (~30 per OAR) + clinical (~10) + L1 / EN penalty.
- `lifelines.CoxPHFitter` (penalized via `penalizer=` and `l1_ratio=`) or `sksurv.linear_model.CoxnetSurvivalAnalysis` for proper ElasticNet path.
- Time-varying covariates: `lifelines.CoxTimeVaryingFitter` accepts long-format (start, stop) intervals — the cleanest classical way to use the longitudinal embeddings.

**10. DeepHazard / RNN-Surv**
- The "true" longitudinal-covariate neural survival family. RNN-Surv (Giunchiglia 2018) and DeepHazard (Rava 2020) repos are mostly stale (last commits 2020-21, no maintenance).
- For longitudinal, `pycox.CoxTime` (Kvamme 2019) is the maintained alternative; it lets the log-hazard depend on time, but covariates are still per-row.
- `DynamicDeepHit` (Lee 2019) is the maintained alternative for longitudinal multi-event — implemented in `auton-survival` as `DeepRecurrentSurvivalMachines`. Use only if v1 results justify pushing further.

---

## 2. Recommended approach

### Phase 1 (ship this first — 4-6 weeks)

**One XGBoost-Cox per endpoint** + scikit-survival cross-check + lifelines Cox baseline.

Justification:
1. **The user's intuition is correct** at this n. Wang 2022 (J Biomed Inform), Spooner 2020 (Sci Rep), and multiple oncology benchmarks find tree-GBMs (XGBoost-Cox, RSF, GBSA) match or beat DeepSurv/DeepHit when n ≤ ~5k and the input is already a representation embedding. The neural-survival win zone is large clinical-trial cohorts (n ≥ 10k) or end-to-end pixel-to-survival.
2. **SHAP**. The reviewer-grade interpretability figure (per-feature SHAP, "delta-embedding component X drives recurrence risk") is built-in for XGBoost. Neural survival makes this much harder.
3. **Calibration is fixable post-hoc** with isotonic regression on validation set predicted probabilities at the horizon of interest — XGBoost-Cox isn't natively calibrated but neither is DeepSurv.
4. **Engineering**: one library, sklearn-style API, well-debugged.

### Phase 2 (if Phase 1 lands, ~1 month more)

Add **DSM (Deep Survival Machines)** from `auton-survival` as the multi-event / competing-risks head. Use it for the "competing risks of recurrence vs death" supplementary table that reviewers will ask for.

Add **DynamicDeepHit / RDSM** only if the multi-timepoint flattening leaves obvious signal on the table (i.e. you see the model improving as you add later visits, but plateauing under flattening). In practice for this n, this is unlikely to be worth it.

### Separate vs multi-task

**Separate models per endpoint** for the headline analysis.
- Reasons: (a) competing-risks framing differs per outcome (death is competing for recurrence; recurrence is competing for late toxicity); (b) per-OAR toxicity has very different DVH drivers (parotid for xerostomia, lung-V20 for pneumonitis); (c) reporting per-endpoint C-index + calibration is the standard.
- **One multi-task DeepHit/DSM model in the supplement** as the "joint risk profile" demonstration. Often the multi-task version is within 0.01 C-index of the per-task version but the figure (single patient → joint risk plot across endpoints) is compelling.

---

## 3. Feature engineering recipe

### Input layout

Per patient `p`, per visit `v ∈ {T0, mid, end, fu1, ...}`:
- `e_{p,v} ∈ ℝ^D` — frozen FM embedding, D ≈ 768-1536 depending on VoCo head.
- DVH features `d_p ∈ ℝ^{O·F}` — per OAR (`O ≈ 10`) and per metric (`F ≈ 8`: Dmean, Dmax, V5, V20, V30, V40, V60, EUD). Computed once from planning dose.
- Clinical `c_p ∈ ℝ^C` — age, sex, KPS/ECOG, TNM (one-hot), histology, smoking, p16, prescription dose, fractions.

### Flattening recipe

```
x_p =  [ PCA_k(e_{T0})                    # 32 dims, baseline shape
       | e_{mid} - e_{T0}                  # mid-RT delta (use only top-K PCs)
       | e_{end} - e_{T0}                  # end-RT delta
       | slope(e_{*})                      # per-PC linear slope vs visit time
       | norm(e_{end} - e_{T0})            # scalar "trajectory magnitude"
       | DVH per OAR                       # ~80 dims
       | clinical one-hots                 # ~15 dims
       ]
```

**Rules of thumb at n ≤ 2k:**
- **PCA the embeddings to k = 32-64** before doing anything. Fit PCA on T0 embeddings of training fold only. This keeps total feature dimensionality ≤ ~250.
- **Delta features matter more than absolute later-visit embeddings.** "Tumor changed a lot" carries the prognostic signal; the absolute mid-RT embedding is highly correlated with T0.
- **Slope feature**: fit a 1-D linear regression of each PC over visit time (in days from T0). Keep the slope only. This handles patients with irregular visit timing without padding.
- **Don't concatenate raw embeddings from all visits at full D.** That's 4 × 1024 = 4096 features for 1k patients — XGBoost will overfit even with regularization.
- **DVH for toxicity, embeddings for recurrence — but include both in both models.** Reviewers will ask "did DVH actually contribute to the recurrence model" — keep them in and let SHAP answer.

### Python template

```python
# ---- 0. imports
import numpy as np, pandas as pd, xgboost as xgb
from sklearn.decomposition import PCA
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sksurv.util import Surv
from sksurv.ensemble import RandomSurvivalForest, GradientBoostingSurvivalAnalysis
from sksurv.metrics import concordance_index_ipcw, integrated_brier_score
from lifelines import CoxPHFitter
from lifelines.calibration import survival_probability_calibration

# ---- 1. assume dataframe `df` with columns:
#   patient_id, time, event,  e_T0_0..e_T0_{D-1},  e_mid_0..,  e_end_0..,
#   visit_days (list per patient),  dvh_<OAR>_<metric>,  clinical_*
PCS = 32
HORIZON_DAYS = 365  # 12-month toxicity horizon

def build_features(df_train, df_test, n_pcs=PCS):
    e0_cols   = [c for c in df_train if c.startswith("e_T0_")]
    em_cols   = [c for c in df_train if c.startswith("e_mid_")]
    ee_cols   = [c for c in df_train if c.startswith("e_end_")]
    dvh_cols  = [c for c in df_train if c.startswith("dvh_")]
    clin_cols = [c for c in df_train if c.startswith("clinical_")]

    pca = PCA(n_components=n_pcs, random_state=0).fit(df_train[e0_cols].values)
    def _emb(df):
        z0 = pca.transform(df[e0_cols].values)
        zm = pca.transform(df[em_cols].values)
        ze = pca.transform(df[ee_cols].values)
        dmid  = zm - z0
        dend  = ze - z0
        slope = (ze - z0)  # if visit_days regular; else fit per-row 1-D OLS
        mag   = np.linalg.norm(dend, axis=1, keepdims=True)
        return np.hstack([z0, dmid, dend, slope, mag])
    Xtr = np.hstack([_emb(df_train), df_train[dvh_cols].values, df_train[clin_cols].values])
    Xte = np.hstack([_emb(df_test ), df_test [dvh_cols].values, df_test [clin_cols].values])
    sc = StandardScaler().fit(Xtr)
    return sc.transform(Xtr), sc.transform(Xte)

# ---- 2. XGBoost-Cox
def fit_xgb_cox(X, y_time, y_event, X_val, y_val_time, y_val_event):
    # xgboost expects label = signed time (+t event, -t censored)
    y     = np.where(y_event,     y_time,     -y_time)
    y_val = np.where(y_val_event, y_val_time, -y_val_time)
    dtr   = xgb.DMatrix(X,     label=y)
    dval  = xgb.DMatrix(X_val, label=y_val)
    params = dict(
        objective="survival:cox", eval_metric="cox-nloglik",
        tree_method="hist", max_depth=3, eta=0.03,
        min_child_weight=8, subsample=0.8, colsample_bytree=0.6,
        reg_alpha=0.1, reg_lambda=1.0, seed=0,
    )
    booster = xgb.train(
        params, dtr, num_boost_round=2000,
        evals=[(dtr, "tr"), (dval, "va")],
        early_stopping_rounds=100, verbose_eval=False,
    )
    return booster  # predict() returns log-hazard (higher = worse)

# ---- 3. C-index (IPCW, sksurv) on the predicted risk
def cindex_ipcw(y_train_struct, y_test_struct, risk_test, horizon):
    c, *_ = concordance_index_ipcw(y_train_struct, y_test_struct, risk_test, tau=horizon)
    return c

# ---- 4. scikit-survival cross-check
def fit_rsf(X, y_struct):
    return RandomSurvivalForest(
        n_estimators=500, min_samples_split=10, min_samples_leaf=15,
        max_features="sqrt", n_jobs=-1, random_state=0).fit(X, y_struct)

# ---- 5. lifelines Cox baseline (clinical+DVH only, no embeddings)
def fit_cox_baseline(df, dur="time", evt="event", penalizer=0.05):
    cph = CoxPHFitter(penalizer=penalizer, l1_ratio=0.5)
    cph.fit(df, duration_col=dur, event_col=evt)
    return cph

# ---- 6. outer 5-fold CV harness (stratify by event)
def cv_run(df, endpoint_time="time", endpoint_event="event"):
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    cidx = []
    for tr, te in skf.split(df, df[endpoint_event]):
        Xtr, Xte = build_features(df.iloc[tr], df.iloc[te])
        y_tr = Surv.from_arrays(df.iloc[tr][endpoint_event].astype(bool),
                                df.iloc[tr][endpoint_time].astype(float))
        y_te = Surv.from_arrays(df.iloc[te][endpoint_event].astype(bool),
                                df.iloc[te][endpoint_time].astype(float))
        # nested split for early stopping
        n = len(tr); cut = int(0.8 * n)
        booster = fit_xgb_cox(
            Xtr[:cut], df.iloc[tr[:cut]][endpoint_time].values,
                       df.iloc[tr[:cut]][endpoint_event].values,
            Xtr[cut:], df.iloc[tr[cut:]][endpoint_time].values,
                       df.iloc[tr[cut:]][endpoint_event].values)
        risk = booster.predict(xgb.DMatrix(Xte))
        cidx.append(cindex_ipcw(y_tr, y_te, risk, horizon=HORIZON_DAYS))
    return np.mean(cidx), np.std(cidx)
```

---

## 4. Toxicity: binary-at-horizon vs time-to-toxicity

**Primary headline endpoint: binary at 12-mo horizon, per OAR.** Reasons:
- Decision-curve analysis is most interpretable at a fixed horizon.
- Toxicity grades are typically captured at follow-up visits, not continuously — so "time" is ambiguous (assign to mid-point of the interval).
- Matches RT outcome literature conventions (xerostomia at 6/12mo, pneumonitis at 6/12mo, etc.).

**Secondary endpoint: time-to-toxicity Cox / cause-specific.** Reasons:
- Lets you report "patient developed G≥2 pneumonitis at month 4" naturally.
- Required if reviewer pushes on competing risks (death before toxicity assessment).
- Same XGBoost-Cox pipeline as recurrence — minimal extra engineering.

**Modeling tip**: per-OAR head, with **OAR-specific DVH metrics as the dominant input** (e.g. parotid Dmean for xerostomia; lung V20 for pneumonitis; esophagus V60 for esophagitis). Embedding deltas provide signal on top of DVH (tissue-level mid-treatment response). Avoid one big multi-label head — the per-OAR DVH inductive bias is too important.

---

## 5. Dose-vs-no-dose ablation (the killer figure)

This is reviewer killshot #2 from `research/05`. Do it cleanly:

For each endpoint, train 4 models on the same train/test splits:
1. **Clinical-only** (TNM, age, KPS, smoking, prescription, fractions).
2. **Clinical + DVH** (adds DVH per OAR — the classical RT model).
3. **Clinical + Embeddings** (adds frozen FM embeddings + deltas, no DVH).
4. **Full = Clinical + DVH + Embeddings**.

Report C-index, IBS (integrated Brier score), and decision-curve net benefit for each. The story you want: **(4) > (2) > (3) > (1)** for toxicity (DVH dominates), and **(4) > (3) > (2) > (1)** or **(4) ≈ (3) > (2) > (1)** for recurrence (imaging dominates). If you don't see incremental gain from embeddings on top of DVH+clinical, the FM-on-imaging story is in trouble — diagnose before the paper goes out.

Use the **DeLong-equivalent for C-index** (`compare_survival` in sksurv, or Antolini's paired test) for the comparison p-values. Bootstrap CIs at 1000 resamples.

---

## 6. Calibration + decision-curve workflow

### Calibration

At a chosen horizon `τ` (12 mo for toxicity, 24 mo for LC, 36 mo for DM):

```python
from lifelines.calibration import survival_probability_calibration
# need a lifelines-style fitted model OR predicted S(τ) per patient
# Workflow: convert XGBoost-Cox risk → S(τ) via Breslow baseline hazard

from sksurv.linear_model.coxph import BreslowEstimator
def breslow_survival(risk_train, y_train, risk_test, t):
    be = BreslowEstimator().fit(risk_train, y_train["event"], y_train["time"])
    surv_fns = be.get_survival_function(risk_test)
    return np.array([fn(t) for fn in surv_fns])  # S(t|x)
```

Then plot observed vs predicted at `τ` in deciles of predicted risk (Hosmer-Lemeshow-style) + report ICI (integrated calibration index) and slope/intercept. For neural models (DSM, DeepHit), the predicted survival function is already produced — same calibration plot.

If miscalibrated: **isotonic regression on the predicted risk → recalibrated S(τ)** on a held-out calibration fold. Document in the paper.

### Decision curve analysis (DCA)

Use **`dcurves`** (Daniel Sjoberg's port; `pip install dcurves`) — same API as the R package. Standard for clinical-utility framing now expected by IJROBP / npj Digit Med / Lancet DH.

```python
import dcurves
res = dcurves.dca(
    data=df_test.assign(pred=1 - S_tau),    # convert survival to event prob
    outcome="event_at_tau",
    modelnames=["clinical", "clinical+dvh", "clinical+embed", "full"],
    thresholds=np.arange(0.05, 0.5, 0.01),
    time=365, time_to_outcome_col="time",
)
dcurves.plot_graphs(res, graph_type="net_benefit")
```

Frame the conclusion as "across plausible thresholds (5-50%), the full model provides higher net benefit than treat-all / treat-none / clinical-only" — this is the language reviewers want.

For the **adaptive-replan trigger** sub-result, switch to **net intervention avoided** rather than net benefit — that's the clinically-action-oriented framing.

---

## 7. Expected C-index ranges from published RT outcome work

Use these as the **target band to claim parity with literature**. If your model lands inside the band, you've reproduced. If above + held up on external validation, you've improved.

| Endpoint | Published C-index range | Representative papers |
|----------|-------------------------|-----------------------|
| **Head and neck — locoregional control / recurrence** | 0.68 - 0.78 | Diamant 2019 *Sci Rep* (CNN HN radiomics, 0.71); Hosny 2018 *PLOS Med* (DL CT NSCLC, 0.70-0.74); Bourbonne 2021 / Wang 2024 *Clin Exp Metastasis* multi-center NPC, 0.74-0.79 |
| **NSCLC — overall / disease-free survival** | 0.65 - 0.74 | Hosny 2018 (0.70); FMCIB (Pai 2024) downstream recurrence 0.67-0.73; Mukherjee 2020 (TCIA NSCLC, 0.71) |
| **Glioma — OS / PFS** | 0.62 - 0.72 | UPenn / BraTS-derived, typical 0.65-0.70; multimodal MRI radiomics adds ~0.03 |
| **Prostate — biochemical failure** | 0.65 - 0.75 | Variable; depends heavily on PSA inclusion |
| **Xerostomia G≥2 at 6-12mo (H&N RT)** | 0.70 - 0.80 (AUC) | Men 2019 *IJROBP* CNN dose-omics 0.76; Soomro 2022 0.74-0.78 |
| **Radiation pneumonitis G≥2 (lung RT)** | 0.65 - 0.78 (AUC) | Cui 2019 / Luna 2019 (lung V20 alone ≈ 0.67; +DL imaging 0.74-0.78) |
| **Esophagitis G≥2** | 0.67 - 0.76 (AUC) | Dean 2017 / Huang 2019 |
| **Dysphagia G≥2** | 0.65 - 0.74 (AUC) | MD Anderson / Dean 2018 |

**Concrete parity claim for the paper**: "On our held-out test fold, the proposed FM-embedding + DVH + clinical XGBoost-Cox achieves a C-index of X (95% CI Y-Z), comparable to the 0.68-0.78 range reported in multi-center RT outcome studies (refs)." If you land 0.72-0.76 on Mayo and 0.68-0.72 on external — that's a publishable result.

---

## 8. Evaluation pipeline (the actual reporting checklist)

For each endpoint × each model:

1. **5-fold stratified CV on Mayo** (stratify by event indicator). Report mean C-index ± std.
2. **Locked external validation** on at least one TCIA RT cohort (HNSCC / NSCLC-Radiomics / OPC-Radiomics) — single split, no tuning.
3. **Metrics per fold/split**:
   - Harrell's C-index + Uno's IPCW C-index (`concordance_index_ipcw`).
   - Time-dependent AUC at τ (Uno or Heagerty estimator; sksurv has it).
   - Integrated Brier Score over [0, τ] (`sksurv.metrics.integrated_brier_score`).
   - Calibration at τ: ICI, slope, intercept; plot.
   - Decision curve at τ; report net benefit at threshold range relevant to the clinical decision (e.g., 15-30% for replan-trigger).
4. **Ablations** (Section 5).
5. **Subgroup analysis**: by site (Mayo Rochester / AZ / FL), by stage, by histology — calibration check per subgroup. Reviewers love this for "fairness across populations".
6. **SHAP summary plot** + dependence plots for top-5 features per endpoint. This is the interpretability figure.

---

## 9. Risks specific to this module

- **Embedding drift across timepoints from registration error.** If T0 is on planning CT but mid-RT is on CBCT, the VoCo embedding may not be directly comparable. **Mitigation**: register CBCT→pCT before tokenization (M3 territory); also report a CBCT-only sensitivity model.
- **Toxicity label noise.** CTCAE grading varies. Use ≥G2 thresholds (not G1) to reduce noise; ensure consistent grading across follow-up visits.
- **Loss-to-follow-up censoring informative.** Patients lost early may differ systematically. Sensitivity analysis: refit with administrative-censor-only patients (i.e., enroll-based censor, not loss).
- **Class imbalance for rare toxicities.** Pneumonitis G≥3 may be <5%. Use stratified bootstrap CIs; consider focal-style loss only if class is <10%.
- **Multiplicity.** ~6-10 endpoints × 4 model variants × ablations = many tests. Pre-register the primary endpoint (LRFS at 24 mo) and Bonferroni / Benjamini-Hochberg the rest.

---

## 10. Decision summary

| Question | Answer |
|----------|--------|
| Primary model | **XGBoost-Cox** on flattened `[PCA(e_T0) | Δe_mid | Δe_end | slope | DVH | clinical]` |
| Cross-check models | `scikit-survival` RSF + GBSA; `lifelines` penalized CoxPH baseline |
| Multi-event / competing risks | **DSM** (`auton-survival`) as supplementary, separate per-endpoint models primary |
| Multi-task vs per-task | **Per-task** primary, multi-task DeepHit/DSM in supplement |
| Longitudinal handling | **Flatten** with delta+slope features (don't bother with RDSM at this n) |
| Toxicity endpoint type | **Binary at 12-mo** primary + Cox time-to-event secondary |
| Calibration | Breslow → S(τ); isotonic recalibration if needed; ICI + plot |
| Decision-curve | `dcurves` (Sjoberg port) at clinically meaningful thresholds |
| C-index target | **0.68-0.78** recurrence; **0.70-0.80 AUC** toxicity |
| External validation | TCIA HNSCC / NSCLC-Radiomics / OPC-Radiomics — single locked split |
