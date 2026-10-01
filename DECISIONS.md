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
