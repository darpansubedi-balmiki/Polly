import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "s" | "m" | "l";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  block?: boolean;
};

const sizes: Record<Size, string> = {
  s: "h-11 px-4 text-[13px] gap-1.5", // 44px min target even on small
  m: "h-12 px-5 text-[15px] gap-2",
  l: "h-14 px-7 text-[16px] gap-2.5",
};

/**
 * Mint (accent-primary) is a SIGNAL: only the single primary CTA per screen
 * should use `variant="primary"`.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent-primary)] text-[#04120a] hover:bg-[var(--accent-primary)] active:bg-[var(--accent-primary-pressed)] shadow-[0_6px_20px_rgba(57,255,136,0.28)] hover:brightness-105",
  secondary:
    "bg-[var(--bg-surface-raised)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--text-tertiary)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]",
  destructive:
    "bg-[var(--status-danger)] text-white hover:brightness-110 active:brightness-95",
};

export default function Button({
  variant = "primary",
  size = "m",
  loading = false,
  leadingIcon,
  trailingIcon,
  block,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        "focus-ring inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold select-none transition-[background-color,transform,filter,border-color] duration-150 ease-out active:scale-[0.985]",
        sizes[size],
        variants[variant],
        block && "w-full",
        isDisabled && "opacity-45 pointer-events-none",
        className,
      )}
    >
      {loading && (
        <span
          className="mr-1 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {!loading && leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
}
