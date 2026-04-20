"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "underground.recently.v1";
const MAX = 8;

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, MAX);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.warn("[recentlyViewed] stored JSON is corrupted — purging", err);
      try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    } else {
      console.warn("[recentlyViewed] read failed — localStorage unavailable", err);
    }
    return [];
  }
}

function save(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn("[recentlyViewed] persistence failed", err);
  }
}

export function recordView(id: string) {
  if (typeof window === "undefined") return;
  const current = load().filter((x) => x !== id);
  current.unshift(id);
  save(current.slice(0, MAX));
  window.dispatchEvent(new CustomEvent("underground:recently-viewed-changed"));
}

export function useRecentlyViewed(): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(load());
    const onChange = () => setIds(load());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(load());
    };
    window.addEventListener("underground:recently-viewed-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("underground:recently-viewed-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return ids;
}
