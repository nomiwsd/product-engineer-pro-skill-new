import { roleText, workflowPrompt } from "./catalog.mjs";

const ROLES = ["plan", "build", "review"];

function frontmatter(fields) {
  return `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n`;
}

function roleLabel(role) {
  return role === "plan" ? "Planner / Researcher" : role === "review" ? "Reviewer / Auditor" : "Builder";
}

export function renderHostArtifacts(catalog, host) {
  const artifacts = [];
  const add = (path, content, capability = "native") => artifacts.push({ path, content, capability });

  if (host.id === "claude") {
    for (const workflow of catalog.workflows) {
      add(`.claude/commands/pep/${workflow.id}.md`, `${frontmatter({ description: workflow.description })}\n${workflowPrompt(workflow, host)}\n`);
    }
    for (const role of ROLES) {
      const readOnly = role !== "build";
      add(`.claude/agents/pep-${role}.md`, `${frontmatter({
        name: `pep-${role}`,
        description: `${roleLabel(role)} for Product Engineer Pro tasks`,
        tools: readOnly ? "Read, Grep, Glob, WebFetch, WebSearch" : "Read, Grep, Glob, Edit, Write, Bash",
        permissionMode: readOnly ? "plan" : "default"
      })}\n${roleText(role)}\n\nLoad the product-engineer-pro skill and select one of its 13 specialties.\n`);
    }
  }

  if (host.id === "codex") {
    for (const role of ROLES) {
      const sandbox = role === "build" ? "workspace-write" : "read-only";
      add(`.codex/agents/pep-${role}.toml`, `name = "pep-${role}"\ndescription = "${roleLabel(role)} for Product Engineer Pro tasks"\nsandbox_mode = "${sandbox}"\ndeveloper_instructions = """\n${roleText(role)} Invoke $product-engineer-pro and select the requested specialty. Host permissions remain authoritative.\n"""\n`);
    }
  }

  if (host.id === "gemini") {
    for (const workflow of catalog.workflows) {
      add(`.gemini/commands/pep/${workflow.id}.toml`, `description = ${JSON.stringify(workflow.description)}\nprompt = ${JSON.stringify(workflowPrompt(workflow, host))}\n`);
    }
    for (const role of ROLES) {
      const tools = role === "build" ? "read_file, glob, grep_search, replace, write_file, run_shell_command" : "read_file, glob, grep_search, web_fetch, google_web_search";
      add(`.gemini/agents/pep-${role}.md`, `${frontmatter({ name: `pep-${role}`, description: `${roleLabel(role)} for Product Engineer Pro tasks`, tools })}\n${roleText(role)} Load the product-engineer-pro skill and select the requested specialty.\n`);
    }
  }

  if (host.id === "cursor") {
    add(".cursor/rules/product-engineer-pro.mdc", `${frontmatter({ description: "Route supported engineering work through Product Engineer Pro", alwaysApply: false })}\nInvoke the native product-engineer-pro skill. Treat host Ask/Agent state as authoritative and select lifecycle separately from specialty.\n`);
    for (const role of ROLES) {
      add(`.cursor/agents/pep-${role}.md`, `${frontmatter({ name: `pep-${role}`, description: `${roleLabel(role)} for Product Engineer Pro tasks` })}\n${roleText(role)} Invoke the product-engineer-pro skill and select the requested specialty.\n`);
    }
  }

  if (host.id === "copilot") {
    for (const workflow of catalog.workflows) {
      add(`.github/prompts/pep-${workflow.id}.prompt.md`, `${frontmatter({ mode: "agent", description: workflow.description })}\n${workflowPrompt(workflow, host)}\n`);
    }
    for (const role of ROLES) {
      const tools = role === "build" ? ["search", "edit", "execute"] : ["search"];
      add(`.github/agents/pep-${role}.agent.md`, `${frontmatter({ description: `${roleLabel(role)} for Product Engineer Pro tasks`, tools })}\n${roleText(role)} Use the product-engineer-pro skill and select the requested specialty.\n`);
    }
  }

  if (host.id === "windsurf") {
    add(".windsurf/rules/product-engineer-pro.md", `${frontmatter({ trigger: "model_decision", description: "Product Engineer Pro lifecycle and workflow router" })}\nUse the product-engineer-pro skill. Cascade's Plan/Code state controls mutation; specialty controls engineering behavior.\n`);
    for (const workflow of catalog.workflows) {
      add(`.windsurf/workflows/pep-${workflow.id}.md`, `${frontmatter({ description: workflow.description })}\n1. Load the product-engineer-pro skill.\n2. Select the \`${workflow.id}\` specialty.\n3. Respect Cascade's current Plan/Code state.\n4. ${workflowPrompt(workflow, host)}\n`);
    }
  }

  if (host.id === "roo-code") {
    const modes = ROLES.map((role) => {
      const groups = role === "build" ? "[read, edit, browser, command]" : "[read, browser, command]";
      return `  - slug: pep-${role}\n    name: PEP ${roleLabel(role)}\n    roleDefinition: ${JSON.stringify(roleText(role))}\n    groups: ${groups}\n    customInstructions: ${JSON.stringify("Load .agents/skills/product-engineer-pro/SKILL.md and select one of the 13 specialties. Never weaken Roo permissions.")}`;
    }).join("\n");
    add(".roomodes", `customModes:\n${modes}\n`);
    for (const role of ROLES) {
      add(`.roo/rules-pep-${role}/01-product-engineer-pro.md`, `# Product Engineer Pro: ${roleLabel(role)}\n\n${roleText(role)} Select lifecycle separately from one of the 13 specialties in the skill manifest.\n`);
    }
  }

  if (host.id === "aider") {
    add("CONVENTIONS.md", `# Product Engineer Pro conventions\n\nUse lifecycle (plan, build, or review) separately from specialty (${catalog.workflows.map((item) => item.id).join(", ")}).\n\nRead repository conventions and installed versions before proposing changes. Respect user intent, validate trust boundaries, run proportionate checks, and never weaken host safeguards or perform destructive work without explicit confirmation. Aider does not provide package-defined role agents or enforceable lifecycle modes.\n`, "portable");
  }

  return artifacts;
}

export function renderGuidance(catalog, host) {
  const workflowList = catalog.workflows.map((workflow) => `\`${workflow.id}\``).join(", ");
  return `Use the Product Engineer Pro skill at \`${host.skillRoot || "CONVENTIONS.md"}\` for supported engineering work. Select lifecycle (plan/build/review) separately from specialty (${workflowList}). Host permissions and user intent control whether editing is allowed.`;
}
