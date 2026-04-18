"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = "EGP" | "USD" | "EUR";

// TODO(template-buyer): replace with live FX (e.g. exchangerate.host) on a 24h cache.
const RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 1 / 48,
  EUR: 1 / 52,
};

const SYMBOL: Record<Currency, string> = {
  EGP: "LE",
  USD: "$",
  EUR: "€",
};

const STORAGE_KEY = "underground.currency.v1";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (egp: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EGP");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Currency | null;
      if (saved && saved in RATES) setCurrencyState(saved);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }

  const value = useMemo<CurrencyContextValue>(() => {
    const cur = hydrated ? currency : "EGP";
    return {
      currency: cur,
      setCurrency,
      symbol: SYMBOL[cur],
      format: (egp: number) => {
        const converted = egp * RATES[cur];
        const rounded = cur === "EGP" ? Math.round(converted) : Math.round(converted * 100) / 100;
        const formatted = rounded.toLocaleString("en-US", {
          minimumFractionDigits: cur === "EGP" ? 0 : 2,
          maximumFractionDigits: cur === "EGP" ? 0 : 2,
        });
        return `${SYMBOL[cur]} ${formatted}`;
      },
    };
  }, [currency, hydrated]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
