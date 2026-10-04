import { practitioners, withLetters, insuredProvinces, vancouverToday, type Practitioner } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import { counsellorsFor, listOf } from '@/lib/city-service-page';
import { money, type Catalog } from '@/lib/cliniko-catalog';

/* WHO YOU WOULD SEE, ON EVERY MONEY PAGE — 1 Oct 2026.
 *
 * The city x service pages gained a "who you would see" block this morning
 * (lib/city-service-page.ts). The service pages, the audience pages and the
 * city hubs named nobody, while eight of the thirteen pages ranking for the
 * same queries name a credentialed counsellor on the page itself. This file
 * decides who each of those three templates shows; components/CounsellorCards
 * draws them, once, for all four templates.
 *
 * THE RULES, WHICH ARE THE CITY-SERVICE PAGE'S RULES
 *
 *   - accepting new clients, or not named at all. The founder is excluded by
 *     that flag, not by name, exactly as lib/booking-cta.ts does it;
 *   - insured for BC, because every page here is a BC page;
 *   - offering the Cliniko type the page books into, or, on a page that IS a
 *     language, speaking that language and having a calendar to open.
 *
 * Credential NAMES only (withLetters: "RCC, CCC"). Registration numbers live
 * on the profile page and nowhere else. No availability line: hours are not
 * published anywhere. */

/** The book_click locations the cards fire, one per template. Each is on
 *  BOOK_LOCATIONS in lib/conversion-detail.ts; a test holds that. */
export const COUNSELLOR_CARD_LOCATIONS = [
  'counsellor-city-service',
  'counsellor-service',
  'counsellor-audience',
  'counsellor-city',
  /* The informational templates, 1 Oct 2026: the resources and guides that
     rank for workplace, leave and coverage questions (INFO_CARD_PAGES below),
     and the confirmation page a one-pager signup lands on. */
  'guide',
  'resource',
  'counsellor-lead-sent',
  /* /search, above the results when the top hit is a service (1 Oct 2026). */
  'search',
  /* The five tools and the /tools hub (components/tools/ToolCounsellors,
     wf/s7-tools, 4 Oct 2026). */
  'counsellor-tool',
] as const;
export type CounsellorCardLocation = (typeof COUNSELLOR_CARD_LOCATIONS)[number];

/* A page written for one language shows the counsellors who work in it.
   Accepting AND bookable, as bookingCtaFor requires: the card's button opens
   her calendar, and a counsellor who books by reply has none to open. */
const speaking = (tag: string): Practitioner[] =>
  practitioners.filter(
    (p) =>
      p.acceptingNewClients &&
      p.bookable &&
      p.provinces.includes('BC') &&
      p.languages.some((l) => l.tag === tag),
  );

/* /services/<slug>. A language service (Punjabi, Tagalog) is not a Cliniko
   appointment type anybody lists — the sessions bill as individual or couples
   work — so it is routed by language. Everything else by the type: two
   counsellors for individual therapy, one for couples, EMDR and family. */
export const counsellorsForService = (s: { slug: string; language?: string }): Practitioner[] =>
  s.language ? speaking(s.language) : counsellorsFor({ bookingService: s.slug });

/* /for/<slug>. A page written for Punjabi or Tagalog speakers shows the
   counsellor who works in that language; every other audience page is about
   a person's situation, which is individual work, so it shows whoever is
   accepting individual clients in BC.

   THE PAGE'S SERVICE, TOO — 2 Oct 2026 (wf/services-cards). This read only
   the language, so /for/couples (service 'couples-therapy') showed every
   counsellor accepting individual clients, including one whose roster lists
   no couples work, and her card booked an individual consult. Now:
     - language and service: the speakers who offer the service; when none
       does, whoever offers the service (/for/punjabi-speaking-couples shows
       the couples counsellor, whose joint sessions that page already says
       run in English);
     - service only: whoever offers it;
     - neither: individual work, as before. */
export const counsellorsForAudience = (a: { language?: string; service?: string }): Practitioner[] => {
  if (a.language) {
    const speakers = speaking(a.language);
    if (!a.service) return speakers;
    const both = speakers.filter((p) => p.services.includes(a.service!));
    return both.length ? both : counsellorsFor({ bookingService: a.service });
  }
  return counsellorsFor({ bookingService: a.service ?? 'individual-therapy' });
};

/* /online-counselling/<city>. The counsellors with their own page for this
   city — the set the hub's Person schema already lists — limited to those
   accepting. placePages and the place list decide it, so a card never links
   a per-city route that was not generated. */
export const counsellorsForCity = (citySlug: string): Practitioner[] =>
  practitioners.filter(
    (p) =>
      p.acceptingNewClients &&
      p.placePages &&
      placesFor(p.provinces).some((c) => c.slug === citySlug),
  );

/* The one fee line the audience pages carry: individual counselling, read
   from the catalogue by name, never typed. Undefined when the catalogue has
   no such item, and the line then does not render rather than guess. */
