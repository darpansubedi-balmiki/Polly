import { Check } from "../icons";
import { cn } from "./cn";
import Button from "./Button";

/**
 * Pricing plan card. The recommended plan is the only one with a mint CTA
 * (single primary signal per view).
 */
export default function PlanCard({
  name,
  price,
  period = "/mo",
  features,
  recommended = false,
  ctaLabel = "Choose plan",
  onChoose,
}: {
  name: string;
  price: string;
  period?: string;
  features: string[];
  recommended?: boolean;
  ctaLabel?: string;
  onChoose?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-xs flex-col rounded-[var(--radius-feature)] border p-6",
        recommended
          ? "border-[var(--accent-primary)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-raised)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)]",
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-6 rounded-[var(--radius-pill)] bg-[var(--accent-primary)] px-3 py-0.5 text-[12px] font-bold text-[#04120a]">
          Recommended
        </span>
      )}
      <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{name}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="tabular text-[32px] font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {price}
        </span>
        <span className="text-[14px] text-[var(--text-tertiary)]">{period}</span>
      </div>
      <ul className="mt-4 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[14px] text-[var(--text-secondary)]">
            <Check
              size={18}
              className="mt-0.5 shrink-0 text-[var(--accent-primary)] [.mode-exam_&]:text-[var(--accent-on-light)]"
              strokeWidth={2}
            />
            {f}
          </li>
        ))}
      </ul>
      <Button
        className="mt-6"
        block
        variant={recommended ? "primary" : "secondary"}
        onClick={onChoose}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
