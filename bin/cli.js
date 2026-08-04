#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");
const SKILL_SRC = join(PACKAGE_ROOT, "skill");

const DEFAULT_VERSION = "1.0.0";

function getVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));
    return pkg.version || DEFAULT_VERSION;
  } catch {
    return DEFAULT_VERSION;
  }
}

const ADAPTER_TARGETS = {
  claude: { src: null, dest: ".claude/skills/product-engineer-pro" },
  cursor: { src: "adapters/cursor/product-engineer-pro.mdc", dest: ".cursor/rules/product-engineer-pro.mdc" },
  windsurf: { src: "adapters/windsurf/.windsurfrules", dest: ".windsurfrules" },
  copilot: { src: "adapters/copilot/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
  "claude-code": { src: "adapters/claude-code/CLAUDE.md", dest: "CLAUDE.md" },
  gemini: { src: "adapters/gemini/GEMINI.md", dest: "GEMINI.md" },
  codex: { src: "adapters/codex/instructions.md", dest: ".codex/instructions.md" },
  "roo-code": { src: "adapters/roo-code/.clinerules", dest: ".clinerules" },
  cline: { src: "adapters/roo-code/.clinerules", dest: ".clinerules" },
  aider: { src: "adapters/aider/CONVENTIONS.md", dest: "CONVENTIONS.md" },
  generic: { src: "adapters/generic/INSTRUCTIONS.md", dest: "AGENTS.md" },
};

const args = process.argv.slice(2);
const command = args[0] || "help";

const toolFlagIndex = Math.max(args.indexOf("--tool"), args.indexOf("--adapter"));
const tool = toolFlagIndex >= 0 ? args[toolFlagIndex + 1] : "claude";

function copySkillFolder(destRoot) {
  mkdirSync(destRoot, { recursive: true });
  cpSync(SKILL_SRC, destRoot, { recursive: true });
}

function installFor(toolName) {
  const config = ADAPTER_TARGETS[toolName];
  if (!config) {
    console.error(`❌ Unknown tool "${toolName}". Supported: ${Object.keys(ADAPTER_TARGETS).join(", ")}`);
    process.exit(1);
  }

  // Always place full skill folder in target project
  copySkillFolder(join(process.cwd(), "product-engineer-pro"));

  // Place thin adapter pointer if applicable
  if (config.src) {
    const adapterSrc = join(SKILL_SRC, config.src);
    const adapterDest = join(process.cwd(), config.dest);
    mkdirSync(dirname(adapterDest), { recursive: true });
    cpSync(adapterSrc, adapterDest);
  }

  console.log(`✔ product-engineer-pro v${getVersion()} installed for "${toolName}".`);
  console.log(`  Full skill: ./product-engineer-pro/`);
  if (config.src) console.log(`  Adapter:    ./${config.dest}`);
}

switch (command) {
  case "init":
  case "install":
    installFor(tool);
    break;
  case "update":
    if (!existsSync(join(process.cwd(), "product-engineer-pro"))) {
      console.error("❌ No existing install found. Run `npx product-engineer-pro init` first.");
      process.exit(1);
    }
    copySkillFolder(join(process.cwd(), "product-engineer-pro"));
    console.log(`✔ product-engineer-pro updated to v${getVersion()}.`);
    break;
  case "list-tools":
    console.log(Object.keys(ADAPTER_TARGETS).join("\n"));
    break;
  case "version":
  case "-v":
  case "--version":
    console.log(`v${getVersion()}`);
    break;
  case "help":
  case "-h":
  case "--help":
  default:
    console.log(`product-engineer-pro v${getVersion()}
Senior/principal full-stack engineering AI skill CLI

USAGE
  $ npx product-engineer-pro [command] [options]

COMMANDS
  init [--tool <name>]    Install skill and adapter for target tool (default: claude)
  update                  Update existing skill installation to latest version
  list-tools              List all supported tool adapters
  version                 Show package version
  help                    Show help message

SUPPORTED TOOLS
  ${Object.keys(ADAPTER_TARGETS).join(", ")}

EXAMPLES
  $ npx product-engineer-pro init
  $ npx product-engineer-pro init --tool gemini
  $ npx product-engineer-pro init --tool codex
  $ npx product-engineer-pro init --tool cursor
  $ npx product-engineer-pro init --tool windsurf
  $ npx product-engineer-pro init --tool roo-code
  $ npx product-engineer-pro init --tool aider
  $ npx product-engineer-pro update`);
    break;
}
