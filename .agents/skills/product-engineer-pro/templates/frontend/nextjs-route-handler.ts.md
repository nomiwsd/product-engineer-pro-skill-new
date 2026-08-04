# Template: Next.js Route Handler

Implements standards from `references/frontend/nextjs-architecture.md` and `references/backend/api-design.md`.

## When to Use

Creating an App Router API Route Handler (`app/api/.../route.ts`). In Next.js 15+ & 16+, route `params`, `searchParams`, and `cookies()` are asynchronous and **MUST be `await`ed**.

## Template (Next.js 15+ / 16+)

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body.",
          details: parsed.error.issues,
        },
      },
      { status: 400 }
    );
  }

  const session = await getSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  try {
    const order = await createOrder(session.userId, parsed.data);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    logger.error(err, { route: "POST /api/orders" });
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error." } },
      { status: 500 }
    );
  }
}

// In Next.js 15+ / 16+, GET handlers are uncached by default.
// params is a Promise and MUST be await'ed.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Order not found." } },
      { status: 404 }
    );
  }
  return NextResponse.json(order);
}
```

## Adaptation Notes

- In Next.js 13–14, `params` is a synchronous object (`const { id } = params`). Do not `await` `params` in Next.js 14 projects.
- Standardized error response shape matches `api-design.md`.
- Replace `getSession`, `createOrder`, `getOrder`, and `logger` with project modules.