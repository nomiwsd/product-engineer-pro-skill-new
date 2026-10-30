import test from "node:test";
import assert from "node:assert/strict";
import { listOrders } from "../src/orders.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("pages have pageSize items and never overlap", () => {
  const page1 = listOrders("u1", { page: 1, pageSize: 2 }).map((order) => order.id);
  const page2 = listOrders("u1", { page: 2, pageSize: 2 }).map((order) => order.id);
  assert.deepEqual(page1, ["o1", "o2"]);
  assert.deepEqual(page2, ["o4", "o5"]);
});

test("the last page and pages beyond the end", () => {
  assert.deepEqual(listOrders("u1", { page: 2, pageSize: 3 }).map((order) => order.id), ["o5"]);
  assert.deepEqual(listOrders("u1", { page: 3, pageSize: 2 }), []);
});
