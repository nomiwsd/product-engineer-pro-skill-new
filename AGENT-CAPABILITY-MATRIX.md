# Agent Capability Matrix

What has actually been tested on each host, and when. Each host's tier, discovery path,
roles and workflow entry are generated from `skill/manifest.json` into the
[README host table](README.md#host-capability-tiers); this page records only test evidence.

**Status key**

- **Behaviour tested:** the real host was run against an installed project and its behaviour
  was observed.
- **Artifacts verified:** the automated test suite confirms the installer writes the exact,
  expected files for the host. The host itself was not run.
- **Not tested:** no evidence yet.

| Tool ID | Host | Tier | Installer artifacts | Host behaviour | Last tested | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `claude` | Claude Code | full-native | Artifacts verified | **Behaviour tested** (Claude Code 2.1.187) | 2026-10-29 | Skill and 13 `pep:` commands discovered. `pep-build` edited a file; `pep-review` had no edit tool and left it unchanged. In Plan mode a "find and fix" request produced a plan and no project edits. The workflow command routed the request, but the model did not explicitly load the skill in that run. |
| `codex` | Codex | full-native | Artifacts verified | Not tested | — | Generated planner and reviewer agents declare `sandbox_mode = "read-only"`. Codex CLI not available on the test machine. |
| `gemini` | Gemini CLI | full-native | Artifacts verified | Not tested | — | Gemini CLI not available on the test machine. |
| `cursor` | Cursor | full-native | Artifacts verified | Not tested | — | Cursor not available on the test machine. |
| `copilot` | VS Code / Copilot | full-native | Artifacts verified | Not tested | — | Copilot agent mode is interactive only; not run. |
| `windsurf` | Windsurf | native-workflow | Artifacts verified | Not tested | — | Windsurf not available on the test machine. |
| `roo-code` | Roo Code | native-workflow | Artifacts verified | Not tested | — | Generated `pep-plan`/`pep-review` modes omit the edit group. Roo Code not available on the test machine. |
| `cline` | Cline | native-workflow | Artifacts verified | Not tested | — | Cline not available on the test machine. |
| `aider` | Aider | portable-fallback | Artifacts verified | Not tested | — | Repeat installs keep `.aider.conf.yml` valid (regression-tested). Aider not available on the test machine. |
| `portable` | Portable AGENTS.md | portable-fallback | Artifacts verified | Not tested | — | Guidance only; no enforceable modes are claimed. |

## How to add a result

1. Install into a scratch project: `npx @nomiwsd/product-engineer-pro init --tool <id>`.
2. Run one workflow entry and each available role on a small known bug.
3. Record what the host did, including what did **not** work, with the host version and date.
4. Never mark a host "Behaviour tested" from documentation alone.
