# Public Longitudinal Medical Imaging Datasets

Comprehensive inventory for pretraining/evaluating a longitudinal 3D medical imaging foundation model. Focus: datasets with ≥2 imaging timepoints of the same patient (primarily 3D CT/MRI; 2D flagged). Numbers reflect public sources as of May 2026; see caveats per row.

Legend:
- **Patients (longi.)** = patients with ≥2 imaging timepoints (where stated). When only a global N is reported, the "≥2 TP" column is annotated as "subset" or "most".
- **Modality codes:** sMRI = structural MRI; T1, T2, FLAIR, DWI, ASL, SWI standard; mpMRI = multiparametric; LDCT = low-dose CT; CTPA = CT pulmonary angiography.

---

## 1. Large-scale BRAIN MRI (Alzheimer's, aging, neurodegeneration)

| Dataset | Patients | ≥2 TP | TP/patient (range) | Interval | Modalities | Body part | Disease/cohort | Paired data | Access | License |
|---|---|---|---|---|---|---|---|---|---|---|
| **ADNI 1/2/3/4** (USC LONI IDA) | ~3,500+ cumulative across phases; ADNI4 enrolling up to 1,500 (started 2023) | most | 2–10+ MRI; PET subset 2–6 | 6/12/24 months | 1.5T/3T sMRI (T1, T2, FLAIR, DTI, ASL, rs-fMRI); amyloid PET (PiB, AV45, florbetaben); tau PET (AV1451, MK6240); FDG-PET | Brain | AD, MCI, CN, SCD | CSF Aβ/tau, plasma p-tau, APOE & WGS, full neuropsych, longitudinal clinical, partial digital biomarkers | Gated (DUA via IDA) | Custom non-commercial DUA |
| **OASIS-1** | 416 | No (cross-sectional, 3–4 same-day repeats) | 1 session | n/a | T1 MPRAGE | Brain | AD, healthy adults 18–96 | Demographics, MMSE, CDR | Open (NITRC-IR, DUA-light) | Custom non-commercial DUA |
| **OASIS-2** | 150 | Yes | 2+ visits, total 373 sessions | ≥1 yr | T1 MPRAGE | Brain | Nondemented, demented, converters 60–96 | CDR longitudinal | Open | Non-commercial |
| **OASIS-3** | 1,378 | Most | 2,842 MR + 2,157+ PET sessions | ~1–2 yr | T1, T2, FLAIR, ASL, SWI, TOF, rs-BOLD, DTI; PIB, AV45, FDG, Tau PET | Brain | CN, cognitive decline 42–95 | Cognitive, CSF, genetic | Open (DUA) | Non-commercial |
| **OASIS-4** | 663 | Subset | Clinical-cohort scans | clinical | sMRI + clinical assessments | Brain | Memory clinic, 21–94 | Comprehensive clinical | Open (DUA) | Non-commercial |
| **AIBL** | 3,045 with ~10,500 person-years | Most | ~18-month repeat visits up to 15 yr | 18 mo | sMRI (MPRAGE/T2 FSE/FLAIR), PiB-PET, FDG-PET, tau-PET in subset | Brain | AD, MCI, CN | CSF, blood biomarkers, lifestyle, cognition, ApoE | Open (via LONI IDA) | Non-commercial DUA |
| **UK Biobank** (imaging extension) | ~100,000 imaged by Jul 2025; ~60,000 invited for repeat; ~20,000 with second visit by end-2025 | ~20k brain | 2 (a few 3) | 2–7 yr | Brain 3T (T1, T2 FLAIR, SWI, DTI, rs-fMRI, task fMRI); cardiac MRI; abdominal MRI (Dixon); DXA; carotid US | Brain + body | General population | Full primary-care/hospital EHR, genotypes + exome + WGS, lab biomarkers, accelerometry, deep phenotyping | Gated (DUA + paid access) | Custom (researcher access) |
| **ABCD Study** | ~11,800 baseline | Yes (planned 10 yr) | Baseline + 2-yr + 4-yr + 6-yr (75% have 6-yr in Release 6.0) | 2 yr imaging | 3T sMRI, dMRI, rs-fMRI, task fMRI | Brain | Adolescents 9–10 baseline → through young adulthood | Cognitive, mental health, substance use, biospecimens, genomics, social/environment | Gated (NDA DUA) | Non-commercial |
| **ABIDE I + II** | ~2,000+ total | 38 with 2 TP (UCLA + Pittsburgh subsets) | 2 | 1–4 yr | sMRI + R-fMRI | Brain | Autism + controls (5–64) | Phenotype, diagnostic scales | Open (NITRC) | Non-commercial |
| **HCP-Young Adult** | 1,200 | No (mostly) | 1 (test-retest in ~50) | days | 3T + 7T sMRI/dMRI/rs-fMRI/task | Brain | Healthy 22–35 | Cognition, behavior, genotypes (Penn battery) | Open (DUA, ConnectomeDB) | WU-Minn |
| **HCP-Development (HCP-D)** | 1,300+ children/adolescents 5–21 | Subset | longitudinal subset (V2) | ~12–24 mo | 3T sMRI, dMRI, rs-/task-fMRI, ASL | Brain | Typical development | Cognition, puberty, hormones | Open (DUA) | Non-commercial |
| **HCP-Aging / AABC** | 1,200+ adults 36–100+; AABC R2 = 1,396 ppl/2,878 sessions | Yes | V1, V2, V3, V4 (cross-sectional + longi waves) | ~12–24 mo | 3T sMRI/dMRI/rs-fMRI/task/ASL | Brain | Typical aging | Cognition, biomarkers, lifestyle | Open (DUA) | Non-commercial |
| **PPMI** | 2,000+ | Most | Visits twice/yr after 4 visits/yr in year 1; 1.83-yr mean f/u for MRI phenotypes (n≈2,754 in 2024 paper) | 6–12 mo | 3T sMRI; DaTscan SPECT; some DTI, NM-MRI | Brain (subcortical) | Parkinson's (idiopathic, genetic, prodromal, control) | CSF α-syn SAA, genetics, digital, biospecimens | Open (DUA) | Non-commercial |
| **Cam-CAN** | ~700 (Stage 2); 2,581 (Stage 1) | Yes (Phase 4 + 5) | 2 MRI/MEG TP, 3 cognitive TP | ~12 yr (Phase 1 → 5) | 3T sMRI, dMRI, fMRI, MEG | Brain | Healthy lifespan 18–87 | Cognitive battery, MEG, demographics | Open (DUA) | Non-commercial |
| **IXI** | ~600 | No | 1 | n/a | T1, T2, PD, MRA, DTI | Brain | Healthy adults (Hammersmith/Guys/IOP) | Light demographics | Open | CC BY-SA 3.0 |
| **OpenBHB** | 5,330 (10,420 scans aggregated from 10 datasets) | Some via underlying sources | varies | varies | sMRI T1 | Brain | Healthy adults | Age, sex, site | Open (IEEE DataPort) | Mixed (source-dependent) |
| **Rotterdam Study (Scan)** | 5,286 with MRI; 10,755 scans | Yes | 1–4 (mean 2) | mean 3.3 yr | T1, T2, FLAIR, DTI, perfusion | Brain | Pop-based middle-aged + elderly | Extensive epidemiology, genomics, repeat clinical | Gated (collaboration request) | Custom DUA |
| **4RTNI / NIFD (FTLDNI)** | 260 (130 FTLD + 130 controls) | Yes | 4 TP (0/6/12/18 mo) | 6 mo | sMRI, some DTI, FDG-PET | Brain | bvFTD, PSP, CBS, controls | Cognition, fluid biomarkers, genetics | Open (LONI IDA DUA) | Non-commercial |
| **TADPOLE Challenge** | 1,737 (from ADNI) | Yes | derived from ADNI longitudinal | varies | ADNI-derived imaging features + raw | Brain | AD trajectory prediction | ADNI clinical/biomarker | Open (via ADNI) | Non-commercial |
| **ENIGMA consortium** | ~30,000+ across working groups (federated) | Some (depression, schizophrenia, AD, addiction subgroups have longi data) | varies | varies | sMRI/dMRI summary stats (raw at source sites) | Brain | Many disorders | Disorder-specific clinical | Federated/collaboration | Variable |
| **NACC SCAN** (ADRC harmonized imaging) | 54,000+ ADRC participants total; SCAN serves a growing subset of MR + amyloid/tau/FDG PET | Many | ADRC annual+ visits, imaging when funded | annual+ | sMRI, amyloid PET, tau PET, FDG PET (defaced as of Aug 2024) | Brain | AD spectrum + controls (multi-site ADRCs) | UDS clinical, biospecimens, neuropath at death | Gated (Data Front Door) | Non-commercial |
| **GENFI** | ~1,000 (Genetic FTD Initiative) | Yes | annual visits | 12 mo | T1, T2, FLAIR, DTI, rs-fMRI | Brain | Genetic FTD (C9orf72, GRN, MAPT) families | Cognition, fluid biomarkers, genetics | Gated (consortium) | Restricted |
| **DIAN** (Dominantly Inherited AD Network) | ~500 | Yes | annual visits | 12 mo | sMRI, PiB-PET, FDG-PET, tau-PET | Brain | Autosomal-dominant AD mutation carriers + non-carriers | CSF, plasma, cognitive, genetic | Gated (DIAN-Obs DUA) | Non-commercial |
| **HABS** (Harvard Aging Brain Study) | ~300 | Yes | annual MRI + PET | 12 mo | sMRI, PiB-PET, tau-PET | Brain | Cognitively normal aging | Cognition, blood biomarkers | Open (DUA via habs.mgh.harvard.edu) | Non-commercial |
| **MIRIAD** | 69 | Yes | up to 9 TP over 2 yr | varies | T1 MPRAGE | Brain | AD vs control | MMSE | Open | CC-BY |
| **AomicID1000 / Piop1 / Piop2** | ~900+ | No (one cross-section + intensive same-day) | 1 | n/a | sMRI/dMRI/rs-/task-fMRI | Brain | Healthy young adults | Behavioral | Open | CC0 |

