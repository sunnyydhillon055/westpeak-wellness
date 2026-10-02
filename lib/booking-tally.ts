import { put, get, BlobPreconditionFailedError } from '@vercel/blob';
import { strongEtag } from '@/lib/blob-etag';

/* ============================================================================
   THE MONTHLY BOOKING TALLY — 1 Oct 2026
   ----------------------------------------------------------------------------
   portal/notified.json holds appointment ids and nothing else, so "which
   counsellor did September's bookings go to, and how many consultations
   became paid sessions" had no answer. lib/booking-notify.ts already works
   out the counsellor and consult-or-paid for every appointment it reads, and
   then threw both away.

   This keeps COUNTS, nothing else: per Vancouver month, per counsellor slug
   ('unknown' when the roster does not know the practitioner), seven integers.
   No names, no appointment ids, no patient ids are stored in the tally. The
   ids that make it idempotent live in the existing ledger (portal/notified.json,
   the `tallied` list), as event keys like "b:<appointment id>", so an
   appointment is counted once per kind however often the cron reads it.

   Shape, fixed because another part of the site displays it:

     analytics/booking-tally.json
     { months: { 'YYYY-MM': { [slug | 'unknown']: {
         consultBooked, paidBooked, consultCancelled, paidCancelled,
         consultHeld, paidHeld, dna, consultConverted } } },
       updatedAt }

   WHICH MONTH. Booked counts in the month it was booked (created_at),
   cancelled in the month it was cancelled, held and missed in the month the
   appointment was for. All in America/Vancouver.

   HELD means: not cancelled, not marked did-not-arrive, and ended more than
   a day ago. The day's grace is so that a no-show marked the same evening is
   counted once, as a no-show, rather than as held and then missed.

   COVERAGE. The cron reads appointments from 16 days back to 120 ahead, so
   the first run after this shipped counted what was inside that window and
   nothing before it. Months before October 2026 are partial.
   ========================================================================= */

export const TALLY_KEY = 'analytics/booking-tally.json';
const TZ = 'America/Vancouver';

export type TallyCounts = {
  consultBooked: number;
  paidBooked: number;
  consultCancelled: number;
  paidCancelled: number;
  consultHeld: number;
  paidHeld: number;
  dna: number;
  /** A held consultation whose patient then has a paid session booked:
   *  a new paying client. Credited to the consultation's counsellor, in the
   *  month the booking job first saw it. From 1 Oct 2026; see
   *  convertedConsults in lib/booking-followups.ts. */
  consultConverted: number;
};

export type BookingTally = {
  months: Record<string, Record<string, TallyCounts>>;
  updatedAt: string;
};

export type TallyEvent = { key: string; month: string; slug: string; field: keyof TallyCounts };

export const emptyCounts = (): TallyCounts => ({
  consultBooked: 0, paidBooked: 0, consultCancelled: 0, paidCancelled: 0, consultHeld: 0, paidHeld: 0, dna: 0, consultConverted: 0,
});

/** 'YYYY-MM' in Vancouver, or null for a missing or unreadable time. */
export function vancouverMonth(iso?: string | null): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' }).formatToParts(new Date(t));
  const y = parts.find((x) => x.type === 'year')?.value;
  const m = parts.find((x) => x.type === 'month')?.value;
  return y && m ? `${y}-${m}` : null;
}

type ApptForTally = {
  id: string | number;
  starts_at?: string;
  ends_at?: string | null;
  created_at?: string | null;
  cancelled_at?: string | null;
  archived_at?: string | null;
  did_not_arrive?: boolean | null;
};

/** Every countable event in a list of appointments. Pure: the caller
 *  removes the keys already counted and decides consult and counsellor. */
export function tallyEvents<A extends ApptForTally>(
  appts: A[],
  opts: { now: number; isConsult: (ap: A) => boolean; slugFor: (ap: A) => string | undefined; heldAfterMs?: number },
): TallyEvent[] {
  const heldAfter = opts.heldAfterMs ?? 24 * 3.6e6;
  const out: TallyEvent[] = [];
  for (const ap of appts) {
    /* Archived in Cliniko is deleted for practical purposes. Not counted. */
    if (ap.archived_at) continue;
    const id = String(ap.id);
    const consult = opts.isConsult(ap);
    const slug = opts.slugFor(ap) || 'unknown';

    const booked = vancouverMonth(ap.created_at ?? ap.starts_at);
    if (booked) out.push({ key: `b:${id}`, month: booked, slug, field: consult ? 'consultBooked' : 'paidBooked' });

    if (ap.cancelled_at) {
      const m = vancouverMonth(ap.cancelled_at);
      if (m) out.push({ key: `c:${id}`, month: m, slug, field: consult ? 'consultCancelled' : 'paidCancelled' });
      continue;
    }

    const month = vancouverMonth(ap.starts_at);
    if (!month) continue;
    if (ap.did_not_arrive) {
      out.push({ key: `d:${id}`, month, slug, field: 'dna' });
      continue;
    }
    const end = ap.ends_at ? Date.parse(ap.ends_at) : Date.parse(ap.starts_at as string);
    if (Number.isFinite(end) && opts.now - end > heldAfter) {
      out.push({ key: `h:${id}`, month, slug, field: consult ? 'consultHeld' : 'paidHeld' });
    }
  }
  return out;
}

