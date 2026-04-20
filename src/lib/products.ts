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
  lowStockThreshold?: number;
  releasedAt?: string;
  reviews?: Review[];
};

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export function isLowStock(p: Product): boolean {
  if (p.soldOut) return false;
  if (typeof p.stock !== "number" || p.stock <= 0) return false;
  const threshold = p.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
  return p.stock <= threshold;
}

export const products: Product[] = raw as Product[];

const VALID_CATEGORIES: ReadonlySet<ProductCategory> = new Set([
  "hoodie",
  "tee",
  "pants",
  "mask",
  "shorts",
  "other",
]);

if (process.env.NODE_ENV !== "production") {
  for (const p of products) {
    if (typeof p.id !== "string" || !p.id) console.warn("[products] missing id", p);
    if (typeof p.name !== "string" || !p.name) console.warn(`[products] ${p.id}: missing name`);
    if (typeof p.priceEGP !== "number" || !Number.isFinite(p.priceEGP))
      console.warn(`[products] ${p.id}: invalid priceEGP`, p.priceEGP);
    if (typeof p.image !== "string" || !p.image) console.warn(`[products] ${p.id}: missing image`);
    if (!VALID_CATEGORIES.has(p.category))
      console.warn(`[products] ${p.id}: invalid category`, p.category);
  }
}

const productById = new Map<string, Product>(products.map((p) => [p.id, p]));

export function findProduct(id: string): Product | undefined {
  return productById.get(id);
}

export function averageRating(p: Product): number | null {
  if (!p.reviews || p.reviews.length === 0) return null;
  return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;
}
