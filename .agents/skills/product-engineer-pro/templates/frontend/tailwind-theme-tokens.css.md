# Template: Tailwind Theme Tokens

Implements standards from `references/frontend/design-system-theming.md` and `references/frontend/tailwind-css.md`.

## When to Use

Configuring design system tokens. Check detected Tailwind version (`references/core/repo-analysis.md`): use Tailwind v4 CSS-first `@theme` block for v4 setups, or `tailwind.config.js` for v3 setups.

## Template — Tailwind v4 (CSS-First)

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: "Inter", "Geist", system-ui, sans-serif;
  --font-display: "Outfit", "Plus Jakarta Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Typography Scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  /* OKLCH Primitives */
  --color-brand-50: oklch(0.97 0.02 250);
  --color-brand-500: oklch(0.58 0.19 250);
  --color-brand-900: oklch(0.28 0.12 250);
  --color-neutral-50: oklch(0.98 0 0);
  --color-neutral-500: oklch(0.55 0 0);
  --color-neutral-950: oklch(0.14 0.01 250);

  /* Semantic Light Mode Tokens */
  --color-background: oklch(0.99 0 0);
  --color-foreground: oklch(0.18 0.01 250);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.18 0.01 250);
  --color-primary: var(--color-brand-500);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-muted: oklch(0.96 0 0);
  --color-muted-foreground: oklch(0.45 0 0);
  --color-border: oklch(0.90 0 0);
  --color-ring: var(--color-brand-500);

  /* Radius Scale */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Elevation Shadows */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.05);
  --shadow-glow: 0 0 20px -5px var(--color-primary);

  /* Transition Easing */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Keyframe Animations */
  --animate-fade-in: fadeIn 0.2s var(--ease-expo) forwards;
  --animate-scale-in: scaleIn 0.25s var(--ease-spring) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Dark Mode Overrides */
.dark {
  --color-background: oklch(0.14 0.01 250);
  --color-foreground: oklch(0.98 0 0);
  --color-card: oklch(0.18 0.01 250);
  --color-card-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.70 0.18 250);
  --color-primary-foreground: oklch(0.14 0.01 250);
  --color-muted: oklch(0.22 0.01 250);
  --color-muted-foreground: oklch(0.65 0 0);
  --color-border: oklch(1 0 0 / 0.12);
}

/* Glassmorphism Utility */
.glass {
  background: oklch(var(--color-background) / 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
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
        background: "oklch(var(--color-background) / <alpha-value>)",
        foreground: "oklch(var(--color-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--color-primary) / <alpha-value>)",
          foreground: "oklch(var(--color-primary-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--color-border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -5px var(--color-primary)",
      },
    },
  },
};
```

## Adaptation Notes

- Verify semantic token contrast ratios for light and dark themes independently (`references/core/accessibility-a11y.md`).
- Respect reduced motion (`prefers-reduced-motion: reduce`) by disabling keyframes.