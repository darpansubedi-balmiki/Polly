import { cn } from "./cn";

type Kind = "grammar" | "vocabulary" | "pronunciation" | "fluency" | "spelling";

const kindStyle: Record<Kind, string> = {
  grammar: "text-[var(--status-danger)] border-[var(--status-danger)]",
  vocabulary: "text-[var(--skill-writing)] border-[var(--skill-writing)]",
  pronunciation: "text-[var(--skill-speaking)] border-[var(--skill-speaking)]",
  fluency: "text-[var(--status-warning)] border-[var(--status-warning)]",
  spelling: "text-[var(--skill-reading)] border-[var(--skill-reading)]",
};

/**
 * Inline error tag used in the "Squawk Box" error log. Kind label is always
 * present as text (color is reinforcement, not the sole signal).
 */
export default function ErrorTag({
  kind,
  children,
}: {
  kind: Kind;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-[12px] font-semibold",
        kindStyle[kind],
      )}
    >
      <span className="capitalize">{kind}</span>
      <span className="font-normal text-[var(--text-secondary)]">{children}</span>
    </span>
  );
}
