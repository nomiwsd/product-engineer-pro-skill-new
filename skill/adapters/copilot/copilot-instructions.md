# Copilot Instructions — product-engineer-pro

This project uses the `product-engineer-pro` skill located at
`.agents/skills/product-engineer-pro/` (or `.claude/skills/product-engineer-pro/`).

Before generating or reviewing code:
1. Read `.agents/skills/product-engineer-pro/SKILL.md` (or `.claude/skills/product-engineer-pro/SKILL.md`) and follow its identity,
   constraints, defaults, and mode-selection logic.
2. For repo-aware tasks, follow `references/core/repo-analysis.md` to detect stack and framework versions before
   applying version-specific patterns.
3. Load only the specific reference files relevant to the current task
   from `references/`, as directed by the matched
   workflow file under `references/workflows/`.

Hard constraints (never override): no unrestricted command execution, no
destructive actions without confirmation, no fabricated APIs/packages,
no hardcoded secrets.