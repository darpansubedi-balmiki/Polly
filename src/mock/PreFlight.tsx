import Button from "../components/ui/Button";
import { Polly } from "../components/polly/PollyBubble";
import { CheckCircle, Clock, AlertTriangle, Mic, Volume, X } from "../components/icons";
import type { ReactNode } from "react";

type ItemState = "ready" | "info" | "action";

const CHECKS: {
  icon: ReactNode;
  label: string;
  detail: string;
  state: ItemState;
}[] = [
  {
    icon: <Mic size={20} />,
    label: "Microphone calibrated",
    detail: "Checked 8 minutes ago · input level good",
    state: "ready",
  },
  {
    icon: <Volume size={20} />,
    label: "Quiet environment",
    detail: "Ambient noise 41 dB · suitable for speaking tasks",
    state: "ready",
  },
  {
    icon: <Clock size={20} />,
    label: "2 hours available",
    detail: "The full test runs ~2 hours and cannot be paused",
    state: "info",
  },
  {
    icon: <AlertTriangle size={20} />,
    label: "Full-screen required",
    detail: "Your screen will switch to full-screen for the duration",
    state: "action",
  },
];

const stateColor: Record<ItemState, string> = {
  ready: "var(--accent-primary)",
  info: "var(--status-info)",
  action: "var(--status-warning)",
};

export default function PreFlight({
  onBegin,
  onCancel,
}: {
  onBegin: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="mode-coach relative grid min-h-screen place-items-center overflow-hidden bg-[var(--bg-canvas)] px-6 py-10">
      {/* subtle warm glow — this is the LAST warm screen */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 12%, transparent), transparent 68%)",
        }}
        aria-hidden="true"
      />
      {onCancel && (
        <button
          onClick={onCancel}
          aria-label="Close"
          className="focus-ring absolute right-5 top-5 grid size-10 place-items-center rounded-[var(--radius-pill)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] hover:text-[var(--text-primary)]"
        >
          <X size={18} />
        </button>
      )}

      <div className="anim-step-in relative w-full max-w-lg text-center">
        <div className="flex justify-center">
          <Polly state="idle" size={92} />
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Full mock test · PTE Academic
        </span>
        <h1
          className="mt-4 text-[34px] font-bold leading-tight text-[var(--text-primary)] sm:text-[40px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You are entering Exam Mode.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-[var(--text-secondary)]">
          This is a full, timed, scored simulation of the real test. Let's make sure you're set up
          before we switch over.
        </p>

        {/* checklist */}
        <div className="mt-8 space-y-2.5 text-left">
          {CHECKS.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-[12px]"
                style={{
                  background: `color-mix(in srgb, ${stateColor[c.state]} 16%, transparent)`,
                  color: stateColor[c.state],
                }}
              >
                {c.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-[var(--text-primary)]">{c.label}</div>
                <div className="text-[13px] text-[var(--text-tertiary)]">{c.detail}</div>
              </div>
              {c.state === "ready" && (
                <CheckCircle size={22} className="shrink-0 text-[var(--accent-primary)]" />
              )}
            </div>
          ))}
        </div>

        {/* explicit mode-change notice */}
        <div className="mt-5 rounded-[var(--radius-card)] border border-[var(--border-strong)] bg-[var(--bg-surface-raised)] p-4 text-left">
          <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
            <b className="text-[var(--text-primary)]">Polly and all gamification are disabled</b> for
            the duration of the test. Your interface will match the official test — no coaching, no
            hints, no XP or streaks — so your result reflects real exam conditions.
          </p>
        </div>

        {/* actions */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button size="l" block onClick={onBegin}>
            Begin test
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Not now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
