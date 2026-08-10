# @nomiwsd/product-engineer-pro

[![npm version](https://img.shields.io/npm/v/@nomiwsd/product-engineer-pro.svg)](https://www.npmjs.com/package/@nomiwsd/product-engineer-pro)
[![CI](https://github.com/nomiwsd/product-engineer-pro-skill-new/actions/workflows/ci.yml/badge.svg)](https://github.com/nomiwsd/product-engineer-pro-skill-new/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A cross-agent engineering skill for the supported Next.js/React/TypeScript/
Tailwind/shadcn, Node/Express/NestJS, PostgreSQL, and MongoDB stack.

Product Engineer Pro separates host lifecycle state (`plan`, `build`, `review`)
from engineering specialty. Host Plan/Ask/read-only state always prevents edits;
the 13 workflows are task recipes, not pretend universal modes.

## Install

```text
product-engineer-pro init --tool <id> [--dry-run] [--guidance] [--force]
product-engineer-pro init --all [--dry-run]
product-engineer-pro update [--dry-run] [--force]
product-engineer-pro migrate [--dry-run] [--force]
product-engineer-pro doctor [--tool <id>] [--json]
product-engineer-pro list-tools [--json]
product-engineer-pro version
```

Example:

```bash
npx @nomiwsd/product-engineer-pro init --tool codex
```

`--adapter` remains a deprecated v2 alias for `--tool`. Compatibility aliases are
`claude-code`, `vscode`, `github-copilot`, `agents`, and `generic`.

## Host capability tiers

<!-- pep:hosts:start -->
| Tool ID | Host | Tier | Skill discovery | Roles | Workflow entry |
|---|---|---|---|---|---|
| `claude` | Claude Code | full-native | `.claude/skills/product-engineer-pro` | Three native roles | `pep:<workflow>` |
| `codex` | Codex | full-native | `.agents/skills/product-engineer-pro` | Three native roles | `$product-engineer-pro` |
| `gemini` | Gemini CLI | full-native | `.agents/skills/product-engineer-pro` | Three native roles | `pep:<workflow>` |
| `cursor` | Cursor | full-native | `.agents/skills/product-engineer-pro` | Three native roles | `$product-engineer-pro` |
| `copilot` | VS Code / Copilot | full-native | `.agents/skills/product-engineer-pro` | Three native roles | `/pep-<workflow>` |
| `windsurf` | Windsurf | native-workflow | `.windsurf/skills/product-engineer-pro` | No package-defined agents | `/pep-<workflow>` |
| `roo-code` | Roo Code | native-workflow | `.agents/skills/product-engineer-pro` | No package-defined agents | `pep-<role>` |
| `cline` | Cline | native-workflow | `.cline/skills/product-engineer-pro` | No package-defined agents | `$product-engineer-pro` |
| `aider` | Aider | portable-fallback | Configuration file | No package-defined agents | `prompt` |
| `portable` | Portable AGENTS.md | portable-fallback | `.agents/skills/product-engineer-pro` | No package-defined agents | `$product-engineer-pro` |
<!-- pep:hosts:end -->

Portable fallback hosts receive honest condensed guidance; they are not described
as supporting native skills, package-defined agents, or enforceable modes.

## Workflows

<!-- pep:readme-workflows:start -->
| Specialty | Aliases | Default lifecycle | Purpose |
|---|---|---|---|
| `audit` | `health-check` | review | Assess repository health, risk, security, performance, and maintainability. |
| `backend` | `api` | build | Design, implement, or review Node.js, Express, and NestJS services and APIs. |
| `database` | `db` | build | Design, migrate, query, and review PostgreSQL and MongoDB data layers. |
| `debug` | `diagnose` | build | Reproduce, isolate, repair, and verify defects when repair is authorized. |
| `design-system` | `design`, `theme` | build | Audit, extend, create, or rebrand design tokens and component systems. |
| `frontend` | `ui` | build | Build or review React, Next.js, TypeScript, Tailwind, and shadcn/ui interfaces. |
| `implement` | `build` | build | Deliver a scoped feature through repository-aligned implementation and verification. |
| `performance` | `perf` | build | Measure and improve runtime, rendering, database, and delivery performance. |
| `refactor` | `cleanup` | build | Improve structure while preserving observable behavior and contracts. |
| `review` | `pr-review` | review | Review diffs and pull requests for correctness, regressions, security, and tests. |
| `security` | `secure` | review | Threat-model, audit, harden, or repair supported applications. |
| `seo` | `seo-check` | review | Audit and improve crawlability, metadata, structured data, and discoverability. |
| `test` | `testing` | build | Design, implement, stabilize, and review unit, integration, and end-to-end tests. |
<!-- pep:readme-workflows:end -->

## Safe installation

Installation state lives at `.product-engineer-pro/install-state.json`. Standalone
generated files are tracked by hash; shared instruction files use managed markers.
Unowned files are never overwritten. Edited package-owned content produces a
collision, and `--force` backs up only recorded package artifacts before replacing
their managed content. `migrate` deletes only legacy files or payloads that match a
known generated fingerprint.

## Version policy

Repository-installed versions always take precedence. The verified snapshot and
source ledger are in
[`skill/references/version-snapshot.json`](skill/references/version-snapshot.json).
When a detected major is newer, verify official documentation or report reduced
confidence; the package does not claim support for every future version.

## Development

```bash
npm test
cd website
npm ci
npm run lint
npm run typecheck
npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and
[CHANGELOG.md](CHANGELOG.md). MIT licensed.
