"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DropNavItem } from "@/lib/navigation";
import { ChevronDown } from "lucide-react";

export default function MobileNav() {
  const [drops, setDrops] = useState<DropNavItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/nav`)
      .then((res) => res.json())
      .then(setDrops)
      .catch(() => setDrops([]));
  }, []);

  const toggleDrop = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
    setAboutOpen(false); // close About if open
  };

  const toggleAbout = () => {
    setAboutOpen(prev => !prev);
    setOpenId(null); // close category if open
  };

  return (
    <div className="flex flex-col gap-6">
      {/* PRODUCT DROPS */}
      {drops.map((drop) => {
        const isOpen = openId === drop.id;

        return (
          <div key={drop.id} className="space-y-3">
            {/* Parent */}
            <button
              onClick={() => toggleDrop(drop.id)}
              className="flex w-full items-center justify-between text-lg font-medium"
            >
              <span>{drop.name}</span>

              {drop.children && drop.children.length > 0 && (
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Children */}
            {isOpen && drop.children && (
              <div className="pl-4 space-y-2">
                {drop.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/drops/${child.slug}`}
                    className="block text-sm text-neutral-600"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* ABOUT (ACCORDION) */}
      <div className="pt-6 border-t space-y-3">
        <button
          onClick={toggleAbout}
          className="flex w-full items-center justify-between text-lg font-medium"
        >
          <span>About</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              aboutOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {aboutOpen && (
          <div className="pl-4 space-y-2">
            <Link href="/aboutus/the-house" className="block text-sm text-neutral-600">
              The House
            </Link>
            <Link href="/aboutus/notes" className="block text-sm text-neutral-600">
              Notes
            </Link>
            <Link href="/aboutus/care" className="block text-sm text-neutral-600">
              Care
            </Link>
            <Link href="/aboutus/craftsmanship" className="block text-sm text-neutral-600">
              Craftsmanship
            </Link>
            <Link href="/aboutus/responsibility" className="block text-sm text-neutral-600">
              Responsibility
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
