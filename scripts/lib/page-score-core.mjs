/* THE PAGE SCORER'S RULES, PURE — 4 Oct 2026.
 *
 * Everything scripts/page-score.mjs decides about a page lives here, as
 * functions of HTML strings and a context object, so every check is tested on
 * small fixtures (test/page-score.test.mts) without a build. The CLI does the
 * reading: the build, the sitemap, the roster, the server for /book.
 *
 * The rubric, each threshold and the source it rests on are in the header of
 * scripts/page-score.mjs; RUBRIC below carries the points. Where a source is
 * an existing repo gate, the number is the gate's; where Google says a thing
 * does not matter for ranking (word count, heading order), the header says so
 * and names the reason the check is kept anyway.
 */
import { nodesIn } from './schema-checks.mjs';
import { htmlAlternates, hreflangProblems, blockedBy } from './crawl-signals.mjs';
import { shingles, jaccard, textOf } from './shingles.mjs';

export const ORIGIN = 'https://www.westpeakwellness.com';

/* ---- points ------------------------------------------------------------- */

export const RUBRIC = {
  seo: {
    title: 600, description: 500, h1: 300, canonical: 300, indexable: 300, jsonld: 400,
    /* The brief's SEO items summed to 4,200 against a 4,000 pillar. The two
       Google says do not move ranking were halved: heading order ("it doesn't
       matter if you're using them out of order", SEO Starter Guide) and Open
       Graph, which Search does not read. */
    headingOrder: 100, words: 400, uniqueness: 400, images: 200, openGraph: 100, lang: 100, weight: 300,
  },
  links: {
    inbound: 900, outbound: 600, anchors: 400, broken: 500, redirects: 200, citations: 200, breadcrumb: 200,
  },
  clients: {
    firstScreen: 800, routing: 600, counsellor: 400, fee: 300, consult: 300, trust: 300, email: 150, sticky: 150,
  },
};

/* ---- thresholds (sources in scripts/page-score.mjs) --------------------- */

export const T = {
  /* titleMax is seo-audit.mjs TITLE_MAX. titleMin has NO published source:
     Google asks for titles that are not vague and gives no length, and no
     repo gate sets a minimum. 30 is the owner's tripwire for a vague title;
     no sitemap page is under it on 4 Oct 2026, so it costs nothing today. */
  titleMin: 30, titleMax: 60,
  descMin: 70, descMax: 158,           // seo-audit.mjs DESC_MIN / DESC_MAX, & counted as &amp;
  inboundFull: 5,                      // owner's brief; Google: every page linked from at least one other
  outboundMin: 3, outboundFull: 20, outboundSoft: 30, outboundZero: 60,
  firstScreenShare: 0.2, firstScreenZero: 0.5, // NN/g 2018: 57% of viewing time above the fold, 74% in two screens
  contextWords: 3,                     // words beside a link, in its own p/li; Google says "surrounding text", the 3 is the owner's
  healthySimilarity: 0.5,              // uniqueness-gate.mjs TWIN_CEILING, "the line the researcher's audit drew"
};

/* Pairwise ceilings, uniqueness-gate.mjs's own (MAX_SIMILARITY and FAMILY_CEILINGS). */
export const SIMILARITY_CEILING = {
  'city-hub': 0.4, 'tagalog-city': 0.4, 'punjabi-region': 0.3, 'place-tl': 0.5, 'place-pa': 0.52,
};
const DEFAULT_CEILING = 0.62;

/* Words in <main>, by the four classes in the owner's brief. */
export const WORD_FLOOR = { content: 600, hub: 350, profile: 400, utility: 150 };

/* ---- families ----------------------------------------------------------- */

const HUBS = new Set([
  '/answers', '/services', '/online-counselling', '/guides', '/compare', '/for', '/resources', '/approaches', '/tools',
  '/practitioners', '/punjabi-counselling', '/tagalog-counselling', '/punjabi', '/tagalog', '/punjabi/regions',
]);
const POLICY = new Set(['/privacy', '/accessibility', '/editorial-policy', '/standards', '/terms']);
const CONVERSION = new Set(['/book', '/contact', '/pricing']);

/** The page family, which decides word floor, schema expectation and siblings. */
export function familyOf(path) {
  if (path === '/') return 'home';
  if (HUBS.has(path)) return 'hub';
  if (POLICY.has(path)) return 'policy';
  if (CONVERSION.has(path)) return 'conversion';
  if (path === '/glossary') return 'glossary';
  if (path === '/refer' || path.startsWith('/refer/') || path === '/for/employers-and-hr/one-pager') return 'referral';
  const s = path.split('/').filter(Boolean);
  if (s[0] === 'services') return 'service';
  if (s[0] === 'online-counselling') return s.length === 2 ? 'city-hub' : 'city-service';
  if (s[0] === 'practitioners') {
    if (s.length === 2 || (s.length === 3 && (s[2] === 'tl' || s[2] === 'pa'))) return 'profile';
    if (s.length === 4) return s[3] === 'tl' ? 'place-tl' : 'place-pa';
    return 'place';
  }
  if (s[0] === 'guides') return 'guide';
  if ((s[0] === 'punjabi' && s[1] === 'guides') || (s[0] === 'tagalog' && s[1] === 'gabay')) return 'language-guide';
  if (s[0] === 'resources') return 'resource';
  if (s[0] === 'compare') return 'compare';
  if (s[0] === 'for') return 'audience';
  if (s[0] === 'approaches') return 'approach';
  if (s[0] === 'tools') return 'tool';
  if (s[0] === 'tagalog-counselling') return 'tagalog-city';
  if (s[0] === 'punjabi-counselling') return 'punjabi-region';
  return 'info';
}

const WORD_CLASS = {
  home: 'content', hub: 'hub', policy: 'utility', conversion: 'utility', glossary: 'content', referral: 'hub',
  service: 'content', 'city-hub': 'content', 'city-service': 'content', profile: 'profile', place: 'profile',
  'place-tl': 'profile', 'place-pa': 'profile', guide: 'content', 'language-guide': 'content', resource: 'content',
  compare: 'content', audience: 'content', approach: 'content', tool: 'hub', 'tagalog-city': 'content',
  'punjabi-region': 'content', info: 'content',
};
export const wordClassOf = (family) => WORD_CLASS[family] ?? 'content';

/* Families whose claims are factual and should be cited (owner's brief). */
const FACTUAL = new Set(['guide', 'language-guide', 'resource', 'compare', 'glossary']);

/* Structured-data types that fit each family. Google documents Article,
   BreadcrumbList, ProfilePage and LocalBusiness subtypes; Service,
   MedicalWebPage, CollectionPage and WebApplication are schema.org types the
   site already uses by family (scripts/seo-audit.mjs CLINICAL). */
