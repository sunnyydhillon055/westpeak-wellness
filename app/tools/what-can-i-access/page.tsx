import type { Metadata } from 'next';
import Link from 'next/link';
import Figure from '@/components/Figure';
import { getTool } from '@/lib/tools';
import ToolShell from '@/components/tools/ToolShell';
import CtaBand from '@/components/CtaBand';
import AccessCheck from '@/components/tools/AccessCheck';
import { site } from '@/lib/site';
import { ogBase } from '@/lib/og-meta';

const tool = getTool('what-can-i-access')!;

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
          Most people looking for counselling compare two options: wait for the public system,
          or pay. There are usually five or six doors open, several of them free, and the one
          people most often miss is an entitlement they already have through work.
        </>
      }
    >
      <AccessCheck />

      <div className="prose tool-prose">
        <Figure name="bc-support-routes" />

        <h2 id="no-wait-times">Why there are no wait times here</h2>
        <p>
          Because nobody can publish them honestly. Waits differ by health authority, by service,
          by season and by whether a particular team is short-staffed this month, and no public
          dataset tracks counselling waits across British Columbia and Alberta in a way anybody
          could quote. A site that gives you a number has either found one narrow figure and
          generalised it, or made it up.
        </p>
        <p>
          What can be said honestly is the relative order, which routes tend to open in days,
          which in weeks, which in months. That is also the comparison that changes what you do
          next, which a single number never does.
        </p>

        <h2 id="the-missed-one">The route people miss</h2>
        <p>
          An employee assistance programme. It is confidential from your employer, it usually
          moves within days, it covers a set number of sessions, and it is already paid for
          through your benefits. A significant number of people pay privately for something they
          were entitled to and did not know about, and the way to find out is one call to HR or
          one look at the benefits booklet.
        </p>
        <p>
          If you are enrolled anywhere, campus counselling is the same story: included in fees
          you have already paid, and generally faster to reach than a community service. Session
          limits are real, and it is still the sensible first call.
        </p>

        <h2 id="both-at-once">Starting privately does not cost you the queue</h2>
        <p>
          Joining a public waitlist and starting somewhere else are not alternatives. Staying in
          the queue costs nothing while you begin, and coming off it because you found something
          private is the decision people most often regret.{' '}
          <Link href="/guides/waiting-for-therapy-in-bc">What to do while you wait</Link> covers
          the practical version, and{' '}
          <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> and{' '}
          <Link href="/resources/counselling-coverage-in-alberta">coverage in Alberta</Link> list
          what exists in each province.
        </p>
      </div>
    </ToolShell>
    {/* The result CTA renders only on completion and only client-side, so a
        reader who abandons the tool halfway would otherwise have nowhere to go.
        The CTA gate fails the build on exactly that. */}
    <CtaBand />
    </>
  );
}
