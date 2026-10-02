import { unstable_cache } from 'next/cache';
import { api, headers } from './cliniko.ts';
import { CLINIKO_BUSINESS, CONSULT_TYPE } from './site.ts';
import { practitioners } from './practitioners.ts';
import {
  empty, summariseWindows, firstReadError, freshAvailability,
  type Availability, type StoredAvailability,
} from './availability-summary.ts';

export {
  type Availability, WINDOW_DAYS, summarise, summariseWindows,
  availabilityLine, nextFreeCallLine, nextFreeCallEntries, firstOpenDay,
} from './availability-summary.ts';

/* WHAT IS ACTUALLY OPEN — read from Cliniko, 14 Sep 2026; two weeks since 1 Oct.
 *
 * The site publishes no hours by decision: they depend on which counsellor a
 * person sees and only Cliniko knows what is open. That left every page
 * silent about the one thing a prospective client wants to know before
 * they bother — can I be seen soon? This module answers it with the truth:
 * the free-consultation slots Cliniko will actually offer in the next fourteen
 * days, per counsellor, summarised as a count, the days, and the span of
 * hours. Nothing here is typed by a person, so it cannot go stale.
 *
 * TWO WEEKS, NOT ONE — 1 Oct 2026. Cliniko caps a request at seven days,
 * and one request was all this made, so on 1 Oct /book said "This week: Tue,
 * Sat" while Cliniko held openings on 8, 9, 10, 13, 15, 16 and 17 Oct that
 * no page mentioned. Two requests now, days 1-7 and 8-14, under one timeout
 * and one cache entry. `week` keeps the first seven days on their own for
 * the home hero, which says "Open this week".
 *
 * Cached for thirty minutes. A miss (no key, API down) is never cached: the
 * last good read stays for up to six hours, and with none the pages say
 * nothing rather than something wrong. Times are converted to
 * Pacific for display; Cliniko returns UTC. */

async function fetchOne(slug: string, practitionerId: string): Promise<Availability> {
  const a = api();
  if (!a) return empty(slug, 'no Cliniko key');
  const today = new Date();
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const plus = (n: number) => new Date(today.getTime() + n * 86_400_000);
  const base =
    `https://api.${a.shard}.cliniko.com/v1/businesses/${CLINIKO_BUSINESS}/practitioners/${practitionerId}` +
    `/appointment_types/${CONSULT_TYPE}/available_times`;
  /* Seven days inclusive per request; Cliniko caps the window at a week. */
  const windows = [[0, 6], [7, 13]] as const;
  try {
    /* No cache option on the fetch: unstable_cache around this function owns
       the freshness, and a no-store fetch inside it is refused by Next 14.

       A timeout, since 1 Oct 2026: /book streams the lines built from this
       behind a Suspense boundary, so a Cliniko that accepts the connection
       and never answers would hold the response open rather than merely
       delaying the page. Eight seconds is longer than any answer seen from
       the endpoint; past it the entry carries an error and the page prints
       nothing, which is the honest version. One signal covers both
       requests, which run side by side, so two weeks costs no more time. */
    const signal = AbortSignal.timeout(8_000);
    const results = await Promise.all(windows.map(async ([f, t]) => {
      const res = await fetch(`${base}?from=${day(plus(f))}&to=${day(plus(t))}`, { headers: headers(a.key), signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
      const body = (await res.json()) as { available_times?: { appointment_start: string }[] };
      return (body.available_times ?? []).map((x) => x.appointment_start).filter(Boolean);
    }));
    return summariseWindows(slug, results[0]!, results[1]!);
  } catch (e) {
    return empty(slug, e instanceof Error ? e.message : 'request failed');
  }
}

/** Availability for every counsellor who is bookable online, uncached; an `error` on an entry says why it is empty. */
export async function consultationAvailabilityNow(): Promise<Record<string, Availability>> {
  const out: Record<string, Availability> = {};
  for (const p of practitioners) {
    if (!p.bookable || !p.clinikoPractitionerId || !p.acceptingNewClients) continue;
    out[p.slug] = await fetchOne(p.slug, p.clinikoPractitionerId);
  }
  return out;
}

/* The cached read. It THROWS when any accepting counsellor could not be
   read, so a failure is never stored: on a warm cache Next keeps the last
   good value and logs the error (unstable_cache's stale branch), and on a
   cold one the throw reaches consultationAvailability below. 2 Oct 2026. */
const cachedRead = unstable_cache(
  async (): Promise<StoredAvailability> => {
    const all = await consultationAvailabilityNow();
    const err = firstReadError(all);
    if (err) throw new Error(`Cliniko availability: ${err}`);
    return { readAt: Date.now(), all };
  },
  /* v2: the shape gained `next` on 17 Sep 2026; a cached v1 object would
     have no such field. v3: fourteen days and `week`, 1 Oct 2026.
     v4: stored as { readAt, all }, 2 Oct 2026. */
  ['consultation-availability-v4'],
  { revalidate: 1800 },
);

/** The same, cached thirty minutes, for the public pages. Never throws: a
 *  cold-cache failure, or a last good read older than six hours, is {} and
 *  every line built from it prints nothing, so /book and /api/availability
 *  never reach the error boundary. /admin keeps calling
 *  consultationAvailabilityNow() and so still shows the live error. */
export async function consultationAvailability(): Promise<Record<string, Availability>> {
  try {
    return freshAvailability(await cachedRead());
  } catch {
    return {};
  }
}
