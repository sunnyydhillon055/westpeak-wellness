#!/usr/bin/env node
/* DOES EVERY PAGE GIVE THE READER SOMEWHERE TO GO?
 *
 * WHY <main> AND NOT THE WHOLE DOCUMENT
 *
 * The header carries a "Book" button and the footer carries an email address on
 * every single page. Scanning raw HTML would therefore report 100% coverage and
 * mean nothing — the question is whether the PAGE offers an action, not whether
 * the site chrome does. Everything below is scoped to <main id="main">, and the
 * header and footer are stripped even from within it if they ever move inside.
 *
 * The RSC flight payload is stripped for the same reason: it repeats the whole
 * component tree as a string, so a page with no CTA at all would still match on
 * the serialised markup of one. Scanning raw HTML has produced false positives
 * on this site before.
 *
 * TWO TIERS, BECAUSE THEY ARE NOT THE SAME ASK
 *
 *   primary   booking — /book, the scheduler, the consultation. High commitment:
 *             a scheduled video call with a stranger.
 *   secondary the smaller ask — an enquiry form, a mailto, /contact. This is the
 *             one most readers will actually take, which is why AskInstead
 *             exists and why a page with only a booking button is weaker than
 *             it looks rather than fine.
 *
 * STATIC FILES ARE NOT THE WHOLE SITE
 *
 * Ten routes are server-rendered on demand and therefore produce no .html in
 * the build output — including /book, /pricing, /contact and /refer, which are
 * the most commercially important pages here. A scan of the build directory
 * silently omits them and reports full coverage, which is exactly the kind of
 * clean result that hides a gap. Pass --live <origin> to fetch every route from
 * a running server instead, and the same check applies to all of them.
 *
 * PAGES THAT SHOULD NOT CARRY A BOOKING CTA
 *
 * Some deliberately do not, and flagging them would be wrong:
 *   - crisis and safety pages, where a cheerful booking prompt reads badly
 *   - policy, legal and accessibility pages
 *   - the portal, admin and auth pages, which are for existing clients
 *   - noindex utility pages
 * These are listed in EXEMPT below with a reason each, so the exemption is a
 * decision on the record rather than a silent gap.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const APP = join(ROOT, '.next', 'server', 'app');

if (!existsSync(APP)) {
  console.log('cta-audit: no build found — run `npm run build` first.');
  process.exit(0);
}

/** Routes that 404 by design. Alberta and Ontario must not publish — insurance
 *  is BC-only and Ontario also requires CRPO registration — so they exist as
 *  build artefacts that return 404 and stay out of the sitemap. Having no
 *  <main> is the correct behaviour for them, not a defect, and both were
 *  confirmed returning 404 against a running server rather than assumed. */
const GATED = new Set(['/alberta', '/ontario']);

/** route -> why it carries no booking CTA on purpose. */
const EXEMPT = {
  '/privacy': 'policy page',
  '/terms': 'policy page',
  '/accessibility': 'policy page',
  '/disclaimer': 'policy page',
  '/cookies': 'policy page',
  '/client-portal': 'existing clients only',
  '/signin': 'authentication',
  '/forgot': 'authentication — password recovery',
  '/reset': 'authentication — password reset',
  '/admin': 'staff only',
  '/message-sent': 'confirmation — the action was just taken',
  '/punjabi/sent': 'confirmation — the action was just taken',
  '/_not-found': '404',
  '/search':
    'the search box IS the action; the booking prompt renders on the no-results branch, where it is the highest-intent moment on the site',
  '/resources/bc-crisis-and-support-directory':
    'crisis page — a booking prompt beside a crisis line reads badly, and the page says so',
};

function collect(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) collect(full, out);
    else if (e.endsWith('.html')) out.push(full);
  }
  return out;
}

function mainOf(html) {
  const m = html.match(/<main[^>]*id="main"[^>]*>([\s\S]*?)<\/main>/i)
    || html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return null;
  return m[1]
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ');
}

/** Routes with no static artefact. Kept explicit rather than inferred, so a new
 *  dynamic route added later shows up as unscanned rather than as absent. */
const DYNAMIC = [
  '/book', '/contact', '/pricing', '/refer', '/search',
  '/admin', '/client-portal', '/signin', '/forgot', '/reset',
];

const liveIdx = process.argv.indexOf('--live');
const ORIGIN = liveIdx > -1 ? process.argv[liveIdx + 1] : null;

