# Build log

What was done, what was already true, and what is honestly still open.

---

## The most important thing in this file

**The directive was written from the rendered site and assumed a much earlier
starting point** (it estimated ~5,560/10,000 and asked for work across 15
phases). Its own rule §5 says to confirm against the code before changing
anything and to adapt where reality differs. It differed substantially: most of
Phases 3, 4, 5, 11, 12, 13 and 14.1 were already built in earlier sessions.

So this log separates **verified as already present** from **built in this run**.
Re-doing finished work would have been the easy way to produce an impressive
changelog and a worse site.

---

## Verified already present (not rebuilt)

Checked against the code, not assumed:

| Area | State found |
|---|---|
| Schema `@id` entity graph | One `MedicalBusiness`+`ProfessionalService`, one `WebSite`, one `Person` on `/about`; every other page references them. 14 duplicate Organization objects had already been collapsed. |
| Direct answers + question-shaped H2s | Present across services, guides, comparisons, resources |
| Internal linking / orphans | Every content page ≥8 in-body out-links; inbound minimum was 6 before this run |
| Fonts | `next/font`, self-hosted, variable axes, metric-matched fallbacks |
| Visual system | Design tokens, Lucide icon set, signature motif, section dividers, 19 original SVG diagrams |
| Accessibility | Contrast repaired earlier this session — including a header CTA rendering at **1.37:1** |
| Freshness | `Byline` with visible reviewed date + `dateModified` in schema |
| Wix 301s | All legacy URLs in `next.config.mjs`, verified no legacy 404s |
| Sitemap | Custom route handler with `xmlns:image`; Next 14's `MetadataRoute.Sitemap` silently drops `images`, which is why it is hand-rolled |
| AI crawler access + `llms.txt` | 12 named agents; `/llms.txt` and `/llms-full.txt` as route handlers so they cannot go stale |

## Built in this run

**Authentication** — NextAuth v5. Google sign-in plus optional email/password,
one `/signin` for both areas, role-based redirect. Authentication and
authorization are deliberately separate: a valid Google account proves identity
and grants access only if the address is a client or an administrator.

**Client portal + admin** — `/client-portal` (booking, availability,
cancellation) and `/admin` (edit the client list without a redeploy, set
passwords, test the Cliniko connection). Two gates: middleware checks the
session, each page re-checks the list on every render, so removal takes effect
on the next click rather than at token expiry.

**Analytics** — GA4 via `@next/third-parties`, loaded only when
`NEXT_PUBLIC_GA_ID` is set. Central `track()` helper; every booking CTA routes
through one `BookLink` component, so a CTA cannot be added that silently reports
nothing. Passive `scroll_75` and `outbound_click` listeners.

**Three interactive tools** — `/tools/which-service`,
`/tools/therapy-cost-bc`, `/tools/stress-check`. Client-side, nothing stored,
`WebApplication` schema, share via the Web Share API with a clipboard fallback
(no third-party share buttons, which would tell a social network that someone
read a counselling page). Each has substantial static prose beneath it, because
without it a crawler or a JS-less reader gets an empty div.

**Search** — `/search`, server-rendered over a build-time index assembled from
the same data the pages render from, so it cannot drift. No JS, no search
service, no query logging. This is also what finally made the `WebSite`
`SearchAction` honest; it had been deliberately omitted while no search page
existed.

**Lead capture** — a coverage checklist on `/pricing`. The guide it sits beside
is complete without it; gating useful information behind an email address at the
moment someone is deciding whether to trust a counselling practice is a bad
trade.

**Reviews scaffolding** — component and schema built, `lib/reviews.ts` **ships
empty**. BCACC prohibits soliciting testimonials from counselling clients — not
a wording technicality, but because someone in a therapeutic relationship is not
free to decline. The component renders nothing while empty rather than a
"coming soon" placeholder.

**Security headers** — CSP built from what the site actually loads (GA4,
Cliniko iframe, Google sign-in; no external font host, since fonts are
self-hosted), plus HSTS, `nosniff`, Referrer-Policy, `X-Frame-Options`,
Permissions-Policy.

