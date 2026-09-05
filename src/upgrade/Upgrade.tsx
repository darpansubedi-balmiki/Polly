import { useState } from "react";
import Button from "../components/ui/Button";
import { Polly } from "../components/polly/PollyBubble";
import { Check, X, Sparkle, Info, ArrowRight, CheckCircle } from "../components/icons";

type Cycle = "monthly" | "quarterly" | "annual";
const CYCLE: Record<Cycle, { price: number; per: string; note?: string; save?: string }> = {
  monthly: { price: 799, per: "/ month" },
  quarterly: { price: 2097, per: "/ 3 months", note: "₹699 / mo", save: "Save 12%" },
  annual: { price: 6588, per: "/ year", note: "₹549 / mo", save: "Best value · Save 31%" },
};

const COMPARISON: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "Full mock sections", free: "3 total", pro: "Unlimited" },
  { label: "AI score with feedback", free: "Basic", pro: "Full Score → Why → Fix" },
  { label: "AI Speaking Replay", free: false, pro: true },
  { label: "AI Essay Rewriter", free: false, pro: true },
  { label: "Smart Error Library", free: "Preview only", pro: true },
  { label: "Readiness Predictor", free: false, pro: true },
  { label: "Daily study plan", free: "1 focus area", pro: "Full adaptive plan" },
  { label: "Streaks & XP", free: true, pro: true },
];

type Channel = { id: string; name: string; kind: "local" | "global"; hint: string };
const CHANNELS: Channel[] = [
  { id: "esewa", name: "eSewa", kind: "local", hint: "Wallet" },
  { id: "khalti", name: "Khalti", kind: "local", hint: "Wallet" },
  { id: "connectips", name: "ConnectIPS", kind: "local", hint: "Bank transfer" },
  { id: "fonepay", name: "Fonepay", kind: "local", hint: "QR / bank" },
  { id: "stripe", name: "Card (Stripe)", kind: "global", hint: "Visa · Mastercard" },
  { id: "paypal", name: "PayPal", kind: "global", hint: "Global wallet" },
];

