import { cn } from "./cn";

/**
 * Step indicator for onboarding / multi-step flows. Completed steps are mint,
 * the active step is an elongated pill, upcoming are subtle dots.
 */
export default function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number; // 0-based index
}) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <span
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-200",
              active ? "w-7 bg-[var(--accent-primary)]" : "w-2",
              !active && done && "bg-[var(--accent-primary)] opacity-70",
              !active && !done && "bg-[var(--border-strong)]",
            )}
          />
        );
      })}
    </div>
  );
}
