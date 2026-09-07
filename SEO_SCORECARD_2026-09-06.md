# Westpeak Wellness — SEO Scorecard, 40 categories × 250 points

**Measured:** 6 September 2026, late evening, against the live build at commit `ed9f984`
**Scale:** 40 categories, 250 points each, 10,000 total. **Scope is deliberately narrow: only what can be changed from this repository.** Off-site authority — links, directories, the Business Profile, citations — is scored in `SEO_AUDIT_2026-09-06.md` §7 and `AI_VISIBILITY_AUDIT_2026-09-06.md`, and it is where the site is weakest. This card measures the other half, so a high number here is *not* a prediction of rankings; it is a statement of how little on-site work is left.
**Method:** every figure below was read from the built HTML (`.next/server/app`, 254 pages, 250 indexable), the repository's own gate output (`verify:ci`, all green), or the live host. Two scripts hold the raw numbers: `C:\dev\wp-gates\crawl.mjs` and `metrics2.mjs`. Where something could not be measured it is scored on what *was* measured and the gap is named.

---

## Total: **9,455 / 10,000** (9,380 at first measurement; +75 the same night)

| Group | Score | Of |
|---|--:|--:|
| A · Technical foundations | 2,405 | 2,500 |
| B · Indexability and crawl | 1,190 | 1,250 |
| C · On-page | 1,925 | 2,000 |
| D · Structured data | 1,180 | 1,250 |
| E · Experience, expertise, trust | 1,105 | 1,250 |
| F · Multilingual | 675 | 750 |
| G · AI readability | 970 | 1,000 |

Where the 545 missing points are, in order: named authorship (90), the Tagalog pages being unreviewed (70), JavaScript weight (55), query-to-page targeting without fresh Search Console data (50), FAQ markup on 90% of pages (30), a 15-vs-30-minute consultation mismatch (25), author-as-organisation on Article schema (25), duplicate-shaped Tagalog twins (25), RSC payload doubling page bytes (25), sources on the city × service pages (20). Everything else is single-digit.

---

## A · Technical foundations — 2,405 / 2,500

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 1 | HTTPS, HSTS, host canonicalisation | **250** | HSTS `max-age=63072000; includeSubDomains; preload`; apex → www and http → https each a single 308 | — |
| 2 | Canonical tags | **250** | 250/250 indexable pages self-canonical; `?utm_source=…&gclid=…` still canonicalises to the clean URL; the two gated shells correctly carry none | — |
| 3 | robots.txt | **250** | Authored: 32 user-agent groups, each with its own `Allow: /`; only the generated social cards disallowed; sitemap declared on the serving host; preview deployments disallow everything | — |
| 4 | XML sitemap | **240** | 254 URLs, parity with the build in both directions (gate), real commit-derived `lastmod` with nulls where none exists, image entries for every diagram, 153 `xhtml:link` hreflang alternates | 163 of 254 `lastmod`s share 3 Sep from a repo-wide edit; avoid whole-site touches so the field keeps its credibility |
| 5 | URL structure | **245** | Lowercase, hyphenated, ≤ 3 segments, readable (`/online-counselling/surrey/emdr-therapy`); no parameters, no dates, no IDs | `/online-counselling/victoria-saanich` is the one slug a reader would not guess |
| 6 | Redirect hygiene | **245** | 72 legacy Wix redirects, 0 chains, 0 built pages shadowed (gate), 0 internal links through a redirect | 3 parameterised redirects (`/blog/:slug`, `/careers/:slug`, `/jobs/:slug`) are unverifiable by the gate |
| 7 | 404 handling | **250** | Real 404 status, full shell, own title and description, crisis numbers first; gated province pages ship a 404 shell rather than a blank | — |
| 8 | Speed and weight | **195** | TTFB 148 ms on the homepage, 480–590 ms on interior pages (cold ISR); median HTML 80 KB; 20 requests, zero third-party; CSS 96 KB; **shared first-load JS 301 KB**; Core Web Vitals not measured (PageSpeed quota) | 301 KB of JavaScript for a content site is the largest single cost here; a route-level look at what `lucide-react` and the client components pull in. Confirm CWV in Search Console when it populates |
| 9 | Mobile | **235** | `width=device-width, initial-scale=1`; fluid layout; contrast gate against WCAG AA; sticky booking bar sized for thumbs | Not device-tested tonight; tap-target and font-size checks are inferred from CSS, not measured |
| 10 | Security headers | **245** | CSP, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy | `Access-Control-Allow-Origin: *` on HTML responses (Vercel static serving, not the app) is unnecessary |

