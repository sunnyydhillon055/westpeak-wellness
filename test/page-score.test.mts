import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RUBRIC, parsePage, scoreAll, buildContext, scorePage, sourceRegex, redirectFor, rosterFromAiJson,
  bookingSubject, fittingCounsellors, contextualAnchors, isAuthority, familyOf, topicWords,
} from '../scripts/lib/page-score-core.mjs';

/* The page scorer (scripts/page-score.mjs), 4 Oct 2026: every check on a
   small fixture, the gentle and policy overrides, the stuffing penalty, and
   that two runs over the same pages give the same bytes. */

const ORIGIN = 'https://www.westpeakwellness.com';

type Opts = {
  title?: string | null;
  desc?: string | null;
  canonical?: string | null;
  robots?: string;
  lang?: string;
  ld?: string[];
  og?: boolean;
  head?: string;
  main?: string;
  footer?: string;
  sticky?: boolean;
  inlined?: boolean;
  crumbs?: boolean;
};

const LD = (path: string, type = 'Article') => [
  JSON.stringify({ '@context': 'https://schema.org', '@type': type, name: 'x' }),
  JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, item: ORIGIN + path }] }),
];

const words = (n: number, seed = 'alpha') => Array.from({ length: n }, (_, i) => `${seed}${i}`).join(' ');

function doc(path: string, o: Opts = {}): string {
  const title = o.title === undefined ? `Stress leave in British Columbia explained | Westpeak` : o.title;
  const desc = o.desc === undefined ? `What stress leave in BC involves, who signs the note, what is paid, and how the return to work is planned with care.` : o.desc;
  const canonical = o.canonical === undefined ? (path === '/' ? ORIGIN : ORIGIN + path) : o.canonical;
  const ld = o.ld ?? LD(path);
  const og = o.og === false ? '' : `<meta property="og:title" content="t"/><meta property="og:description" content="d"/><meta property="og:image" content="${ORIGIN}/og.png"/>`;
  return `<!DOCTYPE html><html lang="${o.lang ?? 'en-CA'}"><head>${title === null ? '' : `<title>${title}</title>`}`
    + (desc === null ? '' : `<meta name="description" content="${desc}"/>`)
    + (o.robots ? `<meta name="robots" content="${o.robots}"/>` : '')
    + (canonical === null ? '' : `<link rel="canonical" href="${canonical}"/>`)
    + `<link rel="stylesheet" href="/_next/static/css/a.css" data-precedence="next" media="print" onload="this.media='all'"/>`
    + (o.inlined === false ? '' : '<style data-inlined>body{}</style>')
    + og + (o.head ?? '')
    + ld.map((b) => `<script type="application/ld+json">${b}</script>`).join('')
    + `</head><body><header class="site-header"><a href="/">Home</a><a href="/book">Book</a></header>`
    + `<main id="main">${o.crumbs === false ? '' : '<nav aria-label="Breadcrumb" class="crumbs"><a href="/">Home</a></nav>'}${o.main ?? ''}</main>`
    + `<footer class="site-footer">${o.footer ?? '<a href="/privacy">Privacy</a><a href="/resources/verify-a-counsellor-in-bc">Verify</a>'}</footer>`
    + (o.sticky === false ? '' : '<div class="sticky-book"><a class="sticky-book-btn sb-book" href="/book">Book</a></div>')
    + `<script>self.__next_f.push([1,"<a href=\\"/nowhere\\">x</a>"])</script></body></html>`;
}

const roster = rosterFromAiJson({
  counsellors: [
    { name: 'Camille Granda', url: `${ORIGIN}/practitioners/camille-granda`, languages: ['English', 'Tagalog'], provinces: ['BC', 'AB'], booking_url: `${ORIGIN}/book?with=camille-granda`, accepting_new_clients: true },
    { name: 'Savneet Singh', url: `${ORIGIN}/practitioners/savneet-singh`, languages: ['English', 'Punjabi'], provinces: ['BC'], booking_url: `${ORIGIN}/book?with=savneet-singh`, accepting_new_clients: true },
  ],
  services: [
    { url: `${ORIGIN}/services/individual-therapy`, counsellors: [{ name: 'Camille Granda' }, { name: 'Savneet Singh' }] },
    { url: `${ORIGIN}/services/couples-therapy`, counsellors: [{ name: 'Camille Granda' }] },
  ],
});

