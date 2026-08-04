# Changelog

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