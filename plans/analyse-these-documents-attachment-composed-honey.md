# Round 0 (full) + Onboarding Flow

Build order (user-confirmed): **build the complete Round 0 design system & component library
first**, then build the onboarding flow on top of it. Part A below is Round 0 in full; Part B is
the onboarding flow that consumes those components.

---

# Part A — Round 0: Design System & Component Library

## Context

We are building an AI-powered English-proficiency coaching web app (IELTS/PTE) whose
signature idea is a **two-mode visual system sharing one component library**:

- **Coach Mode** — warm, rounded, illustrated, gamified consumer-product feel (navy `#0B132B`
  + cream `#F7F5EF` surfaces + Signal Mint `#39FF88` used purposefully). Inspired by
  best-in-class learning apps (the Duolingo reference), but premium, not childish.
- **Exam Mode** — a deliberate institutional downgrade: white canvas, grey panels, 1px hard
  borders, system sans, 4px radius, no shadows, no illustrations, no Polly, no gamification.
  Fidelity target is real IELTS/PTE exam software (screenshots image / image-1..4, Pearson report).

**This round produces ONLY the design tokens and the component library — no full screens.**
The deliverable is a single showcase/specimen page that renders every component with its
variants/states, plus one explicit side-by-side frame proving the two modes share tokens but
diverge in radius/shadow/type/color. This becomes the reference for all later rounds.

The repo is a greenfield Vite + React 19 + Tailwind v4 scaffold. `src/App.tsx` is an empty
centered div; `src/index.css` only imports Tailwind. Nothing to preserve — we establish the
foundation here.

## Approach

### 1. Fonts & tokens — `src/index.css`

- Add Google Fonts `@import` **first** (before `@import 'tailwindcss'` is fine only if the
  tailwind import stays after `@charset`/font imports — put font `@import`s at the very top,
  then `@import 'tailwindcss';`): `Inter Tight` (600/700) and `Inter` (400/500/600/700).
- Exam Mode font stack: `Arial, Helvetica, "Liberation Sans", sans-serif` (no import needed).
- Define the **two-mode token system** as CSS variables. Both modes must coexist on one page,
  so scope by wrapper class rather than a global toggle:
  - Raw brand + both mode palettes declared on `:root` (e.g. `--coach-bg-canvas`,
    `--exam-bg-canvas`, shared `--accent-primary: #39FF88`, `--accent-on-light: #0E7A44`, etc.).
  - `.mode-coach { --bg-canvas: var(--coach-bg-canvas); --radius-card: 16px;
    --radius-feature: 20px; --radius-pill: 999px; --font-display: "Inter Tight"; ... }`
  - `.mode-exam { --bg-canvas: #FFFFFF; --radius-card: 4px; --font-display: Arial,...;
    --shadow-raised: none; ... }`
  - Components consume the **semantic** vars (`--bg-canvas`, `--bg-surface`, `--bg-surface-warm`,
    `--bg-surface-raised`, `--border-subtle`, `--border-strong`, `--text-primary/secondary/
    tertiary`, `--accent-primary`, `--accent-primary-pressed`, `--accent-on-light`,
    `--status-success/warning(#FFB020)/danger(#FF5A5F)/info(#4CA8FF)`, `--skill-speaking/
    writing/reading/listening`, `--xp-fill`, `--streak-flame`, `--radius-*`, `--shadow-*`).
  - Skill colors chosen to stay distinguishable in greyscale (vary lightness, not only hue).
- Expose via `@theme inline` so Tailwind utilities (`bg-canvas`, `text-primary`,
  `rounded-card`, etc.) resolve to the scoped vars.
- Spacing scale 4/8/12/16/24/32/40/64 mapped as `--space-*` / tailwind spacing.
- Grid: 12 col, 1200px max content, 24px gutters (a `.container-grid` helper).

### 2. Component library — `src/components/ui/*`

Each component is a default-exported `.tsx` file, mode-aware by living inside a `.mode-*`
wrapper (they read semantic vars), typed props for the listed variants/states, keyboard +
focus-ring accessible, 44px min targets, meaning never color-only (icon/label paired).

