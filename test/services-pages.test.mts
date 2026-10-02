import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { bookingFor, bookingCtaFor } from '../lib/booking-cta.ts';
import { practitioners } from '../lib/practitioners.ts';
import { services, getService } from '../lib/services.ts';
import { extraSections, getExtra } from '../lib/depth.ts';
import { guides } from '../lib/guides.ts';
import { comparisons } from '../lib/comparisons.ts';
import { resources } from '../lib/resources.ts';
import { audiences, getAudience, pasteText } from '../lib/audiences.ts';
import { getLocation } from '../lib/locations.ts';
import { CONDITION_UPLINK } from '../lib/city-services.ts';
import { headingId } from '../lib/toc.ts';
import { site } from '../lib/site.ts';
import { FALLBACK_CATALOG, fallbackFee } from '../lib/cliniko-catalog.ts';
// @ts-expect-error -- a plain .mjs script with no type declarations
import { scanTree, strayPrices, cataloguePrices } from '../scripts/price-drift.mjs';

/* ---- which calendar a service books into (1 Oct 2026) ------------------ */

test('services only one counsellor offers book with her; shared ones keep the open calendar', () => {
  const camille = `${site.bookingPath}?with=camille-granda`;
  for (const slug of ['couples-therapy', 'emdr-therapy', 'family-counselling']) {
    assert.equal(bookingFor(slug).href, `${camille}${slug === 'couples-therapy' ? '&for=couples' : ''}#calendar`, slug);
    assert.equal(bookingFor(slug).labelSuffix, '', `${slug}: a service link never names anyone`);
  }
  assert.equal(bookingFor('individual-therapy').href, site.bookingPath);
  assert.equal(bookingFor('individual-therapy').slug, undefined);
  assert.equal(bookingFor(undefined).href, site.bookingPath);
});

test('a language still wins over the service, and keeps its label', () => {
  const pa = bookingFor('punjabi-counselling', 'pa');
  assert.equal(pa.href, `${site.bookingPath}?with=savneet-singh#calendar`);
  assert.equal(pa.labelSuffix, ' with a Punjabi-speaking counsellor');
  const cta = bookingCtaFor({ language: 'tl', service: 'tagalog-counselling', fallback: 'x' });
  assert.equal(cta.href, `${site.bookingPath}?with=camille-granda#calendar`);
  assert.equal(cta.label, 'Book a free consultation with a Tagalog-speaking counsellor');
});

test('every service page books with someone who is accepting, bookable and offers it', () => {
  for (const s of services) {
    const t = bookingFor(s.slug, s.language);
    if (!t.slug) continue;
    const p = practitioners.find((x) => x.slug === t.slug)!;
    assert.ok(p.acceptingNewClients && p.bookable, `${s.slug} -> ${t.slug}`);
    assert.notEqual(t.slug, 'aman-bains-dhillon');
  }
});

test('every ?with= written into service or depth copy names an accepting, bookable counsellor', () => {
  const copy = JSON.stringify(services) + JSON.stringify(extraSections);
  for (const m of copy.matchAll(/\?with=([a-z-]+)/g)) {
    const p = practitioners.find((x) => x.slug === m[1]);
    assert.ok(p && p.acceptingNewClients && p.bookable, `copy books with ${m[1]}`);
  }
});

/* ---- depth sections must land on a page that exists -------------------- */

test('no depth section is keyed to a slug with no route', () => {
  /* Thirteen sections sat under services/trauma-therapy, anxiety-counselling,
     depression-counselling, online-counselling-bc and south-asian-mental-health
     after those pages were consolidated, and never rendered. Nothing failed. */
  const has: Record<string, (slug: string) => boolean> = {
    services: (s) => services.some((x) => x.slug === s),
    guides: (s) => guides.some((x) => x.slug === s),
    compare: (s) => comparisons.some((x) => x.slug === s),
    resources: (s) => resources.some((x) => x.slug === s),
    for: (s) => audiences.some((x) => x.slug === s),
    'online-counselling': (s) => s === 'index' || !!getLocation(s),
    policy: (s) => existsSync(`app/${s}/page.tsx`),
  };
  const orphans = Object.keys(extraSections).filter((key) => {
    const [area, slug] = key.split('/');
    const check = has[area];
    return !check || !check(slug);
  });
  assert.deepEqual(orphans, []);
});

