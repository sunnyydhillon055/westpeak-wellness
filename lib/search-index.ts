import { services } from '@/lib/services';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { approaches } from '@/lib/approaches';
import { glossary } from '@/lib/glossary';
import { tools } from '@/lib/tools';
import { conditions, getCityTopic } from '@/lib/conditions';
import { locations } from '@/lib/locations';
import { pairs } from '@/lib/city-services';
import { practitioners, withLetters } from '@/lib/practitioners';
import { SYNONYM_GROUPS, PHRASE_PAGES } from '@/lib/search-synonyms';

/* The search index, assembled from the same data the pages render from.
 *
 * Built at request time from imports rather than crawled or hand-maintained, so
 * it cannot drift: add a guide and it is searchable on the next build with no
 * separate step to forget.
 *
 * THE PAGES THAT BOOK, 1 Oct 2026. The index held the informational
 * templates only (178 entries against 315 built URLs), so "camille",
 * "savneet", "abbotsford", "surrey" and "couples counselling abbotsford" all
 * returned nothing, and "price" returned one comparison. It now also holds the
 * counsellors who are accepting clients, the city hubs with the communities
 * each serves, the three conditions (pointing at the service that delivers
 * them), and /pricing, /book, /faq, /answers and the two English language
 * hubs. `service` is set where an entry IS a bookable service, so the results
 * page can put the fee, who offers it and the booking button above the list. */

export type Entry = {
  href: string;
  title: string;
  summary: string;
  kind: string;
  /** The service slug (as lib/services.ts spells it) this entry books into. */
  service?: string;
};

/* Ties go to the pages a person can act on. A glossary definition that uses
   the word as often as the service page should not sit above it. */
const KIND_RANK: Record<string, number> = { Service: 3, Counsellor: 3, Page: 2, City: 2 };

