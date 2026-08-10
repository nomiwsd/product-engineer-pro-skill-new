# Workflow: Design System

## Goal

Audit, incrementally extend, create, or rebrand an accessible token and component
system that fits the product, detected Tailwind version, and existing UI conventions.

## Select the flow first

| Flow | Use when | Required output |
|---|---|---|
| Audit | The user asks for findings only | Inventory, inconsistencies, accessibility risks, prioritized remediation |
| Incremental extension | An established system exists and the user needs scoped additions | Preserve existing primitives/semantics; add only required tokens and components |
| Greenfield creation | No established system exists | Product/audience analysis, three distinct directions, selection, then implementation |
| Rebrand | The user explicitly authorizes identity-level change | Preserve constraints, present three distinct directions, migration and rollout plan |

Do not require three directions for audits or incremental extensions. If a greenfield
or rebrand request already specifies a firm direction, validate it and proceed without
manufacturing alternatives unless the user asks for exploration.

## Process

1. Inspect product context, audience, brand assets, token sources, component library,
   Tailwind version, theme mechanism, typography, and accessibility constraints.
2. Select and state one flow from the table.
3. For greenfield/rebrand exploration, present three directions that differ on at
   least two substantive axes (color strategy, typography, radius, or density) and
   use a short decision matrix before broad implementation.
4. Define primitives, semantic tokens, component states, typography, spacing,
   radius, elevation, and motion. Components consume semantic tokens, not raw colors.
5. Produce light and dark values only when both themes are in scope; do not invent
   a dark theme for a deliberately single-theme product.
6. Integrate with the detected Tailwind v3/v4 and shadcn conventions. Never create
   a competing token source.
7. Verify relevant text/UI contrast, focus visibility, non-color cues, and reduced
   motion using tools available in the repository. Report measured values only.
8. In build lifecycle, implement the selected scope. In plan/review lifecycle,
   return the complete implementation/remediation plan without editing.

## Checklist

- [ ] Flow selected and existing brand/token constraints identified
- [ ] Three directions used only for greenfield/rebrand exploration
- [ ] Semantic tokens separate meaning from raw values
- [ ] State, accessibility, and motion behavior are covered
- [ ] Tailwind/shadcn integration matches detected versions
- [ ] No unsupported contrast or performance claim is reported

## Output

For audits, return prioritized findings and remediation. For incremental work,
lead with the scoped token/component change. For greenfield or rebrand exploration,
lead with the direction matrix and wait for a material product choice only when the
user has not already selected a direction. In read-only host state, return the
complete file-level implementation and verification plan without editing.

## References

- `references/frontend/design-system-theming.md`
- `references/frontend/tailwind-css.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`
- `templates/frontend/tailwind-theme-tokens.css.md`
