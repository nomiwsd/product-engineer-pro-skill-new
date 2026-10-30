// Re-grades a finished run with the current checks, using its saved transcripts and work
// folders. No agent runs again, so corrections change grading only, never the evidence.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { grade } from "./grade.mjs";
import { BENCH, REPO, loadItems, scrub, workdirFor } from "./items.mjs";

const [file, note = ""] = process.argv.slice(2);
if (!file) {
  console.error('Usage: node benchmarks/runner/regrade.mjs <results.json> ["why the checks changed"]');
  process.exit(1);
}
const data = JSON.parse(readFileSync(file, "utf8"));
const items = new Map(loadItems().map((item) => [item.id, item]));
let changed = 0;

data.results = data.results.map((record) => {
  const item = items.get(record.id);
  if (!item || !record.transcript) return record;
  const stamp = record.transcript.match(/raw[\\/]([^\\/]+)[\\/]/)?.[1];
  const workdir = workdirFor(stamp, record.id, record.condition, record.repeat);
  const transcriptPath = join(REPO, record.transcript);
  if (!existsSync(workdir) || !existsSync(transcriptPath)) return { ...record, regradeSkipped: "work folder or transcript missing" };
  const regraded = { ...record, ...grade(item, workdir, readFileSync(transcriptPath, "utf8"), BENCH) };
  if (regraded.status !== record.status || regraded.falseClaim !== record.falseClaim) {
    changed += 1;
    regraded.previous = { status: record.status, passed: record.passed, falseClaim: record.falseClaim };
  }
  return regraded;
});
data.meta.regraded = [...(data.meta.regraded ?? []), { at: new Date().toISOString(), note, changedRecords: changed }];
const target = file.replace(/(-regraded)?\.json$/, "-regraded.json");
writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Re-graded ${data.results.length} records (${changed} changed status or false-claim): ${target}`);
