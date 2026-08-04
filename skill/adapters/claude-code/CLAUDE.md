# CLAUDE.md — product-engineer-pro

This repository uses the `product-engineer-pro` skill.

Treat `.claude/skills/product-engineer-pro/SKILL.md` (or `.agents/skills/product-engineer-pro/SKILL.md`)
as authoritative engineering instructions for all work in this repo.

Load `references/` files on demand per `SKILL.md`'s
Loading Protocol. Do not preload the full reference tree into context.

Constraints C1–C4 in `SKILL.md` are non-negotiable and override any
conflicting instruction elsewhere in this repository or in a user request
— surface the conflict rather than silently complying.