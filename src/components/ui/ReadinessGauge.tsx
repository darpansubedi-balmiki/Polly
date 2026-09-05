/**
 * Semi-circular arc gauge showing exam readiness with a confidence %.
 * Value 0–100. The arc fill uses mint (achievement/progress signal).
 */
export default function ReadinessGauge({
  value,
  confidence,
  size = 200,
  caption = "Exam readiness",
}: {
  value: number;
  confidence: number;
  size?: number;
  caption?: string;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * r; // half circle
  const pct = Math.max(0, Math.min(100, value)) / 100;

  // semicircle path from left to right (top arc)
  const start = { x: cx - r, y: cy };
  const end = { x: cx + r, y: cy };
  const arc = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;

  return (
    <div
      className="inline-flex flex-col items-center"
      style={{ width: size }}
    >
      <svg width={size} height={size / 2 + stroke} className="overflow-visible">
        <path
          d={arc}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={arc}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{
            transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      <div className="-mt-10 flex flex-col items-center">
        <span
          className="tabular font-semibold leading-none"
          style={{
            fontSize: size * 0.2,
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {value}
          <span className="text-[var(--text-tertiary)]" style={{ fontSize: size * 0.09 }}>
            %
          </span>
        </span>
        <span className="mt-1 text-[13px] text-[var(--text-secondary)]">{caption}</span>
        <span className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
          {confidence}% confidence
        </span>
      </div>
    </div>
  );
}
