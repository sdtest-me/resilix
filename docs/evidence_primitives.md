# Evidence primitives usage guide
1. Create each signal with `id`, `type`, `source`, `weight`, `source_confidence`, and ISO-8601 `timestamp`.
2. Use `generateSignalId(signal)` to produce deterministic signal IDs.
3. Keep `type` and `source` aligned with known lists in `data/signal_types.json` and `data/source_types.json` when possible.
4. Additional signal fields are allowed to keep the model extensible.
5. Derived patterns and hypotheses must include provenance via `derived_from_signals` or `derived_from_patterns`.
6. `validateProvenance(obj)` enforces the required trace linkage.
7. Compute `inference_confidence = 0.7*signalWeight + 0.3*ruleTransparency`.
8. Compute `final_confidence = 0.6*inference_confidence + 0.4*source_reliability` where low=0.3, medium=0.6, high=0.9.
9. Both confidence outputs are clamped to `[0,1]` and rounded to 4 decimals for deterministic results.
10. Validate structures against `data/evidence_primitives.json` before ingestion.
