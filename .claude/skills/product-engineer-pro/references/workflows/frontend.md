# Workflow: Frontend Principal Agent

## Goal

Execute specialized frontend engineering tasks — Next.js 16 App Router, React 19 state management, Tailwind CSS v4 design tokens, shadcn/ui component composition, WCAG 2.2 AA accessibility, and Core Web Vitals optimization.

## Process

1. Run `references/core/repo-analysis.md` to detect Next.js version (App Router vs Pages Router), React version, Tailwind version (v3 vs v4), and component library setup.
2. Structure component architecture:
   - Separate Server Components (RSC, data fetching) from Client Components (`"use client"`, state, interactivity).
   - Apply React 19 hooks (`use`, `useActionState`, `useFormStatus`, `useOptimistic`) where applicable.
3. Apply styling & design system:
   - Load `references/frontend/design-system-theming.md` and `references/frontend/tailwind-css.md`.
   - Enforce OKLCH semantic CSS tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-primary`). Zero hardcoded hex colors.
4. Verify accessibility & performance:
   - Load `references/core/accessibility-a11y.md` for WCAG 2.2 AA (4.5:1 contrast, keyboard tab order, ARIA attributes).
   - Load `references/core/performance-web-vitals.md` for zero CLS layout dimensions, LCP optimization, and dynamic import code splitting.

## Checklist

- [ ] Next.js 15+ dynamic parameters and cookies use `await` where applicable.
- [ ] React Server Components and Client Components correctly separated.
- [ ] Zero hardcoded hex color values used — 100% semantic CSS variables (matching repo conventions).
- [ ] Keyboard focus ring (`focus-visible:ring-2`) and ARIA labels present on all interactive elements.
- [ ] Reduced motion fallbacks (`prefers-reduced-motion`) implemented for all Framer Motion / CSS animations.
- [ ] Layout dimensions explicitly specified to prevent CLS layout shifts.
- [ ] Empirical verification commands (`npx tsc --noEmit`, linters, or build scripts) executed with clean output before declaring completion.

## Output Format

1. Executive summary of frontend architecture changes.
2. Surgical diff showing component modifications or newly created UI files.
3. Verification results: Mandatorily execute terminal tool verification (`npx tsc --noEmit` or `npm run build`) and cite exact command output, A11y contrast rating, and Web Vitals impact. Never declare success without runtime execution evidence.

## Related References

- `references/core/repo-analysis.md`
- `references/frontend/nextjs-architecture.md`
- `references/frontend/react-patterns.md`
- `references/frontend/tailwind-css.md`
- `references/frontend/design-system-theming.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`
- `references/core/performance-web-vitals.md`
