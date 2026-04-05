import { notFound } from "next/navigation";
import { fetchDrop } from "@/lib/api/storefront";

export default async function DropPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ unwrap params (App Router requirement)
  const { slug } = await params;

  // ✅ fetch drop WITH products
  const drop = await fetchDrop(slug);
  if (!drop) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-8 font-medium">{drop.name}</h1>

      {drop.products.length === 0 ? (
        <p className="text-sm text-gray-500">
          No products in this drop.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {drop.products.map((p) => (
            <a
              key={p.id}
              href={`/products/${p.slug}`} // ✅ fixed route
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
              <p className="text-sm text-neutral-500">
                ${p.price}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
