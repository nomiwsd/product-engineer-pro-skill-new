# Workflow: Audit

## Goal

Assess codebase health — correctness, security, performance, accessibility, SEO, and data —
within the scope the user set, and produce a prioritized findings report without making
changes.

## Detect first

- Stack and versions; state them at the top of the report (V2).
- The audit surface: the whole repository or the area the user named. Do not expand scope
  silently.

## Lifecycle behavior

- `plan`: an audit plan (dimensions, scope, method). No edits (L1).
- `build`: still diagnostic. Audits never edit (rule L2); offer the matching build workflow
  for chosen findings instead.
- `review`: the default. A findings report.

## Process

1. Run `references/core/repo-analysis.md`.
2. Confirm the audit surface.
3. Walk each applicable dimension, loading only its reference:
   - Correctness and maintainability → `references/core/engineering-principles.md`,
     `references/core/code-review-checklist.md`
   - Security → `references/core/security-owasp.md`, `references/backend/auth-authz.md` (if auth
     code exists)
   - Performance → `references/core/performance-web-vitals.md` and the detected frontend
     reference
   - Accessibility → `references/core/accessibility-a11y.md` (if UI exists)
   - SEO → `references/core/seo-technical.md` (if public pages exist)
   - Data → the detected database reference
4. For each finding capture location, severity, the standard violated, and a concrete fix (D5).
5. Merge systemic issues into one finding that lists every location.
6. Rank by severity, then by blast radius (how many users or paths are affected).

## Version gates

None beyond the loaded stack references; assess code against its detected versions (V4).

## Best-practice checklist

- [ ] Detected stack and versions stated.
- [ ] Scope matches the request.
- [ ] Every finding has location, severity, standard, and recommended fix.
- [ ] Systemic issues merged, not repeated per occurrence.
- [ ] No code changes made.
- [ ] Must-fix (Blocker, Major) separated from optional (Minor, Nit).

## Evidence required

Locations for every finding (E4). Any tool run (linters, `npm audit`, tests) reported as
passed, failed, or not run (E2). Measurements only where actually taken (E3).

## Stop conditions

Stop and ask when the requested scope is unclear or too large to audit meaningfully; propose a
narrower first pass.

## Never

- Fix findings during the audit.
- List one systemic issue many times.
- Present unmeasured performance or accessibility scores.

## Output

Use `templates/process/audit-report.md`: executive summary, findings by severity, and an
appendix of locations per systemic issue. Group findings under exactly four headings — Blocker,
Major, Minor, Nit — and write "Critical" or "High" findings under Blocker and "Medium" under
Major. Offer `implement`, `refactor`, or `security` for chosen findings without starting them.

## References

- `references/core/operating-rules.md`
- `references/core/repo-analysis.md`
- `references/core/code-review-checklist.md`
- `references/core/security-owasp.md`
- `references/core/performance-web-vitals.md`
- `references/core/accessibility-a11y.md`
- `references/core/seo-technical.md`
- `templates/process/audit-report.md`
