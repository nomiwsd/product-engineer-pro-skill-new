# Workflow: Performance

## Goal

Improve a named performance target — a Web Vital (LCP, INP, CLS), bundle size, endpoint
latency, or query time — by measuring first, fixing the highest-leverage cause, and measuring
again, without trading away correctness silently.

## Detect first

- The target metric and the user's threshold. If none is named, ask or propose one (D6).
- Existing measurements: Lighthouse or field data, profiler output, bundle analyzer, `EXPLAIN`
  plans, request timings. Frontend framework and version, data layer.

## Lifecycle behavior

- `plan`: target metric, baseline (or measurement method), suspected bottleneck, proposed fix,
  trade-offs, and how to re-measure. No edits (L1).
- `build`: apply the highest-leverage fix and re-measure with the same tool and conditions.
- `review`: findings on likely bottlenecks with locations, labelled as static analysis unless
  measured. No edits.

## Process

1. Run `references/core/repo-analysis.md`; state the detected versions (V2).
2. Name the target metric. Do not apply generic optimizations without one.
3. Use an existing baseline as ground truth. If none exists, say the analysis is static and
   give the exact measurement method.
4. Route by category, loading only what applies:
   - Loading and bundle (LCP, size) → `references/core/performance-web-vitals.md` plus
     `references/frontend/nextjs-architecture.md` or `references/frontend/react-patterns.md`.
   - Interaction (INP) → `references/frontend/react-patterns.md`.
   - Layout stability (CLS) → `references/core/performance-web-vitals.md`.
   - Query or endpoint latency → the detected database reference.
5. Fix in order of expected impact: request waterfalls and N+1 queries before render
   micro-optimizations; prefer framework caching and streaming over custom caches.
6. Memoize only with evidence of re-render cost; flag every trade-off against
   maintainability or correctness.
7. Re-measure with the same tool and conditions as the baseline.

## Version gates

None beyond the loaded stack references; caching and rendering defaults differ by framework
major, so read them from the detected version (V4).

## Best-practice checklist

- [ ] A specific target metric is named.
- [ ] Baseline measured, or the work is labelled static analysis with a measurement method.
- [ ] Highest-leverage fix first (waterfalls and N+1 before micro-optimizations).
- [ ] Before and after use the same tool and conditions.
- [ ] Trade-offs are stated explicitly.

## Evidence required

Before and after numbers from the same tool for any improvement claim (E3); otherwise the
mechanism and how to verify it. Functional tests still pass after the change (E2).

## Stop conditions

Stop and report when no metric can be named or measured and the user has not accepted static
analysis, or when the fix would change observable behavior.

## Never

- Claim a percentage or millisecond gain from reasoning alone.
- Add caching that can serve stale or another user's data without saying so.
- Optimize code that is not on the measured hot path.

## Output

Target metric and baseline first, then the fix (or plan), the after-measurement or
verification method, and any trade-off.

## References

- `references/core/operating-rules.md`
- `references/core/performance-web-vitals.md`
- `references/frontend/nextjs-architecture.md`
- `references/frontend/react-patterns.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
