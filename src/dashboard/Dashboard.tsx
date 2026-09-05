import { useState } from "react";
import type { ReactNode } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ReadinessGauge from "../components/ui/ReadinessGauge";
import StreakFlame from "../components/ui/StreakFlame";
import SkillBar from "../components/ui/SkillBar";
import XPBar from "../components/ui/XPBar";
import ProgressTrendChart from "../components/ui/ProgressTrendChart";
import type { TrendPoint } from "../components/ui/ProgressTrendChart";
import AchievementBadge from "../components/ui/AchievementBadge";
import DeltaChip from "../components/ui/DeltaChip";
import { Polly } from "../components/polly/PollyBubble";
import {
  Target,
  ArrowRight,
  Trophy,
  Flame,
  Sparkle,
  Mic,
  TrendingUp,
} from "../components/icons";
import { cn } from "../components/ui/cn";

const NAV = ["Home", "Practice", "Progress", "Profile"] as const;
type NavItem = (typeof NAV)[number];

// 30-day predicted-score trend (weekly sampled points for a clean read)
const TREND: TrendPoint[] = [
  { label: "Day 1", value: 68 },
  { label: "Day 6", value: 69 },
  { label: "Day 12", value: 70 },
  { label: "Day 18", value: 71 },
  { label: "Day 24", value: 72 },
  { label: "Day 30", value: 73 },
];

type Session = {
  task: string;
  skill: string;
  score: number;
  scale: "PTE";
  when: string;
  best?: boolean;
};

const SESSIONS: Session[] = [
  { task: "Repeat Sentence", skill: "Speaking", score: 74, scale: "PTE", when: "Today · 9:12 AM", best: true },
  { task: "Summarize Written Text", skill: "Writing", score: 68, scale: "PTE", when: "Yesterday · 7:40 PM" },
  { task: "Re-order Paragraphs", skill: "Reading", score: 76, scale: "PTE", when: "Yesterday · 8:05 AM" },
];

