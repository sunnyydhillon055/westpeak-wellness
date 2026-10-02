#!/usr/bin/env node
/* Structured-data gate — every JSON-LD block on every prerendered page must
 * actually parse and must describe something.
 *
 * WHY. The site leans on structured data harder than any competitor measured
 * (24 schema types, scored 950/1000) — which means a malformed block costs
 * more here than anywhere. And JSON-LD fails silently: a stray quote or an
 * interpolated `undefined` doesn't break the page, it just makes Google
 * discard the block, and nothing tells you. The seo-audit gate checks that
 * schema types are PRESENT by substring; this one checks the blocks are
 * VALID. Both are needed — a present-but-unparseable block passes the first
 * and is caught only here.
 *
 * WHAT IT CHECKS, deliberately minimal:
 *   · the block parses as JSON
 *   · every node (top level, @graph, arrays) carries @type
 *   · a root carries or inherits @context
 *   · no value anywhere is "undefined", "null", "NaN" or "[object Object]"
 *     as a STRING — the signature of an interpolation bug
 *   · no empty-string values for name/url/@id — schema that names nothing
 *   · a ProfilePage's mainEntity has a name on the page itself, inline or
 *     by @id (1 Oct 2026), and each Person @id has one url across the build
 *     (scripts/lib/schema-checks.mjs)
 *
 * It validates shape, not vocabulary. Whether "MedicalWebPage" is the right
 * type for a page is editorial judgement; whether the block parses is not.
 *
 *   node scripts/schema-validate.mjs          exit 1 on any error
 *   node scripts/schema-validate.mjs --warn   report only
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { profilePageProblems, recordPersonUrls, personUrlProblems } from './lib/schema-checks.mjs';

const ROOT = join(process.cwd(), '.next', 'server', 'app');
const WARN_ONLY = process.argv.includes('--warn');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
if (!files.length) {
  console.error('No prerendered HTML found. Run `npm run build` first.');
  process.exit(1);
}

const JUNK = new Set(['undefined', 'null', 'NaN', '[object Object]']);
const errors = [];

/* Walk a parsed JSON-LD value, reporting junk strings and untyped nodes. */
function inspect(node, path, report) {
  if (typeof node === 'string') {
    if (JUNK.has(node.trim())) report(`junk string value at ${path}: "${node}"`);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => inspect(v, `${path}[${i}]`, report));
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'name' || k === 'url' || k === '@id') && v === '')
        report(`empty ${k} at ${path}`);
      inspect(v, `${path}.${k}`, report);
    }
    /* A node with properties but no @type is invisible to consumers. Pure
     * reference nodes ({"@id": "..."}) and @context objects are fine. */
    const keys = Object.keys(node);
    const isRef = keys.every((k) => k.startsWith('@'));
    if (!isRef && !('@type' in node) && !path.endsWith('@context'))
      report(`node without @type at ${path}`);
  }
}

let blocks = 0;
const personUrls = new Map();
for (const f of files) {
  const rel = relative(ROOT, f).split(sep).join('/').replace(/\.html$/, '');
  const route = rel === 'index' ? '/' : '/' + rel;
  const html = readFileSync(f, 'utf8');
  const report = (msg) => errors.push({ route, msg });
  /* AT MOST ONE BreadcrumbList PER DOCUMENT — added 1 Oct 2026. Templates
     that build their own trail into a larger graph must pass schema={false}
     to <Breadcrumbs>; production /practitioners/savneet-singh/richmond was
     carrying two identical trails, which no validator reports because each
     is individually valid. Counted across every block on the page. */
  let trails = 0;
  const parsedBlocks = [];

  for (const m of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )) {
    blocks++;
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch (e) {
      report(`unparseable JSON-LD: ${e.message.slice(0, 80)}`);
      continue;
    }
    parsedBlocks.push(parsed);
    const roots = Array.isArray(parsed) ? parsed : [parsed];
    for (const [i, root] of roots.entries()) {
      const graph = root && root['@graph'];
      if (!root || typeof root !== 'object') {
        report(`root ${i} is not an object`);
        continue;
      }
      if (!('@context' in root))
        report(`root ${i} (@type ${root['@type'] ?? '?'}) has no @context`);
      inspect(graph ?? root, `root${i}`, report);
      const nodes = Array.isArray(graph) ? graph : [root];
      trails += nodes.filter((n) => n && n['@type'] === 'BreadcrumbList').length;
    }
  }
  if (trails > 1) report(`${trails} BreadcrumbList nodes; a page carries one trail`);
  for (const msg of profilePageProblems(parsedBlocks)) report(msg);
  recordPersonUrls(parsedBlocks, route, personUrls);
}
for (const msg of personUrlProblems(personUrls)) errors.push({ route: '(across the build)', msg });

console.log(`\nSchema gate — ${blocks} JSON-LD blocks across ${files.length} pages`);
if (errors.length) {
  const byRoute = new Map();
  for (const e of errors) byRoute.set(e.route, [...(byRoute.get(e.route) || []), e.msg]);
  for (const [route, msgs] of [...byRoute.entries()].slice(0, 20)) {
    console.log(`\nERROR  ${route}`);
    for (const m of msgs.slice(0, 6)) console.log(`   ${m}`);
  }
  if (byRoute.size > 20) console.log(`\n…and ${byRoute.size - 20} more routes`);
  console.log(`\n${errors.length} error(s)`);
} else {
  console.log('all blocks parse, all nodes typed, no interpolation junk. clean.');
}
process.exit(errors.length && !WARN_ONLY ? 1 : 0);
