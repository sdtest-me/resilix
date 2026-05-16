# Sponsor Onboarding Contract
Input config requires `client_id`, `client_namespace`, `evidence_source_spec`, `reviewer_role`, and `retention_policy`.
Example config: `{ "client_id":"uuid", "client_namespace":"demo", "evidence_source_spec":{"aggregation_minimum":5,"allowed_signal_types":["leadership_change"],"provenance_format":"evidence_primitives_v1"}, "reviewer_role":"governance_reviewer", "retention_policy":"30d" }`.
Aggregate-only is mandatory: reject when `aggregation_minimum < 5` or any individual-level identifiers are allowed.
Namespace isolation is mandatory: reject namespaces containing PII patterns like `email` or `employee_id`.
Provenance format must be `evidence_primitives_v1`.
Acknowledgment returns `onboarding_status`, deterministic `trace_id`, `requirements`, and `next_steps`.
Epistemic annotations include `evidence_coverage_expectation`, optional `ambiguity_notes`, and fixed `epistemic_status: hypothesis`.
Every decision carries `derived_from` and `triggered_by` trace fields.
Example acknowledgment: `{ "onboarding_status":"accepted", "trace_id":"...", "client_namespace":"demo", "epistemic_annotations":{"evidence_coverage_expectation":"medium","epistemic_status":"hypothesis"}, "requirements":[...], "next_steps":["submit_evidence_inventory","await_calibration_session"] }`.
