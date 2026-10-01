import type { Inbound } from '@/lib/inbound';
import { practitioners, withLetters, type Practitioner } from '@/lib/practitioners';
import { routeInbound, fitsAnswers } from '@/lib/inbound-routing';
import { money, type Catalog } from '@/lib/cliniko-catalog';
import { site } from '@/lib/site';
import type { ReplyContext } from '@/lib/reply-templates';

/* WHAT THE /admin REPLY DRAFTS KNOW ABOUT THE ENQUIRY — 1 Oct 2026.
 *
 * The 'book' draft linked a bare /book (two calendars, choose one) and was
 * signed by nobody; the 'full' draft went straight to outside resources even
 * when the other counsellor in the practice could take the person. Both are
 * now built from the same routing the alert used (lib/inbound-routing.ts), so
 * the draft is written by the counsellor the enquiry went to, links her own
 * calendar, and states the fee from the catalogue. Still mailto: drafts; a
 * person reads, edits and sends every one of them, or does not.
 */

const calendarFor = (p: Practitioner) =>
  `${site.domain}${site.bookingPath}?with=${p.slug}#calendar`;

/* The session the enquiry is most likely asking about, priced from the
   catalogue. Null when the catalogue has no such item, and then the draft
   says nothing about money rather than a guess. */
export function feeLineFor(looking: string | undefined, catalog: Catalog): string | null {
  const name = looking === 'couples' ? 'couples counselling' : 'individual counselling';
  const item = catalog.items.find((i) => i.name.toLowerCase() === name && i.cents > 0);
  if (!item) return null;
  const kind = looking === 'couples' ? 'A couples session' : 'An individual session';
  return `${kind} after the consultation is ${money(item.cents)} for ${item.minutes} minutes; the consultation itself is free. The card is taken when you book, and whether an extended health plan reimburses it depends on the plan.`;
}

export function replyContextFor(
  i: Inbound,
  catalog: Catalog,
  roster: Practitioner[] = practitioners
): ReplyContext {
  const route = routeInbound(i);
  const routed = route.practitioners.length === 1
    ? roster.find((p) => p.slug === route.practitioners[0])
    : undefined;
  const signer = routed;

  /* Somebody else in the practice who is accepting, has a calendar, and fits
     what the person asked for. Offered in the 'full' draft before anything
     outside the practice. */
  const other = signer
    ? roster.find((p) =>
        p.slug !== signer.slug && p.acceptingNewClients && p.bookable && fitsAnswers(p, i))
    : undefined;

  return {
    slug: signer?.slug,
    signer: signer ? withLetters(signer) : undefined,
    link: signer?.bookable ? calendarFor(signer) : `${site.domain}${site.bookingPath}`,
    feeLine: feeLineFor(i.looking, catalog) ?? undefined,
    other: other ? { who: withLetters(other), link: calendarFor(other) } : undefined,
  };
}
