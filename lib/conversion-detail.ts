import { practitioners } from '@/lib/practitioners';
import { tools, WHICH_SERVICE_OUTCOMES, ACCESS_ROUTES } from '@/lib/tools';

/* THE ONE EXTRA DIMENSION A CONVERSION EVENT MAY CARRY — 1 Oct 2026.
 *
 * WHY
 *
 * Six weeks of first-party counts (lib/conversion-log.ts, since 18 Aug 2026)
 * could say that 34 booking clicks and 105 calendar views happened, and could
 * not say which counsellor any of them were for or which button produced
 * them. Every call site already passed that — `location` on BookLink, `who`
 * on BookDirectLink, `?with=` in the href — and lib/analytics.ts sent only the
 * event name and the pathname, so the query string and every parameter went
 * to gtag, which is not loaded. The practice has two counsellors and no way
 * to tell whose pages earn bookings. That is the question this answers.
 *
 * WHY ONE DIMENSION, FROM A LIST
 *
 * The privacy posture of the conversion log is counts, never events: nothing
 * that joins two actions to one person. A free-text dimension would break
 * that from the first `?with=<anything>` a crawler sent, and an open set of
 * keys is how a counter becomes a memory problem. So a `detail` is accepted
 * only if it is on the list below, which is built from the roster and the
 * tools — the things the site already names — and is otherwise dropped while
 * the event itself is still counted. No name, no address, no message, no
 * identifier, nothing a person typed.
 *
 * This module has no I/O and no blob import so the browser and the server
 * compose and validate the same keys. The store is lib/conversion-log.ts. */

/** Which button. Only places that fire `book_click` today; add one when a
 *  CTA is wired, never ahead of it, for the reason given on TrackedEvent in
 *  lib/analytics.ts — an entry that never fires reads as a CTA nobody uses. */
export const BOOK_LOCATIONS: readonly string[] = [
  'header',
  'sticky',
  'cta-band',
  /* The hero and mid-page buttons on the city, service and audience
     templates, routed through BookLink since 1 Oct 2026. */
  'hero-city',
  'hero-service',
  'hero-audience',
  'aside-service',
  'mid-audience',
  /* The city × service template, wired the same day (wf/city-service):
     the tracked button under the lede, the per-counsellor card, and the
     mid-page "Book a consultation" that was an untracked plain link. */
  'hero-city-service',
  'counsellor-city-service',
  'access-city-service',
  ...tools.map((t) => `tool:${t.slug}`),
];

/** Every slug on the roster, accepting or not. The founder's cannot reach a
 *  booking CTA (she is not accepting, so bookHrefFor never names her), but a
 *  roster-wide list means nothing here has to know that rule. */
export const COUNSELLOR_SLUGS: readonly string[] = practitioners.map((p) => p.slug);

/** The one-pagers a lead can ask for. The same list lib/inbound-submit.ts
 *  allow-lists the form value against, held here so the two cannot drift. */
export const MAGNET_KEYS: readonly string[] = ['coverage-checklist', 'icbc-after-a-crash', 'starting-counselling'];

/** What a tool concluded, per tool. The two reflection tools (stress-check,
 *  burnout-or-depression) deliberately produce no verdict — see the header of
 *  each — and the count does not either: their detail is the tool's name. */
export const TOOL_OUTCOMES: Readonly<Record<string, readonly string[]>> = {
  'which-service': WHICH_SERVICE_OUTCOMES.map((o) => o.tag),
  'what-can-i-access': Object.keys(ACCESS_ROUTES),
  'therapy-cost-bc': ['yes', 'no', 'unsure'],
  'stress-check': [],
  'burnout-or-depression': [],
};

/* `book_click` is one key with two readable halves: the button, and the
 * counsellor the link named, when it named one — "sticky/camille-granda".
 * Two separate rows per click would make the detail column stop summing to
 * the event, and a click on a counsellor's page is one click. */
const SEP = '/';

const slugOk = (s: string | undefined | null): s is string => !!s && COUNSELLOR_SLUGS.includes(s);

/** The counsellor a booking href names, if it is on the roster. Read from the
 *  href rather than passed as a prop so every CTA that links `?with=` is
 *  attributed without each call site having to remember to say so. */
