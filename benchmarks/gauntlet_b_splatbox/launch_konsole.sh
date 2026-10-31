#!/usr/bin/env bash
# Hermes TUI Konsole Launcher for Gauntlet B - Splatbox CDP (ICM 3-Stage Pipeline)
set -euo pipefail
WORKSPACE_DIR="/var/home/imshubhamsocial/Projects/Workspace/Personal/hermes/benchmarks/gauntlet_b_splatbox"
UNIT="hermes-gauntlet-b-splatbox"
SKILL="icm-architect"

STAGE="${1:-}"
if [[ -z "$STAGE" ]]; then
  if [[ -t 0 ]]; then
    echo "Select Stage to launch for Gauntlet B (Splatbox CDP):"
    echo "  1) Stage 1: Host Chrome CDP Bridge & DOM Readiness (max-turns 10)"
    echo "  2) Stage 2: Multimodal Ballistic Controller Synthesis (max-turns 12)"
    echo "  3) Stage 3: Live 60-Second Match Execution & Sealing (max-turns 10)"
    read -rp "Enter selection [1-3, default 1]: " choice
    STAGE="${choice:-1}"
  else
    STAGE="1"
  fi
fi

case "$STAGE" in
  remediation|rem)
    PROMPT_FILE="$WORKSPACE_DIR/PROMPT_REMEDIATION.txt"
    MAX_TURNS=15
    STAGE_LABEL="Remediation (Autonomous Splatbox)"
    ;;
  1)
    PROMPT_FILE="$WORKSPACE_DIR/PROMPT_STAGE1.txt"
    MAX_TURNS=10
    STAGE_LABEL="Stage 1 (CDP Bridge & DOM)"
    ;;
  2)
    PROMPT_FILE="$WORKSPACE_DIR/PROMPT_STAGE2.txt"
    MAX_TURNS=15
    STAGE_LABEL="Stage 2 (Ballistic Controller)"
    ;;
  3)
    PROMPT_FILE="$WORKSPACE_DIR/PROMPT_STAGE3.txt"
    MAX_TURNS=10
    STAGE_LABEL="Stage 3 (Live Match & Sealing)"
    ;;
  *)
    echo "Invalid stage: $STAGE. Choose 1, 2, or 3."
    exit 1
    ;;
esac

echo "Resetting any previous $UNIT systemd unit..."
/usr/bin/distrobox-host-exec systemctl --user reset-failed "$UNIT.service" 2>/dev/null || true
/usr/bin/distrobox-host-exec systemctl --user stop "$UNIT.service" 2>/dev/null || true

echo "Launching Gauntlet B - $STAGE_LABEL inside Konsole window on desktop..."
/usr/bin/distrobox-host-exec systemd-run --user --unit="$UNIT" \
  --setenv=WAYLAND_DISPLAY="wayland-0" \
  --setenv=DISPLAY=":0" \
  --setenv=XDG_RUNTIME_DIR="/run/user/1000" \
  konsole --separate --hold \
    -p "tabtitle=Gauntlet B - $STAGE_LABEL" \
    -e distrobox enter ws-hermes -- /bin/bash -l -c "
      cd '$WORKSPACE_DIR' && \
      echo '=== Starting Hermes TUI Session for Gauntlet B - $STAGE_LABEL ===' && \
      PROMPT_TEXT=\"\$(cat '$PROMPT_FILE')\" && \
      export HERMES_TUI_QUERY=\"\$PROMPT_TEXT\" && \
      export HERMES_TUI_TOOL_PROGRESS=\"verbose\" && \
      hermes chat --in '$WORKSPACE_DIR' --accept-hooks -s '$SKILL' --max-turns $MAX_TURNS --query-file '$PROMPT_FILE' --tui -v
    "

echo "Spawned $UNIT.service ($STAGE_LABEL) on host desktop."
