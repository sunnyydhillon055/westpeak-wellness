import type { Metadata } from 'next';
import Link from 'next/link';
import Figure from '@/components/Figure';
import { getTool } from '@/lib/tools';
import ToolShell from '@/components/tools/ToolShell';
import CoverageEstimator from '@/components/tools/CoverageEstimator';
import { site } from '@/lib/site';

const tool = getTool('therapy-cost-bc')!;
export const metadata: Metadata = {
  title: { absolute: tool.metaTitle },
  description: tool.metaDescription,
  alternates: { canonical: `${site.domain}/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      intro={
        <>
          Counselling in BC private practice is not covered by MSP, so what you actually pay
          depends on your extended health plan. This works out the difference from the numbers
          on your own plan, and names the two questions to ask before booking anything.
        </>
      }
    >
      <CoverageEstimator />

      <div className="prose tool-prose">
          <Figure name="therapy-cost-in-bc" />
          <h2 id="how-it-works">Why the answer is never a single number</h2>
          <p>
            Counselling in BC private practice is not covered by MSP —{' '}
            <Link href="/resources/msp-vs-extended-health">MSP vs extended health</Link> sets out
            what the public plan does and does not pay for. What you actually pay therefore
            depends on an extended health plan, and those differ per employer rather than per
            insurer, which is why no website can honestly quote you a figure.
          </p>
          <p>
            Two questions decide it. First, <strong>does the plan cover a Registered Clinical
            Counsellor specifically</strong> — a plan can cover a psychologist and not an RCC, and
            that is the detail people most often discover after a first session rather than before
            it.{' '}
            <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link>{' '}
            explains why the designations are not interchangeable. Second, <strong>what are the
            per-session and annual maximums</strong>, since an annual cap usually binds before the
            per-session rate does.
          </p>
          <p>
            This practice does not direct-bill, so you pay at the session and claim it back —{' '}
            <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</Link>{' '}
            covers how that works. If cost is the constraint rather than a detail,{' '}
            <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> and{' '}
            <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link>{' '}
            are worth reading before paying anybody: a great many people already have a free
            entitlement they have never used. Full numbers are on{' '}
            <Link href="/pricing">fees and coverage</Link>.
          </p>
      </div>
    </ToolShell>
  );
}
