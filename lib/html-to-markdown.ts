/* ============================================================================
   THE PAGE, AS MARKDOWN
   ----------------------------------------------------------------------------
   Added 24 September 2026, for the crawlers that read rather than render.

   An answer engine fetching a page here receives 230 KB of HTML, of which
   about 37 KB is the article and the rest is inlined CSS, the navigation, the
   footer, three JSON-LD blocks and a React payload. Everything it wants is in
   there, and every model that reads it pays for the rest. The same page as
   Markdown is roughly 12 KB and contains nothing but the content.

   This is now common practice — the documentation sites several of these
   companies publish serve exactly this — and it costs the reader nothing,
   because the Markdown is derived from the page rather than written twice.
   A second copy that can drift is worse than no second copy at all.

   WHY A CONVERTER AND NOT A LIBRARY
   This repository has seven runtime dependencies and adding an eighth for one
   route is a bad trade: a Markdown converter is a well-understood 300 lines,
   the markup it has to handle is this site's own and therefore known, and the
   test file beside it pins the cases that matter. A dependency here would also
   have to be audited for what it does with untrusted attribute values, and
   nothing on this site is untrusted.

   WHAT IT DROPS, ON PURPOSE
   Navigation, the on-this-page list, scripts, styles, SVG, and anything
   marked aria-hidden. Those are chrome. What survives is what a person would
   read aloud: headings, prose, lists, tables, quotes, the expandable answers,
   and image alt text — which for this site is often the only place a figure's
   content exists in words at all.
   ========================================================================= */

/** Elements whose entire subtree is chrome, not content. */
const DROP = new Set(['script', 'style', 'noscript', 'svg', 'nav', 'form', 'button', 'template', 'iframe']);

/** Elements that produce no markup of their own — their children pass through. */
const PASS = new Set([
  'div', 'section', 'article', 'span', 'main', 'header', 'footer', 'figure',
  'small', 'time', 'abbr', 'b', 'i', 'u', 'mark', 'cite', 'label', 'dfn',
  'picture', 'source', 'col', 'colgroup', 'tbody', 'thead', 'tfoot', 'address',
]);

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  mdash: '\u2014', ndash: '\u2013', hellip: '\u2026', middot: '\u00b7',
  lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201c', rdquo: '\u201d',
  times: '\u00d7', divide: '\u00f7', deg: '\u00b0', eacute: '\u00e9',
  shy: '', zwnj: '\u200c', ensp: ' ', emsp: ' ', thinsp: ' ',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : whole;
    }
    const hit = ENTITIES[body.toLowerCase()];
    return hit === undefined ? whole : hit;
  });
}

type Node =
  | { kind: 'text'; text: string }
  | { kind: 'el'; tag: string; attrs: Record<string, string>; children: Node[] };

/* --------------------------------------------------------------------------
   Parsing.

   Not a compliant HTML parser and does not need to be: the input is this
   site's own server-rendered output, which is well-formed, closes what it
   opens, and never relies on implied end tags. An unrecognised or unbalanced
   tag degrades to text rather than throwing — a Markdown twin with a stray
   line in it is a far smaller problem than a route that 500s.
   ------------------------------------------------------------------------ */
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'`=<>]+))?)*)\s*(\/?)>/g;

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

export function parseHtml(html: string): Node[] {
  const root: Node = { kind: 'el', tag: '#root', attrs: {}, children: [] };
  const stack: Extract<Node, { kind: 'el' }>[] = [root as Extract<Node, { kind: 'el' }>];
  let last = 0;
  TAG.lastIndex = 0;
  let m: RegExpExecArray | null;

  const push = (n: Node) => stack[stack.length - 1].children.push(n);
  const text = (s: string) => { if (s) push({ kind: 'text', text: s }); };

  while ((m = TAG.exec(html))) {
    text(html.slice(last, m.index));
    last = TAG.lastIndex;
    const [, closing, rawTag, rawAttrs, selfClose] = m;
    const tag = rawTag.toLowerCase();

    if (closing) {
      /* Close the nearest matching open element. Anything left open inside it
         is closed with it, which is what a browser does too. */
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }

    const el: Extract<Node, { kind: 'el' }> = { kind: 'el', tag, attrs: parseAttrs(rawAttrs), children: [] };
    push(el);
    if (!selfClose && !VOID.has(tag)) stack.push(el);

    /* Raw-text elements: everything to the closing tag is text, not markup. */
    if (tag === 'script' || tag === 'style') {
      const end = html.toLowerCase().indexOf(`</${tag}`, last);
      if (end !== -1) { last = end; TAG.lastIndex = end; }
    }
  }
  text(html.slice(last));
  return (root as Extract<Node, { kind: 'el' }>).children;
}

/* -------------------------------------------------------------------------- */

const collapse = (s: string) => s.replace(/[ \t\r\n]+/g, ' ');

