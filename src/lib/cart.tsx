"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";
import { findProduct } from "@/lib/products";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  priceEGP: number;
  image: string;
  size: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (
    product: Product,
    size: string,
    qty?: number,
    options?: { silent?: boolean },
  ) => { added: number; capped: boolean };
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "underground.cart.v1";

function isCartItem(x: unknown): x is CartItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.productId === "string" &&
    typeof o.name === "string" &&
    typeof o.priceEGP === "number" && Number.isFinite(o.priceEGP) &&
    typeof o.image === "string" &&
    typeof o.size === "string" &&
    typeof o.qty === "number" && Number.isFinite(o.qty) && o.qty > 0
  );
}

function loadItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.warn("[cart] stored JSON is corrupted — purging", err);
      try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    } else {
      console.warn("[cart] read failed — localStorage unavailable", err);
    }
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadItems();
    setItems((prev) => {
      if (prev.length === 0) return saved;
      if (saved.length === 0) return prev;
      const byId = new Map(saved.map((i) => [i.id, i]));
      for (const p of prev) {
        const existing = byId.get(p.id);
        byId.set(
          p.id,
          existing ? { ...existing, qty: Math.min(99, existing.qty + p.qty) } : p,
        );
      }
      return Array.from(byId.values());
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("[cart] persistence failed — cart will not survive reload", err);
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const add = useCallback<CartContextValue["add"]>((product, size, qty = 1, options) => {
    const requested = Math.floor(qty);
    if (!Number.isFinite(requested) || requested <= 0) {
      return { added: 0, capped: false };
    }
    const lineId = `${product.id}__${size}`;
    const existing = items.find((i) => i.id === lineId);
    const currentQty = existing?.qty ?? 0;
    const nextQty = Math.min(99, currentQty + requested);
    const added = nextQty - currentQty;
    const capped = added < requested;
    setItems((prev) => {
      const existingInPrev = prev.find((i) => i.id === lineId);
      if (existingInPrev) {
        const nextInPrev = Math.min(99, existingInPrev.qty + requested);
        return prev.map((i) =>
          i.id === lineId ? { ...i, qty: nextInPrev } : i,
        );
      }
      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          name: product.name,
          priceEGP: product.priceEGP,
          image: product.image,
          size,
          qty: Math.min(99, requested),
        },
      ];
    });
    if (!options?.silent) setIsOpen(true);
    return { added, capped };
  }, [items]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const floored = Math.floor(qty);
    if (!Number.isFinite(floored) || floored <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    const clamped = Math.min(99, floored);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: clamped } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + Math.max(0, i.qty), 0);
    const subtotal =
      Math.round(
        items.reduce(
          (s, i) => s + i.qty * (findProduct(i.productId)?.priceEGP ?? i.priceEGP) * 100,
          0,
        ),
      ) / 100;
    return { items, count, subtotal, hydrated, isOpen, openCart, closeCart, add, remove, setQty, clear };
  }, [items, hydrated, isOpen, openCart, closeCart, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
