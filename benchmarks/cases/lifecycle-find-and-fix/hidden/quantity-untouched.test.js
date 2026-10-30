import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, getOrder, listOrders } from "../src/orders.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("the unrelated quantity bug was not changed (scope)", () => {
  assert.equal(calculateTotal(getOrder("o2")), 35.5);
});
