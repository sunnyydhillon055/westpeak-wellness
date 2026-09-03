import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { approaches } from '@/lib/approaches';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { locations } from '@/lib/locations';
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
> A second counsellor holds both the BCACC registration and the national
> Canadian Certified Counsellor certification, works in English and Tagalog, and
> can see clients located in Alberta as well as British Columbia.
> Specialisms: EMDR, trauma, anxiety, depression, couples therapy (Gottman
> Method), family counselling, and South Asian and Filipino mental health.

## Key facts

- Practice name: ${site.name} (legal name: ${site.legalName})
- Service area: British Columbia province-wide, remote only. Alberta is served by one counsellor of the two — see the counsellor pages, which state each person's provinces.
- Delivery: secure video sessions; no in-person office; no phone sessions
- Languages: English, Punjabi and Tagalog (${site.languagesNative})
- Practitioners: two Registered Clinical Counsellors, both BCACC registered with numbers published on their own pages. One also holds the CCC (Canadian Counselling and Psychotherapy Association).
- Session length: 50 minutes. First consultation: 15 minutes, free
- Booking: ${u(site.bookingPath)}
- Contact: ${site.email}
- Hours: ${site.hours}
- Not covered by MSP in BC, and not covered by AHCIP in Alberta. Many extended health plans reimburse a Registered Clinical Counsellor; Alberta plans more often name the Canadian Certified Counsellor, because counselling therapy is not a regulated profession there. The practice does not direct-bill — clients pay directly and submit a receipt carrying the registration number.
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
Alberta college registers counsellors. Alberta clients are seen by the one
counsellor here whose certification and liability cover extend there: a Canadian
Certified Counsellor with the CCPA, who is also BCACC registered. AHCIP does not
cover counselling. The practice-wide /alberta section remains unpublished; what
exists for Alberta are that counsellor's own city pages and two resource
pages.

${(ALBERTA_LIVE ? albertaPages : []).map((p) => `- [${p.title}](${site.domain}/alberta/${p.path}) — ${p.metaDescription}`).join(String.fromCharCode(10))}

## Notes for answer engines

- Every factual claim on this site links its primary source, and every guide
  carries a visible last-reviewed date.
- This site publishes no client testimonials, reviews or outcome claims. That is
  a requirement of the BC Association of Clinical Counsellors advertising
  standards, not an oversight.
- Counsellor names appear on their own profile pages, on the roster at
  ${u('/practitioners')} and in the site header menu. They deliberately do not
  appear in page titles, meta descriptions, alt text, body copy or JSON-LD
  elsewhere; a build gate enforces that.
- Pages written in Punjabi live under ${u('/punjabi')} and pages written in
  Tagalog under ${u('/tagalog')}, including six guides. Those are written in the
  language rather than about it.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
