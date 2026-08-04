#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");
const SKILL_SRC = join(PACKAGE_ROOT, "skill");

const DEFAULT_VERSION = "1.0.1";

function getVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));
    return pkg.version || DEFAULT_VERSION;
  } catch {
    return DEFAULT_VERSION;
  }
}

const SKILL_DEST_PATHS = [
  ".agents/skills/product-engineer-pro",
  ".claude/skills/product-engineer-pro",
];

const ADAPTER_TARGETS = {
  claude: { src: "adapters/claude-code/CLAUDE.md", dest: "CLAUDE.md" },
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

const isAll = args.includes("--all") || args.includes("-a") || args.includes("all");
const toolFlagIndex = Math.max(args.indexOf("--tool"), args.indexOf("--adapter"));
const tool = toolFlagIndex >= 0 ? args[toolFlagIndex + 1] : (isAll ? "all" : "claude");

function copySkillFolders() {
  // Clean up legacy unhidden root folder if present to keep project root clean
  const legacyPath = join(process.cwd(), "product-engineer-pro");
  if (existsSync(legacyPath)) {
    try {
      rmSync(legacyPath, { recursive: true, force: true });
    } catch {
      // Ignore if fail to remove
    }
  }

  for (const destRel of SKILL_DEST_PATHS) {
    const destRoot = join(process.cwd(), destRel);
    mkdirSync(destRoot, { recursive: true });
    cpSync(SKILL_SRC, destRoot, { recursive: true });
  }
}

function installAdapter(toolName) {
  const config = ADAPTER_TARGETS[toolName];
  if (!config || !config.src) return false;
  const adapterSrc = join(SKILL_SRC, config.src);
  const adapterDest = join(process.cwd(), config.dest);
  mkdirSync(dirname(adapterDest), { recursive: true });
  cpSync(adapterSrc, adapterDest);
  return true;
}

function installFor(toolName) {
  copySkillFolders();

  if (toolName === "all" || isAll) {
    for (const t of Object.keys(ADAPTER_TARGETS)) {
      installAdapter(t);
    }
    console.log(`✔ @nomiwsd/product-engineer-pro v${getVersion()} installed for ALL tools & IDEs.`);
    console.log(`  Skills:   ./.agents/skills/product-engineer-pro/`);
    console.log(`            ./.claude/skills/product-engineer-pro/`);
    console.log(`  Adapters: Configured for Cursor, Windsurf, Copilot, Gemini, Codex, Claude Code, Roo Code, Aider, Generic.`);
    return;
  }

  const config = ADAPTER_TARGETS[toolName];
  if (!config) {
    console.error(`❌ Unknown tool "${toolName}". Supported: ${Object.keys(ADAPTER_TARGETS).join(", ")}, all`);
    process.exit(1);
  }

  installAdapter(toolName);

  console.log(`✔ @nomiwsd/product-engineer-pro v${getVersion()} installed for "${toolName}".`);
  console.log(`  Skills:   ./.agents/skills/product-engineer-pro/`);
  console.log(`            ./.claude/skills/product-engineer-pro/`);
  if (config.dest) console.log(`  Adapter:  ./${config.dest}`);
}

switch (command) {
  case "init":
  case "install":
    installFor(tool);
    break;
  case "update":
    const hasExisting = SKILL_DEST_PATHS.some((p) => existsSync(join(process.cwd(), p))) || existsSync(join(process.cwd(), "product-engineer-pro"));
    if (!hasExisting) {
      console.error("❌ No existing install found. Run `npx @nomiwsd/product-engineer-pro init` first.");
      process.exit(1);
    }
    copySkillFolders();
    console.log(`✔ product-engineer-pro updated to v${getVersion()}.`);
    break;
  case "list-tools":
    console.log([...Object.keys(ADAPTER_TARGETS), "all"].join("\n"));
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
    console.log(`@nomiwsd/product-engineer-pro v${getVersion()}
Senior/principal full-stack engineering AI skill CLI

USAGE
  $ npx @nomiwsd/product-engineer-pro [command] [options]

COMMANDS
  init [--tool <name>]    Install skill and adapter for target tool (default: claude)
  init --all              Install skill and adapters for ALL supported IDEs & agents
  update                  Update existing skill installation to latest version
  list-tools              List all supported tool adapters
  version                 Show package version
  help                    Show help message

SUPPORTED TOOLS
  ${Object.keys(ADAPTER_TARGETS).join(", ")}, all

EXAMPLES
  $ npx @nomiwsd/product-engineer-pro init
  $ npx @nomiwsd/product-engineer-pro init --all
  $ npx @nomiwsd/product-engineer-pro init --tool gemini
  $ npx @nomiwsd/product-engineer-pro init --tool codex
  $ npx @nomiwsd/product-engineer-pro init --tool cursor
  $ npx @nomiwsd/product-engineer-pro init --tool windsurf
  $ npx @nomiwsd/product-engineer-pro init --tool roo-code
  $ npx @nomiwsd/product-engineer-pro init --tool aider
  $ npx @nomiwsd/product-engineer-pro update`);
    break;
}
