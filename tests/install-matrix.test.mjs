import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const cli = resolve("bin/cli.js");
const roots = [];

function repository(name = "pep-matrix-") {
  const root = mkdtempSync(join(tmpdir(), name));
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
  const output = [];
  for (const entry of readdirSync(join(root, prefix), { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) output.push(...files(root, rel));
    else if (entry.isFile()) output.push(rel);
  }
  return output.sort();
}

function toCrlf(root, rel) {
  const path = join(root, rel);
  writeFileSync(path, readFileSync(path, "utf8").replace(/\r?\n/g, "\r\n"));
}

test.after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

test("CRLF checkouts of installed files are not reported as edits", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "codex").status, 0);
  const installed = files(root).filter((rel) => !rel.startsWith(".product-engineer-pro/"));
  for (const rel of installed) toCrlf(root, rel);
  const update = run(root, "update");
  assert.equal(update.status, 0, update.stdout);
  assert.doesNotMatch(update.stdout, /COLLISION/);
  for (const rel of installed) assert.match(readFileSync(join(root, rel), "utf8"), /\r\n/, `${rel} was rewritten`);
  const doctor = run(root, "doctor", "--json");
  assert.equal(doctor.status, 0);
  assert.equal(JSON.parse(doctor.stdout).summary.collision, undefined);
});

test("CRLF managed guidance blocks still belong to the package", () => {
  const root = repository();
  write(root, "AGENTS.md", "# Team rules\n\nKeep this.\n");
  assert.equal(run(root, "init", "--tool", "portable").status, 0);
  toCrlf(root, "AGENTS.md");
  const update = run(root, "update");
  assert.equal(update.status, 0, update.stdout);
  assert.match(readFileSync(join(root, "AGENTS.md"), "utf8"), /Keep this/);
});

test("migrate recognises a CRLF copy of a known legacy file", () => {
  const root = repository();
  const fixture = readFileSync(resolve("tests/fixtures/legacy-codex-instructions.md"), "utf8").replace(/\r?\n/g, "\r\n");
  write(root, ".codex/instructions.md", fixture);
  const migrated = run(root, "migrate");
  assert.equal(migrated.status, 0, migrated.stdout);
  assert.equal(existsSync(join(root, ".codex/instructions.md")), false);
  assert.ok(files(root).some((rel) => rel.startsWith(".product-engineer-pro/backups/migration-")));
});

test("repeat Aider installs keep a new read list valid", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "aider").status, 0);
  const first = readFileSync(join(root, ".aider.conf.yml"), "utf8");
  assert.match(first, /^read:\n {2}- CONVENTIONS\.md$/m);
  for (const args of [["init", "--tool", "aider"], ["update"], ["init", "--tool", "aider"]]) {
    assert.equal(run(root, ...args).status, 0);
    assert.equal(readFileSync(join(root, ".aider.conf.yml"), "utf8"), first, `after ${args.join(" ")}`);
  }
});

test("repeat Aider installs keep an existing read list valid", () => {
  const root = repository();
  write(root, ".aider.conf.yml", "model: sonnet\nread:\n  - docs/architecture.md\nmap-tokens: 2048\n");
  assert.equal(run(root, "init", "--tool", "aider").status, 0);
  const first = readFileSync(join(root, ".aider.conf.yml"), "utf8");
  assert.match(first, /^ {2}- CONVENTIONS\.md$/m);
  assert.match(first, /docs\/architecture\.md[\s\S]*CONVENTIONS\.md[\s\S]*map-tokens: 2048/);
  for (const args of [["update"], ["init", "--tool", "aider"], ["update"]]) {
    assert.equal(run(root, ...args).status, 0);
    assert.equal(readFileSync(join(root, ".aider.conf.yml"), "utf8"), first, `after ${args.join(" ")}`);
  }
});

const STATE = ".product-engineer-pro/install-state.json";

function corruptState(root) {
  assert.equal(run(root, "init", "--tool", "claude").status, 0);
  write(root, STATE, "{not json");
}

test("doctor reports an unreadable install state instead of healthy", () => {
  const root = repository();
  corruptState(root);
  const report = JSON.parse(run(root, "doctor", "--json").stdout);
  assert.ok(report.results.some((item) => item.code === "corrupt-state"));
  assert.ok(!report.results.some((item) => item.code === "healthy"));
});

test("update refuses an unreadable install state without changing files", () => {
  const root = repository();
  corruptState(root);
  const before = files(root).map((rel) => [rel, readFileSync(join(root, rel), "utf8")]);
  const result = run(root, "update");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unreadable/);
  assert.deepEqual(files(root).map((rel) => [rel, readFileSync(join(root, rel), "utf8")]), before);
});

test("init backs up an unreadable install state and rebuilds ownership", () => {
  const root = repository();
  corruptState(root);
  const result = run(root, "init", "--tool", "claude");
  assert.equal(result.status, 0, result.stdout);
  assert.match(result.stdout, /WARNING.*unreadable/);
  const backup = files(root).find((rel) => rel.startsWith(".product-engineer-pro/backups/") && rel.endsWith("install-state.json"));
  assert.ok(backup, "corrupt state was not backed up");
  assert.equal(readFileSync(join(root, backup), "utf8"), "{not json");
  const state = JSON.parse(readFileSync(join(root, STATE), "utf8"));
  assert.deepEqual(state.tools, ["claude"]);
  assert.ok(Object.keys(state.files).length > 0);
});

