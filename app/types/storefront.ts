/* -------------------------
   Product card (grid / lists)
-------------------------- */
export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
};

/* -------------------------
   Full product (detail page)
-------------------------- */
export type StoreProduct = ProductCard & {
  description?: string;
  variants: ProductVariant[];
};

export type ProductVariant = {  // ✅ export keyword must be here
  id: string;
  size: string;
  color: string;
  stockQuantity: number;
};

/* -------------------------
   Drop / Collection
-------------------------- */
export type Drop = {
  id: string;
  name: string;
  slug: string;
  products: ProductCard[];
};

