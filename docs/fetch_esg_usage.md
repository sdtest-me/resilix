# fetch_esg.py usage
1. Purpose: deterministic demo signal generation with provenance fields.
2. Demo command: `python3 scripts/fetch_esg.py --company "Acme Corp" --demo --output data/demo/acme.json`.
3. Real mode command: `python3 scripts/fetch_esg.py --company "Acme Corp" --output data/demo/acme_real.json`.
4. Determinism: company name is hashed; hash drives ids, timestamps, types, sources, and weights.
5. Offline-safe: `--demo` never uses network and always returns the same output for the same input.
6. Real mode is lightweight HTTP only; on failure it falls back to deterministic demo output.
7. Each signal includes `source` and `source_confidence` for provenance.
8. Script does not compute inference outputs; `dependencyScore` is set to `0.0` placeholder.
9. Validate output: `python3 scripts/validate_json.py data/demo/acme.json`.
10. Schema target: top-level demo structure + `data/evidence_primitives.json` signal primitives.
