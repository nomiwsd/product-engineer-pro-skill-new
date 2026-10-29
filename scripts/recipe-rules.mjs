// Checks that keep workflow recipes on the shared template and the operating rules
// resolvable. Used by validate-structure.mjs and tests/recipes.test.mjs.

export const RECIPE_SECTIONS = [
  "Goal",
  "Detect first",
  "Lifecycle behavior",
  "Process",
  "Version gates",
  "Best-practice checklist",
  "Evidence required",
  "Stop conditions",
  "Never",
  "Output",
  "References"
];

const FRAMEWORK_VERSION = /\b(?:Next\.js|React|Tailwind(?: CSS)?|Express|NestJS|Node\.js|TypeScript|PostgreSQL|MongoDB|Zod|Prisma|Mongoose|shadcn(?:\/ui)?)\s+v?\d+/;
const RULE_ID = /\b(?:C|D|ED|E|V|L)\d+\b/g;

const normalize = (text) => text.replace(/\r\n/g, "\n");

export function recipeErrors(name, text) {
  const errors = [];
  const headings = [...normalize(text).matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
  if (JSON.stringify(headings) !== JSON.stringify(RECIPE_SECTIONS)) {
    const missing = RECIPE_SECTIONS.filter((section) => !headings.includes(section));
    errors.push(`${name}: sections must be ${RECIPE_SECTIONS.join(" → ")}${missing.length ? `; missing ${missing.join(", ")}` : "; found them out of order or with extras"}`);
  }
  let section = "";
  for (const line of normalize(text).split("\n")) {
    const heading = line.match(/^## (.+)$/);
    if (heading) section = heading[1].trim();
    else if (section !== "Version gates" && FRAMEWORK_VERSION.test(line)) errors.push(`${name}: framework version outside "Version gates": ${line.trim()}`);
  }
  return errors;
}

export function definedRuleIds(rulesText) {
  return new Set([...normalize(rulesText).matchAll(/^- \*\*([A-Z]+\d+)\*\*/gm)].map((match) => match[1]));
}

export function undefinedRuleIds(name, text, defined) {
  return [...new Set(normalize(text).match(RULE_ID) ?? [])]
    .filter((id) => !defined.has(id))
    .map((id) => `${name}: cites rule ${id}, which operating-rules.md does not define`);
}
