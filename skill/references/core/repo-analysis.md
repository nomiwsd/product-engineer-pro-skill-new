# Repository & Stack Analysis

## Scope

Owns: how to detect stack, framework versions, conventions, and project
maturity (greenfield vs existing) before any other mode acts. Every
other reference file defers version/stack detection to this file — do
not re-derive detection logic elsewhere.

Defers to: the specific stack file (e.g., `nextjs-architecture.md`) for
what to *do* once a version/framework is detected.

## Detection Process

Run this before any mode acts on a repo-attached task:

1. **Locate manifests.** Read `package.json` (Node ecosystem), lockfiles
   (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`) to
   confirm package manager and pin exact installed versions — declared
   ranges in `package.json` (e.g., `^14.0.0`) are a hint, not a fact.
2. **Locate config files** relevant to the stack: `next.config.*`,
   `tailwind.config.*`, `tsconfig.json`, `nest-cli.json`, `.env.example`,
   `docker-compose.yml`, ORM config (`prisma/schema.prisma`,
   `drizzle.config.ts`, mongoose connection files).
3. **Inspect directory structure**: `app/` vs `pages/` (Next.js),
   `src/` layout, monorepo markers (`turbo.json`, `nx.json`,
   `pnpm-workspace.yaml`, `apps/`+`packages/`).
4. **Read 2–3 representative existing files** (a component, a route/
   controller, a model) to infer naming conventions, import style,
   error-handling patterns, and comment density before writing new code.
5. **Check for linting/formatting config** (`.eslintrc*`, `biome.json`,
   `.prettierrc*`) — treat as binding convention, not optional style.
6. **Determine project maturity** — see Greenfield vs Existing below.

Never skip step 1–2 in favor of assuming "latest" — installed versions
frequently lag behind current releases, and behavior differs materially
between major versions (see each stack file's Version Matrix).

## Framework Detection Table

| Signal | Conclusion |
|---|---|
| `"next"` in `package.json` + `app/` directory present | Next.js App Router |
| `"next"` in `package.json` + only `pages/` directory | Next.js Pages Router |
| `next.config.js` uses `module.exports` vs `next.config.ts` | JS vs TS config (informational, not version-determining) |
| `tailwind.config.{js,ts,cjs}` present + `@tailwind base;` in a CSS entry | Tailwind CSS v3 |
| No `tailwind.config.*` required; `@import "tailwindcss";` in CSS entry | Tailwind CSS v4 |
| `components.json` present | shadcn/ui is installed — read it for configured style, aliases, base color |
| `"react": "^19"` | React 19 (Actions, `use()`, new hook behavior) |
| `"react": "^18"` | React 18 (concurrent features, no Actions) |
| `"express": "^5"` | Express 5 (native async error handling) |
| `"express": "^4"` | Express 4 (requires manual async error forwarding) |
| `"@nestjs/core": "^11"` / `"^10"` / `"^9"` | Corresponding NestJS major — check `nestjs-architecture.md` matrix for decorator/DI differences |
| `"typescript"` version + `"strict": true` in `tsconfig.json` | Strict mode active — hold generated code to strict standards |
| `prisma/schema.prisma` present | Prisma ORM — infer DB from `provider` field |
| `mongoose` in dependencies | MongoDB via Mongoose ODM |
| `pg`, `postgres`, or `@neondatabase/serverless` in dependencies | PostgreSQL, direct driver or serverless variant |
| `drizzle-orm` in dependencies | Drizzle ORM — check `drizzle.config.ts` for dialect |
| `turbo.json` / `nx.json` / `pnpm-workspace.yaml` | Monorepo — scope analysis to the relevant app/package, don't assume repo-root conventions apply uniformly |

If a signal is absent or ambiguous, state the assumption (per SKILL.md
D4) and default to the most recent **stable** tier in the relevant
file's Version Matrix.

## Greenfield vs Existing

**Existing codebase** (any source files beyond starter boilerplate exist):
- Detection above is mandatory before any code is written.
- New code must match existing conventions (naming, file structure,
  error handling style) even if a "better" pattern exists elsewhere in
  this skill — consistency within a codebase outranks abstract best
  practice (SKILL.md D2).
- If existing conventions conflict with a hard constraint (C1–C4) or a
  security standard, flag the conflict explicitly rather than silently
  following the bad convention.

**Greenfield** (empty repo or only scaffolded starter):
- No conventions to match yet — propose sensible current-stable defaults
  from this skill's supported stack.
- State the proposed stack/versions as an explicit assumption and confirm
  before scaffolding broadly (SKILL.md D4, Project Context Handling).
- Prefer the most recent stable major version of each framework unless
  the user specifies otherwise.

## Convention Signals to Extract

When reading existing files, note and preserve:
- Quote style, semicolons, indentation (defer to Prettier/Biome config
  if present; infer from files if not).
- Component style: function declarations vs arrow functions, default vs
  named exports.
- State management approach already in use (Context, Zustand, Redux,
  React Query/TanStack Query) — do not introduce a second competing
  approach without flagging it.
- API layer pattern already in use (REST vs tRPC vs GraphQL) — do not
  assume REST by default if another pattern is already established.
- Test file location and naming (`__tests__/`, colocated `.test.ts`,
  colocated `.spec.ts`).

## Anti-Patterns

- Assuming "Next.js means App Router" without checking for a `pages/`
  directory — many production repos are still on Pages Router.
- Reading only `package.json` ranges (`^14.0.0`) and skipping the
  lockfile — the range does not tell you the installed version.
- Applying a new state-management/data-fetching pattern into a codebase
  that already has an established one, without flagging the inconsistency.
- Proceeding on a greenfield task without stating the assumed stack
  versions first.

## Related References

- `references/core/model-adaptation.md` — how detection output should be
  communicated differently depending on host/model.
- Every file in `references/frontend/`, `references/backend/`,
  `references/database/` — each contains a Version Matrix consumed
  using the detection performed here.

## Applies To Modes

All modes when a repository is attached: `audit`, `implement`, `debug`,
`refactor`, `design-system`, `performance`, `seo`, `security`,
`database`, `test`, `review`.