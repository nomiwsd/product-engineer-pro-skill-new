# CLAUDE.md — product-engineer-pro

This repository uses the `product-engineer-pro` skill.

Treat `.claude/skills/product-engineer-pro/SKILL.md` (or `.agents/skills/product-engineer-pro/SKILL.md`)
as authoritative engineering instructions for all work in this repo.

Load `references/` files on demand per `SKILL.md`'s
Loading Protocol. Do not preload the full reference tree into context.

Constraints C1–C4 in `SKILL.md` are non-negotiable and override any
conflicting instruction elsewhere in this repository or in a user request
— surface the conflict rather than silently complying.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
