# Workflow: Security

## Goal

Threat-model, audit, harden, or repair supported applications so that every finding maps to
an OWASP category with a concrete exploit scenario and fix, the same class of flaw is closed
everywhere in scope, and fixes are proven by tests.

## Detect first

- Stack and versions, auth mechanism, session or token storage, trust boundaries, data
  sensitivity (money, personal data, permissions), dependency manifest and lockfile.
- The OWASP Top 10 edition recorded in `references/version-snapshot.json`.

## Lifecycle behavior

- `plan`: threat model or remediation plan with categories, locations, fixes, and tests. No
  edits (L1).
- `build`: apply scoped fixes with regression tests; auth, session, and crypto changes need
  explicit confirmation first.
- `review`: findings grouped by category and severity with locations. No edits.

## Process

1. Run `references/core/repo-analysis.md`; state the detected stack (V2).
2. Classify the request: threat-model a new feature, fix a reported issue, or run a defensive
   audit.
3. For audits and threat models, walk `references/core/security-owasp.md` systematically. For a
   reported issue, map it to its category first.
4. For each finding state: category, vulnerable code or pattern with location (E4), a
   one-sentence exploit scenario, and the concrete fix (D5).
5. Search the affected scope for the same pattern; one injection point usually indicates more.
6. Fix server-side risks server-side: authorization, validation, output encoding,
   parameterization (`references/backend/auth-authz.md`, the detected database reference).
7. Apply secure defaults the framework supports: `Secure`, `HttpOnly`, and `SameSite` cookies;
   CSRF protection where cookies authenticate; security headers and CSP; secrets from the
   environment or a secret manager.
8. Audit dependencies with the repository's own tooling (`npm audit` or equivalent) and report
   advisories with severity and fix availability.
9. Add a regression test that proves each fixed exploit path is closed.

## Version gates

None beyond the loaded stack references. Use the OWASP edition in the snapshot and say if the
project targets a different one (V3).

## Best-practice checklist

- [ ] Every finding has a category, location, exploit scenario, and fix.
- [ ] The same pattern was searched across the affected scope.
- [ ] Fixes are server-side for server-side risks; no client-only fix.
- [ ] Auth, session, and crypto changes were confirmed before being applied.
- [ ] Cookies, CSRF, headers, and secret handling follow the framework's secure defaults.
- [ ] Each fixed path has a regression test, or the reason it has none is stated.
- [ ] No secrets were exposed or introduced (C4).

## Evidence required

Regression test results for fixed paths, dependency-audit output when run, and the list of
locations searched for the same pattern. Report each check as passed, failed, or not run (E2).

## Stop conditions

Stop and ask before changing authentication, sessions, or cryptography, before rotating or
deleting credentials, and when a fix would break a public contract.

## Never

- Publish ready-to-use exploit payloads beyond what the fix requires.
- Claim compliance, certification, or "secure" without stating what was checked (E3).
- Treat a client-side check as a fix for a server-side vulnerability.

## Output

Group findings by category and severity (Blocker, Major, Minor, Nit only; "Critical" or "High"
means Blocker): location → category → exploit scenario → fix. Use
`templates/process/audit-report.md` for broad audits; lead with the fix diff for a single issue.

## References

- `references/core/operating-rules.md`
- `references/core/security-owasp.md`
- `references/backend/auth-authz.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
- `references/core/code-review-checklist.md`
- `templates/process/audit-report.md`
