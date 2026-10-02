/* WHICH TZ DATA IS THIS BUILD ON — 2 Oct 2026. Runs as `prebuild`.
 *
 * BC stays on UTC-7 from 1 Nov 2026. A runtime whose IANA tz data predates
 * that change reads 2026-12-15T20:00Z as 12:00 p.m. in America/Vancouver
 * instead of 1:00 p.m., and lib/pacific-time.ts then formats with a fixed
 * UTC-7 zone. This prints which case the build is in, so the Vercel build log
 * says what production carries. Plain JS, no TypeScript import, and it never
 * fails the build: it is a log line, not a gate. */
const PROBE = new Date('2026-12-15T20:00:00Z');
const read = (timeZone) => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).format(PROBE);
  } catch (e) {
    return `unreadable (${e instanceof Error ? e.message : e})`;
  }
};
const vancouver = read('America/Vancouver');
const current = /^1:00\s?p\.?m\.?$/i.test(vancouver.replace(/\u202f/g, ' '));
console.log(
  `tz-probe: node ${process.versions.node}, tz ${process.versions.tz ?? 'unknown'}; ` +
  `2026-12-15T20:00Z in America/Vancouver reads ${vancouver} ` +
  (current ? '(current: BC on UTC-7 after 1 Nov 2026).' : `(STALE: lib/pacific-time.ts formats with Etc/GMT+7, which reads ${read('Etc/GMT+7')}).`),
);
