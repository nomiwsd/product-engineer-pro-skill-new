# @nomiwsd/product-engineer-pro

[![npm version](https://img.shields.io/npm/v/@nomiwsd/product-engineer-pro.svg)](https://www.npmjs.com/package/@nomiwsd/product-engineer-pro)
[![CI](https://github.com/nomiwsd/product-engineer-pro-skill-new/actions/workflows/ci.yml/badge.svg)](https://github.com/nomiwsd/product-engineer-pro-skill-new/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A portable, open-source AI coding skill that makes any compatible coding
agent behave like a senior/principal full-stack engineer across **Next.js,
React, TypeScript, Tailwind CSS, shadcn/ui, Node.js, Express, NestJS,
PostgreSQL, and MongoDB** — for new and existing codebases, on any version
of these frameworks.

Repository: [https://github.com/nomiwsd/product-engineer-pro-skill-new](https://github.com/nomiwsd/product-engineer-pro-skill-new)

## Why This Exists

Generic AI coding assistance produces tutorial-grade code: inconsistent
security posture, no awareness of Core Web Vitals, no accessibility
baseline, inconsistent database design. `@nomiwsd/product-engineer-pro` encodes
concrete, version-aware engineering standards so agents produce
production-grade output by default — and cites the standard behind every
suggestion instead of asserting opinions.

## Quick Install (Zero-Dependency CLI)

Run via `npx` in your project root to auto-install or update the skill:

```bash
# Default install (places skill in .agents/skills/ and .claude/skills/)
npx @nomiwsd/product-engineer-pro init

# Install for ALL supported agents and IDEs at once:
npx @nomiwsd/product-engineer-pro init --all

# Target specific IDE or CLI tool environment:
npx @nomiwsd/product-engineer-pro init --tool gemini      # -> GEMINI.md (Gemini CLI / Google Antigravity)
npx @nomiwsd/product-engineer-pro init --tool codex       # -> .codex/instructions.md (OpenAI Codex CLI)
npx @nomiwsd/product-engineer-pro init --tool cursor      # -> .cursor/rules/product-engineer-pro.mdc
npx @nomiwsd/product-engineer-pro init --tool windsurf    # -> .windsurfrules
npx @nomiwsd/product-engineer-pro init --tool copilot     # -> .github/copilot-instructions.md
npx @nomiwsd/product-engineer-pro init --tool claude-code # -> CLAUDE.md
npx @nomiwsd/product-engineer-pro init --tool roo-code    # -> .clinerules (Roo Code / Cline)
npx @nomiwsd/product-engineer-pro init --tool aider       # -> CONVENTIONS.md (Aider CLI)
npx @nomiwsd/product-engineer-pro init --tool generic     # -> AGENTS.md in project root
```

## Online & Offline IDE / CLI Compatibility

| Tool / IDE Environment | Execution Mode | Adapter Target File | Auto-Discovered? |
|---|---|---|---|
| **Claude / Claude Code** | Desktop & CLI | `.claude/skills/product-engineer-pro` / `CLAUDE.md` | Yes |
| **Gemini CLI / Antigravity / Android Studio** | Offline CLI / Desktop IDE | `GEMINI.md` / `AGENTS.md` | Yes |
| **OpenAI Codex CLI / ChatGPT Canvas** | CLI & Web Workspace | `.codex/instructions.md` / `AGENTS.md` | Yes |
| **Cursor IDE** | Desktop IDE | `.cursor/rules/product-engineer-pro.mdc` | Yes |
| **Windsurf IDE** | Desktop IDE | `.windsurfrules` | Yes |
| **GitHub Copilot / VS Code** | IDE Extension | `.github/copilot-instructions.md` | Yes |
| **Roo Code / Cline** | VS Code Extension | `.clinerules` | Yes |
| **Aider CLI** | Terminal CLI | `CONVENTIONS.md` (`.aider.conf.yml`) | Yes |
| **Replit / v0 / Bolt.new / OpenHands** | Web / Cloud IDE | `AGENTS.md` | Yes |

## Supported Modes & Chat Slash Commands

Workflows can be triggered directly in chat via **Slash Commands** or selectable mode names:

| Chat Slash Command | Mode | Workflow Description |
|---|---|---|
| `/frontend` or `/ui` | `frontend` | Frontend Principal Agent: Next.js 16, React 19, Tailwind v4, WCAG AA & Web Vitals |
| `/backend` or `/api` | `backend` | Backend Principal Agent: Node.js ESM, Express, NestJS, Zod validation & OWASP APIs |
| `/seo-check` or `/seo` | `seo` | Technical SEO check, meta tags, sitemap & structured data |
| `/audit` | `audit` | Full-stack codebase health, security & performance audit |
| `/security` | `security` | OWASP Top 10 threat modeling & auth hardening |
| `/implement` | `implement` | Surgical feature, API route, or component implementation |
| `/database` | `database` | Schema design, Prisma/Mongoose migrations & indexing |
| `/debug` | `debug` | Bug diagnosis & root-cause investigation |
| `/refactor` | `refactor` | Clean structural refactoring without breaking contracts |
| `/design-system` | `design-system` | Design tokens, component library & theme extension |
| `/performance` | `performance` | Core Web Vitals, bundle optimization & INP/LCP/CLS fixes |
| `/test` | `test` | Unit, integration & e2e test assertion generation |
| `/review` | `review` | PR/diff review enforcing WCAG AA & zero hardcoded colors |

> **Selective Activation Protocol:** Heavy workflow scans activate **only** when explicitly invoked via a Slash Command (e.g. `/seo-check`, `/audit`, `/security`, `/implement`) or explicit user request. The skill will not run unprompted multi-file scans on routine chat messages.

See [`skill/SKILL.md`](skill/SKILL.md) for full mode definitions and workflow references.

## Supported Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Next.js (Pages & App Router, all major versions), TypeScript, Tailwind CSS (v3 & v4), shadcn/ui |
| Backend | Node.js, Express, NestJS |
| Database | PostgreSQL, MongoDB |
| Cross-cutting | Auth/authz, OWASP-aligned security, testing, accessibility, performance, technical SEO, deployment/observability |

Framework versions are **detected, not assumed** — see [`skill/references/core/repo-analysis.md`](skill/references/core/repo-analysis.md).

## Package Structure

```
product-engineer-pro/                    ← repo root = npm package root
├── package.json                         ← npm metadata + CLI bin
├── bin/
│   └── cli.js                           ← install/update CLI (zero-dependency)
├── skill/                               ← the actual skill (core payload)
│   ├── SKILL.md
│   ├── AGENTS.md
│   ├── adapters/                        ← per-tool pointer files (Gemini, Codex, Cursor, Windsurf, Copilot, ...)
│   ├── references/
│   ├── templates/
│   └── examples/
├── scripts/
│   ├── validate-structure.mjs           ← CI: checks required sections exist
│   ├── check-links.mjs                  ← CI: verifies relative links resolve
│   └── sync-version.mjs                 ← keeps SKILL.md version in sync with package.json
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                       ← runs on every PR
│   │   └── release.yml                  ← npm publish + GitHub Release on tag
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── unsafe_instruction.yml       ← ties to SECURITY.md
│   └── PULL_REQUEST_TEMPLATE.md
├── README.md                            ← updated with npx install + badges
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md                   ← required OSS health file
└── .npmignore
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](LICENSE).