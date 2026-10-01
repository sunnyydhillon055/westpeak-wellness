import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { readCatalog } from '@/lib/cliniko-catalog';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { getAudience } from '@/lib/audiences';
import { hrGlance } from '@/lib/audiences-more4';

/* Hourly, as /refer/handout: the fees on the sheet are read from the
   catalogue, and a price change reaches the next print without a deploy. */
export const revalidate = 3600;

const PATH = '/for/employers-and-hr/one-pager';
const TITLE = 'Counselling for your team: a one-page summary for HR';
const DESC =
  'A printable page for HR and benefits leads in BC: the counsellors, fees, the free consultation, what a receipt carries, plan wording and confidentiality.';

export const metadata: Metadata = {
  title: { absolute: `One-page summary for HR | ${site.name}` },
  description: DESC,
  alternates: { canonical: `${site.domain}${PATH}` },
  openGraph: { ...ogBase(PATH), title: `One-page summary for HR | ${site.name}`, description: DESC, url: `${site.domain}${PATH}` },
};

/* THE EMPLOYER ONE-PAGER — added 1 Oct 2026.
 *
 * The clinic and doctor sheets exist (/refer/handout, /refer/doctor); an HR
 * lead had nothing to print or attach to a benefits pack. This is the "At a
 * glance for HR" list from the employer page, built by the same function
 * (hrGlance in lib/audiences-more4.ts), so the page and the paper cannot say
 * different things. Fees and the consultation come from the Cliniko
 * catalogue; where sessions are possible comes from the insurance-gated
 * roster. No hours, no registration numbers, no outcomes.
 *
 * PRINT. The print rules are in the page itself, as on /refer/handout: the
 * hero and everything marked .no-print drop away, and the sheet fits one
 * Letter or A4 page. Links carry utm_source=hr, which marks the sheet and
 * never the person. */
export default async function EmployerOnePager() {
  const glance = hrGlance(await readCatalog());
  const host = site.domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const updated = getAudience('employers-and-hr')?.updated;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPage({ path: PATH, name: TITLE, description: DESC, updated })),
        }}
      />
      {/* Page-local, as on /refer/handout: app/premium.css is inlined into
          every page's HTML and the perf budget measured +2.5% CSS with these
          rules there, for one printable page. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.hr-sheet{margin:8px 0 0}.hr-sheet-name{font-weight:700;font-size:1.1em;margin:0 0 10px}
.hr-sheet-list{margin:0}.hr-sheet-list>div{padding:8px 0;border-top:1px solid var(--line)}
.hr-sheet-list dt{font-weight:600;color:var(--ink)}.hr-sheet-list dd{margin:2px 0 0}.hr-sheet-foot{margin:10px 0 0;font-size:.95em}
@media print{.hr-onepager .section{padding:0!important;margin:0!important}.hr-onepager .hero{display:none!important}
.hr-sheet{border:1pt solid #000!important;padding:8mm!important;font-size:10pt;break-inside:avoid}.hr-sheet-list>div{padding:4pt 0}}`,
        }}
      />
      <div className="hr-onepager">
        <section className="hero no-print" style={{ paddingBottom: 32 }}>
          <div className="container container--narrow">
            <p className="eyebrow">For employers and HR</p>
            <h1>{TITLE}</h1>
            <p className="lede">
              The facts a benefits pack or a manager’s toolkit needs, on one sheet. Print it, save
              it as a PDF, or attach it to an email.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 24 }}>
          <div className="container container--narrow">
            <div className="no-print">
              <Breadcrumbs
                trail={[
                  { name: 'Who we work with', path: '/for' },
                  { name: 'Employers and HR', path: '/for/employers-and-hr' },
                  { name: 'One-page summary', path: PATH },
                ]}
              />
              <p className="prose">
                Press Ctrl&nbsp;+&nbsp;P (&#8984;&nbsp;+&nbsp;P on a Mac) and print, or choose
                &ldquo;Save as PDF&rdquo;. The page around the summary drops away. The longer
                version, with a note a manager can send one person and an email for your broker,
                is <Link href="/for/employers-and-hr?utm_source=hr">the page for employers and HR</Link>.
              </p>
            </div>

            <div className="hr-sheet callout">
              <p className="hr-sheet-name">{site.name}: counselling for your team, at a glance</p>
              <dl className="hr-sheet-list">
                {glance.map((g) => (
                  <div key={g.term}>
                    <dt>{g.term}</dt>
                    <dd>{g.detail}</dd>
                  </div>
                ))}
              </dl>
              <p className="hr-sheet-foot">
                For managers: point, do not fix. Do not ask what it is about, do not follow up on
                whether someone booked, and do not book for them.
              </p>
              <p className="hr-sheet-foot">
                Employees book at <Link href="/book?utm_source=hr">{host}/book</Link>. HR questions
                by email: <a href={`mailto:${site.email}`}>{site.email}</a>. More for employers:{' '}
                <Link href="/for/employers-and-hr?utm_source=hr">{host}/for/employers-and-hr</Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="no-print">
        <CtaBand bookHref="/book?utm_source=hr" />
      </div>
    </>
  );
}
