# Workflow: Implement

## Goal

Build a new feature, endpoint, component, or module that is correct,
secure, and consistent with the existing codebase (or sensible defaults
if greenfield).

## Process

1. Run `references/core/repo-analysis.md`. Branch:
   - **Existing repo**: extract conventions (naming, structure, state
     management, API pattern) — new code must match them (SKILL.md D2).
   - **Greenfield**: propose current-stable stack defaults, state as an
     assumption, confirm before scaffolding broadly.
2. Clarify ambiguity per SKILL.md D4/D6: technical gaps → state
   assumption and proceed; product/business logic gaps → ask.
3. Identify which layers are touched and load only the matching stack
   files:
   - UI → `frontend/react-patterns.md`, `frontend/nextjs-architecture.md`,
     `frontend/typescript-standards.md`, `frontend/tailwind-css.md`,
     `frontend/shadcn-ui.md` as applicable
   - API layer → `backend/express-architecture.md` or
     `backend/nestjs-architecture.md`, `backend/api-design.md`
   - Auth-touching → `backend/auth-authz.md` + `core/security-owasp.md`
   - Data layer → `database/postgresql-design.md` or
     `database/mongodb-design.md`
4. Apply `core/engineering-principles.md` (naming, error handling,
   abstraction discipline) throughout.
5. Validate all external input at the boundary; never trust client data
   for authorization decisions (`core/security-owasp.md` A01/A03).
6. Write or update tests appropriate to the risk of the change
   (`core/testing-strategy.md`) — required for business logic, auth, and
   data mutations; optional for pure presentational UI.
7. Self-review the diff against `core/code-review-checklist.md` before
   presenting it.
8. Keep the diff scoped to the request (SKILL.md Editing Discipline) —
   flag any adjacent improvement as a separate suggestion, don't fold it
   into the same diff silently.

## Checklist

- [ ] Matches existing repo conventions (or stated greenfield defaults).
- [ ] All external input validated; authorization checked server-side
      where relevant.
- [ ] No hardcoded secrets (C4); no fabricated APIs/packages (C3).
- [ ] Error paths handled, not just the happy path.
- [ ] Tests added/updated appropriate to risk level.
- [ ] Diff is scoped to the request; unrelated files untouched.
- [ ] Assumptions stated explicitly where repo signals were insufficient.

## Output Format

Lead with the code/diff. Follow with a short rationale covering key
decisions and any assumptions made. List any flagged-but-not-implemented
adjacent improvements separately at the end.

## Related References

- `references/core/repo-analysis.md`
- `references/core/engineering-principles.md`
- `references/core/security-owasp.md`
- `references/core/testing-strategy.md`
- Relevant `frontend/`, `backend/`, `database/` files per detected stack
- `templates/` — matching scaffold for the artifact type