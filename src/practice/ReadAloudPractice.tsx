import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import IconButton from "../components/ui/IconButton";
import QuestionCounterPill from "../components/ui/QuestionCounterPill";
import MicStatus from "../components/ui/MicStatus";
import { Polly } from "../components/polly/PollyBubble";
import { X, Mic, Check, Info } from "../components/icons";
import { cn } from "../components/ui/cn";

// Real PTE Academic Read Aloud prompts — academic register, ~35–40 words each.
const PROMPTS = [
  "The proliferation of renewable energy technologies has fundamentally altered the economics of electricity generation, prompting utilities to reconsider long-standing assumptions about baseload capacity and grid stability.",
  "Urban planners increasingly argue that pedestrian-friendly design not only reduces traffic congestion but also fosters the kind of incidental social interaction on which vibrant communities depend.",
  "Recent advances in genome sequencing have dramatically lowered the cost of analysis, yet the ethical frameworks governing the use of such data have struggled to keep pace with the technology.",
  "The migration patterns of Arctic seabirds provide researchers with a sensitive early indicator of environmental change, since even modest shifts in ocean temperature alter the distribution of their prey.",
  "Although the printing press is often credited with democratising knowledge, historians note that its immediate effect was to intensify existing debates rather than to broaden participation in them.",
  "Behavioural economists have demonstrated that the way choices are framed can influence decisions as powerfully as the underlying options themselves, a finding with profound implications for public policy.",
  "The restoration of coastal wetlands has emerged as one of the most cost-effective strategies for protecting shorelines, absorbing floodwater while simultaneously sequestering significant quantities of carbon.",
];

const CHEERS = [
  "Nice pacing! 🔥",
  "Clear and steady 👏",
  "Great fluency! ✨",
  "Smooth delivery 🎯",
  "Confident read! 💪",
  "Lovely intonation 🎵",
  "Strong finish! 🚀",
];

const PREP_SECONDS = 8; // shortened prep window for practice
const SPEAK_WINDOW = 6.5; // simulated "speaking" duration before silence
const SILENCE_LOCK_MS = 3000; // auto-lock after 3s of silence

type Phase = "prep" | "recording" | "done";
type Upload = "saving" | "uploaded";

