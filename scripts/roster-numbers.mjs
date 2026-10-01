/* EVERY REGISTRATION NUMBER ON THE ROSTER, AND WHERE IT MAY APPEAR — 1 Oct 2026.
 *
 * The owner's rule (DECISIONS.md, 30 Aug and 6 Sep 2026): a counsellor's
 * registration or certification number appears on that counsellor's own
 * pages and nowhere else. The guard in scripts/expansion-verify.mjs read one
 * number, the founder's, from lib/site.ts; Savneet's BCACC number then sat on
 * /book?with=savneet-singh ("verify #27067") with nothing to catch it, and
 * Camille's two numbers would have gone the same way.
 *
 * This reads every `number:` on the roster in lib/practitioners.ts, owned by
 * the practitioner whose `slug:` precedes it, so a counsellor added later is
 * guarded the day she is added. Plain text parsing because the scripts run
 * under plain node, which cannot import the TypeScript roster.
 *
 * Shared by scripts/expansion-verify.mjs and test/roster-numbers.test.mts. */

/** [{ slug, number }] for every credential number on the roster, in order. */
export function rosterNumbers(src) {
  const out = [];
  let slug = '';
  for (const m of src.matchAll(/^\s*(slug|number):\s*['"]([^'"]+)['"]/gm)) {
    if (m[1] === 'slug') slug = m[2];
    else if (slug && /^\d{4,}$/.test(m[2])) out.push({ slug, number: m[2] });
  }
  return out;
}

/** A number may appear on its owner's profile and her place pages, nowhere else. */
export function numberAllowedOn(route, slug) {
  const own = `/practitioners/${slug}`;
  const path = route.split(/[?#]/)[0];
  return path === own || path.startsWith(`${own}/`);
}

/* `\\b` inside the template literal, not `\b`: in a template literal `\b` is
   the backspace character and the pattern silently never matches. See the
   note in expansion-verify.mjs on the first version of the founder's guard. */
const digitsRe = (n) => new RegExp(`\\b${n}\\b`);

/** Where each number that should not be on `route` appears in `html`. */
export function numberLeaks(route, html, entries) {
  const leaks = [];
  for (const { slug, number } of entries) {
    if (numberAllowedOn(route, slug)) continue;
    const re = digitsRe(number);
    if (!re.test(html)) continue;
    const where = [
      ['visible text', (html.match(/<main[\s\S]*?<\/main>/i) || [''])[0]],
      ['JSON-LD', (html.match(/application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || []).join(' ')],
      ['<title>', (html.match(/<title[^>]*>[\s\S]*?<\/title>/i) || [''])[0]],
      ['meta description', (html.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [''])[0]],
    ].filter(([, str]) => re.test(str)).map(([w]) => w);
    leaks.push({ slug, number, where });
  }
  return leaks;
}
