import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Button from "../components/ui/Button";
import ScoreRing from "../components/ui/ScoreRing";
import DeltaChip from "../components/ui/DeltaChip";
import SegmentedControl from "../components/ui/SegmentedControl";
import TabBar from "../components/ui/TabBar";
import FeedbackAccordion from "../components/ui/FeedbackAccordion";
import TranscriptPlayer from "../components/ui/TranscriptPlayer";
import type { Marker } from "../components/ui/TranscriptPlayer";
import PollyBubble, { Polly } from "../components/polly/PollyBubble";
import { Info, Sparkle, X, Volume, ArrowRight, Target } from "../components/icons";
import { cn } from "../components/ui/cn";

// ---- count-up hook ------------------------------------------------------------
function useCountUp(target: number, decimals: number, restartKey: unknown) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setVal(from + (target - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, restartKey]);
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

// ---- exam-type rubric configs -------------------------------------------------
type Crit = { criterion: string; score: number; scaleMax: number; why: string; fix: string; gain: number };

type ExamCfg = {
  scale: "IELTS" | "PTE";
  max: number;
  overall: number;
  prev: number;
  decimals: number;
  overallLabel: string;
  criteria: Crit[];
  note?: ReactNode;
};

const PTE: ExamCfg = {
  scale: "PTE",
  max: 90,
  overall: 73,
  prev: 69,
  decimals: 0,
  overallLabel: "Overall speaking",
  criteria: [
    {
      criterion: "Oral Fluency",
      score: 71,
      scaleMax: 90,
      why: "Your delivery is mostly smooth, but three hesitation pauses over 0.8s and two filler words (“um”, “uh”) broke your rhythm in the middle of sentences — exactly where the scorer listens for flow.",
      fix: "Practise reading each sentence in a single breath group. When you feel a pause coming, replace “um” with a short silent beat. Do 5 Read Aloud items focusing only on pacing.",
      gain: 5,
    },
    {
      criterion: "Pronunciation",
      score: 68,
      scaleMax: 90,
      why: "Two words were unclear: “specific” (opening /sp/ cluster dropped) and “environment” (middle syllable swallowed). Individual sounds are good; it's multi-syllable words under time pressure that slip.",
      fix: "Drill consonant clusters (/sp/, /str/) and 4-syllable words with a metronome at 90 BPM. Record, compare to the model, repeat until the syllable count matches.",
      gain: 4,
    },
    {
      criterion: "Content",
      score: 79,
      scaleMax: 90,
      why: "You covered every key element of the prompt and stayed on topic throughout — content is your strongest area and is already at your target level.",
      fix: "Maintain this. Keep restating the main idea in your own words within the first sentence; it's reliably scoring well.",
      gain: 1,
    },
  ],
  note: (
    <IntegratedPanel />
  ),
};

const IELTS_SPEAKING: ExamCfg = {
  scale: "IELTS",
  max: 9,
  overall: 6.5,
  prev: 6.0,
  decimals: 1,
  overallLabel: "Speaking band",
  criteria: [
    { criterion: "Fluency & Coherence", score: 6.5, scaleMax: 9, why: "You spoke at length but self-corrected often, and a few long pauses appeared while you searched for ideas rather than language.", fix: "Practise the 'topic-sentence-then-example' pattern so you always have a next thing to say. Shadow native answers for rhythm.", gain: 0.5 },
    { criterion: "Lexical Resource", score: 7.0, scaleMax: 9, why: "Good range of topic vocabulary and one nice idiomatic phrase. Occasionally a common word repeated where a precise synonym would score higher.", fix: "Build 3 topic word-families per day (e.g. environment: emissions, sustainable, offset).", gain: 0.5 },
    { criterion: "Grammatical Range & Accuracy", score: 6.0, scaleMax: 9, why: "Simple sentences are accurate, but complex structures (conditionals, perfect tenses) carried most of your errors.", fix: "Drill 2nd/3rd conditionals and present-perfect vs past-simple in short spoken answers.", gain: 0.5 },
    { criterion: "Pronunciation", score: 6.5, scaleMax: 9, why: "Generally clear with good intonation; word stress on longer words was occasionally misplaced.", fix: "Mark the stressed syllable on 10 long words daily and say them aloud.", gain: 0.5 },
  ],
};

