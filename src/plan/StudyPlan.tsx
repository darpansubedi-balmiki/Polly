import { useState } from "react";
import Button from "../components/ui/Button";
import DeltaChip from "../components/ui/DeltaChip";
import { Polly } from "../components/polly/PollyBubble";
import {
  Mic,
  BookOpen,
  Pencil,
  Headphones,
  Clock,
  CheckCircle,
  Sparkle,
  Target,
} from "../components/icons";
import type { ReactNode } from "react";

type SkillKey = "speaking" | "writing" | "reading" | "listening";
const skillIcon: Record<SkillKey, ReactNode> = {
  speaking: <Mic size={18} />,
  writing: <Pencil size={18} />,
  reading: <BookOpen size={18} />,
  listening: <Headphones size={18} />,
};
const skillVar: Record<SkillKey, string> = {
  speaking: "var(--skill-speaking)",
  writing: "var(--skill-writing)",
  reading: "var(--skill-reading)",
  listening: "var(--skill-listening)",
};

type Task = {
  id: string;
  title: string;
  skill: SkillKey;
  minutes: number;
  gain: number;
  focus?: boolean;
  done?: boolean;
};

const TODAY: Task[] = [
  { id: "t1", title: "Describe Image — data trends", skill: "speaking", minutes: 12, gain: 4, focus: true },
  { id: "t2", title: "Writing Task 2 — opinion essay", skill: "writing", minutes: 20, gain: 5, focus: true },
  { id: "t3", title: "Repeat Sentence drill ×10", skill: "speaking", minutes: 8, gain: 2 },
  { id: "t4", title: "Reading — True/False/Not Given set", skill: "reading", minutes: 15, gain: 2, done: true },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
type WeekCell = { load: 0 | 1 | 2 | 3; label?: string; today?: boolean; rest?: boolean };
const WEEK: WeekCell[] = [
  { load: 2, label: "Speaking focus" },
  { load: 3, label: "Today · 4 tasks", today: true },
  { load: 2, label: "Writing focus" },
  { load: 1, label: "Light review" },
  { load: 3, label: "Full mock" },
  { load: 0, rest: true, label: "Rest day" },
  { load: 2, label: "Weak-skill mix" },
];

export default function StudyPlan({
  onStartTask,
  onRegenerate,
}: {
  onStartTask?: () => void;
  onRegenerate?: () => void;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({ t4: true });
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  const totalGain = TODAY.reduce((s, t) => s + t.gain, 0);
  const doneGain = TODAY.filter((t) => done[t.id]).reduce((s, t) => s + t.gain, 0);

  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] px-6 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent-on-light)]">
              Your study plan
            </div>
            <h1 className="mt-1 text-[30px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
              This week, built around your weak spots
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-[13px] font-semibold">
              <Clock size={16} className="text-[var(--text-tertiary)]" />
              Days until exam: <span className="text-[var(--text-primary)]">42</span>
            </span>
            <Button variant="secondary" leadingIcon={<Sparkle size={16} />} onClick={onRegenerate}>
              Regenerate plan
            </Button>
          </div>
        </div>

        {/* weekly calendar */}
        <section className="mt-8 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div className="grid grid-cols-7 gap-2.5">
            {WEEK.map((c, i) => (
              <div
                key={DAYS[i]}
                className={
                  "flex min-h-[104px] flex-col rounded-[var(--radius-card)] border p-3 " +
                  (c.today
                    ? "border-[var(--accent-primary)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-raised)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--text-secondary)]">{DAYS[i]}</span>
                  {c.today && (
                    <span className="rounded-[var(--radius-pill)] bg-[var(--accent-primary)] px-1.5 py-0.5 text-[10px] font-bold text-[#04120a]">
                      TODAY
                    </span>
                  )}
                </div>
                {/* load dots */}
                <div className="mt-2 flex gap-1" aria-label={`${c.load} tasks`}>
                  {c.rest ? (
                    <span className="text-[11px] text-[var(--text-tertiary)]">—</span>
                  ) : (
                    Array.from({ length: 3 }).map((_, d) => (
                      <span
                        key={d}
                        className="h-1.5 flex-1 rounded-full"
                        style={{ background: d < c.load ? "var(--accent-primary)" : "var(--border-subtle)" }}
                      />
                    ))
                  )}
                </div>
                <span className="mt-auto pt-2 text-[12px] leading-snug text-[var(--text-tertiary)]">{c.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* today */}
        <section className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Today's focus · 4 tasks
              </h2>
              <span className="text-[13px] text-[var(--text-tertiary)]">~55 min</span>
            </div>

            <div className="mt-4 space-y-2.5">
              {TODAY.map((t) => {
                const isDone = !!done[t.id];
                return (
                  <div
                    key={t.id}
                    className={
                      "flex items-center gap-3 rounded-[var(--radius-card)] border p-3.5 transition-colors " +
                      (isDone
                        ? "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] opacity-70"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]")
                    }
                  >
                    <button
                      onClick={() => toggle(t.id)}
                      aria-pressed={isDone}
                      aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                      className="focus-ring grid size-7 shrink-0 place-items-center rounded-full border-2"
                      style={
                        isDone
                          ? { background: "var(--accent-primary)", borderColor: "var(--accent-primary)" }
                          : { borderColor: "var(--border-strong)" }
                      }
                    >
                      {isDone && <CheckCircle size={16} className="text-[#04120a]" />}
                    </button>
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-[10px]"
                      style={{ background: `color-mix(in srgb, ${skillVar[t.skill]} 18%, transparent)`, color: skillVar[t.skill] }}
                    >
                      {skillIcon[t.skill]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={"text-[15px] font-semibold " + (isDone ? "line-through" : "")}>
                        {t.title}
                        {t.focus && !isDone && (
                          <span className="ml-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--status-warning)_20%,transparent)] px-2 py-0.5 text-[11px] font-bold text-[var(--text-primary)]">
                            Focus area
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
                        <Clock size={13} /> {t.minutes} min
                        <span className="text-[var(--border-strong)]">·</span>
                        expected <DeltaChip delta={t.gain} suffix=" pts" />
                      </div>
                    </div>
                    {!isDone && (
                      <Button size="s" onClick={onStartTask}>
                        Start
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* side: expected gain + Polly */}
          <div className="flex flex-col gap-5">
            <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-secondary)]">
                <Target size={16} /> Today's potential
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[40px] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  +{totalGain}
                </span>
                <span className="text-[14px] text-[var(--text-tertiary)]">predicted points</span>
              </div>
              <div className="mt-4 h-2.5 w-full rounded-full bg-[var(--border-subtle)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-500"
                  style={{ width: `${(doneGain / totalGain) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">
                +{doneGain} banked · +{totalGain - doneGain} still on the table
              </p>
            </div>

            <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5">
              <div className="flex items-start gap-3">
                <Polly state="explaining" size={44} />
                <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                  Writing is your biggest lever right now, Aayush — I front-loaded two writing tasks
                  today. Clear them and your predicted score should tick up by test day.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
