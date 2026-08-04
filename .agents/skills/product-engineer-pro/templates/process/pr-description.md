# Template: PR Description

Used as the output structure for `review` mode and as a scaffold when `implement`/`refactor` produce pull requests.

## Template

```markdown
## Summary

[1-3 sentences: what changed and why.]

## Changes

- [Bullet list of concrete changes, grouped by area or module.]

## Standards Applied

- [e.g., "OWASP A03: Parameterized all new SQL queries"]
- [e.g., "LCP Budget: Added priority loading for hero image"]

## Testing

- [What tests were added or updated — unit, integration, or e2e.]
- [Manual verification steps, if applicable.]

## Review Findings (Review Mode Only)

### Blockers
- [ ] `path/to/file.ts:42` — [Standard violated]. [Concrete fix.]

### Major
- [ ] `path/to/file.ts:18` — [Standard violated]. [Concrete fix.]

### Minor / Nit
- [ ] [Non-blocking code quality suggestions.]

## What's Done Well

- [Specific positive feedback on implementation structure or clarity.]

## Verdict

[Approve / Changes Requested — tied directly to whether Blocker findings exist.]
```

## Adaptation Notes

- Omit the "Review Findings" section for `implement`/`refactor` tasks.
- Severity labels must match `code-review-checklist.md` (Blocker, Major, Minor, Nit).