const IELTS_WRITING: ExamCfg = {
  scale: "IELTS",
  max: 9,
  overall: 6.5,
  prev: 6.0,
  decimals: 1,
  overallLabel: "Writing band",
  criteria: [
    { criterion: "Task Response", score: 6.0, scaleMax: 9, why: "You addressed the question and gave a clear position, but the second body paragraph drifted from the main argument and one idea was under-developed.", fix: "Give every body paragraph one clear claim + one explained example. Cut ideas you can't develop in 3 sentences.", gain: 0.5 },
    { criterion: "Coherence & Cohesion", score: 6.5, scaleMax: 9, why: "Logical overall, but cohesive devices were sometimes mechanical ('Firstly', 'Secondly') and referencing was occasionally unclear.", fix: "Vary linkers and use pronoun reference to connect ideas instead of repeating nouns.", gain: 0.5 },
    { criterion: "Lexical Resource", score: 7.0, scaleMax: 9, why: "Strong, mostly precise vocabulary with a few collocation slips.", fix: "Review 10 academic collocations you got slightly wrong and re-use them correctly.", gain: 0.5 },
    { criterion: "Grammatical Range & Accuracy", score: 6.5, scaleMax: 9, why: "Good mix of structures; article use and comma splices caused most errors.", fix: "Targeted articles drill + join clauses with conjunctions, not commas.", gain: 0.5 },
  ],
  note: (
    <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] bg-[color-mix(in_srgb,var(--skill-writing)_10%,transparent)] p-4 text-[13px] text-[var(--text-secondary)]">
      <Info size={16} className="mt-0.5 shrink-0 text-[var(--skill-writing)]" />
      <span>
        <b className="text-[var(--text-primary)]">Task 2 counts twice.</b> In IELTS Writing, your Task 2
        band is weighted double that of Task 1 when calculating your overall Writing score — so
        improvements here move your band fastest.
      </span>
    </div>
  ),
};

const EXAMS: Record<string, ExamCfg> = {
  pte: PTE,
  ielts_speaking: IELTS_SPEAKING,
  ielts_writing: IELTS_WRITING,
};

// ---- interactive transcript ---------------------------------------------------
type Tok =
  | { t: "word"; text: string }
  | { t: "pause"; secs: number }
  | { t: "filler"; text: string; note: string; detail: string }
  | { t: "mispron"; text: string; note: string; detail: string; phonetic: string };

const TRANSCRIPT: Tok[] = [
  { t: "word", text: "The graph shows" },
  { t: "pause", secs: 0.8 },
  { t: "word", text: "the amount of," },
  { t: "filler", text: "um", note: "Filler word", detail: "A filler slipped in while you planned the next phrase. A short silent pause sounds far more fluent than “um” — and doesn't cost you fluency marks." },
  { t: "word", text: "plastic waste that was," },
  { t: "filler", text: "uh", note: "Filler word", detail: "Second filler in one sentence. Try to group your words into one breath so you don't need to fill gaps." },
  { t: "word", text: "produced in three" },
  { t: "mispron", text: "specific", note: "Mispronunciation", detail: "You dropped the opening /sp/ cluster and it came out closer to “pecific”. Start the word with a crisp /s/ straight into /p/.", phonetic: "/spəˈsɪfɪk/" },
  { t: "word", text: "countries." },
  { t: "pause", secs: 0.5 },
  { t: "word", text: "Overall, the" },
  { t: "mispron", text: "environment", note: "Mispronunciation", detail: "The middle syllable was swallowed. It has four syllables with the stress on the second: en-VY-ron-ment.", phonetic: "/ɪnˈvaɪrənmənt/" },
  { t: "word", text: "was significantly affected." },
];

const REPLAY_MARKERS: Marker[] = [
  { at: 0.14, type: "pause", note: "0.8s hesitation after “The graph shows”" },
  { at: 0.34, type: "filler", note: "“um” mid-sentence" },
  { at: 0.46, type: "filler", note: "“uh” mid-sentence" },
  { at: 0.62, type: "mispron", note: "“specific” — /sp/ cluster dropped" },
  { at: 0.88, type: "mispron", note: "“environment” — syllable swallowed" },
];

