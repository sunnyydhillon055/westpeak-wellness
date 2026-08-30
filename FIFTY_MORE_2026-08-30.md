# Fifty more — 30 August 2026

Fifty changes, all verified against a build, in the order they were found
rather than the order they matter.

## What this round actually was

The site had eleven gates and they reported **68 findings**. Fifty-one of those
were false, and finding that out was most of the work.

| | before | after |
| --- | ---: | ---: |
| SEO gate | 0 errors, 64 warnings | **0, 0** |
| Quality sweep | 8 categories, 94 findings | **nothing found** |
| Visual density | 51 pages with nothing visual | **0** |
| Link rot | 0 dead, 1 unreachable, 3 refused | **0 dead, 0 unreachable, 8 UA-blocked** |
| Internal links | not checked | **0 broken** |
| Sitemap parity | not checked | **agrees both ways** |
| Metadata completeness | not checked | **complete on all 191** |
| Contrast | claimed, never measured | **26/26 pairs pass AA** |
| Route smoke test | not checked | **36/36** |

The standing lesson in this repo is *verify the instrument before acting on
what it reports*. It earned its keep again: five separate false-positive
classes, one of which would have sent somebody rewriting the census citations
that the practice's only ranking niche is built on.

---

## A. Instruments that were lying (1–10)

**1. Quality sweep counted the gated provinces as pages.** `/alberta` and
`/ontario` build a 404 shell on purpose. The sweep read them as ordinary pages
and scored them for a missing H1, a missing `lang`, zero words, no links out,
and a duplicated title and description — eight findings, and between them
every entry in five categories. `seo-audit.mjs` had skipped these routes since
the gate was written; this file never learned.

**2. Implicit `<label>` was not recognised.** 33 pages reported "form field
with no label". Every one was the consent checkbox in `LeadCapture.tsx`,
written as `<label><input …><span>…` — associated under the HTML standard,
exposed correctly by every screen reader, needing no `id`. The markup was
right and the instrument was wrong, loudly enough to be the largest
accessibility number the sweep printed.

**3. `fill` images were read as layout-shift risks.** The two photographs on
`/` and `/online-counselling` are `<Image fill>`; a fill image never carries
`width`/`height`, and the box is reserved by the `aspect-ratio` on the
`.photo--*` wrapper. The check was reading for one particular spelling of the
answer.

**4. The 404 was held to a thin-content rule.** A 404 padded to 250 words is a
worse 404. `/message-sent` and `/punjabi/sent` exempted for the same reason
`cta-audit.mjs` already exempts them.

**5. Visual density flagged a confirmation page.** Same reasoning: a receipt
does not need illustrating.

**6. Ten `no-lastreviewed` warnings nobody could action.** `lib/schema.ts`
states that service pages carry no review date because *"inventing one would
put a fabricated clinical claim into structured data"*. The gate warned about
it every run anyway, and those ten were 70% of all warnings — enough to bury a
real finding.

**7. Link-rot never decoded HTML entities.** An `href` in a document is HTML
text, so `&` is written `&amp;`. Every citation with a query string had been
checked as a different URL than the one a reader clicks.

**8. Link-rot could not see a soft 404.** Added: follow the redirect, compare
the landed path, read the `<title>`. `lib/city-context.ts` had recorded this
failure in prose two days earlier — Fraser Health answering 200 and serving
`/page-not-found` — and the checker still could not see it.

**9. …and then the soft-404 check libelled five live citations.** It reported
the Statistics Canada sources behind the Punjabi mother-tongue figures as
dead. They are not: `www12.statcan.gc.ca` inspects the user-agent and answers
an obvious script with its own not-found page. Every one loads in a browser.
The file already knew this shape of lie — its header explains why a 403 is
reported separately — so a soft 404 now gets the same second opinion, asked as
a browser, before anything is called rot.

**10. …and one "unreachable" was just slow.** cpa-apc.org was reported
unreachable three runs running. It answers fine in 30 seconds. The report's
own hedge was "re-run before believing it"; doing the re-run automatically is
better than asking a person to remember.

## B. Four new instruments (11–14)

