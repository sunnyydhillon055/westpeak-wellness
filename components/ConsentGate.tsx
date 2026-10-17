'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { excludedBrowser } from '@/lib/analytics';

/* The GA component is fetched only once someone has said yes.
 *
 * A static import of @next/third-parties pulled it, and next/script behind
 * it, into the chunk every page loads — 20.5 KB on the wire before anything
 * could be tapped, for a person who has not consented and may never. With
 * a dynamic import the code is downloaded on the render that follows a
 * "granted" choice (now or on a later visit), which is the first moment it
 * has anything to do. No server render: this only ever mounts in a browser,
 * after a localStorage read. 1 Oct 2026.
 *
 * A plain import() in an effect since 15 Oct 2026, not next/dynamic. The
 * wrapper brought its own loadable, BailoutToCSR and PreloadCss modules into
 * the layout chunk (2,917 B) to do what one effect does here: this component
 * never renders on the server anyway, so there was nothing for it to bail
 * out of. The import still happens only after "granted", and a failed one
 * renders nothing, which is the declined behaviour.
 *
 * THE BANNER IS FETCHED THE SAME WAY — 16 Oct 2026 (item 551). Its markup
 * is components/ConsentBanner.tsx, imported only while no choice is stored:
 * this component is in the root layout's chunk, and a returning visitor who
 * has answered either way needs none of the banner. One effect fetches
 * whichever part the choice calls for; `part.for` keeps a part from
 * rendering for a choice it was not fetched for. */
type Part = ComponentType<{ gaId: string; onDecide: (c: 'granted' | 'declined') => void }>;

/* Consent before Google Analytics — nothing loads until a person says yes.
 *
 * PIPEDA consent works on knowledge and choice, so the banner appears only
 * when there is actually something to consent to: this component is rendered
 * by the layout only when a GA ID is set (lib/site.ts, site.gaId).
 *
 * Two equal buttons, no pre-selection, no nagging on later visits either way,
 * and decline is remembered exactly as long as accept. The first-party
 * counter (lib/analytics.ts -> /api/track) is unaffected by this choice: it
 * sets no cookie, stores no identifier, and counts events, not people.
 *
 * The choice lives in localStorage rather than a cookie so it is never sent
 * anywhere. Storage can be unavailable (private windows, blocked site data);
 * every access is wrapped, and with no readable choice the site behaves as
 * declined — the failure mode is less tracking, never more. */

const KEY = 'wpw-analytics-consent';

type Choice = 'granted' | 'declined' | null;

/* A BROWSER /admin HAS EXCLUDED IS NEVER ASKED — 16 Oct 2026 (item 588).
 * NoCountSwitch sets NO_COUNT_KEY (lib/analytics.ts) and track() then sends
 * nothing, but GA's own automatic page_view went out regardless once GA had
 * been accepted there. Read as declined: no banner, no GA, and the stored
 * choice is left alone, so clearing the switch restores it. excludedBrowser
 * is already in this chunk (track uses it), so the layout chunk grows by
 * the one call only. */
const read = (): Choice => {
  try {
    if (excludedBrowser()) return 'declined';
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'declined' ? v : null;
  } catch {
    return 'declined';
  }
};

export default function ConsentGate({ gaId }: { gaId: string }) {
  /* 'unset' until mounted so the server render carries no banner and no
   * GA — the choice is only knowable in the browser. */
  const [choice, setChoice] = useState<Choice | 'unset'>('unset');
  const [part, setPart] = useState<{ for: Choice; C: Part } | null>(null);

  useEffect(() => {
    setChoice(read());
  }, []);

  useEffect(() => {
    if (choice === 'unset' || choice === 'declined') return;
    let live = true;
    (choice === 'granted'
      ? import('@next/third-parties/google').then((m) => m.GoogleAnalytics as Part)
      : import('@/components/ConsentBanner').then((m) => m.default as Part))
      .then((C) => { if (live) setPart({ for: choice, C }); })
      .catch(() => { /* no analytics and no banner, never a broken page */ });
    return () => { live = false; };
  }, [choice]);

  const decide = (c: Exclude<Choice, null>) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* nowhere to remember it; the banner will return next visit */
    }
    setChoice(c);
  };

  if (choice === 'unset' || choice === 'declined' || !part || part.for !== choice) return null;
  return <part.C gaId={gaId} onDecide={decide} />;
}
