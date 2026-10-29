# Workflow: Test

## Goal

Write, stabilize, or review unit, integration, and end-to-end tests at the level the risk
calls for, using the repository's runner and conventions, so that each test fails for the
right reason and passes for the right reason.

## Detect first

- Test runner and version, assertion style, file naming, fixtures or factories, coverage
  config, and the CI test command (D2).
- What is risky in the code under test: authorization, money, data mutation, concurrency.

## Lifecycle behavior

- `plan`: which behaviors to cover, at which level, with which fixtures and boundaries. No
  edits (L1).
- `build`: write or fix tests and run them.
- `review`: findings on coverage of risk, flakiness, over-mocking, and assertions that cannot
  fail. No edits.

## Process

1. Run `references/core/repo-analysis.md` to find the runner and conventions; match them.
2. Choose the level per `references/core/testing-strategy.md`: unit for logic, integration for
   API and database boundaries, end-to-end sparingly for critical journeys.
3. For untested code, write characterization tests of current behavior first. Flag any bug
   found; do not fix it silently (rule ED2).
4. Structure each test as arrange, act, assert; name it by behavior, not implementation.
5. Mock only at true system boundaries (network, database, external services, clock).
   Control time and randomness; isolate state so order does not matter.
6. Load stack-specific setup (Testing Library, Supertest, Nest testing module) from the
   matching frontend or backend reference only when the setup is non-obvious.
7. Treat a flaky test as a bug in the test: fix shared state, unmocked time, or network
   access instead of adding retries.
8. For regression tests, show the test failing without the fix before it passes with it.

## Version gates

None beyond the detected test runner's major; use its API (for example, Jest vs Vitest vs
`node:test`) and do not mix runners.

## Best-practice checklist

- [ ] Test level matches the risk and the pyramid guidance.
- [ ] Repository runner, naming, and fixture conventions are followed.
- [ ] Mocks only at system boundaries; time and randomness controlled.
- [ ] No shared mutable state or order dependency.
- [ ] Names describe behavior; assertions check outcomes, not markup snapshots alone.
- [ ] Regression tests fail before the fix and pass after it.

## Evidence required

Test command output for the new or changed tests; for regression tests, both the failing run
without the fix and the passing run with it (E2).

## Stop conditions

Stop and report when the code under test has a bug that the task did not ask to fix, or when
a reliable test requires infrastructure the repository does not have.

## Never

- Mask flakiness with retries as a permanent fix.
- Mock the unit under test.
- Write assertions that cannot fail.

## Output

Test code first, then which level it targets and why, the run results, and any bug found
(flagged separately).

## References

- `references/core/operating-rules.md`
- `references/core/testing-strategy.md`
- `references/core/engineering-principles.md`
- `templates/testing/unit-test.spec.ts.md`
- `templates/testing/e2e-test.spec.ts.md`
