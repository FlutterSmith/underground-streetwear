"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BarButton } from "@/components/BarButton";
import { FormField } from "@/components/FormField";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

const ADDRESS_KEY = "underground.shipping.v1";
const ADDRESS_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

function readSavedAddress(): Record<string, string> | null {
  try {
    const raw = window.localStorage.getItem(ADDRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "savedAt" in parsed && "data" in parsed) {
      const age = Date.now() - Number(parsed.savedAt);
      if (!Number.isFinite(age) || age < 0 || age > ADDRESS_MAX_AGE_MS) {
        try { window.localStorage.removeItem(ADDRESS_KEY); } catch {}
        return null;
      }
      return parsed.data as Record<string, string>;
    }
    return parsed as Record<string, string>;
  } catch {
    return null;
  }
}

const COUNTRIES = [
  "Egypt",
  "United Arab Emirates",
  "Saudi Arabia",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Morocco",
  "Tunisia",
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Australia",
  "Japan",
] as const;

type Errors = Partial<
  Record<
    | "email"
    | "firstName"
    | "lastName"
    | "address"
    | "city"
    | "country"
    | "postal"
    | "phone",
    string
  >
>;

function generateOrderNumber(): string {
  const year = new Date().getFullYear().toString();
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 46656).toString(36).padStart(3, "0").toUpperCase();
  return `UG-${year}-${ts}-${rand}`;
}

