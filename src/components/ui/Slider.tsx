import { cn } from "./cn";

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  suffix,
}: {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  label?: string;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium text-[var(--text-secondary)]">{label}</span>
          <span className="tabular font-semibold text-[var(--text-primary)]">
            {value}
            {suffix}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={cn(
          "focus-ring h-6 w-full cursor-pointer appearance-none bg-transparent",
          "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full",
          "[&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow",
          "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
        )}
        style={{
          // fill left of thumb with mint, right with subtle track
          background: `linear-gradient(to right, var(--accent-primary) ${pct}%, var(--border-strong) ${pct}%) center/100% 8px no-repeat`,
        }}
      />
    </div>
  );
}
