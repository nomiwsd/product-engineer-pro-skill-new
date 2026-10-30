# Acceptance Criteria: Existing-codebase feature change

- [ ] SAVE10 applies 10% off, rounded to 2 decimals.
- [ ] FLAT5 subtracts 5 and never returns less than 0.
- [ ] Codes are case-insensitive.
- [ ] Unknown codes throw an Error containing "Unknown discount code".
- [ ] Existing exports and their tests are unchanged.
- [ ] New tests are added with the existing test runner.

Each criterion is checked automatically (see `case.json`); hidden tests are in `hidden/` where present.
