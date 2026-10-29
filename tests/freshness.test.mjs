import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { entries, highestStable, liveFindings, validateSnapshot } from "../scripts/snapshot.mjs";

const real = JSON.parse(readFileSync(resolve("skill/references/version-snapshot.json"), "utf8"));
const dir = mkdtempSync(join(tmpdir(), "pep-freshness-"));
test.after(() => rmSync(dir, { recursive: true, force: true }));

function snapshotCheckedOn(date, edit = () => {}) {
  const snapshot = structuredClone(real);
  for (const { entry } of entries(snapshot)) entry.checkedAt = date;
  snapshot.verifiedAt = date;
  edit(snapshot);
  return snapshot;
}

function offline(snapshot, today) {
  const path = join(dir, `snapshot-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(path, JSON.stringify(snapshot));
  const result = spawnSync(process.execPath, ["scripts/check-freshness.mjs", "--offline", "--json", "--snapshot", path, "--today", today], { encoding: "utf8" });
  return { status: result.status, report: JSON.parse(result.stdout) };
}

test("the shipped snapshot satisfies the schema", () => {
  assert.deepEqual(validateSnapshot(real), []);
});

test("an entry without source, meaning, or check date is rejected", () => {
  const snapshot = structuredClone(real);
  delete snapshot.frameworks.next.source;
  snapshot.frameworks.react.meaning = "newest";
  delete snapshot.databases.mongodb.checkedAt;
  const errors = validateSnapshot(snapshot).join("\n");
  assert.match(errors, /frameworks\.next\.source/);
  assert.match(errors, /frameworks\.react\.meaning/);
  assert.match(errors, /databases\.mongodb\.checkedAt/);
});

test("verifiedAt must be the oldest entry check date", () => {
  const snapshot = snapshotCheckedOn("2026-10-01", (value) => { value.verifiedAt = "2026-10-29"; });
  assert.match(validateSnapshot(snapshot).join("\n"), /oldest checkedAt \(2026-10-01\)/);
});

test("offline check passes a freshly verified snapshot", () => {
  const { status, report } = offline(snapshotCheckedOn("2026-10-29"), "2026-10-29");
  assert.equal(status, 0);
  assert.deepEqual(report.findings, []);
});

test("offline check warns past half the age limit without failing", () => {
  const { status, report } = offline(snapshotCheckedOn("2026-09-01"), "2026-10-29");
  assert.equal(status, 0);
  assert.ok(report.findings.length > 0 && report.findings.every((finding) => finding.severity === "aging"));
});

test("offline check fails a snapshot older than the age limit", () => {
  const { status, report } = offline(snapshotCheckedOn("2026-06-01"), "2026-10-29");
  assert.equal(status, 1);
  assert.ok(report.findings.some((finding) => finding.severity === "stale" && finding.subject === "frameworks.next"));
});

test("offline check reports an invalid snapshot instead of passing", () => {
  const { status, report } = offline(snapshotCheckedOn("2026-10-29", (value) => { delete value.standards.owaspTop10; }), "2026-10-29");
  assert.equal(status, 1);
  assert.equal(report.findings[0].severity, "invalid");
});

function stubFetch(pages) {
  return async (url) => {
    for (const [pattern, body] of pages) if (url.includes(pattern)) return typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`${url}: 404`);
  };
}

const npm = (versions) => ({ versions: Object.fromEntries(versions.map((version) => [version, {}])) });
const matchingPages = (snapshot) => [
  ["registry.npmjs.org/prisma", npm(["7.10.1", "8.0.0-rc.28"])],
  ["registry.npmjs.org/@nestjs", npm(["11.1.28", snapshot.frameworks.nestjs.value])],
  ...entries(snapshot).filter(({ entry }) => entry.package).map(({ entry }) => [`registry.npmjs.org/${entry.package}`, npm([entry.value])]),
  ["nodejs.org/dist", [{ version: "v26.13.0", lts: "Lithium" }, { version: "v24.22.2", lts: "Krypton" }]],
  ["postgresql.org", '<a href="/docs/release/18.6/">18.6</a><a href="/docs/release/17.10/">17.10</a>'],
  ["mongodb.com", "<h3>Current Stable Release</h3><p>( <em>9.0-series</em> )</p>"],
  ["owasp.org", "<p>The most current released version is the OWASP Top 10 2025.</p>"]
];

test("live check ignores prerelease versions and passes a current snapshot", async () => {
  assert.equal(highestStable(["7.10.1", "8.0.0-rc.28", "7.9.1"]), "7.10.1");
  const findings = await liveFindings(real, stubFetch(matchingPages(real)));
  assert.deepEqual(findings, []);
});

test("live check flags a new framework major", async () => {
  const pages = [["registry.npmjs.org/@nestjs", npm(["12.3.2", "13.0.0"])], ...matchingPages(real)];
  const findings = await liveFindings(real, stubFetch(pages));
  assert.deepEqual(findings.map((finding) => [finding.severity, finding.subject, finding.observed]), [["major", "frameworks.nestjs", "13.0.0"]]);
});

test("live check reports unverified when an official page layout changes", async () => {
  const pages = [["postgresql.org", "<p>redesigned</p>"], ["mongodb.com", "<p>redesigned</p>"], ["owasp.org", "<p>redesigned</p>"], ...matchingPages(real)];
  const findings = await liveFindings(real, stubFetch(pages));
  assert.deepEqual(findings.map((finding) => [finding.severity, finding.subject]), [
    ["unverified", "databases.postgresql"],
    ["unverified", "databases.mongodb"],
    ["unverified", "standards.owaspTop10"]
  ]);
});

test("live check reports unverified when a source is unreachable", async () => {
  const pages = matchingPages(real).filter(([pattern]) => pattern !== "nodejs.org/dist");
  const findings = await liveFindings(real, stubFetch(pages));
  assert.deepEqual(findings.map((finding) => [finding.severity, finding.subject]), [["unverified", "runtime.node"]]);
});
