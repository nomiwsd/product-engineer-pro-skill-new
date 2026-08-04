# Data Modeling Decision Guide: SQL vs NoSQL

## Scope

Owns: the decision framework for choosing PostgreSQL vs MongoDB (or using both in a polyglot architecture) for a given bounded context.

Defers to: `postgresql-design.md` and `mongodb-design.md` for engine-specific schema design once a choice is made.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view <package> version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

Not framework-version-dependent — this file governs architectural decision frameworks. Cross-reference `postgresql-design.md` and `mongodb-design.md` Version Matrices once an engine is selected.

## Detection

Per `references/core/repo-analysis.md`: identify existing database dependencies (`pg`, `prisma`, `drizzle-orm`, `mongoose`, `mongodb`) in package.json and configuration files before choosing or extending a database engine.

## Standards

Evaluate these 5 decision criteria in sequence. The first criterion that clearly resolves your architectural requirement dominates:

### 1. Does an engine already exist in this codebase?
If the project already uses PostgreSQL or MongoDB for related domain data, default to that existing engine (SKILL.md D2). Introducing a second database engine carries significant operational overhead (connection pools, backups, migration tooling) and requires explicit justification.

### 2. Are relationships and multi-entity consistency central to the domain?
- **Favor PostgreSQL** when the domain consists of many interrelated entities requiring complex joins, or when operations require multi-table ACID transactions (e.g., financial transactions, order processing, inventory billing).
- **Favor MongoDB** when the primary access pattern reads/writes single self-contained documents with minimal cross-entity joins (e.g., user profiles, content management, product catalog documents).

### 3. Is the schema genuinely variable/evolving per record?
- **Favor MongoDB** when different records of the same collection have dynamic or unpredictable shapes (e.g., user-defined form submissions, dynamic product attributes across categories).
- **Favor PostgreSQL** (using `jsonb` columns for variable sub-trees) when the core schema is relational and structured, with only a small portion requiring schema flexibility.

### 4. What are the read/write access patterns?
- **Favor MongoDB** for high-throughput writes of independent document-shaped records (event logging, IoT telemetry, real-time activity feeds).
- **Favor PostgreSQL** for complex ad-hoc queries, reporting, or multi-condition filtering across normalized entities.

### 5. What team/operational familiarity already exists?
- All else being equal, choose the engine your team has established operational maturity with (backup automation, monitoring, migration experience).

## Polyglot Persistence

Using both engines in one project is justified only when distinct bounded contexts have fundamentally different access patterns (e.g., PostgreSQL for core billing/orders + MongoDB for high-volume activity logging). Always confirm with the user before introducing a second database engine to a single-engine project (SKILL.md D4).

## Common Misconceptions to Avoid

- *"NoSQL is always faster than SQL"* — False. Performance depends on matching access patterns to index structures.
- *"Relational databases cannot store JSON"* — False. PostgreSQL's `jsonb` column type handles semi-structured data with GIN index support.
- *"MongoDB does not support transactions"* — False. Modern MongoDB (v4.0+) supports multi-document ACID transactions.

## Anti-Patterns

```text
// Migrating a working PostgreSQL database to MongoDB without explicit performance evidence
// Splitting a single domain context across PostgreSQL and MongoDB, forcing two-phase commits in application code
```

## Related References

- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
- `references/core/repo-analysis.md`

## Applies To Modes

- `database`
- `audit`
- `implement`