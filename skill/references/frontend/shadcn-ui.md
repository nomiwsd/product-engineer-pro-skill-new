# shadcn/ui

## Scope

Owns: standards for using and extending shadcn/ui components — composition patterns, variant management, and the accessibility guarantees inherited from its Radix UI foundation.

Defers to: `tailwind-css.md` for the utility syntax used inside component styling; `design-system-theming.md` for the token values fed into shadcn's CSS variables; `accessibility-a11y.md` for the underlying a11y standard being inherited.

## Version Matrix

Verify before relying on "Current" tier: check the installed version via lockfile/registry (`npm view shadcn-ui version` or `npx shadcn@latest`) — this matrix reflects known versions as of this skill's last update and may lag behind an actual new release.

| Aspect | Support Tier | Key Differences |
|---|---|---|
| CLI-based install (`components.json` present) | Current | Components are copied into the project (`components/ui/`), not installed as an npm dependency — each project's copy is independently editable |
| Tailwind v4 projects | Current | shadcn/ui CLI generates components using v4 CSS-variable/`@theme` conventions |
| Tailwind v3 projects | Supported | Components generated using `tailwind.config.js`-based theme extension conventions |
| Pre-CLI / manually copied components (no `components.json`) | Legacy pattern | Treat as fully custom code once copied — apply `react-patterns.md` generally; don't assume CLI-driven update mechanisms apply |

## Detection

Per `references/core/repo-analysis.md`: presence of `components.json` confirms shadcn/ui is installed — read it for `style` (`default`/`new-york`), `tsx` flag, `tailwind.config` path, and configured aliases (`@/components`, `@/lib`, etc.). Check whether components live under `components/ui/` matching the configured alias before assuming a default path.

## Standards

### Core Principle: Composition, Not Modification-in-Place-of-Extension
- shadcn/ui components are copied into the project as owned source code — they are meant to be read and modified directly, unlike a typical npm-installed component library.
- Prefer composing a new component around an existing primitive (wrap `<Button>` in a `<SubmitButton>` with app-specific logic) over duplicating a primitive's internals from scratch when the primitive already covers the base behavior.
- When a primitive genuinely needs different behavior for one use case, editing its copied source directly is appropriate — it's local code, not a shared dependency — but check whether the change should apply globally (edit the base primitive) or is one-off (create a variant/wrapper instead) before deciding which.

### Variants via `cva` (class-variance-authority)
- Use the `cva` pattern already established by shadcn's generated components for any new variant-driven component — don't introduce a second variant mechanism (e.g., a manual switch statement mapping props to classes) inconsistently alongside it.
- Keep variant option names semantic (`variant="destructive"`, `size="sm"`) rather than describing the literal styling (`variant="red"`).

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

### Accessibility Inheritance
- shadcn/ui components are built on Radix UI primitives, which handle keyboard navigation, focus management, and ARIA attributes correctly by default for complex widgets (Dialog, Dropdown, Select, Popover, Tabs) — do not strip or override these behaviors (e.g., removing Radix's built-in focus trap in a Dialog) without a strong, explicit reason.
- When composing a new custom interactive widget that Radix doesn't cover, apply `references/core/accessibility-a11y.md` standards manually — the inherited a11y guarantee only applies to the Radix-backed primitives themselves, not to arbitrary new components built without them.
- Preserve `asChild` (Radix's Slot-based composition) usage where the underlying component supports it, to merge behavior/props onto a custom child element instead of introducing an extra wrapping DOM node.

### Theming Integration
- shadcn components consume CSS variables (`--primary`, `--primary-foreground`, `--radius`, etc.) defined at the root — update theming through these variables (see `design-system-theming.md`) rather than overriding component-level classes with hardcoded colors, which breaks dark-mode/theme-switching consistency.
- Don't hardcode a color utility (`bg-blue-600`) directly onto a shadcn primitive when a semantic token (`bg-primary`) already exists for that purpose — hardcoding breaks theme consistency and dark-mode support.

### Updating Components
- Because components are copied, there is no automatic upgrade path — re-running the CLI `add` command for an already-customized component will overwrite local edits. Before re-running the CLI for an existing component, diff against the current local version and reconcile intentional customizations manually.

## Anti-Patterns

```tsx
// Hardcoding a color instead of using the semantic token
<Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
// Better: use variant="default" or extend the token, not override inline

// Stripping Radix's focus trap from a Dialog "to fix a bug" without
// understanding why it was there
<DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
  {/* removes intended focus behavior for all users */}
</DialogContent>

// Building a custom dropdown from scratch instead of composing
// DropdownMenu, losing all inherited keyboard/ARIA behavior
<div onClick={toggle}>{open && <div className="absolute">{items}</div>}</div>
```

## Related References

- `references/frontend/tailwind-css.md`
- `references/frontend/design-system-theming.md`
- `references/core/accessibility-a11y.md`

## Applies To Modes

- `design-system`
- `implement`
- `review`
- `refactor`