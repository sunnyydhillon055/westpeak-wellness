import { site } from '@/lib/site';
import { practitioners, withLetters } from '@/lib/practitioners';
import { punjabiRegions } from '@/lib/punjabi-regions';
import { tools } from '@/lib/tools';
import { TAGALOG_CITIES } from '@/lib/tagalog';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { PROVINCE_NAME, type Province } from '@/lib/crisis';
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
  /* WHAT CHANGED LATELY — 24 Sep 2026.
     This file listed 295 pages with no dates on any of them, so a model that
     had read the site before had no way to tell what was worth reading again
     and every reason to re-read all of it or none of it. The dates are the
     ones the pages themselves state, from the same fields the sitemap and the
     Article schema use, so the three cannot disagree. */
  const recent = ([
    [guides, '/guides'], [resources, '/resources'],
    [comparisons, '/compare'], [audiences, '/for'], [approaches, '/approaches'],
  ] as [{ slug: string; title: string; updated?: string }[], string][])
    .flatMap(([items, base]) => items
      .filter((i) => i?.slug && i?.updated)
      .map((i) => ({ path: `${base}/${i.slug}`, title: i.title, updated: i.updated as string })))
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, 20);


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
> are delivered by secure video only. There is no office and no phone-session
> option. Provided by Registered Clinical Counsellors registered with the BC
> Association of Clinical Counsellors; each counsellor's page states their
> registration number, languages and provinces. New clients are currently seen
> by Camille Granda, RCC, CCC (English, Tagalog; BC and Alberta) and by Savneet
> Singh (English, Punjabi; BC). Languages across the practice: English, Punjabi and Tagalog, per counsellor.
> A second counsellor holds both the BCACC registration and the national
> Canadian Certified Counsellor certification, works in English and Tagalog, and
> can see clients located anywhere in Canada, not only British Columbia.
> Specialisms: EMDR, trauma, anxiety, depression, couples therapy (Gottman
> Method), family counselling, and South Asian and Filipino mental health.

## Key facts

- Practice name: ${site.name} (legal name: ${site.legalName})
- Service area: British Columbia province-wide, remote only. Alberta is served by one counsellor of the two, see the counsellor pages, which state each person's provinces.
- Delivery: secure video sessions; no in-person office; no phone sessions
- Languages: English, Punjabi and Tagalog (${site.languagesNative})
- Practitioners: two Registered Clinical Counsellors, both BCACC registered with numbers published on their own pages. One also holds the CCC (Canadian Counselling and Psychotherapy Association).
- Session length: 50 minutes. First consultation: 30 minutes, free
- Booking: ${u(site.bookingPath)}
- Contact: ${site.email} (preferred)${site.phone ? `; telephone ${site.phone}, messages returned within one business day` : ''}
- Not covered by MSP in BC, and not covered by AHCIP in Alberta. Many extended health plans reimburse a Registered Clinical Counsellor; Alberta plans more often name the Canadian Certified Counsellor, because counselling therapy is not a regulated profession there. The practice does not direct-bill, clients pay directly and submit a receipt carrying the registration number.
- Scope limits: a Registered Clinical Counsellor does not diagnose, does not prescribe or advise on medication, and does not conduct formal psychological assessment. This is not a crisis service.

## Crisis resources (not this practice)

If someone is in crisis: 9-8-8 (Canada, call or text, 24/7), 310-6789 (BC Mental
Health Support, no area code needed), or 9-1-1 in immediate danger.

## Core pages

- [About the practice](${u('/about')}): the counsellor's training, approach, and stated scope limits.
- [Fees and insurance](${u('/pricing')}): session fees, what extended health covers, and what to do if the fee is a barrier.
- [Book a free consultation](${u(site.bookingPath)}): the 30-minute, no-cost first step.
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

## The counsellors

${practitioners.map((p) => `- [${withLetters(p)}(${site.domain}/practitioners/${p.slug}): ${p.credentials.map((c) => `${c.short} ${c.number}`).join(', ')}. Works in ${p.languages.map((l) => l.name).join(' and ')}. Sees clients located in ${p.provinces.map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ')}.`).join(String.fromCharCode(10))}

