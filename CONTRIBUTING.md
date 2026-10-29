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
6. **Cite rules by ID.** Universal rules live in
   `skill/references/core/operating-rules.md` (C, D, ED, E, V, L). Cite them as
   "rule C4"; never restate them or invent new IDs.

## Workflow Recipe Template — `references/workflows/*`

Every recipe uses these sections, in this order. `scripts/validate-structure.mjs`
enforces the headings.

```markdown
# Workflow: <Name>

## Goal
One paragraph: the outcome this workflow delivers.

## Detect first
What to inspect before acting (versions, conventions, scope) — rules D1 and V1.

## Lifecycle behavior
- `plan`: what a decision-complete plan contains for this workflow.
- `build`: what may change and how it is verified.
- `review`: what is inspected and reported, without edits.

## Process
Numbered steps. Link to references for standards instead of restating them.

## Version gates
Version-specific idioms, each gated on a detected version (rule V4). This is the
only section where framework version numbers may appear. Write "None beyond the
loaded stack references" when the workflow has none.

## Best-practice checklist
`- [ ]` items the output must satisfy.

## Evidence required
What must be observed before claiming the work is done (rules E1–E5).

## Stop conditions
When to stop and report instead of continuing (rule L4).

## Never
Workflow-specific anti-patterns.

## Output
What the response leads with and contains, per lifecycle.

## References
Links only.
```

## Refreshing the version snapshot

`skill/references/version-snapshot.json` is the only place verified versions live (see
[COMPATIBILITY.md](COMPATIBILITY.md)). Refresh it when `npm run check-freshness` warns, when the
weekly freshness issue reports drift, and before every release.

1. Run `node scripts/check-freshness.mjs --markdown` for the live report.
2. Check each entry against its own `source`, not a third-party summary:
   - npm packages: the highest **stable** version (`npm view <package> versions`). Ignore the
     `latest` dist-tag if it points at a prerelease.
   - Node.js: the official schedule (`nodejs/Release` `schedule.json`) for LTS phases, and
     `nodejs.org/dist/index.json` for the newest line.
   - PostgreSQL, MongoDB, OWASP: their official release or project pages.
3. Update `value`, keep `meaning` accurate, and set `checkedAt` to the day you checked. Put a
   prerelease only in `preview`.
4. For a **new major**, read the official release notes or migration guide. Add compatibility
   facts to `notes`, and update the affected reference files' version matrices in the same
   change.
5. If you cannot confirm a value, keep the old value and date and set `status` to
   `unverified`. **Never change a date without checking its source.**
6. Set `verifiedAt` to the oldest `checkedAt`, then run `npm test` (the validator enforces the
   schema) and `npm run check-freshness`.
7. Add a changelog entry that lists the changed versions.

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