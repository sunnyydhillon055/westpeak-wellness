/* THE GLOSSARY'S ONWARD LINKS, NAMED FOR WHERE THEY GO — 2 Oct 2026
 * (wf/services-cards, item 390).
 *
 * Every term with a deeper page ended "Read more →", so /glossary (46
 * impressions at 16.63) sent thirty links whose text said nothing out of
 * context, and seven of them to /services/individual-therapy under the same
 * two words. Each now says what the target page is. The seven that share a
 * target name the part of that page the term is about, so no two anchors on
 * the page repeat. Keyed by the term as lib/glossary.ts spells it; a test
 * holds that every term with an href has one, and that none is vague.
 *
 * Plain nouns only: no outcome, no promise, no hours. */
export const GLOSSARY_ANCHORS: Readonly<Record<string, string>> = {
  'Cognitive behavioural therapy': 'CBT or EMDR for trauma',
  EMDR: 'EMDR therapy in BC',
  'Gottman Method': 'How the Gottman Method works',
  'Somatic therapy': 'Body-aware work in individual therapy',
  'Emotionally focused therapy': 'Couples therapy in BC',
  'Exposure therapy': 'Exposure work in individual therapy',
  'Behavioural activation': 'Behavioural activation in individual therapy',
  Anxiety: 'Individual therapy for anxiety',
  'Panic attack': 'Anxiety attack or panic attack',
  'High-functioning anxiety': 'High-functioning anxiety, explained',
  Depression: 'Individual therapy for depression',
  Burnout: 'Burnout or depression',
  'Post-traumatic stress': 'Individual therapy after trauma',
  'Intergenerational trauma': 'Intergenerational trauma, explained',
  'Window of tolerance': 'The window of tolerance in individual therapy',
  'Moral injury': 'Counselling for healthcare and shift workers',
  Intake: 'What to expect in a first session',
  'Informed consent': 'Ethics and accountability standards',
  'Scope of practice': 'Scope of practice and standards',
  Resourcing: 'How an EMDR session works',
  'Duty to report': 'Privacy and the limits of confidentiality',
  Telehealth: 'Online therapy compared with in person',
  'Registered Clinical Counsellor': 'RCC, psychologist or social worker',
  'Unprotected titles': 'How to find a therapist in BC',
  MSP: 'MSP or extended health',
  'Extended health benefits': 'Extended health coverage for counselling',
  'Direct billing': 'Fees and coverage',
  EFAP: 'Low-cost counselling in BC',
  '9-8-8': 'BC crisis and support directory',
  PIPA: 'How this practice handles your information',
};

/** The anchor for a term's onward link; the target's path as a last resort,
 *  never "Read more". */
export const glossaryAnchor = (term: string, href: string): string =>
  GLOSSARY_ANCHORS[term] ?? href.replace(/^\//, '').replace(/[-/]+/g, ' ');
