"use client";

import { useEffect } from "react";

type Mode = "light" | "dark";

export function PageTheme({ mode }: { mode: Mode }) {
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.dataset.theme;
    el.dataset.theme = mode;
    return () => {
      if (prev) el.dataset.theme = prev;
      else delete el.dataset.theme;
    };
  }, [mode]);

  return null;
}
