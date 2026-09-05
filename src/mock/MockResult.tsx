import { useState } from "react";
import ScoreRing from "../components/ui/ScoreRing";
import SkillBar from "../components/ui/SkillBar";
import DeltaChip from "../components/ui/DeltaChip";
import XPBar from "../components/ui/XPBar";
import StreakFlame from "../components/ui/StreakFlame";
import Button from "../components/ui/Button";
import SegmentedControl from "../components/ui/SegmentedControl";
import PollyBubble from "../components/polly/PollyBubble";
import { Clock, Target, TrendingUp, ArrowRight } from "../components/icons";

type Exam = "pte" | "ielts";

const SECTION_TIMES = [
  { section: "Speaking & Writing", used: "54:12", allotted: "77:00", pace: "ahead" },
  { section: "Reading", used: "31:48", allotted: "32:00", pace: "on-track" },
  { section: "Listening", used: "44:57", allotted: "45:00", pace: "on-track" },
];

// IELTS raw → band transparency (Academic Reading, /40)
const IELTS_RAW = [
  { skill: "Listening", raw: "31 / 40", band: 7.0 },
  { skill: "Reading", raw: "30 / 40", band: 7.0 },
  { skill: "Writing", raw: "—", band: 6.5 },
  { skill: "Speaking", raw: "—", band: 6.5 },
];

