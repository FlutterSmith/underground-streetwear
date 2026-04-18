"use client";

import { useState, type FormEvent } from "react";
import { Nav } from "@/components/Nav";
import { BarButton } from "@/components/BarButton";
import { FormField } from "@/components/FormField";
import { siteConfig } from "@/config/site.config";

type Errors = Partial<Record<"name" | "email" | "message" | "topic", string>>;

const TOPICS = ["Press", "Stockists", "Collab", "Support", "Other"] as const;

function validate(values: {
  name: string;
  email: string;
  message: string;
  topic: string;
}): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Invalid email";
  if (!values.topic) errors.topic = "Pick one";
  if (values.message.trim().length < 10) errors.message = "Tell us more (10+ chars)";
  return errors;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

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
            &mdash; message sent &mdash;
          </p>
          <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl leading-tight">
            we&apos;ll get back.
          </h1>
          <p className="max-w-md text-black/60">
            Thanks, <span className="font-mono">{form.name || "friend"}</span>. We reply
            within 48h. Urgent press? Email{" "}
            <a href="mailto:press@underground.label" className="underline">
              press@underground.label
            </a>
            .
          </p>
          <BarButton href="/" label="Back home" />
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-xl mx-auto px-6 pb-24">
        <div className="text-center mt-6 mb-12">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70 mb-6">
            &mdash; contact &mdash;
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight">
            press, stockists, and the brave.
          </h1>
          <a
            href="mailto:hello@underground.label"
            className="inline-block mt-4 font-mono text-sm tracking-[0.2em] underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity"
          >
            hello@underground.label
          </a>
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

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
              Topic
            </span>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => update("topic", t)}
                  className={`h-10 px-4 border font-mono text-[11px] tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                    form.topic === t
                      ? "bg-black text-white border-black"
                      : "border-black/40 hover:border-black"
                  }`}
                  aria-pressed={form.topic === t}
                >
                  {t}
                </button>
              ))}
            </div>
            {errors.topic && (
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-700">
                {errors.topic}
              </span>
            )}
          </div>

          <FormField
            as="textarea"
            label="Message"
            name="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            error={errors.message}
            placeholder="Tell us what you need"
          />

          <button
            type="submit"
            disabled={busy}
            className="relative inline-flex items-center justify-center h-12 border border-black font-mono text-sm tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-40 mt-2"
          >
            {busy ? "Sending..." : "Send"}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-black/10 text-center">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 w-full">
              Or follow
            </p>
            {siteConfig.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity"
              >
                {s.label}
              </a>
            ))}
          </div>
        </form>
      </main>
    </>
  );
}
