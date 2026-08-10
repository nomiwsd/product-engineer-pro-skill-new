import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { canonicalTool, hostById, loadCatalog } from "./catalog.mjs";
import { Installer, computeTreeFingerprint, countStatuses, inspectInstallation, sha256 } from "./installer.mjs";

function parseArgs(args) {
  const command = args[0] || "help";
  const values = { command, dryRun: false, force: false, guidance: false, json: false, all: false, deprecatedAdapter: false };
  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") values.dryRun = true;
    else if (arg === "--force") values.force = true;
    else if (arg === "--guidance") values.guidance = true;
    else if (arg === "--json") values.json = true;
    else if (arg === "--all" || arg === "-a" || arg === "all") values.all = true;
    else if (arg === "--tool" || arg === "--adapter") {
      values.tool = args[index + 1];
      values.deprecatedAdapter ||= arg === "--adapter";
      index += 1;
    } else if (!arg.startsWith("-") && command === "init") values.tool = arg;
    else values.error = `Unknown option: ${arg}`;
  }
  return values;
}

function printResults(installer) {
  for (const item of installer.results) {
    const symbol = item.status === "collision" ? "COLLISION" : item.status.toUpperCase();
    console.log(`${symbol.padEnd(10)} ${item.path} — ${item.message}`);
  }
  console.log(`Summary: ${JSON.stringify(countStatuses(installer.results))}`);
}

function validTool(catalog, raw) {
  const id = canonicalTool(catalog, raw);
  return id && (id === "all" || Boolean(hostById(catalog, id))) ? id : null;
}

function detectLegacyTools(root, catalog) {
  const tools = [];
  for (const legacy of catalog.legacyArtifacts) if (existsSync(resolve(root, legacy.path)) && legacy.tool) tools.push(legacy.tool);
  if (existsSync(resolve(root, ".claude/skills/product-engineer-pro"))) tools.push("claude");
  if (existsSync(resolve(root, ".agents/skills/product-engineer-pro"))) tools.push("portable");
  return [...new Set(tools)];
}

function migrate(root, catalog, options) {
  const tools = detectLegacyTools(root, catalog);
  const results = [];
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  for (const legacy of catalog.legacyArtifacts) {
    const target = resolve(root, legacy.path);
    if (!existsSync(target)) continue;
    const stat = readFileOrDirectory(target);
    if (stat.type === "directory") {
      if (legacy.path === "product-engineer-pro") results.push({ status: "warning", path: legacy.path, message: "Legacy directory has no verifiable ownership fingerprint and was preserved." });
      continue;
    }
    const hash = sha256(stat.content);
    if (!legacy.sha256.includes(hash)) {
      results.push({ status: "warning", path: legacy.path, message: "Customized or unknown legacy file was preserved; migrate it manually." });
      continue;
    }
    const backup = resolve(root, `.product-engineer-pro/backups/migration-${stamp}/${legacy.path}`);
    if (!options.dryRun) {
      mkdirSync(dirname(backup), { recursive: true });
      copyFileSync(target, backup);
      rmSync(target);
    }
    results.push({ status: "success", path: legacy.path, message: options.dryRun ? "Would back up and remove known legacy artifact." : "Backed up and removed known legacy artifact." });
  }

  for (const skillPath of [".agents/skills/product-engineer-pro", ".claude/skills/product-engineer-pro"]) {
    const target = resolve(root, skillPath);
    if (!existsSync(target)) continue;
    const fingerprint = computeTreeFingerprint(target);
    const known = catalog.legacySkillTrees.some((item) => item.fileCount === fingerprint.fileCount && item.sha256 === fingerprint.sha256);
    if (!known) {
      results.push({ status: "warning", path: skillPath, message: "Legacy skill payload is customized or unknown and was preserved." });
      continue;
    }
    const backup = resolve(root, `.product-engineer-pro/backups/migration-${stamp}/${skillPath}`);
    if (!options.dryRun) {
      mkdirSync(dirname(backup), { recursive: true });
      cpSync(target, backup, { recursive: true });
      rmSync(target, { recursive: true });
    }
    results.push({ status: "success", path: skillPath, message: options.dryRun ? "Would back up and remove verified v1 skill payload." : "Backed up and removed verified v1 skill payload." });
  }

  const installer = new Installer(root, catalog, options);
  for (const tool of tools) installer.installTool(tool);
  installer.save();
  installer.results.unshift(...results);
  return installer;
}

