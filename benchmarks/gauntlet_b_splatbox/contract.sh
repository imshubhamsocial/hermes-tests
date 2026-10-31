#!/usr/bin/env bash
set -euo pipefail
test -f "output/splatbox_agent.py"
test -f "output/telemetry.json"
grep -q "8139" "output/splatbox_agent.py"
grep -q "movementX" "output/splatbox_agent.py"
grep -q "380.0" "output/splatbox_agent.py"
grep -q "chrome_dev_debug" "output/splatbox_agent.py"
python3 -c '
import json, sys
data = json.load(open("output/telemetry.json"))
assert data.get("score", 0) > 0, f"Score must be > 0, got {data}"
assert data.get("embeddinggemma2_verified") is True, "embeddinggemma2 verification required"
assert float(str(data.get("accuracy", "0")).replace("%","")) >= 85.0, f"Accuracy < 85%: {data}"
print("[PASS] Gauntlet B Splatbox Telemetry Verified:", data)
'
