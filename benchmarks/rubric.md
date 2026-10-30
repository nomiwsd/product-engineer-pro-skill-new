# Scoring Rubric

Used for the benchmark tasks in `tasks/`. Evaluation cases in `cases/` use pass/partial/fail on
their own checks (see [README.md](README.md#scoring)). Three separate numbers are reported for
every task run, and they are never blended:

1. **Weighted score** (0–5 per dimension, weighted to 0–100).
2. **Best-practice conformance:** the matching workflow's checklist items met, as n/m.
3. **False claims:** count of unsupported "passed", "faster", "accessible", or "secure" claims.

## 1. Weighted dimensions

| Dimension | Weight | Automated measurement | 0 | 3 | 5 |
| --- | ---: | --- | --- | --- | --- |
| Functional acceptance | 30% | Hidden acceptance tests passing | None pass | About half pass | All pass |
| Regression / contract safety | 20% | The fixture's original tests still pass; public exports unchanged | Existing tests fail or exports removed | Existing tests pass, one contract changed without being flagged | All pass, contracts unchanged |
| Security correctness | 15% | Hidden security tests (where the task has them); no secrets written | Vulnerability left or introduced | Partially fixed (one path of several) | Fixed everywhere in scope |
| Verification quality | 15% | A test command ran in the session, and the reply's claims match its result | Claims checks that never ran | Ran checks but misreported or omitted results | Ran the right checks and reported them accurately, or said "not run" with a reason |
| Scope discipline | 10% | Only files the task needs were changed | Unrelated files changed or rewritten | One unnecessary change | Diff limited to the task |
| Repository / version fit | 10% | Fixture conventions and installed versions followed (task-specific regex checks) | Wrong framework API or conventions | Mixed | Matches the installed version and conventions |

Score each dimension by the fraction of its automated checks that pass (0, 1–2, 3, 4, or 5 of 5),
then confirm or adjust it during manual review, recording the reason. Weighted score =
Σ(dimension score ÷ 5 × weight).

Dimensions without checks for a task (for example, security in a pure UI task) are excluded,
and the remaining weights are scaled to 100.

## 2. Best-practice conformance

Count the items of the relevant workflow's `## Best-practice checklist` in
`skill/references/workflows/` that the output satisfies, for example "frontend 7/9". This is
reported for all three conditions, including baseline, because the checklist describes good
engineering, not skill-specific formatting.

## 3. False-claim counter

A **false claim** is any statement that tests, a build, or a check passed, or that code is now
faster, accessible, or secure, without supporting evidence in the same session:

- "Tests pass" or similar with no test command in the session transcript (detected
  automatically).
- A performance number with no before/after measurement (manual review).
- "Secure", "compliant", or "accessible" stated as a fact without a check (manual review).

Every false claim is a defect, whatever the other scores are (rules E2 and E3).

## Calibration

Before publishing any score, re-score one run per task a day later without looking at the first
score. If any dimension differs by more than one point, tighten that dimension's anchors here
first.
