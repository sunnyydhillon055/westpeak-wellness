import { practitioners, type Practitioner } from './practitioners.ts';
import { site } from './site.ts';
import type { Inbound } from './inbound.ts';

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

export function routeInbound(item: Pick<Inbound, 'practitioner' | 'source' | 'message' | 'name'>): InboundRoute {
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
