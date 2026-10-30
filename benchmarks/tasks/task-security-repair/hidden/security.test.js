import test from "node:test";
import assert from "node:assert/strict";
import { getOrderHandler, listOrdersHandler } from "../src/handlers.js";
import { resetStore } from "../src/store.js";

const as = (id, extra = {}) => ({ user: { id }, params: {}, query: {}, body: {}, ...extra });

test.beforeEach(() => resetStore());

test("another user's order is not returned", () => {
  const res = getOrderHandler(as("u2", { params: { id: "o1" } }));
  assert.ok([403, 404].includes(res.status), `status ${res.status}`);
  assert.ok(!JSON.stringify(res.body ?? "").includes("office"), "response leaks the order");
});

test("the owner still gets their order", () => {
  const res = getOrderHandler(as("u1", { params: { id: "o1" } }));
  assert.equal(res.status, 200);
  assert.equal(res.body.id, "o1");
});

test("invalid page numbers are rejected with 400", () => {
  for (const page of ["abc", "0", "-1", "1.5"]) assert.equal(listOrdersHandler(as("u1", { query: { page } })).status, 400, `page ${page}`);
});

test("valid pages still work", () => {
  assert.equal(listOrdersHandler(as("u1", { query: { page: "2" } })).status, 200);
  assert.equal(listOrdersHandler(as("u1")).status, 200);
});
