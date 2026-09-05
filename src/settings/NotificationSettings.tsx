import { useState } from "react";
import Toggle from "../components/ui/Toggle";
import Dropdown from "../components/ui/Dropdown";
import { Polly } from "../components/polly/PollyBubble";
import { Clock, AlertTriangle, Trophy, Target, TrendingUp } from "../components/icons";
import type { ReactNode } from "react";

type Setting = {
  id: string;
  icon: ReactNode;
  title: string;
  desc: string;
  preview: { title: string; body: string; withPolly?: boolean; tone?: "warm" | "warning" };
  defaultOn: boolean;
};

const SETTINGS: Setting[] = [
  {
    id: "idle24",
    icon: <Clock size={18} />,
    title: "24-hour nudge",
    desc: "A gentle reminder if you haven't practised in a day.",
    preview: {
      title: "Polly is waiting! 🦜",
      body: "Keep your momentum going with a quick 2-minute Repeat Sentence task.",
      withPolly: true,
      tone: "warm",
    },
    defaultOn: true,
  },
  {
    id: "abandoned72",
    icon: <AlertTriangle size={18} />,
    title: "Unfinished evaluation (72 hours)",
    desc: "If you leave a scored package incomplete, we'll remind you once.",
    preview: {
      title: "Your estimated band score is slipping",
      body: "Jump back in to finish your evaluation.",
      tone: "warning",
    },
    defaultOn: true,
  },
  {
    id: "weeklymock",
    icon: <Trophy size={18} />,
    title: "Weekly mock test reminder",
    desc: "A weekly prompt to sit a full timed mock.",
    preview: {
      title: "Time for this week's mock",
      body: "A full timed test keeps your predicted score honest. Ready when you are.",
      withPolly: true,
      tone: "warm",
    },
    defaultOn: true,
  },
  {
    id: "countdown",
    icon: <Target size={18} />,
    title: "Exam date countdown",
    desc: "Milestone reminders as your test day approaches.",
    preview: {
      title: "42 days until your PTE Academic test",
      body: "You're on track for 73. Two focused weeks on Writing could close the gap to 79.",
      tone: "warm",
    },
    defaultOn: true,
  },
  {
    id: "improvement",
    icon: <TrendingUp size={18} />,
    title: "Score improvement nudges",
    desc: "Celebrate when a skill moves up, and flag when one dips.",
    preview: {
      title: "Speaking just hit a new best: 74 ▲",
      body: "Your fluency work is paying off. One more push and you'll clear 75.",
      withPolly: true,
      tone: "warm",
    },
    defaultOn: false,
  },
];

const CHANNELS = [
  { value: "push", label: "Push + Email" },
  { value: "pushonly", label: "Push only" },
  { value: "emailonly", label: "Email only" },
];

export default function NotificationSettings() {
  const [on, setOn] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultOn])),
  );
  const [channel, setChannel] = useState("push");
  const [quiet, setQuiet] = useState(true);

  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] px-6 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-3xl">
        <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent-on-light)]">
          Settings
        </div>
        <h1 className="mt-1 text-[30px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Notifications
        </h1>
        <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
          Polly only reaches out to keep you moving. Every message is shown exactly as you'll receive it.
        </p>

        {/* delivery prefs */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[14px] font-semibold">Deliver via</div>
              <div className="text-[13px] text-[var(--text-tertiary)]">How reminders reach you</div>
            </div>
            <div className="w-44">
              <Dropdown options={CHANNELS} value={channel} onChange={setChannel} />
            </div>
          </div>
          <Toggle checked={quiet} onChange={setQuiet} label="Quiet hours (10pm–7am)" />
        </div>

        {/* each setting + live preview */}
        <div className="mt-6 space-y-4">
          {SETTINGS.map((s) => {
            const enabled = on[s.id];
            return (
              <div key={s.id} className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--bg-surface-raised)] text-[var(--text-secondary)]">
                      {s.icon}
                    </span>
                    <div>
                      <div className="text-[15px] font-semibold">{s.title}</div>
                      <div className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{s.desc}</div>
                    </div>
                  </div>
                  <Toggle checked={enabled} onChange={(v) => setOn((o) => ({ ...o, [s.id]: v }))} />
                </div>

                {/* preview */}
                <div
                  className={
                    "mt-4 flex items-start gap-3 rounded-[var(--radius-card)] border p-3.5 transition-opacity " +
                    (enabled ? "opacity-100" : "opacity-45") +
                    (s.preview.tone === "warning"
                      ? " border-[color-mix(in_srgb,var(--status-warning)_45%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--status-warning)_10%,var(--bg-surface-raised))]"
                      : " border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]")
                  }
                >
                  {s.preview.withPolly ? (
                    <Polly state="idle" size={34} />
                  ) : (
                    <span
                      className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[8px]"
                      style={
                        s.preview.tone === "warning"
                          ? { background: "color-mix(in srgb, var(--status-warning) 22%, transparent)", color: "var(--text-primary)" }
                          : { background: "var(--bg-surface)", color: "var(--text-secondary)" }
                      }
                    >
                      {s.preview.tone === "warning" ? <AlertTriangle size={16} /> : s.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                      Preview
                    </div>
                    <div className="mt-0.5 text-[14px] font-semibold text-[var(--text-primary)]">{s.preview.title}</div>
                    <div className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{s.preview.body}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
          We'll never sell your data or send marketing spam. You can turn everything off — your streak
          reminders included.
        </p>
      </div>
    </div>
  );
}
