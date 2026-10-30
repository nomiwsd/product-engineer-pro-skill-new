# Workflow: Backend

## Goal

Plan, build, or review Node.js, Express, and NestJS services whose contracts are explicit,
whose every trust boundary is validated and authorized, and whose failure behavior is
predictable — while matching the repository's module system, framework, validation library,
persistence layer, and error contract.

## Detect first

- Node.js version, ESM or CommonJS, framework and major (Express or NestJS), HTTP adapter,
  validation library, auth mechanism, persistence layer, logger, test runner, config loading.
- The existing request/response and error shape that clients already depend on (D2).

## Lifecycle behavior

- `plan`: the contract (method, path, schemas, status codes, errors), files to change, auth
  rules, data access, and exact checks. No edits (L1).
- `build`: implement the contract with tests for the success and failure paths.
- `review`: findings on contracts, validation, authorization, errors, and resilience with
  `file:line` evidence. No edits.

## Process

1. Run `references/core/repo-analysis.md`; state the detected versions (V2).
2. Define the contract before editing (`references/backend/api-design.md`) and keep it
   compatible with existing clients.
3. Parse and validate body, params, query, headers, and environment variables at their
   boundary with the repository's existing validator (Zod, Joi, express-validator, Nest pipes),
   or with explicit checks when there is none. Check every field's presence, type, and range
   before any service call, and reject failures with 400 or 422 (for example, a quantity must be a
   positive integer). Validate configuration at startup and fail fast.
4. Authenticate, then authorize each resource with ownership derived from trusted server-side
   identity (`references/backend/auth-authz.md`). Never trust client-supplied IDs or roles.
5. Keep controllers and route handlers thin: parse, call a service, map the result. Business
   logic lives in testable services (`references/backend/express-architecture.md` or
   `references/backend/nestjs-architecture.md`).
6. Return the repository's error shape (RFC 9457 Problem Details for greenfield) without stack
   traces or internals; handle async errors as the detected framework requires.
7. Add resilience where the change needs it: timeouts on outbound calls, idempotency for
   retried mutations, pagination for collections, payload limits, rate limits on auth and
   expensive endpoints.
8. Log with structure and a request ID, never secrets or personal data; keep health checks and
   graceful shutdown intact (`references/core/observability-deployment.md`).
9. Use parameterized queries, deliberate transactions, and no N+1 access in list endpoints
   (load only the detected database reference).

## Version gates

| Detected | Then |
|---|---|
| Express 5 | Rejected promises reach error middleware automatically; route syntax changed (`*splat`, `/:id{?}`) |
| Express 4 | Wrap async handlers or forward errors with `next(err)`; unhandled rejections hang requests |
| NestJS 12 | Core packages are ESM-only; Jest needs Node.js 24.9+ (or use Vitest); follow the official 11→12 migration guide |
| NestJS 11 or earlier | Keep the project's existing module format and test runner |
| Zod 3 vs 4 | Use the installed major's API for errors and top-level helpers; do not mix |
| ESM vs CommonJS | Follow `"type"` in `package.json` and existing file extensions |

## Best-practice checklist

- [ ] Contract defined and backward compatible, or the break is flagged for confirmation.
- [ ] Every untrusted input, including environment variables, is parsed and validated.
- [ ] Authentication and resource-level authorization are both enforced server-side.
- [ ] Errors follow the existing public shape and leak no internals.
- [ ] Outbound calls have timeouts; retried mutations are idempotent; collections paginate.
- [ ] Logs are structured and contain no secrets, tokens, or personal data.
- [ ] Queries are parameterized and scoped; transactions are deliberate; no N+1 in lists.
- [ ] Tests cover success, invalid input (400/422), unauthenticated (401), and forbidden (403).

## Evidence required

Type check, unit tests for services, and an integration test (Supertest or the Nest testing
module) for the endpoint contract including the failure paths; a representative request when
the host allows it. Report each check as passed, failed, or not run (E2).

## Stop conditions

Stop and report if the change breaks an existing client contract, needs a new auth model, a
database migration (switch to `database`), or a module-system, validator, or framework change.

## Never

- Authorize from `req.body.userId` or any other client-supplied identity.
- Pass `req.body`, `req.query`, or `req.params` fields to a service or store before validating them.
- Change the module system, validator, ORM, or public error shape as a side effect (ED4).
- Swallow errors or return `200` for failures.

## Output

`build`: the implemented contract and changed files first, then the verification ledger and
residual risks. `plan`: decision-complete file-level plan. `review`: findings by severity.

## References

- `references/core/operating-rules.md`
- `references/backend/nodejs-standards.md`
- `references/backend/express-architecture.md`
- `references/backend/nestjs-architecture.md`
- `references/backend/api-design.md`
- `references/backend/auth-authz.md`
- `references/core/security-owasp.md`
- `references/core/observability-deployment.md`
- PostgreSQL/MongoDB: load only the detected database reference
