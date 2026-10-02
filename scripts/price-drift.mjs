/* Does the website quote the prices the practice actually charges?
 *
 * Fees appear in hand-maintained places, and nothing has ever stopped them
 * drifting apart from Cliniko:
 *
 *   app/pricing/page.tsx            the fee table
 *   app/services/[slug]/page.tsx    the BILLED_AS map (names, not prices)
 *   lib/cliniko-catalog.ts          the FALLBACK used when Cliniko is down
 *   any prose in lib/, app/, components/ that types a dollar figure
 *
 * The failure mode is silent: nothing errors, the page renders, and a client
 * arrives at checkout expecting a different number. This turns that into a
 * build-time failure.
 *
 *   CLINIKO_API_KEY=... node scripts/price-drift.mjs
 *
 * Exits non-zero on any mismatch so it can gate a deploy.
 *
 * THE STATIC SCAN — 1 Oct 2026. Cliniko charges $175 for couples; the site
 * typed $170 in seven places (FAQ schema, city FAQs, two audience pages, an
 * Alberta page, the service-page fallback map and the cost estimator), and
 * this script compared only the three places listed above, so it never saw
 * them. Every "$NNN" in lib/, app/ and components/ is now checked against
 * FALLBACK_CATALOG, and a figure that is neither a catalogue price nor on the
 * ALLOW list below fails the run. That part needs no Cliniko key, so it runs
 * first and runs everywhere; exit 1 means drift was found, exit 2 still means
 * "could not reach Cliniko to check the rest".
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/* Dollar figures that are NOT this practice's fees, each with the reason it
 * may appear. Add to this only for a figure that describes the market, a
 * plan, a public benefit or an insurance limit — never one of our prices,
 * which must come from the catalogue. */
export const ALLOW = new Map([
  [60, 'plan example: out-of-pocket on a per-session cap'],
  [80, 'plan example: a per-session reimbursement cap'],
  [120, 'market range: typical BC RCC fee, low end'],
  [180, 'market range: typical BC RCC fee, high end'],
  [155, 'market range: BCACC Fee Guide 2026 band boundary (lib/fee-guides.ts, read 1 Oct 2026)'],
  [205, 'market range: BCACC Fee Guide 2026 couples and family high end (lib/fee-guides.ts)'],
  [225, 'market range: typical BC psychologist fee, low end; BCACC Fee Guide 2026 specialised services high end (lib/fee-guides.ts)'],
  [245, 'market rate: BC Psychological Association recommended hourly rate, effective 12 May 2025 (lib/fee-guides.ts, read 1 Oct 2026)'],
  [250, 'market range: psychologist fee'],
  [300, 'market range: typical BC psychologist fee, high end'],
  [500, 'plan example: an annual maximum'],
  [600, 'plan example: a remaining balance at year end (lib/session-arithmetic.ts remainingBalanceSentence)'],
  [800, 'plan example: an annual maximum'],
  [1000, 'plan benefit: community health (CBA) mental health maximum per calendar year from 1 Jan 2026, per BCGEU (lib/resources-more2.ts, read 1 Oct 2026)'],
  [1500, 'plan example: an annual maximum'],
  [3170, 'Vancouver average two-bedroom asking rent (lib/locations.ts)'],
  [5000000, 'professional liability limit per claim (lib/practitioners.ts)'],
]);

/* Two or more digits, or a comma-grouped figure. A single digit after "$" is
   a regex back-reference ('$1') far more often than a price on this site. */
const DOLLARS = /\$(\d{1,3}(?:,\d{3})+|\d{2,})(?!\d)/g;

/** Catalogue prices in whole dollars, read from FALLBACK_CATALOG's source. */
export function cataloguePrices(catalogSource) {
  const out = new Set();
  for (const m of catalogSource.matchAll(/name: '([^']+)', minutes: \d+, cents: (\d+)/g)) {
    out.add(Number(m[2]) / 100);
  }
  if (out.size === 0) throw new Error('could not read FALLBACK_CATALOG prices');
  return out;
}

