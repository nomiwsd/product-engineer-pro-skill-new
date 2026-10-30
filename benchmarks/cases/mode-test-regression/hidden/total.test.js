import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, getOrder } from "../src/orders.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("calculateTotal multiplies price by quantity", () => {
  assert.equal(calculateTotal(getOrder("o2")), 71);
  assert.equal(calculateTotal(getOrder("o5")), 360);
  assert.equal(calculateTotal(getOrder("o1")), 120);
});
