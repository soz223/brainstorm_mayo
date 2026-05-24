# M7. Radiomics Baseline for the Radiotherapy FM Project

Mandatory **handcrafted-radiomics baseline** for the RT-FM outcome / response
prediction tasks. Reviewers will not accept an FM paper without a radiomics
comparator. Pipeline: planning CT + on-treatment CBCT (T0, T_mid, T_end) inside
each contoured ROI -> IBSI-compliant feature extraction -> delta-radiomics
across timepoints -> harmonization -> stability filter -> mRMR/LASSO
selection -> XGBoost / Cox PH -> compare to FM embeddings.

---

## 1. Tooling landscape (2022-2026)

| Package | Repo / install | License | Last release | IBSI 1.0 | IBSI 2.0 (filters) | 3D + 2D | Speed (per ROI, 256^3) | Multi-ROI / label map | CBCT notes | sklearn / XGB friendly | Recommended? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PyRadiomics** | `AIM-Harvard/pyradiomics` ; `pip install pyradiomics` | BSD-3 | v3.1.0 (2023; community v3.1.x patches 2024-2025) | Yes (validated) | **Partial** (LoG, wavelet OK; SWT/Gabor/local-binary not all benchmarked to IBSI-2) | Both | 5-15 s with wavelets enabled | One label per call; loop over integer labels | No HU calibration. Bin width must be fixed across timepoints. Mask must come from registered CBCT-OAR contours | Returns OrderedDict -> pandas trivially | **Yes, primary** |
| **MIRP** (Zwanenburg) | `oncoray/mirp` ; `pip install mirp` | EUPL-1.2 | v2.x active 2024-2025 | Yes | **Yes, full IBSI 2.0 benchmark** | Both | 10-25 s | Native multi-ROI, multi-mask | Built-in resegmentation, intensity outlier removal, ComBat hooks | DataFrame output | **Yes, for IBSI-2 sensitivity check** |
| **SERA** (McGill, MATLAB + Python wrapper) | `ashrafinia/SERA` | GPL | 2023 | Yes (reference) | Yes | Both | slow | label maps | Same caveats | wrapper only | Reference only |
| **CERR Radiomics** (MATLAB) | `cerr/CERR` | LGPL | active 2024 | Yes | Yes | Both | medium | DICOM-RTSTRUCT native | Best DICOM-RT support | needs matlab.engine | Use if starting from DICOM-RTSTRUCT |
| **LIFEx** | lifexsoft.org | Free (closed) | 7.x 2024 | Yes | Partial | Both | GUI | yes | yes | export CSV | GUI only; not for pipelines |
| **TexLab / Onko** | various | mixed | older | Partial | No | Both | n/a | n/a | n/a | n/a | Skip |
| **MITK Phenotyping** | mitk.org | BSD | 2024 | Yes | Partial | Both | medium | yes | yes | csv | Optional cross-check |
| **MOddICOM / radiomics-toolbox (R)** | CRAN | GPL | 2023 | Yes | No | Both | slow | yes | yes | needs reticulate | Skip in Python stack |
| **ImaginAI / RaCaT** | github.com/PRO-cancer/RaCaT | BSD | 2022 | Yes | No | Both | medium | yes | yes | C++ binary | Reference only |
| **DeepFeatures (radiomics-from-CNN)** | various | mixed | 2024 | n/a | n/a | Both | fast | yes | yes | yes | This is **deep-radiomics**, separate from handcrafted baseline — note as comparator |
| **PyFeats / FeatureExtractor3D** | misc | mixed | sporadic | partial | no | 2D-leaning | fast | limited | yes | yes | Skip |

**Decision: PyRadiomics as primary extractor + MIRP as IBSI-2.0 sensitivity
check.** PyRadiomics has the dominant citation graph (>3.5k) and is what every
RT outcome reviewer expects to see; MIRP gives a fully IBSI-2.0 benchmarked
parallel extraction so we can show feature reproducibility.

---

## 2. IBSI compliance status (2026)

