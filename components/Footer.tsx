import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Westpeak <span>Wellness</span></div>
            <p style={{ maxWidth: '32ch', color: '#a9b6c4' }}>
              Online counselling across British Columbia with a {site.counsellor.title}. Therapy in {site.languages}.
            </p>
            <p style={{ marginTop: 12 }}><a href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
          <div>
            <h2>Services</h2>
            {services.slice(0, 6).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>
            ))}
          </div>
          <div>
            <h2>Practice</h2>
            <Link href="/about">About the Counsellor</Link>
            <Link href="/services">All Services</Link>
            <Link href="/approaches">Counselling Approaches</Link>
            <Link href="/guides">Counselling Guides</Link>
            <Link href="/compare">Compare Your Options</Link>
            <Link href="/for">Who We Work With</Link>
            <Link href="/resources">BC Resources</Link>
            <Link href="/online-counselling">Areas Served in BC</Link>
            <Link href="/pricing">Fees & Insurance</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href={site.bookingPath}>Book a Consultation</Link>
            <a href={site.instagramUrl} target="_blank" rel="noopener">Instagram</a>
          </div>
          <div>
            <h2>Trust &amp; transparency</h2>
            <Link href="/standards">Standards &amp; Accountability</Link>
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/privacy">Privacy &amp; Confidentiality</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/glossary">Counselling Glossary</Link>
            <Link href="/resources/bc-crisis-and-support-directory">Crisis &amp; Support in BC</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Westpeak Wellness · {site.counsellor.title}</span>
          <span>Not a crisis service · In crisis, call or text 9-8-8</span>
        </div>
      </div>
    </footer>
  );
}
