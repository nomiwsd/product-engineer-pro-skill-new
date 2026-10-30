import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { grade, parseTranscript, rubric } from "../benchmarks/runner/grade.mjs";

const BENCH = resolve("benchmarks");
const roots = [];
test.after(() => { for (const root of roots) rmSync(root, { recursive: true, force: true }); });

function transcript({ text = "", bash = [] } = {}) {
  const events = [
    { type: "system", subtype: "init", model: "test-model", claude_code_version: "0.0.0", skills: ["product-engineer-pro"] },
    { type: "assistant", message: { content: [{ type: "text", text }, ...bash.map((command) => ({ type: "tool_use", name: "Bash", input: { command } }))] } },
    { type: "result", result: text, num_turns: 2, total_cost_usd: 0.01 }
  ];
  return events.map((event) => JSON.stringify(event)).join("\n");
}

function workdir(fixture = "orders-service") {
  const root = mkdtempSync(join(tmpdir(), "pep-grade-"));
  roots.push(root);
  cpSync(join(BENCH, "fixtures", fixture), root, { recursive: true });
  const git = (...args) => spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.invalid", "-c", "core.autocrlf=false", ...args], { cwd: root });
  git("init", "-q");
  git("add", "-A");
  git("commit", "-q", "-m", "fixture");
  return root;
}

const caseItem = (id, kind = "cases") => ({ ...JSON.parse(readFileSync(join(BENCH, kind, id, "case.json"), "utf8")), id, kind, dir: join(BENCH, kind, id) });

test("parseTranscript collects text, tool uses, and run metadata", () => {
  const run = parseTranscript(transcript({ text: "Done.", bash: ["npm test"] }));
  assert.equal(run.model, "test-model");
  assert.equal(run.toolUses[0].input.command, "npm test");
  assert.match(run.text, /Done\./);
  assert.equal(run.turns, 2);
});

test("an untouched read-only case passes, and an edit fails it", () => {
  const item = caseItem("lifecycle-review-no-edit");
  const root = workdir();
  const reply = "Blocker: getOrderHandler at src/handlers.js:9 lets any user read any order.";
  assert.equal(grade(item, root, transcript({ text: reply }), BENCH).status, "pass");
  writeFileSync(join(root, "src", "handlers.js"), "// edited\n");
  const edited = grade(item, root, transcript({ text: reply }), BENCH);
  assert.equal(edited.checks.find((check) => check.type === "unchanged").passed, false);
});

test("hidden tests fail on the original fixture and pass after a correct fix", () => {
  const item = caseItem("mode-test-regression");
  const original = grade(item, workdir(), transcript(), BENCH);
  assert.equal(original.checks.find((check) => check.type === "hiddenTests").passed, false);

  const root = workdir();
  const path = join(root, "src", "orders.js");
  writeFileSync(path, readFileSync(path, "utf8").replace("return product.price;", "return product.price * order.quantity;"));
  writeFileSync(join(root, "tests", "total.test.js"), 'import test from "node:test";\nimport assert from "node:assert/strict";\nimport { calculateTotal, getOrder } from "../src/orders.js";\ntest("quantity", () => assert.equal(calculateTotal(getOrder("o2")), 71));\n');
  const fixed = grade(item, root, transcript({ bash: ["npm test"] }), BENCH);
  assert.equal(fixed.checks.find((check) => check.type === "hiddenTests").passed, true);
  assert.equal(fixed.checks.find((check) => check.type === "agentTestsFailOnOriginal").passed, true);
});

test("claiming passing tests without running them is a false claim", () => {
  const item = caseItem("task-regression-fix", "tasks");
  assert.equal(grade(item, workdir(), transcript({ text: "Fixed. All tests pass." }), BENCH).falseClaim, true);
  assert.equal(grade(item, workdir(), transcript({ text: "Fixed. All tests pass.", bash: ["npm test"] }), BENCH).falseClaim, false);
  assert.equal(grade(item, workdir(), transcript({ text: "I could not confirm the tests pass because no shell was available." }), BENCH).falseClaim, false);
});

test("rubric weights only the dimensions a task measures", () => {
  const scored = rubric([
    { dimension: "functional", passed: true },
    { dimension: "functional", passed: false },
    { dimension: "scope", passed: true }
  ]);
  assert.equal(scored.dimensions.functional.score, 3);
  assert.equal(scored.dimensions.scope.score, 5);
  assert.equal(scored.weighted, Math.round(((3 / 5) * 30 + 10) / 40 * 100));
});

test("published results never contain local absolute paths", async () => {
  const { REPO, scrub } = await import("../benchmarks/runner/items.mjs");
  const text = `${REPO}\\src\\x.js | file:///E:/somewhere/else/y.js:3 | C:\\Users\\someone\\tmp\\z.js | /home/me/a.js`;
  const clean = scrub(text, "/home/me");
  assert.doesNotMatch(clean, /[A-Za-z]:[\\/]|file:\/\/\/|\/home\/me/);
  assert.match(clean, /<repo>/);
});
