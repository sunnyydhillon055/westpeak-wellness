/* "GOTTMAN-TRAINED" ONLY WHERE A ROSTER RECORD SAYS SO — 1 Oct 2026.
 *
 * DECISIONS chose "Gottman-informed" for couples work because the training
 * level of the counsellor who offers it is not recorded. The only entry that
 * states Gottman training is the founder's own focus line in
 * lib/practitioners.ts, and she is not taking new clients; yet the Langley
 * FAQ (rendered on the counsellors' Langley place pages too) said "This
 * practice is EMDR- and Gottman-trained". Nothing stopped it.
 *
 * This fails on "Gottman-trained" (or "Gottman trained") anywhere in lib/,
 * app/ or components/ except inside a roster entry in lib/practitioners.ts
 * that is the founder's, or that carries a `gottmanTraining:` field — the
 * record that would confirm a level. Add that field to a counsellor's entry
 * when the owner confirms her training (owner item #67), and her own copy may
 * then say it. Run by scripts/seo-audit.mjs; tested in test/gottman-claims. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const FOUNDER_SLUG = 'aman-bains-dhillon';
const CLAIM = /gottman[-\s]trained/i;
const SLUG = /^\s*slug:\s*['"]([^'"]+)['"]/;
const EXT = /\.(ts|tsx|mts|mjs|js|md)$/;

/** Roster entries in lib/practitioners.ts allowed to say it: the founder,
 *  and any entry recording a `gottmanTraining` level. */
export function allowedSlugs(practitionersSource) {
  const lines = practitionersSource.split('\n');
  const allowed = new Set([FOUNDER_SLUG]);
  let current = null;
  for (const line of lines) {
    const m = line.match(SLUG);
    if (m) current = m[1];
    if (current && /\bgottmanTraining\s*:/.test(line)) allowed.add(current);
  }
  return allowed;
}

/** Every unconfirmed claim in one file's text. `isRoster` marks
 *  lib/practitioners.ts, where a claim inside an allowed entry is fine. */
export function claimsIn(file, text, isRoster = false) {
  const out = [];
  const allowed = isRoster ? allowedSlugs(text) : new Set();
  let current = null;
  text.split('\n').forEach((line, i) => {
    const m = line.match(SLUG);
    if (m) current = m[1];
    if (!CLAIM.test(line)) return;
    if (isRoster && current && allowed.has(current)) return;
    out.push({ file, line: i + 1, text: line.trim().slice(0, 120) });
  });
  return out;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(name)) yield p;
  }
}

/** The scan over lib/, app/ and components/ under `root`. */
export function scanGottmanClaims(root) {
  const problems = [];
  for (const top of ['lib', 'app', 'components']) {
    let files;
    try { files = [...walk(join(root, top))]; } catch { continue; }
    for (const f of files) {
      const rel = relative(root, f).replace(/\\/g, '/');
      problems.push(...claimsIn(rel, readFileSync(f, 'utf8'), rel === 'lib/practitioners.ts'));
    }
  }
  return problems;
}
