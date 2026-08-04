# Accessibility (a11y)

## Scope

Owns: framework-agnostic WCAG-aligned accessibility baseline for any UI
in this skill's supported stack.

Defers to: `shadcn-ui.md` for how Radix-based primitives already satisfy
much of this baseline; `react-patterns.md` for React-specific
implementation of focus management and semantic structure.

## Baseline Standard

Target **WCAG 2.2 Level AA** unless the project specifies otherwise.

## Semantic HTML First

- Use native elements for their intended purpose before reaching for
  ARIA: `<button>` not `<div onClick>`, `<nav>`, `<main>`, `<header>`,
  `<footer>`, `<a href>` for navigation (not for actions).
- Heading levels (`h1`–`h6`) form a logical outline — never skip levels
  for visual sizing reasons (use CSS for size, not heading level).
- Form inputs always have an associated `<label>` (explicit `for`/`id`
  pairing, or wrapping) — placeholder text is never a substitute for a
  label.

## ARIA — Only When Semantic HTML Isn't Enough

- The first rule of ARIA: don't use ARIA if a native element already
  provides the semantics.
- Every interactive custom widget (custom dropdown, tab panel, modal)
  needs the correct `role` and state attributes (`aria-expanded`,
  `aria-selected`, `aria-controls`) matching the ARIA Authoring
  Practices pattern for that widget type.
- `aria-label`/`aria-labelledby` only when there's no visible text label
  an assistive technology can already use.

## Keyboard Access

- Every interactive element must be reachable and operable via keyboard
  alone (Tab, Shift+Tab, Enter/Space, Escape, Arrow keys where
  applicable for composite widgets).
- Visible focus indicator required on every focusable element — never
  remove `outline` without providing an equally visible replacement.
- Logical tab order matches visual/reading order — avoid manual
  `tabindex` values above 0.
- Modals/dialogs trap focus while open and return focus to the trigger
  element on close.

## Color & Contrast

- Text contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
  (≥18pt or ≥14pt bold), against its background.
- Never convey information (error state, required field, status) through
  color alone — pair with text, icon, or pattern.
- Interactive element states (hover/focus/active/disabled) remain
  distinguishable for users with color vision deficiencies.

## Forms

- Required fields indicated in text (not just an asterisk with no
  legend), and programmatically via `required`/`aria-required`.
- Validation errors announced to assistive tech (`aria-live` region or
  `aria-describedby` linking the error to its field) and associated
  with the specific field, not just shown in a generic banner.
- Error messages describe how to fix the problem, not just that one exists.

## Images & Media

- Every meaningful `<img>` has descriptive `alt` text; purely decorative
  images use `alt=""` (empty, not omitted).
- Video content has captions; audio-only content has a transcript when
  conveying essential information.

## Motion & Animation

- Respect `prefers-reduced-motion` — disable or reduce non-essential
  animation for users who've set this preference.

## Testing Approach

- Automated: axe-core (or equivalent) in CI/lint step catches ~30–40%
  of issues (missing labels, contrast, ARIA misuse) — necessary but not
  sufficient.
- Manual: keyboard-only pass through every new interactive flow;
  screen-reader spot-check (VoiceOver/NVDA) on critical paths.

## Anti-Patterns

```tsx
// Div masquerading as a button — not keyboard accessible by default
<div onClick={submit}>Submit</div>

// Placeholder as the only label
<input placeholder="Email" />

// Removing focus outline with no replacement
button:focus { outline: none; }

// Color-only error indication
<input style={{ borderColor: hasError ? 'red' : 'gray' }} />