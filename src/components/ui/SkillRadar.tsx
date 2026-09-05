/**
 * 4-axis radar (Speaking / Writing / Reading / Listening) comparing current vs
 * target. Direct data labels at each axis. Hand-rolled SVG (no dependency).
 */
export type RadarDatum = {
  axis: "Speaking" | "Writing" | "Reading" | "Listening";
  current: number;
  target: number;
};

export default function SkillRadar({
  data,
  max = 90,
  size = 260,
}: {
  data: RadarDatum[];
  max?: number;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 44;
  const n = data.length;
  // start at top, go clockwise
  const angle = (i: number) => -Math.PI / 2 + (i / n) * 2 * Math.PI;
  const point = (i: number, value: number) => {
    const rr = (value / max) * r;
    return {
      x: cx + rr * Math.cos(angle(i)),
      y: cy + rr * Math.sin(angle(i)),
    };
  };
  const poly = (key: "current" | "target") =>
    data.map((d, i) => {
      const p = point(i, d[key]);
      return `${p.x},${p.y}`;
    }).join(" ");

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Skill radar: current vs target across four skills">
      {rings.map((f) => (
        <circle
          key={f}
          cx={cx}
          cy={cy}
          r={r * f}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="1"
        />
      ))}
      {data.map((d, i) => {
        const p = point(i, max);
        return (
          <line
            key={d.axis}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--border-subtle)"
            strokeWidth="1"
          />
        );
      })}

      {/* target (outline) */}
      <polygon
        points={poly("target")}
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* current (filled mint) */}
      <polygon
        points={poly("current")}
        fill="color-mix(in srgb, var(--accent-primary) 22%, transparent)"
        stroke="var(--accent-primary)"
        strokeWidth="2"
      />
      {data.map((d, i) => {
        const p = point(i, max);
        const lx = cx + (p.x - cx) * 1.16;
        const ly = cy + (p.y - cy) * 1.16;
        return (
          <g key={d.axis}>
            <text
              x={lx}
              y={ly - 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="var(--text-primary)"
            >
              {d.axis}
            </text>
            <text
              x={lx}
              y={ly + 11}
              textAnchor="middle"
              fontSize="11"
              className="tabular"
              fill="var(--text-tertiary)"
            >
              {d.current}/{d.target}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
