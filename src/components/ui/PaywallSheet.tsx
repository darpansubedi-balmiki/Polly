import type { ReactNode } from "react";
import { X, Sparkle } from "../icons";
import Button from "./Button";
import IconButton from "./IconButton";

/**
 * Bottom sheet prompting an upgrade when a premium feature is reached.
 * One mint CTA; benefits listed with real value, no dark patterns.
 */
export default function PaywallSheet({
  open,
  title,
  subtitle,
  benefits,
  priceLine,
  onClose,
  onUpgrade,
  illustration,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  benefits: string[];
  priceLine: string;
  onClose: () => void;
  onUpgrade?: () => void;
  illustration?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(4,8,20,0.6)] p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-step-in w-full max-w-md rounded-t-[24px] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-6 shadow-[var(--shadow-raised)] sm:rounded-[var(--radius-feature)]"
      >
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-3 py-1 text-[12px] font-bold text-[var(--accent-primary)] [.mode-exam_&]:text-[var(--accent-on-light)]">
            <Sparkle size={14} /> Premium
          </span>
          <IconButton label="Close" icon={<X size={18} />} variant="ghost" onClick={onClose} />
        </div>
        {illustration && <div className="mt-4 flex justify-center">{illustration}</div>}
        <h3
          className="mt-4 text-[24px] font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">{subtitle}</p>
        <ul className="mt-4 space-y-2.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[14px] text-[var(--text-primary)]">
              <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]" />
              {b}
            </li>
          ))}
        </ul>
        <Button className="mt-6" block size="l" onClick={onUpgrade}>
          Unlock Premium
        </Button>
        <p className="mt-2 text-center text-[13px] text-[var(--text-tertiary)]">{priceLine}</p>
      </div>
    </div>
  );
}
