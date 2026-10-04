# Decisions

What has been decided, why, and where it is enforced.

This repository has fifty-odd markdown files and every one of them is a plan, an
audit or a report — a snapshot of a moment. None of them answers the question
somebody actually has before changing something: *is this the way it is because
somebody chose it, or because nobody did?*

The reasoning does exist. It is in source comments, some of them very long, and
a comment is only read by somebody who already opened that file. The decisions
below are the ones that reach across files — where changing one thing quietly
breaks a commitment made somewhere else.

**How to use this.** If you are about to do something this file has a line
about, read the line first. If you decide differently, change the line and say
when. A decision register that disagrees with the code is worse than no
register, because it will be believed.

Each entry names where the decision is actually enforced, so it can be checked
rather than taken on trust.

---

## Who the practice says it is

### Personal names appear on profiles, the roster, /about and the header — nowhere else
Changed 1 Sep 2026, and again 6 Sep 2026 when the owner asked for the
counsellors on `/about`, rendered from the same roster as `/practitioners`.
Registration numbers are narrower still: on each counsellor's own profile only.
The badge `/about` carried came off the same day — one counsellor's number on
a page about a practice of several.

`lib/policies.ts` still carries the older rule as a hard one — *"the
counsellor's personal name never appears here"* — and that is deliberate for
the policy pages specifically, not an oversight left behind by the change.

**Consequence worth knowing:** the byline on every guide says *"Written by a
Registered Clinical Counsellor"* rather than naming a person. A named author
with credentials is the single largest trust signal available on health content
and this site is choosing not to use it. That is the owner's call. It is
recorded here so that the next person to notice it knows it was a choice.

*Enforced by:* `scripts/expansion-verify.mjs` (the name check), `lib/policies.ts`

### No testimonials, no outcome claims, nothing predictive
BCACC advertising standards. It is why there is no reviews section on any page
a client reads, and why guide copy describes what an approach involves rather
than what it will achieve.

*Enforced by:* `scripts/quality-audit.mjs`, and in review of every new page

### No telephone number is published
Every `tel:` link on this site is a crisis line. A published number creates an
expectation of being answered, and a solo practice that misses calls is worse
off than one that never invited them. The reversal — a person asking for a call
at a time they nominate — is a form field, not a number.

*Enforced by:* `lib/inbound.ts` (the `phone` field and the long note on it)

---

## Where the practice operates

### Alberta is gated on insurance, and unlocked per practitioner
Counselling therapy is unregulated in Alberta, so the CCC applies there and the
RCC does not. The gate is professional liability insurance, not regulation.
Camille's cover reaches Alberta; the founder's does not, so `/alberta` stays
closed site-wide while Camille's own Alberta pages are live.

*Enforced by:* `lib/regions.ts` (`ALBERTA_LIVE`), `lib/practitioner-places.ts`,
`middleware.ts`

### A gated province URL serves the real 404, not a blank page
`notFound()` thrown from a matched route renders the framework's error shell —
no language attribute, no landmarks, no text. Four URL patterns were serving a
white page. The gate is in middleware, which runs before routing, and three
other fixes were tried first; they are recorded in `middleware.ts` so nobody
repeats them.

*Enforced by:* `middleware.ts`, `scripts/a11y-audit.mjs`

---

## What is on the menu

### Five services. Anxiety, trauma and depression are conditions, not services
Consolidated 31 Aug 2026. Nobody searches for four of the five services by
name; they search for what is wrong. A condition has a page and routes to the
service that treats it, and does not appear on `/services`, in the nav, or in
the footer.

*Enforced by:* `lib/conditions.ts`, `test/city-topics.test.mts`

### A counsellor is never offered in a language she does not speak
Fourteen pages once promised Punjabi from a counsellor who does not speak it,
inside FAQ schema. No gate could catch it — the pages were unique, well linked
and correctly marked up. Language claims are resolved per practitioner and the
resolver is under test.

*Enforced by:* `lib/practitioner-places.ts`, `test/practitioner-language.test.mts`

### Punjabi and Tagalog documents declare their own language, set after the build
Every page renders in one root layout, and Next 14 sets `<html lang>` there
only. The framework's answer — a root layout per language in route groups —
was built and tested on 6 Sep 2026 and reverted the same hour: with more than
one root layout, Next 14 renders every `notFound()` (unknown URLs, the gated
`/alberta` and `/ontario` shells) through its bare error shell, with no lang,
no fonts and no metadata. That regresses every 404 to fix 34 pages. Next 15
fixes it and is a separate decision.

So `scripts/html-lang.mjs` runs after `next build` and sets `lang="pa"` or
`lang="tl"` on exactly the prerendered documents whose content is in that
language, by route, patching the embedded React payload to match. `npm run
lang` checks the build and fails it if any of those files carries the wrong
language. The English chrome (header, footer, booking bar) is marked
`lang="en-CA"` on every page so a screen reader on a Tagalog document reads
the navigation as English. The `/punjabi-counselling` and
`/tagalog-counselling` pages are English pages *about* a language service and
stay `en-CA`.

*Enforced by:* `scripts/html-lang.mjs` (`--check` in `verify:ci`), `package.json` (`build`)

### A translation is paired with hreflang both ways; a page *about* a language is not
Decided 6 Sep 2026, from the SEO audit. Where the same content exists in two
languages — the Tagalog guides and the English guides they were written from,
Camille's city pages and their `/tl` twins, the language hubs and their English
counterparts — both pages declare `alternates.languages` naming each other, with
English as `x-default`. The Punjabi region pages and the Tagalog city pages are
English pages about a language service, not translations; pairing them would
tell search engines two different pages are the same one. They are cross-linked
from the English city page instead, which is what they lacked.

*Enforced by:* `app/tagalog/gabay/[slug]/page.tsx`, `app/guides/[slug]/page.tsx`,
`app/online-counselling/[city]/page.tsx`

### The Tagalog pages are published but unreviewed
Twenty-five pages, live on the owner's explicit instruction, not read by a
Tagalog speaker. This is a known, accepted state and not a thing to quietly fix
by writing more of it. Its diagrams are translated in full — an English diagram
on a Tagalog page defeats the point of the page.

*Enforced by:* nothing, which is the point. It needs a person.

---

## What is kept, and for how long

### Website form submissions are deleted after 24 months
The bound used to be a count — a thousand records, which at this volume is
several years, so the age of the oldest record depended on how busy the
intervening period happened to be. PIPA requires a year's minimum for
information used to make a decision; two years leaves room for someone who
enquired, waited and came back.

Stated publicly on `/privacy`, which is what makes it binding rather than a
preference.

*Enforced by:* `lib/inbound.ts` (`prune`), `test/inbound-retention.test.mts`

### Erasure is a request to a person, never a button
A self-service delete has to confirm whether an address is in the system before
removing it, and on a counselling website confirming that somebody wrote in is
itself a disclosure — available to anyone who can guess an address. The same
reasoning already governs the portal's one-time codes, which answer identically
whether or not the address belongs to a client.

*Enforced by:* `lib/inbound.ts`, `app/admin`, `lib/policies.ts`

### No IP address is stored anywhere
`lib/triage.ts` scores submissions on synchronous signals and deliberately does
not look at addresses or geography. The one exception is the rate limiter,
which hashes with a salt that rotates at midnight UTC and keeps sixteen
characters — not reversible, and not usable to recognise a visitor tomorrow.

*Enforced by:* `lib/rate-limit.ts`, `test/rate-limit.test.mts`

### Nothing loads from another company
No advertising pixel, no third-party fonts, no external scripts, no cookies
until sign-in. Stated on `/privacy` in specifics rather than as a sentiment.

*Enforced by:* `scripts/offsite-probe.mjs`, and the absence of a consent banner

---

## How the site behaves when things go wrong

### The rate limiter suppresses email; it does not refuse a person
Somebody who submits six times in ten minutes is usually distressed and unsure
it worked. Their message is still stored and they still get the same
confirmation — only the outbound mail stops. What is being capped is mail
reputation and quota, and suppressing the send caps both without turning anyone
away. Only past forty in an hour is anything discarded.

*Enforced by:* `lib/rate-limit.ts`, `lib/inbound-submit.ts`

### Every error page carries the crisis numbers before anything else
A blank page can land in front of somebody who opened the site at two in the
morning looking for a number. 9-8-8 and 9-1-1 come before the retry and before
the links, in plain text and plain `tel:` links, so they survive a failed
stylesheet.

**Known limit:** on a server-side 500 the HTML body is empty and this arrives
only on hydration. With JavaScript blocked, a 500 is still blank. That is
inherent to App Router error boundaries being client components.

*Enforced by:* `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`

### A monitor that only answers when asked is not a monitor
Cron health was recorded and rendered in `/admin` for months without anything
acting on it — and `/admin` is a page somebody has to decide to open, which on
the day every job stops, nobody does. It emails now, once per job, then at most
daily. Nothing watches the watchdog, and the code says so rather than implying
otherwise.

*Enforced by:* `lib/cron-health.ts`, `test/cron-health.test.mts`

---

## What the site claims about itself

### "Updated" and "Clinically reviewed" are different claims
A reader takes the second to mean a clinician read the page that day and stood
behind it. The component once manufactured the heavier claim from the lighter
one's data. No page currently carries a review date, so every page says
"Updated", which is the honest word for what happened.

`scripts/review-dates-fix.mjs` will never write a `reviewed:` field. No script
is entitled to make that claim for a person.

*Enforced by:* `components/Byline.tsx`, `scripts/review-dates.mjs`

### The accessibility statement says what has and has not been tested
It claimed the site was "tested with keyboard and screen-reader use". No
screen-reader pass has been done. It now says so, and separates what is checked
automatically on every deploy from what needs a person. Of every page here,
that is the worst one to be inaccurate on.

*Enforced by:* `lib/policies.ts`, `scripts/a11y-audit.mjs`

---

## How this repository is checked

### Gates block a deploy; slower checks run weekly
`verify:ci` is everything deterministic and fast, ending in smoke, which boots
the built site and asks it for real URLs. `verify:weekly` holds the checks that
depend on somebody else's server — link liveness, off-site presence, the
dependency audit — because a build should not fail on another company's rate
limit.

*Enforced by:* `package.json`

### `price-drift` distinguishes "could not check" from "found drift"
Exit 2 means no API key; exit 1 means a fee on the site disagrees with Cliniko.
Flattening them would destroy a distinction that exists for good reason, so
`scripts/soft-gate.mjs` preserves it inside an `&&` chain rather than the check
being changed.

*Enforced by:* `scripts/soft-gate.mjs`

### A check is not trusted until it has been made to fail
Every gate added here has been injection-tested: break the thing on purpose,
confirm the check goes red, put it back. A green check that has never been red
is an assumption with a tick beside it. This is the single most load-bearing
habit in the repository and the source of most of what has been found.

---

## How people reach the practice

### Two ways in, and no waitlist
A message, or a consultation. The waitlist form that sat under the booking
calendar was removed on 6 Sep 2026 because it was being read as an alternative
to booking rather than a fallback — people joined the list instead of picking
a slot, and five had done so in the previous month. The form, its API route,
the one-time check-in cron, the reply template that offered a list and the
`waitlist` kind itself are all gone. The handful of records already in the
store are read back as enquiries with the availability they gave folded into
the message, so nothing downstream knows the kind existed.

*Enforced by:* `components/InboundForm.tsx`, `lib/inbound-submit.ts`,
`vercel.json`

### A message says what the person is looking for, in at least two sentences
Decided 6 Sep 2026. One-word enquiries cost a counsellor a reply that asks the
question the form should have asked. The rule is applied in the browser and
again on the server, from one shared definition, and it is deliberately loose
about punctuation — a floor against mis-clicks, not a grammar check.

*Enforced by:* `lib/sentences.ts`, `test/sentences.test.mts`

### Consultations go to whoever is taking new clients
The founder is not taking new clients as of 6 Sep 2026. Every consultation
request and every Book button on the site resolves to the first practitioner on
the roster who is (`acceptingNewClients`), her profile says so plainly, and a
`/book?with=` that names someone who is not accepting says so in one line
rather than swapping the name silently. Her Cliniko calendar is no longer
offered to the public; existing clients reach it through the portal, which does
not read this flag. Flip the flag to reverse it. /book embeds the accepting
counsellor's own calendar — `bookingsUrlFor()` adds Cliniko's `practitioner_id`
so the page opens on her times and never shows a list of counsellors.

*Enforced by:* `lib/practitioners.ts`, `app/book/page.tsx`,
`app/practitioners/[slug]/page.tsx`, `components/StickyBook.tsx`

### Reading the site cheaply, and in the right language

Decided 24 September 2026, a second pass over the machine-readable layer added
the same day.

**The Markdown twins became cheap to re-read.** Every one now carries a strong
ETag and a Last-Modified, and a conditional request gets a 304 with no body. A
crawler revisiting all 295 files spends a few hundred bytes instead of three
megabytes.

That work uncovered a real defect. The route was an ISR route, and Next owns
the response headers on one of those: the `cache-control` the code set was
replaced in production by a bare `Cache-Control: public` — no max-age, no
validator, nothing for a CDN or a crawler to act on. Measured with curl, not
assumed. The route now renders per request and states its own caching, while
the upstream page fetch keeps the day-long data cache that made it cheap.

**The twins say what language they are in.** 48 of the 295 pages are Punjabi
or Tagalog documents. The front matter now carries `lang`, taken from the
built page, and a `translations` list built from the page's own hreflang
pairs — so the Punjabi twin of a guide names the English one, and the English
one names the Punjabi.

**And the pages say it too.** hreflang tells a search engine which version to
show which searcher. It does not say the two documents are the same work, and
a retrieval system reading the Punjabi guide alone had no way to know the
English one existed. `translationOfWork` is that statement, on all 48.

**Two new addresses.** `/sitemap.txt` is every URL one per line — the 295
pages, then the 295 Markdown twins, so the whole machine-readable corpus can
be enumerated in one request and fetched without rendering anything. It is
derived from sitemap.xml rather than rebuilt, because two independently built
lists of the same thing will one day disagree, which has already happened on
this site twice. `/feed.json` is JSON Feed 1.1 beside the RSS, and every item
links its own Markdown copy: feed, twin, content, two requests.

**llms-full.txt now describes itself.** It is 1.15 MB. Many retrieval clients
cap a fetch below that and truncate silently, which means the end of the file
— the glossary, the policies, the Punjabi and Tagalog pages — may never have
been read by anything, and a truncated file looks exactly like a complete one.
It now opens with its own size, a warning, an index of its sections in order,
and the cheaper routes to the same content.

**llms.txt now says what changed.** It listed 295 pages with no dates on any
of them, so a model that had read the site before had no way to tell what was
worth reading again. The twenty most recently reviewed pages are now listed
first, with the dates the pages themselves state.

**Entities, second pass.** `knowsAbout` was ten strings and is now conditions
with references. The provinces are places with references rather than words —
there is more than one British Columbia. Conditions on the city pages are
typed `MedicalCondition`: half of those fifty pages are about anxiety, trauma
or depression, and they had been typed as therapies, publishing "anxiety is a
treatment this practice offers". Each service is now machine-bookable through
a `ReserveAction` and states its audience. The diagrams are `ImageObject`s
carrying what they show, taken from the SVG's own description, which is the
only place a drawing's content exists in words.

**The perf budget earned its keep.** Adding the above failed it: the median
page had grown 3.3%. Looking for what grew found `hasOfferCatalog` listing the
same five services as `availableService` directly above it, with no prices and
no descriptions — 812 bytes of a second, poorer copy on every page — and five
therapies in `knowsAbout` that `availableService` already named with the same
references. Both removed. The median finished at +1.7%, inside budget, with
more information in it than before. No baseline was raised.

*Enforced by:* `npm run ai-crawl`, now 97 checks, and 101 unit tests. The new
checks include the 304, the validators, the language front matter, the twin
count in sitemap.txt, the Markdown attachment on every feed item, and the
condition-versus-therapy typing that was wrong before anyone looked.

### The site, as something a program can read

Decided 24 September 2026, at the owner's instruction, after establishing that
the site already did the obvious things — 33 named AI crawler groups in
robots.txt, llms.txt and llms-full.txt, 41 schema.org types, review dates and
reviewers on 69 pages — and that the gap was elsewhere.

**Every page now has a Markdown twin.** Append `.md` to any URL:
`/pricing.md`, `/guides/stress-leave-bc.md`, `/index.md` for the home page.
The HTML of a guide is 230 KB, of which 37 KB is the article and the rest is
inlined CSS, navigation, footer, three JSON-LD blocks and a React payload.
The Markdown is 12 to 22 KB and is nothing but the content. It is generated
from the page it shadows (`app/api/md`, `lib/html-to-markdown.ts`), never
written twice, so the two cannot drift. Each HTML response announces its own
twin in a `Link` header, robots.txt states the convention, and llms.txt and
`/ai.json` repeat it.

Streamed pages needed handling and prove the point: `/pricing` renders its fee
table inside a Suspense boundary, so the first version of the twin was 711
bytes reading "Loading current fees…". Nothing visible on the site would ever
have shown that.

**`/ai.json`** is the practice as one object: what it is, what it is *not* —
not a crisis service, not a medical practice, not covered by MSP, no premises
— service area, languages, the counsellors taking clients, crisis numbers, and
where every machine-readable address lives. The corrections are a field
because the damaging failure for a counselling practice is an assistant
describing it as something it is not. It carries no registration number and
does not name the counsellor who is not taking clients; both rules hold here
as everywhere else, and the gate checks the numbers specifically.

**robots.txt is written out rather than returned as metadata.** There is no
registered directive for llms.txt or for a Markdown convention, so they can
only be comments, and `MetadataRoute.Robots` has nowhere to put a comment.
The generated rules are unchanged.

**The snippet limits are lifted for every engine, not only Google.** The
`googleBot` block already said `max-snippet:-1`; the general directive said
`index, follow`, which leaves Bing — and therefore Copilot — at its default.
Now stated in the meta tag and in an `X-Robots-Tag` header, so the Markdown,
llms.txt and JSON get it too. The private routes are excluded by name and
given `noindex, nofollow` instead, rather than relying on the more-restrictive
rule winning.

**The structured data names its entities.** `{"@type":"MedicalTherapy",
"name":"EMDR"}` is a type and a string; a `sameAs` to the encyclopaedia
article is the concept. `lib/entities.ts` holds one URL per method and
condition and nothing else — no Wikidata Q-numbers, which are the better
identifier and are exactly the kind of value that gets mistyped once and
copied forever. Wired into the service pages, the approach pages, the
city-service pages and the organisation's `availableService`.

**Three fields the pages had in words and not in data.** `abstract` (the
guide's own answer, so an engine summarising the page uses the practice's
summary rather than whichever paragraph it retrieved), `citation` (the primary
sources already listed at the foot of every guide), and `speakable` on the
ordinary page type — it had been on the clinical pages only, so /pricing,
/about and /book named no part of themselves as the answer. /pricing also
gained a page-level entity, which it had never had: it emitted a FAQPage and
nothing describing the page.

*Enforced by:* `npm run ai-crawl` (64 checks, in `verify:ci`), and 19 unit
tests in `test/html-to-markdown.test.mts`. Everything in this entry is
invisible on the site and visible to a request, which is why every part of it
is checked by request against a booted build. `npm run ai-crawl -- --links`
additionally requests all 19 encyclopaedia URLs; it is opt-in because a gate
that fails on someone else's rate limit is a gate people learn to ignore.

### The phone action bar is solid, and starts where the header CTA stops
Decided 23 Sep 2026, after the owner reported he could not see the bar on his
phone and pointed at the one on the EverStone site as the model.

- The bar was cream, translucent, on a cream page, behind a phone browser's
  own bottom chrome. It was there in the markup and measurable in the DOM and
  still invisible to the person it was built for. It is now solid
  `--surface-ink`, the footer's own ground, with a white Email button, a blue
  Book button and a square Call button — one row, the shape EverStone's navy
  bar has carried since August.
- It appeared below 680px only. The header's Book button moves into the
  drawer at 1020px. Between those widths — a phone held sideways, a small
  tablet, a narrow desktop window — the site showed no persistent call to
  action at all. The bar now appears from 1020px down, exactly where the
  header CTA stops.
- It renders on /book and /contact too, which it used to skip. On /book the
  Book button is dropped and Call takes its room, because the reader is
  already on the page it points at.
- The footer's clearance for it lives in `app/premium.css`, not
  `app/globals.css`: premium.css loads second and sets `.site-footer`'s
  padding unconditionally, so a media query in globals loses to it at every
  width. The old 124px rule in globals had never applied.

*Enforced by:* `npm run a11y`, `npm run contrast`, `npm run cta`

### One page per query cluster, again: RCC, and "online counselling BC"
Decided 17 Sep 2026, from Search Console and from reading the pages that
actually hold the top ten for the Vancouver form of the query.

- `/resources/what-is-a-registered-clinical-counsellor` is merged into
  `/resources/verify-a-counsellor-in-bc` and redirects there. Together they
  were the site's largest page-three cluster (about 900 impressions a
  quarter for "registered clinical counsellor" and variants) and they said
  the same things.
- `/online-counselling` was titled "Areas Served" while 260 impressions a
  quarter asked for online or virtual counselling in BC. It is now the
  province-wide landing page: titled for the query, with the three-step
  "how it works" every page in the top ten carries, and ICBC named.
- City page titles say "Online & Virtual Counselling in <city>, BC":
  "virtual" carries almost as many impressions as "online" for Vancouver
  and every competing page says both.

*Enforced by:* `scripts/redirect-shadow.mjs`, the SEO gate's title limits

### The monitors stop emailing, and the stores they read stop freezing
Decided 17 Sep 2026, owner's instruction ("getting too many emails; don't send
these types of emails"), after finding that every alert they had ever sent was
false.

**The fault.** Vercel Blob returned a *weak* ETag (`W/"..."`) for two files.
If-Match uses strong comparison, so a weak validator can never match, so every
conditional write was refused and the retry loop gave up silently. Two stores
froze:

- `inbound/messages.json`, 6 Sep. Eleven days of website enquiries were never
  recorded. They reached the practice only because the alert mail is sent
  whatever storage reports, so the messages are in info@ and not in /admin.
