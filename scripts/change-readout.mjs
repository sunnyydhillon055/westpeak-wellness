#!/usr/bin/env node
/* Read out the change register: did each change move its one metric?
 *
 *   node --experimental-strip-types scripts/change-readout.mjs            every change
 *   node --experimental-strip-types scripts/change-readout.mjs <id>       one change
 *   node --experimental-strip-types scripts/change-readout.mjs --due      only those past read-after
 *   ... --snapshots <dir>   read weekly snapshots from a folder of JSON files
 *                           (analytics/snapshots/*.json downloaded) instead of the store
 *
 * (The flag is needed on Node 22, which .nvmrc names; Node 23.6 and later
 * strip types without it.)
 *
 * WHY. data/changes.json records what shipped, where and when, and which
 * one number each change was meant to move. This compares the 28 days
 * before with the 28 days after, on the touched pages against every other
 * page over the same weeks, and prints a 95% Poisson interval for the
 * ratio. When the interval includes "no change" it says "too few to tell",
 * which at this practice's volume is the usual and honest answer. The
 * arithmetic is lib/change-register.ts, the same code the monthly email
 * runs, so the two cannot disagree.
 *
 * WHERE THE COUNTS COME FROM
 *   conv:<event>   weekly snapshots of the conversion log. Read from the
 *                  Blob store when BLOB_READ_WRITE_TOKEN is set (read only;
 *                  the token is never printed), or from --snapshots <dir>.
 *   gsc:clicks     data/gsc/*-pages.csv, the committed Search Console exports
 *   tally:<field>  the booking tally, as copied into each snapshot
 *
 * Reads only. Writes nothing, sends nothing.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readChanges, readout } from '../lib/change-register.ts';
import { readGscExports } from '../lib/gsc-summary.ts';

const args = process.argv.slice(2);
const dueOnly = args.includes('--due');
const dirArg = args.indexOf('--snapshots');
const snapDir = dirArg >= 0 ? args[dirArg + 1] : null;
const wanted = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--snapshots');

function parseSnap(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.takenAt !== 'string') return null;
  const events = raw.conversions && typeof raw.conversions.events === 'object' ? raw.conversions.events : {};
  const since = typeof raw.conversions?.since === 'string' ? raw.conversions.since : undefined;
  return { takenAt: raw.takenAt, conversions: { events, since }, bookings: raw.bookings };
}

async function loadSnapshots() {
  if (snapDir) {
    return readdirSync(snapDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => parseSnap(JSON.parse(readFileSync(join(snapDir, f), 'utf8'))))
      .filter(Boolean);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log('(No BLOB_READ_WRITE_TOKEN and no --snapshots folder: conv: and tally: metrics will say no data.)\n');
    return [];
  }
  const { list, get } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: 'analytics/snapshots/', limit: 1000 });
  const out = [];
  for (const b of blobs) {
    if (!/\/\d{4}-\d{2}-\d{2}\.json$/.test(b.pathname)) continue;
    const hit = await get(b.pathname, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) continue;
    const snap = parseSnap(await new Response(hit.stream).json());
    if (snap) out.push(snap);
  }
  return out;
}

const changes = readChanges(join(process.cwd(), 'data', 'changes.json'));
if (!changes.length) {
  console.error('data/changes.json has no changes, or could not be read.');
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const picked = changes
  .filter((c) => !wanted || c.id === wanted)
  .filter((c) => !dueOnly || c.readAfter <= today);
if (wanted && !picked.length) {
  console.error(`No change with id ${wanted}. Ids: ${changes.map((c) => c.id).join(', ')}`);
  process.exit(1);
}

const snaps = await loadSnapshots();
const gsc = readGscExports(join(process.cwd(), 'data', 'gsc'));
console.log(`${snaps.length} weekly snapshot(s), ${gsc.length} Search Console export(s).\n`);

for (const c of picked) {
  const r = readout(c, snaps, gsc);
  const due = c.readAfter <= today ? 'due' : `read after ${c.readAfter}`;
  console.log(`${c.id}  [${c.metric}, ${due}]`);
  if (c.pages.length) console.log(`  pages: ${c.pages.join(' ')}`);
  if (r.status !== 'ok') {
    console.log(`  ${r.reason}`);
  } else {
    console.log(`  touched:   ${r.touched.before} before → ${r.touched.after} after`);
    if (r.untouched) console.log(`  untouched: ${r.untouched.before} before → ${r.untouched.after} after`);
    console.log(`  ${r.verdict}`);
  }
  console.log('');
}
