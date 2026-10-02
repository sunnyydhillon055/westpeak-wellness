import Link from 'next/link';
import type { RegionLink } from '@/lib/region-links';

/* The language pages by place, as one row of chips — 2 Oct 2026.
 *
 * Shared by /services/punjabi-counselling, /services/tagalog-counselling and
 * the two Filipino /for pages, so the row cannot be drawn three ways. The
 * list and its labels come from lib/region-links.ts, on the server; this
 * receives strings only and must not import the region data itself. */
export default function RegionLinks({
  heading,
  links,
  style,
}: {
  heading: string;
  links: RegionLink[];
  style?: React.CSSProperties;
}) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={heading} style={style}>
      <p className="eyebrow">{heading}</p>
      <div className="chip-grid">
        {links.map((l) => (
          <Link className="chip" key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
