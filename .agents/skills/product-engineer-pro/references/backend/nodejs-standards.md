# Node.js Standards

## Scope

Owns: runtime-level conventions — module system, async patterns, built-in APIs, config/env handling — applicable underneath both Express and NestJS.

Defers to: `express-architecture.md`/`nestjs-architecture.md` for framework-layer conventions; `security-owasp.md` for security baseline.

## Version Matrix

> **Verify before relying on "Current" tier**: check the installed version via `.nvmrc`/`package.json` `engines` field/lockfile — this matrix reflects known LTS lines at authoring time.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| Node.js 24.x & 22.x | Current (Active LTS) | Stable native `fetch`, native test runner (`node:test`) stable, `--env-file` for `.env` loading without dependencies, native `WebSocket` client, `fs.glob` support, experimental `require()` of ESM modules |
| Node.js 20.x | Supported (Maintenance LTS) | Native `fetch` stable, native test runner stable, `--env-file` available (20.6+) |
| Node.js 18.x | Legacy (EOL) | Native `fetch`/test runner experimental depending on minor version — flag for upgrade in audits |
| Node.js 16.x and earlier | Legacy (EOL) | No native `fetch` — requires `node-fetch`/`axios`; flag for immediate upgrade |

## Detection

Per `references/core/repo-analysis.md`: check `.nvmrc`, `package.json` `engines.node`, and CI config for the targeted Node version. Don't assume native `fetch` or the native test runner are available without confirming the actual runtime version.

## Standards

### Module System
- Match the existing module system (`"type": "module"` = ESM, otherwise CommonJS) — don't introduce `import`/`export` syntax into a CommonJS project or vice versa without an explicit, confirmed migration.
- In ESM, relative imports require explicit file extensions (`./util.js`, not `./util`) even when importing a `.ts` source file compiled to `.js`.
- Avoid mixing `require()` and `import` in the same file.

### Async Patterns
- Prefer `async`/`await` over raw `.then()` chains for readability; reserve `Promise.all`/`Promise.allSettled` explicitly for genuinely parallelizable independent operations.
- Never leave a floating (unawaited, unhandled) promise — either `await` it, explicitly `.catch()` it, or explicitly mark it as fire-and-forget with an explanatory comment.
- Use `Promise.allSettled` (not `Promise.all`) when partial failure among parallel operations is acceptable and shouldn't abort the rest.
- Avoid the `async` executor anti-pattern (`new Promise(async (resolve) => {...})`) — it swallows errors silently; use a plain async function instead.

### Built-in APIs (version-gated)
- Prefer native `fetch` over adding an external HTTP client dependency for simple request needs on confirmed Node 18+ runtimes.
- Use `--env-file` (Node 20.6+) instead of adding `dotenv` as a dependency in new projects targeting compatible runtimes.
- Use native `fs.glob` / `fs.promises.glob` (Node 22+) for glob file searching.

### Configuration & Environment
- All environment-specific values (API keys, DB URLs, feature flags) must come from environment variables (C4 constraint).
- Validate required environment variables at process startup (fail fast with a clear error) rather than failing deep in the request lifecycle when accessed.
- Provide a `.env.example` file (with placeholder values, never real secrets) documenting required variables.

### Error Handling at the Process Level
- Register `process.on('unhandledRejection', ...)` and `process.on('uncaughtException', ...)` handlers in long-running services to log errors with context before exiting.
- Treat uncaught exceptions as fatal — log, clean up, and exit, letting the process orchestrator restart the container/process.

### File System & Paths
- Always use `path.join`/`path.resolve` for constructing file paths — never manual string concatenation with `/` or `\`.

## Anti-Patterns

```js
// Floating unhandled promise
someAsyncFn(); // no await, no catch — errors vanish silently

// async Promise executor anti-pattern
new Promise(async (resolve) => {
  const data = await fetchData(); // throws here are swallowed!
  resolve(data);
});

// Manual path concatenation vulnerable to traversal
const filePath = basePath + '/' + userSuppliedName;

// Accessing an unvalidated env var deep in request logic
function handler(req, res) {
  const key = process.env.API_KEY; // should be validated at startup
  if (!key) throw new Error('missing key');
}
```

## Related References

- `references/backend/express-architecture.md`
- `references/backend/nestjs-architecture.md`
- `references/core/observability-deployment.md`
- `references/core/security-owasp.md`

## Applies To Modes

- `implement`
- `debug`
- `refactor`
- `review`
- `audit`