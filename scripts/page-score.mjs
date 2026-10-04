#!/usr/bin/env node
/* THE PAGE SCORER — every page Google is asked to index, out of 10,000.
 *
 * WHY THIS EXISTS (4 Oct 2026)
 *
 * The owner's goal is every public page at 9,000 of 10,000 for search, links
 * and getting clients. A goal stated per page needs a measure per page, and
 * the 29 gates in verify:ci each answer one yes/no question about the whole
 * build. This joins them into one number per page, with every point traceable
 * to something observable in the built HTML, and every lost point named.
 *
 * The score is a means. A check that can only be passed by making the page
 * worse for a reader is a bad check, and the fix is to change the check, not
 * the page. Nothing here rewards repetition: more links past 30 lose points,
 * more words past the floor earn nothing, and the uniqueness check is the
 * repo's own near-duplicate measure.
 *
 * WHICH PAGES
 *
 * Exactly the sitemap the build produces: /sitemap.xml is an index of
 * /sitemaps/<part>.xml children (scripts/lib/built-sitemap.mjs), and their
 * union is the set Google is asked to index. Pages prerendered to
 * .next/server/app are read from disk; the ones rendered on demand (/book,
 * /contact, /refer) are fetched from `next start` on port 4399, booted the way
 * smoke.mjs boots it (scripts/lib/next-server.mjs). Every built or routed page
 * NOT in the sitemap is listed under "excluded" with the reason read from the
 * page itself (noindex, 404, redirect, sign-in).
 *
 * THE RUBRIC (points; threshold; source)
 *
 * SEO 4,000
 *   title 600          present 200, unique 200, 30-60 chars 200. 60 is
 *                      scripts/seo-audit.mjs TITLE_MAX (raw HTML length, as the
 *                      gate counts it). Google, "Influencing title links"
 *                      (developers.google.com/search/docs/appearance/title-link):
 *                      avoid vague titles and "unnecessarily long or verbose"
 *                      ones; each page needs "distinct text that describes" it.
 *                      30 is NOT sourced: Google gives no minimum and no repo
 *                      gate sets one. It is the owner's vagueness tripwire and
 *                      no sitemap page is under it.
 *   description 500    present 150, unique 150, 70-158 chars 200 — seo-audit.mjs
 *                      DESC_MIN/DESC_MAX, & counted as &amp;. Google, "Control
 *                      your snippets": a unique description per page.
 *   h1 300             exactly one H1 150; it shares the title's topic words
 *                      150 (half of them, or two; 75 for one; four-letter
 *                      stems, so English only — a pa/tl page is not compared,
 *                      and a new heading there would be new Punjabi or Tagalog
 *                      prose). Google, title links: a page with no single
 *                      distinctive main heading is a reason titles get
 *                      rewritten, and Google reads headings to build one.
 *   canonical 300      present, absolute https, equal to the sitemap URL, 100
 *                      each. Google, "How to specify a canonical URL": absolute
 *                      URLs; a canonical that disagrees with the sitemap is a
 *                      mixed signal.
 *   indexable 300      no noindex (meta or X-Robots-Tag) 150, not disallowed
 *                      for Googlebot in robots.txt 75, in the sitemap and not
 *                      a next.config redirect source 75 (a redirect runs
 *                      before the route, so such a URL is never served).
 *                      Google, "Block indexing with noindex" / "Build a sitemap".
 *   jsonld 400         every block parses and one exists 100 (schema-validate.mjs),
 *                      a type that fits the family 200, BreadcrumbList 100 (not
 *                      on /). Google, "Breadcrumb (BreadcrumbList) structured
 *                      data"; the family types are the ones the site already
 *                      ships per template (seo-audit.mjs CLINICAL).
 *   headingOrder 100   no skipped level in <main> (h2→h4), first heading h1;
 *                      50 off per distinct skip. NOT a ranking factor — the
 *                      SEO Starter Guide says order "doesn't matter" to Google.
 *                      Kept for accessibility: Lighthouse "heading-order"
 *                      (developer.chrome.com/docs/lighthouse/accessibility/heading-order)
 *                      and the repo's a11y gate. (The brief gave it 200 and
 *                      Open Graph 200, and its SEO items summed to 4,200; these
 *                      two, the ones Google says do not move ranking, were
 *                      halved to make the pillar 4,000.)
 *   words 400          words a reader sees in <main> (breadcrumb, table of
 *                      contents, hidden / aria-hidden markup and .sr-only text
 *                      left out) against the family floor: content 600,
 *                      hubs 350, profiles 400, utility/policy 150 (the brief);
 *                      zero at half the floor, linear to full at it. Google:
 *                      "there's no magical word count target" — so this is a
 *                      thin-page tripwire, not a target; nothing is earned past
 *                      the floor. Repo: quality-audit.mjs very-thin (<250).
 *   uniqueness 400     not a near-duplicate of any sibling: the uniqueness
 *                      gate's own measure (scripts/lib/shingles.mjs, 8-word
 *                      shingle Jaccard of <main>) against every page in the
 *                      family, nearest one counted. Full at or under the healthy
 *                      line, 50% (TWIN_CEILING, "the line the researcher's audit
 *                      drew") or the family's tighter ceiling; zero at the gate's
 *                      fail line for the family (MAX_SIMILARITY 62%; hubs 40%,
 *                      Tagalog cities 40%, Punjabi regions 30%, /tl 50%, /pa
 *                      52%); linear between. A pair that names each other in
 *                      hreflang AND whose <html lang> differs is one page in
 *                      two languages and not compared; two English pages
 *                      cannot tag their way out.
 *   images 200         every <img> has alt 100 and width+height 100, pro rata.
 *                      Lighthouse "image-alt"; web.dev "Optimize CLS" (images
 *                      without dimensions). Repo: quality-audit img-no-dimensions.
 *   openGraph 100      og:title 35, og:description 30, og:image 35 (ogp.me;
 *                      metadata-audit.mjs). Shares, not search.
 *   lang 100           <html lang> 50; hreflang, when declared, names itself
 *                      and every twin names it back 50 — Google, "Tell Google
 *                      about localized versions": one-way pairs are ignored.
 *                      DECISIONS: hreflang only for real translations.
 *   weight 300         HTML bytes: full at or under data/perf-budget.json
 *                      medianHtml, linear to zero at its maxHtml 150; on a
 *                      prerendered page the stylesheet is inlined and no
 *                      stylesheet link blocks render 150 (scripts/inline-css.mjs
 *                      and smoke.mjs's inline check; Lighthouse
 *                      "render-blocking-resources").
 *
 * LINKS 3,000
 *   inbound 900        distinct indexable pages linking here from <main>, with
 *                      <nav>, <header>, <footer> and the breadcrumb excluded;
 *                      full at 5, n/5 below. Google, "Link best practices":
 *                      "Every page you care about should have a link from at
 *                      least one other page"; 5 is the owner's bar. Not asked
 *                      of /, which every logo and breadcrumb links to — exactly
 *                      the links the brief excludes.
 *   outbound 600       distinct CONTEXTUAL internal targets: a link whose own
 *                      paragraph, list item, cell or caption carries 3+ words
 *                      that are not link text. Google, "Link best practices":
 *                      "Don't chain up links next to each other ... you lose
 *                      surrounding text for each link". So a chip grid
 *                      (CityLinks: "navigation, not content"), card titles and
 *                      bare "related" lists are not counted here — they still
 *                      count as inbound for their targets. /book is left out
 *                      (scored under clients). Full at 3-20, n/3 below 3, 75%
 *                      at 21-30, half at 31 falling to zero at 60. Google gives
 *                      no number ("if you think it's too much, then it probably
 *                      is"); the band is the owner's, and DECISIONS (1 Oct)
 *                      keeps a link block at ten, "a pointer, not a footer".
 *                      Index pages (/, the hubs, /glossary, /answers) list by
 *                      design: they need 3 links in <main> and are not capped.
 *   anchors 400        share of <main> links whose accessible name is not
 *                      generic — Lighthouse "link-text" list (click here, here,
 *                      this, go, start, right here, more, learn more) plus
 *                      quality-audit.mjs VAGUE (read more, see more, link) and
 *                      "this page"; a trailing arrow does not rescue one.
 *                      Google: "Click here to learn more" is the bad example.
 *   broken 500         every internal href on the page (chrome included)
 *                      resolves to a built page, a routed path, a public file
 *                      or a .md twin; 250 off per broken target
 *                      (internal-links.mjs). A built file that renders the
 *                      not-found page (/alberta, /ontario, /_not-found) is not
 *                      a target: a link to it is broken.
 *   redirects 200      no internal href is a redirect source in next.config
 *                      (lib/redirects.mjs, patterns and :param(regex)
 *                      included), checked BEFORE routes because Next applies
 *                      redirects first; 100 off each. A redirect with a `has`
 *                      condition applies only when it can: the vercel.app
 *                      host redirect never matches a link on www.
 *   citations 200      factual families only (guides, language guides,
 *                      resources, comparisons, glossary): one https link in
 *                      <main> to government, a public health body, a regulator,
 *                      a professional association or a peer-reviewed index
 *                      (AUTHORITY in scripts/lib/page-score-core.mjs). Google,
 *                      "Creating helpful content": evidence and sourcing.
 *   breadcrumb 200     a visible <nav aria-label="Breadcrumb"> (not needed on /).
 *
 * CLIENTS 3,000
 *   firstScreen 800    a /book (or Cliniko) link in <main> before the first H2
 *                      or within its first 20% of words; linear to zero at 50%.
 *                      A page with no H2 is held to the share alone. Hidden
 *                      markup does not count (/answers' search-miss message
 *                      carries a booking link but is hidden until a search
 *                      finds nothing).
 *                      NN/g "Scrolling and Attention" (2018): 57% of viewing
 *                      time above the fold, 74% in the first two screenfuls.
 *                      Repo: lib/city-service-page.ts — ten of thirteen ranking
 *                      competitors put booking above the fold.
 *   routing 600        every ?with= goes to an accepting counsellor who offers
 *                      the page's service, speaks its language and practises in
 *                      its province (roster read from the built /ai.json, which
 *                      lists who offers each service, i.e. OFFERINGS as
 *                      published); where exactly one fits, a booking link opens
 *                      her calendar (half points without it) — the rule
 *                      lib/booking-cta.ts bookingFor() applies. On a
 *                      counsellor's own pages (profile, place, twins) the
 *                      FIRST booking link must open her calendar while she is
 *                      accepting; a colleague's card further down is a
 *                      deliberate alternative, not a misroute. Misroutes are
 *                      looked for on the whole page, sticky bar and header
 *                      included.
 *   counsellor 400     an accepting counsellor named or linked in <main>
 *                      (lib/booking-cta.ts item 409: the home hero naming them
 *                      earned 12 of 38 book_clicks).
 *   fee 300            a dollar figure or a /pricing link in <main>.
 *   consult 300        the free 15-minute consultation in <main>, the fifteen
 *                      minutes within a sentence of "consult", "free", "call"
 *                      or "conversation"; zero if it says 30 minutes (owner,
 *                      3 Oct; CONSULT_MINUTES). The Tagalog and Punjabi
 *                      twins say it in their own language ("Libreng 15
 *                      minutong konsultasyon", "15 ਮਿੰਟ ਦੀ ਮੁਫ਼ਤ ਗੱਲਬਾਤ"), and
 *                      both the fifteen and the thirty are read in those
 *                      words too (4 Oct 2026): the English-only match was a
 *                      defect in the check, not in the 34 pages it docked.
 *   trust 300          a link to verify registration or the RCC explainer in
 *                      <main> 200 (100 when only the footer has one), the
 *                      privacy policy linked 100.
 *   email 150          a mailto, /contact or a form in <main> (cta-audit.mjs's
 *                      "smaller ask").
 *   sticky 150         the mobile StickyBook bar is on the page (not asked of
 *                      the crisis directory, where StickyBook returns null on
 *                      purpose).
 *
 *   FAMILY OVERRIDES
 *   GENTLE_CTA guides (lib/next-steps.ts), their hreflang translations, and
 *   the crisis directory replace firstScreen + counsellor (1,200) with
 *   gentleNextStep: a booking, contact, email or phone/crisis-line link
 *   anywhere in <main>, halved if a booking link's wording is a hard sell
 *   ("!", "book now", "don't wait"). The crisis directory is also never asked
 *   for a fee or the consultation (full points whatever it says), so the
 *   scorer can never be the reason a price lands on a page read in a crisis.
 *   A gentle page with no booking link is not docked for routing. Policy pages
 *   (/privacy, /accessibility, /editorial-policy, /standards) score clients on
 *   two things, 1,500 each: the smaller ask in <main>, and a /book link
 *   anywhere on the page — cta-audit.mjs exempts them from an in-page CTA.
 *
 * ADVERSARIAL REVIEW, 4 Oct 2026 (what was checked and what changed)
 *
 *   Measured on the build and found sound: no page duplicates a link block
 *   for mobile and desktop (the only display-toggled copy is the figure hint,
 *   now excluded as aria-hidden); the Cliniko slot lines (HeroNextDays,
 *   NextConsultLine) are empty in the built HTML and filled in the browser,
 *   so live times never enter a score and two runs stay byte-identical; no
 *   page links Cliniko directly; no sticky bar or header carries a ?with=;
 *   no sitemap URL is noindex, a 404 shell or a redirect source; every built
 *   or routed page outside the sitemap has a reason.
 *   Fixed: hidden and screen-reader-only text earned words and client
 *   signals; the table of contents and breadcrumb counted as words and as
 *   client signals; a page with no H2 passed firstScreen wherever its booking
 *   link sat; two same-language pages could escape the duplicate measure by
 *   hreflang; a translated gentle guide would have been asked for a first-
 *   screen CTA; the crisis directory could be docked for having no price;
 *   "15 minutes" anywhere plus "free" anywhere passed consult; the host-
 *   conditional redirect would, once its pattern parsed, have turned every
 *   broken link into a "redirect"; links to /alberta and /ontario (404
 *   shells) counted as working; redirects were checked after routes.
 *   Left as built, with the risk named: trust gives its last 100 only for a
 *   verify or RCC-explainer link in <main>, which a builder could meet with
 *   the same sentence on 227 pages. Meet it through a shared component placed
 *   where it helps (beside the counsellor cards), never as pasted
 *   boilerplate; the uniqueness check is too coarse to catch one sentence.
 *
 * USAGE
 *
 *   npm run build && npm run score:pages
 *   node scripts/page-score.mjs --only /guides     print one prefix (Git Bash's
 *                                                  path rewriting is undone)
 *   node scripts/page-score.mjs --min 9000         exit 1 if a printed page is under
 *   node scripts/page-score.mjs --json             JSON to stdout, no table
 *
 * Writes data/page-scores.json with EVERY sitemap page, whatever --only says
 * (per page: score, pillars, every check with its points and the reason any
 * were lost), plus the exclusions and the rubric. Pages are in path order and
 * nothing is timestamped, so two runs over one build are byte-identical. The
 * file is a build artefact and is not committed. Inbound links and
 * near-duplication are always measured across the whole site, so --only never
 * changes a page's score. Not in verify:ci yet.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readBuiltSitemap } from './lib/built-sitemap.mjs';
import { parseRobots, rulesFor } from './lib/crawl-signals.mjs';
import { bootNext } from './lib/next-server.mjs';
import { parsePage, scoreAll, rosterFromAiJson, isNotFoundShell, RUBRIC, T, WORD_FLOOR } from './lib/page-score-core.mjs';

const ROOT = process.cwd();
const NEXT = join(ROOT, '.next');
const APP = join(NEXT, 'server', 'app');
const PORT = Number(process.env.SCORE_PORT || 4399);
const OUT = join(ROOT, 'data', 'page-scores.json');

const args = process.argv.slice(2);
const argOf = (name) => {
  const i = args.indexOf(name);
  return i > -1 ? args[i + 1] : undefined;
};
/* Git Bash rewrites an argument that looks like a POSIX path: `--only
   /guides` arrives as "C:/Program Files/Git/guides". Take it back, and accept
   the prefix without its leading slash too. */
