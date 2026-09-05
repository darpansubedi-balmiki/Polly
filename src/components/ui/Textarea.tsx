import { useMemo } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  value: string;
  /** Optional target word count — shows progress toward it (e.g. IELTS Task 2 ≥ 250). */
  targetWords?: number;
};

export default function Textarea({
  label,
  value,
  targetWords,
  className,
  id,
  ...rest
}: TextareaProps) {
  const words = useMemo(
    () => (value.trim() ? value.trim().split(/\s+/).length : 0),
    [value],
  );
  const met = targetWords ? words >= targetWords : true;
  const areaId = id || rest.name;

  return (
    <div>
      {label && (
        <label
          htmlFor={areaId}
          className="mb-2 block text-[13px] font-medium text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        value={value}
        {...rest}
        className={cn(
          "focus-ring min-h-36 w-full resize-y rounded-[var(--radius-input)] border border-[var(--border-strong)] bg-[var(--bg-surface-raised)] p-4 text-[16px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]",
          className,
        )}
      />
      <div className="mt-1.5 flex items-center justify-between text-[13px]">
        <span className="text-[var(--text-tertiary)]">
          {targetWords ? `Target: ${targetWords}+ words` : " "}
        </span>
        <span
          className={cn(
            "tabular font-semibold",
            targetWords && met
              ? "text-[var(--accent-primary)]"
              : "text-[var(--text-tertiary)]",
          )}
        >
          {words} {words === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
}
