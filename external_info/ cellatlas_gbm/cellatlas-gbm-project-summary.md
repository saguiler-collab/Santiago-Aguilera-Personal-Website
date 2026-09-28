# CellAtlas GBM: Estimating a Brain Tumor's Cellular Makeup from Cheap Data, and Rigorously Testing Whether to Believe It

**Course project** · CMU summer computational biology program · Five-person team
**My focus:** benchmarking, validation, and quality control across the pipeline — donor-split integrity, held-out accuracy benchmarking, the frozen data contract, orthogonal (non-RNA) validation, and reference-free TME scoring
**Links:** Live site: [add URL] · Code: [GitHub org: saguiler-collab] · Slides: [add URL]

---

## Short version (for a project card)

Glioblastoma (GBM) is the most aggressive common malignant brain tumor. Knowing exactly what a tumor is made of — cancer cells vs. immune cells vs. blood vessels vs. normal brain tissue — normally requires expensive lab work. Our five-person team built a pipeline to estimate that composition from cheap, widely available bulk RNA sequencing instead, and then spent most of our effort rigorously testing whether the resulting numbers could actually be trusted. I led the validation side: benchmarking accuracy against known ground truth, auditing the data for hidden errors, and checking our RNA-based estimates against completely independent, non-RNA measurements.

---

## How the topic got here

The project didn't start as a deconvolution pipeline. It began as a broad research question about the tumor microenvironment (TME) — the "neighborhood" of stromal cells, immune cells, and blood vessels that surrounds a tumor and helps it resist chemotherapy. Early research covered cancer-associated fibroblasts, hypoxia, drug-efflux pumps, and how the TME actively shields tumors from treatment.

Over several checkpoints, the question narrowed: from "how does the TME drive drug resistance broadly" to a specific, answerable computational question focused on glioblastoma, using public data. We considered spatial graph analysis of tumor tissue and longitudinal tracking of tumor evolution under treatment, but scoped down to what was actually achievable: **estimating cell-type composition from bulk RNA-seq, and testing whether that composition relates to patient survival.** That narrowing — cutting an ambitious idea down to something we could rigorously execute and defend — was itself one of the harder and more valuable parts of the project.

## The problem

A tumor sample is never pure cancer. It's a mix of cancer cells, immune cells, blood-vessel cells, and normal brain tissue. **Bulk RNA-seq** measures the combined gene activity of all of them at once — like a smoothie: you can taste the blend, but you can't see the individual fruits that went in. Single-cell sequencing can see the individual fruits, but it's expensive and unavailable for most patients.

The question: **how much of that resolution can we recover from the cheap, blended data, and how do we know when to believe the answer?**

## The approach