**Self-service password reset** — `/forgot` → one-time link → `/reset`, with no
involvement from the practice. Single-use without a database: the link carries a
fingerprint of the credential it was issued against, so using one spends it and
cancels the rest.

**`.env.example`, `GO_LIVE.md`, `ADMIN_NOTES.md`, this file.**

---

## The bug that mattered most

Vercel Blob reads are **not read-after-write consistent** — a read straight
after a write can still return the previous object. Harmless for the client
allowlist. Not harmless for credentials, where it caused two real failures:

- `setPassword` wrote and the reset route reported success unconditionally.
  When the write did not land, the old password kept working while the person
  had been told to use a new one — silent on both sides.
- The single-use check re-reads the credential, so a stale read let a used link
  be replayed. Testing confirmed a replayed link actually overwrote a password.

Both are fixed: a write-through cache in `lib/portal-users.ts`, and the reset
route now reads the new password back and re-verifies it before reporting
success. Cross-instance propagation remains eventually consistent and is
documented in `ADMIN_NOTES.md` rather than papered over.

Neither would have been caught by reading the code. Both were found by testing
the flow end to end and checking which password actually worked afterwards.

## Decisions worth recording

**Cliniko, twice corrected.** The stack was described as Jane, then Clio, then
Cliniko. Each was researched before building. Cliniko's "Require payment during
booking" is what makes *paid before the session* true rather than aspirational,
and paying creates the invoice automatically — the "keep it linked to invoicing"
requirement, met by the tool rather than by code here.

**A conflict in the requirements, resolved toward the stated priority.** Cliniko
disables its self-cancel link for appointments paid in full in advance. "Pay in
full up front" and "client cancels themselves" cannot both be true. Payment was
the stated priority, so the cancellation copy says plainly that cancelling goes
through a person — free more than 24 hours out, refunded in full.

**Cliniko API verification is additive, never subtractive.** It is consulted
after the stored list, and only a confident match grants access. Treating it as
the authority would mean one failed request locks every client out at once.
Tested with a deliberately invalid key: an already-listed client still signs in.

**Email+password is the weakest of the three sign-in options** and was built
because it was asked for. Google brings its own 2FA and stores no secret here.
Google is presented first on `/signin`.

**No payment code on this site.** A second payment path would not reconcile
against Cliniko's invoicing, and a static site has no server that can take a
card safely.

---

## USER MUST SET

Everything below is live and functional without these. Each unlocks one thing.

| Variable | Unlocks | Where |
|---|---|---|
| `NEXT_PUBLIC_CLINIKO_URL` | The booking calendar on `/book` and the portal | Cliniko → Online bookings |
| `NEXT_PUBLIC_GA_ID` | GA4 and all events | analytics.google.com |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Meta-tag verification (DNS works too) | Search Console |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | "Continue with Google" | console.cloud.google.com |
| `CLINIKO_API_KEY` | Cliniko patients sign in without being listed | Cliniko → My Info → API keys |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Lead-magnet emails reaching your inbox | Formspree / Basin / Zapier |

Already set: `AUTH_SECRET`, `PORTAL_ADMIN_EMAILS`, `PORTAL_SECRET`,
`BLOB_READ_WRITE_TOKEN`, `PORTAL_ADMIN_CODE`.

**GA4 conversions must be toggled in the GA4 UI** — Admin → Events → mark
`book_click`, `book_page_view` and `lead_magnet_submit` as key events. That
cannot be done from code.

## USER MUST POPULATE

`lib/reviews.ts` is empty on purpose. Add only non-client references —
colleagues, supervisors, referring physicians — each with a `sourceNote` saying
where it came from. The field is required rather than optional so that a client
testimonial cannot be added without noticing.

---

## Finish-the-gaps pass

The v2 directive listed five gaps. **Two of its premises were wrong and were
corrected rather than acted on:** it stated GA4 was live (the code is wired but
`NEXT_PUBLIC_GA_ID` has never been set, so nothing is being collected) and that
the email-capture form did not exist (it does, on `/pricing`).

