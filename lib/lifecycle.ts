import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';

/* Who has already been sent a lifecycle message, so nobody is sent one twice.
 *
 * WHY THIS IS A SEPARATE LEDGER FROM lib/booking-notify's
 *
 * That one is keyed on appointment id and answers "has this booking been
 * confirmed". This one is keyed on a person and answers "have we already
 * reached out to them about coming back". Those have different lifetimes: an
 * appointment ledger can be pruned once the appointment is long past, and this
 * one must not be, because pruning it would let somebody be contacted a second
 * time a year later.
 *
 * ONCE PER PERSON, EVER. Not once a year, not once per campaign. A former
 * counselling client who has decided they are finished is entitled to stay
 * finished, and a practice that emails them again every spring is doing
 * something the person cannot easily refuse without a conversation they did not
 * want to have. One message, and then silence unless they answer.
 */

const KEY = 'portal/lifecycle.json';

export type LifecycleKind = 'reactivation' | 'missed';

export type Ledger = {
  /** normalised email -> ISO date the message was sent */
  reactivation: Record<string, string>;
  /** Cliniko appointment id -> ISO date, for missed-session notes */
  missed: Record<string, string>;
  updatedAt: string;
};

const EMPTY: Ledger = { reactivation: {}, missed: {}, updatedAt: '' };

let cache: { at: number; value: Ledger } | null = null;
let lastWrite: { at: number; value: Ledger } | null = null;
const CACHE_MS = 20_000;
const WRITE_AUTHORITY_MS = 90_000;

export async function readLedger(opts?: { fresh?: boolean }): Promise<Ledger> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) return lastWrite.value;
  if (!opts?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;

  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const v = (await new Response(hit.stream).json()) as Partial<Ledger>;
    const value: Ledger = {
      reactivation: v.reactivation && typeof v.reactivation === 'object' ? v.reactivation : {},
      missed: v.missed && typeof v.missed === 'object' ? v.missed : {},
      updatedAt: String(v.updatedAt ?? ''),
    };
    cache = { at: Date.now(), value };
    return value;
  } catch {
    /* A read failure must fail CLOSED — that is, it must look as though
     * everyone has already been contacted. The alternative fails open and
     * re-sends to people who have had their one message, which is the exact
     * harm this file exists to prevent. */
    return cache?.value ?? EMPTY;
  }
}

async function write(value: Ledger): Promise<void> {
  cache = { at: Date.now(), value };
  lastWrite = { at: Date.now(), value };
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(KEY, JSON.stringify(value, null, 2), {
    access: 'private', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
  });
}

export async function alreadyContacted(email: string): Promise<boolean> {
  const e = normalizeEmail(email);
  const l = await readLedger();
  return Boolean(l.reactivation[e]);
}

export async function recordContacted(email: string): Promise<void> {
  const e = normalizeEmail(email);
  const current = await readLedger({ fresh: true });
  await write({
    ...current,
    reactivation: { ...current.reactivation, [e]: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  });
}

export async function missedAlreadyNoted(appointmentId: string): Promise<boolean> {
  const l = await readLedger();
  return Boolean(l.missed[appointmentId]);
}

export async function recordMissed(appointmentId: string): Promise<void> {
  const current = await readLedger({ fresh: true });
  await write({
    ...current,
    missed: { ...current.missed, [appointmentId]: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  });
}
