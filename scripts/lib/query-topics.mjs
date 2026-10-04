/**
 * Shared by scripts/ctr-delta.mjs (Google exports) and scripts/bing-ai.mjs
 * (Bing AI Performance exports): the CSV reader, the 3 Oct 2026 topic
 * buckets, and the test for a conversational, AI-Mode-style follow-up query.
 *
 * The five buckets are the five topic decisions of 3 Oct 2026 in DECISIONS.md
 * (branches wf/tp-leave, wf/tp-rcc, wf/tp-language-brand, wf/tp-modalities and
 * wf/tp-places), so a query lands in the same bucket the decision that answers
 * it was filed under. Anything else is `other`.
 */

/* ── tiny CSV reader. GSC and Bing exports are well-formed and quote only
   when needed. Moved here from ctr-delta.mjs on 3 Oct 2026 unchanged. */
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const head = rows.shift().map((h) => h.replace(/^﻿/, '').trim());
  return rows.filter((r) => r.length === head.length && r.some(Boolean))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

export const num = (v) => Number(String(v ?? '').replace(/[%,]/g, '')) || 0;

/* In the order they are tested: the first match wins, so "stress leave
   surrey" is leave, not places. */
export const TOPICS = [
  ['leave', /\b(leave|sick|disability|ei|fired|employer|boss|work(place)?|return to work|time off|days? off|mental health days?|paid leave|ltd|std|worksafe|wcb|doctor'?s note|quit)\b/],
  ['rcc', /\b(rcc|registered clinical|clinical counsell?or|psychologist|psychotherapist|regulat\w*|bcacc|msp|extended health|insurance|covered|coverage|benefits?|manulife|sun life|canada life|blue cross|green ?shield|cost|fee|price)\b/],
  ['language-brand', /\b(punjabi|tagalog|filipino|pilipino|hindi|urdu|south asian|westpeak|west peak|meaning)\b/],
  ['modalities', /\b(emdr|cbt|act|dbt|ifs|internal family|somatic|gottman|couples?|marriage|family therapy|mindfulness|trauma|ptsd)\b/],
  ['places', /\b(bc|b\.c\.|british columbia|alberta|vancouver|surrey|white rock|abbotsford|langley|burnaby|richmond|coquitlam|delta|chilliwack|kelowna|kamloops|victoria|nanaimo|prince george|mission|maple ridge|calgary|edmonton|near me)\b/],
];

export function topicOf(query) {
  const q = String(query ?? '').toLowerCase();
  for (const [name, re] of TOPICS) if (re.test(q)) return name;
  return 'other';
}

/* A follow-up typed into Google's AI Mode, or Copilot, reads like the next
   line of a conversation: long, a question mark, or an opener that only
   makes sense after an earlier answer ("what about bc?", "can i be fired for
   this?"). Counted from data/gsc on 3 Oct 2026: 18 such queries on 6 Sep,
   rising to 41 on 3 Oct. */
const OPENERS = /^(yes|no|yeah|ok|okay|what about|how about|and what|can i be|so )\b/;
export function isConversational(query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return false;
  if (q.endsWith('?')) return true;
  if (q.split(/\s+/).length >= 9) return true;
  return OPENERS.test(q);
}
