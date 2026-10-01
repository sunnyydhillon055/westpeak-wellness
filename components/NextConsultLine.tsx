import BookLink from '@/components/BookLink';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { consultationAvailability } from '@/lib/cliniko-availability';
import { nextConsultEntries } from '@/lib/next-consult';

/* THE NEXT FREE CONSULTATION, ON A PAGE ABOUT WAITING — 1 Oct 2026.
 *
 * /guides/waiting-for-therapy-in-bc ranks on page one (91 impressions at
 * 7.21) with no clicks, and its description promises "days for private"
 * without ever saying when. This says when: the first open free-consultation
 * day for each counsellor taking new clients, read from the same thirty-
 * minute Cliniko cache /api/availability and the profiles use.
 *
 * A SERVER component. It reads the roster and the cache on the server and
 * sends the browser two short lines; nothing here enters a client bundle
 * (the perf rule of 1 Oct 2026). It prints nothing at all when Cliniko could
 * not be read or nobody has a time this week. These are appointment times
 * Cliniko is offering, not opening hours. */
export default async function NextConsultLine({ location }: { location: string }) {
  let all;
  try {
    all = await consultationAvailability();
  } catch {
    return null;
  }
  const entries = nextConsultEntries(all, practitioners);
  if (!entries.length) return null;
  return (
    <p className="next-consult" style={{ margin: '4px 0 28px', fontSize: '.95rem' }}>
      <strong>Next free 30-minute consultation:</strong>{' '}
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
