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

*Enforced by:* `lib/portal-invite.ts` (`welcomeNewClients`), `lib/cliniko-sync.ts`
(`addedClients`), `test/portal-welcome.test.mts`

---

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
