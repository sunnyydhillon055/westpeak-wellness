import { metaLength, firstSentence, SNIPPET_MAX } from './snippet-facts.ts';

/* A PROFILE THAT IS NOT TAKING NEW CLIENTS SAYS SO IN ITS RESULT — 3 Oct 2026.
 *
 * profileSnippet (lib/snippet-facts.ts) returns nothing for a counsellor who
 * is not accepting, so her description was the generic lead and read as
 * available. Search Console: her name rose from 4 to 19 impressions a week at
 * about 5.5 with no clicks, and the profile had 71 impressions and 1 click.
 * The title already says it (1 Oct); this does the same for the description.
 *
 * The colleague named is the first counsellor on the roster who is accepting
 * and shares a language other than English with her, the same "who speaks
 * her language" rule the profile's hero buttons follow. No reason and no
 * dates, by rule (DECISIONS, 6 Sep 2026). */

type Row = {
  name: string;
  postNominals: string;
  slug: string;
  acceptingNewClients: boolean;
  languages: { tag: string; name: string }[];
};

const letters = (p: Row) => (p.postNominals ? `${p.name}, ${p.postNominals}` : p.name);

/** "Not taking new clients at present. For counselling in Punjabi, see
 *  Savneet Singh, RCC." Null while she is accepting. */
export function notAcceptingSentence(p: Row, roster: readonly Row[]): string | null {
  if (p.acceptingNewClients) return null;
  const own = p.languages.filter((l) => !l.tag.startsWith('en'));
  for (const q of roster) {
    if (q.slug === p.slug || !q.acceptingNewClients) continue;
    const shared = own.find((l) => q.languages.some((m) => m.tag === l.tag));
    if (shared) return `Not taking new clients at present. For counselling in ${shared.name}, see ${letters(q)}.`;
  }
  return 'Not taking new clients at present.';
}

/** The description: the page's lead with the sentence, then its first
 *  sentence with it, then her name and languages with it, and last her name
 *  alone with it — the first that fits the SEO gate. The sentence is never
 *  dropped, because a description that reads as available is the defect. */
export function closedProfileDescription(lead: string, p: Row, roster: readonly Row[], max = SNIPPET_MAX): string {
  const tail = notAcceptingSentence(p, roster);
  if (!tail) return lead;
  const langs = p.languages.map((l) => l.name).join(' or ');
  const tries = [
    `${lead} ${tail}`,
    `${firstSentence(lead)} ${tail}`,
    `${letters(p)}, counselling in ${langs}. ${tail}`,
    `${letters(p)}. ${tail}`,
  ];
  return tries.find((t) => metaLength(t) <= max) ?? tries[tries.length - 1]!;
}
