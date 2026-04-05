"use client";

import { useState } from "react";
import Image from "next/image";
import ProductActions from "./ProductActions";
import type { StoreProduct } from "@/app/types/storefront";

export default function ProductClient({
  product,
}: {
  product: StoreProduct;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-20">
      {/* IMAGE */}
      <div className="relative aspect-[3/4] bg-neutral-100">
        <Image
          src={product.imageUrl ?? "/placeholder.jpg"}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* PRODUCT INFO */}
      <div>
        <h1 className="text-3xl font-medium mb-3">
          {product.name}
        </h1>

        <p className="text-xl mb-6">
          ${product.price.toFixed(2)}
        </p>

        {/* SIZE (example) */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-3">
            Size
          </p>

          <div className="flex gap-3">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border ${
                  selectedSize === size
                    ? "border-black"
                    : "border-neutral-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 🔥 ACTIONS */}
        <ProductActions
          product={product}
          selectedSize={selectedSize}
          selectedImage={
            product.imageUrl ?? "/placeholder.jpg"
          }
        />

        {product.description && (
          <p className="mt-10 text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </section>
  );
}
