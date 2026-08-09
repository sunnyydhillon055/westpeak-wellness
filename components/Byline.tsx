import Link from 'next/link';
import { site } from '@/lib/site';

/* Visible authorship and review provenance.
 *
 * Competing practices signal expertise with named practitioner bios. This site
 * scopes the counsellor's personal name to /about by design, so the provenance
 * is carried by the credential and the review date instead — stated on the page
 * rather than only in structured data, because a reader deciding whether to
 * trust a health page should not have to open the source to find it. */
export default function Byline({
  updated,
  readMinutes,
}: {
  updated: string;
  readMinutes?: number;
}) {
  const reviewed = new Date(updated + 'T00:00:00Z').toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

  return (
    <aside className="byline">
      <p className="byline-line">
        Written and clinically reviewed by a{' '}
        <strong>{site.counsellor.title} ({site.counsellor.credentials})</strong> in independent
        practice in British Columbia.
      </p>
      <p className="byline-meta">
        Reviewed <time dateTime={updated}>{reviewed}</time>
        {readMinutes ? ` · ${readMinutes} min read` : ''} ·{' '}
        <Link href="/editorial-policy">How these pages are written</Link> ·{' '}
        <Link href="/standards">Scope and accountability</Link>
      </p>
      <p className="byline-meta">
        General information, not clinical advice, and not a diagnosis. Sources are listed at the
        foot of the page so you can check them.
      </p>
    </aside>
  );
}
