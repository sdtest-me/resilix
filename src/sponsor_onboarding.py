from typing import Any, Dict


def validate_onboarding_for_ingestion(payload: Dict[str, Any]) -> bool:
    return isinstance(payload.get("client_namespace"), str) and payload.get("client_namespace", "").strip() != ""
