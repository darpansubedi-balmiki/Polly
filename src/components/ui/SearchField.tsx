import type { InputHTMLAttributes } from "react";
import { Search, X } from "../icons";
import { cn } from "./cn";

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  onChange: (v: string) => void;
  onClear?: () => void;
};

export default function SearchField({
  value,
  onChange,
  onClear,
  className,
  placeholder = "Search…",
  ...rest
}: SearchFieldProps) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
      />
      <input
        {...rest}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "focus-ring h-12 w-full rounded-[var(--radius-pill)] border border-[var(--border-strong)] bg-[var(--bg-surface-raised)] pl-12 pr-11 text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]",
          "[&::-webkit-search-cancel-button]:hidden",
          className,
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => (onClear ? onClear() : onChange(""))}
          className="focus-ring absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
