import test from "node:test";
import assert from "node:assert/strict";
import { searchOrdersHandler } from "../src/handlers.js";
import { db } from "../src/db.js";

test("user input never becomes part of the SQL text", () => {
  db.calls.length = 0;
  const attack = "x' OR '1'='1";
  const res = searchOrdersHandler({ user: { id: "u1" }, params: {}, query: { q: attack }, body: {} });
  assert.ok(res.status < 500);
  for (const call of db.calls) {
    assert.ok(!call.sql.includes(attack), `SQL contains user input: ${call.sql}`);
    assert.ok(!call.sql.includes("u1'"), `SQL contains the user id: ${call.sql}`);
  }
  if (res.status === 200) {
    assert.ok(db.calls.length > 0, "a successful search should query the database");
    assert.ok(db.calls.some((call) => JSON.stringify(call.params).includes("1'='1")), "user input should be passed as a parameter");
  }
});