export function individualFeeLine(catalog: Catalog): string | undefined {
  const item = catalog.items.find((i) => i.name.toLowerCase() === 'individual counselling');
  return item ? `Individual sessions are ${money(item.cents)} for ${item.minutes} minutes, after a free 15-minute consultation.` : undefined;
}

/* "Camille Granda, RCC, CCC, who works in English and Tagalog". Shared by
   the city hub's "who would I see" answer. */
export const whoLine = (p: Practitioner) =>
  `${withLetters(p)}, who works in ${listOf(p.languages.map((l) => l.name), 'and')}`;

/* "Punjabi Counselling" -> "Punjabi counselling", "EMDR Therapy" -> "EMDR
   therapy". serviceNoun in lib/booking-cta.ts lowercases every word that is
   not an initialism, which is right for the services it was written for and
   wrong for a language, which is a proper noun. The language names are the
   roster's own, so a third language needs no edit here. */
const LANGUAGE_NAMES = new Set(practitioners.flatMap((p) => p.languages.map((l) => l.name)));
export const cardNoun = (name: string): string =>
  name
    .split(' ')
    .map((w) =>
      w.length > 1 && w === w.toUpperCase()
        ? w
        : /* per hyphen segment: "Punjabi-Speaking" -> "Punjabi-speaking" */
          w.split('-').map((x) => (LANGUAGE_NAMES.has(x) ? x : x.toLowerCase())).join('-'),
    )
    .join(' ');

/* WHO YOU WOULD TALK TO, ON THE PAGES PEOPLE ACTUALLY READ — 1 Oct 2026.
 *
 * /resources/workplace-mental-health-bc had 1,884 impressions, 17 clicks and
 * no book_click: its only fee was inside the JSON-LD and every button was the
 * practice-wide one. The cards and the fee line were on the money templates
 * only. These are the informational pages that carry them, an explicit list
 * for the same reason the guides' GENTLE_CTA is one: which pages suit a
 * "who you would talk to" block is a judgement worth seeing in one place.
 * A resource can also opt in with `whoYouWouldSee: true` (lib/resources.ts).
 *
 * The leave guides that sit on the GENTLE list get the same cards under a
 * gentler heading, and still no email form. Who appears is the audience
 * rule: the language counsellor on a page written for one language (the
 * Punjabi words page shows only the counsellor who works in Punjabi),
 * otherwise whoever is accepting individual clients in BC. The founder is
 * excluded by the accepting flag, never by name. */
export const INFO_CARD_PAGES: Readonly<Record<'guides' | 'resources', readonly string[]>> = {
  resources: [
    'workplace-mental-health-bc',
    'worksafebc-psychological-injury-claims',
    'mental-health-leave-templates-bc',
    'verify-a-counsellor-in-bc',
    'does-my-plan-cover-counselling-bc',
    'counselling-in-punjabi-what-the-words-mean',
  ],
  guides: [
    'sick-days-and-mental-health-days-bc',
    'ei-sickness-benefits-and-therapy',
    'stress-leave-bc',
    'doctors-note-for-a-mental-health-leave',
    'return-to-work-after-a-mental-health-leave',
    /* October refresh, 1 Oct 2026 (item 223): read most Nov-Feb. */
    'low-mood-through-a-bc-winter',
  ],
};

/* CARDS BY DEFAULT — 1 Oct 2026 (wf/guide-templates-next-step).
 *
 * INFO_CARD_PAGES above was 11 pages out of 62 guides and resources. Seven
 * sampled live pages without it named no counsellor and offered one booking
 * href, the bare /book; guides recorded one book_click in 44 days, on
 * sick-days, which has the cards. So the cards are now the template's
 * default, and the list that is kept is the list of pages that do NOT carry
 * them:
 *
 *   - the crisis directory, which is for somebody who needs help now, not a
 *     counsellor's profile;
 *   - becoming-a-counsellor-in-bc, whose reader wants to become one;
 *   - the GENTLE_CTA guides (lib/next-steps.ts) that did not already carry
 *     the gentle-heading cards. Whether a guide about grief, intrusive
 *     thoughts or watching someone drink should show a "who you would talk
 *     to" block is the clinical judgement GENTLE_CTA's comment reserves for
 *     the owner. They stay off until she records, page by page, which of
 *     them get the gentle heading; removing a slug here is that decision.
 *
 * INFO_CARD_PAGES stays as the record of the pages that carried cards before
 * this, which is how the gentle guides with cards (the leave guides) are told
 * apart from the ones without. A test holds that NO_CARDS.guides is exactly
 * GENTLE_CTA minus that list, so neither can move without the other. */
export const NO_CARDS: Readonly<Record<'guides' | 'resources', readonly string[]>> = {
  resources: ['bc-crisis-and-support-directory', 'becoming-a-counsellor-in-bc'],
  guides: [
    'intrusive-thoughts-and-what-they-mean',
    'grief-without-a-timeline',
    'what-trauma-actually-means',
    'when-someone-you-love-is-drinking',
    'supporting-someone-who-is-struggling',
    'when-therapy-isnt-working',
    'signs-it-might-be-time-for-therapy',
    'workplace-bullying-in-bc',
    'anger-that-arrives-too-fast',
  ],
};

