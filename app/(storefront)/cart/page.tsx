"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } =
    useCart();
  const { requireAuth } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    requireAuth(() => {
      router.push("/checkout");
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-medium mb-4">
          Your bag is empty
        </h1>

        <p className="text-neutral-500 mb-8">
          Discover our latest collections.
        </p>

        <Link
          href="/products"
          className="inline-block border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      {/* LEFT — ITEMS */}
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-3xl font-medium">
          Shopping Bag
        </h1>

        {items.map((item) => (
          <div
            key={`${item.id}-${item.variantId}`}
            className="flex gap-6 border-b pb-6"
          >
            <div className="relative w-28 h-36 bg-neutral-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-medium mb-1">
                {item.name}
              </p>

              <p className="text-sm text-neutral-500 mb-4">
                ${item.price.toFixed(2)}
              </p>

              <div className="flex items-center gap-4">
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      item.variantId,
                      Number(e.target.value)
                    )
                  }
                  className="border px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      Qty {q}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    removeFromCart(
                      item.id,
                      item.variantId
                    )
                  }
                  className="text-sm underline text-neutral-500 hover:text-black"
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT — SUMMARY */}
      <div className="border p-8 h-fit">
        <h2 className="text-lg font-medium mb-6">
          Order Summary
        </h2>

        <div className="flex justify-between text-sm mb-3">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm mb-3">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <div className="flex justify-between font-medium text-lg border-t pt-4 mb-6">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-neutral-800 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}