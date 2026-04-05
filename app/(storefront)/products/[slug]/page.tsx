import { notFound } from "next/navigation";
import { fetchProduct } from "@/lib/api/storefront";
import ProductClient from "./ProductClient";
import type { StoreProduct } from "@/app/types/storefront";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: PageProps) {
  // ✅ unwrap params (required in newer Next.js)
  const { slug } = await params;

  const product: StoreProduct | null =
    await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  // ✅ UI is rendered ONLY in ProductClient
  return <ProductClient product={product} />;
}
