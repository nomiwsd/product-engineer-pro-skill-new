# Tailwind CSS

## Scope

Owns: utility-class conventions, configuration approach, and responsive/state-variant usage for Tailwind CSS itself (including Tailwind v4.0–v4.3+).

Defers to: `shadcn-ui.md` for how Tailwind utilities compose with Radix-based component primitives; `design-system-theming.md` for the token *decisions* (palette, scale) that Tailwind config/CSS variables implement.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view tailwindcss version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| Tailwind v4.x (v4.0–v4.3+) | Current (Latest) | CSS-first configuration via `@theme` in CSS (no `tailwind.config.js` required); `@import "tailwindcss";` replaces `@tailwind` directives; Rust-based Oxide engine; automatic template content detection; native CSS cascade layers & container queries; `text-shadow-*`, `mask-*`, and scrollbar utilities |
| Tailwind v3.x | Supported | JS/TS-based `tailwind.config.js` with `theme.extend`; `@tailwind base/components/utilities` directives required; explicit `content` array required for purging; container queries require `@tailwindcss/container-queries` plugin |
| Tailwind v2.x and earlier | Legacy | No JIT engine by default, significantly different default color palette and utility set — flag as outdated |

## Detection

Per `references/core/repo-analysis.md` Framework Detection Table:
- **v3**: `tailwind.config.{js,ts,cjs}` present + `@tailwind base;` in CSS entry.
- **v4**: `@import "tailwindcss";` in CSS entry with no required JS config file.

Always confirm via the actual CSS entry file, not just presence/absence of a config file (a v4 project may still have a minimal config file for plugin registration).

## Standards — v4 (Current)

### Configuration & Oxide Engine
- Define design tokens in CSS via `@theme` in the main stylesheet rather than a JS config object:
  ```css
  @import "tailwindcss";

  @theme {
    --color-brand: oklch(0.6 0.2 250);
    --font-display: "Inter", sans-serif;
    --spacing-18: 4.5rem;
  }
  ```
- Custom utility values defined this way are automatically available as classes (`bg-brand`, `font-display`, `p-18`) — no separate `extend` step needed.
- Content detection is automatic in most setups — only add explicit `@source` directives for content in locations outside the automatic scan (e.g., a monorepo package outside the app's root).
- Use CSS cascade layers (`@layer`) consistently with Tailwind's own layer structure.
- Utilize v4.1+ utilities natively: `text-shadow-*`, `mask-*`, and native scrollbar utilities (`scrollbar-width`, `scrollbar-color`).

### Migration Awareness
- If a codebase mixes `tailwind.config.js` `theme.extend` with a v4 install, flag this as an incomplete migration — v4 prioritizes `@theme` in CSS, and leftover JS config can cause confusing dual sources of truth.

## Standards — v3 (Supported)

### Configuration
- Define custom tokens in `tailwind.config.js`'s `theme.extend`, never by overwriting `theme` wholesale unless intentionally replacing all defaults:
  ```js
  module.exports = {
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
      extend: {
        colors: { brand: 'oklch(0.6 0.2 250)' },
        spacing: { 18: '4.5rem' },
      },
    },
  };
  ```
- Keep the `content` array accurate and specific — an overly broad glob slows build scanning; a too-narrow glob silently drops used classes from the production build.
- Container queries require the official `@tailwindcss/container-queries` plugin in v3.

## Standards — Both Versions

### Utility-First Discipline
- Compose utilities directly in markup as the default approach; extract to a component (React/shadcn) when a pattern repeats across multiple places — don't reach for `@apply` as the default extraction mechanism when component extraction is more idiomatic.
- `@apply` is acceptable for small, genuinely global primitives (e.g., `.btn-reset`) — not as a general escape hatch to write traditional CSS with Tailwind class names.

### Responsive Design
- **Mobile-first**: unprefixed utilities apply to the smallest breakpoint; add `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes to override upward — never design desktop-first with `max-*` variants as the primary pattern.
- Use container queries (`@container`, `@sm:`, `@container-size`) for components whose layout should respond to their container's size rather than the viewport.

### State Variants & Dark Mode
- Use built-in state variants (`hover:`, `focus:`, `focus-visible:`, `disabled:`, `aria-*:`, `data-*:`).
- Use `focus-visible:` (not bare `focus:`) for focus rings intended only for keyboard users.
- Dark mode via the `dark:` variant, driven by a class or data-attribute strategy consistent with the project's existing theming mechanism.

### Class Organization
- Keep conditional class logic readable — use `cn()`, `clsx`, or `tailwind-merge` for conditional/merged class strings rather than manual string concatenation or inline ternaries.

## Anti-Patterns

```html
<!-- Desktop-first with max-* as the primary strategy -->
<div class="max-lg:hidden lg:block">...</div>
<!-- Prefer mobile-first: <div class="hidden lg:block">...</div> -->

<!-- @apply used as a general CSS escape hatch -->
<style>
.card { @apply flex flex-col p-4 rounded-lg shadow-md bg-white text-gray-900 border; }
</style>
```

```js
// v3 content array too broad
module.exports = { content: ['./**/*'] }; // too broad
```

## Related References

- `references/frontend/shadcn-ui.md`
- `references/frontend/design-system-theming.md`
- `references/core/accessibility-a11y.md`

## Applies To Modes

- `design-system`
- `implement`
- `refactor`
- `review`