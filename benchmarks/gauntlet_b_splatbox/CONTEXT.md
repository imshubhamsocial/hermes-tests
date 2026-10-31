# Stage Contract: Gauntlet B — Autonomous Splatbox Browser Gameplay

## Inputs
* Workspace Root Map: ../../AGENTS.md
* Hard Operational Bounds: ./invariants.md
* Procedural Execution Order: ./rules.md
* Splatbox DOM & CDP/Vision Schemas: ./references.md

## Process
> 1. Read ./invariants.md, ./rules.md, and ./references.md before executing any shell or browser command.
> 2. Launch host Flatpak Chrome Dev via /usr/bin/distrobox-host-exec with --remote-debugging-port=9222 and --user-data-dir=$HOME/.cache/chrome_dev_debug pointing to https://splatbox.alexdiaz.fyi/.
> 3. Connect to http://127.0.0.1:9222/json, attach to the page WebSocket target, wait until #play:not([disabled]) is ready, and click #play to engage PointerLockControls.
> 4. Execute the closed-loop multimodal (embeddinggemma2 Port 8139 + OpenCV cv2.HoughCircles) aiming and firing controller output/splatbox_agent.py for a full 60-second round.
> 5. Extract final #score, #timer, and #accuracy metrics to output/telemetry.json and run bash ./contract.sh.

## Outputs
* Player Controller: output/splatbox_agent.py
* Telemetry Receipt: output/telemetry.json

## Verify
* Run bash ./contract.sh and confirm exit code 0.
