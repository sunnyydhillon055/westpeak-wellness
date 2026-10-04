import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import BookLink from '@/components/BookLink';
import { counsellorsForAudience } from '@/lib/counsellor-cards';
import { bookHrefFor } from '@/lib/city-service-page';
import { LOWERCASE_RETRY } from '@/lib/error-routes';

export const metadata: Metadata = {
  title: 'Page not found',
  /* Its own description, added 2026-08-30. Without one the page inherited the
     homepage's from layout.tsx, so the quality sweep reported / and /_not-found
     sharing a description and it was right to: a 404 was describing itself to
     anything that read metadata as "online counselling across BC with a
     Registered Clinical Counsellor". Nothing indexes this page, but plenty
     reads it — link unfurls in a chat app, and increasingly the models that
     summarise a URL without fetching twice. */
  description:
    'That page has moved or never existed. Search the site, or jump to services, ' +
    'fees, guides or booking.',
  /* No canonical, deliberately. Without this the page inherited the root
     canonical from layout.tsx and every 404 URL on the site declared itself
     to really be the homepage - a consolidation signal pointing the wrong way,
     emitted by the one page that should make no claim about its own identity.
     `null` removes the inherited tag; omitting the key would keep it. */
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

/* The 404.
 *
 * It was a dead end: a heading and one "return home" button. A 404 on this
 * site is most often someone following an old Wix link or a half-remembered
 * URL, and dropping them on the homepage makes them start the search over.
 *
 * `follow` is deliberately left on while `index` is off — the links out of
 * this page are real and worth crawling; the page itself is not worth
 * indexing.
 */
export default function NotFound() {
  return (
    <>
    {/* Every route here is lowercase; /Book and /Services/EMDR-Therapy 404'd
        in production. One lowercase retry, client-side, so no middleware runs
        on every request (lib/error-routes.ts, finishing R3 #245). */}
    <script dangerouslySetInnerHTML={{ __html: LOWERCASE_RETRY }} />
    <section className="section" style={{ paddingTop: 80 }}>
      <div className="container prose" style={{ maxWidth: '44rem' }}>
        <p className="eyebrow">Page not found</p>
        <h1>That page moved, or never existed.</h1>
        <p className="lede">
          Most links still work. This one did not. The page may have moved, or the address may
          have a character out of place. Below are the destinations people are usually looking
          for when they land here, and a search box if none of them is it.
        </p>

        <form action="/search" method="get" role="search" className="nf-search">
          <label htmlFor="nf-q">Search the site</label>
          <div className="nf-search-row">
            <input
              id="nf-q"
              type="search"
              name="q"
              placeholder="anxiety, fees, first session…"
              autoComplete="off"
            />
            <button className="btn btn--primary" type="submit">Search</button>
          </div>
        </form>

        <h2>Common destinations</h2>
        <ul>
          <li><Link href="/services">All counselling services</Link>: individual, couples, EMDR, trauma</li>
          <li><Link href="/pricing">Fees and insurance</Link>, what a session costs and how coverage works</li>
          <li><Link href={site.bookingPath}>Book a free 15-minute consultation</Link></li>
          <li><Link href="/guides">Counselling guides</Link>, plain answers to common questions</li>
          {/* WHO IS TAKING NEW CLIENTS, BY NAME — 2 Oct 2026. The 404 named
              nobody and linked the founder's /about page. The same rule as the
              audience pages (lib/counsellor-cards.ts), each name opening her
              own calendar. A line of links rather than the photo cards: Next
              embeds this page in the RSC payload of every page on the site,
              and the cards cost about 4 KB on each of them (measured on the
              2 Oct build). */}
          <li>
            <Link href="/practitioners">The counsellors taking new clients</Link>
            {counsellorsForAudience({}).map((p) => (
              <span key={p.slug}>
                {' · '}
                <BookLink location="counsellor-not-found" className="" href={bookHrefFor([p])}>
                  book with {p.name.split(' ')[0]}
                </BookLink>
              </span>
            ))}
          </li>
          <li><Link href="/faq">FAQ</Link> · <Link href="/contact">Contact</Link> · email <a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><Link href="/punjabi" lang="pa">ਪੰਜਾਬੀ</Link>, this practice&rsquo;s pages in Punjabi · <Link href="/tagalog" lang="tl">Tagalog</Link>, its pages in Tagalog</li>
        </ul>

        {/* A 404 is not an error page, it is a person who wanted something and
            did not find it. It offered a list of links and no way to say what
            they were actually after. */}

        <h2>If you were looking for help right now</h2>
        <p>
          This is not a crisis service. If you are in crisis, call or text{' '}
          <a href="tel:988">9-8-8</a>, the Suicide Crisis Helpline, anywhere in Canada,
          24/7. In immediate danger, call <a href="tel:911">9-1-1</a>. The{' '}
          <Link href="/resources/bc-crisis-and-support-directory">full BC directory</Link> lists
          every service by region.
        </p>
      </div>
    </section>
    </>
  );
}
