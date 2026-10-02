import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookHrefFor, languageOfPath, LANGUAGE_PAGES } from '../lib/roster-nav.ts';
import { navRoster, practitioners } from '../lib/practitioners.ts';
import { bookingCtaFor } from '../lib/booking-cta.ts';
import { services } from '../lib/services.ts';
import { resources } from '../lib/resources.ts';
import { comparisons } from '../lib/comparisons.ts';
import { punjabiRegions } from '../lib/punjabi-regions.ts';
import { TAGALOG_CITIES } from '../lib/tagalog.ts';
import { placesFor } from '../lib/practitioner-places.ts';
import { getPunjabiPlace } from '../lib/practitioner-places-pa.ts';
import { site } from '../lib/site.ts';

/* THE HEADER AND THE PHONE BAR, 1 Oct 2026.
 *
 * Both are client components fed by navRoster() from the root layout. Two
 * promises are held here: the menu names only counsellors who can be booked
 * (the founder's name was in the chrome of every page), and on a page written
 * for a language the Book link opens the same calendar as the page's own
 * buttons, which lib/booking-cta.ts resolves from the full roster. */

const roster = navRoster();
const B = site.bookingPath;

test('the header menu lists only counsellors taking new clients', () => {
  assert.deepEqual(roster.map((p) => p.slug), practitioners.filter((p) => p.acceptingNewClients).map((p) => p.slug));
  assert.ok(!JSON.stringify(roster).includes('Aman'), 'the founder reached the header roster');
});

test('the roster handed to the browser stays small', () => {
  for (const p of roster) {
    assert.deepEqual(Object.keys(p).sort(), ['acceptingNewClients', 'bookIn', 'name', 'postNominals', 'role', 'slug']);
  }
});

test('language pages: the header and phone bar open the same calendar as the page', () => {
  const paths = [
    '/punjabi', '/punjabi/regions', '/punjabi/guides/panic-attack-ki-hai',
    '/punjabi-counselling', ...punjabiRegions.map((r) => `/punjabi-counselling/${r.slug}`),
    '/tagalog', '/tagalog/gabay/x',
    '/tagalog-counselling', ...TAGALOG_CITIES.map((c) => `/tagalog-counselling/${c.slug}`),
    ...Object.keys(LANGUAGE_PAGES),
  ];
  for (const path of paths) {
    const tag = languageOfPath(path);
    assert.ok(tag, `${path} is not recognised as a language page`);
    const page = bookingCtaFor({ language: tag, fallback: '' }).href;
    assert.equal(bookHrefFor(path, roster, B), page, `${path}: header and page disagree`);
    assert.match(page, /\?with=/, `${path}: nobody accepting speaks ${tag}`);
  }
  assert.equal(bookHrefFor('/punjabi', roster, B), `${B}?with=savneet-singh#calendar`);
  assert.equal(bookHrefFor('/punjabi-counselling/vancouver/', roster, B), `${B}?with=savneet-singh#calendar`);
  assert.equal(bookHrefFor('/tagalog-counselling/surrey', roster, B), `${B}?with=camille-granda#calendar`);
});

test('everywhere else the Book link is unchanged', () => {
  assert.equal(bookHrefFor('/', roster, B), B);
  assert.equal(bookHrefFor('/online-counselling/surrey', roster, B), B);
  /* Not a language prefix, only a lookalike. */
  assert.equal(bookHrefFor('/punjabiX', roster, B), B);
  /* The couples page is tagged with a service nobody accepting offers in
     Punjabi, so the header must not narrow it either. */
  assert.equal(bookHrefFor('/for/punjabi-speaking-couples', roster, B), B);
  assert.equal(bookHrefFor('/practitioners/camille-granda', roster, B), `${B}?with=camille-granda#calendar`);
  assert.equal(bookHrefFor('/practitioners/savneet-singh/surrey/pa', roster, B), `${B}?with=savneet-singh#calendar`);
  assert.equal(bookHrefFor('/practitioners/aman-bains-dhillon', roster, B), B);
  assert.equal(bookHrefFor(null, roster, B), B);
});

test('LANGUAGE_PAGES is exactly the tagged services, resources and comparisons', () => {
  const tagged = Object.fromEntries([
    ...services.filter((s) => s.language).map((s) => [`/services/${s.slug}`, s.language]),
    ...resources.filter((r) => r.language).map((r) => [`/resources/${r.slug}`, r.language]),
    ...comparisons.filter((c) => c.language).map((c) => [`/compare/${c.slug}`, c.language]),
  ]);
  assert.deepEqual({ ...LANGUAGE_PAGES }, tagged);
});

test('every Punjabi region page has the counsellor card and both of her place pages', () => {
  const who = bookingCtaFor({ language: 'pa', fallback: '' }).practitioner;
  assert.ok(who, 'nobody accepting speaks Punjabi');
  assert.ok(who!.placePages);
  const places = placesFor(who!.provinces).map((c) => c.slug);
  /* Regions added from 2 Oct 2026 are English only: no new Punjabi is written
     until it has been reviewed, so their place page has no /pa twin yet and
     the region page links the English one alone. */
  const noTwinYet = ['saanich', 'maple-ridge', 'vernon', 'mission', 'courtenay', 'langford'];
  for (const r of punjabiRegions) {
    assert.ok(places.includes(r.slug), `${r.slug}: no /practitioners/${who!.slug}/${r.slug}`);
    if (noTwinYet.includes(r.slug)) assert.equal(getPunjabiPlace(r.slug), undefined, `${r.slug}: a twin exists; drop it from noTwinYet`);
    else assert.ok(getPunjabiPlace(r.slug), `${r.slug}: no Punjabi twin of the place page`);
  }
});
