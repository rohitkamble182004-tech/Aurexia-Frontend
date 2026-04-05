"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetchJson } from "@/lib/api/client";

interface UserOrder {
  id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export default function UserOrdersPage(): JSX.Element {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchOrders();
  }, []);

  async function fetchOrders(): Promise<void> {
    try {
      const data = await apiFetchJson<UserOrder[]>(
        "/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      );

      setOrders(data);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="p-6">Loading orders...</p>;

  if (error)
    return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Order</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="border p-2">
                  ${order.totalAmount}
                </td>
                <td className="border p-2">
                  <StatusBadge status={order.orderStatus} />
                </td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }): JSX.Element {
  let color = "bg-yellow-200";

  if (status === "Delivered") color = "bg-green-200";
  if (status === "Shipped") color = "bg-blue-200";
  if (status === "Cancelled") color = "bg-red-200";

  return (
    <span className={`px-2 py-1 rounded ${color}`}>
      {status}
    </span>
  );
}