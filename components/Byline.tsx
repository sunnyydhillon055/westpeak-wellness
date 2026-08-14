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
  reviewed,
  readMinutes,
}: {
  /** When the text last changed. */
  updated: string;
  /** When a clinician last checked it for accuracy, where that happened
   *  separately from an edit. Optional — absent is the honest default. */
  reviewed?: string;
  readMinutes?: number;
}) {
  /* "Updated" and "Clinically reviewed" are different claims, and this
   * component used to manufacture the heavier one out of the lighter one's
   * data: it took `updated`, the date the prose last changed, and printed it
   * under the word "Reviewed".
   *
   * On a page about trauma or anxiety that distinction carries weight. A reader
   * takes "reviewed 8 August" to mean a clinician read it that day and stood
   * behind it — not that a sentence was rephrased. Every dated page on this
   * site was making the stronger claim from the weaker fact.
   *
   * Now the strong claim appears only where there is a real review date. The
   * date itself does not move; only the word does, which is the entire point.
   * Set `reviewed` on an item when the counsellor has actually re-read it. */
  const stamp = reviewed ?? updated;
  const label = reviewed ? 'Clinically reviewed' : 'Updated';
  const shown = new Date(stamp + 'T00:00:00Z').toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

  return (
    <aside className="byline">
      <p className="byline-line">
        Written by a{' '}
        <strong>{site.counsellor.title} ({site.counsellor.credentials})</strong> in independent
        practice in British Columbia.
      </p>
      <p className="byline-meta">
        {label} <time dateTime={stamp}>{shown}</time>
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
