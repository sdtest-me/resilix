# Sponsor Lab Calibration Object Model

## Scope and Intent

This object model defines deterministic calibration metadata for Sponsor Lab governance workflows. Calibration is restricted to evidence-context refinement, provenance continuity, and audit traceability. It does not establish organizational truth, predictive claims, individual employee assessments, or hidden monitoring behavior.

## Design Principles

1. **Deterministic and auditable:** each calibration action is traceable through immutable provenance references.
2. **Aggregate-only:** internal calibration signals are valid only at cohort/organizational level and require minimum aggregation thresholds.
3. **Namespace isolation:** all calibration artifacts are tenant-scoped and cannot inherit provenance across client namespaces.
4. **Minimal schema hardening:** fields are constrained where necessary for governance while preserving extensibility with `additionalProperties: true`.

## Calibration Session

A calibration session is the top-level audit unit.

Required fields:

- `calibration_session_id`: stable unique identifier for the calibration event.
- `client_namespace`: tenant boundary key used for strict isolation.
- `timestamp`: RFC 3339 UTC timestamp for session creation.
- `evidence_inventory`: structured references to evidence inputs used in calibration.
- `provenance_chain`: immutable references to upstream evidence and prior calibrations.
- `reviewer_context`: role-scoped, non-personal context for why the calibration was initiated.

Operational notes:

- `reviewer_context` must describe function/role or workflow trigger, not an employee profile.
- session identifiers should remain stable across audit replays.

## Evidence Attachment Semantics

### Attachment model

Internal evidence may attach to external evidence only through explicit linkage entries:

- `internal_evidence_refs[]`
- `external_evidence_refs[]`
- `attachments[]` where each attachment declares:
  - `internal_ref`
  - `external_ref`
  - `derived_from[]`
  - `triggered_by[]`

### Inheritance rules

1. every attachment must inherit all upstream provenance IDs from both linked artifacts.
2. inherited references are append-only; prior lineage cannot be removed.
3. attachment metadata must include `client_namespace` and must match session namespace.

### Attachment boundaries

- attachment cannot cross `client_namespace`.
- attachment cannot introduce sources not listed in `evidence_inventory`.
- attachment cannot transform evidence into person-level claims.

### Aggregation requirement

- internal signals require `aggregation_count >= 5` before inclusion in calibration attachments.
- records below threshold must be marked `excluded_reason: "insufficient_aggregation"`.

### Evidence lineage rules

- each attachment must record lineage edges in `derived_from` and `triggered_by`.
- lineage must be continuous from source evidence to calibrated output references.

## Client Namespace Isolation

- each calibration object is owned by one `client_namespace`.
- reads/writes are tenant-constrained; no shared mutable provenance state across tenants.
- provenance inheritance is valid only when ancestor and descendant namespace values are identical.
- retention and deletion policies are evaluated per namespace, including expiration and legal hold metadata.

## Provenance Inheritance

- `derived_from`: declares direct evidence and prior calibration parents.
- `triggered_by`: records the operational trigger (policy event, review milestone, or contradiction event).
- lineage continuity: child calibration entries must include references to immediate parents and inherited roots.
- audit trace continuity: provenance references should remain immutable after record finalization; supersession creates a new versioned record instead of mutation.

## Calibration Constraints (Explicit Prohibitions)

Calibration artifacts must not include:

- individual employee scoring or ranking.
- covert monitoring semantics.
- psychological diagnosis or inferred mental-state labeling.
- predictive behavioral claims.
- hidden inference escalation from aggregate signals to person-level conclusions.

## Confidence and Alignment Semantics

Allowed language and fields:

- `evidence_alignment`: `aligned | mixed | contradictory`
- `contradiction_resolution`: textual explanation of deterministic reconciliation steps.
- `evidence_coverage`: `low | medium | high`
- `ambiguity_reduction`: `none | partial | substantial`

Disallowed language:

- accuracy amplification
- predictive precision
- truth optimization
- intelligence amplification

## Audit Requirements

Minimum metadata fields per calibration record:

- `calibration_session_id`
- `client_namespace`
- `timestamp`
- `version`
- `status`
- `evidence_inventory`
- `provenance_chain`
- `lineage_hash` (or equivalent immutable digest reference)
- `retention_policy`
- `expires_at` (nullable where policy permits)

Audit controls:

- immutable provenance references after finalization.
- explicit calibration review trace entries with reviewer role context and decision timestamp.
- evidence expiration semantics must preserve auditability (expiration of payload content must not break reference continuity).
- version lineage must capture supersedes/superseded_by relationships.

## Failure and Limitation States

Required failure-state flags:

- `low_evidence_coverage`
- `conflicting_evidence`
- `sparse_calibration`
- `stale_evidence`
- `namespace_contamination_risk`

Handling expectations:

- failure states downgrade calibration completeness and require explicit reviewer acknowledgment.
- namespace contamination risk requires immediate quarantine of affected calibration output until namespace integrity is verified.

## Minimal Aggregate-Only Example

```json
{
  "calibration_session_id": "cal-2026-05-16-001",
  "client_namespace": "client/acme",
  "timestamp": "2026-05-16T10:00:00Z",
  "evidence_inventory": {
    "internal_evidence_refs": ["int-ops-001", "int-ops-002"],
    "external_evidence_refs": ["ext-report-2026-q1"]
  },
  "provenance_chain": ["ext-report-2026-q1", "prior-cal-2026-04-30-003"],
  "reviewer_context": {
    "reviewer_role": "governance_reviewer",
    "trigger": "quarterly_calibration_review"
  },
  "attachments": [
    {
      "internal_ref": "int-ops-001",
      "external_ref": "ext-report-2026-q1",
      "aggregation_count": 12,
      "derived_from": ["int-ops-001", "ext-report-2026-q1"],
      "triggered_by": ["quarterly_calibration_review"]
    }
  ],
  "calibration_assessment": {
    "evidence_alignment": "mixed",
    "contradiction_resolution": "Documented deterministic precedence: external filing date outranks draft memo.",
    "evidence_coverage": "medium",
    "ambiguity_reduction": "partial"
  }
}
```

This example is aggregate-only and intentionally excludes individual-level semantics.