- **IBSI 1.0 (2020, Radiology)** — 169 features, 11 image processing steps. All
  modern packages pass.
- **IBSI 2.0 (2024, Zwanenburg et al., Radiology AI)** — 9 filter families
  (mean, LoG, Laws, Gabor, wavelets stationary/non-stationary, square,
  square-root, logarithm, exponential). Only **MIRP** is end-to-end IBSI-2.0
  certified. PyRadiomics LoG + wavelet match IBSI-2.0 on standard test phantoms
  but Gabor / Laws / SWT do not match exactly.
- Implication: if we publish features beyond LoG+wavelet, extract those with
  MIRP, not PyRadiomics.

---

## 3. CBCT-specific radiomics — caveats

CBCT is **not** HU-calibrated in the usual sense. Documented issues:

1. **Scatter and bowtie artifacts** — distort first-order intensity stats.
   Mitigation: use a scatter-corrected CBCT reconstruction (Varian iCBCT,
   Elekta XVI v5+, or DL-based scatter correction like ScatterNet / Maier 2018).
2. **Day-to-day variability** — same patient + same anatomy + different day can
   give ICC < 0.7 on ~30% of texture features (van Timmeren 2017,
   Bologna 2019, Fave 2017). Stability filter is mandatory.
3. **Vendor differences** — Varian vs Elekta CBCT differ in voxel spacing,
   FOV, recon kernel. Resample to **isotropic 1.0 mm** before extraction.
4. **HU shift between planning CT and CBCT** — do NOT directly subtract raw HU
   features across modality; either (a) extract per-modality and concatenate,
   or (b) use a HU-correction CBCT (DL synthesis to pseudo-CT, e.g. Maspero 2018,
   cycleGAN-pseudo-CT) and treat as CT.
5. **Truncation artifacts** in head-and-neck CBCT — OAR contours near skin/air
   often fall on truncated voxels; resegmentation to [-150, 250] HU helps for
   soft tissue.

**Our protocol:** extract on raw scatter-corrected CBCT, fixed bin width
25 HU for CT and **bin count = 32** for CBCT (relative binning, since CBCT
intensities are not absolute), isotropic 1.0 mm, resegment to organ-appropriate
HU window per ROI.

---

## 4. Recommended feature panel (IBSI codes)

Standard RT panel = **107 IBSI base features per ROI per filter**:

| Family | Count | IBSI prefix | Notes |
|---|---|---|---|
| Shape 3D | 14 | `morph_*` (MORPH) | Only on original image, not on filtered |
| First-order | 18 | `stat_*` / `ih_*` | Includes intensity histogram |
| GLCM | 24 | `cm_*` | Gray-level co-occurrence |
| GLRLM | 16 | `rlm_*` | Gray-level run-length |
| GLSZM | 16 | `szm_*` | Gray-level size-zone |
| GLDM | 14 | `ngl_*` / NGLDM | Gray-level dependence |
| NGTDM | 5 | `ngt_*` | Neighbourhood gray-tone difference |

**Filter banks** applied to the image before re-extracting first-order + texture
(shape is invariant to filters and is extracted only once):

- **Original** (1x) -> 107 features
- **LoG** with sigma = {1, 2, 3, 4, 5} mm (5x) -> 93 features each (no shape)
- **Wavelet (Coiflet-1 or db1)** 3D decomposition, 8 sub-bands: LLL, LLH, LHL,
  LHH, HLL, HLH, HHL, HHH (8x) -> 93 features each
- **Square / Square-root / Logarithm / Exponential** (4x) -> 93 features each
  (optional, IBSI-2.0)
- **Gradient** (1x) -> 93 features

Totals:
- Minimal RT panel (Original + LoG + Wavelet): **14 + 19*93 = 1781 features**
- Full IBSI-2.0 panel (add Sq / Sqrt / Log / Exp / Gradient): **~2200 features**

We will run the **minimal RT panel** (Original + LoG sigma=1,2,3 + Wavelet 8
sub-bands) = 14 shape + 12 * 93 = **1130 features per ROI per timepoint per
modality**. This is the van Timmeren / Aerts-lab default and matches what
RadOnc reviewers expect.

