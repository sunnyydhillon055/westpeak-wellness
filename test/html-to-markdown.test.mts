import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlToMarkdown, decodeEntities, metaOf } from '../lib/html-to-markdown.ts';
import { normalise } from '../lib/md-path.ts';

/* THE MARKDOWN TWINS — 24 Sep 2026.
 *
 * Every page on this site has a .md address that serves the same content
 * without the 200 KB of chrome around it. The converter that produces it is
 * this repository's own (app/api/md, lib/html-to-markdown.ts) rather than a
 * dependency, so these are the cases that would otherwise be discovered by an
 * answer engine quoting something wrong.
 *
 * Three of them are not hypothetical. They are what the first version did. */

const BASE = 'https://www.westpeakwellness.com';
const md = (html: string) => htmlToMarkdown(html, BASE).trim();

test('headings, prose and emphasis survive', () => {
  const out = md('<main><h1>Stress leave</h1><h2>Who signs it</h2><p>A <strong>doctor</strong> or <em>nurse practitioner</em>.</p></main>');
  assert.equal(out, '# Stress leave\n\n## Who signs it\n\nA **doctor** or *nurse practitioner*.');
});

test('links are absolute, because a .md file has no page to resolve against', () => {
  const out = md('<main><p>See the <a href="/pricing">fees</a>.</p></main>');
  assert.match(out, /\[fees\]\(https:\/\/www\.westpeakwellness\.com\/pricing\)/);
});

test('mailto, tel and external links are left alone', () => {
  const out = md('<main><p><a href="mailto:info@westpeakwellness.com">Email</a> <a href="tel:+16042590810">Call</a> <a href="https://bcacc.ca">BCACC</a></p></main>');
  assert.match(out, /\(mailto:info@westpeakwellness\.com\)/);
  assert.match(out, /\(tel:\+16042590810\)/);
  assert.match(out, /\(https:\/\/bcacc\.ca\)/);
});

test('chrome is dropped: script, style, svg, nav and the on-this-page list', () => {
  const out = md(`<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a></nav>
    <script>console.log('x')</script>
    <style>.a{color:red}</style>
    <svg><title>icon</title><path d="M0 0"/></svg>
    <p>Only this.</p>
  </main>`);
  assert.equal(out, 'Only this.');
});

test('aria-hidden decoration never reaches the text', () => {
  const out = md('<main><p><span aria-hidden="true">·</span>Real text</p></main>');
  assert.equal(out, 'Real text');
});

test('the FAQ accordions are flattened, so the answers are readable', () => {
  /* A crawler reading only what is visible gets the questions and none of the
     answers. On this site that is most of /faq and the tail of every guide. */
  const out = md('<main><details><summary>Is it covered by MSP?</summary><p>No. MSP does not cover private counselling.</p></details></main>');
  assert.equal(out, '**Is it covered by MSP?**\n\nNo. MSP does not cover private counselling.');
});

test('tables keep their shape', () => {
  const out = md('<main><table><tr><th>Service</th><th>Fee</th></tr><tr><td>Individual</td><td>$150</td></tr></table></main>');
  assert.equal(out, '| Service | Fee |\n| --- | --- |\n| Individual | $150 |');
});

test('lists keep their markers and nest', () => {
  const out = md('<main><ul><li>One</li><li>Two<ul><li>Inner</li></ul></li></ul><ol><li>First</li><li>Second</li></ol></main>');
  assert.match(out, /^- One\n- Two/m);
  assert.match(out, /- Inner/);
  assert.match(out, /^1\. First\n2\. Second/m);
});

test('image alt text survives — often the only words a diagram has', () => {
  const out = md('<main><figure><img src="/img/a.svg" alt="How a claim moves"><figcaption>The route a claim takes</figcaption></figure></main>');
  assert.match(out, /!\[How a claim moves\]\(https:\/\/www\.westpeakwellness\.com\/img\/a\.svg\)/);
  assert.match(out, /The route a claim takes/);
});

