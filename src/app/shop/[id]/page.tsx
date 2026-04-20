import { notFound } from "next/navigation";
import { findProduct, products } from "@/lib/products";
import { ProductDetail } from "./ProductDetail";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  const ids = new Set<string>();
  for (const p of products) {
    if (ids.has(p.id)) {
      console.warn(`[shop] duplicate product id skipped: ${p.id}`);
      continue;
    }
    ids.add(p.id);
  }
  return Array.from(ids, (id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return { title: "Not found" };
  const title = `${product.name} · LE ${product.priceEGP.toLocaleString("en-US")}`;
  const description = product.description ?? `Underground ${product.category}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
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
