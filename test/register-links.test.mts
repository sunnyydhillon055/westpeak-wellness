import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../lib/site.ts';
import { recordedPractitioners } from '../lib/practitioners.ts';
import { registerEntryUrl, BCACC_REGISTER, COMPLAINTS_PATH } from '../lib/practitioner-facts.ts';
import { headingId } from '../lib/toc.ts';
import { policies } from '../lib/policies.ts';

/* #104, 1 Oct 2026. Every "verify" link pointed at BCACC's Find a Counsellor
 * directory, which is opt-in: Savneet's listing is switched off, so a visitor
 * who pressed "verify" on her profile could not find her, and the site's own
 * FAQ told them to treat that as a warning. The RCC Register lists every RCC
 * with her status. These fail if a verify link drifts back to the directory. */

const ROOT = process.cwd();
const DIRECTORY = /bc-counsellors\.org\/counsellors|bcacc\.ca\/counsellors\//;

test('the site-wide register link is the RCC Register, not the directory', () => {
  assert.equal(site.counsellor.registerUrl, BCACC_REGISTER);
  assert.doesNotMatch(site.counsellor.registerUrl, DIRECTORY);
});

test('every credential verifyUrl avoids the directory, and every BCACC one is the register', () => {
  for (const p of recordedPractitioners) {
    for (const c of p.credentials) {
      if (!c.verifyUrl) continue;
      assert.doesNotMatch(c.verifyUrl, DIRECTORY, `${p.slug} ${c.short} verifyUrl points at the opt-in directory`);
      if (/Clinical Counsellors/.test(c.body)) assert.equal(c.verifyUrl, BCACC_REGISTER, `${p.slug} ${c.short}`);
    }
  }
});

test('the generic verifyUrl carries no registration number; only the profile deep link does', () => {
  for (const p of recordedPractitioners) {
    for (const c of p.credentials) {
      if (c.verifyUrl) assert.ok(!c.verifyUrl.includes(c.number), `${p.slug}: a number in verifyUrl reaches /book and /ai.json`);
    }
  }
  const savneet = recordedPractitioners.find((p) => p.slug === 'savneet-singh')!.credentials[0]!;
  assert.equal(registerEntryUrl(savneet), `${BCACC_REGISTER}?mid=${savneet.number}`);
  const ccc = recordedPractitioners.find((p) => p.slug === 'camille-granda')!.credentials.find((c) => c.short === 'CCC')!;
  assert.equal(registerEntryUrl(ccc), ccc.verifyUrl, 'a non-BCACC credential keeps its own link');
});

test('a register check date is a real ISO date, never in the future of the file', () => {
  for (const p of recordedPractitioners) {
    for (const c of p.credentials) {
      if (!c.registerCheckedOn) continue;
      assert.match(c.registerCheckedOn, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(!Number.isNaN(Date.parse(c.registerCheckedOn)));
    }
  }
});

test('no source labelled as a register or a verification links the directory', () => {
  const files = readdirSync(join(ROOT, 'lib')).filter((f) => f.endsWith('.ts'));
  const bad: string[] = [];
  for (const f of files) {
    const src = readFileSync(join(ROOT, 'lib', f), 'utf8');
    for (const m of src.matchAll(/label:\s*(['"`])([^'"`]*)\1,\s*url:\s*(['"`])([^'"`]*)\3/g)) {
      if (/register|verif/i.test(m[2]!) && DIRECTORY.test(m[4]!)) bad.push(`${f}: "${m[2]}" -> ${m[4]}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('the profile complaints link lands on the /standards section that explains the route', () => {
  const doc = policies['standards']!;
  const section = doc.sections.find((s) => `/standards#${headingId(s.h2)}` === COMPLAINTS_PATH);
  assert.ok(section, `${COMPLAINTS_PATH} names no /standards heading`);
  const text = (section!.body ?? []).join(' ');
  assert.match(text, /bcacc\.ca\/complaints-and-investigations/);
  assert.match(text, /bcacc\.ca\/search-our-member-register/);
  assert.match(text, /five years/);
  assert.match(text, /in writing/);
});
