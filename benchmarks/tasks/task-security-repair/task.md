# Task: Security repair

**Workflow:** `security` · **Fixture:** `orders-service` · **Mode:** `acceptEdits`

## Prompt

> Users report they can open other users' orders by changing the ID in GET /orders/:id. Fix it, and make listOrdersHandler reject invalid page numbers with status 400.

The prompt is the same in every condition; skill conditions prefix it with `/pep:security`.

Acceptance criteria: [acceptance-criteria.md](acceptance-criteria.md). Scoring: [rubric](../../rubric.md).
