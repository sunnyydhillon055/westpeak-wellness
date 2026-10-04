import Link from 'next/link';
import { cityLinkTargets } from '@/lib/city-links';

/* ============================================================================
   THE CITY PAGES, LINKED FROM THE PAGES GOOGLE ACTUALLY SHOWS
   ----------------------------------------------------------------------------
   Added 25 September 2026, from the Search Console export of 17 September.

   The pages this site is shown for are the guides and resources: the
   workplace page alone had 1,674 impressions in the period, the RCC explainer
   1,613. The pages that earn a client — /online-counselling/vancouver and its
   siblings — sat at positions 44 to 85 for "online counselling vancouver" and
   the like, and had 28 inbound links each, mostly from one another.

   An internal link is the one ranking signal this codebase fully controls.
   This block puts a link to each of the ten city pages, with the city's own
   query as the anchor text, at the foot of every guide, resource, comparison,
   audience and approach page: about 190 pages, each sending ten links to the
   pages that matter. The block is the same on every page by design — it is
   navigation, not content, and a crawler treats a consistent block as such.

   Ten cities, not the full location list: these are the ten with a landing
   page in the competitor audit and the ten the rank tracker follows. The
   anchor is "Online counselling in {City}" because that is the phrase people
   type, in that order, per the export.

   AMENDED 1 October 2026: every city page, not ten. The link baseline of
   28 September measured the five city pages outside cityContexts — Richmond,
   Coquitlam, Delta, White Rock, Nanaimo — at 10 to 12 inbound links each and
   ZERO from any informational page, against 118 to 127 for the ten here.
   Those five pages exist because lib/locations.ts found something true and
   specific to say about each (White Rock is where the practice's Business
   Profile is registered); a page that is in the sitemap but reachable only
   from its siblings is the weakest page a crawler can find. The ten keep
   their place at the front; the rest of lib/locations.ts follows in its own
   order. No city gets prose here, so nothing is invented for the five —
   the chip is the city's name and its query, nothing more. The list is
   built in lib/city-links.ts so a test can read it without rendering JSX.
   ========================================================================= */
export default function CityLinks() {
  return (
    <section className="section section--ghost" style={{ paddingTop: 44, paddingBottom: 44 }}>
      <div className="container">
        <p className="eyebrow">Where you are</p>
        <h2 style={{ fontSize: '1.35rem' }}>Online counselling across British Columbia</h2>
        <p style={{ marginTop: 8, color: 'var(--ink-soft)', maxWidth: 640 }}>
          Every session is by secure video, so the counsellor you see does not depend on where you live.
          Each city page covers coverage, local public services and who is taking new clients there.
        </p>
        <div className="chip-grid" style={{ marginTop: 16 }}>
          {cityLinkTargets.map((c) => (
            <Link prefetch={false} className="chip" key={c.slug} href={`/online-counselling/${c.slug}`}>
              Online counselling in {c.city}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
