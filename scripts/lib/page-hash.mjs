/* A PAGE'S DATE FROM ITS OWN CONTENT — 3 Oct 2026.
 *
 * The pure half of scripts/page-hash-dates.mjs: what part of a page counts as
 * its content, how that becomes a hash, and how a new set of hashes moves the
 * recorded dates. Kept apart from the file system so a test can pin it.
 */
import { createHash } from 'node:crypto';

const MONTHS = 'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';
const DAYS = 'Mon(?:day)?|Tue(?:s(?:day)?)?|Wed(?:nesday)?|Thu(?:r(?:s(?:day)?)?)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?';

/* WHAT IS NOT CONTENT.
 *
 * Every page prints its own "Updated <date>", which comes from the date this
 * hash decides. Hashing it would make a re-dated page change again on the
 * next build, and again after that. And several pages print the next free
 * consultation time from Cliniko, which moves every half hour without a word
 * of the page changing. So dates, clock times and the next-consultation line
 * are taken out before hashing. The cost: an edit that changes nothing but a
 * date written in the copy does not re-date the page. */
const VOLATILE = [
  /* the next-consultation line, whole (components/NextConsultLine.tsx) */
  /<p\b[^>]*class="[^"]*\bnext-consult\b[^"]*"[^>]*>[\s\S]*?<\/p>/gi,
];
const VOLATILE_TEXT = [
  new RegExp(`\\b(?:${DAYS})\\.?,?\\s+(?:\\d{1,2}\\s+)?(?:${MONTHS})\\.?(?:\\s+\\d{1,2}(?:st|nd|rd|th)?)?(?:,?\\s+\\d{4})?`, 'gi'),
  new RegExp(`\\b(?:${MONTHS})\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{4}\\b`, 'gi'),
  new RegExp(`\\b\\d{1,2}\\s+(?:${MONTHS})\\.?,?\\s+\\d{4}\\b`, 'gi'),
  /\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/g,
  /\b\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)(?=\W|$)/gi,
  /\b\d{1,2}:\d{2}\b/g,
  /\(\d+ times?\)/gi,
  /\b(?:today|tomorrow)\b/gi,
];

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ' };

/** The visible text of a page's <main>, with the volatile parts removed, or
 *  null when the page has no <main>. */
export function mainText(html) {
  const m = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return null;
  let s = m[1]
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const re of VOLATILE) s = s.replace(re, ' ');
  s = s.replace(/<[^>]+>/g, ' ').replace(/&(?:amp|lt|gt|quot|#x27|#39|nbsp);/g, (e) => ENTITIES[e] ?? e);
  for (const re of VOLATILE_TEXT) s = s.replace(re, ' ');
  /* Words, numbers and money only. Taking a date out of "Camille, Tue Oct 7,
     10:00 am" leaves a stray comma that taking out "tomorrow 9:00 am" does
     not, so punctuation alone would re-date a page nobody touched. An edit
     that changes nothing but punctuation does not re-date it either. */
  return (s.match(/[\p{L}\p{N}\p{M}$%]+/gu) ?? []).join(' ');
}

export const hashText = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);

/** Today in Pacific time, YYYY-MM-DD: the day the practice would call it. */
export const pacificDay = (d = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

/**
 * The next record. For each path hashed this run:
 *   - unchanged hash: the recorded date stays
 *   - changed hash: the date becomes `today`
 *   - first time seen: the date is `seed.get(path)` (the date the sitemap
 *     already gives it), or null when there is none, so the first run
 *     re-dates nothing and invents no date
 * Paths not hashed this run drop out and fall back to their collection date.
 */
export function nextTable(prev, hashes, { today, seed = new Map() }) {
  const table = {};
  const changed = [];
  const added = [];
  for (const [path, hash] of [...hashes].sort(([a], [b]) => a.localeCompare(b))) {
    const old = prev[path];
    if (!old) {
      table[path] = { hash, date: seed.get(path) ?? null };
      added.push(path);
    } else if (old.hash !== hash) {
      table[path] = { hash, date: today };
      changed.push(path);
    } else {
      table[path] = old;
    }
  }
  const removed = Object.keys(prev).filter((p) => !hashes.has(p)).sort();
  return { table, changed, added, removed };
}

/** data/page-hashes.json, one URL per line so a diff shows which pages moved. */
export function formatTable(table) {
  const rows = Object.keys(table)
    .sort()
    .map((p) => `  ${JSON.stringify(p)}: { "hash": ${JSON.stringify(table[p].hash)}, "date": ${JSON.stringify(table[p].date)} }`);
  return `{\n${rows.join(',\n')}\n}\n`;
}

/** lib/url-dates.ts: the dates only, for the sitemap and lib/page-dates.ts. */
export function renderUrlDates(table) {
  const rows = Object.keys(table)
    .sort()
    .filter((p) => table[p].date)
    .map((p) => `  ${JSON.stringify(p)}: ${JSON.stringify(table[p].date)},`);
  return `/* GENERATED by scripts/page-hash-dates.mjs from data/page-hashes.json — do not edit by hand.
 *
 * Each page's own date: the day the visible text of its <main> last changed,
 * found by hashing the built page. A page not listed here has not been hashed
 * yet and keeps its collection's date. Regenerate after a build that changed
 * content:  npm run build && npm run hashes
 */

/** Per-URL content dates (YYYY-MM-DD), keyed by path ('/' for the home page). */
export const URL_DATES: Record<string, string> = {
${rows.join('\n')}
};

/** The page's own date, or \`fallback\` (an ISO string) when it has none. */
export function urlLastmod(path: string, fallback: string | null): string | null {
  const d = URL_DATES[path === '' ? '/' : path];
  return d ? \`\${d}T00:00:00.000Z\` : fallback;
}
`;
}
