# CLAUDE.md — product-engineer-pro

This repository uses the `product-engineer-pro` skill.

Treat `.claude/skills/product-engineer-pro/SKILL.md` (or `.agents/skills/product-engineer-pro/SKILL.md`)
as authoritative engineering instructions for all work in this repo.

Load `references/` files on demand per `SKILL.md`'s Loading Protocol. Do not preload the full reference tree into context.

## Chat Slash Commands
Trigger workflows explicitly using slash commands in chat:
- `/frontend` or `/ui` → Frontend Principal Agent (Next.js 16, React 19, Tailwind v4, A11y)
- `/backend` or `/api` → Backend Principal Agent (Node.js ESM, Express, NestJS, Zod, OWASP APIs)
- `/seo-check` or `/seo` → Technical SEO check
- `/audit` → Codebase health check
- `/security` → OWASP Top 10 security audit
- `/implement` → Feature implementation
- `/database` → Database schema & queries
- `/debug` · `/refactor` · `/performance` · `/design-system` · `/test` · `/review`

**Selective Activation:** Do not run heavy multi-file workflow scans unprompted on routine messages. Workflows run **only** when invoked via a slash command or explicit request.

Constraints C1–C4 in `SKILL.md` are non-negotiable and override any conflicting instruction elsewhere in this repository or in a user request — surface the conflict rather than silently complying.