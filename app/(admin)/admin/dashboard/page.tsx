"use client";

import { JSX, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api/client";

interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  stockQuantity: number;
  variantId : string;
  productName : string;
  size : string;
  color : string;
}

interface OrderSummary {
  id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export default function AdminDashboardPage(): JSX.Element {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData(): Promise<void> {
    try {
      const statsData = await adminFetch<DashboardStats>(
        "/api/admin/dashboard"
      );

      const lowData = await adminFetch<LowStockProduct[]>(
        "/api/admin/low-stock"
      );

      const ordersData = await adminFetch<OrderSummary[]>(
        "/api/admin/orders?limit=5"
      );

      setStats(statsData as DashboardStats);
      setLowStock(lowData as LowStockProduct[]);
      setRecentOrders(ordersData as OrderSummary[]);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!stats) return <p className="p-6">No data available.</p>;

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
        <StatCard title="Today Revenue" value={`$${stats.todayRevenue}`} />
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} />
        <StatCard title="Pending Orders" value={stats.pendingOrders.toString()} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Order</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
  <h2 className="text-xl font-semibold mb-4 text-red-600">
    Low Stock Alerts
  </h2>

  {lowStock.length === 0 ? (
    <p>No low stock items.</p>
  ) : (
    lowStock.map((variant) => (
      <div key={variant.variantId}>
        {variant.productName} ({variant.size}/{variant.color}) —{" "}
        {variant.stockQuantity} left
      </div>
    ))
  )}
</section>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}): JSX.Element {
  return (
    <div className="border p-4 rounded shadow-sm">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
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