test("a state written by a newer schema is never overwritten", () => {
  const root = repository();
  const newer = JSON.stringify({ schemaVersion: 3, tools: ["claude"], files: {} });
  write(root, STATE, newer);
  for (const args of [["init", "--tool", "claude"], ["update"], ["migrate"]]) {
    const result = run(root, ...args);
    assert.equal(result.status, 1, `${args.join(" ")}: ${result.stdout}`);
    assert.match(result.stderr, /newer Product Engineer Pro/);
  }
  assert.equal(readFileSync(join(root, STATE), "utf8"), newer);
  assert.deepEqual(files(root), [STATE]);
});

test("doctor reports a deleted package file and update restores it", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "claude").status, 0);
  const rel = ".claude/skills/product-engineer-pro/SKILL.md";
  rmSync(join(root, rel));
  const report = JSON.parse(run(root, "doctor", "--json").stdout);
  assert.ok(report.results.some((item) => item.code === "missing" && item.path === rel));
  assert.equal(run(root, "update").status, 0);
  assert.ok(existsSync(join(root, rel)));
});

test("an unknown tool lists supported tools and writes nothing", () => {
  const manifest = JSON.parse(readFileSync(resolve("skill/manifest.json"), "utf8"));
  for (const args of [["init", "--tool", "notarealtool"], ["init", "--tool", "notarealtool", "--dry-run"], ["doctor", "--tool", "notarealtool"]]) {
    const root = repository();
    const result = run(root, ...args);
    assert.equal(result.status, 1, args.join(" "));
    for (const host of manifest.hosts) assert.match(result.stderr, new RegExp(`\\b${host.id}\\b`));
    assert.deepEqual(readdirSync(root), []);
  }
});

test("an unknown command says so and exits non-zero", () => {
  const result = run(repository(), "frobnicate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command: frobnicate/);
  assert.match(result.stdout, /Commands:/);
  assert.equal(run(repository(), "--help").status, 0);
});

function snapshotTree(root) {
  return Object.fromEntries(files(root)
    .filter((rel) => rel !== STATE)
    .map((rel) => [rel, readFileSync(join(root, rel), "utf8")]));
}

test("repeat installs and updates are idempotent for every host", () => {
  const manifest = JSON.parse(readFileSync(resolve("skill/manifest.json"), "utf8"));
  for (const host of manifest.hosts) {
    const root = repository();
    assert.equal(run(root, "init", "--tool", host.id).status, 0, host.id);
    const first = snapshotTree(root);
    const stateFiles = JSON.parse(readFileSync(join(root, STATE), "utf8")).files;
    for (const args of [["init", "--tool", host.id], ["update"]]) {
      const result = run(root, ...args);
      assert.equal(result.status, 0, `${host.id} ${args.join(" ")}: ${result.stdout}`);
      assert.doesNotMatch(result.stdout, /COLLISION/, host.id);
      assert.deepEqual(snapshotTree(root), first, `${host.id} changed after ${args.join(" ")}`);
      assert.deepEqual(JSON.parse(readFileSync(join(root, STATE), "utf8")).files, stateFiles, host.id);
    }
  }
});

test("update and migrate dry runs change nothing", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "codex").status, 0);
  write(root, ".codex/instructions.md", readFileSync(resolve("tests/fixtures/legacy-codex-instructions.md"), "utf8"));
  const before = files(root).map((rel) => [rel, readFileSync(join(root, rel), "utf8")]);
  for (const args of [["update", "--dry-run"], ["update", "--dry-run", "--force"], ["migrate", "--dry-run"]]) {
    assert.equal(run(root, ...args).status, 0, args.join(" "));
    assert.deepEqual(files(root).map((rel) => [rel, readFileSync(join(root, rel), "utf8")]), before, args.join(" "));
  }
});

test("doctor and list-tools JSON keep a stable shape", () => {
  const root = repository();
  assert.equal(run(root, "init", "--tool", "claude").status, 0);
  const doctor = JSON.parse(run(root, "doctor", "--json").stdout);
  assert.deepEqual(Object.keys(doctor).sort(), ["results", "summary", "tools", "version"]);
  assert.equal(typeof doctor.version, "string");
  assert.ok(Array.isArray(doctor.tools));
  for (const item of doctor.results) assert.deepEqual(Object.keys(item).sort(), ["code", "message", "path", "status"]);
  for (const [status, count] of Object.entries(doctor.summary)) assert.ok(typeof status === "string" && Number.isInteger(count));

  const list = JSON.parse(run(root, "list-tools", "--json").stdout);
  assert.deepEqual(Object.keys(list).sort(), ["aliases", "tools", "version"]);
  for (const tool of list.tools) assert.deepEqual(Object.keys(tool).sort(), ["agents", "commands", "id", "label", "skillRoot", "tier"]);
});

test("project paths with spaces and non-ASCII characters work", () => {
  const root = repository("pep matrix ünïcødé ");
  for (const tool of ["claude", "portable", "aider"]) assert.equal(run(root, "init", "--tool", tool).status, 0, tool);
  const doctor = run(root, "doctor", "--json");
  assert.equal(doctor.status, 0);
  assert.equal(JSON.parse(doctor.stdout).summary.collision, undefined);
  assert.equal(run(root, "update").status, 0);
});

test("an inline Aider read value is preserved and reported", () => {
  const root = repository();
  const original = "model: sonnet\nread: [docs/architecture.md]\n";
  write(root, ".aider.conf.yml", original);
  const result = run(root, "init", "--tool", "aider");
  assert.equal(result.status, 2, result.stdout);
  assert.match(result.stdout, /inline value/);
  assert.equal(readFileSync(join(root, ".aider.conf.yml"), "utf8"), original);
});
