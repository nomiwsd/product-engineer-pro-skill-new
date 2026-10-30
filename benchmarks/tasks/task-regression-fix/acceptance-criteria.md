# Acceptance Criteria: Bug fix plus regression test

- [ ] Each page contains exactly pageSize orders (or fewer on the last page) and pages never overlap.
- [ ] A regression test fails on the original code and passes after the fix.
- [ ] Existing tests still pass.
- [ ] Unrelated code is not changed.

Each criterion is checked automatically (see `case.json`); hidden tests are in `hidden/` where present.
