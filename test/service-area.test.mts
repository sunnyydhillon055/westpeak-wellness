import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serviceAreaLine, recordedPractitioners, type Practitioner } from '../lib/practitioners.ts';
import { site } from '../lib/site.ts';

/* ONE REACH LINE, FROM THE INSURED ROSTER — item 284, 1 Oct 2026.
 * The footer typed "British Columbia and Alberta", the home page typed
 * "reaches Alberta as well as BC" and the FAQ said "anywhere in Canada with
 * Camille". These prove the line follows the insurance gate. */

const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
/* Canada-wide reach is synthetic since 3 Oct 2026 (removed from her record);
   the line must still follow the gate for whoever carries it. */
const withPolicy = (validTo: string): Practitioner => ({ ...camille, reach: 'canada', insurance: { ...camille.insurance!, validTo } });
const others = recordedPractitioners.filter((p) => p.slug !== 'camille-granda');

test('the base clause is true of every counsellor: British Columbia only', () => {
  assert.equal(site.serviceArea, 'Virtual counselling across British Columbia');
  assert.doesNotMatch(site.serviceArea, /Alberta|Canada/);
});

test('a current Canada-wide policy adds "elsewhere in Canada" with her first name', () => {
  const line = serviceAreaLine([...others, withPolicy('2026-10-01')], '2026-10-01');
  assert.equal(line, 'Virtual counselling across British Columbia, and elsewhere in Canada with Camille');
});

test('the wider clause stands through the grace and drops on the lapse', () => {
  const roster = [...others, withPolicy('2026-10-01')];
  assert.match(serviceAreaLine(roster, '2026-10-14'), /elsewhere in Canada with Camille$/);
  assert.equal(serviceAreaLine(roster, '2026-10-15'), site.serviceArea);
});

test('an Alberta-only insured counsellor reads "in Alberta", and a counsellor not accepting adds nothing', () => {
  const ab: Practitioner = { ...withPolicy('2027-01-01'), reach: undefined };
  assert.equal(serviceAreaLine([...others, ab], '2026-10-01'), `${site.serviceArea}, and in Alberta with Camille`);
  const closed: Practitioner = { ...withPolicy('2027-01-01'), acceptingNewClients: false };
  assert.equal(serviceAreaLine([...others, closed], '2026-10-01'), site.serviceArea);
});

test('the footer, the vCard and ai.json read the generated line, and the home page types no reach', () => {
  for (const f of ['components/Footer.tsx', 'app/westpeak.vcf/route.ts', 'app/ai.json/route.ts']) {
    const src = readFileSync(f, 'utf8');
    assert.match(src, /serviceAreaLine\(\)/, f);
    assert.doesNotMatch(src, /site\.serviceArea/, f);
  }
  assert.doesNotMatch(readFileSync('app/page.tsx', 'utf8'), /reaches Alberta as well as BC/);
});
