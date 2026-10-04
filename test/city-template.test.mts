import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TAGALOG_CITIES, tagalogCityTitle } from '../lib/tagalog.ts';
import { tagalogCityDate, latestCollection } from '../lib/page-date-latest.ts';

/* The template fixes the ten new cities of 2 Oct 2026 need before any of
   their data lands: a Tagalog title that fits for a long city name, a date
   that moves when lib/tagalog.ts does, and no hand-typed city count. */

test('the Tagalog city title keeps ", BC" where it fits and drops it where it does not', () => {
  assert.equal(tagalogCityTitle('Kelowna'), 'Tagalog Counselling in Kelowna, BC | Westpeak Wellness');
  for (const city of ['Port Coquitlam', 'Campbell River', 'North Vancouver', 'New Westminster']) {
    const t = tagalogCityTitle(city);
    assert.equal(t, `Tagalog Counselling in ${city} | Westpeak Wellness`);
    assert.ok(t.length <= 60, `${t} is ${t.length}`);
  }
  for (const c of TAGALOG_CITIES) assert.ok(tagalogCityTitle(c.city).length <= 60, c.city);
  const route = readFileSync('app/tagalog-counselling/[city]/page.tsx', 'utf8');
  assert.match(route, /const title = tagalogCityTitle\(c\.city\)/);
});

test('a Tagalog city page is dated by lib/tagalog.ts and its route, on every surface', () => {
  const spec = readFileSync('scripts/page-dates.mjs', 'utf8');
  assert.match(spec, /tagalogCities: \['lib\/tagalog\.ts', 'app\/tagalog-counselling\/\[city\]\/page\.tsx'\]/);
  assert.equal(tagalogCityDate(), latestCollection('tagalogCities') ?? latestCollection('tagalog'));
  const route = readFileSync('app/tagalog-counselling/[city]/page.tsx', 'utf8');
  assert.match(route, /dateModified: tagalogCityDate\(\)/);
  assert.match(route, /<Updated iso=\{tagalogCityDate\(\)\} \/>/);
  assert.doesNotMatch(route, /COLLECTION_DATES/);
  const sitemap = readFileSync('lib/sitemap.ts', 'utf8'); // the list moved here from app/sitemap.xml/route.ts, 3 Oct 2026
  assert.match(sitemap, /tagalog-counselling\/\$\{c\.slug\}`,\s*lastmod: isoDay\(tagalogCityDate\(\)\)/);
  const llms = readFileSync('app/llms-full.txt/route.ts', 'utf8');
  assert.match(llms, /tagalog-counselling\/\$\{c\.slug\}`,\s*`Last reviewed: \$\{tagalogCityDate\(\)\}`/);
});

test('the Punjabi index reads its city counts from the data', () => {
  const page = readFileSync('app/punjabi-counselling/page.tsx', 'utf8');
  const prose = page.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  assert.doesNotMatch(prose, /\b(three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) (BC )?(city|cities|regions?)\b/i);
  assert.match(page, /countWord\(bcPlaces\.length\)/);
  assert.match(page, /countWord\(distance\.length\)/);
});
