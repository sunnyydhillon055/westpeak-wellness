import { punjabiWordsResource } from '@/lib/resources-punjabi-words';
import { practitioners, withLetters } from '@/lib/practitioners';

/* THE PRINTED PUNJABI WORD SHEET — what it may say, 15 Oct 2026.
 *
 * A one-page sheet for gurdwaras, community centres and Punjabi-speaking
 * family doctors' offices. It is copied from the words page
 * (/resources/counselling-in-punjabi-what-the-words-mean) and adds no
 * Punjabi of its own: the two word tables are read from that page's data
 * here, so a correction there reaches the sheet at the next build, and the
 * handful of words taken from that page's prose are listed below and
 * checked against its source by test/print-punjabi-words.test.mts. Nothing
 * here is a new translation and there is no new Punjabi sentence.
 *
 * Server-only: it imports the roster, which never enters the browser. */

const words = punjabiWordsResource[0]!;

const tableUnder = (h2: string) => {
  const s = words.sections.find((x) => x.h2 === h2);
  if (!s?.table) throw new Error(`print/punjabi-words: the words page has no table under "${h2}"`);
  return s.table.rows;
};

export type WordRow = { en: string; pa: string; said: string; gloss?: string };

/** The words for counselling, every row of the words page's first table. */
export const COUNSELLING_WORDS: WordRow[] = tableUnder('Counselling meaning in Punjabi: the words in one table').map(
  ([en, pa, said, gloss]) => ({ en: en!, pa: pa!, said: said!, gloss })
);

/** The feeling words, from the second table; the English column is the gloss
 *  and the long "where it does not map" notes stay on the page. */
export const FEELING_WORDS: WordRow[] = tableUnder('The feeling words, and what gets lost').map(
  ([en, pa, said]) => ({ en: en!, pa: pa!, said: said! })
);

/** From the page's prose, word for word: "ਇੱਜ਼ਤ (izzat) is honour or
 *  standing", "ਸ਼ਰਮ (sharam) is shame", "ਪਾਗਲ (paagal, mad". */
export const FAMILY_WORDS: WordRow[] = [
  { en: 'Honour or standing', pa: 'ਇੱਜ਼ਤ', said: 'izzat' },
  { en: 'Shame', pa: 'ਸ਼ਰਮ', said: 'sharam' },
  { en: 'Mad', pa: 'ਪਾਗਲ', said: 'paagal' },
];

/** Two phrases the page already uses, with its own English. */
export const PHRASES = {
  explain: { pa: 'ਮਾਨਸਿਕ ਸਿਹਤ ਬਾਰੇ ਗੱਲ ਕਰਨਾ', en: 'talking about mental health' },
  freeConsult: { pa: 'ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ', en: 'a free consultation' },
} as const;

/** The date printed at the foot, so a stack on a counter can be told from a
 *  newer one. Typed on purpose: a build date would change the page on every
 *  build. Move it when the sheet's content changes and the PDF is remade. */
export const SHEET_DATE = '2026-10-15';
export const SHEET_DATE_LABEL = 'October 2026';

export const PDF_PATH = '/downloads/counselling-words-in-punjabi.pdf';
export const PRINT_PATH = '/print/punjabi-words';

/** Who the sheet names: the counsellor taking new clients who works in
 *  Punjabi and offers individual counselling in BC, from the roster. Null
 *  when nobody fits, and then the sheet names nobody. */
export function punjabiCounsellor(roster = practitioners): { slug: string; letters: string } | null {
  const p = roster.find(
    (x) =>
      x.acceptingNewClients &&
      x.languages.some((l) => l.tag === 'pa') &&
      x.services.includes('individual-therapy') &&
      x.provinces.includes('BC')
  );
  return p ? { slug: p.slug, letters: withLetters(p) } : null;
}
