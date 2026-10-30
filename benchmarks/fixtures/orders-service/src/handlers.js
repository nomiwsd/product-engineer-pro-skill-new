import { createOrder, getOrder, listOrders } from "./orders.js";
import { requireUser } from "./auth.js";
import { db } from "./db.js";

export function getOrderHandler(req) {
  const denied = requireUser(req);
  if (denied) return denied;
  const order = getOrder(req.params.id);
  if (!order) return { status: 404, body: { error: "not found" } };
  return { status: 200, body: order };
}

export function listOrdersHandler(req) {
  const denied = requireUser(req);
  if (denied) return denied;
  const page = Number(req.query.page ?? 1);
  return { status: 200, body: listOrders(req.user.id, { page }) };
}

export function searchOrdersHandler(req) {
  const denied = requireUser(req);
  if (denied) return denied;
  const rows = db.query(`SELECT * FROM orders WHERE user_id = '${req.user.id}' AND note LIKE '%${req.query.q}%'`);
  return { status: 200, body: rows };
}

export function createOrderHandler(req) {
  const denied = requireUser(req);
  if (denied) return denied;
  const { productId, quantity } = req.body;
  return { status: 201, body: createOrder(req.user.id, { productId, quantity }) };
}
