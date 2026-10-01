import { blobLedger, casUpdate, type LedgerIO, type CasOptions } from '@/lib/blob-ledger';
import { buildIndex, searchIndex } from './search-index';

/* What people search for on this site — as counts, never as events.
 *
 * THE PRIVACY DECISION THIS HAD TO GET PAST
 *
 * app/search/page.tsx said, deliberately, "no query logging". That was a real
 * decision and a correct instinct: on a counselling site a search box receives
 * things like "can my therapist tell my husband" and "how do I know if I am
 * suicidal". A log of individual searches is a log of people's worst moments,
 * sitting in a store somebody could later be compelled to produce.
 *
 * So this does not log searches. It counts terms.
 *
 * The difference is not cosmetic. There is no event record here — no
 * timestamp, no IP, no session, no user agent, no ordering, nothing that links
 * two searches to one person. What exists is a tally: the string, and how many
 * times it has ever been submitted. "suicidal: 3" cannot be attributed to
 * anyone, cannot be sequenced, and cannot be un-aggregated. A subpoena for it
 * returns a word list.
 *
 * WHY BOTHER AT ALL
 *
 * Because it is the only first-party keyword research the practice will ever
 * get: the actual words visitors use for their own problem, unmediated by
 * Google's query rewriting and not guessed from a keyword tool. On a site whose
 * whole strategy is meeting people in their own language — including literally,
 * in Punjabi — throwing that away every time was the wrong trade.
 *
 * WHAT IS DELIBERATELY NOT COUNTED
 *
 * Anything long enough to be a sentence rather than a term. A person typing a
 * paragraph into a search box is telling you a story, not a query, and that
 * belongs in nobody's analytics. Cap and drop.
 */

const KEY = 'inbound/search-terms.json';

/* Long enough to be a disclosure rather than a search. A real query is one to
 * four words; anything past this is somebody typing their situation into the
 * box because it was the only text field on the page. Those are dropped
 * entirely rather than truncated — a truncated confession is still a
 * confession. */
const MAX_TERM_LENGTH = 48;

export type SearchTerms = {
  /** term -> times submitted, ever. No timestamps, by design. */
  terms: Record<string, number>;
  /** Total submissions counted, including ones since pruned. */
  total: number;
  updatedAt: string;
};

const EMPTY: SearchTerms = { terms: {}, total: 0, updatedAt: '' };

/* No `lastWrite` any more, and no plain put(): both counters now write with
   compare-and-swap through lib/blob-ledger.ts, which says why. */
const CACHE_MS = 30_000;

/** Lowercased, whitespace-collapsed, punctuation trimmed. Returns null when the
 *  input should not be counted at all. */
export function normalizeTerm(raw: string): string | null {
  const t = raw.toLowerCase().replace(/\s+/g, ' ').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim();
  if (t.length < 2) return null;
  if (t.length > MAX_TERM_LENGTH) return null;
  return t;
}

/** Whatever is stored, read as a tally. Pure. */
export function parseSearchTerms(raw: unknown): SearchTerms {
  if (!raw || typeof raw !== 'object') return { terms: {}, total: 0, updatedAt: '' };
  const v = raw as Partial<SearchTerms>;
  return {
    terms: v.terms && typeof v.terms === 'object' && !Array.isArray(v.terms) ? v.terms : {},
    total: Number(v.total) || 0,
    updatedAt: String(v.updatedAt ?? ''),
  };
}

/** One submission applied to a tally. Pure, so a retry re-applies it to the
 *  store's current copy. */
export function withTerm(current: SearchTerms, term: string, now: string): SearchTerms {
  const terms = { ...current.terms, [term]: (current.terms[term] ?? 0) + 1 };

  /* Bounded. Kept by frequency rather than recency, because the point is the
   * pattern and a one-off is noise. Pruning is also a second privacy pass: an
   * unusual phrase somebody typed once does not survive, while "emdr" does. */
  let kept = terms;
  const keys = Object.keys(terms);
  if (keys.length > 600) {
    kept = Object.fromEntries(
      keys.map((k) => [k, terms[k]!] as const).sort((a, b) => b[1] - a[1]).slice(0, 500)
    );
  }
  return { terms: kept, total: current.total + 1, updatedAt: now };
}

