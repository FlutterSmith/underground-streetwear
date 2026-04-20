"use client";

import { useEffect, useState } from "react";

const BRAND_TZ = "Africa/Cairo";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BRAND_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function format(d: Date): string {
  return `${formatter.format(d)} CAI`;
}

export function Timestamp() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(format(new Date()));
    const id = window.setInterval(() => setTime(format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="font-mono text-xs tabular-nums text-center min-w-[14rem] min-h-[1rem]"
      aria-label="current time"
    >
      {time || "\u00A0"}
    </div>
  );
}
