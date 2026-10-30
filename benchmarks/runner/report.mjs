// Turns a results JSON file from run.mjs into a Markdown report next to it.
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node benchmarks/runner/report.mjs <results.json>");
  process.exit(1);
}
const { meta, results } = JSON.parse(readFileSync(file, "utf8"));
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
out(`| Isolation | ${meta.isolation} |`, `| Platform | ${meta.platform}, Node ${meta.node} |`, "");

out("## Summary by condition", "", `| Condition | Cases passed | Cases partial | Task rubric (mean) | False claims | Ran tests | Cost (USD) |`, "| --- | --- | --- | --- | --- | --- | --- |");
for (const condition of conditions) {
  const cases = runsFor(condition, (run) => run.kind === "cases");
  const tasks = runsFor(condition, (run) => run.kind === "tasks" && run.rubric?.weighted != null);
  const all = runsFor(condition);
  const mean = tasks.length ? Math.round(tasks.reduce((sum, run) => sum + run.rubric.weighted, 0) / tasks.length) : "–";
  out(`| ${condition} | ${cases.filter((run) => run.status === "pass").length}/${cases.length} (${pct(cases.filter((run) => run.status === "pass").length, cases.length)}) | ${cases.filter((run) => run.status === "partial").length} | ${mean} | ${all.filter((run) => run.falseClaim).length} | ${all.filter((run) => run.ranTests).length}/${all.length} | ${all.reduce((sum, run) => sum + (run.costUSD ?? 0), 0).toFixed(2)} |`);
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

const worse = [];
for (const id of ids) {
  const baseline = results.find((run) => run.id === id && run.condition === "baseline");
  if (!baseline) continue;
  for (const condition of conditions.filter((name) => name !== "baseline")) {
    const run = results.find((item) => item.id === id && item.condition === condition);
    if (run && rank[run.status] < rank[baseline.status]) worse.push(`- \`${id}\`: ${condition} ${run.status} vs baseline ${baseline.status}`);
  }
}
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
