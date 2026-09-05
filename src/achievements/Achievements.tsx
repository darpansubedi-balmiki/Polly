import { useState } from "react";
import XPBar from "../components/ui/XPBar";
import StreakFlame from "../components/ui/StreakFlame";
import AchievementBadge from "../components/ui/AchievementBadge";
import TabBar from "../components/ui/TabBar";
import SegmentedControl from "../components/ui/SegmentedControl";
import { Flame, Trophy, Target, Mic, Pencil, Sparkle, BookOpen } from "../components/icons";
import type { ReactNode } from "react";

// 5-week streak calendar (most recent week last). 2 = practised, 1 = light, 0 = missed.
const STREAK_WEEKS: number[][] = [
  [2, 2, 1, 2, 2, 0, 2],
  [2, 2, 2, 2, 1, 2, 2],
  [2, 1, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 1, 2],
  [2, 2, 2, 2, 2, 0, 0],
];
const DOW = ["M", "T", "W", "T", "F", "S", "S"];

type Badge = {
  icon: ReactNode;
  title: string;
  detail: string;
  state: "locked" | "unlocked" | "just-unlocked";
};
const BADGES: Badge[] = [
  { icon: <Flame size={22} />, title: "10-Day Streak", detail: "Practised 10 days running", state: "unlocked" },
  { icon: <Sparkle size={22} />, title: "First Mock", detail: "Completed a full mock test", state: "unlocked" },
  { icon: <Mic size={22} />, title: "Smooth Talker", detail: "Fluency 75+ on Read Aloud", state: "just-unlocked" },
  { icon: <Pencil size={22} />, title: "Essay Ace", detail: "Score a Writing task at 79+", state: "locked" },
  { icon: <Target size={22} />, title: "On Target", detail: "Reach your predicted target once", state: "locked" },
  { icon: <BookOpen size={22} />, title: "Speed Reader", detail: "Finish a Reading section early", state: "unlocked" },
  { icon: <Trophy size={22} />, title: "Top 10%", detail: "Rank in your country's top 10%", state: "locked" },
  { icon: <Flame size={22} />, title: "30-Day Streak", detail: "Practise 30 days running", state: "locked" },
];

type Board = "country" | "institution" | "friends";
const LEADERBOARDS: Record<Board, { rank: number; name: string; xp: number; you?: boolean }[]> = {
  country: [
    { rank: 1, name: "Priya R.", xp: 8420 },
    { rank: 2, name: "Sandeep K.", xp: 7990 },
    { rank: 3, name: "Aayush Sharma", xp: 7610, you: true },
    { rank: 4, name: "Meera T.", xp: 7250 },
    { rank: 5, name: "Rohit B.", xp: 6980 },
  ],
  institution: [
    { rank: 1, name: "Aayush Sharma", xp: 7610, you: true },
    { rank: 2, name: "Nisha P.", xp: 6800 },
    { rank: 3, name: "Karan D.", xp: 6120 },
  ],
  friends: [
    { rank: 1, name: "Aayush Sharma", xp: 7610, you: true },
    { rank: 2, name: "Dev (from college)", xp: 5400 },
    { rank: 3, name: "Anaya", xp: 4870 },
  ],
};

