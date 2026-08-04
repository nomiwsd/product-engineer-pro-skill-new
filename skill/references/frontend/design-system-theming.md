# Design System & Theming

## Scope

Owns: token architecture decisions — color palette selection, typography scale, spacing scale, and dark-mode strategy — independent of the CSS implementation mechanism.

Defers to: `tailwind-css.md` for how tokens are implemented in Tailwind config/CSS; `shadcn-ui.md` for how components consume theme tokens; `accessibility-a11y.md` for contrast requirements tokens must satisfy.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view <package> version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

Not framework-version-dependent — this file governs decisions, not syntax. Cross-reference `tailwind-css.md`'s Version Matrix only when implementing the tokens decided here.

## Detection

Per `references/core/repo-analysis.md`: check for an existing token source (CSS custom properties in a global stylesheet, a `theme` object, `components.json` base color, a design-tokens JSON file). If one exists, extend it — do not introduce a second, competing token source.

## Standards

### Token Architecture (Three Layers)

1. **Primitive tokens** — raw values with no semantic meaning (`--blue-500: oklch(...)`, `--space-4: 1rem`). Rarely referenced directly in components.
2. **Semantic tokens** — meaning-based aliases mapping to primitives (`--color-primary: var(--blue-500)`, `--color-destructive: var(--red-600)`). Components reference these, not primitives directly.
3. **Component tokens** (optional, for larger systems) — component-specific aliases mapping to semantic tokens (`--button-bg: var(--color-primary)`). Use only when a component's theming needs genuinely diverge from the general semantic token, to avoid unnecessary indirection.

Components should reference semantic (or component) tokens, never primitives directly — this is what makes theme switching (including dark mode) a single-point change instead of a find-and-replace across the codebase.

### Color Palette Selection

- Choose a color space that interpolates predictably for generating shades/tints — `oklch()` or `hsl()` produce more perceptually consistent scales than raw hex when generating a 50–950 shade range.
- Define at minimum: a primary/brand color, a neutral/gray scale (for text, borders, backgrounds), and semantic status colors (success, warning, destructive/error, info).
- Every text-on-background color pairing in the palette must meet `references/core/accessibility-a11y.md` contrast minimums (4.5:1 normal text, 3:1 large text) — verify this at the token level, not per-component, so every consumer of the token is automatically compliant.
- Don't rely on color alone to distinguish semantic states in components built from these tokens (ties to `accessibility-a11y.md`) — pair status colors with icons/text in actual usage.

### Typography Scale

- Use a modular scale (e.g., a consistent ratio like 1.125–1.25 between steps) rather than arbitrary font sizes chosen ad hoc per component.
- Define scale steps semantically where practical (`--text-body`, `--text-heading-lg`) alongside or instead of purely numeric steps, so intent is clear at the point of use.
- Line-height and letter-spacing are part of the type scale, not independent per-use decisions — pair each size step with an appropriate line-height.

### Spacing Scale

- Use a consistent base unit (commonly 4px or 8px) and derive all spacing values as multiples of it — avoid one-off pixel values that don't fit the scale, which fragment visual rhythm over time.
- Reuse the same spacing scale for padding, margin, and gap consistently — don't maintain a separate scale for each.

### Dark Mode Strategy

- Prefer semantic tokens that are redefined per theme (light/dark) rather than components branching their own logic on a theme flag — a well-built token layer means components need zero dark-mode-specific code.
- Choose one activation mechanism (class-based `.dark`, `data-theme` attribute, or `prefers-color-scheme` media query) consistent with what's already established in the project — don't mix strategies.
- Dark mode is not simply inverted lightness on the same hues — verify contrast ratios independently for the dark palette; a pairing that passes in light mode doesn't automatically pass in dark mode.
- Test both themes against `accessibility-a11y.md` contrast standards independently, not just the default theme.

### Elevation & Radius (if applicable)

- Define a small, fixed set of elevation levels (shadow tokens) and border-radius steps rather than ad hoc shadow/radius values per component — consistency here is a strong visual-cohesion signal.

## Anti-Patterns

```css
/* Component referencing a primitive directly, bypassing semantic layer */
.card { background: var(--blue-500); }
/* Better: background: var(--color-primary); so theme changes propagate */

/* One-off spacing value outside the defined scale */
.header { padding: 13px 27px; }

/* Dark mode as inverted lightness with no independent contrast check */
:root { --color-text-dark: invert(var(--color-text-light)); }
```

## Related References

- `references/frontend/tailwind-css.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`

## Applies To Modes

- `design-system`
- `implement`
- `audit`
- `review`