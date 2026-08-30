# Client-acquisition check — 30 August 2026

The site, walked against what the current guidance says converts a
therapy-site visitor into a client. Sources at the foot; the recurring items
across all of them, condensed:

1. a human photograph of the therapist, high on the page
2. one clear primary action above the fold, reachable in ≤3 clicks
3. multiple contact routes, with the lowest-commitment one visible
4. trust signals near the action: credentials, licence number, verification
5. niche-specific messaging, not generic "therapy for everyone"
6. transparent fees
7. a stated response-time expectation
8. mobile-first, fast, frictionless booking
9. testimonials near the CTA — *where permitted*

## The scorecard

| # | What converts | This site | State |
|--:|---|---|---|
| 1 | Therapist's face, high on the page | Portrait beside the fit heading, linking to /about — **added today**. Was two clicks deep. | ✅ fixed |
| 2 | One clear CTA above the fold | "Book a Free 15-min Consultation", first element after the lede; also in the header on every page | ✅ |
| 3 | ≤3 clicks to book | 2: any page → /book → select a time | ✅ |
| 4 | Lower-commitment route beside the big ask | The sticky bar offers "or send a message instead" on every page; AskInstead sits above every footer | ✅ |
| 5 | Trust signals near the action | BCACC #20111 with a **verify** link straight into the register, in the hero trust bar and again beside the scheduler | ✅ |
| 6 | Niche messaging | Punjabi/South Asian focus is the homepage's signature section, the nav carries ਪੰਜਾਬੀ in Gurmukhi, and fifty city×service pages each carry their own argument | ✅ |
| 7 | Transparent fees | $140 stated on service pages, /pricing one click from everywhere, no packages | ✅ |
| 8 | Response-time promise | "Reply within one business day" on /contact and inside AskInstead — and /contact upgrades it to a *measured* median once five real samples exist | ✅ |
| 9 | Mobile booking friction | Free consult is $0.00/15 min, no card, no intake form before the call | ✅ |
| 10 | Testimonials near the CTA | **Prohibited** — BCACC advertising standards bar soliciting testimonials from counselling clients. /reviews explains this and offers the register instead. The verify link is the honest substitute, and arguably the stronger one. | ➖ n/a, by regulation |

## The one thing left, and it is not in this repo

**The booking widget is the only off-palette screen in the funnel.** /book
embeds Cliniko's hosted page, which currently renders in Cliniko's default
theme: dark slate frame, white card, green buttons. It is the exact moment of
conversion, and it looks like leaving the site.

The iframe is cross-origin; no CSS here can touch it. The fix is one owner
action in **Cliniko → Settings → Online bookings → appearance**:

    primary / button colour   #3d6c92
    background                #faf7f1

Until then the page mitigates with the trust line directly above the frame.

## What was deliberately not done

- No testimonials workaround. The regulation is the regulation, and /reviews
  handling it head-on reads as more trustworthy than silence.
- No exit popups, no urgency banners, no "only 2 spots left". Several sources
  recommend scarcity mechanics; on a counselling site they are manipulative
  and the practice's own standards page would contradict them.
- The two-container layout (wide hero, narrower prose) was measured and left
  alone — it is a deliberate hierarchy, not drift. Boxed callouts indent by
  their padding; everything else on every page shares the same left rail.

Sources:
- [TL Design Studios — therapist website essentials 2026](https://www.tldesignstudios.com/therapist-website-design-essential-elements-that-build-trust-and-book-clients-in-2026/)
- [Reframe Practice — 15 patterns to borrow](https://reframepractice.com/guides/therapist-website-examples)
- [Mental Health IT Solutions — why therapy sites don't convert](https://mentalhealthitsolutions.com/blog/therapy-website-is-not-converting/)
- [CoralEHR — what to put on a therapy website](https://www.coralehr.com/website-toolkit/guides/what-to-put-on-therapy-website/)
- [Headway — top therapist websites](https://headway.co/resources/top-therapist-websites)
- [WSI — 20 fixes that increase booked consultations](https://wsinextgenmarketing.com/checklist-20-website-fixes-that-increase-booked-consultations/)
