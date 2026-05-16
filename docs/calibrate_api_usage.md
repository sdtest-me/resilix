# Calibrate API Usage
POST `/api/calibrate` accepts normalized internal evidence for deterministic ingestion.
Request JSON must include `calibration_session_id`, `client_namespace`, `evidence_inventory[]`, and `reviewer_context`.
Example request: `{"calibration_session_id":"test","client_namespace":"demo","evidence_inventory":[{"id":"sig-1","type":"metric","source":"internal","aggregation_count":8}],"reviewer_context":{"role":"reviewer","timestamp":"2026-01-01T00:00:00Z"}}`.
Example response: `{"status":"accepted","trace_id":"<uuid-v5>","provenance_chain":["..."],"aggregation_status":"pending","metadata":{"client_namespace":"demo"}}`.
Each evidence item is tagged with `ingested_at`, `source_confidence:"low"`, `derived_from:[original_signal_id]`, and `client_namespace`.
Namespace isolation guarantee: data is queued and traced per `client_namespace` with no cross-tenant provenance reuse.
Aggregate-only rule: individual identifiers are rejected and `aggregation_count` must be `>= 5`.
When downstream is unavailable, payload is queued and returned with `aggregation_status:"pending"`.
This endpoint is transport + provenance only; it performs no inference, scoring, or truth recalculation.
