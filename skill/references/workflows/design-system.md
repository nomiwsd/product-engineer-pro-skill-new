# Workflow: Design System

## Goal

Build, extend, or audit a UI theme and component design system that is
grounded in the actual product and audience, offers genuinely distinct
directions before committing to one, and produces a complete, accessible,
production-ready token implementation — light and dark, OKLCH-based,
Tailwind CSS v4-integrated, and shadcn/ui-compatible.

This workflow governs *process and required steps*. Deep rationale for
token architecture lives in `frontend/design-system-theming.md`; Tailwind
syntax lives in `frontend/tailwind-css.md`; component composition lives
in `frontend/shadcn-ui.md`; contrast/motion standards live in
`core/accessibility-a11y.md`. This file sequences and enforces all of
them for the specific case of building/extending a design system.

## Process

### 1. Product & Audience Analysis

Before any color, type, or spacing decision, establish and state
explicitly:
- What is the product and who is the primary audience (e.g., enterprise
  B2B finance, consumer social, developer tooling, healthcare)?
- What emotional register fits the audience and use case — trustworthy/
  serious, energetic/playful, minimal/technical, warm/approachable?
- What accessibility or regulatory floor applies — WCAG AA is the
  baseline (`accessibility-a11y.md`); use AAA if the domain is
  healthcare, government, finance, or otherwise legally/ethically
  higher-stakes.
- What must be preserved vs. what may change — is this a new brand or
  an extension of an existing one?

A theme decision made without this step is decoration, not design —
never skip directly to picking colors.

### 2. Existing Brand & Convention Check

Run `core/repo-analysis.md`. Detect any existing token source, brand
palette, logo colors, or marketing-site styling.

- If an existing brand identity exists: treat its core brand color(s)
  as a **fixed constraint**. Every proposed direction in Step 3 must
  incorporate or harmonize with it — never silently replace an
  established brand color with an unrelated one unless the user
  explicitly requests a rebrand.
- If no existing brand exists (greenfield): state this explicitly and
  proceed to originate directions grounded in Step 1's analysis.
- If an existing token source exists, extend it — never introduce a
  second, competing token system alongside one already in place (D2).

### 3. Generate Three Genuinely Distinct Theme Directions

Produce three directions that differ in substance, not just accent hue.
Each must vary on at least **two** of the following axes:
- Color temperature/saturation strategy (e.g., muted/desaturated vs.
  vivid/saturated; warm-neutral vs. cool-neutral grays)
- Typographic personality (geometric sans vs. humanist sans vs.
  serif-accented)
- Corner-radius language (sharp/0–2px vs. soft/8–16px vs. mixed by
  component type)
- Density/spacing rhythm (compact vs. spacious base scale)

