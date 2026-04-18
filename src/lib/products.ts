import raw from "@/content/products.json";

export type ProductCategory =
  | "hoodie"
  | "tee"
  | "pants"
  | "mask"
  | "shorts"
  | "other";

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
};

export const products: Product[] = raw as Product[];

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
