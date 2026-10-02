/* PROFILE AND PLACE TITLES THAT LEAD WITH THE PERSON AND THE LANGUAGE.
 *
 * WHY — 1 Oct 2026, from Search Console. The profile title was
 * "<Name>, <letters> | Westpeak Wellness" and the place pages were
 * "Counselling in <City> | <Name>, <letters>". The place pages took the city
 * hubs' head term: the Richmond and Vancouver hubs dropped out of the export
 * while savneet-singh/richmond sat at 6.93 and camille-granda/vancouver at
 * 8.38, and the profiles sat at 7.7-8.1 with no clicks. A person searching for
 * a Tagalog or Punjabi counsellor is the reader these pages are for, so the
 * language they search for now leads, and the city phrase stays with the hub.
 *
 * Composed to fit, never truncated: the SEO gate refuses a title over 60
 * characters and counts raw HTML, so "&" (which renders as "&amp;") is never
 * used. Every candidate keeps the non-English language. */

type Titled = {
  name: string;
  postNominals: string;
  languages: { tag: string; name: string }[];
  provinces: string[];
  reach?: 'canada';
};

export const TITLE_MAX = 60;

const nonEnglish = (p: Titled) => p.languages.filter((l) => !l.tag.startsWith('en')).map((l) => l.name);

/** "Tagalog and English", or "English" for someone with no second language. */
const languagePhrase = (p: Titled) => {
  const other = nonEnglish(p);
  return other.length ? `${other.join(', ')} and English` : 'English';
};

const firstFit = (candidates: string[]) =>
  candidates.find((c) => c.length <= TITLE_MAX) ?? candidates[candidates.length - 1]!;

/** Where the profile says the person works online: Canada, BC, or both provinces. */
export const onlineIn = (p: Titled) =>
  p.reach === 'canada' ? 'Canada' : p.provinces.length === 1 && p.provinces[0] === 'BC' ? 'BC' : p.provinces.join(' and ');

/** "Camille Granda, RCC, CCC: Tagalog counsellor, online in Canada". */
export function profileTitle(p: Titled): string {
  const letters = p.postNominals ? `${p.name}, ${p.postNominals}` : p.name;
  const firstLetter = p.postNominals ? `${p.name}, ${p.postNominals.split(',').map((s) => s.trim()).filter((s) => s !== 'MA')[0] ?? p.postNominals}` : p.name;
  const lang = languagePhrase(p);
  const other = nonEnglish(p).join(' and ') || 'English';
  const where = onlineIn(p);
  return firstFit([
    `${letters}: ${lang} counsellor, online in ${where} | Westpeak`,
    `${letters}: ${lang} counsellor, online in ${where}`,
    `${letters}: ${other} counsellor, online in ${where}`,
    `${firstLetter}: ${other} counsellor, online in ${where}`,
    `${firstLetter}: ${other} counsellor, online`,
    `${p.name}: ${other} counsellor`,
  ]);
}

/** "Savneet Singh, RCC: Punjabi counsellor for Delta". */
export function placeTitle(p: Titled, city: string): string {
  const rcc = p.postNominals.split(',').map((s) => s.trim()).includes('RCC') ? `${p.name}, RCC` : p.name;
  /* No "and English" here, even where it would fit: it fits for one city in
     fifteen, and a set of titles that changes shape by city length reads as
     two templates. */
  const other = nonEnglish(p).join(' and ') || 'English';
  return firstFit([
    `${rcc}: ${other} counsellor for ${city}`,
    `${p.name}: ${other} counsellor for ${city}`,
    `${p.name}: ${other} counselling, ${city}`,
  ]);
}

const PROVINCE_LONG: Record<string, string> = { BC: 'British Columbia', AB: 'Alberta' };

/** onlineIn() spelled out for a heading: "Canada", "British Columbia", or
 *  "British Columbia and Alberta". The profile's "Where she works" heading
 *  said British Columbia for a counsellor whose fact strip said Canada. */
export const onlineInLong = (p: Titled) =>
  p.reach === 'canada' ? 'Canada' : p.provinces.map((c) => PROVINCE_LONG[c] ?? c).join(' and ');
