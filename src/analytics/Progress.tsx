import { useState } from "react";
import SegmentedControl from "../components/ui/SegmentedControl";
import SkillRadar from "../components/ui/SkillRadar";
import ProgressTrendChart from "../components/ui/ProgressTrendChart";
import ReadinessGauge from "../components/ui/ReadinessGauge";
import TabBar from "../components/ui/TabBar";
import DeltaChip from "../components/ui/DeltaChip";
import type { RadarDatum } from "../components/ui/SkillRadar";
import type { TrendPoint } from "../components/ui/ProgressTrendChart";

type Range = "7" | "30" | "90";

const RADAR: RadarDatum[] = [
  { axis: "Speaking", current: 74, target: 79 },
  { axis: "Writing", current: 66, target: 79 },
  { axis: "Reading", current: 76, target: 79 },
  { axis: "Listening", current: 73, target: 79 },
];

const OVERALL_TREND: Record<Range, TrendPoint[]> = {
  "7": [
    { label: "Mon", value: 70 },
    { label: "Tue", value: 71 },
    { label: "Wed", value: 71 },
    { label: "Thu", value: 72 },
    { label: "Fri", value: 72 },
    { label: "Sat", value: 73 },
    { label: "Sun", value: 73 },
  ],
  "30": [
    { label: "Wk 1", value: 68 },
    { label: "Wk 2", value: 70 },
    { label: "Wk 3", value: 71 },
    { label: "Wk 4", value: 73 },
  ],
  "90": [
    { label: "Jun", value: 62 },
    { label: "Jul", value: 66 },
    { label: "Aug", value: 70 },
    { label: "Sep", value: 73 },
  ],
};

type SkillRow = {
  skill: "Writing" | "Speaking" | "Listening" | "Reading";
  current: number;
  delta: number;
  attempts: number;
  trend: TrendPoint[];
};
const SKILL_ROWS: SkillRow[] = [
  {
    skill: "Writing",
    current: 66,
    delta: 4,
    attempts: 18,
    trend: [
      { label: "1", value: 58 },
      { label: "2", value: 61 },
      { label: "3", value: 63 },
      { label: "4", value: 66 },
    ],
  },
  {
    skill: "Listening",
    current: 73,
    delta: 2,
    attempts: 24,
    trend: [
      { label: "1", value: 69 },
      { label: "2", value: 70 },
      { label: "3", value: 72 },
      { label: "4", value: 73 },
    ],
  },
  {
    skill: "Speaking",
    current: 74,
    delta: 3,
    attempts: 31,
    trend: [
      { label: "1", value: 70 },
      { label: "2", value: 71 },
      { label: "3", value: 73 },
      { label: "4", value: 74 },
    ],
  },
  {
    skill: "Reading",
    current: 76,
    delta: 1,
    attempts: 20,
    trend: [
      { label: "1", value: 74 },
      { label: "2", value: 75 },
      { label: "3", value: 75 },
      { label: "4", value: 76 },
    ],
  },
];

export default function Progress() {
  const [range, setRange] = useState<Range>("30");
  const [tab, setTab] = useState("skills");

  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] px-6 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent-on-light)]">
              My progress
            </div>
            <h1 className="mt-1 text-[30px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
              You're trending toward 79
            </h1>
          </div>
          <SegmentedControl
            segments={[
              { id: "7", label: "7 days" },
              { id: "30", label: "30 days" },
              { id: "90", label: "90 days" },
            ]}
            value={range}
            onChange={(v) => setRange(v as Range)}
          />
        </div>

        {/* ABOVE THE FOLD: two charts */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold">Overall predicted score</h2>
              <DeltaChip delta={OVERALL_TREND[range][OVERALL_TREND[range].length - 1].value - OVERALL_TREND[range][0].value} suffix=" pts" />
            </div>
            <div className="mt-4">
              <ProgressTrendChart data={OVERALL_TREND[range]} target={79} scale="PTE" />
            </div>
          </div>

          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <h2 className="text-[16px] font-bold">Skill balance vs target</h2>
            <div className="mt-2 flex justify-center">
              <SkillRadar data={RADAR} max={90} size={240} />
            </div>
          </div>
        </div>

        {/* BELOW: tabs */}
        <div className="mt-8">
          <TabBar
            tabs={[
              { id: "skills", label: "Per-skill trends" },
              { id: "table", label: "Weakest first" },
              { id: "readiness", label: "Readiness" },
            ]}
            value={tab}
            onChange={setTab}
          />

          <div className="mt-5">
            {tab === "skills" && (
              <div className="grid gap-5 sm:grid-cols-2">
                {SKILL_ROWS.map((s) => (
                  <div key={s.skill} className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold">{s.skill}</span>
                      <div className="flex items-center gap-2">
                        <DeltaChip delta={s.delta} suffix=" pts" />
                        <span className="tabular text-[18px] font-bold">{s.current}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressTrendChart data={s.trend} target={79} scale="PTE" height={120} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "table" && (
              <div className="overflow-hidden rounded-[var(--radius-feature)] border border-[var(--border-subtle)]">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="bg-[var(--bg-surface)] text-[12px] uppercase tracking-[0.04em] text-[var(--text-secondary)]">
                      <th className="px-5 py-3 font-bold">Skill</th>
                      <th className="px-5 py-3 font-bold">Current</th>
                      <th className="px-5 py-3 font-bold">Gap to 79</th>
                      <th className="px-5 py-3 font-bold">Change</th>
                      <th className="px-5 py-3 font-bold">Attempts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...SKILL_ROWS]
                      .sort((a, b) => a.current - b.current)
                      .map((s, i) => (
                        <tr key={s.skill} className={i % 2 ? "bg-[var(--bg-surface)]" : "bg-[var(--bg-surface-raised)]"}>
                          <td className="px-5 py-3 font-semibold">
                            {s.skill}
                            {i === 0 && (
                              <span className="ml-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--status-warning)_20%,transparent)] px-2 py-0.5 text-[11px] font-bold">
                                Weakest
                              </span>
                            )}
                          </td>
                          <td className="tabular px-5 py-3">{s.current}</td>
                          <td className="tabular px-5 py-3 text-[var(--text-secondary)]">{79 - s.current}</td>
                          <td className="px-5 py-3"><DeltaChip delta={s.delta} /></td>
                          <td className="tabular px-5 py-3 text-[var(--text-tertiary)]">{s.attempts}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "readiness" && (
              <div className="grid items-center gap-6 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:grid-cols-[auto_1fr]">
                <ReadinessGauge value={73} confidence={81} size={220} caption="Predicted score" />
                <div>
                  <h3 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    You have an estimated 68% chance of hitting 79 by test day
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    Based on your current trajectory and 42 days of practice left. Closing the Writing
                    gap is the single biggest driver — improving it to 74 would raise this probability
                    to around 82%.
                  </p>
                  <p className="mt-3 text-[13px] text-[var(--text-tertiary)]">
                    Probabilities are AI estimates from your practice history, not a guarantee of your
                    official result.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
