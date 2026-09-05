/**
 * Lightweight SVG line chart of predicted-score trajectory with a dashed
 * target line. Direct data labels on the last point (no legend-only reliance).
 * Hand-rolled — no chart dependency.
 */
export type TrendPoint = { label: string; value: number };

export default function ProgressTrendChart({
  data,
  target,
  scale = "PTE",
  height = 200,
}: {
  data: TrendPoint[];
  target: number;
  scale?: "PTE" | "IELTS";
  height?: number;
}) {
  const width = 520;
  const padX = 28;
  const padY = 24;
  const max = scale === "PTE" ? 90 : 9;
  const min = scale === "PTE" ? Math.min(...data.map((d) => d.value), target) - 8 : 4;
  const range = max - min;

  const x = (i: number) =>
    padX + (i / (data.length - 1)) * (width - padX * 2);
  const y = (v: number) =>
    padY + (1 - (v - min) / range) * (height - padY * 2);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`).join(" ");
  const area =
    `M ${x(0)} ${height - padY} ` +
    data.map((d, i) => `L ${x(i)} ${y(d.value)}`).join(" ") +
    ` L ${x(data.length - 1)} ${height - padY} Z`;

  const last = data[data.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={`Predicted ${scale} trajectory, latest ${last.value}, target ${target}`}
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* target line (dashed) */}
      <line
        x1={padX}
        x2={width - padX}
        y1={y(target)}
        y2={y(target)}
        stroke="var(--text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
      <text
        x={width - padX}
        y={y(target) - 6}
        textAnchor="end"
        className="tabular"
        fontSize="12"
        fill="var(--text-tertiary)"
      >
        Target {target}
      </text>

      <path d={area} fill="url(#trendFill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {data.map((d, i) => (
        <g key={d.label}>
          <circle cx={x(i)} cy={y(d.value)} r={i === data.length - 1 ? 5 : 3} fill="var(--accent-primary)" />
          <text
            x={x(i)}
            y={height - 6}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-tertiary)"
          >
            {d.label}
          </text>
        </g>
      ))}

      {/* direct label on latest point */}
      <text
        x={x(data.length - 1)}
        y={y(last.value) - 12}
        textAnchor="end"
        className="tabular"
        fontSize="14"
        fontWeight="600"
        fill="var(--text-primary)"
      >
        {last.value}
      </text>
    </svg>
  );
}
