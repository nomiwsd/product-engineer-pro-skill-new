# Workflow: Review

## Goal

Review a pull request or diff for correctness, security, performance, accessibility,
maintainability, tests, and documentation, producing severity-ranked findings with evidence
and a clear verdict — without editing.

## Detect first

- The full diff and its intent: PR description, linked issue, or the user's summary.
- The conventions and versions the diff should follow (D2, V2); read surrounding unchanged code.

## Lifecycle behavior

- `plan`: not applicable; a review request is read-only.
- `build`: still read-only unless the user explicitly asks for fixes; then switch to the
  matching build workflow and say so (L2).
- `review`: the default. Findings by severity with locations and a verdict.

## Process

1. Read the intent, then the entire diff in context, before commenting.
2. Walk `references/core/code-review-checklist.md` in order: correctness → security →
   performance → accessibility (UI diffs) → maintainability → tests → documentation. Skip a
   category explicitly when it does not apply.
3. Cross-check security-relevant changes (auth, input handling, queries) with
   `references/core/security-owasp.md`, `references/backend/auth-authz.md`, or the database
   reference.
4. Cross-check UI changes with `references/core/accessibility-a11y.md` and the frontend recipe
   checklist.
5. Classify each finding as Blocker, Major, Minor, or Nit; never invent labels.
6. For Blocker and Major findings, give `file:line`, the standard violated (D5), and the
   minimal concrete fix.
7. Note what the diff does well.
8. Decide the verdict: any Blocker means changes requested.

## Version gates

None beyond the loaded stack references; judge version-specific code against the detected
version, not the newest one (V4).

## Best-practice checklist

- [ ] Intent and full diff read in context before commenting.
- [ ] All seven categories covered or explicitly skipped.
- [ ] Every finding has a standard severity label and a location.
- [ ] Blocker and Major findings include the standard and a minimal fix.
- [ ] Positive aspects noted.
- [ ] Verdict follows from the findings.

## Evidence required

`file:line` for every finding (E4). Checks run during review (tests, type check) reported as
passed, failed, or not run (E2); say explicitly when no actionable finding exists.

## Stop conditions

Stop and ask for the missing context when the diff's intent cannot be determined or the diff
is incomplete.

## Never

- Edit files or rewrite large parts of the diff as "suggestions".
- Comment line by line before understanding the whole change.
- Give a purely critical review that ignores what works.

## Output

Use exactly this shape. The only severity headings are Blocker, Major, Minor, and Nit; write
"Critical" or "High" findings under Blocker and "Medium" under Major.

```markdown
**Verdict:** Changes requested | Approved (changes requested whenever a Blocker exists)

### Blocker
- `file:line` — what is wrong — standard violated — minimal fix

### Major
### Minor
### Nit
(write "None" under an empty heading)

### What works well
```

## References

- `references/core/operating-rules.md`
- `references/core/code-review-checklist.md`
- `references/core/security-owasp.md`
- `references/core/accessibility-a11y.md`
- `references/core/testing-strategy.md`
- `templates/process/pr-description.md`
