"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#F5F4F0",
          color: "#0A0A0A",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          margin: 0,
        }}
      >
        <p
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          &mdash; fatal &mdash;
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 500,
            lineHeight: 1.15,
            maxWidth: "36rem",
            margin: 0,
          }}
        >
          the whole thing snapped.
        </h1>
        <p style={{ maxWidth: "28rem", opacity: 0.6, margin: 0 }}>
          A critical error broke the app shell. Try reloading.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            height: "3rem",
            padding: "0 2rem",
            background: "#0A0A0A",
            color: "#FFFFFF",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
