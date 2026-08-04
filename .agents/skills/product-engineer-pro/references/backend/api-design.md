# API Design

## Scope

Owns: REST conventions — resource naming, HTTP semantics, pagination, versioning, and error-response shape — independent of Express vs NestJS.

Defers to: `express-architecture.md`/`nestjs-architecture.md` for how these conventions are implemented in each framework; `auth-authz.md` for authentication/authorization on endpoints.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view <package> version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

Not framework-version-dependent — governed by REST/HTTP conventions and architectural maturity.

| Approach | Support Tier | Notes |
|---|---|---|
| REST over HTTP with JSON | Default recommended | Assumed baseline for this file unless the repo already uses GraphQL or tRPC |
| tRPC | Alternate | Common in full-stack TypeScript monorepos; preserves end-to-end type safety |
| GraphQL | Alternate | Appropriate for complex graphs with varied client-side query requirements |

## Detection

Per `references/core/repo-analysis.md`: check for existing API patterns (REST routes, `schema.graphql` files, tRPC routers) before assuming REST.

## Standards (REST Baseline)

### Resource Naming & URL Structure
- Use plural nouns for collections (`/users`, `/orders`), not verbs (`/getUsers`) — HTTP methods specify the action.
- Nest resources to reflect true hierarchy (`/users/:id/orders`), but limit nesting to **maximum 2 levels deep**. Use query filters for deeper queries (`/orders?userId=:id`).
- Use kebab-case for multi-word URL paths (`/user-profiles`).

### HTTP Methods & Status Codes
- `GET`: Read resource, idempotent, safe to retry.
- `POST`: Create a new resource or trigger an action.
- `PUT`: Full resource replacement (idempotent).
- `PATCH`: Partial resource update.
- `DELETE`: Remove a resource (idempotent).
- Status codes: `200` (OK with body), `201` (Created), `204` (No Content), `400` (Bad Request / Validation Error), `401` (Unauthenticated), `403` (Forbidden), `404` (Not Found), `409` (Conflict), `422` (Unprocessable Entity), `429` (Rate Limited), `500` (Internal Server Error).

### Request Validation Boundary
- Validate all incoming request payloads before business logic executes. Return a structured `400` or `422` error response immediately on failure (`references/core/security-owasp.md` A03).

### Consistent Error Response Shape
Use one standardized error shape across the entire API:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required.",
    "details": [
      { "field": "email", "issue": "required" }
    ]
  }
}
```
- `code` is a stable, machine-readable string identifier for client-side branching.
- Never leak stack traces or internal implementation details in production.

### Pagination
- Use cursor-based pagination for large or dynamic collections.
- Set a strict server-side maximum limit for page size (e.g., max 100 items) to prevent DoS.

### Idempotency
- Ensure `PUT` and `DELETE` requests are strictly idempotent.
- For non-idempotent `POST` requests (e.g., payment creation), support an `Idempotency-Key` request header.

## Anti-Patterns

```text
POST /getUserById              --> Verb in URL, incorrect method for a read!
GET  /users?limit=100000       --> No server-side cap on pagination size!
200 OK { "error": "not found" } --> 200 status code used for a failure outcome!
```

```json
// Inconsistent error formats across different routes
{ "err": "bad request" }
{ "message": "Bad Request", "status": 400 }
```

## Related References

- `references/backend/express-architecture.md`
- `references/backend/nestjs-architecture.md`
- `references/backend/auth-authz.md`
- `references/core/security-owasp.md`

## Applies To Modes

- `implement`
- `review`
- `audit`
- `security`