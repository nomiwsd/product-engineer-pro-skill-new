# Workflow: Test

## Goal

Write or review unit, integration, or e2e tests appropriate to the risk
of the code under test.

## Process

1. Run `references/core/repo-analysis.md` to detect the existing test
   framework/runner and file/naming convention already in use — match
   it rather than introducing a new one.
2. Determine test level needed per `core/testing-strategy.md`'s pyramid:
   pure logic → unit; API/DB boundary → integration; critical user
   journey → e2e (sparingly).
3. If writing tests for existing, previously-untested code, write
   characterization tests capturing current behavior first — do not
   silently "fix" a bug discovered mid-task; flag it separately
   (SKILL.md Editing Discipline).
4. Mock only at the true system boundary (network, DB, external
   services) — per `core/testing-strategy.md` mocking discipline. Don't
   mock the unit under test itself.
5. For stack-specific test setup (React Testing Library patterns,
   Supertest for Express, NestJS testing module) → load the matching
   `backend/`/`frontend/` file only if setup mechanics are non-obvious.
6. Name tests by behavior, not implementation detail.
7. If a test is flaky or order-dependent, treat it as a bug in the test
   itself — fix the root cause (shared state, unmocked time/network),
   never mask it with a retry loop as a permanent fix.
8. Confirm new tests actually fail on the unfixed code (for regression
   tests) before confirming they pass on the fix — a test that never
   fails is not verifying anything.

## Checklist

- [ ] Test level matches the pyramid guidance for what's being tested.
- [ ] Matches existing test framework/convention in the repo.
- [ ] Mocking only at true system boundaries.
- [ ] Test names describe behavior.
- [ ] No shared mutable state between tests; no order dependency.
- [ ] Regression tests verified to fail without the fix, pass with it.

## Output Format

Lead with the test code. State which pyramid level it targets and why.
If characterization tests were written for previously-untested code,
state that explicitly and note any bug found separately.

## Related References

- `references/core/testing-strategy.md`
- `references/core/engineering-principles.md`
- `templates/testing/unit-test.spec.ts.md`
- `templates/testing/e2e-test.spec.ts.md`