- **Core controls**: `Button` (Primary/Secondary/Ghost/Destructive × Default/Hover/Pressed/
  Loading/Disabled × S/M/L), `IconButton`, `TabBar`, `SegmentedControl`, `Dropdown`,
  `TextInput`, `Textarea` (live word counter), `Checkbox`, `Radio`, `Toggle`, `Slider`,
  `SearchField`, `ChoiceCard` (Default/Selected/Hover).
- **Cards**: `Card` (Default/Interactive/Locked-Premium/Empty) with warm-light and dark-navy
  surface variants.
- **Progress & scoring**: `ScoreRing` (IELTS band 0.0–9.0 & PTE 10–90; Achieved/Target/
  Predicted), `BandBadge`, `SkillBar` (label + current + target marker + delta chip),
  `DeltaChip`, `ReadinessGauge` (arc + confidence %), `ProgressTrendChart` (dashed target
  line — via `recharts`), `SkillRadar` (4-axis — `recharts`).
- **Gamification**: `XPBar` (animatable fill + level-up), `StreakFlame` (count + at-risk),
  `AchievementBadge` (Locked/Unlocked/Just-unlocked), `ProgressDots`, `QuestionCounterPill`,
  `CelebrationOverlay` (personal best / streak / level-up; restrained pop+scale+glow,
  150–400ms, no confetti/looping — spec noted in code comments).
- **Feedback**: `FeedbackAccordion` (Score→Why→Fix→Expected Improvement; Collapsed/Expanded),
  `TranscriptPlayer` (waveform + pause/filler/mispronunciation markers), `ErrorTag`.
- **Practice/exam**: `PracticeCard`, `MicStatus` (Preparation/Recording/Completed, Coach
  styling), `ExamTimer` (Coach friendly variant + stark Exam variant), `QuestionNavigator`
  (Exam Mode only, stark).
- **Mascot**: `PollyBubble` — inline flat-vector SVG parrot (navy/mint/warm neutral) with 5
  states Idle/Listening(waveform ring)/Analyzing/Explaining/Celebrating. Coach Mode only.
- **System**: `Toast`, `Modal`, `PaywallSheet`, `PlanCard`, `EmptyState` (illustrated + Polly),
  `Skeleton`.
- Icons: use `lucide-react` (rounded, 1.5–2px stroke, monochrome) — install it.

### 3. Showcase page — `src/App.tsx` + `src/showcase/*`

- Replace the empty `App` with a **component gallery** (not a product screen): sectioned by
  category, each component rendered across its variants/states with labels, inside the
  appropriate `.mode-coach` wrapper.
- **The required specimen frame**: a dedicated side-by-side block — a Coach Mode card
  (`.mode-coach`, radius 16, soft shadow, Inter Tight, mint CTA, Polly) next to an Exam Mode
  panel (`.mode-exam`, radius 4, hard 1px border, no shadow, Arial, no brand chrome) — both
  built from the same underlying components/tokens, annotated to show the divergence.
- Realistic content throughout: persona Aayush Sharma, PTE predicted 73 → target 79, 42 days,
  12-day streak; real task names (Read Aloud, Describe Image, Summarize Written Text; IELTS
  True/False/Not Given, Task 2, etc.).

### 4. Dependencies

Install `recharts` (trend chart + radar) and `lucide-react` (icons).

## Files

- `src/index.css` — fonts, two-mode token system, `@theme inline`, grid/spacing helpers.
- `src/components/ui/*.tsx` — the component library (one file per component + an `index.ts`).
- `src/components/polly/PollyBubble.tsx` — mascot SVG + states.
- `src/showcase/Showcase.tsx` (+ small section helpers) — gallery + two-mode specimen.
- `src/App.tsx` — render `<Showcase />`.
- `package.json` — add `recharts`, `lucide-react`.

## Verification

