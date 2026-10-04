import { practitioners, insuredProvinces, vancouverToday, type Practitioner } from '@/lib/practitioners';
import { site } from '@/lib/site';
import { counsellorsFor, bookHrefFor } from '@/lib/city-service-page';
import type { SlotPerson } from '@/lib/consult-slot';

/* THE HERO BOOKING ACTION, ASSEMBLED FROM DATA — 1 Oct 2026.
 *
 * WHAT WAS THERE. The city, service and audience templates each opened with
 * the same button: "Book a free consultation", a plain <Link> to /book. Three
 * things were wrong with it for a page whose job is a booked session.
 *
 *   1. It reported nothing. BookLink exists so that every booking click is
 *      counted by location, and the one above the fold on the money pages
 *      was the one click the analytics could not see.
 *   2. It said the same words on sixty pages. A reader on the Kelowna page
 *      or the EMDR page had just been told, in the heading, exactly what the
 *      page is about, and the button then went generic. The label now names
 *      the page the way the heading does.
 *   3. On the Punjabi and Tagalog pages it sent the reader to the practice-
 *      wide calendar, which lists a counsellor who does not speak the
 *      language the page just promised. /book narrows to one calendar with
 *      ?with=, and the page knows which language it is for, so the link can
 *      say who the consultation is with and go straight to that calendar.
 *
 * WHY THE NAME IS NEVER IN THE COPY. The label says "a Punjabi-speaking
 * counsellor", not a person. The roster decides who that is at build time:
 * the first counsellor who is accepting, bookable and speaks the language.
 * If the roster changes, the link follows it and the words still hold. The
 * founder speaks Punjabi and is neither accepting nor bookable, so she is
 * excluded by the same rule that picks everyone else, not by name — the
 * name-guard in expansion-verify.mjs would catch a slip, but the point is
 * that there is nothing for it to catch.
 *
 * WHEN NOBODY ACCEPTING SPEAKS THE LANGUAGE. The button falls back to the
 * page's ordinary label and the practice-wide calendar. A page must not
 * promise a Punjabi-speaking consultation that no calendar can deliver, and
 * a test holds that every page carrying a language tag resolves today. */

/** BCP-47 tag as the roster spells it: 'pa' for Punjabi, 'tl' for Tagalog. */
export type LanguageTag = 'pa' | 'tl';

/* The counsellor a language page should book with, or undefined. Accepting
   AND bookable: a counsellor who takes clients but books by reply (the
   founder's arrangement) has no online calendar for ?with= to open.

   `service`, when given, must also be one she offers. Added 1 Oct 2026: the
   Punjabi-speaking couples page sent readers to the one accepting Punjabi
   speaker, whose services are individual counselling only, so the button
   promised a couples consultation in Punjabi that her calendar cannot hold.
   With the service in the question, nobody fits and the page falls back to
   its own label and the practice calendar, which is the honest answer. */
/* The language's own service page (/services/tagalog-counselling) is about
   the language, not a separate service type: speaking it is offering it.
   Without this the roster's spelling decides — Camille's entry does not list
   'tagalog-counselling' — and the Tagalog service page would lose its
   counsellor. Integration of wf/services and wf/language, 1 Oct 2026. */
const LANGUAGE_SERVICE: Record<string, string> = { pa: 'punjabi-counselling', tl: 'tagalog-counselling' };

export const counsellorForLanguage = (tag: string, service?: string): Practitioner | undefined =>
  practitioners.find(
    (p) =>
      p.acceptingNewClients &&
      p.bookable &&
      p.languages.some((l) => l.tag === tag) &&
      (!service || service === LANGUAGE_SERVICE[tag] || p.services.includes(service))
  );

export type BookingCta = {
  href: string;
  label: string;
  /** Set when the CTA is attached to one counsellor's calendar. */
  practitioner?: Practitioner;
};