export const showsInfoCards = (area: 'guides' | 'resources', slug: string, optIn?: boolean): boolean =>
  Boolean(optIn) || !NO_CARDS[area].includes(slug);

/** What an informational page is about, for deciding who it names. */
export type InfoPage = { language?: string; service?: string; province?: string };

/* Who the cards on an informational page show, and therefore whose next
 * consultation time the closing block prints.
 *
 *   language  -> the audience rule: accepting, bookable, in BC, speaks it
 *                (the Punjabi words page keeps Savneet only);
 *   province  -> accepting and insured to practise there today
 *                (insuredProvinces, so a lapsed policy drops her on the next
 *                render), offering the service or individual work;
 *   service   -> accepting, in BC, offering it (a couples guide shows only
 *                the counsellor who does couples work);
 *   otherwise -> accepting individual clients in BC.
 *
 * The founder is excluded by the accepting flag, never by name. */
export function counsellorsForInfoPage(page: InfoPage): Practitioner[] {
  if (page.language) {
    const speakers = speaking(page.language);
    return page.service ? speakers.filter((p) => p.services.includes(page.service!)) : speakers;
  }
  const service = page.service ?? 'individual-therapy';
  if (page.province) {
    const today = vancouverToday();
    return practitioners.filter(
      (p) => p.acceptingNewClients && insuredProvinces(p, today).includes(page.province!) && p.services.includes(service),
    );
  }
  return counsellorsFor({ bookingService: service });
}

/* THE FEE FOR WHAT THE PAGE IS ABOUT — 1 Oct 2026.
 *
 * 37 of 42 guides stated no fee; a couples or EMDR reader who wanted the
 * price had to find /pricing. This is the one closing line every guide,
 * resource and comparison carries, matched to the page's service and read
 * from the catalogue by Cliniko name, never typed. scripts/price-drift.mjs
 * checks that every name below exists in the fallback catalogue and in
 * Cliniko, so a renamed appointment type fails the build rather than
 * dropping the line. Undefined when a name is missing or priced at zero:
 * no line beats a wrong one. */
export const FEE_LINE_ITEMS = {
  individual: 'Individual Counselling',
  couples: 'Couples Counselling',
  couplesExtended: 'Couples Extended',
  emdr: 'EMDR Intensive',
} as const;

const FEE_TAIL = ', after a free 15-minute consultation; card at booking.';

export function feeLineFor(service: string | undefined, catalog: Catalog): string | undefined {
  const item = (name: string) => {
    const i = catalog.items.find((x) => x.name.toLowerCase() === name.toLowerCase());
    return i && i.cents > 0 ? i : undefined;
  };
  const individual = item(FEE_LINE_ITEMS.individual);
  if (service === 'couples-therapy') {
    const couples = item(FEE_LINE_ITEMS.couples);
    if (!couples) return undefined;
    const ext = item(FEE_LINE_ITEMS.couplesExtended);
    return ext
      ? `Couples sessions are ${money(couples.cents)} for ${couples.minutes} minutes; a ${ext.minutes}-minute extended session is ${money(ext.cents)}${FEE_TAIL}`
      : `Couples sessions are ${money(couples.cents)} for ${couples.minutes} minutes${FEE_TAIL}`;
  }
  if (service === 'emdr-therapy') {
    const emdr = item(FEE_LINE_ITEMS.emdr);
    if (!emdr) return undefined;
    return individual
      ? `EMDR is offered as a ${emdr.minutes}-minute intensive at ${money(emdr.cents)}, or within ${individual.minutes}-minute sessions at ${money(individual.cents)}${FEE_TAIL}`
      : `An EMDR intensive is ${money(emdr.cents)} for ${emdr.minutes} minutes${FEE_TAIL}`;
  }
  return individual ? `Individual sessions are ${money(individual.cents)} for ${individual.minutes} minutes${FEE_TAIL}` : undefined;
}

/** The heading and intro, plain or gentle. No outcome claim, no hours. On a
 *  page written for Alberta, the intro says Alberta: the cards there show
 *  only the counsellor insured to practise in that province. */
export function infoCardCopy(gentle: boolean, province?: string): { heading: string; intro: string } {
  const where = province === 'AB' ? 'in Alberta' : 'across BC';
  return gentle
    ? {
        heading: 'If you want to talk it through with someone',
        intro:
          `Nothing needs deciding today. These are the counsellors taking new clients, by secure video ${where}; the first conversation is a free 15 minutes and carries no obligation.`,
      }
    : {
        heading: 'Who you would talk to',
        intro:
          `Taking new clients and seeing people ${where} by secure video. Each is a Registered Clinical Counsellor; the registration is on the profile and can be checked on the BCACC register.`,
      };
}