test('a streamed page yields its content, not the word Loading', () => {
  /* WHAT THE FIRST VERSION DID. /pricing puts the fee table behind a Suspense
     boundary; the first bytes carry a fallback and the real content arrives
     later in the same response, parked in a hidden div. The twin for the fee
     page was 711 bytes and said "Loading current fees…". */
  const html = `<main><!--$?--><template id="B:0"></template><p>Loading <!-- -->current fees<!-- -->…</p><!--/$--></main>
    <div hidden id="S:0"><h2>Session fees</h2><p>Individual sessions are $150.</p></div>`;
  const out = md(html);
  assert.doesNotMatch(out, /Loading/);
  assert.match(out, /## Session fees/);
  assert.match(out, /Individual sessions are \$150\./);
});

test('React comment separators do not leave gaps or artefacts', () => {
  const out = md('<main><p>Westpeak<!-- --> <!-- -->Wellness</p></main>');
  assert.equal(out, 'Westpeak Wellness');
});

test('entities are decoded once, and only once', () => {
  assert.equal(decodeEntities('Fees &amp; insurance'), 'Fees & insurance');
  assert.equal(decodeEntities('&#8212;'), '—');
  assert.equal(decodeEntities('&notareal;'), '&notareal;');
  assert.equal(md('<main><p>Fees &amp; insurance &mdash; in full</p></main>'), 'Fees & insurance — in full');
});

test('Markdown syntax in the copy is escaped rather than executed', () => {
  const out = md('<main><p>Use * for a footnote and _ for emphasis [like this]</p></main>');
  assert.match(out, /\\\*/);
  assert.match(out, /\\_/);
  assert.match(out, /\\\[like this\\\]/);
});

test('the front-matter fields come from the page, not from a guess', () => {
  const meta = metaOf(`<html><head><title>How Much Does Counselling Cost in BC? | Westpeak Wellness</title>
    <meta name="description" content="Every fee in full.">
    <link rel="canonical" href="https://www.westpeakwellness.com/pricing"></head>
    <body><script type="application/ld+json">{"dateModified":"2026-09-17"}</script></body></html>`);
  assert.equal(meta.title, 'How Much Does Counselling Cost in BC?');
  assert.equal(meta.description, 'Every fee in full.');
  assert.equal(meta.canonical, 'https://www.westpeakwellness.com/pricing');
  assert.equal(meta.modified, '2026-09-17');
});

test('a page with no main falls back to the body rather than to nothing', () => {
  assert.match(md('<html><body><p>Still readable.</p></body></html>'), /Still readable\./);
});

test('unbalanced markup degrades to text instead of throwing', () => {
  assert.doesNotThrow(() => md('<main><p>One<div><span>Two</main>'));
});

test('the language comes from the document, not from a guess', () => {
  const pa = metaOf('<html lang="pa"><head><title>x</title></head><body></body></html>');
  assert.equal(pa.lang, 'pa');

  /* scripts/html-lang.mjs writes the language after the build, and 48 of the
     295 pages are Punjabi or Tagalog documents. A page that does not say is
     English, which is what the site is. */
  const none = metaOf('<html><head><title>x</title></head><body></body></html>');
  assert.equal(none.lang, 'en-CA');
});

test('a translated page reports what it is a translation of', () => {
  const meta = metaOf(`<html lang="pa"><head><title>x</title>
    <link rel="alternate" hreflang="en-CA" href="https://www.westpeakwellness.com/guides/panic">
    <link rel="alternate" hreflang="pa" href="https://www.westpeakwellness.com/punjabi/guides/panic">
    <link rel="alternate" hreflang="x-default" href="https://www.westpeakwellness.com/guides/panic">
    <link rel="alternate" type="application/rss+xml" href="/feed.xml">
  </head><body></body></html>`);

  assert.equal(meta.alternates.length, 3, 'the feed link has no hreflang and is not a translation');
  assert.deepEqual(
    meta.alternates.map((a) => a.lang).sort(),
    ['en-CA', 'pa', 'x-default'],
  );
});

test('a page with no translations reports none rather than an empty pair', () => {
  const meta = metaOf('<html lang="en-CA"><head><title>x</title><link rel="alternate" type="application/rss+xml" href="/feed.xml"></head><body></body></html>');
  assert.deepEqual(meta.alternates, []);
});

/* ------------------------------------------------------------------ paths */

test('a .md path resolves to the page it shadows', () => {
  assert.equal(normalise('/guides/stress-leave-bc.md'), '/guides/stress-leave-bc');
  assert.equal(normalise('/guides/stress-leave-bc'), '/guides/stress-leave-bc');
  assert.equal(normalise('/'), '/');
  assert.equal(normalise('/about/'), '/about');
});

test('the private routes have no Markdown twin', () => {
  for (const p of ['/admin', '/admin/inbox', '/signin', '/client-portal', '/api/cron/x', '/reset']) {
    assert.equal(normalise(p), null, `${p} should have no twin`);
  }
});

test('nothing that is not a plain path on this site is accepted', () => {
  for (const p of ['', 'guides', '//evil.example.com', '/a/../../etc/passwd', '/a?b=c', '/a#b', 'https://evil.example.com', '/a\\b']) {
    assert.equal(normalise(p), null, `${JSON.stringify(p)} should be refused`);
  }
});
