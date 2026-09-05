import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Button from "../components/ui/Button";
import SegmentedControl from "../components/ui/SegmentedControl";
import PaywallSheet from "../components/ui/PaywallSheet";
import StreakFlame from "../components/ui/StreakFlame";
import { Polly } from "../components/polly/PollyBubble";
import {
  ArrowRight,
  Play,
  Headphones,
  Trophy,
  Mic,
  Pencil,
  BookOpen,
  Clock,
  Lock,
  Target,
  Sparkle,
} from "../components/icons";
import { cn } from "../components/ui/cn";

type SkillKey = "speaking" | "writing" | "reading" | "listening";

const skillVar: Record<SkillKey, string> = {
  speaking: "var(--skill-speaking)",
  writing: "var(--skill-writing)",
  reading: "var(--skill-reading)",
  listening: "var(--skill-listening)",
};
const skillLabel: Record<SkillKey, string> = {
  speaking: "Speaking",
  writing: "Writing",
  reading: "Reading",
  listening: "Listening",
};
const skillIcon: Record<SkillKey, ReactNode> = {
  speaking: <Mic size={22} />,
  writing: <Pencil size={22} />,
  reading: <BookOpen size={22} />,
  listening: <Headphones size={22} />,
};

type LibItem = {
  id: string;
  task: string;
  skill: SkillKey;
  items: number;
  avgMin: number;
  best: number | null; // PTE best score, null if never attempted
  feeds: string;
  focus?: boolean;
  locked?: boolean;
};

// Real PTE Academic task types, grouped by primary skill.
const LIBRARY: LibItem[] = [
  { id: "read-aloud", task: "Read Aloud", skill: "speaking", items: 7, avgMin: 9, best: 71, feeds: "Speaking + Reading", focus: true },
  { id: "repeat-sentence", task: "Repeat Sentence", skill: "speaking", items: 20, avgMin: 12, best: 68, feeds: "Speaking + Listening", focus: true },
  { id: "describe-image", task: "Describe Image", skill: "speaking", items: 6, avgMin: 10, best: 74, feeds: "Speaking" },
  { id: "retell-lecture", task: "Re-tell Lecture", skill: "speaking", items: 4, avgMin: 11, best: null, feeds: "Speaking + Listening", locked: true },
  { id: "summarize-text", task: "Summarize Written Text", skill: "writing", items: 3, avgMin: 20, best: 68, feeds: "Writing + Reading" },
  { id: "write-essay", task: "Write Essay", skill: "writing", items: 2, avgMin: 40, best: null, feeds: "Writing", locked: true },
  { id: "reorder", task: "Re-order Paragraphs", skill: "reading", items: 8, avgMin: 9, best: 76, feeds: "Reading" },
  { id: "fill-blanks-r", task: "Fill in the Blanks", skill: "reading", items: 10, avgMin: 8, best: 73, feeds: "Reading + Writing" },
  { id: "dictation", task: "Write from Dictation", skill: "listening", items: 12, avgMin: 7, best: 70, feeds: "Listening + Writing", focus: true },
  { id: "summarize-spoken", task: "Summarize Spoken Text", skill: "listening", items: 3, avgMin: 15, best: null, feeds: "Listening + Writing", locked: true },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "speaking", label: "Speaking" },
  { id: "writing", label: "Writing" },
  { id: "reading", label: "Reading" },
  { id: "listening", label: "Listening" },
];

type ModeCard = {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  meta: string;
  icon: ReactNode;
  exam?: boolean;
};

const MODES: ModeCard[] = [
  {
    id: "quick",
    eyebrow: "Warm up",
    title: "Quick Practice",
    desc: "Drill a single question type at your own pace — no timer, instant coaching.",
    meta: "1 item type · ~5 min",
    icon: <Play size={24} />,
  },
  {
    id: "section",
    eyebrow: "Build stamina",
    title: "Section Practice",
    desc: "A full module end to end, e.g. all of PTE Speaking, lightly timed with feedback.",
    meta: "All Speaking · 34 items · ~30 min",
    icon: <Headphones size={24} />,
  },
  {
    id: "mock",
    eyebrow: "Test yourself",
    title: "Full Mock Test",
    desc: "The exact exam structure, strictly timed and fully scored. Switches into Exam Mode.",
    meta: "3 hrs · scored /90",
    icon: <Trophy size={24} />,
    exam: true,
  },
];

