import ProductGrid from "@/components/ProductGrid";
import { apiFetch } from "@/lib/api/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { StoreProduct } from "@/app/types/storefront";

interface ProductsPageProps {
  searchParams?: {
    search?: string;
  };
}

export const metadata: Metadata = {
  title: "Shop All | AUREXIA",
  description:
    "Explore the complete AUREXIA collection — timeless essentials and seasonal designs.",
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams; // ✅ unwrap the promise
  const search = params?.search?.trim();

  const products = await apiFetch<StoreProduct[]>(
    search
      ? `/api/products?search=${encodeURIComponent(search)}`
      : "/api/products"
  );

  if (!products) {
    notFound();
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {search ? `Search results for “${search}”` : "Shop All"}
        </h1>

        <p className="mt-4 text-neutral-600">
          {search
            ? `Showing products related to “${search}”.`
            : "A complete view of the AUREXIA collection — refined essentials and seasonal statements."}
        </p>
      </header>

      {products.length === 0 ? (
        <p className="text-neutral-500">No products found.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