export default function MockResult({
  onUpdatePlan,
  onReview,
}: {
  onUpdatePlan: () => void;
  onReview?: () => void;
}) {
  const [exam, setExam] = useState<Exam>("pte");
  const isPTE = exam === "pte";

  const overall = isPTE ? 71 : 6.5;
  const target = isPTE ? 79 : 7.5;
  const previous = isPTE ? 68 : 6.0;
  const delta = Math.round((overall - previous) * 10) / 10;
  const gap = Math.round((target - overall) * 10) / 10;

  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] px-6 py-10">
      <div className="anim-step-in mx-auto max-w-3xl">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
              Mock test complete
            </span>
            <h1
              className="mt-3 text-[30px] font-bold leading-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Here's how your mock went, Aayush.
            </h1>
          </div>
          <SegmentedControl
            segments={[
              { id: "pte", label: "PTE" },
              { id: "ielts", label: "IELTS" },
            ]}
            value={exam}
            onChange={(v) => setExam(v as Exam)}
          />
        </div>

        {/* overall + Polly */}
        <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr]">
          <div className="grid place-items-center rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <ScoreRing value={overall} scale={isPTE ? "PTE" : "IELTS"} kind="achieved" size={140} label="Overall" />
            <div className="mt-3 flex items-center gap-2">
              <DeltaChip delta={delta} />
              <span className="text-[13px] text-[var(--text-tertiary)]">vs last mock ({previous})</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-4">
              <PollyBubble
                state="explaining"
                message={`You're ${gap} ${isPTE ? "points" : "band"} from your ${target} target — closer than last time. Reading held you back most today; that's exactly what your updated plan will focus on.`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-secondary)]">
                  <Target size={16} /> Target
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[24px] font-bold text-[var(--text-primary)]">{target}</span>
                  <span className="text-[13px] text-[var(--text-tertiary)]">{gap} to go</span>
                </div>
              </div>
              <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-secondary)]">
                  <TrendingUp size={16} /> Trend
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[24px] font-bold text-[var(--text-primary)]">+{delta}</span>
                  <span className="text-[13px] text-[var(--text-tertiary)]">over 3 mocks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* skill scores */}
        <section className="mt-8">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Skill breakdown</h2>
          <div className="mt-4 grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:grid-cols-2">
            <SkillBar skill="speaking" label="Speaking" current={isPTE ? 74 : 6.5} target={isPTE ? 79 : 7.5} max={isPTE ? 90 : 9} delta={isPTE ? 3 : 0.5} />
            <SkillBar skill="writing" label="Writing" current={isPTE ? 72 : 6.5} target={isPTE ? 79 : 7.5} max={isPTE ? 90 : 9} delta={isPTE ? 4 : 0.5} />
            <SkillBar skill="reading" label="Reading" current={isPTE ? 66 : 7.0} target={isPTE ? 79 : 7.5} max={isPTE ? 90 : 9} delta={isPTE ? 1 : 0} />
            <SkillBar skill="listening" label="Listening" current={isPTE ? 73 : 7.0} target={isPTE ? 79 : 7.5} max={isPTE ? 90 : 9} delta={isPTE ? 2 : 0.5} />
          </div>
        </section>

        {/* transparency: IELTS raw→band OR PTE integrated diagram */}
        <section className="mt-8">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
            {isPTE ? "How integrated scoring works" : "Raw score to band"}
          </h2>
          {isPTE ? (
            <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                In PTE, a single response can contribute to several skill scores at once. Your
                spoken answers, for example, feed both Speaking and (through transcription) Reading
                and Listening.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <IntegratedNode label="Read Aloud" tone="task" />
                <ArrowRight size={18} className="text-[var(--text-tertiary)]" />
                <div className="flex flex-wrap gap-2">
                  <IntegratedNode label="Speaking" tone="skill" />
                  <IntegratedNode label="Reading" tone="skill" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <IntegratedNode label="Summarize Spoken Text" tone="task" />
                <ArrowRight size={18} className="text-[var(--text-tertiary)]" />
                <div className="flex flex-wrap gap-2">
                  <IntegratedNode label="Listening" tone="skill" />
                  <IntegratedNode label="Writing" tone="skill" />
                </div>
              </div>
              <p className="mt-4 text-[13px] text-[var(--text-tertiary)]">
                This is why improving one task type can lift several of your scores at once.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)]">
              <table className="w-full border-collapse text-left text-[14px]">
                <thead>
                  <tr className="bg-[var(--bg-surface)] text-[13px] uppercase tracking-[0.04em] text-[var(--text-secondary)]">
                    <th className="px-4 py-2.5 font-bold">Skill</th>
                    <th className="px-4 py-2.5 font-bold">Raw score</th>
                    <th className="px-4 py-2.5 font-bold">Band</th>
                  </tr>
                </thead>
                <tbody>
                  {IELTS_RAW.map((r, i) => (
                    <tr
                      key={r.skill}
                      className={i % 2 ? "bg-[var(--bg-surface)]" : "bg-[var(--bg-surface-raised)]"}
                    >
                      <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">{r.skill}</td>
                      <td className="tabular px-4 py-2.5 text-[var(--text-secondary)]">{r.raw}</td>
                      <td className="tabular px-4 py-2.5 font-bold text-[var(--text-primary)]">{r.band.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-[13px] text-[var(--text-tertiary)]">
                Writing and Speaking are examiner-marked against descriptors, so no raw count
                applies. Reading 30/40 falls in the band 7.0 range (30–32 correct).
              </p>
            </div>
          )}
        </section>

        {/* time per section */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-[16px] font-bold text-[var(--text-primary)]">
            <Clock size={18} /> Time per section
          </h2>
          <div className="mt-4 space-y-2">
            {SECTION_TIMES.map((s) => (
              <div
                key={s.section}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3"
              >
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{s.section}</span>
                <div className="flex items-center gap-3">
                  <span className="tabular text-[14px] text-[var(--text-secondary)]">
                    {s.used} <span className="text-[var(--text-tertiary)]">/ {s.allotted}</span>
                  </span>
                  <span
                    className="rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[12px] font-semibold"
                    style={
                      s.pace === "ahead"
                        ? {
                            background: "color-mix(in srgb, var(--accent-primary) 16%, transparent)",
                            color: "var(--accent-on-light)",
                          }
                        : {
                            background: "color-mix(in srgb, var(--text-primary) 8%, transparent)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {s.pace === "ahead" ? "Time to spare" : "On track"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* gamification returns */}
        <section className="mt-8 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">You earned this</h2>
            <StreakFlame count={13} />
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <XPBar level={8} current={180} needed={500} leveledUp />
            <div className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] px-4 py-2 text-[14px] font-bold text-[var(--accent-on-light)]">
              +260 XP · full mock
            </div>
          </div>
        </section>

        {/* dominant CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button size="l" block trailingIcon={<ArrowRight size={18} />} onClick={onUpdatePlan}>
            Update my study plan
          </Button>
          {onReview && (
            <Button variant="ghost" onClick={onReview}>
              Review my answers first
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegratedNode({ label, tone }: { label: string; tone: "task" | "skill" }) {
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-pill)] border px-3 py-1.5 text-[13px] font-semibold"
      style={
        tone === "task"
          ? { borderColor: "var(--border-strong)", background: "var(--bg-surface-raised)", color: "var(--text-primary)" }
          : { borderColor: "var(--border-subtle)", background: "var(--bg-canvas)", color: "var(--text-secondary)" }
      }
    >
      {label}
    </span>
  );
}
