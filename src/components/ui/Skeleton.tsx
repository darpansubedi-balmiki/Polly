import { cn } from "./cn";

/** Loading placeholder with a calm shimmer. */
export default function Skeleton({
  className,
  rounded = "var(--radius-input)",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("block animate-pulse bg-[var(--border-subtle)]", className)}
      style={{ borderRadius: rounded }}
    />
  );
}