function validate(values: {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  phone: string;
}): Errors {
  const errors: Errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Invalid email";
  if (!values.firstName.trim()) errors.firstName = "Required";
  if (!values.lastName.trim()) errors.lastName = "Required";
  if (!values.address.trim()) errors.address = "Required";
  if (!values.city.trim()) errors.city = "Required";
  if (!values.country.trim()) errors.country = "Required";
  if (!values.postal.trim()) errors.postal = "Required";
  if (!/^[+\d][\d\s\-()]{6,}$/.test(values.phone)) errors.phone = "Invalid phone";
  return errors;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { format } = useCurrency();
  const [shipMethod, setShipMethod] = useState<"standard" | "express">("standard");
  const [busy, setBusy] = useState(false);
  const submitInFlight = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{ orderNumber: string; email: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [mounted, setMounted] = useState(false);
  const [savedAvailable, setSavedAvailable] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    country: "Egypt",
    postal: "",
    phone: "",
  });

  useEffect(() => {
    if (done && items.length > 0) setDone(null);
  }, [done, items.length]);

  useEffect(() => {
    setMounted(true);
    if (readSavedAddress()) setSavedAvailable(true);
  }, []);

  function autofill() {
    const saved = readSavedAddress();
    if (!saved) return;
    setForm((prev) => ({ ...prev, ...saved }));
    setSavedAvailable(false);
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as keyof Errors];
      return next;
    });
  }

  const shipFee = subtotal >= 3000 ? 0 : shipMethod === "express" ? 160 : 80;
  const total = subtotal + shipFee;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitInFlight.current) return;
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    submitInFlight.current = true;
    setSubmitError(null);
    setBusy(true);
    try {
      // TODO(template-buyer): create a real payment session (Stripe Checkout / Paymob /
      // Fawry) here, then redirect to the hosted payment page. On success webhook,
      // mark the order paid in your database and clear the cart.
      await new Promise((r) => setTimeout(r, 800));
      const orderNumber = generateOrderNumber();
      setDone({ orderNumber, email: form.email });
      clear();
      setTimeout(() => {
        try {
          window.localStorage.setItem(
            ADDRESS_KEY,
            JSON.stringify({ savedAt: Date.now(), data: form }),
          );
        } catch {
          // ignore
        }
      }, 0);
    } catch (err) {
      console.error("[checkout] order submission failed", err);
      setSubmitError("Something went wrong placing your order. Please try again.");
    } finally {
      setBusy(false);
      submitInFlight.current = false;
    }
  }

  if (!mounted) {
    return (
      <>
        <Nav />
        <main className="min-h-[40vh]" />
        <Footer />
      </>
    );
  }

  if (done) {
    return (
      <>
        <Nav />
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 mb-6">
            &mdash; order placed &mdash;
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight mb-4">
            thanks. we&apos;ve got it.
          </h1>
          <p className="text-black/60 max-w-md mx-auto">
            Order <span className="font-mono">{done.orderNumber}</span> is confirmed.
            We&apos;ll email{" "}
            <span className="font-mono">{done.email}</span> with tracking as soon
            as your pieces ship.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <BarButton href="/shop" label="Keep shopping" />
            <BarButton href="/orders" label="Track order" />
            <BarButton href="/home" label="Back home" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Nav />
        <main className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-8 px-6 pb-20 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60">
            &mdash; checkout &mdash;
          </p>
          <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl leading-tight">
            nothing to check out.
          </h1>
          <BarButton href="/shop" label="Go to shop" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 mt-6 mb-6 text-center">
          &mdash; checkout &mdash;
        </p>

        {savedAvailable && (
          <div className="mb-8 border border-black/15 bg-black/[0.03] p-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/70">
              We saved your last shipping address.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={autofill}
                className="font-mono text-[11px] tracking-[0.25em] uppercase underline decoration-1 underline-offset-4 hover:opacity-60"
              >
                Use it
              </button>
              <button
                type="button"
                onClick={() => setSavedAvailable(false)}
                className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/50 hover:text-black"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-12">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
            <section className="flex flex-col gap-5">
              <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-black/80">
                01 &mdash; Contact
              </h2>
              <FormField
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
                placeholder="you@domain.com"
              />
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                aria-required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                error={errors.phone}
                placeholder="+20 100 000 0000"
              />
            </section>

            <section className="flex flex-col gap-5">
              <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-black/80">
                02 &mdash; Shipping address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="First name"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  aria-required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  error={errors.firstName}
                />
                <FormField
                  label="Last name"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  aria-required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  error={errors.lastName}
                />
              </div>
              <FormField
                label="Street address"
                name="address"
                autoComplete="address-line1"
                required
                aria-required
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                error={errors.address}
                placeholder="Street, number"
              />
              <FormField
                label="Apartment, suite (optional)"
                name="address2"
                autoComplete="address-line2"
                value={form.address2}
                onChange={(e) => update("address2", e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  required
                  aria-required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  error={errors.city}
                />
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
                    Country
                  </span>
                  <select
                    name="country"
                    autoComplete="country-name"
                    required
                    aria-required
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-light)] py-3 font-mono text-sm tracking-wide transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-700">
                      {errors.country}
                    </span>
                  )}
                </label>
                <FormField
                  label="Postal"
                  name="postal"
                  autoComplete="postal-code"
                  required
                  aria-required
                  value={form.postal}
                  onChange={(e) => update("postal", e.target.value)}
                  error={errors.postal}
                />
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-black/80">
                03 &mdash; Shipping method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { key: "standard" as const, label: "Standard", time: "2–4 days", fee: 80 },
                    { key: "express" as const, label: "Express", time: "1–2 days", fee: 160 },
                  ]
                ).map((opt) => {
                  const active = shipMethod === opt.key;
                  const free = subtotal >= 3000;
                  return (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => setShipMethod(opt.key)}
                      className={`text-left border p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                        active ? "border-black bg-black/5" : "border-black/30 hover:border-black"
                      }`}
                      aria-pressed={active}
                    >
                      <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] uppercase">
                        <span>{opt.label}</span>
                        <span>{free ? "FREE" : format(opt.fee)}</span>
                      </div>
                      <p className="text-black/60 text-xs mt-2">{opt.time}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-black/80">
                04 &mdash; Payment
              </h2>
              <div className="border border-black/30 p-5 flex flex-col gap-2 bg-black/[0.02]">
                <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/60">
                  Demo mode
                </p>
                <p className="text-sm text-black/70">
                  This template does not process real payments. Wire your own
                  Stripe Checkout, Paymob, or Fawry handler in{" "}
                  <span className="font-mono text-xs">src/app/checkout/page.tsx</span>.
                  Submitting will create a mock order.
                </p>
              </div>
            </section>

            {submitError && (
              <p
                role="alert"
                aria-live="polite"
                className="font-mono text-[11px] tracking-[0.2em] uppercase text-red-700"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="h-14 border border-black font-mono text-sm tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-40"
            >
              {busy ? "Placing order..." : `Place order — ${format(total)}`}
            </button>

            <Link
              href="/cart"
              className="text-center font-mono text-[11px] tracking-[0.25em] uppercase text-black/60 hover:text-black transition-colors"
            >
              Back to cart
            </Link>
          </form>

          <aside className="border border-black/15 p-6 h-fit flex flex-col gap-5 lg:sticky lg:top-6 bg-white/40">
            <p className="font-mono text-xs tracking-[0.3em] uppercase">
              &mdash; order &mdash;
            </p>
            <ul className="divide-y divide-black/10">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 py-3">
                  <div className="relative w-14 h-14 shrink-0 bg-white">
                    <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
                        {it.name}
                      </p>
                      <p className="font-mono text-[11px] whitespace-nowrap">
                        {format(it.priceEGP * it.qty)}
                      </p>
                    </div>
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50">
                      Size {it.size} &middot; qty {it.qty}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 font-mono text-xs pt-2 border-t border-black/10">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-black/60">
                <span>Shipping</span>
                <span>{shipFee === 0 ? "FREE" : format(shipFee)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-black/10 text-sm">
                <span>Total</span>
                <span>{format(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
