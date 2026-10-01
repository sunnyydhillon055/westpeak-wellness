import { PAIRED_SERVICES, type PairedService } from '@/lib/city-services';

/* THE SPOKES: WHICH INFORMATIONAL PAGE SUPPORTS WHICH MONEY PAGE.
 *
 * Added 1 October 2026, from the internal-link baseline measured on the
 * 28 September build.
 *
 * WHAT THE BASELINE SHOWED
 *
 * The pages Google shows are the guides, comparisons and resources. The pages
 * that earn a client are the fifty city × service pages
 * (/online-counselling/{city}/{service}) and the twenty-two audience pages
 * (/for/{group}). Counting in-body links in the built HTML:
 *
 *   · all 50 city-service pages had ZERO inbound links from any informational
 *     page. Their only linkers were the city hub, the four sibling services in
 *     the same city, and the same service in one to three neighbouring cities.
 *   · 12 of the 22 /for pages had /answers as their ONLY informational linker,
 *     and /answers links to everything, so that is no editorial support at all.
 *
 * components/CityLinks.tsx (25 Sep 2026) fixed the same problem one level up:
 * it sends ten links from every informational page to the ten city HUBS. It
 * does not reach the city-service pages, and it says nothing about who a
 * guide was written for. This file is the next level down.
 *
 * WHY A CURATED MAP AND NOT A KEYWORD MATCH
 *
 * The baseline's slug-token matcher found these pairings; a person then read
 * each one and kept it only where the guide genuinely leads to the service —
 * a reader finishing "anxiety attack vs panic attack" is, plausibly, looking
 * for anxiety counselling. Where the matcher had nothing (tech workers,
 * teachers, men, trades, rotational workers) the pairing was chosen by topic.
 * A keyword match run at build time would also link "intrusive thoughts" to
 * anxiety and "grief" to depression, which is clinically careless and reads
 * as a doorway pattern. The map is short on purpose: one service per page,
 * so a page sends ten city-service links, never fifty.
 *
 * WHY ONE SERVICE PER PAGE
 *
 * /compare/cbt-vs-emdr-for-trauma matches both trauma-therapy and
 * emdr-therapy. It is given to emdr-therapy because that is the modality the
 * page is about and trauma-therapy already has three spokes of its own. A
 * second service would double the block to twenty links, and a block of
 * twenty is navigation a crawler discounts, not an editorial pointer.
 *
 * Keys are "{section}/{slug}", the same shape lib/depth.ts uses, because the
 * three collections do not promise distinct slugs. test/spokes.test.mts fails
 * if a key names a page that does not exist, a service outside the paired
 * five, or an audience that is not on the site — a spoke that points at a
 * 404 is worse than none.
 */

export type Spoke = {
  /** The city × service pages this page supports; one service, ten cities. */
  service?: PairedService;
  /** The /for pages this page supports, by audience slug. Three or four at most. */
  audiences?: string[];
};

/* The anchor text, in sentence case: "Anxiety counselling in Vancouver" is
 * how the phrase is written mid-sentence and how people type it. The Title
 * Case names in lib/conditions.ts and lib/services.ts are headings. */
export const SERVICE_ANCHOR: Record<PairedService, string> = {
  'anxiety-counselling': 'Anxiety counselling',
  'couples-therapy': 'Couples therapy',
  'depression-counselling': 'Depression counselling',
  'emdr-therapy': 'EMDR therapy',
  'trauma-therapy': 'Trauma therapy',
};

/* "Online anxiety counselling across BC", but "Online EMDR therapy across BC":
 * only a capital that starts an ordinary word is lowered mid-sentence. */
export const midSentence = (label: string) =>
  /^[A-Z][a-z]/.test(label) ? label.charAt(0).toLowerCase() + label.slice(1) : label;

