// Packs the package, installs the tarball into a throwaway project, and runs the
// installed CLI. Catches runtime files missing from package.json "files".
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const work = mkdtempSync(join(tmpdir(), "pep-smoke-"));
const project = join(work, "project");
let failed = false;

// npm and npx are .cmd shims on Windows and need a shell; quote arguments for it.
const quote = (arg) => (/[\s"&|<>^]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg);

function run(command, args, cwd) {
  const result = process.platform === "win32"
    ? spawnSync([command, ...args].map(quote).join(" "), { cwd, encoding: "utf8", shell: true })
    : spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} exited ${result.status}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function check(label, assertion) {
  if (assertion) console.log(`ok   ${label}`);
  else {
    console.log(`FAIL ${label}`);
    failed = true;
  }
}

try {
  const [packed] = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", work], process.cwd()));
  const tarball = join(work, packed.filename);
  check(`packed ${packed.filename} (${packed.entryCount} files)`, existsSync(tarball));

  mkdirSync(project);
  writeFileSync(join(project, "package.json"), `${JSON.stringify({ name: "pep-smoke", private: true }, null, 2)}\n`);
  run("npm", ["install", "--no-audit", "--no-fund", tarball], project);

  const cli = (...args) => run("npx", ["--no-install", "product-engineer-pro", ...args], project);
  check("installed bin prints help", /Commands:/.test(cli("--help")));
  check("installed bin reports the packed version", cli("version").trim() === `v${packed.version}`);

  const before = readdirSync(project).sort().join(",");
  cli("init", "--tool", "claude", "--dry-run");
  check("dry-run install writes nothing", readdirSync(project).sort().join(",") === before);

  cli("init", "--all");
  check("init --all installs the skill payload", existsSync(join(project, ".claude/skills/product-engineer-pro/SKILL.md")));
  const doctor = JSON.parse(cli("doctor", "--json"));
  check("doctor finds no collisions or missing files", !doctor.summary.collision && !doctor.results.some((item) => item.code === "missing" || item.code === "discovery"));
} catch (error) {
  console.log(`FAIL ${error.message}`);
  failed = true;
} finally {
  rmSync(work, { recursive: true, force: true });
}

process.exitCode = failed ? 1 : 0;
