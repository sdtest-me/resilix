import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "fetch_esg.py"
EVIDENCE_SCHEMA = json.loads((ROOT / "data" / "evidence_primitives.json").read_text())


class FetchEsgTests(unittest.TestCase):
    def run_script(self, company: str, demo: bool = True) -> dict:
        with tempfile.TemporaryDirectory() as td:
            out = Path(td) / "out.json"
            cmd = ["python3", str(SCRIPT), "--company", company, "--output", str(out)]
            if demo:
                cmd.insert(4, "--demo")
            subprocess.run(cmd, check=True, cwd=ROOT)
            return json.loads(out.read_text())

    def validate_evidence_schema(self, payload: dict) -> None:
        required = EVIDENCE_SCHEMA["properties"]["signals"]["items"]["required"]
        for sig in payload["signals"]:
            for field in required:
                self.assertIn(field, sig)
            self.assertIn(sig["source_confidence"], ["low", "medium", "high"])
            self.assertGreaterEqual(sig["weight"], 0.0)
            self.assertLessEqual(sig["weight"], 1.0)

    def test_same_input_same_output(self):
        a = self.run_script("Acme Corp", demo=True)
        b = self.run_script("Acme Corp", demo=True)
        self.assertEqual(a, b)

    def test_output_has_required_structure(self):
        payload = self.run_script("TestCo", demo=True)
        self.assertIn("companyName", payload)
        self.assertIn("timestamp", payload)
        self.assertIn("signals", payload)
        self.assertIn("dependencyScore", payload)
        self.validate_evidence_schema(payload)

    def test_demo_mode_offline_safe(self):
        payload = self.run_script("Offline Inc", demo=True)
        self.assertTrue(payload["signals"])


if __name__ == "__main__":
    unittest.main()
