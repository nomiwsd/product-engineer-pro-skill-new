import { orders, products } from "./store.js";

export function revenueByUser(userId) {
  let total = 0;
  for (const order of orders) {
    if (order.userId !== userId) continue;
    const product = products.find((item) => item.id === order.productId);
    if (!product) continue;
    total += product.price * order.quantity;
  }
  return Math.round(total);
}

export function revenueByProduct(productId) {
  let total = 0;
  for (const order of orders) {
    if (order.productId !== productId) continue;
    const product = products.find((item) => item.id === order.productId);
    if (!product) continue;
    total += product.price * order.quantity;
  }
  return Math.floor(total);
}
