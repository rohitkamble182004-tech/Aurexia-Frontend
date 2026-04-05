"use client";

import { JSX, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api/client";

interface AdminOrder {
  id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  trackingNumber?: string;
  shippingCompany?: string;
}

const statusOptions: string[] = [
  "Processing",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage(): JSX.Element {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchOrders();
  }, []);

  async function fetchOrders(): Promise<void> {
    try {
      const data = await adminFetch<AdminOrder[]>(
        "/api/admin/orders"
      );

      if (!data) {
        setOrders([]);
        return;
      }

      setOrders(data);
    } catch (err: unknown) {
      console.error("Orders fetch error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load orders.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    orderId: string,
    status: string
  ): Promise<void> {
    try {
      await adminFetch<void>(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      await fetchOrders();
    } catch (err: unknown) {
      console.error("Status update error:", err);

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to update status.");
      }
    }
  }

  if (loading)
    return <p className="p-6">Loading orders...</p>;

  if (error)
    return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Orders Management</h1>

      {orders.length === 0 ? (
        <p className="text-neutral-400">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-neutral-800 text-sm">
            <thead className="bg-neutral-800">
              <tr>
                <th className="p-3 border border-neutral-700">Order</th>
                <th className="p-3 border border-neutral-700">Total</th>
                <th className="p-3 border border-neutral-700">Status</th>
                <th className="p-3 border border-neutral-700">Tracking</th>
                <th className="p-3 border border-neutral-700">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border border-neutral-800 hover:bg-neutral-900"
                >
                  <td className="p-3">
                    {order.id.slice(0, 8)}...
                  </td>

                  <td className="p-3">
                    ${order.totalAmount}
                  </td>

                  <td className="p-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                      className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3">
                    {order.trackingNumber ? (
                      <div>
                        <div>
                          {order.shippingCompany}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {order.trackingNumber}
                        </div>
                      </div>
                    ) : (
                      <span className="text-neutral-500">
                        No tracking
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}