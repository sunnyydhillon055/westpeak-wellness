import Link from 'next/link';
import { guides } from '@/lib/guides';
import { FIRST_HOLIDAYS_CLEARED } from '@/lib/guides-more3';
import { liveShelfLinks, type ShelfLink } from '@/lib/seasonal';

/* THE "THIS SEASON" SHELF — 15 Oct 2026 (item 538).
 *
 * A server component with no client JS: the links are chosen when the page
 * is built, from SEASONAL_SHELF in lib/seasonal.ts, and the pages are
 * rebuilt on each shelf boundary (GATE_DATES, rebuild-on-gate-dates.yml).
 *
 * It never links a page that is not live. A link that lands on a guide is
 * dropped while that guide is a draft (it is absent from `guides`, and its
 * URL 404s), and a link that needs a publishing flag is dropped while the
 * flag is off, so the grief guide's #the-first-holidays-after-a-loss anchor
 * is only linked once that section is on the page. Both are read, never
 * set, here: lib/guides-drafts.ts and lib/guides-more3.ts own them. */

const FLAGS: Record<NonNullable<ShelfLink['flag']>, boolean> = {
  FIRST_HOLIDAYS_CLEARED,
};

const PUBLISHED = new Set(guides.map((g) => g.slug));

/** `block` heads the /guides index; `cell` is one entry in the homepage's
 *  "Most people arrive with a situation" grid. Nothing renders out of season. */
export default function SeasonalShelf({ variant }: { variant: 'block' | 'cell' }) {
  const links = liveShelfLinks(PUBLISHED, FLAGS);
  if (!links.length) return null;
  if (variant === 'cell') {
    return (
      <div className="route-cell">
        <p className="route-k">It is this time of year</p>
        {links.map((l) => (
          <p key={l.href}><Link href={l.href}>{l.label}</Link></p>
        ))}
      </div>
    );
  }
  return (
    <div style={{ margin: '8px 0 28px' }}>
      <p className="eyebrow">This season</p>
      <div className="chip-grid" style={{ marginTop: 12 }}>
        {links.map((l) => (
          <Link className="chip" key={l.href} href={l.href}>{l.label}</Link>
        ))}
      </div>
    </div>
  );
}
