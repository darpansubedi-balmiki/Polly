import { cn } from "./cn";

export default function Radio({
  checked,
  onChange,
  label,
  name,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  name: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-[var(--text-primary)]",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full border transition-colors duration-150",
          checked ? "border-[var(--accent-primary)]" : "border-[var(--border-strong)]",
        )}
      >
        {checked && (
          <span className="size-3 rounded-full bg-[var(--accent-primary)]" />
        )}
      </span>
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  );
}
