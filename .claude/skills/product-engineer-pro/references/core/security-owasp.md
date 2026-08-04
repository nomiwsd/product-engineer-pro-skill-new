# Security — OWASP-Aligned Baseline

## Scope

Owns: framework-agnostic secure coding baseline mapped to OWASP Top 10
(2021) categories, applicable to any web application in this skill's
supported stack.

Defers to: `auth-authz.md` for authentication/session implementation
detail; each database file for injection specifics in that engine;
`nextjs-architecture.md`/`express-architecture.md`/`nestjs-architecture.md`
for framework-specific enforcement mechanisms (middleware, guards, etc.).

## OWASP Top 10 (2021) — Applied Baseline

**A01: Broken Access Control**
- Enforce authorization on every server-side entry point (route handler,
  controller, resolver) — never rely on hiding a UI element as the only
  control.
- Default-deny: an endpoint is inaccessible until explicitly authorized,
  not accessible until explicitly restricted.
- Re-check ownership/scope on every request for user-owned resources
  (e.g., a user editing "their" record — verify the ID belongs to them
  server-side, don't trust a client-supplied owner ID).

**A02: Cryptographic Failures**
- Never store passwords in plaintext or with reversible encryption —
  use a modern adaptive hash (bcrypt, argon2, scrypt) — see
  `auth-authz.md`.
- All traffic over TLS in production; no mixed content.
- Don't invent custom crypto — use vetted libraries for hashing, signing,
  and encryption.

**A03: Injection**
- Never build SQL/NoSQL queries via string concatenation with user
  input — use parameterized queries / ORM query builders (see
  `postgresql-design.md`, `mongodb-design.md` for engine specifics).
- Validate and constrain input shape/type at the boundary (schema
  validation: Zod, class-validator, Joi) before it reaches business logic.
- Sanitize/escape any user input rendered into HTML, shell commands, or
  file paths.

**A04: Insecure Design**
- Threat-model new features that touch money, PII, or permissions before
  implementation, not after — ask "what happens if this input is
  malicious/this actor is unauthorized" during design, not just review.
- Rate-limit and abuse-guard sensitive actions (login, password reset,
  payment) by design, not as an afterthought.

**A05: Security Misconfiguration**
- No default credentials, no verbose error responses in production
  (stack traces, internal paths) — see `engineering-principles.md` error
  handling.
- Security headers set at the framework/edge level: `Content-Security-
  Policy`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`,
  `X-Frame-Options` (or CSP `frame-ancestors`).
- Disable directory listing, verbose framework banners, and debug
  endpoints in production builds.

**A06: Vulnerable and Outdated Components**
- Flag known-vulnerable or abandoned dependencies during `audit`/
  `review` when detectable from lockfile/advisory context.
- Prefer maintained, widely-used libraries over ad-hoc reimplementation
  of security-sensitive functionality (auth, crypto, parsing).

**A07: Identification and Authentication Failures**
- Enforce minimum password strength or prefer passwordless/OAuth where
  feasible; never roll a custom session-ID scheme — see `auth-authz.md`.
- Invalidate sessions/tokens on logout and on password change.
- Lock out or throttle after repeated failed authentication attempts.

**A08: Software and Data Integrity Failures**
- Verify integrity of anything deserialized from an untrusted source
  before acting on it (webhooks, uploaded files, third-party payloads).
- Don't `eval`/dynamically execute strings derived from user input under
  any circumstance.

**A09: Security Logging and Monitoring Failures**
- Log authentication events, authorization failures, and input-validation
  rejections with enough context to investigate — without logging
  secrets or full PII (see `observability-deployment.md`).
- Ensure a failed security control produces a log entry, not just a
  silent 4xx.

**A10: Server-Side Request Forgery (SSRF)**
- Never fetch a URL directly from unvalidated user input server-side
  without an allowlist or network-level restriction — this includes
  webhook targets, image-proxy URLs, and "import from URL" features.

## Baseline Checklist (apply to every `security` and `review` pass)

- [ ] All user input validated at the boundary (C3-adjacent: don't trust
      client-declared types).
- [ ] No secrets in code, logs, or client-exposed bundles (C4).
- [ ] Authorization checked server-side on every sensitive action.
- [ ] Parameterized queries / ORM used exclusively for DB access.
- [ ] Security headers configured at the app/edge layer.
- [ ] Passwords hashed with a modern adaptive algorithm, never plaintext.
- [ ] Rate limiting present on auth and other abuse-prone endpoints.
- [ ] Error responses don't leak stack traces/internal details in
      production.

## Anti-Patterns

```ts
// A03 — Injection via string concatenation
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// A01 — Trusting client-supplied ownership
await db.update({ id: req.body.id }, req.body); // no ownership check

// A05 — Leaking internals
res.status(500).json({ error: err.stack });