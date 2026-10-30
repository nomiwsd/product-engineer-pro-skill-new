// Runs evaluation cases and benchmark tasks under baseline, v2.0.1 and improved conditions,
// grades each run, and writes a JSON result file. See benchmarks/README.md.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { grade } from "./grade.mjs";

const BENCH = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(BENCH, "..");
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};

const ALLOWED_TOOLS = ["Bash(npm test:*)", "Bash(npm run test:*)", "Bash(node --test:*)", "Bash(node:*)", "Bash(git diff:*)", "Bash(git status:*)", "Bash(git log:*)", "Bash(ls:*)"];
const RUN_TIMEOUT_MS = 8 * 60_000;

function loadItems() {
  const items = [];
  for (const kind of ["cases", "tasks"]) {
    for (const id of readdirSync(join(BENCH, kind)).sort()) {
      const file = join(BENCH, kind, id, "case.json");
      if (!existsSync(file)) continue;
      const definition = JSON.parse(readFileSync(file, "utf8"));
      const variants = definition.variants ?? [{ fixture: definition.fixture, checks: definition.checks }];
      for (const variant of variants) {
        items.push({ ...definition, ...variant, variants: undefined, id: definition.variants ? `${id}@${variant.fixture}` : id, dir: join(BENCH, kind, id), kind });
      }
    }
  }
  return items;
}

const git = (cwd, ...gitArgs) => spawnSync("git", ["-c", "user.name=bench", "-c", "user.email=bench@example.invalid", "-c", "core.autocrlf=false", ...gitArgs], { cwd, encoding: "utf8" });

function prepareSkills(work, conditions) {
  const sources = { improved: REPO };
  if (conditions.includes("v2.0.1")) {
    const target = join(work, "_skill-v2.0.1");
    if (!existsSync(join(target, "bin", "cli.js"))) {
      mkdirSync(target, { recursive: true });
      const archive = join(work, "v2.0.1.tar");
      const packed = spawnSync("git", ["archive", "--format=tar", "-o", archive, "v2.0.1"], { cwd: REPO, encoding: "utf8" });
      if (packed.status !== 0) throw new Error(`git archive v2.0.1 failed: ${packed.stderr}`);
      const unpacked = spawnSync("tar", ["-xf", archive, "-C", target], { encoding: "utf8" });
      if (unpacked.status !== 0) throw new Error(`tar failed: ${unpacked.stderr}`);
    }
    sources["v2.0.1"] = target;
  }
  return sources;
}

function prepareWorkdir(item, condition, workdir, skills) {
  rmSync(workdir, { recursive: true, force: true });
  mkdirSync(dirname(workdir), { recursive: true });
  cpSync(join(BENCH, "fixtures", item.fixture), workdir, { recursive: true });
  if (item.extraFiles) cpSync(join(item.dir, item.extraFiles), workdir, { recursive: true });
  git(workdir, "init", "-q");
  git(workdir, "add", "-A");
  git(workdir, "commit", "-q", "-m", "fixture");
  if (condition !== "baseline") {
    const installed = spawnSync(process.execPath, [join(skills[condition], "bin", "cli.js"), "init", "--tool", "claude"], { cwd: workdir, encoding: "utf8" });
    if (installed.status !== 0) throw new Error(`skill install failed (${condition}): ${installed.stdout}${installed.stderr}`);
    git(workdir, "add", "-A");
    git(workdir, "commit", "-q", "-m", "skill");
  }
}

