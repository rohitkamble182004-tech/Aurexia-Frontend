"use client";

import Link from "next/link";
import type { ProductCard } from "@/app/types/storefront";

export default function ProductGrid({
  products,
}: {
  products: ProductCard[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.slug}`}
          className="block space-y-2 group"
        >
          {/* IMAGE */}
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 rounded-lg">
            <img
              src={p.imageUrl ?? "/placeholder.png"}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* TEXT */}
          <p className="text-sm font-medium">{p.name}</p>
          <p className="text-sm text-neutral-500">${p.price}</p>
        </Link>
      ))}
    </div>
  );
}
