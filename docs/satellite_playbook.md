# Resilix Satellite Governance & Operational Playbook

## A) Satellite Purpose Boundary
Satellites are structural adaptations of Resilix for different domains (for example: HR, Gov, Finance).

They are **not**:
- new intelligence systems
- organizational truth engines
- predictive layers

Operating rule: satellites may adapt structure, labels, and presentation while preserving core behavioral constraints.

## B) Invariant Contracts
The following contracts are mandatory for every satellite and must remain identical to core Resilix behavior.

### Provenance and derivation integrity
- Required provenance fields must be present on all outputs.
- `triggered_by[]` and `derived_from[]` chains must be preserved.
- `provenance_depth_limit = 2` is fixed and must not be exceeded.

### Epistemic and interpretive constraints
- `epistemic_status` annotations are required.
- Semantics must remain aggregate-only.
- `interpretive_overlay: true` is required for all Spiral outputs.
- Spiral remains optional; `vmeme: null` must remain valid.

### Namespace isolation
- Satellite namespaces must be isolated from one another.
- Cross-satellite inheritance of semantic meaning is prohibited unless explicitly mapped and provenance-safe.
- No hidden cross-namespace coupling.

## C) Allowed Variability
The following may vary by satellite:
- labels and display language
- rendering style and visual structure
- signal category names
- roadmap wording
- domain-specific terminology

The following are explicitly prohibited:
- divergent reasoning semantics
- hidden scoring logic
- vertical-specific ontology hardening

## D) Governance Review Checklist
Use this lightweight checklist before promoting any satellite state.

- [ ] Provenance continuity verified end-to-end.
- [ ] Namespace isolation enforced.
- [ ] Aggregate-only constraint validated (`n >= 5`).
- [ ] Zero individual profiling semantics in outputs.
- [ ] Deterministic output behavior confirmed.
- [ ] Spiral optionality verified (`vmeme: null` supported).
- [ ] Ambiguity and coverage annotations present.

## E) Prohibited Satellite Patterns
The following patterns are not allowed:
- employee ranking or scoring systems
- covert monitoring semantics
- predictive workforce claims
- psychological diagnosis framing
- autonomous decision narratives
- inference-from-inference escalation (`depth > 2`)
- use of outputs as sole basis for disciplinary, restructuring, or workforce-reduction decisions

## F) Pilot Safety Constraints
- Outputs are advisory hypotheses only.
- Human review remains mandatory.
- The system must not replace organizational due process.
- Harm boundary: no output may be framed or used as deterministic evidence for punitive action against individuals or groups.

## G) Operational Lifecycle
Satellites use lightweight status markers only:
- `experimental`
- `candidate`
- `stable`
- `archived`

Transition logic must remain minimal, explicit, and audit-visible.

## H) Failure Conditions
Any of the following triggers operational failure status:
- invalid or missing provenance
- namespace contamination
- unsupported signal types
- ontology drift indicators
- ambiguity escalation beyond annotated bounds
- stale calibration states

## Validation Notes
All satellite examples and outputs must satisfy:
- aggregate-only semantics (no individual-level interpretation)
- explicit provenance continuity
- Spiral as optional interpretive overlay
- explicit prohibition of punitive organizational usage
