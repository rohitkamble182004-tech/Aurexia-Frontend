"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DropNavItem } from "@/lib/navigation";

export default function DesktopNav() {
  const [drops, setDrops] = useState<DropNavItem[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/nav`)
      .then((res) => res.json())
      .then(setDrops)
      .catch(() => setDrops([]));
  }, []);

  return (
    <nav className="hidden lg:flex justify-center-safe items-center gap-8 text-sm tracking-wide">
      {/* PRODUCT DROPS */}
      {drops.map((drop) => (
        <div key={drop.id} className="relative group py-2">
  <Link href={`/drops/${drop.slug}`} className="hover:opacity-70">
    {drop.name}
  </Link>

  {drop.children && drop.children.length > 0 && (
    <div className="absolute left-1/2 top-full -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border shadow-xl min-w-[260px] z-50">
      <ul className="py-4">
        {drop.children.map((child) => (
          <li key={child.id}>
            <Link
              href={`/drops/${child.slug}`}
              className={`block px-6 py-2 hover:bg-neutral-50 ${
                child.is_editorial ? "italic text-neutral-500" : ""
              }`}
            >
              {child.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
      ))}

      {/* ABOUT */}
      <div className="relative group">
        <Link href="/about/the-house" className="hover:opacity-70 py-3">
          About
        </Link>

        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 hidden group-hover:block bg-white border shadow-xl min-w-[240px] z-50">
          <ul className="py-4">
            <li><Link href="/about/the-house" className="block px-6 py-2 hover:bg-neutral-50">The House</Link></li>
            <li><Link href="/about/notes" className="block px-6 py-2 hover:bg-neutral-50">Notes</Link></li>
            <li><Link href="/about/care" className="block px-6 py-2 hover:bg-neutral-50">Care</Link></li>
            <li><Link href="/about/craftsmanship" className="block px-6 py-2 hover:bg-neutral-50">Craftsmanship</Link></li>
            <li><Link href="/about/responsibility" className="block px-6 py-2 hover:bg-neutral-50">Responsibility</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
