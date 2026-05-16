import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from uuid import UUID

from src.calibrate_api import QUEUE, process_calibration


def _base_payload(namespace="client/A"):
    return {
        "calibration_session_id": "11111111-1111-1111-1111-111111111111",
        "client_namespace": namespace,
        "evidence_inventory": [
            {"id": "sig-1", "type": "metric", "source": "internal", "aggregation_count": 8}
        ],
        "reviewer_context": {"role": "governance_reviewer", "timestamp": "2026-01-01T00:00:00Z"},
    }


def test_valid_payload_deterministic_trace():
    payload = _base_payload()
    status, body = process_calibration(payload)
    assert status == 200
    assert body["status"] == "accepted"
    UUID(body["trace_id"])
    status2, body2 = process_calibration(payload)
    assert status2 == 200
    assert body["trace_id"] == body2["trace_id"]


def test_individual_level_rejected():
    payload = _base_payload()
    payload["evidence_inventory"][0]["employee_id"] = "emp-1"
    status, body = process_calibration(payload)
    assert status == 400
    assert body["error"] == "individual_level_data_forbidden"


def test_low_aggregation_rejected():
    payload = _base_payload()
    payload["evidence_inventory"][0]["aggregation_count"] = 2
    status, body = process_calibration(payload)
    assert status == 400
    assert body["error"] == "insufficient_aggregation"
    assert "low_evidence_coverage" in body["warnings"]


def test_namespace_isolation_queue_partition():
    QUEUE.clear()
    status_a, body_a = process_calibration(_base_payload("A"))
    status_b, body_b = process_calibration(_base_payload("B"))
    assert status_a == 200 and status_b == 200
    assert body_a["metadata"]["client_namespace"] == "A"
    assert body_b["metadata"]["client_namespace"] == "B"
    assert set(QUEUE.keys()) == {"A", "B"}
    assert QUEUE["A"][0]["payload"]["client_namespace"] == "A"
    assert QUEUE["B"][0]["payload"]["client_namespace"] == "B"


if __name__ == "__main__":
    tests = [
        test_valid_payload_deterministic_trace,
        test_individual_level_rejected,
        test_low_aggregation_rejected,
        test_namespace_isolation_queue_partition,
    ]
    for test in tests:
        test()
    print("✅ All calibrate_api tests passed")
