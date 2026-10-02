import type { Practitioner } from '@/lib/practitioners';
import { money, type Catalog } from '@/lib/cliniko-catalog';
import { listOf, seoName } from '@/lib/city-service-page';
import { whoLine } from '@/lib/counsellor-cards';
import { featuredServices } from '@/lib/services';
import { getCityTopic } from '@/lib/conditions';
import type { Pair } from '@/lib/city-services';

/* THE CITY HUB'S TITLE AND ITS GENERATED QUESTIONS — 1 Oct 2026.
 *
 * TITLE. DECISIONS, 17 Sep 2026: city titles say "Online & Virtual
 * Counselling in <city>, BC", because for Vancouver alone "virtual
 * counselling" and "virtual therapy" carried 127 impressions a quarter against
 * 137 for "online counselling". 9628b75 (26 Sep) added "| Counsellors" for the
 * person-named queries ("counsellor kamloops") and dropped "Virtual" in the
 * same edit, with no entry saying why. Both are kept here.
 *
 * The SEO gate (scripts/seo-audit.mjs) measures the title as it appears in
 * the HTML, where "&" is "&amp;", and refuses anything over 60. So the length
 * is measured the same way, and the title is composed to fit rather than
 * truncated: ", BC" goes first (the H1, the description and the schema all
 * carry the province), then " in" (Prince George only). "Online", "Virtual",
 * "Counselling", the city and "Counsellors" are never dropped. */

const TITLE_MAX = 60;
/** Length as the SEO gate reads it: the raw HTML, entities and all. */
export const htmlLength = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').length;

/* `city` is the hub's displayPlace where it has one. "White Rock & South
   Surrey" (1 Oct 2026) fits none of the first three rungs: each "&" costs
   five characters to the gate. The fourth rung gives up "Virtual" and spells
   the place's "&" as "and" (60 exactly), and only that hub reaches it; its
   description says "virtual" instead. South Surrey is the volume to gain there, and the White Rock
   terms were already at position 1 (Search Console, 26 Sep 2026).
   The comma rung (2 Oct 2026) is for city names of 14 characters or more
   (Port Coquitlam, Campbell River, North Vancouver, New Westminster): the
   "&" alone costs five characters to the gate, so a comma keeps "Virtual"
   where the third rung no longer fits. No existing hub's title changes. */
export function cityHubTitle(city: string): string {
  const ladder = [
    `Online & Virtual Counselling in ${city}, BC | Counsellors`,
    `Online & Virtual Counselling in ${city} | Counsellors`,
    `Online & Virtual Counselling ${city} | Counsellors`,
    `Online, Virtual Counselling ${city} | Counsellors`,
    `Online Counselling ${city.replace(/ & /g, ' and ')} | Counsellors`,
  ];
  return ladder.find((t) => htmlLength(t) <= TITLE_MAX) ?? ladder[ladder.length - 1];
}

/* FAQS. The hubs asked whatever the city's author thought of — seven on
 * Surrey — and none of them answered the three a person asks before booking
 * anywhere: what it costs, who they would see, and whether there is an office
 * to go to. A client asked the last one this week. Each answer is built from
 * the roster and the catalogue, so a fee change or a new counsellor changes
 * the answer without anyone editing fifteen cities.
 *
 * A city that already asks one of these in its own words keeps its own
 * (White Rock's office question, Chilliwack's cost question); the generated
 * one is not added beside it. */

type Faq = { q: string; a: string };

const ASKS_COST = /\b(cost|costs|fee|fees|price)\b/i;
const ASKS_OFFICE = /\boffice\b/i;

const fee = (catalog: Catalog, name: string) => {
  const i = catalog.items.find((x) => x.name.toLowerCase() === name.toLowerCase());
  return i && i.cents > 0 ? `${money(i.cents)} for ${i.minutes} minutes` : undefined;
};

