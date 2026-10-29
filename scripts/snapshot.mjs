// Version snapshot schema, staleness rules, and live freshness checks shared by
// check-freshness.mjs, validate-structure.mjs, and the integration tests.

export const MEANINGS = ["latest-stable", "active-lts", "maintenance-lts", "current", "preview", "last-tested"];
export const STATUSES = ["verified", "stale", "unverified"];
export const REQUIRED = {
  runtime: ["node", "nodeCurrent", "typescript"],
  frameworks: ["next", "react", "tailwindcss", "shadcn", "express", "nestjs", "zod", "prisma", "mongoose"],
  databases: ["postgresql", "mongodb"],
  standards: ["owaspTop10"]
};
export const BLOCKING = ["invalid", "major", "standards", "stale", "unverified"];

const DAY = 86_400_000;
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value)) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const ageInDays = (from, today) => Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

export function entries(snapshot) {
  return Object.entries(REQUIRED).flatMap(([group, keys]) => keys
    .filter((key) => snapshot?.[group]?.[key])
    .map((key) => ({ group, key, entry: snapshot[group][key] })));
}

export function validateSnapshot(snapshot) {
  const errors = [];
  if (snapshot?.schemaVersion !== 2) errors.push("schemaVersion must be 2.");
  if (!Number.isInteger(snapshot?.maxAgeDays) || snapshot.maxAgeDays <= 0) errors.push("maxAgeDays must be a positive integer.");
  if (!isDate(snapshot?.verifiedAt)) errors.push("verifiedAt must be a YYYY-MM-DD date.");
  for (const [group, keys] of Object.entries(REQUIRED)) {
    for (const key of keys) {
      const entry = snapshot?.[group]?.[key];
      const at = `${group}.${key}`;
      if (!entry) { errors.push(`${at} is missing.`); continue; }
      if (typeof entry.value !== "string" || !entry.value) errors.push(`${at}.value must be a non-empty string.`);
      if (!MEANINGS.includes(entry.meaning)) errors.push(`${at}.meaning must be one of ${MEANINGS.join(", ")}.`);
      if (!/^https:\/\//.test(entry.source ?? "")) errors.push(`${at}.source must be an https URL.`);
      if (!isDate(entry.checkedAt)) errors.push(`${at}.checkedAt must be a YYYY-MM-DD date.`);
      if (!STATUSES.includes(entry.status)) errors.push(`${at}.status must be one of ${STATUSES.join(", ")}.`);
      if ((group === "frameworks" || key === "typescript") && typeof entry.package !== "string") errors.push(`${at}.package must name the npm package.`);
    }
  }
  const dates = entries(snapshot).map(({ entry }) => entry.checkedAt).filter(isDate).sort();
  if (dates.length && snapshot.verifiedAt !== dates[0]) errors.push(`verifiedAt must equal the oldest checkedAt (${dates[0]}).`);
  return errors;
}

export function ageFindings(snapshot, today) {
  const findings = [];
  for (const { group, key, entry } of entries(snapshot)) {
    const subject = `${group}.${key}`;
    if (entry.status !== "verified") findings.push({ severity: "warning", subject, snapshot: entry.value, detail: `Snapshot entry is marked ${entry.status}.` });
    if (!isDate(entry.checkedAt)) continue;
    const age = ageInDays(entry.checkedAt, today);
    if (age > snapshot.maxAgeDays) findings.push({ severity: "stale", subject, snapshot: entry.value, detail: `Checked ${entry.checkedAt}, ${age} days ago (limit ${snapshot.maxAgeDays}).` });
    else if (age > snapshot.maxAgeDays / 2) findings.push({ severity: "aging", subject, snapshot: entry.value, detail: `Checked ${entry.checkedAt}, ${age} days ago; refresh before ${snapshot.maxAgeDays} days.` });
  }
  return findings;
}

function numeric(version) {
  return String(version).replace(/^[^0-9]*/, "").split(/[.-]/).slice(0, 3).map((part) => Number.parseInt(part, 10) || 0);
}

export function compare(subject, current, observed, standard = false) {
  const [currentMajor, currentMinor, currentPatch] = numeric(current);
  const [major, minor, patch] = numeric(observed);
  if (major > currentMajor) return { severity: standard ? "standards" : "major", subject, snapshot: current, observed };
  if (major === currentMajor && minor > currentMinor) return { severity: "warning", subject, snapshot: current, observed };
  if (major === currentMajor && minor === currentMinor && patch > currentPatch) return { severity: "info", subject, snapshot: current, observed };
  return null;
}

export function highestStable(versions) {
  return versions
    .filter((version) => /^\d+\.\d+\.\d+$/.test(version))
    .sort((left, right) => {
      const [a, b] = [numeric(left), numeric(right)];
      return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    })
    .at(-1) ?? null;
}

export const scrapers = {
  postgresql: (html) => {
    const majors = [...html.matchAll(/\/docs\/release\/(\d+)\.\d+\//g)].map((match) => Number(match[1])).filter((major) => major >= 10);
    return majors.length ? String(Math.max(...majors)) : null;
  },
  mongodb: (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").match(/Current Stable Release.{0,400}?\b(\d+\.\d+)-series/)?.[1] ?? null,
  owaspTop10: (html) => {
    const years = [...html.matchAll(/Top\s*10[:\s-]*(20\d{2})/gi)].map((match) => Number(match[1]));
    return years.length ? String(Math.max(...years)) : null;
  }
};

export async function liveFindings(snapshot, fetchText) {
  const findings = [];
  const check = async (subject, task) => {
    try {
      const finding = await task();
      if (finding) findings.push(finding);
    } catch (error) {
      findings.push({ severity: "unverified", subject, snapshot: null, detail: `Could not verify from the official source: ${error.message}` });
    }
  };
  const unverified = (subject, entry, detail) => ({ severity: "unverified", subject, snapshot: entry.value, detail });

  for (const { group, key, entry } of entries(snapshot).filter(({ entry }) => entry.package)) {
    const subject = `${group}.${key}`;
    await check(subject, async () => {
      const metadata = JSON.parse(await fetchText(`https://registry.npmjs.org/${entry.package.replace("/", "%2f")}`, { accept: "application/vnd.npm.install-v1+json" }));
      const stable = highestStable(Object.keys(metadata.versions ?? {}));
      return stable ? compare(subject, entry.value, stable) : unverified(subject, entry, "No stable version found in registry metadata.");
    });
  }

  await check("runtime.node", async () => {
    const releases = JSON.parse(await fetchText("https://nodejs.org/dist/index.json"));
    const lts = releases.find((release) => release.lts);
    const ltsFinding = lts ? compare("runtime.node", snapshot.runtime.node.value, String(numeric(lts.version)[0])) : unverified("runtime.node", snapshot.runtime.node, "No LTS release found.");
    const currentFinding = releases[0] ? compare("runtime.nodeCurrent", snapshot.runtime.nodeCurrent.value, String(numeric(releases[0].version)[0])) : null;
    if (currentFinding) findings.push(currentFinding);
    return ltsFinding;
  });

  for (const [group, key] of [["databases", "postgresql"], ["databases", "mongodb"], ["standards", "owaspTop10"]]) {
    const entry = snapshot[group][key];
    const subject = `${group}.${key}`;
    await check(subject, async () => {
      const observed = scrapers[key](await fetchText(entry.source));
      return observed ? compare(subject, entry.value, observed, true) : unverified(subject, entry, `The page at ${entry.source} no longer matches the expected layout; verify by hand.`);
    });
  }
  return findings;
}

export function markdownReport(report) {
  const line = (finding) => `- **${finding.severity}** \`${finding.subject}\`: ${finding.observed ? `snapshot ${finding.snapshot} → observed ${finding.observed}` : finding.detail}`;
  const blocking = report.findings.filter((finding) => BLOCKING.includes(finding.severity));
  const other = report.findings.filter((finding) => !BLOCKING.includes(finding.severity));
  return [
    `## Version freshness report — ${report.today ?? report.checkedAt.slice(0, 10)}`,
    "",
    `Snapshot verified at ${report.snapshot} (limit ${report.maxAgeDays} days). Mode: ${report.offline ? "offline (age only)" : "live"}.`,
    "",
    "### Blocking: review before the next release",
    "",
    ...(blocking.length ? blocking.map(line) : ["- None."]),
    "",
    "### Warnings and information",
    "",
    ...(other.length ? other.map(line) : ["- None."]),
    "",
    "Refresh the snapshot by following “Refreshing the version snapshot” in CONTRIBUTING.md. Never change a date without checking its source.",
    ""
  ].join("\n");
}
