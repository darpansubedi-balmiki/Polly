import { useState } from "react";
import type { ReactNode } from "react";
import Button from "../components/ui/Button";
import ErrorTag from "../components/ui/ErrorTag";
import { Polly } from "../components/polly/PollyBubble";
import {
  ChevronDown,
  ArrowRight,
  X,
  Pencil,
  Volume,
  BookOpen,
  TrendingUp,
} from "../components/icons";
import { cn } from "../components/ui/cn";

type Kind = "grammar" | "pronunciation" | "vocabulary";

type Example = {
  // the student's own sentence, with the error span marked by ⟦ ⟧
  quote: string;
  correction: string;
  from: string;
};

type ErrItem = {
  id: string;
  kind: Kind;
  tagKind: "grammar" | "pronunciation" | "vocabulary";
  name: string;
  count: number;
  // weekly occurrence counts, oldest → newest (for the sparkline + trend)
  history: number[];
  practiseLabel: string;
  practiseIcon: ReactNode;
  examples: Example[];
};

const GROUPS: { kind: Kind; title: string; blurb: string; items: ErrItem[] }[] = [
  {
    kind: "grammar",
    title: "Grammar",
    blurb: "Patterns in structure and accuracy across your writing and speaking.",
    items: [
      {
        id: "articles",
        kind: "grammar",
        tagKind: "grammar",
        name: "Articles",
        count: 23,
        history: [9, 8, 7, 6, 5, 4],
        practiseLabel: "Practise articles",
        practiseIcon: <Pencil size={16} />,
        examples: [
          { quote: "It is ⟦the⟧ best way to protect environment.", correction: "…to protect the environment.", from: "Writing Task 2 · 12 Aug" },
          { quote: "She is ⟦a⟧ engineer at a large company.", correction: "She is an engineer…", from: "Speaking · 09 Aug" },
          { quote: "Government should invest in ⟦education⟧.", correction: "The government should invest in education.", from: "Writing Task 2 · 04 Aug" },
        ],
      },
      {
        id: "past-perfect",
        kind: "grammar",
        tagKind: "grammar",
        name: "Past perfect",
        count: 11,
        history: [1, 2, 2, 3, 2, 3],
        practiseLabel: "Practise past perfect",
        practiseIcon: <Pencil size={16} />,
        examples: [
          { quote: "By 2010, the rate ⟦increased⟧ sharply before it fell.", correction: "…the rate had increased sharply…", from: "Writing Task 1 · 11 Aug" },
          { quote: "After I ⟦finished⟧ school, I had moved abroad.", correction: "After I had finished school, I moved abroad.", from: "Speaking · 07 Aug" },
        ],
      },
    ],
  },
  {
    kind: "pronunciation",
    title: "Pronunciation",
    blurb: "Sounds and stress patterns flagged in your recorded speaking responses.",
    items: [
      {
        id: "th",
        kind: "pronunciation",
        tagKind: "pronunciation",
        name: "/θ/ sound",
        count: 34,
        history: [10, 9, 8, 6, 6, 5],
        practiseLabel: "Practise this sound",
        practiseIcon: <Volume size={16} />,
        examples: [
          { quote: "I ⟦think⟧ this is the main reason.", correction: "“think” → tongue between teeth: /θ/, not /t/ (“tink”).", from: "Read Aloud · 12 Aug" },
          { quote: "There are ⟦three⟧ key factors.", correction: "“three” → /θriː/ with a soft /θ/, not “tree”.", from: "Describe Image · 10 Aug" },
          { quote: "The ⟦growth⟧ was significant.", correction: "“growth” → end on /θ/: /ɡroʊθ/.", from: "Repeat Sentence · 06 Aug" },
        ],
      },
      {
        id: "word-stress",
        kind: "pronunciation",
        tagKind: "pronunciation",
        name: "Word stress",
        count: 19,
        history: [6, 5, 5, 4, 4, 4],
        practiseLabel: "Practise word stress",
        practiseIcon: <Volume size={16} />,
        examples: [
          { quote: "This is a ⟦PHOtograph⟧ of the city.", correction: "Stress the 2nd syllable: pho-TO-graph.", from: "Describe Image · 11 Aug" },
          { quote: "The ⟦DEvelopment⟧ was rapid.", correction: "Stress the 2nd syllable: de-VEL-op-ment.", from: "Read Aloud · 05 Aug" },
        ],
      },
    ],
  },
  {
    kind: "vocabulary",
    title: "Vocabulary",
    blurb: "Word-choice habits that limit your lexical resource band.",
    items: [
      {
        id: "repetition",
        kind: "vocabulary",
        tagKind: "vocabulary",
        name: "Repetition",
        count: 27,
        history: [8, 7, 7, 5, 5, 4],
        practiseLabel: "Practise synonyms",
        practiseIcon: <BookOpen size={16} />,
        examples: [
          { quote: "It is a ⟦big⟧ problem and a ⟦big⟧ challenge for a ⟦big⟧ city.", correction: "Vary it: “a major problem”, “a significant challenge”, “a large city”.", from: "Writing Task 2 · 12 Aug" },
          { quote: "People ⟦think⟧ this, and experts also ⟦think⟧ so.", correction: "“believe”, “argue”, “maintain” add range.", from: "Speaking · 08 Aug" },
        ],
      },
    ],
  },
];

const groupAccent: Record<Kind, string> = {
  grammar: "var(--status-danger)",
  pronunciation: "var(--skill-speaking)",
  vocabulary: "var(--skill-writing)",
};