---

## 5. Delta-radiomics protocol

**Sampling timepoints** (RT fraction schedule, 30-35 fx over 6-7 wk):
- T0 = planning CT (fx 0)
- T_mid = CBCT week 3 (around fx 12-15)
- T_end = CBCT week 6 (around fx 25-30)
- Optional T1 = CBCT week 1 (fx 3-5) for short-term reactivity

For each feature `f` and each ROI:

1. **Absolute delta** `delta_f = f(t_k) - f(t_0)`
2. **Relative delta** `rel_f   = (f(t_k) - f(t_0)) / |f(t_0) + eps|`
3. **Slope** = OLS slope of `f(t)` vs fraction number across all available
   timepoints (van Timmeren 2017 calls this "feature trajectory")
4. **AUC of trajectory** (Fave 2017) = trapezoidal integral
5. **Last-value** `f(T_end)`

Keep all 5 per base feature -> features grow x5. Apply selection after.

**Published protocols to follow / cite:**

1. **van Timmeren et al. 2017, Acta Oncol** — first NSCLC delta-radiomics on
   CBCT during chemoRT, used "weekly CBCT", relative change, ICC stability,
   LASSO + Cox.
2. **Fave et al. 2017, Sci Rep** — NSCLC, weekly CBCT, defined slope + AUC
   trajectory features, RFE + Cox.
3. **Cunliffe et al. 2015, IJROBP** — radiation pneumonitis from delta features
   between planning CT and follow-up CT.
4. **Nasief et al. 2019, npj Precision Onc** — pancreas delta-radiomics on
   CBCT for pCR prediction.
5. **Yip et al. 2016, Phys Med Biol** — esophageal delta-radiomics on PET-CT,
   defined the canonical relative-change formulation.

---

## 6. Harmonization

CT/CBCT cross-modality + multi-vendor + multi-site dataset.

- **Per-modality harmonization first**: ComBat (Fortin neuroComBat or
  `neurocombat-sklearn`) across vendors/sites, **within** each modality (CT
  separate from CBCT). Empirical Bayes ComBat with **batch = scanner_model**,
  preserve biological covariates (age, sex, stage, primary site).
- **Modality fusion**: do **not** ComBat across CT vs CBCT. Concatenate the
  harmonized per-modality vectors. Reasoning: CT and CBCT are physically
  different acquisitions; ComBat across them removes signal of interest
  (delta CT-vs-CBCT is meaningful).
- Alternative: train a CycleGAN CBCT -> pseudo-CT (Maspero 2018 / synCT,
  Landry 2019) and treat all scans as CT. Heavier; do as an ablation, not the
  primary pipeline.

---

## 7. Stability analysis

Two independent stability filters, run **before** feature selection:

1. **Contour perturbation stability**: dilate/erode each ROI by ±1 voxel
   (or apply elastic perturbation, sigma=2 mm). Re-extract. Compute **ICC(3,1)**
   on each feature. Keep features with **ICC >= 0.80** (RT field convention;
   Hatt 2018 / van Timmeren 2020).
2. **Test-retest stability**: where two same-day CBCTs exist (or repeat scans
   from the RIDER lung CT public set as a proxy), require **ICC >= 0.85**.

A typical RT pipeline loses ~30-50% of features at this step (Traverso 2018
systematic review). Acceptable.

---

## 8. Feature selection

Sequence (Parmar 2015 / van Timmeren 2020 standard):

1. Drop features with **>20% missing or NaN** values across cohort.
2. Drop features with **near-zero variance** (variance < 1e-4 after
   standardization).
3. **Pairwise Spearman pruning**: among feature pairs with |rho| > 0.90,
   keep the one with higher univariate Cox C-index (or univariate MI with
   outcome).
4. **mRMR** (mRMRe in R or `pymrmr` / `mifs`) to select top 25-50 features.
5. Optional: **Boruta** (all-relevant) cross-check.
6. **LASSO-Cox** (for survival) or **LASSO-logistic** (for binary) for final
   sparsification, alpha by 5-fold CV inside the training fold.

