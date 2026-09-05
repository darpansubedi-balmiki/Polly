import { cn } from "./cn";

/**
 * XP progress toward the next level. `leveledUp` shows a brief highlighted
 * state. Fill animates via CSS width transition; a subtle shimmer conveys the
 * "just earned" energy without looping gimmickry.
 */
export default function XPBar({
  level,
  current,
  needed,
  leveledUp = false,
}: {
  level: number;
  current: number;
  needed: number;
  leveledUp?: boolean;
}) {
  const pct = Math.min(100, Math.round((current / needed) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px]">
        <span className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
          <span
            className={cn(
              "grid size-6 place-items-center rounded-full text-[11px] font-bold text-[#04120a] transition-transform",
              "bg-[var(--accent-primary)]",
              leveledUp && "anim-pop",
            )}
          >
            {level}
          </span>
          {leveledUp ? "Level up!" : `Level ${level}`}
        </span>
        <span className="tabular text-[var(--text-tertiary)]">
          {current} / {needed} XP
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[var(--border-subtle)]">
        <div
          className="relative h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, var(--xp-fill), color-mix(in srgb, var(--xp-fill) 70%, white))",
          }}
        >
          <span
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
              backgroundSize: "40% 100%",
              animation: "xpShimmer 1.6s ease-in-out",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
