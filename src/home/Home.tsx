import { useState } from "react";
import Button from "../components/ui/Button";
import FeedbackAccordion from "../components/ui/FeedbackAccordion";
import { Polly } from "../components/polly/PollyBubble";
import HeroIllustration from "./HeroIllustration";
import {
  ArrowRight,
  Mic,
  Sparkle,
  Target,
  TrendingUp,
  BookOpen,
  Headphones,
  Pencil,
  MessageSquare,
  CheckCircle,
  ChevronDown,
} from "../components/icons";
import type { ReactNode } from "react";

export default function Home({
  onStartPractice,
  onSeeScoring,
}: {
  onStartPractice?: () => void;
  onSeeScoring?: () => void;
}) {
  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopBar onStartPractice={onStartPractice} />
      <Hero onStartPractice={onStartPractice} onSeeScoring={onSeeScoring} />
      <TrustRow />
      <Steps />
      <Compare />
      <SampleFeedback />
      <Predictor />
      <Exams />
      <Pricing onStartPractice={onStartPractice} />
      <FAQ />
      <FooterCTA onStartPractice={onStartPractice} />
    </div>
  );
}

/* ------------------------------------------------------------------ Top bar */
function TopBar({ onStartPractice }: { onStartPractice?: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Polly state="idle" size={34} />
          <span className="text-[19px] font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Polly
          </span>
        </div>
        <nav className="hidden items-center gap-7 text-[14px] font-medium text-[var(--text-secondary)] md:flex">
          <a href="#how" className="hover:text-[var(--text-primary)]">How it works</a>
          <a href="#exams" className="hover:text-[var(--text-primary)]">Exams</a>
          <a href="#pricing" className="hover:text-[var(--text-primary)]">Pricing</a>
          <a href="#faq" className="hover:text-[var(--text-primary)]">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#" className="hidden text-[14px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:inline">
            Log in
          </a>
          <Button size="s" onClick={onStartPractice}>
            Practice Free
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------- Hero */
function Hero({
  onStartPractice,
  onSeeScoring,
}: {
  onStartPractice?: () => void;
  onSeeScoring?: () => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-10 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="anim-step-in">
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.07em] text-[var(--text-secondary)]">
            <Sparkle size={14} className="text-[var(--accent-on-light)]" />
            IELTS & PTE · AI-scored practice
          </span>
          <h1
            className="mt-5 text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[54px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Know your score.
            <br />
            Know why.
            <br />
            <span className="relative inline-block">
              Know what to do next.
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[var(--accent-primary)]" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Realistic IELTS &amp; PTE simulation, AI scoring calibrated to official band descriptors,
            and a daily plan built around your weakest skills.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="l" trailingIcon={<ArrowRight size={18} />} onClick={onStartPractice}>
              Practice Free
            </Button>
            <button
              onClick={onSeeScoring}
              className="focus-ring inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2 py-1 text-[15px] font-semibold text-[var(--text-primary)] underline-offset-4 hover:underline"
            >
              See how scoring works <ArrowRight size={16} />
            </button>
          </div>
          <p className="mt-4 text-[13px] text-[var(--text-tertiary)]">
            No credit card · 3 full mock sections free · used by 40,000+ test-takers
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 60% 40%, color-mix(in srgb, var(--accent-primary) 16%, transparent), transparent 70%)",
            }}
          />
          <HeroIllustration className="w-full" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Trust row */