/* A full content body: booking in the hero, a counsellor, fee, the free 15
   minutes, a verify link, a mailto, five contextual links and a citation. */
const GOOD_MAIN = (extra = '') => `
  <section class="hero"><h1>Stress leave in British Columbia</h1>
  <p>Read this first. <a href="/book">Book a free consultation</a></p></section>
  <h2>What it is</h2><p>${words(700)}</p>
  <p>Sessions are $140 and the free 15-minute consultation comes first with
  <a href="/practitioners/camille-granda">Camille Granda</a>.</p>
  <p>You can <a href="/resources/verify-a-counsellor-in-bc">check her registration</a> on the public register,
  read <a href="/guides/a">the first related guide</a>, the <a href="/guides/b">second related guide</a>,
  and <a href="/guides/c">the third related guide</a> before you decide anything.</p>
  <p>The province explains it on <a href="https://www2.gov.bc.ca/gov/content/x">the BC employment standards page</a> in full.</p>
  <p>Or write to <a href="mailto:info@westpeakwellness.com">info@westpeakwellness.com</a> with a question.</p>
  ${extra}`;

const opts = (pages: ReturnType<typeof parsePage>[], extra: Record<string, unknown> = {}) => ({
  sitemap: new Set(pages.map((p) => p.path)),
  known: new Set([...pages.map((p) => p.path), '/', '/book', '/privacy', '/contact', '/pricing', '/guides/a', '/guides/b', '/guides/c', '/practitioners/camille-granda', '/practitioners/savneet-singh', '/resources/verify-a-counsellor-in-bc']),
  redirects: [{ source: '/fees', destination: '/pricing' }, { source: '/careers/:slug', destination: '/about' }],
  roster,
  perf: { medianHtml: 1_000_000, maxHtml: 2_000_000 },
  robotsRules: [],
  gentle: new Set<string>(),
  ...extra,
});

const check = (r: { checks: { id: string; points: number; max: number; reason: string }[] }, id: string) => {
  const c = r.checks.find((x) => x.id === id);
  assert.ok(c, `no check ${id}`);
  return c!;
};

/* Six guides that link one another, so inbound is satisfied and each is
   compared against distinct siblings. */
function site(mutate: (i: number, path: string) => Opts = () => ({})) {
  const paths = ['/guides/a', '/guides/b', '/guides/c', '/guides/d', '/guides/e', '/guides/f'];
  const ring = paths.map((p) => `<li>Also worth reading: <a href="${p}">the guide on ${p.slice(-1)}</a> today.</li>`).join('');
  return paths.map((p, i) => parsePage(p, doc(p, {
    title: `Guide ${p.slice(-1)} about stress leave in British Columbia`,
    desc: `A distinct description for guide ${p.slice(-1)}, about stress leave, notes from the doctor, and how pay works in BC.`,
    main: GOOD_MAIN(`<ul>${ring}</ul>`).replace('<h1>Stress leave in British Columbia</h1>', `<h1>Guide ${p.slice(-1)}: stress leave in British Columbia</h1>`).replace(/alpha/g, `w${i}x`),
    ...mutate(i, p),
  })));
}

test('the three pillars are worth 4,000, 3,000 and 3,000', () => {
  const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);
  assert.equal(sum(RUBRIC.seo), 4000);
  assert.equal(sum(RUBRIC.links), 3000);
  assert.equal(sum(RUBRIC.clients), 3000);
});

test('a page that does everything right scores 10,000, and every check carries its own max', () => {
  const pages = site();
  const results = scoreAll(pages, opts(pages));
  for (const r of results) {
    const lost = r.checks.filter((c) => c.points < c.max).map((c) => `${c.id}: ${c.reason}`);
    assert.deepEqual(lost, [], r.path);
    assert.equal(r.score, 10000);
    assert.equal(r.checks.reduce((a, c) => a + c.max, 0), 10000);
  }
});

test('title: too long and shared titles lose their parts, with the reason', () => {
  const pages = site((i) => (i < 2 ? { title: 'The same title for two pages about stress leave, which is far too long to fit' } : {}));
  const r = scoreAll(pages, opts(pages));
  const t = check(r[0], 'title');
  assert.equal(t.points, 200);
  assert.match(t.reason, /shared by 2 pages/);
  assert.match(t.reason, /chars \(want 30-60\)/);
});

