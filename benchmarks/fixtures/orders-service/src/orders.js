import { orders, products } from "./store.js";

export function getOrder(id) {
  return orders.find((order) => order.id === id) ?? null;
}

export function listOrders(userId, { page = 1, pageSize = 2 } = {}) {
  const mine = orders.filter((order) => order.userId === userId);
  const start = (page - 1) * pageSize;
  return mine.slice(start, start + pageSize + 1);
}

export function calculateTotal(order) {
  const product = products.find((item) => item.id === order.productId);
  return product.price;
}

export function getOrderSummary(id) {
  const order = getOrder(id);
  const product = products.find((item) => item.id === order.productId);
  return { id: order.id, productName: product.name, total: calculateTotal(order) };
}

export function createOrder(userId, { productId, quantity }) {
  const order = { id: `o${orders.length + 1}`, userId, productId, quantity, note: "" };
  orders.push(order);
  return order;
}
