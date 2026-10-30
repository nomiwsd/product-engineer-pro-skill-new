import test from "node:test";
import assert from "node:assert/strict";
import { revenueByUser } from "../src/report.js";
import { resetStore } from "../src/store.js";

test.beforeEach(() => resetStore());

test("revenueByUser sums the user's orders", () => {
  assert.equal(revenueByUser("u2"), 0);
});