test('description: & is counted as &amp;, as the seo gate counts it', () => {
  const d = 'x'.repeat(151) + ' &amp; y'; // 155 characters read, 159 as the gate counts
  const pages = site((i) => (i === 0 ? { desc: d } : {}));
  const c = check(scoreAll(pages, opts(pages))[0], 'description');
  assert.equal(c.points, 300);
  assert.match(c.reason, /159 chars/);
});

test('h1: two H1s lose half; a heading on another subject loses the topic half; a Punjabi page is not stem-compared', () => {
  const two = site((i) => (i === 0 ? { main: GOOD_MAIN('<h1>Another</h1>') } : {}));
  assert.equal(check(scoreAll(two, opts(two))[0], 'h1').points, 0);
  const off = site((i) => (i === 0 ? { main: GOOD_MAIN().replace('<h1>Stress leave in British Columbia</h1>', '<h1>Ask it here first.</h1>') } : {}));
  assert.equal(check(scoreAll(off, opts(off))[0], 'h1').points, 150);
  const pa = site((i) => (i === 0 ? { lang: 'pa', main: GOOD_MAIN().replace('<h1>Stress leave in British Columbia</h1>', '<h1>ਕੁਝ ਗੱਲਾਂ</h1>') } : {}));
  assert.equal(check(scoreAll(pa, opts(pa))[0], 'h1').points, 300);
  assert.ok(topicWords('CBT for anxiety').has('cbt'));
});

test('canonical and indexable: a canonical elsewhere and a noindex on a sitemap URL', () => {
  const pages = site((i) => (i === 0 ? { canonical: `${ORIGIN}/guides/z`, robots: 'noindex, follow' } : {}));
  const r = scoreAll(pages, opts(pages))[0];
  assert.equal(check(r, 'canonical').points, 200);
  assert.equal(check(r, 'indexable').points, 150);
  assert.match(check(r, 'indexable').reason, /noindex/);
});

test('JSON-LD: an unparseable block, the wrong type for the family, and no BreadcrumbList', () => {
  const pages = site((i) => (i === 0 ? { ld: ['{"@type": "WebPage",}'] } : i === 1 ? { ld: [JSON.stringify({ '@type': 'WebPage' })] } : {}));
  const r = scoreAll(pages, opts(pages));
  assert.equal(check(r[0], 'jsonld').points, 0);
  assert.equal(check(r[1], 'jsonld').points, 100);
  assert.match(check(r[1], 'jsonld').reason, /no Article\/MedicalWebPage for a guide page; no BreadcrumbList/);
});

test('heading order: a skipped level costs half', () => {
  const pages = site((i) => (i === 0 ? { main: GOOD_MAIN('<h4>Skipped</h4>') } : {}));
  const c = check(scoreAll(pages, opts(pages))[0], 'headingOrder');
  assert.equal(c.points, RUBRIC.seo.headingOrder / 2);
  assert.match(c.reason, /h2→h4/);
});

test('words: <main> only, zero at half the floor, full at it, nothing for more', () => {
  const thin = parsePage('/guides/t', doc('/guides/t', { main: `<h1>Thin</h1><p>${words(250)}</p>`, footer: `<p>${words(2000, 'foot')}</p>` }));
  const ctx = buildContext([thin], opts([thin]));
  const c = check(scorePage(thin, ctx), 'words');
  assert.equal(c.points, 0, 'the 2,000 words in the footer do not count');
  assert.match(c.reason, /content floor 600/);
  const long = parsePage('/guides/l', doc('/guides/l', { main: `<h1>Long</h1><p>${words(5000)}</p>` }));
  assert.equal(check(scorePage(long, buildContext([long], opts([long]))), 'words').points, RUBRIC.seo.words);
});

test('uniqueness: a near-copy of a sibling scores zero; hreflang twins are not compared', () => {
  const same = `<h1>Same</h1><p>${words(800, 'same')}</p>`;
  const a = parsePage('/guides/a', doc('/guides/a', { main: same }));
  const b = parsePage('/guides/b', doc('/guides/b', { main: same }));
  const r = scoreAll([a, b], opts([a, b]));
  assert.equal(check(r[0], 'uniqueness').points, 0);
  assert.match(check(r[0], 'uniqueness').reason, /100% alike/);

  const alt = (self: string, other: string) => `<link rel="alternate" hreflang="en" href="${ORIGIN}${self}"/><link rel="alternate" hreflang="tl" href="${ORIGIN}${other}"/>`;
  const x = parsePage('/guides/x', doc('/guides/x', { main: same, head: alt('/guides/x', '/guides/y') }));
  const y = parsePage('/guides/y', doc('/guides/y', { main: same, head: alt('/guides/y', '/guides/x') }));
  const r2 = scoreAll([x, y], opts([x, y]));
  assert.equal(check(r2[0], 'uniqueness').points, RUBRIC.seo.uniqueness);
});

