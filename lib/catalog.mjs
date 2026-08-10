import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILL_ROOT = join(PACKAGE_ROOT, "skill");

export function loadCatalog() {
  const manifest = JSON.parse(readFileSync(join(SKILL_ROOT, "manifest.json"), "utf8"));
  const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));
  manifest.skill.version = pkg.version;
  return manifest;
}

export function canonicalTool(catalog, value) {
  if (!value) return null;
  return catalog.aliases[value] || value;
}

export function hostById(catalog, id) {
  return catalog.hosts.find((host) => host.id === id);
}

export function roleText(role) {
  if (role === "plan") {
    return "Research the repository with read/search tools only. Produce a decision-complete plan and never edit files.";
  }
  if (role === "review") {
    return "Audit code, diffs, tests, security, and quality. Remain read-only and report evidence-backed findings by severity.";
  }
  return "Implement authorized changes and run proportionate verification. Follow the host permission model and never weaken safeguards.";
}

export function workflowPrompt(workflow, host) {
  return `Use the product-engineer-pro skill for the ${workflow.id} specialty. Respect the current ${host.label} lifecycle/permission state. If it is read-only, return a decision-complete plan; otherwise follow the user's build or review intent.`;
}
