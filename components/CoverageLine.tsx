import Link from 'next/link';
import { planYearPageLineShown, YEAR_END_PATH } from '@/lib/seasonal';

/* ONE LINE ABOUT WHO PAYS, UNDER THE HERO BUTTON — 1 Oct 2026.
 *
 * The city pages said nothing about coverage at all, and the audience pages
 * said it only somewhere in two thousand words of prose. The question "is
 * this covered?" is one of the four that stop a person booking (see
 * BookingCard.tsx), and on these two templates it was unanswered at the
 * moment the button is in front of them.
 *
 * THE WORDS ARE /pricing's WORDS. That page's direct answer is "Many
 * extended health plans reimburse an RCC, depending on the plan, so check
 * yours", its payment section says you pay the practice and receive a
 * receipt, and it says fees are published in full. This line says the same
 * three things in the same order and nothing more. "Many … depending on the
 * plan", and never an insurer's name: whether a plan reimburses depends on
 * the employer's plan, not the insurer, so coverage is always plan-dependent
 * and never promised. If /pricing's claim changes, this line changes with it
 * or it is wrong.
 *
 * 1 Oct 2026 (item 268): this line kept the old "most plans" wording for a
 * week after /pricing dropped it, because the JSX split the phrase over three
 * source lines and scripts/coverage-claims.mjs matched line by line. The gate
 * now joins JSX text across line breaks before it matches.
 *
 * ONE COMPONENT, NOT A SENTENCE PER PAGE. The uniqueness gate
 * (scripts/uniqueness-gate.mjs) measures the two-segment city x service
 * pages only, by its own rule ("a city hub lives one level up"), so a shared
 * sentence on the city hubs and the audience pages is outside it. It is a
 * component so that there is one copy to keep in step with /pricing.
 *
 * IN SEASON, THE PLAN YEAR — 2 Oct 2026 (item 388). From 15 Oct to 31 Dec on
 * the Pacific date (planYearPageLineShown, lib/seasonal.ts, the same window
 * /pricing and /book use), one clause links the year-end page from every
 * page that carries this line. Conditional on a calendar-year plan and
 * naming no insurer, so it stays plan-dependent. The pages that render this
 * revalidate hourly, so the clause appears and goes on its own. */
export default function CoverageLine({ now }: { now?: Date } = {}) {
  return (
    <p className="hero-note hero-coverage">
      Many{' '}
      <Link href="/resources/does-my-plan-cover-counselling-bc">extended health plans</Link>{' '}
      reimburse a Registered Clinical Counsellor, depending on the plan, so check yours; MSP
      does not. Receipts are issued for every session, and the{' '}
      <Link href="/pricing">fees</Link> are published in full.
      {planYearPageLineShown(now) && (
        <>
          {' '}On a calendar-year plan, sessions held by 31 December count against this year:{' '}
          <Link href={YEAR_END_PATH}>using benefits before the plan year ends</Link>.
        </>
      )}
    </p>
  );
}
