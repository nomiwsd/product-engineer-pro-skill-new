import test from "node:test";
import assert from "node:assert/strict";
import { applyDiscount } from "../src/discounts.js";

test("SAVE10 takes 10% off, rounded to 2 decimals", () => {
  assert.equal(applyDiscount(100, "SAVE10"), 90);
  assert.equal(applyDiscount(35.5, "SAVE10"), 31.95);
  assert.equal(applyDiscount(10.01, "SAVE10"), 9.01);
});

test("FLAT5 takes 5 off and never goes below 0", () => {
  assert.equal(applyDiscount(20, "FLAT5"), 15);
  assert.equal(applyDiscount(3, "FLAT5"), 0);
});

test("codes are case-insensitive", () => {
  assert.equal(applyDiscount(100, "save10"), 90);
  assert.equal(applyDiscount(20, "Flat5"), 15);
});

test("an unknown code throws", () => {
  assert.throws(() => applyDiscount(100, "FREE100"), /Unknown discount code/);
});
