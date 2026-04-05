"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminAuthGate from "@/components/AdminAuthGate";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin/" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Products", href: "/admin/products" },
  { label: "Drops", href: "/admin/drops" },
  { label: "Tags", href: "/admin/tags" },
  { label: "Rules", href: "/admin/rules" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Chats", href: "/admin/chat" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <AdminAuthGate>
      <div className="flex h-screen bg-neutral-950 text-neutral-100">
        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900">
          <div className="px-6 py-5 border-b border-neutral-800">
            <h2 className="text-lg font-bold tracking-wide">
              AUREXIA<span className="text-purple-500">.ADMIN</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Fashion Control Panel
            </p>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                    ${
                      active
                        ? "bg-purple-600/20 text-white border-l-2 border-purple-500"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? "bg-purple-500" : "bg-neutral-600"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between h-14 px-6 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
            <h1 className="text-sm font-medium tracking-wide text-neutral-300">
              Admin Panel
            </h1>

            <button
              onClick={logout}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              Logout
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGate>
  );
}
