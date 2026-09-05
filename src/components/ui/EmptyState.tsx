import type { ReactNode } from "react";
import PollyBubble from "../polly/PollyBubble";

/**
 * Illustrated empty state with Polly present (Coach Mode). Always offers one
 * clear next action so the user knows what to do next.
 */
export default function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[var(--radius-feature)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] px-6 py-10 text-center">
      <PollyBubble state="idle" side="top" size={88} message={message} />
      <h3
        className="text-[18px] font-semibold text-[var(--text-primary)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      {action}
    </div>
  );
}