export default function Upgrade({ onCheckout }: { onCheckout?: (cycle: Cycle, channel: string) => void }) {
  const [cycle, setCycle] = useState<Cycle>("annual");
  const [channel, setChannel] = useState<string>("khalti");
  const c = CYCLE[cycle];

  return (
    <div className="mode-coach min-h-screen bg-[var(--bg-canvas)] px-6 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Polly state="explaining" size={56} />
          </div>
          <h1 className="mt-3 text-[32px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Unlock the full path to your target
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[16px] text-[var(--text-secondary)]">
            Free gets you started. Pro gives you unlimited practice and the full feedback that
            actually moves your score.
          </p>
        </div>

        {/* billing cycle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
            {(Object.keys(CYCLE) as Cycle[]).map((k) => (
              <button
                key={k}
                onClick={() => setCycle(k)}
                aria-pressed={cycle === k}
                className={
                  "focus-ring relative rounded-[var(--radius-pill)] px-5 py-2 text-[14px] font-semibold capitalize transition-colors " +
                  (cycle === k ? "bg-[var(--accent-primary)] text-[#04120a]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
                }
              >
                {k}
                {k === "annual" && cycle !== "annual" && (
                  <span className="ml-1.5 rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_20%,transparent)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent-on-light)]">
                    -31%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* two plans */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7">
            <h2 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>Free</h2>
            <div className="mt-2 text-[34px] font-bold" style={{ fontFamily: "var(--font-display)" }}>₹0</div>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Everything you need to try Polly.</p>
            <div className="mt-5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--text-secondary)]">
                <Info size={15} /> Honest free-tier limits
              </div>
              <ul className="mt-2 space-y-1 text-[13px] text-[var(--text-tertiary)]">
                <li>· 3 full mock sections, then locked</li>
                <li>· Feedback shows score, not the full breakdown</li>
                <li>· Error Library is preview-only</li>
              </ul>
            </div>
            <Button variant="secondary" block className="mt-5">Your current plan</Button>
          </div>

          {/* Pro */}
          <div className="relative rounded-[var(--radius-feature)] border-2 border-[var(--accent-primary)] bg-[var(--bg-surface-raised)] p-7 shadow-[var(--shadow-raised)]">
            <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--accent-primary)] px-3 py-1 text-[12px] font-bold text-[#04120a]">
              <Sparkle size={13} /> Polly Pro
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[34px] font-bold" style={{ fontFamily: "var(--font-display)" }}>₹{c.price.toLocaleString()}</span>
              <span className="text-[14px] text-[var(--text-tertiary)]">{c.per}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              {c.note && <span className="text-[13px] text-[var(--text-secondary)]">{c.note}</span>}
              {c.save && (
                <span className="rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--accent-primary)_18%,transparent)] px-2 py-0.5 text-[12px] font-bold text-[var(--accent-on-light)]">
                  {c.save}
                </span>
              )}
            </div>
            <ul className="mt-5 space-y-2">
              {["Unlimited mocks & tasks", "Full feedback + AI Replay & Rewriter", "Readiness Predictor & adaptive plan", "7-day free trial, cancel anytime"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px]">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--accent-on-light)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* comparison table */}
        <section className="mt-10">
          <h2 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>Compare in detail</h2>
          <div className="mt-4 overflow-hidden rounded-[var(--radius-feature)] border border-[var(--border-subtle)]">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-[var(--bg-surface)] text-[13px]">
                  <th className="px-5 py-3 font-bold">Feature</th>
                  <th className="px-5 py-3 text-center font-bold">Free</th>
                  <th className="px-5 py-3 text-center font-bold text-[var(--accent-on-light)]">Pro</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? "bg-[var(--bg-surface)]" : "bg-[var(--bg-surface-raised)]"}>
                    <td className="px-5 py-3 font-medium">{row.label}</td>
                    <td className="px-5 py-3 text-center">{renderCell(row.free)}</td>
                    <td className="px-5 py-3 text-center">{renderCell(row.pro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* payment method — first-class step */}
        <section className="mt-10 rounded-[var(--radius-feature)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-[var(--accent-primary)] text-[14px] font-bold text-[#04120a]">1</span>
            <h2 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>Choose how you'd like to pay</h2>
          </div>

          <div className="mt-5">
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Pay in Nepal</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CHANNELS.filter((ch) => ch.kind === "local").map((ch) => (
                <ChannelCard key={ch.id} ch={ch} active={channel === ch.id} onSelect={() => setChannel(ch.id)} />
              ))}
            </div>
            <div className="mt-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Pay internationally</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {CHANNELS.filter((ch) => ch.kind === "global").map((ch) => (
                <ChannelCard key={ch.id} ch={ch} active={channel === ch.id} onSelect={() => setChannel(ch.id)} />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-5">
            <div className="text-[14px] text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--text-primary)]">Polly Pro · {cycle}</span> — ₹{c.price.toLocaleString()} {c.per}
              <span className="ml-2 text-[var(--text-tertiary)]">via {CHANNELS.find((x) => x.id === channel)?.name}</span>
            </div>
            <Button size="l" trailingIcon={<ArrowRight size={18} />} onClick={() => onCheckout?.(cycle, channel)}>
              Start 7-day free trial
            </Button>
          </div>
          <p className="mt-3 text-[13px] text-[var(--text-tertiary)]">
            You won't be charged until the trial ends. Cancel any time from Settings — no questions asked.
          </p>
        </section>
      </div>
    </div>
  );
}

function renderCell(v: string | boolean) {
  if (v === true) return <Check size={18} className="mx-auto text-[var(--accent-on-light)]" />;
  if (v === false) return <X size={16} className="mx-auto text-[var(--text-tertiary)]" />;
  return <span className="text-[13px] text-[var(--text-secondary)]">{v}</span>;
}

function ChannelCard({ ch, active, onSelect }: { ch: Channel; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={
        "focus-ring flex items-center justify-between gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-colors " +
        (active
          ? "border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_10%,var(--bg-surface-raised))]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] hover:border-[var(--border-strong)]")
      }
    >
      <span>
        <span className="block text-[15px] font-semibold">{ch.name}</span>
        <span className="block text-[12px] text-[var(--text-tertiary)]">{ch.hint}</span>
      </span>
      <span
        className="grid size-5 shrink-0 place-items-center rounded-full border-2"
        style={active ? { background: "var(--accent-primary)", borderColor: "var(--accent-primary)" } : { borderColor: "var(--border-strong)" }}
      >
        {active && <span className="size-2 rounded-full bg-[#04120a]" />}
      </span>
    </button>
  );
}