const PARTNERS = ["Cambridge Prep", "Britannia Institute", "GlobalEd", "IDP Partner", "PearsonReady", "StudyBridge"];
function TrustRow() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-7">
        <p className="text-center text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
          Trusted by coaching institutes and study-abroad partners
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="text-[16px] font-bold tracking-tight text-[var(--text-tertiary)] opacity-70 grayscale"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- Steps */
const STEPS: { icon: ReactNode; kicker: string; title: string; body: string }[] = [
  {
    icon: <Mic size={24} />,
    kicker: "01 · Simulate",
    title: "Sit the real thing",
    body: "Timed, full-length IELTS and PTE tasks that mirror the official interface — right down to the exam-mode chrome.",
  },
  {
    icon: <Target size={24} />,
    kicker: "02 · Score",
    title: "Get a calibrated score",
    body: "AI grades every response against official band descriptors, with a transparent breakdown of why you landed where you did.",
  },
  {
    icon: <TrendingUp size={24} />,
    kicker: "03 · Improve",
    title: "Follow a focused plan",
    body: "A daily plan that targets your weakest skills first, so every practice minute moves your predicted score.",
  },
];
function Steps() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="How it works"
        title="Simulate → Score → Improve"
        sub="A tight loop that turns practice into a measurable, rising score."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7"
          >
            <span
              className="grid size-12 place-items-center rounded-[16px] text-[var(--accent-on-light)]"
              style={{ background: "color-mix(in srgb, var(--accent-primary) 18%, transparent)" }}
            >
              {s.icon}
            </span>
            <div className="mt-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {s.kicker}
            </div>
            <h3 className="mt-1 text-[20px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {s.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">{s.body}</p>
            {i < STEPS.length - 1 && (
              <ArrowRight
                size={22}
                className="absolute -right-[18px] top-1/2 hidden -translate-y-1/2 text-[var(--border-strong)] md:block"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Compare */
function Compare() {
  return (
    <section className="bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Two modes, one library"
          title="Practice with Polly. Test like it's real."
          sub="Warm, guided practice that keeps you moving — and a clinical, no-hints simulator that mirrors the official exam so your result is honest."
        />
        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
          {/* Coach card */}
          <div className="mode-coach rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-6 shadow-[var(--shadow-raised)]">
            <div className="flex items-center justify-between">
              <span className="rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_18%,transparent)] px-3 py-1 text-[12px] font-bold text-[var(--accent-on-light)]">
                Practice Mode
              </span>
              <Polly state="explaining" size={40} />
            </div>
            <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--bg-surface)] p-4">
              <div className="text-[13px] font-semibold text-[var(--text-secondary)]">Read Aloud · Question 3 of 7</div>
              <div className="mt-2 h-2 w-full rounded-full bg-[var(--border-subtle)]">
                <div className="h-full w-[42%] rounded-full bg-[var(--accent-primary)]" />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-primary)]">
                "The migration of urban populations has reshaped how cities plan for green space…"
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-3 py-1.5 text-[13px] font-semibold text-[var(--accent-on-light)]">
                <Sparkle size={14} /> Nice pacing — keep that rhythm!
              </div>
            </div>
            <p className="mt-4 text-[13px] text-[var(--text-tertiary)]">
              Encouraging cues, hints, and gamified streaks keep momentum high.
            </p>
          </div>

          {/* divider */}
          <div className="flex items-center justify-center">
            <span className="rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              vs
            </span>
          </div>

          {/* Exam panel (genuine mode-exam) */}
          <div className="mode-exam flex flex-col border border-[var(--border-strong)] bg-[var(--bg-canvas)] p-6 text-[var(--text-primary)]">
            <div className="flex items-center justify-between border-b border-[var(--border-strong)] pb-3">
              <span className="text-[13px] font-bold">Exam Mode · Section 2 of 3</span>
              <span className="tabular border border-[var(--border-strong)] px-2 py-0.5 text-[13px] font-bold">
                31:48
              </span>
            </div>
            <div className="mt-4">
              <div className="text-[13px] text-[var(--text-secondary)]">Question 14</div>
              <p className="mt-2 text-[15px] leading-[1.6]">
                The writer suggests that river restoration primarily benefits urban wildlife.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {["True", "False", "Not Given"].map((o, i) => (
                  <div
                    key={o}
                    className="flex items-center gap-2.5 text-[14px]"
                  >
                    <span
                      className="grid size-4 place-items-center border border-[var(--border-strong)]"
                      style={i === 1 ? { background: "var(--accent-primary)" } : undefined}
                    >
                      {i === 1 && <span className="size-1.5 bg-[#04120a]" />}
                    </span>
                    {o}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-auto pt-4 text-[12px] text-[var(--text-tertiary)]">
              No hints. No mascot. No brand color except the selected answer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Sample feedback */
function SampleFeedback() {
  return (
    <section id="scoring" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Explainable AI scoring"
            title="Every score comes with a reason and a fix"
            sub="No black-box number. Polly shows the descriptor you were graded against, why you landed there, and the single change that moves you up — plus the points it's worth."
          />
          <ul className="mt-6 space-y-3">
            {[
              "Graded against official IELTS & PTE descriptors",
              "Score → Why → Fix → Expected gain, every time",
              "Estimates, shown honestly — not a guaranteed result",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] text-[var(--text-secondary)]">
                <CheckCircle size={20} className="mt-0.5 shrink-0 text-[var(--accent-on-light)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div className="mb-3 flex items-center gap-3">
            <Polly state="explaining" size={44} />
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">
              "You're closer than you think — here's the one thing holding your fluency back."
            </p>
          </div>
          <div className="space-y-3">
            <FeedbackAccordion
              criterion="Oral Fluency"
              score={68}
              why="Your pace is strong, but three hesitations over 0.8s broke the flow of longer sentences, which the model reads as reduced automaticity."
              fix="Practise linking clauses with connectors (however, which means) so you glide across the join instead of pausing to plan."
              expectedGain={5}
              defaultOpen
            />
            <FeedbackAccordion
              criterion="Pronunciation"
              score={72}
              why="Individual sounds are clear; the /θ/ in 'through' and 'thought' drifts toward /t/, which lowers intelligibility on a handful of words."
              fix="Drill the 5 flagged /θ/ words in your Error Library, then re-record this task."
              expectedGain={3}
            />
          </div>
          <p className="mt-4 text-center text-[12px] text-[var(--text-tertiary)]">
            AI-estimated scores. Calibrated to official descriptors, but not an official result.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Predictor */
function Predictor() {
  return (
    <section className="bg-[var(--bg-surface)]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-7 shadow-[var(--shadow-raised)]">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[13px] font-semibold text-[var(--text-tertiary)]">Predicted score</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[52px] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                    73
                  </span>
                  <span className="rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-2 py-0.5 text-[13px] font-bold text-[var(--accent-on-light)]">
                    ▲ 5
                  </span>
                </div>
              </div>
              <div className="text-right text-[13px] text-[var(--text-tertiary)]">
                Target <span className="font-bold text-[var(--text-primary)]">79</span>
                <br />
                Exam in <span className="font-bold text-[var(--text-primary)]">42 days</span>
              </div>
            </div>
            {/* confidence arc */}
            <div className="mt-5 h-3 w-full rounded-full bg-[var(--border-subtle)]">
              <div className="h-full w-[81%] rounded-full bg-[var(--accent-primary)]" />
            </div>
            <div className="mt-2 flex justify-between text-[12px] text-[var(--text-tertiary)]">
              <span>Readiness</span>
              <span className="font-semibold text-[var(--text-primary)]">81% confident</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-[13px]">
              {[
                ["Reading", "on track"],
                ["Listening", "on track"],
                ["Speaking", "close"],
                ["Writing", "focus area"],
              ].map(([s, state]) => (
                <div key={s} className="flex items-center justify-between rounded-[var(--radius-card)] bg-[var(--bg-surface)] px-3 py-2">
                  <span className="font-medium">{s}</span>
                  <span className="text-[var(--text-tertiary)]">{state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Exam Readiness Predictor"
            title="Sit the exam when you're actually ready"
            sub="Every scored task updates a single predicted score and a confidence level, so you can see — well before test day — whether you're on pace for your target and which skill is holding you back."
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- Exams */
const EXAMS: { icon: ReactNode; name: string; tasks: string; note: string }[] = [
  { icon: <BookOpen size={22} />, name: "IELTS Academic", tasks: "Listening · Reading · Writing · Speaking", note: "Band 0–9" },
  { icon: <Headphones size={22} />, name: "IELTS General", tasks: "Everyday reading, letters & discussion", note: "Band 0–9" },
  { icon: <MessageSquare size={22} />, name: "PTE Academic", tasks: "Read Aloud · Describe Image · SWT & more", note: "Score 10–90" },
];
function Exams() {
  return (
    <section id="exams" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading eyebrow="Supported exams" title="Built for the tests that matter" sub="Full task coverage for the exams that decide study and migration outcomes." />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {EXAMS.map((e) => (
          <div key={e.name} className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-[14px] bg-[var(--bg-canvas)] text-[var(--text-primary)]">
                {e.icon}
              </span>
              <span className="rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-2.5 py-1 text-[12px] font-semibold text-[var(--text-tertiary)]">
                {e.note}
              </span>
            </div>
            <h3 className="mt-4 text-[19px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {e.name}
            </h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-secondary)]">{e.tasks}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- Pricing */
const PLANS = [
  {
    name: "Free",
    price: "₹0",
    per: "forever",
    tagline: "Start practising today.",
    features: ["3 full mock sections", "AI score with basic feedback", "Daily streak & XP", "1 skill focus area"],
    cta: "Practice Free",
    featured: false,
  },
  {
    name: "Polly Pro",
    price: "₹799",
    per: "/ month",
    tagline: "Everything you need to hit your target.",
    features: ["Unlimited mocks & tasks", "Full Score → Why → Fix reports", "AI Speaking Replay & Essay Rewriter", "Smart Error Library", "Readiness Predictor & daily plan"],
    cta: "Start 7-day free trial",
    featured: true,
  },
];
function Pricing({ onStartPractice }: { onStartPractice?: () => void }) {
  return (
    <section id="pricing" className="bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading eyebrow="Pricing" title="Free to start. Fair to upgrade." sub="No urgency banners, no dark patterns — upgrade only when you're ready for the full plan." />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={
                "relative rounded-[var(--radius-feature)] p-7 " +
                (p.featured
                  ? "border-2 border-[var(--accent-primary)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-raised)]"
                  : "border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]")
              }
            >
              {p.featured && (
                <span className="absolute -top-3 left-7 rounded-[var(--radius-pill)] bg-[var(--accent-primary)] px-3 py-1 text-[12px] font-bold text-[#04120a]">
                  Most popular
                </span>
              )}
              <h3 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {p.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[38px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {p.price}
                </span>
                <span className="text-[14px] text-[var(--text-tertiary)]">{p.per}</span>
              </div>
              <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{p.tagline}</p>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--text-primary)]">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--accent-on-light)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Button variant={p.featured ? "primary" : "secondary"} block onClick={onStartPractice}>
                  {p.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ FAQ */
const FAQS = [
  {
    q: "How accurate is the AI scoring?",
    a: "Polly grades against the same official band descriptors examiners use, and we continuously calibrate against real scored results. It's a well-tuned estimate to guide your practice — not an official result, and we always label it that way.",
  },
  {
    q: "Does Exam Mode really feel like the real test?",
    a: "Yes — Exam Mode drops every friendly cue. Clinical white interface, system font, section timers, a stark question navigator, no hints, no mascot, and no brand color except the selected answer. It's built to match official IELTS and PTE software.",
  },
  {
    q: "Which exams do you support?",
    a: "IELTS Academic, IELTS General, and PTE Academic, with full task coverage for all four skills — including Speaking tasks scored from your own recordings.",
  },
  {
    q: "Do I need a microphone?",
    a: "For Speaking tasks, yes. We run a quick calibration first, because background noise directly lowers speaking scores — getting your setup right is part of practising well.",
  },
  {
    q: "Can I really use it for free?",
    a: "Absolutely. The Free plan gives you three full mock sections, AI scoring with feedback, and streaks — no credit card. Upgrade to Pro only when you want unlimited practice and the full feedback suite.",
  },
];
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="mt-10 divide-y divide-[var(--border-subtle)] rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="focus-ring flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-[16px] font-semibold text-[var(--text-primary)]">{f.q}</span>
                <ChevronDown
                  size={20}
                  className={"shrink-0 text-[var(--text-tertiary)] transition-transform " + (isOpen ? "rotate-180" : "")}
                />
              </button>
              {isOpen && (
                <p className="px-6 pb-5 text-[15px] leading-relaxed text-[var(--text-secondary)]">{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Footer CTA */
function FooterCTA({ onStartPractice }: { onStartPractice?: () => void }) {
  return (
    <section className="px-6 pb-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[var(--radius-feature)] bg-[var(--bg-surface-inverse,#0B132B)] px-8 py-14 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent-primary) 22%, transparent), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="flex justify-center">
            <Polly state="celebrating" size={72} />
          </div>
          <h2
            className="mt-5 text-[32px] font-bold leading-tight text-[#F7F5EF] sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your target score is closer than you think.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-[#C6CBD6]">
            Start with three free mock sections and see exactly where you stand today.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="l" trailingIcon={<ArrowRight size={18} />} onClick={onStartPractice}>
              Practice Free
            </Button>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[13px] text-[var(--text-tertiary)]">
        © 2026 Polly Learning · Built for IELTS &amp; PTE candidates worldwide
      </p>
    </section>
  );
}

/* -------------------------------------------------------------- shared bits */
function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent-on-light)]">{eyebrow}</div>
      <h2
        className="mt-2 text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {sub && <p className={"mt-3 text-[16px] leading-relaxed text-[var(--text-secondary)] " + (align === "center" ? "mx-auto" : "")}>{sub}</p>}
    </div>
  );
}
