/* Report the tracked target set: what is covered, what is open, and the
 * weighted ceiling by tier.
 *
 * Reads lib/targets.ts as text rather than importing it, because that file is
 * TypeScript and this runs under plain node. The shape is stable enough that a
 * parse is cheaper than adding a build step for one report.
 *
 *   npm run targets
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const appDir = new URL('../app/', import.meta.url);

/* A route is "built" if a literal page.tsx sits at that path, or if the final
 * segment is served by a dynamic segment directory ([city], [slug], [region],
 * whatever it is named). Hard-coding the segment names meant a new cluster
 * reported DEAD purely because it used a different one. */
function routeExists(route) {
  if (existsSync(new URL(`${route}/page.tsx`, appDir))) return true;
  const parts = route.split('/');
  if (parts.length < 2) return false;
  const parent = parts.slice(0, -1).join('/');
  try {
    return readdirSync(new URL(`${parent}/`, appDir), { withFileTypes: true }).some(
      (d) => d.isDirectory() && /^\[.+\]$/.test(d.name) &&
        existsSync(new URL(`${parent}/${d.name}/page.tsx`, appDir))
    );
  } catch {
    return false;
  }
}

const src = readFileSync(new URL('../lib/targets.ts', import.meta.url), 'utf8');

const rows = [...src.matchAll(/\{\s*query:\s*'([^']+)',\s*tier:\s*(\d)\s*,\s*ceiling:\s*(\d+)\s*,\s*mapPack:\s*(true|false)\s*,?([^}]*)\}/g)]
  .map((m) => ({
    query: m[1],
    tier: Number(m[2]),
    ceiling: Number(m[3]),
    mapPack: m[4] === 'true',
    page: (m[5].match(/page:\s*'([^']+)'/) || [])[1] || null,
  }));

if (!rows.length) {
  console.error('No targets parsed — the shape of lib/targets.ts changed. Fix this script.');
  process.exit(1);
}

const TIER_LABEL = {
  1: 'uncontested intersection',
  2: 'winnable with authority',
  3: 'structurally capped',
};

let openCount = 0;
let missingRoute = 0;

for (const tier of [1, 2, 3]) {
  const group = rows.filter((r) => r.tier === tier);
  if (!group.length) continue;
  const avg = Math.round(group.reduce((s, r) => s + r.ceiling, 0) / group.length);
  console.log(`\n  Tier ${tier} — ${TIER_LABEL[tier]}   (${group.length} targets, avg ceiling ${avg})`);
  console.log('  ' + '-'.repeat(74));
  for (const r of group) {
    let mark;
    if (!r.page) {
      mark = 'OPEN';
      openCount++;
    } else {
      /* A `page` value that points at nothing is worse than an open gap: it
       * reads as covered in every report while ranking for nothing. */
      const route = r.page.replace(/^\//, '');
      mark = routeExists(route) ? ' ok ' : 'DEAD';
      const built = mark === ' ok ';
      if (!built) missingRoute++;
    }
    console.log(
      `  ${mark}  ${String(r.ceiling).padStart(4)}  ${r.mapPack ? 'pack' : '  — '}  ${r.query}`
    );
  }
}

const overall = Math.round(rows.reduce((s, r) => s + r.ceiling, 0) / rows.length);
console.log('\n  ' + '='.repeat(74));
console.log(`  ${rows.length} targets · weighted ceiling ${overall} · ${openCount} open · ${missingRoute} dead route(s)`);
console.log(`  Map pack unreachable on ${rows.filter((r) => r.mapPack).length} of ${rows.length}.`);
console.log('');

if (missingRoute) {
  console.error(`  ${missingRoute} target(s) claim a page that does not exist.`);
  process.exit(1);
}
