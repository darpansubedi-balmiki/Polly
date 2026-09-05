import { useEffect, useMemo, useRef, useState } from "react";
import SegmentedControl from "../components/ui/SegmentedControl";
import ExamTimer from "../components/ui/ExamTimer";
import { Polly } from "../components/polly/PollyBubble";
import { Pencil, Check, AlertTriangle, Info, X, BookOpen } from "../components/icons";
import { cn } from "../components/ui/cn";

type Task = "task1" | "task2";

const TASK_META: Record<Task, { min: number; minutes: number; label: string }> = {
  task1: { min: 150, minutes: 20, label: "Task 1" },
  task2: { min: 250, minutes: 40, label: "Task 2" },
};

const TASK1_PROMPT =
  "The chart below shows the percentage of household waste recycled in three countries between 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";
const TASK2_PROMPT =
  "Some people believe that unpaid community service should be a compulsory part of secondary school programmes (for example, working for a charity, improving the neighbourhood or teaching sports to younger children). To what extent do you agree or disagree?";

export default function WritingPractice({ onExit }: { onExit?: () => void }) {
  const [task, setTask] = useState<Task>("task1");
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(TASK_META.task1.minutes * 60);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const saveTimer = useRef<number | null>(null);

  const meta = TASK_META[task];

  // switch task → reset editor + timer
  function switchTask(id: string) {
    const t = id as Task;
    setTask(t);
    setText("");
    setSeconds(TASK_META[t].minutes * 60);
    setSavedAt(null);
  }

  // section timer
  useEffect(() => {
    if (seconds <= 0) return;
    const i = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, [seconds]);

  // ticking clock for the "saved N seconds ago" label
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  // debounced autosave whenever text changes
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (!text) return;
    saveTimer.current = window.setTimeout(() => setSavedAt(Date.now()), 900);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [text]);

  const words = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const chars = text.length;
  const met = words >= meta.min;
  const remaining = Math.max(0, meta.min - words);

  return (
    <div className="mode-coach flex h-screen flex-col bg-[var(--bg-canvas)]">
      {/* ---- Top bar ---- */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--accent-primary)]">
            <Polly state="idle" size={30} />
          </span>
          <div>
            <div className="text-[15px] font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              IELTS Academic Writing
            </div>
            <div className="text-[12px] text-[var(--text-tertiary)]">
              Practice · {meta.label} · recommended {meta.minutes} min
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SegmentedControl
            segments={[
              { id: "task1", label: "Task 1" },
              { id: "task2", label: "Task 2" },
            ]}
            value={task}
            onChange={switchTask}
          />
          <ExamTimer seconds={seconds} variant="coach" warnUnder={300} />
          {onExit && (
            <button
              onClick={onExit}
              className="focus-ring grid size-10 place-items-center rounded-[var(--radius-pill)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] hover:text-[var(--text-primary)]"
              aria-label="Exit practice"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* ---- Split prompt / editor ---- */}
      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        {/* Prompt + chart */}
        <section className="min-h-0 overflow-y-auto border-b border-[var(--border-subtle)] p-6 lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--skill-writing)_16%,transparent)] px-3 py-1 text-[12px] font-semibold text-[var(--skill-writing)]">
              <Pencil size={14} /> {meta.label} · Writing
            </div>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--text-primary)]">
              {task === "task1" ? TASK1_PROMPT : TASK2_PROMPT}
            </p>

            {task === "task1" ? (
              <figure className="mt-6 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5">
                <figcaption className="mb-4 text-[14px] font-semibold text-[var(--text-primary)]">
                  Household waste recycled (% of total), 2005–2020
                </figcaption>
                <RecyclingChart />
                <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-[var(--text-secondary)]">
                  {SERIES.map((s) => (
                    <span key={s.name} className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                  ))}
                </div>
              </figure>
            ) : (
              <div className="mt-6 flex items-start gap-2.5 rounded-[var(--radius-card)] bg-[var(--bg-surface-raised)] p-4 text-[14px] text-[var(--text-secondary)]">
                <BookOpen size={17} className="mt-0.5 shrink-0 text-[var(--skill-writing)]" />
                Write at least 250 words. Give reasons for your answer and include any relevant
                examples from your own knowledge or experience.
              </div>
            )}

            <div className="mt-5 flex items-start gap-2 rounded-[var(--radius-card)] bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] p-3.5 text-[13px] text-[var(--text-secondary)]">
              <Info size={15} className="mt-0.5 shrink-0 text-[var(--accent-primary)]" />
              Tip from Polly: spend 3–4 minutes planning before you write. A clear overview scores
              highly in {meta.label}.
            </div>
          </div>
        </section>

        {/* Editor */}
        <section className="flex min-h-0 flex-col p-6">
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="essay" className="text-[14px] font-semibold text-[var(--text-primary)]">
                Your response
              </label>
              <AutoSave savedAt={savedAt} now={now} dirty={!!text} />
            </div>

            <textarea
              id="essay"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                task === "task1"
                  ? "The chart illustrates…"
                  : "In recent years, the question of whether…"
              }
              className="focus-ring min-h-0 flex-1 w-full resize-none rounded-[var(--radius-input)] border border-[var(--border-strong)] bg-[var(--bg-surface-raised)] p-4 text-[16px] leading-[1.7] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]"
            />

            {/* Live counters + minimum-word indicator */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-[13px] text-[var(--text-secondary)]">
                <span className="tabular">
                  <b className="text-[var(--text-primary)]">{words}</b> words
                </span>
                <span className="tabular">
                  <b className="text-[var(--text-primary)]">{chars}</b> characters
                </span>
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[13px] font-semibold",
                  met
                    ? "bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] text-[var(--accent-primary)]"
                    : "bg-[color-mix(in_srgb,var(--status-warning)_16%,transparent)] text-[var(--status-warning)]",
                )}
              >
                {met ? (
                  <>
                    <Check size={15} strokeWidth={2.5} /> Minimum met ({meta.min}+ words)
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} /> {remaining} more to reach {meta.min}
                  </>
                )}
              </span>
            </div>

            {/* progress toward minimum */}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300 ease-out",
                  met ? "bg-[var(--accent-primary)]" : "bg-[var(--status-warning)]",
                )}
                style={{ width: `${Math.min(100, (words / meta.min) * 100)}%` }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AutoSave({ savedAt, now, dirty }: { savedAt: number | null; now: number; dirty: boolean }) {
  if (!dirty) {
    return <span className="text-[13px] text-[var(--text-tertiary)]">Not started</span>;
  }
  if (savedAt === null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)]">
        <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        Saving…
      </span>
    );
  }
  const secs = Math.max(0, Math.round((now - savedAt) / 1000));
  const label =
    secs < 1 ? "just now" : secs === 1 ? "1 second ago" : secs < 60 ? `${secs} seconds ago` : "a while ago";
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent-primary)]">
      <Check size={14} strokeWidth={2.5} /> Saved {label}
    </span>
  );
}

