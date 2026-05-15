# Narrative Engine Usage
1. Import: `const { generateNarrative } = require('../src/narrative_engine');`
2. Build evidence with `vMEME_distribution`, `dependencyScore`, `signals`, `contradictions`, `roadmapActions`.
3. Call `const narrative = generateNarrative(evidence);`.
4. Output is an array of structured objects with `section`, `pain_point`, `gain_statement`, `evidence_basis`, `confidence`, `triggered_by`.
5. Example input: `{ dependencyScore: 72, signals:[{id:'s1',weight:0.8}], vMEME_distribution:{blue:0.5,orange:0.3}, contradictions:[...], roadmapActions:[{impact:'high'}] }`.
6. Example output item: `{ section:'executive_summary', pain_point:'Key-person concentration risk', gain_statement:'Documented decision protocols reduce bus-factor exposure', evidence_basis:['s1'], confidence:0.84, triggered_by:['rule_dependency_gte_70'] }`.
7. Determinism rule: same input object values always return the same narrative array order.
8. Trace rule: every output item requires non-empty `evidence_basis` and `triggered_by`.
9. Add a new rule in `buildRuleSet()` with a fixed id, fixed `when`, and deterministic `run` mapper.
10. Keep rule insertion order stable to preserve deterministic output ordering.
