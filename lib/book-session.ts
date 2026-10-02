import { practitioners, type Practitioner } from '@/lib/practitioners';
import { site, bookingsPaidUrlFor } from '@/lib/site';
import { SESSION_TEMPLATES, type EmailTemplate } from '@/lib/booking-mail';

/* WHERE /book/session SENDS A CLICK, AND WHAT IT COUNTS — 1 Oct 2026.
 *
 * The paid-calendar links in the consult follow-up, the after-session note,
 * the missed-session note and the reactivation note used to point straight
 * at Cliniko, so a click never touched the site and nothing could say which
 * automated email opens a paid calendar. They now point here first. The
 * route (app/book/session/route.ts) counts one book_click with detail
 * `email:<template>` (plus `/<slug>` when a counsellor is named) and 302s to
 * the calendar bookingsPaidUrlFor() would have produced anyway.
 *
 * Every parameter is checked against a list the site already holds, and a
 * value that fails is dropped rather than passed on:
 *   with  a roster slug of someone with a Cliniko id who is on the online
 *         calendar; otherwise the practice-wide paid calendar
 *   type  a paid appointment type, judged by bookingsPaidUrlFor() itself
 *         (it narrows only to PAID_TYPES); otherwise all of her paid types
 *   from  one of SESSION_TEMPLATES; otherwise nothing is counted
 * The redirect target is therefore always a Cliniko paid-calendar URL built
 * here, never anything taken from the request. Pure, for the test. */

export type SessionTarget = {
  /** Where to send the person: always a paid-calendar URL. */
  location: string;
  /** The book_click detail to count, or null to count nothing. */
  detail: string | null;
};

const onCalendar = (p: Practitioner | undefined): p is Practitioner & { clinikoPractitionerId: string } =>
  Boolean(p && p.bookable && p.clinikoPractitionerId);

export function resolveBookSession(params: URLSearchParams, roster: Practitioner[] = practitioners): SessionTarget {
  const slug = params.get('with') ?? '';
  const pr = roster.find((p) => p.slug === slug);
  const who = onCalendar(pr) ? pr : undefined;

  const rawType = params.get('type') ?? '';
  /* A paid type is exactly one that narrows the practice-wide URL. */
  const type = /^\d{1,24}$/.test(rawType) && bookingsPaidUrlFor(undefined, rawType) !== site.bookingsPaidUrl
    ? rawType
    : undefined;

  const from = params.get('from') ?? '';
  const template = (SESSION_TEMPLATES as readonly string[]).includes(from) ? (from as EmailTemplate) : null;

  return {
    location: bookingsPaidUrlFor(who?.clinikoPractitionerId, type),
    detail: template ? `email:${template}${who ? `/${who.slug}` : ''}` : null,
  };
}
