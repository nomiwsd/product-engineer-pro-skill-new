# Performance & Core Web Vitals

## Scope

Owns: framework-agnostic performance budgets, Core Web Vitals
definitions, and generic profiling methodology.

Defers to: `nextjs-architecture.md` for Next.js-specific implementation
(image/font optimization APIs, caching, streaming); `postgresql-design.md`
/`mongodb-design.md` for query-level performance; `seo-technical.md` for
where Web Vitals intersect with search ranking (link only, not repeated).

## Core Web Vitals — Definitions & Budgets

| Metric | Measures | Good | Needs Improvement | Poor |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Loading — time to render the largest visible element | ≤ 2.5s | 2.5s–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Responsiveness — delay from interaction to visual update | ≤ 200ms | 200ms–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability — unexpected layout movement | ≤ 0.1 | 0.1–0.25 | > 0.25 |

Treat "Good" as the budget for production work in this skill unless the
project states a different target.

## Supporting Metrics (diagnostic, not ranking factors)

- **TTFB** (Time to First Byte) — server/edge response speed; target
  ≤ 800ms.
- **FCP** (First Contentful Paint) — target ≤ 1.8s.
- **Total Blocking Time (TBT)** — lab proxy for INP.

## LCP — Common Causes & Fixes (framework-agnostic)

- Unoptimized/oversized hero images → serve responsive, compressed,
  correctly-sized images (framework-specific mechanism in stack files).
- Render-blocking CSS/JS in `<head>` → defer non-critical JS, inline
  only critical CSS.
- Slow server response for the initial document → address at
  infrastructure/caching layer, not just client-side.
- Web fonts blocking text render → use `font-display: swap` or
  equivalent, preload critical fonts.

## INP — Common Causes & Fixes

- Long JavaScript tasks blocking the main thread on interaction → break
  up long tasks, defer non-essential work off the interaction path.
- Excessive re-renders on state updates in component-based UIs → see
  `react-patterns.md` for memoization/state-scoping guidance.
- Heavy synchronous work in event handlers (large JSON parsing, sync
  layout reads) → move off the critical interaction path or debounce.

## CLS — Common Causes & Fixes

- Images/embeds without reserved dimensions → always set explicit
  width/height or aspect-ratio before the asset loads.
- Web fonts causing a visible reflow (FOIT/FOUT) → size fallback fonts
  to closely match the final font's metrics.
- Content injected above existing content (banners, ads, cookie
  notices) without reserved space → reserve layout space up front.
- Actionable elements shifting position right before a likely interaction.

## Bundle Performance

- Treat JS bundle size as a budget, not an afterthought: flag any single
  new dependency that meaningfully increases the shipped bundle for
  marginal functionality (a date library added for one format call, an
  icon library imported in full instead of tree-shaken).
- Code-split by route/feature by default in any framework that supports
  it — don't ship the entire application in a single bundle.
- Load third-party scripts (analytics, chat widgets) asynchronously and
  as late as reasonably possible; never render-blocking.
- Prefer native platform APIs over a library when the native API already
  covers the need (e.g., native `fetch` over an HTTP client for simple
  cases, `Intl` over a formatting library where sufficient).

## Caching Strategy (conceptual tiers — implementation is stack-specific)

1. **CDN/edge cache** for static assets and cacheable pages.
2. **Application/data cache** for expensive computed or fetched data
   (see stack file for the framework's cache primitives).
3. **Browser cache** via correct `Cache-Control` headers on static assets.

## Profiling Methodology (generic)

1. Measure in a production-equivalent build, not dev mode (dev builds
   are unoptimized and misrepresent real performance).
2. Use field data (Real User Monitoring / CrUX) as ground truth; use lab
   tools (Lighthouse, WebPageTest) for diagnosis and before/after
   comparison, not as the final verdict.
3. Change one variable at a time when diagnosing a regression.
4. Always report the specific metric and number moved, not "faster now."

## Anti-Patterns

```tsx
// No reserved dimensions — causes CLS
<img src="/hero.jpg" />

// Importing an entire icon library for one icon
import * as Icons from 'some-icon-library';

// Blocking the main thread synchronously on interaction
button.onclick = () => { const data = JSON.parse(hugeString); render(data); };