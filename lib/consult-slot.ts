import { nextConsultEntries, nextConsultNoneOpen, noConsultSentence, type NextConsult, type NoConsult } from './next-consult.ts';

/* THE NEXT CONSULTATION, FILLED IN BY THE BROWSER — 3 Oct 2026 (item 429).
 *
 * WHY. Every page that printed a Cliniko time at render exported
 * `revalidate`, and a page Next regenerates in production is rendered again
 * from React: scripts/inline-css.mjs never sees that copy, so it goes out
 * with its stylesheet links blocking first paint. On main on 3 Oct, 21 app
 * files exported revalidate and `inline-css --check` listed 317 routes that
 * lose the inlined block after their first regeneration; production served
 * guides and resources with three plain stylesheet links and no
 * data-inlined. The catalogue fee is a build-time fact and can stay in the
 * document. The next open day cannot, so it moves here: the server decides
 * WHO a line may name (the roster rules in lib/next-consult.ts, unchanged)
 * and the browser asks /api/availability WHEN, from the same thirty-minute
 * Cliniko cache the pages read before.
 *
 * Pure and import-light: no roster, no React, no Next. The client slot
 * (components/NextConsultSlot.tsx) imports it, so it must stay that way —
 * a client component that imports lib/practitioners.ts ships the roster to
 * every visitor (the perf rule of 1 Oct 2026). */

/** What /api/availability returns: one entry per counsellor Cliniko was read
 *  for successfully. An entry missing means unknown, never "nothing open". */
export type ClientAvailability = Record<string, { first: string; next: string[]; count: number }>;

/** A counsellor a slot may name, decided on the server. */
export type SlotPerson = { slug: string; first: string; href: string };

/** The label every clock time on the site carries (lib/availability-summary.ts
 *  PACIFIC; a test holds the two equal). */
export const PACIFIC_LABEL = ' (Pacific time)';

export type SlotState =
  | { kind: 'times'; entries: (NextConsult & { day: string; href: string })[] }
  | { kind: 'none'; people: NoConsult[]; sentence: string }
  | { kind: 'nothing' };

/** What a slot should print, given the availability JSON (null while it has
 *  not arrived) and the people the page allows it to name, in order.
 *  'none' only when every one of them was read and has nothing open in the
 *  two weeks; anything unknown prints nothing, as on the server before. */
export function slotState(all: ClientAvailability | null | undefined, people: readonly SlotPerson[]): SlotState {
  if (!all || !people.length) return { kind: 'nothing' };
  const roster = people.map((p) => ({ slug: p.slug, name: p.first, acceptingNewClients: true, bookable: true }));
  const keyed = Object.fromEntries(Object.entries(all).map(([slug, a]) => [slug, a && { ...a, slug }]));
  const entries = nextConsultEntries(keyed, roster);
  if (entries.length) {
    const href = new Map(people.map((p) => [p.slug, p.href]));
    return {
      kind: 'times',
      entries: entries.map((e) => ({ ...e, day: e.when.split(' from ')[0]!.trim(), href: href.get(e.slug)! })),
    };
  }
  const none = nextConsultNoneOpen(keyed, roster);
  const sentence = noConsultSentence(none);
  return sentence ? { kind: 'none', people: none, sentence } : { kind: 'nothing' };
}

/* The height the filled line will take, in lines, on a phone (about 40
   characters across at .95rem) and wider (about 88): the label, then per
   counsellor her name twice and the longest form of a day and time. On the
   generous side, so the text never pushes what follows it. */
export function consultLines(people: readonly { first: string }[]): [number, number] {
  const chars = 49 + people.reduce((n, p) => n + 2 * p.first.length + 40, 0);
  return [Math.ceil(chars / 40), Math.ceil(chars / 88)];
}

/** The same for the day list ("Next free call: Thu 22 Oct with Savneet ·
 *  ... (Pacific time)") at the hero note's smaller size, plus any fixed
 *  words the paragraph carries after it. */
export function daysLines(people: readonly { first: string }[], extraChars = 0): [number, number] {
  const chars = 31 + extraChars + people.reduce((n, p) => n + p.first.length + 18, 0);
  return [Math.ceil(chars / 42), Math.ceil(chars / 90)];
}

/** One counsellor's first open time ("Thu 2 Oct from 10 am"), or null. */
export function firstWhen(all: ClientAvailability | null | undefined, slug: string): string | null {
  const a = all?.[slug];
  if (!a || a.count <= 0 || !a.next?.length) return null;
  return a.next[0]!.replace(/\s*\(\d+ times?\)\s*$/, '').trim() || null;
}

/** Every open day listed for one counsellor ("Thu 2 Oct from 10 am (3 times)"). */
export function openDays(all: ClientAvailability | null | undefined, slug: string): string[] {
  const a = all?.[slug];
  return a && a.count > 0 && Array.isArray(a.next) ? a.next : [];
}

/* ONE REQUEST PER PAGE VIEW. The sticky bar and every slot on the page share
   this promise, so a page with three slots still asks once. Kept ten minutes
   across client navigations, then asked again: the API is cached thirty
   minutes at the edge, so a fresh ask is cheap and the times stay current
   for someone who keeps a tab open. A failure resolves to {} (print
   nothing) and is not kept. */
const KEEP_MS = 10 * 60_000;
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
