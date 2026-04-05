"use client";

import { JSX, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { apiFetchJson } from "@/lib/api/client";

// Types
interface UserOrder {
  id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  productName: string;
  image?: string;
  quantity: number;
  price: number;
}

interface WardrobeItem {
  id: string;
  name: string;
  image?: string;
  category?: string;
}

export default function AccountPage(): JSX.Element {
  const pathname = usePathname();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState({
    orders: true,
    wardrobe: true,
  });
  const [error, setError] = useState({
    orders: null as string | null,
    wardrobe: null as string | null,
  });

  useEffect(() => {
    fetchOrders();
    fetchWardrobeItems();
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
      setError(prev => ({ ...prev, orders: "Failed to load orders" }));
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }

  async function fetchWardrobeItems(): Promise<void> {
    try {
      // If you have a wardrobe endpoint, use it
      const data = await apiFetchJson<WardrobeItem[]>(
        "/api/wardrobe/recent",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      ).catch(() => []); // Return empty array if endpoint doesn't exist yet
      
      setWardrobeItems(data || []);
    } catch (err) {
      // Don't show error for wardrobe if endpoint doesn't exist
      console.error("Wardrobe fetch error:", err);
      setWardrobeItems([]);
    } finally {
      setLoading(prev => ({ ...prev, wardrobe: false }));
    }
  }

  const lastFourWardrobeItems = wardrobeItems.slice(-4);
  const activeOrders = orders.filter(
    order => order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
  );
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Your Fashion Space
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your wardrobe and track your orders
        </p>
      </div>

      {/* Your Wardrobe Section */}
      <WardrobeSection
        pathname={pathname}
        items={lastFourWardrobeItems}
        isLoading={loading.wardrobe}
        error={error.wardrobe}
        totalItems={wardrobeItems.length}
      />

      {/* Upcoming Orders Section */}
      <UpcomingOrdersSection
        orders={activeOrders}
        isLoading={loading.orders}
        error={error.orders}
      />

      {/* Recent Orders Section */}
      {recentOrders.length > 0 && !loading.orders && (
        <RecentOrdersSection orders={recentOrders} />
      )}
    </div>
  );
}

// Wardrobe Section Component
function WardrobeSection({ 
  pathname, 
  items, 
  isLoading, 
  error, 
  totalItems 
}: { 
  pathname: string;
  items: WardrobeItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
}) {
  if (isLoading) {
    return <WardrobeSkeleton />;
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Wardrobe</h2>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <Link
          href="/account/orders"
          className={`group ${pathname === "/account/orders" ? "active" : ""}`}
        >
          <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
            Your Wardrobe
          </h2>
        </Link>
        
        {totalItems > 4 && (
          <Link 
            href="/account/orders"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            View all ({totalItems}) →
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">Your wardrobe is empty</p>
          <Link 
            href="/shop" 
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Explore products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => (
            <WardrobeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

// Upcoming Orders Section
function UpcomingOrdersSection({ 
  orders, 
  isLoading, 
  error 
}: { 
  orders: UserOrder[];
  isLoading: boolean;
  error: string | null;
}) {
  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Orders</h2>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Upcoming Orders</h2>
        {orders.length > 0 && (
          <Link 
            href="/account/orders"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            View all →
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">No upcoming orders</p>
          <Link 
            href="/shop" 
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Start shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}

// Recent Orders Section
function RecentOrdersSection({ orders }: { orders: UserOrder[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link 
          href="/account/orders"
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          View all orders →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <RecentOrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
}

// Card Components
function WardrobeCard({ item }: { item: WardrobeItem }) {
  return (
    <Link
      href={`/account/wardrobe/${item.id}`}
      className="group relative overflow-hidden rounded-lg border bg-white p-2 transition-all hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <span className="text-4xl">👕</span>
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-medium">{item.name}</p>
      {item.category && (
        <p className="text-xs text-gray-500">{item.category}</p>
      )}
    </Link>
  );
}

function OrderCard({ order }: { order: UserOrder }) {
  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const statusColor = statusColors[order.orderStatus] || "bg-gray-100 text-gray-800";

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-lg border p-4 transition-all hover:shadow-md hover:border-blue-500/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
          <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
            {order.orderStatus}
          </span>
        </div>
      </div>
    </Link>
  );
}

function RecentOrderCard({ order }: { order: UserOrder }) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-lg border p-3 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-sm">${order.totalAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{order.orderStatus}</p>
        </div>
      </div>
    </Link>
  );
}

// Loading Skeletons
function WardrobeSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}

function OrdersSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </section>
  );
}