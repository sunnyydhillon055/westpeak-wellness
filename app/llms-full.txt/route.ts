import { site } from '@/lib/site';
import { getTagalogPlace, TL_PLACE_SHARED } from '@/lib/practitioner-places-tl';
import { TAGALOG_CITIES } from '@/lib/tagalog';
import { faqs } from '@/lib/faq';
import { FALLBACK_CATALOG, money } from '@/lib/cliniko-catalog';
import { locations } from '@/lib/locations';
import { pairs, cityFor } from '@/lib/city-services';
import { getCityTopic } from '@/lib/conditions';
import { practitioners } from '@/lib/practitioners';
import { placesFor, resolvePlace } from '@/lib/practitioner-places';
import { punjabiRegions } from '@/lib/punjabi-regions';
import { tagalogGuides } from '@/lib/tagalog-guides';
import { tools } from '@/lib/tools';
import { glossary } from '@/lib/glossary';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { PROVINCE_NAME, type Province } from '@/lib/crisis';
import { services } from '@/lib/services';
import { approaches } from '@/lib/approaches';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { policyList } from '@/lib/policies';
import { getExtra } from '@/lib/depth';

export const dynamic = 'force-static';

/* llms-full.txt — the site's substantive text as plain markdown, in one file.
 *
 * Assembled from the data layer rather than by scraping the rendered HTML, so
 * it contains prose and no navigation, chrome or duplicated boilerplate. Inline
 * link markup is flattened to plain text: a model reading this wants the
 * sentence, not the anchor. */

const plain = (s: string) =>
  s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [label](/href) -> label
   .replace(/\*\*([^*]+)\*\*/g, '$1')
   .replace(/\*([^*]+)\*/g, '$1')
   .trim();

type Sec = { h2: string; body?: string[]; list?: { label: string; detail: string }[] };

const renderSections = (sections: Sec[] = []) =>
  sections
    .map((s) => {
      const parts = [`### ${s.h2}`];
      if (s.body) parts.push(s.body.map(plain).join('\n\n'));
      if (s.list) parts.push(s.list.map((i) => `- ${plain(i.label)}: ${plain(i.detail)}`).join('\n'));
      return parts.join('\n\n');
    })
    .join('\n\n');

const renderFaqs = (faqs: { q: string; a: string }[] = []) =>
  faqs.length ? `### Common questions\n\n${faqs.map((f) => `Q: ${f.q}\nA: ${plain(f.a)}`).join('\n\n')}` : '';

function page({
  area, slug, title, summary, updated, sections, faqs,
}: {
  area: string; slug: string; title: string; summary?: string;
  updated?: string; sections?: Sec[]; faqs?: { q: string; a: string }[];
}) {
  const extra = getExtra(area, slug) as Sec[];
  return [
    `## ${title}`,
    `URL: ${site.domain}/${area}/${slug}`,
    updated ? `Last reviewed: ${updated}` : '',
    summary ? plain(summary) : '',
    renderSections(sections),
    renderSections(extra),
    renderFaqs(faqs),
  ].filter(Boolean).join('\n\n');
}

