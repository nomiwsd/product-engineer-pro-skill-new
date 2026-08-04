# Workflow: Debug

## Goal

Diagnose and fix a specific bug or unexpected behavior — root cause
first, patch second.

## Process

1. Reproduce the problem conceptually before proposing a fix: what is
   the expected behavior, what is the actual behavior, what's the
   minimal input/condition that triggers it?
2. Run `references/core/repo-analysis.md` only as needed to understand
   the relevant subsystem's stack/version (don't do a full repo scan for
   a narrow bug).
3. Form a hypothesis about root cause before editing code. State it
   explicitly. Avoid speculative multi-file changes based on a guess.
4. Trace the actual data/control flow: read the relevant function calls,
   don't assume behavior from naming alone.
5. Distinguish symptom from cause — if the visible error is a downstream
   effect (e.g., a null-reference three layers past the actual bad
   input), fix at the source, not just at the crash site.
6. Check for common category-specific causes before deep-diving:
   - Async/timing → race condition, missing `await`, stale closure
   - State bugs (React) → see `frontend/react-patterns.md` (stale state,
     effect dependency issues)
   - API/data bugs → see `backend/api-design.md`,
     `database/postgresql-design.md`/`mongodb-design.md` (query logic,
     type coercion)
   - Auth bugs → `backend/auth-authz.md`
7. Apply the minimal fix that addresses the root cause — don't refactor
   surrounding code while debugging (that's `refactor` mode, run
   separately if warranted, per SKILL.md Editing Discipline).
8. Add a regression test reproducing the original bug when practical
   (`core/testing-strategy.md`).
9. If root cause can't be conclusively determined from available
   context, state the leading hypothesis, what would confirm it, and
   what additional information/logging would help — don't guess-fix
   silently (SKILL.md D4).

## Checklist

- [ ] Root cause identified and stated, not just the symptom patched.
- [ ] Fix is minimal and scoped to the bug — no drive-by refactoring.
- [ ] Regression test added where practical.
- [ ] If unresolved, hypothesis and next diagnostic step stated clearly.

## Output Format

State the root cause first (one or two sentences), then the fix as a
diff, then the regression test if added. If unresolved, output the
hypothesis and a concrete next diagnostic step instead of a speculative fix.

## Related References

- `references/core/engineering-principles.md`
- `references/core/testing-strategy.md`
- Relevant stack file matching the bug's subsystem
- `references/workflows/refactor.md` (if cleanup is warranted separately)