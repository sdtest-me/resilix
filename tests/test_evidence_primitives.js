import { performance } from "node:perf_hooks";
import { calcInferenceConfidence, calcFinalConfidence, generateSignalId, validateProvenance } from "../src/evidence_utils.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const s = { type: "leadership_turnover", source: "interview", weight: 0.8, source_confidence: "high", timestamp: "2026-05-15T00:00:00Z" };
const id1 = generateSignalId(s);
const id2 = generateSignalId({ ...s });
assert(id1 === id2, "same input should generate same signal id");

const inf = calcInferenceConfidence(0.8, 0.5);
assert(inf === 0.71, "inference confidence should be deterministic");
const fin = calcFinalConfidence(inf, "high");
assert(fin === 0.786, "final confidence should follow deterministic formula");

const derived = { id: "p-1", derived_from_signals: [id1] };
const derivedLegacy = { id: "h-1", triggered_by: ["rule:leadership_gap"] };
assert(validateProvenance(derived), "derived object with derived_from_signals should pass");
assert(validateProvenance(derivedLegacy), "derived object with triggered_by should pass");
assert(!validateProvenance({ id: "bad" }), "derived object without provenance should fail");

const t0 = performance.now();
for (let i = 0; i < 2000; i += 1) {
  generateSignalId(s);
  calcInferenceConfidence(0.8, 0.5);
  validateProvenance(derived);
}
const elapsed = performance.now() - t0;
assert(elapsed < 50, `primitive operations should run in <50ms, got ${elapsed.toFixed(2)}ms`);

console.log("✅ All evidence primitive tests passed");
