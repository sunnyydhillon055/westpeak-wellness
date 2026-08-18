# 15 things Claude Code can do to get more people reaching out

**Measured 17 August 2026** against a running production build, all 116 URLs
including the three dynamic routes an offline audit cannot see.

This is a different question from ranking. `SEO_COMPETITIVE_2026-08-17.md` is
about getting people to the site. This is about what happens to the ones already
arriving — and there is a large, specific, fixable problem there.

---

## The finding this whole list comes from

| | |
|---|--:|
| Pages where **booking a video call is the only way to make contact** | **94 of 116** |
| Pages with a form a visitor can type into | **3** — `/book`, `/contact`, `/pricing` |
| Pages with no contact path at all | **1** — `/tools/therapy-cost-bc` |
| Pages carrying the "replies within one business day" promise | **2** |

Booking a video call with a stranger is the **highest-commitment action on the
site**, and on 94 pages out of 116 it is the *only* action. Someone reading the
PTSD guide at 2am is not going to book a call. They might type one sentence into
a box. Right now there is no box on that page.

The site scored 850/1000 on conversion architecture in the competitive audit and
that score stands — the machinery is genuinely good. It is just almost entirely
concentrated on three pages that people reach *after* they have already decided.

---

## Tier 1 — give people a step smaller than a video call

**1. Put a one-line enquiry box on the 94 pages that only offer booking.**
The component already exists (`components/InboundForm.tsx`), the API already
exists (`/api/enquiry`), the storage already exists, and it is used on exactly
one page. One sentence, one email field, no phone number, no dropdowns. This is
the single largest item on this list and most of the work is already built.

**2. The sticky bar offers only the biggest ask.**
`components/StickyBook.tsx` follows the visitor down every page and says "book a
free consultation". Add a second, quieter option beside it — *ask a question
instead* — so the persistent call to action has a low rung as well as a high one.

**3. `/tools/therapy-cost-bc` has no contact path whatsoever.**
Someone finishes working out what therapy will cost them and the page ends. That
is the most qualified moment on the site and it currently goes nowhere.

**4. The other two tools end in a result and stop.**
`/tools/stress-check` and `/tools/which-service` both hand back an answer and
then offer a generic booking link. Make the next step follow from the result —
a which-service answer of "couples" should lead to couples counselling, not to a
generic calendar.

**5. Pages about crisis-adjacent subjects need a different ask.**
A guide about intrusive thoughts or being at the point of collapse should not
end with the same cheerful booking button as a guide about choosing a therapist.
Softer wording, and the crisis numbers before the CTA rather than after it.

## Tier 2 — make the reassurance visible where the decision happens

**6. "Replies within one business day" is on 2 pages.**
It is the most reassuring sentence on the site and it is invisible on the 114
pages where someone is deciding. Put it next to every contact prompt.

**7. Say what happens after you send.**
The unspoken fear is being pursued — added to a list, chased, sold to. The site
already behaves well here (three emails then permanent silence, by design). Say
so at the point of contact, in one line, rather than only in the privacy policy.

**8. Say who replies.**
"You will hear back from your counsellor directly" already appears on `/contact`
and it is worth far more than it is currently being asked to do. On a solo
practice this is a real differentiator against group clinics where an admin
triages you.

## Tier 3 — reduce the friction inside booking itself

**9. The booking handoff leaves the site with no warning.**
The visitor is sent to Cliniko mid-decision. A short panel before the handoff —
what the 15 minutes actually is, that no card is required, that nothing is
committed — costs one component and removes the moment where people stop.

**10. The waitlist form exists on one page.**
`/book` carries it. It should appear wherever somebody discovers that no time
works for them, which is a failure currently being absorbed silently.

## Tier 4 — capture the people who will not contact today

**11. The lead magnet is on one page, and it works.**
The coverage checklist has a full CASL-compliant consent flow behind it. Build
two or three more one-pagers off the highest-traffic guides — the ICBC
twelve-session entitlement is the obvious first, because almost nobody knows it.

**12. Extend the follow-up sequence to enquiries and waitlist signups.**
`lib/nurture.ts` runs for checklist signups. Someone who wrote a message and did
not book is at least as warm, and currently receives nothing after the reply.

**13. Offer to send the page rather than to sell.**
"Email this to yourself" on long guides. Low-commitment, genuinely useful for
someone reading on a phone at night, and it captures an address honestly.

## Tier 5 — answer the two objections that stop contact

**14. Cost is settled on `/pricing`, three clicks away.**
Put the fee and the coverage line inline on each service page. Price silence
reads as expensive, and the machine-readable prices are already in the page
schema — the human-readable version is what is missing.

**15. Write for the person who is not the client.**
Partners, parents and adult children searching on someone else's behalf are a
real share of this traffic, and every CTA on the site is addressed to the person
who needs therapy. One alternate path — *this is for someone else* — changes
who can act on the page.

---

## Two constraints these all have to respect

**BCACC.** No testimonials, no reviews, no outcome claims, and nothing that
manufactures urgency. Every item above is a lower step, not a harder sell — and
that is not a compromise. A counselling practice that pressures people is doing
something worse than converting badly.

**Video only, no phone bookings.** Nothing here adds a phone number or a
call-me-back. The lower step is always writing, never ringing.

## What this will not do

It will not bring more people to the site. 94 of 116 pages having one
high-commitment action is a conversion problem, and conversion multiplies
traffic rather than creating it. The competitive audit still stands: the site
appeared in none of the four searches that were run, and Google Business
Profile, the directory listings and the referral channel remain the things that
change that — and all three need the owner, not the terminal.
