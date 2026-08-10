import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "skill/manifest.json"), "utf8"));
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
manifest.skill.version = pkg.version;
const check = process.argv.includes("--check");
let drift = false;

function updateFile(path, content) {
  const absolute = resolve(root, path);
  const current = existsSync(absolute) ? readFileSync(absolute, "utf8") : null;
  if (current === content) return;
  if (check) {
    console.error(`Generated artifact drift: ${path}`);
    drift = true;
    return;
  }
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, content, "utf8");
  console.log(`Generated ${path}`);
}

function replaceBlock(path, startMarker, endMarker, body) {
  const absolute = resolve(root, path);
  const current = readFileSync(absolute, "utf8");
  const start = current.indexOf(startMarker);
  const end = current.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error(`Missing generated markers in ${path}`);
  const next = `${current.slice(0, start + startMarker.length)}\n${body.trim()}\n${current.slice(end)}`;
  updateFile(path, next);
}

const skillRows = manifest.workflows.map((workflow) => {
  const aliases = workflow.aliases.map((alias) => `\`${alias}\``).join(", ") || "-";
  return `| \`${workflow.id}\` | ${aliases} | ${workflow.defaultLifecycle} | [${workflow.id}](references/workflows/${workflow.id}.md) |`;
}).join("\n");
replaceBlock("skill/SKILL.md", "<!-- pep:workflows:start -->", "<!-- pep:workflows:end -->", `| Workflow | Aliases | Default lifecycle | Recipe |\n|---|---|---|---|\n${skillRows}`);

const hostRows = manifest.hosts.map((host) => `| \`${host.id}\` | ${host.label} | ${host.tier} | ${host.skillRoot ? `\`${host.skillRoot}\`` : "Configuration file"} | ${host.agents ? "Three native roles" : "No package-defined agents"} | \`${host.commandStyle}\` |`).join("\n");
replaceBlock("README.md", "<!-- pep:hosts:start -->", "<!-- pep:hosts:end -->", `| Tool ID | Host | Tier | Skill discovery | Roles | Workflow entry |\n|---|---|---|---|---|---|\n${hostRows}`);

const workflowRows = manifest.workflows.map((workflow) => `| \`${workflow.id}\` | ${workflow.aliases.map((alias) => `\`${alias}\``).join(", ") || "-"} | ${workflow.defaultLifecycle} | ${workflow.description} |`).join("\n");
replaceBlock("README.md", "<!-- pep:readme-workflows:start -->", "<!-- pep:readme-workflows:end -->", `| Specialty | Aliases | Default lifecycle | Purpose |\n|---|---|---|---|\n${workflowRows}`);

const websiteCatalog = {
  version: manifest.skill.version,
  lifecycles: manifest.lifecycles,
  workflows: manifest.workflows,
  hosts: manifest.hosts.map(({ id, label, tier, skillRoot, commandStyle, agents, commands }) => ({
    id,
    label,
    tier,
    skillRoot,
    commandStyle,
    agents,
    commands,
    installCommand: `npx @nomiwsd/product-engineer-pro init --tool ${id}`
  }))
};
updateFile("website/generated/catalog.json", `${JSON.stringify(websiteCatalog, null, 2)}\n`);

if (drift) process.exitCode = 1;
