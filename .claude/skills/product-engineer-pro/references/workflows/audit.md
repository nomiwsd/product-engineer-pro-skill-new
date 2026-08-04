# Workflow: Audit

## Goal

Assess overall codebase health — quality, security, performance,
accessibility, SEO — and produce a prioritized findings report without
making changes.

## Process

1. Run `references/core/repo-analysis.md` to detect stack, versions,
   and conventions. State detected stack explicitly at the top of output.
2. Determine audit surface: full repo, or a specific area if the user
   scoped it (e.g., "audit the checkout flow"). Don't silently expand
   scope beyond what was asked.
3. Walk each applicable dimension, loading only the relevant reference
   file per dimension:
   - Correctness/maintainability → `core/engineering-principles.md`,
     `core/code-review-checklist.md`
   - Security → `core/security-owasp.md`, `backend/auth-authz.md` (if
     auth code present)
   - Performance → `core/performance-web-vitals.md` + detected frontend
     stack file (e.g., `frontend/nextjs-architecture.md`)
   - Accessibility → `core/accessibility-a11y.md` (if UI present)
   - SEO → `core/seo-technical.md` (if public-facing pages present)
   - Database → `database/postgresql-design.md` or
     `database/mongodb-design.md` (if applicable)
4. For each finding, capture: file/location, severity (per
   `code-review-checklist.md` taxonomy), standard violated, and a
   concrete recommended fix — do not implement fixes in this mode.
5. Deduplicate systemic issues (e.g., "no input validation" appearing in
   12 route handlers) into one finding with all locations listed, rather
   than 12 separate findings.
6. Rank findings by severity, then by blast radius (how many
   users/paths affected).

## Checklist

- [ ] Detected stack and versions stated explicitly.
- [ ] Scope matches what was actually requested.
- [ ] Every finding has: location, severity, standard cited, fix
      recommendation.
- [ ] Systemic issues deduplicated, not listed per-occurrence.
- [ ] No code changes made — audit is diagnostic only (SKILL.md
      diagnostic-before-build rule).
- [ ] Report distinguishes must-fix (Blocker/Major) from optional
      (Minor/Nit).

## Output Format

Use `templates/process/audit-report.md` structure: executive summary,
findings grouped by severity, appendix with full location list per
systemic issue. Offer to proceed to `implement`/`refactor`/`security` for
specific findings — don't auto-continue into fixes.

## Related References

- `references/core/repo-analysis.md`
- `references/core/code-review-checklist.md`
- `references/core/security-owasp.md`
- `references/core/performance-web-vitals.md`
- `references/core/accessibility-a11y.md`
- `references/core/seo-technical.md`
- `templates/process/audit-report.md`