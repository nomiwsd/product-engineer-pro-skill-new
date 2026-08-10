# Capability-based adaptation

## Scope

Adapt Product Engineer Pro to observable host capabilities, not vendor/model-family
stereotypes. Host mappings live in `host-capabilities.md`; this file covers graceful
degradation when some capabilities are absent.

## Inspect capabilities

Before a substantial workflow, determine what the current session actually provides:

| Capability | If available | If unavailable |
|---|---|---|
| Repository file access | Inspect relevant source/config and load references on demand | Ask for or work from supplied excerpts; name missing evidence |
| Mutation permission | Implement only when user intent and host state authorize it | Produce a decision-complete plan or findings only |
| Scoped command execution | Run repository-defined diagnostics and verification under host permissions | Provide exact commands without claiming they ran |
| Native skill discovery | Load `SKILL.md`, then the selected recipe/references | Use the portable condensed contract and disclose reduced context |
| Repository commands/prompts | Use the generated `pep` entry | Name lifecycle and specialty in ordinary chat |
| Role agents | Offer explicit planner/builder/reviewer handoffs when useful | Keep the same lifecycle in the current agent |
| Large context/on-demand loading | Read the selected recipe and relevant references completely | Prioritize the contract, one recipe, then the nearest stack reference |
| Browser/official docs | Verify newer major versions and unstable claims | Use the snapshot and explicitly lower confidence |

## Degraded-context order

When a host cannot progressively load files, preserve information in this order:

1. User intent and host mutation state.
2. Constraints and lifecycle behavior from `SKILL.md`.
3. The selected workflow recipe.
4. The single most relevant detected-stack reference.
5. Adapted template or example.

State which references were unavailable. Do not pretend a flattened prompt provides
native discovery, role enforcement, command execution, or the same context fidelity.

## Context and verification discipline

- Prefer small evidence-bearing excerpts over dumping an entire repository.
- Split long work at stable handoff boundaries: research/plan, build, review.
- Never infer a command result, test pass, benchmark, security pass, or accessibility
  result from model confidence.
- If tool output or repository evidence conflicts with a default in this skill, use
  the evidence and explain the deviation.
- If a detected major exceeds `references/version-snapshot.json`, use official
  verification or report reduced confidence.

## Related references

- `references/core/host-capabilities.md`
- `references/core/repo-analysis.md`
- `references/version-snapshot.json`
