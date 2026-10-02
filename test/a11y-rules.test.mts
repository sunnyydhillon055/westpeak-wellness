import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// @ts-expect-error -- plain .mjs shared with scripts/a11y-audit.mjs; no declaration file
import { resolveStreamed, untitledFrames, silentNewTabs } from '../scripts/a11y-rules.mjs';

test('a streamed boundary is swapped for its content, as the browser would', () => {
  const doc =
    '<main><h2>x</h2><!--$?--><template id="B:0"></template><p>Loading</p><!--/$--></main>' +
    '<div hidden id="S:0"><h1>Book</h1><div>inner</div></div><script>$RC=function(){};$RC("B:0","S:0")</script>';
  const out = resolveStreamed(doc);
  assert.match(out, /<main><h2>x<\/h2><h1>Book<\/h1><div>inner<\/div><\/main>/);
  assert.doesNotMatch(out, /Loading|hidden id="S:0"/);
});

test('nested and out-of-order boundaries all resolve', () => {
  const doc =
    '<main><!--$?--><template id="B:0"></template>a<!--/$--></main>' +
    '<div hidden id="S:0"><h1>T</h1><!--$?--><template id="B:1"></template>b<!--/$--></div><script>$RC("B:0","S:0")</script>' +
    '<div hidden id="S:1"><p>deep</p></div><script>$RC("B:1","S:1")</script>';
  /* Emptied script tags are left behind; the audit strips scripts anyway. */
  assert.equal(resolveStreamed(doc).replaceAll('<script></script>', ''), '<main><h1>T</h1><p>deep</p></main>');
});

test('a document with nothing streamed is unchanged', () => {
  const doc = '<main><h1>Static</h1></main>';
  assert.equal(resolveStreamed(doc), doc);
});

test('a frame needs a non-empty title', () => {
  assert.equal(untitledFrames('<iframe src="x" title="Booking calendar"></iframe>').length, 0);
  assert.equal(untitledFrames('<iframe src="x"></iframe>').length, 1);
  assert.equal(untitledFrames('<iframe src="x" title=" "></iframe>').length, 1);
});

test('a link that opens a new tab must say so, in text, aria-label or an image alt', () => {
  assert.deepEqual(silentNewTabs('<a href="x" target="_blank" rel="noopener">BCACC register</a>'), ['BCACC register']);
  assert.deepEqual(silentNewTabs('<a href="x" target="_blank">BCACC register<span class="sr-only"> (opens in a new tab)</span></a>'), []);
  assert.deepEqual(silentNewTabs('<a href="x" target="_blank" aria-label="Instagram, opens in a new tab"><svg></svg></a>'), []);
  assert.deepEqual(silentNewTabs('<a href="x" target="_blank"><img src="a.svg" alt="A diagram"></a>'), ['A diagram']);
  assert.deepEqual(silentNewTabs('<a href="x">Same tab</a>'), []);
});

test('the shared components on the money routes say "new tab"', () => {
  for (const f of ['components/Footer.tsx', 'components/SchedulerEmbed.tsx', 'components/Figure.tsx', 'app/contact/page.tsx', 'app/book/page.tsx']) {
    const src = readFileSync(f, 'utf8');
    const blanks = (src.match(/target="_blank"/g) || []).length;
    const said = (src.match(/new tab/g) || []).length;
    assert.ok(said >= blanks, `${f}: ${blanks} target=_blank links, ${said} mentions of "new tab"`);
  }
});

test('the audit requests the routes that leave no .html', () => {
  const src = readFileSync('scripts/a11y-audit.mjs', 'utf8');
  for (const r of ['/book', '/book?with=camille-granda', '/book?with=savneet-singh', '/pricing', '/contact', '/client-portal', '/search', '/signin', '/forgot', '/reset', '/one-pager-sent']) {
    assert.ok(src.includes(`'${r}'`), r);
  }
});

test('the accessibility statement does not claim "every page" for the automated checks', () => {
  const src = readFileSync('lib/policies.ts', 'utf8');
  assert.doesNotMatch(src, /checked automatically on every deploy, every page/);
  assert.match(src, /Sessions in Tagalog/);
  assert.match(src, /\(\/tagalog-counselling\)/);
});
