/* Section dividers built from the ridgeline motif, so section changes read as
 * a landscape shifting rather than as two coloured boxes meeting at a hard
 * edge. `from` is the colour of the section above, `to` the section below —
 * the divider paints `to` and lets `from` show through, so it always sits
 * flush regardless of which surfaces it separates. */

type DividerProps = {
  variant?: 'ridge' | 'wave' | 'slope';
  from?: string;
  to?: string;
  flip?: boolean;
  className?: string;
};

const PATHS: Record<string, string> = {
  ridge:
    'M0 96C118 96 176 30 268 30s126 44 210 44 132-64 236-64 156 52 250 52 148-22 236-22V120H0V96Z',
  wave:
    'M0 60c150 0 220 44 380 44s250-52 420-52 250 40 400 40V120H0V60Z',
  slope: 'M0 120V44C260 84 520 12 800 20s280 52 400 68v32H0Z',
};

export default function SectionDivider({
  variant = 'ridge',
  from = 'transparent',
  to = 'var(--surface-1)',
  flip = false,
  className,
}: DividerProps) {
  return (
    <div
      className={`divider${className ? ` ${className}` : ''}`}
      style={{ background: from, transform: flip ? 'rotate(180deg)' : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: 'clamp(38px, 5vw, 76px)' }}>
        <path d={PATHS[variant]} fill={to} />
      </svg>
    </div>
  );
}
