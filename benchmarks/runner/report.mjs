// Turns a results JSON file from run.mjs into a Markdown report next to it.
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node benchmarks/runner/report.mjs <results.json>");
  process.exit(1);
}
const { meta, results: recorded } = JSON.parse(readFileSync(file, "utf8"));
// Runs stopped by the account usage limit did no work and are reported only as a count.
const results = recorded.filter((run) => run.status !== "invalid");
const invalidCount = recorded.length - results.length;
const conditions = meta.conditions;
const symbol = { pass: "✅ pass", partial: "🟡 partial", fail: "❌ fail", error: "⚠️ error" };
const pct = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : "–");
const runsFor = (condition, filter = () => true) => results.filter((run) => run.condition === condition && filter(run));
const rank = { pass: 3, partial: 2, fail: 1, error: 0 };

const lines = [];
const out = (...text) => lines.push(...text);

out(`# Benchmark Results — ${meta.startedAt.slice(0, 10)}`, "");
out("| Item | Value |", "| --- | --- |");
out(`| Model | \`${meta.model}\` → ${[...new Set(results.map((run) => run.model).filter(Boolean))].join(", ") || "unknown"} |`);
out(`| Claude Code | ${meta.claudeVersion} |`, `| Improved commit | \`${meta.improvedCommit}\` |`, `| Conditions | ${conditions.join(", ")} |`);
out(`| Runs per item per condition | ${meta.repeats} (${meta.repeats >= 3 ? "comparative" : "exploratory: direction-finding only, not for claims"}) |`);
out(`| Isolation | ${meta.isolation} |`, `| Platform | ${meta.platform}, Node ${meta.node} |`);
if (invalidCount) out(`| Excluded runs | ${invalidCount} of ${recorded.length} stopped by the account usage limit (no work done) |`);
out("");

const repeats = [...new Set(results.map((run) => run.repeat))].sort();
const passRate = (runs) => (runs.length ? runs.filter((run) => run.status === "pass").length / runs.length : 0);
out("## Summary by condition", "", `| Condition | Cases passed | Spread across repeats | Cases partial | Task rubric (mean) | False claims | Ran tests | Cost (USD) |`, "| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const condition of conditions) {
  const cases = runsFor(condition, (run) => run.kind === "cases");
  const tasks = runsFor(condition, (run) => run.kind === "tasks" && run.rubric?.weighted != null);
  const all = runsFor(condition);
  const mean = tasks.length ? Math.round(tasks.reduce((sum, run) => sum + run.rubric.weighted, 0) / tasks.length) : "–";
  const perRepeat = repeats.map((repeat) => passRate(cases.filter((run) => run.repeat === repeat)));
  const spread = repeats.length > 1 ? `${Math.round(Math.min(...perRepeat) * 100)}–${Math.round(Math.max(...perRepeat) * 100)}%` : "–";
  out(`| ${condition} | ${cases.filter((run) => run.status === "pass").length}/${cases.length} (${pct(cases.filter((run) => run.status === "pass").length, cases.length)}) | ${spread} | ${cases.filter((run) => run.status === "partial").length} | ${mean} | ${all.filter((run) => run.falseClaim).length} | ${all.filter((run) => run.ranTests).length}/${all.length} | ${all.reduce((sum, run) => sum + (run.costUSD ?? 0), 0).toFixed(2)} |`);
}
out("");

out("## Summary by group", "", `| Group | ${conditions.join(" | ")} |`, `| --- | ${conditions.map(() => "---").join(" | ")} |`);
for (const group of [...new Set(results.map((run) => run.group))]) {
  out(`| ${group} | ${conditions.map((condition) => {
    const runs = runsFor(condition, (run) => run.group === group);
    return `${runs.filter((run) => run.status === "pass").length}/${runs.length}`;
  }).join(" | ")} |`);
}
out("");

const ids = [...new Set(results.map((run) => run.id))];
out("## Cases and tasks", "", `| Item | ${conditions.join(" | ")} |`, `| --- | ${conditions.map(() => "---").join(" | ")} |`);
for (const id of ids) {
  out(`| \`${id}\` | ${conditions.map((condition) => {
    const runs = results.filter((run) => run.id === id && run.condition === condition);
    return runs.map((run) => `${symbol[run.status] ?? run.status} ${run.passed ?? 0}/${run.total ?? 0}${run.rubric?.weighted != null ? ` · ${run.rubric.weighted}` : ""}${run.falseClaim ? " · false claim" : ""}`).join("<br>") || "–";
  }).join(" | ")} |`);
}
out("");

const taskRuns = results.filter((run) => run.kind === "tasks" && run.rubric);
if (taskRuns.length) {
  out("## Task rubric by dimension (0–5)", "", "| Task | Condition | Functional | Regression | Security | Verification | Scope | Fit | Weighted |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const run of taskRuns) {
    const score = (name) => run.rubric.dimensions[name]?.score ?? "–";
    out(`| \`${run.id}\` | ${run.condition} | ${score("functional")} | ${score("regression")} | ${score("security")} | ${score("verification")} | ${score("scope")} | ${score("fit")} | ${run.rubric.weighted} |`);
  }
  out("");
}

// Compare conditions per item on the mean outcome across repeats (pass = 3 … error = 0).
const meanRank = (id, condition) => {
  const runs = results.filter((run) => run.id === id && run.condition === condition);
  return runs.length ? runs.reduce((sum, run) => sum + (rank[run.status] ?? 0), 0) / runs.length : null;
};
const passes = (id, condition) => {
  const runs = results.filter((run) => run.id === id && run.condition === condition);
  return `${runs.filter((run) => run.status === "pass").length}/${runs.length}`;
};
const worse = [];
const better = [];
for (const id of ids) {
  const baseline = meanRank(id, "baseline");
  if (baseline == null) continue;
  for (const condition of conditions.filter((name) => name !== "baseline")) {
    const value = meanRank(id, condition);
    if (value == null) continue;
    const line = `- \`${id}\`: ${condition} passed ${passes(id, condition)} vs baseline ${passes(id, "baseline")}`;
    if (value < baseline) worse.push(line);
    if (value > baseline && condition === conditions.at(-1)) better.push(line);
  }
}
out(`## Where ${conditions.at(-1)} did better than baseline`, "", ...(better.length ? better : ["- None in this run."]), "");
out("## Where a skill condition did worse than baseline", "", ...(worse.length ? worse : ["- None in this run."]), "");

const failures = results.filter((run) => run.checks?.some((check) => !check.passed));
out("## Failed checks", "");
for (const run of failures) {
  out(`- \`${run.id}\` [${run.condition}]: ${run.checks.filter((check) => !check.passed).map((check) => `${check.label}${check.detail ? ` (${check.detail.replace(/\s+/g, " ").slice(0, 140)})` : ""}`).join("; ")}`);
}
const claims = results.filter((run) => run.falseClaim);
out("", "## False claims", "", ...(claims.length ? claims.map((run) => `- \`${run.id}\` [${run.condition}]: ${run.checks.find((check) => check.type === "noFalseClaim")?.detail || "claimed passing checks without running tests"}`) : ["- None detected."]), "");
out("Automated checks are a floor; review failures and surprises by hand before drawing conclusions.", "");

const target = file.replace(/\.json$/, ".md");
writeFileSync(target, lines.join("\n"));
console.log(`Report: ${target}`);