## B · Indexability and crawl — 1,190 / 1,250

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 11 | noindex correctness | **250** | Exactly four noindexed pages (two gated provinces, two form confirmations); none in the sitemap; previews noindexed site-wide | — |
| 12 | Internal link graph | **240** | 0 indexable orphans; every hub linked from every page; the English city pages now link their Punjabi, Tagalog and counsellor twins | 6 pages still have ≤ 2 in-body inbound links (`/accessibility`, the founder's profile, Camille's `/tl`, one Tagalog guide, two tools) |
| 13 | Crawl depth | **250** | Every one of 250 indexable pages is within **two clicks** of the homepage (1 at depth 0, 70 at depth 1, 179 at depth 2, 0 deeper) | — |
| 14 | Duplication and uniqueness | **225** | The 50 city × service pages are gated against convergence; 0 duplicate titles or descriptions among indexable pages | The 17 Tagalog city twins of Camille's pages share a template at 815–875 words each; genuinely distinct in language, thin in per-city substance |
| 15 | No-JavaScript rendering | **225** | Every page is server-rendered; 12.5 words per KB on the homepage (second only to Crossroads in the market); text reaches a crawler with scripts off | The inlined React payload roughly doubles each page's bytes; a crawler on a byte budget pays for it |

## C · On-page — 1,925 / 2,000

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 16 | Title tags | **250** | 254/254 present and unique among indexable pages; 0 over 60 characters, 0 under 30; keyword-first on the money pages; gate enforces the limits | — |
| 17 | Meta descriptions | **245** | 254/254 present; 0 over 160; the only four under 110 are noindexed | Descriptions on the 25 Tagalog twins are template-shaped |
| 18 | H1 | **250** | Exactly one on every indexable page; never identical to the title | — |
| 19 | Heading hierarchy | **250** | **0 pages skip a heading level** (h2 → h4 never happens); a11y gate reports no mechanical failures on 253 pages | — |
| 20 | Images | **250** | 515 `<img>`, 515 with alt, 513 with width and height, 492 lazy-loaded, all SVG or through the image optimiser; largest source photo 269 KB | — |
| 21 | Anchor text and link attributes | **245** | 0 generic anchors ("click here", "read more"); 920 `target="_blank"` links, 920 with `rel="noopener"` | Some in-body links use the destination's title rather than the reader's query |
| 22 | Query-to-page targeting | **200** | Search Console (to 28 Aug) shows the intended pages surfacing for their queries; the stress-leave cluster no longer splits across two pages; ICBC and insurer pages now exist for queries that had none | The data is nine days old and predates 60+ pages; no fresh export in the repo. Re-export and re-check monthly |
| 23 | Content depth | **235** | Median 1,046 words; 77 pages over 1,500; 2 indexable pages under 500; visual-density gate: no long page is prose alone | 35 pages under the 900-word gate line, 33 of them the Tagalog twins |

## D · Structured data — 1,180 / 1,250

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 24 | Organisation and entity | **235** | `MedicalBusiness` + `ProfessionalService`, legal name, four `alternateName`s, `areaServed` BC + Alberta + eight regions, three languages, credentials, `sameAs` ×4 (Instagram, TikTok, Maps, register), `disambiguatingDescription` | No `PostalAddress` (by design, virtual) and no telephone (by decision); both are what knowledge graphs key on |
| 25 | Page-type schema | **225** | `MedicalWebPage` 116, `Article` 98, `Service` 40, `ProfilePage` 37, `Person` 2 with credentials and `sameAs`, `CollectionPage` 11, `WebApplication` 5, `HowTo` 5; `reviewedBy` and dates on clinical pages | `author` is the organisation on every Article. Naming a person is a recorded decision, not an oversight |
| 26 | FAQ and HowTo | **220** | `FAQPage` on 226 pages, answers written to stand alone; `HowTo` on the five tools | Google limits FAQ rich results to authoritative health/government sites; 90 % coverage reads as templated. Keep the questions real; expect no rich result |
| 27 | Breadcrumbs | **250** | `BreadcrumbList` on 285 nodes — every page but the homepage — matching the visible trail | — |
| 28 | Validity and extraction | **250** | 611 JSON-LD blocks, 0 parse errors, every block typed (gate); `speakable` on every clinical page pointing at its short answer | — |

