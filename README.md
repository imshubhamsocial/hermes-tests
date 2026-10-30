# hermes-tests: Raw Benchmark Logs & Forensic Trace Receipts

This repository contains the complete raw execution traces, Inspect AI (`.eval`) archives, and forensic audit reports evaluating **Hermes Agent OS** paired with **Gemma-4-E4B-it-qat-q4_0** under the **GDR24 / GDR25 Interpretable Context Methodology (ICM / MWP, arXiv:2603.16021)**.

---

## 1. Executive Benchmark Scorecard

| Benchmark Track | Task Domain | Samples | Model / Substrate | Final Score | Key Architectural Finding |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Track B.3: AI2 ARC Challenge** | Scientific Reasoning MCQ | 50 | Hermes Agent OS (Port 8642) | **92.00% (46 / 50)** | High compressed textbook knowledge; excels at single-pass deduction. |
| **Track A.3: BFCL** | Function Calling & AST Parsing | 100 | Port 8138 (Direct Llama-Server) | **51.00% (51 / 100)** | **64.0%** on single/multiple tool calls; **38.0%** on concurrent parallel calls. |
| **Track A.4: HumanEval** | Python Code Synthesis | 164 | Port 8138 (Local Sandbox) | **42.07% (69 / 164)** | Strong CS algorithm knowledge; 61% of failures are variable renames fixable by linters. |
| **Track A.1: Tau-bench Retail** | Multi-Turn Customer Support | 15 | Port 1934 (FastMCP Bridge) | **0.00% (0 / 15 validated)** | Multi-turn state-recovery failure when DB returns error; transfers to human agent. |
| **3-Gate Epistemic Audit** | Telemetry Validation | 15 | `verify_epistemic_eval_audit.py` | **1 False Positive Stripped** | Successfully eliminated Sample 12 false pass awarded by naive Inspect AI grader. |
| **Track A.2: Tau-bench Airline** | Flight Booking Dialogue | 15 | Port 1934 (FastMCP Bridge) | **Skipped** | Bypassed per established 4B multi-turn conversational limits. |
| **Track B.1: GAIA Level 1** | Multimodal Assistant Tasks | 20 | Hermes Agent OS (Port 8642) | **Gated Repo Gate** | Requires Hugging Face gated repo license agreement. |

---

## 2. Hardware & Substrate Invariants

- **Host Hardware**: NVIDIA GeForce RTX 3050 Laptop GPU (6,144 MiB VRAM), 6-core host CPU.
- **VRAM Ceiling Invariant**: Peak consumption was strictly maintained at **5,271 MiB**, honoring the mandatory `query_live_nvml_vram() <= 5400.0 MiB` rule.
- **Model Checkpoint**: `google/gemma-4-E4B-it-qat-q4_0-gguf` (Quantized to Q4_0, ~2.2 GB weight footprint).
- **Speculative Draft Engine**: `mtp-gemma-4-E4B-it-Q4_0.gguf` running via `llama-server.bin` with `draft-mtp,ngram-map-k` achieving 75-97 tokens/sec.
- **Active Substrate Daemons**:
  - Port 8138: llama-server inference daemon
  - Port 8642: Hermes Agent OS Gateway (`sk-hermes-local-prod-12345678`)
  - Port 1933: OpenViking Hierarchical Memory Server
  - Port 20128: OmniRoute Gateway
  - Port 1934: FastMCP Ephemeral Dynamic Tool Bridge

---

## 3. Repository Structure

```
├── README.md
├── remediated_gauntlet.log                  # Full stdout/stderr execution log across all stages
├── GDR24_Production_Remediation_Blueprint.md # Engineering architecture & remediation blueprint
└── logs/
    ├── track_b_arc_remediated/              # Sealed AI2 ARC Challenge eval log (92.00%)
    ├── track_a_bfcl/                        # Sealed Berkeley Function Calling Leaderboard eval log (51.00%)
    ├── track_a_humaneval/                   # Sealed OpenAI HumanEval eval log (42.07%)
    └── track_a_tau2_remediated/             # Sealed Tau-bench Retail eval log & epistemic audit report
        └── epistemic_audit_report.json      # 3-Gate Epistemic Policy Audit eliminating false positives
```

---

## 4. How to Inspect & Validate Logs

Inspect AI eval logs use Zstandard-compressed zip format. To explore them:

### Using Inspect AI Interactive Web UI:
```bash
inspect view --log-dir logs/
```

### Using Python:
```python
from inspect_ai.log import read_eval_log

# Load HumanEval results:
log = read_eval_log("logs/track_a_humaneval/2026-10-28T20-05-38-00-00_humaneval_BWbaJyu5AeXBY7qQXS53kz.eval")
print(f"HumanEval Status: {log.status}, Samples: {len(log.samples)}")
print(f"Pass@1 Score: {log.results.scores[0].metrics['accuracy'].value * 100:.2f}%")
```

---

---

## GDR30 Canonical Agent Harness Evaluation Suite & Raw Benchmark Logs

This update adds the complete, raw, unprocessed benchmark logs comparing all three candidate substrates (**Google Gemma 4 E4B QAT**, **xbill9 Gemma 4 Exact QAT**, and **unsloth NVIDIA Nemotron 3.5 Bolt**):

* **Directory**: [`logs/gdr30_harness_evals/`](logs/gdr30_harness_evals/)
  * [`tau_bench_react_candidate1/`](logs/gdr30_harness_evals/tau_bench_react_candidate1/): Raw multi-turn customer dialogues and trajectory JSONs for Candidate 1 (Google Gemma 4 QAT).
  * [`tau_bench_react_candidate2/`](logs/gdr30_harness_evals/tau_bench_react_candidate2/): Raw multi-turn customer dialogues and trajectory JSONs for Candidate 2 (xbill9 Gemma 4 Exact QAT).
  * [`tau_bench_react_omniroute/`](logs/gdr30_harness_evals/tau_bench_react_omniroute/): Raw multi-turn customer dialogues and trajectory JSONs for Candidate 3 (NVIDIA Nemotron 3.5 Bolt).
  * [`inspect_gaia_test/`](logs/gdr30_harness_evals/inspect_gaia_test/): Raw Inspect AI `.eval` execution logs for GAIA Level 1 tests.
  * [`inspect_tau2_retail_test/`](logs/gdr30_harness_evals/inspect_tau2_retail_test/): Raw Inspect AI `.eval` logs for Tau2 Retail.
  * [`BENCHMARK_ANALYSIS_REPORT.md`](BENCHMARK_ANALYSIS_REPORT.md): Full comprehensive comparative report.