export type SearchStore = {
  read(opts?: { fresh?: boolean }): Promise<SearchTerms>;
  count(raw: string): Promise<boolean>;
};

/** A store over one ledger; see createConversionStore in lib/conversion-log.ts. */
export function createSearchStore(io: () => LedgerIO | null, opts: CasOptions = {}): SearchStore {
  let cache: { at: number; value: SearchTerms } | null = null;

  async function read(o?: { fresh?: boolean }): Promise<SearchTerms> {
    if (!o?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
    const ledger = io();
    if (!ledger) return EMPTY;
    try {
      const hit = await ledger.read();
      const value = parseSearchTerms(hit?.body ?? null);
      cache = { at: Date.now(), value };
      return value;
    } catch {
      return cache?.value ?? EMPTY;
    }
  }

  async function count(raw: string): Promise<boolean> {
    const term = normalizeTerm(raw);
    if (!term) return false;
    const ledger = io();
    if (!ledger) return false;
    const written = await casUpdate(
      ledger,
      parseSearchTerms,
      (current) => withTerm(current, term, new Date().toISOString()),
      { label: 'search-log', ...opts }
    );
    if (written) cache = { at: Date.now(), value: written };
    return written !== null;
  }

  return { read, count };
}

/* Unlike the conversion log, searches were never counted without a Blob
   token, and still are not: a preview's searches are the team's own. */
const store = createSearchStore(() => (process.env.BLOB_READ_WRITE_TOKEN ? blobLedger(KEY) : null));

export function readSearchTerms(opts?: { fresh?: boolean }): Promise<SearchTerms> {
  return store.read(opts);
}

/** Increments one term's count. Returns false when the term was not countable. */
export function countSearch(raw: string): Promise<boolean> {
  return store.count(raw);
}

/** Most-searched first — the order anyone actually wants to read. */
export async function topSearchTerms(limit = 40): Promise<{ term: string; n: number }[]> {
  const { terms } = await readSearchTerms();
  return Object.entries(terms)
    .map(([term, n]) => ({ term, n }))
    .sort((a, b) => b.n - a.n || a.term.localeCompare(b.term))
    .slice(0, limit);
}

/* ============================================================================
   WHAT PEOPLE SEARCHED FOR AND DID NOT FIND
   ----------------------------------------------------------------------------
   The term counts have been accumulating since they were built and nobody has
   read them, which makes them the only first-party demand data this practice
   has and the least used.

   A raw list of popular terms is not actually the useful artefact, because the
   popular ones are mostly things the site already answers well. The useful
   question is the inverse: which terms did somebody type that the site has
   nothing good for. Those are content briefs written by the people who wanted
   the content.

   The test is deliberately the site's own search. If the on-site search returns
   nothing for a term, a visitor who typed it hit a dead end — that is a fact
   about this site rather than a guess about Google.
   ========================================================================= */

export type SearchGap = { term: string; count: number; hits: number };

/**
 * Terms people searched for that the site answers poorly or not at all,
 * most-searched first.
 *
 * `maxHits` is the threshold for "poorly": 0 means nothing matched at all, 1
 * means a single page did and the topic has no real coverage. Anything above
 * that is a topic the site does cover, where a low ranking is a different
 * problem from a missing page.
 */
export async function searchGaps(maxHits = 1, limit = 40): Promise<SearchGap[]> {
  const terms = await topSearchTerms(300);
  if (!terms.length) return [];
  const index = buildIndex();
  return terms
    .map((t) => ({
      term: t.term,
      count: t.n,
      hits: searchIndex(index, t.term, 5).length,
    }))
    .filter((g) => g.hits <= maxHits)
    .slice(0, limit);
}
