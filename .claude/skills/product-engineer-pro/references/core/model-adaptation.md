# Model Adaptation

## Scope

Owns: how this skill's instructions should be applied consistently
across different model families and consumption/hosting patterns.

Defers to: SKILL.md for the actual constraints/defaults being adapted —
this file only governs *how* to survive different reading conditions,
never *what* the rules are.

## Design Principles (apply throughout this entire skill)

- Plain markdown only — no reliance on any single vendor's special
  tokens or tag semantics for correctness.
- Imperative, unambiguous sentences ("Do X", "Never Y") over descriptive
  prose — this degrades gracefully across all model capability tiers.
- Critical content (constraints, mode registry) is front-loaded in
  `SKILL.md` so it survives truncation if a host limits context length.
- No instruction in this skill should depend on a specific reasoning
  feature (e.g., extended/hidden thinking) — it must work correctly with
  a single-pass, non-reasoning model too.

## Consumption Modes

This skill may reach a model in two different ways:

1. **Agentic file access** (Claude Skills, Claude Code, Cursor agent
   mode, Cline, Continue, Windsurf Cascade): the model reads files on
   demand per `SKILL.md`'s Loading Protocol. This is the preferred mode
   — full fidelity, minimal wasted context.
2. **Flattened single-prompt injection** (a full file or subset pasted
   once into a system prompt, some IDE integrations, thin Copilot
   configs): no on-demand file reads happen. If truncation is likely,
   prioritize content in this order:
   - SKILL.md Constraints + Mode Registry
   - matched workflow file (references/workflows/<mode>.md)
   - single most relevant reference file for the detected stack
   - templates/examples


When operating in this mode and full context isn't available, say so
explicitly rather than pretending full skill context was consulted.

## Per-Model Calibration Notes

These are tendencies observed in practice, not hard rules — an explicit
instruction elsewhere in this skill always overrides a calibration note
here.

- **Claude (Opus / Sonnet / Haiku).** Follows deeply nested structure and
long checklists reliably; cites sources well when instructed to (D5).
Safe to rely on multi-level markdown exactly as written elsewhere in
this skill.
- **GPT (4.x / 4o / o-series).** Responds well to numbered imperative
steps. On long multi-step workflows (`audit`, `review`, `database`),
add an explicit "complete all steps before producing the final answer"
instruction if the host allows a system-level nudge — GPT models can
otherwise short-circuit to an early step's output.
- **Gemini.** Tends to weight instructions near the point of generation
more heavily than instructions stated only once at the top of a long
context. For `security` and `database` modes specifically, restate the
relevant constraint (C1–C4) immediately before generating final output
if a lot of intervening context (file contents, tool output) exists
between the instruction and the response.
- **Smaller / local models** (Llama, Mistral, Qwen, Phi via
Ollama-backed IDE integrations). Prefer being pointed at the closest
matching file in `templates/` to fill in, rather than deriving
structure from abstract rules. Keep any ad-hoc instruction to these
models under two levels of conditional nesting ("if X, then if Y...").
Do not assume they will reliably self-correct without an explicit
checklist to run against (use `code-review-checklist.md` verbatim
rather than paraphrasing it).

## Handling Degraded or Partial Context

If only `SKILL.md` (or an even smaller fragment, like `AGENTS.md`) is
available and a reference file it points to cannot be loaded:
1. Proceed using the constraints and defaults that are available.
2. State explicitly which reference file would normally apply and that
it wasn't available — don't silently fabricate its content.
3. Prefer being conservative (ask, or flag lower confidence) over
inventing a plausible-sounding but unverified standard.

## Validation

`examples/evaluation-cases.md` should periodically be re-run against
multiple model families. A case that passes on one model but silently
fails on another indicates an instruction elsewhere in this skill is too
implementation-specific to one model's habits and should be rewritten
per the Design Principles above.

## Related References

- `references/core/repo-analysis.md` — detection output this file's
calibration notes apply to when communicating findings.
- All `references/workflows/*.md` — multi-step workflows most affected
by the GPT/Gemini calibration notes above.

## Applies To Modes

All modes, at the meta level — this file is not mode-specific content
but governs how every mode's instructions should be delivered.