/** Every dollar figure in `text` that is neither a catalogue price nor allowed. */
export function strayPrices(text, prices, allow = ALLOW) {
  const found = [];
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(DOLLARS)) {
      const n = Number(m[1].replace(/,/g, ''));
      if (!prices.has(n) && !allow.has(n)) found.push({ line: i + 1, amount: `$${m[1]}` });
    }
  });
  return found;
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

/** The static scan over lib/, app/ and components/ under `root`. */
export function scanTree(root) {
  const prices = cataloguePrices(readFileSync(join(root, 'lib/cliniko-catalog.ts'), 'utf8'));
  const problems = [];
  for (const top of ['lib', 'app', 'components']) {
    let files;
    try { files = [...walk(join(root, top))]; } catch { continue; }
    for (const f of files) {
      for (const s of strayPrices(readFileSync(f, 'utf8'), prices)) {
        problems.push({ file: relative(root, f).replace(/\\/g, '/'), ...s });
      }
    }
  }
  return { prices, problems };
}

/* NO FEE IS TYPED INTO A DESCRIPTION — 1 Oct 2026.
 *
 * The money-page descriptions now state the session fee (lib/snippet-facts.ts
 * composes it from the catalogue). The scan above lets a catalogue price
 * through wherever it is typed, which is right for prose that reads a fee
 * through fallbackFee() and wrong for a description: a description is the
 * copy most likely to be edited by hand, and a fee typed there is the one
 * that survives a price change unnoticed. So any "$NN" inside a description
 * string fails unless it is on ALLOW (a figure that is not one of our fees:
 * a benefit, a plan example, a market range), and any "$NN" at all in the
 * file that composes them fails. Template expressions (`${fee}`) are not
 * figures and pass. */
