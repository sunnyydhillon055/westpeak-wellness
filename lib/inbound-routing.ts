import { practitioners, type Practitioner } from './practitioners.ts';
import { site } from './site.ts';
import type { Inbound } from './inbound.ts';
import { counsellorsFor } from './city-service-page.ts';

/* ============================================================================
   WHO AN ENQUIRY GOES TO — 11 Sep 2026, owner's instruction.
   ----------------------------------------------------------------------------
   Until now every alert went to info@ alone, and 41 messages sat there
   unanswered. Each counsellor now has an `alertEmail` on the roster and an
   enquiry is routed to the counsellor it is for, with info@ always in copy so
   the practice keeps one complete record.

   The signal, in order of confidence:
     1. the enquiry names a counsellor (?with= on /book, or a counsellor page);
     2. the page it came from is in a language one counsellor works in;
     3. the message is written in Gurmukhi;
     4. otherwise every counsellor taking new clients gets it, and whoever
        answers first answers.
   A counsellor with no alertEmail is never chosen, and a counsellor who is
   not accepting is never chosen — an enquiry for someone on leave falls
   through to the ones who are working.
   ========================================================================= */

export type InboundRoute = { to: string[]; cc: string[]; practitioners: string[] };

const GURMUKHI = /[਀-੿]/;
const BAYBAYIN_OR_TAGALOG_WORDS = /\b(ako|ang|mga|hindi|salamat|kumusta|po\b|opo)\b/i;

const accepting = (): Practitioner[] => practitioners.filter((p) => p.acceptingNewClients && p.alertEmail);

const speaks = (p: Practitioner, tag: string) => p.languages.some((l) => l.tag === tag);

/* WHAT THE THREE CHOICES SAY ABOUT WHO FITS — 1 Oct 2026.
 *
 * The enquiry form has asked "what are you looking for" and "where are you"
 * since 25 Sep, and routing never read either: all ten human enquiries went
 * to both counsellors, including the ones only one of them could take. The
 * answers are now a step of their own, between a named counsellor and the
 * page's language, and they are read against the roster rather than against
 * names: a language answer asks who speaks it, a service answer asks
 * counsellorsFor() who offers it, and Alberta asks who
 * may see clients there. Change the roster and the routing follows.
 *
 * Exported because the /admin reply drafts ask the same question ("who else
 * fits this enquiry?") and must not grow a second answer to it. */
const LOOKING_SERVICE: Record<string, string> = {
  couples: 'couples-therapy',
  trauma: 'emdr-therapy',
  family: 'family-counselling',
};
const LOOKING_LANGUAGE: Record<string, string> = { punjabi: 'pa', tagalog: 'tl' };

export function fitsAnswers(
  p: Practitioner,
  answers: Pick<Inbound, 'looking' | 'where'>
): boolean {
  const lang = LOOKING_LANGUAGE[answers.looking ?? ''];
  /* Any accepting counsellor who speaks it, bookable or not: a reply can be
     written by somebody who takes clients by email. (counsellorForLanguage()
     in lib/booking-cta.ts answers only for the bookable, which is the right
     question for a button and the wrong one for who answers a message.) */
  if (lang && !speaks(p, lang)) return false;
  const service = LOOKING_SERVICE[answers.looking ?? ''];
  if (service && !counsellorsFor({ bookingService: service }).some((c) => c.slug === p.slug)) return false;
  if (answers.where === 'ab' && !p.provinces.includes('AB')) return false;
  return true;
}

export function routeInbound(item: Pick<Inbound, 'practitioner' | 'source' | 'message' | 'name' | 'looking' | 'where'>): InboundRoute {
  const pool = accepting();
  const cc = [site.email];
  const pick = (ps: Practitioner[]): InboundRoute => ({
    to: ps.map((p) => p.alertEmail!),
    cc,
    practitioners: ps.map((p) => p.slug),
  });

  /* 1. Named. */
  if (item.practitioner) {
    const named = pool.find((p) => p.slug === item.practitioner);
    if (named) return pick([named]);
  }
  const src = String(item.source ?? '');
  const bySlug = pool.find((p) => src.includes(`/practitioners/${p.slug}`));
  if (bySlug) return pick([bySlug]);

  /* 1b. The form's answers, when they narrow the pool. An answer nobody on
     the roster fits (Punjabi in Alberta, say) narrows nothing, and the later
     steps decide as before. */
  if (item.looking || item.where) {
    const fits = pool.filter((p) => fitsAnswers(p, item));
    if (fits.length > 0 && fits.length < pool.length) return pick(fits);
  }

  /* 2. The page's language. */
  const lang =
    src === '/punjabi' || src.startsWith('/punjabi/') || src.startsWith('/punjabi-counselling') || /\/pa$/.test(src)
      ? 'pa'
      : src === '/tagalog' || src.startsWith('/tagalog/') || src.startsWith('/tagalog-counselling') || /\/tl$/.test(src)
        ? 'tl'
        : undefined;
  if (lang) {
    const ps = pool.filter((p) => speaks(p, lang));
    if (ps.length) return pick(ps);
  }

  /* 3. The message's script. */
  const text = `${item.name ?? ''} ${item.message ?? ''}`;
  if (GURMUKHI.test(text)) {
    const ps = pool.filter((p) => speaks(p, 'pa'));
    if (ps.length) return pick(ps);
  }
  if (BAYBAYIN_OR_TAGALOG_WORDS.test(text)) {
    const ps = pool.filter((p) => speaks(p, 'tl'));
    if (ps.length) return pick(ps);
  }

  /* 4. Everyone taking new clients; info@ if nobody has an alert address. */
  return pool.length ? pick(pool) : { to: [site.email], cc: [], practitioners: [] };
}
