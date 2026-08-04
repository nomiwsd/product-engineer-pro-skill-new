# React Patterns

## Scope

Owns: component design, hooks discipline, state boundaries, composition patterns, and version-specific standards for React (including React 19.2+ & React Compiler 1.0), independent of any meta-framework.

Defers to: `nextjs-architecture.md` for server/client component split and Next.js-specific data-fetching; `typescript-standards.md` for typing props/hooks; `accessibility-a11y.md` for a11y implementation detail.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view react version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| React 19.2+ / 19.x | Current | Actions (`useActionState`, `useFormStatus`, `useOptimistic`), `use()` API for promises & context, `useEffectEvent` for non-reactive events, `<Activity />` for background pre-rendering, direct `ref` prop passing (no `forwardRef`), `<Context>` without `.Provider`, native document metadata (`<title>`, `<meta>`), React Compiler 1.0 support |
| React 18.x | Supported | Concurrent rendering (`useTransition`, `useDeferredValue`), `useId`, `useSyncExternalStore`, automatic batching, `forwardRef` required for ref-forwarding |
| React 17.x and earlier | Legacy | No concurrent features, manual batching outside event handlers, `forwardRef` required — flag as outdated if encountered, but work within its constraints |

## Detection

Per `references/core/repo-analysis.md` Framework Detection Table: `"react"` version in `package.json`/lockfile determines which version standards apply. If mixed signals (e.g., using `use()` in a React 18 project), flag the version mismatch rather than silently assuming it works.

## Standards

### Component Design
- One component, one responsibility — if a component fetches data, renders complex conditional UI, and manages local form state simultaneously, split it into focused sub-components.
- Presentational components receive data via props; container/data components own fetching and pass data down — don't mix fetch calls into deeply nested presentational components.
- Default export for the primary component per file; named exports for secondary/sub-components co-located in the same file, matching existing repo convention if one exists.
- Props interfaces are explicit and minimal — don't pass an entire object down when a component uses only two or three fields from it.

### React Compiler 1.0 & Memoization
- When the **React Compiler** is enabled, manual memoization via `useMemo` and `useCallback` is automatically handled by the build tool. Avoid adding boilerplate `useMemo`/`useCallback` unless manually profiling a specific un-compiled edge case.
- In un-compiled codebases (React 18 or React 19 without compiler), memoize (`useMemo`/`useCallback`/`memo`) only after identifying an actual unnecessary re-render cost — not preemptively on every component.

### Hooks Discipline
- Obey the Rules of Hooks unconditionally: call hooks at the top level, only from React functions — never inside conditionals, loops, or nested functions (except React 19's `use()` hook which can be called conditionally).
- Use `useEffect` only for synchronizing with external systems (subscriptions, DOM APIs, non-React widgets) — not for deriving state from props/state that could be computed directly during render.
- Use `useEffectEvent` (React 19.2+) for event handlers inside effects that read props/state without making the effect re-run when those values change.
- Every value used inside `useEffect` belongs in its dependency array — don't suppress `exhaustive-deps`.

### State Boundaries
- Keep state as local as possible; lift state only as high as the nearest common ancestor that actually needs it.
- Derive state during render instead of storing a duplicate copy in state + syncing via `useEffect` (e.g., compute a filtered list from source state + filter state).
- Server-originated data and client UI state are distinct categories — use a data-fetching library (React Query / TanStack Query, SWR, or Server Components) for server data rather than `useEffect` + `useState`.

### Composition & Background Pre-rendering
- Prefer composition (`children`, render props, slots) over configuration via an expanding prop list.
- Use `<Activity mode="hidden">` (React 19.2+) to pre-render hidden subtrees in the background without affecting main-thread performance.
- Context is for cross-cutting concerns genuinely needed by a subtree (theme, auth session, i18n).

### React 19.x Core Features
- **Form Actions**: Use `useActionState` + Actions for form submissions to automatically manage pending, response, and error states.
- **Form Status**: Use `useFormStatus` inside button components to detect form pending state automatically.
- **Optimistic UI**: Use `useOptimistic` for instant UI feedback before server confirmation.
- **The `use()` Hook**: Use `use(Promise)` to resolve data inside render or `use(Context)` to read context conditionally.
- **Direct Ref Passing**: Pass `ref` as a normal prop to function components (`function Input({ ref, ...props })`) — do not wrap new components in `forwardRef` in React 19.
- **Document Metadata**: Render `<title>`, `<meta>`, and `<link>` directly inside components; React hoists them to `<head>` automatically.

## Anti-Patterns

```tsx
// Redundant state derivation
const [items, setItems] = useState(data);
const [filtered, setFiltered] = useState([]);
useEffect(() => { setFiltered(items.filter(predicate)); }, [items]);
// Better: const filtered = items.filter(predicate);

// Suppressing exhaustive-deps lint rule
useEffect(() => {
  doSomething(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// Array index as key on dynamic lists
{items.map((item, i) => <Row key={i} {...item} />)}

// Using forwardRef in a confirmed React 19 project
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);
```

## Related References

- `references/frontend/nextjs-architecture.md`
- `references/frontend/typescript-standards.md`
- `references/core/accessibility-a11y.md`
- `references/core/performance-web-vitals.md`

## Applies To Modes

- `implement`
- `refactor`
- `debug`
- `review`
- `design-system`