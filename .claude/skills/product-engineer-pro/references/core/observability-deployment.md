# Observability & Deployment

## Scope

Owns: framework-agnostic logging, monitoring, CI/CD, and deployment
principles applicable to any service in this skill's supported stack.

Defers to: `security-owasp.md` (A09) for what security-relevant events
must be logged; stack-specific files for concrete tool/library choices
(e.g., a specific logger package) where the project already has one.

## Logging

- Use structured logging (JSON or key-value, not free-text
  concatenation) in any service expected to run in production —
  enables querying/alerting on fields.
- Standard levels, used consistently: `debug` (dev-only detail),
  `info` (normal operational events), `warn` (recoverable/unexpected but
  non-fatal), `error` (failed operation requiring attention), `fatal`
  (process cannot continue).
- Never log secrets, full credit card numbers, passwords, or full auth
  tokens — redact or omit (ties to C4 and OWASP A09).
- Include correlation/request IDs in logs to trace a single request
  across services/layers.
- Log the "why" context alongside errors (input that caused it, user/
  request ID) — a bare stack trace with no context is hard to act on.

## Error Tracking

- Unhandled exceptions and rejected promises in production must reach an
  error-tracking mechanism (even a minimal one) — never disappear
  silently into a process crash with no record.
- Group/deduplicate errors by type+location, not by raw message, to
  avoid alert noise from parameterized messages.

## Health Checks & Readiness

- Every deployed service exposes a lightweight health/liveness endpoint
  that doesn't depend on downstream services (fast, always-available
  check that the process itself is running).
- A separate readiness check (if applicable) may verify downstream
  dependencies (DB connectivity) before accepting traffic.

## CI/CD Principles

- Every change to a shared branch runs: linting, type-checking, and the
  test suite before merge is allowed — a broken build blocks merge.
- Build artifacts are immutable — the same built artifact that passed CI
  is what gets deployed (build once, deploy everywhere), not rebuilt per
  environment.
- Environment-specific values are injected via environment variables/
  secrets management, never baked into the build artifact or committed
  to source (C4).
- Migrations run as an explicit, ordered step in the deployment pipeline
  — never implicitly via "sync on app start" in production.

## Deployment Strategy

- Prefer zero-downtime deployment strategies (rolling, blue-green, or
  canary) for user-facing production services over hard cutover.
- Any deployment introducing a schema change coordinates
  backward-compatible ordering: expand (add new schema/code path) →
  migrate → contract (remove old path) — never a single step that breaks
  the old and new code paths simultaneously mid-deploy.
- Feature flags are the preferred mechanism for decoupling deployment
  from release when a change carries meaningful risk.

## Rollback

- Every deployment must have a known, fast rollback path (previous
  artifact redeploy, feature flag off) before it ships — don't design a
  one-way deployment for anything user-facing.
- Destructive schema migrations are not immediately rollback-safe by
  default — sequence them behind a backward-compatible expand/contract
  window (see above), consistent with C2.

## Monitoring & Alerting

- Alert on symptoms that matter to users (error rate, latency, Core Web
  Vitals field data, saturation) — not on every possible internal metric.
- Every alert has a clear, actionable next step; alerts with no action
  attached become noise and get ignored.
- Track deployment markers on dashboards so a regression can be
  correlated to a specific release.

## Anti-Patterns

- Logging a caught error with `console.log(err)` and nothing else — no
  context, unstructured, easy to miss in production log volume.
- Running database migrations automatically on every app boot in
  production with no ordering guarantee across multiple instances.
- A single alert threshold copy-pasted across every service regardless
  of that service's actual traffic/latency profile.
- Deploying a breaking schema change and new application code in the
  same atomic step with no expand/contract window.

## Related References

- `references/core/security-owasp.md` (A09 — logging & monitoring failures)
- `references/database/postgresql-design.md` (migration sequencing)
- `references/database/mongodb-design.md` (migration sequencing)

## Applies To Modes

`audit`, `implement`, `security`, `database`, `review`.