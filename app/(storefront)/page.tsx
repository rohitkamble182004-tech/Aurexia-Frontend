import { notFound } from "next/navigation";
import { fetchHomeDrops } from "@/lib/api/storefront";
import ProductGrid from "@/components/ProductGrid";

export default async function HomePage() {
  const drops = await fetchHomeDrops();

  if (!drops || drops.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-12">
      {drops.map((drop) =>
        drop.products && drop.products.length > 0 ? (
          <section key={drop.id}>
            <h2 className="mb-6 text-xl font-semibold">
              {drop.name}
            </h2>

            <ProductGrid products={drop.products} />
          </section>
        ) : null
      )}
    </div>
  );
}
