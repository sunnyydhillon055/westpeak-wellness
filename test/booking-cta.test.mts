import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingCtaFor, counsellorForLanguage, serviceNoun } from '../lib/booking-cta.ts';
import { practitioners } from '../lib/practitioners.ts';
import { services } from '../lib/services.ts';
import { audiences } from '../lib/audiences.ts';
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
};

test('every page that carries a language tag resolves to a counsellor who can take the booking', () => {
  for (const s of [...tagged.services, ...tagged.audiences]) {
    const who = counsellorForLanguage(s.language!);
    assert.ok(who, `${s.slug} is tagged ${s.language} and nobody accepting speaks it`);
    assert.equal(who!.acceptingNewClients, true, `${s.slug}: ${who!.slug} is not accepting`);
    assert.equal(who!.bookable, true, `${s.slug}: ${who!.slug} has no online calendar`);
    assert.ok(who!.languages.some((l) => l.tag === s.language), `${s.slug}: ${who!.slug} does not speak ${s.language}`);
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
