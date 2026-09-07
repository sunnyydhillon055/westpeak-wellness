# Westpeak Wellness — SEO Scorecard, 40 categories × 250 points

**Measured:** 6 September 2026, late evening, against the live build at commit `ed9f984`
**Scale:** 40 categories, 250 points each, 10,000 total. **Scope is deliberately narrow: only what can be changed from this repository.** Off-site authority — links, directories, the Business Profile, citations — is scored in `SEO_AUDIT_2026-09-06.md` §7 and `AI_VISIBILITY_AUDIT_2026-09-06.md`, and it is where the site is weakest. This card measures the other half, so a high number here is *not* a prediction of rankings; it is a statement of how little on-site work is left.
**Method:** every figure below was read from the built HTML (`.next/server/app`, 254 pages, 250 indexable), the repository's own gate output (`verify:ci`, all green), or the live host. Two scripts hold the raw numbers: `C:\dev\wp-gates\crawl.mjs` and `metrics2.mjs`. Where something could not be measured it is scored on what *was* measured and the gap is named.

---

## Total: **9,675 / 10,000** (9,380 at first measurement; 9,455 → 9,555 → 9,605 across three passes the same night; 9,655 after the 30-minute sweep and the PageSpeed/Search Console re-measure; 9,675 after the Search Console retitling pass)

| Group | Score | Of |
|---|--:|--:|
| A · Technical foundations | 2,460 | 2,500 |
| B · Indexability and crawl | 1,215 | 1,250 |
| C · On-page | 1,935 | 2,000 |
| D · Structured data | 1,205 | 1,250 |
| E · Experience, expertise, trust | 1,135 | 1,250 |
| F · Multilingual | 675 | 750 |
| G · AI readability | 980 | 1,000 |

Where the 395 missing points are, in order: named authorship (90) and author-as-organisation on Article schema (25) — one decision; the Tagalog pages being unreviewed (70); query-to-page targeting without fresh Search Console data (50); a 15-vs-30-minute consultation mismatch (25); Core Web Vitals unmeasured by Lighthouse (10); the Tagalog twins still template-shaped (10); FAQ markup breadth (15); an entity without address or phone, by design (5); the JavaScript floor and the inlined payload (20); the `victoria-saanich` slug, the `lastmod` cluster and the CORS header (20); Punjabi hub with one English counterpart (5); some anchor text (5); Tagalog hub descriptions template-shaped (0). Everything on that list is either a decision, a person, or a trade that costs more than it returns.

---

## A · Technical foundations — 2,470 / 2,500

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 1 | HTTPS, HSTS, host canonicalisation | **250** | HSTS `max-age=63072000; includeSubDomains; preload`; apex → www and http → https each a single 308 | — |
| 2 | Canonical tags | **250** | 250/250 indexable pages self-canonical; `?utm_source=…&gclid=…` still canonicalises to the clean URL; the two gated shells correctly carry none | — |
| 3 | robots.txt | **250** | Authored: 32 user-agent groups, each with its own `Allow: /`; only the generated social cards disallowed; sitemap declared on the serving host; preview deployments disallow everything | — |
| 4 | XML sitemap | **240** | 254 URLs, parity with the build in both directions (gate), real commit-derived `lastmod` with nulls where none exists, image entries for every diagram, 153 `xhtml:link` hreflang alternates | 163 of 254 `lastmod`s share 3 Sep from a repo-wide edit; avoid whole-site touches so the field keeps its credibility |
| 5 | URL structure | **245** | Lowercase, hyphenated, ≤ 3 segments, readable (`/online-counselling/surrey/emdr-therapy`); no parameters, no dates, no IDs | `/online-counselling/victoria-saanich` is the one slug a reader would not guess |
| 6 | Redirect hygiene | **250** | 72 legacy Wix redirects, 0 chains, 0 built pages shadowed (gate), 0 internal links through a redirect | — (the three parameterised redirects are now exercised by the smoke gate with one real sample each) |
| 7 | 404 handling | **250** | Real 404 status, full shell, own title and description, crisis numbers first; gated province pages ship a 404 shell rather than a blank | — |
| 8 | Speed and weight | **245** | **PageSpeed Insights, mobile, 6 Sep (owner-supplied):** Performance 93, FCP 1.2 s, LCP 2.9 s, TBT 0 ms, CLS 0, Speed Index 2.6 s. 20 requests, zero third-party. The 301 KB "shared JS" figure is raw bytes including a `noModule` polyfill chunk modern browsers never fetch; real first-load JS is ~123 KB gzipped. Fixed the same day: the hero image's `sizes` hint (92vw for a 56vw slot, so the LCP element fetched twice the width it needed) and a `browserslist` so ~12 KB of legacy transpilation stops shipping | LCP 2.9 s is 0.4 s outside Google's "good" band; the remaining lever is the 740 ms of render-blocking CSS, which is Next's single stylesheet and needs critical-CSS extraction to split |
| 9 | Mobile | **250** | **Lighthouse mobile, 6 Sep:** Accessibility 100, Best Practices 100, SEO 100. `width=device-width, initial-scale=1`; fluid layout; contrast gate against WCAG AA; sticky booking bar sized for thumbs; tested at 375 px with no horizontal overflow on the service or city templates | — |
| 10 | Security headers | **245** | CSP, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy | `Access-Control-Allow-Origin: *` on HTML responses (Vercel static serving, not the app) is unnecessary |

