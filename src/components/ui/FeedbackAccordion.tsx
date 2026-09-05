import { useState } from "react";
import { ChevronDown } from "../icons";
import { cn } from "./cn";
import DeltaChip from "./DeltaChip";

/**
 * Explainable-scoring accordion: Score → Why → Fix → Expected Improvement.
 * This is the core "know why / know what to do next" surface.
 */
export default function FeedbackAccordion({
  criterion,
  score,
  scaleMax = 90,
  why,
  fix,
  expectedGain,
  defaultOpen = false,
}: {
  criterion: string;
  score: number;
  scaleMax?: number;
  why: string;
  fix: string;
  expectedGain: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">
            {criterion}
          </span>
          <span className="tabular rounded-[var(--radius-pill)] bg-[var(--bg-surface-raised)] px-2.5 py-0.5 text-[13px] font-bold text-[var(--text-primary)]">
            {score}
            <span className="text-[var(--text-tertiary)]"> / {scaleMax}</span>
          </span>
        </span>
        <ChevronDown
          size={20}
          className={cn(
            "shrink-0 text-[var(--text-tertiary)] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-[var(--border-subtle)] px-5 py-4">
          <dl className="space-y-4 text-[14px]">
            <div>
              <dt className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                Why this score
              </dt>
              <dd className="leading-relaxed text-[var(--text-secondary)]">{why}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                How to fix it
              </dt>
              <dd className="leading-relaxed text-[var(--text-secondary)]">{fix}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                Expected improvement
              </dt>
              <dd>
                <DeltaChip delta={expectedGain} />
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
