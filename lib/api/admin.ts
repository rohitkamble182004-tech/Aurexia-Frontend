import { adminFetch } from './client'

export type AdminProduct = {
  id: string
  name: string
  price: number
  categoryId: string
  description?: string
  imageUrl?: string
}

export type ProductPayload = {
  name: string
  description?: string
  price: number
  categoryId: string
  image?: File | null
}

/**
 * PRODUCTS
 */
export function getAdminProducts() {
  return adminFetch<AdminProduct[]>('/api/admin/products')
}

export function getAdminProduct(id: string) {
  return adminFetch<AdminProduct>(`/api/admin/products/${id}`)
}

/**
 * CREATE PRODUCT (multipart/form-data)
 * Matches Swagger exactly
 */
export function createProduct(payload: ProductPayload) {
  const fd = new FormData()
  fd.append('Name', payload.name)
  fd.append('Price', String(payload.price))
  fd.append('CategoryId', payload.categoryId)

  if (payload.description) {
    fd.append('Description', payload.description)
  }

  if (payload.image) {
    fd.append('Image', payload.image)
  }

  return adminFetch<{ id: string }>('/api/admin/products', {
    method: 'POST',
    body: fd,
  })
}

/**
 * UPDATE PRODUCT (multipart/form-data)
 * Matches Swagger exactly
 */
export function updateProduct(
  id: string,
  payload: ProductPayload
) {
  const fd = new FormData()
  fd.append('Name', payload.name)
  fd.append('Price', String(payload.price))
  fd.append('CategoryId', payload.categoryId)

  if (payload.description) {
    fd.append('Description', payload.description)
  }

  if (payload.image) {
    fd.append('Image', payload.image)
  }

  return adminFetch<void>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: fd,
  })
}

export function deleteProduct(id: string) {
  return adminFetch<void>(`/api/admin/products/${id}`, {
    method: 'DELETE',
  })
}
