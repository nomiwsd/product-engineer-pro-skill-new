import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
let manifest = JSON.parse(readFileSync("skill/manifest.json", "utf8"));
let generated = JSON.parse(readFileSync("website/generated/catalog.json", "utf8"));
let changelog = readFileSync("CHANGELOG.md", "utf8");
const errors = [];

if (process.argv.includes("--fix")) {
  manifest.skill.version = pkg.version;
  writeFileSync("skill/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
  if (!changelog.includes(`[${pkg.version}]`)) {
    const section = `# Changelog\n\n## [${pkg.version}] — ${new Date().toISOString().slice(0, 10)}\n\n### Changed\n\n- Release metadata synchronized.\n`;
    changelog = changelog.replace("# Changelog", section.trimEnd());
    writeFileSync("CHANGELOG.md", changelog);
  }
  const generatedResult = spawnSync(process.execPath, ["scripts/generate-artifacts.mjs"], { stdio: "inherit" });
  if (generatedResult.status !== 0) process.exit(generatedResult.status || 1);
  generated = JSON.parse(readFileSync("website/generated/catalog.json", "utf8"));
}

if (manifest.skill.version !== pkg.version) errors.push(`manifest ${manifest.skill.version} != package ${pkg.version}`);
if (generated.version !== pkg.version) errors.push(`website catalog ${generated.version} != package ${pkg.version}`);
if (!changelog.includes(`[${pkg.version}]`)) errors.push(`CHANGELOG.md has no [${pkg.version}] section`);

if (errors.length) {
  console.error(`Version sync failed:\n${errors.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Version ${pkg.version} is synchronized.`);