const onlyArg = argOf('--only');
const ONLY = onlyArg === undefined ? undefined : (() => {
  let o = onlyArg.replace(/\\/g, '/');
  if (/^[A-Za-z]:\//.test(o)) o = (o.match(/\/Git(\/.*)$/i) || [, o])[1];
  return o.startsWith('/') ? o : `/${o}`;
})();
const MIN = argOf('--min') === undefined ? undefined : Number(argOf('--min'));
const AS_JSON = args.includes('--json');
const log = (...a) => { if (!AS_JSON) console.log(...a); };

if (!existsSync(APP)) {
  console.error('page-score: no build found. Run `npm run build` first.');
  process.exit(1);
}

/* ---- the pages ---------------------------------------------------------- */

const sm = readBuiltSitemap(APP);
if (!sm) {
  console.error('page-score: the build has no sitemap.xml.');
  process.exit(1);
}
const pathOf = (u) => {
  const p = new URL(u).pathname;
  return p.length > 1 ? p.replace(/\/+$/, '') : '/';
};
const sitemapPaths = [...new Set([...sm.xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => pathOf(m[1].trim())))].sort();
const sitemap = new Set(sitemapPaths);
const fileFor = (p) => join(APP, `${p === '/' ? 'index' : p.slice(1)}.html`);

/* Every prerendered document, so the exclusions are complete. */
const built = new Map();
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f);
    else if (e.endsWith('.html')) {
      let r = '/' + relative(APP, f).split(/[\\/]/).join('/').replace(/\.html$/, '');
      if (r === '/index') r = '/';
      built.set(r, f);
    }
  }
})(APP);

