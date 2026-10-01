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

export const PATTERNS = [
  /\bmost (?:major )?(?:BC )?(?:extended[- ]health )?plans (?:that (?:cover|list) [^.;]{1,60}? )?(?:reimburse|cover|will)\b/i,
  /\bthrough most (?:BC )?extended[- ]health plans\b/i,
];

export const PENDING = [
  { file: 'lib/resources.ts', fragment: 'is not free, and most extended health plans reimburse it' },
  { file: 'lib/resources-more.ts', fragment: 'Most major BC extended-health plans reimburse RCC counselling' },
  { file: 'lib/resources-more3.ts', fragment: 'most extended health plans that list an RCC reimburse the sessions' },
  { file: 'lib/resources-more3.ts', fragment: 'Most extended health plans that list a Registered Clinical Counsellor reimburse' },
  { file: 'lib/guides-drafts.ts', fragment: 'most BC extended health plans that cover an RCC cover this work' },
  { file: 'lib/locations.ts', fragment: 'Most BC plans that list Registered Clinical Counsellors will' },
  { file: 'app/services/page.tsx', fragment: 'reimbursable through most extended health plans' },
  { file: 'lib/depth4.ts', fragment: 'Most plans cover Registered Clinical Counsellors, and the annual cap' },
];

/** Every unconditional coverage claim in `text`, as { line, text }. */
export function coverageClaims(text) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    for (const re of PATTERNS) {
      const m = line.match(re);
      if (m) { out.push({ line: i + 1, match: m[0] }); break; }
    }
  });
  return out;
}

const EXT = /\.(ts|tsx|mts|mjs|js)$/;
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(name)) yield p;
  }
}

/** Hits not covered by PENDING, and PENDING entries that matched nothing. */
export function scanCoverageClaims(root, pending = PENDING) {
  const problems = [];
  const used = new Set();
  for (const top of ['lib', 'app', 'components']) {
    let files;
    try { files = [...walk(join(root, top))]; } catch { continue; }
    for (const f of files) {
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