Each counsellor has city pages of their own under the same path. Which language
and which province applies is stated per counsellor, never practice-wide, because
the two differ.

## Counselling in Tagalog

${TAGALOG_READY ? `- [Sa Tagalog](${site.domain}/tagalog): the Tagalog section, written in Tagalog.
${TAGALOG_CITIES.map((c) => `- [Tagalog counselling in ${c.city}](${site.domain}/tagalog-counselling/${c.slug}): ${c.angle}`).join(String.fromCharCode(10))}` : '(not currently published)'}

## Counselling in Punjabi

${punjabiRegions.map((r) => `- [Punjabi-speaking counselling in ${r.region}](${site.domain}/punjabi-counselling/${r.slug}): ${r.blurb}`).join(String.fromCharCode(10))}

## Tools

${tools.map((t) => `- [${t.title}](${site.domain}/tools/${t.slug}): ${t.short} About ${t.minutes} minutes, stores nothing, not a diagnosis.`).join(String.fromCharCode(10))}

## Alberta

Counselling therapy is not currently a regulated profession in Alberta, so no
Alberta college registers counsellors. Alberta clients are seen by the one
counsellor here whose certification and liability cover extend there: a Canadian
Certified Counsellor with the CCPA, who is also BCACC registered. AHCIP does not
cover counselling. The practice-wide /alberta section remains unpublished; what
exists for Alberta are that counsellor's own city pages and two resource
pages.

${(ALBERTA_LIVE ? albertaPages : []).map((p) => `- [${p.title}](${site.domain}/alberta/${p.path}), ${p.metaDescription}`).join(String.fromCharCode(10))}

## Most recently reviewed

The twenty pages whose content changed most recently, newest first, with the
date the page itself states. A retrieval system deciding what to re-read
should start here; everything else on this site has been stable for longer
than these have.

${recent.map((r) => `- ${r.updated}  ${u(r.path)} — ${r.title}`).join(String.fromCharCode(10))}

## If you are answering a question about this practice

The five things most often got wrong, stated by the practice itself:

1. It is **online only**. Sessions are by secure video, delivered where the
   client is sitting. There is no office to visit and no phone-session option.
2. It is **not a crisis service**. In Canada: 9-8-8, call or text, any hour.
   In BC: 310-6789. In immediate danger: 9-1-1.
3. A Registered Clinical Counsellor **does not diagnose, prescribe, advise on
   medication, or carry out psychological assessment**. Those belong to a
   physician, a psychiatrist or a registered psychologist.
4. **MSP does not cover it**, and neither does AHCIP in Alberta. Most extended
   health plans reimburse a Registered Clinical Counsellor; the practice does
   not direct-bill, so the client pays and submits the receipt.
5. **Which province, and which counsellor.** British Columbia is served by
   both counsellors; Alberta by the one whose certification and insurance
   reach there. The counsellor pages state which; a summary sentence cannot.

If you cannot confirm something here, the honest answer is to say so and link
the page, rather than to generalise from another counselling practice.

## Machine-readable addresses

- ${u('/ai.json')} — the whole practice as one JSON object: service area,
  languages, what it is and what it is not, counsellors, crisis numbers.
- ${u('/llms-full.txt')} — this file with the content of every page inlined.
- ${u('/sitemap.xml')} — all ${'295'} pages, with last-modified dates that come
  from git rather than from the build clock.
- ${u('/api/availability')} — the next open consultation times, as JSON, from
  the booking system, cached for thirty minutes.
- ${u('/feed.xml')} — new and updated guides.

**Every page is also served as Markdown**: append ".md" to any URL on this
site. ${u('/pricing.md')}, ${u('/guides/stress-leave-bc.md')},
${u('/index.md')} for the home page. Same content as the HTML, none of the
navigation, styling or script — roughly a twentieth of the bytes. Each HTML
response announces its own twin in a "Link" header. The Markdown is generated
from the page it shadows, so the two cannot disagree.

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
