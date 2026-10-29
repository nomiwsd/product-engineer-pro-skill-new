# Workflow: Refactor

## Goal

Improve the structure, readability, or maintainability of existing code without changing its
observable behavior, in small steps that each keep the tests green.

## Detect first

- The specific smell to remove (duplication, deep nesting, unclear naming, leaky abstraction,
  oversized module) per `references/core/engineering-principles.md`.
- Current behavior and test coverage of the target; public interfaces that callers rely on.

## Lifecycle behavior

- `plan`: the named smell, target structure, step sequence, characterization tests needed,
  and risk to callers. No edits (L1).
- `build`: add missing characterization tests, then refactor in small verified steps.
- `review`: assess whether a refactor preserves behavior and stays in scope. No edits.

## Process

1. Confirm current behavior: read the code and run existing tests. If coverage is missing,
   add characterization tests first (`references/core/testing-strategy.md`).
2. Name the smell explicitly; do not refactor vaguely "for cleanliness".
3. Use `references/core/code-review-checklist.md` maintainability criteria as the target state.
4. Load a stack reference only for idiom-specific refactors (for example, class components to
   hooks → `references/frontend/react-patterns.md`).
5. Change structure only. If a bug appears, stop and flag it separately (rule ED2).
6. Work in small steps that each form a coherent diff and keep tests passing (rule ED5).
7. Keep public interfaces unless the user asked to change them.
8. Re-run the tests after the change.

## Version gates

None beyond the loaded stack references; a refactor must not introduce APIs the installed
version lacks (V4).

## Best-practice checklist

- [ ] The smell is named.
- [ ] Behavior is covered by tests before restructuring.
- [ ] No bug fixes or features bundled in.
- [ ] Public interfaces are unchanged, or the change was requested.
- [ ] Diff is limited to the refactor target.

## Evidence required

The same tests passing before and after the change (E2). Without tests, label the result an
unverified refactor and say what would verify it (E5).

## Stop conditions

Stop and report when behavior cannot be pinned down by tests, when a bug is found, or when the
refactor would cascade into callers outside the requested scope.

## Never

- Rename across the codebase without being asked.
- Mix formatting-only changes into behavior-relevant files (rule ED3).
- Claim "behavior preserved" without test evidence.

## Output

The smell first, then the diff, then the behavior-preservation evidence. List any bugs found
separately.

## References

- `references/core/operating-rules.md`
- `references/core/engineering-principles.md`
- `references/core/code-review-checklist.md`
- `references/core/testing-strategy.md`
- Relevant frontend or backend reference for idiom-specific refactors
