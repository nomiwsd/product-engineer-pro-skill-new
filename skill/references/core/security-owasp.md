# Security — OWASP-aligned baseline

## Scope and snapshot

Apply the OWASP Top 10:2025 category names below. This is a secure-coding router,
not a substitute for threat modeling, an advisory database, or framework-specific
official guidance. See `references/version-snapshot.json` for the verified source.

## OWASP Top 10:2025 applied baseline

### A01: Broken Access Control

- Default-deny every server entry point and enforce server-side role, tenant, and
  resource ownership checks independently of UI visibility.
- Constrain server-side URL fetching with allowlists and network controls; SSRF is
  an access-control/design concern even though it is no longer a standalone Top 10 item.

### A02: Security Misconfiguration

- Disable default credentials, debug endpoints, directory listings, verbose errors,
  and unnecessary services in production.
- Configure CSP, HSTS, content-type protections, secure cookie attributes, CORS, and
  framework/edge headers from an explicit deployment policy.

### A03: Software Supply Chain Failures

- Review lockfiles, provenance, lifecycle scripts, abandoned packages, vulnerable
  transitive dependencies, build artifacts, and CI release permissions.
- Pin/verify critical automation and avoid installing packages merely to reproduce
  functionality already available in the platform or repository.

### A04: Cryptographic Failures

- Use modern adaptive password hashing and vetted authenticated encryption/signing.
- Protect keys and sensitive data in transit and at rest; never invent cryptography
  or log plaintext credentials, tokens, payment data, or encryption keys.

### A05: Injection

- Parse and constrain untrusted body, path, query, header, file, webhook, and
  environment input at the boundary.
- Parameterize SQL/NoSQL operations and avoid interpolating user-controlled values
  into HTML, shells, paths, templates, regular expressions, or interpreter contexts.

### A06: Insecure Design

- Threat-model money, identity, PII, permissions, uploads, webhooks, and multi-tenant
  boundaries before implementation.
- Design rate limits, idempotency, abuse prevention, recovery, and safe defaults into
  the contract rather than adding them after an incident.

### A07: Authentication Failures

- Use established session/token mechanisms, rotation, expiration, revocation, secure
  cookies, MFA where appropriate, and throttling for authentication attempts.
- Do not roll custom session IDs or trust authentication state supplied by a client.

### A08: Software or Data Integrity Failures

- Verify webhook signatures and provenance before deserializing or acting.
- Do not execute untrusted serialized data, dynamic code, unsigned updates, or
  unverified build outputs.

### A09: Security Logging and Alerting Failures

- Record authentication, authorization, validation, administrative, and integrity
  failures with useful context but without secrets or excessive PII.
- Ensure actionable alerting and retention exist; logging without detection is not
  sufficient.

### A10: Mishandling of Exceptional Conditions

- Fail closed at security boundaries, handle partial failures and timeouts, release
  resources, and avoid leaking internal details.
- Test malformed inputs, dependency outages, retry exhaustion, transaction rollback,
  duplicate delivery, and recovery paths.

## Review checklist

- [ ] Trust boundaries and attacker-controlled inputs identified
- [ ] Authentication, authorization, and tenant/resource scope checked separately
- [ ] Dependencies/build pipeline and configuration reviewed
- [ ] Data protection and cryptography use established primitives
- [ ] Injection sinks are parameterized/escaped for their exact context
- [ ] Integrity, logging/alerting, and exceptional conditions are covered

## Anti-pattern

```ts
const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

Use the database driver's parameter binding and validate the email before the query.
This maps to OWASP Top 10:2025 A05.
