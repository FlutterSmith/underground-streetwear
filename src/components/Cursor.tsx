"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    if (!mq.matches) return;
    setEnabled(true);

    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let scale = 1;
    let targetScale = 1;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      targetScale = t && t.closest('a, button, [role="button"], input, textarea, select') ? 3 : 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.3;
      pos.y += (target.y - pos.y) * 0.3;
      scale += (targetScale - scale) * 0.2;
      const el = dotRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0) scale(${scale})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="custom-cursor-dot pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full bg-white mix-blend-difference z-[9999]"
      style={{ display: "none" }}
    />
  );
}
