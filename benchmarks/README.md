# Benchmarks and Evaluation Cases

Reproducible evidence of what Product Engineer Pro changes in a real coding agent, and where
it does not help. Everything here is public (MIT), synthetic, and contains no client code or
real secrets. It is not part of the npm package.

## What is measured

| Kind | Count | Purpose | Folder |
| --- | --- | --- | --- |
| Evaluation cases | 25 | One focused behavior each: lifecycle, versions, safety, and every workflow | `cases/` |
| Benchmark tasks | 4 (5 runs; task 4 has two fixtures) | Full coding tasks scored with the weighted rubric | `tasks/` |

Fixtures are tiny dependency-free projects in `fixtures/`, so every run is offline and
deterministic apart from the model itself.

## Conditions

| Condition | Setup | Prompt |
| --- | --- | --- |
| `baseline` | No skill installed | The case prompt as written |
| `v2.0.1` | Skill installed from the `v2.0.1` git tag (`init --tool claude`) | `/pep:<workflow> ` + the case prompt |
| `improved` | Skill installed from the commit under test | `/pep:<workflow> ` + the case prompt |

The skill conditions use the generated `/pep:<workflow>` command because that is how the
skill is invoked correctly in Claude Code. The request text is identical in all conditions.

## Run protocol

Fixed for every run, and recorded in the results:

- **Agent and model:** Claude Code (version recorded), `--model haiku` (exact model ID recorded
  from the session).
- **Permissions:** the case's `permissionMode` (`plan` or `acceptEdits`). Bash is limited to
  test, `node`, and read-only `git` commands, unless a case removes Bash entirely.
- **Isolation:** `--setting-sources project,local`, `--strict-mcp-config`,
  `--disallowedTools "mcp__*"`, `--no-session-persistence`. Each run gets a fresh copy of the
  fixture in a temporary git repository.
- **Known leak:** the operator's user-level instruction files are still loaded by Claude Code.
  They are identical across conditions and recorded in the results.
- **Hidden checks:** acceptance tests live in the case or task folder and are copied in only
  after the agent finishes, so the agent never sees them.

Repeats:

- **Exploratory run:** 1 run per case per condition. Exploratory results are direction-finding
  only.
- **Comparative claims** (on the website, or in the listing) require ≥ 3 runs per condition
  and report the spread, not just the mean.

## Scoring

Each case lists automated checks; a case **passes** when all checks pass, is **partial** when
at least half pass, and **fails** otherwise. Benchmark tasks are also scored with the
weighted rubric in [rubric.md](rubric.md). Every run is also checked for **false claims**: a
reply that says tests or checks passed when no test command ran in that session.

Automated checks are a floor, not the whole truth: failures are reviewed by hand and noted in
the results.

## Running

```bash
node benchmarks/runner/run.mjs --list                          # show cases and tasks
node benchmarks/runner/run.mjs --only lifecycle-plan-no-edit --conditions improved
node benchmarks/runner/run.mjs --conditions baseline,v2.0.1,improved --concurrency 4
node benchmarks/runner/report.mjs benchmarks/results/<date>-run.json
node benchmarks/runner/regrade.mjs benchmarks/results/<date>-run.json "why checks changed"
```

`regrade.mjs` re-applies the current checks to a finished run's saved transcripts and work
folders without running the agent again. Use it only to correct a check that manual review
proved wrong, record why in the note, and keep the original results file next to the
re-graded one. Local absolute paths are removed from every published result file.

Raw transcripts are written to `benchmarks/results/raw/` (git-ignored); the summarized JSON and
Markdown reports are committed. Record each run with [run-log-template.md](run-log-template.md).

## Placement

Core cases, tasks, fixtures and results are public in this repository. Pro-only cases belong in
the private Pro repository; only their summarized outcomes may be published.
