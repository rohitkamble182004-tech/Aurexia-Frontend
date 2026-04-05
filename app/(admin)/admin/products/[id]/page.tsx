"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { adminFetch } from "@/lib/api/client"

type Variant = {
  id?: string
  size: string
  color: string
  stockQuantity: number
}

type Product = {
  id: string
  name: string
  price: number
  description: string
  categoryId: string
  variants: Variant[]
}

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // =====================
  // Load Product
  // =====================

  useEffect(() => {
    adminFetch<Product>(`/api/admin/products/${id}`)
      .then((data) => {
        if (data) {
          setProduct({
            ...data,
            variants: data.variants ?? [],
          })
        }
      })
      .catch(console.error)
  }, [id])

  if (!product) {
    return <p className="p-6">Loading…</p>
  }

  // =====================
  // Variant Helpers
  // =====================

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string | number
  ) {
    setProduct((prev) => {
      if (!prev) return prev

      const updated = [...prev.variants]

      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        variants: updated,
      }
    })
  }

  function addVariant() {
    setProduct((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        variants: [
          ...prev.variants,
          { size: "", color: "", stockQuantity: 0 },
        ],
      }
    })
  }

  function removeVariant(index: number) {
    setProduct((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }
    })
  }
console.log("VariantsJson", JSON.stringify(product.variants))
  // =====================
  // Save Product
  // =====================

  async function save() {
    if (!product) return

    setLoading(true)

    try {
      const fd = new FormData()

      fd.append("Name", product.name)
      fd.append("Price", String(product.price))
      fd.append("CategoryId", product.categoryId)
      fd.append("Description", product.description)

      fd.append(
        "VariantsJson",
        JSON.stringify(product.variants)
      )

      if (image) {
        fd.append("Image", image)
      }

      await adminFetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: fd,
      })

      router.push("/admin/products")
    } finally {
      setLoading(false)
    }
  }

  // =====================
  // Delete Product
  // =====================

  async function remove() {
    await adminFetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    })

    router.push("/admin/products")
  }

  // =====================
  // UI
  // =====================

  return (
    <div className="max-w-xl space-y-6 p-6">
      <h1 className="text-xl font-semibold">
        Edit Product
      </h1>

      {/* Product Fields */}

      <input
        value={product.name}
        onChange={(e) =>
          setProduct({
            ...product,
            name: e.target.value,
          })
        }
        className="border p-2 w-full"
        placeholder="Product name"
      />

      <textarea
        value={product.description}
        onChange={(e) =>
          setProduct({
            ...product,
            description: e.target.value,
          })
        }
        className="border p-2 w-full"
        placeholder="Description"
      />

      <input
        type="number"
        value={product.price}
        onChange={(e) =>
          setProduct({
            ...product,
            price: Number(e.target.value),
          })
        }
        className="border p-2 w-full"
        placeholder="Price"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(e.target.files?.[0] ?? null)
        }
      />

      {/* Variants */}

      <div className="space-y-4">
        <h2 className="font-medium">Variants</h2>

        {product.variants.map((v, i) => (
          <div
            key={i}
            className="grid grid-cols-3 gap-2"
          >
            <input
              value={v.size}
              onChange={(e) =>
                updateVariant(
                  i,
                  "size",
                  e.target.value
                )
              }
              placeholder="Size"
              className="border p-2"
            />

            <input
              value={v.color}
              onChange={(e) =>
                updateVariant(
                  i,
                  "color",
                  e.target.value
                )
              }
              placeholder="Color"
              className="border p-2"
            />

            <input
              type="number"
              value={v.stockQuantity}
              onChange={(e) =>
                updateVariant(
                  i,
                  "stockQuantity",
                  Number(e.target.value)
                )
              }
              placeholder="Stock"
              className="border p-2"
            />

            <button
              onClick={() => removeVariant(i)}
              className="text-red-600 text-sm"
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

      {/* Actions */}

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={loading}
          className="bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save"}
        </button>

        <button
          onClick={remove}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}