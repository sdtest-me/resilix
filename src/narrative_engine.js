'use strict';

const SECTIONS = ['executive_summary'];
const PAIN_GAIN = {
  dependency_risk: ['Key-person concentration risk', 'Documented decision protocols reduce bus-factor exposure'],
  blue_orange_gap: ['Process rigidity slows execution', 'Align governance cadence with delivery metrics'],
  contradiction_density: ['Narrative-ops misalignment detected', 'Resolve top contradictions before scaling initiatives'],
  high_impact_action: ['Critical actions require executive sponsorship', 'Assign owner and timeline to high-impact items']
};

function asVMEME(v) {
  if (!v) return {};
  if (!Array.isArray(v)) return v;
  const out = {};
  v.forEach((s) => { if (s && s.stage) out[String(s.stage).toLowerCase()] = Number(s.score) || 0; });
  return out;
}

function confidence(signals, bonus) {
  const vals = (signals || []).map((s) => Number(s.weight) || 0);
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0.5;
  return Math.max(0, Math.min(1, Number((avg * 0.8 + bonus).toFixed(2))));
}

function buildRuleSet() {
  // Deterministic rule order: 1) dependency, 2) vMEME balance, 3) contradictions, 4) roadmap impact.
  return [
    {
      id: 'rule_dependency_gte_70',
      when: (e) => Number(e.dependencyScore) >= 70,
      run: (e) => ({ section: 'executive_summary', pain_point: PAIN_GAIN.dependency_risk[0], gain_statement: PAIN_GAIN.dependency_risk[1], evidence_basis: (e.signals || []).map((s) => s.id).filter(Boolean), confidence: confidence(e.signals, 0.2), triggered_by: ['rule_dependency_gte_70'] })
    },
    {
      id: 'rule_blue_gt_orange',
      when: (e) => { const m = asVMEME(e.vMEME_distribution || e.vMEME); return (m.blue || 0) >= (m.orange || 0) + 0.1; },
      run: (e) => ({ section: 'executive_summary', pain_point: PAIN_GAIN.blue_orange_gap[0], gain_statement: PAIN_GAIN.blue_orange_gap[1], evidence_basis: (e.signals || []).map((s) => s.id).filter(Boolean), confidence: confidence(e.signals, 0.15), triggered_by: ['rule_blue_gt_orange'] })
    },
    {
      id: 'rule_contradictions_gte_2',
      when: (e) => (e.contradictions || []).length >= 2,
      run: (e) => ({ section: 'executive_summary', pain_point: PAIN_GAIN.contradiction_density[0], gain_statement: PAIN_GAIN.contradiction_density[1], evidence_basis: (e.signals || []).map((s) => s.id).filter(Boolean), confidence: confidence(e.signals, 0.1), triggered_by: ['rule_contradictions_gte_2'] })
    },
    {
      id: 'rule_high_impact_roadmap',
      when: (e) => (e.roadmapActions || e.roadmap || []).some((a) => String(a.impact || '').toLowerCase() === 'high'),
      run: (e) => ({ section: 'executive_summary', pain_point: PAIN_GAIN.high_impact_action[0], gain_statement: PAIN_GAIN.high_impact_action[1], evidence_basis: (e.signals || []).map((s) => s.id).filter(Boolean), confidence: confidence(e.signals, 0.12), triggered_by: ['rule_high_impact_roadmap'] })
    }
  ];
}

function validateNarrative(obj) {
  return !!obj && SECTIONS.includes(obj.section) && Object.values(PAIN_GAIN).some(([p, g]) => obj.pain_point === p && obj.gain_statement === g) &&
    Array.isArray(obj.evidence_basis) && obj.evidence_basis.length > 0 && Array.isArray(obj.triggered_by) && obj.triggered_by.length > 0 &&
    typeof obj.confidence === 'number' && obj.confidence >= 0 && obj.confidence <= 1;
}

function generateNarrative(evidence) {
  const input = evidence || {};
  const alignment = input.alignment_annotations || input.alignment || null;
  const enriched = alignment ? { ...input, contradictions: input.contradictions || (alignment.alignment_details || []).filter((d) => d.contradicts && d.contradicts.length) } : input;
  return buildRuleSet().filter((r) => r.when(enriched)).map((r) => r.run(enriched)).filter(validateNarrative);
}

export { generateNarrative, buildRuleSet, validateNarrative, PAIN_GAIN, SECTIONS };
