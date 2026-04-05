'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/api/client'

type AdminProduct = {
  id: string
  name: string
  price: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    adminFetch<AdminProduct[]>('/api/admin/products')
      .then((data) => {
        if (!mounted || !data) return
        setProducts(data)
      })
      .catch((err: unknown) => {
        if (!mounted) return
        if (err instanceof Error) setError(err.message)
        else setError('Failed to load products')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading products…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>

        <Link
          href="/admin/products/new"
          className="rounded border px-3 py-1.5 text-sm hover:bg-gray-700"
        >
          + New Product
        </Link>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="rounded border border-dashed p-6 text-center">
          <p className="text-sm text-gray-500">
            No products created yet.
          </p>

          <Link
            href="/admin/products/new"
            className="inline-block mt-3 text-sm underline"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        /* PRODUCT LIST */
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded border p-4 hover:bg-gray-700 transition"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  ${p.price.toFixed(2)}
                </p>
              </div>

              <Link
                href={`/admin/products/${p.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
