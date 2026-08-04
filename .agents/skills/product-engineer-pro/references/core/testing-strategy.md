# Testing Strategy

## Scope

Owns: framework-agnostic testing philosophy — the pyramid, what to test
at each layer, mocking discipline, and how to decide "enough" coverage.

Defers to: stack-specific files and `templates/testing/` for actual
tool syntax (Jest, Vitest, Playwright, Supertest, etc.).

## The Testing Pyramid (applied)

   /e2e\        few — critical user journeys only
  /------\
 /integr. \     moderate — API/DB boundaries, component integration
/----------\
/ unit \ many — pure functions, isolated logic, components
/--------------\

- **Unit tests**: pure functions, isolated business logic, individual
  React components in isolation, individual service methods with
  dependencies mocked.
- **Integration tests**: API routes/controllers against a real (test)
  database, multi-component interactions, service-to-service calls
  within one app.
- **E2E tests**: full user journeys through the real UI/API stack
  (login → action → verify), reserved for critical paths (checkout,
  auth, core conversion flow) — not exhaustive feature coverage.

## What "Enough" Coverage Means

- Coverage percentage is not the goal — critical-path coverage is.
  A payment flow at 100% and a static "About" page at 0% is a better
  allocation than uniform 80% everywhere.
- Every bug fix ships with a regression test reproducing the original
  bug, when practical.
- New business logic (calculations, permission checks, state machines)
  requires unit tests; new pure-presentational UI without logic
  branches may not.

## Mocking Discipline

- Mock at the boundary of the system under test (network calls, DB,
  external APIs) — don't mock the internals of the code you're actually
  testing.
- Prefer real implementations for fast, in-process dependencies (e.g., a
  pure utility function) over mocking them.
- Integration tests should use a real test database (or an in-memory
  equivalent) rather than mocking the ORM/driver — mocking the DB layer
  in an "integration" test defeats its purpose.
- Reset mocks/state between tests — no test may depend on execution
  order or leftover state from a previous test.

## Test Structure

- Arrange–Act–Assert (or Given–When–Then) structure within each test.
- Test names describe behavior, not implementation:
  `"returns 401 when token is expired"`, not `"test auth function 3"`.
- One logical assertion focus per test — multiple `expect`s are fine if
  they verify one behavior, but don't combine unrelated behaviors into
  one test.

## Flaky Tests

- A flaky test is a bug in the test (or a race condition in the code) —
  never suppress it with a retry-until-pass loop as a permanent fix.
- Common causes to check first: unmocked time/dates, unmocked network
  calls, shared state between tests, real timers instead of fake timers,
  assuming a specific async resolution order.

## When Writing Tests for Existing Code (retrofitting)

1. Cover the current observed behavior first (characterization tests)
   before refactoring, especially if no tests exist yet.
2. Don't "fix" a bug silently while writing a test for unrelated
   behavior — flag it separately (SKILL.md Editing Discipline).

## Anti-Patterns

```ts
// Testing implementation detail, not behavior
expect(component.state.internalFlag).toBe(true);

// Over-mocking — nothing real is actually tested
jest.mock('./calculateTotal'); // mocking the function under test itself

// Order-dependent test relying on shared mutable state
let counter = 0;
test('increments', () => { counter++; expect(counter).toBe(1); });