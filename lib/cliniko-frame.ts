/* THE CLINIKO FRAME'S OWN MESSAGES — 1 Oct 2026.
 *
 * Cliniko's bookings page posts two kinds of string to its parent window,
 * read out of its bookings bundle (cdn.cliniko.com/assets/webpack/bookings-*.js)
 * the same day:
 *
 *   "cliniko-bookings-resize:<px>"   on every step, expand and error, with
 *                                    document.body.offsetHeight
 *   "cliniko-bookings-page:<name>"   when the step changes away from the first
 *                                    one; "cliniko-bookings-page:confirmed"
 *                                    when a booking completes
 *
 * Their own embed snippet sets the frame height from the first and scrolls
 * the frame into view on the second. Without either, a phone reader worked
 * through the times, details and card steps inside a fixed 660px box whose
 * bottom sat under the sticky bar.
 *
 * Pure, no imports: bundled into the client wrapper, and tested on its own. */

export const FRAME_MIN_PX = 480;
export const FRAME_MAX_PX = 2400;

export type ClinikoMessage =
  | { kind: 'resize'; height: number }
  | { kind: 'page'; page: string };

/** The message, or null for anything that is not one of Cliniko's two. */
export function parseClinikoMessage(data: unknown): ClinikoMessage | null {
  if (typeof data !== 'string' || data.length > 200) return null;
  const resize = /^cliniko-bookings-resize:(\d{1,6})(?:\.\d+)?$/.exec(data);
  if (resize) return { kind: 'resize', height: Number(resize[1]) };
  const page = /^cliniko-bookings-page:([a-z0-9_-]{1,40})$/i.exec(data);
  if (page) return { kind: 'page', page: page[1] };
  return null;
}

/** The height to give the frame: never a sliver, never a runaway page. */
export function clampFrameHeight(px: number): number {
  if (!Number.isFinite(px)) return FRAME_MIN_PX;
  return Math.min(FRAME_MAX_PX, Math.max(FRAME_MIN_PX, Math.round(px)));
}

/** The URL with Cliniko's embed flag appended, once. */
export function withEmbedFlag(url: string, param: string): string {
  const [base, hash = ''] = url.split('#');
  const q = base.indexOf('?');
  const existing = q < 0 ? [] : base.slice(q + 1).split('&');
  if (existing.includes(param)) return url;
  return `${base}${q < 0 ? '?' : '&'}${param}${hash ? `#${hash}` : ''}`;
}

/** True when a message event came from the frame itself: its own origin AND
 *  its own window. Origin alone would accept another Cliniko tab or frame. */
export function fromFrame(eventOrigin: string, eventSource: unknown, frameSrc: string, frameWindow: unknown): boolean {
  if (!frameWindow || eventSource !== frameWindow) return false;
  try {
    return eventOrigin === new URL(frameSrc).origin;
  } catch {
    return false;
  }
}
