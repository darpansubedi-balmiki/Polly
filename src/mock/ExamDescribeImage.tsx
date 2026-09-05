import { useEffect, useRef, useState } from "react";
import ExamTimer from "../components/ui/ExamTimer";

// PTE Describe Image — FULL EXAM MODE. Single item, 25s prep → 40s recording,
// then auto-advances. No Previous, no navigator, no mascot, no brand color.
// A stark, bespoke recording indicator (the library MicStatus carries brand
// color, which is forbidden here).

const PREP = 25;
const RECORD = 40;

type Phase = "prep" | "recording" | "completed";

export default function ExamDescribeImage({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<Phase>("prep");
  const [left, setLeft] = useState(PREP);
  const [level, setLevel] = useState(0);
  const raf = useRef<number | null>(null);

  // countdown driver
  useEffect(() => {
    if (phase === "completed") return;
    if (left <= 0) {
      if (phase === "prep") {
        setPhase("recording");
        setLeft(RECORD);
      } else {
        setPhase("completed");
      }
      return;
    }
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [left, phase]);

  // simulated input meter while recording
  useEffect(() => {
    if (phase !== "recording") {
      setLevel(0);
      return;
    }
    const tick = () => {
      setLevel(0.25 + Math.random() * 0.6);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [phase]);

  const totalSecs = phase === "prep" ? PREP : RECORD;
  const barPct = phase === "completed" ? 100 : ((totalSecs - left) / totalSecs) * 100;

  return (
    <div className="mode-exam flex h-screen flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* header */}
      <header className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2">
        <div className="text-[14px] font-semibold">PTE Academic — Speaking · Describe Image</div>
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-[var(--text-secondary)]">Item 12 of 15</span>
          <ExamTimer seconds={left} variant="exam" warnUnder={phase === "recording" ? 10 : 5} />
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-6 py-6">
        {/* instruction */}
        <p className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-[15px] leading-relaxed">
          Look at the image below. In 25 seconds, please speak into the microphone and describe in
          detail what the image is showing. You will have 40 seconds to give your response.
        </p>

        {/* image */}
        <div className="mt-5 grid flex-1 place-items-center border border-[var(--border-strong)] bg-[var(--bg-surface-raised)] p-6">
          <BarChartFigure />
        </div>

        {/* stark recorder */}
        <div className="mt-5 border border-[var(--border-strong)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block size-3"
                style={{
                  background:
                    phase === "recording"
                      ? "var(--status-danger)"
                      : phase === "completed"
                        ? "var(--text-tertiary)"
                        : "var(--border-strong)",
                  borderRadius: phase === "recording" ? "999px" : "0",
                }}
                aria-hidden="true"
              />
              <span className="text-[14px] font-bold uppercase tracking-[0.04em]">
                {phase === "prep"
                  ? "Beginning in " + left + "s"
                  : phase === "recording"
                    ? "Recording — " + left + "s left"
                    : "Recording finished"}
              </span>
            </div>
            <span className="tabular text-[13px] text-[var(--text-secondary)]">
              {phase === "recording" || phase === "completed"
                ? "Do not use pause or stop — the recording is continuous"
                : "Prepare your response"}
            </span>
          </div>

          {/* progress line */}
          <div className="mt-3 h-1.5 w-full bg-[var(--border-subtle)]">
            <div
              className="h-full transition-[width] duration-1000 ease-linear"
              style={{
                width: barPct + "%",
                background: phase === "recording" ? "var(--status-danger)" : "var(--border-strong)",
              }}
            />
          </div>

          {/* level meter (only meaningful while recording) */}
          <div className="mt-3 flex h-8 items-end gap-1" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => {
              const active = phase === "recording" && level * 40 > i;
              const h = 20 + (i % 7) * 6;
              return (
                <span
                  key={i}
                  className="w-full"
                  style={{
                    height: (active ? h : 8) + "%",
                    background: active ? "var(--text-primary)" : "var(--border-subtle)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Next only */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onNext}
            disabled={phase !== "completed"}
            className="focus-ring border border-[#1a1d23] bg-[#1a1d23] px-6 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:border-[var(--border-strong)] disabled:bg-[var(--bg-surface)] disabled:text-[var(--text-tertiary)]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Neutral institutional bar-chart figure (no brand color).
function BarChartFigure() {
  const bars = [
    { label: "2000", v: 42 },
    { label: "2005", v: 58 },
    { label: "2010", v: 71 },
    { label: "2015", v: 66 },
    { label: "2020", v: 88 },
  ];
  const max = 100;
  return (
    <figure className="w-full max-w-xl">
      <figcaption className="mb-3 text-center text-[15px] font-bold">
        Household internet access in Region X (% of homes)
      </figcaption>
      <svg viewBox="0 0 420 240" className="w-full" role="img" aria-label="Bar chart">
        {/* axes */}
        <line x1="48" y1="10" x2="48" y2="200" stroke="#6b7280" strokeWidth="1" />
        <line x1="48" y1="200" x2="410" y2="200" stroke="#6b7280" strokeWidth="1" />
        {/* gridlines + y labels */}
        {[0, 25, 50, 75, 100].map((g) => {
          const y = 200 - (g / max) * 190;
          return (
            <g key={g}>
              <line x1="48" y1={y} x2="410" y2={y} stroke="#d5d8de" strokeWidth="1" />
              <text x="42" y={y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
                {g}
              </text>
            </g>
          );
        })}
        {/* bars */}
        {bars.map((b, i) => {
          const bw = 46;
          const gap = 26;
          const x = 66 + i * (bw + gap);
          const h = (b.v / max) * 190;
          return (
            <g key={b.label}>
              <rect x={x} y={200 - h} width={bw} height={h} fill="#b7bcc6" stroke="#6b7280" strokeWidth="1" />
              <text x={x + bw / 2} y={195 - h} textAnchor="middle" fontSize="10" fill="#1a1d23">
                {b.v}
              </text>
              <text x={x + bw / 2} y="214" textAnchor="middle" fontSize="11" fill="#3d434d">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