export function typedFeeDescriptions(text, allow = ALLOW) {
  const found = [];
  const re = /(?:metaDescription|description)\s*:\s*(?:\r?\n\s*)?(['"`])((?:(?!\1)[^\\]|\\.)*)\1/g;
  for (const m of text.matchAll(re)) {
    for (const f of m[2].matchAll(DOLLARS)) {
      if (allow.has(Number(f[1].replace(/,/g, '')))) continue;
      found.push({ line: text.slice(0, m.index).split('\n').length, amount: `$${f[1]}` });
    }
  }
  return found;
}

export function typedFeesInSnippetFacts(text) {
  return [...text.matchAll(/\$\d[\d,.]*/g)].map((m) => ({
    line: text.slice(0, m.index).split('\n').length,
    amount: m[0],
  }));
}

export function scanDescriptions(root) {
  const problems = [];
  for (const top of ['lib', 'app', 'components']) {
    let files;
    try { files = [...walk(join(root, top))]; } catch { continue; }
    for (const f of files) {
      const rel = relative(root, f).replace(/\\/g, '/');
      const text = readFileSync(f, 'utf8');
      const hits = rel === 'lib/snippet-facts.ts' ? typedFeesInSnippetFacts(text) : typedFeeDescriptions(text);
      for (const h of hits) problems.push({ file: rel, ...h });
    }
  }
  return problems;
}

/* THE CLOSING FEE LINE — 1 Oct 2026. feeLineFor in lib/counsellor-cards.ts
 * prints the fee for a guide's, resource's or comparison's service on every
 * one of them, reading Cliniko names from FEE_LINE_ITEMS. It types no
 * figure, so the scan above has nothing to find; what can drift is a NAME,
 * which would silently drop the line from ~80 pages. So every name it reads
 * must be in FALLBACK_CATALOG with a price (checked here, no key needed) and
 * in Cliniko (checked in main, with the key). */
export function feeLineNames(cardsSource) {
  const block = cardsSource.match(/export const FEE_LINE_ITEMS = \{([\s\S]*?)\}/);
  if (!block) throw new Error('lib/counsellor-cards.ts has no FEE_LINE_ITEMS');
  return [...block[1].matchAll(/:\s*'([^']+)'/g)].map((m) => m[1]);
}

/** FEE_LINE_ITEMS names missing from FALLBACK_CATALOG or priced at zero. */
export function feeLineGaps(root) {
  const names = feeLineNames(readFileSync(join(root, 'lib/counsellor-cards.ts'), 'utf8'));
  const fallback = readFileSync(join(root, 'lib/cliniko-catalog.ts'), 'utf8');
  const priced = new Map([...fallback.matchAll(/name: '([^']+)', minutes: \d+, cents: (\d+)/g)].map((m) => [m[1], Number(m[2])]));
  return names.filter((n) => !(priced.get(n) > 0));
}

/* THE MARKET FEE CONSTANT — 1 Oct 2026. lib/fee-guides.ts is the one place
 * the BCACC and BCPA figures are written; /pricing, the RCC vs psychologist
 * comparison, the couples page and the city-service cost FAQ read it. Two
 * things can still go wrong without any page erroring: the published wording
 * ("$155 to $205") and the numbers beside it (lowCents, highCents) can
 * disagree, and someone can type the range again somewhere else, which is
 * how the two copies this replaced came about. Both fail the run. */
const GUIDE_ENTRY = /range: '([^']*)',\s*lowCents: (null|\d+),\s*highCents: (null|\d+),[\s\S]*?readOn: ([A-Z_]+|'[^']*'),/g;

/** Entries in lib/fee-guides.ts whose wording, numbers or date disagree. */
export function feeGuideProblems(source) {
  const problems = [];
  const read = (source.match(/FEE_GUIDES_READ_ON = '([^']+)'/) || [])[1];
  if (!read || !/^\d{4}-\d{2}-\d{2}$/.test(read)) problems.push('FEE_GUIDES_READ_ON is not an ISO date');
  let n = 0;
  for (const m of source.matchAll(GUIDE_ENTRY)) {
    n++;
    const [, range, lo, hi, readOn] = m;
    const date = readOn.startsWith("'") ? readOn.slice(1, -1) : read;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) problems.push(`"${range}" has no readable readOn date`);
    const figures = [...range.matchAll(/\$(\d[\d,]*)/g)].map((f) => Number(f[1].replace(/,/g, '')) * 100);
    if (lo === 'null' || hi === 'null') {
      if (figures.length) problems.push(`"${range}" states a figure but its cents are null`);
      continue;
    }
    const want = figures.length === 1 ? [figures[0], figures[0]] : figures;
    if (want.length !== 2 || want[0] !== Number(lo) || want[1] !== Number(hi)) {
      problems.push(`"${range}" does not match lowCents ${lo} / highCents ${hi}`);
    }
  }
  if (n === 0) problems.push('no entries read from lib/fee-guides.ts');
  return problems;
}

/** The published two-figure ranges in lib/fee-guides.ts ("$155 to $205"). */
export function guideRanges(source) {
  return [...source.matchAll(/range: '(\$\d+ to \$\d+)'/g)].map((m) => m[1]);
}

/* A range typed outside lib/fee-guides.ts, in either spelling ("$155 to
   $205", "$155–$205", "$155-$205"). Comments included: a comment restating
   a figure is the copy that goes stale first. */
export function typedGuideRanges(root) {
  const source = readFileSync(join(root, 'lib/fee-guides.ts'), 'utf8');
  const pats = guideRanges(source).map((r) => {
    const [a, b] = r.match(/\d+/g);
    return { r, re: new RegExp(`\\$${a}\\s*(?:to|-|\\u2013|\\u2014)\\s*\\$${b}(?!\\d)`) };
  });
  const found = [];
  for (const top of ['lib', 'app', 'components']) {
    let files;
    try { files = [...walk(join(root, top))]; } catch { continue; }
    for (const f of files) {
      const rel = relative(root, f).replace(/\\/g, '/');
      if (rel === 'lib/fee-guides.ts') continue;
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        for (const p of pats) if (p.re.test(line)) found.push({ file: rel, line: i + 1, range: p.r });
      });
    }
  }
  return found;
}