test('images, Open Graph, lang and hreflang reciprocity', () => {
  const pages = site((i) => (i === 0
    ? { og: false, main: GOOD_MAIN('<img src="/a.png"/><img src="/b.png" alt="b" width="1" height="1"/>'), head: `<link rel="alternate" hreflang="en" href="${ORIGIN}/guides/a"/><link rel="alternate" hreflang="tl" href="${ORIGIN}/guides/b"/>` }
    : {}));
  const r = scoreAll(pages, opts(pages))[0];
  assert.equal(check(r, 'images').points, 100);
  assert.equal(check(r, 'openGraph').points, 0);
  const l = check(r, 'lang');
  assert.equal(l.points, 50);
  assert.match(l.reason, /one-way/);
});

test('weight: over the budget median loses pro rata; a static page whose CSS blocks loses the rest', () => {
  const pages = site((i) => (i === 0 ? { inlined: false } : {}));
  const r = scoreAll(pages, opts(pages, { perf: { medianHtml: 1000, maxHtml: 2000 } }))[0];
  const w = check(r, 'weight');
  assert.equal(w.points, 0);
  assert.match(w.reason, /not inlined/);
});

test('inbound counts <main> links only: header, footer, breadcrumb and nav do not count; the home page is exempt', () => {
  const lonely = parsePage('/guides/lonely', doc('/guides/lonely', { main: GOOD_MAIN() }));
  const others = [1, 2, 3, 4, 5].map((n) => parsePage(`/guides/o${n}`, doc(`/guides/o${n}`, {
    main: `<h1>O${n}</h1><nav aria-label="On this page"><a href="/guides/lonely">toc</a></nav><p>${words(700)}</p>`,
    footer: '<a href="/guides/lonely">Lonely</a><a href="/privacy">Privacy</a>',
  })));
  const all = [lonely, ...others];
  const r = scoreAll(all, opts(all)).find((x) => x.path === '/guides/lonely')!;
  assert.equal(check(r, 'inbound').points, 0);
  const home = parsePage('/', doc('/', { main: GOOD_MAIN(), ld: [JSON.stringify({ '@type': 'WebSite' })] }));
  assert.equal(check(scoreAll([home], opts([home]))[0], 'inbound').points, RUBRIC.links.inbound);
});

test('outbound: a chip grid is navigation, not context; forty contextual links read as stuffing; an index page may list', () => {
  const chips = `<div class="chip-grid">${Array.from({ length: 27 }, (_, i) => `<a class="chip" href="/online-counselling/c${i}">Online counselling in C${i}</a>`).join('')}</div>`;
  assert.equal(contextualAnchors(chips).length, 0);
  assert.equal(contextualAnchors('<p>Read <a href="/x">the guide</a> before you start.</p>').length, 1);
  assert.equal(contextualAnchors('<li><a href="/x">Just a title</a></li>').length, 0);

  const stuffed = `<p>${Array.from({ length: 40 }, (_, i) => `see <a href="/guides/s${i}">guide ${i}</a> and`).join(' ')} more.</p>`;
  const pages = site((i) => (i === 0 ? { main: GOOD_MAIN(stuffed) } : i === 1 ? { main: GOOD_MAIN(chips) } : {}));
  const r = scoreAll(pages, opts(pages));
  const s = check(r[0], 'outbound');
  assert.ok(s.points < RUBRIC.links.outbound / 2, `stuffing penalised: ${s.points}`);
  assert.match(s.reason, /stuffing/);
  assert.equal(check(r[1], 'outbound').points, RUBRIC.links.outbound, 'the chip grid does not push a page over the line');

  const hub = parsePage('/guides', doc('/guides', { main: `<h1>Guides</h1><ul>${Array.from({ length: 50 }, (_, i) => `<li><a href="/guides/g${i}">G${i}</a></li>`).join('')}</ul>`, ld: LD('/guides', 'CollectionPage') }));
  assert.equal(check(scoreAll([hub], opts([hub]))[0], 'outbound').points, RUBRIC.links.outbound);
});

