"use client";

import { useEffect } from "react";

export function GlobalErrorListener() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      console.error("[global:error]", e.error ?? e.message, {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      console.error("[global:unhandledrejection]", e.reason);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
