import type { Metadata } from 'next';
import Link from 'next/link';
import Figure from '@/components/Figure';
import { getTool, STRESS_CHECK } from '@/lib/tools';
import ToolShell from '@/components/tools/ToolShell';
import CtaBand from '@/components/CtaBand';
import StressCheckTool from '@/components/tools/StressCheckTool';
import { site } from '@/lib/site';
import { ogBase } from '@/lib/og-meta';

const tool = getTool('stress-check')!;
export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBase('/tools/stress-check') },
  title: { absolute: tool.metaTitle },
  description: tool.metaDescription,
  alternates: { canonical: `${site.domain}/tools/${tool.slug}` },
};

/* Deliberately produces no score and no category.
 *
 * A number would be read as a diagnosis however it were captioned, and this is
 * not a screening instrument — it has no validation behind it and BCACC
 * advertising standards do not permit implying otherwise. What it does instead
 * is reflect the pattern back in the reader's own words, which is genuinely
 * useful for deciding whether to talk to someone. */
const REFLECTIONS: Record<string, string> = {
  arousal:
    'Several answers point at a nervous system that has not been getting the chance to settle — sleep that will not come, a body that stays tense, a mind that replays things. That is a recognisable pattern and it responds well to being worked on directly.',
  low:
    'Several answers describe flatness rather than distress: less enjoyment, more weight, less motivation. That is worth taking as seriously as anxiety, and it tends to be quieter about announcing itself.',
  load:
    'What stands out is load rather than any single symptom — the sense that the current arrangement is not sustainable for another six months. That is useful information on its own.',
  self:
    'One answer stands out: when things go wrong, the explanation you reach for is that it is your fault. That habit is one of the more changeable things in this list.',
  seen:
    'Someone around you has already asked if you are okay. People usually ask because they have noticed something real.',
  alone:
    'You mentioned there is not really anyone to notice. That is its own thing to name, separate from everything else here.',
};

export default function Page() {
  return (
    <>
    <ToolShell
      tool={tool}
      intro={
        <>
          Six questions to help put words to how the last few weeks have actually been. This is
          not a screening test, it produces no score, and it cannot tell you whether you have
          anything — it just reflects back what you said. Nothing is stored.
        </>
      }
    >
      <StressCheckTool />

      <div className="prose tool-prose">
          <Figure name="window-of-tolerance" />
          <h2 id="how-it-works">Why there is no score</h2>
          <p>
            This deliberately produces no number and no category. A score would be read as a
            diagnosis however carefully it were captioned, and this is not a validated screening
            instrument — it has no research behind it, and implying otherwise would breach the
            advertising standards a Registered Clinical Counsellor works under. What it does
            instead is reflect your answers back, which is genuinely useful for deciding whether
            to talk to someone.
          </p>
          <p>
            The questions cover sleep, enjoyment, physical tension, self-blame, whether anyone has
            noticed, and whether the current arrangement is sustainable. Those tend to shift first.
            If the pattern that comes back is worry and a body that will not settle,{' '}
            <Link href="/guides/high-functioning-anxiety">high-functioning anxiety</Link> and{' '}
            <Link href="/guides/anxiety-and-sleep">anxiety and sleep</Link> are the closest
            reading. If it is flatness,{' '}
            <Link href="/guides/burnout-vs-depression">burnout vs depression</Link> is the
            distinction that changes what helps.
          </p>
          <p>
            Nothing you enter is stored, sent or logged — it lives in the page and is gone when you
            close it, which is set out in full on{' '}
            <Link href="/privacy">privacy and confidentiality</Link>. If any of it lands, that is a
            reasonable thing to bring to a{' '}
            <Link href="/book">free 15-minute consultation</Link>, and{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">what to expect in a first session</Link>{' '}
            describes what happens next.
          </p>
      </div>
    </ToolShell>
      {/* Someone who abandons the tool halfway had nowhere to go: the
          result CTA only renders on completion, and only client-side. */}
      <CtaBand />
    </>
  );
}
