import { cn } from "./cn";

/**
 * Pill showing an exam band/score with its scale label.
 * IELTS bands 0.0–9.0 (0.5 steps) or PTE 10–90.
 */
export default function BandBadge({
  value,
  scale,
  tone = "neutral",
  className,
}: {
  value: number | string;
  scale: "IELTS" | "PTE";
  tone?: "neutral" | "achieved" | "target";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 py-1 text-[13px] font-semibold",
        tone === "achieved" &&
          "border-transparent bg-[var(--accent-primary)] text-[#04120a]",
        tone === "target" &&
          "border-dashed border-[var(--accent-primary)] text-[var(--accent-primary)] [.mode-exam_&]:text-[var(--accent-on-light)]",
        tone === "neutral" &&
          "border-[var(--border-strong)] text-[var(--text-primary)]",
        className,
      )}
    >
      <span className="text-[11px] uppercase tracking-[0.06em] opacity-70">
        {scale}
      </span>
      <span className="tabular">{value}</span>
    </span>
  );
}
