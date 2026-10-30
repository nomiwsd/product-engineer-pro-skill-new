# Acceptance Criteria: Framework-version adaptation

- [ ] The page exists and renders the order id and the region cookie.
- [ ] Next.js 14 (App Router): params and cookies() are used synchronously.
- [ ] Next.js 15+: params and cookies() are awaited.
- [ ] Only the new page is added.

Each criterion is checked automatically (see `case.json`); hidden tests are in `hidden/` where present.
