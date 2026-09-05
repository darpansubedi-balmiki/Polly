import { useState } from "react";
import type { ReactNode } from "react";
import {
  Button,
  IconButton,
  TabBar,
  SegmentedControl,
  Dropdown,
  TextInput,
  Textarea,
  Checkbox,
  Radio,
  Toggle,
  Slider,
  SearchField,
  ChoiceCard,
  Card,
  ScoreRing,
  BandBadge,
  SkillBar,
  DeltaChip,
  ReadinessGauge,
  ProgressTrendChart,
  SkillRadar,
  XPBar,
  StreakFlame,
  AchievementBadge,
  ProgressDots,
  QuestionCounterPill,
  CelebrationOverlay,
  FeedbackAccordion,
  TranscriptPlayer,
  ErrorTag,
  PracticeCard,
  MicStatus,
  ExamTimer,
  QuestionNavigator,
  Toast,
  Modal,
  PaywallSheet,
  PlanCard,
  EmptyState,
  Skeleton,
} from "../components/ui";
import PollyBubble, { Polly } from "../components/polly/PollyBubble";
import type { PollyState } from "../components/polly/PollyBubble";
import {
  Trophy,
  Flame,
  Sparkle,
  Target,
  Mic,
  BookOpen,
  Headphones,
  Pencil,
} from "../components/icons";

