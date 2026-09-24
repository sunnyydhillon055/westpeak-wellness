/* The path rules for the Markdown twins (app/api/md/route.ts).
 *
 * In their own module because a route file may only export the HTTP verbs —
 * Next type-checks that and fails the build otherwise — and this is the part
 * worth testing directly. See test/md-path.test.mts.
 */
/** Private by design: staff, auth, the portal, and the API itself. */
const PRIVATE = [
  '/admin', '/api', '/signin', '/forgot', '/reset', '/client-portal',
  '/message-sent', '/punjabi/sent', '/search',
];

/** `/a/b.md` → `/a/b`, rejecting anything that is not a plain path on this site. */
export function normalise(raw: string): string | null {
  if (!raw) return null;
  let p = raw.trim();
  if (!p.startsWith('/') || p.startsWith('//')) return null;
  if (p.includes('..') || p.includes('\\') || /[?#]/.test(p)) return null;
  if (!/^[/A-Za-z0-9._~-]*$/.test(p)) return null;
  p = p.replace(/\.md$/i, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  if (p === '') p = '/';
  if (PRIVATE.some((b) => p === b || p.startsWith(`${b}/`))) return null;
  return p;
}
