import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
// @ts-expect-error -- plain .mjs config; no declaration file
import nextConfig from '../next.config.mjs';
import { site } from '../lib/site.ts';

/* The embeddable stress-leave pay calculator, 15 Oct 2026: a framed copy for
   HR, union and benefits sites at /embed/stress-leave-pay-calculator, built
   in pages/ so app/layout.tsx (header, footer, phone bar, consent, analytics)
   never wraps it, noindex, and the only route another site may frame. */

const EMBED = 'pages/embed/stress-leave-pay-calculator.tsx';
const src = readFileSync(EMBED, 'utf8');
const calc = readFileSync('components/tools/LeavePayCalculator.tsx', 'utf8');
const toolPage = readFileSync('app/tools/stress-leave-pay-calculator/page.tsx', 'utf8');

/* Next's own matcher with the options its custom-route builder uses, so the
   test reads the rules the way the server does. Later rules win a shared key. */
const require = createRequire(import.meta.url);
const { getPathMatch } = require('next/dist/shared/lib/router/utils/path-match');
type Rule = { source: string; has?: unknown[]; headers: { key: string; value: string }[] };
const rules: Rule[] = await nextConfig.headers();
function headersFor(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rules) {
    if (r.has) continue; /* host-conditional rules: the Vercel preview hosts */
    if (!getPathMatch(r.source, { strict: true })(path)) continue;
    for (const h of r.headers) out[h.key.toLowerCase()] = h.value;
  }
  return out;
}

/* ---- framing is allowed on /embed/ and nowhere else ---------------------- */

test('the embed route may be framed by any site, and sends no X-Frame-Options', () => {
  const h = headersFor('/embed/stress-leave-pay-calculator');
  assert.match(h['content-security-policy'], /frame-ancestors \*(;|$)/);
  assert.doesNotMatch(h['content-security-policy'], /frame-ancestors 'none'/);
  assert.equal(h['x-frame-options'], undefined);
});

test('the embed route keeps every other security header', () => {
  const h = headersFor('/embed/stress-leave-pay-calculator');
  for (const key of ['strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy']) {
    assert.ok(h[key], `${key} missing on the embed route`);
  }
  assert.match(h['content-security-policy'], /default-src 'self'/);
  assert.match(h['content-security-policy'], /object-src 'none'/);
});

test('every other route still refuses to be framed', () => {
  for (const path of ['/about', '/tools/stress-leave-pay-calculator', '/book', '/admin', '/embedded', '/embed', '/resources/workplace-mental-health-bc']) {
    const h = headersFor(path);
    assert.match(h['content-security-policy'] ?? '', /frame-ancestors 'none'/, path);
    assert.equal(h['x-frame-options'], 'DENY', path);
  }
});

/* ---- noindex ------------------------------------------------------------- */

test('the embed route is noindex in the header and in the HTML', () => {
  assert.match(headersFor('/embed/stress-leave-pay-calculator')['x-robots-tag'], /^noindex\b/);
  assert.match(src, /<meta name="robots" content="noindex, follow" \/>/);
  /* and the indexable tool page is not caught by it */
  assert.match(headersFor('/tools/stress-leave-pay-calculator')['x-robots-tag'], /^index, follow/);
});

test('the embed route does not announce a Markdown twin it does not have', () => {
  assert.match(headersFor('/embed/stress-leave-pay-calculator')['link'], /<\/tools\/stress-leave-pay-calculator\.md>/);
});

/* ---- no site chrome ------------------------------------------------------ */

test('the embed page is outside app/, so the root layout never wraps it', () => {
  assert.ok(existsSync(EMBED));
  assert.ok(!existsSync('app/embed'), 'an app/embed route would render inside app/layout.tsx with the header and footer');
  /* the only pages/ route, besides the app and document shells */
  assert.ok(existsSync('pages/_app.tsx') && existsSync('pages/_document.tsx'));
});

test('the embed page imports none of the chrome, the roster or the counsellor cards', () => {
  const imports = src.split('\n').filter((l) => l.startsWith('import '));
  assert.ok(imports.length >= 5);
  for (const banned of ['Header', 'Footer', 'StickyBook', 'ConsentGate', 'Analytics', 'ToolShell', 'ToolCounsellors', 'CtaBand', 'BookLink', 'lib/practitioners', 'lib/tools', 'app/layout']) {
    assert.ok(!imports.some((l) => l.includes(banned)), `${banned} imported`);
  }
  assert.ok(!/lib\/practitioners|lib\/tools'/.test(calc), 'the calculator must not import large data modules');
});

test('the figures arrive as props from lib/benefit-figures.ts at build time', () => {
  assert.match(src, /export const getStaticProps/);
  assert.match(src, /eiSicknessMax\(\)/);
  assert.match(src, /embed=\{\{ origin \}\}/);
});

/* ---- the credit line ----------------------------------------------------- */

test('one visible credit line links the full calculator with descriptive anchor text', () => {
  assert.match(src, /export const TOOL_PATH = '\/tools\/stress-leave-pay-calculator'/);
  const credit = src.match(/<a href=\{`\$\{origin\}\$\{TOOL_PATH\}`\}[^>]*>([^<]+)<\/a>/);
  assert.ok(credit, 'credit link missing');
  const anchor = credit![1].trim().replace(/\s+/g, ' ');
  assert.match(anchor, /stress leave pay calculator/i);
  assert.ok(anchor.split(' ').length >= 4, 'anchor text should describe the page, not say "here"');
  assert.equal(site.domain, 'https://www.westpeakwellness.com');
});

test('in the frame, site links open a new tab and the booking and share buttons are left out', () => {
  assert.match(calc, /\{!embed && <ResultCta /);
  assert.match(calc, /target="_blank" rel="noopener"/);
  assert.ok(!/<Link href="\/(resources|guides)\//.test(calc), 'a bare Link would navigate the frame');
});

/* ---- the snippet on the indexable page ----------------------------------- */

test('the tool page carries the embed section with the iframe and its fallback link', () => {
  assert.match(toolPage, /<h2 id="embed">Embed this calculator on your site<\/h2>/);
  assert.match(toolPage, /const EMBED_URL = `\$\{site\.domain\}\/embed\/\$\{tool\.slug\}`/);
  assert.match(toolPage, /<iframe src="\$\{EMBED_URL\}"[^`]*title="BC stress leave pay calculator"/);
  assert.match(toolPage, /<p><a href="\$\{TOOL_URL\}">BC stress leave pay calculator<\/a> from Westpeak Wellness<\/p>/);
  assert.match(toolPage, /HR teams, union locals and benefits advisers/);
  /* the listener checks the sender, and the embed posts the same message type */
  assert.match(toolPage, /e\.origin==="\$\{site\.domain\}"/);
  assert.match(toolPage, /westpeak-embed-height/);
  assert.match(src, /HEIGHT_MESSAGE = 'westpeak-embed-height'/);
});
