import { useEffect, useRef, useState } from "react";
import ExamTimer from "../components/ui/ExamTimer";
import QuestionNavigator from "../components/ui/QuestionNavigator";
import type { NavQuestion } from "../components/ui/QuestionNavigator";

// Clinical, institutional reading frame. NO brand chrome, NO mascot, NO
// gamification. The only brand color permitted is the selected-answer fill.

const TITLE = "The Domestication of the Horse";
const PARAGRAPHS = [
  "The horse was among the last of the major livestock species to be domesticated, and for a long time archaeologists disagreed sharply about when and where this occurred. Unlike cattle or sheep, whose bones change measurably once animals are penned and bred in captivity, early domestic horses are difficult to distinguish from their wild relatives on skeletal evidence alone.",
  "The decisive clues have come instead from the teeth. Horses that were bitted — that is, controlled by a mouthpiece held in place by a bridle — develop a characteristic wear pattern on the second premolar. When such wear was identified on horse teeth from sites in the Eurasian steppe dating to around 3500 BC, it provided some of the first direct evidence that these animals were being ridden rather than merely hunted.",
  "Riding transformed the societies that adopted it. A mounted herder could manage far larger flocks than one on foot, and the mobility that horses conferred reshaped patterns of trade, warfare and migration across the continent. Some scholars argue that the spread of certain language families can be traced, at least in part, to this new mobility.",
];

type TFNG = { n: number; kind: "tfng"; stem: string };
type Gap = { n: number; kind: "gap"; before: string; after: string };
type Q = TFNG | Gap;

const QUESTIONS: Q[] = [
  { n: 1, kind: "tfng", stem: "The horse was one of the first large animals to be domesticated." },
  { n: 2, kind: "tfng", stem: "The bones of early domestic horses differ clearly from those of wild horses." },
  { n: 3, kind: "tfng", stem: "Tooth wear on the second premolar can indicate that a horse was bitted." },
  { n: 4, kind: "tfng", stem: "Evidence of riding was found at steppe sites dating to about 3500 BC." },
  { n: 5, kind: "tfng", stem: "A herder on horseback could manage smaller flocks than one on foot." },
  { n: 6, kind: "gap", before: "Early domestic horses are hard to identify from their", after: "alone." },
  { n: 7, kind: "gap", before: "Bitted horses develop wear on the second", after: "." },
  { n: 8, kind: "tfng", stem: "All scholars agree that horse-riding caused the spread of language families." },
];

const TFNG_OPTS = ["True", "False", "Not Given"];
const TOTAL = 40;
const SECONDS = 60 * 60;

