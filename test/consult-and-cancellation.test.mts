import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  CONSULT_MINUTES, FALLBACK_CATALOG, withDecidedConsult, type Catalog,
} from '../lib/cliniko-catalog.ts';
import { CONSULT_TYPE } from '../lib/site.ts';
import {
  CANCELLATION_RULE, CANCELLATION_TERMS, LATE_CANCELLATION_KEPT_PERCENT,
} from '../lib/policies.ts';
import { LISTINGS_ANSWER, faqs } from '../lib/faq.ts';
import { paidCancellationTerms } from '../lib/booking-mail.ts';

/* OWNER DECISIONS, 3 OCT 2026.
 *
 * 1. The free consultation is 15 minutes, not 30. Every page, email and feed
 *    said 30, in about four hundred places across three languages; this
 *    fails if any of them says it again.
 * 2. Payment and cancellation: card at booking, a full refund with at least
 *    24 hours' notice, 50% of the fee kept for less notice or a no-show.
 *    One constant in lib/policies.ts; this holds its three facts in place. */

const ROOTS = ['app', 'components', 'lib', 'docs', 'kits'];
const EXT = /\.(tsx?|mts|mjs|md|html|css)$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

/* Phrasings that state the consultation's length as thirty minutes. Words
   and numerals, English, Punjabi and Tagalog. "thirty-minute cache" and
   "expires in 30 minutes" are not here: they are not the consultation. */
const THIRTY_MINUTE_CONSULT: RegExp[] = [
  /\b(free|first) 30[- ]?min/i,
  /\b30[- ]?min(ute)?s?,? (free|consult|call|video call|conversation|by (secure )?video|over secure video)/i,
  /\b30 minutes (by|over) (secure )?video/i,
  /\bfree,? 30 minutes\b/i,
  /\bfirst (30|thirty) minutes (are|is) free/i,
  /consultation is (30|thirty) minutes/i,
  /\bthirty[- ]minute (consult|call|video)/i,
  /\b(free )?thirty free minutes\b/i,
  /\bthirty minutes,? (free|by video|over secure video|by secure video)/i,
  /\bfree thirty[- ]minute/i,
  /Free · 30 minutes/,
  /(30|੩੦) ਮਿੰਟ/,
  /tatlumpung minuto/i,
  /\bLibreng 30\b/i,
];

test('no page, email or feed says the free consultation is 30 minutes', () => {
  const hits: string[] = [];
  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const re of THIRTY_MINUTE_CONSULT) {
          if (re.test(line)) hits.push(`${file}:${i + 1} ${re} :: ${line.trim().slice(0, 120)}`);
        }
      });
    }
  }
  assert.deepEqual(hits, [], `the free consultation is ${CONSULT_MINUTES} minutes:\n${hits.join('\n')}`);
});

test('the consultation length is 15 everywhere it is computed', () => {
  assert.equal(CONSULT_MINUTES, 15);
  assert.equal(FALLBACK_CATALOG.items.find((i) => i.id === CONSULT_TYPE)!.minutes, 15);
  assert.match(LISTINGS_ANSWER, /The free consultation is 15 minutes\./);
  assert.ok(faqs.some((f) => /free 15-minute consultation/.test(f.a)));
});

test('a live catalogue still saying 30 renders 15 for the consultation and leaves sessions alone', () => {
  const live: Catalog = {
    ...FALLBACK_CATALOG,
    live: true,
    items: FALLBACK_CATALOG.items.map((i) => (i.id === CONSULT_TYPE ? { ...i, minutes: 30 } : i)),
  };
  const pinned = withDecidedConsult(live);
  assert.equal(pinned.items.find((i) => i.id === CONSULT_TYPE)!.minutes, 15);
  for (const i of pinned.items.filter((x) => x.id !== CONSULT_TYPE)) {
    assert.equal(i.minutes, live.items.find((x) => x.id === i.id)!.minutes, i.name);
  }
  assert.equal(withDecidedConsult(FALLBACK_CATALOG), FALLBACK_CATALOG, 'unchanged when already 15');
});

test('the cancellation terms state card at booking, 24 hours, full refund and 50%', () => {
  assert.equal(LATE_CANCELLATION_KEPT_PERCENT, 50);
  assert.match(CANCELLATION_TERMS, /card is taken at booking/);
  assert.match(CANCELLATION_TERMS, /\b24 hours\b/);
  assert.match(CANCELLATION_TERMS, /full refund/);
  assert.match(CANCELLATION_TERMS, /50% of the fee is kept/);
  assert.match(CANCELLATION_TERMS, /no-show/);
  assert.ok(CANCELLATION_TERMS.endsWith(CANCELLATION_RULE));
  assert.doesNotMatch(CANCELLATION_TERMS, /full fee|100%|no refund/i);
});

test('the paid-booking email, /pricing and the FAQ use the one rule, and nothing charges the full fee for a late cancellation', () => {
  assert.ok(paidCancellationTerms().includes(CANCELLATION_RULE));
  const pay = faqs.find((f) => f.q === 'How do I pay, and when?')!;
  assert.ok(pay.a.includes(CANCELLATION_RULE));
  const pricing = readFileSync('app/pricing/page.tsx', 'utf8');
  assert.match(pricing, /CANCELLATION_RULE/);
  assert.match(pricing, /CANCELLATION_TERMS/);
  const contradictions = /(full fee|whole fee|100%)[^.]{0,60}(late cancel|no-show|less than 24)|(late cancel|no-show|less than 24)[^.]{0,60}(full fee|whole fee|100%)/i;
  for (const root of ['app', 'components', 'lib']) {
    for (const file of walk(root)) {
      assert.doesNotMatch(readFileSync(file, 'utf8'), contradictions, file);
    }
  }
});
