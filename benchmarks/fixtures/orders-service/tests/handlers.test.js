import test from "node:test";
import assert from "node:assert/strict";
import { getOrderHandler, listOrdersHandler } from "../src/handlers.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("handlers reject anonymous requests", () => {
  assert.equal(getOrderHandler({ params: { id: "o1" }, query: {} }).status, 401);
});

test("getOrderHandler returns the user's own order", () => {
  const res = getOrderHandler({ user: { id: "u1" }, params: { id: "o1" }, query: {} });
  assert.equal(res.status, 200);
  assert.equal(res.body.id, "o1");
});

test("listOrdersHandler returns a page of orders", () => {
  const res = listOrdersHandler({ user: { id: "u1" }, params: {}, query: {} });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});
