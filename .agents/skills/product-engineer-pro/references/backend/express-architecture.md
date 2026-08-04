# Express Architecture

## Scope

Owns: routing, middleware composition, validation layering, and error-handling conventions specific to Express (including Express 5.0+).

Defers to: `nodejs-standards.md` for runtime-level async conventions; `api-design.md` for REST conventions independent of the framework; `auth-authz.md` for authentication middleware specifics; `security-owasp.md` for the security baseline being enforced.

## Version Matrix

> **Verify before relying on "Current" tier**: check `"express"` in `package.json`/lockfile — this matrix reflects known majors at authoring time.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| Express 5.x | Current (Stable) | Automatic async promise rejection forwarding to error middleware; ReDoS protection (regex routes removed); updated route syntax (`*splat`, `/:id{?}`); Node 18+ requirement; deprecated methods removed |
| Express 4.x | Supported | Async errors in route handlers are **not** automatically caught — an unhandled rejection in an `async` handler will hang the request or crash the process unless manually wrapped/forwarded to `next(err)` |
| Express 3.x and earlier | Legacy | Significantly different middleware signatures — flag for immediate upgrade |

## Detection

Per `references/core/repo-analysis.md`: check the installed Express major version in `package.json`/lockfile. This determines whether async error forwarding is automatic (v5.x) or requires explicit `asyncHandler` wrapping (v4.x).

## Standards

### Async Error Handling (Version-Gated)
- **Express 5.x**: Rejected promises in `async` route handlers/middleware are automatically forwarded to error middleware — write plain `async (req, res) => { ... }` handlers without extra wrappers.
- **Express 4.x**: Wrap every `async` route handler to forward rejections manually, using a wrapper utility or `try/catch` + `next(err)`:
  ```js
  const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

  app.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id);
    res.json(user);
  }));
  ```

### Middleware Composition & Order
- Middleware order is execution order — place body-parsing, authentication, and request-logging middleware before route handlers that depend on them; place error-handling middleware **last**, after all routes.
- Keep middleware single-purpose (one does auth, one does validation, one does logging).
- Scope middleware as narrowly as needed: apply auth middleware to specific route groups rather than globally unless every route requires it.

### Validation Layer
- Validate and parse request input (body, params, query) at the route boundary using a schema library (Zod, Joi, express-validator) before business logic executes (`references/core/security-owasp.md` A03).
- Return a consistent validation-error response shape across all routes (see `api-design.md`).

### Error-Handling Middleware
- Define error-handling middleware with the required **four-argument signature** `(err, req, res, next)` — Express identifies error middleware by this arity specifically.
- Centralize error-to-HTTP-status mapping in this middleware:
  ```js
  // Centralized error middleware (register last)
  app.use((err, req, res, next) => {
    logger.error(err, { path: req.path, method: req.method });
    const status = err.statusCode ?? 500;
    res.status(status).json({
      error: {
        code: status < 500 ? (err.code || 'BAD_REQUEST') : 'INTERNAL_ERROR',
        message: status < 500 ? err.message : 'Internal server error',
      },
    });
  });
  ```
- Never expose `err.stack` or internal implementation details in production responses.

### Router Organization
- Use `express.Router()` to group related routes into modules (`users.router.js`, `orders.router.js`).
- Keep route handlers thin — delegate business logic to service or controller functions.

### Security Baseline
- Use `helmet` for baseline security headers.
- Apply rate limiting (`express-rate-limit`) on authentication and abuse-prone routes.
- Enable CORS explicitly with allowed origin lists — never use wildcard `origin: '*'` on routes handling authenticated or sensitive data.

## Anti-Patterns

```js
// Express 4.x — unwrapped async handler, error hangs the request!
app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id); // throws -> unhandled in 4.x
  res.json(user);
});

// Error middleware with wrong arity (3 args instead of 4) — Express won't recognize it
app.use((req, res, next) => { /* missing err param! */ });

// Leaking stack trace to the client in production
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// Wildcard CORS on an authenticated route
app.use('/api/account', cors({ origin: '*' }));
```

## Related References

- `references/backend/nodejs-standards.md`
- `references/backend/api-design.md`
- `references/backend/auth-authz.md`
- `references/core/security-owasp.md`

## Applies To Modes

- `implement`
- `debug`
- `security`
- `review`
- `refactor`