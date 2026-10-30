# Task: Existing-codebase feature change

**Workflow:** `implement` · **Fixture:** `orders-service` · **Mode:** `acceptEdits`

## Prompt

> Add discount codes. Create src/discounts.js exporting applyDiscount(total, code): SAVE10 takes 10% off, FLAT5 takes 5 off but never goes below 0, codes are case-insensitive, and an unknown code throws an Error whose message contains "Unknown discount code". Round results to 2 decimal places. Do not change the behavior of existing exports. Add tests.

The prompt is the same in every condition; skill conditions prefix it with `/pep:implement`.

Acceptance criteria: [acceptance-criteria.md](acceptance-criteria.md). Scoring: [rubric](../../rubric.md).
