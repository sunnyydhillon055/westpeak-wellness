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
              Online counselling across British Columbia with {site.counsellor.name}, {site.counsellor.credentials}. Therapy in {site.languages}.
            </p>
            <p style={{ marginTop: 12 }}><a href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
          <div>
            <h4>Services</h4>
            {services.slice(0, 6).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>
            ))}
          </div>
          <div>
            <h4>Practice</h4>
            <Link href="/about">About Aman</Link>
            <Link href="/services">All Services</Link>
            <Link href="/pricing">Fees & Insurance</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <a href={site.instagramUrl} target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Westpeak Wellness · {site.counsellor.name}, {site.counsellor.credentials}</span>
          <span>Not a crisis service · In crisis, call or text 9-8-8</span>
        </div>
      </div>
    </footer>
  );
}
