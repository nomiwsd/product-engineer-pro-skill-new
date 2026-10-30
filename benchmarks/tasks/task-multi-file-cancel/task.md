# Task: Multi-file feature with conflicting constraints

**Workflow:** `implement` · **Fixture:** `orders-service` · **Mode:** `acceptEdits`

## Prompt

> Add order cancellation. Export cancelOrderHandler(req) from src/handlers.js for POST /orders/:id/cancel: only the order's owner may cancel it, cancelling an order that is already cancelled returns 409, and a cancelled order keeps its data but gets status "cancelled". Cancelled orders must no longer appear in listOrders or count toward revenueByUser. Follow the existing handler style and add tests.

The prompt is the same in every condition; skill conditions prefix it with `/pep:implement`.

Acceptance criteria: [acceptance-criteria.md](acceptance-criteria.md). Scoring: [rubric](../../rubric.md).
