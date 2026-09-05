import { cn } from "./cn";

type Kind = "achieved" | "target" | "predicted";

const kindColor: Record<Kind, string> = {
  achieved: "var(--accent-primary)",
  predicted: "var(--status-info)",
  target: "var(--text-tertiary)",
};

/**
 * Circular score dial for a single value on the IELTS (0–9) or PTE (10–90)
 * scale. `kind` controls the ring color and is echoed as a text label so the
 * meaning never rests on color alone. Numbers are tabular and fixed-width.
 */
export default function ScoreRing({
  value,
  scale,
  kind = "achieved",
  size = 132,
  label,
}: {
  value: number;
  scale: "IELTS" | "PTE";
  kind?: Kind;
  size?: number;
  label?: string;
}) {
  const max = scale === "IELTS" ? 9 : 90;
  const min = scale === "IELTS" ? 0 : 10;
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const display = scale === "IELTS" ? value.toFixed(1) : String(value);

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={kindColor[kind]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={kind === "target" ? "4 7" : c}
            strokeDashoffset={kind === "target" ? 0 : c * (1 - pct)}
            style={{
              transition: "stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)",
              opacity: kind === "target" ? 0.7 : 1,
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span
            className="tabular font-semibold leading-none"
            style={{
              fontSize: size * 0.32,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            {display}
          </span>
          <span className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            {scale}
          </span>
        </div>
      </div>
      {label && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]",
          )}
        >
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: kindColor[kind] }}
            aria-hidden="true"
          />
          {label}
        </span>
      )}
    </div>
  );
}
