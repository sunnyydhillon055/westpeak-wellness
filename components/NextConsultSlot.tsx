'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import BookLink from '@/components/BookLink';
import { NEXT_CONSULT_LABEL } from '@/lib/next-consult';
import {
  slotState, firstWhen, openDays, loadAvailability, PACIFIC_LABEL,
  type ClientAvailability, type SlotPerson,
} from '@/lib/consult-slot';

/* THE CLINIKO LINES, FILLED IN ON THE CLIENT — 3 Oct 2026 (item 429).
 *
 * The page that carries one of these is now fully static, so it keeps the
 * inlined first-paint CSS (scripts/inline-css.mjs) in production. The server
 * decides who a line may name and passes plain strings (lib/consult-slot.ts
 * says why); this asks /api/availability once per page view and prints the
 * days. The box is laid out at its expected height before the answer
 * arrives (.consult-slot in app/premium.css, sized by --lm on a phone and
 * --ld wider), so filling it moves nothing under it.
 *
 * Never imports the roster or any large data module (the perf rule of
 * 1 Oct 2026): everything it needs comes in as props. */

function useAvailability(): ClientAvailability | null {
  const [all, setAll] = useState<ClientAvailability | null>(null);
  useEffect(() => {
    let live = true;
    loadAvailability().then((j) => { if (live) setAll(j); });
    return () => { live = false; };
  }, []);
  return all;
}

const lines = (m: number, d: number) => ({ '--lm': m, '--ld': d }) as CSSProperties;

/** "Next free 30-minute consultation (Pacific time): Camille, Thu 2 Oct from
 *  10 am book with Camille", or the ask-for-a-time sentence, or nothing. */
export function ConsultLine({
  people, location, askHref, style, lm, ld,
}: {
  people: SlotPerson[];
  location: string;
  askHref: string;
  style?: CSSProperties;
  lm: number;
  ld: number;
}) {
  const s = slotState(useAvailability(), people);
  return (
    <p className="next-consult consult-slot" style={{ ...lines(lm, ld), ...(style ?? { margin: '4px 0 28px', fontSize: '.95rem' }) }}>
      {s.kind === 'times' && (
        <>
          <strong>{NEXT_CONSULT_LABEL}</strong>{' '}
          {s.entries.map((e, i) => (
            <span key={e.slug}>
              {i > 0 ? ' · ' : ''}
              {e.first}, {e.when}{' '}
              <BookLink location={location} className="" href={e.href}>book with {e.first}</BookLink>
            </span>
          ))}
        </>
      )}
      {s.kind === 'none' && (
        <>
          {s.sentence}{' '}
          <BookLink location="next-consult-ask" className="" href={askHref}>
            {s.people.length === 1 ? `Ask ${s.people[0]!.first} for a time` : 'Ask for a time'}
          </BookLink>
        </>
      )}
    </p>
  );
}

/** "Next free call: Sat 3 Oct with Camille · Tue 6 Oct with Savneet (Pacific
 *  time)", each day a link to that counsellor's calendar. A day, never an
 *  hour. `fallback` stands until the days arrive, and stays when there are
 *  none. Renders inline; the caller's paragraph carries .consult-slot. */
export function ConsultDays({ people, location, fallback = null }: { people: SlotPerson[]; location: string; fallback?: ReactNode }) {
  const s = slotState(useAvailability(), people);
  if (s.kind !== 'times') return <>{fallback}</>;
  return (
    <>
      Next free call:{' '}
      {s.entries.map((e, i) => (
        <span key={e.slug}>
          {i > 0 ? ' · ' : ''}
          <BookLink location={location} className="" href={e.href}>{e.day} with {e.first}</BookLink>
        </span>
      ))}
      {PACIFIC_LABEL}
    </>
  );
}

/** One counsellor's first open time, for a roster row or a table cell:
 *  `render(when)` with the time, or `fallback` while unknown or none. */
export function FirstOpen({ slug, prefix, fallback = null, suffix = null }: { slug: string; prefix?: ReactNode; fallback?: ReactNode; suffix?: ReactNode }) {
  const when = firstWhen(useAvailability(), slug);
  if (!when) return <>{fallback}</>;
  return <>{prefix}{when}{PACIFIC_LABEL}{suffix}</>;
}

/** Every open day listed for one counsellor, for her profile's hero. */
export function OpenDays({ slug, first }: { slug: string; first: string }) {
  const days = openDays(useAvailability(), slug);
  if (!days.length) return null;
  return <><strong>Next open with {first}:</strong> {days.join(' · ')}{PACIFIC_LABEL}</>;
}
