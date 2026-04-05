export interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  description?: string;
  metadata?: Record<string, unknown>;
    variants: {
    id: string
    sku: string
    size: string
    color: string
  }[]
}

