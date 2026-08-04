# Workflow: SEO

## Goal

Improve crawlability, metadata, structured data, and indexing hygiene
for public-facing pages.

## Process

1. Run `references/core/repo-analysis.md` to confirm the frontend
   framework/version (metadata APIs differ significantly, e.g., Next.js
   Metadata API in App Router vs `next/head` in Pages Router).
2. Confirm the page(s) in scope are actually meant to be publicly
   indexable — don't apply SEO changes to authenticated/internal routes.
3. Audit against `core/seo-technical.md` categories in this order
   (fix blockers to indexing before polish):
   - Crawlability (robots.txt, canonical tags, status codes)
   - Metadata (title, description, Open Graph)
   - Structured data (JSON-LD, matched to real visible content)
   - URL structure and redirect hygiene
4. Implement framework-specific metadata/sitemap generation via
   `frontend/nextjs-architecture.md` (branch by detected router).
5. Validate that Core Web Vitals aren't being ignored as an SEO input —
   link to `core/performance-web-vitals.md` rather than restating
   thresholds.
6. Never add structured data describing content that isn't genuinely
   visible on the page (`seo-technical.md` — avoids manual action risk).

## Checklist

- [ ] Scope confirmed as genuinely public/indexable content.
- [ ] Canonical URLs and status codes correct (no soft-404s, no
      accidental duplicate-content URLs).
- [ ] Unique title/description per page; single logical `<h1>`.
- [ ] Structured data matches real visible content and validates against
      schema.org.
- [ ] robots.txt/sitemap.xml kept in sync with actual indexable routes.

## Output Format

Lead with the specific SEO defect found (if auditing) or the
implementation (if building), citing the exact `seo-technical.md` rule
applied. Include before/after for metadata-level changes.

## Related References

- `references/core/seo-technical.md`
- `references/core/performance-web-vitals.md`
- `references/frontend/nextjs-architecture.md`