import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { services, getService } from '../lib/services.ts';
import { getExtra } from '../lib/depth.ts';
import { guides } from '../lib/guides.ts';
import { pairsForService, CONDITION_UPLINK } from '../lib/city-services.ts';
import { getCityTopic } from '../lib/conditions.ts';
import { counsellorsFor } from '../lib/city-service-page.ts';
import { metaLength } from '../lib/snippet-facts.ts';
import { headingId } from '../lib/toc.ts';

/* The BC pillars for trauma and couples, 13 Oct 2026 (13 Oct export:
   North Vancouver trauma 965 impressions at 51 for national queries, Mission
   couples 395 at 25). */

test('a lead section names a depth section the service page really has', () => {
  for (const s of services) {
    if (!s.leadSection) continue;
    assert.ok(getExtra('services', s.slug).some((x) => x.h2 === s.leadSection), `${s.slug}: ${s.leadSection}`);
  }
  assert.equal(getService('emdr-therapy')!.leadSection, 'Online trauma therapy in BC, with and without EMDR');
  assert.equal(getService('couples-therapy')!.leadSection, 'Gottman-informed couples counselling in BC');
});

test('the pillars say the head query in the title and the H1', () => {
  const emdr = getService('emdr-therapy')!;
  assert.match(emdr.metaTitle, /^Online Trauma Therapy, Counselling and EMDR in BC/);
  assert.match(emdr.heading!, /Trauma Therapy/);
  assert.match(emdr.directAnswer!, /^Online trauma therapy/);
  const couples = getService('couples-therapy')!;
  assert.match(couples.metaTitle, /Couples and Marriage Counselling/);
  assert.match(couples.heading!, /Couples and Marriage Counselling/);
  for (const s of [emdr, couples]) assert.ok(metaLength(s.metaTitle) <= 60, `${s.slug}: ${s.metaTitle}`);
});

test('the trauma pillar links down to every trauma city page, and they link up to its open section', () => {
  const emdr = getService('emdr-therapy')!;
  assert.equal(emdr.areaAlso, 'trauma-therapy');
  assert.ok(getCityTopic('trauma-therapy'));
  assert.ok(pairsForService('trauma-therapy').some((p) => p.city === 'north-vancouver'));
  assert.equal(CONDITION_UPLINK['trauma-therapy']!.href, `/services/emdr-therapy#${headingId(emdr.leadSection!)}`);
  const couples = getService('couples-therapy')!;
  assert.equal(CONDITION_UPLINK['couples-therapy']!.href, `/services/couples-therapy#${headingId(couples.leadSection!)}`);
});

test('the service page renders the lead section open and skips it in the fold', () => {
  const page = readFileSync('app/services/[slug]/page.tsx', 'utf8');
  assert.match(page, /skip=\{lead \? \[lead\.h2\] : undefined\}/);
  assert.match(page, /<h1>\{s\.heading \?\? s\.name\}/);
  assert.match(page, /\$\{label\} in \$\{getLocation\(pr\.city\)/);
});

test('the pillar sections name who takes the work, from the roster', () => {
  const trauma = getExtra('services', 'emdr-therapy').find((x) => x.h2 === getService('emdr-therapy')!.leadSection)!;
  const text = trauma.body!.join(' ');
  for (const p of counsellorsFor({ bookingService: 'individual-therapy' })) assert.ok(text.includes(p.name), p.name);
  const couples = getExtra('services', 'couples-therapy').find((x) => x.h2 === getService('couples-therapy')!.leadSection)!;
  const ctext = couples.body!.join(' ');
  for (const p of counsellorsFor({ bookingService: 'couples-therapy' })) assert.ok(ctext.includes(p.name), p.name);
  /* Only counsellors who offer couples work are named in the couples section. */
  const others = counsellorsFor({ bookingService: 'individual-therapy' }).filter((p) => !p.services.includes('couples-therapy'));
  for (const p of others) assert.ok(!ctext.includes(p.name), `${p.name} named for couples`);
});

test('the five guides carry their new titles within the length gates', () => {
  const want: Record<string, string> = {
    'setting-boundaries-with-family': 'What Are Family Boundaries? Examples, and How to Set Them',
    'burnout-vs-depression': 'Burnout vs Depression: How to Tell the Difference',
    'panic-attacks-at-work': 'Panic Attacks at Work: What to Do in the Moment and After',
    'how-the-gottman-method-works': 'How the Gottman Method Works in Couples Therapy | Westpeak',
    'high-functioning-anxiety': 'High-Functioning Anxiety: Signs, and the Therapy That Helps',
  };
  for (const [slug, title] of Object.entries(want)) {
    const g = guides.find((x) => x.slug === slug)!;
    assert.equal(g.metaTitle, title);
    assert.ok(metaLength(g.metaTitle) <= 60, slug);
    assert.ok(metaLength(g.metaDescription) <= 155, `${slug}: ${metaLength(g.metaDescription)}`);
  }
  assert.match(guides.find((x) => x.slug === 'setting-boundaries-with-family')!.shortAnswer, /^Family boundaries are/);
  assert.match(guides.find((x) => x.slug === 'burnout-vs-depression')!.shortAnswer, /^Burnout is tied to work/);
});
