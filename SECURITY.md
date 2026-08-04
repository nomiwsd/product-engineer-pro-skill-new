# Security Policy

This repository contains **instructional content for AI coding agents**,
not executable application code. "Security issues" here mean instructions
that could cause an AI agent to:

- Produce insecure code (e.g., missing input validation, weak auth defaults).
- Leak or fabricate secrets/credentials.
- Take a destructive or irreversible action without confirmation.
- Bypass the constraints defined in `SKILL.md` (C1–C4).

## Reporting

Open an issue titled `[unsafe-instruction] <short description>` including:
1. The file and section containing the problematic instruction.
2. The specific unsafe behavior it could produce.
3. A suggested correction, if you have one.

Do not include real secrets, live exploit payloads, or working attack
code against third-party systems in your report.

## Scope

In scope: any file under `references/`, `templates/`, `SKILL.md`,
`AGENTS.md`, or `adapters/` that could cause unsafe AI-generated output.

Out of scope: vulnerabilities in the frameworks/libraries this skill
documents (report those to the respective upstream projects — e.g.,
Next.js, Express, NestJS, PostgreSQL, MongoDB).

## Response

Issues will be triaged and, if confirmed, patched with a corresponding
`CHANGELOG.md` entry noting the corrected instruction.