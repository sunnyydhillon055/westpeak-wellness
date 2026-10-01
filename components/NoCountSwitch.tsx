'use client';

import { useEffect, useState } from 'react';
import { NO_COUNT_KEY } from '@/lib/analytics';

/* "DO NOT COUNT THIS BROWSER" — 1 Oct 2026. Rendered on /admin only, behind
 * its sign-in. Sets NO_COUNT_KEY in this browser's localStorage, which
 * lib/analytics.ts track() reads before sending anything. It is per browser
 * and per device: the owner and both counsellors press it once on each phone
 * and laptop they use to look at the site. Clearing site data undoes it, and
 * the line above the button says which state this browser is in, so that is
 * visible rather than assumed. A browser that blocks storage cannot be
 * excluded and is told so. */
export default function NoCountSwitch() {
  const [state, setState] = useState<'unknown' | 'counted' | 'excluded' | 'blocked'>('unknown');

  useEffect(() => {
    try {
      setState(window.localStorage.getItem(NO_COUNT_KEY) ? 'excluded' : 'counted');
    } catch {
      setState('blocked');
    }
  }, []);

  const flip = () => {
    try {
      if (state === 'excluded') {
        window.localStorage.removeItem(NO_COUNT_KEY);
        setState('counted');
      } else {
        window.localStorage.setItem(NO_COUNT_KEY, '1');
        setState('excluded');
      }
    } catch {
      setState('blocked');
    }
  };

  return (
    <p style={{ margin: '8px 0 0', fontSize: '.92rem' }}>
      <strong>
        {state === 'excluded'
          ? 'This browser is not counted.'
          : state === 'counted'
            ? 'This browser is counted like a visitor.'
            : state === 'blocked'
              ? 'This browser blocks site storage, so it cannot be excluded.'
              : 'Checking this browser…'}
      </strong>{' '}
      {(state === 'counted' || state === 'excluded') && (
        <button type="button" className="btn btn--ghost" style={{ padding: '4px 12px', fontSize: '.88rem' }} onClick={flip}>
          {state === 'excluded' ? 'Count it again' : 'Stop counting this browser'}
        </button>
      )}
      <span style={{ display: 'block', color: 'var(--ink-soft)', marginTop: 4 }}>
        Press once on every phone and computer you use to look at the site, so your own visits to
        /book stay out of the counters. Per browser; clearing site data undoes it.
      </span>
    </p>
  );
}
