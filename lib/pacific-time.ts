/* ONE PACIFIC CLOCK, WHATEVER TZ DATA THE RUNTIME CARRIES — 2 Oct 2026.
 *
 * British Columbia stops changing its clocks on 1 Nov 2026 and stays on
 * UTC-7. Newer IANA tz data knows that; older data still moves Vancouver
 * back to UTC-8 for the winter. b984a9e found the two runtimes this project
 * uses already disagree (CI's Node 22 has the change, a local Node 24 with
 * tz 2026a does not). On a runtime with the old data every consult time the
 * site prints, on the home hero, /book, every NextConsultLine and every
 * confirmation email, would read an hour early from November.
 *
 * So at load this formats one known instant, 2026-12-15T20:00Z, which is
 * 1:00 p.m. in BC under the new rule. If the runtime reads it any other way
 * its Vancouver data is stale, and instants from the 2026 spring change on
 * are formatted in the fixed zone 'Etc/GMT+7' (POSIX sign: UTC-7) instead.
 * Before that instant both zones agree with the runtime's own history, so
 * older dates keep America/Vancouver either way.
 *
 * Pure apart from Intl. Every server-side formatter that prints a Pacific
 * time to a visitor or a client goes through formatPacific / pacificParts.
 * The prebuild line in package.json prints process.versions.tz and the probe,
 * so the Vercel build log says which data production carries. */

export const PACIFIC_ZONE = 'America/Vancouver';
/** UTC-7 with no daylight saving: what BC keeps from 1 Nov 2026. */
export const FIXED_ZONE = 'Etc/GMT+7';
/** The probe instant and what it must read: 20:00Z is 1 p.m. at UTC-7. */
export const PROBE_ISO = '2026-12-15T20:00:00Z';
export const PROBE_HOUR = 13;
/** From the 8 Mar 2026 spring change (10:00Z) BC has been on UTC-7 and stays there. */
export const FIXED_SINCE = Date.parse('2026-03-08T10:00:00Z');

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function formatter(locale: string, opts: Intl.DateTimeFormatOptions, zone: string): Intl.DateTimeFormat {
  const key = `${locale}|${zone}|${JSON.stringify(opts)}`;
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...opts, timeZone: zone });
    fmtCache.set(key, f);
  }
  return f;
}

/** The hour (0-23) a zone reads at the probe instant. */
export function probeHour(zone: string = PACIFIC_ZONE): number {
  const h = formatter('en-CA', { hour: 'numeric', hourCycle: 'h23' }, zone)
    .formatToParts(new Date(PROBE_ISO))
    .find((p) => p.type === 'hour')?.value;
  return Number(h ?? NaN) % 24;
}

let current: boolean | undefined;
/** True when the runtime's America/Vancouver already keeps BC on UTC-7 after 1 Nov 2026. */
export function runtimeTzCurrent(): boolean {
  if (current === undefined) current = probeHour(PACIFIC_ZONE) === PROBE_HOUR;
  return current;
}

const toDate = (d: Date | string | number): Date => (d instanceof Date ? d : new Date(d));

/** The zone to format this instant in. `tzCurrent` is injectable for the tests. */
export function pacificZone(d: Date | string | number, tzCurrent: boolean = runtimeTzCurrent()): string {
  if (tzCurrent) return PACIFIC_ZONE;
  const t = toDate(d).getTime();
  return Number.isFinite(t) && t >= FIXED_SINCE ? FIXED_ZONE : PACIFIC_ZONE;
}

/** Intl.DateTimeFormat#format in Pacific time. Any timeZone in `opts` is ignored. */
export function formatPacific(
  d: Date | string | number,
  opts: Intl.DateTimeFormatOptions,
  locale = 'en-CA',
  tzCurrent?: boolean,
): string {
  const date = toDate(d);
  const { timeZone: _ignored, ...rest } = opts;
  return formatter(locale, rest, pacificZone(date, tzCurrent)).format(date);
}

/** Intl.DateTimeFormat#formatToParts in Pacific time. */
export function pacificParts(
  d: Date | string | number,
  opts: Intl.DateTimeFormatOptions,
  locale = 'en-CA',
  tzCurrent?: boolean,
): Intl.DateTimeFormatPart[] {
  const date = toDate(d);
  const { timeZone: _ignored, ...rest } = opts;
  return formatter(locale, rest, pacificZone(date, tzCurrent)).formatToParts(date);
}

/** Minutes east of UTC for a zone at an instant (-420 for UTC-7). Pacific
 *  goes through pacificZone, so a stale runtime still reports -420 in winter. */
export function offsetMinutes(zone: string, d: Date | string | number, tzCurrent?: boolean): number {
  const date = toDate(d);
  const z = zone === PACIFIC_ZONE ? pacificZone(date, tzCurrent) : zone;
  const name = formatter('en-US', { timeZoneName: 'longOffset' }, z)
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = /GMT([+-])(\d{1,2})(?::?(\d{2}))?/.exec(name);
  if (!m) return 0;
  const mins = Number(m[2]) * 60 + Number(m[3] ?? 0);
  return m[1] === '-' ? -mins : mins;
}
