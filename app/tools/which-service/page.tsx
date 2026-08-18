import type { Metadata } from 'next';
import Link from 'next/link';
import Figure from '@/components/Figure';
import { getTool, WHICH_SERVICE, WHICH_SERVICE_OUTCOMES } from '@/lib/tools';
import ToolShell from '@/components/tools/ToolShell';
import CtaBand from '@/components/CtaBand';
import WhichServiceTool from '@/components/tools/WhichServiceTool';
import { site } from '@/lib/site';

const tool = getTool('which-service')!;
export const metadata: Metadata = {
  title: { absolute: tool.metaTitle },
  description: tool.metaDescription,
  alternates: { canonical: `${site.domain}/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <>
    <ToolShell
      tool={tool}
      intro={
        <>
          Five questions about what has been going on, and a suggested place to start. Some
          answers point to a service here; some point to a guide, to a crisis line, or to
          something that is not counselling at all. Nothing is stored and there is no sign-up.
        </>
      }
    >
      <WhichServiceTool />

      <div className="prose tool-prose">
          <Figure name="approach-selector" />
          <h2 id="how-it-works">How this works, and what it cannot do</h2>
          <p>
            Five questions, weighted so urgency wins. If an answer indicates you are not safe,
            the result says so and points at{' '}
            <Link href="/resources/bc-crisis-and-support-directory">crisis services</Link>{' '}
            rather than a service page — a website should not be triaging that, and counselling
            is the wrong speed for it.
          </p>
          <p>
            Otherwise it looks for the pattern people most often arrive with. Something older
            that is still active points toward{' '}
            <Link href="/services/trauma-therapy">trauma-informed work</Link> and possibly{' '}
            <Link href="/services/emdr-therapy">EMDR</Link>. Conflict or distance points to{' '}
            <Link href="/services/couples-therapy">couples counselling</Link>, and if only one of
            you wants to come,{' '}
            <Link href="/compare/individual-vs-couples-therapy">individual vs couples therapy</Link>{' '}
            is the decision to read first. Exhaustion from work points at{' '}
            <Link href="/guides/burnout-vs-depression">burnout vs depression</Link>, because those
            two look alike and need different responses.
          </p>
          <p>
            What it cannot do is assess anything. It has no validation behind it, it does not know
            your history, and five questions cannot outperform a conversation. Treat it as a
            signpost — a <Link href="/book">free 15-minute consultation</Link> costs nothing and
            will get you a better answer. If you would rather read first,{' '}
            <Link href="/guides/signs-it-might-be-time-for-therapy">signs it might be time for therapy</Link>{' '}
            covers the same ground at length.
          </p>
      </div>
    </ToolShell>
      {/* Someone who abandons the tool halfway had nowhere to go: the
          result CTA only renders on completion, and only client-side. */}
      <CtaBand />
    </>
  );
}
