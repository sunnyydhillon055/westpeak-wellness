/* EVERY REDIRECT THIS SITE ANSWERS, IN ONE PLACE - 1 Oct 2026.
 *
 * Moved here from next.config.mjs, which imports it, so that something other
 * than the router can read the list. lib/indexnow.ts submits the permanent,
 * parameter-free sources to IndexNow so Bing recrawls a retired URL and drops
 * it, instead of quoting it for months after it 301s. Two copies of the list
 * would drift; one list read twice cannot.
 *
 * Plain .mjs, not TypeScript, because next.config.mjs is loaded by Node before
 * anything is compiled. Every comment below that says "here" or "this file"
 * was written when the list lived in next.config.mjs and means this list.
 */

// The near-duplicate city pages retired in the Phase 1 SEO audit
// (see SEO_AUDIT.md §2). Kept here rather than imported from lib/locations.ts
// because next.config.mjs is loaded by Node and cannot import TypeScript.
//
// KAMLOOPS WAS REMOVED FROM THIS LIST ON 2026-08-18, AND THE WAY IT WAS FOUND
// IS THE REASON THIS COMMENT EXISTS.
//
// A real /online-counselling/kamloops page was written and shipped that day.
// It built correctly, appeared in .next/server/app, passed `npm run seo`, and
// scored 500/1000 — and in production it 308'd straight to /online-counselling,
// because a redirect declared here beats a route that exists. Nothing local
// catches that: `npm run build` does not exercise redirects, and a gate that
// scans built HTML finds a file that is genuinely there.
//
// It surfaced only from a curl against production after deploy. scripts/
// redirect-shadow.mjs now checks for it, and `npm run seo` runs it.
//
// So: BEFORE ADDING A PAGE WHOSE SLUG APPEARS BELOW, remove it from this list
// in the same change. And before adding a slug here, check no page owns it.
/* Burnaby, Langley and Chilliwack left this list on 2026-08-28, when real city
   pages were written for them in lib/locations.ts. A slug must never appear
   both here and there: that combination builds a page and then 308s it, which
   has already shipped once on this site and was reported as live off a green
   local gate. `npm run redirect-shadow` now fails the build on it. */
const retiredCitySlugs = [
  /* richmond, coquitlam, delta and nanaimo removed 31 Aug 2026 — each now has
     a deep page. A slug left here while a page exists produces a page that
     renders and 308s; `npm run redirect-shadow` fails the build on it. */
  'mission',
  /* 'white-rock' removed 31 Aug 2026: it now has a deep page. It is the one
     city where the practice holds a Google Business Profile, so a URL that
     308'd to the index was throwing away the only local entity it has. */
  'maple-ridge', 'new-westminster', 'north-vancouver',
  'west-vancouver', 'port-coquitlam', 'port-moody', 'pitt-meadows',
  'victoria-saanich', 'courtenay', 'campbell-river', 'duncan', 'parksville',
  'vernon', 'penticton', 'west-kelowna', 'salmon-arm',
  'fort-st-john', 'cranbrook', 'nelson', 'prince-rupert', 'terrace',
  'squamish', 'whistler', 'powell-river', 'sechelt', 'fort-langley', 'hope',
];

