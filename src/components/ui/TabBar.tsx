import { cn } from "./cn";

type Tab = { id: string; label: string };

export default function TabBar({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex gap-1 border-b border-[var(--border-subtle)]"
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "focus-ring relative h-11 px-4 text-[15px] font-medium transition-colors duration-150",
              active
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
            )}
          >
            {t.label}
            <span
              className={cn(
                "absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-opacity duration-150",
                active ? "bg-[var(--accent-primary)] opacity-100" : "opacity-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