export default function ErrorLibrary({ onExit }: { onExit?: () => void }) {
  const [open, setOpen] = useState<string | null>("th");

  const total = GROUPS.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.count, 0), 0);

  return (
    <div className="mode-coach min-h-full">
      {/* ---- Top bar ---- */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_90%,transparent)] backdrop-blur">
        <div className="container-grid flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--accent-primary)]">
              <Polly state="idle" size={30} />
            </span>
            <div>
              <div className="text-[15px] font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Smart Error Library
              </div>
              <div className="text-[12px] text-[var(--text-tertiary)]">
                Patterns Polly found across your responses
              </div>
            </div>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              aria-label="Close"
              className="focus-ring grid size-10 place-items-center rounded-[var(--radius-pill)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] hover:text-[var(--text-primary)]"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <main className="container-grid space-y-9 py-8 pb-24">
        {/* ---- Intro / Polly ---- */}
        <section className="flex flex-col gap-4 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-6 sm:flex-row sm:items-center">
          <Polly state="explaining" size={72} />
          <div className="flex-1">
            <h1 className="text-[22px] font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Your recurring mistakes, in one place
            </h1>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              I've grouped <b className="text-[var(--text-primary)]">{total}</b> flagged errors from
              your past responses. The good news: most are trending down. Let's clear the top ones.
            </p>
          </div>
        </section>

        {/* ---- Grouped sections ---- */}
        {GROUPS.map((g) => (
          <section key={g.kind} aria-label={g.title}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="size-2.5 rounded-[3px]" style={{ background: groupAccent[g.kind] }} aria-hidden="true" />
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                {g.title}
              </h2>
              <span className="tabular text-[13px] text-[var(--text-tertiary)]">
                {g.items.length} pattern{g.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <p className="mb-3 text-[13px] text-[var(--text-secondary)]">{g.blurb}</p>

            <div className="space-y-2.5">
              {g.items.map((it) => (
                <ErrorRow
                  key={it.id}
                  item={it}
                  open={open === it.id}
                  onToggle={() => setOpen((o) => (o === it.id ? null : it.id))}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function ErrorRow({
  item,
  open,
  onToggle,
}: {
  item: ErrItem;
  open: boolean;
  onToggle: () => void;
}) {
  const first = item.history[0];
  const last = item.history[item.history.length - 1];
  const improving = last < first;
  const pctChange = first ? Math.round(((last - first) / first) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="focus-ring flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <ErrorTag kind={item.tagKind}>×{item.count}</ErrorTag>
        <span className="text-[15px] font-semibold text-[var(--text-primary)]">{item.name}</span>
        <div className="ml-auto flex items-center gap-3">
          <TrendPill improving={improving} pct={Math.abs(pctChange)} />
          <Sparkline data={item.history} improving={improving} />
          <ChevronDown
            size={20}
            className={cn("shrink-0 text-[var(--text-tertiary)] transition-transform duration-200", open && "rotate-180")}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--border-subtle)] px-5 py-4">
          <div className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
            From your own responses
          </div>
          <ul className="space-y-3">
            {item.examples.map((ex, i) => (
              <li key={i} className="rounded-[var(--radius-card)] bg-[var(--bg-surface-raised)] p-4">
                <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
                  {renderQuote(ex.quote)}
                </p>
                <p className="mt-2 flex items-start gap-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  <span className="mt-0.5 font-semibold text-[var(--accent-primary)]">Fix</span>
                  {ex.correction}
                </p>
                <p className="mt-1.5 text-[12px] italic text-[var(--text-tertiary)]">{ex.from}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
              <TrendingUp size={15} className={improving ? "text-[var(--accent-primary)]" : "text-[var(--status-danger)]"} />
              {improving
                ? `Down ${Math.abs(pctChange)}% over the last 6 weeks — keep it up.`
                : `Up ${Math.abs(pctChange)}% recently — worth focusing on.`}
            </span>
            <Button size="s" leadingIcon={item.practiseIcon} trailingIcon={<ArrowRight size={16} />}>
              {item.practiseLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Render the student's quote, marking the ⟦error⟧ span with a red wavy underline.
function renderQuote(quote: string): ReactNode {
  const parts = quote.split(/⟦(.*?)⟧/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="bg-transparent font-semibold text-[var(--status-danger)] underline decoration-[var(--status-danger)] decoration-wavy decoration-2 underline-offset-4"
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function TrendPill({ improving, pct }: { improving: boolean; pct: number }) {
  return (
    <span
      className={cn(
        "tabular hidden items-center gap-1 rounded-[var(--radius-pill)] px-2 py-0.5 text-[12px] font-semibold sm:inline-flex",
        improving
          ? "bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] text-[var(--accent-primary)]"
          : "bg-[color-mix(in_srgb,var(--status-danger)_16%,transparent)] text-[var(--status-danger)]",
      )}
      title={improving ? "Decreasing over time" : "Increasing over time"}
    >
      <span aria-hidden="true">{improving ? "▼" : "▲"}</span>
      {pct}%
    </span>
  );
}

function Sparkline({ data, improving }: { data: number[]; improving: boolean }) {
  const w = 60;
  const h = 22;
  const max = Math.max(...data, 1);
  const stroke = improving ? "var(--accent-primary)" : "var(--status-danger)";
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 3) - 1.5}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="hidden shrink-0 sm:block" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
