import assert from 'node:assert/strict';
import { generateRoadmap } from '../src/roadmap_generator.js';

const validTimelines = new Set(['0–30', '31–60', '61–90']);
const validOwners = new Set(['COO', 'HR', 'Strategy']);

const sampleInput = {
  dependencyScore: 82,
  vMEME_distribution: {
    blue: 0.45,
    orange: 0.1,
    green: 0.2,
    red: 0.16,
    yellow: 0.18
  },
  signals: [
    { id: 's1', type: 'leadership_turnover', weight: 0.9 },
    { id: 's2', type: 'succession_gap', weight: 0.8 },
    { id: 's3', type: 'operational_fragmentation', weight: 0.7 }
  ]
};

const a = generateRoadmap(sampleInput);
const b = generateRoadmap(sampleInput);

assert.deepEqual(a, b, 'same input should produce same output');
assert.ok(a.length >= 3 && a.length <= 5, 'should return 3-5 actions');

for (const action of a) {
  assert.ok(action.title, 'title must exist');
  assert.ok(validTimelines.has(action.timeline), 'timeline must be valid bucket');
  assert.ok(validOwners.has(action.owner), 'owner must be valid enum');
  assert.ok(action.rationale && action.rationale.trim().length > 0, 'rationale must be non-empty');
  assert.ok(
    (Array.isArray(action.triggered_by) && action.triggered_by.length > 0)
    || (Array.isArray(action.derived_from) && action.derived_from.length > 0),
    'must include triggered_by or derived_from'
  );
}

console.log('✅ roadmap_generator tests passed');
