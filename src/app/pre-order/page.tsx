"use client";

import { useState, type FormEvent } from "react";
import { Nav } from "@/components/Nav";
import { BarButton } from "@/components/BarButton";
import { FormField } from "@/components/FormField";
import { Footer } from "@/components/Footer";
import { products } from "@/lib/products";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type Errors = Partial<Record<"name" | "email" | "phone" | "product" | "size", string>>;

function validate(values: {
  name: string;
  email: string;
  phone: string;
  product: string;
  size: string;
}): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Invalid email";
  if (!/^[+\d][\d\s\-()]{6,}$/.test(values.phone)) errors.phone = "Invalid phone";
  if (!values.product) errors.product = "Pick a piece";
  if (!values.size) errors.size = "Pick a size";
  return errors;
}

export default function PreOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    size: "",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setBusy(true);
    // TODO(template-buyer): POST to your backend / Formspree / Resend endpoint here.
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Nav />
        <main className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-8 px-6 pb-20 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70">
            &mdash; pre-order confirmed &mdash;
          </p>
          <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl leading-tight">
            you&apos;re on the list.
          </h1>
          <p className="max-w-md text-black/60">
            We&apos;ll email <span className="font-mono">{form.email}</span> when the
            drop ships. Limited quantities fulfilled in order received.
          </p>
          <BarButton href="/shop" label="Keep browsing" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-xl mx-auto px-6 pb-24">
        <div className="text-center mt-6 mb-12">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70 mb-6">
            &mdash; pre-order &mdash;
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight">
            next drop opens soon.
          </h1>
          <p className="text-black/60 mt-4">
            Reserve your piece. Limited quantities. No restocks.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <FormField
            label="Name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
            placeholder="Your full name"
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            placeholder="you@domain.com"
          />
          <FormField
            label="Phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
            placeholder="+20 100 000 0000"
          />

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
              Piece
            </span>
            <select
              name="product"
              value={form.product}
              onChange={(e) => update("product", e.target.value)}
              className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-3 font-mono text-sm"
            >
              <option value="">Select a piece</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} &mdash; LE {p.priceEGP.toLocaleString("en-US")}
                </option>
              ))}
            </select>
            {errors.product && (
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-700">
                {errors.product}
              </span>
            )}
          </label>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
              Size
            </span>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => update("size", s)}
                  className={`w-12 h-12 border font-mono text-xs tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                    form.size === s
                      ? "bg-black text-white border-black"
                      : "border-black/40 hover:border-black"
                  }`}
                  aria-pressed={form.size === s}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.size && (
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-700">
                {errors.size}
              </span>
            )}
          </div>

          <FormField
            as="textarea"
            label="Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Anything we should know"
          />

          <button
            type="submit"
            disabled={busy}
            className="relative inline-flex items-center justify-center h-12 border border-black font-mono text-sm tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-40 mt-2"
          >
            {busy ? "Reserving..." : "Reserve"}
          </button>

          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 text-center">
            No payment taken. We&apos;ll email you to confirm.
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
