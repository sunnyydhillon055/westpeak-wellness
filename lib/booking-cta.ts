import { practitioners, insuredProvinces, vancouverToday, type Practitioner } from '@/lib/practitioners';
import { site } from '@/lib/site';
import { counsellorsFor, bookHrefFor } from '@/lib/city-service-page';

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
      ? { href: `${site.bookingPath}?with=${fit[0].slug}`, labelSuffix: '', slug: fit[0].slug }
      : { href: site.bookingPath, labelSuffix: '', slug: undefined };
  }
  if (language) {
    const who = counsellorForLanguage(language, service);
    const name = who?.languages.find((l) => l.tag === language)?.name;
    if (who && name) {
      return {
        href: `${site.bookingPath}?with=${who.slug}`,
        labelSuffix: ` with a ${name}-speaking counsellor`,
        slug: who.slug,
      };
    }
    return { href: site.bookingPath, labelSuffix: '', slug: undefined };
  }
  if (service) {
    const offering = counsellorsFor({ bookingService: service });
    if (offering.length === 1 && offering[0].bookable) {
      return { href: bookHrefFor(offering), labelSuffix: '', slug: offering[0].slug };
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
