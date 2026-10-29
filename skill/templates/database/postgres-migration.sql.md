# Template: PostgreSQL Migration (Expand/Contract Pattern)

Implements standards from `references/database/postgresql-design.md` and expand/contract zero-downtime deployment sequencing from `references/core/observability-deployment.md`.

## When to Use

Any schema change to a PostgreSQL table already in active production use. For a brand-new table with no data, a single `CREATE TABLE` migration is sufficient.

## Template — Adding a Required Column (3-Migration Sequence)

```sql
-- Migration 1 (Expand): Add column as nullable, deploy alongside existing application code
ALTER TABLE orders ADD COLUMN status text;

-- Migration 2 (Backfill + Constrain): Run after application code writes to `status`.
-- On large tables, repeat in batches until no rows are updated to avoid long locks:
UPDATE orders SET status = 'completed'
WHERE id IN (SELECT id FROM orders WHERE status IS NULL LIMIT 10000);

-- Once backfilled and no NULLs remain in normal operation:
ALTER TABLE orders ALTER COLUMN status SET NOT NULL;
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- Migration 3 (Contract) is intentionally non-executable in this template.
-- After explicit confirmation that rollback and old application versions no longer
-- need the column, create a separate reviewed migration containing:
-- ALTER TABLE orders DROP COLUMN legacy_status_flag;
```

## Template — New Table Creation

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  total numeric(10, 2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status) WHERE status <> 'completed';
```

## Adaptation Notes

- Never combine Migration 1 and Migration 3 into a single deployment — old and new application code must coexist safely during rollout.
- For large existing tables, adding `NOT NULL` without a default in one step locks the table. Always add nullable first, backfill in batches if needed, then add constraints.
- On tables already in production, create indexes with `CREATE INDEX CONCURRENTLY` (outside a transaction) to avoid blocking writes.
- Write the rollback for each step next to it (for Migration 1: drop the new nullable column only while nothing reads it). If a step cannot be rolled back, say so in the migration notes.
- Verify index usage with `EXPLAIN ANALYZE` after deployment.
