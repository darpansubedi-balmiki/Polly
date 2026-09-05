import { useState } from "react";
import { Play, Pause } from "../icons";
import { cn } from "./cn";

/**
 * Speaking-response playback with a static waveform and inline markers for
 * pauses, filler words, and mispronunciations. Markers carry a legend with
 * text labels (not color-only). Playback is illustrative (no real audio here).
 */
export type Marker = {
  at: number; // 0..1 position along the clip
  type: "pause" | "filler" | "mispron";
  note: string;
};

const markerColor = {
  pause: "var(--status-warning)",
  filler: "var(--skill-writing)",
  mispron: "var(--status-danger)",
};
const markerLabel = { pause: "Pause", filler: "Filler word", mispron: "Mispronunciation" };

// deterministic pseudo-waveform
const bars = Array.from({ length: 56 }, (_, i) =>
  0.25 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.29)) * 0.75,
);

export default function TranscriptPlayer({
  duration = "0:42",
  markers,
}: {
  duration?: string;
  markers: Marker[];
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="focus-ring grid size-11 shrink-0 place-items-center rounded-full bg-[var(--accent-primary)] text-[#04120a]"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="relative h-12 flex-1">
          <div className="flex h-full items-center gap-[3px]">
            {bars.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-full bg-[var(--border-strong)]"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
          {markers.map((m, i) => (
            <span
              key={i}
              title={`${markerLabel[m.type]}: ${m.note}`}
              className="absolute top-0 h-full w-0.5 -translate-x-1/2"
              style={{ left: `${m.at * 100}%`, background: markerColor[m.type] }}
            >
              <span
                className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full"
                style={{ background: markerColor[m.type] }}
              />
            </span>
          ))}
        </div>
        <span className="tabular text-[13px] text-[var(--text-tertiary)]">{duration}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {(["pause", "filler", "mispron"] as const).map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
            <span className="inline-block size-2.5 rounded-full" style={{ background: markerColor[t] }} />
            {markerLabel[t]}
          </span>
        ))}
      </div>
      {/* Markers with notes */}
      <ul className="mt-3 space-y-1.5">
        {markers.map((m, i) => (
          <li key={i} className={cn("flex items-start gap-2 text-[13px] text-[var(--text-secondary)]")}>
            <span
              className="mt-1 inline-block size-2 shrink-0 rounded-full"
              style={{ background: markerColor[m.type] }}
            />
            <span>
              <span className="font-semibold text-[var(--text-primary)]">{markerLabel[m.type]}:</span>{" "}
              {m.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