For each direction, state:
- **Name** (short, memorable)
- **Personality** (one line)
- **Best fit** — which audience/product signal from Step 1 it serves
- **Primary hue strategy in OKLCH terms** (e.g., "primary at ~L0.55
  C0.18 H250 — a confident mid-saturation blue")

Never present three palettes that are the same design with the accent
color swapped — that is not three directions.

### 4. Present a Theme-Selection Decision Matrix

Before implementing any direction in full detail, present a comparison
matrix and require an explicit choice:

| Direction | Personality | Best Fit | Contrast Risk | Relationship to Existing Brand |
|---|---|---|---|---|
| A — [name] | [one line] | [audience/use case] | Low / Med / High | Reinforces / Extends / Departs |
| B — [name] | [one line] | [audience/use case] | Low / Med / High | Reinforces / Extends / Departs |
| C — [name] | [one line] | [audience/use case] | Low / Med / High | Reinforces / Extends / Departs |

Do not proceed past this point until a direction is selected — either
by explicit user confirmation, or (if asked to scaffold all three) by
producing all three as separate, clearly labeled outputs rather than
silently merging or picking one.

### 5. Build Primitive Tokens in OKLCH

For the selected direction, define primitive color tokens using
`oklch()`. OKLCH is required (not hex/HSL) because its lightness
channel is perceptually uniform — shade/tint generation and cross-theme
contrast prediction are reliable in a way hex and HSL are not.

```css
--primitive-blue-50:  oklch(0.97 0.02 250);
--primitive-blue-500: oklch(0.58 0.19 250);
--primitive-blue-900: oklch(0.28 0.12 250);
--primitive-gray-50:  oklch(0.98 0 0);
--primitive-gray-500: oklch(0.55 0 0);
--primitive-gray-900: oklch(0.20 0 0);
--primitive-red-600:  oklch(0.55 0.22 25);
--primitive-green-600: oklch(0.60 0.17 145);
--primitive-amber-600: oklch(0.72 0.16 75);
```

Generate a full 50–950 step scale per hue used (brand, neutral, and each
semantic status color) using consistent lightness steps — don't define
only the two or three shades immediately needed.

### 6. Derive Semantic Tokens

Map primitives to meaning-based roles. Components must reference these,
never primitives directly (per `design-system-theming.md`'s three-layer
architecture).

```css
--color-primary: var(--primitive-blue-500);
--color-primary-foreground: var(--primitive-gray-50);
--color-destructive: var(--primitive-red-600);
--color-success: var(--primitive-green-600);
--color-warning: var(--primitive-amber-600);
--color-background: var(--primitive-gray-50);
--color-foreground: var(--primitive-gray-900);
--color-muted: var(--primitive-gray-500);
--color-border: oklch(from var(--primitive-gray-500) l c h / 0.2);
```

### 7. Produce Light AND Dark Theme Pairs

Both are required outputs, not an optional extra. Dark mode is not
inverted lightness on the same hues — redefine each semantic token for
the dark context, and re-verify contrast independently in Step 12.

```css
:root {
  --color-background: var(--primitive-gray-50);
  --color-foreground: var(--primitive-gray-900);
  --color-primary: var(--primitive-blue-500);
  --color-primary-foreground: var(--primitive-gray-50);
}

.dark {
  --color-background: oklch(0.16 0 0);
  --color-foreground: oklch(0.95 0 0);
  --color-primary: oklch(0.70 0.16 250);
  --color-primary-foreground: oklch(0.16 0 0);
}
```

### 8. Define Typography, Spacing, Radius, and Shadow Scales

All four are required, not optional additions:

```css
@theme {
  /* Typography — modular scale, ~1.2 ratio */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-body: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-heading-sm: 1.5rem;
  --font-size-heading-lg: 1.875rem;
  --line-height-body: 1.5;
  --line-height-heading: 1.2;

  /* Spacing — 4px base unit */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Radius — consistent with chosen direction's personality */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows — elevation scale, not per-component ad hoc values */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.10);
  --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.15);
}
```

Radius and shadow steps must reflect the personality chosen in Step 3
(e.g., a "sharp/technical" direction uses `--radius-sm` as its default;
a "soft/approachable" direction uses `--radius-lg`) — don't default to
generic values disconnected from the chosen direction.

### 9. Define Interactive & Validation States

Focus, hover, active, disabled, and error states must be token-driven —
defined once, consumed everywhere — never hardcoded per component.

```css
@theme {
  --color-ring: var(--color-primary);
  --state-hover-opacity: 0.9;
  --state-active-opacity: 0.8;
  --state-disabled-opacity: 0.5;
}
```

```css
.interactive {
  &:hover   { background-color: color-mix(in oklch, var(--color-primary) 90%, black); }
  &:active  { background-color: color-mix(in oklch, var(--color-primary) 80%, black); }
  &:disabled { opacity: var(--state-disabled-opacity); cursor: not-allowed; }
  &:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }
}
.field-error {
  border-color: var(--color-destructive);
  /* Never color alone — pair with icon/text per accessibility-a11y.md */
}
```

Per `core/accessibility-a11y.md`: a visible focus indicator is required
for keyboard users (`focus-visible`, not bare `focus`, to avoid a ring on
every mouse click); error state must never be color-only.

### 10. Integrate with Tailwind CSS v4 via `@theme`

Detect Tailwind version per `frontend/tailwind-css.md`. For v4, all
tokens from Steps 5–9 are declared inside a single `@theme` block in the
CSS entry point (no `tailwind.config.js` required):

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.58 0.19 250);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-destructive: oklch(0.55 0.22 25);
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.10);
  --font-size-heading-lg: 1.875rem;
}

