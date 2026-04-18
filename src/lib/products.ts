import raw from "@/content/products.json";

export type ProductCategory =
  | "hoodie"
  | "tee"
  | "pants"
  | "mask"
  | "shorts"
  | "other";

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
};

export type Product = {
  id: string;
  name: string;
  priceEGP: number;
  image: string;
  gallery?: string[];
  category: ProductCategory;
  description?: string;
  fabric?: string;
  sizes?: string[];
  signature?: boolean;
  caption?: string;
  soldOut?: boolean;
  stock?: number;
  releasedAt?: string;
  reviews?: Review[];
};

export const products: Product[] = raw as Product[];

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function averageRating(p: Product): number {
  if (!p.reviews || p.reviews.length === 0) return 0;
  return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;
}
