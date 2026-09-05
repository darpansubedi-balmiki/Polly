import { useState } from "react";
import PreFlight from "./PreFlight";
import ExamReadingFrame from "./ExamReadingFrame";
import ExamDescribeImage from "./ExamDescribeImage";
import MockResult from "./MockResult";

type Stage = "preflight" | "reading" | "describe" | "result";

export default function MockFlow({ onExit }: { onExit?: () => void }) {
  const [stage, setStage] = useState<Stage>("preflight");

  if (stage === "preflight")
    return <PreFlight onBegin={() => setStage("reading")} onCancel={onExit} />;
  if (stage === "reading")
    return <ExamReadingFrame onSubmit={() => setStage("describe")} />;
  if (stage === "describe")
    return <ExamDescribeImage onNext={() => setStage("result")} />;
  return (
    <MockResult
      onUpdatePlan={() => onExit?.()}
      onReview={() => setStage("reading")}
    />
  );
}