function runAgent(item, condition, workdir, model, transcriptPath) {
  const prompt = condition === "baseline" || !item.workflow ? item.prompt : `/pep:${item.workflow} ${item.prompt}`;
  const agentArgs = [
    "-p", prompt,
    "--model", model,
    "--permission-mode", item.permissionMode,
    "--setting-sources", "project,local",
    "--strict-mcp-config",
    "--no-session-persistence",
    "--max-turns", String(item.maxTurns ?? 25),
    "--output-format", "stream-json", "--verbose",
    "--disallowedTools", "mcp__*", ...(item.disallowedTools ?? []),
    "--allowedTools", ...ALLOWED_TOOLS
  ];
  return new Promise((done) => {
    const started = Date.now();
    const child = spawn("claude", agentArgs, { cwd: workdir, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => { out += chunk; });
    child.stderr.on("data", (chunk) => { err += chunk; });
    const timer = setTimeout(() => child.kill(), RUN_TIMEOUT_MS);
    child.on("close", (code) => {
      clearTimeout(timer);
      mkdirSync(dirname(transcriptPath), { recursive: true });
      writeFileSync(transcriptPath, out);
      done({ exitCode: code, stderr: err.slice(-2000), durationMs: Date.now() - started, transcript: out, prompt });
    });
  });
}

async function pool(tasks, limit) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const index = next++;
      results[index] = await tasks[index]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

async function main() {
  const items = loadItems();
  if (args.includes("--list")) {
    for (const item of items) console.log(`${item.kind.padEnd(6)} ${item.id.padEnd(48)} ${String(item.workflow ?? "-").padEnd(14)} ${item.fixture}`);
    console.log(`${items.length} runnable items`);
    return;
  }
  const only = option("--only", "").split(",").filter(Boolean);
  const selected = only.length ? items.filter((item) => only.some((id) => item.id === id || item.id.startsWith(`${id}@`))) : items;
  const conditions = option("--conditions", "baseline,v2.0.1,improved").split(",");
  const repeats = Number(option("--repeat", "1"));
  const model = option("--model", "haiku");
  const concurrency = Number(option("--concurrency", "3"));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outFile = resolve(option("--out", join(BENCH, "results", `${stamp}-run.json`)));
  const work = join(BENCH, "results", "work");
  const skills = prepareSkills(work, conditions);

  const head = spawnSync("git", ["rev-parse", "--short", "HEAD"], { cwd: REPO, encoding: "utf8" }).stdout.trim();
  const dirty = spawnSync("git", ["status", "--porcelain", "--", "skill", "lib", "bin"], { cwd: REPO, encoding: "utf8" }).stdout.trim() !== "";
  const meta = {
    startedAt: new Date().toISOString(), model, conditions, repeats, concurrency,
    improvedCommit: `${head}${dirty ? " (+ uncommitted skill changes)" : ""}`,
    claudeVersion: spawnSync("claude", ["--version"], { encoding: "utf8" }).stdout.trim(),
    node: process.version, platform: `${process.platform} ${process.arch}`,
    isolation: "--setting-sources project,local --strict-mcp-config --disallowedTools mcp__* --no-session-persistence; user-level instruction files still load"
  };
  const results = [];
  const save = () => {
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, `${JSON.stringify({ meta: { ...meta, finishedAt: new Date().toISOString() }, results }, null, 2)}\n`);
  };

  const jobs = [];
  for (const item of selected) for (const condition of conditions) for (let repeat = 1; repeat <= repeats; repeat += 1) {
    jobs.push(async () => {
      const label = `${item.id} [${condition}${repeats > 1 ? ` #${repeat}` : ""}]`;
      const workdir = join(work, stamp, item.id.replace("@", "__"), `${condition}-${repeat}`);
      const transcriptPath = join(BENCH, "results", "raw", stamp, `${item.id.replace("@", "__")}--${condition}-${repeat}.jsonl`);
      let record;
      try {
        prepareWorkdir(item, condition, workdir, skills);
        const run = await runAgent(item, condition, workdir, model, transcriptPath);
        record = { id: item.id, kind: item.kind, group: item.group, workflow: item.workflow, fixture: item.fixture, condition, repeat, prompt: run.prompt, exitCode: run.exitCode, durationMs: run.durationMs, ...grade(item, workdir, run.transcript, BENCH), transcript: transcriptPath.replace(`${REPO}\\`, "").replace(`${REPO}/`, "") };
        if (run.exitCode !== 0 && run.stderr) record.stderr = run.stderr;
      } catch (error) {
        record = { id: item.id, kind: item.kind, group: item.group, workflow: item.workflow, condition, repeat, status: "error", error: error.message };
      }
      results.push(record);
      save();
      console.log(`${String(results.length).padStart(3)}/${jobs.length} ${record.status.padEnd(7)} ${label}${record.falseClaim ? "  FALSE-CLAIM" : ""}${record.error ? `  ${record.error}` : ""}`);
      return record;
    });
  }
  console.log(`Running ${jobs.length} runs (${selected.length} items × ${conditions.length} conditions × ${repeats}) with concurrency ${concurrency} on ${model}…`);
  await pool(jobs, concurrency);
  save();
  console.log(`Results: ${outFile}`);
}

await main();
