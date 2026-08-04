# MongoDB Design

## Scope

Owns: document schema design (embedding vs referencing), indexing, aggregation patterns, and transaction usage for MongoDB specifically (including MongoDB 8.0+).

Defers to: `data-modeling-decision-guide.md` for whether MongoDB is the right choice; `security-owasp.md` for NoSQL injection prevention; `observability-deployment.md` for deployment sequencing.

## Version Matrix

> **Verify before relying on "Current" tier**: check server version via `db.version()` — this matrix reflects known majors at authoring time.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| MongoDB 8.0.x | Current (Latest) | "Express Path" query engine optimization, majority write acknowledgment on oplog write, parallel secondary oplog replication buffer, background `tcmallocReleaseRate` memory release, resharding `forceRedistribution` |
| MongoDB 6.0.x–7.0.x | Supported | Queryable Encryption (7.0+), time-series collection improvements, `$lookup` performance enhancements |
| MongoDB 5.0.x and earlier | Legacy | Missing modern aggregation operators and replication performance fixes — flag for upgrade in audits |

## Detection

Per `references/core/repo-analysis.md`: identify whether access is via native Node driver, Mongoose ODM, or another client library.

## Standards

### Embedding vs Referencing
- **Embed** when data is bounded in size, accessed together with the parent document, and does not require independent querying (e.g., user address list, small metadata objects).
- **Reference** (store IDs in a separate collection) when data grows unboundedly (e.g., user activity logs, order histories), is shared across multiple parent documents, or requires independent querying.
- **Never create unbounded embedded arrays** — MongoDB documents have a 16MB limit. Unbounded arrays degrade read/write performance long before hitting the 16MB threshold.

### Indexing
- Every query pattern executed at scale must have a supporting index — verify execution plans with `explain()` (`IXSCAN` vs `COLLSCAN`).
- Compound indexes must follow the **ESR Rule**: **E**quality fields first, **S**ort fields second, **R**ange fields last.
- Use unique indexes (`db.collection.createIndex({ email: 1 }, { unique: true })`) to enforce uniqueness at the database level — do not rely solely on application-level checks.

### Schema Validation
- Enforce schema validation using MongoDB JSON Schema (`$jsonSchema`) or Mongoose schema definitions to prevent malformed documents from being inserted.

### Aggregation Pipelines
- Place `$match` and `$sort` stages at the very beginning of the pipeline so they can leverage index execution (`IXSCAN`).
- Use `$project` as early as possible to drop unused fields and reduce in-memory working payload size.
- Benchmark `$lookup` stages with `explain()` — unindexed `$lookup` operations cause severe performance degradation at scale.

### Transactions & Atomicity
- Single-document writes in MongoDB are atomic by default. Structure schemas to take advantage of single-document atomicity whenever possible.
- Use multi-document ACID transactions when mutations across multiple collections must succeed or fail atomically, but keep transaction lifetimes short.

### Query Safety (NoSQL Injection Prevention)
- Never pass raw `req.body` or `req.query` objects directly into query filters. Attackers can supply objects like `{ "$ne": null }` to bypass authentication or query filters.
- Cast client inputs to explicit types (e.g., `String(req.query.email)`) or validate input shapes with Zod schemas (`references/core/security-owasp.md` A03).

## Anti-Patterns

```js
// Unbounded embedded array causing document bloat
{
  _id: ObjectId("..."),
  title: "Popular Post",
  comments: [ /* Unbounded array of 50,000 embedded comments! */ ]
}

// Unsafe NoSQL query vulnerable to injection
// If req.query.email = { "$ne": null }, this matches the first user in the DB!
db.collection('users').findOne({ email: req.query.email });

// Safe parameterized/cast query
db.collection('users').findOne({ email: String(validatedEmail) });
```

## Related References

- `references/database/data-modeling-decision-guide.md`
- `references/core/security-owasp.md`
- `references/core/observability-deployment.md`
- `templates/database/mongodb-schema.ts.md`

## Applies To Modes

- `database`
- `implement`
- `performance`
- `security`
- `review`