- `ops/cron-health.json`, 14 Sep. Every scheduled job kept running and none
  could record it. The watchdog read four-day-old lines and emailed "3
  scheduled jobs are not running" each morning. They were running the whole
  time.

**What changed.**
- `lib/blob-etag.ts`: a conditional write may only carry a strong validator;
  a weak one means write unconditionally. Losing a race for one cycle beats
  never writing again, and never writing again is the failure that hides.
- Cron health is one blob per job (`ops/cron/<job>.json`), written
  unconditionally. The contention that needed compare-and-swap is gone by
  construction rather than managed.
- `storeFrozen()` says "the store is not being written" instead of listing
  eight jobs as stopped. The watchdog makes the same distinction from inside a
  run that has just recorded itself.
- The cron watchdog and the reply-time watch no longer send mail. Both render
  in /admin, which is where the verdict already was. Stated plainly: if every
  job stops, nothing will come and tell you.
- The reply-time watch counted this project's own probes and newsletter bots as
  people waiting: 33 "unanswered messages", of which the human count was three.
  The filter that the admin digest already had is now shared
  (`lib/inbound-quality.ts`) and used by both, and /admin has one button to
  remove the eight self-test rows the build left behind.

*Enforced by:* `test/blob-etag.test.mts` (no `ifMatch` without `strongEtag`),
`test/inbound-quality.test.mts` (pinned to the addresses in that alert),
`test/cron-health.test.mts`

### /answers is back as the instant-answer page; hours come from Cliniko; teens and young adults are served
Decided 14 Sep 2026, owner's instruction.
- `/answers` (retired 31 Aug as "a second FAQ") returns as one searchable
  page holding every question the site answers anywhere, assembled by
  `lib/answers.ts` from the FAQ, guides, resources, comparisons, services,
  audience pages and the counsellors' own words. Nothing new is written
  there; the build fails under a hundred answers.
- Hours are still not typed anywhere. `/book` and `/contact` print what
  Cliniko will actually offer in the next seven days, per counsellor
  (`lib/cliniko-availability.ts`, cached thirty minutes). When it cannot be
  read, nothing is printed. "Schedules are based on counsellors'
  availability" is now literally what the page shows.
- Teens and young adults are served. Said on the services page and the
  individual-therapy page, with the Infants Act consent point, and a page
  written for them at `/for/teens-and-young-adults`.
- Each counsellor's Psychology Today profile is linked from her profile and
  emitted as `sameAs`. Savneet's two Edmonton profiles read "Registered
  Provisional Psychologist"; she is asked to confirm and retire one.

*Enforced by:* build-time count in `app/answers/page.tsx`, `scripts/smoke.mjs`

### Enquiries go to the counsellor they are for, info@ in copy
Decided 11 Sep 2026. Forty-one messages had reached info@ and sat there.
Each counsellor taking new clients has an `alertEmail` on the roster;
`lib/inbound-routing.ts` sends the alert to the counsellor an enquiry names,
else the one whose language the page or the message is in, else everyone
accepting — info@ always in copy so the practice keeps one record. The
founder, on leave, is never a recipient. A one-off admin button sends every
enquiry to date as a single thread to the same addresses. The acknowledgement
to the person and the one-business-day promise are unchanged; the promise is
now somebody's, by name.

*Enforced by:* `test/inbound-routing.test.mts`

### Camille sees clients anywhere in Canada; the boundary sentence says so
Decided 8 Sep 2026, owner's instruction. Her CCC is a national certification
and her liability policy is a national one, so `reach: 'canada'` on her
roster record governs the location sentence on /book, /about, the cost
tool, the first-consultation resource and llms.txt. `provinces` still lists
only the places she has city pages for. The other counsellors remain BC.
Noted for the owner at the time and not acted on: Ontario, Quebec, Nova
Scotia, New Brunswick and PEI regulate the psychotherapy / counselling-
therapy titles, and a CCC alone does not register her there.

*Enforced by:* `lib/practitioners.ts` (`reach`)

### The founder stays off every online calendar; her clients book by reply
Decided 8 Sep 2026. She is hidden from Cliniko online bookings, `bookable`
is false on the roster to match, and no calendar of hers is embedded on
/book or the client portal. Her existing clients book by reply (the portal
says so in one line without naming her). She is not taking new clients and
the reason is not published. Reverse by unhiding her in Cliniko and
flipping `bookable` in the same change.

*Enforced by:* `lib/practitioners.ts`, `scripts/booking-mapping.mjs`

### Insurance is data on the roster, and /book offers everyone who is accepting
Decided 8 Sep 2026. Savneet's BCACC card (#27067, to 31 Dec 2026) and her
liability certificate arrived; Camille's certificate had been described only
in a source comment. Both policies now sit in an `insurance` field on the
roster with their dates, and `npm run expiry` counts and watches them the
way it watches registrations, naming any practitioner with no policy
recorded. **Camille's policy ends 1 Oct 2026** — the watch found that on its
first run, 23 days out.

With two counsellors taking new clients, /book shows both as cards and,
when nobody has been chosen, embeds Cliniko's own consultation page for the
practice business, which lists everyone who offers the type. Nobody is the
default; `?with=` (from a profile or a card) narrows to one calendar. The
roster order now only decides where an enquiry for a closed counsellor is
pointed. Alberta is not opened for Savneet although her
cover would allow it: the Alberta place copy answers the registration
question with a CCPA certification she does not hold, and a page must be
true before it is built (SAVNEET_ONBOARDING.md §4).

*Enforced by:* `scripts/credential-expiry.mjs`, `scripts/smoke.mjs`

### A third counsellor is added the way the second was, and Punjabi gets what Tagalog got
Decided 7 Sep 2026. Savneet Singh (English, Punjabi; BC) joins the roster
with the same surfaces Camille Granda has: a profile, a city page for every
place she can serve, a twin of each in her second language, the profile in
that language, guides written in it, and her name on the language hubs.
The Punjabi machinery mirrors the Tagalog machinery file for file
(`lib/practitioner-pa.ts`, `lib/practitioner-places-pa.ts`,
`lib/punjabi-guides.ts`, `app/practitioners/[slug]/[place]/pa/`,
`app/punjabi/guides/`) and is keyed by practitioner slug and gated on
`placePages`, so the founder — who also works in Punjabi and has one page by
instruction — is never given a twin.

Two things were NOT done, on purpose. Her credentials are not on file, so
her pages carry no letters, no registration line and the title Counsellor;
`withLetters()` exists so a blank post-nominal renders a name rather than a
trailing comma. And she has no Alberta pages, because no insurance
certificate has been supplied. Both are one edit when the document arrives
(SAVNEET_ONBOARDING.md).

`scripts/roster-compare.mjs` scores any two counsellors' pages on one rubric
from the built HTML, so "the same amount of pages and marketing" is a
number rather than an impression.

*Enforced by:* `test/practitioner-language.test.mts`, `scripts/smoke.mjs`, `scripts/html-lang.mjs`, the name guard

### The stylesheet is inlined into every prerendered document
Decided 6 Sep 2026. Lighthouse put 740 ms of a 2.9 s mobile LCP on three
render-blocking stylesheet links, and Next 14's App Router has no
critical-CSS step (critters was tried on 28 Aug and changed nothing).
`scripts/inline-css.mjs` runs after `next build`: it copies the page's CSS
into one `<style data-inlined>` block and turns each stylesheet link into a
deferred load (`media="print" onload="this.media='all'"`), so the file is
still fetched — React's hydration and the client router find the resource
they expect — but nothing waits for it before first paint.

The trade is explicit: every document grows by the CSS (~96 KB raw, ~14 KB
gzipped) and a repeat visitor pays it per page instead of once from cache.
For an audience that arrives from search, one page at a time, first paint
wins. The perf-budget baseline for the two HTML rows was raised the same
day for this reason and no other; the JS and CSS rows were not touched.
`INLINE_CSS=0` builds without it. If the site's traffic ever becomes
mostly repeat visits, reverse this.

*Enforced by:* `scripts/inline-css.mjs --check` (`npm run inline`, in `verify:ci`), `data/perf-budget.json`

### The private routes carry their own stylesheet
Decided 25 Sep 2026, from the perf budget. Because the stylesheet is inlined
into every document, every rule in `premium.css` is paid for on every page —
including the 66 rules for the staff inbox, the client portal, sign-in and
the password reset pages, which no visitor from a search can reach. They
were about 6 KB of every one of the 295 public documents. They now live in
`app/private.css`, imported by the five private pages and nothing else. The
median public page fell 1.9% below its baseline and the home page's CSS 8.7%.
A rule whose selector starts `.admin-`, `.portal-` or `.signin-` belongs in
that file; a public component must not use one of those classes.

*Enforced by:* `data/perf-budget.json` (the ratchet catches it coming back)

### A city page names its service, its counsellors and its sources, and takes a message
Decided 25 Sep 2026, from the competitor audit. The city pages carried an
entity for the page and for its questions, and none for the thing a local
search is for: the service, in that city, from named people. Each now emits
a `Service` node placed in its city, a `Person` node per counsellor with a
page for the city (name, role, page, languages — no registration number, by
the standing decision), and its page node is typed `MedicalWebPage` with the
health-authority and HealthLink citations the prose already makes. No
`reviewedBy` and no `lastReviewed`, because nobody signs one. The enquiry
form the guides carry is at the foot of every city page, same route, same
two-sentence rule. The organisation node also carries a `priceRange` derived
from the fallback fee catalogue, which `price-drift` checks against Cliniko.

*Enforced by:* `app/online-counselling/[city]/page.tsx`, `app/layout.tsx`, `scripts/price-drift.mjs`

### The pages Google shows link to the pages that earn a client
Decided 25 Sep 2026, from the Search Console export of 17 September. In the
period the site was shown 12,076 times and clicked 196; 107 of those were the
home page on brand searches. The pages shown most were the guides and
resources (the workplace page 1,674 times, the RCC explainer 1,613). The
pages that earn a consultation — the city pages — sat at positions 44 to 85
and each had about 28 inbound links, nearly all from one another.

The August snippet rewrites were measured by `scripts/ctr-delta.mjs` and
moved click-through by nothing, so copy is not the lever; position is, and
internal links are the part of position this codebase controls. Every guide,
resource, comparison, audience and approach page now ends with a link to each
of the ten city pages, anchored on the query people type
(`components/CityLinks.tsx`). The RCC badge on every service page and the
trust bar link to the RCC explainer with the term as the anchor, because
"registered clinical counsellor" is the site's most-shown query and the page
that answers it had 24 inbound links. The footer link to that page went
through a redirect on all 295 pages and now does not.

A Gottman approach page was drafted and withdrawn the same hour:
`/guides/how-the-gottman-method-works` already ranks for the method, and a
third page on it would split what the first two have.

*Enforced by:* `components/CityLinks.tsx`, `scripts/ctr-delta.mjs` (the next
export says whether any of this moved anything)

### Visits from AI assistants are counted
Decided 25 Sep 2026. The machine-readable layer exists to be cited by
assistants, and nothing recorded whether anyone arrived that way. The
browser now classifies the referrer host — ChatGPT, Gemini, Claude,
Perplexity, Copilot — and sends a yes/no against the landing page, counted
like every other conversion event. No URL, no query, no identifier leaves
the browser. Most assistant hand-offs carry no referrer at all, so the
number on /admin is a floor, never the total.

*Enforced by:* `components/Analytics.tsx`, `lib/conversion-log.ts`

### The organisation node names the locality it is registered in
Decided 25 Sep 2026. The node carried no address, on the reasoning that a
virtual practice has no office. The Google Business Profile is pinned in
White Rock, and a record with no locality gives an engine nothing to match
that pin against; the LocalBusiness validators also treat a missing address
as an error, which kept the node out of the local result types. It now
carries locality, province and country and nothing more: no street, because
there is no office to walk into, and the disambiguating description still
says so. `docs/LISTINGS_PACK.md` holds the same facts for every directory,
so a listing is a paste and cannot drift from what the site asserts.

*Enforced by:* `app/layout.tsx`, `docs/LISTINGS_PACK.md`

