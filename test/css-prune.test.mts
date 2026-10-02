import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruneCss, requiredNames, splitSelectors, tokensOf, topLevel } from '../scripts/css-prune.mjs';

/* The first-paint CSS block keeps every rule the document can match — item 301. */

const has = (names: string[]) => (n: string) => names.includes(n);

test('a selector is dropped only when a class or id it requires appears nowhere', () => {
  const css = '.card{color:red}.admin-table td{padding:0}#main{margin:0}#nope{margin:1px}';
  assert.equal(pruneCss(css, has(['card', 'main'])), '.card{color:red}#main{margin:0}');
});

test('element, attribute, :root and pseudo-only selectors are always kept', () => {
  const css = ':root{--x:1}body{margin:0}a[href^="tel:"]{color:blue}::selection{color:red}[data-theme=dark] p{color:#fff}';
  assert.equal(pruneCss(css, has([])), css);
});

test('a selector list keeps only its usable selectors, and a fully unusable rule disappears', () => {
  assert.equal(pruneCss('.a,.b,h1{x:1}', has(['b'])), '.b,h1{x:1}');
  assert.equal(pruneCss('.a,.c{x:1}', has([])), '');
});

test(':not(), :is(), :where() and :has() arguments never decide, and escapes keep the selector', () => {
  assert.deepEqual(requiredNames('.prose a:not(.btn):not(.chip)'), ['prose']);
  assert.deepEqual(requiredNames(':is(.x,.y) .z'), ['z']);
  assert.deepEqual(requiredNames('a[href$=".pdf"]'), []);
  assert.equal(requiredNames('.md\\:flex'), null);
  assert.equal(pruneCss('.prose a:not(.btn){x:1}', has(['prose'])), '.prose a:not(.btn){x:1}');
});

test('@media and @supports are pruned inside and dropped when empty; @font-face and @keyframes are kept whole', () => {
  const css =
    '@font-face{font-family:F;src:url(a.woff2)}@keyframes spin{0%{opacity:0}to{opacity:1}}' +
    '@media (max-width:600px){.card{x:1}.gone{y:2}}@supports (display:grid){.gone{z:3}}@media print{body{a:b}}';
  assert.equal(
    pruneCss(css, has(['card'])),
    '@font-face{font-family:F;src:url(a.woff2)}@keyframes spin{0%{opacity:0}to{opacity:1}}' +
      '@media (max-width:600px){.card{x:1}}@media print{body{a:b}}',
  );
});

test('strings containing braces, commas and dots do not confuse the parser', () => {
  const css = '.q:before{content:"{.x, }"}.r{content:\'}\'}';
  assert.equal(pruneCss(css, has(['q', 'r'])), css);
  assert.deepEqual(splitSelectors('a[title="a,b"], .c'), ['a[title="a,b"]', '.c']);
  assert.equal(topLevel('@charset "utf-8";.a{b:c}').length, 2);
});

test('tokens are identifier runs, so a hyphenated class in markup or JS is found whole', () => {
  const t = tokensOf('<div class="btn btn--primary hero-photo">x</div> e.classList.add("is-open")');
  for (const n of ['btn', 'btn--primary', 'hero-photo', 'is-open']) assert.ok(t.has(n), n);
  assert.ok(!t.has('btn--'));
});
