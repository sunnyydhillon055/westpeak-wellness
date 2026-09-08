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

### Insurance is data on the roster, and /book offers everyone who is accepting
Decided 8 Sep 2026. Savneet's BCACC card (#27067, to 31 Dec 2026) and her
liability certificate arrived; Camille's certificate had been described only
in a source comment. Both policies now sit in an `insurance` field on the
roster with their dates, and `npm run expiry` counts and watches them the
way it watches registrations, naming any practitioner with no policy
recorded. **Camille's policy ends 1 Oct 2026** — the watch found that on its
first run, 23 days out.

With two counsellors taking new clients, /book shows a choice rather than
embedding whichever is listed first; `?with=` still decides, and the roster
order remains the default. Alberta is not opened for Savneet although her
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
