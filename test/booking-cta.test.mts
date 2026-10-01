import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingCtaFor, bookingFor, counsellorForLanguage, serviceNoun } from '../lib/booking-cta.ts';
import { practitioners } from '../lib/practitioners.ts';
import { services } from '../lib/services.ts';
import { audiences } from '../lib/audiences.ts';
import { resources } from '../lib/resources.ts';
import { comparisons } from '../lib/comparisons.ts';
import { pairs as cityServices } from '../lib/city-services.ts';
import { site } from '../lib/site.ts';

/* THE PROMISE THESE EXIST FOR
 *
 * A page written for Punjabi or Tagalog speakers now sends its reader to one
 * counsellor's calendar with "a Punjabi-speaking counsellor" on the button.
 * Two ways that goes wrong quietly: the roster changes and the tag resolves
 * to nobody, so the page promises a language no calendar delivers; or the
 * resolution picks somebody who speaks the language but is not taking
 * clients, which on this roster is the founder — whose name must not reach
 * these pages at all. Both are data questions, so both are tested here
 * rather than noticed on the live site. */

const tagged = {
  services: services.filter((s) => s.language),
  audiences: audiences.filter((a) => a.language),
  resources: resources.filter((r) => r.language),
  comparisons: comparisons.filter((c) => c.language),
};
type Tagged = { slug: string; language?: string; service?: string };
const allTagged: Tagged[] = [...tagged.services, ...tagged.audiences, ...tagged.resources, ...tagged.comparisons];

test('every page that carries a language tag resolves to a counsellor who can take the booking', () => {
  /* A page about one service (the couples page) is held to the service as
     well, and is allowed to resolve to nobody; that case is the next test. */
  for (const s of allTagged.filter((t) => !t.service)) {
    const who = counsellorForLanguage(s.language!);
    assert.ok(who, `${s.slug} is tagged ${s.language} and nobody accepting speaks it`);
    assert.equal(who!.acceptingNewClients, true, `${s.slug}: ${who!.slug} is not accepting`);
    assert.equal(who!.bookable, true, `${s.slug}: ${who!.slug} has no online calendar`);
    assert.ok(who!.languages.some((l) => l.tag === s.language), `${s.slug}: ${who!.slug} does not speak ${s.language}`);
  }
});

test('a tagged page books with someone who speaks the language AND offers the service, or with nobody', () => {
  for (const t of allTagged) {
    const cta = bookingCtaFor({ language: t.language, service: t.service, fallback: 'fallback' });
    const slug = new URLSearchParams(cta.href.split('?')[1] ?? '').get('with');
    if (!slug) {
      assert.equal(cta.href, site.bookingPath, `${t.slug}: no counsellor, so the practice calendar`);
      assert.equal(cta.label, 'fallback', `${t.slug}: no counsellor, so the page label`);
      continue;
    }
    const who = practitioners.find((p) => p.slug === slug)!;
    assert.ok(who.acceptingNewClients && who.bookable, `${t.slug}: ${slug} cannot take the booking`);
    assert.ok(who.languages.some((l) => l.tag === t.language), `${t.slug}: ${slug} does not speak ${t.language}`);
    if (t.service) assert.ok(who.services.includes(t.service), `${t.slug}: ${slug} does not offer ${t.service}`);
  }
});

test('the Punjabi-speaking couples page does not send couples to a counsellor who offers no couples work', () => {
  const a = audiences.find((x) => x.slug === 'punjabi-speaking-couples')!;
  assert.equal(a.service, 'couples-therapy');
  const fits = practitioners.some((p) => p.acceptingNewClients && p.bookable
    && p.languages.some((l) => l.tag === 'pa') && p.services.includes('couples-therapy'));
  const cta = bookingCtaFor({ language: a.language, service: a.service, fallback: 'x' });
  /* Today nobody accepting does both, so the page falls back. When the
     roster changes this follows it rather than failing. */
  assert.equal(cta.href === site.bookingPath, !fits);
});

test('the English copy says Punjabi couples and EMDR are available only when someone accepting offers them', () => {
  const offers = (service: string) => practitioners.some((p) => p.acceptingNewClients && p.bookable
    && p.languages.some((l) => l.tag === 'pa') && p.services.includes(service));
  const pa = services.find((s) => s.slug === 'punjabi-counselling')!;
  if (!offers('couples-therapy')) {
    assert.doesNotMatch(pa.directAnswer, /couples[^.]*available in Punjabi/i);
    const q = cityServices.find((c) => c.city === 'surrey' && c.service === 'couples-therapy')!
      .faqs.find((f) => /in Punjabi/.test(f.q))!;
    assert.doesNotMatch(q.a, /^Yes/, 'Surrey couples FAQ says yes to Punjabi couples sessions');
  }
  if (!offers('emdr-therapy')) {
    const q = cityServices.find((c) => c.city === 'surrey' && c.service === 'emdr-therapy')!
      .faqs.find((f) => /EMDR be done in Punjabi/.test(f.q))!;
    assert.doesNotMatch(q.a, /^Yes/, 'Surrey EMDR FAQ says yes to EMDR in Punjabi');
  }
});

/* bookingFor returns { href, labelSuffix, slug } since wf/services and
   wf/language were merged (1 Oct 2026); this test asserts where it points. */
