# Code Review Checklist

## Scope

Owns: the universal rubric and severity taxonomy used to evaluate any
diff, regardless of stack. Used directly by `review` mode and indirectly
by `refactor` and `audit`.

Defers to: stack-specific files for what "correct" looks like in that
stack's idioms; `security-owasp.md` for the depth of the security
category below (this file only flags where to look).

## Severity Taxonomy

Use exactly these four levels when reporting findings — do not invent
new ones:

| Severity | Meaning | Action |
|---|---|---|
| **Blocker** | Breaks functionality, introduces a security vulnerability, or violates a Constraint (C1–C4) | Must fix before merge |
| **Major** | Likely bug, significant performance/accessibility regression, or violates an established standard in this skill | Should fix before merge |
| **Minor** | Code quality, naming, or maintainability concern | Fix now or track explicitly |
| **Nit** | Style preference with no functional impact | Optional, non-blocking |

Every finding in `review`/`audit` output must be labeled with one of
these four levels (SKILL.md D5 — cite the standard alongside).

## Review Categories

### 1. Correctness
- Does the change do what it claims to do?
- Are edge cases handled (empty arrays, null/undefined, zero, boundary
  values)?
- Are error paths handled per `engineering-principles.md`?
- Does it introduce a regression to adjacent, untouched functionality?

### 2. Security
- Is user input validated/sanitized before use? (`security-owasp.md`)
- Are secrets absent from the diff? (C4)
- Are auth/authz checks present where required? (`auth-authz.md`)
- Does a new dependency introduce unnecessary attack surface?

### 3. Performance
- Any obvious N+1 query, unbounded loop, or unnecessary re-render
  introduced? (`performance-web-vitals.md`, stack-specific files)
- Any large dependency added for a small amount of functionality?

### 4. Accessibility (UI changes only)
- Semantic HTML used where applicable? (`accessibility-a11y.md`)
- Keyboard and screen-reader paths preserved?

### 5. Maintainability
- Matches existing repo conventions? (`repo-analysis.md`, SKILL.md D2)
- Naming, abstraction discipline per `engineering-principles.md`?
- Is the diff minimal and focused, or does it include unrelated changes?
  (SKILL.md Editing Discipline)

### 6. Tests
- Does the change include tests appropriate to its risk?
  (`testing-strategy.md`)
- Do existing tests still make sense, or were they weakened to pass?

### 7. Documentation
- Are public APIs, exported functions, or config changes documented
  where the repo's existing convention expects it?

## Process for `review` Mode

1. Read the full diff before commenting on any single line — avoid
   piecemeal reactions that miss cross-file context.
2. Walk categories 1–7 in order; correctness and security first.
3. Group findings by severity, not by category, in the final report.
4. For every Blocker/Major finding, include: the specific line/file, the
   standard violated, and a concrete fix (not just "this is wrong").
5. Explicitly state what's good about the diff, not only problems —
   calibrated, not purely critical.

## Anti-Patterns in Review Output

- Vague findings ("this could be better") without a concrete standard
  cited or fix proposed.
- Nitpicking style in the same breath as a security Blocker, with equal
  visual weight — severity must be visually/structurally distinct.
- Rewriting large portions of the diff as "feedback" instead of pointing
  out the specific, minimal change needed.

## Related References

- `references/core/security-owasp.md`
- `references/core/testing-strategy.md`
- `references/core/accessibility-a11y.md`
- `references/core/performance-web-vitals.md`
- `templates/process/pr-description.md`

## Applies To Modes

`review`, `refactor`, `audit`.