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
 * rather than guessed.
 *
 * ONLY WHAT THE CHOSEN COUNSELLOR OFFERS — 1 Oct 2026 (wf/book-and-cta).
 * /book?with=savneet-singh said "individual $140, couples $175" and the
 * checklist said "couples sessions are 50 or 110" under a counsellor whose
 * roster entry offers no couples work. Each billed type now names the roster
 * service it belongs to, and the page passes the chosen counsellor's
 * `services`; bare /book passes nothing and keeps the practice-wide line. A
 * couples consultation (/book?for=couples) shows the two couples formats and
 * nothing else. */

const BILLED_AS = [
  { name: 'Individual Counselling', label: 'individual', service: 'individual-therapy' },
  { name: 'Couples Counselling', label: 'couples', service: 'couples-therapy' },
] as const;

/* The two couples formats, standard then extended. */
const COUPLES = [
  { name: 'Couples Counselling', label: 'couples' },
  { name: 'Couples Extended', label: 'couples extended' },
] as const;

export type SessionFee = { label: string; fee: string; minutes: number };

const find = (catalog: Catalog, name: string) => {
  const item = catalog.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
  return item && item.cents > 0 ? item : undefined;
};

/** The billed types, limited to `services` (roster slugs) when given. */
export function sessionFees(catalog: Catalog, services?: readonly string[]): SessionFee[] {
  return BILLED_AS.flatMap(({ name, label, service }) => {
    if (services && !services.includes(service)) return [];
    const item = find(catalog, name);
    return item ? [{ label, fee: money(item.cents), minutes: item.minutes }] : [];
  });
}

/** Couples Counselling and Couples Extended, as the catalogue holds them. */
export function couplesFees(catalog: Catalog): SessionFee[] {
  return COUPLES.flatMap(({ name, label }) => {
    const item = find(catalog, name);
    return item ? [{ label, fee: money(item.cents), minutes: item.minutes }] : [];
  });
}

function phrase(fees: SessionFee[]): string | null {
  if (!fees.length) return null;
  const same = fees.every((f) => f.minutes === fees[0]!.minutes);
  const parts = fees.map((f) => `${f.label} ${f.fee}${same ? '' : ` (${f.minutes} minutes)`}`);
  return same ? `${parts.join(', ')}, ${fees[0]!.minutes} minutes${fees.length > 1 ? ' each' : ''}` : parts.join(', ');
}

/** "individual $140, couples $175, 50 minutes each", or null. Short on
 *  purpose: it sits above the calendar on a phone. `services` narrows it to
 *  one counsellor's types; `couples` gives the two couples formats only. */
export function sessionFeesPhrase(
  catalog: Catalog,
  opts: { services?: readonly string[]; couples?: boolean } = {},
): string | null {
  return phrase(opts.couples ? couplesFees(catalog) : sessionFees(catalog, opts.services));
}

/** "Individual sessions are 50 minutes; couples sessions are 50 or 110
 *  minutes", from the catalogue and narrowed the same way. Null when none. */
export function sessionLengthsLine(
  catalog: Catalog,
  opts: { services?: readonly string[]; couples?: boolean } = {},
): string | null {
  const ind = !opts.couples && (!opts.services || opts.services.includes('individual-therapy'))
    ? find(catalog, 'Individual Counselling') : undefined;
  const cpl = opts.couples || !opts.services || opts.services.includes('couples-therapy')
    ? [...new Set(couplesFees(catalog).map((f) => f.minutes))] : [];
  const parts = [
    ind ? `individual sessions are ${ind.minutes} minutes` : '',
    cpl.length ? `couples sessions are ${cpl.join(' or ')} minutes` : '',
  ].filter(Boolean);
  if (!parts.length) return null;
  const line = parts.join('; ');
  return line[0]!.toUpperCase() + line.slice(1);
}