| Gap | Outcome |
|---|---|
| 1 · Cliniko | `bookingsUrl` now reads `NEXT_PUBLIC_CLINIKO_URL`; `bookingReady` derives from it, so the embed appears the moment the URL is set. A documented, UNVERIFIED fallback powers a link-out button only. |
| 2 · Email capture | Already built. Added `NURTURE_SEQUENCE.md` — three emails, then stop. |
| 3 · Reviews | `/reviews` built (was 404) + `REVIEW_REQUEST.md`. |
| 4 · Blog | `/blog` and `/blog/:slug` now 301 to `/guides`. |
| 5 · Punjabi | `/punjabi` built in Punjabi, reciprocal hreflang with the English service page. |

### Two places the directive was not followed, and why

**The Cliniko embed is not rendered against the fallback URL.** The directive
asks for it so the page is "functional the moment the real URL is set".
`westpeakwellness.cliniko.com` is a guess at a subdomain; if it does not exist,
every visitor to `/book` sees a broken iframe where the booking calendar should
be. On a counselling site that is worse than an honest "being switched on"
notice with a link-out — which is what ships. Setting the env var turns the
embed on with no further change.

**No post-session review-request email was written.** The directive asks for one
as part of a "review-request loop". BCACC prohibits soliciting testimonials from
counselling clients, including former ones, because someone in a therapeutic
relationship cannot freely decline. There is no compliant way to write that
email. `REVIEW_REQUEST.md` explains the rule, provides the template that *is*
permitted — to colleagues and referrers — and lists what actually builds trust
for a local practice instead. Writing the requested email would have been the
single most damaging thing added to this site.

### The Punjabi tension, resolved

An earlier instruction was to stop over-emphasising Punjabi; this directive asks
for a Punjabi landing page. They are compatible and both were honoured: the
thin scattering of the word across every English page stays removed, and the
language now has one real page written *in* it for someone searching in it.
Concentrated, not diffuse.

## Visual pass, and one metric that should be ignored

The v2 visual review scored 7,510 and named photography breadth as the biggest
gap. Three of its observations were already stale — the signature block is no
longer the Punjabi one, `/reviews` now exists — and one was simply wrong: it
reported "no illustration, diagrams, or supporting visuals on most pages" when
21 original SVG diagrams were already deployed and the per-URL audit showed zero
pages without a visual.

The photography gap was real: three images across a hundred pages. Rather than
stock, six original atmospheric scenes were drawn in the brand palette and are
assigned deterministically per page slug. Licence provenance for stock cannot be
verified from inside a build; therapy stock is a recognisable genre readers
discount on sight; and a 300 KB photograph on every page would cost the
performance the same review asks to protect. These are 1.4 KB each.

They render as CSS backgrounds, not `<img>` tags. Purely decorative artwork
should not be in the accessibility tree at all — and the first version, using
`alt=""`, put 75 empty-alt images into the audit where they would have masked a
real one.

**A duplication figure to disregard:** `/tools ~ /punjabi` reports 28.1%
overlap, over the site's own 25% bar. It is an artifact. `/punjabi` contains 144
English words, 117 of which are shared site chrome — nav, footer, crisis block —
because the page's actual content is in Gurmukhi and the metric only sees Latin
tokens. The two pages share nothing meaningful. Padding English onto a Punjabi
landing page to move the number would make it a worse page, so it stands.

## Where this run did not reach the directive's bar

Stated plainly rather than papered over.

**Lighthouse was never run.** There is no headless Chrome in this environment,
and there has not been at any point in this work. The directive asks for
before/after Performance, LCP, CLS and TBT per page; **those numbers do not
exist and I will not invent them.** What *was* measured directly: all routes
statically rendered, first-load JS 87.3 kB shared, the largest tool adding
3.65 kB, fonts self-hosted with metric-matched fallbacks, every image carrying
explicit dimensions, and no external render-blocking resource. Those are the
inputs a good score is made of, but they are not the score. **Run PageSpeed
Insights against the live URL to get real figures.**

**Programmatic `service × city` pages (5.5) were not built.** The city pages
already earned their place by being genuinely different; 9 services × 45 cities
is 405 pages that would differ by a noun. The directive says to cut noun-swap
filler and keep >25% uniqueness, and a matrix that size cannot clear that bar
honestly. Max pairwise overlap across the current 103 pages is **20.7%**.

