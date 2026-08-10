import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { renderHostArtifacts } from "../lib/renderers.mjs";

const cli = resolve("bin/cli.js");
const manifest = JSON.parse(readFileSync(resolve("skill/manifest.json"), "utf8"));
const roots = [];

function repository() {
  const root = mkdtempSync(join(tmpdir(), "pep-v2-"));
  roots.push(root);
  return root;
}

function run(root, ...args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
}

function write(root, rel, content) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function files(root, prefix = "") {
  const directory = join(root, prefix);
  const output = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) output.push(...files(root, rel));
    else if (entry.isFile()) output.push(rel.replaceAll("\\", "/"));
  }
  return output.sort();
}

const skillPayload = files(resolve("skill")).filter((path) => path !== "AGENTS.md" && !path.startsWith("adapters/"));

test.after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

test("canonical manifest owns exactly 13 workflows", () => {
  assert.deepEqual(manifest.workflows.map((item) => item.id), ["audit", "backend", "database", "debug", "design-system", "frontend", "implement", "performance", "refactor", "review", "security", "seo", "test"]);
});

for (const host of manifest.hosts) {
  test(`clean ${host.id} install has the exact native artifact set`, () => {
    const root = repository();
    const result = run(root, "init", "--tool", host.id);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(existsSync(join(root, ".product-engineer-pro/install-state.json")));
    if (host.skillRoot) {
      assert.ok(existsSync(join(root, host.skillRoot, "SKILL.md")));
      assert.ok(existsSync(join(root, host.skillRoot, "manifest.json")));
      assert.equal(existsSync(join(root, host.skillRoot, "adapters")), false);
    }
    for (const artifact of renderHostArtifacts(manifest, host)) assert.ok(existsSync(join(root, artifact.path)), artifact.path);
    if (host.commands) for (const workflow of manifest.workflows) assert.ok(renderHostArtifacts(manifest, host).some((artifact) => artifact.path.includes(workflow.id)), `${host.id}:${workflow.id}`);
    const expected = [".product-engineer-pro/install-state.json", ...renderHostArtifacts(manifest, host).map((artifact) => artifact.path)];
    if (host.skillRoot) expected.push(...skillPayload.map((path) => `${host.skillRoot}/${path}`));
    if (host.id === "aider") expected.push(".aider.conf.yml");
    if (host.id === "portable") expected.push("AGENTS.md");
    assert.deepEqual(files(root), [...new Set(expected)].sort());
  });
}

test("--all shares compatible .agents payload and installs required private roots", () => {
  const root = repository();
  const result = run(root, "init", "--all");
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(existsSync(join(root, ".agents/skills/product-engineer-pro/SKILL.md")));
  assert.ok(existsSync(join(root, ".claude/skills/product-engineer-pro/SKILL.md")));
  assert.ok(existsSync(join(root, ".windsurf/skills/product-engineer-pro/SKILL.md")));
  assert.ok(existsSync(join(root, ".cline/skills/product-engineer-pro/SKILL.md")));
  const state = JSON.parse(readFileSync(join(root, ".product-engineer-pro/install-state.json"), "utf8"));
  assert.equal(state.tools.length, manifest.hosts.length);
  assert.deepEqual(state.files[".agents/skills/product-engineer-pro/SKILL.md"].tools.sort(), ["codex", "copilot", "cursor", "gemini", "portable", "roo-code"].sort());
});

test("dry-run is immutable", () => {
  const root = repository();
  const result = run(root, "init", "--tool", "codex", "--dry-run");
  assert.equal(result.status, 0);
  assert.deepEqual(readdirSync(root), []);
});

test("edited owned files collide, and --force creates a recoverable backup", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "codex").status, 0);
  const agent = join(root, ".codex/agents/pep-build.toml");
  writeFileSync(agent, `${readFileSync(agent, "utf8")}# local edit\n`);
  const collision = run(root, "update");
  assert.equal(collision.status, 2);
  assert.match(readFileSync(agent, "utf8"), /local edit/);
  const forced = run(root, "update", "--force");
  assert.equal(forced.status, 0, forced.stderr || forced.stdout);
  assert.doesNotMatch(readFileSync(agent, "utf8"), /local edit/);
  const backups = join(root, ".product-engineer-pro/backups");
  assert.ok(existsSync(backups));
});

test("--force never replaces an unowned collision", () => {
  const root = repository();
  write(root, ".codex/agents/pep-build.toml", "user owned\n");
  const result = run(root, "init", "--tool", "codex", "--force");
  assert.equal(result.status, 2);
  assert.equal(readFileSync(join(root, ".codex/agents/pep-build.toml"), "utf8"), "user owned\n");
});

test("portable guidance preserves user content outside managed markers", () => {
  const root = repository();
  write(root, "AGENTS.md", "# Team rules\n\nKeep this.\n");
  assert.equal(run(root, "init", "--tool", "portable").status, 0);
  const installed = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.match(installed, /Keep this/);
  assert.match(installed, /product-engineer-pro managed/);
  assert.equal(run(root, "update").status, 0);
  assert.match(readFileSync(join(root, "AGENTS.md"), "utf8"), /Keep this/);
});

