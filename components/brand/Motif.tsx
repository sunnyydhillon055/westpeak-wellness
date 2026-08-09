/* ============================================================================
   SIGNATURE MOTIF — "soft ridgeline"
   ----------------------------------------------------------------------------
   The name is Westpeak, so the obvious move is a mountain. The obvious mountain
   is a sharp triangle, which reads alpine and effortful — the opposite of what
   a counselling practice should feel like. So this is a peak drawn as three
   overlapping ridgelines with rounded shoulders and a low sun: recognisably a
   summit, but soft, layered and quiet.

   Layering is doing double duty. It is the visual idiom of distance and calm,
   and it is also the site's own argument — that difficulty has depth, and that
   you work through it in stages rather than over it in one push.

   Every fill resolves to a token, and every variant is decorative, so all of
   these are aria-hidden. Nothing here carries meaning a screen reader needs.
   ========================================================================= */

type MotifProps = {
  variant?: 'ridge' | 'mark' | 'bloom' | 'arc';
  className?: string;
  style?: React.CSSProperties;
};

export default function Motif({ variant = 'ridge', className, style }: MotifProps) {
  if (variant === 'mark') {
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="34" cy="15" r="4.6" fill="var(--clay)" opacity="0.85" />
        <path
          d="M4 38c6.5 0 8.4-8.2 13.4-8.2S25 38 25 38H4Z"
          fill="var(--blue)"
          opacity="0.45"
        />
        <path
          d="M9 38c8.2 0 10.6-19 17-19s9.6 19 17.6 19H9Z"
          fill="var(--blue-deep)"
        />
      </svg>
    );
  }

  if (variant === 'bloom') {
    /* Organic contour for empty space and behind portraits. */
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M212 22c62 8 128 44 148 106 20 62-6 140-56 182-50 42-124 48-180 22C68 306 26 250 20 186 14 122 44 50 106 28c36-13 74-11 106-6Z"
          fill="var(--blue-mist)"
        />
        <path
          d="M226 66c46 12 92 48 100 98 8 50-22 108-64 138-42 30-96 32-138 10-42-22-72-68-72-118 0-50 30-102 76-122 34-15 66-16 98-6Z"
          fill="var(--clay-soft)"
          opacity="0.55"
        />
      </svg>
    );
  }

  if (variant === 'arc') {
    /* A single sweeping ridge, used as a quiet accent under headings. */
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 220 26"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2 22C34 22 46 4 74 4s38 18 66 18 32-14 56-14 22 14 22 14"
          stroke="var(--clay)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    );
  }

  /* ridge — the full composition, used behind heroes at low opacity */
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 1200 520"
      fill="none"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="wp-ridge-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--blue-mist)" />
          <stop offset="100%" stopColor="var(--blue-ghost)" />
        </linearGradient>
        <linearGradient id="wp-ridge-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--clay)" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="wp-ridge-near" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--blue-deep)" stopOpacity="0.42" />
          <stop offset="100%" stopColor="var(--blue)" stopOpacity="0.26" />
        </linearGradient>
      </defs>

      {/* low sun — the one warm element */}
      <circle cx="905" cy="150" r="58" fill="var(--clay)" opacity="0.16" />
      <circle cx="905" cy="150" r="30" fill="var(--clay)" opacity="0.22" />

      {/* far ridge */}
      <path
        d="M0 372c118 0 176-92 268-92s126 66 210 66 132-104 236-104 156 84 250 84 148-40 236-40v234H0V372Z"
        fill="url(#wp-ridge-far)"
      />
      {/* middle ridge */}
      <path
        d="M0 430c136 0 190-74 286-74s136 54 224 54 140-86 246-86 152 66 252 66 116-24 192-24v154H0V430Z"
        fill="url(#wp-ridge-mid)"
      />
      {/* near ridge */}
      <path
        d="M0 474c150 0 202-54 300-54s142 40 232 40 146-62 254-62 160 48 264 48 90-14 150-14v88H0v-46Z"
        fill="url(#wp-ridge-near)"
      />
    </svg>
  );
}