export function cityHubFaqs(args: {
  city: string;
  counsellors: Practitioner[];
  catalog: Catalog;
  existing: Faq[];
}): Faq[] {
  const { city, counsellors, catalog, existing } = args;
  const out: Faq[] = [];
  const asked = (re: RegExp) => existing.some((f) => re.test(f.q));

  const individual = fee(catalog, 'Individual Counselling');
  if (individual && !asked(ASKS_COST)) {
    const others = [
      ['couples counselling', fee(catalog, 'Couples Counselling')],
      ['an EMDR intensive', fee(catalog, 'EMDR Intensive')],
    ].filter((x): x is [string, string] => !!x[1]).map(([n, f]) => `${n} ${f}`);
    out.push({
      q: `What does counselling cost in ${city}?`,
      a: `From ${city}, an individual session is ${individual}${others.length ? `, ${listOf(others, 'and')}` : ''}, and the first 30-minute consultation is free. The fee is the same anywhere in BC. Many extended health plans reimburse a Registered Clinical Counsellor, but whether yours does is plan-dependent, so check it for the RCC designation before the first paid session.`,
    });
  }

  if (counsellors.length) {
    const who = counsellors.map(whoLine);
    out.push({
      q: `Who would I see in ${city}?`,
      a: counsellors.length === 1
        ? `People in ${city} see ${who[0]}, by secure video. The free consultation is with ${counsellors[0].name.split(' ')[0]} too, so the person you meet first is the person you would work with.`
        : `People in ${city} see ${listOf(who, 'or')}. Each is a Registered Clinical Counsellor taking new clients by secure video, and the free consultation is with whichever of them you choose, so the person you meet first is the person you would work with.`,
    });
  }

  if (!asked(ASKS_OFFICE)) {
    out.push({
      q: `Do you have an office in ${city}, or is it online?`,
      a: `Online. There is no office in ${city} or anywhere else: every session is by secure video, and the confirmation email carries the link. Nothing to install and no waiting room, so you can join from home, a parked car or a closed office in ${city}.`,
    });
  }

  return out;
}

/* "WAYS WE CAN HELP" — where each card goes. 1 Oct 2026.
 *
 * The cards read "<service> in <city>" and linked /services/<slug>: the label
 * promised the city's page and the link went to the province-wide one, while
 * the fifty city x service pages sat at 5-9 inbound links each. Where the
 * city has the pair, the card now links it; the conditions this city has
 * pages for (anxiety, trauma, depression) get cards of their own, carrying
 * the pair's one-sentence angle, which is true of that city and no other. A
 * service with no city page (individual therapy) keeps /services.
 *
 * `anchor` is the link text, and it is the page's search name (seoName, the
 * same map as the pair page's H1): the Abbotsford and Prince George hubs
 * linked "Couples Therapy in ..." to pages titled and headed Marriage /
 * "Couples and Marriage Counselling". 1 Oct 2026. */
export type HelpCard = { slug: string; name: string; title: string; text: string; href: string; anchor: string };

const shortName = (n: string) => n.replace(' Therapy', '').replace(' Counselling', '');

export function helpCardsFor(citySlug: string, here: Pick<Pair, 'service' | 'angle'>[]): HelpCard[] {
  return [
    ...featuredServices.map((s) => ({
      slug: s.slug, name: s.name, title: shortName(s.name), text: s.short,
      href: here.some((p) => p.service === s.slug)
        ? `/online-counselling/${citySlug}/${s.slug}`
        : `/services/${s.slug}`,
      anchor: here.some((p) => p.service === s.slug) ? seoName(s) : s.name,
    })),
    ...here
      .filter((p) => !featuredServices.some((s) => s.slug === p.service))
      .flatMap((p) => {
        const t = getCityTopic(p.service);
        return t
          ? [{ slug: p.service, name: t.name, title: shortName(t.name), text: p.angle, href: `/online-counselling/${citySlug}/${p.service}`, anchor: seoName(t) }]
          : [];
      }),
  ];
}
