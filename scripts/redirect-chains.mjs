/* REDIRECT CHAINS — does a redirect send somebody to another redirect?
 *
 * Imported by scripts/redirect-shadow.mjs and by test/redirect-chains.test.mts.
 * Kept free of side effects so the test can load it without a build.
 *
 * WHY, 1 Oct 2026: /jobs 308'd to /careers, which 308'd to /about, because
 * /careers was retired on 1 Sep and nothing pointed the aliases past it. The
 * copy-of-individual pages went the same way through two retired services.
 * Each hop is a request a crawler may give up on and a little equity lost, and
 * nothing local noticed, because every hop on its own was correct.
 *
 * A source is matched the way Next matches it: `:name` is one segment,
 * `:name*` any tail, `:name(re)` the given pattern. A destination with its own
 * parameters is tested with a placeholder segment in each, which catches
 * `/jobs/:slug -> /careers/:slug` landing on `/careers/:slug -> /about`.
 */

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Compile a Next redirect source into an anchored RegExp. */
export function sourceRegExp(source) {
  /* The index just past the ')' that closes the '(' at `open`. Groups nest
     — `(?!api/)` inside `((?!api/).*)` — so the first ')' is not the end. */
  const closing = (open) => {
    let depth = 0;
    for (let k = open; k < source.length; k++) {
      if (source[k] === '\\') { k++; continue; }
      if (source[k] === '(') depth++;
      else if (source[k] === ')' && --depth === 0) return k + 1;
    }
    throw new Error(`unbalanced group in redirect source ${source}`);
  };
  let out = '';
  let i = 0;
  while (i < source.length) {
    const name = /^:[A-Za-z_]\w*/.exec(source.slice(i));
    if (name) {
      i += name[0].length;
      if (source[i] === '(') {
        const end = closing(i);
        out += `(?:${source.slice(i + 1, end - 1)})`;
        i = end;
      } else {
        const mod = source[i];
        if (mod === '*') out += '.*';
        else if (mod === '+') out += '.+';
        else if (mod === '?') out += '[^/]*';
        else out += '[^/]+';
        if (mod === '*' || mod === '+' || mod === '?') i += 1;
      }
      continue;
    }
    if (source[i] === '(') {
      const end = closing(i);
      out += `(?:${source.slice(i + 1, end - 1)})`;
      i = end;
      continue;
    }
    out += esc(source[i]);
    i += 1;
  }
  return new RegExp(`^${out}/?$`);
}

/** A concrete path standing in for a destination, query and hash removed. */
export function samplePath(destination) {
  const path = String(destination).split(/[?#]/)[0];
  if (/^https?:\/\//.test(path)) return null; // off-site: not ours to chain
  return path.replace(/:([A-Za-z_]\w*)(\([^)]*\))?[*+?]?/g, 'x-sample');
}

/**
 * Every redirect whose destination is itself the source of another redirect.
 * @param {Array<{source: string, destination: string}>} redirects
 * @returns {Array<{source: string, destination: string, then: string}>}
 */
export function findChains(redirects) {
  /* A redirect with `has` or `missing` (the vercel.app host redirect) only
     fires on a condition an ordinary hop never meets, so it cannot be the
     second link of a chain. Without this, `/:path*` on one host would match
     every destination on every other. */
  const compiled = redirects
    .filter((r) => !r.has && !r.missing)
    .map((r) => ({ r, re: sourceRegExp(String(r.source)) }));
  const chains = [];
  for (const r of redirects) {
    const dest = samplePath(r.destination);
    if (!dest) continue;
    const next = compiled.find(({ r: other, re }) => other !== r && re.test(dest));
    if (next) chains.push({ source: r.source, destination: r.destination, then: next.r.destination });
  }
  return chains;
}