We estimated the fraction of **seven cell types** in each primary tumor sample from **TCGA-GBM** (via cBioPortal's public RNA-seq data):

Tumor · Macrophage/Microglia · T cell · NK cell · B cell · Endothelial · Oligodendrocyte

The core model is one line of linear algebra: **S · x ≈ b**

- **b** is one patient's bulk expression profile (the smoothie).
- **S** is a signature matrix — the expression "fingerprint" of each pure cell type — built from GBmap, a public glioblastoma single-cell atlas.
- **x** is the recipe we solve for: the fraction of each cell type present, constrained to be non-negative (a tumor can't be −5% T cells).

We compared three ways of solving it: **NNLS** (non-negative least squares), **ν-SVR** (the algorithm CIBERSORT uses), and **BayesPrism** (a Bayesian method built for tumor deconvolution).

## The real story: what broke, and what we learned from it

The first results looked plausible on paper and were biologically wrong — a classic and instructive failure mode. Working out *why* became most of the project:

- **Reconstruction error is not validation.** NNLS is mathematically built to minimize it, so a low error can't tell you the answer is biologically correct — only that the solver did its job. We needed an independent yardstick, not just a better-fitting curve.
- **Scale matters more than the algorithm.** Solving on log-transformed values produced nonsense (immune cells near zero, myeloid cells below endothelial cells) because the underlying mixing model is linear and additive — `log(a+b) ≠ log(a)+log(b)`. Switching to linear counts-per-million fixed this immediately.
- **Not every gene should count equally.** A handful of generically high-expression genes (like housekeeping genes) were dominating the fit regardless of whether they actually distinguished cell types. We weighted each gene by how discriminative it was across cell types before solving.
- **A single donor can silently dominate a "population" signature.** One donor supplied 38% of all astrocyte cells in the reference atlas — a plain average would have mostly described that one person. We fixed this with rarefaction: sample one cell per donor per trial, repeat many times, and average across donors so no single patient dominates.
- **Tumor and glial programs overlap.** A single gene (GFAP) was responsible for a large share of the reconstruction error until we added Astrocyte as its own tracked category — kept clearly separate from the frozen seven-type primary result, since it wasn't part of the original biological contract.
- **The units question, unresolved and stated honestly:** a linear deconvolution model estimates *mRNA fraction*, not literal *cell fraction* — cell types carry very different amounts of RNA, so RNA-rich cells get systematically over-counted relative to their true numbers. We treated this as an open, documented limitation rather than a solved problem.

## What I built

My work sat across the parts of the project responsible for deciding whether any of the numbers above could be trusted.

**1. Donor-split integrity and held-out benchmarking**
Before anyone could trust an accuracy number, I had to prove the benchmark itself wasn't rigged. I built a **leakage test by mutation**: deliberately corrupt every held-out test donor's data, rebuild the reference signature, and confirm nothing changes. Rather than trusting a code comment that says "this only uses training donors," the test proves it structurally. I also built the accuracy scorer itself — MAE, RMSE, signed bias, Spearman/Pearson correlation, a specific check for the "structural zero" failure mode NNLS produces, false-positive detection on cell types that were truly absent, and bootstrap confidence intervals — validated against deliberately perfect, biased, noisy, and zero-inflated synthetic fixtures before trusting it on real predictions.

**2. Sample and barcode audit**
TCGA sample identifiers encode real biological information — which tissue site, which patient, whether the sample is a primary tumor, a recurrence, or normal tissue. I audited all samples in the cohort against these rules: correct format, correct sample type, no duplicate patients, and consistency across every file that named a sample. This closed a "gate" that several downstream analyses depended on.

**3. A frozen data contract, enforced in code**
The team fixed the output schema early: exactly seven cell types, non-negative, summing to 100 per patient. I built a **contract guard** that enforces this at the boundary of every analysis — it rejects an unexpected column (like an experimental eighth cell type) rather than silently dropping it, and it fails loudly rather than quietly repairing bad input. This is what let five people work in parallel on different questions without quietly drifting out of sync with each other's assumptions.

**4. Orthogonal validation against non-RNA measurements**
The most important check in the whole project: does our RNA-based estimate agree with a measurement that never touched RNA at all? I compared our inferred tumor fraction against **DNA-derived tumor purity** (from copy-number data) and our inferred immune fraction against **DNA methylation–derived leukocyte fraction** — two completely independent assay types. I used Spearman correlation (robust to outliers and nonlinearity) with bootstrap confidence intervals, correcting for multiple comparisons, and reported disagreement as a real finding rather than something to explain away.

**5. Reference-free TME scoring (current workstream)**
The latest phase of my work runs established, independent marker-based methods — **MCP-counter** and **ESTIMATE** — on the same bulk expression data, entirely independent of the deconvolution math. These methods can't solve the same problem (they give enrichment scores, not percentages), but they let us ask a sharper question: do independently curated immune and stromal marker sets rank patients in the same direction as our deconvolution result? Where they don't agree, that tells us specifically which parts of the composition estimate deserve less trust — in particular, the individual T-cell, NK-cell, and B-cell columns, which failed held-out validation and are reported as diagnostic only, not as confident biological claims.

## Results

- **Method comparison:** ν-SVR was the most reliable of the three deconvolution approaches we benchmarked, outperforming both NNLS (which drove many lymphocyte estimates to exactly zero) and BayesPrism.
- **Prognosis:** using ridge-penalized Cox survival models evaluated strictly out-of-fold, adding tumor composition features to a clinical baseline model changed the concordance index by **ΔUno-C = +0.001** — effectively no added predictive value. We reported and defended this as a genuine null result rather than searching for a more favorable cutoff or feature set.
- **The methodological headline** of the project, and the one I'm proudest of contributing to: we chose our primary method using pre-registered accuracy benchmarks on known-truth data, never by checking which choice made the survival results look better — and we kept the failed and null results in the final report rather than hiding them.

## Honest limitations

- Estimates are relative RNA-derived proportions, not literal cell counts, and are only as good as the reference they're built from.
- The pseudobulk benchmark's "ground truth" is a controlled mixture of real single cells — a good proxy, but not real tumor tissue, so benchmark accuracy isn't the same as real-tumor accuracy.
- Real patient tumors have no independent ground truth. The orthogonal assays we used are meaningful but imperfect proxies — they can support or challenge our estimates, but can't prove them outright.
- This is a research and educational project, not a diagnostic tool.

## Tech stack

**Analysis:** Python (pandas, NumPy, SciPy, scikit-learn), R (BayesPrism) · **Data:** TCGA-GBM (cBioPortal, GDC), GBmap single-cell atlas, DNA-based tumor purity estimates, methylation-derived leukocyte fractions · **Collaboration:** Git/GitLab across a five-person team, VS Code with Claude Code · **Website:** Next.js, React, TypeScript, Tailwind CSS, Three.js, deployed on Vercel

## What I took from it

The biggest lesson wasn't a specific algorithm — it was that a metric which is easy to optimize (like reconstruction error) is not the same thing as evidence of correctness. Real validation has to come from a measurement that could actually have proven us wrong. Freezing a schema and success criteria *before* looking at results, keeping the analysis chain traceable end to end, and being willing to report a well-supported null result as a legitimate finding — that discipline is directly the kind of thinking I want to carry into medicine, where the cost of believing a plausible-looking but unvalidated number is a lot higher than a lower grade on a project.

## How I worked

I used Claude as a coding and research assistant throughout — for building and testing validation code, working through the statistics, and stress-testing my own assumptions before committing to them. Every design decision and result above is one I can explain and defend myself.
