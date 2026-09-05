import { useState } from "react";
import Showcase from "./showcase/Showcase";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import Dashboard from "./dashboard/Dashboard";
import PracticeFlow from "./practice/PracticeFlow";
import ReadingPractice from "./ielts/ReadingPractice";
import WritingPractice from "./ielts/WritingPractice";
import FeedbackReport from "./feedback/FeedbackReport";
import ErrorLibrary from "./feedback/ErrorLibrary";
import MockFlow from "./mock/MockFlow";
import Home from "./home/Home";
import StudyPlan from "./plan/StudyPlan";
import Progress from "./analytics/Progress";
import Achievements from "./achievements/Achievements";
import Upgrade from "./upgrade/Upgrade";
import NotificationSettings from "./settings/NotificationSettings";

type View =
  | "home"
  | "onboarding"
  | "dashboard"
  | "practice"
  | "reading"
  | "writing"
  | "feedback"
  | "errors"
  | "mock"
  | "plan"
  | "progress"
  | "achievements"
  | "upgrade"
  | "notifications"
  | "library";

const LABELS: Record<View, string> = {
  home: "Home",
  onboarding: "onboarding",
  dashboard: "dashboard",
  practice: "practice",
  reading: "IELTS Reading",
  writing: "IELTS Writing",
  feedback: "Feedback",
  errors: "Error Library",
  mock: "Mock Test",
  plan: "Study Plan",
  progress: "Progress",
  achievements: "Achievements",
  upgrade: "Upgrade",
  notifications: "Notifications",
  library: "Component Library",
};

const ORDER: View[] = [
  "home",
  "onboarding",
  "dashboard",
  "practice",
  "reading",
  "writing",
  "feedback",
  "errors",
  "mock",
  "plan",
  "progress",
  "achievements",
  "upgrade",
  "notifications",
  "library",
];

export default function App() {
  const [view, setView] = useState<View>("plan");

  return (
    <div className="mode-coach min-h-full bg-[var(--bg-canvas)]">
      {/* Dev-only view switcher: Onboarding · Dashboard · Component Library */}
      <div className="mode-coach fixed right-4 top-4 z-[60] flex gap-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-1 shadow-[var(--shadow-raised)]">
        {ORDER.map(
          (v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={
                "focus-ring rounded-[var(--radius-pill)] px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors " +
                (view === v
                  ? "bg-[var(--accent-primary)] text-[#04120a]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
              }
            >
              {LABELS[v]}
            </button>
          ),
        )}
      </div>

      {view === "home" ? (
        <Home
          onStartPractice={() => setView("practice")}
          onSeeScoring={() => setView("feedback")}
        />
      ) : view === "library" ? (
        <Showcase />
      ) : view === "dashboard" ? (
        <Dashboard />
      ) : view === "practice" ? (
        <PracticeFlow onGoDashboard={() => setView("dashboard")} />
      ) : view === "reading" ? (
        <ReadingPractice onExit={() => setView("dashboard")} />
      ) : view === "writing" ? (
        <WritingPractice onExit={() => setView("dashboard")} />
      ) : view === "feedback" ? (
        <FeedbackReport onExit={() => setView("dashboard")} />
      ) : view === "errors" ? (
        <ErrorLibrary onExit={() => setView("dashboard")} />
      ) : view === "mock" ? (
        <MockFlow onExit={() => setView("dashboard")} />
      ) : view === "plan" ? (
        <StudyPlan onStartTask={() => setView("practice")} onRegenerate={() => {}} />
      ) : view === "progress" ? (
        <Progress />
      ) : view === "achievements" ? (
        <Achievements />
      ) : view === "upgrade" ? (
        <Upgrade onCheckout={() => setView("dashboard")} />
      ) : view === "notifications" ? (
        <NotificationSettings />
      ) : (
        <OnboardingFlow onComplete={() => setView("dashboard")} />
      )}
    </div>
  );
}
