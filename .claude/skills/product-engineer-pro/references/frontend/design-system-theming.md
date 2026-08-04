# Design System & Advanced UI/UX Theming

## Scope

Owns: token architecture decisions, visual aesthetics, color palette selection (OKLCH), typography scale & pairings, 4px/8px grid spacing, micro-animations, glassmorphism, depth/elevation, and accessibility standards — independent of framework syntax.

Defers to: `tailwind-css.md` for Tailwind v3/v4 syntax; `shadcn-ui.md` for component composition; `accessibility-a11y.md` for WCAG AA contrast rules.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view <package> version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

Not framework-version-dependent — this file governs decisions, not syntax. Cross-reference `tailwind-css.md`'s Version Matrix only when implementing the tokens decided here.

## Detection

Per `references/core/repo-analysis.md`: check for an existing token source (CSS custom properties in a global stylesheet, a `theme` object, `components.json` base color, a design-tokens JSON file). If one exists, extend it — do not introduce a second, competing token source.

## Standards

### Visual Excellence & Depth
- **Avoid Generic/Default Colors**: Use curated, harmonious OKLCH color palettes with perceptually uniform lightness steps. Avoid flat browser defaults.
- **Layered Elevation & Depth**: Use multi-layered dark mode surfaces (`surface-0` background, `surface-1` cards, `surface-2` popovers/modals) with subtle, semi-transparent borders (`border/10` or `border/15`).
- **Glassmorphism & Backdrop Blur**: Use glass effects (`backdrop-blur-md bg-background/80 border border-white/10`) for headers, sticky bars, floating cards, and overlays.
- **Glow & Gradient Accents**: Accent primary elements with subtle radial glows (`bg-gradient-to-r from-primary/20 via-accent/20 to-transparent`) and linear borders.

### Token Architecture (Three Layers)

1. **Primitive tokens** — raw OKLCH values with no semantic context (`--blue-500: oklch(0.6 0.2 250)`, `--space-4: 1rem`).
2. **Semantic tokens** — meaning-based aliases mapping primitives to roles (`--color-primary`, `--color-background`, `--color-destructive`). Components consume semantic tokens only.
3. **Component tokens** (optional) — specific aliases for multi-variant components (`--button-primary-bg`).

## Typography Scale & Font Pairings

### Recommended Font Stacks
- **Modern Sans / UI**: `Inter`, `Geist`, `Plus Jakarta Sans`, `Outfit`, `Roboto`.
- **Display / Headings**: `Outfit`, `Plus Jakarta Sans`, `Cal Sans`.
- **Monospace / Code**: `JetBrains Mono`, `Fira Code`, `Geist Mono`.

### Modular Type Scale (1.25 Major Third Ratio)

| Role | Size | Line Height | Letter Spacing | Font Weight |
|---|---|---|---|---|
| `text-xs` | 0.75rem (12px) | 1.0rem (16px) | +0.01em | 500 (Medium) |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | 0 | 400 (Regular) / 500 |
| `text-base` (Body) | 1.0rem (16px) | 1.5rem (24px) | -0.011em | 400 (Regular) |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | -0.014em | 500 (Medium) |
| `text-xl` (H4) | 1.25rem (20px) | 1.75rem (28px) | -0.017em | 600 (SemiBold) |
| `text-2xl` (H3) | 1.5rem (24px) | 2.0rem (32px) | -0.021em | 600 (SemiBold) |
| `text-3xl` (H2) | 1.875rem (30px) | 2.25rem (36px) | -0.022em | 700 (Bold) |
| `text-4xl` (H1) | 2.25rem (36px) | 2.5rem (40px) | -0.025em | 800 (ExtraBold) |
| `text-5xl` (Display) | 3.0rem (48px) | 1.16 | -0.03em | 800 (ExtraBold) |

- Use `clamp()` for fluid responsive titles: `font-size: clamp(2rem, 5vw + 1rem, 4rem);`.

## 4px / 8px Grid Spacing System

- Base grid unit: **4px** (`0.25rem`). All spacing, margins, padding, and gaps are strict multiples:
  - `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px), `space-12` (48px), `space-16` (64px), `space-24` (96px).
- Never use arbitrary one-off pixel paddings (`padding: 13px 27px`) — stick to the grid to preserve visual rhythm.

## Micro-Animations & Motion Physics

### Transition Timing & Easing Curves
- **Default Interaction**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for responsive, natural feel.
- **Spring Physics (Modals/Popovers)**: `transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Duration**: `150ms` for micro-interactions (buttons, links), `250ms–300ms` for modals/drawers, `500ms` for page transitions.

### Core Keyframe Patterns
- **Fade & Scale In**: `opacity: 0 -> 1`, `scale: 0.95 -> 1`.
- **Slide Up**: `transform: translateY(8px) -> translateY(0)`.
- **Pulse Glow**: Subtle breathing glow for active status badges or CTAs.

### Interactive Micro-Interactions
- **Buttons**: `hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all duration-150`.
- **Cards**: `hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`.
- **Focus Rings**: Mandatory `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### Motion Accessibility
- Always wrap animations with `@media (prefers-reduced-motion: reduce)` to disable layout shifts for sensitive users.

## Dark Mode Strategy & Elevation Layers

- Redefine semantic tokens for dark theme explicitly — dark mode is not inverted lightness.
- Elevation surfaces in dark mode:
  - `background`: `oklch(0.14 0.01 250)` (deep charcoal/midnight, never plain black `#000000` unless OLED mode).
  - `card` / `surface-1`: `oklch(0.18 0.01 250)` with `border-white/10`.
  - `popover` / `surface-2`: `oklch(0.22 0.01 250)` with `shadow-xl`.

## Anti-Patterns

```css
/* Hardcoded hex color bypassing semantic token layer */
.card { background-color: #3b82f6; }

/* One-off arbitrary padding breaking the 4px grid */
.header { padding: 13px 29px; }

/* Removing focus rings without keyboard alternative */
button:focus { outline: none; }

/* Abrupt linear transition with no easing curve */
.button { transition: all 0.5s linear; }
```

## Related References

- `references/frontend/tailwind-css.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`
- `templates/frontend/tailwind-theme-tokens.css.md`

## Applies To Modes

- `design-system`
- `implement`
- `audit`
- `review`