import { readFileSync } from "node:fs";
import { BLOCKING, ageFindings, liveFindings, markdownReport, validateSnapshot } from "./snapshot.mjs";

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
};
const json = args.includes("--json");
const markdown = args.includes("--markdown");
const offline = args.includes("--offline");
const today = option("--today") ?? new Date().toISOString().slice(0, 10);
const snapshot = JSON.parse(readFileSync(option("--snapshot") ?? "skill/references/version-snapshot.json", "utf8"));

async function fetchText(url, headers = {}) {
  const response = await fetch(url, { headers: { "user-agent": "product-engineer-pro-freshness/3", ...headers }, signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.text();
}

const findings = validateSnapshot(snapshot).map((detail) => ({ severity: "invalid", subject: "snapshot", snapshot: null, detail }));
if (!findings.length) {
  findings.push(...ageFindings(snapshot, today));
  if (!offline) findings.push(...await liveFindings(snapshot, fetchText));
}

const report = { checkedAt: new Date().toISOString(), today, snapshot: snapshot.verifiedAt, maxAgeDays: snapshot.maxAgeDays, offline, findings };
if (json) console.log(JSON.stringify(report, null, 2));
else if (markdown) console.log(markdownReport(report));
else if (!findings.length) console.log(`Freshness check passed against snapshot ${snapshot.verifiedAt}${offline ? " (offline: age only)" : ""}.`);
else for (const finding of findings) console.log(`${finding.severity.toUpperCase()}: ${finding.subject} ${finding.observed ? `${finding.snapshot} -> ${finding.observed}` : finding.detail}`);

if (findings.some((finding) => BLOCKING.includes(finding.severity))) process.exitCode = 1;
