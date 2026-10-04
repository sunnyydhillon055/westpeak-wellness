/* THE BUILT SITEMAP, INDEX AND CHILDREN — 3 Oct 2026.
 *
 * /sitemap.xml became a sitemap index of per-template children served at
 * /sitemaps/<part>.xml. Every gate that used to read one prerendered file now
 * reads the union through here. A gate that kept reading only the index would
 * find no <url> at all and pass: expansion-verify would see no Alberta URL in
 * a file that lists none, which is not the same as there being none.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const body = (base) => {
  for (const c of [`${base}.body`, `${base}.html`, base]) {
    if (existsSync(c) && statSync(c).isFile()) return readFileSync(c, 'utf8');
  }
  return null;
};

/** The child sitemap URLs an index lists, in order. */
export const indexLocs = (xml) =>
  /<sitemapindex\b/.test(xml)
    ? [...xml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim().replace(/&amp;/g, '&'))
    : [];

/**
 * Read what the build prerendered under .next/server/app.
 * Returns null when there is no sitemap on disk at all. `xml` is every
 * urlset concatenated, which is what a regex over <url> or <loc> wants;
 * `parts` names each child and `missing` lists children the index names that
 * were not built.
 */
export function readBuiltSitemap(builtDir) {
  const top = body(join(builtDir, 'sitemap.xml'));
  if (top === null) return null;
  const children = indexLocs(top);
  if (!children.length) return { index: null, parts: [{ name: 'sitemap.xml', xml: top }], missing: [], xml: top };
  const parts = [];
  const missing = [];
  for (const loc of children) {
    const path = new URL(loc).pathname.replace(/^\//, '');
    const xml = body(join(builtDir, ...path.split('/')));
    if (xml === null) missing.push(loc);
    else parts.push({ name: path, xml });
  }
  return { index: top, parts, missing, xml: parts.map((p) => p.xml).join('\n') };
}