**Four tool pages sit under the site's 600-word standard** (409–493). They are
tools; most of the content is behind interaction by design. Each has a diagram,
question-shaped H2s and 8+ contextual links, and I chose not to pad them to hit
a number.

**Two tool pages have 2 inbound links against a standard of 3.** Both are
linked from the tools index, the footer, and one contextual page each. More
would have meant inserting links where a reader would not want one.

---

## Current state, measured

```
pages (sitemap)      : 103
total words          : 178,537
pages >= 1000 words  : 92
images               : 186, 0 missing alt
og:image coverage    : 103/103
JSON-LD types        : Article, BreadcrumbList, CollectionPage, DefinedTermSet,
                       FAQPage, ItemList, MedicalBusiness+ProfessionalService,
                       Person, Service, WebApplication, WebPage, WebSite
max pairwise overlap : 20.7%
build                : clean
name rule            : app/about/ only
```

## Score

The directive asks for a projected tally. I am not going to produce one: the
5,560 baseline came from a rubric I did not run and cannot reproduce, so any
number I wrote here would be a guess dressed as a measurement. What I can say is
which categories moved and which are capped by things outside the code —
deployment and indexing, Google Business Profile, directory listings and real
reviews. Those are in `GO_LIVE.md`, and on a local practice they matter more
than anything on this list.

---

# Visual design and performance pass — 2026-08-09

## The instrument changed, and that is most of why this pass found anything

Every earlier pass was made without ever seeing a rendered page: the browser
pane in this environment never composited a frame, so `getEntriesByType('paint')`
returned `[]`, `document.visibilityState` was permanently `hidden`, and no
screenshot was possible. Layout could be inspected through computed styles and
bounding boxes; paint could not be measured at all, and every performance claim
had to be scoped to transfer size and TTFB.

`playwright-core` driving the installed Chrome (`C:\Program Files\Google\Chrome\
Application\chrome.exe`) removes both limits. It is installed in the scratchpad,
**not** as a project dependency — it is a measuring instrument, not part of the
site. Scripts live in the session scratchpad; recreate them as needed:

| script | what it answers |
|---|---|
| `measure-all.mjs`   | worst unbroken prose run, LCP, CLS, overflow — all 105 pages |
| `contrast.mjs`      | WCAG contrast against real composited backgrounds |
| `defects.mjs`       | underlined buttons, tap targets, overflow, heading skips, unnamed links |
| `align.mjs`         | H1 left edge vs first body H2, per page |
| `css-coverage.mjs`  | how much of the stylesheet is exercised |
| `prod.mjs`          | production vitals and per-type transfer weight |

## Four findings worth not rediscovering

**1. `ch` units were the entire cause of the site's CLS.** `ch` is the advance
width of "0" in whatever font is currently resolved, so every `max-width` set in
`ch` changes the instant a webfont swaps in — text rewraps and everything below
moves. Measured: Inter's ch/em is 0.6309 against its fallback's 0.5391, a 17%
drift. Four pages were failing Core Web Vitals (worst 0.1896); blocking the
fonts took all of them to exactly zero. All 24 measures are now in `em`, which
resolves against font-size and never touches glyph metrics.
**Do not reintroduce `ch` for layout.** Use `em`; the conversion ratios are
Fraunces 0.6620 and Inter 0.6309.

**2. `next/font` emits preloads per *module*, not per element.** `app/layout.tsx`
imports `app/fonts.ts` for the global font variables, so while the Gurmukhi face
was declared in that same file, all 105 routes preloaded and fetched it —
regardless of where `gurmukhi.variable` was actually applied. Applying
`.variable` narrowly controls what the font is *used for*, not what is
*fetched*. It now lives in `app/fonts-gurmukhi.ts`, imported only by the three
pages that render ਪੰਜਾਬੀ. **Declaring a font beside the global ones re-broadcasts
it to every page.**

**3. Playwright reports `encodedBodySize === decodedBodySize`.** This reads as
"nothing is compressed" and is false. Checked against the origin directly with
curl: CSS 69,812 → 15,954 brotli (78%), JS 172,835 → 55,141 (69%). Any
"total transfer" figure taken from Playwright resource timing here is a decoded
size. Font numbers are unaffected — woff2 is already compressed, so for fonts
the reported size *is* the wire size.

