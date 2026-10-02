import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { buildIndex, searchIndex, topService } from '@/lib/search-index';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchBeacon from '@/components/SearchBeacon';
import BookLink from '@/components/BookLink';
import CounsellorCards from '@/components/CounsellorCards';
import CoverageLine from '@/components/CoverageLine';
import { services, getService } from '@/lib/services';
import { readCatalog } from '@/lib/cliniko-catalog';
import { feeFor } from '@/lib/city-service-page';
import { counsellorsForService } from '@/lib/counsellor-cards';
import { bookingFor, serviceNoun } from '@/lib/booking-cta';

export const metadata: Metadata = {
  title: { absolute: 'Search | Westpeak Wellness' },
  description: 'Search the counselling guides, services, comparisons and BC resources on this site.',
  alternates: { canonical: `${site.domain}/search` },
  robots: { index: false, follow: true },
};

/* Server-side search over a build-time index.
 *
 * No JavaScript and no search service. The index is assembled
 * from the same data the pages render from, so it can never drift out of date,
 * and results are computed per request from the URL — which means a search
 * result page can be linked, bookmarked and read by a crawler.
 *
 * ON QUERY LOGGING. This comment used to say "no query logging", and that was
 * the right instinct — a search box on a counselling site receives things like
 * "can my therapist tell my husband", and a log of individual searches is a log
 * of people's worst moments waiting to be subpoenaed.
 *
 * What happens now is not logging. SearchBeacon increments a COUNT per term:
 * no timestamp, no IP, no session, no ordering, nothing joining two searches to
 * one person. A tally of words, not a record of events, and terms long enough
 * to be a sentence rather than a query are dropped rather than truncated. See
 * lib/search-log.ts, which explains the distinction at length because it is the
 * part that has to be got right.
 *
 * This page is also what makes the WebSite SearchAction in the root layout
 * honest. It was deliberately omitted before this existed: markup describing a
 * capability the site does not have is how structured data gets distrusted. */
export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q ?? '').trim();
  const index = buildIndex();
  const results = q ? searchIndex(index, q) : [];

  /* WHEN THE TOP HIT IS A SERVICE, THE ANSWER COMES FIRST — 1 Oct 2026.
     Somebody who searches "couples counselling abbotsford" has said what
     they want; the results list used to make them click through to find the
     fee and the button. The fee is the catalogue's (feeFor, the city x
     service pages' own mapping, so no figure is typed here), the cards are
     whoever offers it (counsellorsForService), and the button goes through
     bookingFor(): the language counsellor for a language service, the one
     calendar where only one counsellor offers it, /book otherwise. */
  const top = getService(topService(results) ?? '');
  const catalog = top ? await readCatalog() : undefined;
  const fee = top && catalog ? feeFor(catalog, { bookingService: top.slug }) : undefined;
  const offering = top ? counsellorsForService(top) : [];
  const book = top ? bookingFor(top.language ? undefined : top.slug, top.language) : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SearchResultsPage',
            '@id': abs('/search'),
            name: 'Search',
            isPartOf: siteRef,
            publisher: orgRef,
          }),
        }}
      />

      {q ? <SearchBeacon q={q} /> : null}

      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container container--narrow">
          <p className="eyebrow">{index.length} pages</p>
          <h1>Search</h1>
          <form method="GET" action="/search" className="search-form" role="search">
            <label htmlFor="q" className="sr-only">Search this site</label>
            <input
              id="q" name="q" type="search" defaultValue={q} autoComplete="off"
              placeholder="e.g. EMDR, extended health, burnout"
            />
            <button type="submit" className="btn btn--primary">Search</button>
          </form>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container container--narrow">
          <Breadcrumbs schema={false} trail={[{ name: 'Search', path: '/search' }]} />

          {!q && (
            <p className="lede">
              Type anything above, or browse the <Link href="/guides">guides</Link>,{' '}
              <Link href="/services">services</Link>, <Link href="/compare">comparisons</Link>,{' '}
              <Link href="/resources">BC resources</Link>, <Link href="/tools">tools</Link> and{' '}
              <Link href="/glossary">glossary</Link>.
            </p>
          )}

          {q && results.length === 0 && (
            <>
              <h2>Nothing matched &ldquo;{q}&rdquo;</h2>
              {/* /answers holds the full text of every answered question and
                  filters it from ?q=, so it finds words this index (titles
                  and summaries) does not hold. 1 Oct 2026. */}
              <p>
                <Link className="btn btn--primary" href={`/answers?q=${encodeURIComponent(q)}`}>
                  Search the answered questions for &ldquo;{q}&rdquo;
                </Link>
              </p>
              <p>
                Try a plainer word, this site indexes titles and summaries rather than every
                sentence. The <Link href="/glossary">glossary</Link> defines sixty terms, and{' '}
                <Link href="/guides">the guides</Link> cover most of what people arrive looking
                for. If it is quicker to ask,{' '}
                <Link href={site.bookingPath}>a free 30-minute consultation</Link> costs nothing.
              </p>
              {/* A dead end that only says "try again" wastes the one thing this
                  person has given you, which is their attention. These are the
                  pages people actually arrive on, offered as a starting point
                  rather than a consolation. */}
              <p className="lead-form-title" style={{ marginTop: 26 }}>Or start from one of these</p>
              <ul className="chip-grid" style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
                <li><Link className="chip" href="/faq">Frequently asked questions</Link></li>
                <li><Link className="chip" href="/pricing">What it costs and what insurance covers</Link></li>
                <li><Link className="chip" href="/services">The {services.length} kinds of counselling offered</Link></li>
                <li><Link className="chip" href="/resources/low-cost-counselling-bc">Free and low-cost counselling in BC</Link></li>
                <li><Link className="chip" href="/guides/what-to-expect-first-therapy-session">What happens in a first session</Link></li>
                <li><Link className="chip" href="/resources/bc-crisis-and-support-directory">Crisis lines and urgent support</Link></li>
              </ul>
            </>
          )}

          {q && results.length > 0 && (
            <>
              {top && (
                <div className="card" style={{ marginBottom: 28 }}>
                  <h2 style={{ marginTop: 0 }}>{top.name}</h2>
                  {fee && (
                    <p>
                      <strong>{fee.fee}</strong> for {fee.minutes} minutes. The first 30-minute
                      consultation is free.
                    </p>
                  )}
                  <CoverageLine />
                  <p style={{ marginTop: 14 }}>
                    <BookLink location="search" href={book?.href}>
                      {book?.labelSuffix
                        ? `Book a free consultation${book.labelSuffix}`
                        : `Book a free consultation for ${serviceNoun(top.name)}`}
                    </BookLink>
                  </p>
                </div>
              )}
              {top && offering.length > 0 && (
                <CounsellorCards
                  counsellors={offering}
                  service={top.slug}
                  location="search"
                  heading={`Who offers ${serviceNoun(top.name)}`}
                  className="search-counsellors"
                />
              )}
              <h2>{results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{q}&rdquo;</h2>
              <ul className="search-results">
                {results.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.title}</Link>
                    <span className="search-kind">{r.kind}</span>
                    <p>{r.summary}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
