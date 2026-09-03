import type { Service } from './services';
import { getService } from './services';

/* ============================================================================
   CONDITIONS — WHAT PEOPLE SEARCH FOR, WHICH IS NOT WHAT THE PRACTICE SELLS
   ----------------------------------------------------------------------------
   The practice offers five services. Nobody searches for four of them by name.
   They search for what is wrong: "anxiety counselling Surrey", "trauma therapy
   Kelowna", "depression counselling Vancouver". The service that answers all
   three is individual therapy, and "individual therapy Surrey" has close to no
   search volume at all.

   THIS FILE EXISTS BECAUSE THE MATRIX WAS BUILT FOR FIVE AND LOST THREE.
   lib/city-services.ts still declares PAIRED_SERVICES as anxiety, trauma,
   couples, EMDR and depression — fifty pages across ten cities. Then the
   service list was consolidated to five on 31 Aug 2026 and anxiety, trauma and
   depression stopped being services, so `getService()` returns nothing for them
   and thirty of those fifty pages could not be built. Twenty exist. Thirty were
   designed, are wanted, and had nowhere to resolve from.

   A CONDITION IS NOT A SERVICE, DELIBERATELY. Restoring these as services would
   undo the owner's decision and put nine things back on a menu that was cut to
   five for good reasons. A condition has a name and a description and routes to
   the service that actually treats it. It appears in city pages and in search
   results; it does not appear on /services, in the footer, or in the nav.

   Each one carries the same shape the city page needs from a service — name,
   intro, helps, approach — so the route can render either without knowing which
   it has.
   ========================================================================= */

export type Condition = {
  slug: string;
  /** Display name, title case, as it appears in a heading. */
  name: string;
  /** Opening paragraph on a city page. */
  intro: string;
  /** The "this helps with" list. */
  helps: string[];
  /** How the practice works with it. */
  approach: string;
  /** The service that actually delivers this. Every page routes here to book. */
  service: string;
  metaNoun: string;
};

export const conditions: Condition[] = [
  {
    slug: 'anxiety-counselling',
    name: 'Anxiety Counselling',
    metaNoun: 'anxiety counselling',
    intro:
      'Anxiety is the most common reason people contact a counsellor, and the most commonly described as something that should be manageable alone. It rarely is, and the version that hides best — functioning, delivering, and privately exhausted — is the one that goes longest without help.',
    helps: [
      'Worry that runs constantly in the background',
      'Panic, and the fear of the next one',
      'Social anxiety, and the replaying afterwards',
      'Health anxiety and checking',
      'Perfectionism, over-preparing, and the sense of never quite being enough',
      'Sleep that will not come because the day has not finished in your head',
    ],
    approach:
      'The work is practical rather than reassuring. Anxiety maintains itself through avoidance and through checking, so the sessions look at what is actually keeping the pattern going and change that, rather than arguing with the thought each time it arrives.',
    service: 'individual-therapy',
  },
  {
    slug: 'trauma-therapy',
    name: 'Trauma Therapy',
    metaNoun: 'trauma therapy',
    intro:
      'Trauma is not only the events people expect to count. It is anything that overwhelmed you at the time and did not finish being processed — which is why it can follow a single incident, a childhood, or a job you were good at.',
    helps: [
      'A memory that intrudes, or a stretch of time that will not come back at all',
      'Reactions out of proportion to what is in front of you',
      'Feeling numb, distant, or watching yourself from outside',
      'Sleep, nightmares, and a body that will not settle',
      'What got carried down through a family rather than happening to you',
      'Vicarious trauma from work — healthcare, first response, care',
    ],
    approach:
      'Pacing first. Nothing here starts with the hardest thing: the early sessions build enough safety and enough control that the harder work is possible, and you decide what gets approached and when. EMDR is one of the tools, not the whole of it.',
    service: 'emdr-therapy',
  },
  {
    slug: 'depression-counselling',
    name: 'Depression Counselling',
    metaNoun: 'depression counselling',
    intro:
      'Depression is often described as sadness and is more often an absence — of energy, of interest, of the sense that any of it matters. It gets called laziness by the person experiencing it more than by anybody else.',
    helps: [
      'Low mood that has outlasted whatever started it',
      'Losing interest in things that used to matter',
      'Exhaustion that sleep does not touch',
      'Harsh, constant self-criticism',
      'Withdrawing from people, then feeling worse for being alone',
      'Winters that are consistently harder than the rest of the year',
    ],
    approach:
      'Depression removes the energy required to do the things that lift it, which is why advice fails. The work starts small and concrete, restores movement before insight, and looks at what is maintaining the low rather than only at how it feels.',
    service: 'individual-therapy',
  },
];

export const getCondition = (slug: string) => conditions.find((c) => c.slug === slug);

/* One resolver for the city page, which does not care which it has. Services
   win on a slug collision — a real service is always the more specific answer. */
export type CityTopic = Pick<Service, 'slug' | 'name' | 'intro' | 'helps' | 'approach'> & {
  /** Where booking and deeper reading go. Itself, for a service. */
  bookingService: string;
  isCondition: boolean;
};

export function getCityTopic(slug: string): CityTopic | undefined {
  const s = getService(slug);
  if (s) {
    return {
      slug: s.slug, name: s.name, intro: s.intro, helps: s.helps, approach: s.approach,
      bookingService: s.slug, isCondition: false,
    };
  }
  const c = getCondition(slug);
  if (c) {
    return {
      slug: c.slug, name: c.name, intro: c.intro, helps: c.helps, approach: c.approach,
      bookingService: c.service, isCondition: true,
    };
  }
  return undefined;
}