### An enquiry answers three questions and says about twenty words
Decided 25 Sep 2026 by the owner. The form's rule was two sentences, and a
thirteen-word template ("I would like more information. Please contact me
by email") met it, pasted into every text field including "best time to
call". Every enquiry now chooses what it is for, where the person will be
for sessions and how soon they hope to start — three selects, one tap each,
which a script pasting one string into every field cannot answer — and the
message has to reach about twenty words. A message identical to another
field is refused outright. This reverses the older "no dropdown of concerns"
rule at the top of `components/InboundForm.tsx`, and the reversal is the
owner's. The optional phone field stays optional.

*Enforced by:* `lib/enquiry-fields.ts`, `lib/sentences.ts` (`hasEnoughDetail`),
`lib/inbound-submit.ts`, `test/sentences.test.mts`

### The home page heading carries the head term
Decided 25 Sep 2026. The strongest page on the site had a heading with no
search term in it, and its 306 monthly impressions were all the practice's
own name. The heading is now "Online counselling in BC that meets you where
you are": the first half is what people type, the second half is the
tagline, which also stays as the organisation's slogan.

### Four more groups have a page: men, first responders, newcomers, the trades
Decided 25 Sep 2026. Sixteen audience pages and none for the four groups a BC
counselling practice hears from most, each a query space where the competitor
audit found single-practitioner sites ranking on one page. Same shape and
same rules as the other sixteen. `docs/OUTREACH.md` holds the drafts for the
off-site work that moves position from here: family doctors, HR, universities
and settlement agencies, local press, and three video scripts.

*Enforced by:* `lib/audiences-more6.ts`, `app/page.tsx`, `docs/OUTREACH.md`

### Tagalog is carried as far as Punjabi
Decided 26 Sep 2026 by the owner. The Punjabi vertical had a service page,
a words page, a comparison and two audience pages; the Tagalog vertical had
a hub, city pages and guides, and none of those four. Each now has a Tagalog
twin: `/services/tagalog-counselling`,
`/resources/counselling-in-tagalog-what-the-words-mean`,
`/compare/therapy-in-tagalog-vs-english`, and audience pages for Filipino
healthcare workers and caregivers and for Filipino-Canadian families. All
are English pages about a Tagalog service, the kind `lib/tagalog.ts` says
publish without a native reader; the Tagalog in them is single words the
site's Tagalog guides already use. The feeds carry the Tagalog and Punjabi
guides, and the home page names Tagalog beside Punjabi. Six services, not
five: the "five services" line above records the count at the time, and the
sixth is a language, not a condition.

*Enforced by:* `lib/services.ts`, `lib/resources-tagalog-words.ts`,
`lib/comparisons-more2.ts`, `lib/audiences-tagalog.ts`, `app/feed.xml/route.ts`

### A city page names the communities around it
Decided 26 Sep 2026. Search Console shows "emdr therapy guildford", "emdr
specialist peachland", "counselling tri-cities" and "online therapy
okanagan": places inside or beside a city that has a page, typed by people
the page never named. A virtual practice serves them on identical terms, so
naming them is a fact rather than a doorway page. Each location lists its
communities once; the city page renders one sentence and one answer from
the list, so the prose and the schema cannot disagree. The city titles now
say "Counsellors, Therapy" because the city queries name the person more
often than the service.

### The measurement loop can run itself
Decided 26 Sep 2026. `scripts/gsc-pull.mjs` writes the Search Console
export in the shape the CTR tool reads, from a service account, once the
owner adds that account as a user on the property. Visits from the Google
Business Profile carry `?utm_source=gbp` and are counted like every other
conversion event, because those clicks never appear in Search Console.

*Enforced by:* `lib/locations.ts` (`communities`), `app/online-counselling/[city]/page.tsx`,
`scripts/gsc-pull.mjs`, `components/Analytics.tsx`

### A service page's heading names the service
Decided 27 Sep 2026. The six service pages carried a tagline as their H1
and the service name only in an eyebrow, so the strongest on-page signal
after the title said nothing about what the page sells. The heading is now
"{name}: {tagline}". The tagline is kept because it is the voice of the
site; the name leads it because it is what a person searched for.

*Enforced by:* `app/services/[slug]/page.tsx`

### The practice is told of every online booking and every cancellation
Decided 28 Sep 2026. The booking job emailed the client three times
(confirmation, reminder, follow-up) and the practice never: the owner
learned of a consultation booked and cancelled with another counsellor from
that counsellor, days later. Every two hours the job now sends one notice
per new online booking and one per cancellation, to the practice inbox and
to the counsellor the appointment is with (the roster's `alertEmail`, matched
by Cliniko practitioner id). Subjects carry no name, as the enquiry alerts
do not. Bookings and cancellations older than three days at the moment the
job first sees them are recorded without a message, so the first run after a
deploy does not announce a fortnight of history. Cliniko's own per-user
notification is a separate switch, in Cliniko, and stays the owner's.

*Enforced by:* `lib/booking-notify.ts` (the `alerted` and `cancelAlerted` ledgers)

### The booking calendar is loaded when somebody asks for it, and /book says what the call is before the tap
Decided 1 Oct 2026. Lighthouse mobile on production /book scored 38 (first paint
6.2 s, largest paint 10.3 s, layout shift 0.51, 3.6 MB) while every other page
scored 75-80, and the whole difference was the server-rendered Cliniko iframe:
near enough the top of a phone screen to load on first view, it brought 1.7 MB
from cdn.cliniko.com, 0.8 MB from js.stripe.com and Google Fonts Lato with it,
and Lato arriving inside the frame was the shift. Since 18 Aug, 94 people had
reached that calendar and 43 touched it, on a page that took ten seconds to
become usable. The frame now mounts from one primary button, "Show available
times", inside a box already the frame's height that holds the counsellor's
portrait, the next open times from Cliniko and the first-party direct link as
the second action; the fallback link stays in the HTML for a browser with no
JavaScript. The client portal keeps the immediate frame: a signed-in client who
opened it to book has already asked. `scheduler_visible` on /book therefore
changes meaning on this date, from "scrolled past the calendar" to "opened it
and saw half of it"; counts before and after are not comparable, and no new
event was added because one outside the conversion log's COUNTED list is
dropped on arrival. What the thirty minutes are — who you talk to, what is
asked, that nothing is charged and no card is taken — moved from a closed
disclosure below the calendar to three visible lines under the facts, where the
decision to tap is made; the disclosure keeps the long version. The page no
longer waits on Cliniko before sending its own markup: the three lines that need
the answer stream in behind the shell, each in a slot already its height so the
page never jumps whether the line lands or Cliniko is down and nothing does, and
the availability fetch times out at eight seconds so a stalled Cliniko cannot
hold the stream open. Measured against a local production build the change
removed every third-party byte before the tap (3.55 MB to 0.83 MB, 70 requests
to 35) at CLS 0.002; production's 38 could not be reproduced locally because
there the page happened to paint before the frame started, and the point of the
change is that this race no longer exists on any host.

*Enforced by:* `components/SchedulerGate.tsx` (frame only after the button), `scripts/cta-audit.mjs --live` (/book still carries both asks), `app/premium.css` reserved slots (`.book-hours`, `.book-card-avail`, `.scheduler-wait__next`)

### A conversion event carries one detail, from a list the site already owns
Decided 1 Oct 2026. Six weeks of first-party counts could say that 34
booking clicks and 105 calendar views happened and could not say which of
the two counsellors any of them were for or which button produced them:
the beacon sent the event and the pathname, and `?with=`, `location` and
`who` went to gtag, which is not loaded. The sticky bar — the one Book link
on every page below 1020px — fired nothing at all, and the two form events
were beacons fired as a native POST navigated away, recording 3 of 40
enquiries and none of 68 leads. An event may now carry one `detail`,
accepted only from a list built from the roster, the fixed CTA locations
and the tools' own outcomes, and dropped otherwise while the event is still
counted — no free text, nothing a person typed, and a bound somebody can
read (52 book_click keys once the five hero buttons below were added, 3
slugs, 3 magnets, 27 tool keys). It is a second map beside the first, event
→ detail → count next to event → path → count, so every existing reader of
the file reads it unchanged and the difference between the two is
"unattributed", shown rather than hidden. A booking click's key holds the
button and, when the link named one, the counsellor
("sticky/camille-granda"), so one click stays one count and both cuts sum.
The sticky bar is counted. The server counts the two form events when it
stores the record, after the honeypot verdict and before the throttle, and
the browser no longer sends them, so the conversion log and the inbound
store agree and nothing counts twice. `tool_complete` is counted with the
outcome the tool led with; the two reflection tools reach no verdict and are
counted by name only, because the counter must not invent one. The log
still keeps no day buckets, so the monthly email labels the booking-click
cut as cumulative since the counter began and leaves month-on-month to the
previous email.

*Enforced by:* `lib/conversion-detail.ts`, `lib/conversion-log.ts`,
`lib/inbound-submit.ts`, `test/conversion-log.test.mts`

### The hero button names the page, is counted, and books with the counsellor who speaks the language
Decided 1 Oct 2026. Every city, service and audience page opened with the
same four words, "Book a free consultation", as a plain link that no
`book_click` event ever saw. The closing band was counted; the button at the
point of deciding was not. Each of those buttons now goes through `BookLink`
under its own location (`hero-city`, `hero-service`, `hero-audience`,
`aside-service`, `mid-audience`) and names the page the heading just named:
in Kelowna, for EMDR therapy, for teachers. The audience record carries the
words after "Book a free consultation" as a required field, so a new page
cannot ship with a button that does not name it.

A page written for Punjabi or Tagalog speakers used to send its reader to the
practice-wide calendar, which lists a counsellor who does not work in that
language. The service and audience records now carry a language tag where the
page is for one language, and `lib/booking-cta.ts` resolves it against the
roster: the first counsellor who is accepting, bookable and speaks it. The
button says "with a Punjabi-speaking counsellor", never a name, and opens
`/book?with=` that person; the closing band books with the same one. The
founder speaks Punjabi and is excluded by the same rule as everybody else,
not by name. If nobody accepting speaks the language the button falls back
to the plain label and the practice calendar rather than promising a
consultation no calendar can deliver, and a test holds that every tagged
page resolves today.

Under the button on the city and audience templates sits one line about who
pays, in `/pricing`'s own words: most BC extended health plans reimburse an
RCC, MSP does not, receipts are issued, fees are published. "Most", and no
insurer named, because coverage is a property of the employer's plan. It is
one component so there is one copy to keep in step with `/pricing`. The
uniqueness gate measures only the two-segment city x service pages, by its
own rule, so a shared line on the hubs is outside it.

*Enforced by:* `lib/booking-cta.ts`, `components/CoverageLine.tsx`,
`test/booking-cta.test.mts`, `lib/conversion-detail.ts` (`BOOK_LOCATIONS`)

### One page per query cluster, a third time: stress leave, and the Gottman query that can book
Decided 1 Oct 2026. The 6 and 17 Sep retitles followed Search Console
faithfully and produced the opposite of what they were for: "Stress Leave
in BC" was put at the front of the doctor's-note guide, the return-to-work
guide and the WorkSafeBC resource because those pages drew the phrase,
and by the 26 Sep export the seven "stress leave bc" queries (374
impressions, positions 14-22, no clicks) were landing mostly on those
three (246 impressions between them) rather than on `/guides/stress-leave-bc`
(91 at 10.49), the page written to answer them and to offer the
consultation. A query family gets one page. The siblings now lead their
titles with their own job and name the head term second; each links the
hub from its first paragraph with the anchor "how stress leave works in
BC"; and the hub's headings are the queries themselves with the answer in
the first paragraph beneath, because the content was there and the
headings were written for a reader rather than a crawler. The same rule
sent "gottman method counsellor british columbia" (23 impressions, 26.65,
matching `/services/couples-therapy` and the EFT comparison, not the guide
at 8.43) to a section on the service page headed "Gottman-informed couples
counselling in BC", linked from both pages with that heading as the
anchor; "Gottman-informed" rather than "trained" because no training level
is on the roster for the counsellor taking couples bookings. The before
numbers are recorded beside each field so the next export reads against
them. The limits still bind: no HowTo schema was added, because the guide
model has no field for it and Google no longer shows the result.

*Enforced by:* comments beside each retitled field, `scripts/seo-audit.mjs` (lengths, duplicate titles), the next `data/gsc/` export read against the figures above

### The pages that rank link the pages that earn a client, one level down
Decided 1 Oct 2026, from an internal-link count over the 28 September build
(in-body links only, distinct linking pages). The 25 September block sent
every guide, resource and comparison to the ten city hubs, and it worked for
them: 118 to 127 inbound each. It stopped there. All fifty city × service
pages — the ones that match "anxiety counselling surrey" and carry their own
booking links — had zero inbound links from any informational page; their
only linkers were the hub above them and their siblings. Twelve of the
twenty-two audience pages were linked from /answers and nothing else, and
/answers links to everything, so that is no support at all. The five city
pages outside `cityContexts` (Richmond, Coquitlam, Delta, White Rock,
Nanaimo) had ten to twelve inbound and none informational.

`lib/spokes.ts` now names, per guide, comparison or resource, the one paired
service it leads to and the audience pages written for its readers, and
`components/ServiceCityLinks.tsx` renders the block only where a spoke
exists: ten links, "Anxiety counselling in Vancouver" and its nine siblings,
plus one sentence to the audience pages by their own titles. The map is
curated rather than keyword-matched, because a matcher would send intrusive
thoughts to anxiety and grief to depression, and one service per page keeps
it at ten links — a pointer, not a footer. `CityLinks` lists every location
with the ten hubs first, and nothing is written about the five that have no
context; the chip is the city's name and its query. Measured on the rebuilt
site: every city-service page goes from 0 to 3–6 informational linkers,
each of the twelve quiet audience pages from 1 to 4, the five cities to
113–115, median HTML +0.8%, every link resolving.

Two anchor defects fixed the same day. The city hub's own service chips read
"anxiety-counselling in Vancouver" — the slug, because `getService` knows
nothing of conditions and `getCityTopic` does. The /for index and the
services-that-fit cards wrapped the whole card in one anchor, so the text a
crawler read was the title, the lede and "7 min read" run together; the link
now wraps the title and stretches over the card in CSS, so a reader notices
nothing. `test/spokes.test.mts` refuses a spoke to a page that does not
exist, which is how the PTSD guide was found to be a draft. The same
whole-card pattern remains on the guides, resources, compare, approaches,
services and home hubs; those anchors point mostly at informational pages
and were left for a separate change.

*Enforced by:* `test/spokes.test.mts`, `lib/spokes.ts`

### A city-service page names who you would see, what it costs, and books from the top
On 26 Sep 2026 the fifty city × service pages carried a quarter of the site's
impressions at positions 28-83, and 51 of 55 had not moved a hundredth of a
position since the previous export. Thirteen pages ranking for the matrix's own
queries were read on 1 Oct 2026: eight name a counsellor with a credential
line on the page itself, ten put the booking action above the fold, seven
answer cost, coverage and "who would I see" in FAQs. Ours named nobody, said
"$140 for 50 minutes" on couples and EMDR pages where that is not the fee, and
had an untracked booking button fourth in the hero.

Each gap is filled from data rather than prose, in `lib/city-service-page.ts`:
the counsellors who are accepting, insured for BC and offer the appointment
type the topic books into, with portrait, credential names and languages; the
fee read from the Cliniko catalogue the way the service pages read it; three
generated FAQs whose every sentence carries the city, the service or a
counsellor's name, so that no two pages share an answer; a tracked booking
link under the lede that names the service and the city, narrowed with
`?with=` only when exactly one counsellor could be the calendar. Registration
numbers stay on the profile, coverage stays plan-dependent, no hours appear,
and the founder is excluded by `acceptingNewClients`, never by name. The city
hub's chips to these pages, which printed raw slugs for the three condition
topics, resolve through `getCityTopic` now.

*Enforced by:* `test/city-service-page.test.mts`, `scripts/uniqueness-gate.mjs`

### The chrome carries five fields per counsellor, and a byte is only cut where it is measured
Decided 1 Oct 2026, from a Lighthouse pass over the top ten landing pages.
Every page scored 75-80 on mobile with a text LCP three seconds after
first paint, and the first explanation offered — the swapped web fonts
repainting the heading — was tested and found wrong: in eighteen runs the
observed LCP equalled the observed FCP to the millisecond. The gap is the
simulator pricing every byte that starts before the paint, so bytes before
first paint are the lever and `font-display: optional` is not; it stays
`swap`, and the brand faces keep showing on first visits.

Three things were cut. The header menu and the phone action bar, which are
client components, imported `lib/practitioners.ts` for five fields and so
shipped the whole roster — bios, credentials, insurance, photo sets — in
the layout chunk of all 305 pages. They now receive those five fields from
the root layout as props (`lib/roster-nav.ts`), and the roster file stays
on the server. The Google Analytics loader was imported statically by the
consent gate and so travelled with every visitor who had not consented; it
is fetched on the render after a "granted" choice and not before. And the
Gurmukhi face was preloaded by sixty-three documents that never paint it —
the home page and every English city page among them — because next/font
emits a preload per importing route; it is no longer preloaded anywhere,
and the pages that paint ਪੰਜਾਬੀ discover it from the inlined stylesheet at
the same parse. Layout JS fell from 387 KB to 350 KB and the median LCP on
the three pages measured by 0.2-0.3 s; nothing a page says changed.

Two gaps in the gates were found on the way and are now reported. The perf
budget's "shared JS" is the intersection of every route, and `/global-error`
renders without the layout, so the layout chunk — exactly where the roster
sat — was never counted; a `layoutJs` row is, from today. And the inlined
stylesheet is a build-time step: the eleven routes that export `revalidate`
carry it at build and lose it in production after their first regeneration,
which is why the live home page blocks on four stylesheets while a guide
does not. `inline-css --check` names them. Trading a page's revalidation
(the open-times line, Cliniko-priced sessions) for the inline block is a
decision per page, and it has not been made.

*Enforced by:* `data/perf-budget.json` (`layoutJs`), `scripts/inline-css.mjs --check` (reports, does not fail)

### Two pages written to be linked to, and the templates the leave guides never gave
1 October 2026. The 25 September outreach survey found three pages an outside
organisation would plausibly put on its own "where to get help" list, and none
of them for the two groups the practice is distinctive for: the person finding
a counsellor for somebody who speaks Punjabi or Tagalog, and the employee or HR
lead who has read how a mental-health leave works and now has to write
something. A settlement agency links a page that does its reader's job; it
does not link a service page, however good. So the language-access guide names
the free and low-cost services first, each read from its own page with the
date shown, says plainly that no free Tagalog-language counselling program was
found, and names this practice last. It is in English only; the in-language
pages exist for the reader who wants them, and the no-new-Punjabi-or-Tagalog-
prose rule holds. The templates page is the paperwork for
/guides/stress-leave-bc, not a restatement of it: the request letter, the note
checklist, the HR checklist and a return-to-work plan, as copyable text, with
every legal fact tied to the canada.ca or gov.bc.ca page it came from and the
day it was read. A `template` field on a resource section renders verbatim in
a selectable block, because a letter pushed through the inline-markup renderer
would not survive a paste. Both pages keep every standing rule: plan-dependent
coverage, no outcome claims, no hours, a 30-minute consultation because Cliniko
says so, nothing clinical in anything meant to be sent. The three client
follow-up drafts in docs/CLIENT_FOLLOWUPS.md are sent by a person or not at
all; nothing in the codebase sends them, and the second-week note after a
consultation is a different message from the automatic day-after one, which
promised to be the only one of its kind and still is.

*Enforced by:* `lib/resources-more3.ts`, `scripts/expansion-verify.mjs`, `scripts/seo-audit.mjs`

### Booking mail names the counsellor and books her calendar; the practice is told who did not book; the portal welcome waits for a paid booking
Decided 1 Oct 2026 (branch `wf/mail`). The paid follow-up, the consult
follow-up and the missed-consultation note each book the right calendar: the
paid follow-up opens that counsellor's paid calendar (`bookingsPaidUrlFor`);
the consult follow-up opens her paid calendar, is signed with her first name,
and replies to her and info@; a missed consultation rebooks her free calendar
at `/book?with=<slug>#calendar` and mentions no fee. Nothing points a paying
client at /book, and nothing points a consult no-show at the paid calendar.

Confirmation and reminder say the appointment is online, by secure video, with
no office; name the counsellor with letters and languages; and link the
existing Punjabi or Tagalog first-session guide. Paid bookings state the 24-hour
/ 50% terms as /pricing words them. A consultation booker's button goes to
/resources/before-your-first-consultation. The consult follow-up states the
individual and couples fees, read from the catalogue, never typed.

Two new practice-only notices; nothing is sent to a client. A cancelled
consultation's alert carries a mailto rebook draft. A consultation whose
day-after note went out 10-14 days ago with no later uncancelled session
raises a notice to info@ and the counsellor with draft 3 as a mailto, once per
patient ever. Drafts 2 and 3 live in `lib/reply-templates.ts` (`BOOKING_DRAFTS`).

This NARROWS the 6 Sep decision "A new client is welcomed to the portal
automatically". A record that came from Cliniko is welcomed only once that
patient has at least one appointment that is not the free consultation and not
cancelled; until then it waits in `portal/welcome-pending.json`, re-checked
each sync for up to 120 days. Clients added by hand in /admin are welcomed at
once, as before. Reason: Cliniko creates a patient for every consultation
booking, so "Now that you are a client" was reaching people before their free
call.

`analytics/booking-tally.json` holds monthly counts per counsellor slug
(booked, cancelled and held, each split consult/paid, plus no-shows). Integers
only, idempotent through event keys in `portal/notified.json`. Months before
October 2026 are partial: the first run counted only the 16-days-back /
120-days-ahead window.

*Enforced by:* `lib/booking-mail.ts`, `lib/booking-notify.ts`,
`lib/booking-followups.ts`, `lib/booking-tally.ts`, `lib/portal-invite.ts`,
`test/booking-mail.test.mts`, `test/portal-welcome.test.mts`

### The monthly funnel report joins its numbers
Decided 1 Oct 2026 (branch `wf/funnel`). The report now follows each free
consultation to a paid booking (within 60 days, per counsellor slug, and by
Cliniko referral source and city), and each written message from the last 90
days to a booked consultation and paid session (by source page and by the
counsellor asked for). It prints the booking-mail job's monthly tally, and when
the tally is missing it says so instead of showing zeros. Counts only: patient
ids and email addresses are used in memory inside the run and never stored or
printed. Cities with fewer than 3 consultations fold into "other BC/AB".

Cliniko lists are read to the last page through `listAll` in `lib/cliniko.ts`
(max 10 pages), and the email says "Truncated" when that cap is hit; the
booking-mail job pages its own read the same way (max 20 pages). The client
portal's calendar events are recorded as `portal:<slug>`, so paid-rebooking
intent is counted apart from /book's free-consultation calendar (exact from
1 Oct 2026). On /admin, consult-to-paid is computed only on request
(`?funnel=1`) because it costs a few dozen Cliniko calls. The source split
relies on the owner making the referral source required on online bookings;
until then most consultations will show as "not recorded".

*Enforced by:* `lib/funnel-joins.ts`, `lib/funnel-report.ts`,
`lib/booking-tally-read.ts`, `lib/practitioner-for.ts`,
`test/funnel-joins.test.mts`, `test/funnel-report.test.mts`

### Visits are counted by channel and landing referrer, both from fixed lists, and the counters are copied weekly
Decided 1 Oct 2026 (branch `wf/convlog`). (1) `channel_visit`: a link the
practice hands out (Google Business Profile, directories, notes to family
practices, HR teams, campuses, community organisations, other counsellors)
carries `?utm_source=` naming the KIND of organisation, from `CHANNELS` in
`lib/conversion-detail-client.ts`: gbp, bing, apple, bcacc, listing, gp,
clinic, hr, campus, community, counsellor. It is counted once per session; any
other value is dropped in the browser and refused by the server. This is
separate from /refer's "no referral codes" rule, which forbids tracking who
referred whom: a channel tag names an organisation type, never a person, and no
link given to a client to pass on carries one. `gbp_visit` is superseded and
its history is folded into the gbp row.

(2) `landing`: the first page of each session is counted with the referrer host
reduced in the browser to google, bing, duckduckgo, ai, listing, none or other;
only the class is stored. /admin prints booking clicks per page as "N clicks of
M landings". The log's new `firstSeen` field records the day each event was
first counted, so ratios between counters that started on different days are
labelled rather than silently divided.

(3) `/api/cron/weekly-snapshot` runs on Mondays and copies
`analytics/conversions.json` (and `analytics/booking-tally.json` when it
exists) to `analytics/snapshots/<date>.json`. It sends nothing, per the 17 Sep
decision. /admin diffs the two newest snapshots as "Last 7 days".

(4) The conversion and search counters write with ETag compare-and-swap
(`lib/blob-ledger.ts`). The last attempt is NOT made unconditional, unlike
inbound: losing one increment is better than erasing every increment that
landed concurrently. A weak ETag still writes unconditionally.

*Enforced by:* `lib/blob-ledger.ts`, `lib/conversion-detail.ts`,
`lib/conversion-snapshots.ts`, `test/conversion-channels.test.mts`,
`test/cron-routes.test.mts`

### /book is read in two weeks, says it is online only, and states the session fee
Decided 1 Oct 2026 (branch `wf/book`). Cliniko caps `available_times` at seven
days, and /book read one window. On 1 Oct it said "This week: Tue, Sat, 9 am to
6 pm, with evenings" while Cliniko had openings on 8-17 Oct that no page
mentioned. It now makes two requests (days 1-7 and 8-14) side by side under the
same timeout. The practice line says "Next two weeks: ..., start times X to Y".
", with evenings" was dropped rather than made conditional: the span is of slot
starts, and nothing on the page may say more than Cliniko does. The home hero
still reads only the first seven days, because it says "this week".

/book now says it is online only where the booking summary's street address can
mislead: in the facts, under the calendar heading, and in an open first FAQ.
Under "What it costs" it states the individual and couples session fees from
the Cliniko catalogue, the way the city-service pages do, with coverage
described as plan-dependent. A /book?with= that has chosen a counsellor shows
one row instead of both cards. The sticky bar on /book jumps to the calendar
and names only the chosen counsellor's next time. A form sent from /book?with=
returns there. The registration-number rule now covers every number on the
roster, not only the founder's; /book is per-request, so the guard checks it
with `--live`.

*Enforced by:* `lib/availability-summary.ts`, `lib/book-fees.ts`,
`lib/inbound-return.ts`, `scripts/roster-numbers.mjs`,
`scripts/expansion-verify.mjs` (`--live`), `test/book-page.test.mts`

### Fees in prose come from the catalogue, and one rule decides which calendar a page books into
Decided 1 Oct 2026 (branch `wf/services`). (1) New copy calls
`fallbackFee('<Cliniko name>')` from `lib/cliniko-catalog.ts` and never types a
figure. `scripts/price-drift.mjs` now fails offline on any $NN in lib/, app/ or
components/ that is not a `FALLBACK_CATALOG` price or on its named ALLOW list
(market ranges, plan examples, the EI cap, rent, the liability limit). Add a
non-fee figure there with a reason; never add a fee.

(2) Which calendar a page books into is one rule, `bookingFor(service,
language?)` in `lib/booking-cta.ts`. A language counsellor comes first.
Otherwise `?with=` is used only when exactly one accepting, bookable BC
counsellor offers the service, otherwise bare /book. The label never names a
person.

(3) Condition content lives on the service the condition books into: trauma on
EMDR, anxiety and depression on individual therapy, each under an "Online X in
BC" heading. The condition city pages link up to that heading with "online X
across BC". Still no province-level condition pages. A test fails if a
`lib/depth*.ts` key names a slug with no route.

(4) /services/individual-therapy is titled for anxiety and depression (26 Sep
GSC export). The H1 stays the service name.

*Enforced by:* `scripts/price-drift.mjs`, `lib/booking-cta.ts`,
`lib/city-services.ts` (`CONDITION_UPLINK`), the depth-orphan test

### City hub titles say Online, Virtual and Counsellors
Decided 1 Oct 2026 (branch `wf/cards`); records the 26 Sep change beside the
17 Sep entry. 17 Sep set city titles to "Online & Virtual Counselling in
<city>, BC". On 26 Sep, commit 9628b75 added "| Counsellors, Therapy" for the
person-named queries ("counsellor kamloops", "therapist kamloops"), and in the
same edit dropped "Virtual" without an entry. Both are carried now: "Online &
Virtual Counselling in <city>, BC | Counsellors". "Therapy" is dropped to make
room for "Virtual", which had 127 impressions a quarter for Vancouver against
137 for "online".

The SEO gate measures the title as raw HTML, where "&" is "&amp;", so the
title is built to fit 60 characters as the gate counts them. It drops ", BC"
first; only Surrey and Delta keep it. Prince George also drops " in". The
words Online, Virtual, Counselling, the city name and Counsellors are never
dropped. The service, audience and city pages also show who you would see,
from the roster (`lib/counsellor-cards.ts`), with no registration number.

*Enforced by:* `lib/city-hub.ts` (`cityHubTitle`), `test/city-hub.test.mts`,
the SEO gate's title limit

### A booking link names a counsellor only if she speaks the page's language AND offers its service; the chrome follows the page
Decided 1 Oct 2026 (branch `wf/language`). A page written for one language
(its `language` tag on Service, Audience, Resource or Comparison, or a
/punjabi*, /punjabi-counselling*, /tagalog* or /tagalog-counselling* path)
books with the first counsellor who is accepting, bookable and speaks the
language. If the page is about one service (`service` on the Audience), she
must also offer that service. Otherwise the page keeps its own label and uses
bare /book: a language page never narrows to a counsellor who does not speak
its language. The language's own service page (punjabi-/tagalog-counselling)
counts as offered by everyone who speaks it. This refines rule (2) of "Fees in
prose come from the catalogue" above; `bookingFor` in `lib/booking-cta.ts` is
still the one function.

The header and phone bar resolve the same counsellor, from navRoster's
`bookIn` tags (`lib/roster-nav.ts` LANGUAGE_PAGES and prefixes), so the roster
never reaches the browser. The phone bar's "Next free consult" line names the
counsellor its button names, and goes generic if she has no slot.

/for/punjabi-speaking-couples therefore books with nobody in particular until
someone accepting offers couples work in Punjabi. The English copy no longer
says couples or EMDR are available in Punjabi. **Owner decision pending:**
whether Savneet takes Punjabi couples (and EMDR). If yes, add the service to
her roster entry; the links and tests follow automatically.

The header Counsellors menu lists only counsellors accepting new clients; the
founder stays on /practitioners, /about and her own page. Region and city
language pages declare no hreflang (the /punjabi-counselling/{region} pages
carried a one-way pa -> /punjabi until 1 Oct). /punjabi's title leads with
Gurmukhi, and /services/punjabi-counselling carries the English head term;
this reverses the 17 Sep code-comment ordering, not an entry here.

*Enforced by:* `lib/booking-cta.ts`, `lib/roster-nav.ts`,
`test/booking-cta.test.mts`, `test/roster-nav.test.mts`, `scripts/smoke.mjs`
(hreflang check)

### Alberta and Canada-wide reach are gated on a current liability policy
Decided 1 Oct 2026 (branch `wf/trust`). Alberta opened for Camille on her
BMS/Berkley certificate, and her "anywhere in Canada" reach rests on it too.
Until today only the weekly credential-expiry run read `insurance.validTo`.
Now `lib/practitioners.ts` applies `insuranceStatus()` to the roster every page
reads. A policy is current through validTo, then has a 14-day grace for the
renewal certificate to be recorded. From validTo + 14 days (America/Vancouver),
'AB' is dropped from `provinces` and `reach: 'canada'` is dropped. Because
every consumer (place routes, sitemap, /book, llms, FAQ, /refer) reads those
fields, one gate covers them all. BC is untouched, since it rests on the BCACC
registration. A practitioner with no policy on file cannot open Alberta. Pages
are static, so the gate takes effect at the first build on or after the gate
day. `scripts/credential-expiry.mjs` reads the same grace constant, warns
during the grace, exits 1 once lapsed, and now runs first in `npm run verify`.
Code that needs the ungated roster imports `recordedPractitioners`.

