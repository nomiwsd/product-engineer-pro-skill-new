# Worked Examples

One realistic example per mode demonstrating input, reasoning, and output structure.

---

## 1. `audit` Mode

**Input:** "Audit the /api/users routes for security and code quality issues."

**Reasoning:** Run `references/core/repo-analysis.md` → detects Express 4.x, unvalidated `req.body` passed to SQL query (`security-owasp.md` A03), missing authorization check on `DELETE /users/:id` (`security-owasp.md` A01), and inconsistent error response shapes (`api-design.md`).

**Output (Abbreviated):**

```markdown
## Blockers (2)
1. **SQL Injection Risk** — `routes/users.js:34` — OWASP A03
   - Issue: Unvalidated `req.body.email` concatenated into raw SQL string.
   - Fix: Use parameterized query `WHERE email = $1`.
2. **Missing Authorization** — `routes/users.js:58` (`DELETE /users/:id`) — OWASP A01
   - Issue: No authentication or ownership verification middleware applied.
   - Fix: Add `requireAuth` middleware and verify `req.user.id === params.id`.

## Minor (1)
- Inconsistent error shapes across 5 routes — standardize per `api-design.md`.
```

---

## 2. `implement` Mode

**Input:** "Add a POST /orders endpoint. We are on NestJS 11."

**Reasoning:** `references/core/repo-analysis.md` confirms NestJS 11, Prisma ORM, and established DTO validation in `users` module. Follow `templates/backend/nestjs-resource.ts.md`: create `CreateOrderDto` with `class-validator`, keep controller thin, derive user ownership from authenticated token (`security-owasp.md` A01).

**Output:** `CreateOrderDto`, `OrdersService`, and `OrdersController` files formatted per `templates/backend/nestjs-resource.ts.md`.

---

## 3. `debug` Mode

**Input:** "Users report the cart total is sometimes wrong."

**Reasoning:** Inspect `calculateOrderTotal` function. Trace callers: cart summary page uses raw item price sum, whereas checkout applies discounts. Root cause: discount logic is missing in the shared `calculateOrderTotal` core function. Fix centrally instead of patching callers.

**Output:** Hypothesis statement, root cause explanation, fix in `calculateOrderTotal`, and regression test suite covering discounted items.

---

## 4. `refactor` Mode

**Input:** "This 200-line OrderController.create method is hard to follow."

**Reasoning:** Single method combines validation, pricing calculation, inventory checks, and persistence. Extract into separate focused functions (`validateOrderInput`, `calculatePricing`, `checkInventory`, `persistOrder`) without altering behavior.

**Output:** Refactored code diff + separate note flagging a latent bug found during refactoring for a follow-up ticket.

---

## 5. `design-system` Mode

**Input:** "Set up a color palette and dark mode for a new Tailwind v4 + shadcn project."

**Reasoning:** Greenfield setup. Define 3-tier token architecture (primitive → semantic → component) using `oklch()` color space (`references/frontend/design-system-theming.md`). Verify contrast ratios (4.5:1 text, 3:1 UI elements) in light and dark modes (`references/core/accessibility-a11y.md`).

**Output:** Tailwind v4 `@theme` block formatted per `templates/frontend/tailwind-theme-tokens.css.md`.

---

## 6. `performance` Mode

**Input:** "LCP is 4.8s on the product page."

**Reasoning:** Target metric is LCP (4.8s = "Poor"). Static analysis reveals unoptimized hero `<img>` tag without dimensions or priority loading. Convert to `next/image` with `priority` and explicit `width`/`height` attributes (`references/core/performance-web-vitals.md`).

**Output:** Diff converting `<img>` to `next/image` with `priority`, stating expected LCP reduction.

---

## 7. `seo` Mode

**Input:** "Our blog posts aren't showing rich previews when shared."

**Reasoning:** Page is public App Router route. Missing OpenGraph tags and JSON-LD Article structured data. Add `generateMetadata()` with `openGraph` properties and embedded JSON-LD script tag (`references/core/seo-technical.md`).

**Output:** App Router page code containing `generateMetadata()` and JSON-LD script.

---

## 8. `security` Mode

**Input:** "Check our login endpoint for security issues."

**Reasoning:** Maps to OWASP A07 (Authentication Failures). Finds no rate limiting on failed login attempts, and frontend stores JWT access tokens in `localStorage`. Recommend `express-rate-limit` and `HttpOnly` refresh cookies (`references/backend/auth-authz.md`).

**Output:** 2 Findings (Rate limiting + `HttpOnly` cookie migration) with OWASP tags and fixes.

---

## 9. `database` Mode

**Input:** "Should we use MongoDB or Postgres for a new activity-log feature?"

**Reasoning:** System already uses PostgreSQL (`references/core/repo-analysis.md`). Apply `references/database/data-modeling-decision-guide.md`: activity logs are document-shaped high-throughput writes (favors MongoDB), but introducing a second database engine carries high operational cost (favors Postgres `jsonb`). Recommend Postgres `jsonb` column first unless write volume exceeds benchmark.

**Output:** Decision rationale citing criteria from `data-modeling-decision-guide.md`.

---

## 10. `test` Mode

**Input:** "Write tests for the discount calculation logic."

**Reasoning:** No existing tests detected. Write unit tests covering standard cases, zero discount, and edge cases (100% discount) using Vitest/Jest (`references/core/testing-strategy.md`).

**Output:** Unit test suite formatted per `templates/testing/unit-test.spec.ts.md`.

---

## 11. `review` Mode

**Input:** "Review this PR diff adding a POST /api/export endpoint."

**Reasoning:** Security check finds missing authorization on export route (Blocker, OWASP A01) and password hash included in CSV payload (Blocker, OWASP A02). Performance check finds no pagination or row cap (Major). Maintainability matches router conventions.

**Output:** PR review formatted per `templates/process/pr-description.md` with 2 Blockers, 1 Major, positive feedback, and "Changes Requested" verdict.