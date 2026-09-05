import type { ReactNode } from "react";
import { ArrowRight } from "../icons";
import DeltaChip from "./DeltaChip";

type SkillKey = "speaking" | "writing" | "reading" | "listening";
const skillVar: Record<SkillKey, string> = {
  speaking: "var(--skill-speaking)",
  writing: "var(--skill-writing)",
  reading: "var(--skill-reading)",
  listening: "var(--skill-listening)",
};
const skillLabel: Record<SkillKey, string> = {
  speaking: "Speaking",
  writing: "Writing",
  reading: "Reading",
  listening: "Listening",
};

/**
 * Practice task entry — real exam task types (Read Aloud, Describe Image, …).
 * Shows the skill it trains, item count, and best-score delta.
 */
export default function PracticeCard({
  task,
  skill,
  items,
  icon,
  delta,
  onStart,
}: {
  task: string;
  skill: SkillKey;
  items: number;
  icon: ReactNode;
  delta?: number;
  onStart?: () => void;
}) {
  return (
    <button
      onClick={onStart}
      className="focus-ring group flex w-full items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-left transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
    >
      <span
        className="grid size-12 shrink-0 place-items-center rounded-[14px]"
        style={{
          background: `color-mix(in srgb, ${skillVar[skill]} 18%, transparent)`,
          color: skillVar[skill],
        }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[var(--text-primary)]">
          {task}
        </span>
        <span className="mt-0.5 flex items-center gap-2 text-[13px] text-[var(--text-tertiary)]">
          <span style={{ color: skillVar[skill] }}>{skillLabel[skill]}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular">{items} items</span>
        </span>
      </span>
      {delta !== undefined && <DeltaChip delta={delta} />}
      <ArrowRight
        size={20}
        className="shrink-0 text-[var(--text-tertiary)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)]"
      />
    </button>
  );
}
