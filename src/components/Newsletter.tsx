"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";

type NewsletterProps = { invert?: boolean };

export function Newsletter({ invert = false }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("err");
      return;
    }
    setState("busy");
    // TODO(template-buyer): POST to your mailing-list endpoint (Mailchimp, Resend, ConvertKit).
    await new Promise((r) => setTimeout(r, 500));
    setState("ok");
    setEmail("");
  }

  const border = invert ? "border-white/40" : "border-black/40";
  const text = invert ? "text-white" : "text-black";
  const placeholder = invert ? "placeholder:text-white/40" : "placeholder:text-black/40";
  const bg = invert ? "bg-white text-black" : "bg-black text-white";

  return (
    <section className={clsx("w-full", text)}>
      <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center gap-6 text-center">
        <p className={clsx("font-mono text-[11px] tracking-[0.3em] uppercase", invert ? "text-white/60" : "text-black/60")}>
          &mdash; join the list &mdash;
        </p>
        <h2 className="text-3xl sm:text-5xl font-medium leading-tight max-w-xl">
          get the drop before anyone else.
        </h2>
        <p className={clsx("max-w-md", invert ? "text-white/60" : "text-black/60")}>
          One email per drop. No spam, no resell nonsense.
        </p>

        {state === "ok" ? (
          <p className="font-mono text-sm tracking-[0.2em] uppercase mt-2">
            &mdash; you&apos;re in. &mdash;
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={clsx("w-full max-w-md flex items-stretch border-b", border)}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "err") setState("idle");
              }}
              placeholder="you@domain.com"
              autoComplete="email"
              aria-label="Email address"
              className={clsx(
                "flex-1 bg-transparent outline-none py-3 font-mono text-sm tracking-wide",
                text,
                placeholder,
              )}
            />
            <button
              type="submit"
              disabled={state === "busy"}
              className={clsx(
                "px-5 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors disabled:opacity-40",
                bg,
              )}
            >
              {state === "busy" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {state === "err" && (
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-red-700">
            Invalid email
          </p>
        )}
      </div>
    </section>
  );
}
