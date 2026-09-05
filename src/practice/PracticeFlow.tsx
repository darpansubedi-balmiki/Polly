import { useState } from "react";
import PracticeHub from "./PracticeHub";
import ReadAloudPractice from "./ReadAloudPractice";
import SessionComplete from "./SessionComplete";

type Stage = "hub" | "session" | "complete";

/**
 * Ties the three Practice screens into a working flow:
 * Hub → (pick a task) → Read Aloud session → Session Complete → back to Hub.
 */
export default function PracticeFlow({ onGoDashboard }: { onGoDashboard?: () => void }) {
  const [stage, setStage] = useState<Stage>("hub");

  if (stage === "session") {
    return (
      <ReadAloudPractice
        onFinish={() => setStage("complete")}
        onExit={() => setStage("hub")}
      />
    );
  }

  if (stage === "complete") {
    return (
      <SessionComplete
        onContinueFeedback={() => setStage("hub")}
        onBackToDashboard={() => (onGoDashboard ? onGoDashboard() : setStage("hub"))}
      />
    );
  }

  return (
    <PracticeHub onStartSession={() => setStage("session")} onGoDashboard={onGoDashboard} />
  );
}
