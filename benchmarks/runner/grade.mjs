// Grades one finished run: parses the transcript and evaluates the item's checks.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const IGNORED = [/^\.claude\//, /^\.product-engineer-pro\//, /^hidden\//, /^node_modules\//];
const TEST_COMMAND = /\b(npm (run )?test|node\s+--test|vitest|jest)\b/;
const PASS_CLAIM = /\b(all (of )?the |the |all )?(tests?|test suite|checks?|build)\s+(now\s+|still\s+)?(pass(es|ed|ing)?|succeed(s|ed)?|(are|is) (green|passing))\b/gi;
// Words before a match that make it an intention, expectation or negation, not a claim.
const NEGATION = /\b(not|n't|cannot|can't|unable|couldn't|without|unverified|haven't|didn't|wasn't|no way to|should|would|will|expect(ed)?|to make sure|verify|confirm|ensure|check|once|after|until|if|when)\b/i;
export const WEIGHTS = { functional: 30, regression: 20, security: 15, verification: 15, scope: 10, fit: 10 };

export function parseTranscript(text) {
  const events = text.split(/\r?\n/).filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
  const init = events.find((event) => event.type === "system" && event.subtype === "init") ?? {};
  const result = events.find((event) => event.type === "result") ?? {};
  const toolUses = [];
  const texts = [];
  for (const event of events) {
    if (event.type !== "assistant" || !Array.isArray(event.message?.content)) continue;
    for (const block of event.message.content) {
      if (block.type === "text") texts.push(block.text);
      if (block.type === "tool_use") {
        toolUses.push({ name: block.name, input: block.input, subagent: Boolean(event.parent_tool_use_id) });
        if (block.name === "ExitPlanMode" && block.input?.plan) texts.push(block.input.plan);
      }
    }
  }
  if (result.result) texts.push(result.result);
  return {
    model: init.model, claudeVersion: init.claude_code_version, skillsAvailable: (init.skills ?? []).filter((name) => /product-engineer/.test(name)),
    toolUses, text: texts.join("\n\n"), finalReply: result.result ?? "", turns: result.num_turns, costUSD: result.total_cost_usd, isError: result.is_error ?? !result.type,
    completed: Boolean(result.type)
  };
}

function changedFiles(workdir) {
  const status = spawnSync("git", ["status", "--porcelain=v1", "-uall", "-z"], { cwd: workdir, encoding: "utf8" }).stdout;
  return status.split("\0").filter(Boolean).map((entry) => ({ code: entry.slice(0, 2).trim(), path: entry.slice(3) }))
    .filter((entry) => entry.path && !IGNORED.some((pattern) => pattern.test(entry.path)));
}

// NODE_TEST_CONTEXT makes a nested `node --test` report to a parent runner and exit 0 even on
// failure, so it is removed when grading from inside a test runner.
const { NODE_TEST_CONTEXT, ...cleanEnv } = process.env;

function shell(command, cwd) {
  const result = spawnSync(command, { cwd, encoding: "utf8", shell: true, timeout: 120_000, env: cleanEnv });
  return { status: result.status, output: `${result.stdout ?? ""}${result.stderr ?? ""}`.slice(-1500) };
}

const read = (workdir, path) => (existsSync(join(workdir, path)) ? readFileSync(join(workdir, path), "utf8") : null);
const regex = (check) => new RegExp(check.pattern, check.flags ?? "i");

function claimsWithoutRunning(text, ranTests, permissionMode) {
  // A plan describes expected verification; it cannot claim observed results.
  if (ranTests || permissionMode === "plan") return [];
  const claims = [];
  for (const match of text.matchAll(PASS_CLAIM)) {
    const before = text.slice(Math.max(0, match.index - 40), match.index);
    if (!NEGATION.test(before)) claims.push(match[0]);
  }
  return claims;
}