**11. `scripts/internal-links.mjs`** — every in-body internal link resolves to
a built page, an on-demand route, or a file; nothing goes through a needless
redirect; no `#fragment` points at an id that does not exist.

**12. `scripts/sitemap-parity.mjs`** — the sitemap is a second hand-maintained
list of every URL, and two lists of the same thing drift. Checks both
directions, plus that no gated province and no noindex route is listed.

**13. `scripts/metadata-audit.mjs`** — what a link to this site looks like
when it is *pasted* somewhere. `og:title`/`description`/`type`/`locale`,
`twitter:card`, and whether `og:url` and the canonical agree.

**14. `scripts/contrast-audit.mjs`** — `/accessibility` and the FAQ both tell
readers this site meets WCAG 2.1 AA. Nothing re-checked it. A published
accessibility claim that has gone stale is worse than no claim: it tells a
disabled reader the site has been checked, which is the reason they might not
report what they find. All 26 pairs pass; the tightest is 4.70.

## C. What those found, and the fixes (15–24)

**15. A 404 on the page written to be handed to a doctor.** `/refer/doctor`
linked to `/compare/msp-vs-extended-health`. The page is at `/resources/…`;
seven other files link to it correctly. Found on the new checker's first run.

**16. Three FAQs shipped in schema and rendered nowhere.** `GROUP_OF` has
carried a warning about this since it was written, and three questions were
unmapped anyway — including *"How do I pay, and when?"*. They appeared in the
`FAQPage` markup and in no group on the page, which is structured data
describing content the visitor cannot see.

**17. 175 of 191 pages had no `og:locale`.**
**18. 83 had no `og:type`.**
**19. 13 had an `og:url` pointing at the homepage.** One cause for all three:
Next *replaces* the root `openGraph` object when a page declares its own
rather than merging it. The root object in `layout.tsx` reads like a site-wide
default and is not one. A link to `/faq` pasted into WhatsApp unfurled
announcing the URL of the homepage, disagreeing with the canonical tag on the
same page about which page it was.

**20. The 404 canonicalised to the homepage**, inherited from the root — every
404 URL on the site declaring it was really `/`.

**21. The 404 also inherited the homepage's description**, so it described
itself to anything reading metadata as "online counselling across BC".

**22. The matrix `og:title` kept a string the page title had rejected.** The
page-title comment records that `"<service> in <city>, BC (Online) | Westpeak
Wellness"` ran to 69 characters and was cut back; `og:title` kept the rejected
version. The fix had landed on the search result and not on the share card.

**23. `/punjabi` now declares `pa_IN`** with `alternateLocale`, which is what
tells a share card and a crawler that it and its English counterpart are a
pair.

**24. `.env.example` was git-ignored by `.env*`.** Five kilobytes documenting
every variable, what it drives and what happens when it is unset — the only
written record of this project's configuration contract — existed on one
laptop and in no repository. Verified before un-ignoring: the one non-empty
line is the public canonical origin.

## D. Guards, so they cannot come back (25–26)

**25.** `lib/faq.ts` now throws at module load if a question has no group, so
an unmapped FAQ fails `npm run build` with the question in the message. The
comment warning about it had been there all along; a comment is what a rule is
worth against a list two people edit.

**26.** `!.env.example` negation in `.gitignore`.

## E. Social cards (27–28)

**27. The 50 city × service pages had none.** A quarter of the site — the half
written to be found by somebody searching a city and a problem in the same
breath — shared to iMessage or WhatsApp as a blank rectangle. Rendered and
checked against a live server, not assumed.

**28. `/refer/doctor` had none**, and it is the page most likely to be
forwarded.

## F. Visual density (29–32)

**29. Diagrams on the 50 matrix pages.** They were the largest block of
long-form text on the site carrying nothing visual: 1,050–1,170 words each, a
break every 158 words, all of those breaks headings. Nothing had to be drawn —
each of the five services already had a diagram on its own service page, alt
text and all. The matrix route had simply never used them.

**30. `accountability-chain` on the AI-versus-counselling comparison** — that
page's load-bearing claim is that no app is accountable to a regulator, and
the diagram of that chain already existed.

