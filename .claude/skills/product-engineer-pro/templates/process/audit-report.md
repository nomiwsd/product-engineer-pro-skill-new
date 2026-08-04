# Template: Audit Report

Used as the output structure for `audit` mode and comprehensive `security` reviews.

## Template

```markdown
# Audit Report: [Scope — e.g., "Checkout Flow" or "Full Repository"]

**Stack detected:** [Frameworks + versions, per repo-analysis.md]
**Scope:** [Included modules and components]

## Executive Summary

[3-5 sentences: overall health, key findings, and general risk level.]

## Findings by Severity

### Blockers ([count])

1. **[Finding title]** — `path/to/file.ts:line`
   - **Standard violated:** [e.g., OWASP A03: Injection]
   - **Issue:** [Concrete problem description]
   - **Impact:** [Security / performance risk]
   - **Fix:** [Concrete code recommendation]
   - **Also found in:** [Additional locations if systemic]

### Major ([count])
[Same structure as above.]

### Minor ([count])
[Compact title + location + one-line fix.]

### Nit ([count])
[Non-blocking style suggestions.]

## Systemic Issues

[Patterns deduplicated across findings — e.g., "Missing input validation across 8 route handlers".]

## Recommended Next Steps

1. [Highest-priority action, typically addressing Blockers]
2. [Next priority]

## Out of Scope / Not Assessed

[Explicitly state what was not assessed to clarify audit boundaries.]
```

## Adaptation Notes

- Every Blocker/Major finding must cite a specific reference standard (SKILL.md D5).
- The "Out of Scope" section is mandatory.