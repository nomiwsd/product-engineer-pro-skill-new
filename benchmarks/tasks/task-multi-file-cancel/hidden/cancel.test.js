import test from "node:test";
import assert from "node:assert/strict";
import * as handlers from "../src/handlers.js";
import { getOrder, listOrders } from "../src/orders.js";
import { revenueByUser } from "../src/report.js";
import { resetStore } from "../src/store.js";

const { cancelOrderHandler } = handlers;
const as = (user, id) => ({ user, params: { id }, query: {}, body: {} });

test.beforeEach(() => resetStore());

test("cancelOrderHandler is exported", () => {
  assert.equal(typeof cancelOrderHandler, "function");
});

test("anonymous requests are rejected", () => {
  assert.equal(cancelOrderHandler(as(undefined, "o1")).status, 401);
});

test("another user cannot cancel the order", () => {
  const res = cancelOrderHandler(as({ id: "u2" }, "o1"));
  assert.ok([403, 404].includes(res.status), `status ${res.status}`);
  assert.notEqual(getOrder("o1").status, "cancelled");
});

test("an unknown order returns 404", () => {
  assert.equal(cancelOrderHandler(as({ id: "u1" }, "missing")).status, 404);
});

test("the owner cancels once; a second cancel is a 409 conflict", () => {
  assert.equal(cancelOrderHandler(as({ id: "u1" }, "o1")).status, 200);
  assert.equal(getOrder("o1").status, "cancelled");
  assert.equal(getOrder("o1").productId, "p1");
  assert.equal(cancelOrderHandler(as({ id: "u1" }, "o1")).status, 409);
});

test("cancelled orders leave listOrders and revenueByUser", () => {
  cancelOrderHandler(as({ id: "u1" }, "o5"));
  const ids = listOrders("u1", { page: 1, pageSize: 10 }).map((order) => order.id);
  assert.ok(!ids.includes("o5"), `listOrders still returns o5: ${ids}`);
  assert.equal(revenueByUser("u1"), 227);
});