**31. `designations-bc` on `/refer/doctor`** — the thing its audience most
often has wrong.

**32. One new diagram drawn: `language-in-therapy`.** For
`/compare/therapy-in-punjabi-vs-english`, the last page with no in-body image.
Nothing already drawn was about language, and hanging an unrelated diagram on
a page to clear a warning is worse than the warning. Its content is the page's
own short answer and adds no claim to it.

## G. Wiring and internal linking (33–37)

**33.** `language-in-therapy` registered in `lib/figures.ts`.
**34.** Wired to the comparison, which also puts it in the image sitemap.
**35–36.** `/refer/doctor` linked in body from the doctor's-note guide and
from the FAQ — it had two inbound links and is worth more.
**37.** `lib/og-meta.ts` — `ogBase(path)` / `ogBasePunjabi(path)`, spread by
all 37 pages that declare their own Open Graph. `url` is an argument rather
than a default, because that is the field that was wrong and a default you can
forget is how it got wrong.

## H. The suite, and CI (38–45)

**38–41.** `internal`, `parity`, `meta` and `contrast` wired into
`npm run verify`.

**42.** `npm run verify:ci` — the offline suite.

**43. `.github/workflows/verify.yml`.** There was no CI that built the site or
ran any gate. `npm run verify` existed, was excellent, and fired only when
somebody remembered to type it. A gate nobody runs is documentation.

**44. `.github/workflows/link-rot.yml`** — external citations monthly, on a
schedule and blocking nothing, exactly as `link-rot.mjs` asks in its header.

**45.** `metadata-audit --all`, because a report that truncates its own
evidence at six lines makes you run it twice.

## I. Asking the server (46–48)

**46. `scripts/smoke.mjs`.** `next.config.mjs` carries the longest comment in
this repo and its point is *"nothing local catches that"* — a redirect beating
a page that exists, found only by curl against production days after deploy.
`redirect-shadow.mjs` closed most of it by comparing two lists, but it still
reasons about configuration. This boots `next start` and asks the server: 36
checks covering the pages a reader lands on, the ten on-demand routes every
file-reading gate is blind to, the generated images, the gated provinces, the
Wix-era redirects and where they land, and the counter-case — the four cities
that were retired and then given real pages and must *not* redirect.

**47.** Its first version reported all 22 healthy pages as soft 404s, because
Next embeds the not-found boundary in every page's RSC payload. The marker is
matched against the `<title>` only, which is the one place it appears when the
404 is what was actually served. Recorded here because it is the sixth
instrument error this round and they all have the same shape.

**48.** Wired into CI as the last step.

## J. Documentation (49–50)

**49. `README.md` rewritten.** It described 64 pages (there are 193), a
Calendly booking link (the site books through Cliniko), and "no database, no
external services" (there is a client portal, Cliniko sync and cron jobs). It
had been wrong about all three for weeks, and it is the first thing anyone
reads. Now carries the gate table, the CI layout, the guardrails and the
`npm run dates` sequencing.

**50. This file.**

---

## What was checked and found correct

Recorded so the next session does not re-check it:

- `/punjabi` already wraps its content in `<div lang="pa">`, so the page's
  language is declared where App Router allows it to be
- `/alberta`, `/ontario` and unknown URLs return real 404s, not soft ones
- `/search`, `/admin`, `/client-portal`, `/signin` are all `noindex` and
  correctly *not* disallowed in `robots.txt` — a disallowed page cannot be
  read, including its noindex
- No `.env` file is tracked; no image in `public/img` is unreferenced
- The mark in the generated share cards renders as designed — it resembles a
  placeholder glyph because a peak and a sun is what that glyph is
- Perf budget still passes: median page HTML +0.5% from the 50 new diagrams

## Not done, and why

- **The five Statistics Canada citations were not rewritten.** They work.
  `link-rot.mjs` says "check by hand, do not rewrite blind", and by hand is
  how they were checked.
- **No review date was added to the service pages.** There has been no
  clinical review; inventing a date would put a fabricated clinical claim into
  structured data.
- **The perf baseline was not refreshed.** It passes. Refreshing a gate that
  passes only loosens it.
