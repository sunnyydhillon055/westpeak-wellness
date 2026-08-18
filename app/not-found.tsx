import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page not found',
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
    <section className="section" style={{ paddingTop: 80 }}>
      <div className="container prose" style={{ maxWidth: '44rem' }}>
        <p className="eyebrow">Page not found</p>
        <h1>That page moved, or never existed.</h1>
        <p className="lede">
          Most links still work — this one did not. Here is where people usually meant to go.
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
          <li><Link href="/services">All counselling services</Link> — individual, couples, EMDR, trauma</li>
          <li><Link href="/pricing">Fees and insurance</Link> — what a session costs and how coverage works</li>
          <li><Link href={site.bookingPath}>Book a free 15-minute consultation</Link></li>
          <li><Link href="/guides">Counselling guides</Link> — plain answers to common questions</li>
          <li><Link href="/faq">FAQ</Link> · <Link href="/contact">Contact</Link> · <Link href="/about">About the counsellor</Link></li>
          <li><Link href="/punjabi" lang="pa">ਪੰਜਾਬੀ</Link> — this practice&rsquo;s pages in Punjabi</li>
        </ul>

        <h2>If you were looking for help right now</h2>
        <p>
          This is not a crisis service. If you are in crisis, call or text{' '}
          <a href="tel:988">9-8-8</a> (Canada, 24/7), or{' '}
          — the Suicide Crisis Helpline, anywhere in Canada, 24/7. In immediate danger,
          call <a href="tel:911">9-1-1</a>. The{' '}
          <Link href="/resources/bc-crisis-and-support-directory">full BC directory</Link> lists
          every service by region.
        </p>
      </div>
    </section>
  );
}
