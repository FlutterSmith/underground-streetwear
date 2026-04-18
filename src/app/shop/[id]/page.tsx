import { notFound } from "next/navigation";
import { findProduct, products } from "@/lib/products";
import { ProductDetail } from "./ProductDetail";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} · LE ${product.priceEGP.toLocaleString("en-US")}`,
    description: product.description ?? `Underground ${product.category}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