.dark {
  --color-primary: oklch(0.70 0.16 250);
  --color-primary-foreground: oklch(0.16 0 0);
}
```

For a confirmed Tailwind v3 project, translate the same token set into
`tailwind.config.js`'s `theme.extend` per `tailwind-css.md`'s v3
standards — never mix both configuration mechanisms in one project.

### 11. Map to shadcn/ui CSS Variables

If `components.json` is detected (per `repo-analysis.md`), map semantic
tokens onto shadcn/ui's expected variable set so installed/generated
primitives pick up the theme automatically with zero component edits:

```css
:root {
  --background: var(--color-background);
  --foreground: var(--color-foreground);
  --card: var(--color-background);
  --card-foreground: var(--color-foreground);
  --popover: var(--color-background);
  --popover-foreground: var(--color-foreground);
  --primary: var(--color-primary);
  --primary-foreground: var(--color-primary-foreground);
  --secondary: var(--primitive-gray-100);
  --secondary-foreground: var(--color-foreground);
  --muted: var(--primitive-gray-100);
  --muted-foreground: var(--color-muted);
  --accent: var(--primitive-gray-100);
  --accent-foreground: var(--color-foreground);
  --destructive: var(--color-destructive);
  --destructive-foreground: oklch(0.98 0 0);
  --border: var(--color-border);
  --input: var(--color-border);
  --ring: var(--color-ring);
  --radius: var(--radius-md);
}
```

Do not rename shadcn's expected variable names — components generated
by the CLI reference these exact names (`shadcn-ui.md`).

### 12. Validate Accessible Contrast

For every semantic text/background pairing, in **both** light and dark
themes independently, verify against `core/accessibility-a11y.md`:
≥4.5:1 for normal text, ≥3:1 for large text/UI components. Do not assume
a pairing that passes in light mode automatically passes in dark mode.

Report contrast results explicitly:

| Pairing | Light Ratio | Dark Ratio | Pass? |
|---|---|---|---|
| foreground / background | 15.8:1 | 14.2:1 | ✅ |
| primary-foreground / primary | 5.1:1 | 4.9:1 | ✅ |
| muted-foreground / background | 4.6:1 | 4.5:1 | ✅ (borderline — flag) |

Flag any borderline (4.5–5:1) pairing explicitly rather than silently
passing it.

### 13. Implement Reduced-Motion Behaviour

Per `core/accessibility-a11y.md`, any transition/animation introduced by
this theme must be disabled or reduced for users who've set
`prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is a required output whenever the design system introduces any
hover/active transition, page transition, or decorative animation — not
an optional accessibility add-on.

### 14. Enforce No Hardcoded Component Colors

Audit every component touched or generated during this workflow: no
component may reference a raw color value (`oklch(...)`, hex, or a
primitive token) directly. Components consume semantic (or component-
level) tokens only.

```tsx
// Fails this workflow — hardcoded primitive bypassing the token layer
<Button className="bg-[oklch(0.58_0.19_250)]">Save</Button>

// Passes — semantic token
<Button className="bg-primary text-primary-foreground">Save</Button>
```

If an existing codebase has hardcoded colors, flag each occurrence as a
finding (this becomes an `audit`-mode handoff) rather than silently
leaving them alongside the new token system.

## Checklist

- [ ] Product/audience analysis stated before any palette decision
- [ ] Existing brand color(s) preserved/incorporated, or rebrand explicitly confirmed
- [ ] Three genuinely distinct directions presented (differ on ≥2 real axes, not just hue)
- [ ] Decision matrix presented; direction selected explicitly, not assumed
- [ ] Primitive tokens defined in OKLCH with a full shade scale
- [ ] Semantic token layer maps every primitive used to a named role
- [ ] Full light AND dark theme pairs produced and both verified
- [ ] Typography, spacing, radius, and shadow scales all defined and tied to the chosen direction's personality
- [ ] Focus, hover, active, disabled, and error states defined via tokens, not hardcoded
- [ ] All text/background pairings meet WCAG AA contrast in both themes; borderline cases flagged
- [ ] `prefers-reduced-motion` handled explicitly for any introduced animation
- [ ] No component hardcodes a raw color value — semantic tokens only, verified across touched components
- [ ] Tailwind integration matches the detected version (v4 `@theme` or v3 config) — never both
- [ ] shadcn/ui variable mapping produced using shadcn's exact expected variable names, if shadcn is detected

## Output Format

1. Product/audience analysis summary (Step 1–2), stated briefly.
2. Three-direction comparison + decision matrix (Steps 3–4) — do not skip to full implementation without this being presented first, unless the user has already specified a direction explicitly in their request.
3. Full token implementation for the selected direction: OKLCH primitives → semantic tokens → light/dark pairs → typography/spacing/radius/shadow → states (Steps 5–9).
4. Framework integration: Tailwind `@theme` (or v3 config) and shadcn variable mapping (Steps 10–11).
5. Contrast validation table (Step 12) and reduced-motion snippet (Step 13).
6. Any hardcoded-color findings from existing components (Step 14), handed off as `audit` findings if out of scope to fix here.

## Related References

- `references/frontend/design-system-theming.md`
- `references/frontend/tailwind-css.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`
- `references/core/repo-analysis.md`
- `templates/frontend/tailwind-theme-tokens.css.md`