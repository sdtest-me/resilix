export function generateRoadmap(input) {
  const dependencyScore = input.dependencyScore || 0;
  const vMEME = input.vMEME_distribution || input.vMEME || {};
  const signals = input.signals || [];
  const signalIds = signals.map((s, i) => s.id || `signal_${i}`);
  const actions = [];

  if (dependencyScore >= 70) {
    actions.push({ title: "Reduce key-person dependency", timeline: "0–30", rationale: "High dependency concentration detected", impact: "high", owner: "COO", derived_from_signals: signalIds.slice(0, 1), derived_from_patterns: ["pattern:dependency_score_high"] });
  }
  if (signals.some((s) => s.type && s.type.match(/leadership|succession/i))) {
    actions.push({ title: "Document succession coverage", timeline: "31–60", rationale: "Leadership volatility signals present", impact: "high", owner: "HR", derived_from_signals: signalIds, derived_from_patterns: ["pattern:leadership_succession_risk"] });
  }

  const blue = vMEME.blue || 0;
  const orange = vMEME.orange || 0;
  if (Math.abs(blue - orange) > 0.3) {
    actions.push({ title: "Align governance with execution metrics", timeline: "31–60", rationale: "BLUE/ORANGE imbalance detected", impact: "medium", owner: "Strategy", derived_from_patterns: ["pattern:vmeme_imbalance_blue_orange"] });
  }
  if (Object.keys(vMEME).filter((k) => vMEME[k] > 0.2).length >= 4) {
    actions.push({ title: "Establish cross-functional sync ritual", timeline: "0–30", rationale: "Fragmented value-profile detected", impact: "medium", owner: "COO", derived_from_patterns: ["pattern:fragmented_vmeme_profile"] });
  }
  if (actions.length < 3) {
    actions.push({ title: "Schedule evidence review checkpoint", timeline: "61–90", rationale: "Minimum action set not met", impact: "low", owner: "Strategy", derived_from_patterns: ["pattern:fallback_minimum_actions_rule"] });
  }

  return actions.slice(0, 5).map((a) => ({ ...a, derived_from_signals: a.derived_from_signals || [], derived_from_patterns: a.derived_from_patterns || [] }));
}
