import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recordedPractitioners } from '../lib/practitioners.ts';

/* Person.sameAs tells a search or answer engine that the page at that URL IS
   this person, so it merges that page's facts into hers. Twice a listing has
   carried facts the site does not: the Psychology Today profiles (another
   practice, another fee, a 15-minute consultation; withdrawn 1 Oct 2026) and
   the founder's BCACC Find a Counsellor entry (in-person, telephone, Surrey;
   withdrawn 3 Oct 2026).

   So no URL is emitted until someone has read it and found it consistent with
   the site. VERIFIED is where that read is recorded: the URL, the date it was
   read, and what it said. Adding a sameAs without a row here fails. */

type Verified = { url: string; readOn: string; said: string };

export const VERIFIED: readonly Verified[] = [
  {
    url: 'https://ca.linkedin.com/in/aman-bains-9ab445276',
    readOn: '2026-09-06',
    said: 'Her own profile, naming her with Westpeak Wellness; found by the 6 Sep 2026 audit. Not re-read since; re-read it at the next audit and update readOn.',
  },
];

/* Read and rejected. A URL here must not be emitted until it moves to
   VERIFIED with a newer read. */
const REJECTED: readonly Verified[] = [
  {
    url: 'https://bcacc.ca/counsellors/amandeep-bains/',
    readOn: '2026-10-03',
    said: 'In-person and telephone sessions, Surrey. The site offers video only.',
  },
];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

test('every sameAs URL on the roster has a recorded, dated read', () => {
  const known = new Map(VERIFIED.map((v) => [v.url, v]));
  for (const p of recordedPractitioners) {
    for (const u of p.sameAs ?? []) {
      assert.ok(known.has(u), `${p.slug}: ${u} is emitted as sameAs but has no VERIFIED read`);
    }
  }
});

test('each VERIFIED row records a real date and what the page said', () => {
  for (const v of VERIFIED) {
    assert.match(v.url, /^https:\/\//, v.url);
    assert.match(v.readOn, ISO, `${v.url}: readOn must be YYYY-MM-DD`);
    assert.ok(!Number.isNaN(Date.parse(v.readOn)), `${v.url}: ${v.readOn} is not a date`);
    assert.ok(v.said.trim().length >= 20, `${v.url}: say what the page said`);
  }
});

test('a rejected listing is not emitted unless re-read more recently', () => {
  for (const r of REJECTED) {
    const again = VERIFIED.find((v) => v.url === r.url);
    const emitted = recordedPractitioners.some((p) => (p.sameAs ?? []).includes(r.url));
    if (emitted) {
      assert.ok(again && again.readOn > r.readOn, `${r.url} was rejected on ${r.readOn}; re-read it before emitting`);
    }
  }
});

test('the founder keeps LinkedIn and drops the BCACC entry', () => {
  const founder = recordedPractitioners.find((p) => p.slug === 'aman-bains-dhillon')!;
  assert.ok(founder.sameAs?.includes('https://ca.linkedin.com/in/aman-bains-9ab445276'));
  assert.ok(!founder.sameAs?.some((u) => /bcacc\.ca\/counsellors\//.test(u)));
});

test('no Psychology Today URL is emitted', () => {
  for (const p of recordedPractitioners) {
    for (const u of p.sameAs ?? []) assert.doesNotMatch(u, /psychologytoday\.com/i, `${p.slug}: ${u}`);
  }
});
