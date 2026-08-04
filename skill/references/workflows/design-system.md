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

For the selected direction, define primitive color tokens using `oklch()`. OKLCH is required (not hex/HSL) because its lightness channel is perceptually uniform. Generate a full 50–950 step scale per hue used.

### 6. Derive Semantic Tokens

Map primitives to meaning-based roles (`--color-primary`, `--color-background`, `--color-destructive`, etc.). Components must reference these semantic tokens, never primitives directly (per `frontend/design-system-theming.md`).

### 7. Produce Light AND Dark Theme Pairs

Both light and dark theme pairs are required outputs. Redefine semantic tokens for dark mode context and verify contrast independently per theme.

### 8. Define Typography, Spacing, Radius, and Shadow Scales

Define modular typography scales, 4px/8px grid spacing, personality-matched radius steps, and elevation shadows. Consult `templates/frontend/tailwind-theme-tokens.css.md` for complete token scaffolds.

### 9. Define Interactive & Validation States

Token-drive focus (`focus-visible`), hover, active, disabled (`opacity: 0.5`), and validation error states. Never use color alone to convey error states per `core/accessibility-a11y.md`.

### 10. Integrate with Tailwind CSS (v4 `@theme` or v3 config)

Detect Tailwind version per `frontend/tailwind-css.md`. For v4, declare tokens inside `@theme` in the CSS entry point. For v3, extend `tailwind.config.js`.

### 11. Map to shadcn/ui CSS Variables

If `components.json` is detected (per `core/repo-analysis.md`), map semantic tokens onto shadcn/ui's expected CSS variables (`--background`, `--foreground`, `--primary`, `--radius`, etc.).

### 12. Validate Accessible Contrast

Verify text/background contrast pairings in **both** light and dark themes against `core/accessibility-a11y.md` (≥4.5:1 normal, ≥3:1 large). Report contrast results explicitly:

| Pairing | Light Ratio | Dark Ratio | Pass? |
|---|---|---|---|
| foreground / background | 15.8:1 | 14.2:1 | ✅ |
| primary-foreground / primary | 5.1:1 | 4.9:1 | ✅ |
| muted-foreground / background | 4.6:1 | 4.5:1 | ✅ (borderline — flag) |

### 13. Implement Reduced-Motion Behaviour

Per `core/accessibility-a11y.md`, disable or reduce non-essential transitions for users with `prefers-reduced-motion: reduce`.

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