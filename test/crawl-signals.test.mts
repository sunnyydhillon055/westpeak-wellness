import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseRobots, rulesFor, robotsMatch, blockedBy, blockedImages, namedImages,
  htmlAlternates, sitemapAlternates, hreflangProblems, clusterMismatches,
  // @ts-expect-error -- plain .mjs script helper; no declaration file
} from '../scripts/lib/crawl-signals.mjs';
import { GET as robotsTxt } from '../app/robots.txt/route.ts';

const O = 'https://www.westpeakwellness.com';

test('robots patterns match from the start, with * and a trailing $', () => {
  assert.equal(robotsMatch('/*/opengraph-image', '/guides/x/opengraph-image?abc'), true);
  assert.equal(robotsMatch('/opengraph-image', '/opengraph-image'), true);
  assert.equal(robotsMatch('/opengraph-image', '/guides/opengraph-image'), false);
  assert.equal(robotsMatch('/a$', '/a/b'), false);
  assert.equal(robotsMatch('/a$', '/a'), true);
});

test('the longest rule wins and Allow wins a tie', () => {
  const rules = [
    { type: 'disallow', path: '/guides' },
    { type: 'allow', path: '/guides/open' },
    { type: 'disallow', path: '/x' },
    { type: 'allow', path: '/x' },
  ];
  assert.equal(blockedBy(rules, '/guides/closed'), '/guides');
  assert.equal(blockedBy(rules, '/guides/open/page'), null);
  assert.equal(blockedBy(rules, '/x/y'), null);
});

test('an agent with no group of its own reads the * group; consecutive agents share one', () => {
  const groups = parseRobots('User-Agent: *\nDisallow: /a\n\nUser-Agent: GPTBot\nUser-Agent: CCBot\nDisallow: /b\n');
  assert.deepEqual(rulesFor(groups, 'Googlebot'), [{ type: 'disallow', path: '/a' }]);
  assert.deepEqual(rulesFor(groups, 'ccbot'), [{ type: 'disallow', path: '/b' }]);
});

test('the images a page names come from og, twitter and every JSON-LD image field', () => {
  const html = `<meta property="og:image" content="${O}/guides/a/opengraph-image?1"/>
<meta name="twitter:image" content="${O}/guides/a/opengraph-image?1"/>
<script type="application/ld+json">{"@graph":[{"@type":"Article","image":{"@type":"ImageObject","url":"${O}/opengraph-image"}},{"@type":"Organization","logo":"${O}/icon.svg","image":["${O}/img/a.png"]}]}</script>`;
  assert.deepEqual(namedImages(html).sort(), [`${O}/guides/a/opengraph-image?1`, `${O}/icon.svg`, `${O}/img/a.png`, `${O}/opengraph-image`].sort());
  const old = 'User-Agent: *\nAllow: /\nDisallow: /*/opengraph-image\nDisallow: /opengraph-image\n';
  assert.equal(blockedImages(namedImages(html), old, O).length, 2, 'the 3 Oct rule blocked both card URLs');
});

test('robots.txt as served lets search and preview bots fetch every card, and still closes it to training crawlers', async () => {
  const body = await robotsTxt().text();
  const urls = [`${O}/opengraph-image`, `${O}/guides/stress-leave-bc/opengraph-image?4124454ac3b1fdb3`, `${O}/online-counselling/kamloops/anxiety-counselling/opengraph-image`];
  for (const agent of ['*', 'Googlebot', 'Bingbot', 'facebookexternalhit', 'Slackbot', 'Applebot', 'OAI-SearchBot', 'PerplexityBot']) {
    assert.deepEqual(blockedImages(urls, body, O, agent), [], `${agent} must be able to fetch the card`);
  }
  for (const agent of ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended']) {
    assert.equal(blockedImages(urls, body, O, agent).length, urls.length, `${agent} keeps the card rule`);
  }
  assert.match(body, /^Sitemap: |# Summary for language models/m);
});

test('hreflang link tags are read in either attribute case, and in-body anchors are not', () => {
  const html = `<link rel="alternate" hrefLang="en-CA" href="${O}/guides/a"/><link rel="alternate" type="text/markdown" href="${O}/guides/a.md"/><a hrefLang="pa" href="/punjabi">x</a>`;
  assert.deepEqual(htmlAlternates(html), [{ lang: 'en-CA', href: `${O}/guides/a` }]);
});

test('a one-way twin, a duplicate language and a missing self are each reported', () => {
  const en = `${O}/guides/burnout-vs-depression`;
  const tl1 = `${O}/tagalog/gabay/depresyon-o-pagod-lang`;
  const tl2 = `${O}/tagalog/gabay/pagod-sa-pag-aalaga`;
  const cluster = (tl: string) => [{ lang: 'en-CA', href: en }, { lang: 'tl', href: tl }, { lang: 'x-default', href: en }];
  /* The state on main before 3 Oct: both Tagalog guides claimed the English one. */
  const before = new Map([[en, cluster(tl1)], [tl1, cluster(tl1)], [tl2, cluster(tl2)]]);
  const found = hreflangProblems(before);
  assert.deepEqual(found.map((p: { kind: string; page: string }) => `${p.kind} ${p.page}`), [`one-way ${tl2}`]);
  const after = new Map([[en, cluster(tl1)], [tl1, cluster(tl1)]]);
  assert.deepEqual(hreflangProblems(after), []);
  const dup = new Map([[en, [...cluster(tl1), { lang: 'tl', href: tl2 }]]]);
  assert.ok(hreflangProblems(dup, new Set([en, tl1, tl2])).some((p: { kind: string }) => p.kind === 'duplicate'));
  const noSelf = new Map([[tl2, cluster(tl1)]]);
  assert.ok(hreflangProblems(noSelf, new Set([tl2, en, tl1])).some((p: { kind: string }) => p.kind === 'no-self'));
});

test('the sitemap and the page must state the same cluster', () => {
  const en = `${O}/guides/b`;
  const xml = `<urlset><url><loc>${en}</loc><xhtml:link rel="alternate" hreflang="en-CA" href="${en}"/><xhtml:link rel="alternate" hreflang="tl" href="${O}/tl/last"/></url></urlset>`;
  const fromSitemap = sitemapAlternates(xml);
  const fromHtml = new Map([[en, [{ lang: 'en-CA', href: en }, { lang: 'tl', href: `${O}/tl/first` }]]]);
  assert.equal(clusterMismatches(fromHtml, fromSitemap).length, 1);
  assert.equal(clusterMismatches(fromSitemap, fromSitemap).length, 0);
});