/* WHICH CALENDAR A SERVICE BOOKS INTO — 1 Oct 2026.
 *
 * The service pages routed on language alone, so /services/couples-therapy
 * opened the practice-wide /book, which shows a counsellor who does not offer
 * couples work beside the one who does. The city-service template already
 * answered this from the roster (lib/city-service-page.ts); this is the same
 * rule exported once, so the service, card and language templates cannot
 * each grow their own.
 *
 *   language set, and somebody accepting and bookable speaks it (and
 *   offers the service, when one is given)
 *       -> that counsellor's calendar, label suffix names the language
 *   language set, and nobody fits
 *       -> bare /book (wf/language, 1 Oct 2026: a language page never
 *          narrows to a counsellor who does not speak its language)
 *   otherwise, exactly one accepting BC counsellor offers the service and
 *   she has an online calendar
 *       -> her calendar, no suffix (the label never names a person)
 *   otherwise
 *       -> bare /book, where the reader chooses
 *
 * `labelSuffix` is the words to append after "Book a free consultation", or
 * '' when the page's own label should stand. `slug` is the counsellor the
 * link is narrowed to, undefined when it is not narrowed. */
export type BookingTarget = { href: string; labelSuffix: string; slug: string | undefined };

/* A LINK THAT NAMES THE COUNSELLOR OPENS HER CALENDAR — 1 Oct 2026
 * (wf/book-and-cta). Every narrowed href below is built by bookHrefFor in
 * lib/city-service-page.ts, so a couples service adds for=couples on every
 * route alike, and every one ends in #calendar, which
 * components/SchedulerGate reads as "already asked for": the frame opens on
 * arrival and is counted as scheduler_open `hash`. Somebody who tapped "Book
 * a free consultation with a Punjabi-speaking counsellor" on a money page
 * otherwise landed about three phone screens above "Show available times".
 * The calendar section repeats who the booking is with and that it is online
 * only, so nothing the reader needs is skipped. Bare /book never carries the
 * hash: its gate and its Lighthouse figure are as decided. */

/* A PROVINCE, 1 Oct 2026. The two Alberta resources sent their buttons to the
   bare /book, which also lists a counsellor insured for BC only. With a
   province the question is who is accepting, bookable, insured to practise
   there TODAY (insuredProvinces, so a lapsed policy drops her on the next
   render rather than the next build), and, when given, speaks the language
   and offers the service. Exactly one gives her calendar; none or several
   gives the bare /book, where the reader chooses. No label suffix: the page
   already says it is about Alberta, and the label never names a person. */
export const counsellorsInProvince = (province: string, service?: string, language?: string): Practitioner[] =>
  practitioners.filter(
    (p) =>
      p.acceptingNewClients &&
      p.bookable &&
      insuredProvinces(p, vancouverToday()).includes(province) &&
      (!service || p.services.includes(service)) &&
      (!language || p.languages.some((l) => l.tag === language)),
  );

export function bookingFor(service: string | undefined, language?: string, province?: string): BookingTarget {
  if (province) {
    const fit = counsellorsInProvince(province, service, language);
    return fit.length === 1
      ? { href: bookHrefFor([fit[0]], service), labelSuffix: '', slug: fit[0].slug }
      : { href: site.bookingPath, labelSuffix: '', slug: undefined };
  }
  if (language) {
    const who = counsellorForLanguage(language, service);
    const name = who?.languages.find((l) => l.tag === language)?.name;
    if (who && name) {
      return {
        href: bookHrefFor([who], service),
        labelSuffix: ` with a ${name}-speaking counsellor`,
        slug: who.slug,
      };
    }
    return { href: site.bookingPath, labelSuffix: '', slug: undefined };
  }
  if (service) {
    const offering = counsellorsFor({ bookingService: service });
    if (offering.length === 1 && offering[0].bookable) {
      return { href: bookHrefFor(offering, service), labelSuffix: '', slug: offering[0].slug };
    }
  }
  return { href: site.bookingPath, labelSuffix: '', slug: undefined };
}

/* `fallback` is the page-specific label the template would show anyway —
   "Book a free consultation in Kelowna". A language tag replaces it with the
   counsellor-attached version and the narrowed /book URL. A `service` (its
   slug, as the roster spells it in `services`) narrows the URL when only one
   counsellor offers it, and keeps the page's own label. A `province` ('AB')
   narrows to the one counsellor insured there, as bookingFor says. */
export function bookingCtaFor(opts: { language?: string; service?: string; province?: string; fallback: string }): BookingCta {
  const { language, service, province, fallback } = opts;
  const t = bookingFor(service, language, province);
  const practitioner = t.slug ? practitioners.find((p) => p.slug === t.slug) : undefined;
  return {
    href: t.href,
    label: t.labelSuffix ? `Book a free consultation${t.labelSuffix}` : fallback,
    ...(practitioner ? { practitioner } : {}),
  };
}

