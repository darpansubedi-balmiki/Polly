import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import PollyBubble from "../components/polly/PollyBubble";
import { Mic, CheckCircle, AlertTriangle, Volume } from "../components/icons";
import { cn } from "../components/ui/cn";

type Result = "good" | "adjust" | "noisy";

/**
 * Required microphone calibration before any speaking practice. Runs a ~10s
 * check using getUserMedia + Web Audio to derive a live input level and an
 * ambient-noise dB estimate, auto-adjusts gain, and gates progress on the
 * result. "Too noisy" is a genuine blocker — warmly styled, functionally
 * strict. Falls back to a simulated meter if mic access is unavailable so the
 * screen still demonstrates all three states and keeps the gate.
 */
export default function MicCalibration({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [level, setLevel] = useState(0); // 0..1 live input level
  const [ambientDb, setAmbientDb] = useState(42);
  const [result, setResult] = useState<Result>("good");
  const [denied, setDenied] = useState(false);

  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseFloorRef = useRef<number[]>([]);

  function classify(db: number): Result {
    if (db >= 55) return "noisy";
    if (db >= 48) return "adjust";
    return "good";
  }

  function cleanup() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
  }

  async function start() {
    setPhase("running");
    setSecondsLeft(10);
    noiseFloorRef.current = [];
    setDenied(false);

    let simulate = false;
    let analyser: AnalyserNode | null = null;
    let data: Uint8Array | null = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const gain = ctx.createGain();
      gain.gain.value = 1;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(gain);
      gain.connect(analyser);
      data = new Uint8Array(analyser.fftSize);
    } catch {
      simulate = true;
      setDenied(true);
    }

    const started = performance.now();
    // simulated baseline noise for the fallback path
    const simBase = 44 + Math.random() * 16; // 44–60 dB spread across runs

    const tick = () => {
      const elapsed = (performance.now() - started) / 1000;
      setSecondsLeft(Math.max(0, Math.ceil(10 - elapsed)));

      let lvl = 0;
      if (!simulate && analyser && data) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        lvl = Math.min(1, rms * 4); // auto-gain scaling
        // map rms to a rough dB SPL-ish estimate (illustrative)
        const db = 40 + rms * 120;
        noiseFloorRef.current.push(db);
      } else {
        const wobble = Math.sin(elapsed * 6) * 0.15 + Math.random() * 0.2;
        lvl = Math.max(0, Math.min(1, 0.35 + wobble));
        noiseFloorRef.current.push(simBase + (Math.random() * 4 - 2));
      }
      setLevel(lvl);

      if (elapsed >= 10) {
        const arr = noiseFloorRef.current;
        // ambient = lower percentile of measured levels (the quiet floor)
        const sorted = [...arr].sort((a, b) => a - b);
        const floor = sorted[Math.floor(sorted.length * 0.3)] ?? simBase;
        const db = Math.round(floor);
        setAmbientDb(db);
        setResult(classify(db));
        setLevel(0);
        setPhase("done");
        cleanup();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => cleanup, []);

  const canContinue = phase === "done" && result !== "noisy";

  return (
    <div className="mode-coach flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
        <div className="mb-6">
          <PollyBubble
            state={phase === "running" ? "listening" : "idle"}
            size={84}
            message={
              phase === "idle"
                ? "Before we start speaking practice, let's make sure your mic is ready. This takes 10 seconds."
                : phase === "running"
                  ? "Listening… stay quiet for a moment so I can measure the room."
                  : result === "good"
                    ? "Your setup sounds great. You're ready to speak."
                    : result === "adjust"
                      ? "Almost there — a small tweak and you're set."
                      : "It's too loud in here right now."
            }
          />
        </div>

        <h1
          className="text-[32px] font-bold leading-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Microphone check
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
          A quiet room gives more accurate speaking scores. We'll measure your ambient noise and
          input level.
        </p>

        {/* Meter */}
        <div className="mt-8 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary)]">
              <Mic size={18} /> Input level
            </span>
            {phase === "running" && (
              <span className="tabular text-[14px] font-semibold text-[var(--text-secondary)]">
                {secondsLeft}s
              </span>
            )}
          </div>

          {/* live input-level meter */}
          <div className="mt-4 flex h-8 items-end gap-1">
            {Array.from({ length: 28 }).map((_, i) => {
              const threshold = i / 28;
              const on = level >= threshold;
              const hot = threshold > 0.8;
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
                  style={{ height: on ? "100%" : "35%" }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
            <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
              <Volume size={16} /> Ambient noise
            </span>
            <span
              className={cn(
                "tabular text-[15px] font-bold",
                phase !== "done"
                  ? "text-[var(--text-tertiary)]"
                  : result === "noisy"
                    ? "text-[var(--status-danger)]"
                    : result === "adjust"
                      ? "text-[var(--status-warning)]"
                      : "text-[var(--accent-primary)]",
              )}
            >
              {phase === "done" ? `${ambientDb} dB` : "—"}
            </span>
          </div>
        </div>

        {/* Result banner */}
        {phase === "done" && (
          <div
            className={cn(
              "anim-step-in mt-5 flex items-start gap-3 rounded-[var(--radius-card)] border p-4",
              result === "good" &&
                "border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]",
              result === "adjust" &&
                "border-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_12%,transparent)]",
              result === "noisy" &&
                "border-[var(--status-danger)] bg-[color-mix(in_srgb,var(--status-danger)_12%,transparent)]",
            )}
          >
            <span
              className="mt-0.5 shrink-0"
              style={{
                color:
                  result === "good"
                    ? "var(--accent-primary)"
                    : result === "adjust"
                      ? "var(--status-warning)"
                      : "var(--status-danger)",
              }}
            >
              {result === "good" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </span>
            <div className="text-[14px]">
              <div className="font-semibold text-[var(--text-primary)]">
                {result === "good" && "Good — you're ready"}
                {result === "adjust" && "Adjust volume"}
                {result === "noisy" && "Too noisy"}
              </div>
              <p className="mt-0.5 text-[var(--text-secondary)]">
                {result === "good" &&
                  "Background noise is low. Your speaking responses will score accurately."}
                {result === "adjust" &&
                  "Move a little closer to your mic and lower nearby sounds for the best accuracy."}
                {result === "noisy" &&
                  `Background noise is too high (${ambientDb} dB). Move to a quieter space — noise directly lowers speaking scores.`}
              </p>
            </div>
          </div>
        )}

        {denied && phase === "done" && (
          <p className="mt-3 text-[13px] text-[var(--text-tertiary)]">
            Mic access was blocked, so this was a simulated check. Enable microphone permissions and
            retry for a real measurement.
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 space-y-3">
          {phase === "idle" && (
            <Button block size="l" onClick={start} leadingIcon={<Mic size={20} />}>
              Start mic check
            </Button>
          )}
          {phase === "running" && (
            <Button block size="l" loading disabled>
              Measuring…
            </Button>
          )}
          {phase === "done" && (
            <>
              <Button block size="l" disabled={!canContinue} onClick={onDone}>
                {canContinue ? "Enter my dashboard" : "Resolve noise to continue"}
              </Button>
              <Button block variant="ghost" onClick={start}>
                Run check again
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
