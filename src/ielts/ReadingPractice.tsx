import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Button from "../components/ui/Button";
import ExamTimer from "../components/ui/ExamTimer";
import { Polly } from "../components/polly/PollyBubble";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  BookOpen,
  Check,
  Pencil,
  X,
  Info,
} from "../components/icons";
import { cn } from "../components/ui/cn";

// ---- Reading passage (IELTS Academic register) --------------------------------
const TITLE = "The Rediscovery of Urban Rivers";
const PARAGRAPHS = [
  "For much of the twentieth century, the rivers that thread through the world's great cities were treated as little more than industrial drains. Culverted, straightened and in many cases buried entirely beneath roads and car parks, they were engineered out of sight and, eventually, out of public memory. The prevailing logic was one of control: a river that could not flood, could not smell and could not be seen was widely considered a river tamed.",
  "That consensus has been steadily overturned. Beginning in the 1980s, a handful of pioneering projects demonstrated that daylighting — the practice of uncovering a buried watercourse — could deliver benefits that engineers had never anticipated. Restored streams cooled the air of overheated neighbourhoods, provided corridors for wildlife, and, perhaps most strikingly, raised the value of the land alongside them. What had been dismissed as a hazard was reframed as an amenity.",
  "The transformation of the Cheonggyecheon in Seoul is frequently cited as the decisive example. In 2003 the city removed an elevated motorway that had covered the stream for decades, an act that many commentators predicted would produce gridlock. Instead, traffic largely dispersed, a phenomenon transport planners describe as evaporation, and the recovered waterway rapidly became one of the most visited public spaces in the country.",
  "Critics caution, however, that the benefits are not distributed evenly. The rising property prices that accompany a restored river can displace the very residents a project was intended to serve, a process sometimes labelled green gentrification. For this reason, a growing number of planners now argue that ecological restoration and housing policy must be designed together rather than in isolation.",
];

// Pre-applied annotations required by the brief (one highlight, one note).
const SEED_HIGHLIGHTS = ["daylighting — the practice of uncovering a buried watercourse"];
const SEED_NOTES: Note[] = [
  {
    anchor: "a phenomenon transport planners describe as evaporation",
    text: "Key term — 'traffic evaporation'. Likely a gap-fill answer for Q9.",
  },
];

type Note = { anchor: string; text: string };

// ---- Questions (IELTS Reading, Part 1: Q1–Q13) --------------------------------
type TFNG = { n: number; kind: "tfng"; stem: string };
type Gap = { n: number; kind: "gap"; before: string; after: string };
type Q = TFNG | Gap;

const QUESTIONS: Q[] = [
  { n: 1, kind: "tfng", stem: "In the twentieth century, most cities regarded their rivers primarily as a resource for recreation." },
  { n: 2, kind: "tfng", stem: "Burying a river was intended to remove problems such as flooding and unpleasant odours." },
  { n: 3, kind: "tfng", stem: "The earliest daylighting projects were undertaken specifically to raise nearby land values." },
  { n: 4, kind: "tfng", stem: "Restored streams have been shown to lower temperatures in surrounding areas." },
  { n: 5, kind: "tfng", stem: "The removal of the Cheonggyecheon motorway led to the traffic congestion that had been predicted." },
  { n: 6, kind: "tfng", stem: "Green gentrification can force out the residents a restoration was meant to benefit." },
  { n: 7, kind: "gap", before: "Buried rivers were engineered out of sight and out of public", after: "." },
  { n: 8, kind: "gap", before: "Daylighting created", after: "for wildlife to move through the city." },
  { n: 9, kind: "gap", before: "Transport planners refer to dispersed traffic as", after: "." },
  { n: 10, kind: "gap", before: "The recovered Cheonggyecheon became a popular public", after: "." },
  { n: 11, kind: "tfng", stem: "The author believes ecological restoration should be planned separately from housing policy." },
  { n: 12, kind: "tfng", stem: "Public memory of buried rivers generally remained strong throughout the century." },
  { n: 13, kind: "gap", before: "Some planners now want restoration and housing policy to be designed", after: "." },
];