/* Routes Next renders on demand: no .html, but real pages or files. */
const routed = new Set();
const MANIFEST = join(NEXT, 'app-path-routes-manifest.json');
if (existsSync(MANIFEST)) {
  for (const r of Object.values(JSON.parse(readFileSync(MANIFEST, 'utf8')))) {
    if (typeof r === 'string' && !r.includes('[')) routed.add(r);
  }
}
const publicFiles = new Set();
const PUB = join(ROOT, 'public');
if (existsSync(PUB)) {
  (function walk(dir) {
    for (const e of readdirSync(dir)) {
      const f = join(dir, e);
      if (statSync(f).isDirectory()) walk(f);
      else publicFiles.add('/' + relative(PUB, f).split(/[\\/]/).join('/'));
    }
  })(PUB);
}

const isPageRoute = (r) => !r.startsWith('/api/') && !/opengraph-image|twitter-image|\/icon|\/apple-icon/.test(r) && !/\.[a-z0-9]+$/i.test(r);
const dynamicScored = sitemapPaths.filter((p) => !built.has(p));
const dynamicExcluded = [...routed].filter((r) => isPageRoute(r) && !built.has(r) && !sitemap.has(r)).sort();

/* ---- fetch what has no file -------------------------------------------- */

const fetched = new Map();
if (dynamicScored.length || dynamicExcluded.length) {
  log(`\nPAGE SCORE - booting the build on ${PORT} for ${dynamicScored.length} on-demand page(s)`);
  const srv = await bootNext({ port: PORT });
  if (srv.error) {
    console.error(`page-score: ${srv.error}\n${srv.output().split('\n').slice(-15).join('\n')}`);
    process.exit(1);
  }
  try {
    for (const p of [...dynamicScored, ...dynamicExcluded]) {
      const res = await fetch(srv.base + p, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (page-score)' } });
      const body = await res.text();
      fetched.set(p, {
        status: res.status,
        location: res.headers.get('location'),
        headers: { 'x-robots-tag': res.headers.get('x-robots-tag') ?? '' },
        body,
      });
    }
  } finally {
    srv.stop();
  }
}

/* ---- context ------------------------------------------------------------ */

/* A link target is known when it answers with a page or a file. The gated
   provinces and /_not-found are built files that render the 404, so a link
   to one is broken, not known (4 Oct 2026 review). */
const notFound = new Set([...built].filter(([, f]) => isNotFoundShell(readFileSync(f, 'utf8'))).map(([p]) => p));
const known = new Set([...built.keys(), ...routed, ...publicFiles, ...sitemap].filter((p) => !notFound.has(p)));

let redirects = [];
try {
  const cfg = (await import(pathToFileURL(join(ROOT, 'next.config.mjs')).href)).default;
  redirects = typeof cfg.redirects === 'function' ? await cfg.redirects() : [];
} catch (e) {
  console.error(`page-score: could not read redirects from next.config.mjs - ${e.message}`);
  process.exit(1);
}

const aiFile = join(APP, 'ai.json.body');
if (!existsSync(aiFile)) {
  console.error('page-score: the build has no /ai.json, so the roster cannot be read.');
  process.exit(1);
}
const roster = rosterFromAiJson(JSON.parse(readFileSync(aiFile, 'utf8')));
const perf = JSON.parse(readFileSync(join(ROOT, 'data', 'perf-budget.json'), 'utf8'));
const robotsFile = join(APP, 'robots.txt.body');
const robotsRules = existsSync(robotsFile) ? rulesFor(parseRobots(readFileSync(robotsFile, 'utf8')), 'googlebot') : [];

/* Read as text, like booking-mapping.mjs reads lib/site.ts: the scorer stays
   free of the app's module graph. */
const nextSteps = readFileSync(join(ROOT, 'lib', 'next-steps.ts'), 'utf8');
const gentleBlock = nextSteps.match(/GENTLE_CTA[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/);
if (!gentleBlock) {
  console.error('page-score: GENTLE_CTA is no longer a Set literal in lib/next-steps.ts.');
  process.exit(1);
}
const gentle = new Set([
  ...[...gentleBlock[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => `/guides/${m[1]}`),
  '/resources/bc-crisis-and-support-directory',
]);

/* ---- score -------------------------------------------------------------- */

const pages = [];
const unreadable = [];
for (const p of sitemapPaths) {
  if (built.has(p)) {
    if (notFound.has(p)) unreadable.push({ path: p, status: '404 (renders the not-found page)', location: null });
    else pages.push(parsePage(p, readFileSync(built.get(p), 'utf8')));
  } else {
    const f = fetched.get(p);
    if (f && f.status === 200 && !isNotFoundShell(f.body)) pages.push(parsePage(p, f.body, { headers: f.headers, dynamic: true }));
    else unreadable.push({ path: p, status: f?.status ?? 'not fetched', location: f?.location ?? null });
  }
}

const results = scoreAll(pages, {
  sitemap,
  known,
  redirects,
  roster,
  perf: { medianHtml: perf.medianHtml, maxHtml: perf.maxHtml },
  robotsRules,
  gentle,
});

/* A sitemap URL that cannot be read scores zero: it is a page Google is
   asked for that answers with something else. */
for (const u of unreadable) {
  results.push({ path: u.path, family: 'unreadable', score: 0, pillars: { seo: 0, links: 0, clients: 0 },
    checks: [{ pillar: 'seo', id: 'served', max: 10000, points: 0, reason: `sitemap URL answered ${u.status}${u.location ? ` → ${u.location}` : ''}` }] });
}
results.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

/* ---- exclusions --------------------------------------------------------- */

const excluded = [];
const reasonFor = (path, html, status, location) => {
  if (path === '/_not-found') return 'the 404 page';
  if (/^\/(alberta|ontario)(\/|$)/.test(path)) return 'gated province: renders the 404 until a counsellor is insured there';
  if (status && status >= 300 && status < 400) return `redirects (${status}) to ${(location ?? '?').split('?')[0]}${/^\/(admin|client-portal)/.test(path) ? ' — sign-in required' : ''}`;
  const robots = html ? (html.match(/<meta name="robots" content="([^"]*)"/i) || [])[1] : undefined;
  if (robots && /noindex/i.test(robots)) return `noindex (${robots})`;
  if (status && status !== 200) return `answers ${status}`;
  return 'not in the sitemap';
};
for (const [p, f] of built) if (!sitemap.has(p)) excluded.push({ path: p, reason: reasonFor(p, readFileSync(f, 'utf8')) });
for (const p of dynamicExcluded) {
  const f = fetched.get(p);
  excluded.push({ path: p, reason: reasonFor(p, f?.body, f?.status, f?.location) });
}
excluded.sort((a, b) => (a.path < b.path ? -1 : 1));

/* ---- output ------------------------------------------------------------- */

const shown = ONLY ? results.filter((r) => r.path.startsWith(ONLY)) : results;
const report = {
  scorer: 'scripts/page-score.mjs',
  buildId: existsSync(join(NEXT, 'BUILD_ID')) ? readFileSync(join(NEXT, 'BUILD_ID'), 'utf8').trim() : null,
  rubric: RUBRIC,
  thresholds: T,
  wordFloors: WORD_FLOOR,
  counts: { sitemap: sitemapPaths.length, scored: results.length, excluded: excluded.length, under9000: results.filter((r) => r.score < 9000).length },
  excluded,
  pages: results,
};
/* The file always holds every page, so a run with --only still leaves the
   complete picture behind; --only narrows what is printed. */
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');

if (AS_JSON) {
  const view = { ...report, pages: shown, counts: { ...report.counts, shown: shown.length } };
  process.stdout.write(JSON.stringify(view, null, 2) + '\n');
} else {
  const pad = (s, n) => String(s).padEnd(n);
  const lpad = (s, n) => String(s).padStart(n);
  const lost = (r) => r.checks.filter((c) => c.points < c.max).map((c) => `${c.id} -${c.max - c.points}`).join(', ');

  if (ONLY) {
    log(`\nPAGE SCORE - ${shown.length} page(s) under ${ONLY}\n${'='.repeat(100)}`);
    log(`${pad('page', 58)} ${lpad('score', 6)} ${lpad('seo', 5)} ${lpad('links', 5)} ${lpad('cli', 5)}  lost`);
    for (const r of [...shown].sort((a, b) => a.score - b.score || (a.path < b.path ? -1 : 1))) {
      log(`${pad(r.path, 58)} ${lpad(r.score, 6)} ${lpad(r.pillars.seo, 5)} ${lpad(r.pillars.links, 5)} ${lpad(r.pillars.clients, 5)}  ${lost(r)}`);
    }
  } else {
    log(`\nPAGE SCORE - ${results.length} sitemap pages, ${excluded.length} excluded\n${'='.repeat(78)}`);
    const fam = new Map();
    for (const r of results) {
      if (!fam.has(r.family)) fam.set(r.family, []);
      fam.get(r.family).push(r.score);
    }
    log(`${pad('family', 16)} ${lpad('pages', 5)} ${lpad('mean', 6)} ${lpad('min', 6)} ${lpad('<9000', 6)}`);
    for (const [f, s] of [...fam].sort((a, b) => a[0].localeCompare(b[0]))) {
      log(`${pad(f, 16)} ${lpad(s.length, 5)} ${lpad(Math.round(s.reduce((a, b) => a + b, 0) / s.length), 6)} ${lpad(Math.min(...s), 6)} ${lpad(s.filter((x) => x < 9000).length, 6)}`);
    }
    log(`\nLowest 25`);
    for (const r of [...results].sort((a, b) => a.score - b.score || (a.path < b.path ? -1 : 1)).slice(0, 25)) {
      log(`  ${lpad(r.score, 5)}  ${pad(r.path, 56)} ${lost(r)}`);
    }
  }
  const byCheck = new Map();
  for (const r of shown) {
    for (const c of r.checks) {
      if (c.points >= c.max) continue;
      const k = `${c.pillar}.${c.id}`;
      const v = byCheck.get(k) ?? { pages: 0, points: 0 };
      v.pages++;
      v.points += c.max - c.points;
      byCheck.set(k, v);
    }
  }
  log(`\nChecks losing points (pages, points lost in total)`);
  for (const [k, v] of [...byCheck].sort((a, b) => b[1].points - a[1].points)) log(`  ${pad(k, 26)} ${lpad(v.pages, 4)} pages  ${lpad(v.points, 7)}`);
  const scores = shown.map((r) => r.score).sort((a, b) => a - b);
  const median = scores.length ? scores[Math.floor(scores.length / 2)] : 0;
  log(`\n${shown.length} page(s): min ${scores[0] ?? '-'}, median ${median}, ${shown.filter((r) => r.score >= 9000).length} at 9,000 or more, ${shown.filter((r) => r.score < 9000).length} under.`);
  if (!ONLY) log(`Excluded ${excluded.length}: ${excluded.map((e) => e.path).join(', ')}`);
  if (unreadable.length) log(`UNREADABLE sitemap URLs: ${unreadable.map((u) => `${u.path} (${u.status})`).join(', ')}`);
  log(`Written to ${relative(ROOT, OUT)}\n`);
}

if (MIN !== undefined && shown.some((r) => r.score < MIN)) {
  if (!AS_JSON) console.log(`${shown.filter((r) => r.score < MIN).length} page(s) under ${MIN}.`);
  process.exitCode = 1;
}
setTimeout(() => process.exit(process.exitCode ?? 0), 3000).unref();
