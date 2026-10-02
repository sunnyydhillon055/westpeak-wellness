/* The browser half of lib/conversion-detail.ts — composition only, no data.
 *
 * WHY THIS FILE EXISTS — 1 Oct 2026. Header, StickyBook and BookLink are
 * client components on every page, and they imported bookClickDetail and
 * withSlugOf from lib/conversion-detail.ts. That module builds its allow-list
 * from lib/practitioners.ts and lib/tools.ts, so the import put the whole
 * roster and every tool's questions back into the layout chunk the same day
 * lib/roster-nav.ts took them out: the perf gate measured layout first-load
 * JS at 401,619 B against a 350,474 B baseline (+14.6%).
 *
 * The browser does not need the list to compose a key. It joins the button
 * and the counsellor the href names; /api/track checks the result against
 * the list (allowedDetail in lib/conversion-detail.ts) and, when the
 * counsellor half is not on it, keeps the button half. Nothing the browser
 * sends is stored unless the server's list already holds it, which is the
 * same guarantee as before, enforced in the one place it can be trusted. */

const SEP = '/';

/** The `?with=` value of a booking href, unvalidated. */
export function withSlugOf(href: string | undefined | null): string | undefined {
  if (!href) return undefined;
  const q = href.indexOf('?');
  if (q < 0) return undefined;
  const w = new URLSearchParams(href.slice(q + 1).split('#')[0]).get('with');
  return w || undefined;
}

/** "sticky/camille-granda", or "sticky" when no counsellor is named. */
export function bookClickDetail(location: string, who?: string | null): string {
  return who ? `${location}${SEP}${who}` : location;
}

/** "which-service:couples", or the tool alone. */
export function toolDetail(tool: string, outcome?: string | null): string {
  return outcome ? `${tool}:${outcome}` : tool;
}

/* WHERE A VISIT CAME FROM, AS ONE WORD FROM A FIXED LIST — 1 Oct 2026.
 *
 * Two lists, both short enough to ship in the layout chunk and both enforced
 * again by the server (ALLOWED in lib/conversion-detail.ts, which imports
 * these rather than keeping a second copy).
 *
 * CHANNELS are the values a link the practice hands out may carry as
 * ?utm_source=. Each names a KIND of organisation — a directory, a family
 * practice, an HR team, a campus — never a person, and no link a client is
 * given to pass on carries one: the /refer pages' "no referral codes" rule is
 * about tracking who referred whom, and this tracks which kind of place
 * published the link. Anything not on the list is dropped in the browser and
 * never leaves it.
 *
 * REFERRER_CLASSES are what the landing page's referrer host is reduced to.
 * The host is classified here and only the class is sent: no URL, no path,
 * no query. A referrer from this site itself (a new tab opened from a page)
 * is not an outside source and counts as `none`. */
export const CHANNELS = [
  'gbp', 'bing', 'apple', 'bcacc', 'listing', 'gp', 'clinic', 'hr', 'campus', 'community', 'counsellor',
  /* 1 Oct 2026: a paper's link (docs/OUTREACH.md section 4) and a student
     society's, which is not the campus wellness office. Appended, never
     reordered. */
  'press', 'student',
  /* The practice's own automated email (tagMail in lib/booking-mail.ts):
     not an organisation, but the one link source that is neither search nor
     somebody else's page. The template rides in utm_campaign and is not
     counted here. 1 Oct 2026. */
  'email',
] as const;

/* EARNED LINKS (1 Oct 2026). A paper, a university or an agency that links
   to a page usually does so untagged, so it arrived as 'other' and the
   outreach in docs/OUTREACH.md could only be read in the GSC Links report,
   which shows no visits and no bookings. Three classes, from the hosts that
   outreach names: 'edu' (BC universities, colleges and student societies),
   'press' (local and BC papers) and 'org' (settlement agencies, chambers,
   legal-information and mental-health organisations). Still only the class
   leaves the browser, never the host. */
export const REFERRER_CLASSES = ['google', 'bing', 'duckduckgo', 'ai', 'listing', 'none', 'other', 'edu', 'press', 'org'] as const;
export type ReferrerClass = (typeof REFERRER_CLASSES)[number];

/** The channel a ?utm_source= value names, or null when it names none. */
export function channelOf(utmSource: string | null | undefined): string | null {
  const v = (utmSource ?? '').trim().toLowerCase();
  return (CHANNELS as readonly string[]).includes(v) ? v : null;
}

/* edgeservices.bing.com is Copilot in the Edge sidebar and copilot.com the
   consumer Copilot domain; both added 2 Oct 2026. Plain bing.com stays the
   search engine's own class below. */
