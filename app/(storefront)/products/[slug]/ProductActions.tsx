"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { StoreProduct, ProductVariant } from "@/app/types/storefront";

export default function ProductActions({
  product,
  selectedSize,
  selectedImage,
}: {
  product: StoreProduct;
  selectedSize: string | null;
  selectedImage: string;
}) {
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();
  const router = useRouter();

const handleAddToBag = () => {
  if (!selectedSize) return;
    console.log("Selected size:", selectedSize);
  console.log("Available variants:", product.variants);

  const matchedVariant = product.variants?.find(
    (v: ProductVariant) => v.size === selectedSize
  );

  if (!matchedVariant) {
    console.error("No variant found for size:", selectedSize);
    return;
  }

  requireAuth(() => {
    addToCart({
      id: product.id,
      name: product.name,
      image: selectedImage,
      price: product.price,
      quantity: 1,
      variantId: matchedVariant.id, // ✅ correct
    });

    router.push("/checkout");
  });
};

  return (
    <button
      onClick={handleAddToBag}
      className="w-full bg-[#c8a06d] text-white py-4"
    >
      Add to Bag
    </button>
  );
}
