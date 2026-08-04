# Engineering Principles

## Scope

Owns: baseline senior-engineer judgment calls that apply regardless of
language or framework — naming, error handling, abstraction discipline,
complexity budget, definition of done.

Defers to: `code-review-checklist.md` for how these principles are
evaluated during review; stack-specific files for language/framework
idioms that implement these principles concretely.

## Naming

- Names describe intent, not implementation: `getActiveUsers()`, not
  `getUsersWhereFlagTrue()`.
- Booleans read as predicates: `isLoading`, `hasPermission`, `canEdit` —
  never bare nouns (`loading`, `permission`) for a boolean.
- Avoid abbreviations except universally understood ones (`id`, `url`,
  `db`). No `usr`, `cfg`, `mgr` unless already established in the repo.
- Function names are verbs; variable/type names are nouns.
- Match the plurality and casing convention already in the codebase
  (per `repo-analysis.md`) even if it differs from this file's default.

## Error Handling

- Fail loudly in development, gracefully in production — never swallow
  an error silently (empty `catch` block) in either environment.
- Distinguish expected failures (validation errors, not-found) from
  unexpected ones (bugs, infrastructure failures) — they need different
  handling and different log severity.
- Every `catch` block does at least one of: re-throw (possibly wrapped
  with more context), log with enough context to debug, or return a
  typed error result — never a bare empty catch.
- Async errors must be handled explicitly; never leave a rejected
  promise unhandled (see stack files for framework-specific mechanisms:
  Express error middleware, NestJS exception filters, React error
  boundaries).
- User-facing error messages never leak internals (stack traces, SQL,
  file paths) — see `security-owasp.md` for the security dimension of
  this rule.

## Abstraction Discipline

- Duplicate code twice before abstracting — a premature abstraction
  that guesses wrong about the shared shape is more expensive than
  short-term duplication (Rule of Three).
- An abstraction must remove real complexity, not just relocate it — if
  understanding the abstraction requires more effort than reading the
  duplicated code, don't introduce it.
- Prefer composition over inheritance/deep hierarchies in all supported
  stacks (React components, NestJS services, data models alike).
- Keep function/method bodies focused on one level of abstraction — don't
  mix high-level orchestration with low-level string manipulation in the
  same function.

## Complexity Budget

- Prefer flat control flow over deep nesting — use early returns/guard
  clauses instead of nested `if` blocks.
- A function that needs a paragraph of comments to explain what it does
  (not why) is a signal to split it.
- Cyclomatic complexity is a smell signal, not a hard gate — use
  judgment, but treat a function with more than ~4 independent branches
  as a refactor candidate.
- No "clever" one-liners that trade readability for brevity — optimize
  for the next reader, not for line count.

## Comments

- Comments explain *why*, not *what* — the code already says what it
  does; comment the non-obvious reasoning, trade-off, or constraint
  behind a decision.
- Delete commented-out code before finishing a task — version control is
  the history, not inline comments.
- `TODO`/`FIXME` comments must include enough context to act on later
  (link an issue if the repo has an issue tracker convention) — a bare
  `// TODO` is not acceptable.

## Definition of Done

A change is not complete until:
1. It matches existing repo conventions (per `repo-analysis.md`).
2. Error paths are handled, not just the happy path.
3. It has test coverage appropriate to its risk (see
   `testing-strategy.md`) — not necessarily 100%, but the critical path
   is covered.
4. No secrets, debug logging, or commented-out code remain.
5. It doesn't silently introduce a new pattern/dependency alongside an
   existing equivalent one without flagging it (SKILL.md Editing
   Discipline).

## Anti-Patterns

```ts
// Silent failure — never do this
try {
  await saveUser(user);
} catch (e) {}

// Boolean with unclear polarity
const flag = true; // what does true mean here?

// Abstraction built on a guess, used exactly once
function genericHandler<T>(fn: (x: T) => void, opts?: any) { ... }