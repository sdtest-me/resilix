#!/usr/bin/env python3
"""Deterministic public signal ingestion (demo-first)."""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

SIGNAL_TYPES = ["leadership_change", "kpi_pressure", "esg_narrative", "supply_chain_risk", "workforce_signal"]
SOURCE_TYPES = ["public_news", "esg_report", "job_board", "company_site", "regulatory_filing"]
CONFIDENCE = ["low", "medium", "high"]
BASE_TS = datetime(2026, 1, 1, tzinfo=timezone.utc)


def _seed(company: str) -> str:
    return hashlib.sha256(company.strip().lower().encode("utf-8")).hexdigest()


def _iso_from_offset(seed_hex: str, offset: int) -> str:
    minutes = int(seed_hex[offset:offset + 6], 16) % (365 * 24 * 60)
    return (BASE_TS + timedelta(minutes=minutes)).isoformat().replace("+00:00", "Z")


def _mock_signals(company: str) -> list[dict[str, Any]]:
    seed_hex = _seed(company)
    signals: list[dict[str, Any]] = []
    for i in range(4):
        h = seed_hex[i * 8:(i + 1) * 8]
        s_type = SIGNAL_TYPES[int(h[:2], 16) % len(SIGNAL_TYPES)]
        source = SOURCE_TYPES[int(h[2:4], 16) % len(SOURCE_TYPES)]
        conf = CONFIDENCE[int(h[4:6], 16) % len(CONFIDENCE)]
        weight = round((int(h[6:8], 16) / 255.0), 3)
        signals.append({
            "id": f"sig-{hashlib.sha1(f'{company}|{i}'.encode('utf-8')).hexdigest()[:12]}",
            "type": s_type,
            "source": source,
            "weight": weight,
            "source_confidence": conf,
            "timestamp": _iso_from_offset(seed_hex, i * 6),
            "summary": f"Deterministic demo signal {i + 1} for {company}",
        })
    return signals


def _public_text_signals(company: str) -> list[dict[str, Any]]:
    urls = [f"https://example.com/?company={company.replace(' ', '+')}"]
    snippets: list[str] = []
    for idx, url in enumerate(urls):
        try:
            req = Request(url, headers={"User-Agent": "resilix-fetch-esg/1.0"})
            with urlopen(req, timeout=5) as resp:
                text = resp.read(800).decode("utf-8", errors="ignore").strip().replace("\n", " ")
                snippets.append(text[:120] or "public page reachable")
        except (URLError, HTTPError, TimeoutError):
            return _mock_signals(company)
    seed_hex = _seed(company)
    out = _mock_signals(company)
    for i, snippet in enumerate(snippets):
        out[i]["source"] = "public_news"
        out[i]["source_confidence"] = "low"
        out[i]["summary"] = f"Public snippet: {snippet[:80]}"
        out[i]["timestamp"] = _iso_from_offset(seed_hex, i * 6)
    return out


def build_payload(company: str, demo: bool) -> dict[str, Any]:
    seed_hex = _seed(company)
    timestamp = _iso_from_offset(seed_hex, 10)
    signals = _mock_signals(company) if demo else _public_text_signals(company)
    return {
        "companyName": company,
        "timestamp": timestamp,
        "signals": signals,
        "dependencyScore": 0.0,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Deterministic public signal ingestion")
    parser.add_argument("--company", required=True, help="Company name")
    parser.add_argument("--demo", action="store_true", help="Use deterministic offline demo generation")
    parser.add_argument("--output", required=True, help="Output JSON path")
    args = parser.parse_args()

    payload = build_payload(args.company, args.demo)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"✅ wrote {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
