/**
 * "Question 4 of 10" counter. Coach Mode = pill; in Exam Mode (.mode-exam)
 * the shared radius token flattens it to a 4px square chip automatically.
 */
export default function QuestionCounterPill({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1 text-[13px] font-medium text-[var(--text-secondary)]">
      Question <span className="tabular font-semibold text-[var(--text-primary)]">{current}</span>
      of <span className="tabular font-semibold text-[var(--text-primary)]">{total}</span>
    </span>
  );
}
