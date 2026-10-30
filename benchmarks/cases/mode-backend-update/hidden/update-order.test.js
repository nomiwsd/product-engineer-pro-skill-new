import test from "node:test";
import assert from "node:assert/strict";
import * as handlers from "../src/handlers.js";
import { getOrder } from "../src/orders.js";
import { resetStore } from "../src/store.js";

const { updateOrderHandler } = handlers;
const request = (user, id, body) => ({ user, params: { id }, query: {}, body });

test.beforeEach(() => resetStore());

test("updateOrderHandler is exported", () => {
  assert.equal(typeof updateOrderHandler, "function");
});

test("anonymous requests are rejected", () => {
  assert.equal(updateOrderHandler(request(undefined, "o1", { quantity: 4 })).status, 401);
});

test("a user cannot change another user's order", () => {
  const res = updateOrderHandler(request({ id: "u2" }, "o1", { quantity: 9 }));
  assert.ok([403, 404].includes(res.status), `status ${res.status}`);
  assert.equal(getOrder("o1").quantity, 1);
});

test("invalid quantities are rejected with 400", () => {
  for (const quantity of [0, -1, 1.5, "x", undefined]) {
    assert.equal(updateOrderHandler(request({ id: "u1" }, "o1", { quantity })).status, 400, `quantity ${quantity}`);
  }
  assert.equal(getOrder("o1").quantity, 1);
});

test("the owner can change the quantity", () => {
  const res = updateOrderHandler(request({ id: "u1" }, "o1", { quantity: 4 }));
  assert.equal(res.status, 200);
  assert.equal(getOrder("o1").quantity, 4);
});
