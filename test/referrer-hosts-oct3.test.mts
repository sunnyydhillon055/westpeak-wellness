import test from 'node:test';
import assert from 'node:assert/strict';
import { referrerClass } from '@/lib/conversion-detail-client';

/* 3 Oct 2026: the directories, organisations and outlets the new listing and
   outreach drafts point at. A directory that strips utm tags would otherwise
   land in `other`, and the owner could not see which listing produced a
   book_click. Only the class leaves the browser, never the host. */

const OWN = 'www.westpeakwellness.com';

const CASES: [string, string][] = [
  ['www.ccpa-accp.ca', 'listing'],
  ['asianmhc.org', 'listing'],
  ['www.asianmhc.org', 'listing'],
  ['emdrcanada.org', 'listing'],
  ['www.emdria.org', 'listing'],
  ['www.vancouverpcg.org', 'org'],
  ['dmw.gov.ph', 'org'],
  ['movingforward.help', 'org'],
  ['bcbh.ca', 'org'],
  ['voiceonline.com', 'press'],
  ['redfm.ca', 'press'],
  ['connectfm.ca', 'press'],
  ['www.thefilipinopost.com', 'press'],
  ['canadianinquirer.net', 'press'],
  ['philippinecanadiannews.com', 'press'],
];

for (const [host, cls] of CASES) {
  test(`${host} is ${cls}`, () => assert.equal(referrerClass(host, OWN), cls));
}

test('the new hosts are anchored: a lookalike stays other', () => {
  for (const h of ['notbcbh.ca', 'bcbh.ca.example.com', 'fakeredfm.ca', 'emdrcanada.org.evil.example', 'xasianmhc.org']) {
    assert.equal(referrerClass(h, OWN), 'other', h);
  }
});
