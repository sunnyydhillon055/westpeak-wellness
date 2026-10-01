import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getAudience, pasteText } from '../lib/audiences.ts';
import { hrGlance } from '../lib/audiences-more4.ts';
import { resources } from '../lib/resources.ts';
import { LOOKING, WHERE, TIMING, EMPLOYER, choicesComplete, lookingFromAbout } from '../lib/enquiry-fields.ts';
import { hasEnoughDetail } from '../lib/sentences.ts';
import { REPLY_TEMPLATES } from '../lib/reply-templates.ts';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';
import { site } from '../lib/site.ts';
// @ts-expect-error -- plain .mjs shared with next.config.mjs; no declaration file
import { REDIRECTS } from '../lib/redirects.mjs';

/* /for/employers-and-hr, 1 Oct 2026: HR is offered email rather than a
   client consultation, the manager and the broker each get something to
   send, the teams resource folds into this page, and "at a glance" is built
   from the catalogue and the roster. */

const a = getAudience('employers-and-hr')!;
const block = (h2: string) => a.pasteBlocks!.find((b) => b.h2 === h2)!;

/* ---- the employer enquiry --------------------------------------------- */

test('an employer enquiry is complete without WHERE or TIMING', () => {
  assert.ok(LOOKING.some((o) => o.value === EMPLOYER));
  assert.equal(choicesComplete(EMPLOYER, '', ''), true);
  assert.equal(choicesComplete(EMPLOYER, 'nonsense', 'nonsense'), true, 'ignored, not validated');
});

test('every other enquiry still needs all three choices from the lists', () => {
  assert.equal(choicesComplete('individual', '', ''), false);
  assert.equal(choicesComplete('individual', WHERE[0].value, ''), false);
  assert.equal(choicesComplete('individual', WHERE[0].value, TIMING[0].value), true);
  assert.equal(choicesComplete('made-up', WHERE[0].value, TIMING[0].value), false);
  assert.equal(choicesComplete('', '', ''), false);
});

test('the 20-word floor applies to an employer enquiry as to any other', () => {
  /* The route checks hasEnoughDetail before the choices, whatever LOOKING is. */
  assert.equal(hasEnoughDetail('Hello. Info please.'), false);
  const src = readFileSync('lib/inbound-submit.ts', 'utf8');
  assert.ok(src.indexOf("o.kind === 'enquiry' && !hasEnoughDetail(message)") < src.indexOf('choicesComplete(looking, where, timing)'));
});

