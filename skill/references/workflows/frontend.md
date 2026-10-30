# Workflow: Frontend

## Goal

Build, plan, or review React and Next.js interfaces that match the repository's installed
versions, rendering model, styling system, and component library — with every state handled,
accessible to keyboard and assistive technology, secure at the client boundary, and verified.

## Detect first

- Framework and router: Next.js App Router (`app/`) vs Pages Router (`pages/`), or another React
  setup. Read installed React, Next.js, TypeScript, and Tailwind versions from the lockfile (V1).
- Component library (`components.json` for shadcn/ui), token source, theme mechanism, data
  fetching and caching approach, form library, test runner, and i18n setup.
- The convention already used for similar components; match it (D2).

## Lifecycle behavior

- `plan`: components and files to add or change, server/client split, states, data flow, and
  the exact checks the builder should run. No edits (L1).
- `build`: implement the smallest coherent change, then run the available checks.
- `review`: findings on boundaries, states, accessibility, security, and performance with
  `file:line` evidence. No edits.

## Process

1. Run `references/core/repo-analysis.md`; state the detected versions (V2).
2. Decide the server/client split per `references/frontend/nextjs-architecture.md`: keep data
   fetching and secrets in server code where the framework supports it, and put `"use client"`
   on the smallest interactive component, not on whole pages.
3. Design every data-driven view with explicit loading, empty, error (with a recovery action),
   and success states; use the framework's loading and error boundaries where available.
4. Build forms with labelled inputs, client validation for feedback, and server validation as
   the authority. Link field errors to inputs, prevent duplicate submits, and keep user input
   on failure (`references/frontend/react-patterns.md`).
5. Style with the repository's semantic tokens (`references/frontend/design-system-theming.md`,
   `references/frontend/tailwind-css.md`); raw values belong only in the token source.
6. Apply `references/core/accessibility-a11y.md` (WCAG 2.2 AA) and
   `references/core/performance-web-vitals.md` (reserve media space, optimize LCP assets, split
   heavy client-only code, avoid request waterfalls).
7. Type props and parse external data at the boundary (`references/frontend/typescript-standards.md`).
8. Test behavior by role and accessible name with the repository's runner
   (`references/core/testing-strategy.md`).

## Version gates

| Detected | Then |
|---|---|
| Next.js 13–14 App Router | `params`, `searchParams`, `cookies()`, and `headers()` are synchronous: `cookies().get("region")` — never `await cookies()` or `await params` |
| Next.js 15+ | The same APIs are async; await them: `(await cookies()).get("region")`, `const { id } = await params` |
| Pages Router (any version) | `getServerSideProps`/`getStaticProps` and `next/head`; no Server Components |
| React 19+ | `use`, `useActionState`, `useFormStatus`, `useOptimistic`, and `ref` as a prop are available |
| React 18 | Use `forwardRef` and `useTransition`; React 19 hooks are unavailable |
| Tailwind 4+ | Configure tokens with CSS-first `@theme` |
| Tailwind 3 | Configure tokens in `tailwind.config.*` with `theme.extend` |

## Best-practice checklist

- [ ] Server/client boundary matches the detected router; `"use client"` is as low as possible.
- [ ] Loading, empty, error, and success states exist for each data-driven view.
- [ ] Forms validate on the server, show linked field errors, and keep input on failure.
- [ ] New styling uses semantic tokens; no raw colors in component markup.
- [ ] Every control has an accessible name, works by keyboard, and shows visible focus; targets
      are at least 24×24 CSS px; focus moves sensibly on route and dialog changes.
- [ ] Motion respects `prefers-reduced-motion`; layout space is reserved to prevent shifts.
- [ ] No secrets in client code (`NEXT_PUBLIC_`/`VITE_` values are public); no
      `dangerouslySetInnerHTML` with unsanitized input; redirect targets are validated.
- [ ] No `any` or unchecked casts on external data.
- [ ] Tests query by role and name and cover the states that changed.

## Evidence required

Type check, lint, and focused tests; a build when routing or config changed; an automated
accessibility check when the repository has one. Report each as passed, failed, or not run
(E2). Never predict Web Vitals numbers (E3).

## Stop conditions

Stop and report if the change needs a router, styling-system, or state-library migration, a
new dependency, or product decisions on copy or behavior that the request does not settle (D6).

## Never

- Hardcode a framework version in output or apply an API the installed version lacks (V4).
- Convert the router, styling system, or state library as a side effect (ED4).
- Remove focus outlines without a visible replacement.

## Output

`build`: changed components first, then the verification ledger and residual risks. `plan`:
file-level plan with states and checks. `review`: findings by severity with locations.

## References

- `references/core/operating-rules.md`
- `references/core/repo-analysis.md`
- `references/frontend/nextjs-architecture.md`
- `references/frontend/react-patterns.md`
- `references/frontend/typescript-standards.md`
- `references/frontend/tailwind-css.md`
- `references/frontend/design-system-theming.md`
- `references/frontend/shadcn-ui.md`
- `references/core/accessibility-a11y.md`
- `references/core/performance-web-vitals.md`
- `references/core/testing-strategy.md`
