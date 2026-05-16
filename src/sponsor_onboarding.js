import crypto from "node:crypto";

const RULE_IDS = ["onboarding_validation_rule_1", "onboarding_validation_rule_2", "onboarding_validation_rule_3", "onboarding_validation_rule_4", "onboarding_validation_rule_5"];
const PII_RE = /(email|employee[_-]?id|person[_-]?id|ssn|@)/i;
const BANNED_SIGNAL_RE = /(individual|person|employee|email|ssn|user[_-]?id)/i;

export function buildOnboardingRules() {
  return [
    { id: RULE_IDS[0], rule: "aggregation_minimum >= 5", check: (c) => (c?.evidence_source_spec?.aggregation_minimum ?? 0) >= 5, kind: "reject" },
    { id: RULE_IDS[1], rule: "client_namespace must exclude pii patterns", check: (c) => !PII_RE.test(String(c?.client_namespace ?? "")), kind: "reject" },
    { id: RULE_IDS[2], rule: "allowed_signal_types must exclude individual identifiers", check: (c) => !(c?.evidence_source_spec?.allowed_signal_types ?? []).some((x) => BANNED_SIGNAL_RE.test(String(x))), kind: "reject" },
    { id: RULE_IDS[3], rule: "provenance_format must be evidence_primitives_v1", check: (c) => c?.evidence_source_spec?.provenance_format === "evidence_primitives_v1", kind: "reject" },
    { id: RULE_IDS[4], rule: "allowed_signal_types should be non-empty", check: (c) => (c?.evidence_source_spec?.allowed_signal_types ?? []).length > 0, kind: "warn" },
  ];
}

function makeTraceId(config) {
  const seed = JSON.stringify(config, Object.keys(config || {}).sort());
  return crypto.createHash("sha256").update(seed).digest("hex").slice(0, 32);
}

// Fixed rule evaluation order: 1) aggregation 2) namespace PII 3) signal types 4) provenance format 5) coverage warning.
export function validateOnboardingConfig(config) {
  const rules = buildOnboardingRules();
  const requirements = [];
  const triggered = [];
  const warnings = [];
  let rejected = false;
  for (const r of rules) {
    const ok = !!r.check(config);
    requirements.push({ rule: r.rule, status: ok ? "met" : "pending", triggered_by: [r.id], derived_from: Object.keys(config || {}) });
    if (!ok) {
      triggered.push(r.id);
      if (r.kind === "reject") rejected = true;
      if (r.kind === "warn") warnings.push("low_coverage_risk");
    }
  }
  const status = rejected ? "rejected" : warnings.length ? "conditional" : "accepted";
  const coverage = warnings.length ? "low" : (config?.evidence_source_spec?.allowed_signal_types?.length || 0) >= 2 ? "high" : "medium";
  return {
    onboarding_status: status,
    trace_id: makeTraceId(config),
    client_namespace: String(config?.client_namespace ?? ""),
    epistemic_annotations: { evidence_coverage_expectation: coverage, ambiguity_notes: warnings[0] || "", epistemic_status: "hypothesis", derived_from: ["evidence_source_spec.allowed_signal_types"], triggered_by: triggered },
    requirements,
    next_steps: ["submit_evidence_inventory", "await_calibration_session"],
    derived_from: Object.keys(config || {}),
    triggered_by: triggered,
  };
}

export function validateOnboardingOutput(obj) {
  return !!(obj && ["accepted", "rejected", "conditional"].includes(obj.onboarding_status) && obj.trace_id && obj.epistemic_annotations?.epistemic_status === "hypothesis" && Array.isArray(obj.requirements) && Array.isArray(obj.next_steps) && Array.isArray(obj.derived_from) && Array.isArray(obj.triggered_by));
}
