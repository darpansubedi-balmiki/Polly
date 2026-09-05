import { cn } from "./cn";

type Segment = { id: string; label: string };

export default function SegmentedControl({
  segments,
  value,
  onChange,
}: {
  segments: Segment[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
      {segments.map((s) => {
        const active = s.id === value;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={cn(
              "focus-ring h-9 rounded-[var(--radius-pill)] px-4 text-[13px] font-semibold transition-colors duration-150",
              active
                ? "bg-[var(--accent-primary)] text-[#04120a]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
