import { put, get } from '@vercel/blob';

/* ============================================================================
   HOW OFTEN ONE SOURCE MAY POST TO A PUBLIC FORM
   ----------------------------------------------------------------------------
   Three routes — /api/enquiry, /api/lead, /api/waitlist — accept an unauthed
   POST from anyone on the internet. Each one writes to a blob store, resolves
   MX records, and sends two emails. Until now nothing capped how many times
   that could happen.

   WHAT WAS ALREADY HERE, AND WHY IT IS NOT ENOUGH. lib/triage.ts flags a third
   message from the same address in a day as a burst. That is real protection
   against a careless repeat and no protection at all against abuse, because
   the address is a free-text field: changing it costs a character. The axis
   that actually costs an attacker something is where the request came from,
   and nothing in this codebase looked at that.

   WHAT HAPPENS AT THE CEILING IS THE PART WORTH READING. It is not a 429.

   Over the soft limit, the submission is still stored and the person still
   gets the same confirmation — only the outbound email is suppressed. This
   matters more here than on most sites: somebody who submits six times in ten
   minutes is usually distressed and unsure it worked, not attacking anything,
   and dropping that person's message to save an email is the wrong trade every
   time. The first five already mailed; the practice can see the rest in
   /admin. The cost being capped is mail reputation and Resend quota, and both
   are capped by suppressing the send, not by refusing the person.

   Only over the hard limit — thirty in an hour, which no human produces — is
   anything discarded.

   NO IP ADDRESS IS STORED. This file is the first thing in the repository to
   look at one, and lib/triage.ts deliberately does not, so it stays that way:
   the address is hashed with a salt that changes at midnight UTC and only the
   first sixteen hex characters are kept. What is on disk cannot be reversed to
   an address and cannot be used to recognise the same visitor tomorrow. The
   cost is that a window spanning midnight starts over, which hands somebody at
   most one extra window a day and is worth it.

   IT IS NOT ATOMIC AND DOES NOT CLAIM TO BE. Read, modify, write on a blob
   loses increments when two requests overlap, so a genuine flood slips a few
   past the ceiling. That is the correct failure direction — the limiter errs
   toward letting a real person through — and a stricter store is not worth
   buying for three forms that see a handful of submissions a day.
   ========================================================================= */

const KEY = 'ops/rate.json';

/** Store but do not mail beyond this many in SOFT_WINDOW_MS. */
const SOFT_MAX = 5;
const SOFT_WINDOW_MS = 10 * 60_000;

/* Discard entirely beyond this many in HARD_WINDOW_MS.
 *
 * THE TWO CEILINGS HAVE TO BE CHOSEN TOGETHER, which is not obvious and was
 * got wrong first: five per ten minutes sustains to exactly thirty an hour, so
 * a hard limit of thirty could essentially never be reached and the second
 * tier was decoration. The hard tier is not a lower rate than the soft one —
 * it cannot be — it is the ceiling for somebody who kept going after being
 * throttled. Forty an hour is past any burst a shared office or campus address
 * could plausibly produce, and dropping is the one outcome here that loses a
 * real person, so it is set to be reached only by something that is clearly
 * not one. */
const HARD_MAX = 40;
const HARD_WINDOW_MS = 60 * 60_000;

/** Nothing is remembered longer than the longest window it could count in. */
const RETAIN_MS = HARD_WINDOW_MS;

export type RateVerdict = 'ok' | 'throttle' | 'drop';

type Store = Record<string, number[]>;

async function sha(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* Vercel sets x-forwarded-for at the edge and a client cannot forge it past
   that, so the first entry is the real peer. Absent means this is not running
   behind the proxy — local development, or a runtime that does not set it — in
   which case every request would share one bucket and the limiter would be
   throttling the developer rather than an attacker. Better to do nothing than
   to do that: an absent header returns no key and skips the check. */
export async function clientKey(req: Request): Promise<string | null> {
  const fwd = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '';
  const ip = fwd.split(',')[0]!.trim();
  if (!ip) return null;
  /* Salt rotates at midnight UTC. Without it the file is a list of visitor
     fingerprints that outlives its purpose; with it, yesterday's rows cannot
     be matched to today's. */
  const salt = new Date().toISOString().slice(0, 10);
  return (await sha(`${salt}:${ip}`)).slice(0, 16);
}

async function read(): Promise<Store> {
  /* No token means no store, which is the local-development case. Matches
     lib/portal-otp.ts rather than inventing a second convention. */
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    /* Private, not public. A publicly fetchable file of visitor hashes and
       submission timestamps is a traffic log anyone can read. */
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    const parsed: unknown = await new Response(hit.stream).json();
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    /* A store that cannot be read is not a reason to refuse a submission.
       Fails open, deliberately: the worst case is an uncapped hour, and the
       alternative is turning a blob outage into a site that will not accept a
       message from anyone. */
    return {};
  }
}

/**
 * Records one hit for `key` and says what should happen to it.
 *
 * Callers pass the result to decide whether to send mail, never whether the
 * person was heard — see the note at the top of the file.
 */
export async function rateCheck(key: string | null): Promise<RateVerdict> {
  if (!key) return 'ok';
  const now = Date.now();

  let store: Store;
  try {
    store = await read();
  } catch {
    return 'ok';
  }

  /* Prune while we are here. Nothing else ever visits this file, so if it is
     not tidied on write it grows without bound. */
  for (const k of Object.keys(store)) {
    const kept = (store[k] ?? []).filter((t) => now - t < RETAIN_MS);
    if (kept.length) store[k] = kept;
    else delete store[k];
  }

  const hits = store[key] ?? [];
  hits.push(now);
  store[key] = hits;

  try {
    await put(KEY, JSON.stringify(store), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  } catch {
    /* Same reasoning as read(): a failed write must not cost anyone their
       message. The count is lost, the submission is not. */
  }

  return classify(hits, now);
}

/**
 * The decision itself, with no storage in it.
 *
 * Split out so it can be tested. The blob half cannot be exercised without a
 * token, and a ceiling nothing checks is a ceiling that quietly stops being a
 * ceiling — which is the failure this whole file exists to avoid.
 */
export function classify(hits: number[], now: number): RateVerdict {
  const inHard = hits.filter((t) => now - t < HARD_WINDOW_MS).length;
  if (inHard > HARD_MAX) return 'drop';
  const inSoft = hits.filter((t) => now - t < SOFT_WINDOW_MS).length;
  if (inSoft > SOFT_MAX) return 'throttle';
  return 'ok';
}

export const LIMITS = { SOFT_MAX, SOFT_WINDOW_MS, HARD_MAX, HARD_WINDOW_MS } as const;