// ---- Inline SVG chart (IELTS Task 1 line graph) --------------------------------
const YEARS = ["2005", "2010", "2015", "2020"];
const SERIES = [
  { name: "Country A", color: "var(--skill-reading)", data: [18, 27, 41, 58] },
  { name: "Country B", color: "var(--skill-speaking)", data: [12, 20, 26, 34] },
  { name: "Country C", color: "var(--skill-writing)", data: [30, 34, 33, 44] },
];

function RecyclingChart() {
  const W = 460;
  const H = 240;
  const pad = { l: 34, r: 12, t: 12, b: 28 };
  const maxV = 60;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (YEARS.length - 1)) * iw;
  const y = (v: number) => pad.t + ih - (v / maxV) * ih;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Line graph of recycling rates">
      {/* gridlines + y labels */}
      {[0, 20, 40, 60].map((g) => (
        <g key={g}>
          <line x1={pad.l} y1={y(g)} x2={W - pad.r} y2={y(g)} stroke="var(--border-subtle)" strokeWidth={1} />
          <text x={pad.l - 8} y={y(g) + 4} textAnchor="end" fontSize={11} fill="var(--text-tertiary)">
            {g}
          </text>
        </g>
      ))}
      {/* x labels */}
      {YEARS.map((yr, i) => (
        <text key={yr} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--text-tertiary)">
          {yr}
        </text>
      ))}
      {/* series */}
      {SERIES.map((s) => (
        <g key={s.name}>
          <polyline
            points={s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {s.data.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill={s.color} />
          ))}
        </g>
      ))}
    </svg>
  );
}
