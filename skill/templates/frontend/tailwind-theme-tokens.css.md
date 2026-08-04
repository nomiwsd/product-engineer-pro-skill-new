# Template: Tailwind Theme Tokens

Implements standards from `references/frontend/design-system-theming.md` and `references/frontend/tailwind-css.md`.

## When to Use

Configuring design system tokens. Check detected Tailwind version (`references/core/repo-analysis.md`): use Tailwind v4 CSS-first `@theme` block for v4 setups, or `tailwind.config.js` for v3 setups.

## Template — Tailwind v4 (CSS-First)

```css
@import "tailwindcss";

@theme {
  /* Primitive tokens */
  --color-blue-500: oklch(0.6 0.2 250);
  --color-red-600: oklch(0.55 0.22 25);

  /* Semantic tokens — components reference these */
  --color-primary: var(--color-blue-500);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-destructive: var(--color-red-600);

  /* Spacing grid (4px base unit) */
  --spacing-18: 4.5rem;

  /* Typography scale */
  --font-size-body: 1rem;
  --font-size-heading-lg: 1.75rem;
}

.dark {
  --color-primary: oklch(0.7 0.18 250);
  --color-primary-foreground: oklch(0.15 0 0);
}
```

## Template — Tailwind v3 (Config-Based)

```js
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "oklch(0.6 0.2 250)",
        "primary-foreground": "oklch(0.98 0 0)",
        destructive: "oklch(0.55 0.22 25)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
};
```

## Adaptation Notes

- Verify semantic token contrast ratios for light and dark themes independently (`references/core/accessibility-a11y.md`).
- Do not mix v3 and v4 configuration syntaxes in the same project.