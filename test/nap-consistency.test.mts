import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  site, REGISTERED_LOCALITY, LOCALITY_LABEL, LOCALITY_MACHINE, LOCALITY_VISIBLE_NOTE,
} from '../lib/site.ts';
import { GET as vcard } from '../app/westpeak.vcf/route.ts';

/* ONE NAME, ONE PLACE, EMAIL BEFORE PHONE — item 299, 1 Oct 2026.
 * The JSON-LD said White Rock while /contact, the vCard, ai.json and llms.txt
 * never did, and the footer and /contact put the phone before the email the
 * practice prefers. Every surface reads REGISTERED_LOCALITY; these hold it. */

const src = (f: string) => readFileSync(f, 'utf8');

test('the registered locality is White Rock, BC, Canada, with no street and an online-only note', () => {
  assert.deepEqual(
    { l: REGISTERED_LOCALITY.locality, r: REGISTERED_LOCALITY.region, c: REGISTERED_LOCALITY.country },
    { l: 'White Rock', r: 'BC', c: 'CA' },
  );
  assert.equal(LOCALITY_LABEL, 'White Rock, BC');
  assert.equal(LOCALITY_MACHINE, 'White Rock, BC (no office to visit)');
  assert.match(LOCALITY_VISIBLE_NOTE, /video only, no office/);
  assert.ok(!('street' in REGISTERED_LOCALITY) && !('streetAddress' in REGISTERED_LOCALITY));
  assert.ok(src('lib/locations.ts').includes(`slug: "${REGISTERED_LOCALITY.hub.split('/').pop()}"`), 'the hub page exists');
});

test('the Organization address reads the constant, not a typed locality', () => {
  const layout = src('app/layout.tsx');
  assert.match(layout, /addressLocality: REGISTERED_LOCALITY\.locality/);
  assert.match(layout, /addressRegion: REGISTERED_LOCALITY\.region/);
  assert.match(layout, /addressCountry: REGISTERED_LOCALITY\.country/);
  assert.doesNotMatch(layout, /addressLocality: '/);
});

test('the vCard carries the locality with no street, and email before phone', async () => {
  const card = await vcard().text();
  assert.ok(card.includes('ADR;TYPE=WORK:;;;White Rock;BC;;Canada\r\n'), card);
  assert.ok(card.includes(`FN:${site.name}`));
  const email = card.indexOf('EMAIL');
  const tel = card.indexOf('TEL;');
  assert.ok(email > -1);
  if (tel > -1) assert.ok(email < tel, 'EMAIL precedes TEL');
});

test('ai.json and llms.txt name the registered locality', () => {
  for (const f of ['app/ai.json/route.ts', 'app/llms.txt/route.ts']) assert.match(src(f), /LOCALITY_MACHINE/, f);
  assert.match(src('app/llms.txt/route.ts'), /- Registered locality: \$\{LOCALITY_MACHINE\}/);
});

test('the footer and /contact show the name and locality, linked to the hub, and render email before phone', () => {
  for (const f of ['components/Footer.tsx', 'app/contact/page.tsx']) {
    const s = src(f);
    assert.match(s, /\{site\.name\} · <Link (?:prefetch=\{false\} )?href=\{REGISTERED_LOCALITY\.hub\}>\{LOCALITY_LABEL\}<\/Link> · \{LOCALITY_VISIBLE_NOTE\}/, f);
    const mail = s.indexOf('<MailLink');
    const tel = s.indexOf('href={`tel:${site.phoneTel}`}');
    assert.ok(mail > -1 && tel > -1, f);
    assert.ok(mail < tel, `${f}: the MailLink must render before the tel: link`);
  }
});
