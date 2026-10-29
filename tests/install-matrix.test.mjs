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
