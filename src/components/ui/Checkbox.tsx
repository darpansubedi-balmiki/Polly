import { Check } from "../icons";
import { cn } from "./cn";

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
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
          "grid size-6 place-items-center rounded-[7px] border transition-colors duration-150",
          checked
            ? "border-transparent bg-[var(--accent-primary)] text-[#04120a]"
            : "border-[var(--border-strong)] bg-transparent",
        )}
      >
        {checked && <Check size={16} strokeWidth={2.5} />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
