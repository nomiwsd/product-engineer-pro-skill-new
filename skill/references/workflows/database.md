# Workflow: Database

## Goal

Design schemas, plan migrations, optimize indexes and queries, or choose between SQL and
document storage — for new and existing data layers — so that invariants are protected,
deploys stay backward compatible, and destructive steps are never taken silently.

## Detect first

- Engine and server version (`SELECT version();`, `db.version()`), ORM/ODM and its major,
  migration tool, naming conventions, existing indexes, and data-volume hints.
- Whether a second data-access pattern would be introduced; never add one silently (D2).

## Lifecycle behavior

- `plan`: access patterns, schema and index design, migration sequence, rollback, and checks.
  No edits (L1).
- `build`: write migrations and query changes, apply them to a disposable database when
  available, and verify.
- `review`: findings on migrations, locks, indexes, constraints, and query safety with
  locations. No edits.

## Process

1. Run `references/core/repo-analysis.md`; state the detected engine and versions (V2).
2. For a new bounded context, choose SQL or documents with
   `references/database/data-modeling-decision-guide.md` before designing either schema.
3. List the queries the application actually runs; design indexes and shape around them,
   not around normalization purity alone.
4. Protect invariants with constraints (`NOT NULL`, foreign keys, `UNIQUE`, `CHECK`) or
   schema validation (`references/database/postgresql-design.md`,
   `references/database/mongodb-design.md`).
5. Sequence changes to a live system as expand → migrate/backfill → contract
   (`references/core/observability-deployment.md`). Batch large backfills and avoid long locks
   (for example, build PostgreSQL indexes concurrently).
6. Use one migration tool. Keep migrations reviewable and reversible where feasible; write the
   rollback alongside the forward step.
7. Parameterize every query (`references/core/security-owasp.md`), use least-privilege roles,
   and give multi-row invariants a deliberate transaction and isolation level.
8. Identify personal data; respect retention and deletion requirements and never store secrets
   in plain text.
9. Flag destructive steps (drop, rename, type-narrowing) separately and require confirmation
   before finalizing them (C2).

## Version gates

| Detected | Then |
|---|---|
| PostgreSQL 15+ | `MERGE` is available; older servers use `INSERT … ON CONFLICT` |
| PostgreSQL 17+ | `MERGE … RETURNING` and `JSON_TABLE()` are available |
| MongoDB 9.0+ | A default per-operation memory limit applies; large sorts and aggregations may need `allowDiskUse` or redesign |
| Mongoose at MongoDB FCV 9.0 | Use Mongoose 9.10.4+ or 8.24.5+, or avoid `syncIndexes()` at startup |
| Prisma or Mongoose major | Use the installed major's client, config, and query API |

## Best-practice checklist

- [ ] Existing engine and ORM respected; no second competing pattern.
- [ ] SQL vs NoSQL choice (if any) justified through the decision guide.
- [ ] Indexes match real access patterns; constraints protect invariants.
- [ ] Live-system changes follow expand → migrate → contract with a rollback for each step.
- [ ] Large backfills are batched; index creation avoids long locks.
- [ ] All queries are parameterized; roles are least-privilege.
- [ ] Destructive steps are listed separately and confirmed before they run.

## Evidence required

The migration applied and rolled back on a disposable database when one is available; an
`EXPLAIN`/explain-plan for any performance claim (E3); tests that exercise the changed queries.
Report each check as passed, failed, or not run (E2).

## Stop conditions

Stop before any destructive or locking step until it is confirmed (C2), and when no rollback
exists for a production change — say so instead of inventing one.

## Never

- Combine drop, rename, and backfill in one deploy step.
- Concatenate user input into a query string.
- Introduce a second ORM, ODM, or database engine without confirmation (D4).

## Output

Lead with schema and migration code (or the plan), state the access-pattern reasoning behind
each index, and list destructive steps separately from non-destructive ones.

## References

- `references/core/operating-rules.md`
- `references/database/data-modeling-decision-guide.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
- `references/core/security-owasp.md`
- `references/core/observability-deployment.md`
- `templates/database/postgres-migration.sql.md`
- `templates/database/mongodb-schema.ts.md`