export default function FeedbackReport({ onExit }: { onExit?: () => void }) {
  const [examId, setExamId] = useState("pte");
  const cfg = EXAMS[examId];
  const shown = useCountUp(cfg.overall, cfg.decimals, examId);
  const delta = Math.round((cfg.overall - cfg.prev) * (cfg.decimals ? 10 : 1)) / (cfg.decimals ? 10 : 1);

  const [tab, setTab] = useState("replay");
  const [squawk, setSquawk] = useState<Extract<Tok, { t: "filler" | "mispron" }> | null>(null);

  return (
    <div className="mode-coach min-h-full">
      {/* ---- Top bar ---- */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_90%,transparent)] backdrop-blur">
        <div className="container-grid flex h-16 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--accent-primary)]">
              <Polly state="explaining" size={30} />
            </span>
            <div>
              <div className="text-[15px] font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Feedback report
              </div>
              <div className="text-[12px] text-[var(--text-tertiary)]">
                Describe Image · today, 9:12 AM
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SegmentedControl
              segments={[
                { id: "pte", label: "PTE" },
                { id: "ielts_speaking", label: "IELTS Speaking" },
                { id: "ielts_writing", label: "IELTS Writing" },
              ]}
              value={examId}
              onChange={setExamId}
            />
            {onExit && (
              <button
                onClick={onExit}
                aria-label="Close report"
                className="focus-ring grid size-10 place-items-center rounded-[var(--radius-pill)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container-grid space-y-10 py-8 pb-24">
        {/* ---- Hero: score reveal + Polly voice ---- */}
        <section className="grid gap-8 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-7 shadow-[var(--shadow-raised)] md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative flex flex-col items-center">
            <div
              className="pointer-events-none absolute inset-0 -z-0 rounded-full"
              style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 16%, transparent), transparent 68%)" }}
              aria-hidden="true"
            />
            <div className="relative">
              <ScoreRing value={shown} scale={cfg.scale} kind="achieved" size={168} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[13px] text-[var(--text-tertiary)]">{cfg.overallLabel}</span>
              <DeltaChip delta={delta} />
            </div>
            <span className="mt-1 text-[12px] text-[var(--text-tertiary)]">
              vs {cfg.decimals ? cfg.prev.toFixed(1) : cfg.prev} last attempt
            </span>
          </div>

          <div>
            <PollyBubble
              state="explaining"
              size={72}
              message={
                <span className="text-[15px]">
                  You're closer than you think — let's look at what's holding you back. Two small
                  fixes could move you toward your target of{" "}
                  <b className="text-[var(--text-primary)]">{cfg.scale === "PTE" ? "79" : "7.0"}</b>.
                </span>
              }
            />
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)]">
                <Target size={14} className="text-[var(--accent-primary)]" /> Biggest lever:{" "}
                <b className="text-[var(--text-primary)]">{cfg.criteria[0].criterion}</b>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)]">
                <Sparkle size={14} className="text-[var(--accent-primary)]" /> Potential:{" "}
                <b className="text-[var(--text-primary)]">
                  +{cfg.scale === "PTE" ? "4 to +6 points" : "0.5 to +1.0 band"}
                </b>
              </span>
            </div>
          </div>
        </section>

        {/* ---- Rubric breakdown ---- */}
        <section aria-label="Rubric breakdown">
          <h2 className="mb-1 text-[18px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            How each criterion scored
          </h2>
          <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
            Every score comes with the plain-language reason and the exact drill to fix it.
          </p>
          <div className="space-y-2.5">
            {cfg.criteria.map((c, i) => (
              <FeedbackAccordion
                key={c.criterion}
                criterion={c.criterion}
                score={c.score}
                scaleMax={c.scaleMax}
                why={c.why}
                fix={c.fix}
                expectedGain={c.gain}
                defaultOpen={i === 0}
              />
            ))}
          </div>
          {cfg.note && <div className="mt-4">{cfg.note}</div>}
        </section>

        {/* ---- AI feature tabs ---- */}
        <section aria-label="AI analysis">
          <TabBar
            tabs={[
              { id: "replay", label: "AI Speaking Replay" },
              { id: "rewriter", label: "AI Essay Rewriter" },
            ]}
            value={tab}
            onChange={setTab}
          />

          {tab === "replay" ? (
            <div className="mt-5 space-y-5">
              <TranscriptPlayer duration="0:38" markers={REPLAY_MARKERS} />

              <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Your transcript</h3>
                  <span className="text-[12px] text-[var(--text-tertiary)]">Tap an underlined word</span>
                </div>
                <p className="text-[19px] leading-[2] text-[var(--text-primary)]">
                  {TRANSCRIPT.map((tok, i) => {
                    if (tok.t === "word") return <span key={i}>{tok.text} </span>;
                    if (tok.t === "pause")
                      return (
                        <span
                          key={i}
                          className="tabular mx-1 inline-flex items-center rounded-[6px] border border-dashed border-[var(--status-warning)] px-1.5 py-0.5 align-middle text-[12px] font-semibold text-[var(--status-warning)]"
                          title={`${tok.secs}s pause`}
                        >
                          [{tok.secs}s]
                        </span>
                      );
                    const isFiller = tok.t === "filler";
                    return (
                      <button
                        key={i}
                        onClick={() => setSquawk(tok)}
                        className={cn(
                          "focus-ring mx-0.5 rounded-[4px] font-semibold decoration-2 underline-offset-4 transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
                          isFiller
                            ? "text-[var(--status-warning)] underline decoration-[var(--status-warning)] decoration-wavy"
                            : "text-[var(--status-danger)] underline decoration-[var(--status-danger)] decoration-wavy",
                        )}
                      >
                        {tok.text}
                      </button>
                    );
                  })}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--border-subtle)] pt-3 text-[12px] text-[var(--text-secondary)]">
                  <Legend color="var(--status-warning)" wavy label="Filler word (amber)" />
                  <Legend color="var(--status-danger)" wavy label="Mispronounced (red)" />
                  <Legend color="var(--status-warning)" label="[ ] Pause length" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <EssayRewriter />
            </div>
          )}
        </section>

        {/* ---- honest disclaimer ---- */}
        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[var(--text-tertiary)]">
          <Info size={14} className="mt-0.5 shrink-0" />
          These scores are AI estimates to guide your practice, not an official result. Real exam
          scoring is done by certified examiners and may differ by roughly ±1 band (IELTS) or ±5
          points (PTE).
        </p>
      </main>

      {squawk && <SquawkBox tok={squawk} onClose={() => setSquawk(null)} />}
    </div>
  );
}