test('anchors, broken links and links through a redirect', () => {
  const pages = site((i) => (i === 0 ? { main: GOOD_MAIN('<p>For more, <a href="/guides/a">click here</a> or <a href="/nope">this guide</a> or <a href="/fees">the fees</a> or <a href="/careers/x">jobs</a>.</p>') } : {}));
  const r = scoreAll(pages, opts(pages))[0];
  assert.ok(check(r, 'anchors').points < RUBRIC.links.anchors);
  assert.match(check(r, 'anchors').reason, /"click here"/);
  assert.equal(check(r, 'broken').points, RUBRIC.links.broken - 250);
  assert.match(check(r, 'broken').reason, /\/nope/);
  assert.equal(check(r, 'redirects').points, 0);
  assert.match(check(r, 'redirects').reason, /\/fees → \/pricing/);
  /* The RSC payload's markup is not a link anybody can click. */
  assert.doesNotMatch(check(r, 'broken').reason, /nowhere/);
  assert.ok(sourceRegex('/careers/:slug').test('/careers/rcc'));
  assert.ok(!sourceRegex('/careers/:slug').test('/careers'));
  assert.equal(redirectFor('/x/y/z', [{ source: '/x/:path*', destination: '/' }])?.destination, '/');
});

test('citations are asked of factual families only, and only an authority counts', () => {
  assert.ok(isAuthority('https://www2.gov.bc.ca/gov/content/x'));
  assert.ok(isAuthority('https://bc.cmha.ca/x'));
  assert.ok(!isAuthority('https://www.sunlife.ca/x'));
  assert.ok(!isAuthority('http://www2.gov.bc.ca/x'));
  const pages = site((i) => (i === 0 ? { main: GOOD_MAIN().replace(/https:\/\/www2\.gov\.bc\.ca[^"]*/, 'https://example.com/') } : {}));
  assert.equal(check(scoreAll(pages, opts(pages))[0], 'citations').points, 0);
  const svc = parsePage('/services/couples-therapy', doc('/services/couples-therapy', { main: '<h1>Couples</h1>' }));
  assert.equal(check(scoreAll([svc], opts([svc]))[0], 'citations').points, RUBRIC.links.citations);
});

test('breadcrumb: a visible breadcrumb nav is required off the home page', () => {
  const pages = site((i) => (i === 0 ? { crumbs: false } : {}));
  assert.equal(check(scoreAll(pages, opts(pages))[0], 'breadcrumb').points, 0);
});

test('first screen: a booking link in the hero is full; one past half the page is zero', () => {
  const late = GOOD_MAIN().replace('<a href="/book">Book a free consultation</a>', '') + `<h2>End</h2><p><a href="/book">Book a free consultation</a></p>`;
  const pages = site((i) => (i === 0 ? { main: late } : {}));
  const c = check(scoreAll(pages, opts(pages))[0], 'firstScreen');
  assert.equal(c.points, 0);
  assert.match(c.reason, /after the first H2/);
});

test('routing: a service only one counsellor offers must open her calendar, and never somebody who does not offer it', () => {
  const page = (main: string) => parsePage('/services/couples-therapy', doc('/services/couples-therapy', { main, ld: LD('/services/couples-therapy', 'Service') }));
  const bare = page(GOOD_MAIN());
  assert.equal(check(scoreAll([bare], opts([bare]))[0], 'routing').points, RUBRIC.clients.routing / 2);
  const wrong = page(GOOD_MAIN().replace('href="/book"', 'href="/book?with=savneet-singh#calendar"'));
  assert.equal(check(scoreAll([wrong], opts([wrong]))[0], 'routing').points, 0);
  const right = page(GOOD_MAIN().replace('href="/book"', 'href="/book?with=camille-granda&amp;for=couples#calendar"'));
  assert.equal(check(scoreAll([right], opts([right]))[0], 'routing').points, RUBRIC.clients.routing);

  /* A profile's first button is hers; a colleague's card lower down is fine. */
  const prof = parsePage('/practitioners/savneet-singh', doc('/practitioners/savneet-singh', {
    main: GOOD_MAIN().replace('href="/book"', 'href="/book?with=savneet-singh#calendar"') + '<p>Or <a href="/book?with=camille-granda#calendar">book with Camille</a> for couples work.</p>',
    ld: LD('/practitioners/savneet-singh', 'ProfilePage'),
  }));
  assert.equal(check(scoreAll([prof], opts([prof]))[0], 'routing').points, RUBRIC.clients.routing);

  assert.deepEqual(bookingSubject('/online-counselling/surrey/anxiety-counselling'), { service: 'individual-therapy', language: undefined, province: undefined, counsellor: undefined });
  assert.deepEqual(fittingCounsellors(bookingSubject('/tagalog-counselling/surrey'), roster).map((c) => c.slug), ['camille-granda']);
  assert.deepEqual(fittingCounsellors({ service: 'couples-therapy', language: 'pa' }, roster), []);
});

test('counsellor, fee, the 15-minute consultation, trust, the smaller ask and the sticky bar', () => {
  const bare = `<h1>Stress leave in British Columbia</h1><p><a href="/book">Book a free consultation</a></p><p>${words(700)}</p>`;
  const pages = site((i) => (i === 0 ? { main: bare, sticky: false, footer: '' } : i === 1 ? { main: GOOD_MAIN().replace('15-minute', '30-minute') } : {}));
  const r = scoreAll(pages, opts(pages));
  for (const id of ['counsellor', 'fee', 'consult', 'trust', 'email', 'sticky']) assert.equal(check(r[0], id).points, 0, id);
  assert.match(check(r[1], 'consult').reason, /30-minute/);
  assert.equal(check(r[1], 'consult').points, 0);
  /* Somebody else's thirty minutes is not the practice's consultation. */
  const psych = site((i) => (i === 0 ? { main: GOOD_MAIN('<p>A psychiatric referral can end in a thirty-minute medication consult.</p>') } : {}));
  assert.equal(check(scoreAll(psych, opts(psych))[0], 'consult').points, RUBRIC.clients.consult);
});

test('a gentle guide reaches the full pillar without a hard sell, and loses half for one', () => {
  const soft = `<h1>Stress leave in British Columbia</h1><h2>Before anything</h2><p>${words(700)}</p>
    <p>When you are ready, a <a href="/book">free 15-minute conversation</a> is there, or write to <a href="/contact">us at the practice</a>; fees are on <a href="/pricing">the fees page</a>. You can <a href="/resources/verify-a-counsellor-in-bc">check registration</a> too, with no rush.</p>`;
  const pages = site((i) => (i === 0 ? { main: soft } : {}));
  const gentle = new Set(['/guides/a']);
  const r = scoreAll(pages, opts(pages, { gentle }))[0];
  assert.equal(r.gentle, true);
  assert.equal(check(r, 'gentleNextStep').points, RUBRIC.clients.firstScreen + RUBRIC.clients.counsellor);
  assert.equal(r.checks.find((c) => c.id === 'firstScreen'), undefined);
  assert.equal(r.pillars.clients, 3000);

  const hard = site((i) => (i === 0 ? { main: soft.replace('free 15-minute conversation', 'Book now!') } : {}));
  assert.equal(check(scoreAll(hard, opts(hard, { gentle }))[0], 'gentleNextStep').points, (RUBRIC.clients.firstScreen + RUBRIC.clients.counsellor) / 2);
});

test('a policy page is scored on the smaller ask and a route to booking, 1,500 each', () => {
  const p = parsePage('/privacy', doc('/privacy', { main: `<h1>Privacy</h1><p>${words(300)} Questions to <a href="mailto:info@westpeakwellness.com">info@westpeakwellness.com</a>.</p>`, ld: LD('/privacy', 'WebPage') }));
  const r = scoreAll([p], opts([p]))[0];
  assert.equal(familyOf('/privacy'), 'policy');
  assert.deepEqual(r.checks.filter((c) => c.pillar === 'clients').map((c) => [c.id, c.points]), [['email', 1500], ['bookAnywhere', 1500]]);
});

test('the output is deterministic: path order, whatever order the pages arrive in, and the same bytes twice', () => {
  const pages = site();
  const a = JSON.stringify(scoreAll(pages, opts(pages)));
  const b = JSON.stringify(scoreAll([...pages].reverse(), opts([...pages].reverse())));
  assert.equal(a, b);
  assert.deepEqual(JSON.parse(a).map((r: { path: string }) => r.path), [...pages.map((p) => p.path)].sort());
});
