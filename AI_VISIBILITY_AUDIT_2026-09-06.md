# Westpeak Wellness — AI Visibility Audit

**Measured:** 6 September 2026, evening, against the live site at commit `96ab9a3`
**Question:** not "can machines read this site" (answered the same day — first in its market, see `SEO_AUDIT_2026-09-06.md` and the crawlability probe below) but **"do the machines that answer people's questions find it, cite it, and agree on what it is?"**
**Method:** live probes of the indexes that AI answer engines ground on, in a real browser and by request, one query at a time. Every number here was read from a result page tonight. Where an instrument failed, that is recorded rather than its output.

---

## 0. The one-paragraph version

The site is close to invisible to AI answer engines, and the reason is not on the site. **Bing, which grounds ChatGPT search and Copilot, does not return the domain for its own brand name, for a sentence lifted verbatim from its homepage, or for `site:`.** DuckDuckGo (Bing-derived) holds one page of 254. Brave, which several assistants retrieve from and which runs its own AI answer, holds four pages — and its copy of the homepage is the **Wix-era title and description from before 8 August** ("Therapy | West Peak Wellness | Surrey … we provide low cost options"). Common Crawl, the base of most training corpora, captured 23 pages in July and none since. When Brave's AI answers "Punjabi counsellor Surrey BC" — the one query family the site actually ranks for on Google — it cites Psychology Today, Hundal, Forward Mind and ASRA and not this site. Meanwhile the crawlability side is the best in the market: 17 of 17 AI agents receive full pages with no challenge, `llms.txt`, `llms-full.txt`, a feed, speakable markup. **The site is fully readable by every AI system and known to almost none of them.** Three actions change that, and two of them take under an hour.

---

## 1. Where each AI-grounding index stands tonight

| Index | Who grounds on it | Pages held | Brand query | Verbatim-sentence query | Notes |
|---|---|---|---|---|---|
| **Bing** | ChatGPT search, Copilot, DuckDuckGo, Ecosia, Yahoo, You.com | **0 found** | not in top 10 (every other "Westpeak" business is) | not returned | `site:` returned unrelated pages, which is Bing's behaviour when the host is unknown to it |
| **DuckDuckGo** | DuckAssist, several assistants | **1** (`/for`) | — | — | Bing-derived; confirms the above |
| **Brave** | Brave AI answers, Brave Search API users (a common retrieval backend), Perplexity partially | **4** | shown | — | Homepage snippet is the **pre-relaunch Wix copy**; `/services/depression-counselling` snippet still says "(MA, RCC)" |
| **Common Crawl** | most open training corpora, Common Crawl-derived datasets | 23 pages in CC-MAIN-2026-30 (July), 2 in 2026-25, **0 in 2026-34** (latest) | — | — | The site exists in one training-era snapshot, with the copy as it was in July |
| **Google** | Gemini, AI Overviews, most "search-augmented" products | ~76 pages with impressions (Search Console, to 28 Aug) | (not measurable from here) | — | Google is the only index with meaningful coverage, and it is the index whose data the repo already holds |
| **Anthropic search (this session's tool)** | Claude with web search | 3 pages surfaced across 4 queries | homepage shown **with the Wix-era title** | — | Retrieval-grade index, same staleness as Brave |
| **Perplexity** | Perplexity | not measurable — bot challenge | — | — | Perplexity retrieves from its own crawler plus partner indexes; PerplexityBot receives the site fine (§3) |

**Instrument notes, recorded because this repo's standing rule is to verify the instrument:** the scripted Bing RSS and DuckDuckGo HTML endpoints both refused automated queries tonight (DuckDuckGo returned its "anomaly" challenge; Bing's RSS returned dictionary sites for "online counselling bc"). Every position above was read in a real browser session instead. Google refused the browser entirely and returned a JavaScript shell to requests, so Google coverage is taken from Search Console, not measured.

## 2. The four queries that matter, answered by AI tonight

| Query | Engine | Cited | This site |
|---|---|---|---|
| Punjabi speaking counsellor Surrey BC | Brave AI answer | Psychology Today, Hundal Counselling, Forward Mind, ASRA, DIVERSEcity | **absent** |
| Online counselling BC, registered clinical counsellor, free consultation | Anthropic search | First Session, Orchard Valley, Upstream, Wellspring, Sana, Narra, Being & Becoming | **absent** |
| Tagalog / Filipino counsellor BC or Alberta | Anthropic search | Psychology Today (×5), Narra, CounsellingBC, Inclusive Therapists | **absent** — the least-contested space the practice can claim, and directories own every slot |
| ICBC counselling after a crash, 12 weeks | Anthropic search | ICBC, Vitality Collective, No Fear, Latitude (×2), Venturous, Nimble, Roya | **absent** (page published today; expected) |
| Westpeak Wellness (brand) | Anthropic search | homepage (stale title), depression page, Kelowna EMDR page | present, described as a Surrey practice offering English/Punjabi and "low cost options" — none of which is current |

