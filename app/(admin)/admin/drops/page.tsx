'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/api/client'

type Drop = {
  id: string
  name: string
  slug: string
  parentId?: string | null
}

type Product = {
  id: string
  name: string
}

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [dropProducts, setDropProducts] = useState<Product[]>([])
  const [activeDrop, setActiveDrop] = useState<Drop | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function load() {
      const [dropData, productData] = await Promise.all([
        adminFetch<Drop[]>('/api/admin/drops'),
        adminFetch<Product[]>('/api/admin/products'),
      ])

      if (dropData) setDrops(dropData)
      if (productData) setAllProducts(productData)
    }

    load().catch(console.error)
  }, [])
console.log(drops)
  /* ================= GROUP DROPS ================= */
  const parentDrops = useMemo(
    () => drops.filter((d) => !d.parentId),
    [drops]
  )

  const childrenByParent = useMemo(() => {
    const map: Record<string, Drop[]> = {}

    for (const drop of drops) {
      if (drop.parentId) {
        if (!map[drop.parentId]) {
          map[drop.parentId] = []
        }
        map[drop.parentId].push(drop)
      }
    }

    return map
  }, [drops])

  const isParent = (drop: Drop) =>
    !!childrenByParent[drop.id]?.length

  /* ================= LOAD PRODUCTS ================= */
  async function loadDropProducts(drop: Drop) {
    setActiveDrop(drop)
    setLoading(true)

    try {
      let products: Product[] = []

      if (isParent(drop)) {
        // Load all children products
        const children = childrenByParent[drop.id] || []

        const results = await Promise.all(
          children.map((child) =>
            adminFetch<Product[]>(
              `/api/admin/drops/${child.id}/products`
            )
          )
        )

        results.forEach((res) => {
          if (res) products.push(...res)
        })
      } else {
        const res = await adminFetch<Product[]>(
          `/api/admin/drops/${drop.id}/products`
        )
        if (res) products = res
      }

      // Remove duplicates
      const unique = Array.from(
        new Map(products.map((p) => [p.id, p])).values()
      )

      setDropProducts(unique)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= ADD PRODUCT ================= */
  async function addToDrop(productId: string) {
    if (!activeDrop || isParent(activeDrop)) return

    await adminFetch(
      `/api/admin/drops/${activeDrop.id}/products/${productId}`,
      { method: 'POST' }
    )

    const added = allProducts.find((p) => p.id === productId)
    if (added) {
      setDropProducts((prev) => [...prev, added])
    }
  }

  /* ================= REMOVE PRODUCT ================= */
  async function removeFromDrop(productId: string) {
    if (!activeDrop || isParent(activeDrop)) return

    await adminFetch(
      `/api/admin/drops/${activeDrop.id}/products/${productId}`,
      { method: 'DELETE' }
    )

    setDropProducts((prev) =>
      prev.filter((p) => p.id !== productId)
    )
  }

  const availableProducts = allProducts.filter(
    (p) => !dropProducts.some((dp) => dp.id === p.id)
  )

  /* ================= UI ================= */
  return (
    <div className="max-w-xl space-y-6 p-6">
      <h1 className="text-xl font-semibold">Drops</h1>

      {/* ===== HIERARCHY ===== */}
      <ul className="space-y-4">
        {parentDrops.map((parent) => (
          <li key={parent.id} className="space-y-1">
            <button
              onClick={() => loadDropProducts(parent)}
              className="font-semibold underline"
            >
              {parent.name}
            </button>

            {childrenByParent[parent.id] && (
              <ul className="ml-4 space-y-1">
                {childrenByParent[parent.id].map((child) => (
                  <li key={child.id}>
                    <button
                      onClick={() => loadDropProducts(child)}
                      className="text-sm underline"
                    >
                      └ {child.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* ===== PRODUCTS PANEL ===== */}
      {activeDrop && (
        <div className="space-y-4">
          <h2 className="font-medium">
            Products in “{activeDrop.name}”
          </h2>

          {loading && <p>Loading...</p>}

          {!loading && dropProducts.length === 0 && (
            <p className="text-sm text-gray-500">
              No products assigned
            </p>
          )}

          <ul className="space-y-1">
            {dropProducts.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center"
              >
                <span>{p.name}</span>

                {!isParent(activeDrop) && (
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm text-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => removeFromDrop(p.id)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {!isParent(activeDrop) &&
            availableProducts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  Add product
                </h3>

                <ul className="space-y-1">
                  {availableProducts.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between"
                    >
                      <span>{p.name}</span>

                      <button
                        onClick={() => addToDrop(p.id)}
                        className="text-sm text-blue-600"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  )
}