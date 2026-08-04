# Workflow: Database

## Goal

Design schemas, plan migrations, optimize indexing/queries, or decide
between SQL and NoSQL — for new and existing data layers.

## Process

1. Run `references/core/repo-analysis.md` to detect existing database
   engine, ORM/ODM, and migration tooling already in use — don't
   introduce a second competing data-access pattern without flagging it.
2. If choosing between PostgreSQL and MongoDB for new data (or a new
   bounded context within an existing polyglot system) →
   `database/data-modeling-decision-guide.md` first, before designing
   either schema.
3. For relational schema design (normalization, indexing, constraints,
   transactions) → `database/postgresql-design.md`.
4. For document schema design (embedding vs referencing, indexing,
   aggregation) → `database/mongodb-design.md`.
5. For any schema change to an existing system in use, sequence it per
   `core/observability-deployment.md`'s expand/contract pattern — never
   a single breaking migration step (ties to C2).
6. Validate that no query pattern introduces injection risk
   (`core/security-owasp.md` A03) — parameterized queries/ORM only.
7. Consider access patterns before schema shape: design indexes and
   relationships around actual query patterns the application performs,
   not around normalized-form purity alone.
8. For destructive migrations (drop column/table, type-narrowing
   changes), flag explicitly and require confirmation before finalizing
   (C2).

## Checklist

- [ ] Existing DB engine/ORM detected and respected — no silent
      introduction of a second pattern.
- [ ] SQL vs NoSQL choice (if applicable) justified via the decision
      guide, not assumed.
- [ ] Indexes match actual query access patterns, not just theoretical
      normalization.
- [ ] Migration sequencing is backward-compatible (expand/contract) for
      existing systems.
- [ ] Destructive changes flagged and confirmed explicitly.
- [ ] All queries parameterized — no string-concatenated queries.

## Output Format

Lead with schema/migration code. State the access-pattern reasoning
behind index choices. Flag destructive steps clearly and separately from
non-destructive ones.

## Related References

- `references/database/data-modeling-decision-guide.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
- `references/core/security-owasp.md`
- `references/core/observability-deployment.md`
- `templates/database/postgres-migration.sql.md`
- `templates/database/mongodb-schema.ts.md`