import type { ReactNode } from "react";
import { Lock } from "../icons";
import { cn } from "./cn";

type Variant = "default" | "interactive" | "locked" | "empty";
type Surface = "dark" | "warm";

/**
 * Card — Coach Mode surfaces. `surface="warm"` is the cream card that brings
 * warmth into the dark navy canvas. In Exam Mode (.mode-exam wrapper) the same
 * component renders as a flat grey panel with a 4px radius and no shadow.
 */
export default function Card({
  variant = "default",
  surface = "dark",
  children,
  className,
  onClick,
  lockedLabel = "Premium",
}: {
  variant?: Variant;
  surface?: Surface;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  lockedLabel?: string;
}) {
  const warm = surface === "warm";
  const interactive = variant === "interactive";
  const Comp: "button" | "div" = interactive ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "relative block rounded-[var(--radius-feature)] p-6 text-left transition-[transform,box-shadow,border-color] duration-150",
        warm
          ? "bg-[var(--bg-surface-warm)] text-[#1a1d23] shadow-[var(--shadow-warm)]"
          : "border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-rest)]",
        interactive &&
          "focus-ring cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] hover:border-[var(--border-strong)]",
        variant === "locked" && "overflow-hidden",
        className,
      )}
    >
      {children}
      {variant === "locked" && (
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--status-warning)_18%,transparent)] px-3 py-1 text-[12px] font-semibold text-[var(--status-warning)]">
          <Lock size={13} /> {lockedLabel}
        </span>
      )}
    </Comp>
  );
}
