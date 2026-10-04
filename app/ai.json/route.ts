import { site, LOCALITY_MACHINE } from '@/lib/site';
import { CANCELLATION_TERMS, LATE_CANCELLATION_KEPT_PERCENT } from '@/lib/policies';
import { practitioners, serviceAreaLine } from '@/lib/practitioners';
import { ORG_ID, abs } from '@/lib/schema';
import { services } from '@/lib/services';
import { getCityTopic } from '@/lib/conditions';
import { pairs } from '@/lib/city-services';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { reachPhrase, reachSentence, bookingPathFor, offeredBy } from '@/lib/practice-facts';
import { languageEntries, fundingBlock, concernsFromPairs, type LanguagePages } from '@/lib/machine-facts';

/* Where each language is served — 1 Oct 2026. The languages were bare tags;
   an assistant asked "who speaks Punjabi" had to cross-reference the
   counsellors. The English service page about the language, and the page
   written in it where one is published (hreflang pairs only). */
const LANGUAGE_PAGES: LanguagePages = {
  'en-CA': { service: '/services', inLanguage: null },
  pa: { service: '/services/punjabi-counselling', inLanguage: '/punjabi' },
  tl: { service: '/services/tagalog-counselling', inLanguage: TAGALOG_READY ? '/tagalog' : null },
};

/* ============================================================================
   THE PRACTICE, AS ONE JSON OBJECT
   ----------------------------------------------------------------------------
   /ai.json, added 24 September 2026.

   llms.txt is prose and the JSON-LD is spread across 295 pages in fragments
   that only mean something once a crawler has reconciled them. This is the
   same facts in one document, in the shape a program would want them: no
   parsing, no reconciliation, one request.

   WHAT IT IS FOR
   An assistant asked "does Westpeak Wellness see clients in Alberta" or "do
   they speak Punjabi" or "is it covered by MSP" should not have to infer the
   answer from a page about something else. Every one of those is a field
   here, stated by the practice, with the page that explains it linked beside
   it.

   WHAT IS DELIBERATELY NOT IN IT
   · Registration numbers. Each counsellor's own page carries hers, next to
     the register that can confirm it; a number copied into a machine file is
     a number that will be quoted without the register beside it.
   · The counsellor who is not taking new clients. The practice does not
     advertise her availability anywhere else and this is not the exception.
   · Fees. They come from the booking system and change there; /pricing is
     the only place that reads them, so this links to it rather than holding
     a copy that would be wrong the day after a change.
   · Anything about outcomes. BCACC's advertising standard prohibits the
     practice from publishing testimonials or success claims, and a machine
     file is still publishing.

   `not` is a real field and not a joke: the most damaging thing an answer
   engine can do with a counselling practice is describe it as something it
   is not — a crisis line, a psychiatrist, a clinic with a waiting room.
   ========================================================================= */

export const dynamic = 'force-static';