test('the condition city pages link to a heading that is on the target page', () => {
  for (const [condition, link] of Object.entries(CONDITION_UPLINK)) {
    const [path, id] = link!.href.split('#');
    const slug = path.replace('/services/', '');
    assert.ok(getService(slug), `${condition}: ${path} is not a service`);
    assert.ok(getExtra('services', slug).some((s) => headingId(s.h2) === id), `${condition}: #${id} is not on ${path}`);
    assert.match(link!.label, /across BC$/);
  }
  assert.equal(CONDITION_UPLINK['trauma-therapy']!.label, 'online trauma therapy across BC');
  assert.equal(CONDITION_UPLINK['anxiety-counselling']!.label, 'online anxiety counselling across BC');
  assert.equal(CONDITION_UPLINK['depression-counselling']!.label, 'online depression counselling across BC');
});

test('the new service headings and FAQs are there, and EMDR no longer links to itself', () => {
  const h2s = (slug: string) => getExtra('services', slug).map((s) => s.h2);
  assert.ok(h2s('couples-therapy').includes('How much does couples counselling cost in BC?'));
  assert.ok(h2s('emdr-therapy').includes('How much does EMDR therapy cost in BC?'));
  assert.ok(h2s('emdr-therapy').includes('Online trauma therapy in BC, with and without EMDR'));
  assert.ok(h2s('individual-therapy').includes('Online anxiety counselling in BC'));
  assert.ok(h2s('individual-therapy').includes('Online depression counselling in BC'));
  for (const s of services) {
    assert.ok(!(s.related ?? []).some((r) => r.href === `/services/${s.slug}`), `${s.slug} links to itself`);
    for (const x of getExtra('services', s.slug)) {
      assert.ok(!JSON.stringify(x).includes(`](/services/${s.slug})`), `${s.slug}: "${x.h2}" links to its own page`);
    }
  }
  const couples = getService('couples-therapy')!;
  assert.ok(couples.faqs!.some((f) => f.a.includes(fallbackFee('Couples Extended'))));
  assert.doesNotMatch(JSON.stringify(couples), /120-minute|travelling in/);
  assert.ok(getService('emdr-therapy')!.faqs!.some((f) => /cost/i.test(f.q) && f.a.includes(fallbackFee('EMDR Intensive'))));
});

/* ---- fees come from the catalogue ---------------------------------------- */

test('fallbackFee reads the catalogue and refuses a name it does not hold', () => {
  const couples = FALLBACK_CATALOG.items.find((i) => i.name === 'Couples Counselling')!;
  assert.equal(fallbackFee('Couples Counselling'), `$${couples.cents / 100}`);
  assert.throws(() => fallbackFee('Couples Counseling'));
});

test('no typed dollar figure in lib/, app/ or components/ disagrees with the catalogue', () => {
  const { problems } = scanTree(process.cwd());
  assert.deepEqual(problems, []);
});

test('the price scan catches a file set back to the old couples fee', () => {
  const prices = cataloguePrices(readFileSync('lib/cliniko-catalog.ts', 'utf8'));
  const src = readFileSync('lib/city-services.ts', 'utf8');
  assert.deepEqual(strayPrices(src, prices), []);
  const regressed = src.replace("${fallbackFee('Couples Counselling')}", '$170');
  assert.notEqual(regressed, src);
  assert.deepEqual(strayPrices(regressed, prices).map((p: { amount: string }) => p.amount), ['$170']);
  // A regex back-reference is not a price.
  assert.deepEqual(strayPrices("s.replace(/(a)/, '$1')", prices), []);
});

/* ---- the HR paste block ---------------------------------------------------- */

test('the employers paste block copies as plain text ending in the tagged booking URL', () => {
  const a = getAudience('employers-and-hr')!;
  /* One of three blocks since 1 Oct 2026; test/employer-page.test.mts has the other two. */
  const block = a.pasteBlocks!.find((b) => b.h2 === 'Paste this into your benefits page')!;
  const text = pasteText(block, site.domain);
  assert.ok(text.endsWith(`${site.domain}/book?utm_source=hr`));
  assert.doesNotMatch(text, /[<>*\[\]]/, 'markup in the copied text');
  assert.doesNotMatch(text, /\b(hours?|evenings?|weekends?|EAP provider)\b|\d\s?(am|pm)\b/i);
  assert.match(text, /30-minute consultation is free/);
  assert.match(text, /not a crisis service/);
  const words = block.text.split(/\s+/).length;
  assert.ok(words >= 45 && words <= 85, `${words} words`);
});

test('the teachers page names BCTF benefits and cites bctf.ca', () => {
  const a = getAudience('teachers')!;
  assert.ok(a.sections.some((s) => s.h2 === 'Using teacher benefits for counselling'));
  assert.ok(a.faqs.some((f) => /BCTF/.test(f.q)));
  assert.ok(a.sources.some((s) => s.url.startsWith('https://www.bctf.ca/')));
  assert.doesNotMatch(JSON.stringify(a.sections) + JSON.stringify(a.faqs), /BCTF[^"]*\$\d/);
});
