import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { RECIPE_SECTIONS, definedRuleIds, recipeErrors, undefinedRuleIds } from "../scripts/recipe-rules.mjs";

const recipes = readdirSync(resolve("skill/references/workflows")).filter((name) => name.endsWith(".md"));
const rules = definedRuleIds(readFileSync(resolve("skill/references/core/operating-rules.md"), "utf8"));

function recipe(sections = RECIPE_SECTIONS, body = "Text.") {
  return `# Workflow: Example\n\n${sections.map((section) => `## ${section}\n\n${body}\n`).join("\n")}`;
}

test("all 13 shipped recipes follow the template", () => {
  assert.equal(recipes.length, 13);
  for (const name of recipes) assert.deepEqual(recipeErrors(name, readFileSync(resolve("skill/references/workflows", name), "utf8")), []);
});

test("a recipe missing or reordering sections is rejected", () => {
  assert.match(recipeErrors("x.md", recipe(RECIPE_SECTIONS.filter((section) => section !== "Stop conditions"))).join(), /missing Stop conditions/);
  const swapped = [...RECIPE_SECTIONS];
  [swapped[1], swapped[2]] = [swapped[2], swapped[1]];
  assert.match(recipeErrors("x.md", recipe(swapped)).join(), /out of order/);
});

test("framework versions are allowed only in Version gates", () => {
  assert.deepEqual(recipeErrors("x.md", recipe().replace("## Version gates\n\nText.", "## Version gates\n\n| Next.js 15+ | await params |")), []);
  const leaked = recipe().replace("## Process\n\nText.", "## Process\n\nUse React 19 hooks everywhere.");
  assert.match(recipeErrors("x.md", leaked).join(), /framework version outside "Version gates": Use React 19/);
});

test("operating rules define every universal rule family", () => {
  for (const id of ["C1", "C4", "D1", "D6", "ED1", "ED5", "E1", "E5", "V1", "V4", "L1", "L4"]) assert.ok(rules.has(id), id);
});

test("citing an undefined rule is reported", () => {
  assert.deepEqual(undefinedRuleIds("x.md", "Follow rule C4 and rule ED2.", rules), []);
  assert.deepEqual(undefinedRuleIds("x.md", "Follow rule D9.", rules), ["x.md: cites rule D9, which operating-rules.md does not define"]);
});