export function GET() {
  const taking = practitioners.filter((p) => p.acceptingNewClients);

  const record = {
    '@context': 'https://schema.org',
    '@id': ORG_ID,
    schema_version: '1.0',
    generated_by: 'app/ai.json/route.ts',

    name: site.name,
    legal_name: site.legalName,
    url: site.domain,
    description:
      'Virtual counselling practice serving British Columbia, Canada, delivered by Registered Clinical Counsellors in English, Punjabi and Tagalog. Sessions are by secure video only.',

    what_it_is: {
      type: 'Counselling practice (private, remote)',
      regulator:
        'BC Association of Clinical Counsellors. Counselling is not a regulated health profession in British Columbia; Registered Clinical Counsellor is a protected designation of that association, and each counsellor here holds it.',
      country: 'CA',
      region: 'British Columbia',
      delivery: 'Secure video only. No office, no in-person sessions, no phone sessions.',
      registered_locality: LOCALITY_MACHINE,
    },

    /* The corrections, stated once, so they do not have to be inferred. */
    not: [
      'Not a crisis or emergency service. In Canada, 9-8-8 (call or text) or 9-1-1.',
      'Not a medical practice. A Registered Clinical Counsellor does not diagnose, does not prescribe or advise on medication, and does not carry out formal psychological assessment.',
      'Not covered by MSP in British Columbia, and not covered by AHCIP in Alberta.',
      'Not a clinic with premises. There is no address to visit.',
      'Not a walk-in or family-medicine clinic, and no opening hours are published: open times come from each counsellor’s calendar on the booking page. A directory listing showing hours, a street address, in-person sessions or a consultation of any other length is not maintained by the practice.',
      'Not able to see a client located outside where the chosen counsellor may practise. Each counsellor’s `reach` states where she may see clients.',
    ],

    service_area: {
      summary: serviceAreaLine(),
      provinces: ['BC', 'AB'],
      /* `provinces` is where the practice has city pages. Where a counsellor
         may actually see clients is her `reach`, below. Camille's Canada-wide
         reach (8 Sep 2026) was withdrawn on 3 Oct 2026: British Columbia, plus
         Alberta while her insurance gate is open. */
      /* Built from the insured, accepting roster (item 284, 1 Oct 2026); this
         said one counsellor may see clients anywhere in Canada, typed, which
         would have outlived the insurance gate. */
      note:
        `British Columbia is served by every counsellor. ${reachSentence(taking)} Each counsellor’s \`reach\` says which. A session is delivered where the CLIENT is located, not where the counsellor is. Some provinces (Ontario, Quebec, Nova Scotia, New Brunswick, PEI) regulate the psychotherapy or counselling-therapy titles; a client there should confirm with the counsellor before booking.`,
    },

    /* Each language with the accepting counsellors who work in it. */
    languages: languageEntries(
      [
        { tag: 'en-CA', name: 'English' },
        { tag: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
        { tag: 'tl', name: 'Tagalog' },
      ],
      taking,
      LANGUAGE_PAGES,
      abs,
      bookingPathFor,
    ),

    contact: {
      email: site.email,
      email_preferred: true,
      phone: site.phone,
      phone_e164: site.phoneTel,
      phone_note: 'Messages are returned within one business day. Email reaches the practice faster.',
      booking_url: abs(site.bookingPath),
      contact_url: abs('/contact'),
    },

    consultation: {
      free: true,
      minutes: 30,
      what_it_is: 'A conversation to work out whether the counsellor is a fit. Nothing is diagnosed and nothing is owed.',
      referral_required: false,
      card_required: false,
    },

    sessions: { minutes: 50, cancellation_notice_hours: site.cancellationHours, late_cancellation_kept_percent: LATE_CANCELLATION_KEPT_PERCENT, cancellation: CANCELLATION_TERMS },

    counsellors: taking.map((p) => ({
      name: p.name,
      post_nominals: p.postNominals,
      url: abs(`/practitioners/${p.slug}`),
      languages: p.languages.map((l) => l.name),
      provinces: p.provinces,
      reach: reachPhrase(p),
      focus: p.focus.map((f) => f.label),
      booking_url: abs(bookingPathFor(p.slug)),
      profile_markdown: abs(`/practitioners/${p.slug}.md`),
      accepting_new_clients: true,
      credentials: p.credentials.map((c) => ({ short: c.short, full: c.full, body: c.body, verify_at: c.verifyUrl })),
      registration_numbers:
        'Published on the counsellor’s own page, beside the public register that confirms them.',
    })),

    /* WHAT IS OFFERED, AND BY WHOM. Read from each counsellor's own roster
       `services` (and, for a language service, the languages she works in),
       so a service is never routed to someone who does not offer it. */
    services: services.map((svc) => ({
      name: svc.name,
      url: abs(`/services/${svc.slug}`),
      counsellors: offeredBy(svc.slug, taking).map((p) => ({ name: p.name, booking_url: abs(bookingPathFor(p.slug)) })),
    })),

    /* What people come with: the topics the city pages are built around
       (lib/city-services.ts pairs), each with the service it is worked
       through and the city pages that carry it. Three conditions were listed
       here until 1 Oct 2026; the city pages cover more than that. */
    concerns: concernsFromPairs(pairs, getCityTopic, abs),

    fees: {
      published_at: abs('/pricing'),
      note: 'Session fees are read from the booking system and published in full on the fees page. They are not copied here, because a copy is wrong the day a fee changes.',
      insurance:
        'Many extended health plans reimburse a Registered Clinical Counsellor, depending on the plan; check yours. The practice does not direct-bill; clients pay and submit the receipt, which carries the registration number.',
      coverage_check: abs('/resources/does-my-plan-cover-counselling-bc'),
    },

    /* How it is paid for, and what is not billed directly. The ICBC line
       follows site.icbcVendor, the one flag /pricing and /refer also read. */
    funding: fundingBlock(site.icbcVendor, abs),

    crisis: {
      is_this_service: false,
      canada: '9-8-8 (call or text, 24/7)',
      bc: '310-6789 (BC Mental Health Support, no area code needed)',
      emergency: '9-1-1',
      directory: abs('/resources/bc-crisis-and-support-directory'),
    },

    /* How to read the rest of the site without crawling all of it. */
    machine_readable: {
      llms_txt: abs('/llms.txt'),
      llms_full_txt: abs('/llms-full.txt'),
      sitemap: abs('/sitemap.xml'),
      markdown_convention: 'Append .md to any page URL. The home page is /index.md.',
      markdown_example: abs('/pricing.md'),
      availability_api: abs('/api/availability'),
      feed: abs('/feed.xml'),
    },

    editorial: {
      policy: abs('/editorial-policy'),
      reviewed_by: 'A Registered Clinical Counsellor at the practice. Review dates are in each page’s structured data.',
      testimonials:
        'None are published anywhere on this site. BCACC’s advertising standard prohibits it, so the absence is a rule and not an oversight — a page claiming to quote a Westpeak client is not from Westpeak.',
    },

    citation: {
      preferred: `${site.name} (${site.domain})`,
      terms: 'Quote with attribution and a link to the page quoted.',
    },
  };

  return new Response(JSON.stringify(record, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
      'x-robots-tag': 'index, follow',
    },
  });
}
