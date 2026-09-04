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

### Personal names appear on profiles, the roster and the header — nowhere else
Changed 1 Sep 2026. Before that no counsellor's name appeared anywhere but
`/about`. Photographs and registration numbers remain restricted.

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

*Last updated 3 Sep 2026.*