/** Characters that would otherwise start a Markdown construct at line start. */
const escapeInline = (s: string) =>
  s.replace(/([\\`*_[\]])/g, '\\$1').replace(/^(\s*)([#>+-]|\d+\.)\s/gm, '$1\\$2 ');

function isHidden(n: Extract<Node, { kind: 'el' }>): boolean {
  return n.attrs['aria-hidden'] === 'true' || n.attrs.hidden !== undefined
    || /\bdisplay:\s*none\b/.test(n.attrs.style ?? '');
}

interface Ctx { base: string; }

/** Absolute URL for a link or image, so the Markdown stands on its own. */
function absolute(href: string, base: string): string {
  if (!href) return '';
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return href.startsWith('/') ? `${base}${href}` : href;
}

/** Inline content: everything that can sit inside a paragraph. */
function inline(nodes: Node[], ctx: Ctx): string {
  let out = '';
  for (const n of nodes) {
    if (n.kind === 'text') { out += escapeInline(collapse(decodeEntities(n.text))); continue; }
    if (DROP.has(n.tag) || isHidden(n)) continue;
    switch (n.tag) {
      case 'br': out += '  \n'; break;
      case 'strong': {
        const t = inline(n.children, ctx).trim();
        out += t ? `**${t}**` : '';
        break;
      }
      case 'em': {
        const t = inline(n.children, ctx).trim();
        out += t ? `*${t}*` : '';
        break;
      }
      case 'code': case 'kbd': case 'samp': {
        const t = inline(n.children, ctx).trim().replace(/\\([\\`*_[\]])/g, '$1');
        out += t ? `\`${t}\`` : '';
        break;
      }
      case 'a': {
        const t = inline(n.children, ctx).trim();
        const href = absolute(n.attrs.href ?? '', ctx.base);
        out += !t ? '' : href ? `[${t}](${href})` : t;
        break;
      }
      case 'img': {
        const alt = (n.attrs.alt ?? '').trim();
        const src = absolute(n.attrs.src ?? '', ctx.base);
        out += alt && src ? `![${escapeInline(alt)}](${src})` : '';
        break;
      }
      default: out += inline(n.children, ctx);
    }
  }
  return out;
}

const tidy = (s: string) => s.replace(/[ \t]+/g, ' ').replace(/ +\n/g, '\n').trim();

