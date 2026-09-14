import hashlib
import json
from datetime import datetime, timezone

CHAIN = []

def add_event(event_type: str, source_id: str, details: dict):
    previous = CHAIN[-1]["hash"] if CHAIN else "GENESIS"
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": event_type,
        "source_id": source_id,
        "details": details,
        "previous_hash": previous,
    }
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    item = {**payload, "hash": digest}
    CHAIN.append(item)
    return item

def get_chain():
    return CHAIN