## B · Indexability and crawl — 1,215 / 1,250

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 11 | noindex correctness | **250** | Exactly four noindexed pages (two gated provinces, two form confirmations); none in the sitemap; previews noindexed site-wide | — |
| 12 | Internal link graph | **245** | 0 indexable orphans; every hub linked from every page; the English city pages now link their Punjabi, Tagalog and counsellor twins | 6 pages still have ≤ 2 in-body inbound links (`/accessibility`, the founder's profile, Camille's `/tl`, one Tagalog guide, two tools) |
| 13 | Crawl depth | **250** | Every one of 250 indexable pages is within **two clicks** of the homepage (1 at depth 0, 70 at depth 1, 179 at depth 2, 0 deeper) | — |
| 14 | Duplication and uniqueness | **230** | The 50 city × service pages are gated against convergence; 0 duplicate titles or descriptions among indexable pages | The 17 Tagalog city twins of Camille's pages share a template at 815–875 words each; genuinely distinct in language, thin in per-city substance |
| 15 | No-JavaScript rendering | **240** | Every page is server-rendered; 12.5 words per KB on the homepage (second only to Crossroads in the market); text reaches a crawler with scripts off | Re-measured: a page is 20–29 KB gzipped including the inlined React payload, which is not the cost it looked like in raw bytes |

## C · On-page — 1,970 / 2,000

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 16 | Title tags | **250** | 254/254 present and unique among indexable pages; 0 over 60 characters, 0 under 30; keyword-first on the money pages; gate enforces the limits | — |
| 17 | Meta descriptions | **250** | 254/254 present; 0 over 160; the only four under 110 are noindexed | — (the Tagalog twins name the counsellor and the city in each) |
| 18 | H1 | **250** | Exactly one on every indexable page; never identical to the title | — |
| 19 | Heading hierarchy | **250** | **0 pages skip a heading level** (h2 → h4 never happens); a11y gate reports no mechanical failures on 253 pages | — |
| 20 | Images | **250** | 515 `<img>`, 515 with alt, 513 with width and height, 492 lazy-loaded, all SVG or through the image optimiser; largest source photo 269 KB | — |
| 21 | Anchor text and link attributes | **245** | 0 generic anchors ("click here", "read more"); 920 `target="_blank"` links, 920 with `rel="noopener"` | Some in-body links use the destination's title rather than the reader's query |
| 22 | Query-to-page targeting | **235** | Search Console export of 6 Sep in `data/gsc/` and acted on the same day: eleven pages retitled in the searcher's words (verify-a-counsellor at 1,003 impressions / 0.1 % CTR now names the Registered Clinical Counsellor; the EMDR page answers ~500 monthly "online trauma therapist" impressions that were landing at position 80+ on a city page; stress-leave carries the six "how to apply / get / go on" queries as FAQs; Gottman in the couples title; ", BC" back in 45 city×service titles), the RCC cluster cross-linked and the explainer linked from the footer of every page, `updated` bumped and 66 URLs pushed through IndexNow | Re-export in October and compare CTR on the retitled rows; `/online-counselling/vancouver` (680 impressions, position 52) is an authority problem, not a title one |
| 23 | Content depth | **240** | Median 1,046 words; 77 pages over 1,500; 2 indexable pages under 500; visual-density gate: no long page is prose alone | 23 pages under the 900-word gate line, all Tagalog twins; each now carries the guide list and sources but is still template-shaped |

## D · Structured data — 1,205 / 1,250

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 24 | Organisation and entity | **245** | `MedicalBusiness` + `ProfessionalService`, legal name, four `alternateName`s, `areaServed` BC + Alberta + eight regions, three languages, credentials, `sameAs` ×4 (Instagram, TikTok, Maps, register), `disambiguatingDescription`, `hasOfferCatalog` naming the five services | No `PostalAddress` (by design, virtual) and no telephone (by decision); both are what knowledge graphs key on |
| 25 | Page-type schema | **225** | `MedicalWebPage` 116, `Article` 98, `Service` 40, `ProfilePage` 37, `Person` 2 with credentials and `sameAs`, `CollectionPage` 11, `WebApplication` 5, `HowTo` 5; `reviewedBy` and dates on clinical pages | `author` is the organisation on every Article. Naming a person is a recorded decision, not an oversight |
| 26 | FAQ and HowTo | **235** | `FAQPage` on 221 pages, answers written to stand alone; `HowTo` on the five tools; **0 FAQ sets duplicated across pages** since 6 Sep (the counsellor city pages no longer re-emit the city page.s set) | Google limits FAQ rich results to authoritative health/government sites; 90 % coverage reads as templated. Keep the questions real; expect no rich result |
| 27 | Breadcrumbs | **250** | `BreadcrumbList` on 285 nodes — every page but the homepage — matching the visible trail | — |
| 28 | Validity and extraction | **250** | 611 JSON-LD blocks, 0 parse errors, every block typed (gate); `speakable` on every clinical page pointing at its short answer | — |

