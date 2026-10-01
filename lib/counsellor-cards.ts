import { practitioners, withLetters, type Practitioner } from '@/lib/practitioners';
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
   accepting individual clients in BC. */
export const counsellorsForAudience = (a: { language?: string }): Practitioner[] =>
  a.language ? speaking(a.language) : counsellorsFor({ bookingService: 'individual-therapy' });

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
  return item ? `Individual sessions are ${money(item.cents)} for ${item.minutes} minutes, after a free 30-minute consultation.` : undefined;
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