export function withSlugOf(href: string | undefined | null): string | undefined {
  if (!href) return undefined;
  const q = href.indexOf('?');
  if (q < 0) return undefined;
  const w = new URLSearchParams(href.slice(q + 1).split('#')[0]).get('with');
  return slugOk(w) ? w : undefined;
}

/** The detail for a `book_click`: null when the location is not one the
 *  list knows, in which case the click is still counted by path. An unknown
 *  counsellor falls back to the location alone rather than dropping both. */
export function bookClickDetail(location: string, who?: string | null): string | null {
  if (!BOOK_LOCATIONS.includes(location)) return null;
  return slugOk(who) ? `${location}${SEP}${who}` : location;
}

/** The detail for a `tool_complete`: the tool, and its outcome when the tool
 *  has outcomes and this is one of them. */
export function toolDetail(tool: string, outcome?: string | null): string | null {
  const outcomes = TOOL_OUTCOMES[tool];
  if (!outcomes) return null;
  return outcome && outcomes.includes(outcome) ? `${tool}:${outcome}` : tool;
}

export function splitBookDetail(key: string): { location: string; who?: string } {
  const i = key.indexOf(SEP);
  return i < 0 ? { location: key } : { location: key.slice(0, i), who: key.slice(i + 1) };
}

/* The allow-list proper, enumerated once so membership is a Set lookup and
 * the bound is a number somebody can read: 13 locations × 4 = 52 book_click
 * keys, 3 slugs, 3 magnets, 5 tools + 22 outcomes. */
const BOOK_CLICK_KEYS = new Set<string>(
  BOOK_LOCATIONS.flatMap((l) => [l, ...COUNSELLOR_SLUGS.map((s) => `${l}${SEP}${s}`)])
);
const TOOL_KEYS = new Set<string>(
  Object.entries(TOOL_OUTCOMES).flatMap(([t, os]) => [t, ...os.map((o) => `${t}:${o}`)])
);
const SLUG_KEYS = new Set<string>(COUNSELLOR_SLUGS);
/* THE PAID CALENDAR, COUNTED APART — 1 Oct 2026. /client-portal embeds the
   full calendar ($140 and up) and /book the free consultation, and both sent
   the bare slug, so "Camille's calendar seen" summed free-consult intent with
   a client rebooking. The portal now sends `portal:<slug>`, accepted for the
   two scheduler events only: the portal has no booking buttons and no
   enquiry form, so nowhere else could legitimately send one. */
export const PORTAL_PREFIX = 'portal:';
const SCHEDULER_KEYS = new Set<string>([...COUNSELLOR_SLUGS, ...COUNSELLOR_SLUGS.map((s) => `${PORTAL_PREFIX}${s}`)]);
const MAGNET_SET = new Set<string>(MAGNET_KEYS);

const ALLOWED: Readonly<Record<string, ReadonlySet<string>>> = {
  book_click: BOOK_CLICK_KEYS,
  book_direct: SLUG_KEYS,
  scheduler_visible: SCHEDULER_KEYS,
  scheduler_interact: SCHEDULER_KEYS,
  /* Which counsellor the message asked for, when it came from her page. */
  enquiry_submit: SLUG_KEYS,
  lead_magnet_submit: MAGNET_SET,
  tool_complete: TOOL_KEYS,
};

/** The detail to store for this event, or null to store none. Never throws,
 *  never trims or normalises: a key is either on the list or it is not. */
export function allowedDetail(event: string, detail: unknown): string | null {
  if (typeof detail !== 'string' || detail.length === 0 || detail.length > 80) return null;
  return ALLOWED[event]?.has(detail) ? detail : null;
}

/** What the store keeps for a detail the browser composed. The browser half
 *  (lib/conversion-detail-client.ts) carries no list, so it can send a key
 *  whose counsellor or outcome half is unknown; the button or the tool is
 *  still worth counting, exactly as bookClickDetail and toolDetail above
 *  fall back. Anything else is the strict list. 1 Oct 2026. */
export function acceptedDetail(event: string, detail: unknown): string | null {
  const strict = allowedDetail(event, detail);
  if (strict || typeof detail !== 'string') return strict;
  const cut = event === 'book_click' ? detail.indexOf(SEP) : event === 'tool_complete' ? detail.indexOf(':') : -1;
  return cut > 0 ? allowedDetail(event, detail.slice(0, cut)) : null;
}
