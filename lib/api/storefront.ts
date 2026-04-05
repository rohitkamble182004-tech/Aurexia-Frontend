import { apiFetch, apiFetchJson } from "./client";
import type { Drop, StoreProduct } from "@/app/types/storefront";

/* -------------------------
   Home page
-------------------------- */
export function fetchHomeDrops(): Promise<Drop[]> {
  return apiFetchJson<Drop[]>("/api/storefront/home");
}

/* -------------------------
   Header navigation
-------------------------- */
export function fetchNavDrops(): Promise<
  Pick<Drop, "id" | "name" | "slug">[]
> {
  return apiFetchJson<Pick<Drop, "id" | "name" | "slug">[]>(
    "/api/storefront/nav"
  );
}

/* -------------------------
   Drop landing metadata
-------------------------- */
export async function fetchDrop(
  slug: string
): Promise<Drop | null> {
  try {
    return await apiFetchJson<Drop>(
      `/api/storefront/drops/${slug}`
    );
  } catch {
    return null;
  }
}

/* -------------------------
   Product grid (shop all / by drop)
-------------------------- */
export function fetchProducts(
  drop?: string
): Promise<StoreProduct[]> {
  const query = drop ? `?drop=${encodeURIComponent(drop)}` : "";
  return apiFetchJson<StoreProduct[]>(`/api/products${query}`);
}

/* -------------------------
   Product detail
-------------------------- */
export async function fetchProduct(
  slug: string
): Promise<StoreProduct | null> {
  try {
    return await apiFetchJson<StoreProduct>(
      `/api/products/${slug}`
    );
  } catch {
    return null;
  }
}
/* -------------------------
   Product Search
-------------------------- */
export function searchProducts(query: string) {
  return apiFetch<StoreProduct[]>(
    `/api/products?search=${encodeURIComponent(query)}`
  );
}
