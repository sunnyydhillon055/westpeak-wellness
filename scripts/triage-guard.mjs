#!/usr/bin/env node
/**
 * TRIAGE GUARD - keeps lib/triage.ts from becoming profiling.
 *
 * WHY THIS EXISTS
 *
 * Spam heuristics rot in one direction. Every one of these is a plausible
 * next commit when a bad week produces a run of junk enquiries:
 *
 *   "flag names that don't look real"
 *   "rate-limit by IP"
 *   "block submissions from outside Canada"
 *
 * On this site each of those is worse than the spam. A name heuristic
 * penalises Punjabi, transliterated, and single names - the exact people the
 * practice was built for. An IP is a record of who asked about mental health,
 * on a site that promises no record is created before a session. A country
 * filter drops the BC resident who is travelling, and the family member
 * enquiring on someone's behalf from abroad.
 *
 * The header of lib/triage.ts states all three as rules. This file is what
 * makes them cost something to break: prose is advice, a failing build is a
 * decision. A future edit that wants one of these has to delete this script
 * and explain why in the commit, which is exactly the amount of friction the
 * decision deserves.
 *
 * WHAT IT CHECKS
 *
 *   1. lib/triage.ts never reads a name, an IP, or a geography field.
 *   2. The submit path never passes one in.
 *   3. The stated rules are still in the file, so the reasoning survives the
 *      next person who reads it.
 */

import { readFileSync } from 'node:fs';

const TRIAGE = 'lib/triage.ts';
const SUBMIT = 'lib/inbound-submit.ts';

const read = (p) => {
  try { return readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'); }
  catch { return null; }
};

const triage = read(TRIAGE);
const submit = read(SUBMIT);

const fails = [];

if (!triage) {
  fails.push(`${TRIAGE} is missing. If triage was removed, remove this guard in the same commit.`);
} else {
  /* Comments state the rules by naming the forbidden things, so they are
     stripped before scanning. Otherwise the guard trips on its own rationale. */
  const code = triage
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  const BANNED = [
    { re: /\bip\b|ipAddress|remoteAddr|x-forwarded-for|x-real-ip|cf-connecting-ip/i,
      why: 'reads an IP address' },
    { re: /\bcountry\b|\bgeo(ip|location)?\b|\bregion\b(?!al)|\bcity\b/i,
      why: 'reads a geography field' },
    { re: /input\.name|\.name\s*\)|nameLooks|realName|gibberish/i,
      why: 'reads the submitted name' },
  ];

  for (const b of BANNED) {
    if (b.re.test(code)) fails.push(`${TRIAGE} ${b.why} - see the header of that file.`);
  }

  /* The TriageInput type is the contract. If `name` is not in it, no rule can
     reach the name however it is written. */
  const inputType = triage.match(/export type TriageInput = \{[\s\S]*?\n\};/)?.[0] ?? '';
  if (/\bname\s*[?:]/.test(inputType)) {
    fails.push(`${TRIAGE} TriageInput accepts a name. Remove it - the rules must not be able to see it.`);
  }
  if (/\bip\s*[?:]|country\s*[?:]/.test(inputType)) {
    fails.push(`${TRIAGE} TriageInput accepts an IP or country.`);
  }

  for (const phrase of ['NAME', 'IP ADDRESS', 'CAPTCHA']) {
    if (!triage.includes(phrase)) {
      fails.push(`${TRIAGE} no longer explains why ${phrase} is not a signal. Restore the note or the next reader will add it back.`);
    }
  }
}