/** Block content: everything that produces its own line. */
function block(nodes: Node[], ctx: Ctx, depth = 0): string {
  const parts: string[] = [];

  for (const n of nodes) {
    if (n.kind === 'text') {
      const t = collapse(decodeEntities(n.text)).trim();
      if (t) parts.push(escapeInline(t));
      continue;
    }
    if (DROP.has(n.tag) || isHidden(n)) continue;

    switch (n.tag) {
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
        const t = tidy(inline(n.children, ctx));
        if (t) parts.push(`${'#'.repeat(Number(n.tag[1]))} ${t}`);
        break;
      }
      case 'p': case 'figcaption': case 'dd': case 'dt': {
        const t = tidy(inline(n.children, ctx));
        if (t) parts.push(n.tag === 'dt' ? `**${t}**` : t);
        break;
      }
      case 'ul': case 'ol': {
        const items: string[] = [];
        let i = 1;
        for (const li of n.children) {
          if (li.kind !== 'el' || li.tag !== 'li' || isHidden(li)) continue;
          const marker = n.tag === 'ol' ? `${i++}. ` : '- ';
          const body = block(li.children, ctx, depth + 1).trim()
            || tidy(inline(li.children, ctx));
          if (!body) continue;
          const pad = ' '.repeat(marker.length);
          items.push(marker + body.split('\n').map((l, k) => (k ? (l ? pad + l : l) : l)).join('\n'));
        }
        if (items.length) parts.push(items.join('\n'));
        break;
      }
      case 'li': {
        const t = block(n.children, ctx, depth + 1).trim() || tidy(inline(n.children, ctx));
        if (t) parts.push(`- ${t}`);
        break;
      }
      case 'blockquote': case 'aside': {
        const inner = block(n.children, ctx, depth + 1).trim();
        if (inner) parts.push(inner.split('\n').map((l) => (l ? `> ${l}` : '>')).join('\n'));
        break;
      }
      case 'details': {
        /* The FAQ accordions. A crawler that only reads what is visible would
           miss every answer on the page; here they are simply prose. */
        const summary = n.children.find((c) => c.kind === 'el' && c.tag === 'summary');
        const rest = n.children.filter((c) => c !== summary);
        const q = summary && summary.kind === 'el' ? tidy(inline(summary.children, ctx)) : '';
        const a = block(rest, ctx, depth + 1).trim();
        if (q) parts.push(`**${q}**`);
        if (a) parts.push(a);
        break;
      }
      case 'table': {
        const rows: string[][] = [];
        const walk = (ns: Node[]) => {
          for (const c of ns) {
            if (c.kind !== 'el') continue;
            if (c.tag === 'tr') {
              rows.push(
                c.children
                  .filter((d): d is Extract<Node, { kind: 'el' }> => d.kind === 'el' && (d.tag === 'td' || d.tag === 'th'))
                  .map((d) => tidy(inline(d.children, ctx)).replace(/\|/g, '\\|') || ' ')
              );
            } else walk(c.children);
          }
        };
        walk(n.children);
        if (rows.length) {
          const width = Math.max(...rows.map((r) => r.length));
          const pad = (r: string[]) => [...r, ...Array(width - r.length).fill(' ')];
          const head = pad(rows[0]);
          const body = rows.slice(1).map(pad);
          parts.push([
            `| ${head.join(' | ')} |`,
            `| ${head.map(() => '---').join(' | ')} |`,
            ...body.map((r) => `| ${r.join(' | ')} |`),
          ].join('\n'));
        }
        break;
      }
      case 'pre': {
        const t = decodeEntities(inline(n.children, ctx)).replace(/\\([\\`*_[\]])/g, '$1');
        if (t.trim()) parts.push(`\`\`\`\n${t.trim()}\n\`\`\``);
        break;
      }
      case 'hr': parts.push('---'); break;
      case 'dl': case 'dialog': parts.push(block(n.children, ctx, depth + 1)); break;
      default: {
        if (PASS.has(n.tag)) { const t = block(n.children, ctx, depth); if (t.trim()) parts.push(t); break; }
        const t = tidy(inline([n], ctx));
        if (t) parts.push(t);
      }
    }
  }

  return parts.filter((p) => p.trim()).join('\n\n');
}

/* --------------------------------------------------------------------------
   STREAMED PAGES.

   Ten routes here render on demand and put their slow part inside a React
   Suspense boundary: /pricing waits on the fee library, /book on Cliniko's
   calendar. The first bytes of those pages carry the fallback — "Loading
   current fees…" — and the real content arrives later in the same response,
   parked in a `<div hidden id="S:0">` that a script swaps into place once it
   lands. A converter that reads only <main> gets the word "Loading" and
   nothing else, which is exactly what the first version produced for the
   fee page.

   So: drop the regions the framework has marked as pending fallbacks, then
   take the hidden blocks as the content they are. Both markers are Next's
   own and unambiguous.
   ------------------------------------------------------------------------ */

/** Text between a pending-boundary marker and its close is a placeholder. */
const PENDING = /<!--\$\?-->[\s\S]*?<!--\/\$-->/g;
const COMMENT = /<!--[\s\S]*?-->/g;

const clean = (html: string) =>
  html.replace(/<template[\s\S]*?<\/template>/gi, '').replace(PENDING, '').replace(COMMENT, '');

function findAll(nodes: Node[], pred: (n: Extract<Node, { kind: 'el' }>) => boolean, out: Extract<Node, { kind: 'el' }>[] = []) {
  for (const n of nodes) {
    if (n.kind !== 'el') continue;
    if (pred(n)) out.push(n);
    else findAll(n.children, pred, out);
  }
  return out;
}

/** The <main> of a page, or the whole document if it has none. */
export function mainOf(html: string): string {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (m) return m[1];
  const b = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return b ? b[1] : html;
}

/**
 * The content of a rendered page, as Markdown.
 *
 * `base` makes every link absolute, because a Markdown file retrieved on its
 * own has no page to resolve relative paths against.
 */
export function htmlToMarkdown(html: string, base: string): string {
  const doc = parseHtml(clean(html));
  const ctx = { base };

  const main = findAll(doc, (n) => n.tag === 'main')[0];
  const streamed = findAll(doc, (n) => n.attrs.hidden !== undefined && /^[SB]:/.test(n.attrs.id ?? ''));

  const parts = [
    main ? block(main.children, ctx) : block(doc, ctx),
    ...streamed.map((n) => block(n.children, ctx)),
  ];

  const body = parts.filter((p) => p.trim()).join('\n\n');
  return body.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** A page's <title>, description, canonical URL, language and translations. */
export function metaOf(html: string): {
  title: string;
  description: string;
  canonical: string;
  modified: string;
  lang: string;
  alternates: { lang: string; href: string }[];
} {
  const pick = (re: RegExp) => decodeEntities((html.match(re)?.[1] ?? '').trim());

  /* The language is on <html>, not in the metadata, and on this site it is
     written there after the build by scripts/html-lang.mjs — 48 pages are
     Punjabi or Tagalog documents and the rest are English. A Markdown file
     that does not say which it is, is a file a model has to guess at, and
     Gurmukhi at least announces itself where Tagalog does not. */
  const lang = pick(/<html[^>]*\slang="([^"]*)"/i) || 'en-CA';

  /* The same page in another language, where a real translation exists. The
     site only ever emits these for genuine translations, never for a page
     that merely mentions the language, so what is here can be trusted. */
  const alternates = [...html.matchAll(/<link[^>]+rel="alternate"[^>]*>/gi)]
    .map((m) => ({
      lang: decodeEntities(m[0].match(/hreflang="([^"]*)"/i)?.[1] ?? ''),
      href: decodeEntities(m[0].match(/href="([^"]*)"/i)?.[1] ?? ''),
    }))
    .filter((a) => a.lang && a.href);

  return {
    title: pick(/<title>([\s\S]*?)<\/title>/i).replace(/\s*\|\s*Westpeak Wellness\s*$/, ''),
    description: pick(/<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: pick(/<link\s+rel="canonical"\s+href="([^"]*)"/i),
    modified: pick(/"dateModified"\s*:\s*"([^"]*)"/i),
    lang,
    alternates,
  };
}