## E · Experience, expertise, authority, trust — 1,105 / 1,250

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 29 | Author and reviewer signals | **160** | Bylines on 96 pages ("Written by a Registered Clinical Counsellor in independent practice"); `reviewedBy` in schema; the founder's profile carries register number and `sameAs`; Camille's carries eleven answers in her own voice | **The largest available on-site gain.** Guides name no person. Both counsellors now have public profiles, so `author: Person` on the guides each wrote is one field per guide. Owner's decision, recorded in `DECISIONS.md` |
| 30 | Dates | **240** | `datePublished`/`dateModified` in schema on every dated collection; sitemap `lastmod` from git; **244 of 250 indexable pages now show a visible "Updated" date from the same value the schema uses** (6 Sep) | The homepage and the tools hub show none; the five hubs that had claimed a placeholder collection date now take the newest entry of their own |
| 31 | Sources and citations | **230** | 174 of 250 pages link at least one external source; 118 link a government, regulator, health-authority or association domain (every city page now cites its health authority and HealthLink BC); link-rot checked monthly, 403s reported separately from dead | Average 1.6 external domains per page; the city × service pages mostly cite none |
| 32 | Trust pages | **250** | `/standards` (registration, scope limits, complaints route), `/editorial-policy`, `/privacy` (24-month retention, no third-party processors), `/accessibility` (honest about what is and is not tested), `/reviews` (why none, by regulation) | — |
| 33 | Fee and pre-commitment transparency | **225** | Fees synced from Cliniko every two hours with a drift gate; card-at-booking stated consistently (payment gate); cancellation window published; what MSP does not cover stated plainly | **The free consultation is 30 minutes in Cliniko and 15 minutes on 99 pages.** The drift gate flags it the moment it runs with the key. One decision, then either one click in Cliniko or one sweep of the site |

## F · Multilingual — 675 / 750

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 34 | Document language | **250** | 225 pages `en-CA`, 25 `tl`, 2 `pa`, matching their content; set after the build and gated (`npm run lang`), injection-tested | — |
| 35 | hreflang | **245** | Every real translation pair declared both ways in the pages and in the sitemap with `x-default` (57 pages, 153 sitemap entries); English pages *about* a language correctly not paired | The Punjabi hub pairs with one English page; a Punjabi twin of `/punjabi-counselling` would give it a proper counterpart |
| 36 | Language content quality | **180** | The Punjabi hub was reviewed; the Punjabi region pages already rank on page one and two; the Tagalog cluster is 32 pages with native `lang`, native-script FAQ and guides | **The 32 Tagalog pages are live and unreviewed by a Tagalog speaker** (recorded as an open item). Nothing else on this card is a liability in the way unreviewed clinical copy in a language nobody at the practice has checked is |

## G · AI readability — 970 / 1,000

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 37 | AI crawler policy and access | **250** | 32 agents named with their own `Allow`; GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended and Bytespider each receive HTTP 200 and the full page, no challenge | — |
| 38 | `llms.txt` and `llms-full.txt` | **240** | 40 KB hand-written index naming every collection, both counsellors, scope limits and crisis lines; 1,075 KB full text; both regenerated from the same data as the pages | The consultation-length line inherits the 15/30 question above |
| 39 | Answer-format content | **235** | 89 pages open with a short answer (the 15 city pages gained one on 6 Sep) written to be quoted alone; 226 FAQ blocks; a 60-term glossary; every service page carries a self-contained `directAnswer`; RSS across four collections | The city × service and approach pages have no short-answer block; they are the pages an assistant is least able to lift a sentence from |
| 40 | Social and unfurl metadata | **245** | `og:title`, `og:description`, `og:image`, `og:type`, `og:locale` and a Twitter card on 253/253 audited pages (gate); per-page generated images; canonical and `og:url` agree | The default card note is practice-level now; the per-page images are typographic rather than photographic |

---

## What this number means, and what it does not

**9,380** says the repository has done almost everything a repository can do. The last six hundred points are three decisions the owner holds (named authors, the Tagalog review, the consultation length) and three engineering trades (JavaScript weight, visible dates on template pages, short answers on the city pages) — all listed above with their point values.

It does **not** say the site will rank. The two audits beside this one measured the other half and found it near zero: Bing does not hold the domain, the AI answer engines cite directories instead of it, and Search Console showed one non-brand click in a month. A site can score 9,380 here and be invisible, and this one is. The card is the proof that the fix is not on-site.

*Raw numbers: `C:\dev\wp-gates\crawl-summary.txt`, `metrics2.mjs` output, `verify-ci17.log`.*
