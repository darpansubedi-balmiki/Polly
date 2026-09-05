import { cn } from "./cn";

export default function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-[var(--text-primary)]",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "focus-ring relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
          checked
            ? "bg-[var(--accent-primary)]"
            : "bg-[var(--bg-surface-raised)] border border-[var(--border-strong)]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-200",
            checked ? "left-6" : "left-1",
          )}
        />
      </button>
      {label}
    </label>
  );
}
