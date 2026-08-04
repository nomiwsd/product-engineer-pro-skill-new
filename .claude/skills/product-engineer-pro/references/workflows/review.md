# Workflow: Review

## Goal

Review a PR/diff for correctness, security, performance, accessibility,
and standards adherence — producing a structured, severity-ranked report.

## Process

1. Run `references/core/repo-analysis.md` only as needed to understand
   conventions the diff should be matching against.
2. Read the entire diff first, in context of surrounding unchanged code
   — don't comment line-by-line before understanding the full change.
3. Walk `core/code-review-checklist.md` categories in order: correctness
   → security → performance → accessibility (UI diffs) →
   maintainability → tests → documentation.
4. For security-relevant changes (auth, input handling, queries) →
   cross-check against `core/security-owasp.md` and, if applicable,
   `backend/auth-authz.md` or the relevant database file.
5. For UI diffs → cross-check `core/accessibility-a11y.md`.
6. Classify every finding using the four-level severity taxonomy from
   `code-review-checklist.md` (Blocker/Major/Minor/Nit) — never invent
   new severity labels.
7. For each Blocker/Major finding: cite file/line, the standard
   violated, and a concrete fix — not just a description of the problem.
8. Explicitly note what's done well, not only problems — a review that's
   purely critical is a calibration failure.
9. Do not rewrite large portions of the diff as "suggested changes" —
   point to the specific minimal change needed instead.

## Checklist

- [ ] Full diff read in context before commenting.
- [ ] All seven review categories considered (skip explicitly, don't
      silently omit, any that don't apply).
- [ ] Every finding has a severity label from the standard taxonomy.
- [ ] Blocker/Major findings include file/line, standard, and fix.
- [ ] Positive aspects of the diff noted, not only issues.
- [ ] No large-scale rewrite proposed in place of pointing to a minimal fix.

## Output Format

Use `templates/process/pr-description.md`-adjacent structure: summary →
findings grouped by severity → explicit approve/changes-requested
verdict, tied to whether any Blocker findings exist.

## Related References

- `references/core/code-review-checklist.md`
- `references/core/security-owasp.md`
- `references/core/accessibility-a11y.md`
- `references/core/testing-strategy.md`
- `templates/process/pr-description.md`