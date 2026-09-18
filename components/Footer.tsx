import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import Motif from '@/components/brand/Motif';
import SectionDivider from '@/components/brand/SectionDivider';
import { TRUST_ICONS } from '@/lib/icon-map';
import { Mail, AtSign, LifeBuoy, Phone } from 'lucide-react';

export default function Footer() {
  const Credential = TRUST_ICONS.credential;
  const Region = TRUST_ICONS.region;
  const Langs = TRUST_ICONS.languages;

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
                Online counselling with Registered Clinical Counsellors. {site.serviceArea}.
              </p>
              <ul className="footer-facts">
                {/* The registration number on every page rather than only the
                    two that discuss credentials. Somebody working out whether a
                    counselling site is real checks the footer, and with
                    testimonials and ratings ruled out by BCACC a number they
                    can look up is the strongest thing that can go there. */}
                <li>
                  <Credential aria-hidden="true" strokeWidth={1.7} />
                  <span>
                    {/* Linked 6 Sep 2026: the explainer had nine inbound links
                        while the phrase sat unlinked on every page. */}
                    <Link prefetch={false} href="/resources/what-is-a-registered-clinical-counsellor">Registered Clinical Counsellors</Link> ·{' '}
                    <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">
                      BCACC register
                    </a>
                  </span>
                </li>
                <li><Region aria-hidden="true" strokeWidth={1.7} /><span>{site.serviceArea}</span></li>
              </ul>
              <div className="footer-social">
                {/* Renders only once NEXT_PUBLIC_PHONE is set — see lib/site.ts.
                    Not a crisis line: those live in the crisis block below,
                    which is why this one carries the practice name context. */}
                {site.phone && (
                  <a href={`tel:${site.phoneTel}`} className="footer-social-link">
                    <Phone aria-hidden="true" strokeWidth={1.7} /><span>{site.phone}</span>
                  </a>
                )}
                <a href={`mailto:${site.email}`} className="footer-social-link">
                  <Mail aria-hidden="true" strokeWidth={1.7} /><span>{site.email}</span>
                </a>
                <a href={site.instagramUrl} target="_blank" rel="noopener" className="footer-social-link">
                  <AtSign aria-hidden="true" strokeWidth={1.7} /><span>{site.instagram}</span>
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
            <LifeBuoy aria-hidden="true" strokeWidth={1.7} />
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
            <span>{site.serviceArea}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