const PAGE_TYPES = ['WebPage', 'AboutPage', 'ContactPage', 'FAQPage', 'CollectionPage', 'MedicalWebPage', 'ProfilePage', 'Article'];
const EXPECTED_TYPES = {
  home: ['WebSite'],
  hub: ['CollectionPage', 'ItemList', 'WebPage', 'DefinedTermSet'],
  glossary: ['DefinedTermSet'],
  service: ['Service', 'MedicalWebPage'],
  'city-hub': ['Service', 'MedicalWebPage'],
  'city-service': ['Service', 'MedicalWebPage'],
  profile: ['ProfilePage'],
  place: ['Service', 'ProfilePage'],
  'place-tl': ['ProfilePage', 'Service'],
  'place-pa': ['ProfilePage', 'Service'],
  guide: ['Article', 'MedicalWebPage'],
  'language-guide': ['Article', 'MedicalWebPage'],
  resource: ['Article', 'MedicalWebPage'],
  compare: ['Article', 'MedicalWebPage'],
  audience: ['Article', 'MedicalWebPage'],
  approach: ['Article', 'MedicalWebPage'],
  tool: ['WebApplication'],
  'tagalog-city': ['Service'],
  'punjabi-region': ['Service'],
};
const expectedTypes = (family) => EXPECTED_TYPES[family] ?? PAGE_TYPES;

/* ---- HTML reading ------------------------------------------------------- */

export function decode(s) {
  return String(s)
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&rsquo;/g, '’')
    .replace(/&amp;/g, '&');
}

/** [start, end) of the element whose open tag starts at `start`, nesting counted. */
function elementSpan(html, tag, start) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].endsWith('/>') && !m[1]) continue;
    depth += m[1] ? -1 : 1;
    if (depth === 0) return [start, m.index + m[0].length];
  }
  return [start, html.length];
}

/** The inner HTML of the first element matching an open-tag regex, or null. */
function innerOf(html, openRe, tag) {
  const m = openRe.exec(html);
  if (!m) return null;
  const [s, e] = elementSpan(html, tag, m.index);
  const inner = html.slice(s + m[0].length, e);
  return inner.replace(new RegExp(`</${tag}>\\s*$`, 'i'), '');
}

/** html with every element of `tag` (outermost) removed, optionally only where `keep(openTag)` is false. */
export function removeElements(html, tag, drop = () => true) {
  const re = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
  let out = '';
  let pos = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m.index < pos) continue;
    if (!drop(m[0])) continue;
    const [s, e] = elementSpan(html, tag, m.index);
    out += html.slice(pos, s) + ' ';
    pos = e;
    re.lastIndex = e;
  }
  return out + html.slice(pos);
}

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** html with every element whose open tag satisfies `drop(openTag)` removed, whatever its tag (void tags left alone). */
export function removeWhere(html, drop) {
  const re = /<([a-z][\w-]*)\b[^>]*>/gi;
  let out = '';
  let pos = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m.index < pos || VOID.has(m[1].toLowerCase()) || m[0].endsWith('/>') || !drop(m[0])) continue;
    const [s, e] = elementSpan(html, m[1], m.index);
    out += html.slice(pos, s) + ' ';
    pos = e;
    re.lastIndex = e;
  }
  return out + html.slice(pos);
}

/* HIDDEN FROM THE READER (4 Oct 2026 review). An element with the `hidden`
   attribute or aria-hidden="true" is not shown to, or not read to, the
   person on the page: the figure hint ("Tap the diagram to open it full
   size", aria-hidden, on 700 figures), the form honeypot, /answers' empty-
   search message. None of it is editorial, so none of it may earn words,
   links or a client signal. Attribute values are blanked before testing, so
   class="a hidden b" is not mistaken for the attribute. */
export const isHiddenTag = (tag) =>
  /\saria-hidden\s*=\s*["']?true/i.test(tag) || /\shidden(?=[\s>=/])/i.test(tag.replace(/"[^"]*"|'[^']*'/g, '""'));
/* Visually hidden text (.sr-only) is real for a screen reader and stays in a
   link's accessible name, but text nobody can see does not count as words on
   the page: the house rule is no hidden text, and a word floor must not be
   reachable through it. */
const isSrOnly = (tag) => /\sclass\s*=\s*"(?:[^"]*\s)?sr-only(?:\s[^"]*)?"/i.test(tag);
/** The words a sighted reader sees in an editorial fragment. */
export const readableText = (fragment) => visibleText(removeWhere(fragment, isSrOnly));

/** Visible text: tags, style, svg and templates dropped, entities decoded. */
export function visibleText(fragment) {
  return decode(
    fragment
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<template[\s\S]*?<\/template>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}

export const wordCount = (text) => (text ? text.split(/\s+/).filter(Boolean).length : 0);

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, 'i')) || tag.match(new RegExp(`\\s${name}\\s*=\\s*'([^']*)'`, 'i'));
  return m ? decode(m[1]) : null;
};

/** Anchors in a fragment: href, accessible text, offset. */
export function anchorsIn(html) {
  const out = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(`<a ${m[1]}>`, 'href');
    if (href === null) continue;
    let text = visibleText(m[2]);
    if (!text) {
      const alt = m[2].match(/<img\b[^>]*\salt="([^"]*)"/i);
      if (alt) text = decode(alt[1]).trim();
    }
    const aria = attr(`<a ${m[1]}>`, 'aria-label');
    out.push({ href, text, name: (aria || text || '').trim(), index: m.index, cls: attr(`<a ${m[1]}>`, 'class') || '' });
  }
  return out;
}

