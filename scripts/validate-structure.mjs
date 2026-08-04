import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const REQUIRED_SECTIONS_STANDARD = ["## Scope", "## Detection", "## Standards", "## Anti-Patterns", "## Related References", "## Applies To Modes"];
const REQUIRED_SECTIONS_WORKFLOW = ["## Goal", "## Process", "## Checklist", "## Output Format", "## Related References"];
const VERSIONED_DIRS = ["frontend", "backend", "database"];
const VERIFY_CAVEAT = "Verify before relying";

let errors = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".md")) checkFile(full);
  }
}

function checkFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const normalizedPath = filePath.replace(/\\/g, "/");

  const isWorkflow = normalizedPath.includes("/workflows/");
  const isVersioned = VERSIONED_DIRS.some((d) => normalizedPath.includes(`/${d}/`));

  if (isWorkflow) {
    for (const section of REQUIRED_SECTIONS_WORKFLOW) {
      if (!content.includes(section)) errors.push(`${filePath}: missing "${section}"`);
    }
  } else if (isVersioned) {
    for (const section of REQUIRED_SECTIONS_STANDARD) {
      if (!content.includes(section)) errors.push(`${filePath}: missing "${section}"`);
    }
    if (!content.includes("## Version Matrix")) {
      errors.push(`${filePath}: missing "## Version Matrix"`);
    }
    if (content.includes("## Version Matrix") && !content.includes(VERIFY_CAVEAT)) {
      errors.push(`${filePath}: Version Matrix missing verify-before-relying caveat`);
    }
  }
}

if (existsSync("skill/references")) {
  walk("skill/references");
} else {
  errors.push("Directory 'skill/references' not found.");
}

if (errors.length) {
  console.error(`✘ Structure validation failed:\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("✔ Structure validation passed.");
