import test from "node:test";
import assert from "node:assert/strict";
import { revenueByProduct, revenueByUser } from "../src/report.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("results are exactly the same as before the refactor", () => {
  assert.equal(revenueByUser("u1"), 587);
  assert.equal(revenueByUser("u2"), 0);
  assert.equal(revenueByProduct("p1"), 480);
  assert.equal(revenueByProduct("p2"), 106);
  assert.equal(revenueByProduct("p9"), 0);
});
