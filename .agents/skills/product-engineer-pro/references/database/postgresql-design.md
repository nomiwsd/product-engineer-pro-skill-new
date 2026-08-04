# PostgreSQL Design

## Scope

Owns: relational schema design, indexing, constraints, transactions, and migration patterns for PostgreSQL specifically (including PostgreSQL 17+).

Defers to: `data-modeling-decision-guide.md` for whether PostgreSQL is the right choice; `security-owasp.md` for SQL injection prevention; `observability-deployment.md` for zero-downtime migration deployment sequencing.

## Version Matrix

> **Verify before relying on "Current" tier**: check the actual server version via `SELECT version();` — this matrix reflects known majors at authoring time.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| PostgreSQL 17.x | Current (Latest) | `JSON_TABLE()` function for JSON-to-table queries, streaming I/O optimizations, `MERGE ... RETURNING` clause, `pg_createsubscriber` logical replication, incremental `pg_basebackup`, updated `VACUUM` memory management |
| PostgreSQL 15.x–16.x | Supported | Logical replication enhancements, `MERGE` statement (15+), parallel query optimizations |
| PostgreSQL 13.x–14.x | Legacy | No `MERGE` statement — use `INSERT ... ON CONFLICT` for upsert operations |
| PostgreSQL 12.x and earlier | Legacy (EOL) | Flag for immediate upgrade in audits |

## Detection

Per `references/core/repo-analysis.md`: identify the ORM or query builder in use (Prisma, Drizzle, TypeORM, Knex, or raw `pg`).

## Standards

### Schema Design
- Normalize to 3NF by default. Denormalize intentionally only for measured read performance bottlenecks, and document the reason.
- Every table must have a primary key; prefer `bigint generated always as identity` or `uuid` over mutable natural keys.
- Use `NOT NULL` by default; make a column nullable only when "absent" is a genuinely valid, distinct state.
- Enforce referential integrity with explicit Foreign Key constraints (`ON DELETE RESTRICT` or `CASCADE`).
- Use `CHECK` constraints for database-level invariants (e.g., `CHECK (price >= 0)`).
- Use `timestamptz` for all timestamps; use `numeric`/`decimal` for monetary values (never `float` or `double`).
- Leverage `JSON_TABLE()` in PostgreSQL 17+ when querying JSON columns as relational data structures.

### Indexing
- Index columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses for frequent queries.
- Order composite indexes to match actual query filter and sort orders (most selective column first).
- Use partial indexes (`CREATE INDEX ... WHERE deleted_at IS NULL`) to index filtered subsets efficiently.
- Verify index usage with `EXPLAIN ANALYZE` — do not add indexes speculatively without execution evidence.

### Transactions
- Wrap multi-statement mutations requiring atomicity inside explicit transactions (`BEGIN`/`COMMIT`).
- Keep transaction boundaries short — never perform external HTTP API calls, emails, or slow I/O inside a database transaction.
- Use explicit row locking (`SELECT ... FOR UPDATE`) or `SERIALIZABLE` isolation when preventing concurrent race conditions (e.g., inventory deductions, account balance updates).

### Migrations
- Every schema change must be an explicit, version-controlled migration file.
- Sequence breaking migrations using the **expand/contract pattern** (`references/core/observability-deployment.md`): add new columns as nullable/default first, backfill data, deploy code, then drop old columns in a subsequent release.
- Avoid locking large production tables (e.g., adding `NOT NULL` without a default on large tables blocks writes).

### Query Safety
- Always use parameterized queries (`$1`, `$2`) or ORM query builders. Never concatenate user input into raw SQL strings (`references/core/security-owasp.md` A03).

## Anti-Patterns

```sql
-- Unsafe string concatenation in JavaScript
-- db.query(`SELECT * FROM users WHERE email = '${email}'`);

-- Missing NOT NULL and using float for money
CREATE TABLE orders (
  id bigint PRIMARY KEY,
  total float, -- Unsafe float for money! Use numeric.
  created_at timestamp -- Missing timestamptz timezone!
);

-- Holding locks across external network requests
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- await callPaymentGatewayApi(); // DANGEROUS: network latency holds DB locks!
COMMIT;
```

## Related References

- `references/database/data-modeling-decision-guide.md`
- `references/core/security-owasp.md`
- `references/core/observability-deployment.md`
- `templates/database/postgres-migration.sql.md`

## Applies To Modes

- `database`
- `implement`
- `performance`
- `security`
- `review`