- `pnpm build` (or the project's build script) typechecks and compiles cleanly.
- Load the running preview: every component category renders with all variants/states; no
  console errors.
- Confirm the two-mode specimen visibly differs in radius, shadow, typography, and color while
  driven by the same token names.
- Spot-check accessibility: visible focus rings, status paired with icon/label (not color
  alone), skill colors distinguishable when desaturated, 44px targets.
- Confirm Exam Mode components carry zero brand chrome / no Polly / no gamification.

---

# Part B — Onboarding Flow (Coach Mode, uses Part A components)

## Context

New-user onboarding for persona Aayush Sharma. Goal per brief: **less friction, more progress** —
minimal typing, one question per screen, one clear action, warm Coach Mode language, Polly present
as a supportive guide. Ends by gating into mic calibration (a genuine, non-negotiable blocker)
before the Dashboard. Reuses Part A components — no new primitives beyond what's listed.

## Flow & screens

Single-question-per-screen wizard driven by React state (`step`, collected `answers`). Shared
`OnboardingShell` layout: progress-dot indicator (`ProgressDots`) at top, Polly in a supporting
position (`PollyBubble` Idle/Explaining; Analyzing on the transition), question headline (Inter
Tight, H2), the step body, a primary `Button` "Continue", and a subtle Ghost `Button` "Back"
(hidden on step 1). Step-to-step transition: slide + fade, 200–300ms ease-out (CSS transition on
a keyed container; respect `prefers-reduced-motion`).

- **Step 1 — Name**: "What should we call you?" — single `TextInput`; Continue disabled until
  non-empty. (Only long-form typing in the flow.)
- **Step 2 — Test interest**: "Why are you interested in taking this test?" — single-select
  `ChoiceCard` grid: Studying abroad / University admission / Immigration / Career opportunities /
  Personal growth / Other.
- **Step 3 — Study destination**: "Where do you intend to study?" — `SearchField` filtering a
  country list; results rendered as `ChoiceCard`s with flag icons (emoji flags or a small inline
  set), single-select. Local country dataset (name + ISO + flag), no network.
- **Step 4 — Test timeline**: "When do you plan to take the test?" — single-select `ChoiceCard`s:
  Within 1 month / 1–3 months / 3–6 months / 6+ months / Not decided yet.
- **Step 5 — Discovery**: "How did you hear about us?" — single-select `ChoiceCard`s: Google /
  Facebook or Instagram / Friend or family / College or Institution / YouTube / Other.
- **Transition screen**: "Thanks, Aayush! Setting up your personal plan…" with `PollyBubble`
  Analyzing + a short animated loading state (~1.8s), then auto-advances to mic calibration.
- **Mic calibration** (`MicCalibration`): required 10-second check. Uses `getUserMedia` +
  Web Audio `AnalyserNode` to derive a live input level and an ambient-noise dB estimate, with a
  live input-level meter (reuse `MicStatus` styling) and auto-adjusting gain (GainNode). Three
  result states: **Good** / **Adjust volume** / **Too noisy**. In **Too noisy**, Continue is
  DISABLED with the exact copy: *"Background noise is too high (58 dB). Move to a quieter space —
  noise directly lowers speaking scores."* Warm Coach styling, functionally strict gate. Include
  a graceful fallback if mic permission is denied (explain + allow retry; simulate meter so the
  screen still demonstrates all three states). On success → Continue proceeds (to Dashboard,
  which is out of scope this round — land on a simple "Dashboard next" placeholder).

## Files (Part B)

- `src/onboarding/OnboardingFlow.tsx` — wizard state machine + transitions.
- `src/onboarding/OnboardingShell.tsx` — shared layout (dots, Polly, headline, CTAs).
- `src/onboarding/steps/*.tsx` — Step1Name, Step2Interest, Step3Destination, Step4Timeline,
  Step5Discovery, TransitionScreen.
- `src/onboarding/MicCalibration.tsx` — mic check + gate.
- `src/onboarding/countries.ts` — country dataset for Step 3.
- `src/App.tsx` — this round renders `<OnboardingFlow />` (the Part A showcase remains available
  via a small dev toggle, or is superseded — App renders onboarding as the entry experience).

## Verification (Part B)

- Walk all 5 steps: Back/Continue enablement correct, single-select works, Step 1 gates on
  non-empty, Step 3 search filters and selects.
- Transitions are ~200–300ms and reduced-motion falls back to instant.
- Transition screen shows Polly Analyzing then auto-advances.
- Mic calibration: meter animates from real input; forcing "Too noisy" disables Continue with the
  exact copy; denied-permission fallback still demonstrates the three states and keeps the gate.
- Typecheck/build clean; no console errors.
