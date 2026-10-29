# Workflow: Debug

## Goal

Diagnose and fix a specific defect at its root cause — reproduce it, prove the cause, apply
the smallest fix at the source, and prove the fix with a regression test.

## Detect first

- Expected vs actual behavior and the smallest input or condition that triggers it.
- The affected subsystem and its versions; recent changes in that area (`git log`, `git blame`).
- Only the repository context the bug needs; skip a full repository scan for a narrow bug.

## Lifecycle behavior

- `plan` (or read-only host): the reproduction, the leading hypothesis with evidence, the
  proposed fix, and the regression test. No edits (L1).
- `build`: reproduce, fix, and verify. "Find and fix" authorizes scoped, non-destructive
  repair (L2).
- `review`: assess a proposed fix for root cause vs symptom, scope, and test quality.

## Process

1. Reproduce the problem, or describe the exact reproduction when execution is not allowed.
2. State a hypothesis about the root cause before editing; avoid speculative multi-file edits.
3. Trace the actual data and control flow through the code; do not infer behavior from names.
4. Change one variable at a time while narrowing the cause.
5. Separate symptom from cause; fix at the source, not only at the crash site.
6. Check common causes for the category:
   - Async and timing → missing `await`, races, stale closures.
   - React state → `references/frontend/react-patterns.md`.
   - API and data → `references/backend/api-design.md` and the detected database reference.
   - Auth → `references/backend/auth-authz.md`.
7. Apply the minimal fix; do not refactor surrounding code (rule ED2).
8. Add a regression test that fails without the fix (`references/core/testing-strategy.md`).
9. If the cause cannot be proven, state the leading hypothesis, what would confirm it, and the
   next diagnostic step instead of guessing (rule D4).

## Version gates

None beyond the loaded stack references; check the detected version before blaming or using a
version-specific API (V4).

## Best-practice checklist

- [ ] The defect is reproduced (or the reproduction is stated).
- [ ] Root cause stated in one or two sentences, with evidence.
- [ ] Fix is minimal and at the source; no drive-by refactoring.
- [ ] Regression test fails without the fix and passes with it.
- [ ] If unresolved, hypothesis and next diagnostic step are given.

## Evidence required

The reproduction before the fix, the same reproduction passing after it, and the regression
test result (E2). Label the root cause observed or inferred (E1).

## Stop conditions

Stop and report when the bug cannot be reproduced and the evidence does not support a single
cause, or when the fix needs a contract change, migration, or destructive action (C2).

## Never

- Shotgun-edit several files on a guess.
- Suppress the error, widen a type, or add a broad `try/catch` instead of fixing the cause.
- Bundle unrelated cleanup into the fix.

## Output

Root cause first (one or two sentences), then the fix as a diff, then the regression test and
verification results. If unresolved, the hypothesis and next step instead of a speculative fix.

## References

- `references/core/operating-rules.md`
- `references/core/engineering-principles.md`
- `references/core/testing-strategy.md`
- Relevant stack reference for the bug's subsystem
- `references/workflows/refactor.md` (if cleanup is warranted separately)
