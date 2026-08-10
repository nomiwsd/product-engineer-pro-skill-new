# Host capabilities and lifecycle mapping

Treat lifecycle and specialty as independent axes. A user can request a
`frontend` review, a `security` build, or a `database` plan.

## Host state is authoritative

- In Plan, Ask, or another read-only state, inspect and produce a
  decision-complete plan. Do not edit, even when the selected workflow normally builds.
- In an editing state, implement when the user asks to build, change, fix, or repair.
- Audit, review, explain, and report requests remain read-only unless the user also
  authorizes changes.
- "Find and fix" authorizes diagnosis followed by scoped, non-destructive repair.
- Use only commands allowed by the host. Never weaken sandboxing, approval gates,
  allowlists, or destructive-action safeguards.

## Lifecycle roles

| Role | Tool posture | Completion condition |
|---|---|---|
| Planner / Researcher | Read, search, inspect, and run non-mutating diagnostics | A decision-complete plan with risks and verification |
| Builder | Edit and run scoped verification under host permissions | Requested behavior works and relevant checks pass |
| Reviewer / Auditor | Read diffs, code, logs, and tests; run non-mutating checks | Evidence-backed findings ordered by severity |

Handoff only when useful and supported. Do not delegate merely because a host has
agents. Use parallel agents only when the user explicitly requests them or when the
host policy clearly permits independent parallel work.

## Capability tiers

| Tier | Hosts | Contract |
|---|---|---|
| Full native | Claude Code, Codex, Gemini CLI, Cursor, VS Code/Copilot | Native skill discovery and three role definitions; repository commands/prompts only where supported |
| Native workflow | Windsurf, Roo Code, Cline | Native skills, workflows, rules, or modes mapped to host controls |
| Portable fallback | Aider and AGENTS-compatible tools | Condensed instructions loaded by the host; no native-agent or enforceable-mode claim |

Do not infer quality from a model family name. Adapt to observable capabilities:
file access, context size, mutation permissions, native skill discovery, command
support, role-agent support, and available verification tools.

## Native invocation

- Codex: invoke `$product-engineer-pro`; use built-in `/plan`, `/review`, and
  `/agent` behavior rather than overriding those names.
- Claude Code and Gemini CLI: use generated `pep:<workflow>` commands.
- VS Code/Copilot and Windsurf: use generated `pep-<workflow>` prompt/workflow files.
- Cursor and Cline: invoke the skill natively and name the specialty in the request.
- Roo Code: select a generated `pep-plan`, `pep-build`, or `pep-review` mode, then
  name the specialty.
- Aider/portable: state the lifecycle and specialty in the prompt.
