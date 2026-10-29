# Template: Express Controller (Router Module)

Implements standards from `references/backend/express-architecture.md` and `references/backend/api-design.md`.

## When to Use

Creating a new modular router endpoint in Express. Check detected Express version first (`references/core/repo-analysis.md`) — Express 5.x handles async errors automatically, whereas Express 4.x requires explicit async wrappers.

## Template (Express 5.x — Automatic Async Error Forwarding)

```ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = Router();

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

router.post("/orders", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request body.",
        details: parsed.error.issues,
      },
    });
  }

  // Thrown errors propagate automatically to centralized error middleware in Express 5.x
  const order = await createOrder(req.user.id, parsed.data);
  res.status(201).json(order);
});

router.get("/orders/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  // Scope the lookup to the authenticated owner; never trust an ID alone (prevents IDOR).
  const order = await findOrderForOwner(req.params.id, req.user.id);
  if (!order) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Order not found." } });
  }
  res.json(order);
});

export default router;
```

## Adaptation Notes — Express 4.x

In Express 4.x, wrap handlers explicitly using `asyncHandler` because async rejections are not automatically forwarded:

```ts
import { RequestHandler } from "express";

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post(
  "/orders",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    /* same body as above */
  })
);
```

- Register centralized error middleware `(err, req, res, next)` once at the app root level (`express-architecture.md`).
- Replace `requireAuth`, `createOrder`, and `findOrderForOwner` with the project's actual auth middleware and service modules.
- Return 404 rather than 403 for another user's record when existence itself is sensitive.
- Match the project's existing error shape; use RFC 9457 Problem Details for greenfield APIs.
- Zod 4 also offers top-level format schemas such as `z.uuid()`; use the API of the installed Zod major.
