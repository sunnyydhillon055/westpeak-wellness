/* ============================================================================
   NAMING THINGS SO A MACHINE KNOWS WHICH THING IS MEANT
   ----------------------------------------------------------------------------
   Added 24 September 2026.

   Every therapy page on this site said `{ "@type": "MedicalTherapy", "name":
   "EMDR" }` — a type and a string. A retrieval system reading that has to
   decide for itself whether this "EMDR" is the same EMDR as the one on the
   other forty pages it has indexed, and whether "ACT" here is acceptance and
   commitment therapy or the standardised test. Usually it guesses right.
   "Somatic", "parts work" and "DBT-informed" it does not.

   A `sameAs` pointing at the encyclopaedia article for the thing removes the
   guess. It is the cheapest entity signal there is: one URL per concept, and
   the concept is then reconciled against something every model already holds.

   RULES FOR THIS FILE
   · Only concepts this practice actually offers or writes about.
   · Only URLs that resolve. scripts/ai-crawl-audit.mjs requests every one of
     them, so a renamed article fails the build rather than shipping a link
     into the structured data that quietly points at nothing.
   · No Wikidata Q-numbers. They are the better identifier and they are not
     memorable, which makes them exactly the kind of value that gets typed
     wrong once and then copied forever. If they are added later, they must be
     added from the article, not from memory.
   · This says what a thing IS, never that the practice is good at it.
   ========================================================================= */

const W = 'https://en.wikipedia.org/wiki/';

/** Therapies and methods, by the slug the site uses for them. */
export const THERAPY_ENTITY: Record<string, { name: string; sameAs: string[] }> = {
  'cognitive-behavioural-therapy': {
    name: 'Cognitive behavioural therapy',
    sameAs: [`${W}Cognitive_behavioral_therapy`],
  },
  'acceptance-and-commitment-therapy': {
    name: 'Acceptance and commitment therapy',
    sameAs: [`${W}Acceptance_and_commitment_therapy`],
  },
  'internal-family-systems': {
    name: 'Internal Family Systems',
    sameAs: [`${W}Internal_Family_Systems_Model`],
  },
  'somatic-therapy': {
    name: 'Somatic therapy',
    sameAs: [`${W}Somatic_experiencing`],
  },
  'dbt-informed-skills': {
    name: 'Dialectical behaviour therapy',
    sameAs: [`${W}Dialectical_behavior_therapy`],
  },
  'mindfulness-based-approaches': {
    name: 'Mindfulness-based therapy',
    sameAs: [`${W}Mindfulness`],
  },
  'emdr-therapy': {
    name: 'Eye movement desensitisation and reprocessing',
    sameAs: [`${W}Eye_movement_desensitization_and_reprocessing`],
  },
  'couples-therapy': {
    name: 'Couples therapy',
    sameAs: [`${W}Couples_therapy`, `${W}Emotionally_focused_therapy`],
  },
  'family-counselling': {
    name: 'Family therapy',
    sameAs: [`${W}Family_therapy`],
  },
  'individual-therapy': {
    name: 'Psychotherapy',
    sameAs: [`${W}Psychotherapy`],
  },
};

/** What people come with, by the slug the site uses for it. */
export const CONDITION_ENTITY: Record<string, { name: string; sameAs: string[] }> = {
  anxiety: { name: 'Anxiety', sameAs: [`${W}Anxiety_disorder`] },
  depression: { name: 'Depression', sameAs: [`${W}Major_depressive_disorder`] },
  trauma: { name: 'Psychological trauma', sameAs: [`${W}Psychological_trauma`] },
  ptsd: { name: 'Post-traumatic stress disorder', sameAs: [`${W}Post-traumatic_stress_disorder`] },
  burnout: { name: 'Occupational burnout', sameAs: [`${W}Occupational_burnout`] },
  grief: { name: 'Grief', sameAs: [`${W}Grief`] },
  'panic-attacks': { name: 'Panic attack', sameAs: [`${W}Panic_attack`] },
  /* The slugs the city pages use for the three conditions that have their own
     pages (lib/conditions.ts). Keyed twice on purpose: the short name is what
     the guides and the organisation's knowsAbout use, the slug is what a page
     route has in hand, and a lookup that works for one and not the other is a
     lookup somebody will silently miss. */
  'anxiety-counselling': { name: 'Anxiety', sameAs: [`${W}Anxiety_disorder`] },
  'trauma-therapy': { name: 'Psychological trauma', sameAs: [`${W}Psychological_trauma`] },
  'depression-counselling': { name: 'Depression', sameAs: [`${W}Major_depressive_disorder`] },
  stress: { name: 'Psychological stress', sameAs: [`${W}Psychological_stress`] },
};

