# Workflow: Performance

## Goal

Diagnose and improve speed, bundle size, Core Web Vitals, or query
latency — with measurement before and after, not assumption-driven
changes.

## Process

1. Run `references/core/repo-analysis.md` to detect frontend framework/
   version and data layer.
2. Establish what's actually being optimized: a specific Web Vital
   (LCP/INP/CLS), a bundle-size concern, or a slow query/endpoint. Don't
   apply generic "performance best practices" without a stated target
   metric.
3. If a baseline measurement exists (Lighthouse report, profiler output,
   query EXPLAIN plan, bundle analyzer output), use it as ground truth.
   If none exists, state that the recommendation is based on static
   analysis, not measurement, and suggest how to measure.
4. Route by category, loading only the relevant file(s):
   - Rendering/loading (LCP, bundle size) →
     `core/performance-web-vitals.md` + `frontend/nextjs-architecture.md`
     or `frontend/react-patterns.md`
   - Interaction responsiveness (INP) → `frontend/react-patterns.md`
     (re-render/memoization patterns)
   - Layout stability (CLS) → `core/performance-web-vitals.md`
   - Query/data latency → `database/postgresql-design.md` or
     `database/mongodb-design.md` (indexing, query shape)
5. Propose the highest-leverage fix first (e.g., fixing an N+1 query
   before micro-optimizing a component render) — prioritize by expected
   impact, not by ease of implementation.
6. State measured before/after changes when both observations exist. If only static
   evidence exists, describe the mechanism and verification method without inventing
   a numeric improvement.
7. Flag any performance fix that trades off maintainability or
   correctness (e.g., aggressive memoization, denormalized data) as an
   explicit trade-off, not a free win.

## Checklist

- [ ] A specific target metric is named, not generic "performance."
- [ ] Baseline measurement used if available; stated as static analysis
      if not.
- [ ] Highest-leverage fix proposed first.
- [ ] No numeric improvement is claimed without before/after evidence.
- [ ] Trade-offs (maintainability, correctness) flagged explicitly.

## Output Format

State the target metric and observed baseline when available. Then provide the fix
or read-only plan, the verification result/method, and any trade-off.

## Related References

- `references/core/performance-web-vitals.md`
- `references/frontend/nextjs-architecture.md`
- `references/frontend/react-patterns.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
