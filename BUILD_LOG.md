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

**`.env.example`, `GO_LIVE.md`, this file.**

---

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
