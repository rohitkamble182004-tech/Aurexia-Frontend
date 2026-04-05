"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/product";
import { useCart, type CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  const handleAddToBag = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // 🚫 Prevent Link navigation
    e.preventDefault();
    e.stopPropagation();

    const item: CartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      variantId: product.variants?.[0]?.id ?? ""
    };

    // 🔐 AUTH GATE (CRITICAL FIX)
    requireAuth(() => {
      addToCart(item);
    });
  };

  return (
    <article className="group cursor-pointer relative">
      {/* Product link */}
      <Link
        href={`/products/${product.slug}`}
        className="block"
      >
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={520}
          className="object-cover w-full"
        />

        <div className="mt-3">
          <p className="font-medium">
            {product.name}
          </p>
          <p className="text-sm text-neutral-500">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>

      {/* Add to Bag */}
      <button
        onClick={handleAddToBag}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 
                   opacity-0 group-hover:opacity-100 
                   transition bg-black text-white 
                   px-4 py-2 rounded"
      >
        Add to bag
      </button>
    </article>
  );
}
