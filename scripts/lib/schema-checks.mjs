/* TWO CROSS-NODE CHECKS FOR scripts/schema-validate.mjs — 1 Oct 2026.
 *
 * 70 of 73 ProfilePage nodes pointed mainEntity at a #person node that was
 * not on the page, so the page's subject had no name where Google reads it;
 * and the city pages gave each counsellor's Person @id a url of their own
 * city page, so one entity carried a different url per page. Neither is
 * visible to a per-block validator. Pure, so they can be tested on fixtures.
 */

const typesOf = (n) => (Array.isArray(n?.['@type']) ? n['@type'] : n?.['@type'] ? [n['@type']] : []);

/** Every object node in a parsed JSON-LD value, nested ones included. */
export function nodesIn(value, out = []) {
  if (Array.isArray(value)) value.forEach((v) => nodesIn(v, out));
  else if (value && typeof value === 'object') {
    out.push(value);
    for (const [k, v] of Object.entries(value)) if (k !== '@context') nodesIn(v, out);
  }
  return out;
}

/** Problems with ProfilePage.mainEntity on one page, given every parsed block
 *  on it: the main entity must be inline with a name, or a reference to a
 *  node on the same page that has one. */
export function profilePageProblems(blocks) {
  const nodes = blocks.flatMap((b) => nodesIn(b));
  const named = new Set(nodes.filter((n) => n['@id'] && typeof n.name === 'string' && n.name).map((n) => n['@id']));
  const problems = [];
  for (const n of nodes) {
    if (!typesOf(n).includes('ProfilePage')) continue;
    const m = n.mainEntity;
    if (!m || typeof m !== 'object') { problems.push(`ProfilePage ${n['@id'] ?? ''} has no mainEntity`); continue; }
    if (typeof m.name === 'string' && m.name) continue;
    if (m['@id'] && named.has(m['@id'])) continue;
    problems.push(`ProfilePage ${n['@id'] ?? ''} mainEntity ${m['@id'] ?? '(inline)'} has no name on this page`);
  }
  return problems;
}

/** Record each Person @id's url into `seen` (Map id -> Map url -> route). */
export function recordPersonUrls(blocks, route, seen) {
  for (const n of blocks.flatMap((b) => nodesIn(b))) {
    if (!typesOf(n).includes('Person') || !n['@id'] || typeof n.url !== 'string') continue;
    if (!seen.has(n['@id'])) seen.set(n['@id'], new Map());
    const urls = seen.get(n['@id']);
    if (!urls.has(n.url)) urls.set(n.url, route);
  }
  return seen;
}

/** One message per Person @id that carries more than one url across the build. */
export function personUrlProblems(seen) {
  return [...seen.entries()]
    .filter(([, urls]) => urls.size > 1)
    .map(([id, urls]) => `Person ${id} has ${urls.size} urls: ${[...urls.entries()].map(([u, r]) => `${u} (on ${r})`).join(', ')}`);
}
