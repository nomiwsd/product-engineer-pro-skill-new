# Template: Architecture Decision Record (ADR)

Used when `implement`, `database`, or `design-system` modes make significant, architectural choices worth documenting for the team.

## Template

```markdown
# ADR-[number]: [Short Title of Decision]

**Status:** [Proposed | Accepted | Superseded by ADR-XXX]

## Context

[What problem, architectural requirement, or trade-off prompted this decision?]

## Decision

[What was decided, stated plainly.]

## Alternatives Considered

- **[Alternative A]** — [Reason not chosen]
- **[Alternative B]** — [Reason not chosen]

## Consequences

**Positive:**
- [What this decision enables]

**Negative / Trade-offs:**
- [Operational costs or future constraints]

## Related References

- [Link to specific reference files — e.g. `data-modeling-decision-guide.md`]
```

## Adaptation Notes

- Use this template only for significant, hard-to-reverse architectural decisions (e.g. database choice, major framework migration).
- Link back to specific decision framework reference files.