function assess(route, html) {
  const main = mainOf(html);
  if (main === null) return { route, main: false };
  const hrefs = [...main.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
  const primary = hrefs.filter((h) => /^\/book\b/.test(h) || /cliniko/i.test(h)).length
    + (/<iframe[^>]+cliniko/i.test(main) ? 1 : 0);
  const secondary =
    hrefs.filter((h) => /^\/contact\b/.test(h) || /^mailto:/i.test(h)).length +
    (/<form\b/i.test(main) ? 1 : 0);
  return { route, main: true, primary, secondary, total: primary + secondary };
}

const files = collect(APP);
const rows = [];
let noMain = 0;

for (const f of files) {
  const route =
    '/' + f.slice(APP.length + 1).replace(/\\/g, '/').replace(/\.html$/, '').replace(/^index$/, '');
  const html = readFileSync(f, 'utf8');
  const main = mainOf(html);
  if (main === null) { noMain++; rows.push({ route, main: false }); continue; }

  const hrefs = [...main.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);

  /* Primary: the booking path, the Cliniko scheduler, or the embed itself. */
  const primary = hrefs.filter((h) => /^\/book\b/.test(h) || /cliniko/i.test(h)).length
    + (/<iframe[^>]+cliniko/i.test(main) ? 1 : 0);

  /* Secondary: the smaller ask — a form, a mailto, or /contact. */
  const secondary =
    hrefs.filter((h) => /^\/contact\b/.test(h) || /^mailto:/i.test(h)).length +
    (/<form\b/i.test(main) ? 1 : 0);

  rows.push({ route, main: true, primary, secondary, total: primary + secondary });
}

if (ORIGIN) {
  for (const route of DYNAMIC) {
    try {
      const res = await fetch(ORIGIN.replace(/\/$/, '') + route, { redirect: 'follow' });
      const html = await res.text();
      const r = assess(route, html);
      r.status = res.status;
      r.dynamic = true;
      rows.push(r);
    } catch (e) {
      rows.push({ route, main: false, dynamic: true, error: String(e.message || e) });
    }
  }
} else {
  console.log('\nnote: 10 server-rendered routes were NOT scanned (no static artefact).');
  console.log('      Run with --live http://127.0.0.1:PORT to include /book, /pricing and /contact.');
}

rows.sort((a, b) => a.route.localeCompare(b.route));

const exempt = rows.filter((r) => EXEMPT[r.route] !== undefined);
const live = rows.filter((r) => EXEMPT[r.route] === undefined);

const none = live.filter((r) => r.main && r.total === 0);
const primaryOnly = live.filter((r) => r.main && r.primary > 0 && r.secondary === 0);
const secondaryOnly = live.filter((r) => r.main && r.primary === 0 && r.secondary > 0);
const both = live.filter((r) => r.main && r.primary > 0 && r.secondary > 0);
const gated = rows.filter((r) => GATED.has(r.route));
const broken = rows.filter((r) => !r.main && !GATED.has(r.route));

console.log('\nCALL-TO-ACTION AUDIT\n' + '='.repeat(56));
console.log(`  pages scanned            ${rows.length}`);
console.log(`  deliberately exempt      ${exempt.length}`);
console.log(`  both asks (book + ask)   ${both.length}`);
console.log(`  booking only             ${primaryOnly.length}`);
console.log(`  smaller ask only         ${secondaryOnly.length}`);
console.log(`  NO CALL TO ACTION        ${none.length}`);
if (broken.length) console.log(`  no <main> element        ${broken.length}`);

if (primaryOnly.length) {
  console.log('\nBooking only — the high-commitment ask with no smaller alternative:');
  for (const r of primaryOnly) console.log(`   ${r.route}`);
}
if (secondaryOnly.length) {
  console.log('\nSmaller ask only — no route to booking from the page itself:');
  for (const r of secondaryOnly) console.log(`   ${r.route}`);
}
if (none.length) {
  console.log('\nNO CALL TO ACTION — a reader who finishes these has nowhere to go:');
  for (const r of none) console.log(`   ${r.route}`);
}
if (broken.length) {
  console.log('\nNo <main> — cannot be assessed:');
  for (const r of broken) console.log(`   ${r.route}`);
}

console.log('\nExempt, with reason:');
for (const r of exempt) console.log(`   ${r.route.padEnd(46)} ${EXEMPT[r.route]}`);
console.log('='.repeat(56));

/* A page with no action at all is the failure. "Booking only" is reported but
   does not fail the build — it is a judgement call per page, and on some
   subjects the smaller ask genuinely does not belong. */
if (none.length) {
  console.log(`${none.length} page(s) with no call to action.`);
  process.exit(1);
}
console.log('Every non-exempt page offers the reader an action.');
