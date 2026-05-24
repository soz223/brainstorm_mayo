# ACCESS Allocation — Form Answers + Submission Checklist (v0.3, R4)

> Fill these directly into the ACCESS request portal at allocations.access-ci.org.
> **Tier: Accelerate.** PI: **Lifang He** (Lehigh University). CoPI: **Songlin Zhao** (Lehigh).
> Source narrative PDF is [`main-document.md`](main-document.md) — convert to PDF before upload.

---

## ⚠️ MUST-FILL BEFORE SUBMISSION (6 blanks, Round 4 reviewer-flagged)

These are the only remaining placeholders. Document is otherwise submission-ready.

- [ ] **Supporting grant** in main-document.md §Research Objectives (line ~18):
      `Aim [N — TO INSERT]` · `NSF / NIH award number TO INSERT` · `"[title TO INSERT]"`
- [ ] **ACCESS credits** in main-document.md §Estimate of Compute (line ~38):
      Run the ACCESS Exchange Calculator on 89,000 H100-eq GPU-hr → fill the actual credit number. Confirm it lands in **[1.5 M, 3 M]** → Accelerate; if below 1.5 M, change tier to Discover and resubmit.
- [ ] **Mayo H200 cumulative GPU-hr usage** in main-document.md §Computational Plan (line ~66):
      `≈[USAGE TO INSERT] GPU-hr` since 2025-09 — the real cumulative number.
- [ ] **GitHub org** in main-document.md §Computational Plan (line ~66):
      `github.com/[org TO INSERT]/timefm3d-runtime`
- [ ] **PI rank** in main-document.md §Team and Team Preparedness (line ~76):
      `(Lehigh CSE, [rank TO CONFIRM])` → Assistant / Associate / Full Professor
- [ ] **Mayo collaborator letter** placeholders in [`mayo-collaborator-letter.md`](mayo-collaborator-letter.md):
      letterhead, date, department, collaboration start date, signer name + title + contact.

Optional (non-blocking):
- [ ] Add `[18]` inline citation to "Swin-3D" in main-document §Computational Plan.
- [ ] In references.md, verify items marked `[verify at submission time]` (BrainIAC, M3FM final DOI).

---

## Request Information

### Project Title
**TimeFM-3D: A Pan-Organ, Multi-Modality Longitudinal 3D Imaging Foundation Model for Disease Trajectory Modeling**

### Public Overview *(English, paste into portal)*

We are building **TimeFM-3D**, the first 3D medical imaging foundation model that natively ingests a per-patient sequence of CT, MRI, or PET volumes with irregular inter-scan intervals — addressing a gap left by every public 3D medical FM to date (CT-FM, BrainIAC, M3FM, Merlin, BiomedCLIP), all of which encode each volume independently and discard the temporal axis on which clinical practice depends. The model is self-supervised pretrained on ≈30,000 patients with ≥2 longitudinal scans drawn from established public cohorts (NLST, ADNI / OASIS-3 / AIBL / NACC, Yale-Brain-Mets / LUMIERE, Anti-PD-1, HNSCC) using three temporal SSL objectives, and evaluated head-to-head against Sybil, BrainIAC, CT-FM, and M3FM on seven longitudinal tasks including AD conversion, glioma progression, lung-cancer risk, RECIST response, and time-to-event mortality.

ACCESS GPU resources (primary: NCSA DeltaAI GH200; secondary: Purdue Anvil AI H100; tertiary: PSC Bridges-2 GPU-AI H100) will run the public-DUA ablation matrix, scaling-law study, full-corpus release pretrain, and reproducibility run that complement — and are non-substitutable with — the PHI-bound on-premises pipeline at Mayo Clinic. Software stack: PyTorch 2.x, FSDP, MONAI, torchio, ANTs, dcm2niix, HuggingFace `transformers`, Apptainer (two ISA-specific images sharing one Dockerfile), Slurm, Weights & Biases. All artifacts (pretrained weights, code, manifest schema, curation scripts) will be released under BSD-3 / open licenses, consistent with NSF public-access policy.

