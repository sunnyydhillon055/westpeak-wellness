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
  stress: { name: 'Psychological stress', sameAs: [`${W}Psychological_stress`] },
};

/** Every URL in this file, for the gate that checks they all still resolve. */
export const ALL_ENTITY_URLS = [
  ...Object.values(THERAPY_ENTITY),
  ...Object.values(CONDITION_ENTITY),
].flatMap((e) => e.sameAs);

/**
 * A `MedicalTherapy` node that names what it is.
 *
 * Falls back to the bare name when the slug is not one this file knows, which
 * is the same node the site emitted before and never worse than it.
 */
export const therapyNode = (slug: string, fallbackName: string) => {
  const e = THERAPY_ENTITY[slug];
  return e
    ? { '@type': 'MedicalTherapy' as const, name: e.name, alternateName: fallbackName, sameAs: e.sameAs }
    : { '@type': 'MedicalTherapy' as const, name: fallbackName };
};

/** The same, for a condition rather than a method. */
export const conditionNode = (slug: string, fallbackName: string) => {
  const e = CONDITION_ENTITY[slug];
  return e
    ? { '@type': 'MedicalCondition' as const, name: e.name, alternateName: fallbackName, sameAs: e.sameAs }
    : { '@type': 'MedicalCondition' as const, name: fallbackName };
};
