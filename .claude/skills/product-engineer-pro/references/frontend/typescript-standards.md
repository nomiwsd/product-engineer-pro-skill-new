# TypeScript Standards

## Scope

Owns: type-system usage standards — strictness, type vs interface, generics discipline, utility types, and modern TypeScript features (TS 5.8/5.7/5.6/5.5) — applicable across frontend and backend code alike.

Defers to: framework-specific files for how types are applied in that context (e.g., component prop types in `react-patterns.md`, DTO typing in `nestjs-architecture.md`).

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view typescript version`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| TypeScript 5.8+ / 5.x | Current (Latest) | `--erasableSyntaxOnly` flag (TS 5.8), never-initialized variable checks (TS 5.7), inferred type predicates for `.filter()` (TS 5.5), `isolatedDeclarations` (TS 5.5), `using`/`await using` explicit resource management (TS 5.2), `satisfies` operator (TS 4.9+), `<const T>` (TS 5.0) |
| TypeScript 4.x | Supported | `satisfies` operator (4.9+), template literal types (4.1+), `override` keyword (4.3+), legacy experimental decorators (`experimentalDecorators`) |
| TypeScript 3.x and earlier | Legacy | No template literal types, limited conditional type support — flag as outdated but work within its constraints |

## Detection

Per `references/core/repo-analysis.md`: check `typescript` version in lockfile and `tsconfig.json` compiler options (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `moduleResolution`, `erasableSyntaxOnly`, `isolatedDeclarations`). Treat the project's actual strictness configuration as binding.

## Standards

### Strictness & Safety
- Prefer `strict: true` for all projects.
- **Never use `any` as a shortcut** — use `unknown` and narrow it via type guards, `instanceof`, or Zod validation schemas. `any` disables type checking transitively for everything it touches.
- Avoid non-null assertions (`!`) except where genuinely provably safe and documented why — prefer proper narrowing or optional chaining (`?.`).
- Avoid `as` type assertions to force incompatible types — an assertion should only bridge a gap the compiler cannot see, never override a real type mismatch.

### TS 5.x Modern Features
- **Inferred Type Predicates (TS 5.5+)**: TypeScript automatically infers type predicates for `.filter()` calls. Avoid manual type guards when standard checks (e.g., `.filter(Boolean)`) already narrow types automatically.
- **`satisfies` Operator (TS 4.9+)**: Use `satisfies` when validating a value against a type while preserving its exact literal type:
  ```ts
  const palette = {
    primary: "oklch(0.6 0.2 250)",
    secondary: "oklch(0.8 0.1 150)",
  } satisfies Record<string, string>;
  // palette.primary is inferred as string literal, not wider string!
  ```
- **`const` Type Parameters (TS 5.0+)**: Use `<const T>` to infer read-only literal types automatically without requiring `as const` at every call site:
  ```ts
  function getRoutes<const T extends string[]>(routes: T): T { return routes; }
  ```
- **Explicit Resource Management (TS 5.2+)**: Use `using` or `await using` for automatic resource disposal (db connections, locks, handles):
  ```ts
  {
    using db = getDbConnection();
    // db is automatically disposed when exiting this block!
  }
  ```
- **Fast Build Flags**: Respect `isolatedDeclarations` (TS 5.5+) and `--erasableSyntaxOnly` (TS 5.8+) when configured for type-stripping toolchains (SWC, esbuild).

### Type vs Interface
- Use `interface` for object shapes that may be extended or implemented (component props, class contracts, public API payloads).
- Use `type` for unions, intersections, mapped types, primitive aliases, tuples, and utility compositions.

### Generics Discipline
- Name generic parameters descriptively for public/exported APIs (`TData`, `TError`) rather than bare `T` when there is more than one parameter.
- Constrain generics (`<T extends SomeShape>`) when specific properties are required.
- Do not introduce a generic parameter used only once with no actual polymorphic behavior.

### Utility Types & Composition
- Prefer built-in utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`) to derive related types from a single source of truth rather than manually redefining near-duplicate types.

## Anti-Patterns

```ts
// any as a shortcut — never do this
function process(data: any) { return data.whatever; }

// Non-null assertion masking a possible undefined case
const user = users.find(u => u.id === id)!;
user.name; // throws at runtime if user is undefined

// Redefining a type that should be derived
interface User {
  id: string;
  name: string;
  email: string;
}
interface UserSummary {
  id: string;
  name: string;
}
// Better: type UserSummary = Pick<User, 'id' | 'name'>;
```

## Related References

- `references/frontend/react-patterns.md`
- `references/frontend/nextjs-architecture.md`
- `references/backend/nestjs-architecture.md`
- `references/backend/express-architecture.md`
- `references/core/code-review-checklist.md`

## Applies To Modes

- `implement`
- `refactor`
- `debug`
- `review`
- `audit`