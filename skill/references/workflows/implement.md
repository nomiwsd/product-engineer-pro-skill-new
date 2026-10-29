# Workflow: Implement

## Goal

Deliver a scoped feature, endpoint, component, or module that meets explicit acceptance
criteria, matches the existing codebase (or stated greenfield defaults), applies the practices
of every layer it touches, and is verified before it is called done.

## Detect first

- Existing repository or greenfield; conventions for naming, structure, state, API pattern,
  and tests (D2).
- Which layers the change touches: UI, API, data, auth.
- The acceptance criteria. Turn the request into criteria; ask about missing product rules (D6).

## Lifecycle behavior

- `plan`: acceptance criteria, vertical slices, files per layer, contracts, tests, and checks.
  No edits (L1).
- `build`: implement slice by slice, keeping the repository buildable after each (rule ED5).
- `review`: assess an implementation against its criteria and the touched layers' recipes.

## Process

1. Run `references/core/repo-analysis.md`. For an existing repository, extract conventions;
   for greenfield, propose current-stable defaults as an assumption and confirm before
   scaffolding broadly (rule D4).
2. Write the acceptance criteria. Technical gaps → state an assumption and proceed; product or
   business gaps → ask (rules D4 and D6).
3. Slice the work vertically so each slice is usable and testable.
4. Apply the workflow recipe of every layer touched, loading only those:
   - UI → `references/workflows/frontend.md`
   - API → `references/workflows/backend.md`
   - Data → `references/workflows/database.md`
   - Auth or sensitive data → `references/workflows/security.md`
5. Apply `references/core/engineering-principles.md` for naming, errors, and abstraction.
6. Validate external input at the boundary and authorize server-side (`references/core/security-owasp.md`).
7. Write tests proportional to risk (`references/core/testing-strategy.md`): required for
   business logic, auth, and data mutations.
8. Self-review the diff with `references/core/code-review-checklist.md` before presenting it.
9. Keep the diff to the request; list adjacent improvements separately (rule ED1).

## Version gates

Use the version gates of each layer recipe you load; this workflow adds none (V4).

## Best-practice checklist

- [ ] Acceptance criteria written, and each is met or reported as unmet.
- [ ] Repository conventions matched, or greenfield defaults stated and confirmed.
- [ ] Each touched layer meets its own recipe's checklist.
- [ ] External input validated; authorization enforced server-side.
- [ ] Error paths handled, not only the happy path.
- [ ] Tests added in proportion to risk.
- [ ] No hardcoded secrets (C4) and no fabricated APIs or packages (C3).
- [ ] Diff scoped; adjacent improvements listed separately.

## Evidence required

An acceptance-criteria table (criterion → how verified → result) and the verification ledger
for type check, lint, tests, and build (E2). Residual risks listed (E5).

## Stop conditions

Stop and ask when acceptance criteria depend on an unresolved product decision, or when the
feature needs a destructive migration, a new dependency, or a contract break.

## Never

- Scaffold broadly on an unconfirmed greenfield assumption.
- Fold unrelated improvements into the same diff.
- Mark a criterion met without evidence.

## Output

Code or diff first, then the acceptance-criteria table, verification ledger, key decisions and
assumptions, and flagged adjacent improvements.

## References

- `references/core/operating-rules.md`
- `references/core/repo-analysis.md`
- `references/core/engineering-principles.md`
- `references/core/security-owasp.md`
- `references/core/testing-strategy.md`
- `references/core/code-review-checklist.md`
- Layer recipes: `frontend.md`, `backend.md`, `database.md`, `security.md`
- `templates/` — matching scaffold for the artifact type