Targets:
- Final feature count = 10-30 (rule of thumb: events / 10, EPV >= 10).
- For 200-event cohorts, max ~20 features in final XGBoost / Cox model.

---

## 9. Classifier / regressor

- Primary: **XGBoost** with early stopping, 5-fold CV, monotonic constraints
  off, scale_pos_weight for class imbalance. Hyperparam search via Optuna.
- Survival: **XGBoost Cox** (`xgboost` with `objective='survival:cox'`) or
  scikit-survival **Random Survival Forest** + **Gradient Boosted Cox**.
- Linear baseline: **LASSO-Cox** (scikit-survival `CoxnetSurvivalAnalysis`).
- Ensemble: stack LASSO-Cox + XGBoost Cox via Cox-PH meta-learner (Yip 2017).

Evaluation:
- AUC at fixed horizon (1y / 2y) + 95% CI by 1000x bootstrap.
- Harrell C-index + integrated Brier score (survival).
- Calibration plot, decision-curve analysis (Vickers).
- Compare to **FM-embedding + same classifier head** (paired DeLong).

---

## 10. Multi-ROI strategy

We will extract per ROI: **GTV, CTV, PTV, parotid_L, parotid_R, spinal_cord,
mandible, brainstem, larynx, oral_cavity, submand_L, submand_R** (H&N example).

Strategies (run both, report both):

- **Concatenation**: feature vector = concat across ROIs. Pros: keeps OAR
  context. Cons: huge dimensionality (12 ROIs * 1130 = 13560 features). Heavy
  reliance on stability + mRMR.
- **GTV-only + dose summary per OAR**: extract full radiomics on GTV only,
  plus DVH summary stats (Dmean, D2, V20, V40) per OAR. Smaller, more
  interpretable, what most RT outcome papers actually do.
- **Per-ROI submodel + late fusion**: train one XGBoost per ROI, average
  predictions (or stack). Useful for heterogeneous label availability.

Default: **GTV-only radiomics + DVH per OAR + clinical features**, with
multi-ROI concat as an ablation.

---

## 11. Dose-omics / dose+radiomics fusion

For the RT-specific baseline, extract radiomics features **on the planned dose
grid** inside each ROI as well (Liang 2019 "dosiomics", Wu 2020). Same IBSI
panel applied to dose-in-Gy as the intensity image. Concatenate to image
radiomics. This is the "image + dose-omics + clinical" stack that won most
RT outcome challenges 2022-2024 (e.g., HECKTOR 2022).

---

## 12. Python code template

