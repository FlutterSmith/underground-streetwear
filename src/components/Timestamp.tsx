"use client";

import { useEffect, useState } from "react";

function format(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const yyyy = d.getFullYear();
  let hours = d.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());
  return `${mm}/${dd}/${yyyy}, ${hours}:${min}:${sec} ${ampm}`;
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
