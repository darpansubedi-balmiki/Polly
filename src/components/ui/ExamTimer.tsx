import { Clock } from "../icons";
import { cn } from "./cn";

/**
 * Countdown timer with two deliberately different variants:
 *  - variant="coach": friendly pill for practice sessions (rounded, icon).
 *  - variant="exam": stark institutional readout for the mock simulator
 *    (square, mono-ish, no icon, no color chrome) mirroring real exam software.
 */
export default function ExamTimer({
  seconds,
  variant = "coach",
  warnUnder = 300,
}: {
  seconds: number;
  variant?: "coach" | "exam";
  warnUnder?: number;
}) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const text = `${m}:${String(s).padStart(2, "0")}`;
  const warn = seconds <= warnUnder;

  if (variant === "exam") {
    return (
      <span className="tabular inline-flex items-center gap-1.5 border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1 text-[15px] font-semibold text-[var(--text-primary)]">
        {text} <span className="font-normal text-[var(--text-secondary)]">left</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[15px] font-bold",
        warn
          ? "border-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_14%,transparent)] text-[var(--status-warning)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]",
      )}
    >
      <Clock size={16} strokeWidth={2} />
      {text}
    </span>
  );
}
