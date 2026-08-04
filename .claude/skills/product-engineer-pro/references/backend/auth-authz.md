# Authentication & Authorization

## Scope

Owns: identity verification (authentication) and permission enforcement (authorization) patterns — session/token strategy, password handling, RBAC/ABAC — independent of framework.

Defers to: `security-owasp.md` for the broader OWASP context (A01, A02, A07); `express-architecture.md`/`nestjs-architecture.md` for how these patterns are wired in as middleware/guards.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view <package> version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

Not framework-version-dependent in the traditional sense — governed by protocol and cryptographic maturity.

| Approach | Support Tier | Notes |
|---|---|---|
| OAuth 2.1 / OIDC (with PKCE) | Current recommended default | Recommended for modern applications; mandatory PKCE for code exchange |
| Session-based auth (`HttpOnly`, `SameSite` cookies) | Supported | Ideal for traditional web apps and SSR; requires server session store (Redis, DB) |
| JWT-based auth (Stateless + Refresh Rotation) | Supported (strict security required) | Requires `HttpOnly` refresh token cookie & short-lived access token — avoid storing in `localStorage` |
| MD5 / SHA-1 / plain SHA-256 for passwords | Legacy / Insecure | Flag immediately in any audit or security review |

## Detection

Per `references/core/repo-analysis.md`: identify the existing auth mechanism (session cookie, JWT, OAuth provider library like Passport, Auth.js/NextAuth, Clerk, Auth0 SDK) before proposing changes.

## Standards

### Password Handling
- Hash passwords with a modern adaptive algorithm: Argon2id (preferred) or bcrypt — never MD5, SHA-1, or unsalted SHA-256.
- Use built-in salt generation — never implement manual salting alongside modern hash functions.
- Set a cost factor appropriate for server hardware while avoiding excessive login latency.
- Never log, store, or transmit plaintext passwords at any point (C4 constraint, OWASP A02).

### Session-Based Auth
- Set security attributes on session cookies: `HttpOnly` (prevents XSS token theft), `Secure` (HTTPS only), and `SameSite=Lax` or `Strict` (mitigates CSRF).
- Regenerate session IDs on privilege changes (login, logout, password change) to prevent session fixation.
- Implement explicit server-side session invalidation on logout.

### JWT-Based Auth
- Sign tokens using asymmetric keys (`RS256` or `ES256`) or strong symmetric secrets (`HS256` with high entropy). Never accept `alg: none`.
- Store short-lived access tokens in memory and long-lived refresh tokens in `HttpOnly`, `Secure` cookies — **never store tokens in `localStorage`**.
- Implement refresh token rotation and token revocation checks.
- Validate standard claims (`exp`, `iss`, `aud`, `nbf`) server-side on every request.

### OAuth 2.1 / OIDC
- Always use PKCE (Proof Key for Code Exchange) for authorization code flows per OAuth 2.1.
- Validate `state` parameters to prevent CSRF on OAuth callbacks.
- Enforce exact redirect URI allowlists.

### Authorization (RBAC / ABAC)
- Enforce authorization server-side on every sensitive route and action (`references/core/security-owasp.md` A01).
- Layer Role-Based Access Control (RBAC, e.g., `admin`, `user`) with Attribute-Based Access Control (ABAC, e.g., resource ownership verification).
- Re-verify resource ownership on every request — do not trust client-supplied user IDs without database verification.

## Anti-Patterns

```ts
// Storing JWT tokens in localStorage (vulnerable to XSS theft)
localStorage.setItem('token', jwt);

// Missing ownership verification on resource deletion
async function deletePost(req, res) {
  // Unsafe: Deletes any post ID passed in request body without checking req.user.id!
  await db.posts.delete({ id: req.body.postId });
}

// Insecure password hashing
const hash = crypto.createHash('sha256').update(password).digest('hex');

// Accepting alg: none in JWT verification
jwt.verify(token, secret, { algorithms: [decodedHeader.alg] });
```

## Related References

- `references/core/security-owasp.md`
- `references/backend/express-architecture.md`
- `references/backend/nestjs-architecture.md`
- `references/database/postgresql-design.md`

## Applies To Modes

- `security`
- `implement`
- `review`
- `audit`
- `database`