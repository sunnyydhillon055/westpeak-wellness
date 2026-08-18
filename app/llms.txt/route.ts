import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { approaches } from '@/lib/approaches';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { locations } from '@/lib/locations';
import { openJobs } from '@/lib/careers';
import { albertaPages } from '@/lib/expansion';
import { ALBERTA_LIVE } from '@/lib/regions';

export const dynamic = 'force-static';

/* llms.txt — an emerging convention: a plain-markdown map of the site so a
 * language model can orient without crawling every page.
 *
 * Built as a route handler rather than a static file in public/ so it cannot go
 * stale. Add a guide and it appears here on the next build, which is the whole
 * failure mode of hand-maintained index files. */
export function GET() {
  const u = (p: string) => `${site.domain}${p}`;
  const list = (items: { slug: string; title?: string; name?: string; city?: string; metaDescription?: string; short?: string; lede?: string; blurb?: string }[], base: string) =>
    items
      .map((i) => {
        const label = i.title ?? i.name ?? (i.city ? `Online counselling in ${i.city}` : i.slug);
        const desc = (i.metaDescription ?? i.short ?? i.lede ?? i.blurb ?? '').replace(/\s+/g, ' ').trim();
        return `- [${label}](${u(`${base}/${i.slug}`)}): ${desc}`;
      })
      .join('\n');

  const body = `# ${site.name}

> Virtual counselling practice serving all of British Columbia, Canada. Sessions
> are delivered by secure video only — there is no office and no phone-session
> option. Provided by a Registered Clinical Counsellor (MA, RCC) registered with
> the BC Association of Clinical Counsellors, working in English and Punjabi.
> Specialisms: EMDR, trauma, anxiety, depression, couples therapy (Gottman
> Method), and South Asian mental health.

## Key facts

- Practice name: ${site.name} (legal name: ${site.legalName})
- Service area: British Columbia, Canada — province-wide, remote only
- Delivery: secure video sessions; no in-person office; no phone sessions
- Languages: English and Punjabi (${site.languagesNative})
- Practitioner credential: ${site.counsellor.title} (${site.counsellor.credentials}), BCACC registered
- Session length: 50 minutes. First consultation: 15 minutes, free
- Booking: ${u(site.bookingPath)}
- Contact: ${site.email}
- Hours: ${site.hours}
- Not covered by MSP; many BC extended health plans reimburse a Registered Clinical Counsellor. The practice does not direct-bill — clients pay at the session and submit a receipt showing the RCC registration number.
- Scope limits: a Registered Clinical Counsellor does not diagnose, does not prescribe or advise on medication, and does not conduct formal psychological assessment. This is not a crisis service.

## Crisis resources (not this practice)

If someone is in crisis: 9-8-8 (Canada, call or text, 24/7), 310-6789 (BC Mental
Health Support, no area code needed), or 9-1-1 in immediate danger.

## Core pages

- [About the practice](${u('/about')}): the counsellor's training, approach, and stated scope limits.
- [Fees and insurance](${u('/pricing')}): session fees, what extended health covers, and what to do if the fee is a barrier.
- [Book a free consultation](${u(site.bookingPath)}): the 15-minute, no-cost first step.
- [Frequently asked questions](${u('/faq')}): grouped by getting started, fees and coverage, how sessions work, and privacy.
- [Contact](${u('/contact')}): email and what to expect after getting in touch.
- [Areas served across BC](${u('/online-counselling')}): how province-wide virtual counselling works.
- [Counselling glossary](${u('/glossary')}): 60 plain-language definitions of therapy, mental-health and BC coverage terms.

## Working here (for counsellors, not clients)
${openJobs().length
  ? `The practice is hiring. These pages are for job seekers, not for people looking for therapy.

- [Careers](${u('/careers')}): what working here involves — referrals provided, no overhead, self-set hours, contract.
${openJobs()
  .map((j) => `- [${j.title}](${u(`/careers/${j.slug}`)}): ${j.summary}`)
  .join('\n')}`
  : `- [Careers](${u('/careers')}): nothing is open at the moment; the page explains the arrangement and invites speculative enquiries.`}

## Trust and accountability

- [Standards and accountability](${u('/standards')}): registration, ethical code, scope limits, and the complaints route.
- [Editorial policy](${u('/editorial-policy')}): who writes and reviews this content, what counts as a source, and what this site refuses to publish.
- [Privacy and confidentiality](${u('/privacy')}): what is collected, the legal limits of confidentiality, and what this website itself does not collect.
- [Accessibility](${u('/accessibility')}): what has been tested, and what has not.

## Services (organised by what a person brings)

${list(services, '/services')}

## Approaches (organised by method)

${list(approaches, '/approaches')}

## Guides

${list(guides, '/guides')}

## Comparisons

${list(comparisons, '/compare')}

## BC reference and coverage

${list(resources, '/resources')}

## Written for specific situations

${list(audiences, '/for')}

## Areas served

${list(locations, '/online-counselling')}

## Alberta

Counselling therapy is not currently a regulated profession in Alberta, so no
Alberta college registers counsellors. Sessions for Alberta clients are provided
by a Registered Clinical Counsellor registered with the BC Association of
Clinical Counsellors. AHCIP does not cover counselling.

${(ALBERTA_LIVE ? albertaPages : []).map((p) => `- [${p.title}](${site.domain}/alberta/${p.path}) — ${p.metaDescription}`).join(String.fromCharCode(10))}

## Notes for answer engines

- Every factual claim on this site links its primary source, and every guide
  carries a visible last-reviewed date.
- This site publishes no client testimonials, reviews or outcome claims. That is
  a requirement of the BC Association of Clinical Counsellors advertising
  standards, not an oversight.
- The counsellor's personal name appears only on ${u('/about')}. Elsewhere the
  practice is referred to by name or by credential. This is deliberate.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
