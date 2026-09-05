import DeltaChip from "./DeltaChip";

type SkillKey = "speaking" | "writing" | "reading" | "listening";

const skillVar: Record<SkillKey, string> = {
  speaking: "var(--skill-speaking)",
  writing: "var(--skill-writing)",
  reading: "var(--skill-reading)",
  listening: "var(--skill-listening)",
};

/**
 * Horizontal skill meter: label + current value, a target marker, and a delta
 * chip. Bar uses the skill color (distinguishable in greyscale by lightness).
 */
export default function SkillBar({
  skill,
  label,
  current,
  target,
  max = 90,
  delta,
}: {
  skill: SkillKey;
  label: string;
  current: number;
  target: number;
  max?: number;
  delta?: number;
}) {
  const curPct = Math.min(100, (current / max) * 100);
  const tgtPct = Math.min(100, (target / max) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[14px] font-medium text-[var(--text-primary)]">
          <span
            className="inline-block size-2.5 rounded-[3px]"
            style={{ background: skillVar[skill] }}
            aria-hidden="true"
          />
          {label}
        </span>
        <span className="flex items-center gap-2">
          {delta !== undefined && <DeltaChip delta={delta} />}
          <span className="tabular text-[14px] font-semibold text-[var(--text-primary)]">
            {current}
            <span className="text-[var(--text-tertiary)]"> / {target}</span>
          </span>
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-[var(--border-subtle)]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${curPct}%`, background: skillVar[skill] }}
        />
        {/* target marker */}
        <span
          className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--text-primary)]"
          style={{ left: `calc(${tgtPct}% - 1px)` }}
          aria-label={`Target ${target}`}
          title={`Target ${target}`}
        />
      </div>
    </div>
  );
}
