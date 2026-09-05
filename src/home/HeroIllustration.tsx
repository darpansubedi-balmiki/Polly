/**
 * Original hero illustration for the Coach Mode homepage.
 *
 * A confident student seated with a tablet, mid-practice, while Polly perches
 * on a floating "score" card beside them. Flat geometric style, built entirely
 * from primitives — an original character, not traced from any reference.
 * Palette matches the product: navy / mint / warm-neutral + the beak amber.
 */
export default function HeroIllustration({ className }: { className?: string }) {
  const navy = "#0B132B";
  const navyMid = "#16203D";
  const mint = "#39FF88";
  const mintDeep = "#0E7A44";
  const cream = "#F7F5EF";
  const sand = "#EBE6D9";
  const skin = "#E8B98C";
  const skinShade = "#D9A578";
  const amber = "#FFB020";

  return (
    <svg
      viewBox="0 0 520 440"
      className={className}
      role="img"
      aria-label="A student practising for their English test while Polly the coach shows their score"
    >
      {/* ---- backdrop shapes ---- */}
      <circle cx="270" cy="200" r="185" fill={cream} />
      <path
        d="M110 300 Q120 150 270 140 Q430 150 440 300 Z"
        fill="none"
        stroke={mint}
        strokeWidth="2.5"
        strokeDasharray="6 10"
        opacity="0.6"
      />
      <circle cx="452" cy="96" r="10" fill={mint} />
      <circle cx="72" cy="150" r="6" fill={amber} />
      <rect x="70" y="330" width="14" height="14" rx="3" fill={navy} opacity="0.15" transform="rotate(18 77 337)" />

      {/* ---- ground ---- */}
      <ellipse cx="260" cy="392" rx="180" ry="18" fill={navy} opacity="0.08" />

      {/* ================= FLOATING SCORE CARD (Polly's perch) ================= */}
      <g transform="translate(300 70)">
        <rect x="0" y="0" width="180" height="120" rx="18" fill="#ffffff" stroke={navy} strokeWidth="2" />
        <rect x="0" y="0" width="180" height="120" rx="18" fill={navy} opacity="0.02" />
        {/* score ring */}
        <circle cx="46" cy="60" r="30" fill="none" stroke={sand} strokeWidth="8" />
        <circle
          cx="46"
          cy="60"
          r="30"
          fill="none"
          stroke={mint}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="150 188"
          transform="rotate(-90 46 60)"
        />
        <text x="46" y="60" textAnchor="middle" fontSize="20" fontWeight="700" fill={navy}>79</text>
        <text x="46" y="76" textAnchor="middle" fontSize="8" fontWeight="600" fill={mintDeep}>TARGET</text>
        {/* mini skill bars */}
        <g transform="translate(92 34)">
          {[
            { w: 66, c: mint },
            { w: 48, c: navy },
            { w: 56, c: amber },
          ].map((b, i) => (
            <g key={i} transform={`translate(0 ${i * 22})`}>
              <rect x="0" y="0" width="72" height="8" rx="4" fill={sand} />
              <rect x="0" y="0" width={b.w} height="8" rx="4" fill={b.c} />
            </g>
          ))}
        </g>
      </g>

      {/* ================= POLLY perched on the card corner ================= */}
      <g transform="translate(300 118)">
        {/* tail */}
        <path d="M16 44 L-4 60 L14 56 Z" fill={navyMid} />
        <path d="M20 48 L2 66 L22 60 Z" fill={mint} opacity="0.9" />
        {/* body */}
        <path d="M34 6 C54 6 62 22 62 40 C62 60 50 70 34 70 C18 70 8 60 8 40 C8 22 16 6 34 6 Z" fill={navy} />
        {/* belly */}
        <path d="M34 28 C44 28 49 36 49 46 C49 58 42 64 34 64 C26 64 20 58 20 46 C20 36 26 28 34 28 Z" fill={cream} />
        {/* wing */}
        <path d="M20 30 C14 40 15 54 24 60 C20 48 22 38 30 32 Z" fill={mint} />
        {/* head + face */}
        <circle cx="42" cy="20" r="15" fill={navy} />
        <circle cx="47" cy="18" r="5.5" fill={cream} />
        <circle cx="48" cy="18" r="2.6" fill={navy} />
        {/* beak */}
        <path d="M56 20 C64 20 66 26 60 30 C58 26 56 24 54 24 Z" fill={amber} />
        {/* little crest */}
        <path d="M38 6 C40 -2 46 -1 45 6 Z" fill={mint} />
      </g>

      {/* ================= STUDENT ================= */}
      <g transform="translate(120 150)">
        {/* chair / cushion */}
        <rect x="-14" y="150" width="150" height="70" rx="16" fill={navyMid} />
        <rect x="-14" y="150" width="150" height="18" rx="9" fill={navy} />

        {/* legs */}
        <path d="M30 200 C24 224 24 236 30 236 L52 236 C54 224 52 210 48 200 Z" fill={navy} />
        <path d="M70 202 C86 220 104 224 118 214 L112 200 C100 206 90 202 82 192 Z" fill={navyMid} />
        {/* shoes */}
        <rect x="22" y="232" width="34" height="12" rx="6" fill={amber} />
        <rect x="108" y="206" width="30" height="12" rx="6" fill={amber} transform="rotate(24 123 212)" />

        {/* torso — hoodie */}
        <path d="M20 96 C20 78 40 68 58 68 C76 68 96 78 96 96 L102 168 C80 180 36 180 14 168 Z" fill={mint} />
        {/* hoodie pocket + zip */}
        <path d="M40 150 L76 150 L72 168 L44 168 Z" fill={navy} opacity="0.12" />
        <line x1="58" y1="72" x2="58" y2="150" stroke={navy} strokeWidth="2.5" opacity="0.25" />

        {/* left arm holding tablet */}
        <path d="M22 104 C6 116 2 140 14 156 L30 148 C24 136 26 122 40 114 Z" fill={mintDeep} />
        {/* right arm */}
        <path d="M94 104 C110 112 116 130 108 148 L92 142 C98 130 94 120 82 114 Z" fill={mintDeep} />

        {/* tablet */}
        <g transform="translate(8 128) rotate(-8)">
          <rect x="0" y="0" width="86" height="60" rx="8" fill={navy} />
          <rect x="6" y="6" width="74" height="48" rx="4" fill="#ffffff" />
          <rect x="12" y="14" width="42" height="6" rx="3" fill={mint} />
          <rect x="12" y="26" width="60" height="4" rx="2" fill={sand} />
          <rect x="12" y="34" width="52" height="4" rx="2" fill={sand} />
          <circle cx="66" cy="40" r="7" fill={amber} />
        </g>

        {/* neck */}
        <rect x="46" y="54" width="22" height="22" rx="8" fill={skinShade} />
        {/* head */}
        <circle cx="57" cy="40" r="26" fill={skin} />
        {/* hair */}
        <path d="M31 38 C30 14 50 4 66 12 C84 14 86 34 82 44 C80 32 74 26 66 26 C58 22 44 22 38 32 C36 36 34 40 34 46 C32 44 31 42 31 38 Z" fill={navy} />
        <path d="M31 38 C30 20 44 10 57 12 L57 24 C46 24 38 30 36 44 Z" fill={navy} />
        {/* ear */}
        <circle cx="33" cy="44" r="5" fill={skinShade} />
        {/* face */}
        <circle cx="50" cy="40" r="2.6" fill={navy} />
        <circle cx="66" cy="40" r="2.6" fill={navy} />
        <path d="M52 50 C56 54 62 54 66 50" stroke={navy} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="46" cy="47" r="3" fill={amber} opacity="0.35" />
        <circle cx="70" cy="47" r="3" fill={amber} opacity="0.35" />
      </g>

      {/* little floating check + spark accents */}
      <g transform="translate(96 250)">
        <circle cx="0" cy="0" r="16" fill={mint} />
        <path d="M-7 0 L-2 6 L8 -6" stroke={navy} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M470 250 v14 M463 257 h14" stroke={mint} strokeWidth="3" strokeLinecap="round" />
      <path d="M56 96 v10 M51 101 h10" stroke={amber} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
