import type { ReactNode } from "react";
import { Lock } from "../icons";
import { cn } from "./cn";

type State = "locked" | "unlocked" | "just-unlocked";

/**
 * Milestone badge. Locked is desaturated + lock icon; unlocked shows the full
 * color icon; just-unlocked plays a single restrained pop (no confetti).
 */
export default function AchievementBadge({
  icon,
  title,
  detail,
  state = "unlocked",
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  state?: State;
}) {
  const locked = state === "locked";
  return (
    <div
      className={cn(
        "flex w-40 flex-col items-center gap-2 rounded-[var(--radius-card)] border p-4 text-center",
        state === "just-unlocked"
          ? "anim-pop border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_10%,var(--bg-surface))] shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)]",
      )}
    >
      <div
        className={cn(
          "relative grid size-14 place-items-center rounded-full",
          locked
            ? "bg-[var(--border-subtle)] text-[var(--text-tertiary)] grayscale"
            : "bg-[color-mix(in_srgb,var(--accent-primary)_18%,transparent)] text-[var(--accent-primary)] [.mode-exam_&]:text-[var(--accent-on-light)]",
        )}
      >
        {locked ? <Lock size={22} /> : icon}
      </div>
      <span className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</span>
      <span className="text-[12px] text-[var(--text-tertiary)]">{detail}</span>
    </div>
  );
}
