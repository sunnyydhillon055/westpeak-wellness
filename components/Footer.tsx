import Link from 'next/link';
import { site, REGISTERED_LOCALITY, LOCALITY_LABEL, LOCALITY_VISIBLE_NOTE } from '@/lib/site';
import { services } from '@/lib/services';
import Motif from '@/components/brand/Motif';
import SectionDivider from '@/components/brand/SectionDivider';
import MailLink from '@/components/MailLink';
import { serviceAreaLine } from '@/lib/practitioners';

/* THE FOOTER'S SEVEN ICONS, DRAWN HERE — 15 Oct 2026.
 *
 * They came from lucide-react, and lucide v1 marks its Icon component
 * 'use client': a server component rendering one still makes it a client
 * reference, so the footer alone put lucide's Icon (1,209 B) in the layout
 * chunk every page loads, to draw seven static shapes. The shapes are
 * lucide's own (v1.30.0, ISC licence; badge-check and landmark are the
 * TRUST_ICONS entries in lib/icon-map.ts), with the same attributes and
 * class names lucide renders, so the HTML is what it was. Pages that use
 * lucide elsewhere are unaffected; this file must not import it again. */
function Ico({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
      className={`lucide lucide-${name}`} aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const BadgeCheck = () => (
  <Ico name="badge-check">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 12 2 2 4-4" />
  </Ico>
);
const Landmark = () => (
  <Ico name="landmark">
    <path d="M10 18v-7" />
    <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
  </Ico>
);
const MapPin = () => (
  <Ico name="map-pin">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Ico>
);
const Mail = () => (
  <Ico name="mail">
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </Ico>
);
const Phone = () => (
  <Ico name="phone">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </Ico>
);
const AtSign = () => (
  <Ico name="at-sign">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
  </Ico>
);
const LifeBuoy = () => (
  <Ico name="life-buoy">
    <circle cx="12" cy="12" r="10" />
    <path d="m4.93 4.93 4.24 4.24" />
    <path d="m14.83 9.17 4.24-4.24" />
    <path d="m14.83 14.83 4.24 4.24" />
    <path d="m9.17 14.83-4.24 4.24" />
    <circle cx="12" cy="12" r="4" />
  </Ico>
);

export default function Footer() {
  /* Built from the insured roster, not typed: item 284, 1 Oct 2026. */
  const area = serviceAreaLine();

  return (
    <>
      <SectionDivider variant="slope" from="transparent" to="var(--surface-ink)" />
      <footer className="site-footer grained">
        <div className="container container--wide">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="footer-brand">
                <span className="footer-brand-mark" aria-hidden="true"><Motif variant="mark" /></span>
                Westpeak <span>Wellness</span>
              </div>
              {/* Was "with a {site.counsellor.title}" — singular, and pointed at
                  the founder's credential specifically. There have been two
                  Registered Clinical Counsellors here since 1 Sep 2026. */}
              <p className="footer-blurb">
                Online counselling with Registered Clinical Counsellors. {area}.
              </p>
              <ul className="footer-facts">
                {/* The registration number on every page rather than only the
                    two that discuss credentials. Somebody working out whether a
                    counselling site is real checks the footer, and with
                    testimonials and ratings ruled out by BCACC a number they
                    can look up is the strongest thing that can go there. */}
                <li>
                  <BadgeCheck />
                  <span>
                    {/* Linked 6 Sep 2026: the explainer had nine inbound links
                        while the phrase sat unlinked on every page. */}
                    {/* The canonical address. This pointed at the old URL, which
                        redirects — a site-wide internal link through a 308 on
                        all 295 pages, for the page that draws the most search
                        impressions of any on the site. Fixed 25 Sep 2026. */}
                    <Link prefetch={false} href="/resources/verify-a-counsellor-in-bc">Registered Clinical Counsellors</Link> ·{' '}
                    <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">
                      BCACC register<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </span>
                </li>
                <li><Landmark /><span>{area}</span></li>
                {/* Name and registered locality, from the one constant the
                    Organization JSON-LD, the vCard and /contact read (item 299). */}
                <li>
                  <MapPin />
                  <span>
                    {site.name} · <Link prefetch={false} href={REGISTERED_LOCALITY.hub}>{LOCALITY_LABEL}</Link> · {LOCALITY_VISIBLE_NOTE}
                  </span>
                </li>
              </ul>
              <div className="footer-social">
                {/* Renders only once NEXT_PUBLIC_PHONE is set — see lib/site.ts.
                    Not a crisis line: those live in the crisis block below,
                    which is why this one carries the practice name context. */}
                {/* Email first: the practice prefers it (item 299, 1 Oct 2026). */}
                <MailLink where="footer" className="footer-social-link">
                  <Mail /><span>{site.email}</span>
                </MailLink>
                {site.phone && (
                  <a href={`tel:${site.phoneTel}`} className="footer-social-link">
                    <Phone /><span>{site.phone}</span>
                  </a>
                )}
                <a href={site.instagramUrl} target="_blank" rel="noopener" className="footer-social-link">
                  <AtSign /><span>{site.instagram}</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>

            <nav className="footer-col" aria-labelledby="foot-svc">
              <h2 id="foot-svc">Services</h2>
              {services.slice(0, 5).map((s) => (
                <Link prefetch={false} key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>
              ))}
              <Link prefetch={false} href="/services" className="footer-more">All services →</Link>
            </nav>

            <nav className="footer-col" aria-labelledby="foot-read">
              <h2 id="foot-read">Read</h2>
              <Link prefetch={false} href="/faq">FAQ</Link>
              <Link prefetch={false} href="/search">Search</Link>
              <Link prefetch={false} href="/guides">Counselling Guides</Link>
              <Link prefetch={false} href="/compare">Compare Your Options</Link>
              <Link prefetch={false} href="/for">Who We Work With</Link>
              <Link prefetch={false} href="/resources">BC Resources</Link>
              <Link prefetch={false} href="/tools">Free Tools</Link>
              <Link prefetch={false} href="/glossary">Glossary</Link>
              <Link prefetch={false} href="/approaches">Approaches</Link>
              <Link prefetch={false} href="/punjabi" lang="pa">ਪੰਜਾਬੀ</Link>
              {/* The by-region index, added when the hub was built on 18 Aug and
                  missed here — the cluster it indexes was the least-linked on the
                  site partly because of this. */}
              <Link prefetch={false} href="/punjabi-counselling">Punjabi counselling by region</Link>
              <Link prefetch={false} href="/tagalog-counselling">Tagalog-speaking counselling</Link>
              <Link prefetch={false} href="/tagalog" lang="tl" hrefLang="tl">Tagalog</Link>
            </nav>

            <nav className="footer-col" aria-labelledby="foot-practice">
              <h2 id="foot-practice">Practice</h2>
              <Link prefetch={false} href="/about">About us</Link>
              <Link prefetch={false} href="/practitioners">Our counsellors</Link>
              <Link prefetch={false} href="/pricing">Fees &amp; Insurance</Link>
              <Link prefetch={false} href="/faq">FAQ</Link>
              <Link prefetch={false} href="/reviews">Reviews &amp; references</Link>
              <Link prefetch={false} href="/refer">Passing it on</Link>
              <Link prefetch={false} href="/refer/counsellors">For counsellors</Link>
              <Link prefetch={false} href="/online-counselling">Areas Served in BC</Link>
              <Link prefetch={false} href="/contact">Contact</Link>
              <Link prefetch={false} href={site.portalPath} className="footer-more">Client Portal &rarr;</Link>
            </nav>
          </div>

          {/* The numbers were nested <strong> inside <a>, and a min-height rule
              meant for the footer link columns was reaching them — each number
              became its own line and the closing full stop was orphaned on a
              line by itself. The emphasis now lives on the anchor, which is
              what should carry it anyway. */}
          {/* NATIONAL NUMBERS ONLY, DELIBERATELY.
              This block used to name the BC Mental Health Support Line on every
              page. That was right while the site served only BC. With Alberta
              pages published it put a BC-only number in the footer of a page
              written for somebody in Calgary, where 310-6789 does not reach — a
              crisis number that does not connect is worse than none, because it
              costs the attempt.

              A province-aware footer was tried first and does not work: the
              footer is prerendered into every static page, so a client-side
              path check resolves to nothing at build time and the BC number
              shipped anyway. Rather than make the whole footer dynamic for one
              line, the footer now carries only what is true everywhere in
              Canada. The province-correct numbers live in the body of every
              regional page (components/CrisisBlock.tsx) and on the BC
              directory page. */}
          <div className="footer-crisis">
            <LifeBuoy />
            <p>
              <strong>Not a crisis service.</strong> If you are in crisis, call or text{' '}
              <a href="tel:988">9-8-8</a>, the Suicide Crisis Helpline, anywhere in Canada,
              24/7. In immediate danger, call <a href="tel:911">9-1-1</a>.{' '}
              <Link prefetch={false} href="/resources/bc-crisis-and-support-directory">
                Crisis and support directory&nbsp;&rarr;
              </Link>
            </p>
          </div>

          <nav className="footer-legal" aria-label="Policies">
            <Link prefetch={false} href="/standards">Standards &amp; accountability</Link>
            <Link prefetch={false} href="/editorial-policy">Editorial policy</Link>
            <Link prefetch={false} href="/privacy">Privacy &amp; confidentiality</Link>
            <Link prefetch={false} href="/accessibility">Accessibility</Link>
            {/* Staff entrance. Discreet by placement rather than by secrecy —
              * the gate is a signed session, so a visible link costs nothing.
              * nofollow because there is nothing here for a crawler to index. */}
            <Link prefetch={false} href="/admin" rel="nofollow" className="footer-admin">Admin</Link>
          </nav>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {site.name} · Registered Clinical Counsellors</span>
            <span>{area}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