**4. The hero ridgeline SVGs are full-width filled bands.** Each path closes with
`v…H0…Z` running to the bottom corners, so scaling one to a fraction of the hero
and pinning it to a side does not crop it to a corner vignette — it plants a band
with a hard vertical cut where the fill stops. Seven variants each had a visible
seam at its own x. They now span 100% with the height set explicitly and
`preserveAspectRatio='none'`; the clay suns were pulled out into their own
radial-gradient layer sized in px, because a stretched circle is an ellipse and
that *is* perceptible where a stretched ridge is not.

## Results

```
                          before        after
worst unbroken prose run  4,094px       1,734px
pages over 2,000px        11            0
pages over 1,600px        22            1
median unbroken run       ~1,169px      1,147px
CLS worst / over 0.1      0.1896 / 4    0.0251 / 0
LCP median / over 2,500   unmeasurable  244ms / 0
fonts, typical page       193.8 kB      83.6 kB
contrast failures         1             0
thin pages (<600 words)   4             0
tool pages <3 inbound     2             0
hero left-edge positions  5 ad-hoc      4, tokenised
```

Zero across all 105 pages, desktop and mobile: broken links, bad anchors,
missing H1/alt/meta, underlined buttons, text overflow, skipped heading levels,
links without an accessible name, pages scrolling sideways at 1440 or 390.

## Deliberately not done

- **Trimming the CSS.** 36% is unexercised, but that is only ~5.8 kB brotli and
  the figure includes hover/focus states never triggered, print rules, and the
  82 pages the coverage run did not visit. The genuinely-dead subset is a
  fraction of that and cutting it risks states that are expensive to verify.
- **More photography.** Three photographs, each used once. Adding stock imagery
  would work against a visual identity built on original artwork — and a
  counselling practice showing stock photos of models is its own kind of signal.
  Real photographs need licensing or a shoot; that is an owner decision.

## Still owner-blocked

`NEXT_PUBLIC_CLINIKO_URL`, `RESEND_API_KEY` + `PORTAL_FROM_EMAIL`,
`AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`, `NEXT_PUBLIC_GA_ID`, and the DNS cutover
in `GO_LIVE.md`.

---

## 2026-08-09 — 50-category audit and remediation

Measured a full crawl of the production build (105 sitemap URLs + 6 unlisted
routes) plus rendered measurement on 18 pages, desktop and throttled mobile.
Scores and evidence are in `SCORE_LEDGER.md`. Decisions worth recording:

**The directive's baseline was not this site.** It stated 188 sitemap URLs and
a 16,270/25,000 prior score. Live and local both return **105**, and `/blog` is
a 308 rather than the 200 it listed. The prior score was therefore not carried
forward; every "before" in the ledger comes from my own crawl of this build
earlier the same day.

**Phase 1.1 (convert rasters to WebP/AVIF) was not done, deliberately.** All 191
images on the site are hand-built SVG, plus three photographs already served
through `next/image`. There is no raster to convert, and converting SVG to WebP
would make the site larger and resolution-dependent. Logged rather than done.

**Two contrast measurements were wrong before one was right.** Walking the DOM
for a `backgroundColor` cannot see `linear-gradient`, so the first pass read
white-on-navy as white-on-white — 8 false positives. The second hid the glyphs
and sampled a pixel, but React re-rendered and dropped the marker attributes,
so it sampled the glyph. The method that stands samples a grid per text box and
takes the modal colour, mutating nothing: **0 failures across 329 text runs.**

**A 0.919 CLS turned out to be the 404 page.** Two URLs in the sample list did
not exist. Real pages measure 0.000 on both viewports.

**Inline prose links were excluded from the tap-target count.** WCAG 2.2
SC 2.5.8 exempts targets constrained by the line-height of surrounding text.
Counting them would have produced a large fake defect and a change that damaged
the prose. The genuine remainder — `Read more →` at 95×18 and the nav links —
is recorded as outstanding.

**Breadcrumbs now emit visible trail and BreadcrumbList from one argument.**
The site previously had markup on 87 pages and a visible trail on none. A
second BreadcrumbList on a page is not an error Google reports, so pages
carrying their own graph pass `schema={false}` rather than risking a silent
duplicate.