*Enforced by:* `lib/practitioners.ts` (`insuranceStatus`, `withInsuranceGate`),
`app/practitioners/[slug]/[place]/page.tsx`, `scripts/credential-expiry.mjs`,
`test/insurance-gate.test.mts`

### Referral pages name who is accepting, from the roster only
Decided 1 Oct 2026 (branch `wf/trust`). /refer/doctor, /refer/counsellors and
/refer/handout build "who you would see" from `app/refer/accepting.ts`. It
lists accepting counsellors only (never the founder) and never shows
registration numbers, which stay on the profile. A printed sheet cannot be
corrected once handed over, so nothing on it is typed by hand: the
consultation length comes from the Cliniko catalogue, and no hours or phone
appear. /refer/counsellors states no referral fee, no reciprocity and no
report back without the client's written consent. /pricing cites the BCACC
Fee Guide 2026 ranges as market figures (allow-listed in
`scripts/price-drift.mjs`); the practice's own fees still come only from the
catalogue.

*Enforced by:* `app/refer/accepting.ts`, `test/refer-accepting.test.mts`,
`scripts/price-drift.mjs` (ALLOW)

### Retired URLs reach their page in one hop; trauma absorbs into EMDR; the vercel.app alias is not a second site
Decided 1 Oct 2026 (branch `wf/tech`). /services/trauma-therapy and
/copy-of-individual-1 now 308 to /services/emdr-therapy. `lib/conditions.ts`
already routed trauma there, and that page was retitled for trauma on 6 Sep.
This only changes which page absorbs the old URL. It does not reverse the 31
Aug decision to cut services to five, and trauma does not come back as a
service.

Every career alias and /jobs/:slug goes straight to /about in one hop. The four
307s kept for a role that might reopen (/apply, /careers/apply, /careers/rcc,
/careers/registered-clinical-counsellor) are now permanent, because the role
and speculative applications were both retired on 1 Sep. The redirect list
lives in `lib/redirects.mjs`; `next.config.mjs` and `lib/indexnow.ts` both read
it. `npm run redirect-shadow` fails on any redirect whose destination is itself
a redirect.

westpeak-wellness.vercel.app 308s to www through a host rule in
`next.config.mjs`, excluding /api/ so crons are never redirected. Every other
*.vercel.app host (previews) sends noindex.

No hours are published: the evening-appointment cards and lines are gone from
the city, Punjabi-region, place and audience pages and from the outreach and
listing drafts, replaced by "times depend on the counsellor; /book shows what
is open". Evening wording still stands in a handful of files outside that
branch (`lib/audiences-more*.ts`, `lib/depth*.ts`, `lib/services.ts`,
`lib/tagalog.ts` and others) and needs the same sweep.

*Enforced by:* `lib/redirects.mjs`, `scripts/redirect-chains.mjs`,
`npm run redirect-shadow`, `next.config.mjs` (host rule)

