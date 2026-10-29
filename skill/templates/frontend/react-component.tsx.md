# Template: React Component

Implements standards from `references/frontend/react-patterns.md`, `references/frontend/typescript-standards.md`, and `references/core/accessibility-a11y.md`.

## When to Use

Creating a presentational or interactive UI component. Default to Server Component (no `"use client"`) unless client-side state, event handlers, or browser APIs are required (`references/frontend/nextjs-architecture.md`).

## Template

```tsx
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description?: string;
  variant?: "default" | "highlighted";
  children?: ReactNode;
  className?: string;
}

export function Card({
  title,
  description,
  variant = "default",
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        variant === "highlighted" && "border-primary bg-primary/5",
        className
      )}
    >
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
```

## Template — Data-Driven Component With Every State

```tsx
interface Order {
  id: string;
  label: string;
}

interface OrderListProps {
  status: "loading" | "error" | "success";
  orders: Order[];
  onRetry: () => void;
}

export function OrderList({ status, orders, onRetry }: OrderListProps) {
  if (status === "loading") return <p role="status">Loading orders…</p>;
  if (status === "error") {
    return (
      <div role="alert">
        <p>Orders could not be loaded.</p>
        <button type="button" onClick={onRetry}>Try again</button>
      </div>
    );
  }
  if (orders.length === 0) return <p>No orders yet.</p>;
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>{order.label}</li>
      ))}
    </ul>
  );
}
```

## Adaptation Notes

- Every data-driven view needs loading, empty, error (with a recovery action), and success
  states; use the framework's loading and error boundaries where they exist.
- In React 19, pass `ref` as a normal prop (`function Button({ ref, ...props })`) — do not wrap new components in `forwardRef` (`react-patterns.md`).
- Add `"use client"` directive only if the component genuinely requires client interactivity.
- Verify focus rings and accessible ARIA attributes (`accessibility-a11y.md`).