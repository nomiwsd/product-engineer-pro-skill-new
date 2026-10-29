# Workflow: Design System

## Goal

Audit, incrementally extend, create, or rebrand an accessible token and component system that
fits the product, the detected Tailwind version, and existing UI conventions — with semantic
tokens, complete component states, and measured contrast.

## Detect first

- Product context, audience, brand assets, token source, component library, Tailwind version
  and config style, theme mechanism, typography, and accessibility constraints.
- Which flow applies (below); state it.

| Flow | Use when | Required output |
|---|---|---|
| Audit | The user asks for findings only | Inventory, inconsistencies, accessibility risks, prioritized remediation |
| Incremental extension | An established system exists and the user needs scoped additions | Preserve existing primitives and semantics; add only required tokens and components |
| Greenfield creation | No established system exists | Product and audience analysis, three distinct directions, selection, then implementation |
| Rebrand | The user explicitly authorizes identity-level change | Preserve constraints, three distinct directions, migration and rollout plan |

## Lifecycle behavior

- `plan`: the complete file-level implementation or remediation plan. No edits (L1).
- `build`: implement the selected scope in the existing token source.
- `review`: findings on tokens, states, contrast, and motion with locations. No edits.

## Process

1. Inspect the context above and select one flow.
2. Use three directions only for greenfield or rebrand exploration, differing on at least two
   axes (color strategy, typography, radius, density), compared in a short decision matrix. If
   the user already chose a direction, validate it instead of inventing alternatives.
3. Define three token layers — primitive, semantic, component — and make components consume
   semantic tokens only (`references/frontend/design-system-theming.md`).
4. Cover every component state: default, hover, focus-visible, active, disabled, invalid, and
   loading. Define type, spacing, radius, elevation, and motion scales.
5. Give motion tokens a reduced-motion fallback. Produce dark values only when a dark theme is
   in scope.
6. Integrate with the detected Tailwind and shadcn/ui conventions
   (`references/frontend/tailwind-css.md`, `references/frontend/shadcn-ui.md`); keep one token
   source.
7. Measure contrast for changed text and UI pairs, focus visibility, and non-color cues with the
   repository's tools (`references/core/accessibility-a11y.md`). Report measured values only.

## Version gates

| Detected | Then |
|---|---|
| Tailwind 4+ | Tokens live in CSS-first `@theme`; shadcn/ui generates v4 conventions |
| Tailwind 3 | Tokens live in `tailwind.config.*` under `theme.extend` |

## Best-practice checklist

- [ ] Flow selected and stated; existing brand and token constraints identified.
- [ ] Three directions used only for greenfield or rebrand exploration.
- [ ] Primitive, semantic, and component layers are separate; components use semantic tokens.
- [ ] All component states and reduced motion are covered.
- [ ] One token source, integrated with the detected Tailwind and shadcn/ui versions.
- [ ] Contrast measured for changed pairs; no unmeasured contrast or performance claims.

## Evidence required

Measured contrast ratios for changed pairs and the list of affected components (E3, E4); type
check, lint, and visual or story checks when the repository has them (E2).

## Stop conditions

Stop and ask before identity-level changes that were not authorized as a rebrand, or when a
change would create a second token source.

## Never

- Create a competing token source.
- Force three directions onto audits or incremental work.
- Invent a dark theme for a deliberately single-theme product.

## Output

Audit: prioritized findings and remediation. Incremental: the scoped token or component change
first. Greenfield or rebrand: the direction matrix first, then implementation once a direction
is chosen. Read-only host: the complete plan without edits.

## References

- `references/core/operating-rules.md`
- `references/frontend/design-system-theming.md`
- `references/frontend/tailwind-css.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`
- `templates/frontend/tailwind-theme-tokens.css.md`
