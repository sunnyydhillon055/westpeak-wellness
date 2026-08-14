import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';

/* Everything a stranger sends the practice, in one place.
 *
 * WHY THIS EXISTS AT ALL
 *
 * It did not, and that was a live leak. `/api/lead` validated an address,
 * returned success, and stored nothing — NEXT_PUBLIC_FORM_ENDPOINT was never
 * set, so every person who ever asked for the coverage checklist was thanked
 * and discarded. The form looked like it worked, which is the worst version of
 * broken: no error to notice, no queue backing up, nothing to find.
 *
 * So the first rule here is that **capture must not depend on delivery**. The
 * record is written to Blob before any email is attempted, and a failed
 * notification cannot lose the person. Resend being down, an expired key, a
 * rate limit — none of those may cost a lead again.
 *
 * ONE STORE, THREE KINDS
 *
 * lead      — asked for the coverage checklist. Wants information.
 * enquiry   — wrote a message. Wants a reply.
 * waitlist  — could not find a workable time. Wants a slot.
 *
 * They arrive differently and mean different things, but they are all "someone
 * raised their hand and is waiting on the practice", which is exactly the thing
 * a solo practice loses track of. Splitting them across three stores would mean
 * three places to check, and the one nobody checks is where people go cold.
 *
 * WHAT IS DELIBERATELY NOT HERE
 *
 * Nothing clinical, and no free-text field is ever echoed into an email
 * subject line. Someone describing why they want counselling is writing the
 * most sensitive thing they will ever type into this site. It is held to be
 * read once and acted on — not analysed, not scored, not enriched. `handled`
 * is a boolean, not a pipeline stage, because this is a practice and not a
 * sales funnel.
 *
 * CASL. A lead or waitlist signup is consent to receive the specific thing
 * asked for, and nothing else. It is not a mailing-list subscription. See
 * NURTURE_SEQUENCE.md, which says the same thing at more length.
 */

const KEY = 'inbound/messages.json';

export type InboundKind = 'lead' | 'enquiry' | 'waitlist';

export type Inbound = {
  id: string;
  kind: InboundKind;
  name: string;
  email: string;
  /** The person's own words. Empty for a lead, which asks for nothing. */
  message: string;
  /** Waitlist only: roughly when they can actually attend. */
  windows?: string;
  /** Which page it came from, for working out what earns enquiries. */
  source: string;
  /* Explicit, separate consent to be written to again after the three-email
   * sequence ends.
   *
   * It exists because two items in CLIENT_GROWTH_20_MORE.md contradicted each
   * other and only one of them was right. Item 8 says the sequence is three
   * emails then permanent silence — asking for a checklist is CASL consent to
   * receive the checklist and material about it, not to an indefinite mailing
   * list. Item 16 then proposed a monthly email to the same people, which is
   * exactly the thing item 8 rules out.
   *
   * A separate ticked box is the only way both can be true. Unticked by
   * default and it must stay that way: a pre-ticked consent box is not consent
   * under CASL, and on a counselling site it is worse than merely
   * non-compliant. */
  monthlyOptIn?: boolean;
  createdAt: string;
  handled: boolean;
};

export type InboundBook = { items: Inbound[]; version: number; updatedAt: string };

const EMPTY: InboundBook = { items: [], version: 0, updatedAt: '' };

/* Same two-cache shape as lib/clients.ts, and for the same reason: Vercel Blob
 * reads are not read-after-write consistent, so a write we just made has to
 * outrank whatever the blob is still serving. Getting this wrong in clients.ts
 * silently dropped a record; here it would drop an enquiry, which is a person
 * waiting for a reply that never comes. */
let cache: { at: number; value: InboundBook } | null = null;
let lastWrite: { at: number; value: InboundBook } | null = null;
const CACHE_MS = 15_000;
const WRITE_AUTHORITY_MS = 90_000;

const clip = (s: unknown, n: number) => String(s ?? '').trim().slice(0, n);

export async function readInbound(opts?: { fresh?: boolean }): Promise<InboundBook> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) return lastWrite.value;
  if (!opts?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;

  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const parsed = (await new Response(hit.stream).json()) as Partial<InboundBook>;
    const value: InboundBook = {
      items: Array.isArray(parsed.items) ? (parsed.items as Inbound[]) : [],
      version: Number(parsed.version) || 0,
      updatedAt: String(parsed.updatedAt ?? ''),
    };
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return cache?.value ?? EMPTY;
  }
}

/* Append, not read-modify-write-with-conflict.
 *
 * clients.ts refuses a stale write because two administrators editing the same
 * record must not silently clobber each other. Here every write is a NEW item
 * from a different person, so the only real risk is two submissions landing in
 * the same instant and one being lost. Refusing the second would lose it for
 * certain; appending loses it only in a race that a solo practice will not see.
 * Between "definitely drop it" and "almost certainly keep it", keep it. */
export async function addInbound(
  rec: Omit<Inbound, 'id' | 'createdAt' | 'handled'>
): Promise<Inbound | null> {
  const email = normalizeEmail(rec.email);
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return null;

  const item: Inbound = {
    id: crypto.randomUUID().slice(0, 8),
    kind: rec.kind,
    name: clip(rec.name, 80),
    email,
    message: clip(rec.message, 4000),
    windows: clip(rec.windows, 300) || undefined,
    source: clip(rec.source, 120) || '/',
    monthlyOptIn: rec.monthlyOptIn === true ? true : undefined,
    createdAt: new Date().toISOString(),
    handled: false,
  };

  const current = await readInbound({ fresh: true });
  /* Bounded, newest last. 1,000 is years for a solo practice, and anything
   * older has either been answered or is long past being answerable. */
  const items = [...current.items, item].slice(-1000);
  const value: InboundBook = { items, version: current.version + 1, updatedAt: item.createdAt };

  cache = { at: Date.now(), value };
  lastWrite = { at: Date.now(), value };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(KEY, JSON.stringify(value, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  }
  return item;
}

/** Marks one item answered. Returns false if the id is unknown. */
export async function markHandled(id: string, handled = true): Promise<boolean> {
  const current = await readInbound({ fresh: true });
  const idx = current.items.findIndex((i) => i.id === id);
  if (idx < 0) return false;

  const items = current.items.map((i, n) => (n === idx ? { ...i, handled } : i));
  const value: InboundBook = {
    items, version: current.version + 1, updatedAt: new Date().toISOString(),
  };
  cache = { at: Date.now(), value };
  lastWrite = { at: Date.now(), value };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(KEY, JSON.stringify(value, null, 2), {
      access: 'private', contentType: 'application/json',
      addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
    });
  }
  return true;
}

/** Newest first, which is the order anyone actually wants to read them in. */
export async function recentInbound(limit = 50): Promise<Inbound[]> {
  const { items } = await readInbound();
  return [...items].reverse().slice(0, limit);
}

export async function unhandledCount(): Promise<number> {
  const { items } = await readInbound();
  return items.filter((i) => !i.handled).length;
}
