import { Flame } from "../icons";
import { cn } from "./cn";

/**
 * Daily streak indicator. `atRisk` warns the streak will break today — paired
 * with a text label, never color alone.
 */
export default function StreakFlame({
  count,
  atRisk = false,
}: {
  count: number;
  atRisk?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5",
        atRisk
          ? "border-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_14%,transparent)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)]",
      )}
    >
      <Flame
        size={18}
        strokeWidth={2}
        className={cn(atRisk ? "text-[var(--status-warning)]" : "text-[var(--streak-flame)]")}
      />
      <span className="tabular text-[15px] font-bold text-[var(--text-primary)]">
        {count}
      </span>
      <span className="text-[13px] text-[var(--text-tertiary)]">
        {atRisk ? "day streak · at risk" : "day streak"}
      </span>
    </span>
  );
}
