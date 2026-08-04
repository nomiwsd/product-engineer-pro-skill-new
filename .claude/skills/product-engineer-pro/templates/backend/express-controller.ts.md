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

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

router.post("/orders", requireAuth, async (req: Request, res: Response) => {
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
  const order = await createOrder((req as any).user.id, parsed.data);
  res.status(201).json(order);
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
- Replace `requireAuth` and `createOrder` with the project's actual auth middleware and service modules.