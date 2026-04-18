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
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
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
    window.addEventListener("underground:recently-viewed-changed", onChange);
    return () => {
      window.removeEventListener("underground:recently-viewed-changed", onChange);
    };
  }, []);

  return ids;
}