---

# 2026-08-17 — Interprovincial expansion (Alberta live, Ontario dormant)

Full detail in `EXPANSION_LEDGER.md` and `ONTARIO_LAUNCH_CHECKLIST.md`.

## ⚠️ USER MUST DO — in this order

1. **Confirm professional liability insurance covers clients located in
   Alberta.** Insurers commonly scope coverage by province. Alberta pages are
   LIVE and advertising into the province; if the policy does not extend there,
   say so and they come down the same day. This was flagged before deploy and
   deployed anyway per the directive — it is the owner's call, and it is the one
   outstanding item that could require rollback.
2. **Obtain CRPO registration** before any Ontario page is enabled. CRPO cannot
   impose a residency requirement, so a BC-resident counsellor can register.
   That registration is the only thing that unlocks Ontario.
3. **Confirm insurance also covers Ontario clients**, before flipping the flag.
4. **Alberta directory listings** — Psychology Today (Alberta), Counselling
   Alberta, ACTA. These are what give the new pages any authority at all.
5. **Request indexing** of the seven Alberta URLs in Search Console.
6. **Alberta backlink outreach** to Punjabi and South Asian community
   organisations in Calgary and Edmonton.

## Regulatory position, verified 17 Aug 2026

- **Alberta:** counselling therapy remains unregulated. The March 2024
  announcement placing counselling therapists under the College of Alberta
  Psychologists has **no proclamation date**; CAP is awaiting provincial funding
  and a workforce advisory committee reports through Fall 2026. The original
  2025 target has passed. **Clear to publish and advertise.**
- **Ontario:** psychotherapy is a controlled act. CRPO's allowance for an
  out-of-province registrant is conditional on **not advertising in Ontario**.
  Pages built, four independent locks, not published.

## Ambiguity resolved without asking (per directive)

- **~60 pages requested, 14 built.** Roughly 40 were per-city versions of
  province-level or service-level facts and would have violated the directive's
  own <25% shared-copy rule. Cut with reasoning per page in
  `EXPANSION_LEDGER.md`, using the directive's own cut clause.
- **Crisis numbers:** the directive listed Edmonton as 780-482-4357. Verified
  correct (CMHA Edmonton, 24/7) and added Access 24/7 on 780-424-2424 alongside.
  Every number checked against the operator's own site.
- **`llms.txt`:** Alberta added; Ontario deliberately omitted until published.

## Defects found in the existing site while doing this

- The footer named the **BC** crisis line on every page — including, once
  Alberta shipped, pages written for Calgary where 310-6789 does not reach.
  Fixed to national numbers only.
- `app/not-found.tsx` had the same problem. Fixed.

## 2026-08-17, same day — Alberta taken back down

**Owner confirmed the professional liability policy does not extend outside
British Columbia.** The Alberta pages had been live for a few hours. They are
now gated by the identical four-lock mechanism used for Ontario, verified in
production: `/alberta` and all six child pages return 404, and the sitemap is
back to 116 URLs with zero `/alberta` and zero `/ontario`.

Regulation was never the Alberta problem and still is not. Cover is.

### The two gates now, and they unlock differently

- **Alberta — needs cover only.** Either the policy is extended, or an insured
  clinician who can take Alberta clients is hired. The owner notes that hires
  would carry their own insurance; that is a real route, with three questions
  for a broker first (entity vs individual cover, vicarious exposure, who holds
  the clinical relationship). See `ALBERTA_LAUNCH_CHECKLIST.md`.
- **Ontario — needs CRPO registration AND cover.** Two independent gates.
  Registration alone does not unlock it.

### ⚠️ The exposure this does NOT fix

Taking the pages down stops the practice **advertising** into Alberta. It does
not stop an Alberta resident finding the BC site and booking, because **nothing
in the booking flow asks where the client is sitting** — and the session counts
as happening where they are, not where the counsellor is.

- Done: `/book` now states plainly that sessions are for people located in
  British Columbia, and why.
- **Owner action, and now the top one:** add a client-location question to
  Cliniko intake, asked at booking rather than discovered in session.

This gap predates the expansion work and applies to every province. It is the
largest remaining risk on the site.
