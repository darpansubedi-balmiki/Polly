import { cn } from "./cn";

/**
 * EXAM MODE ONLY — stark question navigator strip mirroring real IELTS/PTE
 * software: dense numbered grid, hard borders, no brand chrome, 4px radius via
 * the exam token set. Must be rendered inside a .mode-exam wrapper.
 */
export type NavQuestion = {
  n: number;
  status: "answered" | "current" | "unanswered" | "flagged";
};

export default function QuestionNavigator({
  part,
  questions,
  onJump,
}: {
  part: string;
  questions: NavQuestion[];
  onJump?: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 border-t border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-2">
      <span className="mr-1 shrink-0 text-[13px] font-bold text-[var(--text-primary)]">
        {part}
      </span>
      <div className="flex flex-wrap gap-1">
        {questions.map((q) => (
          <button
            key={q.n}
            onClick={() => onJump?.(q.n)}
            aria-current={q.status === "current"}
            className={cn(
              "tabular grid h-7 min-w-7 place-items-center rounded-[var(--radius-card)] border px-1.5 text-[13px]",
              q.status === "current" &&
                "border-[#1a1d23] bg-[#1a1d23] font-bold text-white",
              q.status === "answered" &&
                "border-[var(--border-strong)] bg-white font-semibold text-[var(--text-primary)]",
              q.status === "unanswered" &&
                "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)]",
              q.status === "flagged" &&
                "border-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_20%,white)] font-semibold text-[#1a1d23]",
            )}
          >
            {q.n}
          </button>
        ))}
      </div>
    </div>
  );
}
