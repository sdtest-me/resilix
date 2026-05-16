import { performance } from "node:perf_hooks";
import { validateOnboardingConfig, validateOnboardingOutput } from "../src/sponsor_onboarding.js";

const assert = (c, m) => { if (!c) throw new Error(m); };
const base = { client_id: "11111111-1111-1111-1111-111111111111", client_namespace: "demo_namespace", evidence_source_spec: { aggregation_minimum: 5, allowed_signal_types: ["leadership_change"], provenance_format: "evidence_primitives_v1" }, reviewer_role: "reviewer", retention_policy: "30d" };

const ok = validateOnboardingConfig(base);
assert(ok.onboarding_status === "accepted" && ok.trace_id && validateOnboardingOutput(ok), "valid config should be accepted + trace");

const lowAgg = validateOnboardingConfig({ ...base, evidence_source_spec: { ...base.evidence_source_spec, aggregation_minimum: 2, allowed_signal_types: [] } });
assert(lowAgg.onboarding_status === "rejected", "aggregation_minimum < 5 should reject");
assert(lowAgg.epistemic_annotations.ambiguity_notes === "low_coverage_risk", "should include warning note");

const pii = validateOnboardingConfig({ ...base, client_namespace: "alice@example.com" });
assert(pii.onboarding_status === "rejected", "PII namespace should reject");

for (const r of [ok, lowAgg, pii]) {
  assert(Array.isArray(r.derived_from) && Array.isArray(r.triggered_by), "decision must include trace fields");
  assert(r.requirements.every((x) => Array.isArray(x.derived_from) && Array.isArray(x.triggered_by)), "requirements trace fields required");
}

const t0 = performance.now();
for (let i = 0; i < 3000; i += 1) validateOnboardingConfig(base);
assert(performance.now() - t0 < 100, "runtime must be <100ms");
console.log("✅ All sponsor_onboarding tests passed");
