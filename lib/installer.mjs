import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, relative, resolve, sep } from "node:path";
import { SKILL_ROOT, hostById } from "./catalog.mjs";
import { renderGuidance, renderHostArtifacts } from "./renderers.mjs";

const STATE_PATH = ".product-engineer-pro/install-state.json";
const START = "# >>> product-engineer-pro managed >>>";
const END = "# <<< product-engineer-pro managed <<<";

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function posix(value) {
  return value.split(sep).join("/");
}

function safePath(root, rel) {
  const target = resolve(root, rel);
  const prefix = `${resolve(root)}${sep}`;
  if (target !== resolve(root) && !target.startsWith(prefix)) throw new Error(`Unsafe target path: ${rel}`);
  return target;
}

function listFiles(root, prefix = "") {
  const output = [];
  for (const entry of readdirSync(resolve(root, prefix), { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) output.push(...listFiles(root, rel));
    else if (entry.isFile()) output.push(rel);
  }
  return output.sort();
}

function initialState(version) {
  return { schemaVersion: 2, packageVersion: version, tools: [], files: {}, backups: [] };
}

function readState(root, version) {
  const path = safePath(root, STATE_PATH);
  if (!existsSync(path)) return initialState(version);
  try {
    const state = JSON.parse(readFileSync(path, "utf8"));
    return state.schemaVersion === 2 ? state : initialState(version);
  } catch {
    return initialState(version);
  }
}

export class Installer {
  constructor(root, catalog, options = {}) {
    this.root = resolve(root);
    this.catalog = catalog;
    this.version = catalog.skill.version;
    this.dryRun = Boolean(options.dryRun);
    this.force = Boolean(options.force);
    this.state = readState(this.root, this.version);
    this.results = [];
    this.collisions = [];
    this.desired = new Set();
    this.stamp = new Date().toISOString().replace(/[:.]/g, "-");
  }

  result(status, path, message, extra = {}) {
    const item = { status, path: posix(path), message, ...extra };
    this.results.push(item);
    if (status === "collision") this.collisions.push(item);
    return item;
  }

  backup(rel) {
    const source = safePath(this.root, rel);
    const backupRel = `.product-engineer-pro/backups/${this.stamp}/${posix(rel)}`;
    const target = safePath(this.root, backupRel);
    if (!this.dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(source, target);
    }
    this.state.backups.push({ source: posix(rel), path: backupRel, createdAt: new Date().toISOString() });
    return backupRel;
  }

  record(rel, data) {
    const current = this.state.files[posix(rel)] || {};
    const tools = [...new Set([...(current.tools || []), ...(data.tools || [])])].sort();
    this.state.files[posix(rel)] = { ...current, ...data, tools };
    this.desired.add(posix(rel));
  }

  writeStandalone(rel, content, tools, capability = "native") {
    rel = posix(rel);
    const target = safePath(this.root, rel);
    const desired = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const desiredHash = sha256(desired);
    const owned = this.state.files[rel];
    this.desired.add(rel);

    if (existsSync(target)) {
      if (!lstatSync(target).isFile()) return this.result("collision", rel, "Expected a file but found another filesystem object.");
      const current = readFileSync(target);
      const currentHash = sha256(current);
      if (currentHash === desiredHash) {
        this.record(rel, { kind: "standalone", sha256: desiredHash, tools, capability, version: this.version });
        return this.result("success", rel, owned ? "Already current." : "Adopted byte-identical generated content.");
      }
      if (!owned) return this.result("collision", rel, "Unowned file differs; it was preserved.");
      if (currentHash !== owned.sha256 && !this.force) return this.result("collision", rel, "Package-owned file was edited; use --force to back it up and replace it.");
      if (currentHash !== owned.sha256 && this.force) this.backup(rel);
    }

    if (!this.dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, desired);
    }
    this.record(rel, { kind: "standalone", sha256: desiredHash, tools, capability, version: this.version });
    return this.result("success", rel, this.dryRun ? "Would write generated file." : "Wrote generated file.");
  }

  writeManagedBlock(rel, body, tools) {
    rel = posix(rel);
    const target = safePath(this.root, rel);
    const block = `${START}\n${body.trim()}\n${END}`;
    const blockHash = sha256(block);
    const owned = this.state.files[rel];
    let current = existsSync(target) ? readFileSync(target, "utf8") : "";
    const start = current.indexOf(START);
    const endStart = current.indexOf(END);

    if ((start >= 0) !== (endStart >= 0) || (start >= 0 && endStart < start)) {
      return this.result("collision", rel, "Managed markers are incomplete; file was preserved.");
    }
    if (start >= 0) {
      const end = endStart + END.length;
      const currentBlock = current.slice(start, end);
      if (!owned) return this.result("collision", rel, "An unowned Product Engineer Pro marker block already exists.");
      if (sha256(currentBlock) !== owned.blockSha256 && !this.force) {
        return this.result("collision", rel, "Managed block was edited; use --force to back up and replace only that block.");
      }
      if (sha256(currentBlock) !== owned.blockSha256 && this.force) this.backup(rel);
      current = `${current.slice(0, start)}${block}${current.slice(end)}`;
    } else {
      current = current.trimEnd() ? `${current.trimEnd()}\n\n${block}\n` : `${block}\n`;
    }

    if (!this.dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, current, "utf8");
    }
    this.record(rel, { kind: "managed-block", blockSha256: blockHash, tools, capability: "guidance", version: this.version });
    return this.result("success", rel, this.dryRun ? "Would merge managed guidance." : "Merged managed guidance.");
  }

  copySkill(destination, tool) {
    for (const rel of listFiles(SKILL_ROOT)) {
      if (rel === "AGENTS.md" || rel.startsWith("adapters/")) continue;
      this.writeStandalone(`${destination}/${rel}`, readFileSync(resolve(SKILL_ROOT, rel)), [tool], "skill");
    }
  }

  mergeAiderConfig(tool) {
    const rel = ".aider.conf.yml";
    const target = safePath(this.root, rel);
    const current = existsSync(target) ? readFileSync(target, "utf8") : "";
    const body = "read:\n  - CONVENTIONS.md";
    if (!current || !/^read\s*:/m.test(current)) {
      return this.writeManagedBlock(rel, body, [tool]);
    }
    if (current.includes(START)) return this.writeManagedBlock(rel, "  - CONVENTIONS.md", [tool]);
    if (/^\s*-\s*["']?CONVENTIONS\.md["']?\s*$/m.test(current)) {
      this.result("success", rel, "Existing Aider configuration already loads CONVENTIONS.md.", { capability: "portable" });
      return;
    }
    const lines = current.split(/\r?\n/);
    const readIndex = lines.findIndex((line) => /^read\s*:/.test(line));
    let insertIndex = readIndex + 1;
    while (insertIndex < lines.length && (lines[insertIndex].trim() === "" || /^\s+/.test(lines[insertIndex]) || /^\s*#/.test(lines[insertIndex]))) insertIndex += 1;
    const block = `${START}\n  - CONVENTIONS.md\n${END}`;
    lines.splice(insertIndex, 0, block);
    if (!this.dryRun) writeFileSync(target, lines.join("\n"), "utf8");
    this.record(rel, { kind: "managed-block", blockSha256: sha256(block), tools: [tool], capability: "portable", version: this.version });
    this.result("success", rel, this.dryRun ? "Would merge CONVENTIONS.md into the existing Aider read list." : "Merged CONVENTIONS.md into the existing Aider read list.");
  }

  installTool(toolId, options = {}) {
    const host = hostById(this.catalog, toolId);
    if (!host) throw new Error(`Unknown tool: ${toolId}`);
    if (host.skillRoot) this.copySkill(host.skillRoot, toolId);
    for (const artifact of renderHostArtifacts(this.catalog, host)) {
      this.writeStandalone(artifact.path, `${artifact.content.trimEnd()}\n`, [toolId], artifact.capability);
    }
    if (toolId === "aider") this.mergeAiderConfig(toolId);
    if (toolId === "portable") this.writeManagedBlock("AGENTS.md", renderGuidance(this.catalog, host), [toolId]);
    if (options.guidance && toolId !== "portable" && toolId !== "aider") {
      const guidancePaths = {
        claude: "CLAUDE.md",
        gemini: "GEMINI.md",
        copilot: ".github/copilot-instructions.md",
        codex: "AGENTS.md",
        cursor: "AGENTS.md",
        windsurf: "AGENTS.md",
        "roo-code": "AGENTS.md",
        cline: "AGENTS.md"
      };
      const path = guidancePaths[toolId];
      if (path) this.writeManagedBlock(path, renderGuidance(this.catalog, host), [toolId]);
    }
    this.state.tools = [...new Set([...this.state.tools, toolId])].sort();
  }

  removeStale(activeTools) {
    for (const [rel, entry] of Object.entries({ ...this.state.files })) {
      const ownedTools = entry.tools || [];
      if (!ownedTools.some((tool) => activeTools.includes(tool)) || this.desired.has(rel)) continue;
      const remainingTools = ownedTools.filter((tool) => !activeTools.includes(tool));
      if (remainingTools.length) {
        entry.tools = remainingTools;
        continue;
      }
      const target = safePath(this.root, rel);
      if (!existsSync(target)) {
        delete this.state.files[rel];
        continue;
      }
      if (entry.kind === "standalone") {
        const currentHash = sha256(readFileSync(target));
        if (currentHash !== entry.sha256) {
          this.result("collision", rel, "Stale package-owned file was edited and was preserved.");
          continue;
        }
        if (!this.dryRun) rmSync(target);
      } else {
        let current = readFileSync(target, "utf8");
        const start = current.indexOf(START);
        const endStart = current.indexOf(END);
        if (start < 0 || endStart < start) {
          this.result("collision", rel, "Stale managed block could not be located.");
          continue;
        }
        const end = endStart + END.length;
        if (sha256(current.slice(start, end)) !== entry.blockSha256) {
          this.result("collision", rel, "Stale managed block was edited and was preserved.");
          continue;
        }
        current = `${current.slice(0, start).trimEnd()}\n${current.slice(end).trimStart()}`;
        if (!this.dryRun) writeFileSync(target, current, "utf8");
      }
      delete this.state.files[rel];
      this.result("success", rel, this.dryRun ? "Would remove stale package artifact." : "Removed stale package artifact.");
    }
  }

  save() {
    this.state.packageVersion = this.version;
    this.state.updatedAt = new Date().toISOString();
    if (!this.dryRun) {
      const target = safePath(this.root, STATE_PATH);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, `${JSON.stringify(this.state, null, 2)}\n`, "utf8");
    }
  }
}

export function computeTreeFingerprint(root) {
  const files = listFiles(root);
  let catalog = "";
  for (const rel of files) catalog += `${rel}:${sha256(readFileSync(resolve(root, rel)))}\n`;
  return { fileCount: files.length, sha256: sha256(catalog) };
}

export function inspectInstallation(root, catalog, requestedTool = null) {
  const state = readState(root, catalog.skill.version);
  const results = [];
  const tools = requestedTool ? [requestedTool] : state.tools;
  if (!existsSync(safePath(root, STATE_PATH))) results.push({ status: "warning", code: "missing-state", path: STATE_PATH, message: "No v2 install state found." });
  for (const [rel, entry] of Object.entries(state.files)) {
    const target = safePath(root, rel);
    if (!existsSync(target)) {
      results.push({ status: "warning", code: "missing", path: rel, message: "Recorded artifact is missing." });
      continue;
    }
    if (entry.kind === "standalone" && sha256(readFileSync(target)) !== entry.sha256) results.push({ status: "collision", code: "drift", path: rel, message: "Package-owned file was edited." });
    if (entry.kind === "managed-block") {
      const current = readFileSync(target, "utf8");
      const start = current.indexOf(START);
      const endStart = current.indexOf(END);
      const block = start >= 0 && endStart >= start ? current.slice(start, endStart + END.length) : "";
      if (!block || sha256(block) !== entry.blockSha256) results.push({ status: "collision", code: "managed-drift", path: rel, message: "Managed guidance block is missing or edited." });
    }
  }
  for (const legacy of catalog.legacyArtifacts) {
    if (existsSync(safePath(root, legacy.path)) && !state.files[legacy.path]) results.push({ status: "warning", code: "legacy", path: legacy.path, message: `Obsolete or unowned installation detected; migrate to ${legacy.replacement}.` });
  }
  for (const tool of tools) {
    const host = hostById(catalog, tool);
    if (!host) continue;
    if (host.skillRoot && !existsSync(safePath(root, `${host.skillRoot}/SKILL.md`))) results.push({ status: "warning", code: "discovery", path: host.skillRoot, message: `${host.label} skill discovery path is missing.` });
    if (host.tier === "portable-fallback") results.push({ status: "unsupported-capability", code: "portable", path: tool, message: `${host.label} has portable instructions but no package-defined native role agents or enforceable lifecycle modes.` });
    for (const artifact of renderHostArtifacts(catalog, host)) {
      if ((artifact.path.includes("/commands/") || artifact.path.includes("/prompts/") || artifact.path.includes("/workflows/")) && existsSync(safePath(root, artifact.path)) && !state.files[artifact.path]) {
        results.push({ status: "warning", code: "command-conflict", path: artifact.path, message: "An unowned workflow entry occupies a generated command/prompt path." });
      }
    }
    if (tool === "aider" && existsSync(safePath(root, "CONVENTIONS.md"))) {
      const config = existsSync(safePath(root, ".aider.conf.yml")) ? readFileSync(safePath(root, ".aider.conf.yml"), "utf8") : "";
      if (!config.includes("CONVENTIONS.md")) results.push({ status: "warning", code: "aider-config", path: ".aider.conf.yml", message: "Aider is not configured to load CONVENTIONS.md." });
    }
  }
  if (!results.some((item) => item.status === "collision" || item.status === "warning")) results.unshift({ status: "success", code: "healthy", path: ".", message: "Installed artifacts are current and discoverable." });
  return { version: catalog.skill.version, tools, summary: countStatuses(results), results };
}

export function countStatuses(results) {
  return results.reduce((counts, item) => ({ ...counts, [item.status]: (counts[item.status] || 0) + 1 }), {});
}
