# Operating Rules

## Scope

The universal rules every workflow, lifecycle, role, and template applies. Recipes and
references cite them by ID (for example "rule C4"). Specialty practices live in each workflow
recipe; host permission behavior lives in `host-capabilities.md`.

## Constraints (C) — non-negotiable

- **C1** — Run only scoped commands the host allows and the task needs. No arbitrary or
  unbounded execution; never weaken sandboxing, approvals, or allowlists.
- **C2** — Get explicit confirmation immediately before destructive actions: data deletion,
  schema drops or type-narrowing, force-push, history rewrites, or overwriting user work.
- **C3** — No fabricated APIs, packages, flags, config keys, file paths, or repository facts.
  Verify against the repository or state the uncertainty.
- **C4** — No hardcoded secrets or credentials in code, tests, fixtures, logs, or docs. Use the
  repository's environment/config convention, even when asked otherwise.

## Defaults (D) — engineering quality

- **D1** — Read before write: inspect relevant files, config, and installed versions first.
- **D2** — Match existing conventions (naming, structure, module format, validation, state,
  error contract, test runner) before introducing new ones; flag any new pattern.
- **D3** — Prefer minimal, reviewable diffs; justify a full rewrite explicitly.
- **D4** — State assumptions when repository signals are missing or contradictory; never
  silently guess.
- **D5** — In audit, security, and review output, cite the standard behind each finding (OWASP
  category, WCAG criterion, rule ID, or repository convention).
- **D6** — Technical ambiguity: state an assumption and proceed. Product or business ambiguity
  (pricing, permissions, retention, copy): ask.

## Editing discipline (ED)

- **ED1** — Keep the diff inside the requested scope; list adjacent improvements separately.
- **ED2** — Do not fix bugs during a refactor or add features during a debug fix; flag them.
- **ED3** — Do not reformat, rename, or reorder unrelated code.
- **ED4** — Do not add dependencies, frameworks, module-format changes, or migrations as
  incidental changes.
- **ED5** — Leave the repository buildable after each step of a multi-step change.

## Evidence (E)

- **E1** — Label conclusions as observed (seen in a file, output, or test), inferred, or unknown.
- **E2** — Report every check as `passed`, `failed`, `not run (reason)`, or
  `unavailable (reason)`. "Passed" requires output that was actually seen.
- **E3** — No performance, accessibility, security, or coverage numbers without before/after
  measurement; with static evidence only, describe the mechanism and how to measure it.
- **E4** — Locate every finding and claim about code (`file:line`, route, query, or component).
- **E5** — End build and review output with what remains unverified, untested, or risky.

## Versions (V)

- **V1** — Detect versions from the lockfile, then installed package metadata, then the
  `package.json` range, then `version-snapshot.json`. Never assume the newest version.
- **V2** — State the detected versions of the stack you touch at the top of plan, audit, and
  review output.
- **V3** — If a detected major is newer than the snapshot, consult official documentation when
  the host allows it; otherwise state reduced confidence and why.
- **V4** — Apply a version-specific API or idiom only after confirming the installed version
  supports it; recipes keep these in their "Version gates" section.

## Lifecycle (L)

- **L1** — Host state is authoritative. In Plan, Ask, or read-only state, never edit, even when
  the workflow normally builds.
- **L2** — Request words set authority: audit, review, explain, and report stay read-only
  (diagnose before building); build, change, fix, and implement authorize scoped edits; "find
  and fix" authorizes diagnosis followed by scoped, non-destructive repair.
- **L3** — Select one primary workflow and say which; when signals compete, the safety-critical
  one wins (security over performance).
- **L4** — Stop and report when prerequisites fail, acceptance criteria cannot be met, scope
  would grow beyond the request, or a C rule would be violated.

## Lifecycle output contract

| Lifecycle | Edits | Lead with | Always include |
|---|---|---|---|
| `plan` | Never | Decision-complete plan | Detected stack, goal and non-goals, affected files, contracts, risks, rollback, exact checks |
| `build` | Within host permissions | Implemented change | Verification ledger (E2), assumptions (D4), residual risk (E5), flagged adjacent work (ED1) |
| `review` | Never | Findings by severity | Detected stack, location and standard per finding, positives, verdict, checks not run |

Severity labels are Blocker, Major, Minor, and Nit, as defined in `code-review-checklist.md`.

Verification ledger rows: check · command · why · result · evidence.

## Related References

- `references/core/host-capabilities.md`
- `references/core/repo-analysis.md`
- `references/core/code-review-checklist.md`
- `references/version-snapshot.json`
