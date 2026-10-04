/* THE NEXT STEP AT THE END OF AN ARTICLE — 1 Oct 2026.
 *
 * The data half of components/NextStep.tsx: which guides take the gentle
 * register, and which small steps the closing block offers beside the
 * booking button. Pure, so it is tested without Next. No roster import: a
 * client component may one day want the steps, and lib/practitioners.ts must
 * never reach the browser (the perf rule of 1 Oct 2026).
 *
 * WHY THE SOFT STEPS. Every closing band ended "or read the guides first",
 * which on a guide sends the reader back to the index they came from. 31 of
 * 42 guides linked no tool, 33 linked no /pricing, and the consultation-prep
 * page was linked from one guide. These are the three smaller things a
 * reader who is not ready to book can usefully do next: the tool that fits
 * the page's subject, what sessions cost, and what the free 15 minutes is
 * like. Links only; no form. tool_complete is already counted
 * (lib/conversion-log.ts), so whether anybody takes them is measurable. */

/* Guides where "Still deciding? Book a free consultation!" is the wrong note.
 *
 * These are the pages somebody reaches while frightened, bereaved, or watching
 * somebody they love come apart — not while comparing providers. The same
 * consultation is still offered; only the register changes, and the ask stops
 * assuming the reader is in a position to decide anything today.
 *
 * Kept as an explicit list rather than inferred from the topic, because the
 * judgement of which pages these are is a clinical one and should be visible
 * and editable in one place. Moved here from app/guides/[slug]/page.tsx so
 * lib/counsellor-cards.ts NO_CARDS can be tested against it.
 *
 * The work-and-money cluster was added 2026-08-28, same reasoning as
 * stress-leave-bc: the reader is mid-difficulty, not comparison-shopping.
 * sick-days-and-mental-health-days-bc stays on the normal register — it is a
 * rights-information page people read in advance. */
export const GENTLE_CTA: ReadonlySet<string> = new Set([
  'intrusive-thoughts-and-what-they-mean',
  'grief-without-a-timeline',
  'what-trauma-actually-means',
  'when-someone-you-love-is-drinking',
  'supporting-someone-who-is-struggling',
  'when-therapy-isnt-working',
  'signs-it-might-be-time-for-therapy',
  'workplace-bullying-in-bc',
  'stress-leave-bc',
  'anger-that-arrives-too-fast',
  'ei-sickness-benefits-and-therapy',
  'doctors-note-for-a-mental-health-leave',
  'return-to-work-after-a-mental-health-leave',
]);

export type SoftStep = { href: string; label: string };

/* The tool for the page's subject. Couples, EMDR and family pages get the
   which-service tool, whose result books the counsellor who offers the
   work. Otherwise the slug decides and the first match wins: cost and
   coverage first, then work and burnout before anxiety, so
   "panic-attacks-at-work" gets the burnout-or-depression reflection rather
   than the stress check. */
const SERVICE_TOOL: SoftStep = { href: '/tools/which-service', label: 'Which kind of counselling fits?' };
const TOPIC_TOOLS: { test: RegExp; step: SoftStep }[] = [
  {
    test: /cover|cost|plan|msp|extended-health|low-cost|efap|benefit|insur|icbc|worksafe|disability/,
    step: { href: '/tools/therapy-cost-bc', label: 'What counselling costs in BC' },
  },
  {
    test: /burnout|work|leave|sick-days|imposter|bullying|doctors-note|ei-sickness|procrastination|perfectionism/,
    step: { href: '/tools/burnout-or-depression', label: 'Burnout, or depression? A reflection' },
  },
  {
    test: /anxi|panic|stress|worry|sleep|overwhelm/,
    step: { href: '/tools/stress-check', label: 'A reflection on how things have been' },
  },
];

export const PRICING_STEP: SoftStep = { href: '/pricing', label: 'What sessions cost' };
export const CONSULT_PREP_STEP: SoftStep = {
  href: '/resources/before-your-first-consultation',
  label: 'What the free 15 minutes is like',
};

/** Up to three small steps for the closing block: the matching tool, if any,
 *  then fees, then what the consultation is like. Never the page itself. */
export function softStepsFor(page: { path: string; slug: string; service?: string }): SoftStep[] {
  const tool = page.service ? SERVICE_TOOL : TOPIC_TOOLS.find((t) => t.test.test(page.slug))?.step;
  return [tool, PRICING_STEP, CONSULT_PREP_STEP]
    .filter((s): s is SoftStep => Boolean(s))
    .filter((s) => s.href !== page.path)
    .slice(0, 3);
}
