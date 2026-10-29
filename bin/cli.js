#!/usr/bin/env node
import { runCli } from "../lib/cli.mjs";

try {
  process.exitCode = await runCli(process.argv.slice(2), process.cwd());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