export default function PracticeHub({
  onStartSession,
  onGoDashboard,
}: {
  onStartSession: (id: string) => void;
  onGoDashboard?: () => void;
}) {
  const [filter, setFilter] = useState("all");
  const [focusOnly, setFocusOnly] = useState(false);
  const [paywall, setPaywall] = useState<LibItem | null>(null);

  const visible = useMemo(
    () =>
      LIBRARY.filter((i) => (filter === "all" ? true : i.skill === filter)).filter((i) =>
        focusOnly ? i.focus : true,
      ),
    [filter, focusOnly],
  );

  return (
    <div className="mode-coach min-h-full">
      {/* ---- Top navigation ---- */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] backdrop-blur">
        <div className="container-grid flex h-16 items-center justify-between">
          <button
            onClick={onGoDashboard}
            className="focus-ring flex items-center gap-2.5 rounded-[var(--radius-pill)]"
          >
            <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--accent-primary)]">
              <Polly state="idle" size={30} />
            </span>
            <span
              className="text-[17px] font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Polly
            </span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {["Home", "Practice", "Progress", "Profile"].map((item) => (
              <button
                key={item}
                onClick={item === "Home" ? onGoDashboard : undefined}
                className={cn(
                  "focus-ring rounded-[var(--radius-pill)] px-4 py-2 text-[14px] font-medium transition-colors",
                  item === "Practice"
                    ? "bg-[var(--bg-surface-raised)] text-[var(--text-primary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                )}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <StreakFlame count={12} />
            <span className="grid size-10 place-items-center rounded-full bg-[var(--bg-surface-raised)] text-[14px] font-bold text-[var(--text-primary)]">
              AS
            </span>
          </div>
        </div>
      </header>

      <main className="container-grid space-y-12 py-8 pb-24">
        {/* ---- Heading ---- */}
        <section>
          <h1
            className="text-[28px] font-bold leading-tight text-[var(--text-primary)] sm:text-[34px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Practice
          </h1>
          <p className="mt-1.5 max-w-xl text-[15px] text-[var(--text-secondary)]">
            Choose how you want to train today. Short drills build accuracy; mocks build exam
            stamina.
          </p>
        </section>

        {/* ---- Three mode cards ---- */}
        <section aria-label="Practice modes">
          <div className="grid gap-4 lg:grid-cols-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => onStartSession(m.id)}
                className={cn(
                  "focus-ring group relative flex flex-col overflow-hidden rounded-[var(--radius-feature)] border p-6 text-left transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-1",
                  m.exam
                    ? "border-[var(--border-strong)] bg-[var(--bg-surface-raised)] hover:shadow-[var(--shadow-raised)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]",
                )}
              >
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-[14px]",
                    m.exam
                      ? "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-strong)]"
                      : "bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] text-[var(--accent-primary)]",
                  )}
                >
                  {m.icon}
                </span>
                <span className="mt-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  {m.eyebrow}
                </span>
                <span
                  className="mt-1 text-[22px] font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {m.title}
                </span>
                <span className="mt-2 flex-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                  {m.desc}
                </span>
                <span className="mt-5 flex items-center justify-between">
                  <span className="tabular inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-tertiary)]">
                    <Clock size={15} /> {m.meta}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-[var(--text-primary)]">
                    Start
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
                {m.exam && (
                  <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
                    Exam Mode
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ---- Filterable library ---- */}
        <section aria-label="Task library">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2
              className="text-[18px] font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Task library
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFocusOnly((v) => !v)}
                aria-pressed={focusOnly}
                className={cn(
                  "focus-ring inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 py-2 text-[13px] font-semibold transition-colors",
                  focusOnly
                    ? "border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_14%,transparent)] text-[var(--accent-primary)]"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                <Target size={15} /> Focus areas
              </button>
              <SegmentedControl segments={FILTERS} value={filter} onChange={setFilter} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((i) =>
              i.locked ? (
                <LockedCard key={i.id} item={i} onNudge={() => setPaywall(i)} />
              ) : (
                <LibraryCard key={i.id} item={i} onStart={() => onStartSession(i.id)} />
              ),
            )}
          </div>

          {visible.length === 0 && (
            <p className="py-10 text-center text-[14px] text-[var(--text-tertiary)]">
              No focus tasks in this skill — you're on track here.
            </p>
          )}
        </section>
      </main>

      <PaywallSheet
        open={!!paywall}
        title="Unlock every task type"
        subtitle={
          paywall
            ? `${paywall.task} and all premium drills are part of Polly Premium.`
            : ""
        }
        benefits={[
          "Unlimited attempts on every PTE & IELTS task type",
          "Full scored mock tests with section-level breakdowns",
          "Detailed Polly feedback: fluency, pronunciation, grammar",
        ]}
        priceLine="Cancel anytime · 7-day free trial"
        illustration={<Polly state="explaining" size={96} />}
        onClose={() => setPaywall(null)}
        onUpgrade={() => setPaywall(null)}
      />
    </div>
  );
}

function MetaRow({ item }: { item: LibItem }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--text-tertiary)]">
      <span className="tabular">{item.items} items</span>
      <span aria-hidden>·</span>
      <span className="tabular inline-flex items-center gap-1">
        <Clock size={13} /> ~{item.avgMin} min
      </span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        Best{" "}
        {item.best !== null ? (
          <span className="tabular font-semibold text-[var(--text-secondary)]">{item.best}</span>
        ) : (
          <span className="text-[var(--text-tertiary)]">—</span>
        )}
      </span>
    </div>
  );
}

