# Inference Validity & Explainability Review (Enterprise Trust Lens)
Date: 2026-05-15
Scope: repository artifacts for Resilix preview/demo

## Executive Summary
Resilix’s **commercial story is clear**, but its current implementation blends factual signals, interpretive assumptions, and psychologically loaded stage mappings in a way that can appear non-auditable to enterprise buyers. The largest trust risk is not model quality; it is **epistemic boundary blur**: the UI and output present specific probabilities/accuracy (e.g., 72%, 94%) without visible calibration evidence, uncertainty decomposition, or a reproducible evidence chain.

---

## 1) Where the system may overclaim certainty

### A. Numeric precision without calibration context
- Demo output states: “72% probability of supply chain disruption” as a scenario-level claim, but no uncertainty interval, cohort baseline, or validation protocol is shown.
- CTA states “accuracy increases to 94%” after internal data integration, again without sample size, definition of “accuracy,” task framing (classification vs ranking), or out-of-sample protocol.

**Enterprise impact:** Appears like fabricated precision, triggering model risk/compliance concerns.

### B. Confidence logic is structurally weak
- `src/explainability.js` sets confidence from **signal count only** (`>5 = high`), independent of source reliability, recency, contradiction, or missingness.

**Enterprise impact:** Confidence can be high on poor-quality evidence and low on strong but sparse evidence.

### C. “Observed” inference gate is overly permissive
- Inference type is “observed” when every signal is marked `verified`, regardless of whether the final score requires multi-step interpretation.

**Enterprise impact:** Conflates verified raw facts with interpreted outputs; weak defensibility under audit.

---

## 2) Outputs hardest to defend epistemically

1. **Counterfactual disruption probability** (“If director leaves, 72% disruption in 90 days”).
   - Hardest to defend absent causal model assumptions, historical benchmark class, and failure-mode decomposition.
2. **vMEME stage distributions by org segment** (e.g., “HQ Yellow/Green, Ops Blue/Orange”).
   - Psychologically interpretive and potentially viewed as non-falsifiable unless tied to explicit coding rubric and inter-rater reliability.
3. **Global “94% accuracy” commercialization claim.**
   - High legal/procurement risk without documented metric card and validation dataset lineage.
4. **ROI headline (“80x+”)** without assumptions ledger.
   - Viewed as sales-forward and non-auditable without transparent economics model.

---

## 3) Separation quality across epistemic layers

Current design partially names layers but does not enforce them in schema or UI.

### Observable signals
- Mentioned conceptually (“public ESG signals & job-market data”), but signal objects, extraction methods, timestamps, and source snippets are not exposed in outputs.

### Interpretation layers
- `valueGapScore` and scenario text are presented as final outputs with no intermediate feature/logic disclosure.

### Organizational hypotheses
- Risk scenario is hypothesis-like, but rendered as near-fact due to numeric precision language and lack of confidence bands.

### vMEME mappings
- Presented as direct mapped outputs in primary UI, not as optional interpretation overlay.

**Assessment:** Separation exists as narrative intent but **not as enforceable data contract + explainability UX pattern**.

---

## 4) Risks for enterprise perception (opaque / speculative / non-auditable)

### Opaque
- No drill-down from score → drivers → source evidence lines.
- No versioned method card in outputs.

### Psychologically speculative
- Spiral Dynamics framing is first-class in hero-level narrative; may read as psychometric typing rather than organizational signal analysis.
- Stage labels can be interpreted as personality judgments if not constrained to observable behavioral/operational markers.

### Non-auditable
- Schema allows only minimal explainability (`sources[]` string list) and lacks provenance fields (source hash, extraction timestamp, parser version, analyst/model version).
- No explicit record of “unknown/insufficient evidence” pathways.

---

## 5) Concrete improvements (enterprise-defensibility first)

## A) Confidence architecture
1. Replace count-based confidence with multi-factor confidence vector:
   - Evidence quality (source authority, recency, corroboration)
   - Coverage completeness (required signals present?)
   - Contradiction pressure (internal evidence conflict)
   - Model applicability (domain/sector match)
2. Publish confidence as:
   - `confidence_level` (low/med/high)
   - `confidence_score` (0-1)
   - `confidence_reasons[]` (top drivers)
   - `uncertainty_type` (aleatoric/epistemic/structural)

## B) Evidence traceability
1. Add per-claim trace blocks:
   - claim_id
   - supporting_signals[] with source URI, snippet, extraction timestamp, parser version
   - contradicting_signals[]
   - adjudication note
2. Require every top-level metric to include `why_this_value` text + machine-readable driver weights.

## C) Signal provenance
1. Introduce immutable provenance fields:
   - `source_id`, `source_uri`, `source_sha256`, `retrieved_at`, `extracted_at`
   - `extraction_method` (manual, regex, LLM classifier, etc.)
   - `method_version`, `prompt_version` (if LLM-assisted)
2. Add freshness policy and stale-data warnings in UI.

## D) Explainability UX
1. Progressive disclosure:
   - Layer 1: Executive headline + uncertainty badge.
   - Layer 2: “Why?” panel with top 3 evidence-backed drivers.
   - Layer 3: Full audit trail table (export CSV/JSON).
2. Make vMEME overlay optional (advanced tab), not default explanation backbone.
3. Add explicit labels:
   - “Observed signal”
   - “Derived indicator”
   - “Hypothesis / scenario”

## E) Calibration transparency
1. Replace “94% accuracy” with metric card:
   - target variable definition
   - metric type (AUC/F1/calibration error/etc.)
   - validation protocol
   - cohort size and sector mix
   - date range + drift notes
2. Show confidence intervals and failure cases (“known blind spots”).
3. Add “No-claim mode” when evidence thresholds are not met (graceful abstention).

---

## Suggested near-term implementation deltas

### Schema
- Expand `data/schema.json` with:
  - `claimType` enum: observed|derived|hypothesis
  - `confidenceScore` number
  - `confidenceReasons[]`
  - `evidence[]` objects (uri, snippet, retrievedAt, methodVersion)
  - `calibration` object (metric, cohortN, interval, lastValidatedAt)

### Explainability module
- Refactor `src/explainability.js`:
  - remove signal-count heuristic as primary logic
  - compute confidence from weighted evidence quality inputs
  - return per-claim explanation artifacts

### UI copy / trust language
- Downgrade deterministic language:
  - “72% probability” → “risk estimate band: medium-high (55–75%), contingent on current evidence quality”
  - “94% accuracy” → “calibrated performance on validated cohorts (see method card)”

---

## Bottom line
For enterprise adoption, Resilix should prioritize **epistemic governance over stronger modeling claims**. The winning posture is: 
- transparent evidence chain,
- explicit uncertainty,
- strict separation of observation vs interpretation,
- optional interpretive ontology.

That shift materially improves procurement confidence, auditability, and defensibility in board-level settings.
