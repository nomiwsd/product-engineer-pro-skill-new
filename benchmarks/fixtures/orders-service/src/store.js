const seed = {
  users: [
    { id: "u1", name: "Ana" },
    { id: "u2", name: "Ben" }
  ],
  products: [
    { id: "p1", name: "Desk", price: 120 },
    { id: "p2", name: "Lamp", price: 35.5 }
  ],
  orders: [
    { id: "o1", userId: "u1", productId: "p1", quantity: 1, note: "office" },
    { id: "o2", userId: "u1", productId: "p2", quantity: 2, note: "gift wrap" },
    { id: "o3", userId: "u2", productId: "p9", quantity: 1, note: "" },
    { id: "o4", userId: "u1", productId: "p2", quantity: 1, note: "spare" },
    { id: "o5", userId: "u1", productId: "p1", quantity: 3, note: "team" }
  ]
};

export const users = [];
export const products = [];
export const orders = [];

export function resetStore() {
  users.splice(0, users.length, ...structuredClone(seed.users));
  products.splice(0, products.length, ...structuredClone(seed.products));
  orders.splice(0, orders.length, ...structuredClone(seed.orders));
}

resetStore();
