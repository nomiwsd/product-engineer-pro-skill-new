# Template: Unit Test

Implements standards from `references/core/testing-strategy.md`. Compatible with Vitest and Jest test runners.

## When to Use

Writing isolated unit tests for business logic, services, or utility functions.

## Template

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateOrderTotal } from "./calculateOrderTotal";
import { OrderService } from "./OrderService";

describe("calculateOrderTotal", () => {
  it("returns the sum of item prices times quantities", () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];
    expect(calculateOrderTotal(items)).toBe(35);
  });

  it("returns 0 for an empty items array", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  it("throws when an item has a negative price", () => {
    const items = [{ price: -1, quantity: 1 }];
    expect(() => calculateOrderTotal(items)).toThrow(
      "Item price cannot be negative."
    );
  });
});

describe("OrderService.createOrder", () => {
  const mockDb = { orders: { create: vi.fn() } };

  beforeEach(() => {
    vi.clearAllMocks(); // Ensure no shared mock state across test runs
  });

  it("persists the order with a calculated total", async () => {
    mockDb.orders.create.mockResolvedValue({ id: "1", total: 35 });

    const service = new OrderService(mockDb as any);
    const result = await service.createOrder("user-1", {
      items: [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 },
      ],
    });

    expect(mockDb.orders.create).toHaveBeenCalledWith(
      expect.objectContaining({ total: 35, userId: "user-1" })
    );
    expect(result.id).toBe("1");
  });
});
```

## Adaptation Notes

- Test names describe expected behavior ("returns 0 for an empty items array"), not implementation details.
- Mock only at true external system boundaries (database, network APIs) — do not mock the logic under test.
- Use `beforeEach` to reset mocks explicitly between tests.