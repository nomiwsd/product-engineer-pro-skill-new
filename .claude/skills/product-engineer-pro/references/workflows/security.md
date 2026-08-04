# Workflow: Security

## Goal

Threat-model, harden, or fix vulnerabilities — with every finding
mapped to a concrete OWASP category and a concrete fix.

## Process

1. Run `references/core/repo-analysis.md` to detect stack, auth
   mechanism in use, and database engine.
2. Determine mode: proactive threat-model (new feature touching money/
   PII/permissions), reactive vulnerability fix (specific issue
   reported), or defensive audit (general hardening pass).
3. Walk `core/security-owasp.md`'s Top 10 categories systematically for
   audit/threat-model; for a specific reported issue, map it to its
   OWASP category first, then check for the same class of issue
   elsewhere in the affected area (a single injection point often
   indicates a pattern, not an isolated bug).
4. For auth-specific concerns → `backend/auth-authz.md`.
5. For injection/query-specific concerns → `database/postgresql-design.md`
   or `database/mongodb-design.md` for engine-specific parameterization.
6. Every finding must state: the OWASP category, the specific
   vulnerable code/pattern, exploit scenario in one sentence (what an
   attacker could actually do), and the concrete fix.
7. Never present a fix for a vulnerability without also checking for the
   same pattern elsewhere in the codebase within reasonable scope.
8. Any fix touching authentication/session handling must be treated as
   high-risk — flag for explicit confirmation before applying (C2-adjacent
   caution, even if not strictly "destructive").
9. Do not disclose exploit details in a way that would be usable as a
   ready-made attack outside the immediate fix context.

## Checklist

- [ ] Every finding mapped to an OWASP category (per D5).
- [ ] Exploit scenario stated concretely, not just "this is insecure."
- [ ] Same vulnerable pattern checked elsewhere in affected scope.
- [ ] Fix uses parameterized queries / validated input / server-side
      authorization — never a partial client-side-only fix for a
      server-side risk.
- [ ] Auth/session-touching fixes flagged for explicit confirmation.
- [ ] No secrets exposed or introduced during the fix (C4).

## Output Format

Group findings by OWASP category and severity (per
`code-review-checklist.md` taxonomy). Each finding: location → category
→ exploit scenario → fix (as diff). Use `templates/process/audit-report.md`
structure if this is a broader security audit rather than a single fix.

## Related References

- `references/core/security-owasp.md`
- `references/backend/auth-authz.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
- `references/core/code-review-checklist.md`