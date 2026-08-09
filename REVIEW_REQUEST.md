# Reviews — what you may and may not do

Read this before sending anything. It is short, and the first section is the
part that matters.

---

## The rule

**BCACC prohibits soliciting testimonials from counselling clients.** Not
"discourages" — prohibits. It applies to current clients and to former ones, and
it applies however gently the request is worded.

The reasoning is not squeamishness. A person in a therapeutic relationship is
not in a position to freely decline a request from their counsellor. They may
still be in your care. They may want to please you. Refusing is awkward in a way
it is not with a plumber. That imbalance is precisely why the prohibition
exists, and it does not evaporate because the review turns out to be positive or
because you asked nicely.

So there is **no post-session review-request email in this file**, and there
should not be one anywhere else either. The directive that prompted this
document asked for one; it cannot be written compliantly, and writing it anyway
would have been the single most damaging thing on this site.

## What is permitted

**Reviews from people who were never your clients.** Colleagues, clinical
supervisors, referring physicians, workshop or training attendees, other
practitioners who have referred to you. No power imbalance, no prohibition.

That is what `lib/reviews.ts` is built for. Each entry requires a `sourceNote`
recording where it came from and how consent was obtained — the field is
mandatory rather than optional precisely so a client quote cannot be added
without someone noticing.

**Unsolicited public reviews.** If a client decides entirely on their own to
leave a Google review, that is their choice and their speech. You may not
prompt it, request it, hint at it, incentivise it, or send them a link. You may
have a Google Business Profile, and people may find it.

## The template you *can* send

To a colleague, supervisor or referring clinician only. Never to a client.

> **Subject:** A short reference for the Westpeak Wellness site?
>
> Hi [name],
>
> I am putting together a references section for the practice website. Since
> BCACC does not permit client testimonials, I am asking a few colleagues
> instead.
>
> Would you be willing to write two or three sentences on working with me —
> referrals, consultation, supervision, whatever is accurate from your side?
> Anything you are comfortable having attributed publicly with your name and
> role.
>
> No obligation at all, and no need to be effusive. Plain and specific is more
> useful than glowing.
>
> Thanks either way,
> [signature]

Then add it to `lib/reviews.ts` with `sourceNote` filled in honestly — for
example: *"Written for the website at my request, reviewed and approved by the
author, 2026-08-01."*

## What the site does instead

`/reviews` is a real page, and it is not an empty shell waiting for content. It
explains why there are no client testimonials, then hands the reader four things
they can verify themselves:

- the BCACC register, and how to search it
- what the RCC designation actually covers, against psychologist and social
  worker
- the practice's own stated scope limits and complaints route
- how the site's writing is sourced and reviewed

That is a stronger trust signal than five stars from strangers, because the
reader can check every part of it without taking anyone's word.

The page also notes that a review is public and permanent and is **not** a
confidential channel, and points private feedback at email instead. Worth
keeping if you ever revise the copy.

## Google Business Profile

Claim it. Keep the practice name, URL and service area character-for-character
identical to the site — mismatched details are the usual reason a local listing
underperforms.

If you set `NEXT_PUBLIC_GOOGLE_REVIEW_URL`, the `/reviews` page will show the
listing link **in the section addressed to people who have already decided to
leave one**. That is the line: publishing a link where someone can find it is
not solicitation; sending it to a client is.

## What actually builds trust here

Ranked by how much they move a local counselling practice, most first:

1. **Google Business Profile**, claimed, complete, NAP identical to the site.
2. **Directory listings** — Psychology Today, the BCACC directory,
   TherapyTribe. Same details on every one. Consistency is the signal.
3. **The register itself.** Being verifiable beats being praised.
4. **The guides.** Most people judge a practice on its writing long before they
   speak to anyone, which is why the editorial policy is public.
5. **Colleague references**, per the template above.

Client reviews are not on this list, and cannot be.
