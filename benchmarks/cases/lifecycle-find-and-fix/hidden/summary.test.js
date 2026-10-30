import test from "node:test";
import assert from "node:assert/strict";
import { getOrderSummary } from "../src/orders.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("a summary for an order whose product was removed does not throw", () => {
  const summary = getOrderSummary("o3");
  assert.equal(summary.id, "o3");
  assert.equal(summary.productName, null);
  assert.equal(summary.total, 0);
});

test("a normal summary is unchanged", () => {
  assert.deepEqual(getOrderSummary("o1"), { id: "o1", productName: "Desk", total: 120 });
});