export function GET() {
  const chunks: string[] = [];

  chunks.push(`# ${site.name}: full text

Virtual counselling practice serving all of British Columbia, Canada. Secure
video sessions only, no office, no phone sessions. Two Registered Clinical
Counsellors, both registered with the BC Association of Clinical Counsellors.
One works in English and Punjabi; the other holds the national Canadian
Certified Counsellor certification alongside the BC registration, works in
English and Tagalog, and can see clients located in Alberta as well as British
Columbia. Which counsellor works in which language and which province is stated
on each of their own pages, below.

Languages across the practice: ${site.languages}.

Service area: British Columbia province-wide; Alberta through one counsellor of
the two. Session length: 50 minutes. First consultation: 15 minutes, free.
Booking: ${site.domain}${site.bookingPath}. Contact: ${site.email}.

Not covered by MSP in BC, and not covered by AHCIP in Alberta. Many BC extended
health plans reimburse a Registered Clinical Counsellor; Alberta plans more
often name the Canadian Certified Counsellor, because counselling therapy is not
a regulated profession there. The practice does not direct-bill. A Registered Clinical
Counsellor does not diagnose, prescribe, or conduct formal psychological
assessment, and this is not a crisis service: in crisis, 9-8-8 (Canada, 24/7),
310-6789 (BC), or 9-1-1 in immediate danger.

This document is the substantive prose of the site in one file. It contains no
navigation or boilerplate. Every page it covers is also available at its own URL.

---`);

  for (const s of services) {
    chunks.push(page({
      area: 'services', slug: s.slug, title: s.name,
      summary: `${s.hero}\n\n${s.intro}\n\nThis helps with: ${s.helps.join('; ')}.\n\nHow the practice approaches it: ${s.approach}`,
      sections: [
        ...(s.whatItIs ? [s.whatItIs as Sec] : []),
        ...(s.signs ? [{ h2: 'What people tend to arrive with', list: s.signs }] : []),
        ...(s.sessionShape ? [s.sessionShape as Sec] : []),
      ],
      faqs: s.faqs,
    }));
  }
  for (const a of approaches) {
    chunks.push(page({ area: 'approaches', slug: a.slug, title: a.title, summary: a.shortAnswer, updated: a.updated, sections: a.sections as Sec[], faqs: a.faqs }));
  }
  for (const g of guides) {
    chunks.push(page({ area: 'guides', slug: g.slug, title: g.title, summary: g.shortAnswer, updated: g.updated, sections: g.sections as Sec[], faqs: g.faqs }));
  }
  for (const c of comparisons) {
    chunks.push(page({ area: 'compare', slug: c.slug, title: c.title, summary: c.shortAnswer, updated: c.updated, sections: c.sections as Sec[], faqs: c.faqs }));
  }
  for (const r of resources) {
    chunks.push(page({ area: 'resources', slug: r.slug, title: r.title, summary: r.shortAnswer, updated: r.updated, sections: r.sections as Sec[], faqs: r.faqs }));
  }
  for (const a of audiences) {
    chunks.push(page({ area: 'for', slug: a.slug, title: a.title, summary: a.opening.map(plain).join('\n\n'), updated: a.updated, sections: a.sections as Sec[], faqs: a.faqs }));
  }
  for (const p of policyList) {
    chunks.push(page({ area: '', slug: p.slug, title: p.title, summary: p.lede, updated: p.updated, sections: p.sections as Sec[] }));
  }


  /* ==========================================================================
     THE 143 URLS THIS FILE USED TO OMIT
     --------------------------------------------------------------------------
     Everything above this point is the site as it stood before the counsellor
     roster, the city matrix and the Tagalog section existed. The file was
     assembled from eight content modules and nobody added the ones that came
     later, so the document built specifically to be read whole described a
     smaller, older, one-counsellor practice — 108 of 251 URLs.

     Absent were the 66 city pages, both counsellor profiles and their 36 place
     pages, the 19 Tagalog pages, the 6 tools, the 6 Punjabi region pages and
     the glossary. Those are the commercial core: the pages somebody would
     actually be answering from when asked about counselling in a named city or
     about either counsellor by name.

     Each block below reads from the same lib module the pages render from, so
     the file cannot drift from the site the way it just did.
     ======================================================================== */

  /* The counsellors. Named, with credentials and registration numbers, because
     an answer engine asked "who works there" should not have to infer it. */
  for (const pr of practitioners) {
    chunks.push([
      `## ${pr.name}, ${pr.postNominals}`,
      `URL: ${site.domain}/practitioners/${pr.slug}`,
      `Last reviewed: ${COLLECTION_DATES['practitioners']}`,
      plain(pr.tagline),
      pr.intro.map(plain).join('\n\n'),
      `### Credentials\n\n${pr.credentials
        .map((c) => `- ${c.full} (${c.short}), ${c.body}, registration ${c.number}${c.validTo ? `, current to ${c.validTo}` : ''}`)
        .join('\n')}`,
      `### Practises in\n\n${pr.provinces.map((c) => PROVINCE_NAME[c as Province] ?? c).join(', ')}`,
      `### Works in\n\n${pr.languages.map((l) => l.name).join(', ')}`,
      pr.focus.length
        ? `### Focus\n\n${pr.focus.map((f) => `- ${plain(f.label)}: ${plain(f.detail)}`).join('\n')}`
        : '',
      pr.suits.length ? `### Suits\n\n${pr.suits.map((s) => `- ${plain(s)}`).join('\n')}` : '',
      plain(pr.sessionNote),
    ].filter(Boolean).join('\n\n'));
  }

  /* Counsellor-by-city pages. resolvePlace() is used rather than the raw
     record, for the same reason the pages use it: it strips language claims a
     given counsellor cannot make. Writing the raw blurb here would put back
     into the AI feed exactly the false claim the resolver exists to remove. */
  for (const pr of practitioners) {
    if (!pr.placePages) continue;
    for (const place of placesFor(pr.provinces)) {
      const r = resolvePlace(place, pr);
      chunks.push([
        `## ${pr.name.split(' ')[0]} in ${r.city}`,
        `URL: ${site.domain}/practitioners/${pr.slug}/${r.slug}`,
        `Last reviewed: ${COLLECTION_DATES['practitionerPlaces']}`,
        plain(r.blurb),
        r.local?.length ? r.local.map(plain).join('\n\n') : '',
        renderFaqs(r.faqs),
      ].filter(Boolean).join('\n\n'));
    }
  }

  /* City pages. */
  for (const l of locations) {
    chunks.push([
      `## Online counselling in ${l.city}, BC`,
      `URL: ${site.domain}/online-counselling/${l.slug}`,
      `Last reviewed: ${COLLECTION_DATES['locations']}`,
      plain(l.blurb),
      l.intro?.length ? l.intro.map(plain).join('\n\n') : '',
      l.localReality ? `### ${l.localReality.h2}\n\n${l.localReality.body.map(plain).join('\n\n')}` : '',
      l.access?.length
        ? `### Getting seen\n\n${l.access.map((a) => `- ${plain(a.label)}: ${plain(a.detail)}`).join('\n')}`
        : '',
      renderFaqs(l.faqs),
    ].filter(Boolean).join('\n\n'));
  }

  /* City and service together — the 50 pages that answer "X counselling in Y",
     which is the shape of the question people actually ask. */
  for (const p of pairs) {
    const topic = getCityTopic(p.service);
    const city = cityFor(p.city);
    if (!topic || !city) continue;
    chunks.push([
      `## ${topic.name} in ${city.city}, BC`,
      `URL: ${site.domain}/online-counselling/${city.slug}/${p.service}`,
      `Last reviewed: ${COLLECTION_DATES['cityServices']}`,
      plain(p.angle),
      p.body.map(plain).join('\n\n'),
      renderFaqs(p.faqs),
    ].filter(Boolean).join('\n\n'));
  }

  /* Punjabi-language region pages. The prose is English; the pages exist
     because the search demand is regional. */
  for (const r of punjabiRegions) {
    chunks.push([
      `## Punjabi-speaking counselling in ${r.region}`,
      `URL: ${site.domain}/punjabi-counselling/${r.slug}`,
      `Last reviewed: ${COLLECTION_DATES['punjabiRegions']}`,
      plain(r.blurb),
      r.demography ? `${plain(r.demography.stat)}\n\n${r.demography.body.map(plain).join('\n\n')}` : '',
      r.localReality ? `### ${r.localReality.h2}\n\n${r.localReality.body.map(plain).join('\n\n')}` : '',
      r.access?.length
        ? `### Getting seen\n\n${r.access.map((a) => `- ${plain(a.label)}: ${plain(a.detail)}`).join('\n')}`
        : '',
      renderFaqs(r.faqs),
    ].filter(Boolean).join('\n\n'));
  }

  /* The Tagalog guides, in Tagalog. Marked so a model reading this file knows
     the language changes here rather than inferring it mid-paragraph. */
  for (const g of tagalogGuides) {
    chunks.push([
      `## ${g.title}`,
      `URL: ${site.domain}/tagalog/gabay/${g.slug}`,
      `Language: Tagalog (tl)`,
      `Last reviewed: ${COLLECTION_DATES['tagalog']}`,
      plain(g.shortAnswer),
      renderSections(g.sections as Sec[]),
      renderFaqs(g.faqs),
    ].filter(Boolean).join('\n\n'));
  }

  /* The tools. What each one asks and what it will not tell you, which is the
     part worth having in a corpus: the interactive half cannot be read here. */
  for (const t of tools) {
    chunks.push([
      `## ${t.title}`,
      `URL: ${site.domain}/tools/${t.slug}`,
      `Last reviewed: ${COLLECTION_DATES['tools']}`,
      plain(t.short),
      plain(t.metaDescription),
      `This is an interactive page. It takes about ${t.minutes} minutes, asks no identifying questions, stores nothing, and is not a diagnosis.`,
      renderFaqs(t.faqs),
    ].filter(Boolean).join('\n\n'));
  }

  /* The glossary, which is 60 definitions and the single most quotable block on
     the site: each entry is already written to stand alone. */
  chunks.push([
    '## Counselling and BC coverage glossary',
    `URL: ${site.domain}/glossary`,
    `Last reviewed: ${COLLECTION_DATES['glossary']}`,
    'Plain-language definitions of the therapy, mental-health and BC insurance terms someone meets when looking for a counsellor.',
    glossary.map((t) => `### ${t.term}\n\n${plain(t.definition)}`).join('\n\n'),
  ].join('\n\n'));



  /* The Tagalog counsellor pages, in Tagalog. Same resolver the pages use. */
  for (const pr of practitioners) {
    if (!pr.placePages || !pr.languages.some((l) => l.tag === 'tl')) continue;
    for (const place of placesFor(pr.provinces)) {
      const tl = getTagalogPlace(place.slug);
      if (!tl) continue;
      chunks.push([
        `## ${pr.name.split(' ')[0]} sa ${place.city}`,
        `URL: ${site.domain}/practitioners/${pr.slug}/${place.slug}/tl`,
        `Language: Tagalog (tl)`,
        `Last reviewed: ${COLLECTION_DATES['tagalogPlaces']}`,
        plain(tl.blurb),
        tl.local?.length ? tl.local.map(plain).join('\n\n') : '',
        renderFaqs(tl.faqs),
      ].filter(Boolean).join('\n\n'));
    }
  }

  /* Tagalog city pages, which are a separate route from the counsellor ones:
     these answer "counselling in Tagalog in <city>" rather than "<counsellor>
     in <city>". The prose here is English by design; the pages exist because
     the search demand is regional. */
  for (const c of TAGALOG_CITIES) {
    chunks.push([
      `## Tagalog-speaking counselling in ${c.city}, BC`,
      `URL: ${site.domain}/tagalog-counselling/${c.slug}`,
      `Last reviewed: ${COLLECTION_DATES['tagalog']}`,
      plain(c.angle),
      c.body.map(plain).join('\n\n'),
      renderFaqs(c.faqs),
    ].filter(Boolean).join('\n\n'));
  }

  /* ==========================================================================
     THE PAGES THAT ARE COMPONENTS RATHER THAN DATA
     --------------------------------------------------------------------------
     /about, /pricing, /contact, /faq, /reviews and the two referral pages are
     written as JSX, so there is no module to read them out of. They are also
     among the most-asked-about pages on the site: what it costs, how to get in
     touch, who the counsellors are.

     Leaving them out because they are inconvenient to extract would mean the
     file answers questions about anxiety in Kamloops and not "what does a
     session cost", which is the wrong way round. Written here as facts rather
     than scraped as prose, and short enough to stay true.
     ======================================================================== */

  chunks.push([
    '## About the practice',
    `URL: ${site.domain}/about`,
    `Last reviewed: ${COLLECTION_DATES['practitioners']}`,
    `${site.name} is a small virtual counselling practice serving all of British Columbia. Sessions are by secure video only: there is no office and no phone-session option.`,
    `Two Registered Clinical Counsellors work here, both registered with the BC Association of Clinical Counsellors, with registration numbers published on their own pages. Languages across the practice: ${site.languages}. Which counsellor works in which language, and which provinces each can see clients in, is stated on their individual pages.`,
    'The practice does not diagnose, does not prescribe or advise on medication, and does not carry out formal psychological assessment. It is not a crisis service.',
  ].join('\n\n'));

  chunks.push([
    '## Fees and insurance',
    `URL: ${site.domain}/pricing`,
    `Last reviewed: ${COLLECTION_DATES['services']}`,
    'Session fees, what extended health covers, and what to do if the fee is the obstacle.',
    `### Current fees\n\n${FALLBACK_CATALOG.items
      .map((i) => `- ${i.name}: ${money(i.cents)}${i.minutes ? ` (${i.minutes} minutes)` : ''}`)
      .join('\n')}`,
    'Counselling with a Registered Clinical Counsellor is not covered by MSP in British Columbia, and not covered by AHCIP in Alberta. Many extended health plans reimburse an RCC; Alberta plans more often name the Canadian Certified Counsellor, because counselling therapy is not a regulated profession there.',
    `The practice does not direct-bill. The card is charged by Visa, Mastercard or Amex at the time of booking rather than at the end of the session, and the client receives a receipt carrying the registration number, which is what an insurer asks for. Cancelling or rescheduling at least ${site.cancellationHours} hours ahead is free and the fee is refunded in full.`,
    'If the fee is the obstacle, say so: there are lower-cost and no-cost counselling routes in BC and being pointed at the right one is better than going without.',
  ].join('\n\n'));

  chunks.push([
    '## Contact',
    `URL: ${site.domain}/contact`,
    `Last reviewed: ${COLLECTION_DATES['services']}`,
    `Email ${site.email}. The reply comes from a counsellor rather than an assistant, usually within one business day.`,
    'There is no published telephone number, and every tel: link on this site is a crisis line. Somebody who would rather be phoned than emailed can ask for a call and nominate a time, through the form on the contact page.',
    `Consultation hours: ${site.availability.map((a) => `${a.day} ${a.from}–${a.to}`).join(' · ')}.`,
  ].join('\n\n'));

  chunks.push([
    '## Frequently asked questions',
    `URL: ${site.domain}/faq`,
    `Last reviewed: ${COLLECTION_DATES['faq']}`,
    'Questions about booking, fees, extended health coverage, how sessions work, and privacy.',
    renderFaqs(faqs.map((f) => ({ q: f.q, a: f.a }))),
  ].join('\n\n'));

  chunks.push([
    '## Referring someone',
    `URL: ${site.domain}/refer`,
    `Last reviewed: ${COLLECTION_DATES['services']}`,
    'How to point a friend, family member, colleague or patient toward this practice, and what happens after they get in touch.',
    `No physician referral is required to book. A person can book the free 15-minute consultation themselves at ${site.domain}${site.bookingPath}.`,
    `There is a one-page summary written for a GP in British Columbia at ${site.domain}/refer/doctor: designation, scope limits, fees, and what a referring physician does and does not need to do. Clinical information is released only with the patient's written consent.`,
  ].join('\n\n'));



  /* The two remaining URLs, both one-offs rather than a collection.

     /practitioners/<slug>/tl is a counsellor's Tagalog landing page, which is
     the /<place> route with place='tl' rather than a city name. /reviews is the
     page explaining why a practice bound by BCACC advertising standards
     publishes no testimonials, which is a question an answer engine will be
     asked and should not have to infer from an absence. */
  for (const pr of practitioners) {
    if (!pr.languages.some((l) => l.tag === 'tl')) continue;
    chunks.push([
      `## ${pr.name.split(' ')[0]} sa Tagalog`,
      `URL: ${site.domain}/practitioners/${pr.slug}/tl`,
      'Language: Tagalog (tl)',
      `Last reviewed: ${COLLECTION_DATES['tagalogPlaces']}`,
      plain(TL_PLACE_SHARED.opening('British Columbia')),
      `### ${plain(TL_PLACE_SHARED.accessHeading('British Columbia'))}\n\n${TL_PLACE_SHARED.access
        .map((a) => `- ${plain(a.label)}: ${plain(a.detail)}`)
        .join('\n')}`,
    ].filter(Boolean).join('\n\n'));
  }

  chunks.push([
    '## Reviews and references',
    `URL: ${site.domain}/reviews`,
    `Last reviewed: ${COLLECTION_DATES['services']}`,
    'Why this practice publishes no client testimonials, what can be verified instead, and how to check a counsellor’s registration in British Columbia yourself.',
    'The BC Association of Clinical Counsellors advertising standards prohibit client testimonials, so there are none on this site. Their absence is a rule being followed rather than a lack of satisfied clients, and anyone presenting counselling testimonials in BC is either not registered or not complying.',
    `What can be checked instead: each counsellor's registration number is published on their own page and can be verified directly with the awarding body, and the practice's scope limits, ethical obligations and complaints route are set out at ${site.domain}/standards.`,
  ].join('\n\n'));


  const body = chunks.join('\n\n---\n\n') + '\n';

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
