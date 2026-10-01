import { money, type Catalog } from '@/lib/cliniko-catalog';

/* WHAT A SESSION COSTS AFTER THE CONSULT, ON /book — 1 Oct 2026.
 *
 * /book said the consultation is free and then sent anyone who wanted the
 * next number to /pricing, one of the site's top lead sources, which means
 * people were leaving the booking page to find it. The city-service pages
 * already state the catalogue fee (DECISIONS, "A city-service page names who
 * you would see, what it costs"); this does the same here, read from the
 * Cliniko catalogue by appointment-type name, so there is no new place a
 * dollar figure is typed. A type the catalogue does not hold is left out
 * rather than guessed. */

const BILLED_AS = [
  { name: 'Individual Counselling', label: 'individual' },
  { name: 'Couples Counselling', label: 'couples' },
] as const;

export type SessionFee = { label: string; fee: string; minutes: number };

export function sessionFees(catalog: Catalog): SessionFee[] {
  return BILLED_AS.flatMap(({ name, label }) => {
    const item = catalog.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
    return item && item.cents > 0 ? [{ label, fee: money(item.cents), minutes: item.minutes }] : [];
  });
}

/** "individual $140, couples $175, 50 minutes each", or null. Short on
 *  purpose: it sits above the calendar on a phone. */
export function sessionFeesPhrase(catalog: Catalog): string | null {
  const fees = sessionFees(catalog);
  if (!fees.length) return null;
  const same = fees.every((f) => f.minutes === fees[0]!.minutes);
  const parts = fees.map((f) => `${f.label} ${f.fee}${same ? '' : ` (${f.minutes} minutes)`}`);
  return same ? `${parts.join(', ')}, ${fees[0]!.minutes} minutes${fees.length > 1 ? ' each' : ''}` : parts.join(', ');
}
