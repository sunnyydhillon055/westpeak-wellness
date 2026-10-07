import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { triage, marketingHits, withholdsMail } from '../lib/triage.ts';

/* 6 Oct 2026: newsletter and sales scripts are kept, shown in /admin, and
   not emailed to anyone. */

const base = { kind: 'enquiry' as const, email: 'a@gmail.com', honeypot: '' };
const SCRIPT = "Hi! I'm interested in special offers. Please keep me posted. I appreciate it. Please send me news and updates by email.";
const BEST_TIME = "Hi there! I'd like to hear more about email updates. I am interested in your latest news. I look forward to hearing from";

test('the 6 Oct /contact script is caught, from the message or the best-time box alone', () => {
  assert.ok(withholdsMail(triage({ ...base, message: SCRIPT, callWindow: BEST_TIME }, [])));
  assert.ok(withholdsMail(triage({ ...base, message: 'I would like counselling for myself please, as soon as you can.', callWindow: BEST_TIME }, [])));
  assert.ok(withholdsMail(triage({ ...base, message: SCRIPT }, [])));
});

test('one phrase never withholds: people mention the newsletter, or ask to be kept posted', () => {
  for (const message of [
    'I signed up for your newsletter. I have been struggling with grief since my father died and would like to book.',
    'Please keep me posted if a Punjabi-speaking counsellor has an opening. My mother needs support.',
    'Saw a special offer elsewhere but I want someone registered. Couples counselling for my wife and me.',
  ]) {
    const v = triage({ ...base, message }, []);
    assert.equal(withholdsMail(v), false, message);
    assert.ok(marketingHits(message) <= 1);
  }
});

test('a lead (one-pager request) is never judged on marketing wording', () => {
  assert.equal(withholdsMail(triage({ ...base, kind: 'lead', message: SCRIPT }, [])), false);
});

test('the submit path stores first and withholds only the mail', () => {
  const s = readFileSync('lib/inbound-submit.ts', 'utf8');
  const stored = s.indexOf('await addInbound(');
  const held = s.indexOf('if (withholdsMail(verdict)) return back(\'ok\');');
  const counted = s.indexOf("'enquiry_submit'");
  const mailed = s.indexOf('sendDetailed(');
  assert.ok(stored > 0 && held > stored, 'stored before the decision');
  assert.ok(held < counted && held < mailed, 'decided before counting or sending');
  assert.match(s, /callWindow,\n\s+fillMs:/);
});