The pattern is the same as the search audit's: **directories hold the answers, and practices with worse machine-readability are cited because the indexes know they exist.**

## 3. Crawlability, for the record (measured the same evening)

| | Westpeak | Best competitor on the row |
|---|---|---|
| AI agents with their own `Allow` (of 17) | **17** | 9 (Tidal, Being & Becoming, Thrive); Clearheart blocks 7 |
| Real AI user-agents get 200 + full page (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Bytespider) | **6/6, no challenge** | — |
| `llms.txt` / `llms-full.txt` | 40 KB hand-written / **1,075 KB** | Wellspring 46 KB plugin / none |
| RSS feed | yes (guides, resources, comparisons, audiences) | none |
| Words per KB on the homepage | 12.5 | Crossroads 26.2 |
| Speakable markup on clinical pages | yes | none |
| Document language on Punjabi/Tagalog pages | correct (fixed today) | — |

Nothing here is the constraint.

## 4. Why the indexes do not have the site

Three causes, in order of weight:

1. **Nobody told Bing the host exists.** The domain moved from Wix to Vercel in August. Bing discovers new hosts through links and through Bing Webmaster Tools; the site has almost no links (§5), and there is **no Bing Webmaster verification** — the production environment has no `NEXT_PUBLIC_BING_VERIFICATION`, and no `msvalidate.01` tag is served. IndexNow submissions (which would tell Bing directly) are configured — the key file is served correctly at `/4366026342552d889b0442be9c388752.txt` — but the weekly job recorded no health until tonight, and the on-deploy GitHub workflow skips because the `CRON_SECRET` repository secret was never added. Whether a single successful submission has ever reached Bing cannot be shown from the records. IndexNow also does not create trust; it only invites a crawl.
2. **Stale copies are winning where copies exist.** Brave and at least one retrieval index hold the June/July homepage. A crawler with no reason to revisit (no links, no freshness signal it trusts) keeps what it has.
3. **No corroborating entity.** No Google Business Profile, no Psychology Today, CounsellingBC or TherapyTribe listing for either counsellor. Every AI answer in §2 cites a directory. An answer engine deciding whether "Westpeak Wellness" is a real counselling practice in BC finds one self-description and nothing that agrees with it — except a Wix-era snippet that disagrees.

## 5. What was done tonight

- The IndexNow route now records its runs in cron health and fails loudly when every endpoint refuses, so "never reported" can no longer mean either "never ran" or "ran and was rejected" (`app/api/indexnow/route.ts`).
- Nothing else — the remaining causes are off-site by nature.

## 6. What to do, in order

| # | Action | Effect | Effort | Whose |
|---|---|---|---|---|
| 1 | **Bing Webmaster Tools**: add the site, verify (the one-click *import from Google Search Console* works), submit `sitemap.xml`. Then set `NEXT_PUBLIC_BING_VERIFICATION` in Vercel so the tag is served permanently | Puts the host in front of the index that ChatGPT search, Copilot and DuckDuckGo ground on. This is the single largest AI-visibility change available | 20 min | Owner |
| 2 | **Add `CRON_SECRET` to the GitHub repository secrets** | Every deploy pings IndexNow the same hour, instead of the Monday cron only | 5 min | Owner |
| 3 | **Google Search Console**: request indexing for the homepage and the three pages published today; resubmit the sitemap | Refreshes the copy Google (and Gemini) hold; Google is the only index with real coverage | 15 min | Owner |
| 4 | **Google Business Profile** (service-area, BC + AB, both counsellors, languages) and **Psychology Today / CounsellingBC / TherapyTribe** listings for both counsellors, each linking to the matching profile page | The corroboration every AI answer in §2 currently gets from someone else. Also the links that make Bing and Brave revisit | 2–3 h | Owner |
| 5 | Re-run this audit in four weeks with the same queries | Bing and Brave coverage should move from 0–4 pages to the sitemap; the brand snippet should carry the current title | 30 min | — |

## 7. Score, if a score is wanted

On the 28 Aug scale (six machine-readability categories, /1,000 each) the site now sits at the top of every one. On **visibility** — being retrieved and cited — a fair reading of tonight's evidence is:

| | /1,000 | Basis |
|---|---|---|
| Index coverage (Bing, DDG, Brave, CC) | **60** | 0 / 1 / 4 / 0 of 254 pages |
| Entity accuracy in the indexes that have it | **150** | Wix-era snippet on the homepage in two indexes |
| Citation on target queries | **0** | absent on all four non-brand queries |
| Brand retrieval | **400** | found on Brave and Anthropic search; not on Bing |
| Crawlability (from §3) | **980** | first in market |

The last row is done. The first four are the same problem, and item 1 above is where it starts.

---

*Probes: `C:\dev\wp-gates\aiprobe.mjs` (crawlability), browser sessions against bing.com, duckduckgo.com and search.brave.com, `index.commoncrawl.org`, `archive.org/wayback/available`. Search Console figures from `data/gsc/`.*