function Legend({ color, label, wavy = false }: { color: string; label: string; wavy?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("inline-block h-2.5 w-4 rounded-full", wavy ? "" : "opacity-70")}
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function IntegratedPanel() {
  const rows = [
    { task: "Describe Image", feeds: ["Speaking"] },
    { task: "Read Aloud", feeds: ["Speaking", "Reading"] },
    { task: "Repeat Sentence", feeds: ["Speaking", "Listening"] },
  ];
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center gap-2">
        <Sparkle size={16} className="text-[var(--accent-primary)]" />
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Integrated scoring</h3>
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-secondary)]">
        PTE scores are <b className="text-[var(--text-primary)]">integrated</b> — a single spoken task
        can contribute to several skills at once. Improving your speaking here also lifts the skills
        it feeds.
      </p>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.task} className="flex items-center justify-between rounded-[var(--radius-card)] bg-[var(--bg-surface-raised)] px-3.5 py-2.5">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">{r.task}</span>
            <span className="flex items-center gap-1.5">
              {r.feeds.map((f) => (
                <span
                  key={f}
                  className="rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_14%,transparent)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--accent-primary)]"
                >
                  {f}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---- Squawk Box overlay -------------------------------------------------------
function SquawkBox({
  tok,
  onClose,
}: {
  tok: Extract<Tok, { t: "filler" | "mispron" }>;
  onClose: () => void;
}) {
  const isMispron = tok.t === "mispron";
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(4,8,20,0.6)] p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Squawk Box"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-pop w-full max-w-md overflow-hidden rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-raised)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-[var(--accent-primary)]">
            <Sparkle size={15} /> Squawk Box
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring grid size-9 place-items-center rounded-[var(--radius-pill)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] hover:text-[var(--text-primary)]"
          >
            <X size={17} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Polly state="explaining" size={64} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "text-[20px] font-bold text-[var(--text-primary)]",
                  )}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  “{tok.text}”
                </span>
                <span
                  className={cn(
                    "rounded-[var(--radius-pill)] border px-2 py-0.5 text-[11px] font-semibold",
                    isMispron
                      ? "border-[var(--status-danger)] text-[var(--status-danger)]"
                      : "border-[var(--status-warning)] text-[var(--status-warning)]",
                  )}
                >
                  {tok.note}
                </span>
              </div>
              {isMispron && (
                <div className="mt-1 tabular text-[15px] text-[var(--text-secondary)]">{tok.phonetic}</div>
              )}
            </div>
          </div>

          <p className="mt-4 rounded-[var(--radius-card)] bg-[var(--bg-surface)] p-4 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            {tok.detail}
          </p>

          <div className="mt-5 flex gap-3">
            <Button block leadingIcon={<Volume size={18} />}>
              {isMispron ? "Practise this sound" : "Practise smoother pacing"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Essay rewriter -----------------------------------------------------------
type Seg = { text: string; changed?: boolean };
const VERSIONS: { id: string; label: string; band: string; segs: Seg[] }[] = [
  {
    id: "yours",
    label: "Your version",
    band: "Est. Band 6.0",
    segs: [
      { text: "Nowadays, " },
      { text: "a lot of" },
      { text: " people think that community service is " },
      { text: "a good thing" },
      { text: " for students. " },
      { text: "I think" },
      { text: " it should be compulsory " },
      { text: "because" },
      { text: " it helps them " },
      { text: "get" },
      { text: " important skills." },
    ],
  },
  {
    id: "b7",
    label: "Band 7 version",
    band: "Band 7.0",
    segs: [
      { text: "Nowadays, " },
      { text: "many", changed: true },
      { text: " people " },
      { text: "believe", changed: true },
      { text: " that community service is " },
      { text: "beneficial", changed: true },
      { text: " for students. " },
      { text: "In my view,", changed: true },
      { text: " it should be compulsory " },
      { text: "as", changed: true },
      { text: " it helps them " },
      { text: "develop", changed: true },
      { text: " important skills." },
    ],
  },
  {
    id: "b8",
    label: "Band 8 version",
    band: "Band 8.0",
    segs: [
      { text: "In recent years, ", changed: true },
      { text: "a growing number of", changed: true },
      { text: " people " },
      { text: "argue", changed: true },
      { text: " that community service is " },
      { text: "highly beneficial", changed: true },
      { text: " for students. " },
      { text: "Personally, I would contend that", changed: true },
      { text: " it should be compulsory, " },
      { text: "since", changed: true },
      { text: " it enables them to " },
      { text: "cultivate a range of", changed: true },
      { text: " important skills." },
    ],
  },
];

function EssayRewriter() {
  const [ver, setVer] = useState("b7");
  const active = VERSIONS.find((v) => v.id === ver)!;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          segments={VERSIONS.map((v) => ({ id: v.id, label: v.label }))}
          value={ver}
          onChange={setVer}
        />
        <span className="rounded-[var(--radius-pill)] bg-[var(--bg-surface-raised)] px-3 py-1 text-[13px] font-semibold text-[var(--text-primary)]">
          {active.band}
        </span>
      </div>

      <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
        <p className="text-[18px] leading-[1.9] text-[var(--text-primary)]">
          {active.segs.map((s, i) =>
            s.changed ? (
              <mark
                key={i}
                className="rounded-[4px] bg-[color-mix(in_srgb,var(--accent-primary)_22%,transparent)] px-0.5 text-[var(--text-primary)]"
              >
                {s.text}
              </mark>
            ) : (
              <span key={i}>{s.text}</span>
            ),
          )}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-block h-3 w-4 rounded-[3px] bg-[color-mix(in_srgb,var(--accent-primary)_22%,transparent)]" />
          {ver === "yours" ? "This is your original — switch tabs to see upgrades" : "Highlighted = improved phrasing"}
        </span>
        <Button size="s" variant="secondary" trailingIcon={<ArrowRight size={16} />}>
          Practise these upgrades
        </Button>
      </div>
    </div>
  );
}