test('an employer enquiry goes to info@ only, and drops where and timing', () => {
  const src = readFileSync('lib/inbound-submit.ts', 'utf8');
  /* One route decision since the batch-2 merge: an employer joins the lead
     case (info@ alone, no counsellor named in the acknowledgement). */
  assert.match(src, /const route = o\.kind === 'lead' \|\| isEmployer\s*\?\s*\{ to: \[site\.email\], cc: \[\] as string\[\]/);
  assert.match(src, /const where = isEmployer \? '' :/);
  assert.match(src, /const timing = isEmployer \? '' :/);
});

test('?about=employer preselects the employer choice; anything else preselects nothing', () => {
  assert.equal(lookingFromAbout('employer'), EMPLOYER);
  assert.equal(lookingFromAbout('couples'), 'couples');
  assert.equal(lookingFromAbout('bogus'), '');
  assert.equal(lookingFromAbout(null), '');
  const form = readFileSync('components/InboundForm.tsx', 'utf8');
  assert.match(form, /lookingFromAbout\(new URLSearchParams\(window\.location\.search\)\.get\('about'\)\)/);
  assert.doesNotMatch(form, /useSearchParams\(/, 'would take the static pages the form sits on out of static generation');
});

test('there is a draft reply for an employer, appended last', () => {
  const t = REPLY_TEMPLATES[REPLY_TEMPLATES.length - 1];
  assert.equal(t.key, 'employer');
  const body = t.body({ name: 'Pat Lee' } as never);
  assert.match(body, /^Hi Pat,/);
  assert.match(body, /not an EAP/);
  assert.doesNotMatch(body, /\b(evenings?|weekends?)\b|\d\s?(am|pm)\b/i);
});

/* ---- the page's actions ----------------------------------------------- */

test('the hero sends HR to email, and booking is offered on an employee’s behalf', () => {
  assert.equal(a.cta?.primary.href, '/contact?about=employer#form');
  assert.match(a.cta!.primary.label, /^Email the practice/);
  assert.equal(a.cta?.ghost?.href, '/book?utm_source=hr');
  assert.match(a.midCta.text, /a short exchange by email/);
  assert.ok(a.metaTitle.length <= 60, a.metaTitle);
  assert.match(a.metaTitle, /Workplace Mental Health Support/);
  assert.ok(a.metaDescription.replace(/&/g, '&amp;').length <= 158, a.metaDescription);
});

/* ---- the three copyable blocks ---------------------------------------- */

test('the manager’s note: about fifty neutral words, the three do-nots, the tagged link', () => {
  const b = block('If you are a manager: a note you can send one person');
  assert.equal(b.after, 'What a manager says, and what comes after');
  assert.ok(a.sections.some((s) => s.h2 === b.after));
  assert.deepEqual(b.donts, ['Do not ask what it is about.', 'Do not follow up on whether they booked.', 'Do not book for them.']);
  const words = b.text.split(/\s+/).length;
  assert.ok(words >= 40 && words <= 60, `${words} words`);
  assert.doesNotMatch(b.text, /\bE(F)?AP\b|\b(hours?|evenings?|weekends?)\b|\d\s?(am|pm)\b/i);
  assert.doesNotMatch(b.text, /\b(help|better|improve|recover|outcome)/i, 'no outcome language');
  assert.ok(pasteText(b, site.domain).endsWith(`${site.domain}/book?utm_source=hr`));
});

test('the broker email asks the three questions and links nowhere', () => {
  const b = block('An email to your broker before renewal');
  assert.equal(b.path, undefined);
  assert.ok(a.sections.some((s) => s.h2 === b.after));
  assert.match(b.text, /Registered Clinical Counsellors \(RCC\) and Canadian Certified Counsellors \(CCC\)/);
  assert.match(b.text, /yearly maximum/);
  assert.match(b.text, /what it would cost to add/);
  assert.equal(pasteText(b, site.domain), b.text);
});

test('the intranet paragraph no longer names a Canada-wide reach', () => {
  const b = block('Paste this into your benefits page');
  assert.doesNotMatch(b.text, /(anywhere|elsewhere) in Canada/);
  assert.match(b.text, /registration and insurance allow/);
});

/* ---- one employer page ------------------------------------------------- */

test('the teams resource 301s to the employer page and is no longer built', () => {
  const r = (REDIRECTS as { source: string; destination: string; permanent: boolean }[])
    .find((x) => x.source === '/resources/counselling-support-for-bc-teams');
  assert.deepEqual(r && [r.destination, r.permanent], ['/for/employers-and-hr', true]);
  assert.ok(!resources.some((x) => x.slug === 'counselling-support-for-bc-teams'));
  assert.ok(a.faqs.some((f) => /workshops/.test(f.q)), 'the workshops answer moved over');
  assert.match(JSON.stringify(a.sections), /Fraser Valley/);
  assert.doesNotMatch(JSON.stringify(a), /\bsolo\b|every plan|bookable that week/i);
});

/* ---- at a glance ------------------------------------------------------- */

test('at a glance is built from the catalogue and carries no hours or numbers it should not', () => {
  const g = hrGlance(FALLBACK_CATALOG);
  const terms = g.map((x) => x.term);
  for (const t of ['Who', 'Languages', 'First step', 'Fees', 'Payment', 'The receipt', 'Plan wording to look for', 'What the employer receives', 'What it is not', 'In a crisis']) {
    assert.ok(terms.includes(t), t);
  }
  const text = JSON.stringify(g);
  assert.match(g.find((x) => x.term === 'First step')!.detail, /^A free 30-minute consultation/);
  const ind = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!;
  assert.match(g.find((x) => x.term === 'Fees')!.detail, new RegExp(`\\$${ind.cents / 100}`));
  assert.doesNotMatch(text, /\b(evenings?|weekends?)\b|\d\s?(am|pm)\b/i);
  assert.doesNotMatch(text, /\d{5,}/, 'no registration number');
  assert.match(text, /9-8-8/);
});
