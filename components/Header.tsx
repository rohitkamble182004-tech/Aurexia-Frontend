"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";

import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import SearchOverlay from "@/components/SearchOverlay";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6">

          {/* ================= TOP ROW ================= */}
          <div className="relative flex h-16 items-center">

            {/* LEFT: MOBILE MENU */}
            <div className="flex items-center w-20">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden text-neutral-700"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* LOGO */}
            <Link
              href="/"
              className="
                absolute left-1/2 top-1/2
                -translate-x-1/2 -translate-y-1/2
                text-lg font-semibold tracking-[0.3em]
              "
            >
              AUREXIA
            </Link>

            {/* RIGHT: SEARCH + CART */}
            <div className="ml-auto flex items-center gap-5 w-20 justify-end">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="text-neutral-700 hover:text-black"
              >
                <Search size={20} />
              </button>

              <Link
                href="/cart"
                aria-label="Cart"
                className="text-neutral-700 hover:text-black"
              >
                <ShoppingBag size={20} />
              </Link>
            </div>
          </div>

          {/* ================= DESKTOP NAV ================= */}
          <DesktopNav />
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="fixed inset-0 z-[60] bg-white lg:hidden">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <span className="text-lg font-semibold tracking-[0.3em]">
                AUREXIA
              </span>

              <button onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <nav className="px-6 py-8">
              <MobileNav />
            </nav>
          </div>
        )}
      </header>

      {/* ================= SEARCH OVERLAY ================= */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