export const spokes: Record<string, Spoke> = {
  /* ---- anxiety-counselling ---------------------------------------------- */
  'guides/anxiety-and-sleep': { service: 'anxiety-counselling' },
  'guides/anxiety-attack-vs-panic-attack': { service: 'anxiety-counselling' },
  'guides/high-functioning-anxiety': { service: 'anxiety-counselling' },
  'guides/social-anxiety-in-adults': { service: 'anxiety-counselling', audiences: ['teens-and-young-adults'] },
  'guides/panic-attacks-at-work': { service: 'anxiety-counselling' },
  'guides/health-anxiety': { service: 'anxiety-counselling' },

  /* ---- couples-therapy -------------------------------------------------- */
  'compare/gottman-method-vs-eft-for-couples': { service: 'couples-therapy' },
  'compare/individual-vs-couples-therapy': { service: 'couples-therapy' },
  'guides/does-couples-therapy-work': { service: 'couples-therapy', audiences: ['punjabi-speaking-couples'] },
  'guides/how-the-gottman-method-works': { service: 'couples-therapy' },

  /* ---- depression-counselling ------------------------------------------- */
  'guides/burnout-vs-depression': { service: 'depression-counselling', audiences: ['tech-workers', 'truck-drivers'] },
  'compare/therapy-medication-or-both': { service: 'depression-counselling' },
  'guides/loneliness-in-adulthood': {
    service: 'depression-counselling',
    audiences: ['international-students', 'rotational-and-camp-workers', 'truck-drivers', 'men'],
  },
  'guides/low-mood-through-a-bc-winter': { service: 'depression-counselling' },

  /* ---- emdr-therapy ----------------------------------------------------- */
  'compare/cbt-vs-emdr-for-trauma': { service: 'emdr-therapy' },
  'compare/emdr-intensive-vs-weekly-emdr': { service: 'emdr-therapy' },
  'guides/what-is-emdr-and-how-a-session-works': { service: 'emdr-therapy' },

  /* ---- trauma-therapy --------------------------------------------------- */
  'guides/intergenerational-trauma-explained': {
    service: 'trauma-therapy',
    audiences: ['south-asian-intergenerational-conflict'],
  },
  'guides/what-trauma-actually-means': { service: 'trauma-therapy', audiences: ['first-responders'] },
  /* guides/ptsd-and-complex-ptsd would be the obvious third spoke, but it is a
     draft (lib/guides-drafts.ts) and has no page. Add it here the day the
     draft is cleared; test/spokes.test.mts refuses it until then. */

  /* ---- the /for pages whose only informational linker was /answers ------ */
  /* WorkSafeBC and ICBC fund counselling for a psychological injury or a
     crash; the city trauma pages answer those exact questions in their FAQs.
     Not in the baseline's table (the matcher scored slugs), added because the
     PTSD guide the table would have supplied is a draft. */
  'resources/worksafebc-psychological-injury-claims': {
    service: 'trauma-therapy',
    audiences: ['first-responders', 'trades-and-construction-workers', 'rotational-and-camp-workers', 'truck-drivers'],
  },
  'resources/icbc-counselling-after-a-crash-bc': { service: 'trauma-therapy' },
  'guides/stress-leave-bc': {
    audiences: ['first-responders', 'teachers', 'trades-and-construction-workers', 'rotational-and-camp-workers'],
  },
  'resources/student-mental-health-supports-bc': { audiences: ['international-students', 'teens-and-young-adults'] },
  'resources/low-cost-counselling-bc': { audiences: ['international-students', 'newcomers-to-canada'] },
  'resources/does-my-plan-cover-counselling-bc': { audiences: ['newcomers-to-canada'] },
  'resources/msp-vs-extended-health': { audiences: ['newcomers-to-canada'] },
  'compare/therapy-in-punjabi-vs-english': {
    audiences: ['punjabi-speaking-couples', 'south-asian-intergenerational-conflict'],
  },
  'resources/counselling-in-punjabi-what-the-words-mean': { audiences: ['punjabi-speaking-couples'] },
  'guides/setting-boundaries-with-family': { audiences: ['south-asian-intergenerational-conflict'] },
  'guides/adhd-in-adults-and-what-counselling-can-do': { audiences: ['teens-and-young-adults'] },
  'guides/anger-that-arrives-too-fast': { audiences: ['trades-and-construction-workers', 'men'] },
  'guides/imposter-feelings-at-work': { audiences: ['tech-workers'] },
  'guides/perfectionism-and-self-criticism': { audiences: ['tech-workers'] },
  'guides/return-to-work-after-a-mental-health-leave': { audiences: ['teachers'] },
  'guides/sick-days-and-mental-health-days-bc': { audiences: ['teachers'] },
  'guides/signs-it-might-be-time-for-therapy': { audiences: ['men'] },
};

export const getSpoke = (section: 'guides' | 'compare' | 'resources', slug: string): Spoke | undefined =>
  spokes[`${section}/${slug}`];

/** The spokes that point at one service — used by tests and by any future
 *  "who links here" report, so the map stays the one place this is written. */
export const spokesForService = (service: PairedService) =>
  Object.entries(spokes).filter(([, s]) => s.service === service).map(([k]) => k);

export { PAIRED_SERVICES };
