'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

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

const read = (): Choice => {
  try {
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

  useEffect(() => {
    setChoice(read());
  }, []);

  const decide = (c: Exclude<Choice, null>) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* nowhere to remember it; the banner will return next visit */
    }
    setChoice(c);
  };

  if (choice === 'unset') return null;
  if (choice === 'granted') return <GoogleAnalytics gaId={gaId} />;
  if (choice === 'declined') return null;

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
