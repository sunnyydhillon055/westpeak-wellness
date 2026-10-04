import Link from 'next/link';
import { cityContexts } from '@/lib/city-context';
import { getAudience } from '@/lib/audiences';
import { getSpoke, midSentence } from '@/lib/spokes';
import { getCityTopic } from '@/lib/conditions';
import { seoName, sentenceName } from '@/lib/city-service-page';

/* ============================================================================
   THE CITY × SERVICE PAGES, LINKED FROM THE GUIDE THAT LEADS TO THEM
   ----------------------------------------------------------------------------
   Added 1 October 2026. CityLinks (25 Sep) sends every informational page to
   the ten city hubs. Measured three days later, the fifty city-service pages
   beneath those hubs still had no inbound link from any guide, comparison or
   resource, and twelve of the audience pages were linked only from /answers.

   This block is the spoke for one page. It renders only where lib/spokes.ts
   names the page, so it is not boilerplate: a guide about panic attacks sends
   ten links to anxiety counselling in ten cities, and nothing to couples
   therapy. The anchor is the phrase as a person would type it — "Anxiety
   counselling in Vancouver" — never the slug, which is the defect the city
   hub pages had until the same day.

   Where the map names audience pages, one sentence links them by their own
   title, so the anchor says who the page is for.

   One service per page by design. Ten links is a pointer; fifty is a footer.
   The block sits inside <main>, between MoreFrom and CityLinks, where the
   link audits count it.
   ========================================================================= */
export default function ServiceCityLinks({
  section,
  slug,
}: {
  section: 'guides' | 'compare' | 'resources';
  slug: string;
}) {
  const spoke = getSpoke(section, slug);
  if (!spoke) return null;

  const audiences = (spoke.audiences ?? [])
    .map((s) => getAudience(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  if (!spoke.service && audiences.length === 0) return null;

  /* The anchor is the target's search name in sentence case — "Couples and
     marriage counselling in Abbotsford" — from the map the pair page's H1
     reads (lib/city-service-page.ts), so the link and the heading it lands
     on carry the same words. It was lib/spokes.ts SERVICE_ANCHOR, which
     said "Couples therapy" for pages headed Couples and Marriage
     Counselling. 1 Oct 2026. */
  const topic = spoke.service ? getCityTopic(spoke.service) : undefined;
  const label = topic ? sentenceName(seoName(topic)) : null;

  return (
    <section className="section" style={{ paddingTop: 44, paddingBottom: 44 }}>
      <div className="container">
        <p className="eyebrow">Where this leads</p>
        {spoke.service && label && (
          <>
            <h2 style={{ fontSize: '1.35rem' }}>Online {midSentence(label)} across BC</h2>
            <p style={{ marginTop: 8, color: 'var(--ink-soft)', maxWidth: 640 }}>
              The practice is virtual, so the same counsellors see people in every one of these
              cities. Each page says what the service involves there and who is taking new clients.
            </p>
            <div className="chip-grid" style={{ marginTop: 16 }}>
              {cityContexts.map((c) => (
                <Link prefetch={false} className="chip" key={c.slug} href={`/online-counselling/${c.slug}/${spoke.service}`}>
                  {label} in {c.city}
                </Link>
              ))}
            </div>
          </>
        )}
        {audiences.length > 0 && (
          <p style={{ marginTop: spoke.service ? 20 : 8, color: 'var(--ink-soft)', maxWidth: 640 }}>
            If this is close to your own situation, there is a page written for it:{' '}
            {audiences.map((a, i) => (
              <span key={a.slug}>
                {i > 0 && (i === audiences.length - 1 ? ' and ' : ', ')}
                <Link prefetch={false} href={`/for/${a.slug}`}>{a.title}</Link>
              </span>
            ))}
            .
          </p>
        )}
      </div>
    </section>
  );
}