const hs = (t: { href: string; slug?: string }) => ({ href: t.href, ...(t.slug ? { slug: t.slug } : {}) });

test('bookingFor narrows /book only to someone who fits', () => {
  assert.deepEqual(hs(bookingFor('individual-therapy', 'pa')), { href: `${site.bookingPath}?with=savneet-singh`, slug: 'savneet-singh' });
  assert.deepEqual(hs(bookingFor('couples-therapy', 'tl')), { href: `${site.bookingPath}?with=camille-granda`, slug: 'camille-granda' });
  assert.deepEqual(hs(bookingFor(undefined, 'tl')), { href: `${site.bookingPath}?with=camille-granda`, slug: 'camille-granda' });
  /* Nobody accepting offers couples or EMDR in Punjabi. */
  assert.deepEqual(hs(bookingFor('couples-therapy', 'pa')), { href: site.bookingPath });
  assert.deepEqual(hs(bookingFor('emdr-therapy', 'pa')), { href: site.bookingPath });
  /* Two counsellors offer individual work: the reader chooses on /book. */
  assert.deepEqual(hs(bookingFor('individual-therapy')), { href: site.bookingPath });
  /* One offers EMDR. */
  assert.deepEqual(hs(bookingFor('emdr-therapy')), { href: `${site.bookingPath}?with=camille-granda`, slug: 'camille-granda' });
  assert.deepEqual(hs(bookingFor(undefined)), { href: site.bookingPath });
  for (const svc of [undefined, 'individual-therapy', 'couples-therapy', 'emdr-therapy', 'punjabi-counselling']) {
    for (const lang of [undefined, 'pa', 'tl'] as const) {
      assert.notEqual(bookingFor(svc, lang).slug, 'aman-bains-dhillon');
    }
  }
});

test('the language pages narrow /book to that counsellor and name the language, never the person', () => {
  const pa = bookingCtaFor({ language: 'pa', fallback: 'x' });
  const tl = bookingCtaFor({ language: 'tl', fallback: 'x' });
  assert.equal(pa.href, `${site.bookingPath}?with=savneet-singh`);
  assert.equal(tl.href, `${site.bookingPath}?with=camille-granda`);
  assert.equal(pa.label, 'Book a free consultation with a Punjabi-speaking counsellor');
  assert.equal(tl.label, 'Book a free consultation with a Tagalog-speaking counsellor');
  for (const p of practitioners) {
    for (const part of p.name.split(' ')) {
      assert.doesNotMatch(pa.label + tl.label, new RegExp(part, 'i'), `a counsellor's name reached a button: ${part}`);
    }
  }
});

test('the founder is never the counsellor a language page books with', () => {
  /* She speaks Punjabi and is first on the roster; only the accepting and
     bookable filters keep her out, so this is the test that they stay. */
  for (const tag of ['pa', 'tl']) {
    const who = counsellorForLanguage(tag);
    assert.notEqual(who?.slug, 'aman-bains-dhillon', `${tag} resolved to the founder`);
  }
});

test('without a language tag, or with one nobody speaks, the page keeps its own label and the practice calendar', () => {
  const plain = bookingCtaFor({ fallback: 'Book a free consultation in Kelowna' });
  assert.equal(plain.href, site.bookingPath);
  assert.equal(plain.label, 'Book a free consultation in Kelowna');
  const nobody = bookingCtaFor({ language: 'xx', fallback: 'Book a free consultation for EMDR therapy' });
  assert.equal(nobody.href, site.bookingPath);
  assert.equal(nobody.label, 'Book a free consultation for EMDR therapy');
});

test('only the pages written for a language carry the tag', () => {
  assert.deepEqual(tagged.services.map((s) => `${s.slug}:${s.language}`).sort(),
    ['punjabi-counselling:pa', 'tagalog-counselling:tl']);
  assert.deepEqual(tagged.resources.map((r) => `${r.slug}:${r.language}`).sort(),
    ['counselling-in-punjabi-what-the-words-mean:pa', 'counselling-in-tagalog-what-the-words-mean:tl']);
  assert.deepEqual(tagged.comparisons.map((c) => `${c.slug}:${c.language}`).sort(),
    ['therapy-in-punjabi-vs-english:pa', 'therapy-in-tagalog-vs-english:tl']);
  for (const a of tagged.audiences) {
    assert.match(`${a.metaDescription} ${a.shortAnswer} ${a.lede}`, a.language === 'pa' ? /punjabi/i : /tagalog/i,
      `${a.slug} is tagged ${a.language} but its own summary never says so`);
  }
});

test('every audience page names itself on its button, in a few words', () => {
  for (const a of audiences) {
    assert.ok(a.ctaFor && /^(for|about) /.test(a.ctaFor), `${a.slug}: ctaFor "${a.ctaFor}"`);
    assert.ok(a.ctaFor.split(' ').length <= 7, `${a.slug}: ctaFor is too long for a button`);
  }
});

test('a service name reads as a noun on a button, initialisms kept', () => {
  assert.equal(serviceNoun('EMDR Therapy'), 'EMDR therapy');
  assert.equal(serviceNoun('Couples Therapy'), 'couples therapy');
});
