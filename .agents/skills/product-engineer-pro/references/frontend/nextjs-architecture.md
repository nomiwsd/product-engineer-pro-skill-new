# Next.js Architecture

## Scope

Owns: routing model (App Router vs Pages Router), data-fetching/caching, rendering strategy, Server Actions, and framework-specific optimization APIs (`next/image`, `next/font`, `next/form`, metadata).

Defers to: `react-patterns.md` for component-level patterns applicable inside either router; `performance-web-vitals.md` for the metrics being optimized for; `seo-technical.md` for the SEO standards these APIs implement.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view next version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| Next.js 16.x | Current (Latest) | Turbopack dev bundler default, Instant Navigations, reduced memory footprint, enhanced caching controls |
| Next.js 15.x | Supported | Async Request APIs (`cookies()`, `headers()`, `params`, `searchParams` MUST be `await`ed); `fetch` requests & GET Route Handlers uncached by default; `unstable_after` API; `next/form` component; `next.config.ts` support; `@next/codemod` CLI |
| Next.js 13.x–14.x | Legacy App Router | App Router stable; `params`/`searchParams`/`cookies()` are synchronous objects; aggressive default caching for `fetch`, Route Handlers, and Router Cache |
| Next.js 12.x and Pages Router (any version) | Legacy Pages Router | No App Router — uses `pages/`, `getServerSideProps`/`getStaticProps`/`getStaticPaths` for data fetching, `next/head` for metadata, no React Server Components |

## Detection

Per `references/core/repo-analysis.md` Framework Detection Table:
- `app/` directory present → App Router branch.
- `pages/`-only directory → Pages Router branch.

Within App Router, check exact Next.js version in lockfile to determine sync vs async `params`/`cookies`/`headers` — this is a breaking change between Next.js 14 and 15+ that silently produces runtime errors if assumed wrong.

## Standards — App Router (Next.js 15+ / 16+)

### Server vs Client Components
- Default to Server Components; add `"use client"` only for components that need interactivity (event handlers, state, browser-only APIs, effects) — don't mark a component client-side "just in case."
- Push `"use client"` boundaries as far down the component tree (as close to leaf nodes) as possible.
- Server Components can be `async` and fetch data directly — don't introduce client-side `useEffect` fetching for data available at render time server-side.
- Pass only serializable props from Server to Client Components.

### Next.js 15+ & 16+ Async Request APIs
- In Next.js 15 and Next.js 16, `cookies()`, `headers()`, `draftMode()`, and route `params`/`searchParams` are asynchronous — **must `await` them**:
  ```tsx
  // Next.js 15+ / 16+ Page Component
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <h1>Item {id}</h1>;
  }
  ```
- In Next.js 13–14, `params`/`searchParams`/`cookies()` are synchronous objects. Do not use `await` on them in Next.js 14 projects.

### Data Fetching, Caching & `after()`
- **Next.js 15+ / 16+**: `fetch` is uncached by default — opt into caching explicitly (`{ cache: 'force-cache' }` or `next: { revalidate: 3600 }`) where genuinely desirable.
- **Next.js 13–14**: `fetch` is cached by default — be explicit about `{ cache: 'no-store' }` for dynamic data.
- Use `revalidatePath()` or `revalidateTag()` inside Server Actions to purge cached data on mutations.
- Use `after()` (or `unstable_after` in Next.js 15) to perform non-blocking background work (analytics logging, notification dispatches) after a response has finished streaming.

### Server Actions
- Mark Server Action files or functions with `"use server"`.
- Validate all incoming arguments using Zod schemas at the start of the action (`references/core/security-owasp.md`).
- Always check authorization server-side inside the action before mutating database state (`references/backend/auth-authz.md`).

### Rendering Strategy & Streaming
- Static rendering (default when no dynamic APIs are used) maximizes CDN caching and LCP.
- Streaming via `loading.tsx` or React `<Suspense>` boundaries renders instant shell UI while slower async server components stream in.

### Optimization APIs
- **`next/image`**: Use for content images; specify `width`/`height` or `fill` to eliminate Cumulative Layout Shift (CLS).
- **`next/font`**: Use `next/font/google` or `next/font/local` for self-hosted font loading with zero layout shift.
- **`next/form`**: Use `<Form action="/search">` for search forms to handle client-side navigation seamlessly.
- **Metadata API**: Export static `metadata` object or async `generateMetadata()` function in `layout.tsx`/`page.tsx` — do not use `next/head` in App Router.

## Standards — Pages Router (Legacy/Alternate)

- Use `getServerSideProps` for per-request dynamic data; `getStaticProps` + `getStaticPaths` for build-time/ISR content.
- Use `next/head` for per-page metadata — one `<Head>` per page.
- API Routes (`pages/api/*.ts`) follow standard `(req, res)` handler signatures — apply `references/backend/express-architecture.md` principles.

## Anti-Patterns

```tsx
// Marking a whole page client-side for one interactive element
"use client";
export default function Page({ data }) {
  return <div>{data.map(...)}<LikeButton /></div>;
}
// Better: keep Page as a Server Component, extract <LikeButton /> as its own "use client" leaf.

// Next.js 15/16: Accessing params synchronously without await
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>; // Runtime error in Next.js 15/16!
}

// Client-side fetch for data available server-side
"use client";
useEffect(() => { fetch('/api/posts').then(...); }, []);
// Better: fetch directly in an async Server Component.
```

## Related References

- `references/frontend/react-patterns.md`
- `references/core/performance-web-vitals.md`
- `references/core/seo-technical.md`
- `references/core/security-owasp.md`

## Applies To Modes

- `implement`
- `refactor`
- `performance`
- `seo`
- `review`