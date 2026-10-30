# Acceptance Criteria: Multi-file feature with conflicting constraints

- [ ] Anonymous requests get 401; another user's order gets 403 or 404 and stays unchanged; an unknown id gets 404.
- [ ] The owner gets 200 and the order's status becomes "cancelled"; cancelling again returns 409.
- [ ] Cancelled orders are excluded from listOrders and from revenueByUser.
- [ ] Existing exports and tests are unchanged.
- [ ] New tests use the existing runner; only relevant files change.

Each criterion is checked automatically (see `case.json`); hidden tests are in `hidden/` where present.
