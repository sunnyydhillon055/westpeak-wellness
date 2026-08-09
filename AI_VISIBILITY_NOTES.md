# AI Visibility (GEO/AEO) — Implementation Notes

How this site is built to be retrievable and citable by answer engines, and the
conventions to follow when adding pages so new content stays citable.

---

## 1. Crawler access

`app/robots.ts` emits a wildcard `Allow: /` **plus a named allow block for each
AI crawler**:

| Operator | Agents |
|---|---|
| OpenAI | `GPTBot` (training), `OAI-SearchBot` (ChatGPT Search index), `ChatGPT-User` (live fetch when a user asks) |
| Anthropic | `ClaudeBot`, `Claude-User`, `anthropic-ai` |
| Perplexity | `PerplexityBot`, `Perplexity-User` |
| Google | `Google-Extended` (Gemini / AI Overviews grounding) |
| Microsoft | `Bingbot` (Copilot rides the Bing index) |
| Apple | `Applebot-Extended` |
| Common Crawl | `CCBot` |

The wildcard already permits all of these — the named blocks change nothing
technically. They exist because these agents are commonly blocked by default in
boilerplate and by hosting platforms, and because an explicit allow survives
someone later pasting in a restrictive template. Retrieval and training agents
are listed separately so the distinction stays visible if the practice ever
wants citation without training.

Only the generated social-card routes are disallowed. **Preview deployments
return `Disallow: /`** so a branch build can never be indexed or cited.

## 2. Everything is server-rendered

All 105 routes are statically generated. AI crawlers execute little or no
JavaScript, so this matters more for them than for Google.

Verified: `/services/emdr-therapy` returns **1,807 words of body text in the raw
HTML** with no JavaScript executed.

The three client components are chrome and progressive enhancement only —
`Header` (menu state), `StickyBook` (a booking link), `Reveal` (a scroll
animation). **No content depends on them.** `Reveal` in particular is built so
content is visible by default and only hidden once JS confirms it is running,
so a crawler that runs no JS sees the full page.

## 3. One entity graph

`lib/schema.ts` defines three canonical `@id`s and exports references to them:

```
ORG_ID    = {domain}/#organization
SITE_ID   = {domain}/#website
PERSON_ID = {domain}/about#person
```

Before this pass there were **14 separate inline `Organization` objects** across
the templates. To a retrieval system that reads as fourteen loosely-related
things rather than one practice with many pages. Now every page emits
`{ '@id': ORG_ID }` as a *reference* and the root layout carries the single full
definition.

**Rule for new pages: never inline a second Organization object. Import `orgRef`.**

| Node | Where defined | Where referenced |
|---|---|---|
| `MedicalBusiness` + `ProfessionalService` | `app/layout.tsx` | every page, via `orgRef` |
| `WebSite` | `app/layout.tsx` | via `siteRef` (`isPartOf`) |
| `Person` (the counsellor) | `app/about/page.tsx` only | via `personRef` (`reviewedBy`) |

The Person node carries `hasCredential` (RCC + degrees), `memberOf` BCACC,
`alumniOf`, `knowsLanguage` and `knowsAbout`. It is the E-E-A-T anchor, and
guides now reference it as `reviewedBy` — which credits a named, credentialed
reviewer **without** repeating the personal name outside `/about`. The reference
resolves to the node `/about` defines.

Also emitted: `Service` per service page (provider → `orgRef`), `Article` on
every guide/approach/comparison/audience/resource, `FAQPage` wherever there is a
Q&A block, `BreadcrumbList` on all nested pages, `DefinedTermSet` over the
60-term glossary, `ItemList` on hubs.

## 4. Content format

**Direct-answer paragraph under the H1.** Guides, comparisons, approaches and
resources already carried a `shortAnswer` rendered as a pull-quote. Service pages
did not — they now have a `directAnswer` field, written to stand alone: each
names the practice, the service, the province and the delivery format inside the
first two sentences, so a page pulled in isolation still answers *what is this,
who provides it, where, and how*. The same string feeds the `Service` schema
`description`, so the quotable sentence and the structured description match.

**Question-shaped H2s.** Much of the site already does this ("Does couples
therapy actually work?", "How do you know when it is time for therapy?"), with
the answer in the first sentence beneath and detail after.

**Entity consistency.** Always "Westpeak Wellness", always "British Columbia",
always "Registered Clinical Counsellor (MA, RCC)", worded identically
site-wide — answer engines frequently quote the sentence containing the name.

**Freshness.** Every guide-shaped page carries a visible reviewed date in the
`Byline` component and `dateModified` in schema.

## 5. llms.txt

Both files are **route handlers, not static files in `public/`**, so they cannot
go stale — add a guide and it appears on the next build. That is the failure mode
of every hand-maintained index file.

- **`/llms.txt`** (~24 KB) — practice summary, key facts (service area, delivery,
  languages, credential, fees position, scope limits), crisis resources, and a
  linked map of every page with a one-line description.
- **`/llms-full.txt`** (~640 KB) — the substantive prose of the whole site in one
  plain-markdown file, assembled from the data layer rather than scraped, so it
  contains no navigation or chrome. Inline link markup is flattened: a model
  reading it wants the sentence, not the anchor.

Both state plainly that the site publishes no testimonials or outcome claims and
that this is a BCACC requirement — so an engine does not read the absence as a
thin or low-quality signal.

## 6. Deliberately not done

**`WebSite` `SearchAction` was not added.** It is in the brief, and a
`SearchAction` must point at a real search endpoint. This site has no search
page, so the markup would describe a capability that does not exist — which is
exactly the kind of thing that gets structured data distrusted. Build a search
page and it becomes honest; until then it is omitted.

---

## The part the site cannot do

On-site work makes the site **eligible** to be cited. It does not make it cited.
Three things matter more than anything above, and none of them are code:

1. **The domain must go live and be indexed.** The site currently runs on a
   Vercel preview URL while `westpeakwellness.com` still serves the old Wix site.
   Answer engines lean heavily on the Google and Bing indexes; an unindexed
   preview URL will essentially never be cited. Transfer the domain per
   `DEPLOY.md`, then submit to Google Search Console and Bing Webmaster Tools.
2. **Third-party corroboration is the single strongest driver** for a therapy
   practice. Google Business Profile (claimed and complete), Psychology Today,
   the BCACC directory, local directories — all with *identical* practice name,
   URL and service area. AI systems trust entities they can confirm from
   independent sources.
3. **Reviews and genuine references accumulate over time.** They cannot be
   submitted, only earned.

Until step 1 is done, everything in this document is preparation.