/* Places. The practice serves two provinces and named them as bare strings,
   which is enough for a person and ambiguous for a machine — there is more
   than one British Columbia and more than one Alberta on this planet. */
export const PLACE_ENTITY: Record<string, string[]> = {
  'British Columbia': [`${W}British_Columbia`],
  Alberta: [`${W}Alberta`],
  Canada: [`${W}Canada`],
};

/**
 * What the practice knows about, as entities rather than as strings.
 *
 * The subset of the therapies and conditions above that the practice actually
 * claims expertise in. A `knowsAbout` entry that is a thing with a definition
 * says something a `knowsAbout` entry that is a word cannot.
 */
/* CONDITIONS ONLY, AND DELIBERATELY.
   The five therapies were here too, and every one of them was already in the
   organisation's `availableService` on the same page, carrying the same name
   and the same sameAs. Saying "this practice offers EMDR" and "this practice
   knows about EMDR" in one document is one fact and 700 wasted bytes on 295
   pages. What it knows about and does not sell is the half that adds
   something, and the strings beside it in the layout cover the rest.

   Typed as conditions, not as therapies. The first draft of this array
   concatenated both and gave every entry `MedicalTherapy`, which would have
   published "Depression is a therapy this practice offers". */
export const KNOWS_ABOUT_ENTITIES: { '@type': string; name: string; sameAs: string[] }[] =
  ['anxiety', 'depression', 'trauma', 'ptsd', 'burnout', 'grief', 'panic-attacks']
    .map((slug) => ({ '@type': 'MedicalCondition', name: CONDITION_ENTITY[slug].name, sameAs: CONDITION_ENTITY[slug].sameAs }));

/** Every URL in this file, for the gate that checks they all still resolve. */
export const ALL_ENTITY_URLS = [
  ...Object.values(THERAPY_ENTITY).flatMap((e) => e.sameAs),
  ...Object.values(CONDITION_ENTITY).flatMap((e) => e.sameAs),
  ...Object.values(PLACE_ENTITY).flat(),
];

/** A `State` node that says which British Columbia is meant. */
export const placeNode = (name: string, inCountry = 'Canada') => ({
  '@type': 'State' as const,
  name,
  ...(PLACE_ENTITY[name] ? { sameAs: PLACE_ENTITY[name] } : {}),
  containedInPlace: {
    '@type': 'Country' as const,
    name: inCountry,
    ...(PLACE_ENTITY[inCountry] ? { sameAs: PLACE_ENTITY[inCountry] } : {}),
  },
});

/**
 * A `MedicalTherapy` node that names what it is.
 *
 * Falls back to the bare name when the slug is not one this file knows, which
 * is the same node the site emitted before and never worse than it.
 */
export const therapyNode = (slug: string, fallbackName: string) => {
  const e = THERAPY_ENTITY[slug];
  return e
    ? { '@type': 'MedicalTherapy' as const, name: e.name, ...alt(e.name, fallbackName), sameAs: e.sameAs }
    : { '@type': 'MedicalTherapy' as const, name: fallbackName };
};

/** The same, for a condition rather than a method. */
export const conditionNode = (slug: string, fallbackName: string) => {
  const e = CONDITION_ENTITY[slug];
  return e
    ? { '@type': 'MedicalCondition' as const, name: e.name, ...alt(e.name, fallbackName), sameAs: e.sameAs }
    : { '@type': 'MedicalCondition' as const, name: fallbackName };
};

/* The site's own name for the thing, where it differs from the entity's.
   "Individual Therapy" is what this practice calls psychotherapy and is worth
   saying; "Couples Therapy" as an alternateName for Couples therapy is a
   second copy of the same word on 295 pages, which the perf budget noticed
   before anybody else would have. */
function alt(name: string, fallback: string) {
  return name.toLowerCase() === fallback.toLowerCase() ? {} : { alternateName: fallback };
}
