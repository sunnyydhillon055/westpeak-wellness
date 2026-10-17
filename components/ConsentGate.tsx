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
 * renders nothing, which is the declined behaviour. */
type GA = ComponentType<{ gaId: string }>;

/* Consent before Google Analytics — nothing loads until a person says yes.
 *
 * PIPEDA consent works on knowledge and choice, so the banner appears only
 * when there is actually something to consent to: this component is rendered
 * by the layout only when NEXT_PUBLIC_GA_ID is set. While that variable is
 * unset (the current state) no banner shows and no Google request is made,
 * because a cookie banner on a site setting no analytics cookies trains
 * people to dismiss banners and nothing else.
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
 * is already in this chunk (track uses it), and the three returns below
 * became one, so the layout chunk does not grow for it. */
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
  /* null until mounted so the server render carries no banner and no GA —
   * the choice is only knowable in the browser. */
  const [choice, setChoice] = useState<Choice | 'unset'>('unset');

  const [Ga, setGa] = useState<GA | null>(null);

  useEffect(() => {
    setChoice(read());
  }, []);

  useEffect(() => {
    if (choice !== 'granted') return;
    let live = true;
    import('@next/third-parties/google')
      .then((m) => { if (live) setGa(() => m.GoogleAnalytics); })
      .catch(() => { /* no analytics, never a broken page */ });
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

  /* 'unset' (not read yet) and 'declined' render nothing; 'granted' renders
     GA once it has loaded; only null (never asked) shows the banner. */
  if (choice !== null) return choice === 'granted' && Ga ? <Ga gaId={gaId} /> : null;

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      style={{
        position: 'fixed',
        insetInline: 0,
        bottom: 0,
        zIndex: 60,
        background: 'var(--surface, var(--bg))',
        borderTop: '1px solid var(--line)',
        padding: '14px 18px',
        boxShadow: '0 -4px 18px rgba(0,0,0,.08)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
      >
        <p style={{ margin: 0, flex: '1 1 320px', fontSize: '.95em' }}>
          May this site use Google Analytics to understand which pages help people? Anonymous
          usage only. Nothing you type in a form is ever sent to it, and declining changes
          nothing about how the site works. Details in the{' '}
          <a href="/privacy">privacy policy</a>.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn--ghost" onClick={() => decide('declined')}>
            No thanks
          </button>
          <button type="button" className="btn btn--primary" onClick={() => decide('granted')}>
            That&rsquo;s fine
          </button>
        </div>
      </div>
    </div>
  );
}
