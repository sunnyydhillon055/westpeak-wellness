/* Keep only the CSS rules a document can use — for scripts/inline-css.mjs.
 *
 * WHY — item 301, 1 Oct 2026. Every prerendered document carried the whole
 * stylesheet inline, ~87 KB of a 191 KB median page, of which a city-service
 * page uses perhaps a third: the admin, portal, glossary, tool and pricing
 * rules rode along on all 316 documents. The perf budget sat at +2.6% median
 * HTML against a 2% limit with nothing visible left to cut.
 *
 * WHAT IS SAFE TO DROP. A selector is dropped only when it names a class or
 * id that appears NOWHERE in the document's own text (markup, inline scripts
 * and the RSC payload) nor in any client JavaScript chunk the build emitted,
 * because client code can add a class at runtime. Every other selector is
 * kept: element, attribute, :root and pseudo-only selectors, anything with a
 * CSS escape, and the contents of :not()/:is()/:where()/:has() are ignored
 * when deciding (so `.a:not(.b)` needs only `.a`). @font-face, @keyframes and
 * every other non-grouping at-rule are kept whole; @media, @supports,
 * @container and @layer blocks are pruned inside and dropped only if empty.
 *
 * WHY NOTHING CAN GO UNSTYLED. The pruned copy is only the first-paint block.
 * The full stylesheet is still linked from the same position and loads
 * (media="print" onload), in the same cascade order, so a rule this drops
 * can only be one no element of the first paint could match, and it is in
 * force by the time anything else could need it. Source CSS (globals.css,
 * premium.css) is untouched, and the contrast, a11y and palette gates read
 * the source. */

/** Split a CSS text into top-level items: { prelude, body } blocks and
 *  { statement } at-rules, respecting strings, comments and nesting. */
export function topLevel(css) {
  const items = [];
  let i = 0;
  const n = css.length;
  let start = 0;
  while (i < n) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end < 0 ? n : end + 2;
      if (css.slice(start, i).trim().startsWith('/*')) start = i;
      continue;
    }
    if (c === '"' || c === "'") { i = skipString(css, i); continue; }
    if (c === ';') {
      const s = css.slice(start, i + 1).trim();
      if (s && s !== ';') items.push({ statement: s });
      start = ++i;
      continue;
    }
    if (c === '{') {
      const prelude = css.slice(start, i).trim();
      const close = matchBrace(css, i);
      items.push({ prelude, body: css.slice(i + 1, close) });
      start = i = close + 1;
      continue;
    }
    i++;
  }
  const rest = css.slice(start).trim();
  if (rest) items.push({ statement: rest });
  return items;
}

function skipString(s, i) {
  const q = s[i];
  i++;
  while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; }
  return i + 1;
}

function matchBrace(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") { i = skipString(s, i) - 1; continue; }
    if (c === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 1; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  return s.length - 1;
}

/** Split a selector list on top-level commas. */
export function splitSelectors(list) {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === '"' || c === "'") { i = skipString(list, i) - 1; continue; }
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (c === ',' && depth === 0) { out.push(list.slice(start, i)); start = i + 1; }
  }
  out.push(list.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

/** The class and id names a selector REQUIRES, or null when it must be kept. */
export function requiredNames(selector) {
  if (selector.includes('\\')) return null;
  let s = selector;
  // Drop attribute selectors (their values can hold dots) and every
  // parenthesised argument, innermost first.
  s = s.replace(/\[[^\]]*\]/g, '');
  let prev;
  do { prev = s; s = s.replace(/\([^()]*\)/g, ''); } while (s !== prev);
  const names = [];
  for (const m of s.matchAll(/[.#](-?[_a-zA-Z][\w-]*)/g)) names.push(m[1]);
  return names;
}

const GROUPING = /^@(media|supports|container|layer)\b/i;

/** Prune `css` to the selectors whose required names are all in `has`. */
export function pruneCss(css, has) {
  let out = '';
  for (const it of topLevel(css)) {
    if (it.statement) { out += it.statement.endsWith(';') ? it.statement : `${it.statement};`; continue; }
    const { prelude, body } = it;
    if (prelude.startsWith('@')) {
      if (GROUPING.test(prelude) && body.includes('{')) {
        const inner = pruneCss(body, has);
        if (inner) out += `${prelude}{${inner}}`;
      } else {
        out += `${prelude}{${body}}`;
      }
      continue;
    }
    const kept = splitSelectors(prelude).filter((sel) => {
      const names = requiredNames(sel);
      return names === null || names.every((nm) => has(nm));
    });
    if (kept.length) out += `${kept.join(',')}{${body}}`;
  }
  return out;
}

/** Every identifier-like token in a text: what "appears" means above. */
export function tokensOf(text, into = new Set()) {
  for (const t of text.split(/[^A-Za-z0-9_-]+/)) if (t) into.add(t);
  return into;
}
