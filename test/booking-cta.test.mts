import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { bookingCtaFor, bookingFor, counsellorForLanguage, counsellorsInProvince, serviceNoun } from '../lib/booking-cta.ts';
import { practitioners, insuredProvinces, vancouverToday } from '../lib/practitioners.ts';
import { guides } from '../lib/guides.ts';
import { services } from '../lib/services.ts';
import { audiences } from '../lib/audiences.ts';
import { resources } from '../lib/resources.ts';
import { comparisons } from '../lib/comparisons.ts';
import { pairs as cityServices } from '../lib/city-services.ts';
import { site } from '../lib/site.ts';
import { depthServices } from '../lib/depth-services.ts';

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
    const slug = new URLSearchParams(cta.href.split('#')[0]!.split('?')[1] ?? '').get('with');
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
    /* The two body-copy promises round 1 #20 left behind (1 Oct 2026). */
    const depth = depthServices['services/punjabi-counselling'].flatMap((x) => x.body ?? []).join(' ');
    assert.doesNotMatch(depth, /couples work is available in Punjabi/i, 'Punjabi service page promises Punjabi couples work');
    const forPa = audiences.find((a) => a.slug === 'punjabi-speaking-couples')!;
    assert.doesNotMatch(`${forPa.metaDescription} ${forPa.shortAnswer} ${forPa.opening.join(' ')}`,
      /Couples counselling in Punjabi|Sessions run in Punjabi, English, or moving/i,
      '/for/punjabi-speaking-couples promises couples sessions in Punjabi');
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
  assert.deepEqual(hs(bookingFor('individual-therapy', 'pa')), { href: `${site.bookingPath}?with=savneet-singh#calendar`, slug: 'savneet-singh' });
  assert.deepEqual(hs(bookingFor('couples-therapy', 'tl')), { href: `${site.bookingPath}?with=camille-granda&for=couples#calendar`, slug: 'camille-granda' });
  assert.deepEqual(hs(bookingFor(undefined, 'tl')), { href: `${site.bookingPath}?with=camille-granda#calendar`, slug: 'camille-granda' });
  /* Nobody accepting offers couples or EMDR in Punjabi. */
  assert.deepEqual(hs(bookingFor('couples-therapy', 'pa')), { href: site.bookingPath });
  assert.deepEqual(hs(bookingFor('emdr-therapy', 'pa')), { href: site.bookingPath });
  /* Two counsellors offer individual work: the reader chooses on /book. */
  assert.deepEqual(hs(bookingFor('individual-therapy')), { href: site.bookingPath });
  /* One offers EMDR. */
  assert.deepEqual(hs(bookingFor('emdr-therapy')), { href: `${site.bookingPath}?with=camille-granda#calendar`, slug: 'camille-granda' });
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
  assert.equal(pa.href, `${site.bookingPath}?with=savneet-singh#calendar`);
  assert.equal(tl.href, `${site.bookingPath}?with=camille-granda#calendar`);
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

/* ---------- wf/guide-templates-next-step, 1 Oct 2026 ---------- */

const read = (p: string) => readFileSync(join(import.meta.dirname, '..', p), 'utf8');

test('#218 a province narrows /book to the one counsellor insured there, or to nobody', () => {
  const ab = counsellorsInProvince('AB');
  for (const p of ab) {
    assert.equal(p.acceptingNewClients, true);
    assert.equal(p.bookable, true);
    assert.ok(insuredProvinces(p, vancouverToday()).includes('AB'), `${p.slug} is not insured for Alberta`);
  }
  const t = bookingCtaFor({ province: 'AB', fallback: 'Book' });
  if (ab.length === 1) assert.equal(t.href, `${site.bookingPath}?with=${ab[0]!.slug}#calendar`);
  else assert.equal(t.href, site.bookingPath);
  assert.equal(t.label, 'Book', 'the label never names a person');
  assert.equal(bookingFor(undefined, undefined, 'ZZ').href, site.bookingPath, 'a province nobody is insured in keeps the practice calendar');
  for (const s of ['counselling-coverage-in-alberta', 'how-to-check-a-counsellor-in-alberta']) {
    const r = resources.find((x) => x.slug === s)!;
    assert.equal(bookingCtaFor({ language: r.language, province: r.province, fallback: 'x' }).href, t.href, `${s} does not book Alberta`);
  }
  /* BC-only counsellors never reach an Alberta button. */
  const bcOnly = practitioners.filter((p) => !insuredProvinces(p, vancouverToday()).includes('AB')).map((p) => p.slug);
  for (const s of bcOnly) assert.ok(!t.href.includes(s), `${s} is BC-only`);
});

/* Guides about one counsellor's work must say so, or their buttons open the
   practice-wide calendar and spend a consultation on a mismatch. The one
   exemption is a general guide whose first service link is an example. */
const SERVICE_LINK_EXEMPT: Record<string, string> = {
  'is-online-therapy-as-effective-as-in-person': 'about video therapy in general; EMDR is linked as one example of what works online',
};

test('#232 any guide whose first service link is couples, EMDR or family declares its service', () => {
  for (const g of guides) {
    const first = g.related.find((r) => r.href.startsWith('/services/'))?.href.slice('/services/'.length);
    if (!first || !['couples-therapy', 'emdr-therapy', 'family-counselling'].includes(first)) continue;
    if (SERVICE_LINK_EXEMPT[g.slug]) continue;
    assert.equal(g.service, first, `${g.slug} links /services/${first} first but declares service ${g.service}`);
  }
  for (const k of Object.keys(SERVICE_LINK_EXEMPT)) assert.ok(guides.some((g) => g.slug === k), `exempt ${k} is not a guide`);
});

test('#232 a guide or comparison with a service books someone who offers it', () => {
  const withService = [...guides, ...comparisons].filter((x) => x.service);
  assert.ok(withService.length >= 10, `only ${withService.length} pages declare a service`);
  for (const x of withService) {
    const t = bookingFor(x.service, (x as { language?: string }).language);
    if (t.slug) {
      const p = practitioners.find((q) => q.slug === t.slug)!;
      assert.ok(p.services.includes(x.service!), `${x.slug} books ${p.slug}, who does not offer ${x.service}`);
      assert.equal(p.acceptingNewClients, true);
    }
  }
  assert.match(read('app/guides/[slug]/page.tsx'), /bookingCtaFor\(\{ service: g\.service,/);
  assert.match(read('app/compare/[slug]/page.tsx'), /bookingCtaFor\(\{ language: c\.language, service: c\.service,/);
});

test('#232 the approach buttons are counted and the band follows the page calendar', () => {
  const a = read('app/approaches/[slug]/page.tsx');
  assert.match(a, /<BookLink location="hero-approach"/);
  assert.match(a, /<BookLink location="mid-approach"/);
  assert.doesNotMatch(a, /<Link[^>]*href=\{site\.bookingPath\}/);
  assert.match(a, /<CtaBand\s+bookHref=\{cta\.href\}/);
});
