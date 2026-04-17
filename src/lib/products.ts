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
  category: ProductCategory;
  signature?: boolean;
  caption?: string;
};

export const products: Product[] = raw as Product[];
