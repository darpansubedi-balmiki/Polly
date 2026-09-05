/**
 * Monochrome inline icon set — 1.5px stroke, rounded joins, currentColor.
 * Hand-rolled (no icon dependency). 24px default box; size via `size` prop.
 */
type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function base(strokeWidth = 1.5) {
  return {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function Svg({
  size = 24,
  className,
  strokeWidth,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...base(strokeWidth)}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);
export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);
export const CheckCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);
export const X = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);
export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);
export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
export const Lock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);
export const Mic = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </Svg>
);
export const Play = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 5v14l11-7z" />
  </Svg>
);
export const Pause = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 5v14M16 5v14" />
  </Svg>
);
export const Flame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1 0-2-.5-3 2 1.5 3.5 4 3.5 6.5a5 5 0 1 1-10 0C7 9 12 7.5 12 3Z" />
  </Svg>
);
export const Trophy = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 15h6M10 20h4M12 15v5" />
  </Svg>
);
export const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    <path d="M12 9a3 3 0 0 0 3 3 3 3 0 0 0-3 3 3 3 0 0 0-3-3 3 3 0 0 0 3-3Z" />
  </Svg>
);
export const AlertTriangle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4 2.5 20h19L12 4Z" />
    <path d="M12 10v4M12 17.5h.01" />
  </Svg>
);
export const Info = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
);
export const Target = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.5" />
  </Svg>
);
export const TrendingUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 17 10 10l4 4 7-7" />
    <path d="M15 7h6v6" />
  </Svg>
);
export const Volume = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="M16 9a3 3 0 0 1 0 6M18.5 7a6 6 0 0 1 0 10" />
  </Svg>
);
export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const BookOpen = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19M12 6c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5M12 6v13" />
  </Svg>
);
export const Pencil = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4L18.5 9.5a2 2 0 0 0-3-3L4 18v2Z" />
    <path d="M14 7l3 3" />
  </Svg>
);
export const Headphones = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <rect x="3" y="13" width="4" height="7" rx="1.5" />
    <rect x="17" y="13" width="4" height="7" rx="1.5" />
  </Svg>
);
export const MessageSquare = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1Z" />
  </Svg>
);