```python
# pip install pyradiomics SimpleITK numpy pandas scikit-survival
# pip install xgboost optuna pymrmr neurocombat-sklearn

import os, json, numpy as np, pandas as pd, SimpleITK as sitk
from radiomics import featureextractor

# 1) extractor config -- IBSI-compliant
params = {
    "setting": {
        "binWidth": 25,          # CT: 25 HU; for CBCT use binCount=32 instead
        "resampledPixelSpacing": [1.0, 1.0, 1.0],
        "interpolator": "sitkBSpline",
        "normalize": False,
        "preCrop": True,
        "geometryTolerance": 1e-4,
        "force2D": False,
    },
    "imageType": {
        "Original": {},
        "LoG": {"sigma": [1.0, 2.0, 3.0]},
        "Wavelet": {"start_level": 0, "level": 1, "wavelet": "coif1"},
    },
    "featureClass": {
        "shape": [],            # all
        "firstorder": [],
        "glcm": [],
        "glrlm": [],
        "glszm": [],
        "gldm": [],
        "ngtdm": [],
    },
}

extractor = featureextractor.RadiomicsFeatureExtractor(params)

def extract_one(image_nii: str, mask_nii: str, label: int = 1) -> dict:
    img = sitk.ReadImage(image_nii)
    msk = sitk.ReadImage(mask_nii)
    feats = extractor.execute(img, msk, label=label)
    # keep only diagnostic-free features
    return {k: float(v) for k, v in feats.items()
            if not k.startswith("diagnostics_") and np.isscalar(v)}

def extract_patient(scans: dict, masks: dict, rois: list[str]) -> pd.Series:
    """scans = {'CT_T0': path, 'CBCT_Tmid': path, 'CBCT_Tend': path}; masks per timepoint."""
    out = {}
    for tp, img_path in scans.items():
        for roi_idx, roi in enumerate(rois, start=1):
            feats = extract_one(img_path, masks[tp], label=roi_idx)
            for k, v in feats.items():
                out[f"{tp}__{roi}__{k}"] = v
    return pd.Series(out)

def delta_features(df: pd.DataFrame, base_names: list[str],
                   t0: str = "CT_T0", t1: str = "CBCT_Tmid", t2: str = "CBCT_Tend"):
    """Compute absolute, relative, and slope delta-radiomics features."""
    eps = 1e-8
    delta_cols = {}
    for f in base_names:                       # feature name without timepoint prefix
        x0 = df[f"{t0}__{f}"]
        x1 = df[f"{t1}__{f}"]
        x2 = df[f"{t2}__{f}"]
        delta_cols[f"abs_delta_mid__{f}"] = x1 - x0
        delta_cols[f"abs_delta_end__{f}"] = x2 - x0
        delta_cols[f"rel_delta_mid__{f}"] = (x1 - x0) / (x0.abs() + eps)
        delta_cols[f"rel_delta_end__{f}"] = (x2 - x0) / (x0.abs() + eps)
        # slope across (0, mid_fx, end_fx)
        t = np.array([0, 15, 30])
        slope = ((x0 * t[0] + x1 * t[1] + x2 * t[2]) - 3 * t.mean() * (x0 + x1 + x2) / 3) \
                / ((t ** 2).sum() - 3 * t.mean() ** 2)
        delta_cols[f"slope__{f}"] = slope
    return pd.DataFrame(delta_cols, index=df.index)

# Stability filter (ICC >= 0.80) -- pseudo
def icc_filter(df_orig: pd.DataFrame, df_pert: pd.DataFrame, threshold=0.80):
    from pingouin import intraclass_corr
    keep = []
    for col in df_orig.columns:
        long = pd.DataFrame({
            "subj": list(df_orig.index) * 2,
            "rater": ["orig"] * len(df_orig) + ["pert"] * len(df_pert),
            "val": list(df_orig[col]) + list(df_pert[col]),
        })
        icc = intraclass_corr(data=long, targets="subj", raters="rater",
                              ratings="val").set_index("Type").loc["ICC3", "ICC"]
        if icc >= threshold:
            keep.append(col)
    return keep

# ComBat harmonization (per modality)
from neuroCombat import neuroCombat
def combat_harmonize(X, batch_col, covars):
    out = neuroCombat(dat=X.T.values, covars=covars, batch_col=batch_col,
                      categorical_cols=[], continuous_cols=[])
    return pd.DataFrame(out["data"].T, index=X.index, columns=X.columns)

# Selection: Spearman prune -> mRMR -> LASSO-Cox
from scipy.stats import spearmanr
import pymrmr
from sksurv.linear_model import CoxnetSurvivalAnalysis

def spearman_prune(X, y_event_time, thresh=0.90):
    # keep feature with higher univariate |Spearman| with time
    keep = list(X.columns)
    for i in range(len(keep)):
        for j in range(i + 1, len(keep)):
            if keep[i] is None or keep[j] is None:
                continue
            r, _ = spearmanr(X[keep[i]], X[keep[j]])
            if abs(r) > thresh:
                ri, _ = spearmanr(X[keep[i]], y_event_time)
                rj, _ = spearmanr(X[keep[j]], y_event_time)
                drop = keep[j] if abs(ri) >= abs(rj) else keep[i]
                idx = keep.index(drop)
                keep[idx] = None
    return [k for k in keep if k is not None]

# mRMR
def mrmr_select(X, y_binary, k=30):
    df = X.copy()
    df.insert(0, "class", y_binary.astype(int).values)
    return pymrmr.mRMR(df, "MIQ", k)

# XGBoost Cox
import xgboost as xgb
def fit_xgb_cox(X, surv_t, surv_e):
    # encode survival as +time for event, -time for censor
    y = np.where(surv_e == 1, surv_t, -surv_t)
    dtrain = xgb.DMatrix(X, label=y)
    params = dict(objective="survival:cox", eval_metric="cox-nloglik",
                  learning_rate=0.05, max_depth=4, subsample=0.8,
                  colsample_bytree=0.5)
    return xgb.train(params, dtrain, num_boost_round=400)
```