function SectionHead({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2
        className="text-[18px] font-semibold text-[var(--text-primary)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}

function ViewLink({ children }: { children: ReactNode }) {
  return (
    <button className="focus-ring inline-flex items-center gap-1 rounded-[var(--radius-pill)] text-[13px] font-semibold text-[var(--accent-primary)] hover:underline">
      {children}
      <ArrowRight size={15} />
    </button>
  );
}

export default function Dashboard() {
  const [nav, setNav] = useState<NavItem>("Home");

  return (
    <div className="mode-coach min-h-full">
      {/* ---- Light top navigation ---- */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] backdrop-blur">
        <div className="container-grid flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--accent-primary)]">
              <Polly state="idle" size={30} />
            </span>
            <span
              className="text-[17px] font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Polly
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item}
                onClick={() => setNav(item)}
                className={cn(
                  "focus-ring rounded-[var(--radius-pill)] px-4 py-2 text-[14px] font-medium transition-colors",
                  nav === item
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

      <main className="container-grid space-y-12 py-8 pb-20">
        {/* (a) Greeting ---------------------------------------------------- */}
        <section className="flex items-center gap-4">
          <Polly state="celebrating" size={72} />
          <div>
            <h1
              className="text-[28px] font-bold leading-tight text-[var(--text-primary)] sm:text-[32px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Good morning, Aayush! <span aria-hidden>🔥</span>
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[15px] text-[var(--text-secondary)]">
              12-day streak — your Speaking is up
              <DeltaChip delta={4} /> points this week.
            </p>
          </div>
        </section>

        {/* (b) TODAY'S FOCUS — dominant illustrated card ------------------- */}
        <section aria-label="Today's focus">
          <div className="relative overflow-hidden rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-raised)]">
            {/* soft mint glow accent (kept well under 5% of pixels) */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 22%, transparent), transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.6fr_1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent-primary)]">
                  <Sparkle size={14} /> Today's focus
                </span>
                <h2
                  className="mt-4 text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] sm:text-[38px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Repeat Sentence
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[15px] text-[var(--text-secondary)]">
                  <span className="tabular inline-flex items-center gap-1.5">
                    <Mic size={17} className="text-[var(--skill-speaking)]" /> 20 items
                  </span>
                  <span aria-hidden className="text-[var(--text-tertiary)]">·</span>
                  <span className="tabular">~12 min</span>
                </div>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  This is your weakest PTE item type and it feeds both{" "}
                  <span className="font-semibold text-[var(--text-primary)]">Listening</span> and{" "}
                  <span className="font-semibold text-[var(--text-primary)]">Speaking</span>.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button size="l" trailingIcon={<ArrowRight size={20} />}>
                    Start practice
                  </Button>
                  <Button size="l" variant="ghost">
                    Choose something else
                  </Button>
                </div>
              </div>

              {/* illustration side */}
              <div className="flex items-center justify-center">
                <div className="relative flex size-52 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,var(--bg-surface))]">
                  <div className="absolute inset-4 rounded-full border border-dashed border-[var(--border-strong)]" />
                  <Polly state="explaining" size={150} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* (c) Three-card row --------------------------------------------- */}
        <section aria-label="Score summary">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <div className="flex flex-col items-center">
                <ReadinessGauge value={73} confidence={87} caption="Predicted score" size={180} />
                <div className="mt-2 text-[13px] text-[var(--text-tertiary)]">
                  PTE 73 · 87% confidence
                </div>
                <div className="mt-3">
                  <ViewLink>View details</ViewLink>
                </div>
              </div>
            </Card>

            <Card surface="warm">
              <div className="flex h-full flex-col">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-on-light)_12%,transparent)] px-2.5 py-1 text-[12px] font-semibold text-[var(--accent-on-light)]">
                  <Target size={14} /> Target
                </span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="tabular text-[52px] font-bold leading-none text-[#1a1d23]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    79
                  </span>
                  <span className="text-[15px] font-semibold text-[#6b7280]">PTE</span>
                </div>
                <p className="mt-3 text-[15px] text-[#3d434d]">
                  <span className="font-semibold text-[#1a1d23]">6 points</span> to go — you're
                  trending up.
                </p>
                <div className="mt-auto pt-4 text-[13px] font-semibold text-[#6b7280]">
                  42 days to exam
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex h-full flex-col items-start">
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--streak-flame)_16%,transparent)] px-2.5 py-1 text-[12px] font-semibold text-[var(--streak-flame)]">
                  <Flame size={14} /> Streak
                </span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="tabular text-[52px] font-bold leading-none text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    12
                  </span>
                  <span className="text-[15px] font-semibold text-[var(--text-tertiary)]">days</span>
                </div>
                <p className="mt-3 text-[15px] text-[var(--text-secondary)]">
                  Practice today to keep it alive.
                </p>
                <div className="mt-auto pt-4">
                  <StreakFlame count={12} />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* (d) Skill bars ------------------------------------------------- */}
        <section aria-label="Skills">
          <SectionHead
            title="Your skills"
            action={<ViewLink>View details</ViewLink>}
          />
          <Card>
            <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              <SkillBar skill="speaking" label="Speaking" current={71} target={79} delta={4} />
              <SkillBar skill="writing" label="Writing" current={68} target={79} delta={2} />
              <SkillBar skill="reading" label="Reading" current={76} target={79} delta={3} />
              <SkillBar skill="listening" label="Listening" current={74} target={79} delta={1} />
            </div>
          </Card>
        </section>

        {/* (e) XP bar ----------------------------------------------------- */}
        <section aria-label="Experience">
          <Card>
            <XPBar level={7} current={320} needed={500} />
          </Card>
        </section>

        {/* (f) 30-day trend ---------------------------------------------- */}
        <section aria-label="Progress trend">
          <SectionHead
            title="30-day progress"
            action={
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
                <TrendingUp size={16} className="text-[var(--accent-primary)]" /> +5 in 30 days
              </span>
            }
          />
          <Card>
            <ProgressTrendChart scale="PTE" target={79} data={TREND} height={220} />
          </Card>
        </section>

        {/* (g) Recent activity ------------------------------------------- */}
        <section aria-label="Recent activity">
          <SectionHead title="Recent activity" action={<ViewLink>See all</ViewLink>} />
          <div className="space-y-2.5">
            {SESSIONS.map((s) => (
              <div
                key={s.task + s.when}
                className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                      {s.task}
                    </span>
                    {s.best && (
                      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-2 py-0.5 text-[12px] font-semibold text-[var(--accent-primary)]">
                        New personal best! <span aria-hidden>🎉</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">
                    {s.skill} · {s.when}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="tabular text-[20px] font-bold text-[var(--text-primary)]">
                    {s.score}
                    <span className="text-[13px] font-medium text-[var(--text-tertiary)]"> / 90</span>
                  </span>
                  <ViewLink>View feedback</ViewLink>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* (h) Achievements ---------------------------------------------- */}
        <section aria-label="Achievements">
          <SectionHead title="Achievements" action={<ViewLink>All achievements</ViewLink>} />
          <div className="flex flex-wrap gap-3">
            <AchievementBadge icon={<Trophy size={26} />} title="First Mock" detail="Completed a full test" state="unlocked" />
            <AchievementBadge icon={<Flame size={26} />} title="12-Day Streak" detail="Nearly two weeks" state="just-unlocked" />
            <AchievementBadge icon={<Mic size={26} />} title="Speaking 75" detail="Reach 75 in Speaking" state="locked" />
            <AchievementBadge icon={<Sparkle size={26} />} title="Skill Master" detail="Reach 79 in a skill" state="locked" />
          </div>
        </section>
      </main>
    </div>
  );
}
