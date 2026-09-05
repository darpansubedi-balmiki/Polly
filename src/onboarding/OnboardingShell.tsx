import type { ReactNode } from "react";
import ProgressDots from "../components/ui/ProgressDots";
import Button from "../components/ui/Button";
import PollyBubble from "../components/polly/PollyBubble";
import type { PollyState } from "../components/polly/PollyBubble";
import { ArrowLeft, ArrowRight } from "../components/icons";

/**
 * Shared onboarding layout: progress dots, a supportive Polly, a large question
 * headline, the step body, and Continue / Back affordances. One question per
 * screen, minimal friction.
 */
export default function OnboardingShell({
  stepIndex,
  totalSteps,
  pollyState = "idle",
  pollyMessage,
  title,
  subtitle,
  children,
  canContinue,
  onContinue,
  onBack,
  continueLabel = "Continue",
}: {
  stepIndex: number;
  totalSteps: number;
  pollyState?: PollyState;
  pollyMessage: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
}) {
  return (
    <div className="mode-coach flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-8">
        {/* Top bar: back + progress */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-11">
            {onBack && (
              <button
                onClick={onBack}
                aria-label="Back"
                className="focus-ring grid size-11 place-items-center rounded-full text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <ArrowLeft size={22} />
              </button>
            )}
          </div>
          <div className="flex flex-1 justify-center">
            <ProgressDots total={totalSteps} current={stepIndex} />
          </div>
          <div className="w-11" />
        </div>

        {/* Polly + prompt */}
        <div className="mb-6">
          <PollyBubble state={pollyState} size={84} message={pollyMessage} />
        </div>

        {/* Question */}
        <h1
          className="text-[32px] font-bold leading-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[15px] text-[var(--text-secondary)]">{subtitle}</p>
        )}

        {/* Body */}
        <div className="mt-6 flex-1">{children}</div>

        {/* CTA */}
        <div className="sticky bottom-0 mt-8 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)] to-transparent pb-2 pt-4">
          <Button
            block
            size="l"
            disabled={!canContinue}
            onClick={onContinue}
            trailingIcon={<ArrowRight size={20} />}
          >
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