const AI_HOST = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|gemini\.google\.com|bard\.google\.com|claude\.ai|anthropic\.com|perplexity\.ai|copilot\.microsoft\.com|copilot\.com|edgeservices\.bing\.com|you\.com|poe\.com|meta\.ai|mistral\.ai)$/i;
/* The directories in docs/LISTINGS_PACK.md, plus the two maps apps whose
   place cards link out. Search engines are their own classes. */
const LISTING_HOST = /(^|\.)(psychologytoday\.com|bcacc\.ca|counsellingbc\.com|luminohealth\.sunlife\.ca|alignable\.com|theravive\.com|firstsession\.com|maps\.apple\.com|businessconnect\.apple\.com|bingplaces\.com|yelp\.(com|ca)|yellowpages\.ca)$/i;

/* Universities and colleges in OUTREACH section 3 and the other BC public
   ones, their student societies, and any .edu. */
const EDU_HOST = /(^|\.)(ubc\.ca|sfu\.ca|ufv\.ca|kpu\.ca|douglascollege\.ca|viu\.ca|unbc\.ca|tru\.ca|okanagan\.bc\.ca|uvic\.ca|bcit\.ca|langara\.ca|camosun\.ca|capilanou\.ca|sfss\.ca|ufvsu\.ca|[a-z0-9-]+\.edu)$/i;
/* The papers in OUTREACH section 4 and the BC outlets that carry their
   stories. Kept short: this ships in the layout chunk on every page. */
const PRESS_HOST = /(^|\.)(peacearchnews\.com|surreynowleader\.com|abbynews\.com|bclocalnews\.com|vancouversun\.com|theprovince\.com|dailyhive\.com|cbc\.ca|globalnews\.ca|ctvnews\.ca|thelinkpaper\.ca|indocanadianvoice\.com)$/i;
/* The agencies and organisations named in OUTREACH sections 3, 6 and 7. */
const ORG_HOST = /(^|\.)(dcrs\.ca|pics\.bc\.ca|options\.bc\.ca|archway\.ca|mosaicbc\.org|issbc\.org|successbc\.ca|helpinghouse\.org|amssa\.org|sherpride\.ca|cphrbc\.ca|bcchamber\.org|abbotsfordchamber\.com|peopleslawschool\.ca|cmha\.ca)$/i;

/** True when the host is an AI assistant. */
export function isAssistantHost(host: string): boolean {
  return AI_HOST.test(host);
}

/* AN ASSISTANT THAT SENDS NO REFERRER BUT TAGS THE LINK — 2 Oct 2026.
   ChatGPT appends ?utm_source=chatgpt.com to the links it cites (OpenAI's
   publisher FAQ) and its app usually opens them with no referrer, so those
   visits were counted as `none`: channelOf() drops a value that is not one of
   the CHANNELS, and an empty referrer is `none`. The value is a host, so it is
   tested against the same AI_HOST list and nothing else; CHANNELS stays a list
   of organisation kinds. Only a yes leaves the browser, never the value.
   Kept to two lines: this ships in the layout chunk, which sat 1.9% over
   its perf baseline the day it was added. */
/** True when ?utm_source= names an AI assistant's host (a bare host, as
 *  ChatGPT sends it; AI_HOST is anchored and case-insensitive). */
export const assistantFromUtm = (utmSource: string | null | undefined): boolean =>
  !!utmSource && AI_HOST.test(utmSource.trim());

/** The landing class: the referrer's, except that an empty referrer with an
 *  assistant's ?utm_source= is `ai`. An internal referrer stays `none`. */
export const arrivalClass = (refHost: string, ownHost: string, utmSource: string | null | undefined): ReferrerClass =>
  !refHost.trim() && assistantFromUtm(utmSource) ? 'ai' : referrerClass(refHost, ownHost);

/** The class of a referrer host. `ownHost` is this site's, so an internal
 *  referrer is not mistaken for an outside one. */
export function referrerClass(host: string, ownHost = ''): ReferrerClass {
  const h = host.trim().toLowerCase().replace(/\.$/, '');
  if (!h || (ownHost && h === ownHost.toLowerCase())) return 'none';
  if (AI_HOST.test(h)) return 'ai';
  if (LISTING_HOST.test(h)) return 'listing';
  /* google.com, google.ca, news.google.com; the Android app's referrer is
     the package name. */
  if (/(^|\.)google\.(com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/.test(h) || h === 'com.google.android.googlequicksearchbox') return 'google';
  if (/(^|\.)bing\.com$/.test(h)) return 'bing';
  if (/(^|\.)duckduckgo\.com$/.test(h)) return 'duckduckgo';
  if (EDU_HOST.test(h)) return 'edu';
  if (PRESS_HOST.test(h)) return 'press';
  if (ORG_HOST.test(h)) return 'org';
  return 'other';
}
