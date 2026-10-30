# Task: Deploy-safe migration with rollback

**Workflow:** `database` · **Fixture:** `db-migrations` · **Mode:** `acceptEdits`

## Prompt

> Add a required status column to users (text, default 'active', NOT NULL) that is filled in for every existing row. The service uses a rolling deploy, so the change must be safe while old and new code run together, and every migration you add needs a rollback.

The prompt is the same in every condition; skill conditions prefix it with `/pep:database`.

Acceptance criteria: [acceptance-criteria.md](acceptance-criteria.md). Scoring: [rubric](../../rubric.md).
