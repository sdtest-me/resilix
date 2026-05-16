# Evidence Alignment Usage
1. Import `computeAlignment` from `src/evidence_alignment.js`.
2. Pass `evidence` as an array (or `{signals:[...]}`) matching `evidence_primitives.json`.
3. Pass `context` with `client_namespace`, `calibration_session_id`, and optional constraints.
4. `computeAlignment(evidence, context)` returns annotations only; it does not mutate evidence.
5. `alignment_summary` reports coverage, contradiction density, and coherence.
6. `alignment_details` lists per-signal alignments, contradictions, and coverage contribution.
7. `resolution_suggestions` returns deterministic next actions with rationale.
8. Every detail/suggestion includes `derived_from` and `triggered_by` trace fields.
9. Example: `const a=computeAlignment(input,{client_namespace:'acme',calibration_session_id:'run-1'})`.
10. Alignment means signal consistency resolution and coverage assessment, not accuracy or truth optimization.