/** The site path an href points at, or null when it leaves the site. */
export function internalPath(href) {
  if (!href) return null;
  let h = href.trim();
  if (h.startsWith(ORIGIN)) h = h.slice(ORIGIN.length) || '/';
  if (!h.startsWith('/') || h.startsWith('//')) return null;
  const path = h.split(/[?#]/)[0] || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}

/** A build file that renders the not-found page (the gated provinces, /_not-found):
    seo-audit.mjs's own test. It exists on disk and answers 404, so a link to
    it is a broken link and a sitemap URL that renders it is not a page. */
export const isNotFoundShell = (html) => /page not found/i.test((String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i) || ['', ''])[1]);

const isBookHref = (href) => /^\/book(?:[?#]|$)/.test(href) || /^https?:\/\/[^/]*cliniko/i.test(href);

/**
 * Read one page. `raw` is the HTML as served; `headers` the response headers
 * for a page fetched from the server (x-robots-tag), empty for a file.
 */
export function parsePage(path, raw, { headers = {}, dynamic = false } = {}) {
  const ld = [];
  for (const m of raw.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { ld.push({ ok: true, value: JSON.parse(m[1]) }); } catch { ld.push({ ok: false }); }
  }
  const doc = raw.replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
  const headEnd = doc.search(/<\/head>/i);
  const head = headEnd > -1 ? doc.slice(0, headEnd) : doc;
  const meta = (key) => {
    for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
      const n = attr(m[0], 'name') ?? attr(m[0], 'property');
      if (n && n.toLowerCase() === key) return attr(m[0], 'content');
    }
    return null;
  };
  const rawMeta = (key) => {
    for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
      const n = (m[0].match(/\s(?:name|property)="([^"]*)"/i) || [])[1];
      if (n && n.toLowerCase() === key) return (m[0].match(/\scontent="([^"]*)"/i) || [, ''])[1];
    }
    return null;
  };

  /* <main>, and the Suspense segments Next parks after it on a streamed page
     (/book): the real content arrives in <div hidden id="S:n"> and is swapped
     in before a reader or a renderer sees the page. Reading <main> alone gave
     /book's markdown twin the word "Loading" once. */
  let main = innerOf(doc, /<main\b[^>]*>/i, 'main') ?? '';
  for (const m of doc.matchAll(/<div hidden id="S:\d+">/g)) {
    const [s, e] = elementSpan(doc, 'div', m.index);
    main += ' ' + doc.slice(s + m[0].length, e).replace(/<\/div>\s*$/i, '');
  }
  /* Editorial body: <main> without the navigation inside it (breadcrumb,
     table of contents), without any header or footer that moved in, and
     without what is hidden from the reader (isHiddenTag). Every check that
     asks what the page SAYS reads this; the table of contents repeats each
     H2 and the breadcrumb is chrome, so neither counts as words, as a
     booking link's position, or as a client signal (4 Oct 2026 review). */
  const body = removeWhere(['nav', 'header', 'footer'].reduce((h, t) => removeElements(h, t), main), isHiddenTag);
  const mainText = visibleText(main);
  const bodyText = readableText(body);

  const titleRaw = (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, null])[1];
  const htmlTag = (doc.match(/<html\b[^>]*>/i) || [''])[0];
  const imgs = [...doc.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const stylesheets = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).filter((t) => /\srel="stylesheet"/i.test(t));
  const canonicalTag = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).find((t) => /\srel="canonical"/i.test(t));

  return {
    path,
    family: familyOf(path),
    dynamic,
    bytes: Buffer.byteLength(raw),
    titleRaw: titleRaw === null ? null : titleRaw.trim(),
    title: titleRaw === null ? null : decode(titleRaw).trim(),
    descRaw: rawMeta('description'),
    desc: meta('description'),
    robots: [meta('robots'), headers['x-robots-tag']].filter(Boolean).join(', '),
    canonical: canonicalTag ? attr(canonicalTag, 'href') : null,
    lang: attr(htmlTag, 'lang'),
    og: { title: meta('og:title'), description: meta('og:description'), image: meta('og:image') },
    alternates: htmlAlternates(head),
    ld,
    h1s: [...doc.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => visibleText(m[1])),
    headings: [...main.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1])),
    imgs,
    inlinedCss: /<style data-inlined>/.test(raw),
    blockingCss: stylesheets.filter((t) => !/\smedia="print"/i.test(t) || !/onload=/i.test(t)).length,
    breadcrumbNav: /<nav\b[^>]*aria-label="Breadcrumb"/i.test(doc),
    sticky: /class="sticky-book"/.test(doc),
    main,
    body,
    mainText,
    bodyText,
    words: wordCount(bodyText),
    mainAnchors: anchorsIn(main),
    bodyAnchors: anchorsIn(body),
    docAnchors: anchorsIn(doc),
    contextual: contextualAnchors(body),
  };
}

/* A CONTEXTUAL LINK HAS WORDS AROUND IT. Google, "Link best practices":
   "Don't chain up links next to each other ... you lose surrounding text for
   each link." So a link counts as contextual when the paragraph, list item,
   cell or caption that holds it carries at least T.contextWords words that are
   not link text. A chip grid of city names, a card title, a "related" list of
   bare titles: navigation, still counted as inbound for the target, not as
   the page's own editorial links. */
