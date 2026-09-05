import { useEffect, useState } from "react";
import OnboardingShell from "./OnboardingShell";
import MicCalibration from "./MicCalibration";
import ChoiceCard from "../components/ui/ChoiceCard";
import TextInput from "../components/ui/TextInput";
import SearchField from "../components/ui/SearchField";
import Button from "../components/ui/Button";
import { Polly } from "../components/polly/PollyBubble";
import { COUNTRIES } from "./countries";
import { Sparkle } from "../components/icons";

type Answers = {
  name: string;
  interest: string;
  destination: string;
  timeline: string;
  discovery: string;
};

const INTERESTS = [
  { id: "study-abroad", label: "Studying abroad", emoji: "🎓" },
  { id: "university", label: "University admission", emoji: "🏛️" },
  { id: "immigration", label: "Immigration", emoji: "🛂" },
  { id: "career", label: "Career opportunities", emoji: "💼" },
  { id: "growth", label: "Personal growth", emoji: "🌱" },
  { id: "other", label: "Other", emoji: "✨" },
];

const TIMELINES = [
  { id: "1m", label: "Within 1 month", emoji: "⏱️" },
  { id: "1-3m", label: "1–3 months", emoji: "📅" },
  { id: "3-6m", label: "3–6 months", emoji: "🗓️" },
  { id: "6m+", label: "6+ months", emoji: "🌤️" },
  { id: "undecided", label: "Not decided yet", emoji: "🤔" },
];

const DISCOVERY = [
  { id: "google", label: "Google", emoji: "🔎" },
  { id: "social", label: "Facebook or Instagram", emoji: "📱" },
  { id: "friend", label: "Friend or family", emoji: "👥" },
  { id: "college", label: "College or Institution", emoji: "🏫" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "other", label: "Other", emoji: "✨" },
];

const TOTAL_STEPS = 5;

export default function OnboardingFlow({ onComplete }: { onComplete?: () => void }) {
  // step 0..4 = questions, 5 = transition, 6 = mic calibration
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    name: "",
    interest: "",
    destination: "",
    timeline: "",
    discovery: "",
  });
  const [countryQuery, setCountryQuery] = useState("");

  const set = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const displayName = answers.name.trim() || "Aayush";

  // Auto-advance the transition screen
  useEffect(() => {
    if (step !== 5) return;
    const t = setTimeout(() => setStep(6), 1800);
    return () => clearTimeout(t);
  }, [step]);

  // ---- Transition screen ----
  if (step === 5) {
    return (
      <div className="mode-coach grid min-h-full place-items-center px-6 text-center">
        <div className="anim-step-in flex flex-col items-center">
          <Polly state="analyzing" size={120} />
          <h1
            className="mt-6 text-[30px] font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Thanks, {displayName}! 🔥
          </h1>
          <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
            Setting up your personal plan…
          </p>
          <div className="mt-6 flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-2.5 rounded-full bg-[var(--accent-primary)]"
                style={{
                  animation: "pollyThink 1s ease-in-out infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Mic calibration (part of onboarding, hard gate) ----
  if (step === 6) {
    return <MicCalibration onDone={() => onComplete?.()} />;
  }

  // ---- Question steps ----
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.trim().toLowerCase()),
  );

  const stepProps = {
    stepIndex: step,
    totalSteps: TOTAL_STEPS,
    onBack: step > 0 ? back : undefined,
  };

  return (
    <div key={step} className="anim-step-in min-h-full">
      {step === 0 && (
        <OnboardingShell
          {...stepProps}
          pollyState="idle"
          pollyMessage="Hi! I'm Polly, your AI coach. Let's set up your plan in under a minute."
          title="What should we call you?"
          subtitle="We'll use this to personalize your coaching."
          canContinue={answers.name.trim().length > 0}
          onContinue={next}
        >
          <TextInput
            name="name"
            placeholder="Your first name"
            value={answers.name}
            autoFocus
            onChange={(e) => set({ name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && answers.name.trim()) next();
            }}
          />
        </OnboardingShell>
      )}

      {step === 1 && (
        <OnboardingShell
          {...stepProps}
          pollyState="explaining"
          pollyMessage={`Nice to meet you, ${displayName}! This helps me tailor your goals.`}
          title="Why are you interested in taking this test?"
          canContinue={!!answers.interest}
          onContinue={next}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {INTERESTS.map((o) => (
              <ChoiceCard
                key={o.id}
                selected={answers.interest === o.id}
                onSelect={() => set({ interest: o.id })}
                title={o.label}
                leading={o.emoji}
              />
            ))}
          </div>
        </OnboardingShell>
      )}

      {step === 2 && (
        <OnboardingShell
          {...stepProps}
          pollyState="idle"
          pollyMessage="Different countries expect different scores — I'll factor that in."
          title="Where do you intend to study?"
          subtitle="Search and pick your destination."
          canContinue={!!answers.destination}
          onContinue={next}
        >
          <div className="mb-3">
            <SearchField
              value={countryQuery}
              onChange={setCountryQuery}
              placeholder="Search countries…"
            />
          </div>
          <div className="max-h-[46vh] space-y-2 overflow-auto pr-1">
            {filteredCountries.map((c) => (
              <ChoiceCard
                key={c.code}
                selected={answers.destination === c.code}
                onSelect={() => set({ destination: c.code })}
                title={c.name}
                leading={<span className="text-[24px]">{c.flag}</span>}
              />
            ))}
            {filteredCountries.length === 0 && (
              <p className="py-6 text-center text-[14px] text-[var(--text-tertiary)]">
                No matches for “{countryQuery}”.
              </p>
            )}
          </div>
        </OnboardingShell>
      )}

      {step === 3 && (
        <OnboardingShell
          {...stepProps}
          pollyState="explaining"
          pollyMessage="This sets the pace of your daily plan and mock-test schedule."
          title="When do you plan to take the test?"
          canContinue={!!answers.timeline}
          onContinue={next}
        >
          <div className="space-y-2">
            {TIMELINES.map((o) => (
              <ChoiceCard
                key={o.id}
                selected={answers.timeline === o.id}
                onSelect={() => set({ timeline: o.id })}
                title={o.label}
                leading={o.emoji}
              />
            ))}
          </div>
        </OnboardingShell>
      )}

      {step === 4 && (
        <OnboardingShell
          {...stepProps}
          pollyState="idle"
          pollyMessage="Last one — then I'll build your plan."
          title="How did you hear about us?"
          canContinue={!!answers.discovery}
          onContinue={next}
          continueLabel="Build my plan"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {DISCOVERY.map((o) => (
              <ChoiceCard
                key={o.id}
                selected={answers.discovery === o.id}
                onSelect={() => set({ discovery: o.id })}
                title={o.label}
                leading={o.emoji}
              />
            ))}
          </div>
        </OnboardingShell>
      )}
    </div>
  );
}

/** Simple placeholder shown after onboarding completes (Dashboard = later round). */
export function DashboardPlaceholder({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="mode-coach grid min-h-full place-items-center px-6 text-center">
      <div className="flex max-w-md flex-col items-center">
        <Polly state="celebrating" size={120} />
        <div className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-3 py-1 text-[13px] font-semibold text-[var(--accent-primary)]">
          <Sparkle size={15} /> Onboarding complete
        </div>
        <h1
          className="mt-4 text-[30px] font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You're all set!
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
          Your personalized dashboard is next — that's a later round. For now, your plan is ready and
          your mic is calibrated for speaking practice.
        </p>
        <Button className="mt-6" variant="secondary" onClick={onRestart}>
          Restart onboarding
        </Button>
      </div>
    </div>
  );
}
