# hermes-tests: Raw Benchmark Logs, Provenance Receipts & Gauntlets Matrix

This repository contains the authoritative raw execution traces, Inspect AI (`.eval`) archives, forensic audit reports, and interactive benchmark suites evaluating **Hermes Agent OS** under the **Interpretable Context Methodology (ICM / MWP, arXiv:2603.16021)** across GDR24 through GDR34.

---

## 1. Executive Benchmark & Gauntlets Registry

| Benchmark / Gauntlet | Domain & Target | Stages / Artifacts | Status & Provenance |
| :--- | :--- | :--- | :--- |
| **Gauntlet A: Voxel FPS Multiplayer** | Three.js WebGL Voxel Engine + WebSocket Multiplayer | `benchmarks/gauntlet_a_voxel_fps/` | 3-Stage ICM Pipeline, Stage 1/2 receipts, client & server contracts |
| **Gauntlet B: Splatbox Autonomous Browser Gaming** | Live Chrome CDP Port 9222 on `https://splatbox.alexdiaz.fyi/` | `benchmarks/gauntlet_b_splatbox/` | Full autonomous Python controller (`splatbox_agent.py`), live PNG captures, OpenCV target detection traces |
| **Gauntlet C: Dual-FBO Aquarium Simulation** | Three.js WebGL GPGPU Heightfield Water Physics | `benchmarks/gauntlet_c_aquarium/` | Full ICM stage contracts, shader specs, and verification harnesses |
| **Gauntlet D: `leanrea` Reverse Engineering** | POSIX Reverse Engineering Benchmark | `benchmarks/leanrea_eval/` | Zero-MCP reverse engineering benchmark suite |
| **Gauntlet E: `ffmpeg-skill` Video Synthesis** | 42 Deterministic FFmpeg Video Primitives | `benchmarks/ffmpeg_skill_eval/` | Audio/video manipulation contract verification |
| **Gauntlet F: `diagram-design` Visualizer** | Clean HTML+SVG Editorial Graphics (Zero Mermaid Slop) | `benchmarks/diagram_design_eval/` | Procedural vector diagram compiler benchmark |
| **Gauntlet G: `markitdown` Ingestion** | Multi-Format Document Ingestion & Markdown Conversion | `benchmarks/markitdown_eval/` | PDF, Office, audio transcription parsing testbed |
| **AI2 ARC Challenge** | Scientific Reasoning MCQ (50 samples) | `logs/gdr30_harness_evals/baseline_arc/` | **92.00% (46 / 50)** |
| **BFCL Function Calling** | Single & Parallel Tool Invocation (100 samples) | `logs/2026-10-29T19-34-35-00-00_bfcl_U8GbDDnBKWpxQHH9nPnjpa.eval` | **51.00% (51 / 100)** |
| **HumanEval** | Python Code Synthesis (164 samples) | `logs/gdr26/track_a_humaneval/` | **42.07% (69 / 164)** |
| **TAU-2 Retail** | Multi-Turn Customer Support Dialogue | `logs/2026-10-26T20-11-48-00-00_tau2-retail_9Eo5qBTpZZmK3vpqnNMATi.eval` | Multi-turn dialog traces and epistemic audits |
| **GAIA Level 1/2** | General AI Assistant Benchmark | `logs/gaia_custom_tui/` | Custom TUI session transcripts and task manifests |

---

## 2. Hardware & Substrate Invariants

- **Host Hardware**: NVIDIA GeForce RTX 3050 Laptop GPU (6,144 MiB physical VRAM), 6-core host CPU, Fedora Kinoite 44.
- **VRAM Ceiling Invariant**: Peak consumption maintained strictly $\le 5,800.0$ MiB (GDR32-34 certified at 4,311 MiB).
- **Active Substrate Daemons**:
  - Port 8138: `hermes-llama-server.service` (Local LLM Inference)
  - Port 1933: `hermes-openviking.service` (Hierarchical Memory, `endpoint: http://127.0.0.1:1933`)
  - Port 8642: `hermes gateway run` (Gateway & Agent Router)
  - Port 9222: `chrome-dev-cdp.service` (Chrome DevTools Protocol Bridge)

---

## 3. Repository Directory Structure

```
├── README.md
├── BENCHMARK_ANALYSIS_REPORT.md             # Comprehensive cross-benchmark evaluation analysis
├── remediated_gauntlet.log                  # Historical execution log
├── benchmarks/                              # All living gauntlets and interactive testbeds
│   ├── gauntlet_a_voxel_fps/               # Gauntlet A: 3-Stage Three.js Voxel FPS
│   ├── gauntlet_b_splatbox/                # Gauntlet B: Live CDP Splatbox autonomous browser game
│   │   ├── output/
│   │   │   ├── splatbox_agent.py           # Autonomous CDP controller
│   │   │   ├── live_game_screen.png        # Menu screenshot
│   │   │   ├── live_game_playing.png       # Live 3D gameplay capture
│   │   │   ├── after_cdp_click.png         # Native CDP click trace
│   │   │   ├── target_detected.png         # OpenCV target detection overlay
│   │   │   └── target_crop.png             # Target crop candidate
│   │   ├── contract.sh                     # Deterministic verification contract
│   │   └── PROMPT_REMEDIATION.txt          # Active prompt specification
│   ├── gauntlet_c_aquarium/                # Gauntlet C: Dual-FBO wave simulation
│   ├── leanrea_eval/                       # Gauntlet D: Reverse engineering
│   ├── ffmpeg_skill_eval/                  # Gauntlet E: Video editing
│   ├── diagram_design_eval/                # Gauntlet F: Diagram design
│   ├── markitdown_eval/                    # Gauntlet G: Document ingestion
│   ├── gaia/                               # GAIA evaluation harness
│   └── tau_bench/                          # Tau-bench evaluation harness
└── logs/                                   # Raw Inspect AI evaluation archives (.eval)
    ├── gaia_custom_tui/                    # GAIA interactive transcripts
    ├── inspect_gaia_test/                  # GAIA test outputs
    ├── inspect_tau2_retail_test/           # Tau-bench test outputs
    └── *.eval                              # Sealed evaluation archives
```