function readFileOrDirectory(path) {
  try { return { type: "file", content: readFileSync(path) }; }
  catch { return { type: "directory" }; }
}

export async function runCli(args, root) {
  const catalog = loadCatalog();
  const parsed = parseArgs(args);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }
  if (parsed.deprecatedAdapter) console.warn("DEPRECATED: --adapter remains supported in v2; use --tool instead.");

  if (["version", "-v", "--version"].includes(parsed.command)) {
    console.log(`v${catalog.skill.version}`);
    return 0;
  }
  if (parsed.command === "list-tools") {
    const payload = catalog.hosts.map(({ id, label, tier, skillRoot, agents, commands }) => ({ id, label, tier, skillRoot, agents, commands }));
    payload.push({ id: "all", label: "All supported hosts", tier: "aggregate", skillRoot: null, agents: true, commands: true });
    if (parsed.json) console.log(JSON.stringify({ version: catalog.skill.version, tools: payload, aliases: catalog.aliases }, null, 2));
    else for (const item of payload) console.log(`${item.id.padEnd(10)} ${item.tier.padEnd(17)} ${item.label}`);
    return 0;
  }
  if (parsed.command === "doctor") {
    const tool = parsed.tool ? validTool(catalog, parsed.tool) : null;
    if (parsed.tool && !tool) {
      console.error(`Unknown tool: ${parsed.tool}`);
      return 1;
    }
    const report = inspectInstallation(root, catalog, tool);
    if (parsed.json) console.log(JSON.stringify(report, null, 2));
    else {
      for (const item of report.results) console.log(`${item.status.toUpperCase().padEnd(22)} ${item.path} — ${item.message}`);
      console.log(`Summary: ${JSON.stringify(report.summary)}`);
    }
    return report.summary.collision ? 2 : 0;
  }
  if (parsed.command === "migrate") {
    const installer = migrate(root, catalog, parsed);
    printResults(installer);
    return installer.collisions.length ? 2 : 0;
  }
  if (parsed.command === "init" || parsed.command === "install") {
    const selected = parsed.all ? "all" : validTool(catalog, parsed.tool || "claude");
    if (!selected) {
      console.error(`Unknown tool: ${parsed.tool}. Run list-tools for canonical IDs.`);
      return 1;
    }
    const tools = selected === "all" ? catalog.hosts.map((host) => host.id) : [selected];
    const installer = new Installer(root, catalog, parsed);
    for (const tool of tools) installer.installTool(tool, { guidance: parsed.guidance });
    installer.save();
    printResults(installer);
    return installer.collisions.length ? 2 : 0;
  }
  if (parsed.command === "update") {
    const installer = new Installer(root, catalog, parsed);
    const installed = installer.state.tools;
    if (!installed.length) {
      console.error("No v2 install state found. Run migrate for v1 installations or init for a clean install.");
      return 1;
    }
    for (const tool of installed) installer.installTool(tool);
    installer.removeStale(installed);
    installer.save();
    printResults(installer);
    return installer.collisions.length ? 2 : 0;
  }

  console.log(`@nomiwsd/product-engineer-pro v${catalog.skill.version}\n\nCommands:\n  init --tool <id> [--dry-run] [--guidance] [--force]\n  init --all [--dry-run]\n  update [--dry-run] [--force]\n  migrate [--dry-run] [--force]\n  doctor [--tool <id>] [--json]\n  list-tools [--json]\n  version\n\nUse lifecycle (plan/build/review) separately from the 13 engineering specialties.`);
  return parsed.command === "help" || parsed.command === "-h" || parsed.command === "--help" ? 0 : 1;
}
