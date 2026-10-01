import Link from 'next/link';

/* ONE LINE ABOUT WHO PAYS, UNDER THE HERO BUTTON — 1 Oct 2026.
 *
 * The city pages said nothing about coverage at all, and the audience pages
 * said it only somewhere in two thousand words of prose. The question "is
 * this covered?" is one of the four that stop a person booking (see
 * BookingCard.tsx), and on these two templates it was unanswered at the
 * moment the button is in front of them.
 *
 * THE WORDS ARE /pricing's WORDS. That page's direct answer is "Most BC
 * extended health plans reimburse a Registered Clinical Counsellor; MSP does
 * not cover private counselling", its payment section says you pay the
 * practice and receive a receipt, and it says fees are published in full.
 * This line says the same three things in the same order and nothing more.
 * "Most", and never an insurer's name: whether a plan reimburses depends on
 * the employer's plan, not the insurer, so coverage is always plan-dependent
 * and never promised. If /pricing's claim changes, this line changes with it
 * or it is wrong.
 *
 * ONE COMPONENT, NOT A SENTENCE PER PAGE. The uniqueness gate
 * (scripts/uniqueness-gate.mjs) measures the two-segment city x service
 * pages only, by its own rule ("a city hub lives one level up"), so a shared
 * sentence on the city hubs and the audience pages is outside it. It is a
 * component so that there is one copy to keep in step with /pricing. */
export default function CoverageLine() {
  return (
    <p className="hero-note hero-coverage">
      Most BC{' '}
      <Link href="/resources/does-my-plan-cover-counselling-bc">extended health plans</Link>{' '}
      reimburse sessions with a Registered Clinical Counsellor; MSP does not. Receipts are
      issued for every session, and the <Link href="/pricing">fees</Link> are published in
      full.
    </p>
  );
}
