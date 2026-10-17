import test from 'node:test';
import assert from 'node:assert/strict';
import { CHANNELS, channelOf, referrerClass } from '@/lib/conversion-detail-client';
import { allowedDetail } from '@/lib/conversion-detail';

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
  /* 16 Oct 2026: the hosts the section 14, 27, 29 and 30 drafts point at. */
  ['www.clicklaw.bc.ca', 'org'],
  ['www.go2hr.ca', 'org'],
  ['pathwaysbc.ca', 'org'],
  ['www.wrssdivision.ca', 'org'],
  ['www.theprogress.com', 'press'],
  ['clinicfinder.ca', 'listing'],
  ['www.directoriesnetwork.com', 'listing'],
  /* The suffix grouping of 16 Oct 2026 keeps every earlier host. */
  ['bcacc.ca', 'listing'],
  ['luminohealth.sunlife.ca', 'listing'],
  ['www.yelp.ca', 'listing'],
  ['www.sfu.ca', 'edu'],
  ['www.okanagan.bc.ca', 'edu'],
  ['www.cbc.ca', 'press'],
  ['bc.cmha.ca', 'org'],
  ['www.bcchamber.org', 'org'],
  ['abbotsfordchamber.com', 'org'],
  ['chat.openai.com', 'ai'],
  ['claude.ai', 'ai'],
];

for (const [host, cls] of CASES) {
  test(`${host} is ${cls}`, () => assert.equal(referrerClass(host, OWN), cls));
}

test('the new hosts are anchored: a lookalike stays other', () => {
  for (const h of ['notbcbh.ca', 'bcbh.ca.example.com', 'fakeredfm.ca', 'emdrcanada.org.evil.example', 'xasianmhc.org',
    'notgo2hr.ca', 'go2hr.ca.evil.example', 'mytheprogress.com', 'clinicfinder.com', 'pathwaysbc.org', 'sfu.org', 'cbc.com']) {
    assert.equal(referrerClass(h, OWN), 'other', h);
  }
});

/* 16 Oct 2026: the social pack and the union and legal sends were dropped
   before channel_visit because channelOf() did not know their tags. */
test('the five outreach tags are channels, appended after email', () => {
  const added = ['linkedin', 'instagram', 'facebook', 'union', 'legal'];
  assert.deepEqual(CHANNELS.slice(-5), added);
  assert.equal(CHANNELS.indexOf('email'), CHANNELS.length - 6, 'nothing before them was reordered');
  for (const c of added) {
    assert.equal(channelOf(c), c);
    assert.equal(channelOf(c.toUpperCase()), c);
    assert.equal(allowedDetail('channel_visit', c), c);
  }
});
