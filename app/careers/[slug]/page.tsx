import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { orgRef } from '@/lib/schema';
import { jobs, getJob, jobDescriptionHtml, inlineHtml, APPLY_EMAIL } from '@/lib/careers';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import ApplyBlock from '@/components/ApplyBlock';
import { ogBase } from '@/lib/og-meta';

/* A single job posting, on its own URL.
 *
 * One posting per page is a hard Google for Jobs requirement — a page carrying
 * two JobPosting nodes is ineligible, which is why the hub at /careers links
 * here rather than inlining the role.
 */

export const dynamic = 'force-static';

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const job = getJob(params.slug);
  if (!job) return {};
  const url = `${site.domain}/careers/${job.slug}`;
  return {
    title: { absolute: job.seoTitle },
    description: job.metaDescription,
    alternates: { canonical: url },
    openGraph: { ...ogBase(`/careers/${job.slug}`), title: job.seoTitle, description: job.metaDescription, type: 'article' },
  };
}

export default function JobPage({ params }: { params: { slug: string } }) {
  const job = getJob(params.slug);
  if (!job) notFound();

  const url = `${site.domain}/careers/${job.slug}`;
  const expired = job.validThrough < new Date().toISOString().slice(0, 10);

  /* JobPosting, to Google's documented shape.
   *
   * `jobLocationType: TELECOMMUTE` plus `applicantLocationRequirements` is the
   * correct pairing for a fully remote role — supplying a jobLocation address
   * for a practice with no premises would be the same misstatement the
   * directory listings are careful to avoid.
   *
   * `validThrough` is not optional in practice: without it a posting is treated
   * as indefinitely live, and a stale one costs more than it earns. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${url}#jobposting`,
    title: job.title,
    description: jobDescriptionHtml(job),
    identifier: {
      '@type': 'PropertyValue',
      name: site.name,
      value: job.identifier,
    },
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
      sameAs: site.domain,
      url: site.domain,
      logo: `${site.domain}/img/logo.svg`,
      ...orgRef,
    },
    jobLocationType: 'TELECOMMUTE',
    /* Country, not State.
     *
     * Google's own documentation gives `{"@type": "State", "name": "Michigan,
     * USA"}` as the example for a region-restricted remote role — and the Rich
     * Results Test then rejects it with "Invalid object type for field
     * applicantLocationRequirements". The docs and the validator disagree, and
     * the validator is the one that decides eligibility.
     *
     * Country is unambiguously accepted, and it is true: an applicant must be
     * in Canada. The narrower requirement — BC registration with the BCACC — is
     * not weakened by this, because it is stated in the title, the description
     * and the `qualifications` field, all of which Google reads. Precision that
     * costs eligibility is not precision worth having. */
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Canada',
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: job.salary.unit,
      },
    },
    occupationalCategory: job.occupationalCategory,
    skills: job.skills.join(', '),
    qualifications: job.qualifications,
    responsibilities: job.responsibilities,
    industry: 'Mental Health Care',
    workHours: job.hoursLabel,
    directApply: true,
    url,
  };

  const applySubject = `Application — ${job.title}`;
  const applyBody = [
    'Hello,',
    '',
    'I would like to apply for the Registered Clinical Counsellor role.',
    '',
    'BCACC registration number:',
    'Hours a week I am looking for:',
    'Evening availability:',
    '',
    'How I actually work — how I decide what to use, and what I do when something is not working:',
    '',
    '',
    '--',
    'My CV is attached. (If attaching is awkward, a Drive or Dropbox link is',
    'completely fine — I am not fussy about the format.)',
  ].join('\n');

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Join the practice</p>
          <h1>{job.title}</h1>
          <p className="lede">{job.summary}</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <a className="btn btn--primary" href="#apply">Apply for this role</a>
            <Link className="btn btn--ghost" href="/about">About the practice</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose job-page">
          {/* Schema on, unlike the other templates: this page emits JobPosting
              rather than its own breadcrumb node, and BreadcrumbList is
              complementary to it rather than a competing rich-result type. A
              validation pass caught this page shipping visible crumbs with no
              markup behind them. */}
          <Breadcrumbs
            trail={[
              { name: 'Careers', path: '/careers' },
              { name: job.title, path: `/careers/${job.slug}` },
            ]}
          />

          {expired && (
            <p className="crisis" role="status">
              <strong>This posting has closed.</strong> It is kept here for reference. If you
              are an RCC interested in working together, you are still welcome to write to{' '}
              <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a>.
            </p>
          )}

          {/* Two columns on desktop, one on mobile. The rail carries the facts
              and the apply button and sticks as you read, so the decision and
              the action are never more than a glance apart — on a long posting
              the CTA otherwise exists only at the very top and the very
              bottom, and the middle is where people decide. */}
          <div className="job-layout">
            <aside className="job-rail" aria-label="Role summary">
              <dl className="job-facts">
                <div><dt>Rate</dt><dd>{job.salaryLabel}</dd></div>
                <div><dt>Hours</dt><dd>{job.hoursLabel}</dd></div>
                <div><dt>Type</dt><dd>{job.employmentLabel}</dd></div>
                <div><dt>Location</dt><dd>{job.locationLabel}</dd></div>
              </dl>
              <a className="btn btn--primary job-rail-cta" href="#apply">
                Apply for this role
              </a>
              <p className="job-rail-note">
                Closes{' '}
                {new Date(job.validThrough).toLocaleDateString('en-CA', {
                  month: 'long', day: 'numeric',
                })}
                . No cover letter needed.
              </p>
            </aside>

            <div className="job-body">
              {job.blocks.map((b, i) => {
                if ('h' in b) return <h2 key={i}>{b.h}</h2>;
                if ('ul' in b) {
                  return (
                    <ul key={i}>
                      {b.ul.map((li, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: inlineHtml(li) }} />
                      ))}
                    </ul>
                  );
                }
                if ('p' in b) {
                  return <p key={i} dangerouslySetInnerHTML={{ __html: inlineHtml(b.p) }} />;
                }
                if ('note' in b) return <p key={i} className="job-note">{b.note}</p>;
                return null;
              })}
            </div>
          </div>

          <h2 id="apply">How to apply</h2>
          <p>
            Email <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a> with:
          </p>
          <ol>
            <li>Your CV — plain is fine</li>
            <li>Your BCACC registration number</li>
            <li>
              A few paragraphs on <strong>how you actually work</strong>. Not a modalities list.
              How you decide what to use, and what you do when something is not working. That is
              the part I will read twice.
            </li>
            <li>Roughly how many hours a week you are after, and whether you can do evenings</li>
          </ol>
          <p>
            <strong>No formal cover letter required.</strong> An honest email is better than a
            polished one, and I would rather hear how you think than read something you wrote for
            someone else&rsquo;s posting.
          </p>
          <p>
            I read every application myself and I reply to all of them, including the ones that
            are a no. Being left to wonder is a rubbish way to be treated and I am not going to
            do it. If you are on the fence about whether you are a fit, send it anyway — the
            worst outcome is a friendly no.
          </p>
          <p>
            Counsellors of all backgrounds are welcome here. If any part of this process needs
            adjusting for you, just say so in your email; it is not a problem and it will not be
            held against you.
          </p>

          <ApplyBlock email={APPLY_EMAIL} subject={applySubject} body={applyBody} />

          <p className="muted" style={{ marginTop: 24, fontSize: '0.9rem' }}>
            Posted {new Date(job.datePosted).toLocaleDateString('en-CA', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
            {' · '}Applications close {new Date(job.validThrough).toLocaleDateString('en-CA', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
            {' · '}Reference {job.identifier}
          </p>
        </div>
      </section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
