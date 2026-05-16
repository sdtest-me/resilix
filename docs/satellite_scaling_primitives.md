# Satellite Scaling Primitives (Issue #12)

This document defines deterministic structural primitives for Resilix satellite vertical scaling.

## 1) Satellite Invariants

Required invariants for every satellite payload and render cycle:

- `triggered_by[]` MUST be present as an array (empty allowed).
- `derived_from[]` MUST be present as an array (empty allowed).
- `epistemic_status` MUST be explicit (for example: `verified`, `provisional`, `unknown`).
- Evidence provenance continuity MUST be preserved from input through rendered output.
- Namespace behavior MUST be isolating (`satellite_id`-scoped) and non-mutating.
- Audit metadata SHOULD include `generated_at`, `schema_version`, `producer`.
- Validation MUST remain additive and deterministic.

## 2) Satellite Variability Boundaries

Allowed to vary by satellite:

- Labels and wording.
- Signal category labels.
- Visual rendering hints and style.
- Roadmap text templates.

Explicitly prohibited:

- Divergent reasoning semantics.
- Hidden scoring logic.
- Vertical-specific truth systems.
- Any interpretive path that alters provenance chains.

## 3) Satellite Configuration Model

Minimum configuration contract:

- `satellite_id` (string)
- `display_name` (string)
- `enabled_modules` (array of strings)
- `allowed_signal_types` (array of strings)
- `labels` (optional object)
- `rendering_hints` (optional object)

All configuration objects remain additive (`additionalProperties: true`).

## 4) Provenance Continuity

Satellite outputs MUST preserve and surface:

- `derived_from`
- `triggered_by`
- calibration lineage references
- namespace isolation by `satellite_id`

No satellite may truncate provenance below what input supplied, except explicit depth-limit rejection.

## 5) Epistemic Constraints

Mandatory constraints:

- `interpretive_overlay` MUST be `true` for all Spiral outputs.
- Internal evidence handling is aggregate-only.
- No individual profiling.
- No hidden inference escalation.
- `provenance_depth_limit = 2`.
- Narrative fields may summarize existing evidence only and MUST NOT add new interpretations.

## 6) Failure Boundaries

Satellite behavior for invalid or unsupported states:

- Unsupported vertical behavior: reject with deterministic error.
- Invalid config: reject with deterministic schema validation failure.
- Missing provenance fields: normalize to empty arrays and tag status as `unknown` if needed.
- Unknown signal types: pass through unchanged under explicit passthrough field.

## 7) Determinism Validation Checklist

- Same input => same output.
- `vmeme: null` is valid and does not block rendering.
- Provenance continuity survives rendering.
- Unknown signal types pass through safely.
- `provenance_depth_limit = 2` is enforced in schema and template behavior.
