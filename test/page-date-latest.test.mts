import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COLLECTION_DATES } from '../lib/page-dates.ts';
import { latestCollection, isoDay, placePageDate } from '../lib/page-date-latest.ts';

test('latestCollection takes the later date and skips a collection not yet generated', () => {
  const a = COLLECTION_DATES.practitioners;
  const b = COLLECTION_DATES.practitionerPlaces;
  assert.equal(placePageDate(), [a, b].sort().at(-1));
  assert.equal(latestCollection('practitioners', 'no-such-collection'), a);
  assert.equal(latestCollection('no-such-collection'), undefined);
});

test('isoDay writes the day the way the sitemap does, and null for unknown', () => {
  assert.equal(isoDay('2026-10-01'), '2026-10-01T00:00:00.000Z');
  assert.equal(isoDay(undefined), null);
});

/* The point of the change is that three surfaces read one value. A source
   check is crude, and it is the only one that runs without a build. */
test('city-service and place pages take their sitemap date from the source their page states', () => {
  const sitemap = readFileSync('lib/sitemap.ts', 'utf8'); // the list moved here from app/sitemap.xml/route.ts, 3 Oct 2026
  const pair = readFileSync('app/online-counselling/[city]/[service]/page.tsx', 'utf8');
  const place = readFileSync('app/practitioners/[slug]/[place]/page.tsx', 'utf8');
  assert.match(sitemap, /\$\{p\.service\}`,[\s\S]{0,400}?collectionLastmod\('cityServices'\)/);
  assert.match(pair, /dateModified: COLLECTION_DATES\['cityServices'\]/);
  assert.match(pair, /<Updated iso=\{COLLECTION_DATES\['cityServices'\]\}/);
  assert.match(sitemap, /\$\{l\.slug\}`,[\s\S]{0,300}?isoDay\(placePageDate\(\)\)/);
  assert.match(place, /dateModified: placePageDate\(\)/);
  assert.match(place, /<Updated iso=\{placePageDate\(\)\}/);
});
