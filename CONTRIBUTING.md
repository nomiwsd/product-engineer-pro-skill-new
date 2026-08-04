# Contributing to product-engineer-pro

This skill's value depends on strict internal consistency. Read this
fully before adding or editing any file.

## Core Rules

1. **No duplication.** A standard, threshold, or code pattern may exist
   in exactly one file. Every other file links to it instead of
   restating it.
2. **Version-inclusive, never version-replacing.** When a framework
   ships a new major version, add a new row/section to that file's
   Version Matrix. Do not delete or rewrite guidance for older versions
   still in the matrix's supported range.
3. **Standards live in `references/`, never in `SKILL.md`.** `SKILL.md`
   only orchestrates (identity, constraints, mode routing). If you find
   yourself adding a numeric threshold, framework syntax, or checklist
   to `SKILL.md`, move it to the correct reference file instead.
4. **Workflow files are process-only.** Files in `references/workflows/`
   describe steps and link to standards — they must not contain the
   standards themselves.
5. **Workflow file sizing.** Workflow files in `references/workflows/` should aim
   for conciseness (60–120 lines). Generation-heavy workflows requiring detailed
   multi-step token, scaffold, or schema sequences (e.g., `design-system.md`,
   `database.md`) are explicitly permitted to exceed this range to maintain
   comprehensive step sequencing.

## File Template — `references/core/*`, `references/frontend/*`,
## `references/backend/*`, `references/database/*`

```markdown
# <Topic Title>

## Scope
What this file owns. What it explicitly defers elsewhere for.

## Version Matrix   (required for any framework/library-specific file)
| Version Range | Support Tier | Key Differences |
|---|---|---|
| ... | Current / Supported / Legacy | ... |

## Detection
Link to `repo-analysis.md`. Add local signals only if unique to this topic.

## Standards
The payload — concrete rules, patterns, thresholds.

## Anti-Patterns
Short, concrete "don't do this" examples.

## Related References
Links only — no restated content.

## Applies To Modes
Which of the 11 modes should load this file.

## Version Matrix
**Verify before relying on "Current" tier**: check the installed
version via lockfile/registry (`npm view <package> version`) — this
matrix reflects known versions as of this skill's last update and may
lag behind an actual new release. Treat "Current" as "most recent
known major at authoring time," not as a guarantee of latest.

| Version Range | Support Tier | Key Differences |

## File Authoring Template (required for all references/*.md)
1. Scope
2. Version Matrix (mandatory for any framework/library-specific file)
   — must open with a verify-before-relying-on-"Current" caveat pointing
   to the concrete detection command/file (lockfile, `SELECT version()`,
   `db.version()`, etc.) since this skill's authored version knowledge
   will lag behind new releases over time.
3. Detection (link to repo-analysis.md, add local signals only if unique)
4. Standards
5. Anti-Patterns
6. Related References (links only, no restated content)
7. Applies To Modes