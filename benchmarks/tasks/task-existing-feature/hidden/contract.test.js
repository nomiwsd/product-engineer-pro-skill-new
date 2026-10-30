import test from "node:test";
import assert from "node:assert/strict";
import * as orders from "../src/orders.js";
import * as handlers from "../src/handlers.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("existing exports are still present", () => {
  for (const name of ["getOrder", "listOrders", "calculateTotal", "getOrderSummary", "createOrder"]) assert.equal(typeof orders[name], "function", name);
  for (const name of ["getOrderHandler", "listOrdersHandler", "searchOrdersHandler", "createOrderHandler"]) assert.equal(typeof handlers[name], "function", name);
});

test("existing behavior is unchanged", () => {
  assert.equal(orders.calculateTotal(orders.getOrder("o1")), 120);
  assert.equal(orders.calculateTotal(orders.getOrder("o2")), 35.5);
  assert.equal(orders.listOrders("u1", { page: 1, pageSize: 2 }).length, 3);
});