**Synthesis for brain MRI:** Aggregating ADNI + AIBL + OASIS-2/3 + PPMI + ABCD + UK Biobank (brain repeat) + HCP-A/D longi + 4RTNI + Cam-CAN + NACC-SCAN realistically yields **~50–70k subjects with ≥2 brain MRI timepoints** (dominant contributors: UK Biobank ~20k, ABCD ~11k, NACC-SCAN ~5–10k, ADNI ~3k, AIBL ~2.5k, OASIS-3 ~1.4k, Rotterdam Study ~5k via collaboration). Of those, **~10–15k have ≥3 TP**, and **~3–5k have ≥5 TP** (ADNI long-term arms + ABCD by 6-year + AIBL + NACC).

---

## 2. LUNG CT (cancer screening, COPD, COVID, ILD)

| Dataset | Patients | ≥2 TP | TP/patient | Interval | Modality | Cohort | Paired data | Access | License |
|---|---|---|---|---|---|---|---|---|---|
| **NLST** | 53,454 (26,722 LDCT arm) | Yes | T0, T1, T2 (3 annual rounds; ~75,000 CT exams in LDCT arm) | 1 yr | LDCT (multiple slice thickness reconstructions) | High-risk smokers 55–74 | Cancer diagnosis, mortality through 2009 (and follow-ups since), demographics, smoking | Gated (NCI CDAS DUA; data-only + images tiers) | NCI DUA |
| **NELSON** | 15,789 (men + women) | Yes | T0, yr 1, yr 3, yr 5.5 (4 rounds) | 1/2/2.5 yr | volumetric LDCT | Dutch/Belgian high-risk smokers | Lung-cancer outcome, mortality 5/7/10/11 yr | Gated (UMCG collaboration) | Restricted |
| **LIDC-IDRI** | 1,010 | Mostly No (some have prior scans) | typically 1 | n/a | Diagnostic CT | Lung nodules / lung cancer | 4-radiologist nodule annotations | Open (TCIA) | CC-BY 3.0 |
| **RIDER Lung CT** | 32 | Yes (same-day repeat) | 2 within 15 min (×6 reconstructions) | minutes | CT | NSCLC | Lesion contours | Open (TCIA) | CC-BY |
| **I-ELCAP** | ~1,000 (publicly indexed annotation subset) | Some longitudinal | 1–3 | annual | LDCT | Lung-screening | Annotations, malignancy labels | Restricted (registration) | Custom |
| **COPDGene** | 10,300 enrolled; >40,000 CT scans total through Phase 3 | Yes | ~2 (Phase 1, 5-yr Phase 2); Phase 3 10-yr coming | 5 yr | Inspiratory + expiratory chest CT | COPD + at-risk smokers | Spirometry longi, PROMs, genomics, plasma biomarkers, mortality | Gated (NHLBI BioLINCC + DCC) | Restricted DUA |
| **SPIROMICS** | 2,981 | Yes | Baseline + annual visits + multi-year CT subset | annual clinical; CT at select TP | Inspiratory + expiratory CT | COPD spectrum | Spirometry, sputum, plasma | Gated (BioLINCC) | Restricted |
| **MESA Lung** | ~3,200 (MESA imaging subset with chest CT) | Yes | exam 1, 5, 6 chest CTs | ~5–10 yr | Chest CT | Pop-based atherosclerosis cohort with COPD ancillary | MESA full pheno (echo, cIMT, cardiac MRI, labs, genotypes) | Gated (BioLINCC) | Restricted |
| **NSCLC-Radiomics** | 422 | Subset | mostly 1 baseline (pre-treatment) | n/a | CT | NSCLC stage I–IIIB | Survival, histology, stage | Open (TCIA) | CC-BY |
| **NSCLC-Radiogenomics** | 211 | Subset | pre-treatment CT/PET-CT | n/a | CT, PET-CT | NSCLC | Mutations, RNA-seq, clinical, survival | Open (TCIA) | CC-BY |
| **NSCLC-Cetuximab (RTOG 0617)** | 490 | Yes | pre-treatment CT + serial post-treatment CT preserved as longitudinal dates | varies | CT chest + treatment imaging | Stage III NSCLC | RTOG trial clinical, OS | Open (TCIA) | CC-BY |
| **ACRIN-NSCLC-FDG-PET (ACRIN 6668)** | 226 | Yes | pre + post-treatment PET-CT | weeks | PET-CT | Stage III NSCLC | RECIST, OS | Open (TCIA) | CC-BY |
| **S0819 (SWOG)** | 285 | Yes | serial CT during chemo ± cetuximab | weeks | CT chest | Advanced NSCLC | Trial outcomes | Open (TCIA) | CC-BY |
| **Anti-PD1-Lung (Cheng et al)** | ~70 | Yes | pre + post ICI CT | weeks | CT chest | Advanced NSCLC on ICI | iRECIST, OS | Open (TCIA) | CC-BY |
| **NLST-New-lesion-LongCT** (TCIA analysis result) | subset of NLST | Yes | derived longitudinal subset | annual | LDCT | NLST | new-lesion annotations | Open (TCIA) | CC-BY |
| **PLCO (chest x-ray + EHR)** | 154,901 enrolled; lung arm had annual CXR (not CT) over 4 yrs | Yes for CXR | up to 4 CXR annual | 1 yr | Chest x-ray (2D) — *flagged as 2D, not 3D* | Cancer screening pop | Mortality through 2022, biospecimens limited | Gated (NCI CDAS) | NCI DUA |
| **COVID-19 NY-SBU / Stony Brook COVID-19** | 1,384 | Some | varies | days/weeks | CT chest + CXR | COVID-19 | Clinical, labs, outcomes | Open (TCIA) | CC-BY |
| **MIDRC RICORD-1A/1B/1C** | 1A: 120 CT+ COVID; 1B: 120 CT-; 1C: 361 patients/998 CXR | Mostly single | 1 typically | n/a | CT/CXR | COVID-19 | Diagnostic labels | Open (TCIA) | CC-BY |
| **MIDRC (full)** | 130,000+ imaging studies across COVID + non-COVID | Subset | varies | varies | CT, CXR, MRI | COVID + post-pandemic dataset | Per-study clinical, race/sex/age | Open (gen3 + TCIA mirrors) | CC-BY for most |
| **CT-RATE** | 21,304 unique patients / 25,692 volumes (50,188 reconstructions) | ~3,000–4,000 patients have ≥2 (≈ #volumes − #patients ≈ 4,388 extra scans) | mostly 1; some 2–4 | varies (clinical 2015–2023) | Non-contrast chest CT | Mixed clinical population (Türkiye) | Free-text radiology reports + multi-abnormality labels | Open (HuggingFace) | CC-BY 4.0 |
| **MosMedData (COVID-19)** | 1,110 | Mostly single | 1 | n/a | CT chest | COVID-19 | Severity labels | Open | CC BY-NC-ND |

**Synthesis for chest CT:** Aggregating NLST (~26.7k LDCT × 3 TP ≈ 80k scans) + COPDGene (~10k × 2+ TP) + NELSON (~7.9k × 4 TP) + MESA Lung (~3.2k × 2 TP) + SPIROMICS (~2.9k subset) yields a realistic **~50k+ patients with ≥2 chest CT timepoints**, with ~25k having ≥3 timepoints. Add CT-RATE for report-paired pretraining (single + small longi subset). **NLST is by far the highest-volume open-DUA longitudinal chest CT corpus.**

---

## 3. TCIA Oncology cohorts (cancer with serial imaging)

### 3a. Glioma / Brain Tumor longitudinal MRI

| Dataset | Patients | ≥2 TP | TP/patient | Modality | Cohort | Paired data | Access |
|---|---|---|---|---|---|---|---|
| **UPenn-GBM** | 630 (611 with pre-op baseline) | Subset | baseline + pre-2nd-surgery for subset | mpMRI (T1/T1c/T2/FLAIR + DTI/perfusion) | de novo GBM | Genomics (subset), clinical, survival, radiomic features, expert annotations | Open (TCIA) |
| **LUMIERE** | 91 GBM | Yes | avg ~7 TP, 638 study dates / 2,487 image series total | T1/T1c/T2/FLAIR | GBM Bern cohort | RANO ratings, MGMT, IDH1 (subset), OS | Open (TCIA + figshare) |
| **MU-Glioma-Post** | 100+ | Yes | post-treatment serial | mpMRI | post-op glioma | Tumor sub-region annotations | Open (TCIA) |
| **UCSD-PTGBM** | 298 | Yes | post-treatment serial | mpMRI | post-treatment GBM | Annotations, RANO | Open (TCIA, 2025 release) |
| **BraTS-Longitudinal (BraTS 2024 Post-Treatment)** | part of >4,500-case BraTS 2024 pool; longi cases drawn from UCSF/Penn/MU/others | Yes | 2–5 typical | mpMRI | adult glioma | Multi-region tumor annotations (ET, SNFH, NETC, RC) | Open (Synapse, registration) |
| **BraTS-PEDs (pediatric)** | ~250 | Some | varies | mpMRI | Pediatric high-grade glioma (CBTN-linked) | Tumor annotations, partial molecular | Open (Synapse) |
| **Yale-Brain-Mets-Longitudinal** | 1,430 patients / 11,892 MRI studies (2004–2023) | Yes | mean ~8 studies/patient | T1, T1c, T2, FLAIR (NIfTI) | Brain metastases | Demographics, scanner info; companion clinical sub-collection | Open (TCIA) |
| **UCSF-PDGM** | 501 | No (preoperative single TP) | 1 | mpMRI 3T | Diffuse glioma | IDH, MGMT, segmentation | Open (TCIA) |
| **LGG-1p19qDeletion** | 159 | No | 1 | mpMRI | Low-grade glioma | 1p/19q status, segmentations | Open (TCIA) |
| **UCSD-VS-Longitudinal** | ~100s | Yes | serial follow-up | T1, T1c | Vestibular schwannoma | Volumetric annotations | Open (TCIA) |
| **CPTAC-GBM** | ~99 | Subset | usually 1; some 2 | mpMRI | GBM | Full CPTAC proteogenomics | Open (TCIA) |
| **REMBRANDT** | 130 | Some | varies | T1, T1c, T2 | Glioma | Survival, molecular | Open (TCIA) |
| **TCGA-GBM / TCGA-LGG** | 262 + 199 | Some | most single pre-op | mpMRI | GBM, LGG | Full TCGA omics, survival | Open (TCIA) |
| **CBTN (Children's Brain Tumor Network)** | 2,000+ | Yes | serial clinical | mpMRI | Pediatric brain tumors | Genomics (CAVATICA), clinical | Gated (Pedcbioportal/CAVATICA DUA) |

### 3b. Head & Neck longitudinal

| Dataset | Patients | TP | Modality | Notes | Access |
|---|---|---|---|---|---|
| **HEAD-NECK-CETUXIMAB** | 111 (RTOG 0522) | Pre-RT + post-RT serial | CT + PET-CT | Trial OS/PFS | Open (TCIA) |
| **HNSCC** | 215 | Pre + post-treatment CT/MRI | CT, MRI | Trial outcomes | Open (TCIA) |
| **HECKTOR (MICCAI Challenge)** | 524 (2022); 882 in HECKTOR 2025 | Some longi follow-up | PET-CT | OPC outcomes | Open (registration) |
| **OPC-Radiomics** | 606 | baseline + on-treatment CBCT | CT | OPC, RFS, OS | Open (TCIA) |
| **AAPM RT-MAC** | 31 | Pre + mid-RT MRI | MRI | Adaptive RT | Open (TCIA) |
| **HNTSMRG24** | 150 | Pre-RT + mid-RT MRI | MRI | MRI-guided adaptive RT segmentation | Open (TCIA, 2024) |

### 3c. Breast longitudinal

| Dataset | Patients | TP | Modality | Notes | Access |
|---|---|---|---|---|---|
| **ISPY1 (ACRIN 6657)** | 222 | 4 TP during NAC (pre, early, inter-regimen, pre-surgery) | DCE-MRI | NAC, pCR, RFS, OS, FTV | Open (TCIA) |
| **ISPY2 (ACRIN 6698)** | ~985 (as released through 2024) | 4 TP (T0, T1, T2, T3) during NAC; subset adds DWI | DCE-MRI + DWI | Adaptive trial, pCR, EFS by subtype | Open (TCIA) |
| **Breast-MRI-NACT-Pilot** | 64 | 2–4 TP during NAC | DCE-MRI | Pre-ISPY pilot | Open (TCIA) |
| **Duke-Breast-Cancer-MRI** | 922 | mostly single pre-op | DCE-MRI | Annotations | Open (TCIA) |
| **MAMA-MIA** | 1,506 (4 datasets combined) | Subset longi (NACT response) | DCE-MRI | Segmentations + clinical | Open (TCIA, 2024) |
| **EMBED** (Emory Mammo) | 110,000+ patients / 3.4M images | Yes (longitudinal mammography per patient) | 2D mammography / DBT — *flagged 2D* | Demographics, BI-RADS, biopsy outcomes | Open (DUA via Emory) | Restricted |
| **CMMD (Chinese Mammography)** | 1,775 | Mostly single | mammography | Tumor type | Open | CC-BY |
| **DDSM / CBIS-DDSM** | ~2,500 cases | Some patients with prior films | Digitized mammography | Annotations | Open | Public domain |

### 3d. Liver / Abdomen longitudinal

| Dataset | Patients | TP | Modality | Notes | Access |
|---|---|---|---|---|---|
| **HCC-TACE-Seg** | 105 | Pre + post-TACE | CT | Response | Open (TCIA) |
| **TCGA-LIHC** | 97 | Some serial | CT/MRI | TCGA omics | Open (TCIA) |
| **Duke-Liver-MRI** | 2,146 | Subset multi-TP | MRI | Liver-MRI screening | Open (TCIA, 2023) |
| **CRLM-CT (Colorectal Liver Met)** | 197 | Pre + post-chemo | CT | Response | Open (TCIA) |
| **CMB-LCA (NCI Longitudinal HCC)** | 90 | Multi-TP | CT/MRI | Multi-cancer benchmark | Open (TCIA, 2024) |

### 3e. Prostate longitudinal

| Dataset | Patients | TP | Modality | Notes | Access |
|---|---|---|---|---|---|
| **PROSTATEx / PROSTATEx-2** | 346 | Mostly single pre-biopsy | mpMRI (T2W, DW, DCE) | Lesion + Gleason | Open (TCIA) |
| **PROSTATE-MRI** | 26 (NCI) | Pre-prostatectomy single + path | mpMRI | Whole-mount path | Open (TCIA) |
| **PROSTATE-MRI-US-BIOPSY** | 1,151 | Pre-biopsy + biopsy-time US | MRI + TRUS | Targeted biopsy outcomes | Open (TCIA) |
| **PCASTt/SPCG-17** (active surveillance trial) | 2,000 | Yes (periodic MRI on AS) | mpMRI | AS protocol with MRI triggers; PCa outcome | Restricted (consortium) |
| **PI-CAI** | 1,500 (public training) + private test | Mostly single | mpMRI | csPCa labels | Open (challenge) |

### 3f. Pancreas / Pediatric / Other

| Dataset | Patients | TP | Modality | Notes | Access |
|---|---|---|---|---|---|
| **CPTAC-PDA** | ~95 | Some serial | CT | Pancreatic adeno, full CPTAC omics | Open (TCIA) |
| **MSD Task07 Pancreas** | 420 | Single | CT | Segmentation | Open |
| **Pediatric Brain Tumor Consortium (PBTC) on TCIA** | 100+ | Some | MRI | Pediatric trials | Open (TCIA, gated) |
| **CBTN (above)** | 2,000+ | Yes | MRI | Pediatric brain tumors | Gated (CAVATICA) |
| **PED-EPI-2025 (challenge)** | ~150 | Pre/post-RT | MRI | Pediatric ependymoma | Open (Synapse) |
| **Pediatric Renal (RMS, Wilms)** | small | varies | CT/MRI | COG-linked | Restricted |

**Synthesis for oncology longi:** Realistically aggregable TCIA + linked oncology cohorts give **~10–15k patients with ≥2 oncology imaging timepoints + treatment + outcome labels** — Yale-Brain-Mets alone = 1.4k × ~8 TP; ISPY1+2 = ~1.2k × 4 TP; UPenn-GBM + LUMIERE + MU-Glioma-Post + UCSD-PTGBM = ~1.1k longi GBM; NSCLC trial cohorts (Cetuximab/0617, S0819, ACRIN-6668, NSCLC-Radiomics longi) = ~1.5k; HEAD-NECK trial cohorts ~1k; HCC + Liver = ~2k; brain mets + glioma cumulative ~3–4k.

---

## 4. Cardiac / Chest (non-cancer)

| Dataset | Patients | TP | Modality | Cohort | Paired data | Access | Notes |
|---|---|---|---|---|---|---|---|
| **MESA (Multi-Ethnic Study of Atherosclerosis)** | 6,814 baseline; 5 follow-up exams (17–20 mo apart) | Yes | exams 1–6, cardiac MRI at exam 1+5+6 subsets; coronary CT at multiple exams | Cardiac MRI, coronary calcium CT, abdominal CT, carotid US | Pop-based (4 ethnicities) | Full clinical longi, biomarkers, omics in subsets, mortality through 2020+ | Gated (BioLINCC + MESA Coordinating Center) |
| **MESA-Lung / MESA-Air / MESA-Brain** | subsets of MESA | Yes | varies | various ancillary modalities | env exposure, brain MRI | Gated | |
| **Framingham Heart Study (Offspring/Gen-3)** | repeated brain MRI in subgroups (~2,500) | Yes | 2–3 brain MRI TP; cardiac MRI in subsets | Brain MRI, cardiac MRI, vascular | Famous cardiovascular cohort | Decades of longi clinical, genomics | Gated (BioLINCC) |
| **UK Biobank Cardiac MRI** | ~100k baseline imaged; ~20k repeat | Yes (subset) | 2 TP | 4-chamber, SAX cine, native T1, T2, LGE | Pop-based | EHR, genotypes | Gated (paid) |
| **ACDC (MICCAI 2017 challenge)** | 150 | No | 1 (ED + ES same exam) | Cine MRI | DCM, HCM, MINF, RV, normal | Diagnostic labels | Open |
| **M&Ms / M&Ms-2** | 375 (M&Ms-2) | No (single TP, multi-vendor) | 1 | Cardiac MRI | DCM, HCM | Annotations | Open |
| **EMIDEC (myocardial infarction)** | 150 | No | 1 | LGE-MRI | Normal vs MI | Annotations | Open |
| **CARDIAC-MRI-SCD-Risk** | 156 | Subset | varies | Cardiac MRI | Risk stratification | Annotations | Open (TCIA) |
| **MyoCarDM** | 8,500 | Yes | 2 TP MRI for subset | Cardiac MRI | DM cardiomyopathy | Clinical | Restricted |
| **CHIRP** | varies | Yes | repeated cardiac | Cardiac MRI | Cardiac imaging registries | clinical | Restricted |

---

## 5. Pediatric & Developmental

| Dataset | Subjects | TP | Modality | Cohort | Paired | Access |
|---|---|---|---|---|---|---|
| **ABCD** (above) | ~11,800 | up to 4 (baseline + 2yr + 4yr + 6yr) | sMRI/dMRI/fMRI | adolescents | massive phenotype | Gated (NDA) |
| **HBCD (HEALthy Brain & Child Development)** | ~7,500 planned | longitudinal infancy through ~10 yr | sMRI/dMRI/rs-fMRI (infant-adapted) | Healthy 0–10 yr | extensive | Gated (NDA) |
| **dHCP (developing Connectome)** | 783 infants / 887 datasets | Many imaged more than once (term + preterm, ~200 fetal) | sMRI, dMRI, fMRI | Neonatal/fetal | Demographics, neurodevel, genomics | Open (DUA) |
| **BCP (Baby Connectome Project)** | 500 | Yes (3 mo–5 yr) | sMRI/dMRI | Typical development | Behavior | Gated (NDA) |
| **ENIGMA-Lifespan** | ~50,000+ (federated, including children) | Subset | sMRI | Many disorders | Disorder-specific | Federated |
| **ABIDE-Longitudinal subsets** (above) | 38 | 2 | sMRI/rs-fMRI | Autism | phenotype | Open |
| **IBIS (Infant Brain Imaging Study)** | ~500 | 3 TP (6, 12, 24 mo) | sMRI | Autism risk siblings | Behavior, ADOS | Gated (NDAR) |
| **NIH-MRI-Study of Normal Brain Development** | ~500 | up to 3 TP | sMRI | typical | Behavior | Gated |
| **HCP-D** (above) | 1,300+ | longi subset | 3T sMRI/dMRI/fMRI/ASL | 5–21 yr | cognition | Open |

---

## 6. Multimodal / multi-organ / population

| Dataset | Patients | TP | Modality | Notes | Access |
|---|---|---|---|---|---|
| **UK Biobank** (above) | 100k imaged, 60k invited for repeat, ~20k with 2nd visit | 2 | brain MRI, cardiac MRI, abdominal MRI (Dixon/IDEAL), liver T2*, DXA, carotid US | full primary-care + hospital EHR, genotypes, exome + WGS, lab biomarkers | Gated (paid) |
| **German National Cohort (NAKO)** | 30,000 with MRI; ~205k overall | 2 (baseline + 5-yr re-imaging subset planned) | brain MRI, cardiac MRI, abdominal MRI, carotid US | Lifestyle, clinical, biospecimens | Gated (NAKO TAB) |
| **Generation R** | 9,778 children | Multiple (mom + child longi MRI in subsets) | sMRI | Dutch birth cohort | Rich phenotype | Gated |
| **Project Baseline (Verily)** | ~10,000 | Yes (annual visits up to 4 yr) | Cardiac MRI, calcium CT, retinal, wearables | Deep phenotype | Restricted (Verily/partners) |
| **All of Us** | 1M planned; ~430k consented for EHR + 100k+ with EHR & biospecimens; imaging via linked EHR | Linked-EHR images variable | DICOM linkage in development; primarily EHR/genomics | EHR, genomics, surveys | Gated (Researcher Workbench) |
| **NIH MIDRC** (above) | 130k+ studies | Subset | CT, CXR, MRI | COVID and broader | Open |
| **OpenMIND / OPENNEURO** | aggregated thousands of neuro studies | varies (many longi) | sMRI/dMRI/fMRI | many | mixed | Open (CC0 majority) |

---

## 7. Reports / EHR-paired longitudinal corpora

| Dataset | Patients | Imaging TP | Paired text/EHR | Access |
|---|---|---|---|---|
| **INSPECT (Stanford)** | 19,438 | CTPA studies with longi EHR linkage (5+ yr EHR coverage) | Radiology reports (sectioned) + structured EHR (demographics, dx, procedures, vitals); outcome labels (PE diagnosis, mortality, recurrence, bleed) | Gated (Redivis DUA, non-commercial) |
| **CT-RATE** (above) | 21,304 | mostly 1, ~3–4k with ≥2 | Full Turkish→English radiology reports + multi-label | Open CC-BY 4.0 (HF) |
| **MIMIC-CXR** | 65,000+ patients; 227,835 studies / 377,110 images; **26,625 patients with ≥2 visits** | 2–N — *flagged 2D* | Free-text radiology reports, MIMIC-IV EHR linkage available | Open (PhysioNet credentialed) |
| **PadChest** | 67,000 patients | many longi — *flagged 2D* | Spanish reports + DL-mined labels | Open (registration) |
| **CheXpert+** | 65,000 patients | longi — *flagged 2D* | Reports, AI labels | Open (registration) |
| **Open-i (Indiana CXR)** | 3,996 | mostly single — *flagged 2D* | reports | Open |
| **RadFusion** (precursor to INSPECT) | 1,837 | 1+ CTPA | EHR features | Open (Stanford AIMI) |
| **REFLACX, EyeGaze-CXR** | small | 2D | reports + eye-tracking | Open |
| **PMC-OA-Med / Radiopaedia-mined** | varies | varies | image–text pairs from case reports | Open |

---

## 8. Synthetic / generative-augmented options

| Resource | What it is | Use for FM pretraining |
|---|---|---|
| **BrLP (Brain Latent Progression)** | Diffusion model generating longitudinal brain MRI trajectories | Augment under-represented disease/age combos |
| **SynthRAD2023 / SynthRAD2025** | MR↔CT translation paired datasets (180+ paired) | Translation-based data augmentation |
| **GLIM / TumorGen / SegGen** | Tumor-aware generative pipelines | Synthesize realistic tumor evolution |
| **DiffuseRAW / MedDiff longi extensions** | Latent diffusion for 3D medical volumes | Domain-randomized pretraining |
| **TotalSegmentator / TotalSegmentatorv2 + simulation** | Anatomy-conditioned synthesis | Pseudo-labeling |
| **MAISI (NVIDIA Medical AI Synthetic Imaging)** | Open 3D CT diffusion generator | Synthesize body-CT volumes |
| **Eye OCT / Retina longi (e.g., AREDS)** | Real longitudinal but in 2D modality | If retinal added later |

Caveat: synthetic trajectories help with rare phenotypes/missing follow-ups but cannot substitute for real biological variation in pretraining at scale; best used to fill specific gaps (rare disease, balanced cohorts).

---

## 9. Practical recommendations by ambition tier

### Tier "5k patients with ≥3 3D scans of any modality"
- Easiest: **ADNI** (~3k with ≥3 MRI) + **OASIS-2/3** (~1.5k with ≥3) + **AIBL** (~2k with ≥3) → ~6–7k brain-MRI. Add **PPMI** (~1.5k) → ~8k.
- Chest only: **NLST** (~26k with 3 TP) — by itself satisfies tier.

### Tier "20k patients with ≥3 brain MRI"
- Achievable only via UK Biobank repeat (~20k by end-2025) **plus** ADNI/AIBL/OASIS-3/PPMI/NACC-SCAN/Rotterdam Study (collaboration). Total ~30k feasible by 2026.
- Caveat: UK Biobank repeat is only 2 TP; need to count ≥2 across many sources to fully reach 20k @ ≥3 TP.

### Tier "50k patients with ≥2 chest CT"
- **NLST** ~26k × 3 TP + **NELSON** ~7.9k × 4 TP + **COPDGene** ~10k × 2 TP + **MESA-Lung** ~3k × 2 TP + **SPIROMICS** ~3k → **~50k achievable**. Plus CT-RATE longi subset and TCIA NSCLC trial cohorts adds another ~3–5k.

### Best for treatment-response evaluation
- **ISPY1 + ISPY2** (breast NAC, 4 TP DCE-MRI + pCR + EFS) — *strongest open option*
- **LUMIERE + UPenn-GBM + MU-Glioma-Post + UCSD-PTGBM** (GBM RANO)
- **NSCLC-Cetuximab + ACRIN-6668 + S0819** (NSCLC response)
- **HEAD-NECK-CETUXIMAB + OPC-Radiomics + HNTSMRG24** (H&N RT response)
- **HCC-TACE-Seg + CRLM-CT** (liver response)
- **MAMA-MIA** (breast NAC aggregated)

### Best for survival/prognosis evaluation
- **NLST** (mortality, ~24% lung-cancer-specific reduction context)
- **TCGA-* TCIA-linked** cohorts (omics + survival)
- **UPenn-GBM, LUMIERE** (OS in GBM)
- **NSCLC-Radiogenomics** (OS + mutations)
- **INSPECT** (1-/3-/12-mo mortality, PE recurrence, bleed)
- **Yale-Brain-Mets-Longitudinal** (brain-met evolution + OS via clinical sub-collection)
- **MESA + Framingham** (cardiovascular outcomes over decades)
- **ADNI/AIBL/PPMI/NACC-SCAN** (conversion endpoints in neurodegeneration)

### Best for paired multimodal (image + reports + EHR + omics)
- **INSPECT** — best CT+EHR+reports+outcomes combo
- **UK Biobank** — best for image + genomics + dense EHR (gated/paid)
- **ADNI** — best for brain MRI + PET + CSF + plasma + genomics + cognition
- **MIMIC-CXR + MIMIC-IV** — best 2D X-ray + EHR longi
- **CT-RATE** — best open-license chest CT + reports
- **NACC-SCAN** — multi-ADRC harmonized imaging + UDS + neuropath at death
- **TCGA-* TCIA cohorts** — image + full multi-omics + survival (mostly cross-sectional imaging though)
- **All of Us** — emerging EHR-linked imaging (gated)

### Pretraining mix recommendation
A defensible pretraining union for a 3D longitudinal FM, in approximate descending priority for patient × TP coverage:

1. **NLST** (anchor chest-CT longi, ~26k × 3 TP, gated DUA but tractable)
2. **UK Biobank repeat** (~20k × 2 TP brain+cardiac+abdomen, gated/paid)
3. **ABCD** (~11k × 4 TP brain, gated NDA)
4. **NACC-SCAN + ADRC raw** (~5–10k × annual+, gated)
5. **COPDGene + NELSON + SPIROMICS + MESA-Lung** (~22k chest CT longi, gated)
6. **ADNI + AIBL + OASIS + PPMI + 4RTNI + Cam-CAN + Rotterdam** (~10k brain MRI longi, mostly DUA-open)
7. **CT-RATE** (~21k volumes, open) — pre-train with reports
8. **MIMIC-CXR** (~26k patients longi, 2D fallback for radiograph branch)
9. **Yale-Brain-Mets-Longitudinal + ISPY1/2 + UPenn-GBM + LUMIERE + Duke-Liver-MRI + NSCLC trial cohorts + HEAD-NECK trial cohorts** (~5–8k oncology longi with treatment & outcome labels, mostly open TCIA)
10. **HCP-D / HCP-A / dHCP / HBCD / IBIS** (lifespan brain longi, ~3–5k, gated mostly open)

Approximate union (after deduping by patient and accounting for modality overlap): **~80–120k unique patients with ≥2 3D scans**, with **~30–50k having ≥3 timepoints** and rich paired labels in ~20–30k of those.

---

## 10. Caveats / cross-cutting issues

- **Scanner heterogeneity**: ADNI/NLST/UK Biobank explicitly harmonize protocols, but most TCIA collections are clinical-acquisition heterogeneous. Plan domain-randomized augmentation or explicit site conditioning.
- **Missing follow-up bias**: dropouts in longitudinal cohorts correlate with disease severity/death; account in pretraining/evaluation (informative censoring).
- **DICOM vs NIfTI**: most TCIA is DICOM; major derived datasets ship NIfTI. Need consistent conversion + de-identification pipeline (HD-BET for brain, defacing for face).
- **Date shifting**: TCIA "Retain Longitudinal With Modified Dates" preserves intervals; do not break this when chaining datasets.
- **Modality coverage skew**: brain MRI longi heavily overrepresents Alzheimer's/healthy aging; chest CT longi heavily skews screening (healthy lungs); oncology longi small but label-rich.
- **License & redistribution**: TCIA collections are mostly CC-BY (re-distributable) but a few are CC-BY-NC; UK Biobank, NLST, NACC, NDA datasets are **not** redistributable — derived weights are usually OK if you don't release raw images.
- **Pediatric ethics**: ABCD, HBCD, dHCP, IBIS need NDA/IRB-level controls; pretraining mixing pediatric + adult may need separate models or careful handling of resolution/anatomy differences.
- **Modality conditioning**: PET and SPECT timepoints are sparser than MRI; if including, treat as optional auxiliary modality (per-token availability).
- **2D vs 3D**: MIMIC-CXR, PadChest, EMBED, PLCO-CXR, CheXpert are 2D only — useful for auxiliary heads / cross-modal contrastive but not for a 3D-volume backbone. Flagged throughout.
- **Cohort overlap**: BraTS draws cases from UPenn-GBM, UCSF-PDGM, MU-Glioma-Post, etc.; ensure de-duplication before pretraining.
- **Access timeline**: NLST/PLCO/COPDGene/MESA DUAs typically resolve in 4–12 weeks; UK Biobank in 8–16 weeks plus payment; ADNI/PPMI/OASIS/4RTNI a few days; NACC SCAN a few weeks; NDA studies (ABCD, HBCD) 4–8 weeks; INSPECT a few weeks via Redivis.

---

## Quick-reference index of dataset URLs

- ADNI: https://adni.loni.usc.edu/
- OASIS: https://sites.wustl.edu/oasisbrains/
- AIBL: https://aibl.org.au/
- PPMI: https://www.ppmi-info.org/
- ABCD: https://abcdstudy.org/
- HBCD: https://hbcdstudy.org/
- HCP (all variants): https://www.humanconnectome.org/
- dHCP: https://www.developingconnectome.org/
- Cam-CAN: https://cam-can.mrc-cbu.cam.ac.uk/
- NACC: https://naccdata.org/  SCAN: https://scan.naccdata.org/
- UK Biobank: https://www.ukbiobank.ac.uk/
- TCIA root: https://www.cancerimagingarchive.net/
- BraTS (Synapse): https://www.synapse.org/brats2024
- NLST (CDAS): https://cdas.cancer.gov/nlst/
- PLCO (CDAS): https://cdas.cancer.gov/plco/
- COPDGene: https://copdgene.org/
- MESA: https://mesa-nhlbi.org/  BioLINCC: https://biolincc.nhlbi.nih.gov/
- NELSON: https://umcgresearch.org/w/nelson-dataset
- INSPECT: https://som-shahlab.github.io/inspect-website/
- CT-RATE: https://huggingface.co/datasets/ibrahimhamamci/CT-RATE
- MIMIC-CXR: https://physionet.org/content/mimic-cxr/
- MIDRC: https://www.midrc.org/
- All of Us: https://allofus.nih.gov/  Researcher Workbench: https://workbench.researchallofus.org/
- LUMIERE: https://www.cancerimagingarchive.net/collection/lumiere/ (figshare mirror)
- Yale-Brain-Mets-Longitudinal: https://www.cancerimagingarchive.net/collection/yale-brain-mets-longitudinal/
- UPenn-GBM: https://www.cancerimagingarchive.net/collection/upenn-gbm/
- UCSF-PDGM: https://www.cancerimagingarchive.net/collection/ucsf-pdgm/
- ISPY1/ISPY2: https://www.cancerimagingarchive.net/collection/ispy1/  https://www.cancerimagingarchive.net/collection/ispy2/
- NSCLC-Cetuximab: https://www.cancerimagingarchive.net/collection/nsclc-cetuximab/
- RIDER Lung CT: https://www.cancerimagingarchive.net/collection/rider-lung-ct/

