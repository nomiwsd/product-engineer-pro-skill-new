# Acceptance Criteria: Deploy-safe migration with rollback

- [ ] A new migration adds users.status with default 'active'.
- [ ] Existing rows end up with a value and the column ends up NOT NULL.
- [ ] Each new migration has a rollback (down step or a paired rollback file).
- [ ] Existing migrations are not edited.
- [ ] The sequence is safe while old and new instances run together.

Each criterion is checked automatically (see `case.json`); hidden tests are in `hidden/` where present.
