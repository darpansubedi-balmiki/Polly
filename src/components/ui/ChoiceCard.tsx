import type { ReactNode } from "react";
import { Check } from "../icons";
import { cn } from "./cn";

/**
 * Large tappable selectable card for onboarding / single-select questions.
 * States: Default / Hover / Selected. Selection is signalled with a mint
 * checkmark AND a border change (never color alone).
 */
export default function ChoiceCard({
  selected,
  onSelect,
  title,
  description,
  leading,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  leading?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "focus-ring group flex min-h-16 w-full items-center gap-4 rounded-[var(--radius-card)] border px-5 py-4 text-left transition-[border-color,background-color,transform] duration-150 active:scale-[0.99]",
        selected
          ? "border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_12%,var(--bg-surface))]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-raised)]",
        className,
      )}
    >
      {leading && (
        <span className="grid size-11 shrink-0 place-items-center text-[22px] leading-none">
          {leading}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold text-[var(--text-primary)]">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-[13px] text-[var(--text-tertiary)]">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-150",
          selected
            ? "border-transparent bg-[var(--accent-primary)] text-[#04120a]"
            : "border-[var(--border-strong)] text-transparent",
        )}
      >
        {selected && <Check size={15} strokeWidth={2.5} />}
      </span>
    </button>
  );
}