const CONTAINERS = ['p', 'li', 'td', 'dd', 'blockquote', 'figcaption'];
export function contextualAnchors(html) {
  const spans = [];
  for (const tag of CONTAINERS) {
    for (const m of html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))) {
      const [s, e] = elementSpan(html, tag, m.index);
      spans.push([s, e]);
    }
  }
  return anchorsIn(html).filter((a) => {
    let best = null;
    for (const sp of spans) if (sp[0] <= a.index && a.index < sp[1] && (!best || sp[1] - sp[0] < best[1] - best[0])) best = sp;
    if (!best) return false;
    const around = visibleText(html.slice(best[0], best[1]).replace(/<a\b[\s\S]*?<\/a>/gi, ' '));
    return wordCount(around.replace(/[^\p{L}\p{N}\s'’-]+/gu, ' ')) >= T.contextWords;
  });
}

/* Families whose page is a list: their links are their content, so they are
   scored on having links, not on how many (a CollectionPage of 42 guides
   links 42 guides). */
const INDEX_FAMILIES = new Set(['home', 'hub', 'glossary']);

/* ---- context ------------------------------------------------------------ */

/**
 * Everything a page's score depends on beyond the page itself.
 *   pages     parsed pages (every scored page, so inbound links are counted
 *             from the whole site even when --only narrows the report)
 *   opts      { sitemap: Set<path>, known: Set<path>, redirects, roster,
 *               perf: { medianHtml, maxHtml }, robotsRules, gentle: Set<path> }
 */
export function buildContext(pages, opts = {}) {
  const sitemap = opts.sitemap ?? new Set(pages.map((p) => p.path));
  const titleCount = new Map();
  const descCount = new Map();
  for (const p of pages) {
    if (p.title) titleCount.set(p.title, (titleCount.get(p.title) ?? 0) + 1);
    if (p.desc) descCount.set(p.desc, (descCount.get(p.desc) ?? 0) + 1);
  }

  /* Inbound: distinct indexable pages linking from <main>, navigation,
     header, footer and breadcrumb excluded (the owner's brief). */
  const inbound = new Map();
  for (const p of pages) {
    if (!sitemap.has(p.path)) continue;
    const targets = new Set(p.bodyAnchors.map((a) => internalPath(a.href)).filter((t) => t && t !== p.path));
    for (const t of targets) {
      if (!inbound.has(t)) inbound.set(t, new Set());
      inbound.get(t).add(p.path);
    }
  }

  /* Near-duplication: each page against every sibling in its family, by the
     uniqueness gate's own measure. Two pages that name each other in
     hreflang are one page in two languages, which Google treats as localized
     versions, not duplicates, so that pair is not compared. */
  const byFamily = new Map();
  for (const p of pages) {
    if (!byFamily.has(p.family)) byFamily.set(p.family, []);
    byFamily.get(p.family).push(p);
  }
  const twinsOf = (p) => new Set(p.alternates.map((a) => { try { return internalPath(a.href); } catch { return null; } }).filter(Boolean));
  /* A translation is in another language. Two English pages that name each
     other in hreflang are not localized versions, whatever the tags say, so
     the exemption needs the two <html lang> primary subtags to differ —
     otherwise a pair of near-copies could tag their way out of the measure
     (4 Oct 2026 review). */
  const primary = (p) => String(p.lang ?? '').toLowerCase().split('-')[0];
  const translated = (a, b) => primary(a) !== '' && primary(b) !== '' && primary(a) !== primary(b);
  const dup = new Map();
  for (const [family, list] of byFamily) {
    const sh = list.map((p) => shingles(textOf(p.main)));
    const twins = list.map(twinsOf);
    list.forEach((p, i) => {
      let near = { v: 0, path: null };
      let compared = 0;
      for (let j = 0; j < list.length; j++) {
        if (j === i) continue;
        if ((twins[i].has(list[j].path) || twins[j].has(p.path)) && translated(p, list[j])) continue;
        compared++;
        const v = jaccard(sh[i], sh[j]);
        if (v > near.v) near = { v, path: list[j].path };
      }
      dup.set(p.path, { family, siblings: compared, nearest: near });
    });
  }

  /* A translation of a gentle page is gentle. GENTLE_CTA names English guide
     slugs; when a Punjabi or Tagalog guide is the hreflang twin of one, the
     owner's judgement about the subject applies to it in every language, so
     the scorer never asks a translated grief or trauma guide for a first-
     screen booking button its English original is spared (4 Oct 2026
     review). */
  const gentle = new Set(opts.gentle ?? []);
  for (const p of pages) {
    if ([...twinsOf(p)].some((t) => t !== p.path && (opts.gentle ?? new Set()).has(t))) gentle.add(p.path);
  }

  return {
    sitemap,
    known: opts.known ?? new Set(sitemap),
    redirects: opts.redirects ?? [],
    roster: opts.roster ?? { counsellors: [], services: {} },
    perf: opts.perf ?? { medianHtml: Infinity, maxHtml: Infinity },
    robotsRules: opts.robotsRules ?? [],
    gentle,
    titleCount, descCount, inbound, dup,
  };
}

/* ---- redirects ---------------------------------------------------------- */

/** next.config-style source -> RegExp: ':slug', ':path*', ':path+', and a
    parameter with its own pattern, ':path((?!api/).*)'. The pattern is split
    off before the path is cut into segments, because it may hold a slash. */
export function sourceRegex(source) {
  const custom = [];
  const s = source.replace(/:([A-Za-z_]\w*)\(((?:[^()]|\([^()]*\))*)\)([*+?]?)/g, (_, name, re, mod) => {
    custom.push({ re, mod });
    return `\u0000${custom.length - 1}\u0000`;
  });
  const esc = s.replace(/\/$/, '').split('/').map((seg) => {
    const c = seg.match(/^\u0000(\d+)\u0000$/);
    if (c) {
      const { re, mod } = custom[Number(c[1])];
      return mod === '*' || mod === '?' ? `(?:${re})?` : mod === '+' ? `(?:${re})(?:/(?:${re}))*` : `(?:${re})`;
    }
    const m = seg.match(/^:([A-Za-z_]\w*)([*+?]?)$/);
    if (!m) return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (m[2] === '*') return '(?:.*)?';
    if (m[2] === '+') return '.+';
    return '[^/]+';
  }).join('/');
  return new RegExp(`^${esc.replace(/\/\(\?:\.\*\)\?$/, '(?:/.*)?')}$`);
}

/* A redirect with a `has` condition fires only when the request carries it.
   The one this site declares sends the old vercel.app host to www; a link on
   www never meets it. A host condition is tested against the production
   host; any other `has` (a header, a cookie, a query) is a request a link
   does not make, so it does not apply. Before this (4 Oct 2026 review) the
   host redirect's custom pattern simply failed to parse into anything; read
   properly without the condition it would have matched every path on the
   site and called every broken link a redirect. */
const HOST = new URL(ORIGIN).host;
const applies = (r) => !(r.has ?? []).some((h) => (h.type === 'host' ? !new RegExp(`^(?:${h.value})$`).test(HOST) : true));

export function redirectFor(path, redirects) {
  for (const r of redirects) {
    if (!applies(r)) continue;
    if (!r._re) r._re = sourceRegex(r.source);
    if (r._re.test(path)) return r;
  }
  return null;
}

/* ---- roster ------------------------------------------------------------- */

const LANG_TAG = { english: 'en', punjabi: 'pa', tagalog: 'tl' };

/** The roster as /ai.json publishes it: who accepts, speaks what, offers what. */
export function rosterFromAiJson(ai) {
  const slugOf = (u) => String(u ?? '').replace(/^.*\/practitioners\//, '').replace(/[/?#].*$/, '');
  const counsellors = (ai?.counsellors ?? []).map((c) => ({
    slug: slugOf(c.url),
    name: c.name,
    first: String(c.name).split(' ')[0],
    languages: (c.languages ?? []).map((l) => LANG_TAG[String(l).toLowerCase()] ?? String(l).toLowerCase()),
    provinces: c.provinces ?? [],
    accepting: c.accepting_new_clients !== false,
    bookable: /[?&]with=/.test(c.booking_url ?? ''),
  }));
  const services = {};
  for (const s of ai?.services ?? []) {
    const slug = String(s.url ?? '').replace(/^.*\/services\//, '');
    services[slug] = (s.counsellors ?? []).map((c) => {
      const byName = counsellors.find((x) => x.name === c.name);
      return byName ? byName.slug : String(c.booking_url ?? '').replace(/^.*[?&]with=/, '');
    });
  }
  return { counsellors, services };
}

/* City-service and condition slugs, as the bookingService they book into
   (lib/conditions.ts: anxiety, depression and trauma are individual work). */
const CONDITION_SERVICE = {
  'anxiety-counselling': 'individual-therapy',
  'depression-counselling': 'individual-therapy',
  'trauma-therapy': 'individual-therapy',
};

/** What the page is about, as far as booking is concerned. */
export function bookingSubject(path) {
  const s = path.split('/').filter(Boolean);
  const subject = { service: undefined, language: undefined, province: undefined, counsellor: undefined };
  if (s[0] === 'services' && s[1]) subject.service = s[1];
  if (s[0] === 'online-counselling' && s[2]) subject.service = CONDITION_SERVICE[s[2]] ?? s[2];
  if (s[0] === 'practitioners' && s[1]) subject.counsellor = s[1];
  if (s.includes('pa') || s[0] === 'punjabi' || s[0] === 'punjabi-counselling' || subject.service === 'punjabi-counselling') subject.language = 'pa';
  if (s.includes('tl') || s[0] === 'tagalog' || s[0] === 'tagalog-counselling' || subject.service === 'tagalog-counselling') subject.language = 'tl';
  if (s.some((x) => ['calgary', 'edmonton', 'alberta'].includes(x))) subject.province = 'AB';
  if (subject.service === 'punjabi-counselling' || subject.service === 'tagalog-counselling') subject.service = undefined;
  return subject;
}

/** Accepting counsellors who fit the subject: offer the service, speak the language, practise in the province. */
export function fittingCounsellors(subject, roster) {
  return roster.counsellors.filter(
    (c) =>
      c.accepting &&
      (!subject.counsellor || c.slug === subject.counsellor) &&
      (!subject.service || (roster.services[subject.service] ?? []).includes(c.slug)) &&
      (!subject.language || c.languages.includes(subject.language)) &&
      (!subject.province || c.provinces.includes(subject.province)),
  );
}

/* ---- the checks --------------------------------------------------------- */

/* Topic words: three letters or more (CBT, EAP, ACT count), function words
   and the brand dropped, compared on a four-letter stem so "caregivers" meets
   "caring" and "therapist" meets "therapy". */
const STOP = new Set('the and for with your you are what how when who why that this from into about does not can its our their than then have has was were will just more most also only over under after before between westpeak wellness'.split(' '));
export const topicWords = (s) =>
  new Set(
    String(s ?? '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length >= 3 && !STOP.has(w))
      .map((w) => w.slice(0, 4)),
  );

/* Lighthouse's link-text list (developer.chrome.com/docs/lighthouse/seo/link-text),
   scripts/quality-audit.mjs VAGUE, and the brief's "this page". */
const GENERIC = /^(click here|click this|go|here|this|start|right here|more|learn more|read more|see more|link|this page|details|continue)\.?$/i;

/* Authoritative sources for a factual page: government, public health,
   regulators and professional associations, peer-reviewed indexes. A
   suffix match on the host. */
const AUTHORITY = [
  'gov.bc.ca', 'canada.ca', 'gc.ca', '.gov', 'alberta.ca', 'healthlinkbc.ca', 'heretohelp.bc.ca', 'phsa.ca',
  'fraserhealth.ca', 'vch.ca', 'interiorhealth.ca', 'islandhealth.ca', 'northernhealth.ca', 'keltymentalhealth.ca',
  'foundrybc.ca', 'here2talk.ca', '988.ca', 'crisiscentre.bc.ca', 'worksafebc.com', 'icbc.com', 'oipc.bc.ca',
  'bchumanrights.ca', 'bchrt.bc.ca', 'chcpbc.org', 'bccsw.ca', 'cap.ab.ca', 'bcacc.ca', 'ccpa-accp.ca', 'cpa.ca',
  'cpa-apc.org', 'apa.org', 'cmha.ca', 'cmha.bc.ca', 'camh.ca', 'royalcollege.ca', 'who.int', 'nice.org.uk',
  'doi.org', 'cochranelibrary.com', 'emdria.org', 'iceeft.com', 'psychologists.bc.ca', 'bc-counsellors.org',
  'bouncebackbc.ca', 'anxietycanada.com',
];
export const isAuthority = (href) => {
  let host;
  try { host = new URL(href).hostname.toLowerCase(); } catch { return false; }
  if (!/^https:/i.test(href)) return false;
  return AUTHORITY.some((d) => (d.startsWith('.') ? host.endsWith(d) : host === d || host.endsWith(`.${d}`)));
};

const VERIFY = /bcacc\.ca\/search-our-member-register|ccpa-accp\.ca\/find|^\/resources\/verify-a-counsellor-in-bc|^\/compare\/rcc-vs-psychologist-vs-social-worker-bc/;
/* A phone line or the crisis directory: on a gentle page, calling somebody
   is as much a next step as booking. */
const CRISIS = /^tel:|^\/resources\/bc-crisis-and-support-directory/;
export const CRISIS_PAGE = '/resources/bc-crisis-and-support-directory';
const HARD_SELL = /!|book now|act now|don.?t wait|limited|today only|hurry/i;

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const pts = (max, share) => Math.round(max * clamp01(share));

/** Score one parsed page. Returns { path, family, score, pillars, checks }. */
export function scorePage(p, ctx) {
  const checks = [];
  const add = (pillar, id, max, got, reason = '') =>
    checks.push({ pillar, id, max, points: Math.max(0, Math.min(max, Math.round(got))), reason: got >= max ? '' : reason });
  const R = RUBRIC;
  const url = p.path === '/' ? ORIGIN : ORIGIN + p.path;
  const gentle = ctx.gentle.has(p.path);
  const policy = p.family === 'policy';

  /* ================= SEO ================= */
  {
    const max = R.seo.title;
    const parts = [];
    let got = 0;
    if (p.titleRaw) got += max / 3; else parts.push('no <title>');
    if (p.title && ctx.titleCount.get(p.title) === 1) got += max / 3;
    else if (p.title) parts.push(`shared by ${ctx.titleCount.get(p.title)} pages`);
    const len = p.titleRaw?.length ?? 0;
    if (len >= T.titleMin && len <= T.titleMax) got += max / 3;
    else if (p.titleRaw) parts.push(`${len} chars (want ${T.titleMin}-${T.titleMax})`);
    add('seo', 'title', max, got, parts.join('; '));
  }
  {
    const max = R.seo.description;
    const parts = [];
    let got = 0;
    if (p.descRaw) got += 150; else parts.push('no meta description');
    if (p.desc && ctx.descCount.get(p.desc) === 1) got += 150;
    else if (p.desc) parts.push(`shared by ${ctx.descCount.get(p.desc)} pages`);
    const len = p.descRaw?.length ?? 0;
    if (len >= T.descMin && len <= T.descMax) got += 200;
    else if (p.descRaw) parts.push(`${len} chars (want ${T.descMin}-${T.descMax}, & as &amp;)`);
    add('seo', 'description', max, got, parts.join('; '));
  }
  {
    const max = R.seo.h1;
    let got = 0;
    let reason = '';
    if (p.h1s.length === 1) {
      got += 150;
      const t = topicWords((p.title ?? '').replace(/\s*[|–—-]\s*Westpeak Wellness\s*$/i, ''));
      const h = topicWords(p.h1s[0]);
      const shared = [...t].filter((w) => h.has(w)).length;
      /* The stems are English. On a Punjabi or Tagalog page the comparison
         means nothing, and a new heading there would be new Punjabi or
         Tagalog prose, which the owner has not cleared. */
      const english = !p.lang || /^en\b/i.test(p.lang);
      if (!english || !t.size || shared >= Math.min(2, t.size) || shared / t.size >= 0.5) got += 150;
      else if (shared >= 1) { got += 75; reason = `H1 shares 1 of ${t.size} title topic words`; }
      else reason = `H1 "${p.h1s[0].slice(0, 60)}" shares no topic word with the title`;
    } else reason = `${p.h1s.length} H1 elements (want exactly one)`;
    add('seo', 'h1', max, got, reason);
  }
  {
    const max = R.seo.canonical;
    const c = p.canonical;
    let got = 0;
    const parts = [];
    if (c) got += 100; else parts.push('no canonical');
    if (c && /^https:\/\//.test(c)) got += 100; else if (c) parts.push('not absolute https');
    if (c && c.replace(/\/$/, '') === url.replace(/\/$/, '')) got += 100; else if (c) parts.push(`points at ${c}`);
    add('seo', 'canonical', max, got, parts.join('; '));
  }
  {
    const max = R.seo.indexable;
    let got = 0;
    const parts = [];
    if (!/noindex/i.test(p.robots)) got += 150; else parts.push(`robots "${p.robots}" on a sitemap URL`);
    const rule = blockedBy(ctx.robotsRules, p.path);
    if (!rule) got += 75; else parts.push(`robots.txt ${rule}`);
    /* A redirect declared in next.config runs before the route, so a sitemap
       URL that is also a redirect source is never served as this page. */
    const redirected = redirectFor(p.path, ctx.redirects);
    if (ctx.sitemap.has(p.path) && !redirected) got += 75;
    else parts.push(redirected ? `in the sitemap but next.config redirects it to ${redirected.destination}` : 'not in the sitemap');
    add('seo', 'indexable', max, got, parts.join('; '));
  }
  {
    const max = R.seo.jsonld;
    const parsed = p.ld.filter((b) => b.ok).map((b) => b.value);
    const types = new Set(parsed.flatMap((v) => nodesIn(v)).flatMap((n) => [].concat(n['@type'] ?? [])));
    let got = 0;
    const parts = [];
    if (p.ld.length && p.ld.every((b) => b.ok)) got += 100;
    else parts.push(p.ld.length ? 'a JSON-LD block does not parse' : 'no JSON-LD');
    const want = expectedTypes(p.family);
    if (want.some((t) => types.has(t))) got += 200; else parts.push(`no ${want.join('/')} for a ${p.family} page`);
    if (types.has('BreadcrumbList') || p.path === '/') got += 100; else parts.push('no BreadcrumbList');
    add('seo', 'jsonld', max, got, parts.join('; '));
  }
  {
    const max = R.seo.headingOrder;
    const skips = [];
    let prev = 0;
    for (const h of p.headings) {
      if (prev && h > prev + 1) skips.push(`h${prev}→h${h}`);
      prev = h;
    }
    if (p.headings.length && p.headings[0] !== 1) skips.unshift(`starts at h${p.headings[0]}`);
    const distinct = [...new Set(skips)];
    add('seo', 'headingOrder', max, max - (max / 2) * distinct.length, distinct.length ? `skips: ${distinct.join(', ')}` : '');
  }
  {
    const max = R.seo.words;
    const cls = wordClassOf(p.family);
    const floor = WORD_FLOOR[cls];
    const share = (p.words - floor / 2) / (floor / 2);
    add('seo', 'words', max, pts(max, share), `${p.words} words in <main> (${cls} floor ${floor})`);
  }
  {
    const max = R.seo.uniqueness;
    const d = ctx.dup.get(p.path);
    if (!d || d.siblings === 0) add('seo', 'uniqueness', max, max);
    else {
      /* Full at or under the healthy line (50%, or the family's own tighter
         ceiling), zero at the gate's fail line, linear between. */
      const ceiling = SIMILARITY_CEILING[p.family] ?? DEFAULT_CEILING;
      const healthy = Math.min(T.healthySimilarity, ceiling);
      const v = d.nearest.v;
      const got = v <= healthy ? max : v >= ceiling ? 0 : pts(max, (ceiling - v) / (ceiling - healthy));
      add('seo', 'uniqueness', max, got,
        `${Math.round(v * 100)}% alike its nearest ${p.family} sibling ${d.nearest.path} (healthy ${Math.round(healthy * 100)}%, gate ceiling ${Math.round(ceiling * 100)}%)`);
    }
  }
  {
    const max = R.seo.images;
    if (!p.imgs.length) add('seo', 'images', max, max);
    else {
      const noAlt = p.imgs.filter((t) => !/\salt=/i.test(t)).length;
      const noSize = p.imgs.filter((t) => !(/\swidth=/i.test(t) && /\sheight=/i.test(t))).length;
      const got = 100 * (1 - noAlt / p.imgs.length) + 100 * (1 - noSize / p.imgs.length);
      add('seo', 'images', max, got, [noAlt && `${noAlt} <img> without alt`, noSize && `${noSize} <img> without width/height`].filter(Boolean).join('; '));
    }
  }
  {
    const max = R.seo.openGraph;
    const miss = ['title', 'description', 'image'].filter((k) => !p.og[k]);
    add('seo', 'openGraph', max, max - (miss.includes('title') ? 35 : 0) - (miss.includes('description') ? 30 : 0) - (miss.includes('image') ? 35 : 0),
      miss.length ? `missing og:${miss.join(', og:')}` : '');
  }
  {
    const max = R.seo.lang;
    let got = 0;
    const parts = [];
    if (p.lang) got += 50; else parts.push('no <html lang>');
    if (!p.alternates.length) got += 50;
    else {
      const declared = new Map([[url, p.alternates]]);
      for (const a of p.alternates) {
        const target = ctx.alternatesOf?.get(a.href);
        if (target) declared.set(a.href, target);
      }
      const probs = hreflangProblems(declared, new Set(declared.keys())).filter((x) => x.page === url);
      if (!probs.length) got += 50; else parts.push(probs.map((x) => `${x.kind}: ${x.detail}`).join('; '));
    }
    add('seo', 'lang', max, got, parts.join('; '));
  }
  {
    const max = R.seo.weight;
    const { medianHtml, maxHtml } = ctx.perf;
    const over = p.bytes <= medianHtml ? 0 : (p.bytes - medianHtml) / Math.max(1, maxHtml - medianHtml);
    let got = pts(150, 1 - over);
    const parts = [];
    if (got < 150) parts.push(`${p.bytes} B HTML (budget median ${medianHtml}, max ${maxHtml})`);
    if (p.dynamic || (p.inlinedCss && p.blockingCss === 0)) got += 150;
    else parts.push(p.inlinedCss ? `${p.blockingCss} render-blocking stylesheet(s)` : 'stylesheet not inlined on a static page');
    add('seo', 'weight', max, got, parts.join('; '));
  }

  /* ================= LINKS ================= */
  {
    const max = R.links.inbound;
    const n = ctx.inbound.get(p.path)?.size ?? 0;
    /* The home page is what every logo and every breadcrumb points at; the
       brief excludes exactly those links, so the count says nothing about it. */
    if (p.path === '/') add('links', 'inbound', max, max);
    else add('links', 'inbound', max, pts(max, n / T.inboundFull), `${n} indexable page(s) link here from <main> (want ${T.inboundFull})`);
  }
  {
    const max = R.links.outbound;
    const index = INDEX_FAMILIES.has(p.family);
    const targets = (list) => new Set(
      list
        .map((a) => internalPath(a.href))
        .filter((t) => t && t !== p.path && !/^\/(book|_next|img|images)(\/|$)/.test(t) && !/\.(svg|png|jpe?g|webp|pdf|vcf)$/i.test(t)),
    );
    const n = targets(index ? p.bodyAnchors : p.contextual).size;
    let got;
    if (n < T.outboundMin) got = max * (n / T.outboundMin);
    else if (n <= T.outboundFull || index) got = max;
    else if (n <= T.outboundSoft) got = max * 0.75;
    else got = max * 0.5 * clamp01(1 - (n - T.outboundSoft) / (T.outboundZero - T.outboundSoft));
    add('links', 'outbound', max, got, index
      ? `${n} distinct internal links in <main> (an index page needs ${T.outboundMin})`
      : `${n} distinct contextual internal links (with words around them) in <main>; full at ${T.outboundMin}-${T.outboundFull}, over ${T.outboundSoft} reads as stuffing`);
  }
  {
    const max = R.links.anchors;
    const links = p.bodyAnchors.filter((a) => !a.href.startsWith('#'));
    const generic = links.filter((a) => !a.name || GENERIC.test(a.name.replace(/\s*[→›»]+\s*$/u, '')));
    const share = links.length ? 1 - generic.length / links.length : 1;
    add('links', 'anchors', max, pts(max, share), generic.length ? `${generic.length} of ${links.length} link(s) say nothing out of context: ${[...new Set(generic.map((a) => `"${a.name}"`))].slice(0, 3).join(', ')}` : '');
  }
  {
    const broken = new Set();
    const viaRedirect = new Set();
    for (const a of p.docAnchors) {
      const t = internalPath(a.href);
      if (!t || t.startsWith('/_next/')) continue;
      const base = t.replace(/\.md$/, '') || '/';
      /* Redirects first: Next applies them before the filesystem, so a link
         to a built page that a redirect shadows still costs the hop. */
      const r = redirectFor(t, ctx.redirects);
      if (r) viaRedirect.add(`${t} → ${r.destination}`);
      else if (!(ctx.known.has(t) || ctx.known.has(base === '/index' ? '/' : base))) broken.add(t);
    }
    add('links', 'broken', R.links.broken, R.links.broken - 250 * broken.size, broken.size ? `${broken.size} internal link(s) to nothing: ${[...broken].slice(0, 3).join(', ')}` : '');
    add('links', 'redirects', R.links.redirects, R.links.redirects - 100 * viaRedirect.size, viaRedirect.size ? `${viaRedirect.size} link(s) through a redirect: ${[...viaRedirect].slice(0, 3).join(', ')}` : '');
  }
  {
    const max = R.links.citations;
    if (!FACTUAL.has(p.family)) add('links', 'citations', max, max);
    else {
      const cited = p.bodyAnchors.some((a) => isAuthority(a.href));
      add('links', 'citations', max, cited ? max : 0, 'no https link to a government, regulator, association or peer-reviewed source in <main>');
    }
  }
  add('links', 'breadcrumb', R.links.breadcrumb, p.breadcrumbNav || p.path === '/' ? R.links.breadcrumb : 0, 'no visible breadcrumb <nav aria-label="Breadcrumb">');

  /* ================= CLIENTS ================= */
  /* What the page itself offers: <main> as a reader meets it (p.body), not
     its breadcrumb, table of contents or hidden markup. */
  const books = p.bodyAnchors.filter((a) => isBookHref(a.href));
  const mailOrContact = p.bodyAnchors.some((a) => /^mailto:/i.test(a.href) || internalPath(a.href) === '/contact') || /<form\b/i.test(p.body);
  const crisis = p.path === CRISIS_PAGE;

  if (policy) {
    /* Policy and legal pages: the brief scores them on the smaller ask and a
       route to booking only. cta-audit.mjs exempts them from an in-page
       booking CTA, so the site's own Book button (header, sticky bar) counts. */
    const anyBook = p.docAnchors.some((a) => isBookHref(a.href));
    add('clients', 'email', 1500, mailOrContact ? 1500 : 0, 'no email address, /contact link or form in <main>');
    add('clients', 'bookAnywhere', 1500, anyBook ? 1500 : 0, 'no /book link anywhere on the page');
  } else {
    const C = R.clients;
    if (gentle) {
      /* GENTLE_CTA guides and the crisis directory: "an appropriate next step
         is offered" stands in for the first-screen CTA and the named
         counsellor, so the full pillar is reachable without a hard sell. */
      const steps = p.bodyAnchors.filter((a) => isBookHref(a.href) || internalPath(a.href) === '/contact' || /^mailto:/i.test(a.href) || CRISIS.test(a.href));
      const hard = steps.filter((a) => isBookHref(a.href) && HARD_SELL.test(a.name));
      const max = C.firstScreen + C.counsellor;
      add('clients', 'gentleNextStep', max, !steps.length ? 0 : hard.length ? max / 2 : max,
        !steps.length ? 'no next step offered (booking, contact or a crisis line)' : `hard-sell wording on a gentle page: "${hard[0]?.name}"`);
    } else {
      const max = C.firstScreen;
      if (p.path === '/book') add('clients', 'firstScreen', max, max);
      else if (!books.length) add('clients', 'firstScreen', max, 0, 'no /book link in <main>');
      else {
        const first = books[0];
        const before = wordCount(readableText(p.body.slice(0, first.index)));
        const share = p.words ? before / p.words : 0;
        const h2 = p.body.search(/<h2\b/i);
        /* Before the first H2 is the hero. A page with no H2 has no hero
           boundary, so it is held to the word share alone; before this (4 Oct
           2026 review) a page without an H2 passed with its only booking link
           at the very end. */
        const inHero = h2 !== -1 && first.index < h2;
        const got = inHero || share <= T.firstScreenShare ? max : pts(max, (T.firstScreenZero - share) / (T.firstScreenZero - T.firstScreenShare));
        add('clients', 'firstScreen', max, got, `first booking link ${before} words (${Math.round(share * 100)}%) into <main>, ${h2 === -1 ? 'on a page with no H2' : 'after the first H2'}`);
      }
      const named = ctx.roster.counsellors.filter((c) => c.accepting).some((c) =>
        p.bodyAnchors.some((a) => internalPath(a.href)?.startsWith(`/practitioners/${c.slug}`) || new RegExp(`[?&]with=${c.slug}\\b`).test(a.href)) ||
        p.bodyText.includes(c.name));
      add('clients', 'counsellor', C.counsellor, named ? C.counsellor : 0, 'no accepting counsellor named or linked in <main>');
    }

    /* Routing: every narrowed booking link goes to somebody who fits; when
       exactly one fits a page about a service, language or counsellor, the
       page's booking link opens her calendar (lib/booking-cta.ts bookingFor). */
    {
      const max = C.routing;
      const subject = bookingSubject(p.path);
      const accepting = new Set(ctx.roster.counsellors.filter((c) => c.accepting).map((c) => c.slug));
      /* A counsellor's own page (profile, place page, twin) is about her:
         its first booking link must open her calendar while she is accepting.
         A colleague's button further down is a deliberate alternative, not a
         misroute. A page about a service, language or province is held to
         the stricter rule: no ?with= anywhere to somebody who does not fit. */
      const own = subject.counsellor && accepting.has(subject.counsellor) ? subject.counsellor : undefined;
      const rest = { ...subject, counsellor: undefined };
      const constrained = Boolean(rest.service || rest.language || rest.province);
      const fit = fittingCounsellors(rest, ctx.roster);
      const fitSlugs = new Set(fit.map((c) => c.slug));
      const withOf = (a) => (a.href.match(/[?&]with=([a-z0-9-]+)/) || [])[1];
      const withs = books.map(withOf).filter(Boolean);
      /* Misroutes are looked for on the whole page: the sticky bar and the
         header are booking buttons too, and the most-tapped ones on a phone. */
      const allWiths = p.docAnchors.filter((a) => isBookHref(a.href)).map(withOf).filter(Boolean);
      const wrong = own ? [] : allWiths.filter((w) => (constrained ? !fitSlugs.has(w) : !accepting.has(w)));
      if (p.path === '/book') add('clients', 'routing', max, max);
      else if (!books.length) add('clients', 'routing', max, gentle ? max : 0, 'no booking link to route');
      else if (own) {
        const first = withOf(books[0]);
        add('clients', 'routing', max, first === own ? max : first ? 0 : max / 2,
          first ? `the first booking link on ${own}'s page books with ${first}` : `the first booking link on ${own}'s page is the bare /book, not her calendar`);
      } else if (wrong.length) add('clients', 'routing', max, 0, `books with ${[...new Set(wrong)].join(', ')}, who does not fit ${JSON.stringify(rest).replace(/"/g, '')}`);
      else if (constrained && fit.length === 1 && fit[0].bookable && !withs.includes(fit[0].slug)) {
        add('clients', 'routing', max, max / 2, `only ${fit[0].slug} fits, and no booking link carries with=${fit[0].slug}`);
      } else add('clients', 'routing', max, max);
    }

    /* The crisis directory is not asked for a price or the consultation: it
       keeps its gentle treatment, and a scorer that docked it would be
       asking somebody to put fees on a page read in a crisis. What it
       already says, it may say; it is never required to (4 Oct 2026 review). */
    const fee = /\$\s?\d/.test(p.bodyText) || p.bodyAnchors.some((a) => internalPath(a.href) === '/pricing');
    add('clients', 'fee', C.fee, fee || crisis ? C.fee : 0, 'no fee and no /pricing link in <main>');

    {
      const t = p.bodyText;
      /* The consultation itself, not any thirty minutes: "a thirty-minute
         medication consult" with a psychiatrist is a fact about somebody else.
         And the fifteen minutes must sit beside the consultation (within a
         sentence's reach), not anywhere on a page that says "free" somewhere
         and "15 minutes" of breathing practice somewhere else. */
      const thirty = /\b(30|thirty)[- ]minutes?\s+(free\s+)?consult/i.test(t) || /free\s+(30|thirty)[- ]minute/i.test(t);
      const fifteen = [...t.matchAll(/\b(?:15|fifteen)[- ]minutes?\b/gi)].some((m) =>
        /consult|\bfree\b|\bcall\b|conversation/i.test(t.slice(Math.max(0, m.index - 60), m.index + m[0].length + 80)));
      add('clients', 'consult', C.consult, thirty ? 0 : fifteen || crisis ? C.consult : 0,
        thirty ? 'states a 30-minute consultation; the owner set 15 minutes (3 Oct, lib/cliniko-catalog.ts CONSULT_MINUTES)' : 'the free 15-minute consultation is not mentioned in <main>');
    }
    {
      const inMain = p.bodyAnchors.some((a) => VERIFY.test(a.href) || VERIFY.test(internalPath(a.href) ?? ''));
      const anywhere = p.docAnchors.some((a) => VERIFY.test(a.href) || VERIFY.test(internalPath(a.href) ?? ''));
      const privacy = p.docAnchors.some((a) => internalPath(a.href) === '/privacy');
      const got = (inMain ? 200 : anywhere ? 100 : 0) + (privacy ? 100 : 0);
      add('clients', 'trust', C.trust, got, [!inMain && (anywhere ? 'registration check linked only from the footer' : 'no link to verify registration or the RCC explainer'), !privacy && 'no privacy policy link'].filter(Boolean).join('; '));
    }
    add('clients', 'email', C.email, mailOrContact ? C.email : 0, 'no email address, /contact link or form in <main>');
    /* The crisis directory carries no booking prompt anywhere, the sticky bar
       included (components/StickyBook.tsx returns null there on purpose). */
    add('clients', 'sticky', C.sticky, p.sticky || crisis ? C.sticky : 0, 'no mobile StickyBook bar');
  }

  const pillars = { seo: 0, links: 0, clients: 0 };
  for (const c of checks) pillars[c.pillar] += c.points;
  return {
    path: p.path,
    family: p.family,
    score: pillars.seo + pillars.links + pillars.clients,
    pillars,
    gentle: gentle || undefined,
    checks,
  };
}

/** Score every page; results in path order, so output is deterministic. */
export function scoreAll(pages, opts = {}) {
  const ctx = buildContext(pages, opts);
  ctx.alternatesOf = new Map(pages.map((p) => [p.path === '/' ? ORIGIN : ORIGIN + p.path, p.alternates]));
  return [...pages].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)).map((p) => scorePage(p, ctx));
}
