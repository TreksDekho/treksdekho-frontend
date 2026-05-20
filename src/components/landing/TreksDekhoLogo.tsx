// TreksDekho logo mark — Sahyadri double-peak mountain with ram flag
// Usage:
//   <TreksDekhoLogo />               — mark only (navbar)
//   <TreksDekhoLogo full />          — mark + wordmark + Marathi tagline (footer, splash)
//   <TreksDekhoLogo variant="light"/> — for light backgrounds

const SAFFRON  = '#D4691A';
const RAM_RED  = '#C02018';
const CREAM    = '#F5F0E8';

// 40×40 mark: double-peak mountain with flag pole and triangular ram flag
const MOUNTAIN_PATH =
  'M 0,36 L 9,20 L 15,25 L 20,12 L 25,25 L 31,20 L 40,36 Z';

interface Props {
  size?: number;
  full?: boolean;
  variant?: 'default' | 'light';
}

export default function TreksDekhoLogo({
  size = 36,
  full = false,
  variant = 'default',
}: Props) {
  const textPrimary = variant === 'light' ? '#1A2D1A' : CREAM;

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="TreksDekho"
      role="img"
    >
      {/* Mountain */}
      <path d={MOUNTAIN_PATH} fill={SAFFRON} />

      {/* Subtle highlight on main peak face */}
      <path d="M 20,12 L 15,25 L 19,22 Z" fill="#E07B2A" opacity="0.4" />

      {/* Flag pole */}
      <line x1="20" y1="12" x2="20" y2="3" stroke={CREAM} strokeWidth="1.2" strokeLinecap="round" />

      {/* Ram flag — triangular, fluttering right */}
      <path d="M 20,3 L 31,7 L 20,11 Z" fill={RAM_RED} />
    </svg>
  );

  if (!full) return mark;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-3">
        {mark}
        <span
          className="font-heading font-bold tracking-tight leading-none"
          style={{ color: textPrimary, fontSize: size * 0.6 }}
        >
          Treks<span style={{ color: SAFFRON }}>Dekho</span>
        </span>
      </div>
      <span
        className="font-medium tracking-[0.18em]"
        style={{
          color: SAFFRON,
          opacity: 0.65,
          fontSize: size * 0.25,
          paddingLeft: size + 12,
        }}
      >
        सह्याद्री देखो
      </span>
    </div>
  );
}