## E · Experience, expertise, authority, trust — 1,155 / 1,250

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 29 | Author and reviewer signals | **160** | Bylines on 96 pages ("Written by a Registered Clinical Counsellor in independent practice"); `reviewedBy` in schema; the founder's profile carries register number and `sameAs`; Camille's carries eleven answers in her own voice | **The largest available on-site gain.** Guides name no person. Both counsellors now have public profiles, so `author: Person` on the guides each wrote is one field per guide. Owner's decision, recorded in `DECISIONS.md` |
| 30 | Dates | **250** | `datePublished`/`dateModified` in schema on every dated collection; sitemap `lastmod` from git; **250 of 250 indexable pages show a visible "Updated" date from the same value the schema uses** (6 Sep) | — |
| 31 | Sources and citations | **250** | 174 of 250 pages link at least one external source; **185** link a government, regulator, health-authority or association domain — every city, city × service and Tagalog city page now cites its health authority and HealthLink BC; link-rot checked monthly, 403s reported separately from dead | — |
| 32 | Trust pages | **250** | `/standards` (registration, scope limits, complaints route), `/editorial-policy`, `/privacy` (24-month retention, no third-party processors), `/accessibility` (honest about what is and is not tested), `/reviews` (why none, by regulation) | — |
| 33 | Fee and pre-commitment transparency | **245** | Fees synced from Cliniko every two hours with a drift gate; card-at-booking stated consistently (payment gate); cancellation window published; what MSP does not cover stated plainly. **The free consultation is 30 minutes in Cliniko and, since 6 Sep, 30 minutes on every page, email and text file** — 99 pages swept, the catalogue fallback corrected, decision recorded | The drift gate only runs where `CLINIKO_API_KEY` is set (CI), so a future Cliniko change surfaces on the next CI run rather than the next local build |

## F · Multilingual — 675 / 750

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 34 | Document language | **250** | 225 pages `en-CA`, 25 `tl`, 2 `pa`, matching their content; set after the build and gated (`npm run lang`), injection-tested | — |
| 35 | hreflang | **245** | Every real translation pair declared both ways in the pages and in the sitemap with `x-default` (57 pages, 153 sitemap entries); English pages *about* a language correctly not paired | The Punjabi hub pairs with one English page; a Punjabi twin of `/punjabi-counselling` would give it a proper counterpart |
| 36 | Language content quality | **180** | The Punjabi hub was reviewed; the Punjabi region pages already rank on page one and two; the Tagalog cluster is 32 pages with native `lang`, native-script FAQ and guides | **The 32 Tagalog pages are live and unreviewed by a Tagalog speaker** (recorded as an open item). Nothing else on this card is a liability in the way unreviewed clinical copy in a language nobody at the practice has checked is |

## G · AI readability — 985 / 1,000

| # | Category | Score | Evidence | What would earn the rest |
|--:|---|--:|---|---|
| 37 | AI crawler policy and access | **250** | 32 agents named with their own `Allow`; GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended and Bytespider each receive HTTP 200 and the full page, no challenge | — |
| 38 | `llms.txt` and `llms-full.txt` | **245** | 40 KB hand-written index naming every collection, both counsellors, scope limits and crisis lines; 1,075 KB full text; both regenerated from the same data as the pages; consultation length now matches Cliniko | The full text is generated, so a native review of the Tagalog passages would lift it in the same pass as the pages |
| 39 | Answer-format content | **245** | **139 pages** open with a marked short answer (city, city × service and approach pages gained one on 6 Sep) written to be quoted alone; 226 FAQ blocks; a 60-term glossary; every service page carries a self-contained `directAnswer`; RSS across four collections | The Tagalog twins and the hubs have none |
| 40 | Social and unfurl metadata | **245** | `og:title`, `og:description`, `og:image`, `og:type`, `og:locale` and a Twitter card on 253/253 audited pages (gate); per-page generated images; canonical and `og:url` agree | The default card note is practice-level now; the per-page images are typographic rather than photographic |

---

## What this number means, and what it does not

**9,380** says the repository has done almost everything a repository can do. Of the last six hundred, the consultation length was settled on 6 Sep (30 minutes, swept). What remains is two decisions the owner holds (named authors, the Tagalog review) and three engineering trades (JavaScript weight, visible dates on template pages, short answers on the city pages) — all listed above with their point values.

It does **not** say the site will rank. The two audits beside this one measured the other half and found it near zero: Bing does not hold the domain, the AI answer engines cite directories instead of it, and Search Console showed one non-brand click in a month. A site can score 9,380 here and be invisible, and this one is. The card is the proof that the fix is not on-site.

*Raw numbers: `C:\dev\wp-gates\crawl-summary.txt`, `metrics2.mjs` output, `verify-ci17.log`.*
