import Link from 'next/link';
import CounsellorCards from '@/components/CounsellorCards';
import { counsellorsForInfoPage, feeLineFor, infoCardCopy } from '@/lib/counsellor-cards';
import { FALLBACK_CATALOG } from '@/lib/cliniko-catalog';

/* WHO YOU WOULD TALK TO, UNDER A TOOL — 4 Oct 2026 (wf/s7-tools).
 *
 * The five tools and their hub named nobody. A reader who had just worked out
 * that couples work fits, or what a session would cost after extended health,
 * met the practice-wide /book and no person, while the guides on the same
 * questions show the counsellors taking new clients (components/NextStep).
 * This draws the same cards, chosen by the same rule: counsellorsForInfoPage
 * with no service is whoever is accepting individual clients in BC, which is
 * the only work every tool can lead to. The founder is excluded by the
 * accepting flag, never by name.
 *
 * A SERVER COMPONENT, AND IT MUST STAY ONE. It reads the roster; the tool
 * widgets are client components and receive nothing from here.
 *
 * The fee is the catalogue's own line (feeLineFor), read from
 * FALLBACK_CATALOG as the cost estimator does, so these pages stay static and
 * price-drift checks the figure. The registration link sits beside the names
 * it vouches for, which is where a reader would want to check it. `gentle`
 * gives the two reflection tools the gentle heading the leave guides use. */
export default function ToolCounsellors({ gentle = false }: { gentle?: boolean }) {
  const counsellors = counsellorsForInfoPage({});
  if (counsellors.length === 0) return null;
  const copy = infoCardCopy(gentle);
  const feeLine = feeLineFor(undefined, FALLBACK_CATALOG);
  return (
    <CounsellorCards
      counsellors={counsellors}
      location="counsellor-tool"
      className="section section--ghost"
      heading={copy.heading}
      intro={copy.intro}
      footer={
        <p className="hero-note hero-coverage" style={{ margin: 0 }}>
          {feeLine ? `${feeLine} ` : ''}
          <Link href="/pricing">All fees</Link> ·{' '}
          <Link href="/resources/verify-a-counsellor-in-bc">How to check a counsellor’s registration</Link>
        </p>
      }
    />
  );
}
