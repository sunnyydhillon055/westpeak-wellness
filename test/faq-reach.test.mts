import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faqs, faqsInGroup, FAQ_GROUPS } from '../lib/faq.ts';
import { practitioners } from '../lib/practitioners.ts';

/* The FAQ feeds /faq's FAQPage schema and /answers. Its answers about where
 * and in what language are built from the roster; these pin that they exist,
 * say what the roster says, and render somewhere on the page. */

const answer = (q: string) => faqs.find((f) => f.q === q)?.a ?? '';

test('the FAQ answers Tagalog, Alberta and the rest of Canada, and online or in person', () => {
  const all = faqs.map((f) => `${f.q} ${f.a}`).join(' ');
  assert.match(all, /Tagalog/);
  assert.match(all, /in person/);
  assert.ok(answer('Can I book if I live in Alberta or elsewhere in Canada?'));
});

test('the Tagalog answer names exactly the accepting Tagalog speakers', () => {
  const speakers = practitioners.filter((p) => p.acceptingNewClients && p.languages.some((l) => l.tag === 'tl'));
  const a = answer('Do you offer sessions in Tagalog?');
  for (const p of speakers) assert.ok(a.includes(p.name), `${p.name} missing`);
  for (const p of practitioners.filter((x) => !speakers.includes(x))) assert.ok(!a.includes(p.name), `${p.name} should not be named`);
});

test('Canada-wide reach is only claimed when someone accepting holds it', () => {
  const wide = practitioners.some((p) => p.acceptingNewClients && p.reach === 'canada');
  assert.equal(/anywhere in Canada/.test(answer('Are you taking new clients?')), wide);
});

test('the online-only answer states the consultation length and no office', () => {
  const a = answer('Is the free consultation online or in person, and how do I join?');
  assert.match(a, /\d+-minute consultation/);
  assert.match(a, /no office/);
});

test('the founder is never named in the FAQ', () => {
  const founder = practitioners.find((p) => !p.placePages)!;
  assert.ok(!faqs.some((f) => f.a.includes(founder.name)));
});

test('every question renders in a group', () => {
  const shown = FAQ_GROUPS.flatMap((g) => faqsInGroup(g.key)).length;
  assert.equal(shown, faqs.length);
});
