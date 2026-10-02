import BookLink from '@/components/BookLink';
import { site } from '@/lib/site';
import { readCatalog } from '@/lib/cliniko-catalog';
import type { Practitioner } from '@/lib/practitioners';
import { firstSessionNote, firstSessionOffers, type FirstSessionOffer } from '@/lib/first-session';

/* The secondary "start with a first session" row (lib/first-session.ts).
 * A server component taking plain strings, so nothing from the roster or the
 * catalogue reaches the browser; the link is a BookLink at location
 * 'first-session', so the click is counted and the button is what booked_via
 * credits. Renders nothing when there is no offer, which is every page while
 * site.directFirstSession is false. */
export default function FirstSessionRow({
  first, offers, note,
}: { first: string; offers: FirstSessionOffer[]; note: string }) {
  if (!offers.length) return null;
  return (
    <div style={{ marginTop: 10, fontSize: '.92rem', lineHeight: 1.5 }}>
      <p style={{ margin: 0 }}>
        <strong>Already sure? Start with a first session with {first}:</strong>{' '}
        {offers.map((o, i) => (
          <span key={o.href}>
            {i ? ' · ' : ''}
            <BookLink location="first-session" className="" href={o.href}>
              {o.label}, {o.fee} for {o.minutes} minutes
            </BookLink>
          </span>
        ))}
      </p>
      <p style={{ margin: '2px 0 0', color: 'var(--ink-soft)' }}>{note}</p>
    </div>
  );
}

/** One row per counsellor, for /book under the cards. Returns before reading
 *  the catalogue while the flag is off. */
export async function FirstSessionRows({ people }: { people: Practitioner[] }) {
  if (!site.directFirstSession) return null;
  const catalog = await readCatalog();
  const note = firstSessionNote(catalog);
  return (
    <>
      {people.map((p) => (
        <FirstSessionRow key={p.slug} first={p.name.split(' ')[0]!} offers={firstSessionOffers(p, catalog)} note={note} />
      ))}
    </>
  );
}
