import type { ReactNode } from "react";
import { CheckCircle, Info, AlertTriangle, X } from "../icons";
import { cn } from "./cn";

type Tone = "success" | "info" | "warning" | "danger";

const toneMap: Record<Tone, { color: string; icon: ReactNode }> = {
  success: { color: "var(--accent-primary)", icon: <CheckCircle size={20} /> },
  info: { color: "var(--status-info)", icon: <Info size={20} /> },
  warning: { color: "var(--status-warning)", icon: <AlertTriangle size={20} /> },
  danger: { color: "var(--status-danger)", icon: <AlertTriangle size={20} /> },
};

/**
 * Notification toast. Tone is signalled by icon + text, with color as support.
 */
export default function Toast({
  tone = "info",
  title,
  message,
  onClose,
}: {
  tone?: Tone;
  title: string;
  message?: string;
  onClose?: () => void;
}) {
  const t = toneMap[tone];
  return (
    <div
      role="status"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-4 shadow-[var(--shadow-raised)]",
      )}
    >
      <span className="mt-0.5 shrink-0" style={{ color: t.color }}>
        {t.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</div>
        {message && (
          <div className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{message}</div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="focus-ring -m-1 rounded-full p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
