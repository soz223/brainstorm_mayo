---
geometry: "margin=1in"
fontsize: 11pt
---

\[MAYO CLINIC LETTERHEAD]

[Date]

NSF ACCESS Allocation Review
allocations.access-ci.org

**Re: Letter of Collaboration — ACCESS Allocation Request "TimeFM-3D: A Longitudinal 3D Medical Imaging Foundation Model" (PI: Lifang He, Lehigh University)**

To the ACCESS Allocations Review Panel:

I am writing on behalf of the Mayo Clinic [department TO INSERT — e.g., Department of Radiology / Department of Quantitative Health Sciences] to confirm our active collaboration with Dr. Lifang He's research group at Lehigh University on the work described in the accompanying ACCESS allocation request, *TimeFM-3D: A Longitudinal 3D Medical Imaging Foundation Model Across Modalities and Organs*. This collaboration has been ongoing since [date TO INSERT].

**Data and clinical governance.** Mayo Clinic provides the PHI-bearing institutional imaging data used in the on-premises portion of this project. All Mayo data are governed under Mayo's institutional data-governance policy, do not leave Mayo infrastructure, and are accessed only by personnel with active Mayo affiliate credentials. **No PHI is uploaded to ACCESS resources.** The work proposed on ACCESS uses only de-identified, public-DUA cohorts (NLST, ADNI, OASIS-3, AIBL, NACC, Yale-Brain-Mets, LUMIERE, Anti-PD-1, HNSCC), in compliance with the originating data-use agreements.

**On-premises resource confirmation.** Dr. He's group is granted access to a 20 × NVIDIA H200 GPU cluster at Mayo Clinic for the PHI-bound production-pretraining and clinical fine-tuning portions of TimeFM-3D. This cluster is dedicated to clinical workloads under Mayo's data-governance policy; the public-DUA pretraining, ablation, scaling-law studies, and reproducibility runs proposed for ACCESS are complementary and non-overlapping with the Mayo workload.

**Clinical co-investigation.** The Mayo co-investigators contribute clinical context per organ (radiology / oncology / informatics) — defining downstream tasks, validating evaluation endpoints, and reviewing the released artifacts for clinical plausibility before any external dissemination. We are particularly invested in the longitudinal modeling component because routine clinical practice in our subspecialties depends critically on prior-comparison reading, which the proposed model is the first foundation-scale system to address.

**Why ACCESS resources are required.** The Mayo cluster cannot — and by Mayo institutional policy must not — host the public-corpus ablation matrix, scaling-law study, or reproducibility re-run that the PI's funded research program requires. External collaborators and Lehigh graduate students outside the Mayo affiliate roster do not have access to the Mayo cluster; the released reproducibility artifact must also execute on infrastructure that the broader research community can inspect. ACCESS resources are necessary and non-substitutable for these three workloads, and our collaboration is contingent on their availability.

**Endorsement.** Dr. He and her CoPI, Songlin Zhao, are well prepared to execute this work responsibly. They authored the FSDP / MONAI / Apptainer software stack currently in production on the Mayo H200 cluster; the throughput and scaling-efficiency numbers cited in their Main Document were measured by Mr. Zhao on that hardware, not extrapolated. We have full confidence in their ability to use ACCESS resources effectively and to deliver the public artifacts described in the proposal.

We strongly support the allocation of ACCESS Accelerate resources to this project and look forward to the public release of the resulting foundation model, code, and curation pipeline.

Sincerely,

\[signature]

**[Name TO INSERT], M.D., Ph.D. (or Ph.D.)**
[Title TO INSERT — e.g., Associate Professor of Radiology, Director of Imaging Informatics]
Mayo Clinic
[Address — Mayo Clinic, 200 First Street SW, Rochester, MN 55905]
Email: [TO INSERT] · Phone: [TO INSERT]
