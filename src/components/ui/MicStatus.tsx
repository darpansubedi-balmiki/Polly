import { Mic, Check, Clock } from "../icons";
import { cn } from "./cn";

type State = "preparation" | "recording" | "completed";

/**
 * Microphone status for practice speaking tasks (Coach Mode styling — practice
 * recording happens in Coach Mode). `level` (0..1) drives the live input ring
 * when recording. State is labelled in text, not color alone.
 */
export default function MicStatus({
  state,
  level = 0,
  secondsLeft,
}: {
  state: State;
  level?: number;
  secondsLeft?: number;
}) {
  const ringScale = 1 + Math.min(level, 1) * 0.35;
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid size-16 place-items-center">
        {state === "recording" && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "color-mix(in srgb, var(--status-danger) 30%, transparent)",
              transform: `scale(${ringScale})`,
              transition: "transform 90ms linear",
            }}
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            "relative grid size-14 place-items-center rounded-full",
            state === "preparation" && "bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] border border-[var(--border-strong)]",
            state === "recording" && "bg-[var(--status-danger)] text-white",
            state === "completed" && "bg-[var(--accent-primary)] text-[#04120a]",
          )}
        >
          {state === "preparation" && <Clock size={24} />}
          {state === "recording" && <Mic size={24} />}
          {state === "completed" && <Check size={26} strokeWidth={2.5} />}
        </span>
      </div>
      <div>
        <div className="text-[15px] font-semibold text-[var(--text-primary)]">
          {state === "preparation" && "Get ready"}
          {state === "recording" && "Recording…"}
          {state === "completed" && "Response captured"}
        </div>
        <div className="tabular text-[13px] text-[var(--text-tertiary)]">
          {state === "preparation" &&
            (secondsLeft !== undefined ? `Recording starts in ${secondsLeft}s` : "Preparing")}
          {state === "recording" &&
            (secondsLeft !== undefined ? `${secondsLeft}s remaining` : "Speak now")}
          {state === "completed" && "Sent to Polly for analysis"}
        </div>
      </div>
    </div>
  );
}
