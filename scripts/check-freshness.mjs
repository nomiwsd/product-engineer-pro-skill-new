import { readFileSync } from "node:fs";

const snapshot = JSON.parse(readFileSync("skill/references/version-snapshot.json", "utf8"));
const json = process.argv.includes("--json");
const offline = process.argv.includes("--offline");
const findings = [];

function numeric(version) {
  return String(version).replace(/^[^0-9]*/, "").split(/[.-]/).slice(0, 3).map((part) => Number.parseInt(part, 10) || 0);
}

function compare(subject, current, observed, standard = false) {
  const [currentMajor, currentMinor, currentPatch] = numeric(current);
  const [major, minor, patch] = numeric(observed);
  if (major > currentMajor) findings.push({ severity: standard ? "standards" : "major", subject, snapshot: current, observed });
  else if (major === currentMajor && minor > currentMinor) findings.push({ severity: "warning", subject, snapshot: current, observed });
  else if (major === currentMajor && minor === currentMinor && patch > currentPatch) findings.push({ severity: "info", subject, snapshot: current, observed });
}

async function text(url) {
  const response = await fetch(url, { headers: { "user-agent": "product-engineer-pro-freshness/2" } });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.text();
}

if (!offline) {
  const packageMap = {
    next: "next",
    react: "react",
    tailwindcss: "tailwindcss",
    shadcn: "shadcn",
    express: "express",
    nestjs: "@nestjs/core",
    zod: "zod",
    prisma: "prisma",
    mongoose: "mongoose"
  };
  for (const [key, packageName] of Object.entries(packageMap)) {
    const metadata = JSON.parse(await text(`https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`));
    compare(packageName, snapshot.frameworks[key], metadata.version);
  }
  const typescript = JSON.parse(await text("https://registry.npmjs.org/typescript/latest"));
  compare("typescript", snapshot.runtime.typescript.current, typescript.version);

  const node = JSON.parse(await text("https://nodejs.org/dist/index.json"));
  compare("Node current", snapshot.runtime.node.current, node[0].version);
  const currentLts = node.find((release) => release.lts);
  if (currentLts) compare("Node LTS", snapshot.runtime.node.lts, currentLts.version);

  const postgres = await text(snapshot.databases.postgresql.source);
  const postgresVersion = postgres.match(/Release\s+(\d+)(?:\.\d+)?/i)?.[1];
  if (postgresVersion) compare("PostgreSQL", snapshot.databases.postgresql.current, postgresVersion, true);

  const mongo = await text(snapshot.databases.mongodb.source);
  const mongoVersion = mongo.match(/MongoDB\s+(\d+\.\d+)/i)?.[1];
  if (mongoVersion) compare("MongoDB", snapshot.databases.mongodb.current, mongoVersion, true);

  const owasp = await text("https://owasp.org/www-project-top-ten/");
  const years = [...owasp.matchAll(/Top\s*10[:\s-]*(20\d{2})/gi)].map((match) => Number(match[1]));
  if (years.length) compare("OWASP Top 10", snapshot.standards.owaspTop10.current, String(Math.max(...years)), true);
}

const report = { checkedAt: new Date().toISOString(), snapshot: snapshot.verifiedAt, offline, findings };
if (json) console.log(JSON.stringify(report, null, 2));
else if (!findings.length) console.log(`Freshness check passed against snapshot ${snapshot.verifiedAt}.`);
else for (const finding of findings) console.log(`${finding.severity.toUpperCase()}: ${finding.subject} ${finding.snapshot} -> ${finding.observed}`);

if (findings.some((finding) => finding.severity === "major" || finding.severity === "standards")) process.exitCode = 1;
