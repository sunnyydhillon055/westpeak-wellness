import { practitioners, type Practitioner } from '@/lib/practitioners';
import { site } from '@/lib/site';

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
   founder's arrangement) has no online calendar for ?with= to open. */
export const counsellorForLanguage = (tag: string): Practitioner | undefined =>
  practitioners.find(
    (p) => p.acceptingNewClients && p.bookable && p.languages.some((l) => l.tag === tag)
  );

export type BookingCta = {
  href: string;
  label: string;
  /** Set when the CTA is attached to one counsellor's calendar. */
  practitioner?: Practitioner;
};

/* `fallback` is the page-specific label the template would show anyway —
   "Book a free consultation in Kelowna". A language tag replaces it with the
   counsellor-attached version and the narrowed /book URL. */
export function bookingCtaFor(opts: { language?: string; fallback: string }): BookingCta {
  const { language, fallback } = opts;
  if (language) {
    const who = counsellorForLanguage(language);
    const name = who?.languages.find((l) => l.tag === language)?.name;
    if (who && name) {
      return {
        href: `${site.bookingPath}?with=${who.slug}`,
        label: `Book a free consultation with a ${name}-speaking counsellor`,
        practitioner: who,
      };
    }
  }
  return { href: site.bookingPath, label: fallback };
}

/* "EMDR Therapy" → "EMDR therapy"; "Couples Therapy" → "couples therapy".
   Title Case belongs in a heading, not mid-sentence on a button. A word that
   is all capitals is an initialism and keeps them. */
export const serviceNoun = (name: string): string =>
  name
    .split(' ')
    .map((w) => (w.length > 1 && w === w.toUpperCase() ? w : w.toLowerCase()))
    .join(' ');
