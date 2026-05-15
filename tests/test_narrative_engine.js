'use strict';
import assert from 'assert';
import { generateNarrative, validateNarrative, PAIN_GAIN, SECTIONS } from '../src/narrative_engine.js';

const input = {
  dependencyScore: 72,
  vMEME_distribution: { blue: 0.45, orange: 0.3 },
  signals: [
    { id: 's1', type: 'leadership_turnover', source: 'news', weight: 0.8, source_confidence: 'high', timestamp: '2026-05-14T00:00:00Z' },
    { id: 's2', type: 'esg_narrative', source: 'esg_report', weight: 0.4, source_confidence: 'medium', timestamp: '2026-05-14T00:00:00Z' }
  ],
  contradictions: [{ between: ['ops', 'hq'], severity: 'high' }, { between: ['kpi', 'process'], severity: 'medium' }],
  roadmapActions: [{ title: 'Protocol map', timeline: '30d', rationale: 'handover', impact: 'high', owner: 'COO', triggered_by: ['rule_dependency_gte_70'] }]
};

const outA = generateNarrative(input);
const outB = generateNarrative(input);
assert.deepStrictEqual(outA, outB, 'same input should produce same output');
assert.ok(outA.length >= 1, 'at least one narrative should be produced');
outA.forEach((o) => {
  assert.ok(validateNarrative(o), 'every narrative must be valid');
  assert.ok(o.evidence_basis.length > 0 && o.triggered_by.length > 0, 'trace fields required');
  assert.ok(SECTIONS.includes(o.section), 'section enum check');
  assert.ok(Object.values(PAIN_GAIN).some(([p, g]) => o.pain_point === p && o.gain_statement === g), 'pain/gain enum check');
});

const t0 = Date.now();
for (let i = 0; i < 500; i += 1) generateNarrative(input);
assert.ok(Date.now() - t0 < 100, 'runtime should be <100ms for typical input');

console.log('✅ All narrative_engine tests passed');
