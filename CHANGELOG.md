# Changelog

## [Unreleased]

### Changed

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
