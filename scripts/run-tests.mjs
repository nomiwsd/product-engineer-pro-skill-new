import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

// List test files explicitly: Windows shells do not expand globs, and Node.js < 21
// cannot expand them itself.
const files = readdirSync("tests").filter((name) => name.endsWith(".test.mjs")).sort().map((name) => `tests/${name}`);
const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
