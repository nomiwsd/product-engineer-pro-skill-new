# Changelog

## [Unreleased]

### Added

- `references/core/operating-rules.md`: the universal rules every workflow applies —
  constraints (C), engineering defaults (D), editing discipline (ED), evidence (E),
  versions (V), and lifecycle (L). All rule citations in the skill now resolve to it, and
  portable and Aider hosts receive the non-negotiable rules directly.
- Every workflow recipe follows one template: goal, detection, lifecycle behavior, process,
  version gates, best-practice checklist, evidence required, stop conditions, anti-patterns,
  output, and references. The validator enforces the template, rule IDs, and that framework
  versions appear only in version gates.

### Changed

- The `frontend` recipe no longer assumes Next.js 16, React 19, or Tailwind 4; version-specific
  APIs are gated on the detected version. Recipes add state coverage, form and client-security
  checks (frontend), contracts, resilience and logging (backend), rollback and lock safety
  (database), secure defaults and regression tests (security), and named-metric evidence
  (performance).
- Templates show component states, owner-scoped reads, batched backfills, and AAA tests.

- Version snapshot schema 2: every entry records its value, meaning, official source,
  check date, and status. All entries re-verified on 2026-10-29: NestJS 12, MongoDB 9.0,
  Node.js 26 Active LTS, and newer minors for Next.js, React, shadcn, Express, Zod, Prisma
  (7.10.1 stable; 8.0 release candidate noted as preview), and Mongoose.
- `check-freshness` now fails an offline run when an entry is older than 90 days, reports
  sources it cannot read as unverified instead of passing, ignores prerelease versions, and
  can print a Markdown report.
- The weekly freshness workflow posts readable Markdown reports to its drift issue and job
  summary.
- CI tests Node.js 18 (declared minimum), 22, 24, and 26; Node.js 20 left the matrix after
  reaching end of life. The `engines` range is unchanged.
- Added COMPATIBILITY.md and aligned the README version policy wording.
- CI uses `actions/checkout` and `actions/setup-node` v7, fails if the checks modify the
  repository, runs a packed-tarball smoke test, and tests Windows CRLF checkouts on
  Node.js 18 and 24.
- Unknown tools now list the supported tool IDs, and unknown commands are named in the error.
- Added AGENT-CAPABILITY-MATRIX.md, recording which hosts have been tested end to end.

### Fixed

- Repeat `init` or `update` for Aider no longer breaks `.aider.conf.yml`; an inline `read:`
  value is preserved and reported instead of edited.
- Files checked out with CRLF line endings are no longer reported as edited, and `migrate`
  recognises CRLF copies of known legacy files.
- An unreadable install state is reported by `doctor`, refused by `update`, and backed up
  before `init` rebuilds it. A state written by a newer CLI is never overwritten.
- `npm test` passes on Windows checkouts, including Node.js 18, and the link check ignores
  local-only folders.
- Website: Next.js upgraded to 16.4.3, clearing a critical advisory and five high transitive
  ones, and the hero version badge now reads from the generated catalog.

## [2.0.1] — 2026-08-10

### Changed

- Rebuilt installation around a canonical manifest with 13 workflow recipes and
  separate plan/build/review lifecycle roles.
- Added capability-tiered native integrations for Claude Code, Codex, Gemini CLI,
  Cursor, VS Code/Copilot, Windsurf, Roo Code, Cline, Aider, and portable hosts.
- Added hash ownership state, managed merges, collision reports, recoverable force
  backups, migration fingerprints, full updates, doctor, JSON output, and aliases.
- Updated the verified version snapshot and OWASP Top 10:2025 mapping; repaired
  unsafe/inaccurate templates and removed unsupported performance guarantees.

## [1.1.2] — 2026-08-06

### Added
- Maintenance update for version 1.1.2.


## [1.1.1] — 2026-08-05

### Added
- Maintenance update for version 1.1.1.


## [1.1.0] — 2026-08-04

### Added
- Maintenance update for version 1.1.0.


## [1.0.2] — 2026-08-04

### Added
- Maintenance update for version 1.0.2.


## [1.0.1] — 2026-08-04

### Added
- Maintenance update for version 1.0.1.


All notable changes to this skill are documented here. Framework version
support additions are logged explicitly so users can confirm coverage.

## [1.0.0] — Initial Release & Multi-IDE Package

### Added
- Portable AI engineering skill supporting Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Node.js, Express, NestJS, PostgreSQL, and MongoDB.
- 11 supported modes: `audit`, `implement`, `debug`, `refactor`, `design-system`, `performance`, `seo`, `security`, `database`, `test`, `review`.
- Zero-dependency installer CLI (`npx product-engineer-pro`) supporting multi-tool adapters (`claude`, `gemini`, `codex`, `cursor`, `windsurf`, `copilot`, `claude-code`, `roo-code`, `aider`, `generic`).
- `skill/` directory layout with rule-based identity (`C1–C4`, `D1–D6`), progressive loading references, templates, and worked examples.
- Automated CI scripts (`validate-structure.mjs`, `check-links.mjs`, `sync-version.mjs`).
- Open-source health documentation: `README.md`, `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
- GitHub Actions CI & Release workflows (`.github/workflows/ci.yml`, `.github/workflows/release.yml`) and issue/PR templates.