export default function Achievements() {
  const [tab, setTab] = useState("badges");
  const [board, setBoard] = useState<Board>("country");

  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] px-6 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl">
        <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--accent-on-light)]">
          Achievements
        </div>
        <h1 className="mt-1 text-[30px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Keep the momentum going
        </h1>

        {/* top: level + streak */}
        <div className="mt-8 grid gap-5 sm:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold">Level 8 · Fluent Explorer</h2>
              <span className="text-[13px] text-[var(--text-tertiary)]">180 / 500 XP to Level 9</span>
            </div>
            <div className="mt-4">
              <XPBar level={8} current={180} needed={500} />
            </div>
            <p className="mt-3 text-[13px] text-[var(--text-tertiary)]">
              Earn XP from every scored task — full mocks are worth the most.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-center">
            <StreakFlame count={13} />
            <p className="text-[13px] text-[var(--text-tertiary)]">
              Longest streak: 21 days · don't break it today
            </p>
          </div>
        </div>

        {/* streak calendar */}
        <section className="mt-5 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[var(--streak-flame,#FF7A1A)]" />
            <h2 className="text-[16px] font-bold">Last 5 weeks</h2>
          </div>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex flex-col gap-2 pt-6">
              {STREAK_WEEKS.map((_, i) => (
                <span key={i} className="h-6 text-[11px] leading-6 text-[var(--text-tertiary)]">
                  W{i + 1}
                </span>
              ))}
            </div>
            <div>
              <div className="mb-1 grid grid-cols-7 gap-2">
                {DOW.map((d, i) => (
                  <span key={i} className="text-center text-[11px] text-[var(--text-tertiary)]">{d}</span>
                ))}
              </div>
              {STREAK_WEEKS.map((week, wi) => (
                <div key={wi} className="mb-2 grid grid-cols-7 gap-2">
                  {week.map((v, di) => (
                    <span
                      key={di}
                      title={v === 2 ? "Practised" : v === 1 ? "Light day" : "Missed"}
                      className="size-6 rounded-[6px]"
                      style={{
                        background:
                          v === 2
                            ? "var(--accent-primary)"
                            : v === 1
                              ? "color-mix(in srgb, var(--accent-primary) 40%, var(--bg-surface-raised))"
                              : "var(--border-subtle)",
                      }}
                    />
                  ))}
                </div>
              ))}
              <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1"><span className="size-3 rounded-[4px] bg-[var(--border-subtle)]" /> Missed</span>
                <span className="flex items-center gap-1"><span className="size-3 rounded-[4px]" style={{ background: "color-mix(in srgb, var(--accent-primary) 40%, var(--bg-surface-raised))" }} /> Light</span>
                <span className="flex items-center gap-1"><span className="size-3 rounded-[4px] bg-[var(--accent-primary)]" /> Practised</span>
              </div>
            </div>
          </div>
        </section>

        {/* tabs: badges / leaderboard */}
        <div className="mt-8">
          <TabBar
            tabs={[
              { id: "badges", label: "Badges" },
              { id: "leaderboard", label: "Leaderboard" },
            ]}
            value={tab}
            onChange={setTab}
          />

          <div className="mt-5">
            {tab === "badges" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {BADGES.map((b) => (
                  <AchievementBadge key={b.title} icon={b.icon} title={b.title} detail={b.detail} state={b.state} />
                ))}
              </div>
            ) : (
              <div>
                <SegmentedControl
                  segments={[
                    { id: "country", label: "Country" },
                    { id: "institution", label: "Institution" },
                    { id: "friends", label: "Friends" },
                  ]}
                  value={board}
                  onChange={(v) => setBoard(v as Board)}
                />
                <div className="mt-4 overflow-hidden rounded-[var(--radius-feature)] border border-[var(--border-subtle)]">
                  {LEADERBOARDS[board].map((r) => (
                    <div
                      key={r.rank}
                      className={
                        "flex items-center gap-4 border-b border-[var(--border-subtle)] px-5 py-3.5 last:border-b-0 " +
                        (r.you ? "bg-[color-mix(in_srgb,var(--accent-primary)_12%,var(--bg-surface))]" : "bg-[var(--bg-surface)]")
                      }
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-bold"
                        style={
                          r.rank <= 3
                            ? { background: "var(--accent-primary)", color: "#04120a" }
                            : { background: "var(--border-subtle)", color: "var(--text-secondary)" }
                        }
                      >
                        {r.rank}
                      </span>
                      <span className="flex-1 text-[15px] font-semibold">
                        {r.name}
                        {r.you && (
                          <span className="ml-2 rounded-[var(--radius-pill)] bg-[var(--accent-primary)] px-2 py-0.5 text-[11px] font-bold text-[#04120a]">
                            You
                          </span>
                        )}
                      </span>
                      <span className="tabular text-[14px] font-semibold text-[var(--text-secondary)]">
                        {r.xp.toLocaleString()} XP
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[13px] text-[var(--text-tertiary)]">
                  Rankings refresh daily · only opted-in learners appear.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