test("edited managed blocks collide and force restores only the owned block", () => {
  const root = repository();
  write(root, "AGENTS.md", "# Team rules\n\nKeep this.\n");
  assert.equal(run(root, "init", "--tool", "portable").status, 0);
  const path = join(root, "AGENTS.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("Host permissions", "Edited permissions"));
  assert.equal(run(root, "update").status, 2);
  assert.match(readFileSync(path, "utf8"), /Edited permissions/);
  assert.equal(run(root, "update", "--force").status, 0);
  const restored = readFileSync(path, "utf8");
  assert.match(restored, /Keep this/);
  assert.match(restored, /Host permissions/);
});

test("Aider safely augments an existing read list", () => {
  const root = repository();
  write(root, ".aider.conf.yml", "model: sonnet\nread:\n  - docs/architecture.md\nmap-tokens: 2048\n");
  const result = run(root, "init", "--tool", "aider");
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const config = readFileSync(join(root, ".aider.conf.yml"), "utf8");
  assert.match(config, /docs\/architecture\.md/);
  assert.match(config, /CONVENTIONS\.md/);
  assert.match(config, /map-tokens: 2048/);
});

test("aliases and deprecated --adapter remain accepted", () => {
  const root = repository();
  const result = run(root, "init", "--adapter", "vscode");
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stderr, /DEPRECATED/);
  assert.ok(existsSync(join(root, ".github/agents/pep-plan.agent.md")));
});

test("migrate removes only a hash-known legacy file and preserves customization", () => {
  const cleanRoot = repository();
  const fixture = readFileSync(resolve("tests/fixtures/legacy-codex-instructions.md"), "utf8");
  write(cleanRoot, ".codex/instructions.md", fixture);
  const migrated = run(cleanRoot, "migrate");
  assert.equal(migrated.status, 0, migrated.stderr || migrated.stdout);
  assert.equal(existsSync(join(cleanRoot, ".codex/instructions.md")), false);
  assert.ok(existsSync(join(cleanRoot, ".codex/agents/pep-plan.toml")));

  const customRoot = repository();
  write(customRoot, ".codex/instructions.md", `${fixture}\nCustomized.\n`);
  assert.equal(run(customRoot, "migrate").status, 0);
  assert.ok(existsSync(join(customRoot, ".codex/instructions.md")));
});

test("doctor JSON distinguishes success, collision, and portable capability", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "portable").status, 0);
  const healthy = run(root, "doctor", "--json");
  assert.equal(healthy.status, 0);
  const report = JSON.parse(healthy.stdout);
  assert.ok(report.results.some((item) => item.status === "unsupported-capability"));
  writeFileSync(join(root, ".agents/skills/product-engineer-pro/SKILL.md"), "edited\n");
  const drift = run(root, "doctor", "--json");
  assert.equal(drift.status, 2);
  assert.ok(JSON.parse(drift.stdout).results.some((item) => item.status === "collision"));
});

test("generated lifecycle roles encode read-only planner/reviewer enforcement", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "codex").status, 0);
  assert.match(readFileSync(join(root, ".codex/agents/pep-plan.toml"), "utf8"), /sandbox_mode = "read-only"/);
  assert.match(readFileSync(join(root, ".codex/agents/pep-review.toml"), "utf8"), /sandbox_mode = "read-only"/);
  assert.match(readFileSync(join(root, ".codex/agents/pep-build.toml"), "utf8"), /sandbox_mode = "workspace-write"/);

  const roo = repository();
  assert.equal(run(roo, "init", "--tool", "roo-code").status, 0);
  const modes = readFileSync(join(roo, ".roomodes"), "utf8");
  assert.match(modes, /slug: pep-plan[\s\S]*groups: \[read, browser, command\]/);
  assert.match(modes, /slug: pep-build[\s\S]*groups: \[read, edit, browser, command\]/);
  assert.match(modes, /slug: pep-review[\s\S]*groups: \[read, browser, command\]/);
});

test("update removes unchanged stale package-owned artifacts", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "codex").status, 0);
  const rel = ".codex/agents/pep-obsolete.toml";
  write(root, rel, "obsolete\n");
  const statePath = join(root, ".product-engineer-pro/install-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  state.files[rel] = { kind: "standalone", sha256: "abdcccf4a6a5fae3da2c8232d6fbf33b61d5db886742c35218e724b8e5c6b0e0", tools: ["codex"], version: manifest.skill.version };
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  assert.equal(run(root, "update").status, 0);
  assert.equal(existsSync(join(root, rel)), false);
});

test("list-tools JSON exposes canonical all ID and compatibility aliases", () => {
  const result = run(repository(), "list-tools", "--json");
  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.ok(payload.tools.some((tool) => tool.id === "all"));
  assert.equal(payload.aliases["claude-code"], "claude");
  assert.equal(payload.aliases.vscode, "copilot");
});

test("website-generated commands are accepted by the CLI", () => {
  const website = JSON.parse(readFileSync(resolve("website/generated/catalog.json"), "utf8"));
  for (const host of website.hosts) {
    const root = repository();
    const args = host.installCommand.split(" ").slice(-3);
    const result = run(root, ...args);
    assert.equal(result.status, 0, `${host.id}: ${result.stderr || result.stdout}`);
  }
});
