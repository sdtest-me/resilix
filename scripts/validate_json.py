#!/usr/bin/env python3
"""Validate demo JSON files against data/schema.json.

Intentionally invalid example for manual testing:
  python3 scripts/validate_json.py data/demo/bad.json
"""

from __future__ import annotations
import json, sys
from pathlib import Path
from typing import Any
ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / 'data' / 'schema.json'
DEMO_DIR = ROOT / 'data' / 'demo'
EXCLUDED_DEFAULT = {'bad.json'}

def _type_name(value: Any) -> str:
    if isinstance(value, bool): return 'boolean'
    if isinstance(value, (int, float)) and not isinstance(value, bool): return 'number'
    if isinstance(value, str): return 'string'
    if isinstance(value, list): return 'array'
    if isinstance(value, dict): return 'object'
    if value is None: return 'null'
    return type(value).__name__

def load_json(path: Path) -> Any:
    with path.open('r', encoding='utf-8') as fh: return json.load(fh)

def validate_payload(payload: Any, schema: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if not isinstance(payload, dict): return [f"root: expected object, got {_type_name(payload)}"]
    required = schema.get('required', [])
    properties = schema.get('properties', {})
    for key in required:
        if key not in payload: errors.append(f"missing required field: '{key}'")
    for key, rules in properties.items():
        if key not in payload: continue
        expected = rules.get('type')
        if expected is None: continue
        actual = _type_name(payload[key])
        if actual != expected: errors.append(f"field '{key}': expected {expected}, got {actual}")
    return errors

def iter_default_targets() -> list[Path]:
    return sorted(p for p in DEMO_DIR.glob('*.json') if p.name not in EXCLUDED_DEFAULT)

def main(argv: list[str]) -> int:
    try: schema = load_json(SCHEMA_PATH)
    except json.JSONDecodeError as exc:
        print(f"❌ schema parse error in {SCHEMA_PATH}: {exc}"); return 2
    targets = [Path(arg) for arg in argv] if argv else iter_default_targets()
    if not targets:
        print('⚠️ no JSON files found to validate'); return 0
    failures = 0
    for target in targets:
        if not target.is_absolute(): target = ROOT / target
        try: payload = load_json(target)
        except FileNotFoundError:
            print(f"❌ {target.relative_to(ROOT)}: file not found"); failures += 1; continue
        except json.JSONDecodeError as exc:
            print(f"❌ {target.relative_to(ROOT)}: malformed JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}")
            failures += 1; continue
        errors = validate_payload(payload, schema)
        if errors:
            print(f"❌ {target.relative_to(ROOT)} failed validation:")
            for err in errors: print(f"   - {err}")
            failures += 1
        else: print(f"✅ {target.relative_to(ROOT)} is valid")
    return 1 if failures else 0

if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