export default function ReadAloudPractice({
  onFinish,
  onExit,
}: {
  onFinish: () => void;
  onExit: () => void;
}) {
  const total = PROMPTS.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("prep");
  const [secondsLeft, setSecondsLeft] = useState(PREP_SECONDS);
  const [level, setLevel] = useState(0);
  const [upload, setUpload] = useState<Upload>("saving");

  const rafRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  function clearTimers() {
    cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }

  // ---- Preparation countdown ----
  useEffect(() => {
    if (phase !== "prep") return;
    setSecondsLeft(PREP_SECONDS);
    const started = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - started) / 1000;
      const left = Math.max(0, Math.ceil(PREP_SECONDS - elapsed));
      setSecondsLeft(left);
      if (elapsed >= PREP_SECONDS) {
        setPhase("recording");
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, index]);

  // ---- Recording: simulated live level + silence auto-lock ----
  useEffect(() => {
    if (phase !== "recording") return;
    const started = performance.now();
    let quietSince: number | null = null;
    const tick = () => {
      const now = performance.now();
      const elapsed = (now - started) / 1000;
      let lvl: number;
      if (elapsed < SPEAK_WINDOW) {
        // lively speech envelope
        lvl = 0.35 + Math.abs(Math.sin(elapsed * 5.5)) * 0.5 + (Math.random() * 0.1 - 0.05);
      } else {
        // trailing silence
        lvl = Math.max(0, 0.04 + Math.random() * 0.03);
      }
      lvl = Math.max(0, Math.min(1, lvl));
      setLevel(lvl);
      setSecondsLeft(Math.max(0, Math.round(40 - elapsed))); // 40s recording allowance

      if (lvl < 0.12) {
        if (quietSince === null) quietSince = now;
        else if (now - quietSince >= SILENCE_LOCK_MS) {
          complete();
          return;
        }
      } else {
        quietSince = null;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  function complete() {
    cancelAnimationFrame(rafRef.current);
    setLevel(0);
    setPhase("done");
    setUpload("saving");
    const up = window.setTimeout(() => setUpload("uploaded"), 1300);
    const adv = window.setTimeout(() => advance(), 2600);
    timersRef.current.push(up, adv);
  }

  function advance() {
    if (index + 1 >= total) {
      onFinish();
      return;
    }
    setIndex((i) => i + 1);
    setPhase("prep");
  }

  useEffect(() => clearTimers, []);

  const prompt = PROMPTS[index];
  const cheer = CHEERS[index % CHEERS.length];
  // progress fills as items complete
  const completed = index + (phase === "done" ? 1 : 0);
  const pct = Math.round((completed / total) * 100);

  const pollyState =
    phase === "recording" ? "listening" : phase === "done" ? "celebrating" : "idle";

  return (
    <div className="mode-coach flex min-h-full flex-col bg-[var(--bg-canvas)]">
      {/* ---- Persistent top bar ---- */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 py-3.5">
          <IconButton label="Exit practice" icon={<X size={18} />} variant="ghost" onClick={onExit} />
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <QuestionCounterPill current={index + 1} total={total} />
              <span className="text-[13px] font-medium text-[var(--text-tertiary)]">
                Read Aloud · Speaking
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ---- Question body ---- */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)]">
          <Info size={15} className="text-[var(--accent-primary)]" />
          Look at the text below. Read it aloud clearly and at a natural pace.
        </div>

        {/* the passage — large, readable, minimal distraction */}
        <p
          className="mt-8 text-[26px] font-medium leading-[1.5] text-[var(--text-primary)] sm:text-[30px] sm:leading-[1.55]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {prompt}
        </p>

        {/* ---- Mic state region ---- */}
        <div className="mt-auto pt-10">
          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            {phase === "prep" && (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <MicStatus state="preparation" secondsLeft={secondsLeft} />
                <Button variant="secondary" onClick={() => setPhase("recording")}>
                  I'm ready — start now
                </Button>
              </div>
            )}

            {phase === "recording" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <MicStatus state="recording" level={level} secondsLeft={secondsLeft} />
                  <Button variant="secondary" onClick={complete} leadingIcon={<Check size={18} />}>
                    Done reading
                  </Button>
                </div>
                {/* live level meter */}
                <div className="flex h-10 items-end gap-1" aria-hidden="true">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const threshold = i / 40;
                    const on = level >= threshold;
                    const hot = threshold > 0.82;
                    return (
                      <span
                        key={i}
                        className={cn(
                          "flex-1 rounded-sm transition-[height,background-color] duration-75",
                          on
                            ? hot
                              ? "bg-[var(--status-warning)]"
                              : "bg-[var(--accent-primary)]"
                            : "bg-[var(--border-subtle)]",
                        )}
                        style={{ height: on ? "100%" : "30%" }}
                      />
                    );
                  })}
                </div>
                <p className="text-center text-[13px] text-[var(--text-tertiary)]">
                  Recording locks automatically after a few seconds of silence.
                </p>
              </div>
            )}

            {phase === "done" && (
              <div className="anim-pop flex flex-col items-center gap-3 py-2 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-[var(--accent-primary)] text-[#04120a]">
                  <Check size={30} strokeWidth={2.5} />
                </span>
                <div
                  className="text-[22px] font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cheer}
                </div>
                <UploadIndicator state={upload} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ---- Polly supporting corner ---- */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-30 hidden items-end gap-2 sm:flex">
        <div className="pointer-events-auto max-w-[220px] rounded-[var(--radius-card)] rounded-br-none border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] px-3.5 py-2.5 text-[13px] leading-snug text-[var(--text-primary)] shadow-[var(--shadow-rest)]">
          {phase === "prep" && "Take a breath and scan the sentence before the mic opens."}
          {phase === "recording" && "I'm listening — keep an even pace, don't rush the commas."}
          {phase === "done" && "Saved. On to the next one!"}
        </div>
        <Polly state={pollyState} size={72} />
      </div>
    </div>
  );
}

function UploadIndicator({ state }: { state: Upload }) {
  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-3 py-1 text-[12px] font-medium",
        state === "saving"
          ? "bg-[var(--bg-surface-raised)] text-[var(--text-secondary)]"
          : "bg-[color-mix(in_srgb,var(--accent-primary)_14%,transparent)] text-[var(--accent-primary)]",
      )}
    >
      {state === "saving" ? (
        <>
          <span
            className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          Saved locally — uploading…
        </>
      ) : (
        <>
          <Check size={14} strokeWidth={2.5} /> Uploaded
        </>
      )}
    </span>
  );
}
