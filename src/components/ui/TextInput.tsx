import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

export default function TextInput({
  label,
  hint,
  error,
  leadingIcon,
  className,
  id,
  ...rest
}: TextInputProps) {
  const inputId = id || rest.name || label?.replace(/\s+/g, "-").toLowerCase();
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <span className="mb-2 block text-[13px] font-medium text-[var(--text-secondary)]">
          {label}
        </span>
      )}
      <span className="relative block">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          {...rest}
          aria-invalid={!!error}
          className={cn(
            "focus-ring h-12 w-full rounded-[var(--radius-input)] border bg-[var(--bg-surface-raised)] px-4 text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors duration-150",
            leadingIcon && "pl-11",
            error
              ? "border-[var(--status-danger)]"
              : "border-[var(--border-strong)] focus:border-[var(--accent-primary)]",
            className,
          )}
        />
      </span>
      {error ? (
        <span className="mt-1.5 block text-[13px] text-[var(--status-danger)]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-[var(--text-tertiary)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
