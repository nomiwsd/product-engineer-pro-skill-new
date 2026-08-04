# Technical SEO

## Scope

Owns: framework-agnostic technical SEO standards — crawlability,
metadata, structured data, and indexing hygiene.

Defers to: `performance-web-vitals.md` for Core Web Vitals thresholds
(a ranking factor, not restated here); `nextjs-architecture.md` for
framework-specific metadata/sitemap APIs.

## Crawlability & Indexing

- Every publicly indexable page returns a real HTTP 200 with meaningful
  server-rendered or pre-rendered content — pages that require
  client-side JS to reveal primary content are a crawlability risk
  unless the crawler in question is confirmed to execute JS reliably for
  the target audience.
- `robots.txt` explicitly allows crawling of indexable content and
  disallows admin/internal/duplicate-generating paths (search/filter
  query strings, staging routes).
- One canonical URL per piece of content, declared via `<link rel="canonical">`
  — critical for paginated, filtered, or parameter-driven URLs
  that can generate near-duplicate content.
- `sitemap.xml` lists indexable URLs, kept in sync with actual published
  content, and referenced from `robots.txt`.
- Avoid soft-404s: a "not found" page must return an actual 404 status,
  not a 200 with "not found" text.

## Metadata

- Every page has a unique, descriptive `<title>` (~50–60 characters
  effective display) and meta description (~150–160 characters) —
  never duplicate titles across distinct pages.
- Use a single `<h1>` per page representing the primary topic; heading
  hierarchy below it is logical and unbroken (ties to
  `accessibility-a11y.md` heading rules — same standard serves both).
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) and
  Twitter Card tags present on shareable pages for correct link previews.

## Structured Data

- Use JSON-LD (not microdata/RDFa) as the default structured-data format
  for new implementation.
- Match schema.org types to actual visible page content — never mark up
  content that isn't genuinely present/visible (violates structured
  data guidelines and risks manual action).
- Common types to apply where relevant: `Article`, `Product`,
  `BreadcrumbList`, `Organization`, `FAQPage` (only if genuinely a
  visible FAQ), `LocalBusiness`.
- Validate structured data against the official schema before shipping —
  don't guess field names.

## URL Structure

- Human-readable, hyphen-separated, lowercase URLs reflecting content
  hierarchy — avoid query-string-only identifiers for primary content
  (`/products/blue-widget`, not `/p?id=1234`, when feasible).
- Stable URLs — avoid changing a published URL without a 301 redirect
  from the old path.
- Avoid duplicate content reachable via multiple URLs (trailing slash
  inconsistency, `www` vs non-`www`, `http` vs `https`) — pick one
  canonical form and redirect the rest.

## Mobile & Rendering

- Design mobile-first / ensure full parity of content between mobile and
  desktop rendering — no content hidden from mobile crawl (historically
  a ranking risk under mobile-first indexing).
- Viewport meta tag present and correct (`width=device-width,
  initial-scale=1`).

## Internationalization (if applicable)

- `hreflang` tags correctly pair language/region variants of the same
  content, including a self-referential tag on each variant.
- Language declared via `<html lang="...">`.

## Redirects & Link Hygiene

- Use 301 (permanent) redirects for permanently moved content, 302 only
  for genuinely temporary redirects.
- Avoid redirect chains (A→B→C) — redirect directly to the final
  destination.
- Internal links use the canonical form of the target URL, not a URL
  that will itself redirect.

## Anti-Patterns

- Blocking CSS/JS assets in `robots.txt` that are required to render
  the page's primary content (prevents proper rendering during indexing).
- Multiple `<h1>` tags per page, or heading levels chosen for font size
  rather than structure.
- Client-only rendering of primary content with no server-rendered
  fallback for an SEO-critical page.
- Structured data describing content that isn't actually visible/present
  on the page.

## Related References

- `references/core/performance-web-vitals.md`
- `references/frontend/nextjs-architecture.md`
- `references/core/accessibility-a11y.md` (heading hierarchy overlap)

## Applies To Modes

`seo`, `audit`, `implement`, `review`.