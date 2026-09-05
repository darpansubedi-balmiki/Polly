import type { ReactNode } from "react";
import { X } from "../icons";
import IconButton from "./IconButton";

/**
 * Centered modal. In Exam Mode (.mode-exam) it renders as the stark help/
 * settings dialog seen in real exam software (square, hard border, no shadow).
 */
export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(4,8,20,0.55)] p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-raised)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-3.5">
          <h3
            className="text-[17px] font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <IconButton label="Close" icon={<X size={18} />} variant="ghost" onClick={onClose} />
        </div>
        <div className="px-5 py-4 text-[15px] text-[var(--text-secondary)]">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-[var(--border-subtle)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
