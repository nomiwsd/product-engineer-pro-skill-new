# db-migrations

PostgreSQL schema for the accounts service. Migrations in `migrations/` are plain SQL, applied
in filename order by the deploy pipeline. The service runs several instances during a rolling
deploy, so old and new code run against the same database for a few minutes.
