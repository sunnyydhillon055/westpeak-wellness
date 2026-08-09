import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import Motif from '@/components/brand/Motif';
import SectionDivider from '@/components/brand/SectionDivider';
import { TRUST_ICONS } from '@/lib/icon-map';
import { Mail, AtSign, LifeBuoy } from 'lucide-react';

export default function Footer() {
  const Credential = TRUST_ICONS.credential;
  const Region = TRUST_ICONS.region;
  const Langs = TRUST_ICONS.languages;
  const Hours = TRUST_ICONS.hours;

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
              <p className="footer-blurb">
                Online counselling across British Columbia with a {site.counsellor.title}.
              </p>
              <ul className="footer-facts">
                <li><Credential aria-hidden="true" strokeWidth={1.7} /><span>{site.counsellor.credentials} · BCACC registered</span></li>
                <li><Region aria-hidden="true" strokeWidth={1.7} /><span>{site.serviceArea}</span></li>
                <li><Hours aria-hidden="true" strokeWidth={1.7} /><span>{site.hours}</span></li>
              </ul>
              <div className="footer-social">
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
                <Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>
              ))}
              <Link href="/services" className="footer-more">All services →</Link>
            </nav>

            <nav className="footer-col" aria-labelledby="foot-read">
              <h2 id="foot-read">Read</h2>
              <Link href="/guides">Counselling Guides</Link>
              <Link href="/compare">Compare Your Options</Link>
              <Link href="/for">Who We Work With</Link>
              <Link href="/resources">BC Resources</Link>
              <Link href="/glossary">Glossary</Link>
              <Link href="/approaches">Approaches</Link>
            </nav>

            <nav className="footer-col" aria-labelledby="foot-practice">
              <h2 id="foot-practice">Practice</h2>
              <Link href="/about">About the Counsellor</Link>
              <Link href="/pricing">Fees &amp; Insurance</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/online-counselling">Areas Served in BC</Link>
              <Link href="/contact">Contact</Link>
              <Link href={site.portalPath} className="footer-more">Client Portal &rarr;</Link>
            </nav>
          </div>

          <div className="footer-crisis">
            <LifeBuoy aria-hidden="true" strokeWidth={1.7} />
            <p>
              <strong>Not a crisis service.</strong> If you are in crisis, call or text{' '}
              <a href="tel:988"><strong>9-8-8</strong></a> (Canada, 24/7), or{' '}
              <a href="tel:3106789"><strong>310-6789</strong></a> for BC Mental
              Health Support. In immediate danger, call{' '}
              <a href="tel:911"><strong>9-1-1</strong></a>.{' '}
              <Link href="/resources/bc-crisis-and-support-directory">Full BC directory →</Link>
            </p>
          </div>

          <nav className="footer-legal" aria-label="Policies">
            <Link href="/standards">Standards &amp; accountability</Link>
            <Link href="/editorial-policy">Editorial policy</Link>
            <Link href="/privacy">Privacy &amp; confidentiality</Link>
            <Link href="/accessibility">Accessibility</Link>
            {/* Staff entrance. Discreet by placement rather than by secrecy —
              * the gate is a signed session, so a visible link costs nothing.
              * nofollow because there is nothing here for a crawler to index. */}
            <Link href="/admin" rel="nofollow" className="footer-admin">Admin</Link>
          </nav>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {site.name} · {site.counsellor.title}</span>
            <span>{site.serviceArea}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
