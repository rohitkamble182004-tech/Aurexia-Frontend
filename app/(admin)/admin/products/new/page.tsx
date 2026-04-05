"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api/client";

type Category = {
  id: string;
  name: string;
};

type Variant = {
  size: string;
  color: string;
  stockQuantity: number;
};

export default function NewProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([
    { size: "", color: "", stockQuantity: 0 },
  ]);

  // Load categories
  useEffect(() => {
    adminFetch<Category[]>("/api/categories")
      .then((data) => {
        if (data) setCategories(data);
      })
      .catch(console.error);
  }, []);

  function addVariant() {
    setVariants([
      ...variants,
      { size: "", color: "", stockQuantity: 0 },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string | number
  ) {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setVariants(updated);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function create() {
    if (!categoryId) return;

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("Name", name);
      fd.append("Price", String(price));
      fd.append("CategoryId", categoryId);

      if (description) {
        fd.append("Description", description);
      }

      if (image) {
        fd.append("Image", image);
      }

      // send variants
      fd.append("Variants", JSON.stringify(variants));

      await adminFetch("/api/admin/products", {
        method: "POST",
        body: fd,
      });

      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6 p-6">
      <h1 className="text-xl font-semibold">New Product</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 w-full"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(e.target.files?.[0] ?? null)
        }
      />

      {/* VARIANTS */}
      <div className="space-y-4">
        <h2 className="font-medium">Variants</h2>

        {variants.map((v, i) => (
          <div
            key={i}
            className="grid grid-cols-3 gap-2 items-center"
          >
            <input
              placeholder="Size"
              value={v.size}
              onChange={(e) =>
                updateVariant(i, "size", e.target.value)
              }
              className="border p-2"
            />

            <input
              placeholder="Color"
              value={v.color}
              onChange={(e) =>
                updateVariant(i, "color", e.target.value)
              }
              className="border p-2"
            />

            <input
              type="number"
              placeholder="Stock"
              value={v.stockQuantity}
              onChange={(e) =>
                updateVariant(
                  i,
                  "stockQuantity",
                  Number(e.target.value)
                )
              }
              className="border p-2"
            />

            <button
              onClick={() => removeVariant(i)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addVariant}
          className="border px-3 py-2 text-sm"
        >
          + Add Variant
        </button>
      </div>

      <button
        onClick={create}
        disabled={loading || !categoryId}
        className="bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create"}
      </button>
    </div>
  );
}