function Section({
  id,
  title,
  desc,
  children,
}: {
  id: string;
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-5">
        <h2
          className="text-[24px] font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {desc && <p className="mt-1 text-[14px] text-[var(--text-tertiary)]">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function Showcase() {
  const [tab, setTab] = useState("dashboard");
  const [seg, setSeg] = useState("pte");
  const [dd, setDd] = useState<string>();
  const [name, setName] = useState("Aayush");
  const [essay, setEssay] = useState(
    "Some people believe that university education should be free for all students.",
  );
  const [check, setCheck] = useState(true);
  const [radio, setRadio] = useState("tfng");
  const [toggle, setToggle] = useState(true);
  const [slider, setSlider] = useState(65);
  const [search, setSearch] = useState("");
  const [choice, setChoice] = useState("immigration");
  const [modal, setModal] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const pollyStates: PollyState[] = [
    "idle",
    "listening",
    "analyzing",
    "explaining",
    "celebrating",
  ];

  return (
    <div className="mode-coach min-h-full">
      <div className="container-grid py-10">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-primary)]">
              Round 0 · Design System
            </span>
            <h1
              className="mt-1 text-[40px] font-bold leading-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Component Library
            </h1>
            <p className="mt-1 max-w-xl text-[15px] text-[var(--text-secondary)]">
              One token system, two visual worlds. Every component below is Coach Mode unless
              marked Exam Mode.
            </p>
          </div>
          <StreakFlame count={12} />
        </header>

        <div className="space-y-14">
          {/* ============ TWO-MODE SPECIMEN (the reference) ============ */}
          <Section
            id="specimen"
            title="Two-mode specimen"
            desc="Same underlying components + token names — Coach Mode (warm, rounded, shadowed, Inter Tight, mint) vs Exam Mode (institutional, 4px radius, hard 1px border, no shadow, Arial, no brand chrome). This contrast is the product's signature."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Coach specimen */}
              <div className="mode-coach rounded-[var(--radius-feature)] bg-[var(--bg-canvas)] p-6">
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-primary)]">
                  Coach Mode
                </div>
                <Card surface="dark">
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-[18px] font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Reading · True / False / Not Given
                    </h3>
                    <QuestionCounterPill current={4} total={10} />
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    Marie Curie was the first person to win a Nobel Prize in two different
                    sciences.
                  </p>
                  <div className="mt-4 space-y-2">
                    <ChoiceCard selected title="True" onSelect={() => {}} />
                    <ChoiceCard selected={false} title="False" onSelect={() => {}} />
                    <ChoiceCard selected={false} title="Not Given" onSelect={() => {}} />
                  </div>
                  <Button className="mt-5" block trailingIcon={<span aria-hidden>→</span>}>
                    Submit answer
                  </Button>
                </Card>
              </div>

              {/* Exam specimen */}
              <div className="mode-exam rounded-[4px] border border-[var(--exam-border-subtle)] bg-[var(--bg-canvas)] p-6">
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-secondary)]">
                  Exam Mode
                </div>
                <div className="border border-[var(--border-strong)] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                      Questions 1–10
                    </h3>
                    <ExamTimer seconds={3240} variant="exam" />
                  </div>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[var(--text-primary)]">
                    Marie Curie was the first person to win a Nobel Prize in two different
                    sciences.
                  </p>
                  <div className="mt-4 space-y-2">
                    <ChoiceCard selected title="TRUE" onSelect={() => {}} />
                    <ChoiceCard selected={false} title="FALSE" onSelect={() => {}} />
                    <ChoiceCard selected={false} title="NOT GIVEN" onSelect={() => {}} />
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Button variant="secondary">Next</Button>
                  </div>
                </div>
                <div className="mt-4">
                  <QuestionNavigator
                    part="Part 1"
                    questions={[
                      { n: 1, status: "answered" },
                      { n: 2, status: "answered" },
                      { n: 3, status: "answered" },
                      { n: 4, status: "current" },
                      { n: 5, status: "unanswered" },
                      { n: 6, status: "flagged" },
                      { n: 7, status: "unanswered" },
                      { n: 8, status: "unanswered" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* ============ POLLY ============ */}
          <Section
            id="polly"
            title="Polly — AI coach mascot"
            desc="Five states. Coach Mode only — never appears in Exam Mode."
          >
            <div className="flex flex-wrap gap-8">
              {pollyStates.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Polly state={s} size={96} />
                  <span className="text-[12px] capitalize text-[var(--text-tertiary)]">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <PollyBubble
                state="explaining"
                message="You're 6 points from your target. Let's fix Fluency & Coherence first — it has the biggest upside today."
              />
            </div>
          </Section>

          {/* ============ CORE CONTROLS ============ */}
          <Section id="controls" title="Core controls">
            <Row label="Button · variants">
              <Button>Start practice</Button>
              <Button variant="secondary">View plan</Button>
              <Button variant="ghost">Skip</Button>
              <Button variant="destructive">End test</Button>
            </Row>
            <Row label="Button · states">
              <Button>Default</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </Row>
            <Row label="Button · sizes">
              <Button size="s">Small</Button>
              <Button size="m">Medium</Button>
              <Button size="l">Large</Button>
            </Row>
            <Row label="IconButton">
              <IconButton label="Play" icon={<Mic size={20} />} />
              <IconButton label="Info" icon={<Target size={20} />} variant="ghost" />
            </Row>
            <Row label="Tab bar">
              <div className="w-full max-w-md">
                <TabBar
                  value={tab}
                  onChange={setTab}
                  tabs={[
                    { id: "dashboard", label: "Dashboard" },
                    { id: "practice", label: "Practice" },
                    { id: "analytics", label: "Analytics" },
                  ]}
                />
              </div>
            </Row>
            <Row label="Segmented control">
              <SegmentedControl
                value={seg}
                onChange={setSeg}
                segments={[
                  { id: "pte", label: "PTE" },
                  { id: "ielts-a", label: "IELTS Academic" },
                  { id: "ielts-g", label: "IELTS General" },
                ]}
              />
            </Row>
            <Row label="Dropdown">
              <Dropdown
                value={dd}
                onChange={setDd}
                placeholder="Choose a skill"
                options={[
                  { value: "speaking", label: "Speaking" },
                  { value: "writing", label: "Writing" },
                  { value: "reading", label: "Reading" },
                  { value: "listening", label: "Listening" },
                ]}
              />
            </Row>
            <Row label="Text input">
              <div className="w-full max-w-sm">
                <TextInput
                  label="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Row>
            <Row label="Textarea · live word counter (IELTS Task 2 ≥ 250)">
              <div className="w-full max-w-lg">
                <Textarea
                  label="Write Essay"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  targetWords={250}
                  placeholder="Write your response…"
                />
              </div>
            </Row>
            <Row label="Checkbox · Radio · Toggle">
              <Checkbox checked={check} onChange={setCheck} label="Enable reminders" />
              <Radio name="q" checked={radio === "tfng"} onChange={() => setRadio("tfng")} label="Not Given" />
              <Toggle checked={toggle} onChange={setToggle} label="Daily coaching" />
            </Row>
            <Row label="Slider">
              <div className="w-full max-w-sm">
                <Slider value={slider} onChange={setSlider} label="Target band" suffix="%" />
              </div>
            </Row>
            <Row label="Search field">
              <div className="w-full max-w-sm">
                <SearchField value={search} onChange={setSearch} placeholder="Search countries…" />
              </div>
            </Row>
            <Row label="Choice card · single-select">
              <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {[
                  { id: "study", t: "Studying abroad", e: "🎓" },
                  { id: "immigration", t: "Immigration", e: "🛂" },
                  { id: "career", t: "Career opportunities", e: "💼" },
                  { id: "growth", t: "Personal growth", e: "🌱" },
                ].map((o) => (
                  <ChoiceCard
                    key={o.id}
                    selected={choice === o.id}
                    onSelect={() => setChoice(o.id)}
                    title={o.t}
                    leading={o.e}
                  />
                ))}
              </div>
            </Row>
          </Section>

          {/* ============ CARDS ============ */}
          <Section id="cards" title="Cards" desc="Dark navy and warm cream surfaces.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card surface="dark">
                <div className="text-[13px] text-[var(--text-tertiary)]">Default · dark</div>
                <div className="mt-1 text-[16px] font-semibold text-[var(--text-primary)]">
                  Predicted score
                </div>
              </Card>
              <Card surface="warm">
                <div className="text-[13px] text-[#6b7280]">Default · warm</div>
                <div className="mt-1 text-[16px] font-semibold text-[#1a1d23]">Study streak</div>
              </Card>
              <Card variant="interactive" onClick={() => {}}>
                <div className="text-[13px] text-[var(--text-tertiary)]">Interactive</div>
                <div className="mt-1 text-[16px] font-semibold text-[var(--text-primary)]">
                  Resume mock test
                </div>
              </Card>
              <Card variant="locked" lockedLabel="Premium">
                <div className="text-[13px] text-[var(--text-tertiary)]">Locked</div>
                <div className="mt-1 text-[16px] font-semibold text-[var(--text-primary)]">
                  Full analytics
                </div>
              </Card>
            </div>
            <div className="mt-4">
              <EmptyState
                title="No mock tests yet"
                message="Take your first full mock to unlock your predicted score and readiness."
                action={<Button>Start a mock test</Button>}
              />
            </div>
          </Section>

          {/* ============ PROGRESS & SCORING ============ */}
          <Section id="scoring" title="Progress & scoring">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <div className="flex items-end justify-around gap-4">
                  <ScoreRing scale="PTE" value={79} kind="target" label="Target" size={120} />
                  <ScoreRing scale="PTE" value={73} kind="predicted" label="Predicted" size={120} />
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <BandBadge scale="PTE" value={73} tone="achieved" />
                  <BandBadge scale="PTE" value={79} tone="target" />
                  <BandBadge scale="IELTS" value={"6.5"} tone="neutral" />
                </div>
              </Card>
              <Card>
                <div className="mb-3 text-[14px] font-semibold text-[var(--text-primary)]">
                  Enabling skills
                </div>
                <div className="space-y-4">
                  <SkillBar skill="speaking" label="Oral Fluency" current={78} target={82} delta={4} />
                  <SkillBar skill="writing" label="Written Discourse" current={84} target={85} delta={2} />
                  <SkillBar skill="reading" label="Reading" current={71} target={79} delta={-1} />
                  <SkillBar skill="listening" label="Listening" current={69} target={79} delta={3} />
                </div>
              </Card>
              <Card>
                <div className="flex flex-col items-center">
                  <ReadinessGauge value={68} confidence={82} />
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                    <Target size={16} className="text-[var(--accent-primary)]" /> 42 days to exam
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card>
                <div className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">
                  Predicted PTE trajectory
                </div>
                <ProgressTrendChart
                  scale="PTE"
                  target={79}
                  data={[
                    { label: "Wk 1", value: 64 },
                    { label: "Wk 2", value: 67 },
                    { label: "Wk 3", value: 66 },
                    { label: "Wk 4", value: 70 },
                    { label: "Wk 5", value: 73 },
                  ]}
                />
              </Card>
              <Card>
                <div className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">
                  Skill balance
                </div>
                <div className="flex justify-center">
                  <SkillRadar
                    data={[
                      { axis: "Speaking", current: 78, target: 82 },
                      { axis: "Writing", current: 84, target: 85 },
                      { axis: "Reading", current: 71, target: 79 },
                      { axis: "Listening", current: 69, target: 79 },
                    ]}
                  />
                </div>
              </Card>
            </div>
          </Section>

          {/* ============ GAMIFICATION ============ */}
          <Section id="gamification" title="Gamification" desc="Coach Mode / practice only — never inside a scored mock.">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <div className="space-y-5">
                  <XPBar level={7} current={320} needed={500} />
                  <XPBar level={8} current={40} needed={500} leveledUp />
                </div>
              </Card>
              <Card>
                <div className="flex flex-wrap items-center gap-3">
                  <StreakFlame count={12} />
                  <StreakFlame count={12} atRisk />
                  <QuestionCounterPill current={4} total={10} />
                </div>
              </Card>
            </div>
            <Row label="Achievement badges">
              <AchievementBadge icon={<Trophy size={26} />} title="First Mock" detail="Completed a full test" state="unlocked" />
              <AchievementBadge icon={<Flame size={26} />} title="7-Day Streak" detail="One week strong" state="just-unlocked" />
              <AchievementBadge icon={<Sparkle size={26} />} title="Skill Master" detail="Reach 79 in a skill" state="locked" />
            </Row>
            <Row label="Onboarding progress dots">
              <ProgressDots total={5} current={2} />
            </Row>
            <Row label="Celebration overlay">
              <Button onClick={() => setCelebrate(true)}>Trigger celebration</Button>
            </Row>
          </Section>

          {/* ============ FEEDBACK ============ */}
          <Section id="feedback" title="Feedback" desc="Explainable scoring: Score → Why → Fix → Expected improvement.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <FeedbackAccordion
                  criterion="Fluency & Coherence"
                  score={71}
                  why="Frequent hesitation and 4 filler words ('um', 'like') broke your rhythm; two long pauses exceeded 3 seconds."
                  fix="Practice Read Aloud daily with a metronome pace; record and re-listen for pauses over 2 seconds."
                  expectedGain={5}
                  defaultOpen
                />
                <FeedbackAccordion
                  criterion="Pronunciation"
                  score={80}
                  why="Word stress on 'radioactivity' and 'phenomenon' was misplaced; otherwise clear vowels."
                  fix="Drill multi-syllable academic words with the Squawk Box pronunciation set."
                  expectedGain={3}
                />
              </div>
              <Card>
                <div className="mb-3 text-[14px] font-semibold text-[var(--text-primary)]">
                  Squawk Box · Read Aloud
                </div>
                <TranscriptPlayer
                  duration="0:38"
                  markers={[
                    { at: 0.18, type: "filler", note: "'um' before 'research'" },
                    { at: 0.42, type: "pause", note: "3.1s pause mid-sentence" },
                    { at: 0.7, type: "mispron", note: "'radioactivity' — stress on wrong syllable" },
                  ]}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <ErrorTag kind="grammar">subject–verb agreement</ErrorTag>
                  <ErrorTag kind="vocabulary">repetition of "important"</ErrorTag>
                  <ErrorTag kind="pronunciation">"phenomenon"</ErrorTag>
                </div>
              </Card>
            </div>
          </Section>

          {/* ============ PRACTICE & EXAM ============ */}
          <Section id="practice" title="Practice & exam components">
            <Row label="Practice cards · real task types">
              <div className="grid w-full gap-3 md:grid-cols-2">
                <PracticeCard task="Read Aloud" skill="speaking" items={12} icon={<Mic size={22} />} delta={4} />
                <PracticeCard task="Summarize Written Text" skill="writing" items={8} icon={<Pencil size={22} />} delta={2} />
                <PracticeCard task="Re-order Paragraphs" skill="reading" items={10} icon={<BookOpen size={22} />} delta={-1} />
                <PracticeCard task="Summarize Spoken Text" skill="listening" items={6} icon={<Headphones size={22} />} delta={3} />
              </div>
            </Row>
            <Row label="Mic status (Coach Mode)">
              <MicStatus state="preparation" secondsLeft={12} />
              <MicStatus state="recording" level={0.6} secondsLeft={28} />
              <MicStatus state="completed" />
            </Row>
            <Row label="Exam timer · two variants">
              <ExamTimer seconds={125} variant="coach" />
              <ExamTimer seconds={3240} variant="exam" />
            </Row>
          </Section>

          {/* ============ SYSTEM ============ */}
          <Section id="system" title="System">
            <Row label="Toasts">
              <Toast tone="success" title="New personal best!" message="Reading rose to 73." />
              <Toast tone="warning" title="Streak at risk" message="Practice today to keep your 12-day streak." />
            </Row>
            <Row label="Overlays">
              <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
              <Button variant="secondary" onClick={() => setPaywall(true)}>Open paywall</Button>
            </Row>
            <Row label="Plan cards">
              <div className="flex flex-wrap gap-4">
                <PlanCard
                  name="Free"
                  price="₹0"
                  features={["3 practice items/day", "Basic scoring", "1 mock test"]}
                  ctaLabel="Current plan"
                />
                <PlanCard
                  name="Premium"
                  price="₹1,499"
                  recommended
                  features={["Unlimited practice", "Explainable AI scoring", "Unlimited mock tests", "Squawk Box error log"]}
                />
              </div>
            </Row>
            <Row label="Skeleton loaders">
              <div className="w-full max-w-sm space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 w-full" rounded="var(--radius-card)" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </Row>
          </Section>
        </div>
      </div>

      {/* Overlays */}
      <Modal
        open={modal}
        title="Test help"
        onClose={() => setModal(false)}
        footer={<Button onClick={() => setModal(false)}>Got it</Button>}
      >
        <p>
          At the top of the screen you can see your candidate number and the time remaining. Use the
          navigation strip to move between questions.
        </p>
      </Modal>

      <PaywallSheet
        open={paywall}
        title="Unlock your full plan"
        subtitle="See every skill breakdown and take unlimited mock tests."
        benefits={[
          "Unlimited AI-scored mock tests",
          "Full explainable feedback on every response",
          "Personalized daily study plan",
        ]}
        priceLine="₹1,499/mo · cancel anytime"
        illustration={<Polly state="explaining" size={88} />}
        onClose={() => setPaywall(false)}
      />

      <CelebrationOverlay
        open={celebrate}
        icon={<Trophy size={40} />}
        title="New personal best!"
        message="Your predicted PTE score just rose to 73. Six points to your target."
        onClose={() => setCelebrate(false)}
      />
    </div>
  );
}
