"use client";

import { JSX, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api/client";

interface AnalyticsStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
}

export default function AnalyticsPage(): JSX.Element {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAnalytics();
  }, []);

  async function fetchAnalytics(): Promise<void> {
    try {
      const data = await adminFetch<AnalyticsStats>(
        "/api/admin/dashboard"
      );

      setStats(data as AnalyticsStats);
    } catch (err: unknown) {
      console.error("Analytics fetch error:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="p-6">Loading analytics...</p>;

  if (error)
    return <p className="p-6 text-red-600">{error}</p>;

  if (!stats)
    return <p className="p-6">No analytics available.</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Revenue Analytics</h1>

      <div className="grid grid-cols-2 gap-6">
        <AnalyticsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
        />
        <AnalyticsCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue}`}
        />
      </div>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
}: {
  title: string;
  value: string;
}): JSX.Element {
  return (
    <div className="border p-6 rounded shadow-sm">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}