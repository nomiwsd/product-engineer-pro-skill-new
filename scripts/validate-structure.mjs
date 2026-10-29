import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { renderHostArtifacts } from "../lib/renderers.mjs";
import { definedRuleIds, recipeErrors, undefinedRuleIds } from "./recipe-rules.mjs";
import { validateSnapshot } from "./snapshot.mjs";

const at = (path) => resolve(process.cwd(), path);
const manifest = JSON.parse(readFileSync(at("skill/manifest.json"), "utf8"));
const errors = [];
const expected = ["audit", "backend", "database", "debug", "design-system", "frontend", "implement", "performance", "refactor", "review", "security", "seo", "test"];
const actual = manifest.workflows.map((item) => item.id);

if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`Manifest workflows differ: ${actual.join(", ")}`);
if (new Set(actual).size !== 13) errors.push("Manifest must contain 13 unique workflows.");

for (const workflow of manifest.workflows) {
  const path = `skill/references/workflows/${workflow.id}.md`;
  if (!existsSync(at(path))) {
    errors.push(`Missing ${path}`);
    continue;
  }
  errors.push(...recipeErrors(path, readFileSync(at(path), "utf8")));
}

const ruleIds = definedRuleIds(readFileSync(at("skill/references/core/operating-rules.md"), "utf8"));
const markdownUnder = (dir) => readdirSync(at(dir), { withFileTypes: true }).flatMap((entry) => {
  const rel = `${dir}/${entry.name}`;
  return entry.isDirectory() ? markdownUnder(rel) : rel.endsWith(".md") ? [rel] : [];
});
for (const path of markdownUnder("skill")) errors.push(...undefinedRuleIds(path, readFileSync(at(path), "utf8"), ruleIds));

const skill = readFileSync(at("skill/SKILL.md"), "utf8").replace(/\r\n/g, "\n");
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatter) errors.push("SKILL.md frontmatter is invalid.");
else {
  const keys = [...frontmatter[1].matchAll(/^([a-zA-Z0-9_-]+):/gm)].map((match) => match[1]);
  if (keys.join(",") !== "name,description") errors.push(`SKILL.md frontmatter keys must be name,description; got ${keys.join(",")}`);
}
for (const workflow of expected) if (!skill.includes(`references/workflows/${workflow}.md`)) errors.push(`SKILL.md does not route ${workflow}.`);

for (const obsolete of ["skill/adapters/codex/instructions.md", "skill/adapters/windsurf/.windsurfrules", "skill/adapters/roo-code/.clinerules"]) if (existsSync(at(obsolete))) errors.push(`Obsolete adapter remains: ${obsolete}`);

const openaiYaml = readFileSync(at("skill/agents/openai.yaml"), "utf8");
for (const token of ["interface:", "display_name:", "short_description:", "$product-engineer-pro", "allow_implicit_invocation:"]) if (!openaiYaml.includes(token)) errors.push(`agents/openai.yaml missing ${token}`);

const snapshot = JSON.parse(readFileSync(at("skill/references/version-snapshot.json"), "utf8"));
for (const error of validateSnapshot(snapshot)) errors.push(`Version snapshot: ${error}`);

for (const host of manifest.hosts) {
  const artifacts = renderHostArtifacts(manifest, host);
  const paths = new Set(artifacts.map((item) => item.path));
  if (host.commands) for (const workflow of manifest.workflows) if (![...paths].some((path) => path.includes(workflow.id))) errors.push(`${host.id} has no generated entry for ${workflow.id}.`);
  if (host.agents) for (const role of ["plan", "build", "review"]) if (![...paths].some((path) => path.includes(`pep-${role}`))) errors.push(`${host.id} has no ${role} agent.`);
}

const templateFiles = [
  "skill/templates/backend/express-controller.ts.md",
  "skill/templates/testing/unit-test.spec.ts.md",
  "skill/templates/frontend/tailwind-theme-tokens.css.md",
  "skill/templates/database/postgres-migration.sql.md",
  "skill/templates/testing/e2e-test.spec.ts.md"
].map((path) => [path, readFileSync(at(path), "utf8")]);
for (const [path, content] of templateFiles) if (/\bas any\b/.test(content)) errors.push(`${path}: contains as any.`);
if (/^\s*ALTER TABLE .* DROP /m.test(templateFiles[3][1])) errors.push("PostgreSQL contract DROP is executable.");
if (!templateFiles[4][1].includes("PAYMENT_ENVIRONMENT")) errors.push("Payment E2E template lacks sandbox guard.");
if (templateFiles[2][1].includes("oklch(var(")) errors.push("Tailwind template nests complete color values.");

const matrix = readFileSync(at("AGENT-CAPABILITY-MATRIX.md"), "utf8");
const matrixRows = [...matrix.matchAll(/^\| `([^`]+)` \| [^|]+ \| ([^|]+?) \| [^|]+ \| ([^|]+?) \|/gm)];
const matrixIds = matrixRows.map((match) => match[1]);
if (JSON.stringify(matrixIds) !== JSON.stringify(manifest.hosts.map((host) => host.id))) errors.push(`AGENT-CAPABILITY-MATRIX.md hosts differ from the manifest: ${matrixIds.join(", ")}`);
for (const [, id, tier, behaviour] of matrixRows) {
  const host = manifest.hosts.find((item) => item.id === id);
  if (host && host.tier !== tier.trim()) errors.push(`AGENT-CAPABILITY-MATRIX.md: ${id} tier is ${tier.trim()}, manifest says ${host.tier}.`);
  if (!/^(\*\*Behaviour tested\*\*.*|Not tested)$/.test(behaviour.trim())) errors.push(`AGENT-CAPABILITY-MATRIX.md: ${id} behaviour status must be "Behaviour tested" or "Not tested".`);
}

const websiteText = ["website/components/Features.tsx", "website/components/Hero.tsx", "website/components/ModesShowcase.tsx"].map((path) => readFileSync(at(path), "utf8")).join("\n");
for (const claim of ["~0.8s", "≤ 150", "100% Enforced", "CLS = 0", "LCP < 1.2"]) if (websiteText.includes(claim)) errors.push(`Website contains unsupported claim: ${claim}`);

if (errors.length) {
  console.error(`Structure validation failed (${errors.length}):\n${errors.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log("Structure, manifest, host artifacts, snapshot, and safety templates are valid.");
