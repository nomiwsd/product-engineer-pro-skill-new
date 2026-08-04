# product-engineer-pro

[![npm version](https://img.shields.io/npm/v/product-engineer-pro.svg)](https://www.npmjs.com/package/product-engineer-pro)
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
baseline, inconsistent database design. `product-engineer-pro` encodes
concrete, version-aware engineering standards so agents produce
production-grade output by default — and cites the standard behind every
suggestion instead of asserting opinions.

## Quick Install (Zero-Dependency CLI)

Run via `npx` in your project root to auto-install or update the skill:

```bash
# Default install (places skill in .claude/skills/product-engineer-pro)
npx product-engineer-pro init

# Target specific IDE or CLI tool environment:
npx product-engineer-pro init --tool gemini      # -> GEMINI.md (Gemini CLI / Google Antigravity)
npx product-engineer-pro init --tool codex       # -> .codex/instructions.md (OpenAI Codex CLI)
npx product-engineer-pro init --tool cursor      # -> .cursor/rules/product-engineer-pro.mdc
npx product-engineer-pro init --tool windsurf    # -> .windsurfrules
npx product-engineer-pro init --tool copilot     # -> .github/copilot-instructions.md
npx product-engineer-pro init --tool claude-code # -> CLAUDE.md
npx product-engineer-pro init --tool roo-code    # -> .clinerules (Roo Code / Cline)
npx product-engineer-pro init --tool aider       # -> CONVENTIONS.md (Aider CLI)
npx product-engineer-pro init --tool generic     # -> AGENTS.md in project root
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

## Supported Modes

`audit` · `implement` · `debug` · `refactor` · `design-system` ·
`performance` · `seo` · `security` · `database` · `test` · `review`

See [`skill/SKILL.md`](skill/SKILL.md) for full mode definitions and selection logic.

## Supported Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Next.js (Pages & App Router, all major versions), TypeScript, Tailwind CSS (v3 & v4), shadcn/ui |
| Backend | Node.js, Express, NestJS |
| Database | PostgreSQL, MongoDB |
| Cross-cutting | Auth/authz, OWASP-aligned security, testing, accessibility, performance, technical SEO, deployment/observability |

Framework versions are **detected, not assumed** — see [`skill/references/core/repo-analysis.md`](skill/references/core/repo-analysis.md).

## How It Works

1. `skill/SKILL.md` — entry point: identity, constraints, mode registry, routing logic.
2. `skill/references/core/` — universal standards (security, testing, a11y, performance, SEO, repo/version detection, model calibration).
3. `skill/references/{frontend,backend,database}/` — stack-specific standards, each with a Version Matrix so old and new projects are both supported correctly.
4. `skill/references/workflows/` — one process file per mode, linking to only the standards relevant to the detected stack.
5. `skill/templates/` — adaptable scaffolds. `skill/examples/` — worked examples and a self-evaluation rubric.

Files are loaded progressively (SKILL.md → repo analysis → matched workflow → only the referenced standards) — not all at once.

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

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Highlights:
- New framework versions are added as Version Matrix rows — never as
  rewrites that drop older support.
- No standard may be duplicated across two files — link, don't repeat.
- Every new mode requires a workflow file, a `SKILL.md` registry entry,
  and at least one evaluation case.

## Code of Conduct & Security

- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — Contributor Covenant v2.1.
- [`SECURITY.md`](SECURITY.md) — Security policy for reporting unsafe agent instructions.

## License

MIT — see [`LICENSE`](LICENSE).