function FeedsTag({ item }: { item: LibItem }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-2.5 py-1 text-[12px] font-medium text-[var(--text-secondary)]">
      <Sparkle size={12} className="text-[var(--text-tertiary)]" /> Feeds: {item.feeds}
    </span>
  );
}

function LibraryCard({ item, onStart }: { item: LibItem; onStart: () => void }) {
  return (
    <button
      onClick={onStart}
      className="focus-ring group flex w-full items-start gap-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-left transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
    >
      <span
        className="grid size-12 shrink-0 place-items-center rounded-[14px]"
        style={{
          background: `color-mix(in srgb, ${skillVar[item.skill]} 18%, transparent)`,
          color: skillVar[item.skill],
        }}
      >
        {skillIcon[item.skill]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[16px] font-semibold text-[var(--text-primary)]">{item.task}</span>
          {item.focus && (
            <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--status-warning)_18%,transparent)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--status-warning)]">
              <Target size={12} /> Focus
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[13px]" style={{ color: skillVar[item.skill] }}>
          {skillLabel[item.skill]}
        </span>
        <MetaRow item={item} />
        <span className="mt-3 flex">
          <FeedsTag item={item} />
        </span>
      </span>
      <ArrowRight
        size={20}
        className="mt-1 shrink-0 text-[var(--text-tertiary)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)]"
      />
    </button>
  );
}

function LockedCard({ item, onNudge }: { item: LibItem; onNudge: () => void }) {
  return (
    <div className="relative flex items-start gap-4 overflow-hidden rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--bg-surface)_60%,transparent)] p-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-[var(--bg-surface-raised)] text-[var(--text-tertiary)]">
        {skillIcon[item.skill]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[16px] font-semibold text-[var(--text-secondary)]">{item.task}</span>
          <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--status-warning)_16%,transparent)] px-2 py-0.5 text-[11px] font-semibold text-[var(--status-warning)]">
            <Lock size={12} /> Premium
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-tertiary)]">
          You've used your free {skillLabel[item.skill].toLowerCase()} drills for today. Unlock
          unlimited attempts with Premium.
        </p>
        <div className="mt-3">
          <Button size="s" variant="secondary" onClick={onNudge} leadingIcon={<Sparkle size={15} />}>
            See what's included
          </Button>
        </div>
      </div>
    </div>
  );
}
