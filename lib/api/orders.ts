import { apiFetchJson } from "./client";

export type CreateOrderItem = {
  variantId: string;
  quantity: number;
};

export function createOrder(items: CreateOrderItem[]) {
  return apiFetchJson("/api/orders", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export function getMyOrders() {
  return apiFetchJson("/api/orders/my-orders");
}

export function getOrder(id: string) {
  return apiFetchJson(`/api/orders/${id}`);
}