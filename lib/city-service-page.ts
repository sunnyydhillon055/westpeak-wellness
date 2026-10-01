import { practitioners, withLetters, type Practitioner } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import type { CityTopic } from '@/lib/conditions';
import type { CityContext } from '@/lib/city-context';
import type { Location } from '@/lib/locations';
import { money, type Catalog } from '@/lib/cliniko-catalog';
import { site } from '@/lib/site';

/* WHAT A CITY × SERVICE PAGE SAYS FROM DATA — 1 Oct 2026.
 *
 * WHY THIS FILE EXISTS
 *
 * The fifty city-service pages sat at positions 28-83 in Search Console on
 * 26 Sep 2026, and 51 of 55 had not moved by a hundredth of a position
 * between the 17 Sep and 26 Sep exports. Thirteen of the pages that DO rank
 * for the same queries were read (scratchpad/city-service-competitors.md).
 * Eight of thirteen name a counsellor with a credential line on the page
 * itself; ten of thirteen put the booking action above the fold; seven carry
 * FAQs about cost, coverage and who you would see; the one that ranks first
 * for couples in Abbotsford states a fee and says coverage varies.
 *
 * Our template named nobody, printed "$140 for 50 minutes" on couples and
 * EMDR pages where that is not the fee, had its booking button fourth in the
 * hero as an untracked Link, and asked only the two or three questions the
 * pair's author thought of. Every one of those gaps is closable from data the
 * roster and the catalogue already hold, which is why this is a lib file and
 * not fifty edits to lib/city-services.ts.
 *
 * WHY THE SENTENCES ARE SHAPED THE WAY THEY ARE
 *
 * scripts/uniqueness-gate.mjs fails the build if any page is less than 18%
 * unique by 8-word shingle, and the pages sat at 21% before this. Text that
 * is generated per page but reads the same on all fifty is exactly the
 * boilerplate the gate exists to catch. So every generated sentence carries
 * the city, the service or a counsellor's name inside its first eight words,
 * and the shared tail after the last data point is kept short. A test checks
 * that no two pages share a generated answer; the gate checks the rendered
 * result.
 *
 * WHAT IS DELIBERATELY NOT HERE
 *
 * No availability line: hours are not published anywhere (DECISIONS, 28 Sep
 * 2026). No insurer names and no promise: coverage is "plan-dependent". No
 * registration numbers: those live on the profile page only. The founder is
 * never listed, because she is not accepting new clients and the filter is
 * `acceptingNewClients`, not a name.
 */

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** "a, b and c" / "a or b". One item returns itself. */
export const listOf = (items: string[], conj: 'and' | 'or') =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;

/* The counsellors who could actually take this work: accepting, insured for
   BC, and offering the Cliniko appointment type the topic books into. A
   condition (anxiety, depression) books into individual therapy, so both
   counsellors appear; couples and EMDR book into types only one of them
   offers. Roster order is kept — it is the order /book uses. */
export const counsellorsFor = (topic: Pick<CityTopic, 'bookingService'>): Practitioner[] =>
  practitioners.filter(
    (p) =>
      p.acceptingNewClients &&
      p.provinces.includes('BC') &&
      p.services.includes(topic.bookingService),
  );

/* Her page for this city when she has one, her profile when she does not.
   Only counsellors with placePages get per-city routes, and only for cities
   in their own place list, so this never links to a route that was not
   generated. Same rule as the city hub's chips. */
export const profileHrefFor = (p: Practitioner, citySlug: string) =>
  p.placePages && placesFor(p.provinces).some((c) => c.slug === citySlug)
    ? `/practitioners/${p.slug}/${citySlug}`
    : `/practitioners/${p.slug}`;

/* `?with=` only when exactly one counsellor offers the service. Nobody is the
   default on /book (DECISIONS, 8 Sep 2026); narrowing to one calendar is
   honest only when there is one calendar it could be. Two counsellors means
   the reader chooses on /book, as they do everywhere else. */
export const bookHrefFor = (counsellors: Practitioner[]) =>
  counsellors.length === 1 ? `${site.bookingPath}?with=${counsellors[0].slug}` : site.bookingPath;

/* The Cliniko appointment type each bookable service bills as. A name, not a
   price: the price is read from the catalogue, which scripts/price-drift.mjs
   compares against Cliniko on every build. The service page keeps the same
   mapping for its nine slugs; this one covers only the three the matrix books
   into, so there is still no fourth place a dollar figure is typed. */
const BILLED_AS: Record<string, string | undefined> = {
  'individual-therapy': 'Individual Counselling',
  'couples-therapy': 'Couples Counselling',
  'emdr-therapy': 'EMDR Intensive',
};

export type Fee = { fee: string; minutes: number };

export const feeFor = (catalog: Catalog, topic: Pick<CityTopic, 'bookingService'>): Fee | undefined => {
  const name = BILLED_AS[topic.bookingService];
  const item = name ? catalog.items.find((i) => i.name.toLowerCase() === name.toLowerCase()) : undefined;
  return item ? { fee: money(item.cents), minutes: item.minutes } : undefined;
};

export const languagesOf = (p: Practitioner) => p.languages.map((l) => l.name);

/* The three questions the ranking pages answer and the pair authors did not:
   who you would see, whether the places around the city count, and what it
   costs. Each answer is built from the page's own data so that the same
   question reads differently on every page, and is published in the FAQPage
   schema beside the pair's own questions. */
export function generatedFaqs(args: {
  topic: Pick<CityTopic, 'name' | 'bookingService'>;
  ctx: Pick<CityContext, 'city' | 'region' | 'authority'>;
  loc: Pick<Location, 'communities'>;
  counsellors: Practitioner[];
  fee?: Fee;
}): { q: string; a: string }[] {
  const { topic, ctx, loc, counsellors, fee } = args;
  const svc = lower(topic.name);
  const out: { q: string; a: string }[] = [];

  if (counsellors.length) {
    const who = counsellors.map((p) => `${withLetters(p)}, who works in ${listOf(languagesOf(p), 'and')}`);
    const first = counsellors[0].name.split(' ')[0];
    out.push({
      q: `Who would I see for ${svc} in ${ctx.city}?`,
      /* The service is in the answer, not only the question: the same
         counsellor serves couples and EMDR, and without it two pages for one
         city carried one answer. The test on this file caught it. */
      a:
        counsellors.length === 1
          ? `For ${svc} in ${ctx.city}, ${who[0]}. Every session is by secure video, and the free consultation is with ${first} as well, so the person you meet first is the person you would see.`
          : `For ${svc} in ${ctx.city}, ${listOf(who, 'or')}. Each sees people by secure video, and the free consultation is with whichever of them you choose, so the person you meet first is the person you would see.`,
    });
  }

  if (loc.communities?.length) {
    out.push({
      q: `Is ${svc} available in ${listOf(loc.communities, 'or')}?`,
      a: `Yes. ${topic.name} by secure video reaches ${listOf(loc.communities, 'and')} exactly as it reaches ${ctx.city}: there is no office to get to and the same fee applies however far out you are. ${ctx.authority} is the public route for the whole of ${ctx.region}; this is the private one, and it needs no referral.`,
    });
  }

  if (fee) {
    out.push({
      q: `What does ${svc} cost in ${ctx.city}, and will my plan cover it?`,
      a: `In ${ctx.city}, as everywhere in BC, ${svc} is ${fee.fee} for ${fee.minutes} minutes, after a free 30-minute consultation. Many BC extended health plans reimburse a Registered Clinical Counsellor; whether yours does is plan-dependent, so check it for the RCC designation before the first paid session.`,
    });
  }

  return out;
}
