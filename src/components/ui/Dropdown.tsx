import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "../icons";
import { cn } from "./cn";

type Option = { value: string; label: string };

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: {
  options: Option[];
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block w-full max-w-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="focus-ring flex h-12 w-full items-center justify-between rounded-[var(--radius-input)] border border-[var(--border-strong)] bg-[var(--bg-surface-raised)] px-4 text-[15px] text-[var(--text-primary)]"
      >
        <span className={cn(!selected && "text-[var(--text-tertiary)]")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-[var(--text-tertiary)] transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-[var(--radius-input)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-1 shadow-[var(--shadow-raised)]"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-[10px] px-3 text-left text-[14px] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] hover:text-[var(--text-primary)]",
                    active && "text-[var(--text-primary)]",
                  )}
                >
                  {o.label}
                  {active && (
                    <Check size={16} className="text-[var(--accent-primary)]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
