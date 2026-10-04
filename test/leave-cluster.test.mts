import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getResource } from '../lib/resources.ts';
import { getGuide } from '../lib/guides.ts';
import { getAudience } from '../lib/audiences.ts';
import { headingId } from '../lib/toc.ts';

/* wf/tp-leave, 3 Oct 2026: the leave and workplace cluster after the 3 Oct
 * Search Console export. Three things a later edit could quietly undo. */

const text = (p: { sections: { h2: string; body?: string[]; list?: { label: string; detail: string }[] }[]; faqs: { q: string; a: string }[] }) =>
  [
    ...p.sections.flatMap((s) => [s.h2, ...(s.body ?? []), ...(s.list ?? []).flatMap((l) => [l.label, l.detail])]),
    ...p.faqs.flatMap((f) => [f.q, f.a]),
  ].join('\n');

test('the BC sick-day floor is five paid and three unpaid wherever the leave pages state it', () => {
  for (const page of [
    getGuide('stress-leave-bc'),
    getGuide('sick-days-and-mental-health-days-bc'),
    getResource('workplace-mental-health-bc'),
  ]) {
    assert.ok(page, 'leave page missing');
    const t = text(page);
    assert.doesNotMatch(t, /unpaid,? job-protected illness or injury leave of up to five days/i, `${page.slug} calls the five ESA days unpaid`);
    assert.match(t, /five paid and three unpaid|5 paid sick days and 3 unpaid/i, `${page.slug} lost the ESA figures`);
  }
});

test('the 27-week medical leave is attributed to the Canada Labour Code, never to BC law', () => {
  const g = getGuide('stress-leave-bc');
  assert.ok(g);
  const t = text(g);
  for (const sentence of t.split(/(?<=\.)\s+/).filter((x) => /27 weeks/.test(x))) {
    assert.match(sentence, /Canada Labour Code|federal|Not under BC law|BC Act has no equivalent/i, `27 weeks without its source: ${sentence}`);
  }
  assert.ok(g.sources.some((s) => s.url.includes('laws-lois.justice.gc.ca/eng/acts/L-2/section-239')), 'the s. 239 source is cited');
});

test('"stay at work services" is defined on the employer page; the employee page links to it', () => {
  const hr = getAudience('employers-and-hr');
  const work = getResource('workplace-mental-health-bc');
  assert.ok(hr && work);
  const hrHeading = hr.sections.find((s) => /^Stay-at-work services in BC/.test(s.h2));
  assert.ok(hrHeading, 'employer page lost its stay-at-work section');
  assert.ok(hr.faqs.some((f) => /stay-at-work services/i.test(f.q)), 'employer page lost the stay-at-work FAQ');
  assert.ok(!work.sections.some((s) => /^Stay-at-work services/i.test(s.h2)), 'two pages define the same query again');
  assert.ok(!work.faqs.some((f) => /what are "?stay.at.work"? services/i.test(f.q)), 'the definition FAQ is back on the employee page');
  assert.ok(text(work).includes(`/for/employers-and-hr#${headingId(hrHeading.h2)}`), 'employee page does not link the employer section by its anchor');
  const back = work.sections.find((s) => /stay-at-work plan/i.test(s.h2));
  assert.ok(back, 'employee-side section missing');
  assert.ok(text(hr).includes(`/resources/workplace-mental-health-bc#${headingId(back.h2)}`), 'employer page does not link back to the employee section');
});
