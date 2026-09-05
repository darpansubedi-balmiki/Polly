import { cn } from "./cn";

/**
 * Delta indicator. Positive deltas use mint (a permitted signal). Meaning is
 * always paired with a sign glyph + number, never color alone.
 */
export default function DeltaChip({
  delta,
  suffix = "",
  className,
}: {
  delta: number;
  suffix?: string;
  className?: string;
}) {
  const positive = delta > 0;
  const zero = delta === 0;
  const sign = positive ? "▲" : zero ? "±" : "▼";
  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2 py-0.5 text-[12px] font-semibold",
        positive &&
          "bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] text-[var(--accent-primary)] [.mode-exam_&]:text-[var(--accent-on-light)]",
        zero && "bg-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] text-[var(--text-tertiary)]",
        !positive && !zero &&
          "bg-[color-mix(in_srgb,var(--status-danger)_16%,transparent)] text-[var(--status-danger)]",
        className,
      )}
    >
      <span aria-hidden="true">{sign}</span>
      {Math.abs(delta)}
      {suffix}
    </span>
  );
}
