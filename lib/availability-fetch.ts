/* THE ONE /api/availability REQUEST, WITH NOTHING ELSE ATTACHED — 16 Oct 2026 (item 599).
 *
 * The sticky bar is in the root layout, so whatever it imports is paid on
 * every page. It read loadAvailability from lib/consult-slot.ts, and that
 * module imports lib/next-consult.ts for the slot sentences, which the bar
 * never prints. This file has no imports at all, so the layout chunk carries
 * the fetch and nothing behind it: the follow-up DECISIONS item 539 (15 Oct)
 * named. lib/consult-slot.ts re-exports all of it, so the slots and /book
 * share this module's promise and a page still asks once. */

/** What /api/availability returns: one entry per counsellor Cliniko was read
 *  for successfully. An entry missing means unknown, never "nothing open". */
/*  `later` (16 Oct 2026, item 554): with nothing open in the two weeks, the
 *  first day Cliniko has a consultation open in days 15-35, e.g. "Mon 4 Jan".
 *  A day only; absent when there is none or the longer read failed. */
export type ClientAvailability = Record<string, { first: string; next: string[]; count: number; later?: string }>;

/* ONE REQUEST PER PAGE VIEW. The sticky bar and every slot on the page share
   this promise, so a page with three slots still asks once. Kept ten minutes
   across client navigations, then asked again: the API is cached thirty
   minutes at the edge, so a fresh ask is cheap and the times stay current
   for someone who keeps a tab open. A failure resolves to {} (print
   nothing) and is not kept. */
export const KEEP_MS = 10 * 60_000;
let pending: { at: number; p: Promise<ClientAvailability> } | null = null;

export function loadAvailability(
  fetcher: (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }> = (u) => fetch(u),
  now: number = Date.now(),
): Promise<ClientAvailability> {
  if (pending && now - pending.at < KEEP_MS) return pending.p;
  const p = fetcher('/api/availability')
    .then((r) => {
      if (!r.ok) throw new Error('availability');
      return r.json();
    })
    .then((j) => (j && typeof j === 'object' ? (j as ClientAvailability) : {}))
    .catch(() => {
      pending = null;
      return {} as ClientAvailability;
    });
  pending = { at: now, p };
  return p;
}

/** Tests only: forget the shared request. */
export function resetAvailabilityForTests(): void {
  pending = null;
}
