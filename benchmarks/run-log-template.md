# Run Log — YYYY-MM-DD

## Environment

| Item | Value |
| --- | --- |
| Operator | |
| Machine / OS | |
| Node.js | |
| Claude Code version | |
| Model alias → exact ID | haiku → |
| Skill commit under test (`improved`) | |
| Comparison tag | `v2.0.1` |
| Conditions | baseline, v2.0.1, improved |
| Runs per case per condition | 1 (exploratory) / 3 (comparative) |
| User-level instruction files present | yes / no (list) |

## Commands

```bash
node benchmarks/runner/run.mjs --conditions baseline,v2.0.1,improved --concurrency 4
node benchmarks/runner/report.mjs benchmarks/results/<file>.json
```

## Results

Paste or link the generated report.

## Manual review notes

| Case or task | Condition | Automated result | Reviewer note |
| --- | --- | --- | --- |
| | | | |

## Weaknesses and surprises

- Cases where a skill condition did worse than baseline:
- Checks that looked wrong on review:
- Anything that limits the conclusions (single run, model, host):
