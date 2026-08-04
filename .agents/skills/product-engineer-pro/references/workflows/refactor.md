# Workflow: Refactor

## Goal

Improve the structure, readability, or maintainability of existing code
without changing its observable behavior.

## Process

1. Confirm the current behavior first — read the code and, if tests
   exist, run/review them to understand what "unchanged behavior" means
   concretely. If no tests exist for the code being refactored, consider
   adding characterization tests first (`core/testing-strategy.md`)
   before restructuring, especially for risky/critical logic.
2. Identify the specific smell being addressed (duplication, deep
   nesting, unclear naming, leaky abstraction, oversized function/module)
   per `core/engineering-principles.md` — state it explicitly rather than
   refactoring vaguely "for cleanliness."
3. Apply `core/code-review-checklist.md` maintainability criteria as the
   target state.
4. Load the relevant stack file only if the refactor is
   framework/library idiom-specific (e.g., converting class components
   to hooks → `frontend/react-patterns.md`; extracting a NestJS service
   → `backend/nestjs-architecture.md`).
5. Make behavior-preserving changes only. If the refactor reveals an
   actual bug, stop and flag it separately — do not silently fix
   behavior while claiming "refactor only" (SKILL.md Editing Discipline).
6. Refactor in the smallest safe increments that still form a coherent
   diff — avoid one giant diff mixing multiple unrelated restructurings.
7. Re-run or re-verify tests after the change; if none exist, note that
   this refactor is unverified as a limitation.

## Checklist

- [ ] Specific smell being addressed is named explicitly.
- [ ] Behavior is unchanged — no bug fixes bundled in silently.
- [ ] Existing tests still pass, or characterization tests were added
      first.
- [ ] Diff is scoped to the refactor target — no unrelated files touched.
- [ ] Any newly discovered bug is flagged separately, not fixed inline.

## Output Format

State the smell being addressed, then the diff, then confirm behavior
preservation (tests passing, or stated as unverified if no tests exist).
List any separately-flagged bugs found during the process.

## Related References

- `references/core/engineering-principles.md`
- `references/core/code-review-checklist.md`
- `references/core/testing-strategy.md`
- Relevant `frontend/`/`backend/` file for idiom-specific refactors