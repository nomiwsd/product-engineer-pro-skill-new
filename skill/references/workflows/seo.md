# Workflow: SEO

## Goal

Make genuinely public pages crawlable, uniquely described, and correctly structured — fixing
indexing blockers before polish — using the metadata APIs of the detected framework version.

## Detect first

- Router and metadata API (Next.js App Router Metadata API vs Pages Router `next/head`),
  rendering mode (static, server, or client), existing `robots.txt` and sitemap.
- Which routes are public and meant to be indexed; authenticated and internal routes are out
  of scope.
- Whether the site is multilingual.

## Lifecycle behavior

- `plan`: defects by priority, metadata and structured-data changes, and checks. No edits (L1).
- `build`: implement framework-specific metadata, sitemap, and robots changes.
- `review`: SEO findings with locations and the rule applied. No edits.

## Process

1. Run `references/core/repo-analysis.md`; state the router and version (V2).
2. Confirm each page in scope is meant to be public and indexable.
3. Audit against `references/core/seo-technical.md` in this order:
   - Crawlability: status codes, canonical tags, `robots.txt`, sitemap.
   - Metadata: unique title and description, Open Graph, one logical `<h1>`.
   - Structured data (JSON-LD) that matches visible content.
   - URL structure and redirect hygiene; `hreflang` when the site is multilingual.
4. Make sure important content is rendered on the server, not only on the client.
5. Implement metadata and sitemap generation for the detected router
   (`references/frontend/nextjs-architecture.md`).
6. Treat Core Web Vitals as an input by linking `references/core/performance-web-vitals.md`.

## Version gates

| Detected | Then |
|---|---|
| Next.js App Router | Use the Metadata API (`metadata`, `generateMetadata`) and `app/sitemap.ts`, `app/robots.ts` |
| Next.js Pages Router | Use `next/head` and a generated or static sitemap |

## Best-practice checklist

- [ ] Scope confirmed as public, indexable content.
- [ ] Canonical URLs and status codes are correct; no soft 404s or duplicate URLs.
- [ ] Unique title and description per page; one logical `<h1>`.
- [ ] Structured data matches visible content and validates.
- [ ] `robots.txt` and sitemap match the real indexable routes.
- [ ] Important content is server-rendered; `hreflang` present when multilingual.

## Evidence required

Before and after metadata for changed pages; structured-data validator output when a validator
is available; otherwise say it was not run (E2).

## Stop conditions

Stop and ask when indexability of a route is unclear (for example, a page behind a soft login)
or when changes would alter URLs that already rank.

## Never

- Index authenticated or internal routes.
- Add structured data for content that is not visible on the page.
- Promise rankings or traffic.

## Output

The specific defect (audit) or implementation (build) first, citing the `seo-technical.md`
rule applied, with before and after metadata.

## References

- `references/core/operating-rules.md`
- `references/core/seo-technical.md`
- `references/core/performance-web-vitals.md`
- `references/frontend/nextjs-architecture.md`