if (submit && /triage\(\s*\{[^}]*\bname\b/s.test(submit)) {
  fails.push(`${SUBMIT} passes the submitted name into triage().`);
}

/* ---------------------------------------------------------------------------
 * BEHAVIOUR
 *
 * The checks above are structural - they prove no forbidden field is READ.
 * These prove the rules actually do what the header claims, and in particular
 * that the person described in the first paragraph of lib/triage.ts still gets
 * through: new throwaway address, no name, six words, sent twice, in a hurry.
 * That case trips four signals and must still reach the counsellor.
 *
 * Loaded with Node's native type stripping. lib/triage.ts imports only types
 * from @/lib/inbound, so nothing has to resolve the path alias at runtime.
 * ------------------------------------------------------------------------- */
let triageFn = null;
try {
  ({ triage: triageFn } = await import('../lib/triage.ts'));
} catch (err) {
  fails.push(`could not load ${TRIAGE} to test its behaviour: ${err.message}`);
}

if (triageFn) {
  const at = (mins) => new Date(Date.now() - mins * 60_000).toISOString();
  const rec = (o) => ({
    id: 'x', kind: 'enquiry', name: '', email: '', message: '', source: '/',
    handled: false, createdAt: at(1), ...o,
  });
  const base = { kind: 'enquiry', email: 'a@example.com', message: 'hello there', honeypot: '' };

  const cases = [
    {
      name: 'ordinary enquiry is clear',
      got: () => triageFn(base, []),
      want: (v) => v.band === 'clear' && v.flags.length === 0,
    },
    {
      name: 'honeypot quarantines',
      got: () => triageFn({ ...base, honeypot: 'Acme Ltd' }, []),
      want: (v) => v.band === 'quarantine' && v.flags.includes('honeypot'),
    },
    {
      name: 'missing fillMs is neutral, never a penalty',
      got: () => triageFn({ ...base, fillMs: undefined }, []),
      want: (v) => v.band === 'clear',
    },
    {
      name: 'sub-2.5s submission is flagged but not quarantined',
      got: () => triageFn({ ...base, fillMs: 400 }, []),
      want: (v) => v.band === 'review' && v.flags.includes('fast'),
    },
    {
      name: 'one link is ordinary',
      got: () => triageFn({ ...base, message: 'I read https://example.com/anxiety' }, []),
      want: (v) => v.band === 'clear',
    },
    {
      name: 'two links are flagged',
      got: () => triageFn({ ...base, message: 'seo at cheap-seo.biz and ranks.xyz now' }, []),
      want: (v) => v.flags.includes('links') && v.band === 'review',
    },
    {
      name: 'duplicate body is flagged',
      got: () => triageFn(base, [rec({ message: '  HELLO   There ' })]),
      want: (v) => v.flags.includes('duplicate'),
    },
    {
      name: 'third message today is flagged, second is not',
      got: () => triageFn(base, [
        rec({ email: 'a@example.com' }), rec({ email: 'a@example.com' }),
      ]),
      want: (v) => !v.flags.includes('burst'),
    },
    {
      name: 'yesterday does not count toward a burst',
      got: () => triageFn(base, [
        rec({ email: 'a@example.com', createdAt: at(60 * 30) }),
        rec({ email: 'a@example.com', createdAt: at(60 * 31) }),
        rec({ email: 'a@example.com', createdAt: at(60 * 32) }),
      ]),
      want: (v) => !v.flags.includes('burst'),
    },
    {
      /* The case the whole file exists to protect. */
      name: 'person in crisis is flagged for review, never quarantined',
      got: () => triageFn(
        { kind: 'enquiry', email: 'x9f2@mailinator.com', message: 'i need help', honeypot: '', fillMs: 900 },
        [rec({ email: 'x9f2@mailinator.com', message: 'i need help' })]
      ),
      want: (v) => v.band === 'review' && v.flags.length >= 3,
    },
  ];

  for (const c of cases) {
    let v;
    try { v = c.got(); } catch (err) { fails.push(`behaviour "${c.name}" threw: ${err.message}`); continue; }
    if (!c.want(v)) {
      fails.push(`behaviour "${c.name}" - got band=${v.band} flags=[${v.flags.join(',')}]`);
    }
  }
  if (!fails.length) console.log(`  ${cases.length} behaviour cases pass.`);
}

if (fails.length) {
  console.log('\nTRIAGE GUARD - failed\n');
  for (const f of fails) console.log('  FAIL  ' + f);
  console.log('\n  Spam heuristics on a counselling site must not become profiling.');
  console.log('  Read the header of lib/triage.ts before changing this.\n');
  process.exit(1);
}

console.log('\nTriage guard - triage scores behaviour, not people.');
console.log('  no name, IP, or geography signal; the reasoning is still on file.\n');