### Keywords
medical imaging, foundation model, self-supervised learning, longitudinal modeling, 3D CT, 3D MRI, PET, transformer, vision transformer, deep learning, distributed training, computational radiology

### How do you plan to use this project?
- [x] **Research (non-dissertation)** — primary
- [x] **Dissertation or Thesis** — secondary (the CoPI's doctoral research)

### Opportunity Questions
- [x] Machine learning
- [x] Software development
- [ ] Rapid response

### How did you hear about ACCESS?
*(Fill in your actual channel: campus research-computing facilitator, Mayo collaborator, NSF ACCESS website, etc.)*

### Fields of Science
- **Primary**: Computer and Information Sciences and Engineering → **Machine Learning** (CISE / IIS)
- **Secondary**: Biological Sciences → **Biomedical Imaging** (also flag as Health / Clinical Medicine if the form allows)

---

## Related Personnel

### PI
- **He, Lifang** — Lehigh University — **PI**

### CoPIs / Allocation Managers
- **Zhao, Songlin** — Lehigh University — **CoPI** (Ph.D. candidate, advised by L. He)
- [Optional: a Mayo Clinic clinical co-investigator as additional CoPI, depending on whether they want to be on the ACCESS request itself]
- [Optional: Lab Allocation Manager — add via ACCESS ID search]

### Other Collaborators *(for COI screening — not on the ACCESS request)*
- Mayo Clinic clinical co-investigators (radiology / oncology / informatics) — names TO FILL
- NLST / ADNI / OASIS data-use coordinators (if applicable)

---

## Supporting Grants

**Does this request include supporting grants?**
- If yes: list the NSF / NIH award number(s) and verify the answer to the "Aim [N]" / "title" blanks in main-document.md aligns.
- If no: NSF allows exactly one project per researcher without an NSF supporting grant; verify this is your only such project.

---

## Documents to upload (all PDFs)

Each row maps a portal **Type** dropdown choice → a source `.md` in this folder.

| Portal "Type" | Source | Page limit | Notes |
|---|---|---|---|
| **Main Document** *(required)* | [`main-document.md`](main-document.md) | 3 | round-4 reviewer-passed |
| **PI CV or resume** *(required)* | *PI provides own PDF* | 3 | Lifang He |
| **CoPI CV or resume** *(required)* | *CoPI provides own PDF* | 3 | Songlin Zhao |
| **References** | [`references.md`](references.md) | — | aligned with main-doc [1]–[8] + [30] |
| **Other** *(Mayo collaborator letter)* | [`mayo-collaborator-letter.md`](mayo-collaborator-letter.md) | — | recommended, optional |

Skip these (not applicable for a new request):
- **Progress Report** — only for renewals
- **Addressing Reviewer Comments** — only for resubmissions after a prior review

### Convert markdown → PDF
```bash
cd access_application
for f in main-document references mayo-collaborator-letter; do
  pandoc "$f.md" -o "$f.pdf" --pdf-engine=xelatex \
    -V geometry:margin=1in -V fontsize=11pt -V mainfont="Times New Roman"
done
```

### Render Mermaid figures (optional; main-doc currently does not embed figures)
```bash
cd access_application
npx -y @mermaid-js/mermaid-cli -i figures/workflow.mmd     -o figures/workflow.png
npx -y @mermaid-js/mermaid-cli -i figures/architecture.mmd -o figures/architecture.png
```

---

## Tier choice

ACCESS allocation tiers (verified against allocations.access-ci.org/project-types):

| Tier | Credit cap | Main Doc | Review | Cadence |
|---|---|---|---|---|
| Explore | 400 K | abstract | eligibility | rolling |
| Discover | 1.5 M | 1 page | eligibility + suitability | rolling |
| **Accelerate** | **3 M** | **3 pages** | **panel merit review** | **rolling** |
| Maximize | uncapped | 10 pages | full panel | Dec 15 – Jan 31 window |

**TimeFM-3D targets Accelerate**: 89,000 H100-eq GPU-hr is too large for Discover (1.5 M cap), and we do not need the Maximize 5-page code-performance volume because scaling efficiency is documented inline. Confirm the credit number lands in [1.5 M, 3 M] via the Exchange Calculator before submission.
