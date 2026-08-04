# Template: E2E Test (Playwright)

Implements standards from `references/core/testing-strategy.md` — reserved for critical user journeys (e.g. checkout, authentication).

## When to Use

Writing end-to-end integration tests for high-impact user flows.

## Template

```ts
import { test, expect } from "@playwright/test";

test.describe("Checkout flow", () => {
  test("user can complete a purchase with a valid card", async ({ page }) => {
    await page.goto("/products/blue-widget");
    await page.getByRole("button", { name: "Add to cart" }).click();

    await page.goto("/cart");
    await page.getByRole("button", { name: "Checkout" }).click();

    await page.getByLabel("Card number").fill("4242424242424242");
    await page.getByLabel("Expiry").fill("12/30");
    await page.getByLabel("CVC").fill("123");
    await page.getByRole("button", { name: "Pay now" }).click();

    await expect(page.getByText("Order confirmed")).toBeVisible();
    await expect(page).toHaveURL(/\/orders\/[a-z0-9-]+\/confirmation/);
  });

  test("shows a validation error for an expired card", async ({ page }) => {
    await page.goto("/checkout");
    await page.getByLabel("Card number").fill("4242424242424242");
    await page.getByLabel("Expiry").fill("01/20");
    await page.getByRole("button", { name: "Pay now" }).click();

    await expect(page.getByText("Card has expired")).toBeVisible();
  });
});
```

## Adaptation Notes

- Reserve E2E tests for critical user journeys (checkout, authentication, onboarding).
- Prefer accessibility role/label selectors (`getByRole`, `getByLabel`) over brittle CSS selectors (`accessibility-a11y.md`).
- Run E2E tests against dedicated sandbox/test environments.