import clsx from "clsx";

type StarsProps = {
  value: number;
  size?: "sm" | "md";
  invert?: boolean;
  showValue?: boolean;
  count?: number;
};

export function Stars({ value, size = "sm", invert = false, showValue, count }: StarsProps) {
  const dim = size === "sm" ? 12 : 16;
  const filledColor = invert ? "#fff" : "#000";
  const emptyColor = invert ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)";
  const stars = [1, 2, 3, 4, 5].map((i) => {
    const fill = Math.max(0, Math.min(1, value - (i - 1)));
    return { i, fill };
  });

  const countSuffix =
    typeof count === "number" ? `, ${count} review${count === 1 ? "" : "s"}` : "";
  const accessibleLabel = `Rated ${value.toFixed(1)} out of 5${countSuffix}`;

  return (
    <span
      role="img"
      aria-label={accessibleLabel}
      className={clsx("inline-flex items-center gap-1", invert ? "text-white/70" : "text-black/70")}
    >
      <span className="inline-flex items-center" aria-hidden>
        {stars.map(({ i, fill }) => (
          <svg
            key={i}
            width={dim}
            height={dim}
            viewBox="0 0 20 20"
            aria-hidden
            style={{ marginRight: 1 }}
          >
            <defs>
              <linearGradient id={`star-${i}-${value.toFixed(2)}-${invert ? "i" : "n"}`}>
                <stop offset={`${fill * 100}%`} stopColor={filledColor} />
                <stop offset={`${fill * 100}%`} stopColor={emptyColor} />
              </linearGradient>
            </defs>
            <polygon
              points="10,1 12.6,7.5 19.5,7.7 14.1,12 16,18.7 10,14.9 4,18.7 5.9,12 0.5,7.7 7.4,7.5"
              fill={`url(#star-${i}-${value.toFixed(2)}-${invert ? "i" : "n"})`}
            />
          </svg>
        ))}
      </span>
      {showValue && (
        <span className="font-mono text-[10px] tracking-[0.15em]" aria-hidden>
          {value.toFixed(1)}
          {typeof count === "number" && (
            <span className={clsx(invert ? "text-white/40" : "text-black/40")}>
              {" "}
              ({count})
            </span>
          )}
        </span>
      )}
    </span>
  );
}