export function buildIndex(): Entry[] {
  const serviceName = (slug: string) => services.find((s) => s.slug === slug)?.name;
  const out: Entry[] = [
    ...services.map((s) => ({
      href: `/services/${s.slug}`, title: s.name, summary: s.short ?? s.hero, kind: 'Service', service: s.slug,
    })),
    /* The condition pages redirect to the service that delivers them, so the
       entry points there: "anxiety counselling" lands on individual therapy. */
    ...conditions.map((c) => ({
      href: `/services/${c.service}`, title: c.name, summary: c.intro, kind: 'Service', service: c.service,
    })),
    /* Accepting only, which is how the founder is excluded: by the flag, as
       lib/booking-cta.ts and lib/counsellor-cards.ts do it, not by name.
       Credential names only (withLetters), never a registration number. */
    ...practitioners.filter((p) => p.acceptingNewClients).map((p) => {
      const offers = p.services.map(serviceName).filter(Boolean).join(', ');
      return {
        href: `/practitioners/${p.slug}`,
        title: withLetters(p),
        summary: `${p.role}. Sessions in ${p.languages.map((l) => l.name).join(' and ')}. ${offers ? `Offers ${offers}.` : ''}`.trim(),
        kind: 'Counsellor',
      };
    }),
    ...locations.map((l) => ({
      href: `/online-counselling/${l.slug}`,
      title: `${l.city} online counselling`,
      summary: `${l.region}. ${l.blurb}${l.communities?.length ? ` Also serving ${l.communities.join(', ')}.` : ''}`,
      kind: 'City',
    })),
    /* The city x service pages: "couples counselling abbotsford" (25
       impressions) and "anxiety counselling kamloops" (19) are each the
       title of one of these. */
    ...pairs.flatMap((p) => {
      const topic = getCityTopic(p.service);
      const city = locations.find((l) => l.slug === p.city)?.city;
      return topic && city
        ? [{
            href: `/online-counselling/${p.city}/${p.service}`,
            title: `${topic.name} in ${city}`,
            summary: p.angle,
            kind: 'Service',
            service: topic.bookingService,
          }]
        : [];
    }),
    { href: '/pricing', title: 'Fees, insurance and receipts', kind: 'Page',
      summary: 'What a session costs, how extended health plans and receipts work, and whether a plan may cover it. Coverage depends on the plan.' },
    { href: '/book', title: 'Book a free 15-minute consultation', kind: 'Page',
      summary: 'Choose a counsellor and a time to talk. The calendar shows real open times.' },
    { href: '/faq', title: 'Frequently asked questions', kind: 'Page',
      summary: 'Cost, coverage, first sessions, online counselling and how booking works.' },
    { href: '/answers', title: 'Answered questions', kind: 'Page',
      summary: 'Every question this practice answers in one place: cost and coverage, first sessions, stress leave, choosing a counsellor.' },
    { href: '/punjabi-counselling', title: 'Punjabi counselling by region in BC', kind: 'Page',
      summary: 'Punjabi-speaking online counselling across BC: Surrey, Abbotsford, Vancouver, Kelowna, Kamloops and Prince George.' },
    { href: '/tagalog-counselling', title: 'Tagalog-speaking counselling in BC', kind: 'Page',
      summary: 'Online counselling in Tagalog or English across British Columbia with a Registered Clinical Counsellor.' },
    ...guides.map((g) => ({
      href: `/guides/${g.slug}`, title: g.title, summary: g.shortAnswer, kind: 'Guide',
    })),
    ...comparisons.map((c) => ({
      href: `/compare/${c.slug}`, title: c.title, summary: c.shortAnswer, kind: 'Comparison',
    })),
    ...resources.map((r) => ({
      href: `/resources/${r.slug}`, title: r.title, summary: r.shortAnswer, kind: 'Resource',
    })),
    ...audiences.map((a) => ({
      href: `/for/${a.slug}`, title: a.title, summary: a.lede, kind: 'Who we work with',
    })),
    ...approaches.map((a) => ({
      href: `/approaches/${a.slug}`, title: a.title, summary: a.shortAnswer, kind: 'Approach',
    })),
    ...tools.map((t) => ({
      href: `/tools/${t.slug}`, title: t.title, summary: t.short, kind: 'Tool',
    })),
    ...glossary.map((t) => ({
      href: `/glossary#${t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: t.term, summary: t.definition, kind: 'Glossary',
    })),
  ];
  return out;
}

/* THE MATCHER, 1 Oct 2026.
 *
 * Run over the 26 Sep Search Console export, the old matcher returned nothing
 * for 504 of 681 non-brand queries. Three reasons: every word had to appear,
 * so "how to get stress leave in bc" failed on "how" and "get"; substrings
 * counted, so "men" matched "mental" and "fee" matched "feelings"; and
 * "counseling" never matched "counselling". Now:
 *
 *   - stopwords are dropped before anything is counted;
 *   - a word matches a whole word, or the start of one when it is at least
 *     five letters long ("insur" finds "insurance", "men" finds only "men");
 *   - plurals fold, and counselling/counseling/counsellor/counselor reduce to
 *     one stem, as therapy/therapist do;
 *   - a word also matches its synonyms (lib/search-synonyms.ts, each row
 *     from a real query), and a phrase that names one page pins that page;
 *   - 60% of the meaningful words must match, and more matched words rank
 *     above a higher score from fewer.
 *
 * Still deliberately simple: no dependency, no API key and no network call
 * for a few hundred pages of static content. */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'from', 'by', 'with', 'about',
  'is', 'are', 'was', 'be', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will', 'it',
  'how', 'what', 'when', 'where', 'why', 'who', 'which', 'i', 'me', 'my', 'you', 'your', 'we', 'our',
  'get', 'go', 'near', 'vs', 'versus', 'bc', 'british', 'columbia', 'there', 'this', 'that', 'any',
  'much', 'many', 'use', 'used', 'take', 'need', 'if', 'not', 'no', 'so', 'as',
]);

export function stem(word: string): string {
  const w = word.toLowerCase();
  if (w.startsWith('counsel')) return 'counsel';
  if (w.startsWith('therap')) return 'therap';
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) return w.slice(0, -1);
  return w;
}

/** Lowercased words, punctuation removed, apostrophes dropped, each stemmed. */
export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map(stem);
}

/** The words of a query that carry meaning: stemmed, stopwords removed. */
export function meaningfulTerms(query: string): string[] {
  const words = query.toLowerCase().replace(/[’']/g, '').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const out = words.filter((w) => !STOPWORDS.has(w) && (w.length > 1 || /\d/.test(w))).map(stem);
  return [...new Set(out)];
}

const GROUPS: string[][] = SYNONYM_GROUPS.map((g) => g.words.map(stem));
const PHRASES = PHRASE_PAGES.map((p) => ({ ...p, stems: tokens(p.phrase).join(' ') }));

/** The term itself and every word it is synonymous with. */
export function expand(term: string): string[] {
  const out = new Set([term]);
  for (const g of GROUPS) if (g.includes(term)) for (const w of g) out.add(w);
  return [...out];
}

const wordMatches = (words: string[], alt: string) =>
  words.some((w) => w === alt || (alt.length >= 5 && w.startsWith(alt)));

export function searchIndex(index: Entry[], query: string, limit = 25): Entry[] {
  const terms = meaningfulTerms(query);
  const stemmedQuery = ` ${tokens(query).join(' ')} `;
  const pinned = new Set(PHRASES.filter((p) => stemmedQuery.includes(` ${p.stems} `)).map((p) => p.href));
  if (terms.length === 0 && pinned.size === 0) return [];
  const need = Math.max(1, Math.ceil(terms.length * 0.6));

  return index
    .map((e, i) => {
      const title = tokens(e.title);
      const summary = tokens(e.summary ?? '');
      let matched = 0;
      let score = 0;
      for (const t of terms) {
        /* The word itself counts for twice what a synonym does, so "trauma"
           puts trauma pages above EMDR pages while still finding both. */
        const alts = expand(t);
        const titleDirect = wordMatches(title, t);
        const titleAlt = titleDirect || alts.some((a) => wordMatches(title, a));
        const summaryDirect = wordMatches(summary, t);
        const summaryAlt = summaryDirect || alts.some((a) => wordMatches(summary, a));
        if (titleAlt || summaryAlt) matched++;
        if (titleAlt) score += (title[0] === t || alts.includes(title[0]) ? 6 : 4) * (titleDirect ? 2 : 1);
        if (summaryAlt) score += summaryDirect ? 2 : 1;
      }
      /* 2 Oct 2026: a title the query names in full outranks a longer title
         that merely contains it. Without this, "depression counselling
         vancouver" opened on North Vancouver's page, whose summary happens
         to say "depression", rather than on Vancouver’s. One-word titles
         (a glossary term) are left out, so "emdr" still opens on a service. */
      const titleTerms = meaningfulTerms(e.title);
      if (titleTerms.length > 1 && titleTerms.every((w) => terms.some((t) => expand(t).includes(w)))) score += 3;
      const pin = pinned.has(e.href);
      const ok = pin || (terms.length > 0 && matched >= need);
      return { e, i, ok, pin, matched, score, rank: KIND_RANK[e.kind] ?? 1 };
    })
    .filter((r) => r.ok)
    .sort((a, b) =>
      Number(b.pin) - Number(a.pin) ||
      b.matched - a.matched ||
      b.score - a.score ||
      b.rank - a.rank ||
      a.i - b.i)
    .filter((r, n, all) => all.findIndex((x) => x.e.href === r.e.href) === n)
    .slice(0, limit)
    .map((r) => r.e);
}

/** The service the top result books into, if it is one. */
export const topService = (results: Entry[]): string | undefined => results[0]?.service;