/** One "new paying client" event per consultation, keyed "v:<id>", in the
 *  Vancouver month it was first seen (now), under the consultation's
 *  counsellor. Pure: the caller decides which consultations converted
 *  (convertedConsults) and drops the keys already counted. */
export function conversionEvents<A extends { id: string | number }>(
  consults: A[],
  opts: { now: number; slugFor: (ap: A) => string | undefined },
): TallyEvent[] {
  const month = vancouverMonth(new Date(opts.now).toISOString());
  if (!month) return [];
  return consults.map((ap) => ({ key: `v:${ap.id}`, month, slug: opts.slugFor(ap) || 'unknown', field: 'consultConverted' as const }));
}

/** The tally with these events added. Pure; does not mutate its input. */
export function applyEvents(t: BookingTally, events: TallyEvent[], now = new Date()): BookingTally {
  const months: BookingTally['months'] = {};
  for (const [m, bySlug] of Object.entries(t.months ?? {})) {
    months[m] = {};
    for (const [s, c] of Object.entries(bySlug)) months[m][s] = { ...emptyCounts(), ...c };
  }
  for (const e of events) {
    months[e.month] ??= {};
    months[e.month][e.slug] ??= emptyCounts();
    months[e.month][e.slug][e.field] += 1;
  }
  return { months, updatedAt: now.toISOString() };
}

/* ---- storage -------------------------------------------------------------- */

function sanitise(v: unknown): BookingTally {
  const raw = (v && typeof v === 'object' ? (v as Partial<BookingTally>) : {}) as Partial<BookingTally>;
  const months: BookingTally['months'] = {};
  for (const [m, bySlug] of Object.entries(raw.months ?? {})) {
    if (!/^\d{4}-\d{2}$/.test(m) || !bySlug || typeof bySlug !== 'object') continue;
    months[m] = {};
    for (const [s, c] of Object.entries(bySlug)) {
      const n = emptyCounts();
      for (const k of Object.keys(n) as (keyof TallyCounts)[]) {
        const x = Number((c as Partial<TallyCounts>)?.[k]);
        n[k] = Number.isFinite(x) && x > 0 ? Math.floor(x) : 0;
      }
      months[m][s] = n;
    }
  }
  return { months, updatedAt: String(raw.updatedAt ?? '') };
}

async function readWithEtag(): Promise<{ tally: BookingTally; etag?: string }> {
  const hit = await get(TALLY_KEY, { access: 'private', useCache: false });
  if (!hit || hit.statusCode !== 200 || !hit.stream) return { tally: { months: {}, updatedAt: '' } };
  return { tally: sanitise(await new Response(hit.stream).json()), etag: hit.blob.etag };
}

/** Read-only, for anything that displays the tally. Empty on any failure. */
export async function readBookingTally(): Promise<BookingTally> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { months: {}, updatedAt: '' };
  try {
    return (await readWithEtag()).tally;
  } catch {
    return { months: {}, updatedAt: '' };
  }
}

/* Read, add, write with ifMatch, three tries. The last try drops the guard,
   for the reason in lib/blob-etag.ts: a weak or stuck validator must not
   freeze the store forever. Returns false only when nothing was written, so
   the caller can leave the events uncounted and try again next run. */
export async function addToBookingTally(events: TallyEvent[]): Promise<boolean> {
  if (events.length === 0) return true;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const ATTEMPTS = 3;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const { tally, etag } = await readWithEtag();
      const next = applyEvents(tally, events);
      const guard = strongEtag(etag);
      const lastChance = attempt === ATTEMPTS;
      await put(TALLY_KEY, JSON.stringify(next, null, 2), {
        access: 'private', contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
        ...(guard && !lastChance ? { ifMatch: guard } : {}),
      });
      return true;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError && attempt < ATTEMPTS) continue;
      console.error('[booking-tally] not written:', e instanceof Error ? e.message : e);
      return false;
    }
  }
  return false;
}
