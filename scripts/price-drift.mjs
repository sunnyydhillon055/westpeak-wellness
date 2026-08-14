/* Does the website quote the prices the practice actually charges?
 *
 * Fees appear in three hand-maintained places, and nothing has ever stopped
 * them drifting apart from Cliniko:
 *
 *   app/pricing/page.tsx            the fee table
 *   app/services/[slug]/page.tsx    the FEE_FOR / DURATION_FOR maps
 *   lib/cliniko-catalog.ts          the FALLBACK used when Cliniko is down
 *
 * The failure mode is silent: nothing errors, the page renders, and a client
 * arrives at checkout expecting a different number. This turns that into a
 * build-time failure.
 *
 *   CLINIKO_API_KEY=... node scripts/price-drift.mjs
 *
 * Exits non-zero on any mismatch so it can gate a deploy.
 */
import { readFileSync } from 'node:fs';

const key = (process.env.CLINIKO_API_KEY || '').trim();
if (!key) {
  console.error('\n  CLINIKO_API_KEY not set — cannot compare against Cliniko.\n');
  process.exit(2); // 2, not 1: "could not check" is not "found drift".
}

const shard = (key.match(/-([a-z]{2}\d)$/i) || [])[1];
const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');
const H = { Authorization: auth, Accept: 'application/json', 'User-Agent': 'Westpeak price-drift (info@westpeakwellness.com)' };
const get = async (u) => {
  const r = await fetch(u.startsWith('http') ? u : `https://api.${shard}.cliniko.com/v1${u}`, { headers: H });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${u}`);
  return r.json();
};

/* ---- live ---------------------------------------------------------------- */
const live = new Map();
for (const t of (await get('/appointment_types?per_page=100')).appointment_types ?? []) {
  if (t.archived_at) continue;
  let price = null;
  try {
    const rel = await get(t.appointment_type_billable_items.links.self);
    const item = await get(rel.appointment_type_billable_items[0].billable_item.links.self);
    price = Number(item.price);
  } catch { /* no billable item linked; reported as null below */ }
  live.set(t.name.trim(), { price, minutes: Number(t.duration_in_minutes) });
}

/* ---- what the site says -------------------------------------------------- */
const pricing = readFileSync('app/pricing/page.tsx', 'utf8');
const svc = readFileSync('app/services/[slug]/page.tsx', 'utf8');
const fallback = readFileSync('lib/cliniko-catalog.ts', 'utf8');

/* Rows look like: <td>Individual</td><td>50 min</td><td>$140</td> */
const rows = [...pricing.matchAll(/<td>([^<]+)<\/td><td>(\d+)\s*min<\/td><td>\$(\d+)<\/td>/g)]
  .map((m) => ({ label: m[1].trim(), minutes: Number(m[2]), price: Number(m[3]) }));

/* The pricing table uses short labels; map them onto Cliniko's names. */
const LABEL_TO_CLINIKO = {
  'Individual': 'Individual Counselling',
  'Couples': 'Couples Counselling',
  'Couples extended': 'Couples Extended',
  'EMDR intensive': 'EMDR Intensive',
};

let problems = 0;
const bad = (msg) => { problems++; console.log(`   DRIFT  ${msg}`); };

console.log('\n  /pricing table vs Cliniko');
console.log('  ' + '-'.repeat(72));
for (const r of rows) {
  const name = LABEL_TO_CLINIKO[r.label];
  if (!name) { console.log(`   skip   "${r.label}" — no Cliniko mapping`); continue; }
  const l = live.get(name);
  if (!l) { bad(`"${r.label}" -> "${name}" does not exist in Cliniko`); continue; }
  if (l.price !== null && l.price !== r.price) bad(`${name}: site $${r.price}, Cliniko $${l.price}`);
  else if (l.minutes !== r.minutes) bad(`${name}: site ${r.minutes} min, Cliniko ${l.minutes} min`);
  else console.log(`    ok    ${name.padEnd(24)} $${r.price}  ${r.minutes} min`);
}

console.log('\n  FEE_FOR on service pages');
console.log('  ' + '-'.repeat(72));
const individual = live.get('Individual Counselling');
const couples = live.get('Couples Counselling');
const emdr = live.get('EMDR Intensive');
const expect = {
  'individual-therapy': individual, 'anxiety-counselling': individual,
  'depression-counselling': individual, 'trauma-therapy': individual,
  'punjabi-counselling': individual, 'couples-therapy': couples, 'emdr-therapy': emdr,
};
for (const [slug, l] of Object.entries(expect)) {
  const m = svc.match(new RegExp(`'${slug}':\\s*'\\$(\\d+)'`));
  if (!m) { bad(`FEE_FOR is missing ${slug}`); continue; }
  const shown = Number(m[1]);
  if (l && l.price !== null && l.price !== shown) bad(`${slug}: card $${shown}, Cliniko $${l.price}`);
  else console.log(`    ok    ${slug.padEnd(24)} $${shown}`);
}

console.log('\n  FALLBACK in lib/cliniko-catalog.ts');
console.log('  ' + '-'.repeat(72));
for (const [name, l] of live) {
  if (l.price === null) continue;
  const m = fallback.match(new RegExp(`name: '${name}', minutes: (\\d+), cents: (\\d+)`));
  if (!m) { bad(`FALLBACK has no entry for "${name}"`); continue; }
  const cents = Number(m[2]);
  const minutes = Number(m[1]);
  if (cents !== Math.round(l.price * 100)) bad(`FALLBACK ${name}: ${cents}c, Cliniko ${Math.round(l.price * 100)}c`);
  else if (minutes !== l.minutes) bad(`FALLBACK ${name}: ${minutes} min, Cliniko ${l.minutes} min`);
  else console.log(`    ok    ${name.padEnd(24)} ${cents}c  ${minutes} min`);
}

console.log('\n  ' + '='.repeat(72));
if (problems) {
  console.log(`  ${problems} mismatch(es). The website is quoting something the practice does not charge.\n`);
  process.exit(1);
}
console.log('  No drift. Site and Cliniko agree on every price and duration.\n');
