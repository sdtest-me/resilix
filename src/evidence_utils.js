import crypto from "node:crypto";

const clamp01 = (n) => Math.max(0, Math.min(1, Number(n) || 0));

export function generateSignalId(signal) {
  const canonical = JSON.stringify(signal, Object.keys(signal || {}).sort());
  return crypto.createHash("sha256").update(canonical).digest("hex").slice(0, 16);
}

export function calcInferenceConfidence(signalWeight, ruleTransparency) {
  const w = clamp01(signalWeight);
  const t = clamp01(ruleTransparency);
  return Number((0.7 * w + 0.3 * t).toFixed(4));
}

export function calcFinalConfidence(inferenceConfidence, sourceConfidence) {
  const sourceMap = { low: 0.3, medium: 0.6, high: 0.9 };
  const s = sourceMap[sourceConfidence] ?? 0;
  const i = clamp01(inferenceConfidence);
  return Number((0.6 * i + 0.4 * s).toFixed(4));
}

export function validateProvenance(obj) {
  if (!obj || typeof obj !== "object") return false;
  const fields = ["triggered_by", "derived_from", "derived_from_signals", "derived_from_patterns"];
  return fields.some((f) => Array.isArray(obj[f]) && obj[f].length > 0);
}