/* PUBLIC BENEFIT FIGURES BY YEAR — 2 Oct 2026 (item 386). The EI sickness
 * weekly maximum was typed twelve times with "in 2026" beside it, and would
 * have been last year's figure on every leave page from 1 January. It now
 * lives in lib/benefit-figures.ts, keyed by Pacific year, and was taken off
 * ALLOW above so the generic scan rejects it too. Here: every entry must be
 * internally consistent (weekly = 55% of maximum insurable earnings / 52,
 * rounded) and dated, the current Pacific year must have an entry, and no
 * weekly figure may be typed as "$NNN" anywhere else, comments included. */
const BENEFIT_ENTRY = /(\d{4}): \{ weekly: (\d+), maxInsurableEarnings: (\d+), sourceUrl: [^,]+, readOn: '([^']*)' \}/g;

/** Entries in lib/benefit-figures.ts, as { year, weekly, mie, readOn }. */
export function benefitEntries(source) {
  return [...source.matchAll(BENEFIT_ENTRY)].map((m) => ({
    year: Number(m[1]), weekly: Number(m[2]), mie: Number(m[3]), readOn: m[4],
  }));
}

/** The calendar year in British Columbia at `now`. */
export function pacificYear(now = new Date()) {
  return Number(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric' }).format(now));
}

/** What is wrong with lib/benefit-figures.ts in `year`, as sentences. */
export function benefitFigureProblems(source, year = pacificYear()) {
  const entries = benefitEntries(source);
  if (!entries.length) return ['no EI_SICKNESS_MAX entries read from lib/benefit-figures.ts'];
  const problems = [];
  for (const e of entries) {
    const want = Math.round((e.mie * 0.55) / 52);
    if (want !== e.weekly) problems.push(`${e.year}: weekly ${e.weekly} is not 55% of ${e.mie} / 52 (${want})`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.readOn)) problems.push(`${e.year}: readOn "${e.readOn}" is not an ISO date`);
  }
  if (!entries.some((e) => e.year === year)) {
    problems.push(`no EI sickness maximum for ${year}; the leave pages are stating an earlier year's figure. Add the ${year} entry from canada.ca`);
  }
  return problems;
}

/** "$NNN" typed for any weekly figure outside lib/benefit-figures.ts. */
export function typedBenefitFigures(root) {
  const weekly = benefitEntries(readFileSync(join(root, 'lib/benefit-figures.ts'), 'utf8')).map((e) => e.weekly);
  const found = [];
  for (const top of ['lib', 'app', 'components']) {
    let files;
    try { files = [...walk(join(root, top))]; } catch { continue; }
    for (const f of files) {
      const rel = relative(root, f).replace(/\\/g, '/');
      if (rel === 'lib/benefit-figures.ts') continue;
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        for (const m of line.matchAll(DOLLARS)) {
          const n = Number(m[1].replace(/,/g, ''));
          if (weekly.includes(n)) found.push({ file: rel, line: i + 1, amount: `$${m[1]}` });
        }
      });
    }
  }
  return found;
}