/* "EMDR Therapy" → "EMDR therapy"; "Couples Therapy" → "couples therapy".
   Title Case belongs in a heading, not mid-sentence on a button. A word that
   is all capitals is an initialism and keeps them. */
export const serviceNoun = (name: string): string =>
  name
    .split(' ')
    .map((w) => (w.length > 1 && w === w.toUpperCase() ? w : w.toLowerCase()))
    .join(' ');

/* THE OTHER ROUTE, FOR PEOPLE WHOSE DAYS DO NOT MATCH THE CALENDAR — 1 Oct
 * 2026 (wf/book-and-cta). /book has carried an "Ask for a time" form
 * (#ask-for-a-time) since 18 Sep, and no page outside /book linked to it. The
 * shift and rotation audience pages now do, narrowed to the counsellor the
 * page's own button books with when there is one, so the request reaches her
 * by name. The anchor is not #calendar, so SchedulerGate stays shut and the
 * reader lands on the form. */
export const ASK_FOR_A_TIME = '#ask-for-a-time';
export const askForTimeHref = (slug?: string): string =>
  slug ? `${site.bookingPath}?with=${slug}${ASK_FOR_A_TIME}` : `${site.bookingPath}${ASK_FOR_A_TIME}`;

/* WHO AN AUDIENCE PAGE'S NEXT-CONSULTATION LINE NAMES — 1 Oct 2026. The same
 * question bookingFor asks, without the "exactly one" step: everyone accepting
 * and bookable who speaks the page's language (when it has one) AND offers its
 * service (when it has one). A Punjabi-speaking couples page gets nobody,
 * because nobody accepting does both, and then prints no line rather than
 * offering a time with someone who does not do the work. */
export const audienceConsultSlugs = (a: { language?: string; service?: string }): string[] =>
  practitioners
    .filter(
      (p) =>
        p.acceptingNewClients &&
        p.bookable &&
        (!a.language || p.languages.some((l) => l.tag === a.language)) &&
        (!a.service || (a.language && a.service === LANGUAGE_SERVICE[a.language]) || p.services.includes(a.service)),
    )
    .map((p) => p.slug);

/* WHO A CONSULTATION SLOT MAY NAME — 3 Oct 2026 (items 429 and 409).
 *
 * The roster half of every next-consultation line, decided on the server so
 * the browser half (components/NextConsultSlot.tsx) receives first names and
 * links and never the roster. Accepting, bookable online, and narrowed by
 * `slugs` and `language` exactly as lib/next-consult.ts narrows them, in
 * roster order. `service` only shapes the link (for=couples). */
export function consultPeople({ slugs, language, service }: { slugs?: readonly string[]; language?: string; service?: string }): SlotPerson[] {
  return practitioners
    .filter(
      (p) =>
        p.acceptingNewClients &&
        p.bookable &&
        (!slugs || slugs.includes(p.slug)) &&
        (!language || p.languages.some((l) => l.tag === language)),
    )
    .map((p) => ({ slug: p.slug, first: p.name.split(' ')[0]!, href: bookHrefFor([p], service) }));
}

/* THE ARTICLE HERO NAMES WHO YOU WOULD TALK TO — 3 Oct 2026 (item 409).
 *
 * On the live guides and resources a reader went 900 to 2,700 words past
 * the H1 before any counsellor was named (workplace mental health 2,723,
 * EI 1,730, the Punjabi words resource 1,142, sick days 905), while the home
 * hero, which names them and their next free day, earned 12 of 38
 * book_clicks. The article heroes now do the same: the day list under the
 * button (components/NextConsultLine.tsx, HeroNextDays), and when the page
 * fits exactly one counsellor the button names her and opens her calendar:
 * "Book a free consultation with Savneet (English and Punjabi)". Her first
 * name and her languages come from the roster, so the words follow it; the
 * founder is never accepting or bookable and so is never named here. */
export function heroBookingCta(cta: BookingCta, people: readonly SlotPerson[]): BookingCta {
  if (people.length !== 1) return cta;
  const p = practitioners.find((x) => x.slug === people[0]!.slug);
  if (!p) return cta;
  const langs = p.languages.map((l) => l.name);
  const list = langs.length > 1 ? `${langs.slice(0, -1).join(', ')} and ${langs[langs.length - 1]}` : langs[0];
  return {
    href: people[0]!.href,
    label: `Book a free consultation with ${people[0]!.first}${list ? ` (${list})` : ''}`,
    practitioner: p,
  };
}