const TFNG_OPTIONS = ["True", "False", "Not Given"];
const TOTAL_Q = 40;
const SECTION_SECONDS = 60 * 60;

export default function ReadingPractice({ onExit }: { onExit?: () => void }) {
  const [leftPct, setLeftPct] = useState(54);
  const [seconds, setSeconds] = useState(SECTION_SECONDS);
  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({ 2: "True", 7: "memory" });
  const [flagged, setFlagged] = useState<Set<number>>(() => new Set([5]));

  const [highlights, setHighlights] = useState<string[]>(SEED_HIGHLIGHTS);
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);

  // selection tooltip state
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);
  const [composing, setComposing] = useState<{ anchor: string; x: number; y: number } | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const qRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // ---- Section timer ----
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // ---- Draggable divider ----
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - r.left) / r.width) * 100;
      setLeftPct(Math.min(70, Math.max(32, pct)));
    };
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  // ---- Text selection → tooltip ----
  function onPassageMouseUp() {
    const s = window.getSelection();
    const text = s?.toString().trim() ?? "";
    if (!text || text.length < 3) {
      setSel(null);
      return;
    }
    const rect = s!.getRangeAt(0).getBoundingClientRect();
    setSel({ text, x: rect.left + rect.width / 2, y: rect.top });
    setComposing(null);
  }

  function applyHighlight() {
    if (sel) setHighlights((h) => (h.includes(sel.text) ? h : [...h, sel.text]));
    setSel(null);
    window.getSelection()?.removeAllRanges();
  }

  function beginNote() {
    if (!sel) return;
    setComposing({ anchor: sel.text, x: sel.x, y: sel.y });
    setNoteDraft("");
    setSel(null);
  }

  function saveNote() {
    if (composing && noteDraft.trim()) {
      setNotes((n) => [...n, { anchor: composing.anchor, text: noteDraft.trim() }]);
    }
    setComposing(null);
    setNoteDraft("");
    window.getSelection()?.removeAllRanges();
  }

  function jumpTo(n: number) {
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

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mode-coach flex h-screen flex-col bg-[var(--bg-canvas)]">
      {/* ---- Top bar (brand chrome retained) ---- */}
      <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--accent-primary)]">
            <Polly state="idle" size={30} />
          </span>
          <div>
            <div className="text-[15px] font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              IELTS Academic Reading
            </div>
            <div className="text-[12px] text-[var(--text-tertiary)]">Practice · Section 1 of 3</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="tabular hidden text-[13px] text-[var(--text-secondary)] sm:inline">
            {answeredCount}/{TOTAL_Q} answered
          </span>
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

      {/* ---- Split reading / questions ---- */}
      <div ref={containerRef} className="flex min-h-0 flex-1">
        {/* Passage (independent scroll) */}
        <section
          className="min-h-0 overflow-y-auto p-6"
          style={{ width: `${leftPct}%` }}
          ref={passageRef}
          onMouseUp={onPassageMouseUp}
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--skill-reading)_16%,transparent)] px-3 py-1 text-[12px] font-semibold text-[var(--skill-reading)]">
              <BookOpen size={14} /> Reading passage
            </div>
            <h1
              className="text-[24px] font-bold leading-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {TITLE}
            </h1>
            <p className="mt-1 text-[13px] italic text-[var(--text-tertiary)]">
              Select any text to highlight it or attach a note.
            </p>
            <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-[var(--text-primary)]">
              {PARAGRAPHS.map((p, i) => (
                <div key={i}>
                  <p>{renderWithHighlights(p, highlights)}</p>
                  {notes
                    .filter((n) => p.includes(n.anchor))
                    .map((n, j) => (
                      <StickyNote key={j} text={n.text} anchor={n.anchor} onRemove={() =>
                        setNotes((all) => all.filter((x) => x !== n))
                      } />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          onPointerDown={() => (dragging.current = true)}
          className="group relative w-1.5 shrink-0 cursor-col-resize bg-[var(--border-subtle)] transition-colors hover:bg-[var(--accent-primary)]"
        >
          <span className="absolute left-1/2 top-1/2 grid h-10 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-tertiary)] shadow-[var(--shadow-rest)]">
            <span className="text-[10px] leading-none">⋮⋮</span>
          </span>
        </div>

        {/* Questions (independent scroll) */}
        <section className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-surface)] p-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Questions 1–13
              </h2>
              <span className="text-[13px] text-[var(--text-tertiary)]">Part 1</span>
            </div>
            <div className="mt-2 flex items-start gap-2 rounded-[var(--radius-card)] bg-[var(--bg-surface-raised)] px-3.5 py-2.5 text-[13px] text-[var(--text-secondary)]">
              <Info size={15} className="mt-0.5 shrink-0 text-[var(--skill-reading)]" />
              Do the statements agree with the information in the passage? Choose{" "}
              <b className="text-[var(--text-primary)]">True</b>,{" "}
              <b className="text-[var(--text-primary)]">False</b>, or{" "}
              <b className="text-[var(--text-primary)]">Not Given</b>. Gap answers: one word only.
            </div>

            <div className="mt-5 space-y-3">
              {QUESTIONS.map((q) => (
                <div
                  key={q.n}
                  ref={(el) => {
                    qRefs.current[q.n] = el;
                  }}
                  onFocusCapture={() => setCurrent(q.n)}
                  className={cn(
                    "rounded-[var(--radius-card)] border p-4 transition-colors",
                    current === q.n
                      ? "border-[var(--accent-primary)] bg-[var(--bg-surface-raised)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "tabular grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold",
                        answers[q.n]
                          ? "bg-[var(--accent-primary)] text-[#04120a]"
                          : "border border-[var(--border-strong)] text-[var(--text-secondary)]",
                      )}
                    >
                      {q.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      {q.kind === "tfng" ? (
                        <>
                          <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{q.stem}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {TFNG_OPTIONS.map((opt) => {
                              const active = answers[q.n] === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => setAnswers((a) => ({ ...a, [q.n]: opt }))}
                                  className={cn(
                                    "focus-ring rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                                    active
                                      ? "border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] text-[var(--accent-primary)]"
                                      : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
                                  )}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
                          {q.before}{" "}
                          <input
                            value={answers[q.n] ?? ""}
                            onChange={(e) => setAnswers((a) => ({ ...a, [q.n]: e.target.value }))}
                            placeholder="answer"
                            className="focus-ring mx-1 w-32 rounded-[var(--radius-input)] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2.5 py-1 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]"
                          />{" "}
                          {q.after}
                        </p>
                      )}
                    </div>
                    {flagged.has(q.n) && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--status-warning)_16%,transparent)] px-2 py-0.5 text-[11px] font-semibold text-[var(--status-warning)]">
                        <Flame size={11} /> Flagged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---- Bottom bar: nav controls + 40-cell navigator ---- */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="s"
              variant="secondary"
              leadingIcon={<ArrowLeft size={16} />}
              disabled={current <= 1}
              onClick={() => jumpTo(Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              size="s"
              variant="secondary"
              trailingIcon={<ArrowRight size={16} />}
              disabled={current >= TOTAL_Q}
              onClick={() => jumpTo(Math.min(TOTAL_Q, current + 1))}
            >
              Next
            </Button>
            <Button
              size="s"
              variant={flagged.has(current) ? "primary" : "ghost"}
              leadingIcon={<Flame size={16} />}
              onClick={toggleFlag}
            >
              {flagged.has(current) ? "Flagged" : "Flag"}
            </Button>
            <Button
              size="s"
              variant="ghost"
              leadingIcon={<Check size={16} />}
              onClick={() => {
                const first = [...flagged].sort((a, b) => a - b)[0];
                if (first) jumpTo(first);
              }}
            >
              Review{flagged.size > 0 ? ` (${flagged.size})` : ""}
            </Button>
          </div>

          {/* 40-cell navigator — friendly Coach styling */}
          <div className="ml-auto flex flex-wrap gap-1.5">
            {Array.from({ length: TOTAL_Q }, (_, i) => i + 1).map((n) => {
              const isCurrent = n === current;
              const isAnswered = !!answers[n];
              const isFlagged = flagged.has(n);
              return (
                <button
                  key={n}
                  onClick={() => jumpTo(n)}
                  aria-current={isCurrent}
                  title={`Question ${n}${isFlagged ? " · flagged" : isAnswered ? " · answered" : ""}`}
                  className={cn(
                    "tabular relative grid size-8 place-items-center rounded-[10px] border text-[12px] font-semibold transition-all",
                    isCurrent
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#04120a] shadow-[0_2px_8px_rgba(57,255,136,0.35)]"
                      : isAnswered
                        ? "border-transparent bg-[color-mix(in_srgb,var(--accent-primary)_18%,transparent)] text-[var(--text-primary)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {n}
                  {isFlagged && (
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--status-warning)]" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* ---- Selection tooltip ---- */}
      {sel && (
        <div
          className="anim-pop fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-1 shadow-[var(--shadow-raised)]"
          style={{ left: sel.x, top: sel.y - 8 }}
        >
          <button
            onClick={applyHighlight}
            className="focus-ring inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--status-warning)_20%,transparent)]"
          >
            <span className="size-3 rounded-[3px] bg-[#FFE24D]" aria-hidden="true" /> Highlight
          </button>
          <span className="h-5 w-px bg-[var(--border-subtle)]" aria-hidden="true" />
          <button
            onClick={beginNote}
            className="focus-ring inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"
          >
            <Pencil size={14} /> Add note
          </button>
        </div>
      )}

      {/* ---- Note composer ---- */}
      {composing && (
        <div
          className="anim-pop fixed z-50 w-64 -translate-x-1/2 -translate-y-full rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[#FFF9DB] p-3 shadow-[var(--shadow-raised)]"
          style={{ left: composing.x, top: composing.y - 8 }}
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-[#8a6d00]">
            <Pencil size={13} /> Note
          </div>
          <textarea
            autoFocus
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Type a note…"
            className="focus-ring h-20 w-full resize-none rounded-[8px] border border-[#E6D77A] bg-white/70 p-2 text-[13px] text-[#3d3400] placeholder:text-[#a99a4d]"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setComposing(null)}
              className="focus-ring rounded-[var(--radius-pill)] px-2.5 py-1 text-[12px] font-semibold text-[#8a6d00] hover:bg-[#f0e5a8]"
            >
              Cancel
            </button>
            <button
              onClick={saveNote}
              disabled={!noteDraft.trim()}
              className="focus-ring rounded-[var(--radius-pill)] bg-[#F2C200] px-3 py-1 text-[12px] font-bold text-[#3d3400] disabled:opacity-40"
            >
              Save note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Render a paragraph with any highlighted substrings wrapped in a yellow mark.
function renderWithHighlights(text: string, highlights: string[]): ReactNode {
  const active = highlights.filter((h) => h && text.includes(h));
  if (active.length === 0) return text;
  // Split on the union of highlight strings, keeping the delimiters.
  const escaped = active.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(re);
  return parts.map((part, i) =>
    active.includes(part) ? (
      <mark
        key={i}
        className="rounded-[3px] bg-[#FFE24D] px-0.5 text-[#3d3400]"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function StickyNote({
  text,
  anchor,
  onRemove,
}: {
  text: string;
  anchor: string;
  onRemove: () => void;
}) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-[var(--radius-card)] border-l-4 border-[#F2C200] bg-[#FFF9DB] p-3 text-[13px] text-[#3d3400] shadow-[var(--shadow-rest)]">
      <Pencil size={15} className="mt-0.5 shrink-0 text-[#8a6d00]" />
      <div className="min-w-0 flex-1">
        <p className="leading-relaxed">{text}</p>
        <p className="mt-1 truncate text-[11px] italic text-[#a08a2e]">on “{anchor}”</p>
      </div>
      <button
        onClick={onRemove}
        aria-label="Remove note"
        className="focus-ring grid size-6 shrink-0 place-items-center rounded-full text-[#8a6d00] hover:bg-[#f0e5a8]"
      >
        <X size={13} />
      </button>
    </div>
  );
}
