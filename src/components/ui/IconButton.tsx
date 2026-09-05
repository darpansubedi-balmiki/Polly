import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: "surface" | "ghost";
};

export default function IconButton({
  label,
  icon,
  variant = "surface",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={cn(
        "focus-ring grid size-11 place-items-center rounded-[var(--radius-pill)] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]",
        variant === "surface" &&
          "bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]",
        variant === "ghost" &&
          "hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]",
        className,
      )}
    >
      {icon}
    </button>
  );
}