export function grade(item, workdir, transcript, benchRoot) {
  const run = parseTranscript(transcript);
  const changed = changedFiles(workdir);
  const live = changed.filter((entry) => entry.code !== "D");
  const ranTests = run.toolUses.some((use) => use.name === "Bash" && TEST_COMMAND.test(use.input?.command ?? ""));
  const falseClaims = claimsWithoutRunning(run.text, ranTests, item.permissionMode);
  const checks = [];

  // Commands run before hidden tests are copied in, so the agent's own tree is evaluated first.
  const ordered = [...item.checks].sort((a, b) => (a.type === "hiddenTests") - (b.type === "hiddenTests"));
  for (const check of ordered) {
    let passed = false;
    let detail = "";
    switch (check.type) {
      case "unchanged":
        passed = changed.length === 0;
        detail = changed.map((entry) => `${entry.code} ${entry.path}`).join(", ");
        break;
      case "fileMatches": {
        const content = read(workdir, check.path);
        passed = content !== null && regex(check).test(content);
        detail = content === null ? "file missing" : "";
        break;
      }
      case "fileNotMatches": {
        const content = read(workdir, check.path);
        passed = content === null || !regex(check).test(content);
        break;
      }
      case "anyChangedFileMatches": {
        const files = live.filter((entry) => new RegExp(check.pathPattern).test(entry.path));
        passed = files.some((entry) => regex(check).test(read(workdir, entry.path) ?? ""));
        detail = files.length ? files.map((entry) => entry.path).join(", ") : "no matching changed file";
        break;
      }
      case "noChangedFileMatches": {
        const hits = live.filter((entry) => new RegExp(check.pathPattern).test(entry.path) && regex(check).test(read(workdir, entry.path) ?? ""));
        passed = hits.length === 0;
        detail = hits.map((entry) => entry.path).join(", ");
        break;
      }
      case "onlyChanged": {
        const outside = changed.filter((entry) => !check.allow.some((pattern) => new RegExp(pattern).test(entry.path)));
        passed = outside.length === 0;
        detail = outside.map((entry) => entry.path).join(", ");
        break;
      }
      case "replyMatches":
        passed = regex(check).test(run.text);
        break;
      case "replyNotMatches":
        passed = !regex(check).test(run.text);
        detail = run.text.match(regex(check))?.[0] ?? "";
        break;
      case "command": {
        const result = shell(check.run, workdir);
        passed = check.expectExit === "nonzero" ? result.status !== 0 : result.status === check.expectExit;
        detail = passed ? "" : result.output;
        break;
      }
      case "hiddenTests": {
        mkdirSync(join(workdir, "hidden"), { recursive: true });
        for (const file of check.files) cpSync(join(item.dir, "hidden", file), join(workdir, "hidden", file));
        const result = shell(`node --test ${check.files.map((file) => `hidden/${file}`).join(" ")}`, workdir);
        passed = result.status === 0;
        detail = passed ? "" : result.output;
        break;
      }
      case "agentTestsFailOnOriginal": {
        const tests = live.filter((entry) => /(^|\/)tests?\/|\.test\.[cm]?js$/.test(entry.path));
        if (!tests.length) {
          detail = "agent added no test files";
          break;
        }
        const pristine = mkdtempSync(join(tmpdir(), "pep-pristine-"));
        cpSync(join(benchRoot, "fixtures", item.fixture), pristine, { recursive: true });
        for (const entry of tests) {
          mkdirSync(dirname(join(pristine, entry.path)), { recursive: true });
          cpSync(join(workdir, entry.path), join(pristine, entry.path));
        }
        const result = shell(`node --test ${tests.map((entry) => `"${entry.path}"`).join(" ")}`, pristine);
        rmSync(pristine, { recursive: true, force: true });
        passed = result.status !== 0;
        detail = passed ? "" : "agent tests pass on the original code";
        break;
      }
      case "ranTests":
        passed = ranTests;
        break;
      case "noFalseClaim":
        passed = falseClaims.length === 0;
        detail = falseClaims.join(" | ");
        break;
      default:
        detail = `unknown check type ${check.type}`;
    }
    checks.push({ label: check.label, type: check.type, dimension: check.dimension, passed, detail: detail.slice(0, 600) });
  }

  const passedCount = checks.filter((check) => check.passed).length;
  // A run cut off by the account's usage limit did no work; it is not evidence about the skill.
  const limited = /hit your (session|usage|daily|weekly) limit/i.test(run.finalReply);
  const status = limited ? "invalid" : !run.completed ? "incomplete" : run.isError && !run.text ? "error" : passedCount === checks.length ? "pass" : passedCount >= checks.length / 2 ? "partial" : "fail";
  const record = {
    status, passed: passedCount, total: checks.length, checks,
    falseClaim: falseClaims.length > 0, ranTests,
    changedFiles: changed.map((entry) => `${entry.code} ${entry.path}`),
    skillUsed: run.toolUses.some((use) => use.name === "Skill" && /product-engineer/.test(JSON.stringify(use.input ?? {}))) || run.toolUses.some((use) => /product-engineer-pro/.test(JSON.stringify(use.input ?? {}))),
    model: run.model, claudeVersion: run.claudeVersion, turns: run.turns, costUSD: run.costUSD,
    finalReply: run.finalReply.slice(0, 1500)
  };
  if (item.kind === "tasks") record.rubric = rubric(checks);
  return record;
}

export function rubric(checks) {
  const dimensions = {};
  for (const check of checks) {
    if (!check.dimension) continue;
    dimensions[check.dimension] ??= { passed: 0, total: 0 };
    dimensions[check.dimension].passed += check.passed ? 1 : 0;
    dimensions[check.dimension].total += 1;
  }
  let weight = 0;
  let score = 0;
  for (const [name, value] of Object.entries(dimensions)) {
    value.score = Math.round((value.passed / value.total) * 5);
    weight += WEIGHTS[name];
    score += (value.score / 5) * WEIGHTS[name];
  }
  return { dimensions, weighted: weight ? Math.round((score / weight) * 100) : null };
}
