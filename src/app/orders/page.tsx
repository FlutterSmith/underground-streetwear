"use client";

import { useState, type FormEvent } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FormField } from "@/components/FormField";
import { BarButton } from "@/components/BarButton";

type Status = "placed" | "packed" | "shipped" | "out-for-delivery" | "delivered";

const STAGES: { key: Status; label: string }[] = [
  { key: "placed", label: "Order placed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out-for-delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

type Order = {
  number: string;
  email: string;
  placedAt: string;
  status: Status;
  carrier: string;
  trackingId: string;
  itemCount: number;
};

function mockLookup(orderNumber: string, email: string): Order | null {
  const trimmed = orderNumber.trim();
  if (!/^UG-\d{2}-\d{4}$/i.test(trimmed)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  // TODO(template-buyer): replace with real lookup against your orders store.
  const seed = trimmed.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const stageIdx = seed % STAGES.length;
  const placedDays = (seed % 9) + 1;
  const placed = new Date(Date.now() - placedDays * 24 * 60 * 60 * 1000);
  return {
    number: trimmed.toUpperCase(),
    email,
    placedAt: placed.toISOString().slice(0, 10),
    status: STAGES[stageIdx].key,
    carrier: stageIdx >= 2 ? "Aramex" : "Pending",
    trackingId: stageIdx >= 2 ? `ARX${seed * 9}` : "Pending",
    itemCount: (seed % 3) + 1,
  };
}

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = mockLookup(orderNumber, email);
    setBusy(false);
    if (!result) {
      setError("We couldn't find an order matching that number and email.");
      setOrder(null);
      return;
    }
    setOrder(result);
  }

  function reset() {
    setOrder(null);
    setOrderNumber("");
    setEmail("");
    setError(null);
  }

  return (
    <>
      <Nav />
      <main className="max-w-xl mx-auto px-6 pb-24">
        <div className="text-center mt-6 mb-12">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 mb-6">
            &mdash; track order &mdash;
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight">
            where&apos;s my drop?
          </h1>
          <p className="text-black/60 mt-4">
            Enter your order number and the email used at checkout.
          </p>
        </div>

        {!order ? (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <FormField
              label="Order number"
              name="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="UG-26-1234"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
            />
            {error && (
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="h-12 border border-black font-mono text-sm tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-40"
            >
              {busy ? "Checking..." : "Track"}
            </button>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 text-center">
              Lost your order number? Email{" "}
              <a href="mailto:hello@underground.label" className="underline">
                hello@underground.label
              </a>
            </p>
          </form>
        ) : (
          <article className="border border-black/15 p-6 flex flex-col gap-8">
            <header className="flex flex-col gap-1">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60">
                Order
              </p>
              <p className="font-mono text-2xl tracking-[0.15em]">{order.number}</p>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/50">
                Placed {order.placedAt} &middot; {order.itemCount} item
                {order.itemCount === 1 ? "" : "s"}
              </p>
            </header>

            <ol className="flex flex-col gap-0">
              {STAGES.map((stage, i) => {
                const currentIdx = STAGES.findIndex((s) => s.key === order.status);
                const reached = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <li key={stage.key} className="grid grid-cols-[2rem_1fr] items-start">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-3 h-3 rounded-full border ${
                          reached ? "bg-black border-black" : "border-black/30"
                        }`}
                      />
                      {i < STAGES.length - 1 && (
                        <span
                          className={`w-px flex-1 my-1 ${
                            i < currentIdx ? "bg-black" : "bg-black/15"
                          }`}
                          style={{ minHeight: "2.5rem" }}
                        />
                      )}
                    </div>
                    <div className={`pb-6 ${reached ? "text-black" : "text-black/40"}`}>
                      <p className="font-mono text-sm tracking-[0.15em] uppercase">
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/50 mt-1">
                          Current status
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/15">
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50">
                  Carrier
                </p>
                <p className="font-mono text-sm mt-1">{order.carrier}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50">
                  Tracking ID
                </p>
                <p className="font-mono text-sm mt-1 break-all">{order.trackingId}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <BarButton href="/contact" label="Need help?" />
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/60 hover:text-black self-center"
              >
                Look up another
              </button>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