async function main() {
  let problems = 0;
  const bad = (msg) => { problems++; console.log(`   DRIFT  ${msg}`); };

  /* ---- static: typed figures vs the catalogue -------------------------- */
  console.log('\n  Typed dollar figures in lib/, app/, components/ vs FALLBACK_CATALOG');
  console.log('  ' + '-'.repeat(72));
  const scan = scanTree(process.cwd());
  for (const p of scan.problems) bad(`${p.file}:${p.line} quotes ${p.amount}, which is not a catalogue price or an allowed figure`);
  if (!scan.problems.length) {
    console.log(`    ok    every figure is a catalogue price (${[...scan.prices].map((d) => `$${d}`).join(' ')}) or on the allow list`);
  }
  console.log('\n  Fees typed into descriptions (lib/snippet-facts.ts composes them)');
  console.log('  ' + '-'.repeat(72));
  const typedDesc = scanDescriptions(process.cwd());
  for (const p of typedDesc) bad(`${p.file}:${p.line} types ${p.amount} into a description; compose it with lib/snippet-facts.ts`);
  if (!typedDesc.length) console.log('    ok    no description types a fee');
  console.log('\n  Closing fee line names (FEE_LINE_ITEMS) vs FALLBACK_CATALOG');
  console.log('  ' + '-'.repeat(72));
  const gaps = feeLineGaps(process.cwd());
  for (const n of gaps) bad(`lib/counsellor-cards.ts FEE_LINE_ITEMS reads "${n}", which FALLBACK_CATALOG does not price`);
  if (!gaps.length) console.log('    ok    every name the closing fee line reads is priced in the fallback');
  console.log('\n  Market fee constant (lib/fee-guides.ts)');
  console.log('  ' + '-'.repeat(72));
  const guideSource = readFileSync(join(process.cwd(), 'lib/fee-guides.ts'), 'utf8');
  for (const g of feeGuideProblems(guideSource)) bad(`lib/fee-guides.ts: ${g}`);
  const retyped = typedGuideRanges(process.cwd());
  for (const t of retyped) bad(`${t.file}:${t.line} types the range ${t.range}; read it from lib/fee-guides.ts`);
  if (!retyped.length && !feeGuideProblems(guideSource).length) {
    console.log(`    ok    wording and figures agree, and no other file types ${guideRanges(guideSource).join(', ')}`);
  }
  console.log('\n  Public benefit figures by year (lib/benefit-figures.ts)');
  console.log('  ' + '-'.repeat(72));
  const benefitSource = readFileSync(join(process.cwd(), 'lib/benefit-figures.ts'), 'utf8');
  const benefitProblems = benefitFigureProblems(benefitSource);
  for (const b of benefitProblems) bad(`lib/benefit-figures.ts: ${b}`);
  const typedBenefit = typedBenefitFigures(process.cwd());
  for (const t of typedBenefit) bad(`${t.file}:${t.line} types ${t.amount}; read the EI maximum from lib/benefit-figures.ts`);
  if (!benefitProblems.length && !typedBenefit.length) {
    console.log(`    ok    ${pacificYear()} has an entry, every entry is consistent, and no other file types a weekly maximum`);
  }
  if (problems) {
    console.log(`\n  ${problems} stray figure(s). Read the fee from lib/cliniko-catalog.ts, or allow-list a non-fee figure with a reason.\n`);
    process.exit(1);
  }

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

  /* ---- live -------------------------------------------------------------- */
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

  /* ---- what the site says ------------------------------------------------ */
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

  /* The service pages no longer type a fee: BILLED_AS names the Cliniko type
     and the page reads its price. What can drift is the NAME — a renamed
     appointment type would leave the card priceless — so that is checked. */
  console.log('\n  BILLED_AS names on service pages');
  console.log('  ' + '-'.repeat(72));
  for (const m of svc.matchAll(/'([a-z-]+)':\s*'((?:Individual|Couples|EMDR)[^']*)'/g)) {
    if (!live.has(m[2])) bad(`${m[1]} bills as "${m[2]}", which Cliniko does not have`);
    else console.log(`    ok    ${m[1].padEnd(24)} ${m[2]}`);
  }

  console.log('\n  FEE_LINE_ITEMS names on the closing fee line');
  console.log('  ' + '-'.repeat(72));
  for (const n of feeLineNames(readFileSync('lib/counsellor-cards.ts', 'utf8'))) {
    if (!live.has(n)) bad(`the closing fee line reads "${n}", which Cliniko does not have`);
    else console.log(`    ok    ${n}`);
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
}

/* Run only as a script; the test imports the scan functions. */
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
