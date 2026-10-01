import BookLink from '@/components/BookLink';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { consultationAvailability } from '@/lib/cliniko-availability';
import { nextConsultEntries, NEXT_CONSULT_LABEL } from '@/lib/next-consult';

/* THE NEXT FREE CONSULTATION, ON A PAGE ABOUT WAITING — 1 Oct 2026.
 *
 * /guides/waiting-for-therapy-in-bc ranks on page one (91 impressions at
 * 7.21) with no clicks, and its description promises "days for private"
 * without ever saying when. This says when: the first open free-consultation
 * day for each counsellor taking new clients, read from the same thirty-
 * minute Cliniko cache /api/availability and the profiles use.
 *
 * Since the same day it also sits on the sick-days guide, the verify and
 * coverage resources, the Punjabi words resource, every city hub and every
 * city x service page, and on /one-pager-sent. `slugs` and `language`
 * narrow who it names (lib/next-consult.ts): a couples page offers only the
 * counsellor who does couples work, the Punjabi page only the counsellor who
 * works in Punjabi. Each placement passes its own `location`, on
 * BOOK_LOCATIONS, so which of them earns a booking is countable.
 *
 * A SERVER component. It reads the roster and the cache on the server and
 * sends the browser two short lines; nothing here enters a client bundle
 * (the perf rule of 1 Oct 2026). It prints nothing at all when Cliniko could
 * not be read or nobody has a time this week. These are appointment times
 * Cliniko is offering, not opening hours, and they are Pacific time. */
export default async function NextConsultLine({
  location,
  slugs,
  language,
  style,
}: {
  location: string;
  /** Only these counsellors, e.g. those who offer the page's service. */
  slugs?: readonly string[];
  /** Only counsellors who work in this roster language tag ('pa', 'tl'). */
  language?: string;
  style?: React.CSSProperties;
}) {
  let all;
  try {
    all = await consultationAvailability();
  } catch {
    return null;
  }
  const entries = nextConsultEntries(all, practitioners, { slugs, language });
  if (!entries.length) return null;
  return (
    <p className="next-consult" style={style ?? { margin: '4px 0 28px', fontSize: '.95rem' }}>
      <strong>{NEXT_CONSULT_LABEL}</strong>{' '}
      {entries.map((e, i) => (
        <span key={e.slug}>
          {i > 0 ? ' · ' : ''}
          {e.first}, {e.when}{' '}
          <BookLink location={location} className="" href={`${site.bookingPath}?with=${e.slug}`}>
            book with {e.first}
          </BookLink>
        </span>
      ))}
    </p>
  );
}
