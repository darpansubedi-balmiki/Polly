import type { ReactNode } from "react";
import { cn } from "./cn";
import Button from "./Button";

/**
 * Restrained celebration overlay for personal bests / streak milestones /
 * level-ups. Motion spec: single pop+scale+glow on mount (~320ms, ease-out),
 * NO confetti, NO looping. Coach Mode only — never shown inside a scored mock.
 */
export default function CelebrationOverlay({
  open,
  icon,
  title,
  message,
  actionLabel = "Keep going",
  onClose,
}: {
  open: boolean;
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(4,8,20,0.6)] p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "anim-pop w-full max-w-sm rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-8 text-center shadow-[var(--shadow-raised)]",
        )}
      >
        <div
          className="mx-auto grid size-20 place-items-center rounded-full text-[var(--accent-primary)]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 30%, transparent), transparent 70%)",
          }}
        >
          {icon}
        </div>
        <h3
          className="mt-4 text-[24px] font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">{message}</p>
        <Button className="mt-6" block onClick={onClose}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
