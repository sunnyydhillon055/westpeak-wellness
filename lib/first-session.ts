import { bookingsPaidUrlFor, site } from '@/lib/site';
import type { Catalog } from '@/lib/cliniko-catalog';
import { money } from '@/lib/cliniko-catalog';
import type { Practitioner } from '@/lib/practitioners';

/* "ALREADY SURE? START WITH A FIRST SESSION" — 1 Oct 2026, built behind
 * site.directFirstSession, which stays false until the owner records it.
 *
 * WHY. The paid calendar embed is touched by 63.6% of the people who reach it
 * against 45.7% for the consultation embed (funnel.md, section 2), and until
 * now a fee and a paid calendar were shown only after the consultation or to
 * existing clients. Someone who has already decided gets one secondary row,
 * under the consultation, that books a first session with her directly.
 *
 * WHAT IT MAY SAY. The fee and the minutes come from the Cliniko catalogue
 * only. The consultation stays the recommendation for anyone unsure, the card
 * is taken at booking, and the 24-hour rule is worded as /pricing words it.
 * Individual counselling for every accepting, bookable counsellor who offers
 * it; couples only for a slug the owner adds to FIRST_SESSION_COUPLES, which
 * is empty until she does. Server-side only: this reads the roster's shape
 * and the catalogue, and the page passes plain strings to the row. */

/** Counsellors whose couples first session may also be booked directly.
 *  Empty until the owner includes it (item 211: Camille, if she says so). */
export const FIRST_SESSION_COUPLES: readonly string[] = [];

export type FirstSessionOffer = { label: string; fee: string; minutes: number; href: string };

const item = (c: Catalog, name: string) =>
  c.items.find((i) => i.name.toLowerCase() === name.toLowerCase() && i.cents > 0);

/** The first sessions she can be booked for directly; empty while the flag is
 *  off, for anyone not taking new clients or not on the online calendar, and
 *  for a type the catalogue does not price. */
export function firstSessionOffers(
  p: Pick<Practitioner, 'slug' | 'services' | 'acceptingNewClients' | 'bookable' | 'clinikoPractitionerId' | 'role'>,
  catalog: Catalog,
  enabled: boolean = site.directFirstSession,
  couples: readonly string[] = FIRST_SESSION_COUPLES,
): FirstSessionOffer[] {
  if (!enabled || !p.acceptingNewClients || !p.bookable || !p.clinikoPractitionerId) return [];
  if (/founder/i.test(p.role)) return [];
  const wanted = [
    ...(p.services.includes('individual-therapy') ? [{ name: 'Individual Counselling', label: 'individual session' }] : []),
    ...(p.services.includes('couples-therapy') && couples.includes(p.slug) ? [{ name: 'Couples Counselling', label: 'couples session' }] : []),
  ];
  return wanted.flatMap((w) => {
    const i = item(catalog, w.name);
    return i
      ? [{ label: w.label, fee: money(i.cents), minutes: i.minutes, href: bookingsPaidUrlFor(p.clinikoPractitionerId, i.id) }]
      : [];
  });
}

/** The sentence under the row: the consultation still recommended, card at
 *  booking, and the cancellation rule as /pricing states it. */
export function firstSessionNote(catalog: Catalog): string {
  const consult = catalog.items.find((i) => i.name.toLowerCase() === 'initial consultation' && i.cents === 0);
  const minutes = consult ? `${consult.minutes}-minute ` : '';
  return `If you are unsure, the free ${minutes}consultation is still recommended. The card is taken at booking, and cancelling with at least ${site.cancellationHours} hours’ notice refunds the fee in full.`;
}
