/* "MOST BC PLANS REIMBURSE" IS NOT A FACT THE PRACTICE CAN STATE — 1 Oct 2026.
 *
 * Whether a plan reimburses a Registered Clinical Counsellor depends on the
 * plan an employer bought; the site's own coverage pages say so. Commit
 * 509a346 rewrote the FAQ, the policies and the listings pack to "many plans,
 * depending on the plan", and thirteen more places, including the booking
 * card on every service page, kept saying "most BC extended health plans
 * reimburse". This fails on that wording anywhere in lib/, app/ or
 * components/, so the sweep does not have to be done a third time.
 *
 * The allowed form: "Many extended health plans reimburse an RCC, depending
 * on the plan; check yours", with the coverage page linked where the copy can
 * carry a link.
 *
 * ACROSS LINE BREAKS, AND OFF THE SITE TOO — 1 Oct 2026 (item 268, 258).
 * components/CoverageLine.tsx said "Most BC{' '}<Link …>extended health
 * plans</Link>{' '} reimburse" on every guide, resource, /for and city hub for
 * a week after the sweep, because JSX split the phrase over three source
 * lines and this matched one line at a time. Each line is now also matched
 * joined to the two after it, with JSX spacers, tags and markdown quote marks
 * taken out, and a hit is reported on the first line the phrase needs. The
 * "list", "recognise", "Most, not all" and "trades plans" shapes are added.
 * docs/, kits/ and the August outreach kit are scanned as well: they are the
 * words partners paste onto their own pages, where nobody can correct them.
 *
 *   node scripts/coverage-claims.mjs        exit 1 on any hit
 *
 * Also run from scripts/seo-audit.mjs, which is part of verify:ci.
 *
 * PENDING: occurrences in files another change owns, each named by file and
 * a fragment of its text (not a line number, which moves). Remove an entry
 * when the sentence is rewritten; an entry that no longer matches anything is
 * reported (a warning, not a failure, so another change fixing the sentence
 * first does not break this build) so the list cannot quietly go stale. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const PLAN_KIND = String.raw`(?:extended(?:[- ]health)? |student[- ]society (?:health )?|trades |union |group )?`;
export const PATTERNS = [
  new RegExp(String.raw`\bmost (?:major )?(?:BC )?${PLAN_KIND}plans (?:that (?:cover|list) [^.;]{1,60}? )?(?:do )?(?:reimburse|cover|will|list(?:ing)?|recogni[sz]e|do\b(?! not))\b`, 'i'),
  new RegExp(String.raw`\bmost,? not all:?\s+(?:BC )?${PLAN_KIND}plans\b`, 'i'),
  /\bmost (?:BC )?students are covered\b/i,
  /\bmost (?:BC )?(?:teachers|employees|workers|union members) (?:can|are covered|have coverage)\b/i,
  /\bthrough most (?:BC )?extended[- ]health plans\b/i,
  /* 2 Oct 2026 (item 381): "Most <up to five words> plans … reimburse", which
     the shapes above missed in "Most health-employer and union plans in BC
     reimburse", and "usually reimburses" an RCC or counselling, which they
     missed on the newcomers page. A "not" or "never" in between is a denial,
     not a claim. */
  /\bmost (?:[\w-]+,? ){0,5}plans\b(?:(?!\b(?:not|never)\b)[^.;]){0,40}?\breimburses?\b/i,
  /\busually reimburses? (?:a |an )?(?:Registered Clinical Counsell|RCC|counsell)/i,
];

export const PENDING = [
];

/* What a line looks like once the markup between words is gone: JSX spacers
   ({' '}), tags (<Link href="…">, </Link>), a markdown quote mark, and runs
   of whitespace. */
const plain = (line) =>
  line
    .replace(/^\s*>\s?/, '')
    .replace(/\{\s*(['"`])\s*\1\s*\}/g, ' ')
    .replace(/<\/?[A-Za-z][^<>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const firstMatch = (text) => {
  for (const re of PATTERNS) {
    const m = text.match(re);
    if (m) return m[0];
  }
  return null;
};

/** Every unconditional coverage claim in `text`, as { line, match }. A claim
 *  split across up to three lines is reported once, on its first line. */
export function coverageClaims(text) {
  const lines = text.split('\n').map(plain);
  const window = (i) => lines.slice(i, i + 3).join(' ');
  const out = [];
  lines.forEach((line, i) => {
    const alone = firstMatch(line);
    if (alone) { out.push({ line: i + 1, match: alone }); return; }
    const joined = firstMatch(window(i));
    /* Only when the phrase needs this line: the window that starts on the
       next line must not already hold it. */
    if (joined && !firstMatch(window(i + 1))) out.push({ line: i + 1, match: joined });
  });
  return out;
}

const EXT = /\.(ts|tsx|mts|mjs|js|md|html)$/;
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(name)) yield p;
  }
}

/** The site's source, and the off-site copy partners paste from. */
export const ROOTS = ['lib', 'app', 'components', 'docs', 'kits', 'OUTREACH_KIT_2026-08-28.md'];

function filesUnder(root, top) {
  const p = join(root, top);
  try {
    return statSync(p).isDirectory() ? [...walk(p)] : [p];
  } catch {
    return [];
  }
}

/** Hits not covered by PENDING, and PENDING entries that matched nothing. */
export function scanCoverageClaims(root, pending = PENDING) {
  const problems = [];
  const used = new Set();
  for (const top of ROOTS) {
    for (const f of filesUnder(root, top)) {
      const rel = relative(root, f).replace(/\\/g, '/');
      const lines = readFileSync(f, 'utf8').split('\n');
      for (const hit of coverageClaims(lines.join('\n'))) {
        const line = lines[hit.line - 1];
        const p = pending.findIndex((x) => x.file === rel && line.includes(x.fragment));
        if (p >= 0) { used.add(p); continue; }
        problems.push({ file: rel, line: hit.line, match: hit.match });
      }
    }
  }
  const stale = pending.filter((_, i) => !used.has(i));
  return { problems, stale };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { problems, stale } = scanCoverageClaims(process.cwd());
  for (const p of problems) console.log(`  COVERAGE  ${p.file}:${p.line}  "${p.match}"  — say "many plans, depending on the plan; check yours"`);
  for (const s of stale) console.log(`  stale     PENDING entry for ${s.file} ("${s.fragment}") matches nothing; remove it`);
  if (problems.length) process.exit(1);
  console.log('  ok  no "most plans reimburse" claims outside the pending list');
}
