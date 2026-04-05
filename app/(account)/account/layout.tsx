"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🔐 Protect account routes
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔝 Account Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            My Account
          </h1>

          <nav className="flex gap-4 text-sm">
            <AccountNavLink
              href="/account"
              active={pathname === "/account"}
            >
              Dashboard
            </AccountNavLink>

            <AccountNavLink
              href="/account/profile"
              active={pathname === "/account/profile"}
            >
              Profile
            </AccountNavLink>
          </nav>
        </div>
      </header>

      {/* 📦 Page Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

/* -----------------------------
   Reusable Nav Link
------------------------------ */
function AccountNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`pb-1 border-b-2 transition ${
        active
          ? "border-black text-black"
          : "border-transparent text-gray-500 hover:text-black"
      }`}
    >
      {children}
    </a>
  );
}