### Counsellor titles lead with the person and her language; machine files carry no numbers and no founder
Decided 1 Oct 2026 (branch `wf/schema`), from Search Console. The city hubs
for Richmond and Vancouver dropped out of the export, while
savneet-singh/richmond sat at 6.93 and camille-granda/vancouver at 8.38 under
titles that led with "Counselling in <City>". Profiles sat at 7.7-8.1 with no
clicks. So profile and place titles now lead with the person and the
non-English language she works in ("Camille Granda, RCC: Tagalog counsellor,
online in Canada"; "Savneet Singh, RCC: Punjabi counsellor for Richmond").
They are composed to fit 60 characters, never use "&", and come from
`lib/practitioner-titles.ts`. Place pages stay indexed.

llms.txt, llms-full.txt and ai.json list only counsellors taking new clients,
with no registration numbers and without the founder. Reach comes from the
roster (`lib/practice-facts.ts`). Psychology Today URLs are not used as sameAs
until a listing has been read and matches the site. The organisation schema no
longer claims medicalSpecialty "Psychiatric".

*Enforced by:* `scripts/uniqueness-gate.mjs` (same-city place pairs and place
vs hub, 0.62/0.18), `scripts/ai-crawl-audit.mjs` (numbers, founder, unclosed
links, ?with= links, six services, no "Psychiatric"),
`scripts/schema-validate.mjs` (one BreadcrumbList per page),
`test/schema-facts.test.mts`

### Titles follow Search Console, not taste
Decided 6 Sep 2026. The first month of Search Console data (`data/gsc/`)
showed 4,478 non-brand impressions and two clicks: pages surfacing at
position 20-50 under titles that did not say what the query said. A title
is rewritten when a page draws meaningful impressions for a query family it
does not name in its `metaTitle`, and the FAQ list gains the question in the
searcher's own words. The rewrite is recorded beside the field with the
numbers that caused it, so the next person can tell a data-driven title
from a whim. The name guard, the 60/158 limits and the five-service
decision all still bind: trauma queries go to the EMDR page, not to a
revived trauma service.

*Enforced by:* `scripts/seo-audit.mjs` (lengths), comments beside each retitled field

### The free consultation is 30 minutes, and Cliniko is the source of that number
Decided 6 Sep 2026. Cliniko's Initial Consultation type had been changed to 30
minutes while 99 pages, the booking emails and `llms.txt` still said 15. The
owner chose 30. Every string was swept the same day, the offline catalogue
fallback in `lib/cliniko-catalog.ts` says 30, and `price-drift` compares the
fallback's duration to Cliniko's so the two cannot silently part again. If the
length changes, change it in Cliniko first and run the sweep; the site never
leads on this number.

*Enforced by:* `scripts/price-drift.mjs` (duration comparison), `lib/cliniko-catalog.ts`

### No hours are published, anywhere
Hours depend entirely on which counsellor a person sees, and Cliniko is the
only thing that knows what is actually open. The weekly grid that appeared in
the footer, on /contact, on /book, in llms.txt and in the organisation's
structured data was one counsellor's calendar presented as the practice's. On
the owner's instruction of 6 Sep 2026 it was removed outright — no hours line
at all, not a vaguer one — along with `site.availability`, the admin
availability editor and its API route. The schema carries no
`openingHoursSpecification`.

*Enforced by:* `lib/site.ts`, `app/layout.tsx`, `app/contact/page.tsx`,
`components/Footer.tsx`

*Extended 1 Oct 2026.* The rule covers prose, not only the hours grid. About
twenty sentences across the audience, city, service and Tagalog pages, the
/book "None of these times work?" note and the home page fallback still told
people that evening or weekend times were available "on request". Those are
availability promises Cliniko does not make: in the week of 1 Oct the free
consultation was open on two days, neither of them an evening. Each now
points to the live calendar ("the calendar shows each counsellor's real
open times") or says nothing about time. Prose that describes a reader's
own evenings (a commute, a family argument) is untouched.

---

### A new client is welcomed to the portal automatically; the old list is not swept
Decided 6 Sep 2026. When the Cliniko sync (every two hours, or Sync in
`/admin`) or an administrator adds a client, that person gets one welcome
email: their sign-in is their email address, a signed single-use link lets
them choose a password the practice never sees, and a one-time code sent to
the address works without one. Only records added in that run are candidates,
capped at ten per run and recorded in the invite ledger, so nobody is written
to twice. The earlier refusal to email the whole historical client list about
a portal they never asked for stands: `INVITE_BATCH_LIMIT` stays 0.
`NEW_CLIENT_INVITES=0` switches the welcome off.

*Narrowed 1 Oct 2026:* a record that came from Cliniko now waits for a paid
booking before it is welcomed; see "Booking mail names the counsellor" above.

*Enforced by:* `lib/portal-invite.ts` (`welcomeNewClients`), `lib/cliniko-sync.ts`
(`addedClients`), `test/portal-welcome.test.mts`

---

### The nurture sequence writes only to a lead it acknowledged, and the reply time is measured from a signed link
Decided 1 Oct 2026 (branch `wf/lead-pipeline`). The nurture cron writes only
to a lead whose email 1 the provider accepted (`ackSentAt`). The lead must also
be created on or after `NURTURE_FROM` (1 Oct 2026), not have tripped the
honeypot, and not be a probe or a throwaway address. Every lead created before
this change gets nothing further: they were told "a one-off, not a sequence",
and under CASL the consent covers only what they were told.

Every sign-up surface now promises "two more short ones over the next
fortnight, then nothing", and email 1 carries the unsubscribe link. A
honeypot-tripped submission is stored as counts and keyed hashes only, with no
name, address or message. Whether to purge the 64 full records already stored
is still the owner's call.

Enquiry routing reads the form's "looking" and "where" answers through the
roster. When it routes to one counsellor, the acknowledgement names her and
replies go to her and info@. One-pager alerts go to info@ only.

Reply time is measured from a signed "mark answered" link in the enquiry
alert. It opens /admin and needs an admin sign-in plus one POST button;
following the link alone writes nothing. Nothing is back-filled, and the
public median still waits for five real enquiries. The funnel report and the
/admin opt-in figure count real submissions only (`isRealSubmission`), and
/admin states the excluded count. The checklist's HSA line says use for
counselling depends on how the plan is written; the direct-billing line says
this practice does not direct-bill.

*Enforced by:* `lib/nurture-plan.ts`, `lib/inbound-quality.ts`,
`lib/answered-link.ts`, `lib/reply-line.ts`, `lib/inbound-routing.ts`,
`test/nurture.test.mts`, `test/lead-pipeline.test.mts`

### Paid clients are watched as consultations already were
Decided 1 Oct 2026 (branch `wf/booking-retention`). booking-notify now (a)
tells info@ and that counsellor when a paid client's latest held session ended
14–18 days ago with nothing booked after it, once per patient and session
(ledger `lapsedAlerted`), with an "after-session" draft; and (b) attaches a
"reschedule-session" draft to a cancelled paid session's alert when nothing has
been rebooked since. Neither draft mentions the fee or the 50% retention.
Nothing is sent to the client automatically; a person edits and sends.

The paid after-session note now goes only after the first paid session with
that counsellor, or when nothing is booked after the session, and names the
next session when there is one. Skips are recorded in the ledger as
`followUpSkipped`. Client mail for an appointment replies to its counsellor
and info@. Paid rebook links open the same appointment type with her
(`bookingsPaidUrlFor` typeId, honoured only for paid types).

The client portal reads the signed-in client's own Cliniko appointments to
show what is next and to open on the counsellor last seen, and falls back to
the old page on any failure. /admin "Not seen lately" lists, from Cliniko,
clients with a paid session 45 or more days ago and nothing upcoming. It is
still one note per person ever, sent one at a time by a person.

*Enforced by:* `lib/booking-followups.ts`, `lib/booking-notify.ts`,
`lib/portal-appointments.ts`, `components/admin/NotSeenLately.tsx`

### The booking calendar sizes itself, opens from #calendar, and the phone layouts put the button first
Decided 1 Oct 2026 (branch `wf/scheduler-mobile`). The calendar frame carries
Cliniko's `embedded=true` and sizes itself to Cliniko's own height messages,
with one listener in `components/SchedulerTelemetry.tsx` that accepts only
messages from the frame's own origin and window. The height is clamped to
480–2400px, each step scrolls the frame into view, and
`cliniko-bookings-page:confirmed` goes to the empty hook
`onClinikoBookingConfirmed()`.

On /book, arriving at #calendar (or tapping a same-page link to it) opens the
gated calendar. Bare /book keeps the gate, and every open is counted as the new
event `scheduler_open`, detail `button` or `hash`. `scheduler_visible` counts
are therefore not comparable before and after this change.

The sticky bar hides while a calendar frame is mounted or a text field has
focus. Its Book button is the one filled button, and a next-consult sentence
that names a slot links to that counsellor's calendar (book_click
`sticky-next`). The phone layouts move the service hero's Book button above the
chips, compact the bare /book cards and move the /contact map below the form.
Diagrams link to their full-size SVG. The enquiry form's rules are visible:
labels, the twenty-word hint and a live word count; the rule itself is
unchanged. The retired careers page's CSS was removed from `app/premium.css`,
which pays for the new rules.

*Enforced by:* `lib/cliniko-frame.ts`, `lib/scheduler-open.ts`,
`lib/book-card.ts`, `test/scheduler-mobile.test.mts`

### No reviewer is named in structured data; every consult time says Pacific; informational pages show who you would see
Decided 1 Oct 2026 (branch `wf/info-templates`). (a) `reviewedBy` is no longer
emitted anywhere. It pointed at /about#person, which no page defines, and if it
ever resolved it would name the founder as reviewer. It returns only with a
settled named reviewer whose Person node a page actually defines (owner item
#77). `scripts/ai-crawl-audit.mjs` now fails on any referenced @id that is
defined nowhere.

(b) Every consult time the site prints is labelled "(Pacific time)". /book adds
one sentence on other clocks, and its Alberta part shows only while an
accepting counsellor is insured for AB. This labels Cliniko's times and is not
an hours claim.

(c) One-pager signups confirm on /one-pager-sent (noindex, dynamic for
?lead=err), which describes the nurture sequence as it actually runs (day 4,
day 11, one-click unsubscribe, then nothing). /message-sent stays the enquiry
confirmation.

(d) The informational pages that carry the "who you would talk to" cards, fee
line and coverage line form an explicit list, `INFO_CARD_PAGES` in
`lib/counsellor-cards.ts`, plus an opt-in `whoYouWouldSee` field on Resource.
The gentle leave guides get a gentler heading and still no form. (e) On
resource, guide, compare and approach pages the short answer is the first
thing after the H1 (`.answer`, and speakable points at it).

*Enforced by:* `lib/counsellor-cards.ts`, `scripts/ai-crawl-audit.mjs`,
`test/info-templates.test.mts`

### Penticton and Fort St. John are city pages again; a retired town goes to the page that names it
Decided 1 Oct 2026 (branch `wf/regional-pages`). Penticton (Okanagan) and Fort
St. John (Northern BC) are city pages again, each built under the
`lib/locations.ts` rule that a page must make its own argument. Penticton's is
that the South Okanagan queues behind Kelowna. Fort St. John's is that the
Peace keeps MST all year, works on rotation across the Alberta line and is
about 440 km from Prince George. Both slugs left `retiredCitySlugs` in the same
change. The Fort St. John sentence about who can see clients in Alberta is
generated from `insuredProvinces()` and disappears when the insurance gate
closes.

A retired town slug now redirects to the city page whose communities name the
town (`RETIRED_TOWN_HOMES` in `lib/redirects.mjs`). Towns no page names still
go to /online-counselling, which now has a generated "Find your town" list by
health authority. redirect-shadow fails if a destination stops naming its town.

A practitioner place page's Tagalog twin, its hreflang and its sitemap rows now
exist only where `lib/practitioner-places-tl.ts` has copy for that city, the
same rule the Punjabi twins follow. New city pages are added in English only
and get no Tagalog twin until copy is written and reviewed. Metadata strings
may not mention evenings or weekends, apart from named exemptions.

*Enforced by:* `lib/redirects.mjs`, `scripts/redirect-shadow.mjs`,
`test/regional-pages.test.mts`, `test/no-hours-metadata.test.mts`

### Claims the practice cannot stand behind are retired
Decided 1 Oct 2026 (branch `wf/claims-corrections`). (1) Health spending
accounts and the METC: the CRA's authorized-practitioner table lists no
counsellor for BC (read 1 Oct 2026), so the site no longer says an HSA or the
tax credit covers RCC fees. The wording is: an HSA pays only CRA-eligible
expenses, so ask the administrator first; a wellness or lifestyle account
usually works as a taxable benefit; the METC generally does not apply until
psychotherapy is regulated (29 Nov 2027).

(2) Coverage is "many plans, depending on the plan; check yours", never "most
BC plans". `scripts/coverage-claims.mjs` enforces this through the seo gate.
Its pending list, which held sentences in files other branches owned, was
emptied at integration: those eight sentences were rewritten the same day.

(3) Billing: the practice is described as pay-and-submit. Pacific Blue Cross
has accepted direct claims from RCCs since 11 Jul 2025, so "direct billing is
uncommon" is retired. ICBC status comes from one flag, `site.icbcVendor`
(false), read by /pricing, /refer and /ai.json.

(4) "Gottman-trained" may appear only in a roster entry that is the founder's
or that carries a `gottmanTraining` field, enforced by the seo gate. Couples
work is "Gottman-informed" until owner item #67 records a level.

(5) Market fee figures are quoted only from BCACC's 2026 guide and BCPA's $245
recommended rate (effective 12 May 2025), each with a read date. This
practice's fee comes from the catalogue. (6) How to cancel is "reply to your
confirmation or reminder email", the same as the emails. A self-cancel link is
never promised, because Cliniko disables it for sessions paid in full at
booking. (7) Page-specific styles for /pricing are inline, because
`premium.css` is inlined into every page and the homepage CSS budget has no
room left.

*Enforced by:* `scripts/coverage-claims.mjs`, `scripts/lib/gottman-claims.mjs`,
`lib/session-arithmetic.ts`, `lib/machine-facts.ts`,
`test/claims-corrections.test.mts`

---

### A confirmed booking is counted, credited to its landing and button, and every change gets a before-and-after
Decided 1 Oct 2026 (branch `wf/measurement`). (1) Bookings Cliniko confirms
inside the embedded calendar are counted as `scheduler_booked`. Cliniko posts
`cliniko-bookings-page:confirmed`; it is accepted only from the frame's own
origin and window (the one Cliniko listener, in
`components/SchedulerTelemetry.tsx`), and nothing but the message name is
read.

(2) Landing and button credit is a narrow, deliberate exception to "nothing
joins two actions": the browser keeps `<landing path>|<channel or class>` and
the last booking button in sessionStorage, and sends them only as the bounded
detail of `click_from`, `booked_from` and `booked_via`. The server stores
counts, never a session or an identifier. Portal bookings are rebookings and
are not credited to a landing.

(3) Staff browsers are excluded per device by localStorage `wp-no-count`,
switched on /admin. (4) Retention figures (rebook within 21 days, depth in
the first 90 days, paid but nothing booked) are counts by counsellor and by
referral source, with groups under 3 folded into "other", matching the city
rule.

(5) The A/B test stays rejected. Its replacement is `data/changes.json` plus a
before/after readout against untouched pages with a 95% Poisson interval,
which says "too few to tell" rather than giving a verdict. Snapshots began
1 Oct, so for `conv:` metrics the "before" window is the cumulative log since
18 Aug, and the first snapshot (around 5 Oct) puts about four post-change days
into "before". (6) Search Console compares overlapping 28-day export windows,
because that is what the committed files support, and says so; staleness
warnings appear on /admin, not by email.

*Enforced by:* `lib/conversion-detail.ts` (`landingKeyOk`, `ALLOWED`),
`lib/change-register.ts`, `test/measurement.test.mts`

### "Verify" means the RCC Register, and a profile states what she offers, from data
Decided 1 Oct 2026 (branch `wf/info-content-trust`). BCACC's directory
(bc-counsellors.org/counsellors) is opt-in, and Savneet's listing is switched
off, so the verify link on her profile found nobody. `site.counsellor.registerUrl`
and every BCACC `verifyUrl` now point at bcacc.ca/search-our-member-register/.
All three RCCs were read off it by number on 1 Oct (Active, no notes) and
recorded as `registerCheckedOn`. The profile deep-links each counsellor's own
entry (`?mid=<number>`), on her page only, because the URL carries the number.
Directory links stay only where the text is about finding someone.

Profiles now carry a roster-and-catalogue fact strip (fees, free consult,
reach, languages, not offered) and `Person.makesOffer` from the same data. The
liability-insurance line appears only while `insuranceStatus` is `current`, not
during the grace period. Each profile has a line saying a complaint about her
can go straight to BCACC, linking /standards, which now states the BCACC
route, the five-year window and the written response. Leave and EI guides
state the catalogue individual fee and leave coverage during a leave to HR or
the plan.

*Enforced by:* `test/register-links.test.mts`, `lib/practitioner-facts.ts`,
`scripts/credential-expiry.mjs` (90-day `registerCheckedOn`)

### One employer page, and HR is answered by email
Decided 1 Oct 2026 (branch `wf/workplace-students`).
/resources/counselling-support-for-bc-teams (67 impressions at 43.94, 0
clicks, still calling the practice "solo") now 301s to /for/employers-and-hr,
which had no Search Console rows at all. The teams page's manager guidance,
Fraser Valley language point and workshops answer moved over. "Solo",
"receipts that work with every plan" and "bookable that week" did not.

The employer hero no longer books a client consultation for HR, because those
are the scarce slots. It sends HR to /contact?about=employer, where an
"employer" choice needs no WHERE/TIMING, keeps the 20-word floor, and alerts
info@ only. Booking is offered only as "Send an employee to book".

Separately: typed copy may not promise one counsellor's Canada-wide reach,
because the insurance gate can withdraw it and the HR paste block is copied
onto intranets the site cannot update. Student-plan figures live only in
`lib/student-plans.ts`, and a test fails when a row is more than 365 days old.

*Enforced by:* `test/reach-copy.test.mts`, `test/student-plans.test.mts`,
`lib/redirects.mjs`

### Languages and fees in money-page copy come from data, not typing
Decided 1 Oct 2026 (branch `wf/services-language`). A page about a service
names only the languages spoken by accepting counsellors who offer that
service (`lib/city-service-page.ts` `languagesFor`/`languagePhrase`). Couples,
EMDR and family therefore read "English or Tagalog" until a Punjabi speaker
lists that service. The /for/punjabi-speaking-couples copy switches back
automatically if that happens.

Money-page descriptions (/pricing, /services/*, city hubs,
/punjabi-counselling/*, accepting counsellor profiles) end with
"{fee} per {minutes}-min session · free 30-min consult · {names}", composed by
`lib/snippet-facts.ts` from the Cliniko catalogue and the roster. It is never
typed, never cut, and capped at 155 characters by seo-audit
(`snippet-too-long`). price-drift fails any fee typed into a description.
Confidentiality limits are stated from one constant, `CONFIDENTIALITY_LIMITS`
in `lib/practice-facts.ts`. Abbotsford and Prince George couples pages use the
title "Marriage Counselling" through `Pair.titleName`, per Search Console
(Abbotsford: 51 marriage-phrased impressions against 33 couples-phrased;
Prince George: marriage queries only). Item 166 (premarital and affair-recovery
copy) waits on Camille confirming the content.

*Enforced by:* `test/service-languages.test.mts`, `scripts/seo-audit.mjs`,
`scripts/price-drift.mjs`

---

### Availability is said per counsellor: a count and the next open day, never a span of start times
Decided 1 Oct 2026 (branch `wf/home-book-copy`). Amends the 1 Oct `wf/book`
line "Next two weeks: <days>, start times X to Y (Pacific time), including
the weekend", under the 6 Sep rule "No hours are published, anywhere". A span
of start times reads as hours. The practice-wide forms merged two calendars
into a span no single day offered: production home said "Tue, Thu, Sat, 9 am
to 7 pm" while Savneet's times were Tue/Fri afternoons and Camille's Thu/Sat.
`weekSpan` and `practiceHoursLine` are deleted. The only Cliniko-derived
availability text allowed now is per counsellor: a count of free-consultation
times in the next two weeks and the next open day ("Next free call: Sat 3 Oct
with Camille · Tue 6 Oct with Savneet (Pacific time)" on home; "42
free-consultation times open with Camille in the next two weeks; next: Thu 2
Oct (Pacific time)" on /book cards). The /book "Next open with …" lines inside
the calendar box still show the first time on each of the next three open
days, as allowed on 14 Sep. /contact has no availability line.

*Enforced by:* `test/no-hours-metadata.test.mts` (fails on "am to", "pm to"
or "weekend" in these outputs, and if the deleted functions return)

---

### Guides, resources and comparisons end with one NextStep block
Decided 1 Oct 2026 (branch `wf/guide-templates-next-step`). Guides, resources
and comparisons end with one NextStep block (`components/NextStep.tsx`),
placed straight after Sources and before the link footer. It holds the
counsellor cards, the catalogue fee for the page's service with
plan-dependent coverage, the next free consultation with a counsellor who
fits, and the closing band with up to three smaller steps from
`lib/next-steps.ts`. Cards are on by default. `lib/counsellor-cards.ts`
`NO_CARDS` keeps them, and the consultation time, off two pages: the crisis
directory and becoming-a-counsellor. It also keeps them off nine GENTLE_CTA
guides: intrusive-thoughts, grief, what-trauma, someone-drinking,
supporting-someone, therapy-isnt-working, signs-it-might-be-time,
workplace-bullying and anger. **Owner to record** page by page which of those
nine get the gentle-heading cards; removing a slug from `NO_CARDS` is that
decision. Pages that declare a service (couples, EMDR, family) or province AB
book that counsellor's calendar via `bookingFor`; when no one counsellor
fits, they book the bare /book.

*Enforced by:* `test/counsellor-cards.test.mts`, `test/booking-cta.test.mts`,
`scripts/price-drift.mjs` (`FEE_LINE_ITEMS` against the catalogue)

---

### The money pages state the fee, the counsellors and the next free consultation from data
Decided 1 Oct 2026 (branch `wf/money-pages`). /pricing's H1 is generated
from the Cliniko catalogue, and its lede names the counsellors accepting new
clients and their languages from the roster. /online-counselling gains the
shared counsellor cards and a `fallbackFee` sentence. /services is corrected:
count from `services.length`, no Alberta, language lines from
`offeringLanguages()`, per-card "With …". The next-consultation line is added
to /online-counselling, /pricing and each /services/<slug>, filtered to who
offers the service. The session-security sentence is one constant
(`SESSION_SECURITY` in `lib/policies.ts`) that /privacy, /online-counselling,
the city hubs and /pricing all read. Structured-data Offers are one per
catalogue type (`sessionOffers` over `OFFERINGS.billedAs`) on the city hubs,
the service pages and the fifty city-service pairs, which now carry a Service
node with the named counsellors as providers. InStock is no longer used for
sessions. City-service FAQ text is lowercased word by word (`midSentence`),
keeping initialisms and language names.

*Enforced by:* `test/city-service-page.test.mts`, `scripts/price-drift.mjs`

---

### Seasonal copy is gated by the Pacific date, not by a deploy
Decided 1 Oct 2026 (branch `wf/seasonal-coverage`). `lib/seasonal.ts`
`inSeason(from, to)` reads the America/Vancouver calendar date, so a year-end
line does not disappear at 4 p.m. Pacific on 31 December. A malformed window
is never in season. Windows: the year-end section on the two coverage pages
(`Resource.seasonal`) runs 1 Oct to 31 Dec; the /pricing and /book line runs
15 Oct to 31 Dec; the counsellor drafts (after-consult, after-session) and
nurture email 3 carry the note 15 Oct to 20 Dec, adding no new send and no new
audience, and out of season their output is byte-identical to before. The
year-end page /resources/counselling-benefits-before-year-end-bc keeps its URL
and in January is rewritten into the February "maximum just reset" piece. The
grief holiday section and FAQ go live only when `FIRST_HOLIDAYS_CLEARED` in
`lib/guides-more3.ts` is set to true after the owner's clinical read.
`scripts/price-drift.mjs` ALLOW gains $600 (the remaining-balance example) and
$1,000 (the CBA community health mental health maximum per calendar year).
The SAD guide's social post was moved to the front of SOCIAL_QUEUE.md by hand;
`npm run social` will put it back unless the slug is added to PRIORITY in
`scripts/social-queue.mjs`.

*Enforced by:* `test/seasonal.test.mts`, `scripts/price-drift.mjs`,
`scripts/coverage-claims.mjs`

---

### Structured data reads the roster; couples work is Gottman-informed; a first session is built but off
Decided 1 Oct 2026 (branch `wf/schema-profiles-admin`). Organization JSON-LD
reads its provinces from the gated roster, so a lapsed liability policy
removes Alberta sitewide at the next build, and `employee` lists only
accepting, bookable counsellors, never the founder. The practice node no
longer claims BCACC membership or the RCC (BCACC registers individuals; each
Person carries her own), and the register search form is not a sameAs.
Couples work is "Gottman-informed" everywhere the practice describes itself,
and `scripts/lib/gottman-claims.mjs` fails a bare "Gottman Method" claim until
a gottmanTraining level is recorded (owner item #67). Pages that are not her
profile carry an inline Person, and Person.url is always the canonical
profile. Profiles spell each credential out, name the CCC's certifier and say
what an RCC means (`RCC_PLAIN`). "Already sure? Start with a first session" is
built behind `site.directFirstSession = false`. **Owner to record** before
flipping it: an entry here, a data/changes.json entry (a test enforces it) and,
for couples, Camille's slug in `FIRST_SESSION_COUPLES`. A booking from that row
is not yet credited to `first-session` as booked_via, because the paid
calendar opens as its own page. /admin "Waiting on you" replaces the "Open, and
owned by a person" table; flip `CLIENT_AGREEMENT_LIVE` / `PUNJABI_FORM_DECIDED`
in `lib/waiting-on-you.ts` when those land.

*Enforced by:* `scripts/schema-validate.mjs` with `scripts/lib/schema-checks.mjs`,
`test/gottman-method-claims.test.mts`, `test/first-session.test.mts`,
`test/profile-schema.test.mts`, `test/waiting-on-you.test.mts`

---

### Search finds the pages that book; forms are labelled; refusals are never shown as sent
Decided 1 Oct 2026 (branch `wf/search-forms-a11y`). (1) A refused enquiry from
a static confirmation flow goes to that flow's own static failure page
(`FAILED_PAGE` in `lib/inbound-return.ts`). /punjabi refusals land on
/punjabi/not-sent, English only and noindex, offering email and the
Punjabi-speaking counsellor's calendar; /punjabi/sent never shows a refusal as
"arrived". Whether /punjabi asks the three enquiry choices waits on owner item
205; until then `test/inbound-forms.test.mts` records /punjabi as the one
exempt form. (2) A danda ends a sentence for the enquiry word and sentence
floor. (3) Site search indexes the pages that book: accepting counsellors (no
registration numbers; the founder excluded by the accepting flag), city hubs
with communities, city x service pages, conditions, /pricing, /book, /faq,
/answers and the English language hubs. It matches whole words with stems and
synonyms, and every synonym or phrase row in `lib/search-synonyms.ts` must cite
the GSC query behind it. (4) The a11y gate requests the routes rendered on
request and requires titled iframes and new-tab wording on those routes.
/accessibility says exactly which pages are checked, not "every page". (5)
Uppercase-path lowercasing in middleware was not shipped: on Vercel it would
put every request through middleware unless the matcher's case-sensitivity is
confirmed on a preview.

*Enforced by:* `test/inbound-forms.test.mts`, `test/a11y-rules.test.mts`,
`scripts/a11y-audit.mjs`, `scripts/smoke.mjs`

---

### /admin opens on six weekly outcome numbers; a consultation that leads to a paid session is counted
Decided 1 Oct 2026 (branch `wf/measurement-admin`, items 251, 255, 256, 277,
297). /admin opens, after the health warnings, on six weekly outcome numbers
(`lib/weekly-kpis.ts`): Google clicks without the home page, /book calendar
seen, real enquiries and leads, consults booked against open slots, new paying
clients and paid sessions held. Each sits beside last week and a four-week
mean. The up or down mark is the change register's 95% Poisson test (last four
weeks against the four before, eight whole weeks required); otherwise the tile
says "too few to tell". Anything unmeasured shows a dash and the reason, never
0. Due change readouts print under the strip. No email (17 Sep). New tally
field `consultConverted`: a held consultation whose patient has a later paid
session that is still on, counted once per consultation (ledger key
`v:<consult id>`), to the consultation's counsellor, in the month first seen.
It is a floor, because the job reads only 16 days back. Weekly snapshots copy
the booking job's last run; a week whose tally copy was more than 6 h behind it
is marked partial and left out of the tally means. This uses the job's run
time, not `tally.updatedAt`, because the tally is written only when something
new is counted. Search Console: "/" is its own `home` class (mostly brand
searches) and no longer counts as a page that books. Weekly clicks come from
date-page.csv by Monday-to-Sunday week, and only complete weeks count.
Referrer classes edu, press and org, and channels press and student, were
appended. Weekly enquiries count `isRealSubmission` and `looksHuman`; leads
count `isRealSubmission` only.

*Enforced by:* `test/measurement.test.mts`

---

### Trauma city pages book into individual counselling; city x service pages and hub links use one search name; White Rock is White Rock & South Surrey
Decided 1 Oct 2026 (branch `wf/city-pages`, items 253, 260, 276, 282, 290,
291, 292). Trauma, a condition, now books into individual-therapy instead of
emdr-therapy. All ten trauma city pages had been quoting the 90-minute EMDR
Intensive as their session fee and naming one counsellor, while their own copy
says pacing comes first; production Vancouver trauma (298 impressions, 26 Sep)
showed the intensive fee twice. The pages now quote the weekly Individual
Counselling fee, name every accepting counsellor, and offer the intensive in
one catalogue-read sentence as a later option "once stability is in place",
which is how the EMDR page frames it. The province-level trauma reading stays
on the EMDR page (`CONDITION_UPLINK`), and /services/trauma-therapy still 308s
there. This is not a sixth service.

`seoName()` in `lib/city-service-page.ts` is the name every city x service H1,
description and inbound anchor uses: Couples and Marriage Counselling; Trauma
Therapy and Counselling; Anxiety Counselling and Therapy; Depression
Counselling and Therapy; EMDR Therapy (unchanged). Titles stay on
`cityServiceTitle`/`titleName`. The counsellor block heading names the person
("EMDR therapist in Vancouver: who you would see"). Hub help cards link only
their "<name> in <city>" line, stretched over the card with CSS, as on /for.

The White Rock hub's `displayPlace` is "White Rock & South Surrey". To fit the
60-character gate, its title is the one hub title without "Virtual": "Online
Counselling White Rock and South Surrey | Counsellors"; its description
carries "virtual" instead. /online-counselling/south-surrey and /semiahmoo 308
to it (`PLACE_ALIASES` in `lib/redirects.mjs`). Its age statement is the 2021
Census figure (8,185 of 21,940 aged 65+, CSD 5915007, cited), and its public
intake is Fraser Health's White Rock/South Surrey MHSU Centre at 15521 Russell
Ave (cited). The Johnston Road line and the "substantial Punjabi-speaking
community" line were removed as unverified and generalising. Surrey's sibling
links are White Rock, Langley and Abbotsford. Six hubs link their /for pages
in an "Also written for" line, with links only and no claims.

*Enforced by:* `test/city-service-page.test.mts`, `test/city-hub.test.mts`

---

### Market fee figures live in one sourced constant; /pricing owns the cost query; regulator and Alberta helpline facts corrected
Decided 1 Oct 2026 (branch `wf/fees-and-pricing`, items 257, 261, 262, 273).
Market fee figures (BCACC Fee Guide 2026, BCPA recommended rate) live only in
`lib/fee-guides.ts`, read 1 Oct 2026, and every page quoting them reads that
constant. They are always labelled as the association's recommendation. This
practice's fees still come only from `lib/cliniko-catalog.ts`. /pricing now
owns the "How much does therapy cost in BC" query (title "How Much Does
Therapy Cost in BC? 2026 Counselling Fees"), and /tools/therapy-cost-bc is
titled for the calculator. The Alberta public route is Recovery Alberta (since
1 Sep 2024): Mental Health Helpline 1-877-303-2642, Addiction Helpline
1-866-332-2322. 1-844-944-4744 is the Indigenous Support Line and is not to be
presented as an AHS mental health line. The College of Psychologists of BC is
named only with "formerly"; its successor is the College of Health and Care
Professionals of BC.

*Enforced by:* `scripts/price-drift.mjs` (a range typed outside fee-guides, or
wording that disagrees with its cents), `scripts/voice-audit.mjs` (FACTS),
`test/fee-guides.test.mts`

---

### Claims gates read docs/ and kits/; one answer on video coverage; EI certificates; linkable resources
Decided 1 Oct 2026 (branch `wf/claims-and-guides`, items 258, 263, 264, 268,
269, 274, 275, 298). (1) The coverage gate matches across line breaks: each
line is joined to the next two with JSX spacers, tags and markdown quote marks
removed. It also catches list/recognise/"Most, not all"/trades-plan/"do
cover"/"most teachers can" shapes. With the Gottman gate and the no-hours
metadata test, it now scans docs/, kits/ and OUTREACH_KIT_2026-08-28.md as
well as lib/app/components, because that copy is pasted onto other sites. (2)
kits/ and the August outreach kit are superseded; listings come from
docs/LISTINGS_PACK.md and outreach from docs/OUTREACH.md. The canonical NAP
names no practitioner and lists English, Punjabi, Tagalog. The standing press
bio lives in kits/README.md, is built from the accepting roster, and has no
founder and no registration number. (3) "Is a video session covered the
same?" has one answer, `ONLINE_COVERAGE` in `lib/practice-facts.ts`, which is
plan-dependent and says what to ask the plan. (4) EI sickness certificates can
come from a physician, NP or psychologist (Service Canada), and the EI guides
no longer say a claim requires treatment. (5) /guides/stress-leave-bc carries
"mental health leave" in its title, a section and the pay heading. Before:
metaTitle "Stress Leave in BC: How to Apply, Is It Paid | Westpeak", 91
impressions at 10.49; 47 mental-health-leave queries, 147 impressions, 0
clicks (GSC 26 Sep). Compare after four weeks. (6) `Resource.linkable` marks
pages offered for linking and printing; they state free-to-link and
reproduce-with-attribution terms and print without booking prompts.

*Enforced by:* `scripts/coverage-claims.mjs`, `scripts/lib/gottman-claims.mjs`,
`test/no-hours-metadata.test.mts`, `test/claims-corrections.test.mts`

---

### A counsellor's booking link opens her calendar; couples consultations are their own /book; rotation pages ask for a time
Decided 1 Oct 2026 (branch `wf/book-and-cta`, items 259, 270, 280, 281, 288,
289). (1) A booking link that names one counsellor ends in #calendar. This
applies to `bookHrefFor`, `bookingFor`, the header and sticky bar, and
NextConsultLine, so /book opens her calendar on arrival. Bare /book never
carries the hash, so its gate and its Lighthouse figure stand. (2)
/book?for=couples is a couples consultation. It is honoured only with a
counsellor who offers couples work, and shows a couples heading and prompt,
the two couples catalogue formats, and the line "both partners can join".
scheduler_open counts it as `couples`. Couples routes add it through
`bookHrefFor(counsellors, 'couples-therapy')`. Pending with the owner: whether
the consult link works on two devices, and whether to add a $0 couples
consultation type. Neither is built and no copy claims either. (3)
/book?with= shows only that counsellor's session types and lengths, read from
the catalogue. "About" links go to her profile, or to /practitioners on bare
/book, never /about. (4) The reviewed Gurmukhi line on /book moves under the
heading when the chosen counsellor is bookable in Punjabi. It is never
duplicated. (5) The next free consultation line runs on /for pages (filtered by
language AND service; no line when nobody fits; not on the HR page) and on
Punjabi region pages. (6) Shift and rotation audience pages (`ROTATION` in
`lib/audiences.ts`) link /book's #ask-for-a-time form. The copy says only that
the reply is a time not yet on the calendar.

*Enforced by:* `test/book-cta-links.test.mts`, `test/booking-cta.test.mts`,
`test/roster-nav.test.mts`

---

### Client email is attributed, previewed and unsubscribable; the consult follow-up has two branches
Decided 1 Oct 2026 (branch `wf/client-mail`, items 254, 272, 285, 286, 287,
293). (1) The day-after consult note now has two branches. If a paid session
is still to come, it confirms it ("Your first session is booked": date,
counsellor, first-session guide, paid cancellation terms) with no calendar
link and no fee. Otherwise it offers only the first-session types of the
counsellor the person met, with fees from `readCatalog()`, and opens her
calendar narrowed to the type when there is exactly one. (2) Client email is
attributed. `email` is a CHANNEL, appended after `press` and `student`. Every
site link in client mail carries utm_source=email&utm_campaign=<template> from
a fixed ten-word list. Paid-calendar links in the consult, after-session,
missed and reactivation mail go through a new first-party redirect,
/book/session. It validates against the roster, the paid types and the list,
counts book_click `email:<template>[/slug]` and 302s to the same Cliniko URL.
Nothing about the person is in any link. (3) `sendDetailed` defaults reply_to
to info@, so portal mail replies reach a person. (4) Lead email 1 and nurture 2
and 3 carry RFC 8058 List-Unsubscribe headers, and /api/unsubscribe accepts the
one-click POST. Transactional mail never carries them. (5) Every client email
has a real inbox preview line. Confirmation and reminder subjects carry the
short day and time but never the service. (6) Nurture email 2's button is the
free-consult page, followed by the counsellors. Email 1's counsellors are
buttons. No new mail, no timing change, nothing sent.

*Enforced by:* `test/client-mail.test.mts`, `test/booking-mail.test.mts`,
`test/lead-pipeline.test.mts`

---

### The reach line is generated; one registered locality; the first-paint CSS is pruned per page
Decided 1 Oct 2026 (branch `wf/sitewide-facts-perf`, items 283, 284, 299,
301). (1) The practice's reach line is generated, not typed. `site.serviceArea`
is now only the clause true of every counsellor ("Virtual counselling across
British Columbia"). `serviceAreaLine()` in `lib/practitioners.ts` appends "and
elsewhere in Canada with Camille" from the insured, accepting roster, and it
drops at the same build as the Alberta hub and JSON-LD when her policy lapses
(validTo 2026-10-01, gate 2026-10-15). (2) One registered-locality constant:
`REGISTERED_LOCALITY` in `lib/site.ts` is White Rock, BC, CA, with no street and
the note "online only, no office". The Organization JSON-LD, the footer,
/contact, the vCard ADR, ai.json and llms.txt all read it. Email renders before
phone in the footer, /contact and the vCard. (3) The inline first-paint CSS is
pruned per document (`scripts/css-prune.mjs`): a selector is left out only if
its class or id appears nowhere in the document or in client JS. The full
stylesheet still loads from the same position. Median page HTML went from
191,566 to 158,021 B and largest from 270,979 to 236,376 B on the branch.
Homepage CSS and layout JS are unchanged. The perf baseline was not touched;
lowering it to bank the gain is the owner's call. `PRUNE_CSS=0` reverts. (4)
Punjabi words page: confidentiality limits now come from
`CONFIDENTIALITY_LIMITS`, and the table's English cell was corrected.

*Enforced by:* `test/service-area.test.mts`, `test/nap-consistency.test.mts`,
`test/css-prune.test.mts`

---

### Visitor-facing Pacific times go through one helper; the time-zone sentence is computed; the availability cache never stores a failure
Decided 2 Oct 2026 (branch `wf/pacific-time-availability`, items 353, 359,
363, 371, 372, 382). (1) Pacific times shown to visitors and clients go
through `lib/pacific-time.ts`. It checks that 2026-12-15T20:00Z reads 1:00
p.m. and falls back to Etc/GMT+7 from the 2026 spring change if the runtime's
tz data predates BC's permanent UTC-7 (Node 24.15 / tz 2026a here is stale; CI
Node 22 is current). `engines` is pinned to 22.x, and prebuild
(`scripts/tz-probe.mjs`) logs `process.versions.tz` and the probe; it never
fails the build. (2) The /book time-zone sentence is computed per day from the
Pacific, Edmonton and Creston offsets, not typed. The "Peace is an hour ahead
Nov-Mar" claim is removed from /book and from the Fort St. John hub. (3) The
Cliniko availability cache no longer stores failures: the cached read throws,
Next keeps the last good value, readers drop anything older than 6h, and
`consultationAvailability()` returns {} rather than throwing. /admin keeps the
live read. (4) When a successful read shows no consult time in 14 days, the
line says so and links the ask-for-a-time form (book_click
`next-consult-ask`), naming no day or hour. (5) The home hero's next-free-call
days link to each counsellor's calendar (book_click `hero-next-home`). (6) The
four long hub descriptions were shortened so they carry the catalogue fee and
counsellor names.

*Enforced by:* `test/pacific-time.test.mts`,
`test/availability-summary.test.mts`, `test/info-templates.test.mts`

---

### A refused enquiry lands on /message-not-sent with its reason; AI arrivals are counted; a stalled calendar says so; IndexNow at deploy uses the public key
Decided 2 Oct 2026 (branch `wf/inbound-and-measurement`, items 357, 365, 373,
374, 375). (1) City hub enquiries return to /message-sent, and a refusal to
/message-not-sent (noindex), which gives the refusal rules, info@ as text and
a mailto, the ask-for-a-time form, and a link back to the form with the draft
restored from sessionStorage. The reason is an allow-listed `why`
(email|detail|choices|repeated|store); for `store` the page says the fault is
ours. /refer now credits its own signups (source=/refer). (2) An empty
referrer with an assistant `utm_source` fires ai_referral once per session and
lands as `ai`; Bing Copilot hosts were added to AI_HOST. (3) If Cliniko's
frame sends no resize within 10 s of being half on screen, a server-rendered
note offers the counsellor's calendar in a new tab or email, and
`scheduler_stalled` fires once; /admin shows stalls against opens on /book.
(4) The deploy-time IndexNow ping no longer uses CRON_SECRET. The IndexNow key
is public by protocol (served at /<key>.txt so engines can verify host
control), so `.github/workflows/indexnow.yml` runs
`scripts/indexnow-deploy.mjs`, which submits sitemap URLs with lastmod on or
after the commit day plus the retired redirect sources directly to
api.indexnow.org with that key. It picks URLs with the same
parseUrlset/selectUrls as the cron and fails on anything but 200/202.
CRON_SECRET still guards /api/indexnow (the Monday cron and the /admin
button), which also writes the cron health record.

*Enforced by:* `test/inbound-return.test.mts`,
`test/conversion-detail.test.mts`, `test/indexnow-deploy.test.mts`

---

### ICBC's own counselling figures; stored markdown always renders; one next-consult line per article; Alberta resources close in Alberta
Decided 2 Oct 2026 (branch `wf/article-templates`, items 366, 370, 379, 383,
384, 385). (1) The ICBC page prints ICBC's own counselling figures, read 1 Oct
2026, from `ICBC_COUNSELLING` in `lib/session-arithmetic.ts`: 12 pre-approved
treatments; ICBC's rate per treatment of at least 50 minutes for 1 Apr 2026 to
31 Mar 2027; no referral; receipts reimbursed to ICBC's rate. The catalogue's
individual fee is set beside it. A test fails when ICBC's window lapses, so
the April re-read is forced. (2) Markdown links stored in lib copy always
render through rich(), including inside bold runs. JSON-LD gets plainText()
(`lib/plain-text.ts`), and quality-audit fails on any raw markdown link inside
<main>. (3) The next free consultation prints once per page: mid-article
where NEXT_CONSULT_AFTER names a section, otherwise in NextStep. (4) On
coverage pages the seasonal year-end block follows the first section, appears
in the TOC, and does not repeat session arithmetic the page already prints.
The Alberta copy names no BC insurer. (5) Alberta resources close with the
Recovery Alberta helpline and no BC link footer, and their midCtas say they
book. (6) The one-pager email form follows the closing next step on guides
and resources. `data/changes.json` reads book_click and lead_magnet_submit on
those pages on 30 Oct.

*Enforced by:* `test/book-cta-links.test.mts`, `test/seasonal.test.mts`,
`scripts/quality-audit.mjs`

---

### The EI sickness maximum is written once, by year; the practice states what listings get wrong; wider coverage wording gate
Decided 2 Oct 2026 (branch `wf/copy-figures-anchors`, items 364, 381, 386,
389). (1) The EI sickness weekly maximum is written once, in
`lib/benefit-figures.ts`, keyed by Pacific year: 729 for 2026 (MIE 68,900)
and 749 for 2027 (MIE 70,800, from the ESDC release of 14 Sep 2026). A page
states the figure for the build year. If a year has no entry, pages keep the
latest earlier year's figure with that year named. price-drift fails in that
case, when an entry is not 55% of MIE over 52, or when a weekly figure is
typed anywhere else, comments included. 729 is no longer on price-drift's
ALLOW list. Pages are static, so a deploy on or after 1 Jan is what moves them
to 749. (2) What third-party listings get wrong is now stated by the practice
on /faq (Getting started), in llms.txt (item 6 of six) and in ai.json `not`.
The answer gives no hours; the calendar on /book shows the real open times. A
listed phone number is deliberately not called an error, because the practice
publishes (604) 259-0810. (3) coverage-claims also rejects "Most <up to five
words> plans … reimburse" and "usually reimburses" an RCC or counselling. (4)
Anchors into the stress-leave cluster and verify-a-counsellor use the phrases
those pages rank for, and never a bare "RCC".

*Enforced by:* `test/benefit-figures.test.mts`,
`test/coverage-claims-wide.test.mts`, `test/no-hours-metadata.test.mts`,
`scripts/price-drift.mjs`

---

### Who finds out is answered once; the camera is optional; the consent form comes before session one; no evening wording in depth copy
Decided 2 Oct 2026 (branch `wf/book-faq-trust`, items 358, 361, 368, 380,
387, 388, 392, 393). (1) `lib/practice-facts.ts` holds WHO_FINDS_OUT (the
full answer) and WHO_SEES_A_CLAIM (one line), built only from claims /privacy
already makes. /faq (a new privacy-group question, so FAQPage carries it),
/book (a closed disclosure), /pricing (the claiming section), the
coverage-checklist email and nurture email 3 read them. The emails got copy
only: no new mail, no change to timing or sending. /faq's confidentiality
answer reads CONFIDENTIALITY_LIMITS. (2) CAMERA_OPTIONAL is /accessibility's
sentence, read by /accessibility, /faq, /book and the confirmation and
reminder mails. (3) /book?with=<a counsellor not taking clients> prints
notTakingLine() and names only who is accepting. (4) BEFORE_SESSION_ONE in
`lib/faq.ts`: the consent form puts the limits and the 24-hour rule in writing
before the first paid session, using "consent form" as /client-portal already
does. (5) Evening wording is gone from the depth and city x service copy and
the /book placeholder, and is gated over pair body, angle and FAQs and every
non-comment line of `lib/depth*.ts`, with a stale-checked allow-list for the
reader's own evenings. (6) The worded fallback MailLinks on /book show the
address; the sticky bar does not, for layout reasons. (7) The year-end page is
linked by name, not "booklet", and CoverageLine links it 15 Oct to 31 Dec.

*Enforced by:* `test/no-hours-metadata.test.mts`,
`test/service-languages.test.mts`

---

### A not-accepting profile sends readers to a ranked pair; /practitioners books from each row; Alberta clocks are computed; a counsellor comparison
Decided 2 Oct 2026 (branch `wf/profiles`, items 351, 355, 356, 360, 369, 376,
378). (1) When a profile is not taking new clients it points to a ranked pair
from alternativesFor() in `lib/practitioner-facts.ts`: first the accepting,
bookable colleague who shares one of her non-English languages, then the one
who offers what the first lacks. Both come from the roster and OFFERINGS, and
no reason for the status is ever given. (2) /practitioners lists accepting
counsellors first, each with status, lowest catalogue fee, the free
consultation, the next Cliniko opening (Pacific) and a "Book with {first}"
button (practitioners-row). It revalidates every 1800 seconds. (3) The English
place pages state her fees, the free consultation, what she does not offer and
the plan-dependent paid-at-booking line, plus a next-consult line
(place-practitioner); the "fee does not change with distance" sentences are
gone. The pa and tl variants are unchanged. (4) Times are never described as
Mountain Time. Alberta-facing answers print `lib/alberta-clock.ts`'s computed
sentence, which reads BC through `lib/pacific-time.ts`'s offsetMinutes (folded
at integration) so it cannot disagree with the /book note. The two Tagalog
Mountain Time FAQs were removed and wait for Camille's own wording. (5)
`middleware.ts` returns a 308 from a counsellor's Alberta place URLs (and their
/tl and /pa twins) to her profile on any day insuredProvinces lacks AB. (6)
`components/CounsellorCompare.tsx` is a generated comparison of the accepting
counsellors, open on /practitioners and closed on each profile, with no
registration numbers; an approach is listed only if its name appears verbatim
in her own training answer.

*Enforced by:* `test/counsellor-compare.test.mts`,
`test/profile-redirect.test.mts`

---

### Cards and consult lines book for the page's service; audiences pick by language and service; named anchors; the error pages book directly
Decided 2 Oct 2026 (branch `wf/services-cards`, items 354, 362, 367, 390,
391, 399). (1) Counsellor cards and next-consult lines take the page's service
and book through bookHrefFor: #calendar on every named link, plus for=couples
on couples pages. Typed /book?with= links in `lib/*.ts` must end in #calendar;
only the #ask-for-a-time and #form anchors are exempt. (2) Audience pages pick
counsellors by language and service, falling back to whoever offers the
service when no speaker does; couples audience pages quote the couples fee
line. (3) The Punjabi region pages and Tagalog city pages are linked from
their language service pages (and the Tagalog ones from both Filipino /for
pages) through one shared row whose labels come from the region data. (4)
Glossary links and service-card anchors name their target; cards link only
the "{name} in BC" line, stretched over the card, and the vague-anchor gate
ignores a trailing arrow. (5) The error pages link each accepting counsellor's
Cliniko calendar directly and show the email, after the crisis lines; the 404
names who is taking new clients, and a capitalised path that 404s gets one
client-side lowercase retry. The 404 carries links, not photo cards, because
Next embeds the not-found tree in every page's RSC payload.

Booking-location keys added this round (practitioners-row,
place-practitioner, counsellor-compare, counsellor-not-found) are appended
after every earlier key. The rule in `test/home-copy.test.mts` is that no
earlier key moves, not that 'calendar-alt' is last.

*Enforced by:* `test/book-cta-links.test.mts`, `test/link-anchors.test.mts`,
`test/error-routes.test.mts`, `scripts/smoke.mjs`

---

### Saanich gets its own pages, apart from Victoria
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Saanich has a hub, five city-service pages, both
counsellors' English place pages, a Punjabi region page and a Tagalog city
page. Its argument, which Victoria's page does not make: Greater Victoria's
largest municipality (117,735 in 2021, against the City of Victoria's 91,865)
is filed under "Victoria" by every listing, while what shapes counselling
here is its own: most of the UVic campus and Camosun's Interurban campus,
the Peninsula's older towns, and the region's largest Punjabi- and
Tagalog-speaking communities (2,655 of the Capital census division's 4,350
Punjabi mother-tongue speakers; 1,375 Tagalog, more than the City of
Victoria's 1,145). The Punjabi page argues scarcity: the counsellors who
work in the language are mostly across the water. Figures were read through
Statistics Canada's data service on 2 Oct, when the www12 Census Profile
pages returned 404 from here; they are cited at the Census Profile, as every
other city is.

`victoria-saanich` is no longer a retired town. A retired town's home must
name it in `communities`, and a hub does not list itself, so the old slug
moved to `PLACE_ALIASES` and 308s to `/online-counselling/saanich`. Victoria
no longer names Saanich or Sidney (its communities are now Esquimalt, Oak
Bay, Langford, Colwood and Sooke), links the Saanich hub and Punjabi page,
and its pair and Tagalog FAQs that asked about Saanich now ask about
Esquimalt and Oak Bay. Its Punjabi FAQ, which said no Island page could be
sourced, now points at the Saanich page. No /tl or /pa place twins and no
new Punjabi or Tagalog sentences; the Punjabi region test lists Saanich as a
region with no twin yet.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `scripts/smoke.mjs`, `npm run seo`
(redirect-shadow)

---

### Maple Ridge gets its own pages, with Pitt Meadows
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Maple Ridge has a hub, five city-service pages,
both counsellors' English place pages, a Punjabi region page and a Tagalog
city page. Its argument, which no neighbour's page makes: it is a city its
workers leave. In the 2021 Census 62% of employed Maple Ridge residents with a
usual place of work worked outside the city (80% in Pitt Meadows), 27% commuted
45 minutes or more and 90% went by car, so the choice is a counsellor near
home or near work, and each loses half the week. Coquitlam argues the commute
eating the time; this is the choice between two places, seen from the far
bank. The Punjabi page argues distance and says plainly that the community is
small (1,360 mother-tongue speakers, 1.5%); the Tagalog page states its 1,355
(1.5%) and that the Philippines is the most common birthplace of the city's
immigrants. Figures were read through Statistics Canada's data service on
2 Oct, when the www12 Census Profile pages returned 404 from here; they are
cited at the Census Profile, as every other city is.

`maple-ridge` leaves `retiredCitySlugs`, and `pitt-meadows` now 308s to the
new hub, which names it in `communities`. No existing hub named Pitt Meadows
or the Maple Ridge neighbourhoods, so no community moved; Langley and
Coquitlam add `maple-ridge` to `nearby`. The unmapped-retired example in the
tests and smoke is now `nelson`. The hub's crisis FAQ cites the Crisis Centre
of BC for 310-6789 and 9-8-8, and the Fraser Health Crisis Line to Options.
No /tl or /pa place twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `scripts/smoke.mjs`, `npm run seo`
(redirect-shadow)

---

### Vernon gets its own pages, and Kelowna stops answering for it
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Vernon has a hub, five city-service pages, both
counsellors' English place pages, a Punjabi region page and a Tagalog city
page. Its argument, which no neighbour's page makes: Vernon is not the far end
of Kelowna's line, as Penticton is, but the North Okanagan's own centre, with
a catchment of small towns (Coldstream, Armstrong, Spallumcheen, Enderby,
Lumby, Cherryville). Two things follow: privacy where the local counsellor may
be a neighbour, and a specialist line that runs south to Kelowna. The trauma
page rests on the 2021 White Rock Lake fire, worded as The Tyee reports it
(homes lost on the Okanagan Indian Band reserve and the northwest shore of
Okanagan Lake), not as "Vernon's edge". The Punjabi page argues scarcity and
says plainly the community is small (505 by mother tongue, 1.2%; 600 across
the census agglomeration); the Tagalog page states its 305 and the 490 counted
as Filipino. Figures were read through Statistics Canada's data service on
2 Oct, when the www12 Census Profile pages returned 404 from here; they are
cited at the Census Profile, as every other city is.

`vernon` leaves `retiredCitySlugs` and its `RETIRED_TOWN_HOMES` entry.
Kelowna drops Vernon from `communities`, adds `vernon` to `nearby` (hub and
city context), links the new hub from its "wider Okanagan" access line, and
its Vernon FAQs (hub, anxiety and depression pairs, Tagalog page) now ask
about Lake Country and point to Vernon's own page. Kelowna's Punjabi page links
the Vernon one. No other retired town moves: Salmon Arm stays with Kamloops,
West Kelowna with Kelowna, and West Kelowna is now the redirect example in the
tests and redirect-shadow. Okanagan College is placed on College Way in
Coldstream, as its own page gives it, rather than "overlooking Kalamalka
Lake", which its page says of the residence. The Interior Crisis Line Network
number is cited to the Interior Health access page that lists it. No /tl or
/pa place twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `scripts/smoke.mjs`, `npm run seo`
(redirect-shadow)

---

### Mission gets its own pages, and Abbotsford stops answering for it
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Mission has a hub, five city-service pages, both
counsellors' English place pages, a Punjabi region page and a Tagalog city
page. Its argument, which no neighbour's page makes: Mission is counted with
the Fraser Valley, and its services and nearest larger centre are across the
bridge in Abbotsford, but its working life points west. In the 2021 Census
about 36% of residents with a usual place of work worked in Mission and about
39% worked outside the Fraser Valley regional district (Abbotsford: 64% in the
city); nearly one Mission commuter in five travelled an hour or more each way
(Abbotsford: about one in twelve). Home, the Valley's services and the working
day are three places, which is the corner Maple Ridge's two-place argument
does not cover. The pairs take it from there: being an hour from home if
something goes wrong, a winter working day that begins and ends in the dark,
the federal institution in the district (Correctional Service Canada, medium
and minimum units), partners working in different regions, and EMDR as the
one session not to take from a parked car near work. The Punjabi page argues
distance and says plainly the community is 2,925 (7.1%), a few thousand
against Abbotsford's nearly a quarter; the Tagalog page states its 210 and
the 480 counted as Filipino. Figures were read through Statistics Canada's
data service on 2 Oct, when the www12 Census Profile pages returned 404 from
here; they are cited at the Census Profile, as every other city is.

`mission` leaves `retiredCitySlugs` and its `RETIRED_TOWN_HOMES` entry.
Abbotsford drops Mission from `communities`, adds `mission` to `nearby` (hub,
city context and Punjabi region), links the new hub from its "wider Valley"
access line, and its Mission FAQs (hub, anxiety pair, Tagalog page) now ask
about the rest of the Valley and point to Mission's own page; Abbotsford's
Punjabi page links Mission's. Abbotsford's Tagalog place twin keeps its
existing Tagalog FAQ, which is still true; no Tagalog was edited. No other
retired town moves: Hope stays with Chilliwack and Fort Langley with Langley,
and Fort Langley is now the mapped-redirect example in the tests and smoke.
The draft's no-hours and no-outcome edits were kept, and its commute copy was
rewritten where it had come out close to Maple Ridge's. No /tl or /pa place
twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/search-index.test.mts`,
`test/roster-nav.test.mts`, `test/link-anchors.test.mts`, `scripts/smoke.mjs`,
`npm run seo` (redirect-shadow)

---

### Courtenay gets its own pages, for the Comox Valley
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Courtenay has a hub, five city-service pages, both
counsellors' English place pages, a Punjabi region page and a Tagalog city
page. Its argument, which neither Victoria's nor Nanaimo's page makes: the
Comox Valley is a posting town around 19 Wing Comox, the primary air
search-and-rescue unit on the west coast and home to the Canadian Forces
School of Search and Rescue, in a valley small enough that people know each
other. Counselling here has to survive a move within British Columbia and stay
out of sight locally. The pairs take it from there: a walk-in public door
against structured anxiety work that needs the same slot for weeks, the partner
who followed a posting, cumulative rescue exposure, one career deciding where
both partners live, and EMDR that a move used to end midway. The Punjabi page
argues scarcity and says plainly the community is small (185 by mother tongue,
about 0.3%); the Tagalog page states its 315 and the 625 counted as Filipino.
The figures are for the Courtenay census agglomeration and the copy says so.
They were read through Statistics Canada's data service on 2 Oct, when the
www12 Census Profile pages returned 404 from here, and are cited at the Census
Profile, as every other city is.

`courtenay` leaves `retiredCitySlugs`. It had no `RETIRED_TOWN_HOMES` entry
and no hub named it in `communities`, so no old home changes; Victoria's
up-Island paragraph now links the new hub, and the Saanich Punjabi page lists
it in `nearby`. Campbell River stays retired and unmapped until its own page
lands. Squamish replaces Courtenay as an unmapped-redirect example in the
tests. Draft wording the sources did not support was reworded to what they
say (the Island Health team's walk-in description, Member and Family
Assistance Services by its own name, the search-and-rescue training centre).
EMDR, couples and language claims stay out of the hub's intro, access and
first five FAQs. No /tl or /pa place twins and no new Punjabi or Tagalog
sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `scripts/smoke.mjs`, `npm run seo`
(redirect-shadow)

---

### Langford gets its own pages, for the West Shore
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Langford has a hub, five city-service pages, both
counsellors' English place pages, a Punjabi region page and a Tagalog city
page. Its argument, which neither Victoria's nor Saanich's page makes: Langford
is a city of recent arrivals that commutes out. In the 2021 Census it grew
31.8% in five years against 8.0% for Greater Victoria, 42.7% of residents aged
five and over had lived in another municipality five years earlier, and 61.4%
of residents with a usual place of work commuted to another municipality,
along a Highway 1 stretch the Province calls prone to congestion. It is also
younger (median age 38.4 against 44.8). The pairs take it from there: anxiety
that attaches to the drive, low mood that arrives with a chosen move, a
same-day public single session against trauma work that needs months, two
commutes and young children, and the drive home after EMDR. The West Shore has
its own Island Health intake (Western Communities, formerly Westshore); that
page names the Western Communities but not Langford itself, so the copy says
"the Western Communities" and lets the phone call settle which team serves an
address. The Punjabi page argues scarcity and says plainly the community is
small (535 by mother tongue, about 1.2%); the Tagalog page states its 670 and
the 1,405 counted as Filipino. The figures were read through Statistics
Canada's data service on 2 Oct, when the www12 Census Profile pages returned
404 from here, and are cited at the Census Profile, as every other city is.

`langford` was never retired and never a town-home, so `lib/redirects.mjs`
does not change. Victoria stops naming Langford, Colwood and Sooke (its
communities are now Esquimalt and Oak Bay), adds Langford to `nearby`, and its
paragraph on nearer pages links the new hub; its trauma pair's "View Royal"
FAQ now names James Bay, since View Royal is on the Langford page. Draft
wording the sources did not support was reworded to what they say, the
310-6789 line is cited to the Crisis Centre of BC, and EMDR, couples and
language claims stay out of the hub's intro, access and first five FAQs. No
/tl or /pa place twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `test/snippet-facts.test.mts`, `scripts/smoke.mjs`

---

### Cranbrook gets its own pages, for the East Kootenay
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Cranbrook has a hub, five city-service pages, both
counsellors' English place pages, a Punjabi region page and a Tagalog city
page. Its argument, which no neighbour's page makes: the reader lives on a
different clock from the booking calendar in every season. The Regional
District of East Kootenay voted on 14 Aug 2026 to stay on Mountain Daylight
Time all year, and the Province's time-zone page (17 Sep 2026) lists
Cranbrook, Fernie, Sparwood, Invermere, Kimberley, Radium Hot Springs and
Elkford on UTC-6 all year while the rest of BC keeps Pacific time (UTC-7) from
1 Nov 2026. So the page tells the reader once: open times are Pacific, add an
hour. Golden and Creston are deliberately not in `communities`, since both keep
the calendar's clock. The second strand is the Elk Valley: four steelmaking
coal mines with about 5,500 jobs, and the rosters and site incidents that come
home with the crews. The pairs take it from there: being seen walking in,
rotations and resort seasons, an incident on site, a relationship on two
calendars, and no pass to drive after EMDR. The copy rests on the Province
page and does not say what Alberta's clock does in winter
(`lib/alberta-clock.ts`: sources disagree).

The Punjabi page argues scarcity and says plainly the community is small (120
speak Punjabi most often at home, 365 South Asian residents); the Tagalog page
states its 270 counted as Filipino and 90 by mother tongue. The figures were
read through Statistics Canada's data service on 2 Oct, when the www12 Census
Profile pages returned 404 from here, and are cited at the Census Profile, as
every other city is. The Punjabi file's header no longer lists the Kootenays
as out for want of a figure.

`cranbrook` leaves `retiredCitySlugs`. It had no `RETIRED_TOWN_HOMES` entry and
no hub named it or its towns, so no old home changes; Nelson stays on the
index, because it is West Kootenay and on the Pacific clock. Powell River
replaces Cranbrook as an unmapped-redirect example. EMDR, couples, Alberta and
language claims stay out of the hub's intro, access and first five FAQs. No
/tl or /pa place twins and no new Punjabi or Tagalog sentences.

Known gap, not fixed here: `timeZoneNote()` in `lib/availability-summary.ts`
reads the East Kootenay from `America/Edmonton`. If that zone falls back to
UTC-7 in winter, the /book note stops mentioning the East Kootenay from
November while this page says an hour ahead. That is a code change, left for
its own decision.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `scripts/smoke.mjs`

---

### Campbell River gets its own pages, for the North Island
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). Campbell River has a hub, five city-service pages,
both counsellors' English place pages, a Punjabi region page and a Tagalog
city page. Its argument, which neither Courtenay, Nanaimo nor Victoria makes:
the city is the end of one referral line and the start of another. Island
Health's Campbell River intake takes self-referrals for the city, Quadra,
Cortes, Gold River, Tahsis and Sayward, and a separate Northern Vancouver
Island intake serves Port Hardy, Port McNeill, Port Alice, Alert Bay and
Sointula; the North Island comes in to Campbell River, and Campbell River
looks down-Island for specialists. Cortes is two ferries from town. The
second strand is resource work on its own calendar, and the 30 June 2029 end
date for open-net salmon farming that Ottawa announced in 2024; the copy says
"announced" and "uncertainty", nothing firmer, because press reports in 2026
say the date has not been recommitted to. The pairs take it from there: a
work question nobody can answer yet, close calls on the water and in the
woods, a relationship split by rotations, EMDR out of reach rather than full,
and losing the shape of a life with the work.

The Punjabi page argues scarcity from the smallest base of any region page and
says so (155 by mother tongue, 95 at home, 535 South Asian residents); the
Tagalog page states its 400 counted as Filipino and 200 by mother tongue. The
figures were read through Statistics Canada's data service on 2 Oct, when the
www12 Census Profile pages returned 404 from here, and are cited at the Census
Profile, as every other city is. The hub's crisis answer lists only what the
cited Island Health page lists (9-8-8, the Vancouver Island Crisis Line and
the KUU-US line), and no hospital or same-day claim goes beyond its source.

`campbell-river` leaves `retiredCitySlugs`. It had no `RETIRED_TOWN_HOMES`
entry and no hub named it or its towns, so no old home loses a community, and
no retired town moves to it: Courtenay has its own page and Parksville and
Duncan stay with Nanaimo. Victoria's hub now links it where it used to name
it, and Courtenay lists it in `nearby` and in its city context. EMDR, couples
and language claims stay out of the hub's intro, access and first five FAQs.
No /tl or /pa place twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `test/city-hub.test.mts`,
`test/city-template.test.mts`, `scripts/smoke.mjs`

---

### North Vancouver gets its own pages, for the North Shore
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). North Vancouver has a hub, five city-service pages,
both counsellors' English place pages, a Punjabi region page and a Tagalog
city page. Its argument, which Vancouver's page does not make: the North Shore
is its own corner of Vancouver Coastal Health, with its own public front door
(the Central Intake Team at the HOpe Centre, on the Lions Gate Hospital
campus, for North and West Vancouver, Bowen Island and Lions Bay), and that
door asks for a referral from a family doctor or walk-in clinic first.
Vancouver's page argues cost; this one argues a referral step and a crossing.
The bridge counts are the Province's (about 60,000 and 125,000 trips a day),
the twelve-minute SeaBus is TransLink's, and "about two in three commuters
worked outside the municipality they live in" is the 2021 Census, which counts
City-to-District trips too, so the copy does not say they cross the inlet. The
pairs take it from there: anxiety and a crossing that might stall, a referral
sequence depression makes hardest to start, the gap below a psychiatric
service built for serious or persistent illness, a couple on Bowen and the
ferry, and an EMDR search narrowed by which side of the water a clinician is
on. The depression pair is titled "Depression Therapy" because "Depression
Counselling in North Vancouver | Westpeak Wellness" is 61 characters.

The Punjabi page argues distance and says plainly how small the community is:
745 by mother tongue across the City, the District and West Vancouver (335,
310, 100), 355 at home, about 0.4% of the Shore. It claims no count of local
Punjabi-speaking counsellors, because none was found; it argues size, privacy
and the two crossings to Surrey. The Tagalog page states its figures: 1,675 by
mother tongue in the City, third after English and Persian and ahead of
French, 3,815 counted as Filipino, 2,815 across the Shore. Figures were read
through Statistics Canada's data service on 2 Oct, when the www12 Census
Profile pages returned 404 from here, and are cited at the Census Profile, as
every other city is. No crisis line is named: VCH's North Shore pages list
only the provincial lines, and the hub sends people to 8-1-1.

`north-vancouver` leaves `retiredCitySlugs` and its `RETIRED_TOWN_HOMES`
entry. Vancouver's communities lose North and West Vancouver, Vancouver links
the new page from an access line and lists it in `nearby` and its city
context, and `west-vancouver` (still retired) now lands on North Vancouver,
which names it. Search ranks a title the query names in full above a longer
title that contains it, so "depression counselling vancouver" still opens on
Vancouver's page rather than North Vancouver's. EMDR, couples and language
claims stay out of the hub's intro, access and first five FAQs. No /tl or /pa
place twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `test/service-languages.test.mts`,
`test/search-index.test.mts`, `test/city-hub.test.mts`,
`test/city-template.test.mts`, `scripts/smoke.mjs`

---

### New Westminster gets its own pages, for the specialist over the line
Decided 2 Oct 2026 (owner decision of the same day: each city in the October
batch gets all ten pages). New Westminster has a hub, five city-service pages,
both counsellors' English place pages, a Punjabi region page and a Tagalog
city page. Its argument, which Burnaby's page does not make: Burnaby's is
about landing in the wrong public queue, and here the public door is in town
(Fraser Health's New Westminster Mental Health Centre on Sixth Street takes
self-referrals from adults, and Fraser Health announced the Urgent Care
Response Centre North at Royal Columbian in April 2025). What sits over a
city line or a river is the private specialist: Burnaby and Vancouver by
SkyTrain, Surrey over the stal̕əw̓asəm Bridge, and for Queensborough the
Fraser itself. The pairs take it from there: anxiety and a crowded train or
a bridge, low mood in a first year at Douglas College, the slower work after
an urgent-care visit, two hospital rosters and no shared hour, and the trip
home after EMDR processing. The depression pair is titled "Depression
Therapy" because "Depression Counselling in New Westminster | Westpeak
Wellness" is 61 characters.

Tagalog is the city's most common mother tongue after English: 3,270 single
responses of 78,270 (4.2%), ahead of Mandarin (2,950) and Punjabi (2,810),
and a larger share than in Vancouver, Burnaby, Surrey, Richmond or
Coquitlam. The Tagalog page states that figure. The Punjabi page argues
distance and states its size plainly (2,810, 3.6%, fourth after English,
Tagalog and Mandarin; 3,220 counting multiple responses), one river from
Surrey's 128,310. Figures were read through Statistics Canada's data service
on 2 Oct, when the www12 Census Profile pages returned 404 from here, and are
cited at the Census Profile, as every other city is. The Fraser Health Crisis
Line is cited to Options Community Services and 310-6789 to the Crisis Centre
of BC, as on Maple Ridge. The Sixth Street centre is cited at Fraser Health's
Mental Health Centres directory, which names it, rather than at a location
page headed for a different team.

`new-westminster` leaves `retiredCitySlugs` and its `RETIRED_TOWN_HOMES`
entry. Burnaby's communities lose New Westminster, Burnaby links the new page
from an access line and lists it in `nearby` and its city context. No other
retired town moves: Port Coquitlam and Port Moody stay with Coquitlam. Burnaby's
Tagalog place twin still asks, in Tagalog, whether New Westminster is covered;
that stays true and is left for review rather than edited here. EMDR, couples
and language claims stay out of the hub's intro, access and first five FAQs.
No /tl or /pa place twins and no new Punjabi or Tagalog sentences.

*Enforced by:* `test/regional-pages.test.mts`, `test/roster-nav.test.mts`,
`test/link-anchors.test.mts`, `test/service-languages.test.mts`,
`test/city-hub.test.mts`, `test/city-template.test.mts`, `scripts/smoke.mjs`

---

### Ten more BC cities get their own pages
Decided 2 Oct 2026. Saanich, Maple Ridge, Vernon, Mission, Courtenay,
Langford, Cranbrook, Campbell River, North Vancouver and New Westminster each
have ten pages: a hub, five city-service pages (anxiety, depression, couples,
trauma, EMDR), both counsellors' English place pages, a Punjabi region page
and a Tagalog city page. Each city's entry above holds its sources and its
redirect changes; this one records what the batch decided as a whole. Each
page stands on one argument that no neighbour's page makes:

| City | The argument |
|---|---|
| Saanich | Greater Victoria's largest municipality, filed under "Victoria" by every listing, with its own campuses, Peninsula towns and the region's largest Punjabi- and Tagalog-speaking communities. |
| Maple Ridge | A city its workers leave: a counsellor near home or near work, and each loses half the week. |
| Vernon | The North Okanagan's own centre, not the far end of Kelowna's line: privacy among neighbours, and a specialist line that runs south. |
| Mission | Counted with the Fraser Valley, served across the bridge, working west: three places, not two. |
| Courtenay | A posting town around 19 Wing Comox, where counselling has to survive a move and stay out of sight locally. |
| Langford | A city of recent arrivals that commutes out, with its own Western Communities intake. |
| Cranbrook | The reader lives on a different clock from the booking calendar in every season. |
| Campbell River | The end of one referral line and the start of another, with resource work on its own calendar. |
| North Vancouver | Its own corner of Vancouver Coastal Health, whose public door asks for a referral first, and a crossing to everything else. |
| New Westminster | The public door is in town; the private specialist is over a city line or a river. |

**Small language communities (the owner's decision, 2 Oct 2026).** Every city
in the batch gets its Punjabi and Tagalog pages, including those where the
community is small. Those pages state the real 2021 Census figure plainly
(Campbell River's 155 Punjabi mother-tongue speakers, Cranbrook's 90 Tagalog)
and argue honestly: few same-language counsellors locally, and video reaches
one. They do not inflate the community or claim a local count nobody has. The
earlier rule that a language city is chosen only where the community is
"substantial" is replaced, and `lib/tagalog.ts` and `lib/punjabi-regions.ts`
cite this decision in their headers. Census figures were read through
Statistics Canada's data service on 2 Oct, when the www12 Census Profile pages
returned 404 from here, and are cited at the Census Profile URL pattern every
other city uses, so the citations are consistent; the figures are as read.

**Retired slugs that became pages.** `maple-ridge`, `vernon`, `mission`,
`courtenay`, `cranbrook`, `campbell-river`, `north-vancouver` and
`new-westminster` left `retiredCitySlugs` and now answer 200 where they used
to 308. `victoria-saanich` moved to `PLACE_ALIASES` and 308s to the Saanich
page. `pitt-meadows` now lands on Maple Ridge and `west-vancouver` on North
Vancouver, each of which names it. `langford` was never retired. The old home
hubs (Victoria, Kelowna, Abbotsford, Vancouver, Burnaby) stopped naming the
towns that now have pages and link them instead.

**Template fixes made for the batch** (commit 12936f0, before the first city):
the hub title gains an "Online, Virtual Counselling <city> | Counsellors" rung
for names of 14 characters or more, and the Tagalog city title drops ", BC"
where it would pass 60; place pages list only the counsellor's own services,
filtering hub copy by roster services as they already filtered languages, so
Savneet's pages no longer offer couples work or EMDR in their copy or meta
description; Tagalog city pages are dated by their own `tagalogCities`
collection on screen, in schema, in the sitemap and in llms-full; and the
Punjabi index reads its twin and city counts from the data rather than a
typed "fifteen". The two 15-character cities title their depression pair
"Depression Therapy" through `titleName`.

**Why Alberta is not in the batch.** Alberta is gated on professional
liability insurance (see "Alberta is gated on insurance" above): `/alberta`
stays closed, the founder's cover does not reach it, and Savneet is BC-only,
so an Alberta city could have at most Camille's place page, not ten pages.
The hub, pair and Tagalog templates are also written for BC health
authorities and BC crisis lines.

No /tl or /pa place twins were added and no new Punjabi or Tagalog sentences
were written.

*Enforced by:* `test/regional-pages.test.mts`, `test/city-hub.test.mts`,
`test/city-template.test.mts`, `test/service-languages.test.mts`,
`scripts/uniqueness-gate.mjs`, `scripts/redirect-shadow.mjs`,
`scripts/smoke.mjs`

---

### The leave pages say whose law gives which leave; "stay at work services" is answered on the employer page
Decided 3 Oct 2026 (branch `wf/tp-leave`), from the 3 Oct Search Console
export. (1) The stress-leave cluster had 596 impressions, 0 clicks, at an
average position of 15.7, and the results above /guides/stress-leave-bc quote
"27 weeks of unpaid, job-protected leave" without saying it is the Canada
Labour Code's, which covers federally regulated employers only. The guide now
carries "Which leave rules apply to you: BC, federal or union" and an FAQ, "Is
there a 27-week stress leave in BC?". The figures were checked on 3 Oct
against canada.ca IPG-118 (10 paid medical days: 3 after 30 days, then 1 a
month; certificate after 5 consecutive days) and s. 239(1) (27 weeks). The
same guide called the five ESA days "unpaid", contradicting its own step list
and gov.bc.ca; it now says five paid and three unpaid after 90 days, as do the
workplace resource and the sick-days guide. A test fails if "27 weeks" appears
in the guide without the federal attribution. (2) "stay at work services" (63
impressions at 38.8) is an employer's query: the results above it are an
insurer's product page, WorkSafeBC's Return to Work Support Services provider
list and an occupational-health office. The definition and who provides the
service in BC now live on /for/employers-and-hr ("Stay-at-work services in BC:
who provides them", plus an FAQ). /resources/workplace-mental-health-bc keeps
the employee's side under "If you are offered a stay-at-work plan", and each
page links the other's section by anchor. This partly reverses the 25 Sep
choice to answer the phrase on the employee page, because two pages were
defining one phrase. The practice is stated not to be a stay-at-work provider.
(3) The WorkSafeBC resource gains the mental-disorder presumption and the
eleven occupations added on 10 June 2024, from WorkSafeBC's own pages, under a
heading that says "WCB stress leave" in qualified form. "Stress leave" stays
out of its title, as the 1 Oct decision requires. (4) No titles changed: all
were set on 1-2 Oct and the next export reads against them. Before figures:
hub 50 impressions at 9.78; workplace resource 2104 at 10.45; WorkSafeBC 41 at
13.78; sick days 419 at 7.18; EI 297 at 8.19; disability 75 at 15.32.

*Enforced by:* `test/leave-cluster.test.mts`, `scripts/price-drift.mjs` (no
typed EI figure), `scripts/coverage-claims.mjs`, the next `data/gsc/` export
read against the figures above

---

### The RCC page carries the definition; the comparison links to it; Alberta coverage names what the government does pay
Decided 3 Oct 2026 (branch `wf/tp-rcc`). Search Console 3 Oct:
/resources/verify-a-counsellor-in-bc 1,581 impressions at 13.55, 6 clicks;
"registered clinical counsellor" 317 at 23.5 and "registered counsellor" 124
at 28, no clicks. Those queries were landing on both the RCC page and
/compare/rcc-vs-psychologist-vs-social-worker-bc, which re-defined the
designation in four paragraphs. The comparison now summarises the designation
and links the RCC page in its body. The RCC page carries a definition table
and BCACC's count (10,000 RCCs, about 90% of BC clinical counsellors, BCACC
release of 12 Aug 2026). Its description names the head query and how to find
one. The glossary's RCC entry points at it. Title unchanged.

/compare/psychologist-vs-psychiatrist-bc stops quoting a typed "$225–$300+"
range and reads BCPA's rate from lib/fee-guides.ts. It gains a Royal College
training row and is linked from five neighbouring pages.

/resources/counselling-coverage-in-alberta names what Alberta's government
does fund: the Non-Group Coverage psychologist benefit (up to $60 a visit,
$300 per family each benefit year) and Counselling Alberta (sliding scale).
Both were read at source on 3 Oct 2026. The premium figure is left out because
the catalogue price scan rejects untracked dollar amounts. The Alberta check
page answers whether psychotherapy is regulated there (announced 1 March 2024,
no proclamation date).

*Enforced by:* `test/rcc-cluster.test.mts`, `test/link-anchors.test.mts`,
`test/claims-corrections.test.mts`

---

### The Punjabi words page answers in English first; /about says the practice is not recruiting
Decided 3 Oct 2026 (branch `wf/tp-language-brand`), from the 3 Oct Search
Console export. /resources/counselling-in-punjabi-what-the-words-mean had
1,036 impressions at position 8.8 and one click. Every query asks for a
meaning ("counselling meaning in punjabi" 248, therapy 65, consult 61,
counselor 56, "salah mashwara in english" 56), and the description opened in
Gurmukhi. The description now gives the answer in English first. Both word
tables lead with an English column, as a dictionary result does. A "Counsel,
advice" row and FAQ reuse the page's existing gloss of ਸਲਾਹ, and the
salah-mashwara answer separates it from salah, the prayer. The mid-page prompt
bridges from the word to a consultation with the Punjabi-speaking counsellor.
The title is unchanged, and no new Gurmukhi words or translations were
introduced. /careers still drew 639 impressions and 35 clicks for BC
counselling-job searches while 308ing to /about. /about now carries one line,
in the owner's 1 Sep terms, saying the practice is not recruiting and not
taking speculative applications. This does not reopen the careers page. The
/about direct answer no longer implies couples or EMDR work in Punjabi.

*Enforced by:* `test/language-brand-oct3.test.mts`

---

### EMDR is priced at its weekly session; the intensive is the second format
Decided 3 Oct 2026 (branch `wf/tp-modalities`), from the 3 Oct Search Console
export. /services/emdr-therapy (105 impressions at 31.8, no clicks) showed
"$190 per 90-min session" in its search result, and every EMDR city page
opened "Sessions are $190 for 90 minutes". That is the EMDR Intensive. Most
EMDR is taken weekly and billed as an Individual Counselling session
(OFFERINGS in lib/practitioner-facts.ts). This is the same trap the trauma
city pages were taken out of on 1 Oct. Both BILLED_AS maps
(app/services/[slug]/page.tsx and lib/city-service-page.ts) now bill
emdr-therapy as Individual Counselling. The service page shows the intensive
beside it (EXTENDED_AS, labelled weekly and intensive). The EMDR city pages
offer it through LATER_OPTION with their own sentence. The 1 Oct test that
EMDR city fees must differ from individual fees is reversed; couples still
must differ. Also decided the same day: Kamloops trauma is titled "Trauma
Counselling", because two exports carried only that wording ("trauma
counselling kamloops" 21 at 36 on 17 Sep, 8 at 36.75 on 3 Oct). Couples copy
answers "Is this Gottman Method couples therapy?" as Gottman Method-informed,
with no level claimed until owner item #67 records one.

At integration the same day, two claims flagged by the builders were
corrected: the Kamloops anxiety FAQ said narrative therapy was part of the
work, which no counsellor's profile lists, so it now says ACT is part of
Savneet Singh's training and narrative therapy is not offered here; and
/for/first-responders no longer calls EMDR "first-line", since the APA
guideline rates it conditionally.

*Enforced by:* `test/city-service-page.test.mts` (EMDR fee equals the weekly
individual fee; the EMDR later-option line), `test/service-languages.test.mts`
(titled pairs), `test/snippet-facts.test.mts`, `scripts/price-drift.mjs`
(BILLED_AS names)

---

### City hubs answer the local question, show the fee beside the counsellors, and one hub may carry its own title
Decided 3 Oct 2026 (branch `wf/tp-places`), from the Search Console export of
3 Oct.

**A hub may override its composed title when its searches do not say
"online".** `Location.hubTitle` is used ahead of `cityHubTitle()`; only
Kamloops uses it ("Kamloops Therapists & Counsellors | Online Therapy"). 36 of
Kamloops's 42 impressions were "kamloops therapist", "therapy kamloops" and
"counsellor kamloops" at 58-77. The hub itself was shown 4 times, while the
depression and trauma pair pages took the generic queries at 45-60. The field
is named `hubTitle`, not `title`, because `MoreFrom` labels chips with `title
?? name ?? city`. The first build put the search title on every "Other areas
served" chip, and a test now forbids either field on a Location. Every other
hub keeps the 17 Sep / 1 Oct title ladder.

**The hub's counsellor cards carry the catalogue fee** (`feeLineFor`, as the
guide, resource and audience templates already do) and link /pricing. The
directories that hold the top of these results print a fee on every card.
Before this, our hubs stated the fee only in the meta description and the FAQ
at the foot.

**FAQ answers on the hubs may contain links.** They render through `rich()`
and are written into FAQPage as `plainText()`, the pattern the article
templates adopted on 1 Oct.

**/online-counselling answers the questions it is shown for**
(lib/bc-hub-faqs.ts): waitlist, referral, whether "counsellor" is a protected
title (regulation from 29 Nov 2027), and the client sign-in. Its H1 now says
"in BC". Its direct answer no longer types an Alberta clause, because Alberta
reach is gated on insurance and is said only where `serviceAreaLine` generates
it. Its hero button is counted (`hero-online`).

**Local free-option answers are sourced and dated.** Kamloops names Interior
Health's self-referral line (310-MHSU). Prince George names Foundry's drop-in
for ages 12-24 and the CMHA pilot paused on 31 Mar 2026. Both were read on the
official pages on 3 Oct 2026. Intake hours of third-party services are
deliberately not typed.

*Enforced by:* `test/places-topics.test.mts`, `test/snippet-facts.test.mts`,
`test/service-languages.test.mts`, `scripts/seo-audit.mjs`

---

### Page-one informational snippets carry the fee; "BC and Alberta" and "often covered" are never typed
Decided 3 Oct 2026 (branch `wf/r6-snippets-content`). The plan-coverage, MSP
and waiting-time pages, which rank on page one, now end their meta description
with a generated "{fee} per {minutes}-min session · free 30-min consult" line
(`feeSnippet`, no names, because the leads plus names exceed 155 characters).
The home page has its own description built with `practiceSnippet`. The
Alberta coverage page names the one counsellor insured for Alberta, with her
CCC and fee, only while `insuredProvinces` includes AB; otherwise it falls
back to a line with no name and no fee.

**Coverage wording.** "Often" joins "most" as a prevalence claim the coverage
gate rejects: a coverage answer opening "Often,", "plans … often
cover/reimburse" without "depending on the plan" in the same sentence, and
"often reimbursed by … plans". Every cost answer uses the `PLAN_COVERAGE`
constant in `lib/practice-facts.ts`.

**Reach.** "BC and Alberta" is never typed. `servedProvinces()` and
`reachesAlberta()` build it from the gated roster, and
`scripts/coverage-claims.mjs` fails on a typed "(BC|British Columbia)
(and|or) Alberta" in lib/, app/ or components/, comments excluded. Three
reasoned exemptions (the access tool's scope, the no-dataset sentence, an
internal mail label) and two pending files owned elsewhere
(`app/for/page.tsx`, `lib/resources-tagalog-words.ts`), plus one pending
"often partly covered" line in `lib/guides-drafts.ts`, are listed in the
script. `lib/tools.ts` reaches client bundles, so it does not import the
roster; its reach sentence was rewritten so that it is not a reach claim.

**Titles.** No metaTitle may type a year (`test/meta-title-year.test.mts`);
the sick-days and medical EI titles take theirs from `pacificYear()` and
`eiSicknessMax()`. Title changes, with before and after recorded under the
new `title-changes` key in `data/gsc/snippets.json`: the coverage resource,
medical EI, the Punjabi service, /for/men and high-functioning anxiety.

**Evidence.** The new couples FAQ on video counselling rests on one RCT
(Kysely et al. 2022, Frontiers in Psychology, 30 couples, one therapist, read
on PMC 3 Oct 2026) and says how small that is. The AI comparison's cost cell
states this practice's catalogue fee and the BCACC fee guide; it quotes no app
price, because none was read from a vendor.

No noindex, redirect or consolidation.

*Enforced by:* `scripts/coverage-claims.mjs` (run by `seo-audit`),
`test/meta-title-year.test.mts`, `test/snippets-oct3.test.mts`

---

### Every "Book with {name}" ends at her calendar; replies and acknowledgements carry Cliniko's next days
Decided 3 Oct 2026 (branch `wf/r6-book-paths`). Every hand-built booking href
now goes through `bookHrefFor` and ends in `#calendar`: the profile, the place
pages, the pa and tl twins and the Tagalog guides (which fall back to bare
/book when no speaker exists rather than building `?with=`).
`test/book-cta-links.test.mts` scans app/**/*.tsx for a hand-built or typed
`/book?with=` link missing `#calendar`. The profile's "Next open" days are
links (book_click location `next-practitioner`).

**Mail.** Enquiry acknowledgements list each routed counsellor's next three
free consultation days (from Cliniko, Pacific time, days only; left out when
the read fails or finds nothing; the read gives up after 2.5 s). The alert to
a single routed, accepting counsellor carries a `mailto:` reply draft: her
days, her calendar, her catalogue fees narrowed to her own services, signed
with her first name. The site sends nothing new and adds no mail type; the
draft goes nowhere until she sends it herself.

**Closed profiles.** A profile not taking new clients says so in its meta
description and names the first accepting colleague who shares a non-English
language (`lib/closed-profile-snippet.ts`). No reason and no dates.

**Pages.** /punjabi names Savneet in one English line under the Gurmukhi
button, with her next free day as a link (`hero-next-language`); no new
Punjabi prose. /message-sent no longer says "solo practice" or "always within
two", tells people to reply to their copy rather than resubmit, and links the
next free calls (`next-message-sent`). Both pages revalidate every 1800 s.

**Counting.** New counted event `book_arrive` (details: roster slug, `none`,
`ask`), fired once per session on /book, so /admin and the weekly table show
/book stage by stage (arrived, calendar opened, touched, booked). "Calendar
opened" is practice-wide only, because `scheduler_open` carries no
counsellor. Counts only.

Nothing is noindexed, redirected or consolidated.

*Enforced by:* `test/book-cta-links.test.mts`, `test/book-arrive.test.mts`,
`lib/conversion-detail.ts` (`BOOK_LOCATIONS`, `ALLOWED`)

---

### City-service pages drop the blocks they shared; the uniqueness floor rises to 25%
Decided 3 Oct 2026 (branch `wf/r6-city-dedup`; items 415, 422, 432, 433, 437,
449, 464). Consolidation rules, with counts:

1. Section 3 of the 100 city × service pages no longer renders the service
   intro, its "commonly used for" list or its approach paragraph. Kept: the
   h2, the service figure, and the links to the service or condition page,
   /tools/which-service and the first-session guide. In the built HTML that
   block was identical on each service's 20 pages and was 16.7% of all
   city-service text.
2. The "Other counselling in {city}" list prints the link only, not each
   sibling's angle, on all 100 pages. Before, every angle appeared on 5 pages.
3. The generated "Who would I see for {svc} in {city}?" and "What does {svc}
   cost in {city}, and will my plan cover it?" FAQs are removed from the
   visible FAQ and FAQPage on all 100 pages (80 copies each, plus 20 trauma
   variants). The BCACC range and the coverage sentence moved into the
   existing fee line (`guideNote`, `COVERAGE_LINE`). The 27 city hubs keep
   their own generated who/cost FAQs.
4. `MIN_UNIQUE_SHARE` for city-service pages rises from 0.18 to 0.25: min
   25%, median 31%. There is no headroom; any shared text added to these
   pages fails the gate. Counsellor place pages keep 0.18 as
   `PLACE_MIN_UNIQUE_SHARE` (their min is 24%).
5. Descriptions are composed as the pair's angle (cut at a whole clause, else
   at a word with an ellipsis), then "With {first names},", then
   `serviceSnippet`. 23 of 100 still end the angle with an ellipsis. No two
   descriptions may share more than 60% of their word 4-grams (current max
   54%).
6. New pairwise ceilings in `scripts/uniqueness-gate.mjs`: /tl twins 0.50,
   /pa twins 0.52 (temporary; target 0.50), Tagalog cities 0.40, hub vs hub
   0.40, Punjabi regions 0.30.
7. `uniqueness-gate.mjs --gsc`, run by `npm run seo`, reports pages live 42
   or more days with no impressions, with their nearest neighbour. Report
   only: it noindexes, redirects and consolidates nothing. Today it lists 34
   pages across 6 exports.

**Sourced additions, read 3 Oct 2026.** Nine anxiety and depression pairs
carry a condition-specific public route in place of the shared
health-authority paragraph: Chilliwack, Langley, Kamloops and Prince George
(both conditions) and Victoria (depression), each cited in
`PUBLIC_ROUTE_SOURCES`. The Surrey hub answers free counselling (SFU Surrey
Community Counselling; Fraser Health's Surrey MHSU centre, not called free
because its page states no cost). The RCC vs psychologist comparison answers
how to find a registered psychologist (BCPA Find a Psychologist, the CHCPBC
registry). No hours and no outcome claims.

*Enforced by:* `scripts/uniqueness-gate.mjs`, `test/city-dedup-oct3.test.mts`,
`test/city-service-page.test.mts`

---

### The founder's BCACC entry leaves her sameAs; the listings pack stops sending the owner to paid directories
Decided 3 Oct 2026 (branch `wf/r6-offsite-ai`; items 411, 416, 443, 444, 455,
463, 468).

**sameAs.** On 3 Oct the founder's BCACC Find a Counsellor entry said
in-person, telephone and Surrey. The site offers video only, and an AI answer
to the brand query repeated the entry's facts. Person.sameAs tells an engine
that page is her, so the URL is withdrawn under the same rule as the
Psychology Today URLs on 1 Oct. Her LinkedIn stays. The credential's
verifyUrl (the register) is a link, not a sameAs, and is unchanged.
`test/practitioner-sameas.test.mts`, cited by earlier comments but never
created, now fails any sameAs URL without a VERIFIED row recording the URL,
the date it was read and what it said. A REJECTED URL cannot return without a
newer read. Re-add the BCACC URL after item 403, once she has edited the
entry and it has been re-read.

**Listings.** Counselling BC is paid (a free first month, then an annual
fee), so it is item 4 as the owner's decision, not a free listing. Theravive
($10 a month, or free in exchange for a link: a link scheme) and First
Session ($500 plus 25%) are removed. Added: CCPA Find-a-CCC (Camille, within
the membership she already holds), AMHC (free; each counsellor applies only
if she identifies as Asian), and EMDR Canada/EMDRIA (only an existing
membership). A dated "Checked 3 Oct 2026, not eligible or paid" list covers
bc211, HealthLink, Healing in Colour, Inclusive Therapists, South Asian
Therapists, Counselling BC, Theravive, First Session and TherapyDen's paid
tier. bc211's criteria were read at source: non-profit, community,
government, or government-contracted free or low-cost services.

**Gated copy.** The 3 Oct outreach drafts are now docs/OUTREACH.md §8-13 and
the LISTINGS_PACK field blocks, where coverage-claims, the couples-method
check and no-hours read them. All pass. OFFSITE_KIT_2026-08-27.md is not in
either gate's ROOTS; it still says "15-minute" consultation and carries US$
directory prices and an RCC number in a field table. Reported, not yet fixed.

**Measurement.** Fourteen new referrer hosts are classified
(listing/org/press). indocanadianvoice.com no longer resolves and is replaced
by voiceonline.com. ctr-delta prints AI-Mode-style follow-ups as their own
series: 18, 28, 38, 41 queries from 6 Sep to 3 Oct. scripts/bing-ai.mjs and
an /admin line read Bing AI Performance exports from
data/bing/<date>-ai-*.csv and report "no Bing export yet" until one exists.

Nothing is noindexed, redirected or consolidated.

*Enforced by:* `test/practitioner-sameas.test.mts`,
`test/referrer-hosts-oct3.test.mts`, `test/bing-ai.test.mts`,
`scripts/coverage-claims.mjs`, `test/no-hours-metadata.test.mts`,
`test/gottman-method-claims.test.mts`

---

### Content pages are fully static; Cliniko times are filled in by the browser
Decided 3 Oct 2026 (branch `wf/r6-static-speed`; items 429, 409, 441, 470 in
part, 471).

**Rule.** No indexable public route may export `revalidate` or read Cliniko
during the server render; `scripts/inline-css.mjs --check` fails the build if
one does. Exceptions by name: /refer/counsellors, /refer/doctor,
/refer/handout and /for/employers-and-hr/one-pager. noindex pages may
revalidate.

**Counts.** On main, 317 prerendered routes revalidated (312 at 1800 s, 5 at
3600 s) and lost the inlined CSS after their first regeneration. After this
change, 0 indexable routes revalidate; 5 remain (the 4 named above and
/message-sent, which is noindex). revalidate was removed from 14 route files:
app/page.tsx, guides/[slug], resources/[slug], compare/[slug], pricing,
services/[slug], for/[slug], practitioners/page.tsx, practitioners/[slug],
practitioners/[slug]/[place], online-counselling/page.tsx,
online-counselling/[city], online-counselling/[city]/[service],
punjabi-counselling/[region]. /pricing was rendered per request
(searchParams) and is now prerendered. At integration /punjabi, which
`wf/r6-book-paths` had set to revalidate every 1800 s for its next free day,
was made static the same way (`NextFreeDay`), so the "both pages revalidate"
line of the book-paths entry now holds for /message-sent only.

**Consequences decided with this.** Catalogue fees and date-gated lines are
set when the site is built. A price change in Cliniko, the /pricing plan-year
line (shows from 15 Oct), seasonal resource sections, and insuredProvinces /
insuranceLine (a policy with validTo 2026-10-01 lapses after its 14-day grace
on 15 Oct) take effect with the next deploy, not within the hour.

**409.** The next free day prints once per page, under the hero button of
guides, resources, comparisons and /pricing (`hero-next-article`), instead of
in the closing block or the five mid-article spots. Where one counsellor
fits, the button names her and her languages from the roster. Registered as
change 2026-10-03-hero-next-article. Item 414's line under the waiting
guide's short answer is the same line; at integration it became this hero
line, a few lines lower, still once per page. The profile's "Next open" days
stay links to her calendar (`next-practitioner`), now filled in by the
browser.

**441.** Chrome links (header, trust bar, footer, city chips) do not
prefetch; booking links do.

**471.** live-speed.mjs is the last step of verify:weekly.

**Blocked.** Item 430 (place-page cut, 0.35 containment ceiling) waits for a
Google-selected canonical for the Victoria, Richmond, Coquitlam, Delta and
Nanaimo hubs; nothing was built.

Nothing is noindexed, redirected or consolidated.

*Enforced by:* `scripts/inline-css.mjs --check`, `scripts/smoke.mjs`,
`test/static-speed.test.mts`, `test/live-speed.test.mts`,
`test/book-cta-links.test.mts`

---

### Social cards are crawlable, hreflang runs both ways, lastmod is per page, and the sitemap is an index
Decided 3 Oct 2026 (branch `wf/r6-crawl-signals`; items 410, 440, 448, 450).

1. **The social card is crawlable.** robots.txt disallowed /opengraph-image
   and /*/opengraph-image for every agent from df53a32, with no recorded
   reason. Every page's og:image and its Article/Organization JSON-LD image
   point at those URLs. The Disallow now applies only to 11 named training
   crawlers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended,
   Applebot-Extended, Meta-ExternalAgent, meta-externalagent, Bytespider,
   CCBot, cohere-ai, AI2Bot). * and every search, preview and retrieval bot
   get Allow: / only. Pages affected: every page with an og:image (seo-audit
   counted 1,740 blocked image references on main's build). The card is now a
   framed 300x470 crop of a softened copy of the still-water photo, at
   210-225 KB instead of 611 KB. seo-audit fails if any og:image or JSON-LD
   image matches a Disallow for * or Googlebot.
2. **hreflang only between real translations, and only both ways.** The
   Tagalog caregiver guide (pagod-sa-pag-aalaga) no longer pairs with
   /guides/burnout-vs-depression; that pair belongs to
   depresyon-o-pagod-lang. The 4 Punjabi guides lose their en-CA/x-default
   alternates in the page and the sitemap, because they were written, not
   translated, and the English guides never named them back. Their visible
   English link and translationOfWork stay. 10 one-way alternates on 5 pages
   removed, 0 added. seo-audit now fails on one-way, duplicate-language or
   missing-self alternates, and on any page whose sitemap cluster differs
   from its HTML cluster.
3. **lastmod is per page.** A page's date is the day the visible words of its
   <main> last changed: dates, clock times and the Cliniko next-consultation
   line are excluded. It is recorded in data/page-hashes.json and generated
   into lib/url-dates.ts by `npm run hashes` after a build. The collection
   date from page-dates.mjs is the fallback for a page not yet hashed, and
   for the 4 pages rendered on demand (/pricing, /contact, /book, /refer).
   The first seeding kept every existing sitemap date, then backdated pages
   whose rendered text matched a 2 Oct build (7e7c308) to that build's date:
   98 URLs moved earlier and none later. Workflow: after content changes run
   `npm run build && npm run hashes && npm run dates`, and commit all three
   outputs. Known gap: JSON-LD dateModified and the visible "Updated" line on
   collection pages still read collection dates.
4. **/sitemap.xml is a sitemap index** of 7 per-template children at
   /sitemaps/<part>.xml: core 47, guides 99 (guides, resources, compare,
   for), city-hubs 27, city-services 100, places 56, communities 39 (Punjabi
   regions and Tagalog cities), languages 47 (pages written in pa/tl). Same
   415 URLs and image rows. The part is derived from the path in
   lib/sitemap-shape.ts partOf. Edit lib/sitemap.ts, not the route.

No noindex, redirect or consolidation of any page.

*Enforced by:* `scripts/seo-audit.mjs`, `test/crawl-signals.test.mts`,
`scripts/sitemap-parity.mjs`, `scripts/expansion-verify.mjs`,
`scripts/page-hash-dates.mjs --check`

---

### Payment is read from Cliniko invoices, never assumed from the appointment type (3 Oct 2026)

The owner found a paid Individual Counselling appointment (id 2053155793196288137, booked 3 Oct at 12:34 pm) with no Cliniko invoice and no Stripe charge. At the same time, the booking notice for every paid type said "the card is taken by Cliniko at booking". An audit found that the site never creates appointments. /book embeds Cliniko's hosted booking page, which carries Cliniko's own card step, and the only Cliniko write in the code is the patient reminder-preference PATCH. So that appointment was made inside Cliniko, or Cliniko's payment step did not run. Decided:

1. "Paid" means an invoice linked to that appointment that is closed or Paid, is not refunded, credited, voided or written off, and covers at least the catalogue fee (`lib/payment-status.ts`). Anything less is NOT RECEIVED. Anything that cannot be read is "could not be checked", and is never treated as paid.
2. The booking notice prints `Paid: $X (Cliniko invoice #N)` or `Payment: NOT RECEIVED (expected $X)`.
3. The booking cron sends one internal notice to info@ for each upcoming paid-type appointment without payment (ledger key `unpaidAlerted`). The notice gives client initials only and never goes to the client.
4. `/admin/unpaid` and `npm run unpaid` list the same rows, read only.
5. `test/no-appointment-writes.test.mts` fails the suite if any code writes to a Cliniko appointment, booking or invoice endpoint. The site therefore cannot be the source of an unpaid booking, and payment stays Cliniko's job (Stripe through Cliniko's booking page).

Cliniko's API has no payments endpoint, and this project holds no Stripe key, so the notice names the Cliniko invoice and not a Stripe reference.

### Free consultation is 15 minutes; Camille's area follows her provinces; one cancellation rule (3 Oct 2026)

This is the owner's decision, and it replaces the 30-minute consultation and the 8 Sep "Camille can see anyone from Canada" instruction.

1. The free consultation is 15 minutes. `FALLBACK_CATALOG` holds 15, and `withDecidedConsult()` pins the consultation row to it, so a live Cliniko value cannot contradict the pages. The owner switches Cliniko's Initial Consultation type to 15. Until then, `price-drift` reports the mismatch, and Cliniko's own calendar and emails show Cliniko's length.
2. In Punjabi and Tagalog strings only the number changed, with no new prose. Those strings are queued for native review.
3. Camille's `reach: 'canada'` is removed and her `provinces` decide what her card says. Her card reads "British Columbia and Alberta" while her Alberta insurance gate is open (grace period to 15 Oct 2026), and "British Columbia" after that unless a renewal is recorded.
4. Payment and cancellation are stated once, in `lib/policies.ts`. The card is taken at booking. Cancelling with at least 24 hours' notice gets a full refund. With less notice, or for a no-show, 50% of the fee is kept. Pages, the FAQ, JSON-LD, emails, ai.json and llms-full all read that one rule. `test/consult-and-cancellation.test.mts` holds both rules. Whether "exceptions for genuine emergencies" stays is the owner's call.

## How the site behaves when things go wrong (continued)

### Every private Blob read is a consistent read, and shared ledgers are written with `ifMatch`
Vercel Blob serves `get()` through its CDN cache; after an overwrite at the
same pathname the old content can come back for up to a minute, and
`cacheControlMaxAge: 0` does not change that because the minimum is sixty
seconds. Every JSON ledger in this repository is overwritten in place, and
every one was read with the cache on. Found 6 Sep 2026 from two symptoms on
the same afternoon: the cron watchdog emailed the owner that `booking-mail` had
stopped, from inside a `booking-mail` run that had just recorded itself; and
`lib/inbound.ts` logged "FAILED to persist" for a submission that was in the
store on the first attempt, because its read-back saw the stale copy.

All eighteen reads now pass `useCache: false`, and the two ledgers with more
than one writer — cron health, where three jobs share a minute, and the inbound
store — write conditionally on the ETag they read, so a lost race is refused
by the store and retried rather than silently erasing the other writer's line.

*Enforced by:* `test/blob-reads.test.mts`, `lib/cron-health.ts`,
`lib/inbound.ts`

---

## Open, and owned by a person

These are not undone through neglect. Each needs a decision or an action only
the owner can take.

| | |
|---|---|
| Professional liability insurance renewal dates | Not recorded anywhere. Gates the Alberta launch. Two dates needed: the founder's policy and Camille's. |
| The founder's RCC registration has no recorded expiry | Not watched rather than not expiring. |
| Camille's RCC expires 2026-12-31 | Every counsellor and city page asserts it as current, in schema markup a search engine reads. |
| The 25 Tagalog pages | Live, unreviewed by a Tagalog speaker. |
| Next.js 14 carries twelve open advisories | No 14.x is patched; the fixes start at 15.5.21. A framework major upgrade. |
| Whether a named author appears on health content | The largest available trust signal, currently declined by policy. |

*Last updated 6 Sep 2026.*
