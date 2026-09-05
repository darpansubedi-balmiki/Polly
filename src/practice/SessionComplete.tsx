import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Button from "../components/ui/Button";
import XPBar from "../components/ui/XPBar";
import StreakFlame from "../components/ui/StreakFlame";
import { Polly } from "../components/polly/PollyBubble";
import { Check, ArrowRight, Sparkle, Flame } from "../components/icons";

// Session earns 140 XP, which carries level 7 (420/500) over the top into level 8.
const START = { level: 7, current: 420, needed: 500 };
const END = { level: 8, current: 60, needed: 500 };
const XP_EARNED = 140;

export default function SessionComplete({
  onContinueFeedback,
  onBackToDashboard,
}: {
  onContinueFeedback: () => void;
  onBackToDashboard: () => void;
}) {
  // Two-step XP animation: fill toward full, then flip into the new level.
  const [xp, setXp] = useState(START);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(
      () => setXp({ ...START, current: START.needed }),
      450,
    );
    const t2 = window.setTimeout(() => {
      setXp(END);
      setLeveledUp(true);
    }, 1250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="mode-coach relative grid min-h-full place-items-center overflow-hidden px-6 py-12">
      {/* restrained mint glow — well under 5% of pixels, no confetti/looping */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 18%, transparent), transparent 68%)",
        }}
        aria-hidden="true"
      />

      <div className="anim-step-in relative w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="anim-pop">
            <Polly state="celebrating" size={120} />
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent-primary)]">
            <Sparkle size={14} /> Session complete
          </span>
          <h1
            className="mt-4 text-[32px] font-bold leading-tight text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Well done, Aayush!
          </h1>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
            You finished a full Read Aloud set. Your fluency is trending up — keep this rhythm going.
          </p>
        </div>

        {/* stat tiles */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat value="7" label="Items completed" icon={<Check size={18} strokeWidth={2.5} />} />
          <Stat value={`+${XP_EARNED}`} label="XP earned" accent icon={<Sparkle size={18} />} />
          <Stat value="13" label="Day streak" icon={<Flame size={18} />} />
        </div>

        {/* XP bar with level-up */}
        <div className="mt-4 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <XPBar level={xp.level} current={xp.current} needed={xp.needed} leveledUp={leveledUp} />
          <p className="mt-3 text-center text-[13px] text-[var(--text-secondary)]">
            {leveledUp ? (
              <>
                🎉 You reached{" "}
                <span className="font-semibold text-[var(--text-primary)]">Level 8</span> — new drills
                unlocked.
              </>
            ) : (
              "Tallying your XP…"
            )}
          </p>
        </div>

        {/* streak maintained */}
        <div className="mt-4 flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
          <div>
            <div className="text-[14px] font-semibold text-[var(--text-primary)]">
              Streak extended
            </div>
            <div className="text-[13px] text-[var(--text-tertiary)]">
              13 days in a row — your longest yet.
            </div>
          </div>
          <StreakFlame count={13} />
        </div>

        {/* next actions — one clear primary */}
        <div className="mt-7 flex flex-col gap-3">
          <Button size="l" block trailingIcon={<ArrowRight size={20} />} onClick={onContinueFeedback}>
            Continue to feedback
          </Button>
          <Button size="l" block variant="ghost" onClick={onBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  icon,
  accent = false,
}: {
  value: string;
  label: string;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-4 text-center">
      <span
        className="grid size-9 place-items-center rounded-full"
        style={
          accent
            ? { background: "color-mix(in srgb, var(--accent-primary) 18%, transparent)", color: "var(--accent-primary)" }
            : { background: "var(--bg-surface-raised)", color: "var(--text-secondary)" }
        }
      >
        {icon}
      </span>
      <span
        className="tabular mt-2 text-[24px] font-bold leading-none text-[var(--text-primary)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </span>
      <span className="mt-1.5 text-[11px] font-medium leading-tight text-[var(--text-tertiary)]">
        {label}
      </span>
    </div>
  );
}
