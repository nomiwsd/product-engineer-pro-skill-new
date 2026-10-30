# Acceptance Criteria: Security repair

- [ ] A user requesting another user's order gets 403 or 404 and none of its data.
- [ ] The owner still gets 200.
- [ ] Page values that are not positive integers return 400.
- [ ] Valid pages still work.
- [ ] Existing tests still pass.

Each criterion is checked automatically (see `case.json`); hidden tests are in `hidden/` where present.
