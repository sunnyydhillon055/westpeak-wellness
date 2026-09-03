import type { Metadata } from 'next';
import Link from 'next/link';
import Figure from '@/components/Figure';
import { getTool } from '@/lib/tools';
import ToolShell from '@/components/tools/ToolShell';
import CtaBand from '@/components/CtaBand';
import BurnoutCheck from '@/components/tools/BurnoutCheck';
import { site } from '@/lib/site';
import { ogBase } from '@/lib/og-meta';

const tool = getTool('burnout-or-depression')!;

export const metadata: Metadata = {
  title: { absolute: tool.metaTitle },
  description: tool.metaDescription,
  alternates: { canonical: `${site.domain}/tools/${tool.slug}` },
  openGraph: { ...ogBase(`/tools/${tool.slug}`) },
};

export default function Page() {
  return (
    <>
    <ToolShell
      tool={tool}
      intro={
        <>
          They produce almost identical days from the inside — flat, tired, short-tempered,
          nothing landing. They respond to very different things, which is why the distinction
          is worth making early rather than after a year of treating one as the other.
        </>
      }
    >
      <BurnoutCheck />

      <div className="prose tool-prose">
        <Figure name="burnout-vs-depression" />

        <h2 id="the-difference">The one question that separates them</h2>
        <p>
          Does it travel with you? Burnout is bound to a context. Take somebody genuinely away
          from the source for long enough and it eases measurably, and the parts of life that
          have nothing to do with the pressure are usually still intact. Depression comes along.
          The week away lifts one of these noticeably and leaves the other roughly where it was.
        </p>
        <p>
          That is not a perfect test and it is not offered as one. Plenty of people cannot
          remember their last genuine break, which makes the question unanswerable rather than
          answered — and that is its own finding. Burnout left running long enough also tends to
          become depression, so the two coexist more often than either is described alone.
        </p>

        <h2 id="why-it-matters">Why getting it wrong costs time</h2>
        <p>
          Burnout responds to changing the conditions producing it. Treating it as an individual
          pathology — as a failure to cope with something that is genuinely unreasonable — tends
          to make people feel worse rather than better, because it locates the fault in the
          person rather than in the load.
        </p>
        <p>
          Depression does not resolve by fixing the job. Waiting for the workload to change is
          one of the most common ways people lose a year, because the thing they are waiting on
          was never the cause. The longer read is{' '}
          <Link href="/guides/burnout-vs-depression">burnout vs depression</Link>; if work is the
          source, <Link href="/guides/stress-leave-bc">stress leave in BC</Link> covers what is
          actually available, and{' '}
          <Link href="/guides/high-functioning-anxiety">high-functioning anxiety</Link> covers
          the version nobody around you can see.
        </p>

        <h2 id="what-this-is-not">What this is not</h2>
        <p>
          Not a screening instrument, not validated, and not a diagnosis. It has no score, and a
          tool that produced one would be read as a verdict however it were captioned. A
          Registered Clinical Counsellor does not diagnose in any case — where a formal diagnosis
          is what you need, that is a physician, psychiatrist or registered psychologist, and the{' '}
          <Link href="/resources/psychiatry-and-assessment-in-bc">assessment routes in BC</Link>{' '}
          page sets out how to get one. Nothing you enter here is stored or sent anywhere.
        </p>
      </div>
    </ToolShell>
    {/* Someone who abandons the check halfway had nowhere to go: the result CTA
        renders only on completion, and only client-side. The CTA gate fails the
        build on exactly that, and did. */}
    <CtaBand />
    </>
  );
}
