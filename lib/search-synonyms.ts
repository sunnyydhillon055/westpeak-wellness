/* WHAT PEOPLE TYPE, AND THE WORD THE SITE USES FOR IT — 1 Oct 2026.
 *
 * Every row is here because a real search used the left-hand word and the
 * page that answers it uses the right-hand one. The query each row came from
 * is quoted beside it, from the Search Console export of 26 Sep 2026
 * (data/gsc/2026-09-26-queries.csv). A row with no query behind it does not
 * belong here: a synonym table grown by guesswork matches everything to
 * everything, and a search that returns the whole site is as useless as one
 * that returns nothing.
 *
 * Terms are written in the matcher's stemmed form (lib/search-index.ts
 * stem()): plurals are already folded, and counselling/counseling/counsellor/
 * counselor all reduce to "counsel", therapy/therapist to "therap".
 *
 * A group is symmetric: any word in it finds pages that use any other. */
export const SYNONYM_GROUPS: { words: string[]; from: string }[] = [
  /* "kamloops therapist" (10), "therapy kamloops" (10) against "trauma
     counselling kamloops" (21): the same request in two words, and the site
     titles some services "therapy" and others "counselling". */
  { words: ['counsel', 'therap', 'psychotherapy'], from: 'kamloops therapist' },
  /* "wcb stress leave bc" (46 impressions), "worksafebc stress leave" (19). */
  { words: ['wcb', 'worksafebc', 'worksafe'], from: 'wcb stress leave bc' },
  /* "gottman method marriage counselling british columbia" (28), "marriage
     counseling abbotsford bc" (17), "relationship counselling kelowna" (5).
     The service is called couples therapy. */
  { words: ['couple', 'marriage', 'marital', 'relationship'], from: 'marriage counseling abbotsford bc' },
  /* "online trauma therapy" (40), "ptsd therapy kelowna" (2), "ptsd treatment
     victoria bc" (2). The trauma work here is EMDR. */
  { words: ['trauma', 'ptsd', 'emdr'], from: 'ptsd therapy kelowna' },
  /* "online couples therapy cost" (3), "icbc counselling rates" (1). The
     page that answers it is /pricing, which says "fees". */
  { words: ['price', 'pricing', 'rate', 'cost', 'fee'], from: 'online couples therapy cost' },
  /* "is therapy covered by alberta health care" (17), "is counselling covered
     by private health insurance" (2), "blue cross mental health coverage" (2). */
  { words: ['insurance', 'coverage', 'covered', 'cover', 'reimburse'], from: 'is counselling covered by private health insurance' },
  /* "rcc counsellor" (15), "registered clinical counsellor (rcc)" (26). */
  { words: ['rcc', 'registered'], from: 'rcc counsellor' },
  /* "virtual counselling bc" (6). Every session here is by video. */
  { words: ['online', 'virtual', 'video'], from: 'virtual counselling bc' },
  /* "how can i book a session for my family to improve our relationships?" (4). */
  { words: ['book', 'booking', 'appointment'], from: 'how can i book a session for my family' },
];

/* Phrases that name one page. Checked against the whole query before it is
 * split into words, so "stress leave" is not two unrelated words. */
export const PHRASE_PAGES: { phrase: string; href: string; from: string }[] = [
  /* "how to get stress leave in bc" (63), "how does stress leave work in bc" (63). */
  { phrase: 'stress leave', href: '/guides/stress-leave-bc', from: 'how to get stress leave in bc' },
  /* "mental health days bc" (21), "bc sick days mental health" (16). */
  { phrase: 'sick day', href: '/guides/sick-days-and-mental-health-days-bc', from: 'bc sick days mental health' },
  { phrase: 'mental health day', href: '/guides/sick-days-and-mental-health-days-bc', from: 'mental health days bc' },
  /* "what is a registered clinical counsellor" (14), "registered clinical counsellor" (359). */
  { phrase: 'registered clinical counsel', href: '/resources/verify-a-counsellor-in-bc', from: 'registered clinical counsellor' },
  /* "bcacc find a counsellor" (47), "find a counsellor bc" (1). */
  { phrase: 'find a counsel', href: '/guides/how-to-find-a-therapist-in-bc', from: 'bcacc find a counsellor' },
  /* "counselling meaning in punjabi" (125), "therapy meaning in punjabi" (26). */
  { phrase: 'meaning in punjabi', href: '/resources/counselling-in-punjabi-what-the-words-mean', from: 'counselling meaning in punjabi' },
  /* "salah mashwara in english" (26). */
  { phrase: 'salah mashwara', href: '/resources/counselling-in-punjabi-what-the-words-mean', from: 'salah mashwara in english' },
  /* "burn out meaning tagalog" (1), "counselling in tagalog" (1). */
  { phrase: 'meaning tagalog', href: '/resources/counselling-in-tagalog-what-the-words-mean', from: 'burn out meaning tagalog' },
  /* "psychiatrist vs psychologist" (14). */
  { phrase: 'psychiatrist vs psychologist', href: '/compare/psychologist-vs-psychiatrist-bc', from: 'psychiatrist vs psychologist' },
  /* "icbc counselling" (15), "icbc counsellor" (7). */
  { phrase: 'icbc', href: '/resources/icbc-counselling-after-a-crash-bc', from: 'icbc counselling' },
  /* "stay at work services" (73). */
  { phrase: 'stay at work', href: '/resources/workplace-mental-health-bc', from: 'stay at work services' },
  /* "virtual counselling jobs bc" (20), "remote counselling jobs bc" (18). */
  { phrase: 'counselling job', href: '/resources/becoming-a-counsellor-in-bc', from: 'virtual counselling jobs bc' },
  /* "is therapy covered by alberta health care" (17). */
  { phrase: 'alberta health', href: '/resources/counselling-coverage-in-alberta', from: 'is therapy covered by alberta health care' },
];
