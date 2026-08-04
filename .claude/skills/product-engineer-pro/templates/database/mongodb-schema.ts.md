# Template: MongoDB Schema (Mongoose)

Implements standards from `references/database/mongodb-design.md`, enforcing embedding vs. referencing decisions and database-level schema validation.

## When to Use

Defining document structures, embedded sub-documents, and indexes in MongoDB via Mongoose.

## Template

```ts
import { Schema, model, Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

interface Order {
  userId: Types.ObjectId;
  items: OrderItem[]; // Embedded — bounded size, always read together with order
  status: "pending" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<Order>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: OrderItem[]) => items.length > 0 && items.length <= 100,
        message: "Order must have between 1 and 100 items.",
      },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
      required: true,
    },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Compound index following ESR rule: Equality (userId, status)
orderSchema.index({ userId: 1, status: 1 });

export const OrderModel = model<Order>("Order", orderSchema);
```

## Adaptation Notes

- `items` is embedded because it is bounded (capped at 100 items by validator) and always read together with the order (`mongodb-design.md`). If a related collection grows unboundedly (e.g., reviews or full payment transaction logs), reference it via `ObjectId` instead.
- Verify compound indexes with `explain()` (`IXSCAN`).
- Cast and validate client inputs before passing them into Mongoose queries (`references/core/security-owasp.md` A03).