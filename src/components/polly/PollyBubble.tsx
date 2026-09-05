import type { ReactNode } from "react";
import { cn } from "../ui/cn";

/**
 * POLLY — the AI coach mascot. A modern, flat-geometric parrot in navy / mint /
 * warm-neutral. Confident and warm, deliberately NOT babyish (no oversized
 * cartoon eyes, no bouncing). Coach Mode only — never rendered in Exam Mode.
 *
 * States:
 *  - idle       : calm, resting.
 *  - listening  : animated waveform ring (hearing the user speak).
 *  - analyzing  : thinking dots rising above the head.
 *  - explaining : a small pointer/glint, leaning toward feedback.
 *  - celebrating: restrained sparkle + a single pop (no confetti storm).
 */
export type PollyState =
  | "idle"
  | "listening"
  | "analyzing"
  | "explaining"
  | "celebrating";

export function Polly({
  state = "idle",
  size = 96,
}: {
  state?: PollyState;
  size?: number;
}) {
  const navy = "#0B132B";
  const navyMid = "#16203D";
  const mint = "#39FF88";
  const cream = "#F7F5EF";
  const beak = "#FFB020";

  return (
    <div
      className={cn("relative", state === "celebrating" && "anim-pop")}
      style={{ width: size, height: size }}
    >
      {/* Listening waveform ring */}
      {state === "listening" && (
        <>
          <span
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: mint, animation: "pollyWave 1.4s ease-out infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: mint,
              animation: "pollyWave 1.4s ease-out infinite",
              animationDelay: "0.5s",
            }}
          />
        </>
      )}

      {/* Analyzing thinking dots */}
      {state === "analyzing" && (
        <div className="absolute -top-2 right-0 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full"
              style={{
                background: mint,
                animation: "pollyThink 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Celebrating sparkle */}
      {state === "celebrating" && (
        <svg
          className="absolute -right-1 -top-1"
          width={size * 0.3}
          height={size * 0.3}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2v6M12 16v6M2 12h6M16 12h6"
            stroke={mint}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}

      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        role="img"
        aria-label={`Polly the coach, ${state}`}
      >
        {/* soft ground shadow */}
        <ellipse cx="60" cy="110" rx="30" ry="6" fill={navy} opacity="0.18" />

        {/* tail feathers */}
        <path d="M40 78 L18 98 L38 92 Z" fill={navyMid} />
        <path d="M44 82 L26 104 L48 96 Z" fill={mint} opacity="0.85" />

        {/* body */}
        <path
          d="M60 30 C82 30 92 48 92 68 C92 90 78 102 60 102 C42 102 30 90 30 68 C30 48 40 30 60 30 Z"
          fill={navy}
        />
        {/* belly */}
        <path
          d="M60 56 C72 56 78 66 78 78 C78 90 70 98 60 98 C50 98 44 90 44 78 C44 66 50 56 60 56 Z"
          fill={cream}
        />

        {/* wing */}
        <path
          d="M40 58 C34 66 34 80 42 88 C46 82 48 70 46 60 Z"
          fill={mint}
        />

        {/* head crest */}
        <path d="M60 16 C64 22 64 28 60 32 C56 28 56 22 60 16 Z" fill={mint} />

        {/* face patch */}
        <circle cx="60" cy="46" r="20" fill={navyMid} />

        {/* eyes — small, intelligent (not cartoonish) */}
        <circle cx="53" cy="44" r="3.2" fill={cream} />
        <circle cx="67" cy="44" r="3.2" fill={cream} />
        <circle cx="53.8" cy="44.6" r="1.5" fill={navy} />
        <circle cx="67.8" cy="44.6" r="1.5" fill={navy} />

        {/* beak */}
        <path d="M56 52 L64 52 L60 60 Z" fill={beak} />

        {/* explaining: subtle glint near beak */}
        {state === "explaining" && (
          <circle cx="72" cy="54" r="2.5" fill={mint} />
        )}
      </svg>
    </div>
  );
}

/**
 * PollyBubble — Polly beside a speech bubble. Use for greetings, coaching tips,
 * onboarding guidance, empty-state encouragement. Tone is warm & concise.
 */
export default function PollyBubble({
  state = "idle",
  message,
  size = 96,
  side = "left",
  children,
}: {
  state?: PollyState;
  message?: ReactNode;
  size?: number;
  side?: "left" | "top";
  children?: ReactNode;
}) {
  const bubble = (
    <div className="relative max-w-xs rounded-[var(--radius-card)] rounded-bl-none border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] px-4 py-3 text-[14px] leading-relaxed text-[var(--text-primary)] shadow-[var(--shadow-rest)]">
      {message ?? children}
    </div>
  );

  if (side === "top") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Polly state={state} size={size} />
        {(message || children) && bubble}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3">
      <Polly state={state} size={size} />
      {(message || children) && bubble}
    </div>
  );
}
