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
  /* OPTIONAL callback number, and when the person will take a call.
   *
   * The practice publishes no phone number anywhere — every tel: link on this
   * site is a crisis line — so "phone" has never been a way in. The visibility
   * audit of 27 Aug 2026 scored that channel 100/1000, last of eleven
   * practices, and it is the only channel with no entry point at all.
   *
   * Publishing a number is the owner's call and not one a build should make
   * for them: it creates an expectation of being answered, and a solo practice
   * that misses calls is worse off than one that never invited them. What a
   * build can do is reverse the direction — let the person who wants a call
   * ask for one, on their own terms, at a time they nominate.
   *
   * Deliberately optional and deliberately last in the form. The note at the
   * top of InboundForm.tsx rules out a REQUIRED phone field and it is right:
   * every extra field on a first approach to a counsellor is a reason to close
   * the tab. An optional one that says why it is there does not carry that
   * cost, because the default path is unchanged for anyone who skips it.
   *
   * Never echoed into an email subject or preheader. A practice inbox is still
   * an inbox and may be read on a phone in public. */
  phone?: string;
  /** Free text: when they will take a call. Never parsed, only read. */
  callWindow?: string;
  /** Which page it came from, for working out what earns enquiries. */
  source: string;
  /* WHICH COUNSELLOR THEY ASKED FOR.
   *
   * Every call to action on Camille's 24 pages pointed at a bare /book with no
   * practitioner attached, and the form had no field for one — so somebody who
   * read a thousand words about her, in Calgary, arrived at a page addressed to
   * the founder and had no way to say who they came for. Whoever answered the
   * enquiry could not tell either.
   *
   * A slug from lib/practitioners, validated server-side; anything unrecognised
   * is dropped rather than stored. */
  practitioner?: string;
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
  /* Which lead magnet was asked for. There was one, so nothing needed to say
   * which; there are now two, and a second magnet with no way to tell them
   * apart in /admin is a queue of people whose request you cannot answer. */
  magnet?: string;
  createdAt: string;
  handled: boolean;
  /* WHEN it was answered, not just whether.
   *
   * Added 2026-08-23. The site promises "a reply within one business day" on
   * every page carrying a form, and until now there was no way to know whether
   * that was true — `handled` recorded only that a reply happened, never when.
   * An unverifiable promise on a counselling site is worth less than a smaller
   * one that can be shown.
   *
   * Optional because every record written before this date has no value for
   * it, and back-filling would be inventing history. The median only becomes
   * meaningful once a month of real data exists; until then /admin says so
   * rather than reporting a figure drawn from three replies. */
  handledAt?: string;
  /* How the submission scored on lib/triage.ts at the moment it arrived.
   *
   * Stored rather than recomputed, because two of the signals — "identical
   * message already received" and "third message from this address today" —
   * are only true relative to what the store held at the time. Recomputing
   * them a week later gives a different answer about the same event.
   *
   * Optional: everything written before 30 Aug 2026 has no verdict, and
   * back-filling one would be inventing a judgement that was never made. */
  triage?: import('./triage').TriageVerdict;
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
    /* CARRIED, not dropped. These were in the type, collected by the form,
       passed in by handleInbound and rendered by practiceAlert() — and never
       written here, so `item.phone` was always undefined and the "asked to be
       called" row never appeared in a single alert email. Someone who ticked
       the one box asking to be phoned got no call and left no trace of having
       asked. Found 30 Aug 2026 while adding triage. */
    phone: clip(rec.phone, 40) || undefined,
    callWindow: clip(rec.callWindow, 120) || undefined,
    practitioner: clip(rec.practitioner, 60) || undefined,
    triage: rec.triage,
    source: clip(rec.source, 120) || '/',
    monthlyOptIn: rec.monthlyOptIn === true ? true : undefined,
    magnet: clip(rec.magnet, 40) || undefined,
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

  const items = current.items.map((i, n) =>
    n === idx ? { ...i, handled, handledAt: handled ? new Date().toISOString() : undefined } : i
  );
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

/* Attaches the MX result once it comes back.
 *
 * Separate from addInbound because the DNS lookup happens AFTER the record is
 * stored — the store must never wait on the network. Same read-modify-write
 * shape as markHandled. Returns false for an unknown id rather than throwing:
 * the caller is in a best-effort block and a failure here must not surface to
 * the person who submitted the form. */
export async function annotateTriage(
  id: string,
  verdict: import('./triage').TriageVerdict
): Promise<boolean> {
  const current = await readInbound({ fresh: true });
  const idx = current.items.findIndex((i) => i.id === id);
  if (idx < 0) return false;

  const items = current.items.map((i, n) => (n === idx ? { ...i, triage: verdict } : i));
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