export default function ExamReadingFrame({ onSubmit }: { onSubmit: () => void }) {
  const [seconds, setSeconds] = useState(SECONDS);
  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({ 3: "True" });
  const [flagged, setFlagged] = useState<Set<number>>(() => new Set([5]));
  const qRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  function jump(n: number) {
    setCurrent(n);
    qRefs.current[n]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function toggleFlag() {
    setFlagged((f) => {
      const next = new Set(f);
      next.has(current) ? next.delete(current) : next.add(current);
      return next;
    });
  }

  const navQs: NavQuestion[] = Array.from({ length: TOTAL }, (_, i) => {
    const n = i + 1;
    const status: NavQuestion["status"] =
      n === current ? "current" : flagged.has(n) ? "flagged" : answers[n] ? "answered" : "unanswered";
    return { n, status };
  });

  return (
    <div className="mode-exam flex h-screen flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* ---- Exam header strip (timer only — no navigation, no brand) ---- */}
      <header className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2">
        <div className="text-[14px] font-semibold">
          IELTS Academic Reading — Part 1 of 3
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-[var(--text-secondary)]">Time remaining</span>
          <ExamTimer seconds={seconds} variant="exam" warnUnder={300} />
        </div>
      </header>

      {/* ---- Split panel ---- */}
      <div className="flex min-h-0 flex-1">
        {/* Passage */}
        <section className="min-h-0 w-1/2 overflow-y-auto border-r border-[var(--border-strong)] p-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-1 text-[13px] font-bold uppercase tracking-[0.03em] text-[var(--text-secondary)]">
              Reading Passage 1
            </div>
            <h1 className="text-[20px] font-bold">{TITLE}</h1>
            <div className="mt-4 space-y-4 text-[16px] leading-[1.7]">
              {PARAGRAPHS.map((p, i) => (
                <p key={i}>
                  <span className="mr-1 font-bold text-[var(--text-secondary)]">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="min-h-0 w-1/2 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-[16px] font-bold">Questions 1–8</h2>
            <p className="mt-1 border-b border-[var(--border-subtle)] pb-3 text-[15px] text-[var(--text-secondary)]">
              Do the following statements agree with the information in the passage? Write{" "}
              <b>True</b>, <b>False</b>, or <b>Not Given</b>. For gap answers, use{" "}
              <b>one word only</b>.
            </p>

            <div className="mt-4 space-y-4">
              {QUESTIONS.map((q) => (
                <div
                  key={q.n}
                  ref={(el) => {
                    qRefs.current[q.n] = el;
                  }}
                  className={
                    "border p-4 " +
                    (current === q.n
                      ? "border-[var(--border-strong)] bg-[var(--bg-surface)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]")
                  }
                >
                  <div className="flex items-start gap-3">
                    <span className="tabular grid size-6 shrink-0 place-items-center border border-[var(--border-strong)] text-[13px] font-bold">
                      {q.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      {q.kind === "tfng" ? (
                        <>
                          <p className="text-[15px] leading-relaxed">{q.stem}</p>
                          <div className="mt-3 flex flex-col gap-2">
                            {TFNG_OPTS.map((opt) => {
                              const active = answers[q.n] === opt;
                              return (
                                <label
                                  key={opt}
                                  onClick={() => {
                                    setCurrent(q.n);
                                    setAnswers((a) => ({ ...a, [q.n]: opt }));
                                  }}
                                  className="focus-ring flex cursor-pointer items-center gap-2.5 text-[15px]"
                                >
                                  <span
                                    className="grid size-5 shrink-0 place-items-center border border-[var(--border-strong)]"
                                    style={
                                      active
                                        ? { background: "var(--accent-primary)", borderColor: "#1a1d23" }
                                        : { background: "var(--bg-canvas)" }
                                    }
                                  >
                                    {active && (
                                      <span className="size-2 bg-[#04120a]" aria-hidden="true" />
                                    )}
                                  </span>
                                  {opt}
                                </label>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <p className="text-[15px] leading-relaxed">
                          {q.before}{" "}
                          <input
                            value={answers[q.n] ?? ""}
                            onFocus={() => setCurrent(q.n)}
                            onChange={(e) => setAnswers((a) => ({ ...a, [q.n]: e.target.value }))}
                            className="focus-ring mx-1 w-32 border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-2 py-1 text-[15px]"
                          />{" "}
                          {q.after}
                        </p>
                      )}
                    </div>
                    {flagged.has(q.n) && (
                      <span className="shrink-0 border border-[var(--status-warning)] px-1.5 py-0.5 text-[11px] font-bold text-[#1a1d23]">
                        FLAGGED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---- Control bar: prev / next / flag ---- */}
      <div className="flex items-center gap-2 border-t border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2">
        <button
          onClick={() => jump(Math.max(1, current - 1))}
          disabled={current <= 1}
          className="focus-ring border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-1.5 text-[14px] font-semibold disabled:opacity-40"
        >
          ‹ Previous
        </button>
        <button
          onClick={() => jump(Math.min(TOTAL, current + 1))}
          disabled={current >= TOTAL}
          className="focus-ring border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-1.5 text-[14px] font-semibold disabled:opacity-40"
        >
          Next ›
        </button>
        <button
          onClick={toggleFlag}
          aria-pressed={flagged.has(current)}
          className={
            "focus-ring border px-4 py-1.5 text-[14px] font-semibold " +
            (flagged.has(current)
              ? "border-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_22%,white)] text-[#1a1d23]"
              : "border-[var(--border-strong)] bg-[var(--bg-canvas)]")
          }
        >
          {flagged.has(current) ? "Unflag" : "Flag for review"}
        </button>
        <button
          onClick={onSubmit}
          className="focus-ring ml-auto border border-[#1a1d23] bg-[#1a1d23] px-5 py-1.5 text-[14px] font-semibold text-white"
        >
          Submit section
        </button>
      </div>

      {/* ---- Stark 40-cell navigator ---- */}
      <QuestionNavigator part="Part 1" questions={navQs} onJump={jump} />
    </div>
  );
}
