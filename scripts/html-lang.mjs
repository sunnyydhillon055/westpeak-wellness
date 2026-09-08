#!/usr/bin/env node
/* THE DOCUMENT LANGUAGE OF THE PUNJABI AND TAGALOG PAGES.
 *
 * WHY THIS EXISTS
 *
 * Every page on this site is rendered inside one root layout, and Next 14
 * sets <html lang> there and nowhere else. So a page written in Punjabi or
 * Tagalog shipped <html lang="en-CA"> with its real language marked only on
 * the content block — the audit of 6 Sep 2026 called it the one high-severity
 * on-page defect the site had.
 *
 * The framework's answer is one root layout per language, in route groups.
 * That was built and tested the same day and reverted: on Next 14, with more
 * than one root layout, every notFound() — unknown URLs, and the gated
 * /alberta and /ontario shells — renders through Next's bare error shell with
 * no lang, no fonts and no metadata. A worse 404 on every unknown URL to fix
 * the language on 34 pages is the wrong trade, and the framework fix arrives
 * with Next 15, which is a separate decision already on the owner's list.
 *
 * WHAT THIS DOES INSTEAD
 *
 * The pages are static. Next writes them to .next/server/app as finished HTML
 * and Vercel serves those files as they are. After `next build`, this sets the
 * html element's lang on exactly the files whose content is in another
 * language, and patches the same attribute in the embedded React payload so
 * hydration agrees with the document. Nothing else in the file is touched.
 *
 * Run with --check and it changes nothing: it fails the build if any of those
 * files carries the wrong language, or if any other file carries pa or tl.
 * That is what verify:ci runs, so the fix cannot silently stop being applied.
 *
 * WHICH FILES. By route, not by sniffing the content:
 *   /punjabi, /punjabi/*                       pa
 *   /tagalog, /tagalog/*                       tl
 *   /practitioners/<slug>/tl                   tl
 *   /practitioners/<slug>/<place>/tl           tl
 * /punjabi-counselling and /tagalog-counselling are English pages about a
 * language service and stay en-CA on purpose.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = join(process.cwd(), '.next', 'server', 'app');
const CHECK = process.argv.includes('--check');

const RULES = [
  { lang: 'pa', test: (r) => r === '/punjabi' || r.startsWith('/punjabi/') },
  { lang: 'tl', test: (r) => r === '/tagalog' || r.startsWith('/tagalog/') },
  { lang: 'tl', test: (r) => /^\/practitioners\/[^/]+\/tl$/.test(r) },
  { lang: 'tl', test: (r) => /^\/practitioners\/[^/]+\/[^/]+\/tl$/.test(r) },
  { lang: 'pa', test: (r) => /^\/practitioners\/[^/]+\/pa$/.test(r) },
  { lang: 'pa', test: (r) => /^\/practitioners\/[^/]+\/[^/]+\/pa$/.test(r) },
];

if (!existsSync(ROOT)) {
  console.error('  no build at .next/server/app — run next build first');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

const routeOf = (f) => '/' + relative(ROOT, f).split(sep).join('/').replace(/\.html$/, '').replace(/^index$/, '');
const wanted = (route) => RULES.find((r) => r.test(route))?.lang ?? 'en-CA';

/* Two places carry the attribute: the html element, and the React flight
   payload inlined in the page, where the root layout's html element appears
   as ["$","html",null,{"lang":"en-CA",... — escaped inside a JS string. The
   .rsc file beside the page carries the unescaped form for client navigation. */
const HTML_TAG = /(<html\b[^>]*\blang=")([^"]*)(")/;
const FLIGHT_ESC = /(\\"html\\",null,\{\\"lang\\":\\")([^\\"]*)(\\")/g;
const FLIGHT_RAW = /("html",null,\{"lang":")([^"]*)(")/g;

let fixed = 0, wrong = [], ok = 0;
for (const f of walk(ROOT)) {
  const route = routeOf(f);
  if (route.startsWith('/_')) continue;
  const html = readFileSync(f, 'utf8');
  const m = html.match(HTML_TAG);
  if (!m) continue;
  const have = m[2];
  const want = wanted(route);
  if (have === want) { ok++; continue; }
  if (CHECK) { wrong.push(`${route}  has ${have}, should be ${want}`); continue; }
  const next = html.replace(HTML_TAG, `$1${want}$3`).replace(FLIGHT_ESC, `$1${want}$3`);
  writeFileSync(f, next);
  const rsc = f.replace(/\.html$/, '.rsc');
  if (existsSync(rsc)) writeFileSync(rsc, readFileSync(rsc, 'utf8').replace(FLIGHT_RAW, `$1${want}$3`));
  fixed++;
}

if (CHECK) {
  console.log(`\nDOCUMENT LANGUAGE - ${ok + wrong.length} pages checked`);
  if (wrong.length) {
    console.log(`\n  ${wrong.length} page(s) carry the wrong <html lang>:\n`);
    for (const w of wrong) console.log(`   ${w}`);
    console.log('\n  Run `node scripts/html-lang.mjs` after next build; the build script does.');
    process.exit(1);
  }
  console.log('  every Punjabi and Tagalog document declares its own language; every English one declares en-CA.\n');
} else {
  console.log(`  html lang: ${fixed} document(s) set to their own language, ${ok} already correct`);
}
