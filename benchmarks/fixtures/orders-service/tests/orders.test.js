import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, getOrder, listOrders } from "../src/orders.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("getOrder returns an order by id", () => {
  assert.equal(getOrder("o1").productId, "p1");
  assert.equal(getOrder("missing"), null);
});

test("listOrders only returns the user's orders", () => {
  for (const order of listOrders("u1", { page: 1, pageSize: 10 })) assert.equal(order.userId, "u1");
});

test("calculateTotal prices a single item", () => {
  assert.equal(calculateTotal(getOrder("o1")), 120);
});