---

## 13. Five most-cited delta-radiomics RT papers to benchmark against

1. **van Timmeren JE, et al. "Survival prediction of non-small cell lung cancer
   patients using radiomics analyses of cone-beam CT images." Radiother
   Oncol 2017.** — first delta-radiomics on CBCT; AUC ~0.69 for 2y OS.
2. **Fave X, et al. "Delta-radiomics features for the prediction of patient
   outcomes in non-small cell lung cancer." Sci Rep 2017.** — slope features,
   AUC ~0.72 for OS at 2y, NSCLC.
3. **Cunliffe A, et al. "Lung texture in serial thoracic CT scans:
   correlation of radiomics-based features with radiation therapy dose and
   radiation pneumonitis development." IJROBP 2015.** — defines the
   delta-feature concept for RT toxicity.
4. **Nasief H, et al. "A machine learning based delta-radiomics process for
   early prediction of treatment response of pancreatic cancer." npj
   Precision Oncology 2019.** — pancreas pCR, AUC 0.94 (small cohort, n=90).
5. **Yip SSF, Aerts HJWL. "Applications and limitations of radiomics."
   Phys Med Biol 2016 / Yip et al. PMB 2016 esophageal PET-CT delta.** —
   canonical relative-change formulation, methodological review.

Additional must-read recent reviews:
- Traverso A, et al. "Repeatability and reproducibility of radiomic features"
  IJROBP 2018.
- van Timmeren JE, et al. "Radiomics in medical imaging — how-to guide and
  critical reflection." Insights Imaging 2020.
- Spadarella G, et al. "Radiomics in medical imaging: systematic assessment of
  current literature." Eur Radiol 2023.

---

## 14. Recommended pipeline (one-line summary)

`PyRadiomics (binWidth=25, isotropic 1mm, Original + LoG[1,2,3] + Wavelet[coif1])
-> per-ROI extract @ T0/CT, T_mid/CBCT, T_end/CBCT -> delta {abs, rel, slope}
-> ComBat per modality (batch=scanner) -> ICC(3,1) >= 0.80 stability filter
-> Spearman prune (|rho|<0.9) -> mRMR top-30 -> LASSO-Cox / XGBoost-Cox
-> 5-fold CV, 1000-boot AUC + C-index.`

---

## 15. Expected performance to beat

Reported AUC ranges of CBCT-based delta-radiomics + XGBoost / Cox on RT outcome
prediction (lit synthesis, see Section 13 + Traverso 2018 + Spadarella 2023):

- **NSCLC 2y OS / locoregional control**: AUC 0.65 - 0.75, C-index 0.62 - 0.70
- **H&N locoregional recurrence / OS**: AUC 0.66 - 0.74, C-index 0.62 - 0.72
- **Pancreas pCR / response**: AUC 0.78 - 0.92 (small cohorts, optimistic)
- **Rectal pCR**: AUC 0.72 - 0.85
- **Toxicity (xerostomia, RP)**: AUC 0.65 - 0.78
- **External validation degrades by 0.05-0.10 AUC** vs internal CV — this is
  the realistic target for FM to beat.

**Bar to beat with FM embeddings**: external-test AUC > 0.75 on H&N LRC or
NSCLC OS, or equivalently > 0.05 absolute AUC improvement over this radiomics
pipeline with paired DeLong p < 0.05.
