import { practitioners, withLetters, type Practitioner } from '@/lib/practitioners';
import { bookHrefFor } from '@/lib/city-service-page';
import { languagePhrase, esc, btn } from '@/lib/booking-mail';
import { money, type Catalog } from '@/lib/cliniko-catalog';
import { site } from '@/lib/site';

/* WHO YOU WOULD SEE, IN THE LEAD-MAGNET EMAILS — 1 Oct 2026.
 *
 * Every booking link in the lead path was a bare /book, which opens on a
 * page asking the reader to choose between two counsellors they have never
 * heard of. The emails now name them, one line each, from the accepting and
 * bookable roster: name and letters, languages, provinces and services, each
 * linking her own calendar (?with=, the same narrowing /book already does).
 *
 * Built from the roster at send time, so a counsellor who stops accepting
 * drops out of the next email without anybody editing one. The founder is
 * excluded by the same rule as everybody else (not accepting, not bookable),
 * not by name. No registration numbers (those live on the profile pages), no
 * claims about outcomes, no urgency.
 */

const SERVICE_WORD: Record<string, string> = {
  'individual-therapy': 'individual',
  'couples-therapy': 'couples',
  'emdr-therapy': 'EMDR',
  'family-counselling': 'family',
};

const PROVINCE_WORD: Record<string, string> = { BC: 'British Columbia', AB: 'Alberta' };

const andList = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

export type RosterLine = {
  slug: string;
  /** "Camille", for a button label or a preview line. */
  firstName: string;
  /** "Camille Granda, RCC, CCC" */
  who: string;
  /** Absolute link to her own free-consultation calendar on /book. */
  href: string;
  /** "English or Tagalog, or both · British Columbia and Alberta · individual, couples, EMDR and family counselling" */
  detail: string;
};

export function rosterLines(list: Practitioner[] = practitioners): RosterLine[] {
  return list
    .filter((p) => p.acceptingNewClients && p.bookable)
    .map((p) => {
      const services = p.services.map((s) => SERVICE_WORD[s]).filter((s): s is string => Boolean(s));
      const provinces = p.provinces.map((c) => PROVINCE_WORD[c] ?? c);
      return {
        slug: p.slug,
        firstName: p.name.split(/\s+/)[0],
        who: withLetters(p),
        /* bookHrefFor carries the #calendar hash itself since 1 Oct 2026. */
        href: `${site.domain}${bookHrefFor([p])}`,
        detail: [
          languagePhrase(p.languages),
          andList(provinces),
          services.length ? `${andList(services)} counselling` : '',
        ].filter(Boolean).join(' · '),
      };
    });
}

/** Plain-text block: one counsellor per paragraph, the link under her name. */
export function rosterText(lines: RosterLine[] = rosterLines()): string {
  return lines.map((l) => `  ${l.who}\n  ${l.detail}\n  ${l.href}`).join('\n\n');
}

/** HTML block: one counsellor per line, her name linking her calendar. */
export function rosterHtml(lines: RosterLine[] = rosterLines()): string {
  return lines
    .map((l) =>
      `<p style="margin:0 0 12px;font-size:15px;line-height:1.55;">` +
      `<a href="${esc(l.href)}" style="color:#3d6c92;font-weight:600;">${esc(l.who)}</a><br>` +
      `<span style="color:#545e69;font-size:14px;">${esc(l.detail)}</span></p>`
    )
    .join('');
}

/* HTML block as buttons, one per counsellor, for the end of lead email 1
   (lib/inbound-mail.ts), 1 Oct 2026: her name in bold text was the only way
   to her calendar, and a render of the three one-pagers found no button in
   any of them. "Free 30-minute call with Camille", the same ?with= calendar,
   and the one line about her underneath. */
export function rosterButtons(lines: RosterLine[] = rosterLines()): string {
  return lines
    .map((l) =>
      `<p style="margin:0 0 6px;font-size:14px;line-height:1.55;color:#545e69;">${esc(l.who)} · ${esc(l.detail)}</p>` +
      btn(l.href, `Free 30-minute call with ${l.firstName}`)
    )
    .join('');
}

/* The one fee line email 3 carries, read from the catalogue at send time:
 * the individual session fee, the card taken at booking, and coverage set by
 * the plan. Null when the catalogue has no individual fee, in which case the
 * email says nothing about money rather than a guess. */
export function individualFeeLine(catalog: Catalog): string | null {
  const item = catalog.items.find((i) => i.name.toLowerCase() === 'individual counselling' && i.cents > 0);
  if (!item) return null;
  return `An individual session is ${money(item.cents)} for ${item.minutes} minutes. The card is taken when you book, and whether an extended health plan reimburses it depends on the plan.`;
}
