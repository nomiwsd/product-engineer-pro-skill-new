import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, getOrder, listOrders } from "../src/orders.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("the unrelated pagination bug was not changed (scope)", () => {
  assert.equal(listOrders("u1", { page: 1, pageSize: 2 }).length, 3);
});