/** @type {Array<{ source: string, destination: string, permanent: boolean }>} */
export const REDIRECTS = [
  // 37 near-duplicate city pages retired in the Phase 1 SEO audit.
  ...retiredCitySlugs.map((slug) => ({
    source: `/online-counselling/${slug}`,
    destination: '/online-counselling',
    permanent: true,
  })),
  // Retired audience page — the practice no longer publishes a men's page.
  { source: '/for/mens-mental-health', destination: '/for', permanent: true },
  { source: '/copy-of-new-page', destination: '/contact', permanent: true },
  { source: '/fees', destination: '/pricing', permanent: true },
  /* /answers retired 31 Aug 2026 at the owner's request: one FAQ, not two
     pages answering questions. It held 97 entries and 196 internal links,
     so it is redirected rather than deleted — the inbound equity and any
     external link land on /faq instead of a 404. */
  /* /answers came back on 14 Sep 2026 as the instant-answer page (every
     question the site answers, searchable) at the owner's request; the
     31 Aug redirect to /faq is gone. */

  /* CAREERS RETIRED 1 Sep 2026 at the owner's request — the practice is not
     recruiting, and does not want speculative applications either.

     Redirected rather than left to 404 because /careers was indexed and
     ranking for BC counselling-job queries, so the URL carries inbound
     equity and live external links. /about is the nearest surviving page
     about the practice itself. The retired job postings under
     /careers/:slug go the same way. */
  { source: '/careers', destination: '/about', permanent: true },
  { source: '/careers/:slug', destination: '/about', permanent: true },

  /* SERVICES REDUCED TO FIVE, 31 Aug 2026, at the owner's request:
     individual, couples, EMDR, family, and Punjabi-speaking.
     Six service pages retired. None are deleted — each 301s to the
     service that absorbed it, so the ranking equity and every inbound
     link land somewhere that answers the same question.

     Anxiety, depression and trauma are not "not offered". They are what
     individual counselling is FOR, and the page says so. Folding three
     thin pillars into one strong one is the point of the change. */
  { source: '/services/anxiety-counselling', destination: '/services/individual-therapy', permanent: true },
  { source: '/services/depression-counselling', destination: '/services/individual-therapy', permanent: true },
  /* TRAUMA NOW LANDS ON EMDR - 1 Oct 2026. lib/conditions.ts already routes
     trauma to /services/emdr-therapy, and that page was retitled for trauma
     on 6 Sep, so the retired trauma URL was the one place still sending
     trauma searchers to individual therapy. This changes which page absorbs
     the URL; it does not bring trauma back as a sixth service. */
  { source: '/services/trauma-therapy', destination: '/services/emdr-therapy', permanent: true },
  { source: '/services/emdr-intensive', destination: '/services/emdr-therapy', permanent: true },
  { source: '/services/south-asian-mental-health', destination: '/services/punjabi-counselling', permanent: true },
  { source: '/services/online-counselling-bc', destination: '/online-counselling', permanent: true },

  /* RCC: one page, not two - 17 Sep 2026. The definition page and the
     verification page split one query cluster; the definition now lives on
     the verification page. See lib/resources-more.ts. */
  { source: '/resources/what-is-a-registered-clinical-counsellor', destination: '/resources/verify-a-counsellor-in-bc', permanent: true },

  /* THE CITY x TOPIC REDIRECTS ARE GONE, 2 Sep 2026.
     All thirty pages exist again — anxiety, trauma and depression across
     ten cities — rebuilt through lib/conditions.ts, which lets a city page
     resolve a condition without it becoming a service again. A redirect in
     front of a page that exists is a page nobody can reach; the top of this
     file records the Kamloops incident where exactly that shipped, and
     `npm run redirect-shadow` fails the build on it now.

     The /services/* redirects for the same three slugs stay. Those services
     really were retired and really do belong to individual therapy — it is
     only the LOCAL intent that got its pages back, because "anxiety
     counselling in Surrey" wants Surrey. */
  /* /blog was a 404. The guides engine already is the article stack —
     dated, Article-schema'd and internally linked — so this points at it
     rather than standing up a second one that would split topic authority
     and double the maintenance. */
  { source: '/blog', destination: '/guides', permanent: true },
  { source: '/blog/:slug', destination: '/guides/:slug', permanent: true },
  /* A truncated copy of the adult ADHD guide's URL is in Search Console and
     answered 404 in production on 1 Oct 2026. */
  { source: '/guides/adhd-in-adults-and-what-counselling-do', destination: '/guides/adhd-in-adults-and-what-counselling-can-do', permanent: true },
  /* ONE EMPLOYER PAGE, 1 Oct 2026. The teams resource had 67 impressions at
     43.94 and no clicks; /for/employers-and-hr had no rows in Search Console
     at all. Two pages for the same reader split the queries, and the teams
     page still called the practice "solo". Its unique parts moved to the
     employer page (lib/audiences-more4.ts) and the entry was removed from
     lib/resources-more.ts in the same change, so nothing is shadowed. */
  { source: '/resources/counselling-support-for-bc-teams', destination: '/for/employers-and-hr', permanent: true },
  { source: '/copy-of-contact', destination: '/faq', permanent: true },
  { source: '/copy-of-fees', destination: '/services/individual-therapy', permanent: true },
  /* One hop each, 1 Oct 2026. These pointed at /services/anxiety-counselling
     and /services/trauma-therapy, which are themselves redirects, so every
     visit took two. `npm run redirect-shadow` now fails on a chain. */
  { source: '/copy-of-individual-2', destination: '/services/individual-therapy', permanent: true },
  { source: '/copy-of-individual-1', destination: '/services/emdr-therapy', permanent: true },
  { source: '/copy-of-individual', destination: '/services/emdr-therapy', permanent: true },

  /* CAREER ALIASES, 1 Oct 2026: straight to /about, in one hop.
     These were written when /careers was a live page, so each one went
     /jobs -> /careers -> /about once careers was retired on 1 Sep. The
     307s on /apply, /careers/apply, /careers/rcc and the closed RCC posting
     existed because a role might reopen at the same slug; the owner retired
     the role and speculative applications both, so they are permanent now.
     /careers/registered-clinical-counsellor was still drawing impressions
     as a 307, which tells an index to keep the old URL. */
  ...[
    '/jobs', '/job', '/hiring', '/join-us', '/join', '/work-with-us',
    '/employment', '/career', '/vacancies',
    '/careers/rcc', '/apply', '/careers/apply',
    '/careers/registered-clinical-counsellor',
  ].map((source) => ({ source, destination: '/about', permanent: true })),
  { source: '/jobs/:slug', destination: '/about', permanent: true },

  /* Keyword-shaped entry points. These are REDIRECTS, not pages, and that
     distinction is the whole point: a set of near-identical city or
     job-title pages for a single opening is a doorway-page pattern, and
     Google has penalised that for years. A redirect costs nothing, cannot
     be thin content, and still catches the URL somebody types after
     hearing about the role secondhand. */
  /* Both of these answered 404 with the full 40 kB HTML error page. Next
     serves the manifest at /manifest.webmanifest; these are the two paths
     browsers and crawlers try first. */
  { source: '/manifest.json', destination: '/manifest.webmanifest', permanent: true },
  { source: '/site.webmanifest', destination: '/manifest.webmanifest', permanent: true },

  /* THE /punjabi-counselling REDIRECT WAS REMOVED ON 2026-08-18.
     It read: "its hub is /services/punjabi-counselling, which already
     existed — standing up a second would cannibalise the first for the
     same query." That was reasonable when there was no hub at the bare
     prefix, and it stopped being true the moment one was built. The new
     hub 308'd to the service page in production while passing every local
     check, for the same reason the Kamloops page did.

     The two pages do different jobs and do not compete: the service page
     answers "what is Punjabi-speaking counselling", the hub answers "what
     is available where I live". The variants below still point at the
     service page, which is the right destination for them. */
  { source: '/punjabi-therapist', destination: '/services/punjabi-counselling', permanent: true },
  { source: '/punjabi-therapy', destination: '/services/punjabi-counselling', permanent: true },
  { source: '/punjabi-counsellor', destination: '/services/punjabi-counselling', permanent: true },

  { source: '/counselling-jobs', destination: '/about', permanent: true },
  { source: '/counsellor-jobs', destination: '/about', permanent: true },
  { source: '/therapist-jobs', destination: '/about', permanent: true },
  { source: '/rcc-jobs', destination: '/about', permanent: true },
  { source: '/counselling-careers', destination: '/about', permanent: true },
  { source: '/work-here', destination: '/about', permanent: true },
];

/** True for a source with no :param, wildcard or regex group. */
export const isLiteralPath = (p) => !/[:*(]/.test(p);

/**
 * The permanent redirects whose source is one literal URL - the retired pages
 * an index may still hold. Temporary redirects are left out: a 307 says the old
 * URL is coming back, so asking an engine to recrawl it says nothing useful.
 * @returns {string[]}
 */
export function permanentLiteralSources() {
  return [...new Set(REDIRECTS.filter((r) => r.permanent && isLiteralPath(r.source)).map((r) => r.source))];
}
