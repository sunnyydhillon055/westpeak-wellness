import { useEffect, useRef } from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import LeavePayCalculator from '@/components/tools/LeavePayCalculator';
import { fontVars, body as bodyFont } from '@/app/fonts';
/* Used in getStaticProps only, so Next strips both from the browser bundle:
   the page receives four numbers and two strings, never the modules. */
import { eiSicknessMax, EI_WAITING_WAIVER, longDate } from '@/lib/benefit-figures';
import { site } from '@/lib/site';
import { track, type TrackedEvent } from '@/lib/analytics';

/* Counted (COUNTED in lib/conversion-log.ts), not yet in TrackedEvent, which
   lives in the shared lib/analytics.ts; a type-only addition there at
   integration removes this widening. */
const EMBED_EVENT: string = 'embed_view';

/* THE EMBEDDABLE STRESS-LEAVE PAY CALCULATOR — 15 Oct 2026.
 *
 * For HR, union and benefits sites to put in an iframe. The calculator and one
 * credit line, nothing else: no header, footer, phone booking bar, counsellor
 * cards, consent banner or analytics loader. It lives in pages/ rather than
 * app/ because every app/ route renders inside app/layout.tsx, which draws all
 * of that (pages/_app.tsx has the reasoning).
 *
 * noindex: it is a frame for other people's pages, and the indexable copy is
 * /tools/stress-leave-pay-calculator, which also carries the snippet. The
 * robots meta below says so in the HTML and next.config.mjs says so in
 * X-Robots-Tag; the same rule there is the only route allowed to be framed
 * (frame-ancestors *). The EI figures arrive as props from
 * lib/benefit-figures.ts at build time, exactly as the /tools page passes them. */

type Props = {
  ei: { weekly: number; year: number };
  waiver: { from: string; to: string; toLabel: string };
  origin: string;
};

/** The message a host page may listen for to size the frame to its content. */
export const HEIGHT_MESSAGE = 'westpeak-embed-height';
export const TOOL_PATH = '/tools/stress-leave-pay-calculator';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const ei = eiSicknessMax();
  return {
    props: {
      ei: { weekly: ei.weekly, year: ei.year },
      waiver: { from: EI_WAITING_WAIVER.from, to: EI_WAITING_WAIVER.to, toLabel: longDate(EI_WAITING_WAIVER.to) },
      origin: site.domain,
    },
  };
};

export default function EmbedLeavePay({ ei, waiver, origin }: Props) {
  const box = useRef<HTMLDivElement>(null);

  /* WHO EMBEDDED IT — 15 Oct 2026. One `embed_view` per load while framed,
     carrying the host page's domain only (the hostname of the referrer,
     never its path or query). /api/track keeps it only when it is one of
     the organisations docs/OUTREACH.md section 14 asked, and stores
     `other` for anything else. No cookie, no identifier. */
  useEffect(() => {
    if (window.parent === window) return;
    let host = '';
    try { host = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* unreadable: other */ }
    track(EMBED_EVENT as TrackedEvent, { detail: host || 'none' });
  }, []);

  /* Auto-height, for a host page that adds the optional listener in the
     snippet. Only the height is sent, and only when this page is framed. */
  useEffect(() => {
    const el = box.current;
    if (!el || window.parent === window || typeof ResizeObserver === 'undefined') return;
    let last = 0;
    const send = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height === last) return;
      last = height;
      window.parent.postMessage({ type: HEIGHT_MESSAGE, height }, '*');
    };
    const ro = new ResizeObserver(send);
    ro.observe(el);
    send();
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>BC Stress Leave Pay Calculator | Westpeak Wellness</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
        <meta
          name="description"
          content="What a stress leave in BC would pay, week by week: sick days, EI sickness benefits, and where a disability plan or WorkSafeBC takes over."
        />
      </Head>
      <div ref={box} className={`${fontVars} ${bodyFont.className}`} style={{ padding: '16px', maxWidth: 760, margin: '0 auto' }}>
        <main>
          <h1 style={{ fontSize: '1.4rem', margin: '0 0 6px' }}>Stress leave pay calculator for BC</h1>
          <p className="quiz-help">
            What a stress leave would pay you, week by week: sick days, EI sickness benefits, and
            where a disability plan or WorkSafeBC takes over. An estimate from what you enter, not
            advice. The earnings you enter stay in your browser.
          </p>
          <LeavePayCalculator ei={ei} waiver={waiver} embed={{ origin }} />
          <p className="embed-credit" style={{ margin: '14px 0 0', fontSize: '.88rem', color: 'var(--ink-faint)' }}>
            Calculator by Westpeak Wellness:{' '}
            <a href={`${origin}${TOOL_PATH}`} target="_blank" rel="noopener">
              the BC stress leave pay calculator, with a worked example and its sources
            </a>
          </p>
        </main>
      </div>
    </>
  );
}
