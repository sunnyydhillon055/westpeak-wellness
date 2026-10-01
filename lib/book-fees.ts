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
  { name: 'Individual Counselling', label: 'individual sessions' },
  { name: 'Couples Counselling', label: 'couples sessions' },
] as const;

export type SessionFee = { label: string; fee: string; minutes: number };

export function sessionFees(catalog: Catalog): SessionFee[] {
  return BILLED_AS.flatMap(({ name, label }) => {
    const item = catalog.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
    return item && item.cents > 0 ? [{ label, fee: money(item.cents), minutes: item.minutes }] : [];
  });
}

/** "individual sessions are $140 for 50 minutes, couples sessions $175 for 50 minutes", or null. */
export function sessionFeesPhrase(catalog: Catalog): string | null {
  const fees = sessionFees(catalog);
  if (!fees.length) return null;
  return fees
    .map((f, i) => `${f.label}${i === 0 ? ' are' : ''} ${f.fee} for ${f.minutes} minutes`)
    .join(', ');
}
