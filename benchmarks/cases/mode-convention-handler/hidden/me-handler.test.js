import test from "node:test";
import assert from "node:assert/strict";
import * as handlers from "../src/handlers.js";
import { resetStore } from "../src/store.js";

const name = Object.keys(handlers).find((key) => /me/i.test(key) && /handler$/i.test(key) && !/order/i.test(key));
const handler = handlers[name];

test.beforeEach(() => resetStore());

test("a /me handler is exported from handlers.js", () => {
  assert.equal(typeof handler, "function", `exports: ${Object.keys(handlers).join(", ")}`);
});

test("it returns the signed-in user with the { status, body } shape", () => {
  const res = handler({ user: { id: "u1" }, params: {}, query: {}, body: {} });
  assert.equal(res.status, 200);
  assert.equal(res.body.id, "u1");
  assert.equal(res.body.name, "Ana");
});

test("it rejects anonymous requests like the other handlers", () => {
  assert.equal(handler({ params: {}, query: {}, body: {} }).status, 401);
});
