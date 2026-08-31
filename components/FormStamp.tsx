'use client';

import { useEffect, useRef } from 'react';

/* When the form appeared on screen.
 *
 * The one signal that separates a script from a person cheaply: a bot posts
 * the moment it parses the page, a human reads first. lib/triage.ts flags
 * anything submitted in under 2.5 seconds.
 *
 * WHY THE VALUE IS SET ON MOUNT AND NOT RENDERED
 *
 * These forms sit on ~190 statically generated pages. A timestamp written
 * during render is baked into the HTML at build time, so every visitor would
 * appear to have spent hours on the form. Setting it in an effect stamps the
 * moment this particular browser painted it.
 *
 * FAILS OPEN, DELIBERATELY
 *
 * With JavaScript off the field stays empty and the server treats a missing
 * value as neutral, not as suspicious. A plain form POST is a supported way to
 * reach this practice and must never be penalised — the people most likely to
 * be browsing with scripts blocked, on a locked-down or borrowed device, are
 * not the people to put an obstacle in front of.
 *
 * Also honest about what it is: `renderedAt` is a millisecond timestamp and
 * nothing else. No fingerprint, no pointer trace, no dwell map.
 */
export default function FormStamp() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);

  return <input ref={ref} type="hidden" name="renderedAt" defaultValue="" />;
}
